/**
 * Message Management Tool Definitions
 *
 * Agent-native tools for CRUD operations on messages.
 * These tools enable agents to edit, delete, and pin messages with full action parity.
 *
 * **Principle**: Action Parity - "Whatever the user can do, the agent can do"
 *
 * @module tools/message-management
 */

import type Anthropic from '@anthropic-ai/sdk'

/**
 * Message management tool names
 */
export const MESSAGE_TOOL_NAMES = {
  EDIT_MESSAGE: 'edit_message',
  DELETE_MESSAGE: 'delete_message',
  PIN_MESSAGE: 'pin_message',
  UNPIN_MESSAGE: 'unpin_message',
  GET_MESSAGE: 'get_message',
} as const

export type MessageToolName =
  (typeof MESSAGE_TOOL_NAMES)[keyof typeof MESSAGE_TOOL_NAMES]

/**
 * Type-safe input types for message management tools
 */
export interface MessageToolInputs {
  [MESSAGE_TOOL_NAMES.EDIT_MESSAGE]: {
    messageId: string
    content: string
    reason?: string
  }
  [MESSAGE_TOOL_NAMES.DELETE_MESSAGE]: {
    messageId: string
    reason?: string
  }
  [MESSAGE_TOOL_NAMES.PIN_MESSAGE]: {
    messageId: string
    reason?: string
  }
  [MESSAGE_TOOL_NAMES.UNPIN_MESSAGE]: {
    messageId: string
  }
  [MESSAGE_TOOL_NAMES.GET_MESSAGE]: {
    messageId: string
  }
}

/**
 * Type-safe output types for message management tools
 */
export interface MessageToolOutputs {
  [MESSAGE_TOOL_NAMES.EDIT_MESSAGE]: {
    success: boolean
    message: {
      id: string
      content: string
      editedAt: string
      previousContent: string
    }
    notification: string
  }
  [MESSAGE_TOOL_NAMES.DELETE_MESSAGE]: {
    success: boolean
    messageId: string
    deletedAt: string
    message: string
  }
  [MESSAGE_TOOL_NAMES.PIN_MESSAGE]: {
    success: boolean
    message: {
      id: string
      content: string
      pinnedAt: string
    }
    notification: string
  }
  [MESSAGE_TOOL_NAMES.UNPIN_MESSAGE]: {
    success: boolean
    messageId: string
    message: string
  }
  [MESSAGE_TOOL_NAMES.GET_MESSAGE]: {
    message: {
      id: string
      role: 'user' | 'assistant' | 'system'
      content: string
      createdAt: string
      editedAt?: string
      isPinned: boolean
      metadata?: Record<string, unknown>
    }
  }
}

/**
 * Message Management Tool Definitions for Claude API
 */
export const MESSAGE_MANAGEMENT_TOOLS: Anthropic.Tool[] = [
  {
    name: MESSAGE_TOOL_NAMES.EDIT_MESSAGE,
    description: `Edit an existing message in the conversation. Use this tool when:
- User asks to correct or update a previous message
- User says "edit my last message" or "change what I said"
- User wants to rephrase or clarify a previous statement
- User needs to fix a typo or mistake in their message

**Security**: This is a mutating operation that modifies conversation history.
**Action Parity**: Users can edit messages via UI, agent should match this capability.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        messageId: {
          type: 'string',
          description: 'The ID of the message to edit',
        },
        content: {
          type: 'string',
          description: 'The new content for the message',
        },
        reason: {
          type: 'string',
          description: 'Optional: Reason for the edit (for audit log)',
        },
      },
      required: ['messageId', 'content'],
    },
  },
  {
    name: MESSAGE_TOOL_NAMES.DELETE_MESSAGE,
    description: `Delete a message from the conversation. Use this tool when:
- User asks to remove a message
- User says "delete that message" or "remove my last message"
- User wants to retract or clear sensitive information
- User needs to clean up the conversation

**Security**: This is a destructive operation that permanently removes data.
**Action Parity**: Users can delete messages via UI, agent should match this capability.
**Note**: Some implementations may soft-delete (mark as deleted) instead of hard-delete.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        messageId: {
          type: 'string',
          description: 'The ID of the message to delete',
        },
        reason: {
          type: 'string',
          description: 'Optional: Reason for deletion (for audit log)',
        },
      },
      required: ['messageId'],
    },
  },
  {
    name: MESSAGE_TOOL_NAMES.PIN_MESSAGE,
    description: `Pin a message for easy reference. Use this tool when:
- User asks to "pin that message" or "remember this"
- User wants to mark an important message for later
- User needs to highlight key information in the conversation
- User asks to bookmark or save a specific response

**Security**: Non-destructive operation, safe to execute.
**Action Parity**: Users can pin messages via UI, agent should match this capability.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        messageId: {
          type: 'string',
          description: 'The ID of the message to pin',
        },
        reason: {
          type: 'string',
          description:
            'Optional: Reason for pinning (helps user remember why it was pinned)',
        },
      },
      required: ['messageId'],
    },
  },
  {
    name: MESSAGE_TOOL_NAMES.UNPIN_MESSAGE,
    description: `Unpin a previously pinned message. Use this tool when:
- User asks to "unpin that message" or "remove pin"
- User no longer needs a message highlighted
- User wants to clean up pinned messages

**Security**: Non-destructive operation, safe to execute.
**Action Parity**: Users can unpin messages via UI, agent should match this capability.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        messageId: {
          type: 'string',
          description: 'The ID of the message to unpin',
        },
      },
      required: ['messageId'],
    },
  },
  {
    name: MESSAGE_TOOL_NAMES.GET_MESSAGE,
    description: `Get details about a specific message. Use this tool when:
- You need to verify message content before editing/deleting
- User asks about a specific message (by ID or reference)
- You need to check if a message is pinned
- You need message metadata (timestamps, role, etc.)

**Security**: Read-only operation, safe to call without approval.
**Action Parity**: Users can view message details via UI.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        messageId: {
          type: 'string',
          description: 'The ID of the message to retrieve',
        },
      },
      required: ['messageId'],
    },
  },
]
