/**
 * Architect Framework
 *
 * A comprehensive prompt engineering framework implementing the
 * "Principal Software Architect & Engineering Lead" workflow.
 *
 * The framework provides a 4-phase approach to AI-assisted software engineering:
 *
 * 1. **Phase 1: Analysis & Audit** - Context gathering, security scanning,
 *    code smell detection, and technical debt assessment
 *
 * 2. **Phase 2: Strategic Planning** - Chain of thought reasoning, step-by-step
 *    planning, design pattern selection, and test strategy
 *
 * 3. **Phase 3: Implementation** - Style guide adherence, documentation
 *    requirements, and legacy code modernization (Boy Scout Rule)
 *
 * 4. **Phase 4: Review & Reflection** - Self-correction, DRY verification,
 *    security re-verification, and ADR generation
 *
 * @example
 * ```typescript
 * import {
 *   MASTER_ARCHITECT_RECIPE,
 *   useArchitectWorkflow,
 *   createAuditResult,
 *   createStrategicPlan,
 * } from '@clarity-chat/react/prompt/architect'
 *
 * // Use the master architect recipe
 * const { messages } = usePromptRecipe(MASTER_ARCHITECT_RECIPE)
 *
 * // Or use the workflow hook
 * const workflow = useArchitectWorkflow({
 *   onPhaseComplete: (phase, result) => {
 *     console.log(`Phase ${phase} complete:`, result)
 *   },
 * })
 * ```
 *
 * @packageDocumentation
 */
// Types
export * from './types';
// Master prompt and recipes
export { buildMasterSystemPrompt, renderMasterSystemPrompt, buildIdentitySection, buildPhase1AuditSection, buildPhase2PlanningSection, buildPhase3ImplementationSection, buildPhase4ReviewSection, buildConstraintsSection, buildOutputFormattingSection, MASTER_ARCHITECT_RECIPE, SECURITY_AUDITOR_RECIPE, REFACTORING_SPECIALIST_RECIPE, ARCHITECTURE_REVIEWER_RECIPE, TEST_ENGINEER_RECIPE, ARCHITECT_RECIPES, getArchitectRecipe, } from './master-prompt';
// Phase utilities
export * from './phases';
// React hooks
export * from './hooks';
// Design patterns (tree-shakeable)
export * from './patterns';
// Runtime validation (Zod schemas)
export * from './validation';
// Examples (for documentation and demos)
export * as examples from './examples';
//# sourceMappingURL=index.js.map