/**
 * Chat History with Undo/Redo
 *
 * Provides undo/redo functionality for chat messages with efficient
 * state management and keyboard shortcuts.
 *
 * @example
 * ```tsx
 * const {
 *   messages,
 *   addMessage,
 *   undo,
 *   redo,
 *   canUndo,
 *   canRedo,
 * } = useChatHistory({ maxHistory: 50 })
 *
 * // Add a message
 * addMessage({ role: 'user', content: 'Hello' })
 *
 * // Undo the last action
 * if (canUndo) undo()
 *
 * // Redo
 * if (canRedo) redo()
 * ```
 */

import * as React from 'react'

// SSR-safe platform detection
function getIsMac(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userAgentData = (navigator as any).userAgentData
  if (userAgentData?.platform) {
    return /macOS|iOS/i.test(userAgentData.platform)
  }
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

// ============================================
// Types
// ============================================

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  timestamp?: number
  metadata?: Record<string, unknown>
}

export interface ChatHistoryOptions {
  /** Maximum number of history states to keep (default: 50) */
  maxHistory?: number
  /** Initial messages */
  initialMessages?: ChatMessage[]
  /** Enable keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z) */
  enableKeyboardShortcuts?: boolean
  /** Callback when messages change */
  onChange?: (messages: ChatMessage[]) => void
  /** Callback on undo */
  onUndo?: (previousMessages: ChatMessage[], restoredMessages: ChatMessage[]) => void
  /** Callback on redo */
  onRedo?: (previousMessages: ChatMessage[], restoredMessages: ChatMessage[]) => void
}

export interface ChatHistoryState {
  messages: ChatMessage[]
  timestamp: number
}

export interface UseChatHistoryReturn {
  /** Current messages */
  messages: ChatMessage[]
  /** Add a single message */
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string }) => void
  /** Add multiple messages at once */
  addMessages: (messages: Array<Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string }>) => void
  /** Update an existing message */
  updateMessage: (id: string, updates: Partial<Omit<ChatMessage, 'id'>>) => void
  /** Remove a message */
  removeMessage: (id: string) => void
  /** Remove last N messages */
  removeLastMessages: (count: number) => void
  /** Clear all messages */
  clearMessages: () => void
  /** Replace all messages (creates history entry) */
  setMessages: (messages: ChatMessage[]) => void
  /** Undo last action */
  undo: () => void
  /** Redo last undone action */
  redo: () => void
  /** Whether undo is available */
  canUndo: boolean
  /** Whether redo is available */
  canRedo: boolean
  /** Number of available undo steps */
  undoSteps: number
  /** Number of available redo steps */
  redoSteps: number
  /** Get message by ID */
  getMessage: (id: string) => ChatMessage | undefined
  /** Get last message */
  getLastMessage: () => ChatMessage | undefined
  /** Get last user message */
  getLastUserMessage: () => ChatMessage | undefined
  /** Reset history (clears undo/redo stack) */
  resetHistory: () => void
}

// ============================================
// Utilities
// ============================================

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function cloneMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((m) => ({ ...m }))
}

// ============================================
// Hook
// ============================================

export function useChatHistory(
  options: ChatHistoryOptions = {}
): UseChatHistoryReturn {
  const {
    maxHistory = 50,
    initialMessages = [],
    enableKeyboardShortcuts = true,
    onChange,
    onUndo,
    onRedo,
  } = options

  // History stack (past states)
  const [history, setHistory] = React.useState<ChatHistoryState[]>([])
  // Future stack (for redo)
  const [future, setFuture] = React.useState<ChatHistoryState[]>([])
  // Current messages
  const [messages, setMessagesInternal] = React.useState<ChatMessage[]>(
    initialMessages.map((m) => ({
      ...m,
      id: m.id || generateId(),
      timestamp: m.timestamp || Date.now(),
    }))
  )

  // Save current state to history
  const saveToHistory = React.useCallback(() => {
    setHistory((prev) => {
      const newHistory = [
        ...prev,
        { messages: cloneMessages(messages), timestamp: Date.now() },
      ]
      // Limit history size
      if (newHistory.length > maxHistory) {
        return newHistory.slice(-maxHistory)
      }
      return newHistory
    })
    // Clear future on new action
    setFuture([])
  }, [messages, maxHistory])

  // Set messages and optionally save history
  const setMessages = React.useCallback(
    (newMessages: ChatMessage[]) => {
      saveToHistory()
      setMessagesInternal(newMessages)
      onChange?.(newMessages)
    },
    [saveToHistory, onChange]
  )

  // Add a single message
  const addMessage = React.useCallback(
    (message: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string }) => {
      saveToHistory()
      const newMessage: ChatMessage = {
        ...message,
        id: message.id || generateId(),
        timestamp: Date.now(),
      }
      setMessagesInternal((prev) => {
        const updated = [...prev, newMessage]
        onChange?.(updated)
        return updated
      })
    },
    [saveToHistory, onChange]
  )

  // Add multiple messages
  const addMessages = React.useCallback(
    (newMessages: Array<Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string }>) => {
      if (newMessages.length === 0) return
      saveToHistory()
      const messagesWithIds = newMessages.map((m) => ({
        ...m,
        id: m.id || generateId(),
        timestamp: Date.now(),
      }))
      setMessagesInternal((prev) => {
        const updated = [...prev, ...messagesWithIds]
        onChange?.(updated)
        return updated
      })
    },
    [saveToHistory, onChange]
  )

  // Update an existing message
  const updateMessage = React.useCallback(
    (id: string, updates: Partial<Omit<ChatMessage, 'id'>>) => {
      saveToHistory()
      setMessagesInternal((prev) => {
        const updated = prev.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        )
        onChange?.(updated)
        return updated
      })
    },
    [saveToHistory, onChange]
  )

  // Remove a message
  const removeMessage = React.useCallback(
    (id: string) => {
      saveToHistory()
      setMessagesInternal((prev) => {
        const updated = prev.filter((m) => m.id !== id)
        onChange?.(updated)
        return updated
      })
    },
    [saveToHistory, onChange]
  )

  // Remove last N messages
  const removeLastMessages = React.useCallback(
    (count: number) => {
      if (count <= 0) return
      saveToHistory()
      setMessagesInternal((prev) => {
        const updated = prev.slice(0, -count)
        onChange?.(updated)
        return updated
      })
    },
    [saveToHistory, onChange]
  )

  // Clear all messages
  const clearMessages = React.useCallback(() => {
    if (messages.length === 0) return
    saveToHistory()
    setMessagesInternal([])
    onChange?.([])
  }, [messages.length, saveToHistory, onChange])

  // Undo
  const undo = React.useCallback(() => {
    if (history.length === 0) return

    const previousState = history[history.length - 1]!
    const currentState = { messages: cloneMessages(messages), timestamp: Date.now() }

    setHistory((prev) => prev.slice(0, -1))
    setFuture((prev) => [...prev, currentState])
    setMessagesInternal(previousState.messages)
    onChange?.(previousState.messages)
    onUndo?.(messages, previousState.messages)
  }, [history, messages, onChange, onUndo])

  // Redo
  const redo = React.useCallback(() => {
    if (future.length === 0) return

    const nextState = future[future.length - 1]!
    const currentState = { messages: cloneMessages(messages), timestamp: Date.now() }

    setFuture((prev) => prev.slice(0, -1))
    setHistory((prev) => [...prev, currentState])
    setMessagesInternal(nextState.messages)
    onChange?.(nextState.messages)
    onRedo?.(messages, nextState.messages)
  }, [future, messages, onChange, onRedo])

  // Get message by ID
  const getMessage = React.useCallback(
    (id: string) => messages.find((m) => m.id === id),
    [messages]
  )

  // Get last message
  const getLastMessage = React.useCallback(
    () => messages[messages.length - 1],
    [messages]
  )

  // Get last user message
  const getLastUserMessage = React.useCallback(
    () => [...messages].reverse().find((m) => m.role === 'user'),
    [messages]
  )

  // Reset history
  const resetHistory = React.useCallback(() => {
    setHistory([])
    setFuture([])
  }, [])

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!enableKeyboardShortcuts) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const modifier = getIsMac() ? e.metaKey : e.ctrlKey

      if (modifier && e.key === 'z') {
        if (e.shiftKey) {
          // Redo: Cmd/Ctrl+Shift+Z
          e.preventDefault()
          redo()
        } else {
          // Undo: Cmd/Ctrl+Z
          e.preventDefault()
          undo()
        }
      }

      // Alternative redo: Cmd/Ctrl+Y
      if (modifier && e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboardShortcuts, undo, redo])

  return {
    messages,
    addMessage,
    addMessages,
    updateMessage,
    removeMessage,
    removeLastMessages,
    clearMessages,
    setMessages,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    undoSteps: history.length,
    redoSteps: future.length,
    getMessage,
    getLastMessage,
    getLastUserMessage,
    resetHistory,
  }
}

export default useChatHistory
