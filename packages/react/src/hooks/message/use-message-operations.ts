'use client'

import * as React from 'react'
import { flushSync } from 'react-dom'

/**
 * Message with operations metadata
 */
export interface MessageWithOperations {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  /** Chat/conversation ID */
  chatId?: string
  /** Parent message ID for branching */
  parentId?: string
  /** Branch ID for conversation forking */
  branchId?: string
  /** Whether message is currently being edited */
  isEditing?: boolean
  /** Original content before edit */
  originalContent?: string
  /** Version number for edits */
  version?: number
}

/**
 * Message operation history entry
 */
export interface MessageOperation {
  type: 'add' | 'edit' | 'delete' | 'regenerate' | 'branch'
  messageId: string
  timestamp: number
  previousState?: MessageWithOperations
}

/**
 * Message operations options
 */
export interface UseMessageOperationsOptions {
  /** Initial messages */
  initialMessages?: MessageWithOperations[]

  /** Maximum undo history size (default: 50) */
  maxHistorySize?: number

  /** Callback when message is edited */
  onEdit?: (messageId: string, newContent: string) => void

  /** Callback when message is regenerated */
  onRegenerate?: (messageId: string) => void

  /** Callback when conversation is branched */
  onBranch?: (branchId: string, parentMessageId: string) => void

  /** Callback when message is deleted */
  onDelete?: (messageId: string) => void
}

/**
 * Message operations return type
 */
export interface UseMessageOperationsReturn {
  /** All messages */
  messages: MessageWithOperations[]

  /** Add new message */
  addMessage: (
    message: Omit<MessageWithOperations, 'id' | 'timestamp'>
  ) => string

  /** Edit message content */
  editMessage: (messageId: string, newContent: string) => void

  /** Rollback failed edit operation */
  rollbackEdit: (messageId: string) => void

  /** Start editing mode for message */
  startEditing: (messageId: string) => void

  /** Cancel editing mode */
  cancelEditing: (messageId: string) => void

  /** Regenerate assistant message */
  regenerateMessage: (messageId: string) => void

  /** Delete message */
  deleteMessage: (messageId: string) => void

  /** Branch conversation from message */
  branchConversation: (messageId: string) => string

  /** Get messages up to specific point */
  getMessagesUpTo: (messageId: string) => MessageWithOperations[]

  /** Get all branches */
  getBranches: () => Map<string, MessageWithOperations[]>

  /** Switch to different branch */
  switchToBranch: (branchId: string) => void

  /** Undo last operation */
  undo: () => void

  /** Redo last undone operation */
  redo: () => void

  /** Whether can undo */
  canUndo: boolean

  /** Whether can redo */
  canRedo: boolean

  /** Current branch ID */
  currentBranchId: string

  /** Clear all messages */
  clear: () => void
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Reducer state
 */
interface OperationsState {
  messages: MessageWithOperations[]
  history: MessageOperation[]
  redoStack: MessageOperation[]
  currentBranchId: string
}

/**
 * Reducer actions
 */
type OperationsAction =
  | { type: 'ADD_MESSAGE'; payload: MessageWithOperations }
  | { type: 'EDIT_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'ROLLBACK_EDIT'; payload: string } // Rollback failed edit by message ID
  | { type: 'START_EDITING'; payload: string }
  | { type: 'CANCEL_EDITING'; payload: string }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | {
      type: 'BRANCH_CONVERSATION'
      payload: { messageId: string; branchId: string }
    }
  | { type: 'SWITCH_BRANCH'; payload: string }
  | { type: 'CLEAR' }

/**
 * Reducer for message operations (handles all state transitions atomically)
 */
function operationsReducer(
  state: OperationsState,
  action: OperationsAction
): OperationsState {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const operation: MessageOperation = {
        type: 'add',
        messageId: action.payload.id,
        timestamp: Date.now(),
        previousState: action.payload,
      }

      return {
        ...state,
        messages: [...state.messages, action.payload],
        history: [...state.history, operation],
        redoStack: [], // Clear redo stack on new operation
      }
    }

    case 'EDIT_MESSAGE': {
      const index = state.messages.findIndex((m) => m.id === action.payload.id)
      if (index === -1) return state

      const oldMessage = state.messages[index]
      if (!oldMessage) return state

      const updatedMessage: MessageWithOperations = {
        ...oldMessage,
        content: action.payload.content,
        originalContent: oldMessage.originalContent || oldMessage.content,
        version: (oldMessage.version || 0) + 1,
        isEditing: false,
      }

      const newMessages = [...state.messages]
      newMessages[index] = updatedMessage

      const operation: MessageOperation = {
        type: 'edit',
        messageId: action.payload.id,
        timestamp: Date.now(),
        previousState: oldMessage,
      }

      return {
        ...state,
        messages: newMessages,
        history: [...state.history, operation],
        redoStack: [],
      }
    }

    case 'ROLLBACK_EDIT': {
      // Find the last edit operation for this message (backward compatible)
      let lastEditIndex = -1
      for (let i = state.history.length - 1; i >= 0; i--) {
        const op = state.history[i]
        if (op && op.type === 'edit' && op.messageId === action.payload) {
          lastEditIndex = i
          break
        }
      }

      if (lastEditIndex === -1) return state

      const lastEdit = state.history[lastEditIndex]
      if (!lastEdit || !lastEdit.previousState) return state

      // Restore the message to its previous state
      const restoredMessages = state.messages.map((m) =>
        m.id === action.payload ? lastEdit.previousState! : m
      )

      // Remove the failed edit from history
      const newHistory = [
        ...state.history.slice(0, lastEditIndex),
        ...state.history.slice(lastEditIndex + 1),
      ]

      return {
        ...state,
        messages: restoredMessages,
        history: newHistory,
        redoStack: [], // Clear redo stack on rollback
      }
    }

    case 'START_EDITING': {
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload ? { ...m, isEditing: true } : m
        ),
      }
    }

    case 'CANCEL_EDITING': {
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload ? { ...m, isEditing: false } : m
        ),
      }
    }

    case 'DELETE_MESSAGE': {
      const message = state.messages.find((m) => m.id === action.payload)
      if (!message) return state

      const operation: MessageOperation = {
        type: 'delete',
        messageId: action.payload,
        timestamp: Date.now(),
        previousState: message,
      }

      return {
        ...state,
        messages: state.messages.filter((m) => m.id !== action.payload),
        history: [...state.history, operation],
        redoStack: [],
      }
    }

    case 'UNDO': {
      if (state.history.length === 0) return state

      const lastOperation = state.history[state.history.length - 1]
      if (!lastOperation) return state

      let newMessages = state.messages

      // Reverse the operation
      switch (lastOperation.type) {
        case 'add':
          newMessages = newMessages.filter(
            (m) => m.id !== lastOperation.messageId
          )
          break
        case 'edit':
        case 'regenerate':
          if (lastOperation.previousState) {
            newMessages = newMessages.map((m) =>
              m.id === lastOperation.messageId
                ? lastOperation.previousState!
                : m
            )
          }
          break
        case 'delete':
          if (lastOperation.previousState) {
            newMessages = [...newMessages, lastOperation.previousState]
          }
          break
      }

      return {
        ...state,
        messages: newMessages,
        history: state.history.slice(0, -1),
        redoStack: [...state.redoStack, lastOperation],
      }
    }

    case 'REDO': {
      if (state.redoStack.length === 0) return state

      const operation = state.redoStack[state.redoStack.length - 1]
      if (!operation) return state

      let newMessages = state.messages

      // Re-apply the operation
      switch (operation.type) {
        case 'add':
          if (operation.previousState) {
            newMessages = [...newMessages, operation.previousState]
          }
          break
        case 'edit':
        case 'regenerate':
          if (operation.previousState) {
            newMessages = newMessages.map((m) =>
              m.id === operation.messageId ? operation.previousState! : m
            )
          }
          break
        case 'delete':
          newMessages = newMessages.filter((m) => m.id !== operation.messageId)
          break
      }

      return {
        ...state,
        messages: newMessages,
        history: [...state.history, operation],
        redoStack: state.redoStack.slice(0, -1),
      }
    }

    case 'BRANCH_CONVERSATION': {
      const index = state.messages.findIndex(
        (m) => m.id === action.payload.messageId
      )
      if (index === -1) return state

      // Create copies of messages for new branch
      // Preserve original parentId to maintain message chain (avoid self-references)
      const branchedMessages = state.messages
        .slice(0, index + 1)
        .map((msg) => ({
          ...msg,
          branchId: action.payload.branchId,
          parentId: msg.parentId, // Keep original parent relationship
        }))

      return {
        ...state,
        messages: [...state.messages, ...branchedMessages],
        currentBranchId: action.payload.branchId,
      }
    }

    case 'SWITCH_BRANCH': {
      return {
        ...state,
        currentBranchId: action.payload,
      }
    }

    case 'CLEAR': {
      return {
        messages: [],
        history: [],
        redoStack: [],
        currentBranchId: 'main',
      }
    }

    default:
      return state
  }
}

/**
 * Production-ready Message Operations hook for advanced chat features.
 *
 * **Features:**
 * - Message editing with version history
 * - Message regeneration (resend to AI)
 * - Conversation branching/forking
 * - Undo/redo operations
 * - Message deletion
 * - Branch switching
 * - Context preservation
 *
 * **Use Cases:**
 * - Allow users to edit their messages
 * - Regenerate AI responses with same context
 * - Create alternative conversation paths
 * - Undo mistakes
 * - Delete unwanted messages
 *
 * @example
 * ```tsx
 * // Basic message operations
 * const {
 *   messages,
 *   addMessage,
 *   editMessage,
 *   deleteMessage,
 *   undo,
 *   canUndo,
 * } = useMessageOperations({
 *   onEdit: (id, content) => {
 *     console.log('Message edited:', id, content)
 *   },
 * })
 *
 * // Add messages
 * const msgId = addMessage({
 *   role: 'user',
 *   content: 'Hello!',
 * })
 *
 * // Edit message
 * editMessage(msgId, 'Hi there!')
 *
 * // Undo if needed
 * if (canUndo) {
 *   undo()
 * }
 *
 * // Regenerate AI response
 * const {
 *   regenerateMessage,
 *   onRegenerate,
 * } = useMessageOperations({
 *   onRegenerate: async (messageId) => {
 *     const context = getMessagesUpTo(messageId)
 *     const response = await sendToAI(context)
 *     // Replace old message with new response
 *   },
 * })
 *
 * // Branch conversation
 * const {
 *   branchConversation,
 *   getBranches,
 *   switchToBranch,
 * } = useMessageOperations({
 *   onBranch: (branchId, parentId) => {
 *     console.log('Created branch:', branchId)
 *   },
 * })
 *
 * // Create branch from message
 * const branchId = branchConversation(messageId)
 *
 * // List all branches
 * const branches = getBranches()
 *
 * // Switch between branches
 * switchToBranch(branchId)
 * ```
 */
export function useMessageOperations(
  options: UseMessageOperationsOptions = {}
): UseMessageOperationsReturn {
  const {
    initialMessages = [],
    maxHistorySize = 50,
    onEdit,
    onRegenerate,
    onBranch,
    onDelete,
  } = options

  // Use reducer for atomic state updates (prevents race conditions)
  const [state, dispatch] = React.useReducer(operationsReducer, {
    messages: initialMessages.map((msg) => ({
      ...msg,
      id: msg.id || generateId(),
      timestamp: msg.timestamp || Date.now(),
      branchId: msg.branchId || 'main',
    })),
    history: [],
    redoStack: [],
    currentBranchId: 'main',
  })

  const canUndo = state.history.length > 0
  const canRedo = state.redoStack.length > 0

  /**
   * Add new message
   */
  const addMessage = React.useCallback(
    (message: Omit<MessageWithOperations, 'id' | 'timestamp'>): string => {
      const id = generateId()
      const newMessage: MessageWithOperations = {
        ...message,
        id,
        timestamp: Date.now(),
        branchId: message.branchId || state.currentBranchId,
      }

      dispatch({ type: 'ADD_MESSAGE', payload: newMessage })

      return id
    },
    [state.currentBranchId]
  )

  /**
   * Edit message content
   */
  const editMessage = React.useCallback(
    (messageId: string, newContent: string) => {
      dispatch({
        type: 'EDIT_MESSAGE',
        payload: { id: messageId, content: newContent },
      })
      onEdit?.(messageId, newContent)
    },
    [onEdit]
  )

  /**
   * Rollback failed edit operation
   * Call this if onEdit callback fails to restore message to previous state
   */
  const rollbackEdit = React.useCallback((messageId: string) => {
    dispatch({ type: 'ROLLBACK_EDIT', payload: messageId })
  }, [])

  /**
   * Start editing mode
   */
  const startEditing = React.useCallback((messageId: string) => {
    dispatch({ type: 'START_EDITING', payload: messageId })
  }, [])

  /**
   * Cancel editing mode
   */
  const cancelEditing = React.useCallback((messageId: string) => {
    dispatch({ type: 'CANCEL_EDITING', payload: messageId })
  }, [])

  /**
   * Regenerate message (for assistant messages)
   */
  const regenerateMessage = React.useCallback(
    (messageId: string) => {
      const message = state.messages.find((m) => m.id === messageId)
      if (!message) return

      // Regenerate doesn't change state directly, just triggers callback
      // The actual new message will be added via addMessage
      onRegenerate?.(messageId)
    },
    [state.messages, onRegenerate]
  )

  /**
   * Delete message
   */
  const deleteMessage = React.useCallback(
    (messageId: string) => {
      dispatch({ type: 'DELETE_MESSAGE', payload: messageId })
      onDelete?.(messageId)
    },
    [onDelete]
  )

  /**
   * Branch conversation from message
   */
  const branchConversation = React.useCallback(
    (messageId: string): string => {
      const branchId = `branch_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`

      dispatch({
        type: 'BRANCH_CONVERSATION',
        payload: { messageId, branchId },
      })
      onBranch?.(branchId, messageId)

      return branchId
    },
    [onBranch]
  )

  /**
   * Get messages up to specific point
   */
  const getMessagesUpTo = React.useCallback(
    (messageId: string): MessageWithOperations[] => {
      const index = state.messages.findIndex((m) => m.id === messageId)
      if (index === -1) return []

      return state.messages
        .slice(0, index + 1)
        .filter((m) => m.branchId === state.currentBranchId)
    },
    [state.messages, state.currentBranchId]
  )

  /**
   * Get all branches
   */
  const getBranches = React.useCallback((): Map<
    string,
    MessageWithOperations[]
  > => {
    const branches = new Map<string, MessageWithOperations[]>()

    state.messages.forEach((msg) => {
      const branchId = msg.branchId || 'main'
      if (!branches.has(branchId)) {
        branches.set(branchId, [])
      }
      branches.get(branchId)!.push(msg)
    })

    return branches
  }, [state.messages])

  /**
   * Switch to different branch
   */
  const switchToBranch = React.useCallback((branchId: string) => {
    dispatch({ type: 'SWITCH_BRANCH', payload: branchId })
  }, [])

  /**
   * Undo last operation (race-condition free with reducer + flushSync)
   */
  const undo = React.useCallback(() => {
    flushSync(() => {
      dispatch({ type: 'UNDO' })
    })
  }, [])

  /**
   * Redo last undone operation (race-condition free with reducer + flushSync)
   */
  const redo = React.useCallback(() => {
    flushSync(() => {
      dispatch({ type: 'REDO' })
    })
  }, [])

  /**
   * Clear all messages
   */
  const clear = React.useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  return {
    messages: state.messages.filter(
      (m) => m.branchId === state.currentBranchId
    ),
    addMessage,
    editMessage,
    rollbackEdit,
    startEditing,
    cancelEditing,
    regenerateMessage,
    deleteMessage,
    branchConversation,
    getMessagesUpTo,
    getBranches,
    switchToBranch,
    undo,
    redo,
    canUndo,
    canRedo,
    currentBranchId: state.currentBranchId,
    clear,
  }
}
