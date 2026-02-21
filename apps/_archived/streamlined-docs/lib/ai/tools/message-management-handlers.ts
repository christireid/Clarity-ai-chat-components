/**
 * Message Management Tool Handlers
 *
 * Implements CRUD operations for messages.
 * These handlers execute the actual business logic for message management tools.
 *
 * **NOTE**: This is a reference implementation. In production, these would
 * connect to your actual message service/database.
 *
 * @module tools/message-management-handlers
 */

import {
  MESSAGE_TOOL_NAMES,
  type MessageToolInputs,
  type MessageToolOutputs,
  type MessageToolName,
} from './message-management-tools'

/**
 * Mock message database (replace with real database in production)
 */
interface StoredMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  editedAt?: Date
  deletedAt?: Date
  isPinned: boolean
  pinnedAt?: Date
  previousContent?: string
  metadata?: Record<string, unknown>
}

const mockMessageStore = new Map<string, StoredMessage>()

/**
 * Initialize mock message for development/testing
 */
function ensureMessageExists(messageId: string): StoredMessage {
  if (!mockMessageStore.has(messageId)) {
    // Create a mock message if it doesn't exist
    const message: StoredMessage = {
      id: messageId,
      role: 'user',
      content: `Mock message ${messageId}`,
      createdAt: new Date(),
      isPinned: false,
      metadata: {},
    }
    mockMessageStore.set(messageId, message)
  }
  return mockMessageStore.get(messageId)!
}

/**
 * Edit message handler
 */
async function editMessage(
  input: MessageToolInputs[typeof MESSAGE_TOOL_NAMES.EDIT_MESSAGE]
): Promise<MessageToolOutputs[typeof MESSAGE_TOOL_NAMES.EDIT_MESSAGE]> {
  const { messageId, content, reason } = input

  // TODO: Replace with actual database call
  // Example: await messageService.editMessage(messageId, content, reason)

  const message = ensureMessageExists(messageId)

  // Check if message is deleted
  if (message.deletedAt) {
    throw new Error('Cannot edit a deleted message')
  }

  // Store previous content for history/undo
  message.previousContent = message.content
  message.content = content
  message.editedAt = new Date()

  // Log edit reason if provided
  if (reason) {
    message.metadata = {
      ...message.metadata,
      lastEditReason: reason,
      editHistory: [
        ...(Array.isArray(message.metadata?.editHistory)
          ? message.metadata.editHistory
          : []),
        {
          previousContent: message.previousContent,
          editedAt: message.editedAt.toISOString(),
          reason,
        },
      ],
    }
  }

  return {
    success: true,
    message: {
      id: message.id,
      content: message.content,
      editedAt: message.editedAt.toISOString(),
      previousContent: message.previousContent,
    },
    notification: `Message edited successfully${reason ? `: ${reason}` : ''}`,
  }
}

/**
 * Delete message handler
 */
async function deleteMessage(
  input: MessageToolInputs[typeof MESSAGE_TOOL_NAMES.DELETE_MESSAGE]
): Promise<MessageToolOutputs[typeof MESSAGE_TOOL_NAMES.DELETE_MESSAGE]> {
  const { messageId, reason } = input

  // TODO: Replace with actual database call
  // Example: await messageService.deleteMessage(messageId, reason)

  const message = ensureMessageExists(messageId)

  // Check if already deleted
  if (message.deletedAt) {
    throw new Error('Message is already deleted')
  }

  // Soft delete (mark as deleted but keep data)
  message.deletedAt = new Date()

  // Log deletion reason
  if (reason) {
    message.metadata = {
      ...message.metadata,
      deletionReason: reason,
    }
  }

  return {
    success: true,
    messageId: message.id,
    deletedAt: message.deletedAt.toISOString(),
    message: `Message deleted successfully${reason ? `: ${reason}` : ''}`,
  }
}

/**
 * Pin message handler
 */
async function pinMessage(
  input: MessageToolInputs[typeof MESSAGE_TOOL_NAMES.PIN_MESSAGE]
): Promise<MessageToolOutputs[typeof MESSAGE_TOOL_NAMES.PIN_MESSAGE]> {
  const { messageId, reason } = input

  // TODO: Replace with actual database call
  // Example: await messageService.pinMessage(messageId, reason)

  const message = ensureMessageExists(messageId)

  // Check if message is deleted
  if (message.deletedAt) {
    throw new Error('Cannot pin a deleted message')
  }

  // Check if already pinned
  if (message.isPinned) {
    return {
      success: true,
      message: {
        id: message.id,
        content: message.content,
        pinnedAt: message.pinnedAt!.toISOString(),
      },
      notification: 'Message is already pinned',
    }
  }

  message.isPinned = true
  message.pinnedAt = new Date()

  // Store pin reason
  if (reason) {
    message.metadata = {
      ...message.metadata,
      pinReason: reason,
    }
  }

  return {
    success: true,
    message: {
      id: message.id,
      content: message.content,
      pinnedAt: message.pinnedAt.toISOString(),
    },
    notification: `Message pinned successfully${reason ? `: ${reason}` : ''}`,
  }
}

/**
 * Unpin message handler
 */
async function unpinMessage(
  input: MessageToolInputs[typeof MESSAGE_TOOL_NAMES.UNPIN_MESSAGE]
): Promise<MessageToolOutputs[typeof MESSAGE_TOOL_NAMES.UNPIN_MESSAGE]> {
  const { messageId } = input

  // TODO: Replace with actual database call
  // Example: await messageService.unpinMessage(messageId)

  const message = ensureMessageExists(messageId)

  // Check if not pinned
  if (!message.isPinned) {
    return {
      success: true,
      messageId: message.id,
      message: 'Message is not pinned',
    }
  }

  message.isPinned = false
  message.pinnedAt = undefined

  // Remove pin reason from metadata
  if (message.metadata?.pinReason) {
    delete message.metadata.pinReason
  }

  return {
    success: true,
    messageId: message.id,
    message: 'Message unpinned successfully',
  }
}

/**
 * Get message handler
 */
async function getMessage(
  input: MessageToolInputs[typeof MESSAGE_TOOL_NAMES.GET_MESSAGE]
): Promise<MessageToolOutputs[typeof MESSAGE_TOOL_NAMES.GET_MESSAGE]> {
  const { messageId } = input

  // TODO: Replace with actual database call
  // Example: const message = await messageService.getMessage(messageId)

  const message = ensureMessageExists(messageId)

  // Don't return deleted messages
  if (message.deletedAt) {
    throw new Error('Message not found (deleted)')
  }

  return {
    message: {
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      editedAt: message.editedAt?.toISOString(),
      isPinned: message.isPinned,
      metadata: message.metadata,
    },
  }
}

/**
 * Execute message management tool call
 *
 * Routes tool calls to appropriate handler functions.
 *
 * @param toolName - Name of the tool to execute
 * @param input - Tool input parameters
 * @returns Tool execution result
 */
export async function executeMessageManagementTool(
  toolName: MessageToolName,
  input: unknown
): Promise<unknown> {
  switch (toolName) {
    case MESSAGE_TOOL_NAMES.EDIT_MESSAGE:
      return editMessage(
        input as MessageToolInputs[typeof MESSAGE_TOOL_NAMES.EDIT_MESSAGE]
      )

    case MESSAGE_TOOL_NAMES.DELETE_MESSAGE:
      return deleteMessage(
        input as MessageToolInputs[typeof MESSAGE_TOOL_NAMES.DELETE_MESSAGE]
      )

    case MESSAGE_TOOL_NAMES.PIN_MESSAGE:
      return pinMessage(
        input as MessageToolInputs[typeof MESSAGE_TOOL_NAMES.PIN_MESSAGE]
      )

    case MESSAGE_TOOL_NAMES.UNPIN_MESSAGE:
      return unpinMessage(
        input as MessageToolInputs[typeof MESSAGE_TOOL_NAMES.UNPIN_MESSAGE]
      )

    case MESSAGE_TOOL_NAMES.GET_MESSAGE:
      return getMessage(
        input as MessageToolInputs[typeof MESSAGE_TOOL_NAMES.GET_MESSAGE]
      )

    default:
      throw new Error(`Unknown message management tool: ${toolName}`)
  }
}

/**
 * Validation helper for message content
 */
export function validateMessageContent(content: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check minimum length
  if (content.length === 0) {
    errors.push('Message content cannot be empty')
  }

  // Check maximum length (adjust as needed)
  const MAX_MESSAGE_LENGTH = 10000
  if (content.length > MAX_MESSAGE_LENGTH) {
    errors.push(`Message content exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`)
  }

  // Check for null bytes (security)
  if (content.includes('\0')) {
    errors.push('Message content contains invalid null bytes')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Check if message deletion requires confirmation
 *
 * Some messages (system messages, pinned messages) may require extra confirmation
 */
export function requiresDeletionConfirmation(message: {
  role: string
  isPinned: boolean
}): boolean {
  // System messages require confirmation
  if (message.role === 'system') {
    return true
  }

  // Pinned messages require confirmation
  if (message.isPinned) {
    return true
  }

  return false
}
