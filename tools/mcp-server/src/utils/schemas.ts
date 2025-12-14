/**
 * Zod schemas for MCP tool input validation
 *
 * Industry-standard schema validation using Zod for type-safe
 * input validation with automatic TypeScript type inference.
 */

import { z } from 'zod'
import { ValidationError } from './errors.js'

// =============================================================================
// Token Limits Configuration
// =============================================================================

/** Maximum tokens for model context windows (reasonable upper bound) */
const MAX_CONTEXT_TOKENS = 2000000 // 2M for largest models like GPT-4 Turbo

// =============================================================================
// Common Schemas
// =============================================================================

/**
 * AI Provider enum
 */
export const ProviderSchema = z.enum(['openai', 'anthropic', 'google', 'all'])
export type Provider = z.infer<typeof ProviderSchema>

/**
 * Framework enum
 */
export const FrameworkSchema = z.enum([
  'nextjs',
  'express',
  'hono',
  'standalone',
])
export type Framework = z.infer<typeof FrameworkSchema>

/**
 * Component category enum
 */
export const ComponentCategorySchema = z.enum([
  'top-level',
  'chat',
  'message',
  'input',
  'display',
  'feedback',
  'navigation',
  'analytics',
  'enterprise',
  'ai-ops',
  'memory',
  'primitives',
  'hooks',
  'utilities',
])
export type ComponentCategory = z.infer<typeof ComponentCategorySchema>

/**
 * Safe path validation - prevents directory traversal
 */
const safePathRegex = /^(?!.*\.\.)(?!.*\/\/)[\w\-./\\:]+$/
export const SafePathSchema = z
  .string()
  .min(1, 'Path cannot be empty')
  .max(500, 'Path too long')
  .regex(
    safePathRegex,
    'Invalid path: contains forbidden characters or patterns'
  )
  .refine((path) => {
    const lowerPath = path.toLowerCase()
    const dangerousPaths = [
      '/etc',
      '/usr',
      '/bin',
      '/sbin',
      '/var',
      '/sys',
      '/proc',
      'c:\\windows',
      'c:\\system32',
    ]
    return !dangerousPaths.some((dangerous) => lowerPath.includes(dangerous))
  }, 'Invalid path: cannot reference system directories')

// =============================================================================
// Tool Input Schemas
// =============================================================================

/**
 * init_project tool input
 */
export const InitProjectSchema = z.object({
  provider: ProviderSchema.describe('AI provider to configure'),
  framework: FrameworkSchema.describe('Framework to use for the project'),
  projectPath: SafePathSchema.describe(
    'Path where the project should be created'
  ),
})
export type InitProjectInput = z.infer<typeof InitProjectSchema>

/**
 * get_example tool input
 */
export const GetExampleSchema = z.object({
  exampleName: z
    .string()
    .min(1, 'Example name is required')
    .max(100, 'Example name too long')
    .describe('Name of the example to retrieve'),
})
export type GetExampleInput = z.infer<typeof GetExampleSchema>

/**
 * validate_config tool input
 */
export const ValidateConfigSchema = z.object({
  projectPath: SafePathSchema.describe(
    'Path to the project directory to validate'
  ),
})
export type ValidateConfigInput = z.infer<typeof ValidateConfigSchema>

/**
 * get_model_info tool input
 */
export const GetModelInfoSchema = z.object({
  modelName: z
    .string()
    .min(1, 'Model name is required')
    .max(100, 'Model name too long')
    .describe('Name of the AI model'),
})
export type GetModelInfoInput = z.infer<typeof GetModelInfoSchema>

/**
 * calculate_cost tool input
 */
export const CalculateCostSchema = z.object({
  modelName: z
    .string()
    .min(1, 'Model name is required')
    .describe('Name of the AI model'),
  promptTokens: z
    .number()
    .int('Prompt tokens must be an integer')
    .min(0, 'Prompt tokens cannot be negative')
    .max(MAX_CONTEXT_TOKENS, `Prompt tokens cannot exceed ${MAX_CONTEXT_TOKENS}`)
    .describe('Number of input/prompt tokens'),
  completionTokens: z
    .number()
    .int('Completion tokens must be an integer')
    .min(0, 'Completion tokens cannot be negative')
    .max(MAX_CONTEXT_TOKENS, `Completion tokens cannot exceed ${MAX_CONTEXT_TOKENS}`)
    .describe('Number of output/completion tokens'),
})
export type CalculateCostInput = z.infer<typeof CalculateCostSchema>

/**
 * analyze_project tool input
 */
export const AnalyzeProjectSchema = z.object({
  projectPath: SafePathSchema.describe(
    'Path to the project directory to analyze'
  ),
})
export type AnalyzeProjectInput = z.infer<typeof AnalyzeProjectSchema>

// =============================================================================
// New Component Discovery Schemas
// =============================================================================

/**
 * clarity_discover_components tool input
 */
export const DiscoverComponentsSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(200, 'Search query too long')
    .describe(
      'Search query for components (e.g., "chat input", "message list", "streaming")'
    ),
  category: ComponentCategorySchema.optional().describe(
    'Filter by component category'
  ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .optional()
    .describe('Maximum number of results to return'),
})
export type DiscoverComponentsInput = z.infer<typeof DiscoverComponentsSchema>

/**
 * clarity_get_component_docs tool input
 */
export const GetComponentDocsSchema = z.object({
  componentName: z
    .string()
    .min(1, 'Component name is required')
    .max(100, 'Component name too long')
    .describe(
      'Name of the component (e.g., "ClarityChat", "ChatInput", "MessageList")'
    ),
})
export type GetComponentDocsInput = z.infer<typeof GetComponentDocsSchema>

/**
 * clarity_get_component_types tool input
 */
export const GetComponentTypesSchema = z.object({
  componentName: z
    .string()
    .min(1, 'Component name is required')
    .max(100, 'Component name too long')
    .describe('Name of the component to get TypeScript types for'),
})
export type GetComponentTypesInput = z.infer<typeof GetComponentTypesSchema>

/**
 * clarity_discover_hooks tool input
 */
export const DiscoverHooksSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(200, 'Search query too long')
    .describe('Search query for hooks (e.g., "chat", "streaming", "voice")'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .optional()
    .describe('Maximum number of results to return'),
})
export type DiscoverHooksInput = z.infer<typeof DiscoverHooksSchema>

/**
 * clarity_get_hook_docs tool input
 */
export const GetHookDocsSchema = z.object({
  hookName: z
    .string()
    .min(1, 'Hook name is required')
    .max(100, 'Hook name too long')
    .describe('Name of the hook (e.g., "useClarityChat", "useVoiceInput")'),
})
export type GetHookDocsInput = z.infer<typeof GetHookDocsSchema>

/**
 * clarity_get_accessibility tool input
 */
export const GetAccessibilitySchema = z.object({
  componentName: z
    .string()
    .min(1, 'Component name is required')
    .max(100, 'Component name too long')
    .describe('Name of the component to get accessibility guidance for'),
})
export type GetAccessibilityInput = z.infer<typeof GetAccessibilitySchema>

/**
 * clarity_generate_code tool input
 */
export const CodeVariantSchema = z.enum(['basic', 'typescript', 'complete'])
export type CodeVariant = z.infer<typeof CodeVariantSchema>

export const GenerateCodeSchema = z.object({
  componentName: z
    .string()
    .min(1, 'Component name is required')
    .max(100, 'Component name too long')
    .describe('Name of the component to generate code for'),
  variant: CodeVariantSchema.describe(
    'Code variant: basic, typescript, or complete'
  ),
  withProvider: z
    .boolean()
    .default(false)
    .optional()
    .describe('Include provider/context wrapper'),
  typescript: z
    .boolean()
    .default(true)
    .optional()
    .describe('Generate TypeScript code'),
})
export type GenerateCodeInput = z.infer<typeof GenerateCodeSchema>

/**
 * clarity_get_related_components tool input
 */
export const GetRelatedComponentsSchema = z.object({
  componentName: z
    .string()
    .min(1, 'Component name is required')
    .max(100, 'Component name too long')
    .describe('Name of the component to find related components for'),
})
export type GetRelatedComponentsInput = z.infer<
  typeof GetRelatedComponentsSchema
>

// =============================================================================
// Prompt Input Schemas
// =============================================================================

/**
 * implement-feature prompt input
 */
export const ImplementFeaturePromptSchema = z.object({
  feature: z
    .string()
    .min(1, 'Feature description is required')
    .max(2000, 'Feature description too long')
    .describe('Description of the feature to implement'),
  provider: z
    .string()
    .max(50)
    .optional()
    .describe('AI provider to use (openai, anthropic, google)'),
})
export type ImplementFeaturePromptInput = z.infer<
  typeof ImplementFeaturePromptSchema
>

/**
 * debug-issue prompt input
 */
export const DebugIssuePromptSchema = z.object({
  issue: z
    .string()
    .min(1, 'Issue description is required')
    .max(2000, 'Issue description too long')
    .describe('Description of the issue'),
  code: z
    .string()
    .max(10000, 'Code snippet too long')
    .optional()
    .describe('Relevant code snippet'),
})
export type DebugIssuePromptInput = z.infer<typeof DebugIssuePromptSchema>

/**
 * optimize-performance prompt input
 */
export const OptimizePerformancePromptSchema = z.object({
  context: z
    .string()
    .min(1, 'Context is required')
    .max(5000, 'Context too long')
    .describe('Context about current implementation'),
})
export type OptimizePerformancePromptInput = z.infer<
  typeof OptimizePerformancePromptSchema
>

/**
 * review-code prompt input
 */
export const ReviewCodePromptSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(20000, 'Code too long')
    .describe('Code to review'),
  focus: z
    .string()
    .max(100)
    .optional()
    .describe(
      'Specific aspect to focus on (security, performance, readability)'
    ),
})
export type ReviewCodePromptInput = z.infer<typeof ReviewCodePromptSchema>

/**
 * convert-example prompt input
 */
export const ConvertExamplePromptSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(20000, 'Code too long')
    .describe('Original code to convert'),
  from: z
    .string()
    .min(1, 'Source provider/framework is required')
    .max(50)
    .describe('Source provider/framework'),
  to: z
    .string()
    .min(1, 'Target provider/framework is required')
    .max(50)
    .describe('Target provider/framework'),
})
export type ConvertExamplePromptInput = z.infer<
  typeof ConvertExamplePromptSchema
>

// =============================================================================
// Validation Helper
// =============================================================================

/**
 * Validate input against a schema and return typed result or throw
 */
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  const result = schema.safeParse(input)
  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ')
    throw new ValidationError(`Validation failed: ${errors}`, {
      errors: result.error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
        code: e.code,
      })),
    })
  }
  return result.data
}
