/**
 * AI Safety Utilities
 *
 * Optional utilities for content moderation, PII detection, and safety guardrails.
 * Use as-is for simple cases, or integrate with enterprise services.
 *
 * @example
 * ```tsx
 * import {
 *   SafetyChecker,
 *   PIIDetector,
 *   ContentFilter,
 *   PIIGuardrail,
 *   ContentFilterGuardrail,
 *   PromptInjectionGuardrail,
 * } from '@clarity-chat/react'
 *
 * // Create safety checker with guardrails
 * const safety = new SafetyChecker([
 *   new PIIGuardrail(),
 *   new ContentFilterGuardrail({
 *     keywords: {
 *       profanity: ['bad', 'words', 'here'],
 *     },
 *   }),
 *   new PromptInjectionGuardrail(),
 * ])
 *
 * // Check user input
 * const result = await safety.check(userInput)
 *
 * if (!result.safe) {
 *   console.log('Issues:', result.issues)
 *   // Handle unsafe content
 * }
 * ```
 */
export * from './types';
export * from './pii-detection';
export * from './content-filter';
export * from './prompt-injection';
import type { SafetyResult, SafetyGuardrail } from './types';
/**
 * Safety Checker
 *
 * Runs multiple guardrails and aggregates results.
 */
export declare class SafetyChecker {
    private guardrails;
    constructor(guardrails?: SafetyGuardrail[]);
    /**
     * Check content against all guardrails
     */
    check(content: string, context?: Record<string, any>): Promise<SafetyResult>;
    /**
     * Add a guardrail
     */
    addGuardrail(guardrail: SafetyGuardrail): void;
    /**
     * Remove a guardrail by name
     */
    removeGuardrail(name: string): void;
    /**
     * Get all guardrails
     */
    getGuardrails(): SafetyGuardrail[];
}
/**
 * Quick safety check helper
 */
export declare function checkSafety(content: string, options?: {
    pii?: boolean;
    contentFilter?: boolean;
    promptInjection?: boolean;
}): Promise<SafetyResult>;
//# sourceMappingURL=index.d.ts.map