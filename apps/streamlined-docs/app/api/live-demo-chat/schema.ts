/**
 * Validation schemas for /api/live-demo-chat endpoint
 *
 * Ensures all requests to the live demo chat API
 * are properly validated before processing.
 */

import { z } from 'zod'

/**
 * Request body schema for POST /api/live-demo-chat
 */
export const liveDemoChatRequestSchema = z.object({
  // Required message field (max 4KB for demo)
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(4096, 'Message must be less than 4,096 characters')
    .trim(),
})

export type LiveDemoChatRequest = z.infer<typeof liveDemoChatRequestSchema>

/**
 * Response schema for POST /api/live-demo-chat
 *
 * Note: This is a streaming endpoint that returns plain text,
 * not JSON. This schema is for documentation purposes only.
 */
export const liveDemoChatResponseSchema = z.object({
  // Stream returns plain text chunks, not structured JSON
  text: z.string(),
})

export type LiveDemoChatResponse = z.infer<typeof liveDemoChatResponseSchema>

/**
 * Error response schema for validation failures
 */
export const liveDemoChatErrorSchema = z.object({
  error: z.string(),
  retryAfter: z.number().int().positive().optional(),
})

export type LiveDemoChatError = z.infer<typeof liveDemoChatErrorSchema>

/**
 * Health check response schema for GET /api/live-demo-chat
 */
export const liveDemoChatHealthSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
  hasAnthropicKey: z.boolean(),
})

export type LiveDemoChatHealth = z.infer<typeof liveDemoChatHealthSchema>
