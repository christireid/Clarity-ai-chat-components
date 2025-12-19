import { useState, useCallback, useRef } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  tokens?: number
}

export interface StreamingChatOptions {
  /** API endpoint for chat */
  api?: string
  /** Called when streaming starts */
  onStart?: () => void
  /** Called for each chunk of content */
  onChunk?: (content: string) => void
  /** Called when streaming completes */
  onFinish?: (content: string) => void
  /** Called on error */
  onError?: (error: Error) => void
}

/**
 * Custom hook for handling streaming chat with SSE.
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading, error } = useStreamingChat({
 *   api: '/api/chat',
 *   onFinish: (content) => console.log('Complete:', content),
 * })
 *
 * // Send a message
 * await sendMessage('Hello!')
 * ```
 */
export function useStreamingChat(options: StreamingChatOptions = {}) {
  const { api = '/api/chat', onStart, onChunk, onFinish, onError } = options

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
      }

      // Add user message
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)
      onStart?.()

      // Add placeholder for assistant response
      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ])

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantContent = ''

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.type === 'text-delta' && parsed.content) {
                  assistantContent += parsed.content
                  onChunk?.(parsed.content)
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: assistantContent }
                        : m
                    )
                  )
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }

        onFinish?.(assistantContent)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // User cancelled, not an error
          return
        }
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        onError?.(error)
        // Remove placeholder on error
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [api, isLoading, messages, onStart, onChunk, onFinish, onError]
  )

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    cancel,
    clearMessages,
  }
}
