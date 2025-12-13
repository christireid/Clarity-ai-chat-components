'use client'

/**
 * useHeroChat - Main state management hook for Hero Chat
 *
 * Uses library hooks: useLocalStorage, useClipboard, useAutoScroll,
 * useKeyboardShortcuts, useVoiceInput, useRetryWithBackoff
 */

import { useState, useCallback, useRef, useMemo } from 'react'
import { useLocalStorage } from '@clarity-chat/react'
import { useClipboard } from '@clarity-chat/react'
import { useRetryWithBackoff } from '@clarity-chat/react'
import { useVoiceInput } from '@clarity-chat/react'

// ============================================================================
// TYPES
// ============================================================================

export interface ToolResult {
  id: string
  name: string
  data: Record<string, unknown>
  ui: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  toolResults?: ToolResult[]
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  type: 'image' | 'file'
  name: string
  url: string
  mimeType: string
  size: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export type Theme = 'light' | 'dark' | 'system'

export type SSEEvent =
  | { type: 'text-delta'; content: string }
  | {
      type: 'tool-call'
      id: string
      name: string
      args: Record<string, unknown>
    }
  | { type: 'tool-result'; id: string; name: string; data: unknown; ui: string }
  | { type: 'error'; message: string }
  | { type: 'done'; usage?: { promptTokens: number; completionTokens: number } }

export interface UseHeroChatReturn {
  // Conversations
  conversations: Conversation[]
  currentConversation: Conversation | null
  createConversation: () => void
  switchConversation: (id: string) => void
  deleteConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void

  // Messages
  messages: Message[]
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>
  regenerateMessage: (messageId: string) => Promise<void>
  editMessage: (messageId: string, content: string) => Promise<void>
  deleteMessage: (messageId: string) => void
  clearMessages: () => void

  // Streaming state
  isStreaming: boolean
  cancelStream: () => void

  // Voice input
  isRecording: boolean
  voiceTranscript: string
  startVoiceInput: () => void
  stopVoiceInput: () => void
  isVoiceSupported: boolean

  // Clipboard
  copyMessage: (content: string) => Promise<void>
  hasCopied: boolean

  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void

  // Token tracking
  tokenUsage: { prompt: number; completion: number; total: number }
  estimatedCost: number

  // Error state
  error: string | null
  clearError: () => void

  // Retry state
  isRetrying: boolean
  retryAttempt: number
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY_CONVERSATIONS = 'hero-chat-conversations'
const STORAGE_KEY_CURRENT_ID = 'hero-chat-current-id'
const STORAGE_KEY_THEME = 'hero-chat-theme'

// Gemini pricing per 1M tokens
const GEMINI_PRICING = {
  input: 0.075, // gemini-1.5-flash
  output: 0.3,
}

// ============================================================================
// HOOK
// ============================================================================

export function useHeroChat(): UseHeroChatReturn {
  // -------------------------------------------------------------------------
  // Storage - Conversations
  // -------------------------------------------------------------------------
  const [conversations, setConversations] = useLocalStorage<Conversation[]>(
    STORAGE_KEY_CONVERSATIONS,
    []
  )

  const [currentConversationId, setCurrentConversationId] = useLocalStorage<
    string | null
  >(STORAGE_KEY_CURRENT_ID, null)

  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEY_THEME, 'system')

  // -------------------------------------------------------------------------
  // Local state
  // -------------------------------------------------------------------------
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenUsage, setTokenUsage] = useState({
    prompt: 0,
    completion: 0,
    total: 0,
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  // -------------------------------------------------------------------------
  // Library hooks
  // -------------------------------------------------------------------------
  const { copy, copied: hasCopied } = useClipboard({ timeout: 2000 })

  const {
    execute: executeWithRetry,
    isRetrying,
    attempt: retryAttempt,
    cancel: cancelRetry,
  } = useRetryWithBackoff({
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
  })

  const {
    isListening: isRecording,
    transcript: voiceTranscript,
    startListening: startVoiceInput,
    stopListening: stopVoiceInput,
    isSupported: isVoiceSupported,
    resetTranscript,
  } = useVoiceInput({
    continuous: false,
    interimResults: true,
  })

  // -------------------------------------------------------------------------
  // Derived state
  // -------------------------------------------------------------------------
  const currentConversation = useMemo(() => {
    if (!currentConversationId) return null
    return conversations.find((c) => c.id === currentConversationId) || null
  }, [conversations, currentConversationId])

  const messages = currentConversation?.messages || []

  const estimatedCost = useMemo(() => {
    return (
      (tokenUsage.prompt / 1_000_000) * GEMINI_PRICING.input +
      (tokenUsage.completion / 1_000_000) * GEMINI_PRICING.output
    )
  }, [tokenUsage])

  // -------------------------------------------------------------------------
  // Conversation management
  // -------------------------------------------------------------------------
  const createConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
  }, [setConversations, setCurrentConversationId])

  const switchConversation = useCallback(
    (id: string) => {
      setCurrentConversationId(id)
    },
    [setCurrentConversationId]
  )

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (currentConversationId === id) {
        const remaining = conversations.filter((c) => c.id !== id)
        setCurrentConversationId(remaining[0]?.id || null)
      }
    },
    [
      setConversations,
      currentConversationId,
      conversations,
      setCurrentConversationId,
    ]
  )

  const renameConversation = useCallback(
    (id: string, title: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, title, updatedAt: Date.now() } : c
        )
      )
    },
    [setConversations]
  )

  // -------------------------------------------------------------------------
  // Message helpers
  // -------------------------------------------------------------------------
  const updateConversationMessages = useCallback(
    (conversationId: string, updater: (messages: Message[]) => Message[]) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, messages: updater(c.messages), updatedAt: Date.now() }
            : c
        )
      )
    },
    [setConversations]
  )

  // -------------------------------------------------------------------------
  // Send message
  // -------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (content: string, attachments?: Attachment[]) => {
      if (!content.trim() && (!attachments || attachments.length === 0)) return
      if (isStreaming) return

      // Ensure we have a conversation
      let convId = currentConversationId
      if (!convId) {
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        setConversations((prev) => [newConv, ...prev])
        setCurrentConversationId(newConv.id)
        convId = newConv.id
      }

      // Create user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
        attachments,
      }

      // Create assistant message placeholder
      const assistantId = `assistant-${Date.now()}`
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        toolResults: [],
      }

      // Add messages
      updateConversationMessages(convId, (msgs) => [
        ...msgs,
        userMessage,
        assistantMessage,
      ])

      // Update title if first message
      const conv = conversations.find((c) => c.id === convId)
      if (conv && conv.messages.length === 0) {
        renameConversation(
          convId,
          content.slice(0, 30) + (content.length > 30 ? '...' : '')
        )
      }

      setIsStreaming(true)
      setError(null)

      try {
        abortControllerRef.current = new AbortController()

        // Build messages for API
        const currentMessages =
          conversations.find((c) => c.id === convId)?.messages || []
        const apiMessages = [...currentMessages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const response = await executeWithRetry(async () => {
          const res = await fetch('/api/hero-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: apiMessages,
              attachments: attachments?.map((a) => ({
                type: a.type,
                mimeType: a.mimeType,
                url: a.url,
              })),
            }),
            signal: abortControllerRef.current?.signal,
          })

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.error || `HTTP error: ${res.status}`)
          }

          return res
        })

        const reader = response.result.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || trimmed === 'data: [DONE]') continue
            if (!trimmed.startsWith('data: ')) continue

            try {
              const event: SSEEvent = JSON.parse(trimmed.slice(6))

              if (event.type === 'text-delta') {
                updateConversationMessages(convId!, (msgs) =>
                  msgs.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + event.content }
                      : m
                  )
                )
              } else if (event.type === 'tool-result') {
                updateConversationMessages(convId!, (msgs) =>
                  msgs.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          toolResults: [
                            ...(m.toolResults || []),
                            {
                              id: event.id,
                              name: event.name,
                              data: event.data as Record<string, unknown>,
                              ui: event.ui,
                            },
                          ],
                        }
                      : m
                  )
                )
              } else if (event.type === 'done' && event.usage) {
                setTokenUsage((prev) => ({
                  prompt: prev.prompt + event.usage!.promptTokens,
                  completion: prev.completion + event.usage!.completionTokens,
                  total:
                    prev.total +
                    event.usage!.promptTokens +
                    event.usage!.completionTokens,
                }))
              } else if (event.type === 'error') {
                setError(event.message)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          const errorMsg =
            err instanceof Error ? err.message : 'Failed to send message'
          setError(errorMsg)

          // Remove empty assistant message on error
          updateConversationMessages(convId!, (msgs) =>
            msgs.filter((m) => m.id !== assistantId)
          )
        }
      } finally {
        setIsStreaming(false)
        abortControllerRef.current = null
      }
    },
    [
      isStreaming,
      currentConversationId,
      conversations,
      setConversations,
      setCurrentConversationId,
      updateConversationMessages,
      renameConversation,
      executeWithRetry,
    ]
  )

  // -------------------------------------------------------------------------
  // Message operations
  // -------------------------------------------------------------------------
  const regenerateMessage = useCallback(
    async (messageId: string) => {
      if (!currentConversationId) return

      const msgIndex = messages.findIndex((m) => m.id === messageId)
      if (msgIndex < 1) return

      const previousUserMsg = messages[msgIndex - 1]
      if (previousUserMsg.role !== 'user') return

      // Remove assistant message
      updateConversationMessages(currentConversationId, (msgs) =>
        msgs.slice(0, msgIndex)
      )

      // Resend
      await sendMessage(previousUserMsg.content, previousUserMsg.attachments)
    },
    [currentConversationId, messages, updateConversationMessages, sendMessage]
  )

  const editMessage = useCallback(
    async (messageId: string, content: string) => {
      if (!currentConversationId) return

      const msgIndex = messages.findIndex((m) => m.id === messageId)
      if (msgIndex < 0) return

      const message = messages[msgIndex]
      if (message.role !== 'user') return

      // Remove all messages from this point
      updateConversationMessages(currentConversationId, (msgs) =>
        msgs.slice(0, msgIndex)
      )

      // Send new message
      await sendMessage(content, message.attachments)
    },
    [currentConversationId, messages, updateConversationMessages, sendMessage]
  )

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!currentConversationId) return
      updateConversationMessages(currentConversationId, (msgs) =>
        msgs.filter((m) => m.id !== messageId)
      )
    },
    [currentConversationId, updateConversationMessages]
  )

  const clearMessages = useCallback(() => {
    if (!currentConversationId) return
    updateConversationMessages(currentConversationId, () => [])
  }, [currentConversationId, updateConversationMessages])

  // -------------------------------------------------------------------------
  // Other actions
  // -------------------------------------------------------------------------
  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort()
    cancelRetry()
    setIsStreaming(false)
  }, [cancelRetry])

  const copyMessage = useCallback(
    async (content: string) => {
      await copy(content)
    },
    [copy]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------
  return {
    // Conversations
    conversations,
    currentConversation,
    createConversation,
    switchConversation,
    deleteConversation,
    renameConversation,

    // Messages
    messages,
    sendMessage,
    regenerateMessage,
    editMessage,
    deleteMessage,
    clearMessages,

    // Streaming
    isStreaming,
    cancelStream,

    // Voice
    isRecording,
    voiceTranscript,
    startVoiceInput,
    stopVoiceInput,
    isVoiceSupported,

    // Clipboard
    copyMessage,
    hasCopied,

    // Theme
    theme,
    setTheme,

    // Tokens
    tokenUsage,
    estimatedCost,

    // Error
    error,
    clearError,

    // Retry
    isRetrying,
    retryAttempt,
  }
}
