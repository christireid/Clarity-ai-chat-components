'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { useAutoScroll } from '@clarity-chat/react/internal'
import type { ChatMessage, ThinkingStep, Conversation } from './types'
import { generateId } from './types'

function createConversation(title = 'New Chat'): Conversation {
  return {
    id: generateId(),
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export interface UseDemoChatOptions {
  systemPrompt: string
  apiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
  enableThinking?: boolean
  thinkingBudget?: number
  /** Called when a complete assistant message is available */
  onMessageComplete?: (message: ChatMessage) => void
}

export interface UseDemoChatReturn {
  // Messages
  messages: ChatMessage[]
  updateMessages: (msgs: ChatMessage[]) => void

  // Streaming state
  isStreaming: boolean
  isThinking: boolean
  streamingText: string
  activeThinking: ThinkingStep[]

  // Conversations
  conversations: Conversation[]
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  activeConvId: string
  switchConversation: (id: string) => void
  createNewConversation: () => Conversation

  // Actions
  sendMessage: (text: string) => Promise<void>
  cancelStreaming: () => void
  regenerateMessage: (msgId: string) => void
  deleteMessage: (msgId: string) => void
  editAndResend: (msgId: string, newContent: string) => void

  // Scroll
  scrollRef: React.RefObject<HTMLDivElement | null>

  // Token tracking
  tokenUsage: { input: number; output: number; total: number }

  // Error
  error: string | null
  clearError: () => void
}

export function useDemoChat(options: UseDemoChatOptions): UseDemoChatReturn {
  const {
    systemPrompt,
    apiKey,
    model,
    temperature,
    maxTokens,
    enableThinking = false,
    thinkingBudget = 1024,
    onMessageComplete,
  } = options

  // Conversation state
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    createConversation(),
  ])
  const [activeConvId, setActiveConvId] = useState(
    () => conversations[0]?.id || ''
  )

  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [activeThinking, setActiveThinking] = useState<ThinkingStep[]>([])
  const [error, setError] = useState<string | null>(null)
  const [tokenUsage, setTokenUsage] = useState({
    input: 0,
    output: 0,
    total: 0,
  })

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null)

  // Current conversation and messages
  const conversation = useMemo(
    () => conversations.find((c) => c.id === activeConvId),
    [conversations, activeConvId]
  )
  const messages = useMemo(() => conversation?.messages || [], [conversation])

  const updateMessages = useCallback(
    (msgs: ChatMessage[]) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConvId) return c
          const lastUserMsg = msgs.find((m) => m.role === 'user')
          return {
            ...c,
            messages: msgs,
            title:
              c.messages.length === 0 && lastUserMsg
                ? lastUserMsg.content.slice(0, 40) +
                  (lastUserMsg.content.length > 40 ? '...' : '')
                : c.title,
            updatedAt: new Date(),
          }
        })
      )
    },
    [activeConvId]
  )

  // Auto-scroll
  const { scrollRef } = useAutoScroll({
    dependencies: [messages, streamingText, activeThinking],
  })

  const cancelStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setIsStreaming(false)
    setIsThinking(false)
    setStreamingText('')
    setActiveThinking([])
  }, [])

  const switchConversation = useCallback(
    (id: string) => {
      cancelStreaming()
      setActiveConvId(id)
      setError(null)
    },
    [cancelStreaming]
  )

  const createNewConversationFn = useCallback(() => {
    cancelStreaming()
    const c = createConversation()
    setConversations((prev) => [c, ...prev])
    setActiveConvId(c.id)
    setError(null)
    return c
  }, [cancelStreaming])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return

      if (!apiKey) {
        setError('Enter your API key above to start chatting.')
        return
      }

      setError(null)

      // Create user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
        status: 'sent',
      }
      const currentMessages = [...messages, userMessage]
      updateMessages(currentMessages)

      // Start streaming
      setIsThinking(enableThinking)
      setIsStreaming(true)
      setStreamingText('')
      setActiveThinking([])

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      let fullText = ''

      try {
        // Prepare messages for API
        const apiMessages = currentMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const response = await fetch('/api/advanced-demos/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            systemPrompt,
            model,
            temperature,
            maxTokens,
            apiKey,
            enableThinking,
            thinkingBudget,
          }),
          signal: abortController.signal,
        })

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: 'Request failed' }))
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let thinkingText = ''
        const thinkingSteps: ThinkingStep[] = []
        let usageInput = 0
        let usageOutput = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split('\n\n')
          buffer = parts.pop()!

          for (const part of parts) {
            const lines = part.split('\n')
            let eventType = ''
            let eventData = ''

            for (const line of lines) {
              if (line.startsWith('event: ')) eventType = line.slice(7)
              if (line.startsWith('data: ')) eventData = line.slice(6)
            }

            if (!eventType || !eventData) continue

            try {
              const data = JSON.parse(eventData)

              switch (eventType) {
                case 'thinking': {
                  thinkingText += data.content
                  // Split thinking into steps on double-newlines
                  const paragraphs = thinkingText.split(/\n\n+/)
                  const newSteps = paragraphs
                    .map((p, i) => ({
                      id: `think-${i}`,
                      content: p.trim(),
                      timestamp: new Date(),
                    }))
                    .filter((s) => s.content)
                  thinkingSteps.length = 0
                  thinkingSteps.push(...newSteps)
                  setActiveThinking([...thinkingSteps])
                  break
                }

                case 'text': {
                  setIsThinking(false)
                  fullText += data.content
                  setStreamingText(fullText)
                  break
                }

                case 'usage': {
                  usageInput += data.input_tokens || 0
                  usageOutput += data.output_tokens || 0
                  break
                }

                case 'error': {
                  throw new Error(data.message)
                }
              }
            } catch (e) {
              if (e instanceof Error && e.message !== 'done') throw e
            }
          }
        }

        // Create assistant message
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: fullText,
          timestamp: new Date(),
          thinking: thinkingSteps.length > 0 ? [...thinkingSteps] : undefined,
          status: 'delivered',
        }
        updateMessages([...currentMessages, assistantMessage])

        setTokenUsage((prev) => ({
          input: prev.input + usageInput,
          output: prev.output + usageOutput,
          total: prev.total + usageInput + usageOutput,
        }))

        onMessageComplete?.(assistantMessage)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // User cancelled — save partial response
          if (fullText) {
            const partialMessage: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: fullText,
              timestamp: new Date(),
              status: 'delivered',
            }
            updateMessages([...currentMessages, partialMessage])
          }
          return
        }
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
      } finally {
        abortControllerRef.current = null
        setIsStreaming(false)
        setIsThinking(false)
        setStreamingText('')
        setActiveThinking([])
      }
    },
    [
      apiKey,
      isStreaming,
      messages,
      updateMessages,
      systemPrompt,
      model,
      temperature,
      maxTokens,
      enableThinking,
      thinkingBudget,
      onMessageComplete,
    ]
  )

  const deleteMessage = useCallback(
    (msgId: string) => {
      updateMessages(messages.filter((m) => m.id !== msgId))
    },
    [messages, updateMessages]
  )

  const regenerateMessage = useCallback(
    (msgId: string) => {
      const idx = messages.findIndex((m) => m.id === msgId)
      if (idx > 0 && messages[idx - 1]?.role === 'user') {
        const userContent = messages[idx - 1].content
        updateMessages(messages.slice(0, idx))
        // Use setTimeout to let state settle before re-sending
        setTimeout(() => sendMessage(userContent), 50)
      }
    },
    [messages, updateMessages, sendMessage]
  )

  const editAndResend = useCallback(
    (msgId: string, newContent: string) => {
      const idx = messages.findIndex((m) => m.id === msgId)
      if (idx === -1) return
      updateMessages(
        messages.slice(0, idx).concat({ ...messages[idx], content: newContent })
      )
      setTimeout(() => sendMessage(newContent), 50)
    },
    [messages, updateMessages, sendMessage]
  )

  return {
    messages,
    updateMessages,
    isStreaming,
    isThinking,
    streamingText,
    activeThinking,
    conversations,
    setConversations,
    activeConvId,
    switchConversation,
    createNewConversation: createNewConversationFn,
    sendMessage,
    cancelStreaming,
    regenerateMessage,
    deleteMessage,
    editAndResend,
    scrollRef,
    tokenUsage,
    error,
    clearError: useCallback(() => setError(null), []),
  }
}
