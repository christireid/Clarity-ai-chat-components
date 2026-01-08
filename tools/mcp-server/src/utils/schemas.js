/**
 * Zod schemas for MCP tool input validation
 *
 * Industry-standard schema validation using Zod for type-safe
 * input validation with automatic TypeScript type inference.
 */
import { z } from 'zod';
import { ValidationError } from './errors.js';
// =============================================================================
// Token Limits Configuration
// =============================================================================
/** Maximum tokens for model context windows (reasonable upper bound) */
const MAX_CONTEXT_TOKENS = 2000000; // 2M for largest models like GPT-4 Turbo
// =============================================================================
// Common Schemas
// =============================================================================
/**
 * AI Provider enum
 */
export const ProviderSchema = z.enum(['openai', 'anthropic', 'google', 'all']);
/**
 * Framework enum
 */
export const FrameworkSchema = z.enum([
    'nextjs',
    'express',
    'hono',
    'standalone',
]);
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
]);
/**
 * Safe path validation - prevents directory traversal
 */
const safePathRegex = /^(?!.*\.\.)(?!.*\/\/)[\w\-./\\:]+$/;
export const SafePathSchema = z
    .string()
    .min(1, 'Path cannot be empty')
    .max(500, 'Path too long')
    .regex(safePathRegex, 'Invalid path: contains forbidden characters or patterns')
    .refine((path) => {
    const lowerPath = path.toLowerCase();
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
    ];
    return !dangerousPaths.some((dangerous) => lowerPath.includes(dangerous));
}, 'Invalid path: cannot reference system directories');
// =============================================================================
// Tool Input Schemas
// =============================================================================
/**
 * init_project tool input
 */
export const InitProjectSchema = z.object({
    provider: ProviderSchema.describe('AI provider to configure'),
    framework: FrameworkSchema.describe('Framework to use for the project'),
    projectPath: SafePathSchema.describe('Path where the project should be created'),
});
/**
 * get_example tool input
 */
export const GetExampleSchema = z.object({
    exampleName: z
        .string()
        .min(1, 'Example name is required')
        .max(100, 'Example name too long')
        .describe('Name of the example to retrieve'),
});
/**
 * validate_config tool input
 */
export const ValidateConfigSchema = z.object({
    projectPath: SafePathSchema.describe('Path to the project directory to validate'),
});
/**
 * get_model_info tool input
 */
export const GetModelInfoSchema = z.object({
    modelName: z
        .string()
        .min(1, 'Model name is required')
        .max(100, 'Model name too long')
        .describe('Name of the AI model'),
});
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
});
/**
 * analyze_project tool input
 */
export const AnalyzeProjectSchema = z.object({
    projectPath: SafePathSchema.describe('Path to the project directory to analyze'),
});
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
        .describe('Search query for components (e.g., "chat input", "message list", "streaming")'),
    category: ComponentCategorySchema.optional().describe('Filter by component category'),
    limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(10)
        .optional()
        .describe('Maximum number of results to return'),
});
/**
 * clarity_get_component_docs tool input
 */
export const GetComponentDocsSchema = z.object({
    componentName: z
        .string()
        .min(1, 'Component name is required')
        .max(100, 'Component name too long')
        .describe('Name of the component (e.g., "ClarityChat", "ChatInput", "MessageList")'),
});
/**
 * clarity_get_component_types tool input
 */
export const GetComponentTypesSchema = z.object({
    componentName: z
        .string()
        .min(1, 'Component name is required')
        .max(100, 'Component name too long')
        .describe('Name of the component to get TypeScript types for'),
});
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
});
/**
 * clarity_get_hook_docs tool input
 */
export const GetHookDocsSchema = z.object({
    hookName: z
        .string()
        .min(1, 'Hook name is required')
        .max(100, 'Hook name too long')
        .describe('Name of the hook (e.g., "useClarityChat", "useVoiceInput")'),
});
/**
 * clarity_get_accessibility tool input
 */
export const GetAccessibilitySchema = z.object({
    componentName: z
        .string()
        .min(1, 'Component name is required')
        .max(100, 'Component name too long')
        .describe('Name of the component to get accessibility guidance for'),
});
/**
 * clarity_generate_code tool input
 */
export const CodeVariantSchema = z.enum(['basic', 'typescript', 'complete']);
export const GenerateCodeSchema = z.object({
    componentName: z
        .string()
        .min(1, 'Component name is required')
        .max(100, 'Component name too long')
        .describe('Name of the component to generate code for'),
    variant: CodeVariantSchema.describe('Code variant: basic, typescript, or complete'),
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
});
/**
 * clarity_get_related_components tool input
 */
export const GetRelatedComponentsSchema = z.object({
    componentName: z
        .string()
        .min(1, 'Component name is required')
        .max(100, 'Component name too long')
        .describe('Name of the component to find related components for'),
});
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
});
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
});
/**
 * optimize-performance prompt input
 */
export const OptimizePerformancePromptSchema = z.object({
    context: z
        .string()
        .min(1, 'Context is required')
        .max(5000, 'Context too long')
        .describe('Context about current implementation'),
});
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
        .describe('Specific aspect to focus on (security, performance, readability)'),
});
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
});
// =============================================================================
// Validation Helper
// =============================================================================
/**
 * Validate input against a schema and return typed result or throw
 */
export function validateInput(schema, input) {
    const result = schema.safeParse(input);
    if (!result.success) {
        const errors = result.error.errors
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join('; ');
        throw new ValidationError(`Validation failed: ${errors}`, {
            errors: result.error.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
                code: e.code,
            })),
        });
    }
    return result.data;
}
//# sourceMappingURL=schemas.js.map