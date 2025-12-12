/**
 * Tests for Phase 1: Analysis & Audit utilities
 */

import { describe, it, expect } from 'vitest'
import {
  OWASP_VULNERABILITIES,
  CODE_SMELL_PATTERNS,
  COMMON_CONTEXT_QUESTIONS,
  createContextRequirement,
  createSecurityFinding,
  createCodeSmellFinding,
  createTechnicalDebtItem,
  calculateRiskScore,
  createAuditResult,
  formatAuditResultAsMarkdown,
} from '../phases/phase1-audit'
import type {
  OWASPVulnerability,
  CodeSmellType,
  TechnicalDebtType,
  DebtSeverity,
} from '../types'

describe('Phase 1: Analysis & Audit', () => {
  describe('OWASP_VULNERABILITIES', () => {
    it('should contain all OWASP Top 10 categories', () => {
      const expectedCategories: OWASPVulnerability[] = [
        'A01_BROKEN_ACCESS_CONTROL',
        'A02_CRYPTOGRAPHIC_FAILURES',
        'A03_INJECTION',
        'A04_INSECURE_DESIGN',
        'A05_SECURITY_MISCONFIGURATION',
        'A06_VULNERABLE_COMPONENTS',
        'A07_AUTH_FAILURES',
        'A08_DATA_INTEGRITY_FAILURES',
        'A09_LOGGING_FAILURES',
        'A10_SSRF',
      ]

      for (const category of expectedCategories) {
        expect(OWASP_VULNERABILITIES[category]).toBeDefined()
        expect(OWASP_VULNERABILITIES[category].name).toBeTruthy()
        expect(OWASP_VULNERABILITIES[category].description).toBeTruthy()
        expect(OWASP_VULNERABILITIES[category].patterns.length).toBeGreaterThan(0)
        expect(OWASP_VULNERABILITIES[category].recommendations.length).toBeGreaterThan(0)
      }
    })

    it('should have injection vulnerability with SQL patterns', () => {
      const injection = OWASP_VULNERABILITIES.A03_INJECTION
      expect(injection.name).toBe('Injection')
      expect(injection.patterns.some((p) => p.toLowerCase().includes('sql'))).toBe(true)
    })
  })

  describe('CODE_SMELL_PATTERNS', () => {
    it('should contain common code smell types', () => {
      const expectedSmells: CodeSmellType[] = [
        'HIGH_CYCLOMATIC_COMPLEXITY',
        'HIGH_COGNITIVE_COMPLEXITY',
        'GOD_OBJECT',
        'LONG_METHOD',
        'DUPLICATE_CODE',
        'DEAD_CODE',
      ]

      for (const smell of expectedSmells) {
        expect(CODE_SMELL_PATTERNS[smell]).toBeDefined()
        expect(CODE_SMELL_PATTERNS[smell].name).toBeTruthy()
        expect(CODE_SMELL_PATTERNS[smell].indicators.length).toBeGreaterThan(0)
        expect(CODE_SMELL_PATTERNS[smell].refactoring).toBeTruthy()
      }
    })

    it('should have god object with splitting suggestion', () => {
      const godObject = CODE_SMELL_PATTERNS.GOD_OBJECT
      expect(godObject.refactoring.toLowerCase()).toContain('split')
    })
  })

  describe('createContextRequirement', () => {
    it('should create a context requirement with defaults', () => {
      const req = createContextRequirement(
        'Project dependencies',
        'To check for vulnerabilities'
      )

      expect(req.requirement).toBe('Project dependencies')
      expect(req.reason).toBe('To check for vulnerabilities')
      expect(req.priority).toBe('recommended')
      expect(req.fulfilled).toBe(false)
    })

    it('should respect explicit priority', () => {
      const req = createContextRequirement(
        'Test',
        'Reason',
        'required'
      )

      expect(req.priority).toBe('required')
    })
  })

  describe('createSecurityFinding', () => {
    it('should create a security finding with required fields', () => {
      const finding = createSecurityFinding(
        'A03_INJECTION',
        'high',
        'SQL injection in user input',
        'Use parameterized queries'
      )

      expect(finding.type).toBe('A03_INJECTION')
      expect(finding.severity).toBe('high')
      expect(finding.description).toBe('SQL injection in user input')
      expect(finding.recommendation).toBe('Use parameterized queries')
    })

    it('should include optional fields when provided', () => {
      const finding = createSecurityFinding(
        'A03_INJECTION',
        'critical',
        'SQL injection',
        'Use prepared statements',
        {
          location: 'src/api/users.ts:45',
          cweId: 'CWE-89',
          cvssScore: 9.8,
        }
      )

      expect(finding.location).toBe('src/api/users.ts:45')
      expect(finding.cweId).toBe('CWE-89')
      expect(finding.cvssScore).toBe(9.8)
    })
  })

  describe('createCodeSmellFinding', () => {
    it('should create a code smell finding', () => {
      const smell = createCodeSmellFinding(
        'HIGH_CYCLOMATIC_COMPLEXITY',
        'high',
        'Function has 15 decision points',
        'Extract methods to reduce complexity'
      )

      expect(smell.type).toBe('HIGH_CYCLOMATIC_COMPLEXITY')
      expect(smell.severity).toBe('high')
      expect(smell.description).toBe('Function has 15 decision points')
      expect(smell.refactoringSuggestion).toBe('Extract methods to reduce complexity')
    })

    it('should include optional location and effort', () => {
      const smell = createCodeSmellFinding(
        'GOD_OBJECT',
        'medium',
        'Class has 50 methods',
        'Split into smaller classes',
        {
          location: 'src/UserService.ts',
          estimatedEffort: 'significant',
        }
      )

      expect(smell.location).toBe('src/UserService.ts')
      expect(smell.estimatedEffort).toBe('significant')
    })
  })

  describe('createTechnicalDebtItem', () => {
    it('should create a technical debt item with defaults', () => {
      const debt = createTechnicalDebtItem(
        'ARCHITECTURAL_DEBT',
        'high',
        'No separation of concerns',
        'Changes ripple across codebase',
        'Implement clean architecture'
      )

      expect(debt.type).toBe('ARCHITECTURAL_DEBT')
      expect(debt.severity).toBe('high')
      expect(debt.interestRate).toBe('medium')
    })

    it('should respect explicit interest rate', () => {
      const debt = createTechnicalDebtItem(
        'TEST_DEBT',
        'critical',
        'No tests',
        'Cannot refactor safely',
        'Add test coverage',
        'critical'
      )

      expect(debt.interestRate).toBe('critical')
    })
  })

  describe('calculateRiskScore', () => {
    it('should return 0 for empty findings', () => {
      const score = calculateRiskScore([], [], [])
      expect(score).toBe(0)
    })

    it('should weight security findings highest', () => {
      const securityFinding = createSecurityFinding(
        'A03_INJECTION',
        'critical',
        'Test',
        'Test'
      )

      const scoreWithSecurity = calculateRiskScore([securityFinding], [], [])
      const scoreWithSmell = calculateRiskScore(
        [],
        [createCodeSmellFinding('DEAD_CODE', 'critical', 'Test', 'Test')],
        []
      )

      expect(scoreWithSecurity).toBeGreaterThan(scoreWithSmell)
    })

    it('should cap at 100', () => {
      const criticalFindings = Array(10)
        .fill(null)
        .map(() =>
          createSecurityFinding('A03_INJECTION', 'critical', 'Test', 'Test')
        )

      const score = calculateRiskScore(criticalFindings, [], [])
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should calculate cumulative risk', () => {
      const findings = [
        createSecurityFinding('A03_INJECTION', 'high', 'Test', 'Test'),
        createSecurityFinding('A07_AUTH_FAILURES', 'medium', 'Test', 'Test'),
      ]
      const smells = [
        createCodeSmellFinding('GOD_OBJECT', 'low', 'Test', 'Test'),
      ]

      const score = calculateRiskScore(findings, smells, [])
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(100)
    })
  })

  describe('createAuditResult', () => {
    it('should create an audit result with calculated risk score', () => {
      const result = createAuditResult({
        securityFindings: [
          createSecurityFinding('A03_INJECTION', 'high', 'Test', 'Test'),
        ],
        codeSmells: [
          createCodeSmellFinding('DEAD_CODE', 'low', 'Test', 'Test'),
        ],
      })

      expect(result.securityFindings.length).toBe(1)
      expect(result.codeSmells.length).toBe(1)
      expect(result.riskScore).toBeGreaterThan(0)
      expect(result.timestamp).toBeInstanceOf(Date)
      expect(result.summary).toBeTruthy()
    })

    it('should default empty arrays', () => {
      const result = createAuditResult({})

      expect(result.contextRequirements).toEqual([])
      expect(result.securityFindings).toEqual([])
      expect(result.codeSmells).toEqual([])
      expect(result.technicalDebt).toEqual([])
      expect(result.riskScore).toBe(0)
    })

    it('should use custom summary when provided', () => {
      const result = createAuditResult({
        summary: 'Custom summary',
      })

      expect(result.summary).toBe('Custom summary')
    })
  })

  describe('formatAuditResultAsMarkdown', () => {
    it('should format audit result as markdown', () => {
      const result = createAuditResult({
        securityFindings: [
          createSecurityFinding('A03_INJECTION', 'high', 'SQL injection', 'Use params'),
        ],
        codeSmells: [
          createCodeSmellFinding('GOD_OBJECT', 'medium', 'Large class', 'Split it'),
        ],
        technicalDebt: [
          createTechnicalDebtItem('TEST_DEBT', 'high', 'No tests', 'Risky', 'Add tests'),
        ],
      })

      const markdown = formatAuditResultAsMarkdown(result)

      expect(markdown).toContain('# Audit Report')
      expect(markdown).toContain('Risk Score')
      expect(markdown).toContain('Security Findings')
      expect(markdown).toContain('SQL injection')
      expect(markdown).toContain('Code Smells')
      expect(markdown).toContain('God Object')
      expect(markdown).toContain('Technical Debt')
    })

    it('should handle empty audit result', () => {
      const result = createAuditResult({})
      const markdown = formatAuditResultAsMarkdown(result)

      expect(markdown).toContain('# Audit Report')
      expect(markdown).not.toContain('Security Findings')
      expect(markdown).not.toContain('Code Smells')
    })
  })

  describe('COMMON_CONTEXT_QUESTIONS', () => {
    it('should contain common questions', () => {
      expect(COMMON_CONTEXT_QUESTIONS.length).toBeGreaterThan(0)

      const hasRequired = COMMON_CONTEXT_QUESTIONS.some(
        (q) => q.priority === 'required'
      )
      expect(hasRequired).toBe(true)
    })
  })
})
