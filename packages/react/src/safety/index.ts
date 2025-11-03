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

export * from './types'
export * from './pii-detection'
export * from './content-filter'
export * from './prompt-injection'

import type { SafetyResult, SafetyGuardrail, SafetyCheck } from './types'

/**
 * Safety Checker
 * 
 * Runs multiple guardrails and aggregates results.
 */
export class SafetyChecker {
  private guardrails: SafetyGuardrail[]
  
  constructor(guardrails: SafetyGuardrail[] = []) {
    this.guardrails = guardrails
  }
  
  /**
   * Check content against all guardrails
   */
  async check(content: string, context?: Record<string, any>): Promise<SafetyResult> {
    const checks: SafetyCheck[] = []
    
    for (const guardrail of this.guardrails) {
      const check = await guardrail.check(content, context)
      checks.push(check)
    }
    
    const failedChecks = checks.filter(c => !c.passed)
    const safe = failedChecks.length === 0
    
    // Determine overall action
    let action: 'allow' | 'block' | 'review' = 'allow'
    if (!safe) {
      const actions = failedChecks.map(c => c.action || 'review')
      if (actions.includes('block')) {
        action = 'block'
      } else if (actions.includes('review')) {
        action = 'review'
      }
    }
    
    return {
      safe,
      checks,
      issues: failedChecks.map(c => `${c.name}: ${c.details}`),
      action,
    }
  }
  
  /**
   * Add a guardrail
   */
  addGuardrail(guardrail: SafetyGuardrail): void {
    this.guardrails.push(guardrail)
  }
  
  /**
   * Remove a guardrail by name
   */
  removeGuardrail(name: string): void {
    this.guardrails = this.guardrails.filter(g => g.name !== name)
  }
  
  /**
   * Get all guardrails
   */
  getGuardrails(): SafetyGuardrail[] {
    return [...this.guardrails]
  }
}

/**
 * Quick safety check helper
 */
export async function checkSafety(
  content: string,
  options?: {
    pii?: boolean
    contentFilter?: boolean
    promptInjection?: boolean
  }
): Promise<SafetyResult> {
  const guardrails: SafetyGuardrail[] = []
  
  if (options?.pii !== false) {
    const { PIIGuardrail } = await import('./pii-detection')
    guardrails.push(new PIIGuardrail())
  }
  
  if (options?.contentFilter !== false) {
    const { ContentFilterGuardrail } = await import('./content-filter')
    guardrails.push(new ContentFilterGuardrail())
  }
  
  if (options?.promptInjection !== false) {
    const { PromptInjectionGuardrail } = await import('./prompt-injection')
    guardrails.push(new PromptInjectionGuardrail())
  }
  
  const checker = new SafetyChecker(guardrails)
  return await checker.check(content)
}

