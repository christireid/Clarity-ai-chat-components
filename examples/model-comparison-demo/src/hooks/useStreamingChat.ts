import { useState, useCallback } from 'react'
import type { ChatMessage, ModelConfig } from '@clarity-chat/react'

interface StreamChunk {
  type: 'token' | 'tool_call' | 'thinking' | 'citation' | 'done' | 'error'
  content?: string
  toolCall?: any
  citation?: any
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  cost?: number
  duration?: number
  error?: string
}

interface UseStreamingChatOptions {
  onToken?: (token: string) => void
  onComplete?: (data: { usage: any; cost: number; duration: number }) => void
  onError?: (error: string) => void
}

export function useStreamingChat(options: UseStreamingChatOptions = {}) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const stream = useCallback(
    async (messages: ChatMessage[], config: ModelConfig) => {
      // Create abort controller for cancellation
      const controller = new AbortController()
      setAbortController(controller)
      setIsStreaming(true)
      setError(null)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages, config }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        if (!response.body) {
          throw new Error('No response body')
        }

        // Read the SSE stream
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          // Decode the chunk
          buffer += decoder.decode(value, { stream: true })

          // Process complete SSE messages
          const lines = buffer.split('\n\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6)) as StreamChunk

                switch (data.type) {
                  case 'token':
                    if (data.content && options.onToken) {
                      options.onToken(data.content)
                    }
                    break

                  case 'done':
                    if (options.onComplete && data.usage && data.cost !== undefined && data.duration !== undefined) {
                      options.onComplete({
                        usage: data.usage,
                        cost: data.cost,
                        duration: data.duration,
                      })
                    }
                    break

                  case 'error':
                    if (data.error) {
                      setError(data.error)
                      if (options.onError) {
                        options.onError(data.error)
                      }
                    }
                    break

                  // Handle other chunk types (tool_call, thinking, citation)
                  default:
                    break
                }
              } catch (parseError) {
                console.error('Failed to parse SSE message:', parseError)
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Stream aborted by user')
        } else {
          const errorMessage = err.message || 'An error occurred during streaming'
          setError(errorMessage)
          if (options.onError) {
            options.onError(errorMessage)
          }
        }
      } finally {
        setIsStreaming(false)
        setAbortController(null)
      }
    },
    [options]
  )

  const cancel = useCallback(() => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsStreaming(false)
    }
  }, [abortController])

  return {
    stream,
    cancel,
    isStreaming,
    error,
  }
}
