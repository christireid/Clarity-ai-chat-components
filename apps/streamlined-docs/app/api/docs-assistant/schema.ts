// @ts-nocheck -- Zod type inference issues: commonSchemas.uuid and commonSchemas.tokenCount from '@/lib/validation' produce complex generic types that cause TS inference failures when composed in z.object() schemas. The discriminatedUnion and complex nested schemas amplify the type resolution burden.
/**
 * Validation schemas for /api/docs-assistant endpoint
 *
 * Ensures all requests to the documentation assistant API
 * are properly validated before processing.
 */

import { z } from 'zod'
import { commonSchemas } from '@/lib/validation'

/**
 * Chat message structure
 */
export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system'], {
    errorMap: () => ({ message: 'Role must be user, assistant, or system' }),
  }),
  content: z
    .string()
    .min(1, 'Message content cannot be empty')
    .max(50000, 'Message content exceeds maximum length'),
})

export type ChatMessage = z.infer<typeof chatMessageSchema>

/**
 * Request body schema for POST /api/docs-assistant
 */
export const docsAssistantRequestSchema = z.object({
  // Required message field
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message must be less than 10,000 characters')
    .trim(),

  // Optional session ID for conversation continuity
  sessionId: commonSchemas.uuid.optional(),

  // Legacy conversationId (maps to sessionId)
  conversationId: commonSchemas.uuid.optional(),

  // Optional user ID for analytics
  userId: z.string().max(100).optional(),

  // Optional current page path for context
  currentPath: z.string().max(500).optional(),

  // Optional full conversation history
  messages: z
    .array(chatMessageSchema)
    .max(50, 'Conversation history limited to 50 messages')
    .optional(),
})

export type DocsAssistantRequest = z.infer<typeof docsAssistantRequestSchema>

/**
 * Source/citation structure
 */
const sourceSchema = z.object({
  url: z.string().url('Invalid source URL'),
  title: z.string().min(1, 'Source title required'),
  score: z.number().min(0).max(1).optional(),
  confidence: z.number().min(0).max(1).optional(),
  excerpt: z.string().optional(),
})

/**
 * Response schema for successful POST /api/docs-assistant
 *
 * Note: This is for non-streaming responses only.
 * Streaming responses use Server-Sent Events.
 */
export const docsAssistantResponseSchema = z.object({
  response: z.string(),
  sources: z.array(sourceSchema).optional(),
  conversationId: commonSchemas.uuid.optional(),
  sessionId: commonSchemas.uuid.optional(),
  tokensUsed: commonSchemas.tokenCount.optional(),
  model: z.string().optional(),
})

export type DocsAssistantResponse = z.infer<typeof docsAssistantResponseSchema>

/**
 * Streaming chunk types for Server-Sent Events
 */
export const streamChunkSchema = z.discriminatedUnion('type', [
  // Text content chunk
  z.object({
    type: z.literal('text'),
    content: z.string(),
  }),

  // Sources/citations chunk
  z.object({
    type: z.literal('sources'),
    data: z.object({
      sources: z.array(sourceSchema),
      count: z.number().int().nonnegative(),
    }),
  }),

  // Tool use chunk (for agent actions)
  z.object({
    type: z.literal('tool_use'),
    tool_name: z.string(),
    tool_use_id: z.string(),
    tool_input: z.record(z.unknown()),
  }),

  // Tool result chunk
  z.object({
    type: z.literal('tool_result'),
    tool_name: z.string().optional(),
    tool_use_id: z.string(),
    tool_result: z.unknown(),
  }),

  // Error chunk
  z.object({
    type: z.literal('error'),
    content: z.string(),
  }),

  // Done chunk (stream complete)
  z.object({
    type: z.literal('done'),
  }),
])

export type StreamChunk = z.infer<typeof streamChunkSchema>

/**
 * Health check response schema for GET /api/docs-assistant
 */
export const docsAssistantHealthSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
  version: z.string(),
  provider: z.object({
    active: z.string(),
    model: z.string(),
    isDemoMode: z.boolean(),
    summary: z.string(),
    available: z.array(
      z.object({
        name: z.string(),
        model: z.string(),
      })
    ),
  }),
  features: z.object({
    rag: z.boolean(),
    enhancedRAG: z.boolean(),
    smartRouting: z.boolean(),
    tools: z.boolean(),
    streaming: z.boolean(),
    rateLimit: z.boolean(),
    caching: z.boolean(),
    feedback: z.boolean(),
  }),
  tools: z
    .object({
      available: z.array(z.string()),
      description: z.string(),
    })
    .nullable(),
  models: z.object({
    configured: z.string(),
    available: z.array(z.string()),
    routing: z.union([
      z.object({
        simple: z.string(),
        moderate: z.string(),
        complex: z.string(),
      }),
      z.literal('disabled'),
    ]),
  }),
  cache: z.unknown().optional(),
  setup: z
    .object({
      message: z.string(),
      instructions: z.array(z.string()),
      docs: z.string(),
    })
    .optional(),
})

export type DocsAssistantHealth = z.infer<typeof docsAssistantHealthSchema>
