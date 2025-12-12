/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'
import {
  SecurityFindingSchema,
  CodeSmellFindingSchema,
  TechnicalDebtItemSchema,
  AuditResultSchema,
  PlanningStepSchema,
  StrategicPlanSchema,
  ReviewResultSchema,
  PatternDefinitionSchema,
  validators,
  safeValidators,
  ValidationError,
  validateOrThrow,
  validateSafe,
} from '../validation'
import { z } from 'zod'

describe('Validation Schemas', () => {
  describe('SecurityFindingSchema', () => {
    it('should validate a valid security finding', () => {
      const validFinding = {
        type: 'A01_BROKEN_ACCESS_CONTROL',
        severity: 'high',
        description: 'Missing authorization check',
        location: 'src/api/users.ts:42',
        recommendation: 'Add authorization middleware',
        cweId: 'CWE-285',
        cvssScore: 7.5,
      }

      const result = SecurityFindingSchema.safeParse(validFinding)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.type).toBe('A01_BROKEN_ACCESS_CONTROL')
      }
    })

    it('should reject invalid OWASP type', () => {
      const invalidFinding = {
        type: 'INVALID_TYPE',
        severity: 'high',
        description: 'Test',
        recommendation: 'Test',
      }

      const result = SecurityFindingSchema.safeParse(invalidFinding)
      expect(result.success).toBe(false)
    })

    it('should reject empty description', () => {
      const invalidFinding = {
        type: 'A01_BROKEN_ACCESS_CONTROL',
        severity: 'high',
        description: '',
        recommendation: 'Test',
      }

      const result = SecurityFindingSchema.safeParse(invalidFinding)
      expect(result.success).toBe(false)
    })

    it('should reject invalid CWE ID format', () => {
      const invalidFinding = {
        type: 'A01_BROKEN_ACCESS_CONTROL',
        severity: 'high',
        description: 'Test finding',
        recommendation: 'Test recommendation',
        cweId: 'INVALID-123',
      }

      const result = SecurityFindingSchema.safeParse(invalidFinding)
      expect(result.success).toBe(false)
    })

    it('should reject CVSS score out of range', () => {
      const invalidFinding = {
        type: 'A01_BROKEN_ACCESS_CONTROL',
        severity: 'high',
        description: 'Test finding',
        recommendation: 'Test recommendation',
        cvssScore: 15, // Max is 10
      }

      const result = SecurityFindingSchema.safeParse(invalidFinding)
      expect(result.success).toBe(false)
    })
  })

  describe('CodeSmellFindingSchema', () => {
    it('should validate a valid code smell finding', () => {
      const validSmell = {
        type: 'GOD_OBJECT',
        severity: 'medium',
        description: 'Class has too many responsibilities',
        location: 'src/services/UserManager.ts',
        refactoringSuggestion: 'Split into multiple focused classes',
        estimatedEffort: 'major',
      }

      const result = CodeSmellFindingSchema.safeParse(validSmell)
      expect(result.success).toBe(true)
    })

    it('should allow optional estimatedEffort', () => {
      const validSmell = {
        type: 'LONG_METHOD',
        severity: 'low',
        description: 'Method is too long',
        refactoringSuggestion: 'Extract helper methods',
      }

      const result = CodeSmellFindingSchema.safeParse(validSmell)
      expect(result.success).toBe(true)
    })
  })

  describe('TechnicalDebtItemSchema', () => {
    it('should validate a valid technical debt item', () => {
      const validDebt = {
        type: 'CODE_DEBT',
        severity: 'high',
        description: 'Legacy authentication module',
        impact: 'Increases security risk and maintenance burden',
        interestRate: 'high',
        remediation: 'Migrate to OAuth 2.0',
      }

      const result = TechnicalDebtItemSchema.safeParse(validDebt)
      expect(result.success).toBe(true)
    })
  })

  describe('AuditResultSchema', () => {
    it('should validate a complete audit result', () => {
      const validAudit = {
        contextRequirements: [
          {
            requirement: 'Architecture documentation',
            reason: 'Need to understand system boundaries',
            priority: 'required',
            fulfilled: true,
          },
        ],
        securityFindings: [],
        codeSmells: [],
        technicalDebt: [],
        riskScore: 25,
        summary: 'System is in good health with minor issues',
        timestamp: new Date(),
      }

      const result = AuditResultSchema.safeParse(validAudit)
      expect(result.success).toBe(true)
    })

    it('should coerce timestamp string to Date', () => {
      const auditWithStringDate = {
        contextRequirements: [],
        securityFindings: [],
        codeSmells: [],
        technicalDebt: [],
        riskScore: 0,
        summary: 'Test',
        timestamp: '2024-01-15T10:30:00Z',
      }

      const result = AuditResultSchema.safeParse(auditWithStringDate)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.timestamp instanceof Date).toBe(true)
      }
    })

    it('should reject risk score out of range', () => {
      const invalidAudit = {
        contextRequirements: [],
        securityFindings: [],
        codeSmells: [],
        technicalDebt: [],
        riskScore: 150, // Max is 100
        summary: 'Test',
        timestamp: new Date(),
      }

      const result = AuditResultSchema.safeParse(invalidAudit)
      expect(result.success).toBe(false)
    })
  })

  describe('PlanningStepSchema', () => {
    it('should validate a valid planning step', () => {
      const validStep = {
        stepNumber: 1,
        title: 'Set up project structure',
        description: 'Create initial folder structure and config files',
        expectedOutcome: 'Clean project scaffold',
        dependencies: [],
        complexity: 'simple',
        riskLevel: 'low',
      }

      const result = PlanningStepSchema.safeParse(validStep)
      expect(result.success).toBe(true)
    })

    it('should reject negative step number', () => {
      const invalidStep = {
        stepNumber: -1,
        title: 'Test',
        description: 'Test',
        expectedOutcome: 'Test',
        dependencies: [],
        complexity: 'simple',
        riskLevel: 'low',
      }

      const result = PlanningStepSchema.safeParse(invalidStep)
      expect(result.success).toBe(false)
    })
  })

  describe('StrategicPlanSchema', () => {
    it('should validate a complete strategic plan', () => {
      const validPlan = {
        chainOfThought: 'First analyze, then plan, then implement',
        steps: [
          {
            stepNumber: 1,
            title: 'Analysis',
            description: 'Analyze requirements',
            expectedOutcome: 'Clear requirements',
            dependencies: [],
            complexity: 'simple',
            riskLevel: 'low',
          },
        ],
        patternRecommendations: [],
        rejectedAlternatives: [],
        testPlan: [],
        approachSummary: 'Incremental approach',
        totalComplexity: 'moderate',
      }

      const result = StrategicPlanSchema.safeParse(validPlan)
      expect(result.success).toBe(true)
    })

    it('should require at least one step', () => {
      const invalidPlan = {
        chainOfThought: 'Test',
        steps: [],
        patternRecommendations: [],
        rejectedAlternatives: [],
        testPlan: [],
        approachSummary: 'Test',
        totalComplexity: 'simple',
      }

      const result = StrategicPlanSchema.safeParse(invalidPlan)
      expect(result.success).toBe(false)
    })
  })

  describe('ReviewResultSchema', () => {
    it('should validate a complete review result', () => {
      const validReview = {
        selfCorrections: [
          {
            constraint: 'No hardcoded credentials',
            passed: true,
            details: 'All credentials from env vars',
          },
        ],
        dryCheck: {
          isDRY: true,
          duplications: [],
        },
        securityRecheck: [],
        qualityScore: 85,
        recommendations: ['Consider adding more tests'],
      }

      const result = ReviewResultSchema.safeParse(validReview)
      expect(result.success).toBe(true)
    })

    it('should validate with ADR', () => {
      const validReview = {
        selfCorrections: [],
        dryCheck: { isDRY: true, duplications: [] },
        securityRecheck: [],
        adr: {
          title: 'Use Redux for State Management',
          date: new Date(),
          status: 'accepted',
          context: 'Need global state management',
          decision: 'Use Redux with Redux Toolkit',
          consequences: {
            positive: ['Predictable state updates'],
            negative: ['Additional boilerplate'],
          },
          alternativesConsidered: ['Context API', 'Zustand'],
        },
        qualityScore: 90,
        recommendations: [],
      }

      const result = ReviewResultSchema.safeParse(validReview)
      expect(result.success).toBe(true)
    })
  })

  describe('PatternDefinitionSchema', () => {
    it('should validate a valid pattern definition', () => {
      const validPattern = {
        id: 'SINGLETON',
        name: 'Singleton',
        category: 'creational',
        intent: 'Ensure single instance',
        useCases: ['Logger', 'Config'],
        tradeoffs: {
          pros: ['Global access'],
          cons: ['Hard to test'],
        },
        implementation: 'class Singleton { }',
      }

      const result = PatternDefinitionSchema.safeParse(validPattern)
      expect(result.success).toBe(true)
    })

    it('should require at least one use case', () => {
      const invalidPattern = {
        id: 'SINGLETON',
        name: 'Singleton',
        category: 'creational',
        intent: 'Test',
        useCases: [],
        tradeoffs: { pros: [], cons: [] },
        implementation: 'class Singleton { }',
      }

      const result = PatternDefinitionSchema.safeParse(invalidPattern)
      expect(result.success).toBe(false)
    })
  })
})

describe('Validation Utilities', () => {
  describe('validateOrThrow', () => {
    it('should return valid data', () => {
      const data = {
        type: 'A03_INJECTION',
        severity: 'critical',
        description: 'SQL injection vulnerability',
        recommendation: 'Use parameterized queries',
      }

      const result = validateOrThrow(SecurityFindingSchema, data, 'SecurityFinding')
      expect(result.type).toBe('A03_INJECTION')
    })

    it('should throw ValidationError on invalid data', () => {
      const invalidData = {
        type: 'INVALID',
        severity: 'high',
      }

      expect(() => {
        validateOrThrow(SecurityFindingSchema, invalidData, 'SecurityFinding')
      }).toThrow(ValidationError)
    })
  })

  describe('validateSafe', () => {
    it('should return success result for valid data', () => {
      const data = {
        type: 'GOD_OBJECT',
        severity: 'medium',
        description: 'Test smell',
        refactoringSuggestion: 'Refactor',
      }

      const result = validateSafe(CodeSmellFindingSchema, data, 'CodeSmellFinding')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.type).toBe('GOD_OBJECT')
      }
    })

    it('should return error result for invalid data', () => {
      const invalidData = { type: 'INVALID' }

      const result = validateSafe(CodeSmellFindingSchema, invalidData, 'CodeSmellFinding')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })
  })

  describe('ValidationError', () => {
    it('should provide formatted errors', () => {
      const invalidData = {
        type: 'INVALID',
        severity: 'invalid-severity',
      }

      const result = SecurityFindingSchema.safeParse(invalidData)
      if (!result.success) {
        const error = new ValidationError('Test error', result.error.errors)
        const formatted = error.getFormattedErrors()
        expect(formatted.length).toBeGreaterThan(0)
        expect(formatted.some((e) => e.includes('type'))).toBe(true)
      }
    })
  })

  describe('validators object', () => {
    it('should provide pre-bound validators', () => {
      const validFinding = {
        type: 'A02_CRYPTOGRAPHIC_FAILURES',
        severity: 'high',
        description: 'Weak encryption',
        recommendation: 'Use AES-256',
      }

      const result = validators.securityFinding(validFinding)
      expect(result.type).toBe('A02_CRYPTOGRAPHIC_FAILURES')
    })

    it('should throw on invalid data', () => {
      expect(() => {
        validators.securityFinding({ invalid: 'data' })
      }).toThrow(ValidationError)
    })
  })

  describe('safeValidators object', () => {
    it('should provide pre-bound safe validators', () => {
      const validDebt = {
        type: 'TEST_DEBT',
        severity: 'medium',
        description: 'Low test coverage',
        impact: 'Higher bug risk',
        interestRate: 'medium',
        remediation: 'Add more tests',
      }

      const result = safeValidators.technicalDebtItem(validDebt)
      expect(result.success).toBe(true)
    })

    it('should return error for invalid data', () => {
      const result = safeValidators.technicalDebtItem({ invalid: 'data' })
      expect(result.success).toBe(false)
    })
  })
})
