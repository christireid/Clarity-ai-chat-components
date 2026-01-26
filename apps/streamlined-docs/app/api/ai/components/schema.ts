/**
 * Validation schemas for /api/ai/components endpoint
 *
 * Ensures all requests to the AI components API
 * are properly validated before processing.
 */

import { z } from 'zod'

/**
 * Component categories enum
 */
export const componentCategorySchema = z.enum([
  'core',
  'ui',
  'input',
  'display',
  'feedback',
  'interactive',
  'analytics',
  'enterprise',
  'provider',
  'utility',
])

export type ComponentCategory = z.infer<typeof componentCategorySchema>

/**
 * Query parameters schema for GET /api/ai/components
 */
export const componentsQuerySchema = z.object({
  // Filter by category
  category: componentCategorySchema.optional(),

  // Search by name or description
  search: z.string().max(100).optional(),

  // Limit number of results
  limit: z.coerce.number().int().min(1).max(100).default(50).optional(),

  // Include examples in response
  includeExamples: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),

  // Format output (json or markdown)
  format: z.enum(['json', 'markdown']).default('json').optional(),
})

export type ComponentsQuery = z.infer<typeof componentsQuerySchema>

/**
 * Component prop definition schema
 */
const componentPropSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  default: z.string().optional(),
  description: z.string(),
})

/**
 * Component info schema
 */
const componentInfoSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: componentCategorySchema,
  props: z.array(componentPropSchema),
  importPath: z.string(),
  docsUrl: z.string().url(),
  examples: z.array(z.string()).optional(),
  relatedComponents: z.array(z.string()).optional(),
  accessibility: z.array(z.string()).optional(),
  version: z.string(),
})

/**
 * Response schema for GET /api/ai/components
 */
export const componentsResponseSchema = z.object({
  name: z.string(),
  version: z.string(),
  apiVersion: z.string(),
  description: z.string(),
  totalComponents: z.number().int().nonnegative(),
  categories: z.array(componentCategorySchema),
  lastUpdated: z.string(),
  components: z.array(componentInfoSchema),
  usage: z.object({
    installation: z.string(),
    basicImport: z.string(),
    documentation: z.string().url(),
  }),
  dataSource: z
    .object({
      curated: z.number().int().nonnegative(),
      generatedCount: z.number().int().nonnegative(),
    })
    .catchall(z.unknown())
    .optional(),
})

export type ComponentsResponse = z.infer<typeof componentsResponseSchema>

/**
 * Error response schema
 */
export const componentsErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
  timestamp: z.string(),
  path: z.string(),
  details: z.string().optional(),
})

export type ComponentsError = z.infer<typeof componentsErrorSchema>
