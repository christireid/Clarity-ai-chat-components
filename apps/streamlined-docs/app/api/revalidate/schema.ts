/**
 * Validation schemas for /api/revalidate endpoint
 *
 * Ensures all cache revalidation requests are properly validated.
 */

import { z } from 'zod'

/**
 * Request body schema for POST /api/revalidate
 */
export const revalidateRequestSchema = z.object({
  // Revalidate by path
  path: z
    .string()
    .regex(/^\//, 'Path must start with /')
    .max(500, 'Path must be less than 500 characters')
    .optional(),

  // Revalidate by tag
  tag: z
    .string()
    .min(1, 'Tag cannot be empty')
    .max(100, 'Tag must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Tag must be lowercase alphanumeric with hyphens')
    .optional(),
}).refine((data) => data.path || data.tag, {
  message: 'Either path or tag must be provided',
})

export type RevalidateRequest = z.infer<typeof revalidateRequestSchema>

/**
 * Response schema for successful revalidation
 */
export const revalidateResponseSchema = z.object({
  revalidated: z.literal(true),
  method: z.enum(['path', 'tag']),
  path: z.string().optional(),
  tag: z.string().optional(),
  timestamp: z.string().datetime(),
  now: z.number().int().positive(),
})

export type RevalidateResponse = z.infer<typeof revalidateResponseSchema>

/**
 * Error response schema
 */
export const revalidateErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
})

export type RevalidateError = z.infer<typeof revalidateErrorSchema>
