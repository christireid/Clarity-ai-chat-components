/**
 * Zod schemas for MCP tool input validation
 *
 * Industry-standard schema validation using Zod for type-safe
 * input validation with automatic TypeScript type inference.
 */
import { z } from 'zod';
/**
 * AI Provider enum
 */
export declare const ProviderSchema: z.ZodEnum<["openai", "anthropic", "google", "all"]>;
export type Provider = z.infer<typeof ProviderSchema>;
/**
 * Framework enum
 */
export declare const FrameworkSchema: z.ZodEnum<["nextjs", "express", "hono", "standalone"]>;
export type Framework = z.infer<typeof FrameworkSchema>;
/**
 * Component category enum
 */
export declare const ComponentCategorySchema: z.ZodEnum<["top-level", "chat", "message", "input", "display", "feedback", "navigation", "analytics", "enterprise", "ai-ops", "memory", "primitives", "hooks", "utilities"]>;
export type ComponentCategory = z.infer<typeof ComponentCategorySchema>;
export declare const SafePathSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * init_project tool input
 */
export declare const InitProjectSchema: z.ZodObject<{
    provider: z.ZodEnum<["openai", "anthropic", "google", "all"]>;
    framework: z.ZodEnum<["nextjs", "express", "hono", "standalone"]>;
    projectPath: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    provider: "all" | "openai" | "anthropic" | "google";
    framework: "standalone" | "nextjs" | "express" | "hono";
    projectPath: string;
}, {
    provider: "all" | "openai" | "anthropic" | "google";
    framework: "standalone" | "nextjs" | "express" | "hono";
    projectPath: string;
}>;
export type InitProjectInput = z.infer<typeof InitProjectSchema>;
/**
 * get_example tool input
 */
export declare const GetExampleSchema: z.ZodObject<{
    exampleName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    exampleName: string;
}, {
    exampleName: string;
}>;
export type GetExampleInput = z.infer<typeof GetExampleSchema>;
/**
 * validate_config tool input
 */
export declare const ValidateConfigSchema: z.ZodObject<{
    projectPath: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    projectPath: string;
}, {
    projectPath: string;
}>;
export type ValidateConfigInput = z.infer<typeof ValidateConfigSchema>;
/**
 * get_model_info tool input
 */
export declare const GetModelInfoSchema: z.ZodObject<{
    modelName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    modelName: string;
}, {
    modelName: string;
}>;
export type GetModelInfoInput = z.infer<typeof GetModelInfoSchema>;
/**
 * calculate_cost tool input
 */
export declare const CalculateCostSchema: z.ZodObject<{
    modelName: z.ZodString;
    promptTokens: z.ZodNumber;
    completionTokens: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    modelName: string;
    promptTokens: number;
    completionTokens: number;
}, {
    modelName: string;
    promptTokens: number;
    completionTokens: number;
}>;
export type CalculateCostInput = z.infer<typeof CalculateCostSchema>;
/**
 * analyze_project tool input
 */
export declare const AnalyzeProjectSchema: z.ZodObject<{
    projectPath: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    projectPath: string;
}, {
    projectPath: string;
}>;
export type AnalyzeProjectInput = z.infer<typeof AnalyzeProjectSchema>;
/**
 * clarity_discover_components tool input
 */
export declare const DiscoverComponentsSchema: z.ZodObject<{
    query: z.ZodString;
    category: z.ZodOptional<z.ZodEnum<["top-level", "chat", "message", "input", "display", "feedback", "navigation", "analytics", "enterprise", "ai-ops", "memory", "primitives", "hooks", "utilities"]>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    query: string;
    limit?: number | undefined;
    category?: "input" | "chat" | "hooks" | "display" | "feedback" | "analytics" | "enterprise" | "memory" | "message" | "navigation" | "top-level" | "utilities" | "primitives" | "ai-ops" | undefined;
}, {
    query: string;
    limit?: number | undefined;
    category?: "input" | "chat" | "hooks" | "display" | "feedback" | "analytics" | "enterprise" | "memory" | "message" | "navigation" | "top-level" | "utilities" | "primitives" | "ai-ops" | undefined;
}>;
export type DiscoverComponentsInput = z.infer<typeof DiscoverComponentsSchema>;
/**
 * clarity_get_component_docs tool input
 */
export declare const GetComponentDocsSchema: z.ZodObject<{
    componentName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    componentName: string;
}, {
    componentName: string;
}>;
export type GetComponentDocsInput = z.infer<typeof GetComponentDocsSchema>;
/**
 * clarity_get_component_types tool input
 */
export declare const GetComponentTypesSchema: z.ZodObject<{
    componentName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    componentName: string;
}, {
    componentName: string;
}>;
export type GetComponentTypesInput = z.infer<typeof GetComponentTypesSchema>;
/**
 * clarity_discover_hooks tool input
 */
export declare const DiscoverHooksSchema: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    query: string;
    limit?: number | undefined;
}, {
    query: string;
    limit?: number | undefined;
}>;
export type DiscoverHooksInput = z.infer<typeof DiscoverHooksSchema>;
/**
 * clarity_get_hook_docs tool input
 */
export declare const GetHookDocsSchema: z.ZodObject<{
    hookName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    hookName: string;
}, {
    hookName: string;
}>;
export type GetHookDocsInput = z.infer<typeof GetHookDocsSchema>;
/**
 * clarity_get_accessibility tool input
 */
export declare const GetAccessibilitySchema: z.ZodObject<{
    componentName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    componentName: string;
}, {
    componentName: string;
}>;
export type GetAccessibilityInput = z.infer<typeof GetAccessibilitySchema>;
/**
 * clarity_generate_code tool input
 */
export declare const CodeVariantSchema: z.ZodEnum<["basic", "typescript", "complete"]>;
export type CodeVariant = z.infer<typeof CodeVariantSchema>;
export declare const GenerateCodeSchema: z.ZodObject<{
    componentName: z.ZodString;
    variant: z.ZodEnum<["basic", "typescript", "complete"]>;
    withProvider: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    typescript: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    variant: "typescript" | "basic" | "complete";
    componentName: string;
    typescript?: boolean | undefined;
    withProvider?: boolean | undefined;
}, {
    variant: "typescript" | "basic" | "complete";
    componentName: string;
    typescript?: boolean | undefined;
    withProvider?: boolean | undefined;
}>;
export type GenerateCodeInput = z.infer<typeof GenerateCodeSchema>;
/**
 * clarity_get_related_components tool input
 */
export declare const GetRelatedComponentsSchema: z.ZodObject<{
    componentName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    componentName: string;
}, {
    componentName: string;
}>;
export type GetRelatedComponentsInput = z.infer<typeof GetRelatedComponentsSchema>;
/**
 * implement-feature prompt input
 */
export declare const ImplementFeaturePromptSchema: z.ZodObject<{
    feature: z.ZodString;
    provider: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    feature: string;
    provider?: string | undefined;
}, {
    feature: string;
    provider?: string | undefined;
}>;
export type ImplementFeaturePromptInput = z.infer<typeof ImplementFeaturePromptSchema>;
/**
 * debug-issue prompt input
 */
export declare const DebugIssuePromptSchema: z.ZodObject<{
    issue: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    issue: string;
    code?: string | undefined;
}, {
    issue: string;
    code?: string | undefined;
}>;
export type DebugIssuePromptInput = z.infer<typeof DebugIssuePromptSchema>;
/**
 * optimize-performance prompt input
 */
export declare const OptimizePerformancePromptSchema: z.ZodObject<{
    context: z.ZodString;
}, "strip", z.ZodTypeAny, {
    context: string;
}, {
    context: string;
}>;
export type OptimizePerformancePromptInput = z.infer<typeof OptimizePerformancePromptSchema>;
/**
 * review-code prompt input
 */
export declare const ReviewCodePromptSchema: z.ZodObject<{
    code: z.ZodString;
    focus: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    focus?: string | undefined;
}, {
    code: string;
    focus?: string | undefined;
}>;
export type ReviewCodePromptInput = z.infer<typeof ReviewCodePromptSchema>;
/**
 * convert-example prompt input
 */
export declare const ConvertExamplePromptSchema: z.ZodObject<{
    code: z.ZodString;
    from: z.ZodString;
    to: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    from: string;
    to: string;
}, {
    code: string;
    from: string;
    to: string;
}>;
export type ConvertExamplePromptInput = z.infer<typeof ConvertExamplePromptSchema>;
/**
 * Validate input against a schema and return typed result or throw
 */
export declare function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T;
//# sourceMappingURL=schemas.d.ts.map