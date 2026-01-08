/**
 * Prompt & Token Optimization Layer
 *
 * Optional addon layer for advanced prompt composition and token optimization.
 * Built around the toon prompt DSL.
 *
 * @example
 * ```tsx
 * // Enable prompt optimization in useClarityChat
 * const chat = useClarityChat({
 *   api: '/api/chat',
 *   promptOptimization: {
 *     enabled: true,
 *     targetTokens: 4000,
 *     strategy: 'hybrid',
 *   },
 * })
 * ```
 */
// Core utilities (framework-agnostic)
export * from './core';
// React hooks
export * from './hooks';
// Utilities
export * from './utils';
// Architect Framework - AI Prompt Engineering for Software Quality
export * as architect from './architect';
export * from './architect';
// Re-export commonly used constants for convenience
export { MODEL_PRESETS } from './core/tokenizer';
export { BUILT_IN_RECIPES } from './core/recipe';
export { MODEL_PROFILES, getModelProfile, getModelProfileOrDefault, } from './core/model-profiles';
// Re-export architect recipes for convenience
export { MASTER_ARCHITECT_RECIPE, SECURITY_AUDITOR_RECIPE, REFACTORING_SPECIALIST_RECIPE, ARCHITECTURE_REVIEWER_RECIPE, TEST_ENGINEER_RECIPE, ARCHITECT_RECIPES, } from './architect';
//# sourceMappingURL=index.js.map