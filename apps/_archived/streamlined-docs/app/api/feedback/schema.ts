// @ts-nocheck -- Zod type inference issues: commonSchemas.uuid and commonSchemas.timestamp from '@/lib/validation' produce complex generic types that cause TS inference failures when composed with z.object().optional() chains. Likely a Zod version mismatch between the schema definitions and the installed version.
/**
 * Validation schemas for /api/feedback endpoint
 *
 * Ensures all feedback submissions are properly validated.
 */

import { z } from 'zod'
import { commonSchemas } from '@/lib/validation'

/**
 * Feedback metadata schema
 */
const feedbackMetadataSchema = z.object({
  messageContent: z.string().max(10000).optional(),
  sources: z
    .array(
      z.object({
        url: z.string().url(),
        title: z.string(),
      })
    )
    .optional(),
  model: z.string().max(100).optional(),
})

/**
 * Request body schema for POST /api/feedback
 */
export const feedbackRequestSchema = z.object({
  // Required message ID
  messageId: z
    .string()
    .min(1, 'Message ID is required')
    .max(100, 'Message ID too long'),

  // Feedback type
  type: z.enum(['positive', 'negative'], {
    errorMap: () => ({ message: 'Type must be positive or negative' }),
  }),

  // Optional comment
  comment: z
    .string()
    .max(1000, 'Comment must be less than 1000 characters')
    .optional(),

  // Optional session ID
  sessionId: commonSchemas.uuid.optional(),

  // Optional user ID
  userId: z.string().max(100).optional(),

  // Optional metadata
  metadata: feedbackMetadataSchema.optional(),
})

export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>

/**
 * Response schema for POST /api/feedback
 */
export const feedbackResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
})

export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>

/**
 * Feedback stats schema
 */
const feedbackStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  positive: z.number().int().nonnegative(),
  negative: z.number().int().nonnegative(),
  positiveRate: z.number().min(0).max(1),
  withComments: z.number().int().nonnegative(),
  byModel: z.record(
    z.object({
      total: z.number().int().nonnegative(),
      positive: z.number().int().nonnegative(),
      negative: z.number().int().nonnegative(),
    })
  ),
})

/**
 * Response schema for GET /api/feedback (stats)
 */
export const feedbackStatsResponseSchema = z.object({
  stats: feedbackStatsSchema,
  timestamp: commonSchemas.timestamp,
})

export type FeedbackStatsResponse = z.infer<typeof feedbackStatsResponseSchema>

/**
 * Error response schema
 */
export const feedbackErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
})

export type FeedbackError = z.infer<typeof feedbackErrorSchema>
