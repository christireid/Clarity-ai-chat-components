/**
 * User Management Tool Definitions
 *
 * Agent-native tools for CRUD operations on user profiles and settings.
 * These tools enable agents to manage user data with full action parity.
 *
 * **Principle**: Action Parity - "Whatever the user can do, the agent can do"
 *
 * @module tools/user-management
 */

import type Anthropic from '@anthropic-ai/sdk'

/**
 * User management tool names
 */
export const USER_TOOL_NAMES = {
  UPDATE_USER_PROFILE: 'update_user_profile',
  UPDATE_USER_SETTINGS: 'update_user_settings',
  GET_USER_PROFILE: 'get_user_profile',
  GET_USER_SETTINGS: 'get_user_settings',
} as const

export type UserToolName =
  (typeof USER_TOOL_NAMES)[keyof typeof USER_TOOL_NAMES]

/**
 * Type-safe input types for user management tools
 */
export interface UserToolInputs {
  [USER_TOOL_NAMES.UPDATE_USER_PROFILE]: {
    userId: string
    updates: {
      name?: string
      email?: string
      avatar?: string
      bio?: string
      website?: string
      timezone?: string
      language?: string
    }
  }
  [USER_TOOL_NAMES.UPDATE_USER_SETTINGS]: {
    userId: string
    settings: {
      theme?: 'light' | 'dark' | 'auto'
      notifications?: boolean
      language?: string
      autoSave?: boolean
      soundEffects?: boolean
    }
  }
  [USER_TOOL_NAMES.GET_USER_PROFILE]: {
    userId: string
  }
  [USER_TOOL_NAMES.GET_USER_SETTINGS]: {
    userId: string
  }
}

/**
 * Type-safe output types for user management tools
 */
export interface UserToolOutputs {
  [USER_TOOL_NAMES.UPDATE_USER_PROFILE]: {
    success: boolean
    user: {
      id: string
      name: string
      email: string
      avatar?: string
      bio?: string
      website?: string
      timezone?: string
      language?: string
      updatedAt: string
    }
    message: string
  }
  [USER_TOOL_NAMES.UPDATE_USER_SETTINGS]: {
    success: boolean
    settings: {
      theme: 'light' | 'dark' | 'auto'
      notifications: boolean
      language: string
      autoSave: boolean
      soundEffects: boolean
      updatedAt: string
    }
    message: string
  }
  [USER_TOOL_NAMES.GET_USER_PROFILE]: {
    user: {
      id: string
      name: string
      email: string
      avatar?: string
      bio?: string
      website?: string
      timezone?: string
      language?: string
      createdAt: string
      updatedAt: string
    }
  }
  [USER_TOOL_NAMES.GET_USER_SETTINGS]: {
    settings: {
      theme: 'light' | 'dark' | 'auto'
      notifications: boolean
      language: string
      autoSave: boolean
      soundEffects: boolean
    }
  }
}

/**
 * User Management Tool Definitions for Claude API
 */
export const USER_MANAGEMENT_TOOLS: Anthropic.Tool[] = [
  {
    name: USER_TOOL_NAMES.UPDATE_USER_PROFILE,
    description: `Update user profile information. Use this tool when:
- User asks to change their name, email, or avatar
- User wants to update their bio or personal information
- User asks to set their timezone or language preference
- User needs to update their website URL

**Security**: This is a mutating operation that requires user confirmation.
**Action Parity**: Users can update their profile via Settings UI, agent should be able to do the same.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user whose profile to update',
        },
        updates: {
          type: 'object',
          description: 'Fields to update in the user profile',
          properties: {
            name: {
              type: 'string',
              description: 'Updated display name',
            },
            email: {
              type: 'string',
              description: 'Updated email address (must be valid email format)',
            },
            avatar: {
              type: 'string',
              description: 'URL to updated avatar image',
            },
            bio: {
              type: 'string',
              description: 'Short bio or description',
            },
            website: {
              type: 'string',
              description: 'Personal website URL',
            },
            timezone: {
              type: 'string',
              description: 'Timezone in IANA format (e.g., "America/New_York")',
            },
            language: {
              type: 'string',
              description:
                'Preferred language in BCP 47 format (e.g., "en-US", "es-ES")',
            },
          },
        },
      },
      required: ['userId', 'updates'],
    },
  },
  {
    name: USER_TOOL_NAMES.UPDATE_USER_SETTINGS,
    description: `Update user preferences and settings. Use this tool when:
- User asks to change theme (light/dark/auto)
- User wants to enable/disable notifications
- User asks to change language preference
- User wants to toggle auto-save or sound effects

**Security**: This is a mutating operation but generally safe (no data loss risk).
**Action Parity**: Users can update settings via UI, agent should match this capability.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user whose settings to update',
        },
        settings: {
          type: 'object',
          description: 'Settings to update',
          properties: {
            theme: {
              type: 'string',
              enum: ['light', 'dark', 'auto'],
              description:
                'Color theme preference (light, dark, or auto-detect)',
            },
            notifications: {
              type: 'boolean',
              description: 'Whether to enable push notifications',
            },
            language: {
              type: 'string',
              description:
                'UI language in BCP 47 format (e.g., "en-US", "es-ES")',
            },
            autoSave: {
              type: 'boolean',
              description: 'Whether to automatically save drafts',
            },
            soundEffects: {
              type: 'boolean',
              description: 'Whether to play UI sound effects',
            },
          },
        },
      },
      required: ['userId', 'settings'],
    },
  },
  {
    name: USER_TOOL_NAMES.GET_USER_PROFILE,
    description: `Get user profile information. Use this tool when:
- You need to check current user profile data
- User asks "what's my email?" or "what's my current name?"
- You need to verify user information before updating
- User asks about their profile information

**Security**: Read-only operation, safe to call without approval.
**Action Parity**: Users can view their profile in Settings UI.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user whose profile to retrieve',
        },
      },
      required: ['userId'],
    },
  },
  {
    name: USER_TOOL_NAMES.GET_USER_SETTINGS,
    description: `Get user settings and preferences. Use this tool when:
- You need to check current theme or notification settings
- User asks "what theme am I using?" or "are notifications enabled?"
- You need to verify settings before updating
- User asks about their current preferences

**Security**: Read-only operation, safe to call without approval.
**Action Parity**: Users can view their settings in Settings UI.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user whose settings to retrieve',
        },
      },
      required: ['userId'],
    },
  },
]
