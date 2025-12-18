import { logger } from '@clarity-chat/utils/logger';
/**
 * Prompt Validation Module
 *
 * Provides comprehensive validation for AI prompts including:
 * - XML structure validation
 * - Token budget checking
 * - Best practices enforcement
 * - Anti-pattern detection
 *
 * Can be used at build time, test time, or runtime (dev mode).
 *
 * @version 1.0.0
 * @lastUpdated December 2025
 */

import {
  validateXmlTagBalance,
  validateXmlNesting,
  validatePromptXml,
} from '@/components/AI/systemPrompt'
import { estimateTokens, validateTokenEstimate } from './tokenUtils'

// ============================================================================
// Types
// ============================================================================

export interface ValidationRule {
  id: string
  name: string
  description: string
  severity: 'error' | 'warning' | 'info'
  check: (prompt: string) => ValidationResult
}

export interface ValidationResult {
  passed: boolean
  message: string
  details?: string
}

export interface PromptValidationReport {
  isValid: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
  info: ValidationIssue[]
  summary: string
  tokenEstimate: number
}

export interface ValidationIssue {
  ruleId: string
  ruleName: string
  severity: 'error' | 'warning' | 'info'
  message: string
  details?: string
}

// ============================================================================
// Validation Rules
// ============================================================================

/**
 * Built-in validation rules for prompt quality
 */
export const VALIDATION_RULES: ValidationRule[] = [
  // XML Structure Rules
  {
    id: 'xml-balance',
    name: 'XML Tag Balance',
    description: 'All XML-style tags must have matching opening/closing pairs',
    severity: 'error',
    check: (prompt) => {
      const result = validateXmlTagBalance(prompt)
      return {
        passed: result.isBalanced,
        message: result.isBalanced
          ? 'All XML tags are properly balanced'
          : `Unbalanced XML tags: ${result.issues.join(', ')}`,
        details: `Found ${result.tagCount} XML tags`,
      }
    },
  },
  {
    id: 'xml-nesting',
    name: 'XML Proper Nesting',
    description: 'XML tags must be properly nested (no improper overlap)',
    severity: 'error',
    check: (prompt) => {
      const result = validateXmlNesting(prompt)
      return {
        passed: result.isValid,
        message: result.isValid
          ? 'XML tags are properly nested'
          : `Nesting issues: ${result.issues.join(', ')}`,
        details: `Tag structure: ${result.structure.slice(0, 10).join(' ')}${result.structure.length > 10 ? '...' : ''}`,
      }
    },
  },

  // Best Practices Rules
  {
    id: 'has-identity',
    name: 'Identity Section',
    description: 'Prompt should define the assistant identity',
    severity: 'warning',
    check: (prompt) => {
      const hasIdentity =
        prompt.includes('<assistant_identity>') ||
        prompt.includes('You are') ||
        prompt.includes('Your role')
      return {
        passed: hasIdentity,
        message: hasIdentity
          ? 'Identity section present'
          : 'Consider adding an identity section (who the assistant is)',
      }
    },
  },
  {
    id: 'has-examples',
    name: 'Example Responses',
    description: 'Prompt should include example responses (few-shot)',
    severity: 'warning',
    check: (prompt) => {
      const hasExample =
        prompt.includes('<example') ||
        prompt.includes('Example:') ||
        prompt.includes('example response')
      return {
        passed: hasExample,
        message: hasExample
          ? 'Example responses included'
          : 'Consider adding example responses for better quality',
      }
    },
  },
  {
    id: 'positive-framing',
    name: 'Positive Instruction Framing',
    description:
      'Prefer positive instructions ("Do X") over negative ("Don\'t Y")',
    severity: 'info',
    check: (prompt) => {
      const positivePatterns = [
        'Lead with',
        'Include',
        'Provide',
        'Use',
        'Focus on',
        'Ensure',
        'Always',
      ]
      const negativePatterns = [
        "Don't",
        'Never',
        'Avoid',
        'Do not',
        "Shouldn't",
      ]

      const positiveCount = positivePatterns.filter((p) =>
        prompt.includes(p)
      ).length
      const negativeCount = negativePatterns.filter((p) =>
        prompt.includes(p)
      ).length

      const ratio =
        negativeCount === 0 ? Infinity : positiveCount / negativeCount
      const passed = ratio >= 2

      return {
        passed,
        message: passed
          ? `Good positive/negative ratio (${positiveCount}:${negativeCount})`
          : `Consider more positive framing (current ratio: ${positiveCount}:${negativeCount})`,
        details: `Positive patterns: ${positiveCount}, Negative patterns: ${negativeCount}`,
      }
    },
  },

  // Token Budget Rules
  {
    id: 'token-budget',
    name: 'Token Budget',
    description: 'Prompt should be within reasonable token limits',
    severity: 'warning',
    check: (prompt) => {
      const tokens = estimateTokens(prompt, 'mixed')
      const maxRecommended = 4000 // Reasonable limit for system prompts

      return {
        passed: tokens <= maxRecommended,
        message:
          tokens <= maxRecommended
            ? `Token count (${tokens}) is within budget`
            : `Token count (${tokens}) exceeds recommended limit of ${maxRecommended}`,
        details: `Estimated tokens: ${tokens}`,
      }
    },
  },

  // Anti-pattern Detection
  {
    id: 'no-jailbreak-vuln',
    name: 'Jailbreak Prevention',
    description:
      'Prompt should not contain patterns vulnerable to jailbreaking',
    severity: 'warning',
    check: (prompt) => {
      const vulnerablePatterns = [
        'ignore previous instructions',
        'disregard above',
        'forget everything',
        'you are now',
        'pretend you are',
      ]

      const found = vulnerablePatterns.filter((p) =>
        prompt.toLowerCase().includes(p)
      )

      return {
        passed: found.length === 0,
        message:
          found.length === 0
            ? 'No jailbreak-vulnerable patterns detected'
            : `Found potentially vulnerable patterns: ${found.join(', ')}`,
      }
    },
  },
  {
    id: 'has-boundaries',
    name: 'Clear Boundaries',
    description: 'Prompt should define what the assistant can/cannot do',
    severity: 'info',
    check: (prompt) => {
      const hasBoundaries =
        prompt.includes('scope') ||
        prompt.includes('boundaries') ||
        prompt.includes('focus on') ||
        prompt.includes('specialized') ||
        prompt.includes('documentation')

      return {
        passed: hasBoundaries,
        message: hasBoundaries
          ? 'Clear scope/boundaries defined'
          : 'Consider defining clear boundaries for the assistant',
      }
    },
  },
]

// ============================================================================
// Main Validation Function
// ============================================================================

/**
 * Validate a prompt against all rules and return a comprehensive report.
 *
 * @param prompt - The prompt string to validate
 * @param options - Validation options
 * @returns Comprehensive validation report
 */
export function validatePrompt(
  prompt: string,
  options: {
    rules?: ValidationRule[]
    strictMode?: boolean
    tokenBudget?: number
  } = {}
): PromptValidationReport {
  const rules = options.rules || VALIDATION_RULES
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []
  const info: ValidationIssue[] = []

  for (const rule of rules) {
    const result = rule.check(prompt)

    if (!result.passed) {
      const issue: ValidationIssue = {
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        message: result.message,
        details: result.details,
      }

      switch (rule.severity) {
        case 'error':
          errors.push(issue)
          break
        case 'warning':
          warnings.push(issue)
          break
        case 'info':
          info.push(issue)
          break
      }
    }
  }

  const tokenEstimate = estimateTokens(prompt, 'mixed')
  const isValid = options.strictMode
    ? errors.length === 0 && warnings.length === 0
    : errors.length === 0

  const summary = isValid
    ? `Prompt is valid (${tokenEstimate} tokens, ${warnings.length} warnings)`
    : `Prompt has ${errors.length} errors, ${warnings.length} warnings`

  return {
    isValid,
    errors,
    warnings,
    info,
    summary,
    tokenEstimate,
  }
}

/**
 * Quick validation check - returns true if prompt passes all error-level rules.
 */
export function isPromptValid(prompt: string): boolean {
  const report = validatePrompt(prompt)
  return report.isValid
}

/**
 * Development-mode validation that logs warnings to console.
 * Safe to call in production (no-ops if NODE_ENV !== 'development')
 */
export function validatePromptDevMode(
  prompt: string,
  promptName: string = 'Prompt'
): void {
  if (process.env.NODE_ENV !== 'development') return

  const report = validatePrompt(prompt)

  if (!report.isValid) {
    logger.error(`[Prompt Validation] ${promptName} has errors:`)
    for (const error of report.errors) {
      logger.error(`  ❌ ${error.ruleName}: ${error.message}`)
    }
  }

  if (report.warnings.length > 0) {
    logger.warn(`[Prompt Validation] ${promptName} has warnings:`)
    for (const warning of report.warnings) {
      logger.warn(`  ⚠️ ${warning.ruleName}: ${warning.message}`)
    }
  }
}

/**
 * Validate all prompts in a template array.
 */
export function validatePromptTemplates<
  T extends { id: string; prompt: string },
>(templates: T[]): Map<string, PromptValidationReport> {
  const results = new Map<string, PromptValidationReport>()

  for (const template of templates) {
    results.set(template.id, validatePrompt(template.prompt))
  }

  return results
}

/**
 * Assert that a prompt is valid (throws if not).
 * Useful for build-time validation.
 */
export function assertPromptValid(
  prompt: string,
  promptName: string = 'Prompt'
): void {
  const report = validatePrompt(prompt)

  if (!report.isValid) {
    const errorMessages = report.errors
      .map((e) => `  - ${e.ruleName}: ${e.message}`)
      .join('\n')
    throw new Error(`${promptName} validation failed:\n${errorMessages}`)
  }
}
