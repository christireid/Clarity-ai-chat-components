/**
 * Conversation Management Tool Definitions
 *
 * **Agent-Native Architecture Principle**: Action Parity
 * "Whatever the user can do, the agent can do"
 *
 * These tools provide full CRUD operations for conversation management,
 * enabling agents to archive, rename, delete, and organize conversations
 * just as users can through the UI.
 */

import type Anthropic from '@anthropic-ai/sdk'

/**
 * Tool names for conversation management
 */
export const CONVERSATION_TOOL_NAMES = {
  ARCHIVE_CONVERSATION: 'archive_conversation',
  RENAME_CONVERSATION: 'rename_conversation',
  DELETE_CONVERSATION: 'delete_conversation',
  MOVE_CONVERSATION_TO_FOLDER: 'move_conversation_to_folder',
  PIN_CONVERSATION: 'pin_conversation',
  LIST_CONVERSATIONS: 'list_conversations',
} as const

/**
 * Conversation management tools
 */
export const CONVERSATION_MANAGEMENT_TOOLS: Anthropic.Tool[] = [
  {
    name: CONVERSATION_TOOL_NAMES.ARCHIVE_CONVERSATION,
    description: `Archive or unarchive a conversation.

Use this tool when:
- User wants to archive a conversation to reduce clutter
- User asks to "hide" or "put away" a conversation
- User wants to unarchive a previously archived conversation
- User asks "How do I archive this?"

Archiving removes the conversation from the main list but preserves it for later retrieval.
Archived conversations can be viewed by enabling the "Show Archived" filter.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        conversation_id: {
          type: 'string',
          description: 'The ID of the conversation to archive/unarchive',
        },
        archive: {
          type: 'boolean',
          description: 'true to archive, false to unarchive',
        },
      },
      required: ['conversation_id', 'archive'],
    },
  },
  {
    name: CONVERSATION_TOOL_NAMES.RENAME_CONVERSATION,
    description: `Rename a conversation to a more descriptive title.

Use this tool when:
- User wants to change a conversation's title
- User asks to "rename this conversation"
- User wants a more descriptive title than the auto-generated one
- User says "call this [new name]"

Good titles are descriptive and help users identify conversations later.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        conversation_id: {
          type: 'string',
          description: 'The ID of the conversation to rename',
        },
        new_title: {
          type: 'string',
          description:
            'The new title for the conversation (max 100 characters, descriptive)',
        },
      },
      required: ['conversation_id', 'new_title'],
    },
  },
  {
    name: CONVERSATION_TOOL_NAMES.DELETE_CONVERSATION,
    description: `Permanently delete a conversation and all its messages.

**WARNING**: This action is irreversible. The conversation and all its messages will be permanently deleted.

Use this tool when:
- User explicitly requests to delete a conversation
- User confirms they want to permanently remove a conversation
- User says "delete this conversation" or "remove this permanently"

Always confirm with the user before deleting, as this cannot be undone.
Consider suggesting archive as an alternative if user might need the conversation later.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        conversation_id: {
          type: 'string',
          description: 'The ID of the conversation to delete',
        },
        confirm: {
          type: 'boolean',
          description:
            'Must be true to confirm deletion. Prevents accidental deletions.',
        },
      },
      required: ['conversation_id', 'confirm'],
    },
  },
  {
    name: CONVERSATION_TOOL_NAMES.MOVE_CONVERSATION_TO_FOLDER,
    description: `Move a conversation to a folder for organization.

Use this tool when:
- User wants to organize conversations into folders
- User asks to "move this to [folder]"
- User wants to categorize conversations
- User asks "How do I organize conversations?"

Folders help users organize conversations by topic, project, or any other grouping.
Pass null as folder_id to remove a conversation from all folders.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        conversation_id: {
          type: 'string',
          description: 'The ID of the conversation to move',
        },
        folder_id: {
          type: 'string',
          description:
            'The ID of the target folder, or null to remove from folders',
        },
      },
      required: ['conversation_id'],
    },
  },
  {
    name: CONVERSATION_TOOL_NAMES.PIN_CONVERSATION,
    description: `Pin or unpin a conversation to keep it at the top of the list.

Use this tool when:
- User wants to keep an important conversation easily accessible
- User asks to "pin this" or "keep this at the top"
- User wants to unpin a previously pinned conversation
- User asks about keeping conversations visible

Pinned conversations appear at the top of the conversation list, above all unpinned conversations.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        conversation_id: {
          type: 'string',
          description: 'The ID of the conversation to pin/unpin',
        },
        pin: {
          type: 'boolean',
          description: 'true to pin, false to unpin',
        },
      },
      required: ['conversation_id', 'pin'],
    },
  },
  {
    name: CONVERSATION_TOOL_NAMES.LIST_CONVERSATIONS,
    description: `List conversations with optional filtering and sorting.

Use this tool when:
- User asks "What conversations do I have?"
- User wants to find a specific conversation
- User asks about archived/pinned conversations
- User wants to see conversations in a specific folder
- User needs to search through their conversation history

Returns a list of conversations matching the specified filters.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        filter: {
          type: 'object',
          description: 'Filter options',
          properties: {
            search: {
              type: 'string',
              description: 'Search query to filter by title or content',
            },
            show_archived: {
              type: 'boolean',
              description: 'Include archived conversations in results',
            },
            archived_only: {
              type: 'boolean',
              description: 'Show only archived conversations',
            },
            show_pinned: {
              type: 'boolean',
              description: 'Filter to pinned conversations only',
            },
            folder_id: {
              type: 'string',
              description: 'Filter to conversations in specific folder',
            },
          },
        },
        sort: {
          type: 'string',
          enum: ['recent', 'oldest', 'title', 'messages'],
          description: 'How to sort the results',
        },
        limit: {
          type: 'number',
          description:
            'Maximum number of conversations to return (default: 50)',
        },
      },
    },
  },
]

/**
 * Type for conversation tool input parameters
 */
export type ConversationToolInputs = {
  [CONVERSATION_TOOL_NAMES.ARCHIVE_CONVERSATION]: {
    conversation_id: string
    archive: boolean
  }
  [CONVERSATION_TOOL_NAMES.RENAME_CONVERSATION]: {
    conversation_id: string
    new_title: string
  }
  [CONVERSATION_TOOL_NAMES.DELETE_CONVERSATION]: {
    conversation_id: string
    confirm: boolean
  }
  [CONVERSATION_TOOL_NAMES.MOVE_CONVERSATION_TO_FOLDER]: {
    conversation_id: string
    folder_id?: string | null
  }
  [CONVERSATION_TOOL_NAMES.PIN_CONVERSATION]: {
    conversation_id: string
    pin: boolean
  }
  [CONVERSATION_TOOL_NAMES.LIST_CONVERSATIONS]: {
    filter?: {
      search?: string
      show_archived?: boolean
      archived_only?: boolean
      show_pinned?: boolean
      folder_id?: string
    }
    sort?: 'recent' | 'oldest' | 'title' | 'messages'
    limit?: number
  }
}

/**
 * Type for conversation tool outputs
 */
export type ConversationToolOutputs = {
  [CONVERSATION_TOOL_NAMES.ARCHIVE_CONVERSATION]: {
    success: boolean
    conversation_id: string
    is_archived: boolean
    archived_at?: number
    message: string
  }
  [CONVERSATION_TOOL_NAMES.RENAME_CONVERSATION]: {
    success: boolean
    conversation_id: string
    old_title: string
    new_title: string
    message: string
  }
  [CONVERSATION_TOOL_NAMES.DELETE_CONVERSATION]: {
    success: boolean
    conversation_id: string
    message: string
  }
  [CONVERSATION_TOOL_NAMES.MOVE_CONVERSATION_TO_FOLDER]: {
    success: boolean
    conversation_id: string
    folder_id: string | null
    folder_name?: string | null
    message: string
  }
  [CONVERSATION_TOOL_NAMES.PIN_CONVERSATION]: {
    success: boolean
    conversation_id: string
    is_pinned: boolean
    message: string
  }
  [CONVERSATION_TOOL_NAMES.LIST_CONVERSATIONS]: {
    success: boolean
    conversations: Array<{
      id: string
      title: string
      preview: string
      timestamp: number
      message_count: number
      is_pinned?: boolean
      is_archived?: boolean
      folder_id?: string
    }>
    total_count: number
    filter_applied: string
    message: string
  }
}
