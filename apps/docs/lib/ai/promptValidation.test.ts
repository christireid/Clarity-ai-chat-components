/**
 * Prompt Validation Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  validatePrompt,
  isPromptValid,
  validatePromptDevMode,
  validatePromptTemplates,
  assertPromptValid,
  VALIDATION_RULES,
} from './promptValidation'
import { PROMPT_TEMPLATES } from './promptTemplates'
import { DOCS_ASSISTANT_SYSTEM_PROMPT } from '@/components/AI/systemPrompt'

// ============================================================================
// validatePrompt Tests
// ============================================================================

describe('validatePrompt', () => {
  it('returns valid report for well-formed prompt', () => {
    const prompt = `<assistant_identity>
You are a helpful assistant.
</assistant_identity>

<example_response>
Example: "Hello, how can I help?"
</example_response>

Focus on being helpful. Include code examples. Lead with the answer.`

    const report = validatePrompt(prompt)
    expect(report.isValid).toBe(true)
    expect(report.errors).toHaveLength(0)
  })

  it('detects XML balance errors', () => {
    const prompt = '<section>Content without closing tag'
    const report = validatePrompt(prompt)

    expect(report.isValid).toBe(false)
    expect(report.errors.some((e) => e.ruleId === 'xml-balance')).toBe(true)
  })

  it('detects XML nesting errors', () => {
    const prompt = '<a><b></a></b>'
    const report = validatePrompt(prompt)

    expect(report.isValid).toBe(false)
    expect(report.errors.some((e) => e.ruleId === 'xml-nesting')).toBe(true)
  })

  it('includes token estimate', () => {
    const report = validatePrompt('Test prompt content')
    expect(report.tokenEstimate).toBeGreaterThan(0)
  })

  it('reports warnings for missing best practices', () => {
    const minimalPrompt = 'You are an assistant.'
    const report = validatePrompt(minimalPrompt)

    // Should have warnings but no errors
    expect(report.warnings.length).toBeGreaterThan(0)
  })

  it('respects strictMode option', () => {
    const promptWithWarnings = 'You are an assistant.'

    const normalReport = validatePrompt(promptWithWarnings)
    const strictReport = validatePrompt(promptWithWarnings, {
      strictMode: true,
    })

    // Normal mode: valid if no errors
    expect(normalReport.isValid).toBe(true)
    // Strict mode: invalid if warnings exist
    expect(strictReport.isValid).toBe(false)
  })

  it('uses custom rules when provided', () => {
    const customRules = [
      {
        id: 'custom-rule',
        name: 'Custom Rule',
        description: 'Must contain magic word',
        severity: 'error' as const,
        check: (prompt: string) => ({
          passed: prompt.includes('abracadabra'),
          message: 'Must contain magic word',
        }),
      },
    ]

    const report = validatePrompt('No magic here', { rules: customRules })
    expect(report.isValid).toBe(false)
    expect(report.errors[0].ruleId).toBe('custom-rule')
  })
})

// ============================================================================
// isPromptValid Tests
// ============================================================================

describe('isPromptValid', () => {
  it('returns true for valid prompt', () => {
    const validPrompt = '<section>Content</section>'
    expect(isPromptValid(validPrompt)).toBe(true)
  })

  it('returns false for invalid prompt', () => {
    const invalidPrompt = '<section>Unclosed'
    expect(isPromptValid(invalidPrompt)).toBe(false)
  })
})

// ============================================================================
// validatePromptDevMode Tests
// ============================================================================

describe('validatePromptDevMode', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('logs errors in development mode', () => {
    vi.stubEnv('NODE_ENV', 'development')
    validatePromptDevMode('<unclosed>', 'TestPrompt')
    expect(console.error).toHaveBeenCalled()
  })

  it('does nothing in production mode', () => {
    vi.stubEnv('NODE_ENV', 'production')
    validatePromptDevMode('<unclosed>', 'TestPrompt')
    expect(console.error).not.toHaveBeenCalled()
  })

  it('logs warnings for best practice issues', () => {
    vi.stubEnv('NODE_ENV', 'development')
    validatePromptDevMode('Minimal prompt', 'TestPrompt')
    expect(console.warn).toHaveBeenCalled()
  })
})

// ============================================================================
// validatePromptTemplates Tests
// ============================================================================

describe('validatePromptTemplates', () => {
  it('validates all templates', () => {
    const results = validatePromptTemplates(PROMPT_TEMPLATES)
    expect(results.size).toBe(PROMPT_TEMPLATES.length)
  })

  it('returns map with template IDs as keys', () => {
    const templates = [
      { id: 'template-1', prompt: '<section></section>' },
      { id: 'template-2', prompt: '<section></section>' },
    ]
    const results = validatePromptTemplates(templates)

    expect(results.has('template-1')).toBe(true)
    expect(results.has('template-2')).toBe(true)
  })
})

// ============================================================================
// assertPromptValid Tests
// ============================================================================

describe('assertPromptValid', () => {
  it('does not throw for valid prompt', () => {
    expect(() =>
      assertPromptValid('<section></section>', 'TestPrompt')
    ).not.toThrow()
  })

  it('throws for invalid prompt', () => {
    expect(() => assertPromptValid('<unclosed>', 'TestPrompt')).toThrow()
  })

  it('includes prompt name in error message', () => {
    expect(() => assertPromptValid('<unclosed>', 'MyCustomPrompt')).toThrow(
      /MyCustomPrompt/
    )
  })
})

// ============================================================================
// VALIDATION_RULES Tests
// ============================================================================

describe('VALIDATION_RULES', () => {
  it('contains expected number of rules', () => {
    expect(VALIDATION_RULES.length).toBeGreaterThanOrEqual(7)
  })

  it('all rules have required properties', () => {
    for (const rule of VALIDATION_RULES) {
      expect(rule.id).toBeDefined()
      expect(rule.name).toBeDefined()
      expect(rule.description).toBeDefined()
      expect(rule.severity).toMatch(/^(error|warning|info)$/)
      expect(typeof rule.check).toBe('function')
    }
  })

  it('all rules return valid result objects', () => {
    for (const rule of VALIDATION_RULES) {
      const result = rule.check('Test prompt content')
      expect(typeof result.passed).toBe('boolean')
      expect(typeof result.message).toBe('string')
    }
  })
})

// ============================================================================
// Integration: Validate actual prompts
// ============================================================================

describe('Production prompt validation', () => {
  it('DOCS_ASSISTANT_SYSTEM_PROMPT passes all error-level rules', () => {
    const report = validatePrompt(DOCS_ASSISTANT_SYSTEM_PROMPT)
    expect(
      report.isValid,
      `Errors: ${report.errors.map((e) => e.message).join(', ')}`
    ).toBe(true)
  })

  it('All PROMPT_TEMPLATES pass non-XML rules', () => {
    // Personality templates may contain code examples with HTML tags
    // So we only check non-XML rules for them
    const nonXmlRules = VALIDATION_RULES.filter((r) => !r.id.startsWith('xml-'))

    for (const template of PROMPT_TEMPLATES) {
      const report = validatePrompt(template.prompt, { rules: nonXmlRules })
      expect(
        report.isValid,
        `Template "${template.id}" has errors: ${report.errors.map((e) => e.message).join(', ')}`
      ).toBe(true)
    }
  })

  it('Default template (using DOCS_ASSISTANT_SYSTEM_PROMPT) passes all rules', () => {
    const defaultTemplate = PROMPT_TEMPLATES.find((t) => t.id === 'default')
    if (defaultTemplate) {
      const report = validatePrompt(defaultTemplate.prompt)
      expect(
        report.isValid,
        `Default template has errors: ${report.errors.map((e) => e.message).join(', ')}`
      ).toBe(true)
    }
  })
})
