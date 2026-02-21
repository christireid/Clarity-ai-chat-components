/**
 * Validation schemas for /api/analytics endpoint
 *
 * Ensures all analytics requests are properly validated.
 */

import { z } from 'zod'
import { commonSchemas } from '@/lib/validation'

/**
 * Query parameters schema for GET /api/analytics
 */
export const analyticsQuerySchema = z.object({
  // Date range
  startDate: commonSchemas.timestamp.optional(),
  endDate: commonSchemas.timestamp.optional(),

  // Period shorthand (alternative to explicit dates)
  period: z.enum(['7d', '30d', '90d']).optional(),
})

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>

/**
 * Request body schema for POST /api/analytics (recent queries)
 */
export const analyticsRequestSchema = z.object({
  // Number of recent queries to fetch
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(1000, 'Limit cannot exceed 1000')
    .default(50)
    .optional(),
})

export type AnalyticsRequest = z.infer<typeof analyticsRequestSchema>

/**
 * Analytics summary data schema
 */
const analyticsSummarySchema = z.object({
  totalQueries: z.number().int().nonnegative(),
  uniqueUsers: z.number().int().nonnegative(),
  averageResponseTime: z.number().nonnegative(),
  cacheHitRate: z.number().min(0).max(1),
  topQueries: z.array(
    z.object({
      query: z.string(),
      count: z.number().int().positive(),
    })
  ),
  queriesByDay: z.array(
    z.object({
      date: z.string(),
      count: z.number().int().nonnegative(),
    })
  ),
})

/**
 * Response schema for GET /api/analytics
 */
export const analyticsResponseSchema = z.object({
  success: z.literal(true),
  data: analyticsSummarySchema,
  timestamp: commonSchemas.timestamp,
})

export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema>

/**
 * Recent query entry schema
 */
const recentQuerySchema = z.object({
  id: z.string(),
  query: z.string(),
  timestamp: commonSchemas.timestamp,
  responseTime: z.number().nonnegative(),
  cached: z.boolean(),
  model: z.string().optional(),
})

/**
 * Response schema for POST /api/analytics (recent queries)
 */
export const analyticsRecentQueriesResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(recentQuerySchema),
  count: z.number().int().nonnegative(),
  timestamp: commonSchemas.timestamp,
})

export type AnalyticsRecentQueriesResponse = z.infer<
  typeof analyticsRecentQueriesResponseSchema
>

/**
 * Error response schema
 */
export const analyticsErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
})

export type AnalyticsError = z.infer<typeof analyticsErrorSchema>
