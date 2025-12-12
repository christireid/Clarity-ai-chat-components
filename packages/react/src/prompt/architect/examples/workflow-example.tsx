/**
 * Architect Workflow Example
 *
 * This example demonstrates how to use the architect framework
 * for AI-assisted software engineering with the 4-phase workflow.
 *
 * @example
 * ```tsx
 * import { ArchitectWorkflowDemo } from '@clarity-chat/react/prompt/architect/examples'
 *
 * function App() {
 *   return <ArchitectWorkflowDemo />
 * }
 * ```
 *
 * @packageDocumentation
 */

import React, { useState } from 'react'
import {
  useArchitectWorkflow,
  useSecurityAudit,
  useDesignPatterns,
} from '../hooks'
import {
  createAuditResult,
  createSecurityFinding,
  createCodeSmellFinding,
  createTechnicalDebtItem,
  formatAuditResultAsMarkdown,
} from '../phases/phase1-audit'
import {
  createStrategicPlan,
  createPlanningStep,
  createPatternRecommendation,
  createTestPlanItem,
  formatStrategicPlanAsMarkdown,
} from '../phases/phase2-planning'
import {
  createImplementationOutput,
  formatImplementationAsMarkdown,
} from '../phases/phase3-implementation'
import {
  createReviewResult,
  createDRYCheckResult,
  createADR,
  formatReviewResultAsMarkdown,
} from '../phases/phase4-review'
import type { ArchitectPhase } from '../types'

/**
 * Phase indicator component
 */
function PhaseIndicator({
  phase,
  currentPhase,
  isComplete,
}: {
  phase: ArchitectPhase
  currentPhase: ArchitectPhase
  isComplete: boolean
}) {
  const phases: ArchitectPhase[] = ['analysis', 'planning', 'implementation', 'review']
  const phaseIndex = phases.indexOf(phase)
  const currentIndex = phases.indexOf(currentPhase)

  let status: 'pending' | 'active' | 'complete'
  if (isComplete || phaseIndex < currentIndex) {
    status = 'complete'
  } else if (phaseIndex === currentIndex) {
    status = 'active'
  } else {
    status = 'pending'
  }

  const phaseNames: Record<ArchitectPhase, string> = {
    analysis: '1. Analysis & Audit',
    planning: '2. Strategic Planning',
    implementation: '3. Implementation',
    review: '4. Review & Reflection',
  }

  return (
    <div
      style={{
        padding: '8px 16px',
        borderRadius: '4px',
        backgroundColor:
          status === 'complete'
            ? '#10b981'
            : status === 'active'
              ? '#3b82f6'
              : '#e5e7eb',
        color: status === 'pending' ? '#6b7280' : 'white',
        fontWeight: status === 'active' ? 'bold' : 'normal',
      }}
    >
      {phaseNames[phase]}
    </div>
  )
}

/**
 * Architect Workflow Demo Component
 *
 * Demonstrates the complete 4-phase architect workflow with
 * interactive controls and output visualization.
 */
export function ArchitectWorkflowDemo() {
  const [output, setOutput] = useState<string>('')

  const workflow = useArchitectWorkflow({
    onPhaseComplete: (phase, result) => {
      setOutput((prev) => prev + `\n\n--- Phase ${phase} Complete ---\n`)
    },
    onWorkflowComplete: (state) => {
      setOutput((prev) => prev + '\n\n=== WORKFLOW COMPLETE ===\n')
    },
  })

  // Simulate completing Phase 1
  const completePhase1 = () => {
    const auditResult = createAuditResult({
      securityFindings: [
        createSecurityFinding(
          'A03_INJECTION',
          'high',
          'Potential SQL injection in user search query',
          'Use parameterized queries instead of string concatenation',
          { location: 'src/api/users.ts:45', cweId: 'CWE-89' }
        ),
        createSecurityFinding(
          'A07_AUTH_FAILURES',
          'medium',
          'Session token stored in localStorage',
          'Use httpOnly cookies for session tokens',
          { location: 'src/auth/session.ts:12' }
        ),
      ],
      codeSmells: [
        createCodeSmellFinding(
          'HIGH_CYCLOMATIC_COMPLEXITY',
          'high',
          'processOrder function has 18 decision points',
          'Extract validation, calculation, and persistence into separate methods',
          { location: 'src/orders/processor.ts:89', estimatedEffort: 'major' }
        ),
        createCodeSmellFinding(
          'GOD_OBJECT',
          'medium',
          'UserService class has 45 methods',
          'Split into UserAuthService, UserProfileService, UserPreferencesService',
          { location: 'src/services/UserService.ts', estimatedEffort: 'significant' }
        ),
      ],
      technicalDebt: [
        createTechnicalDebtItem(
          'ARCHITECTURAL_DEBT',
          'high',
          'No clear separation between domain and infrastructure',
          'Changes to database affect business logic',
          'Implement hexagonal/clean architecture',
          'high'
        ),
      ],
    })

    setOutput(formatAuditResultAsMarkdown(auditResult))
    workflow.completeAudit(auditResult)
  }

  // Simulate completing Phase 2
  const completePhase2 = () => {
    const plan = createStrategicPlan({
      chainOfThought: `
## Understanding
The codebase has security vulnerabilities and code quality issues that need addressing.
Primary concerns are SQL injection, authentication weaknesses, and architectural debt.

## Key Constraints
- Must maintain backward compatibility with existing API
- Cannot change database schema
- Limited time for implementation

## Approach
1. Fix security issues first (highest risk)
2. Refactor processOrder to reduce complexity
3. Begin UserService decomposition
4. Add comprehensive tests
      `.trim(),
      steps: [
        createPlanningStep({
          stepNumber: 1,
          title: 'Fix SQL Injection Vulnerability',
          description: 'Replace string concatenation with parameterized queries',
          expectedOutcome: 'All database queries use prepared statements',
          complexity: 'simple',
          riskLevel: 'low',
        }),
        createPlanningStep({
          stepNumber: 2,
          title: 'Secure Session Management',
          description: 'Move session tokens to httpOnly cookies',
          expectedOutcome: 'Sessions stored securely, XSS-resistant',
          dependencies: [],
          complexity: 'moderate',
          riskLevel: 'medium',
        }),
        createPlanningStep({
          stepNumber: 3,
          title: 'Refactor processOrder Function',
          description: 'Extract into smaller, focused methods',
          expectedOutcome: 'Cyclomatic complexity under 10',
          dependencies: [1, 2],
          complexity: 'complex',
          riskLevel: 'medium',
        }),
      ],
      patternRecommendations: [
        createPatternRecommendation(
          'STRATEGY',
          'Use Strategy pattern for order validation to allow different validation rules',
          ['✓ Easy to add new validation rules', '✓ Testable in isolation', '✗ More classes'],
          'Create OrderValidationStrategy interface with implementations for each rule type'
        ),
        createPatternRecommendation(
          'FACADE',
          'Facade for UserService to maintain backward compatibility during decomposition',
          ['✓ Clean migration path', '✓ No breaking changes', '✗ Temporary complexity'],
          'UserServiceFacade delegates to new micro-services internally'
        ),
      ],
      testPlan: [
        createTestPlanItem({
          strategy: 'SECURITY',
          target: 'SQL injection fix',
          description: 'Verify parameterized queries prevent injection',
          priority: 'critical',
        }),
        createTestPlanItem({
          strategy: 'UNIT',
          target: 'processOrder extracted methods',
          description: 'Test each extracted method independently',
          coverage: '>90%',
          priority: 'high',
        }),
        createTestPlanItem({
          strategy: 'INTEGRATION',
          target: 'UserService decomposition',
          description: 'Verify facade routes correctly to new services',
          priority: 'high',
        }),
      ],
    })

    setOutput(formatStrategicPlanAsMarkdown(plan))
    workflow.completePlanning(plan)
  }

  // Simulate completing Phase 3
  const completePhase3 = () => {
    const implementation = createImplementationOutput({
      code: `/**
 * Process an order with validated items
 *
 * @param order - The order to process
 * @param validator - Validation strategy to use
 * @returns Processing result with status and any errors
 * @throws OrderValidationError if validation fails
 */
export async function processOrder(
  order: Order,
  validator: OrderValidationStrategy
): Promise<ProcessingResult> {
  // Validate order using strategy pattern
  const validationResult = await validator.validate(order)
  if (!validationResult.isValid) {
    throw new OrderValidationError(validationResult.errors)
  }

  // Calculate totals using extracted method
  const totals = calculateOrderTotals(order.items)

  // Persist using parameterized query (SQL injection fix)
  const orderId = await persistOrder(order, totals)

  return {
    status: 'success',
    orderId,
    totals,
  }
}

/**
 * Calculate order totals from items
 */
function calculateOrderTotals(items: OrderItem[]): OrderTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  return { subtotal, tax, total }
}

/**
 * Persist order to database using parameterized query
 */
async function persistOrder(
  order: Order,
  totals: OrderTotals
): Promise<string> {
  // Using parameterized query to prevent SQL injection
  const result = await db.query(
    \`INSERT INTO orders (user_id, items, subtotal, tax, total, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING id\`,
    [order.userId, JSON.stringify(order.items), totals.subtotal, totals.tax, totals.total]
  )

  return result.rows[0].id
}`,
      language: 'typescript',
      suggestedFilePath: 'src/orders/processor.ts',
      boyScoutRuleApplied: true,
      legacyImprovements: [
        'Added JSDoc documentation to all public functions',
        'Extracted magic number TAX_RATE to constant',
        'Added proper TypeScript types',
        'Replaced SQL string concatenation with parameterized query',
      ],
      dependenciesAdded: ['@types/pg'],
    })

    setOutput(formatImplementationAsMarkdown(implementation))
    workflow.completeImplementation(implementation)
  }

  // Simulate completing Phase 4
  const completePhase4 = () => {
    const review = createReviewResult({
      selfCorrections: [
        { constraint: 'All required functionality implemented', passed: true },
        { constraint: 'Code is DRY', passed: true },
        { constraint: 'Single Responsibility Principle followed', passed: true },
        { constraint: 'Error handling is comprehensive', passed: true },
        { constraint: 'Types are strict and complete', passed: true },
        {
          constraint: 'No hardcoded secrets',
          passed: true,
          details: 'Database connection uses environment variables',
        },
      ],
      dryCheck: createDRYCheckResult({ isDRY: true }),
      securityRecheck: [], // No new security issues
      adr: createADR({
        title: 'Use Strategy Pattern for Order Validation',
        status: 'accepted',
        context:
          'The processOrder function had high complexity due to multiple validation paths. Different order types require different validation rules.',
        decision:
          'Implement Strategy pattern to encapsulate validation logic. Each order type gets its own validation strategy.',
        consequences: {
          positive: [
            'Easy to add new order types without modifying existing code',
            'Each strategy is independently testable',
            'Complexity moved from single function to focused classes',
          ],
          negative: [
            'Increased number of classes',
            'Need to maintain strategy registry',
          ],
          neutral: ['Learning curve for developers unfamiliar with pattern'],
        },
        alternativesConsidered: [
          'Switch statement - rejected due to OCP violations',
          'Chain of Responsibility - rejected as validations are mutually exclusive',
        ],
      }),
    })

    setOutput(formatReviewResultAsMarkdown(review))
    workflow.completeReview(review)
  }

  return (
    <div style={{ fontFamily: 'system-ui', padding: '20px', maxWidth: '1200px' }}>
      <h1>Architect Workflow Demo</h1>

      {/* Progress indicator */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <PhaseIndicator
            phase="analysis"
            currentPhase={workflow.state.currentPhase}
            isComplete={workflow.state.isComplete}
          />
          <PhaseIndicator
            phase="planning"
            currentPhase={workflow.state.currentPhase}
            isComplete={workflow.state.isComplete}
          />
          <PhaseIndicator
            phase="implementation"
            currentPhase={workflow.state.currentPhase}
            isComplete={workflow.state.isComplete}
          />
          <PhaseIndicator
            phase="review"
            currentPhase={workflow.state.currentPhase}
            isComplete={workflow.state.isComplete}
          />
        </div>
        <div
          style={{
            height: '4px',
            backgroundColor: '#e5e7eb',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${workflow.progress}%`,
              backgroundColor: '#3b82f6',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Progress: {workflow.progress}%
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={completePhase1}
          disabled={workflow.state.currentPhase !== 'analysis'}
          style={{
            padding: '8px 16px',
            backgroundColor: workflow.state.currentPhase === 'analysis' ? '#3b82f6' : '#e5e7eb',
            color: workflow.state.currentPhase === 'analysis' ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '4px',
            cursor: workflow.state.currentPhase === 'analysis' ? 'pointer' : 'not-allowed',
          }}
        >
          Run Audit
        </button>
        <button
          onClick={completePhase2}
          disabled={workflow.state.currentPhase !== 'planning'}
          style={{
            padding: '8px 16px',
            backgroundColor: workflow.state.currentPhase === 'planning' ? '#3b82f6' : '#e5e7eb',
            color: workflow.state.currentPhase === 'planning' ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '4px',
            cursor: workflow.state.currentPhase === 'planning' ? 'pointer' : 'not-allowed',
          }}
        >
          Create Plan
        </button>
        <button
          onClick={completePhase3}
          disabled={workflow.state.currentPhase !== 'implementation'}
          style={{
            padding: '8px 16px',
            backgroundColor:
              workflow.state.currentPhase === 'implementation' ? '#3b82f6' : '#e5e7eb',
            color: workflow.state.currentPhase === 'implementation' ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '4px',
            cursor: workflow.state.currentPhase === 'implementation' ? 'pointer' : 'not-allowed',
          }}
        >
          Implement
        </button>
        <button
          onClick={completePhase4}
          disabled={workflow.state.currentPhase !== 'review'}
          style={{
            padding: '8px 16px',
            backgroundColor: workflow.state.currentPhase === 'review' ? '#3b82f6' : '#e5e7eb',
            color: workflow.state.currentPhase === 'review' ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '4px',
            cursor: workflow.state.currentPhase === 'review' ? 'pointer' : 'not-allowed',
          }}
        >
          Review
        </button>
        <button
          onClick={() => {
            workflow.resetWorkflow()
            setOutput('')
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          Reset
        </button>
      </div>

      {/* Output */}
      <div
        style={{
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
          padding: '16px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '13px',
          whiteSpace: 'pre-wrap',
          maxHeight: '600px',
          overflow: 'auto',
        }}
      >
        {output || 'Click "Run Audit" to start the workflow...'}
      </div>
    </div>
  )
}

/**
 * Security Audit Demo Component
 */
export function SecurityAuditDemo() {
  const audit = useSecurityAudit({
    onFindingDetected: (finding) => {
      console.log('Found:', finding.type, '-', finding.severity)
    },
    onAuditComplete: (findings, riskScore) => {
      console.log(`Audit complete. Risk score: ${riskScore}`)
    },
  })

  return (
    <div style={{ fontFamily: 'system-ui', padding: '20px' }}>
      <h1>Security Audit Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <p>
          <strong>Status:</strong> {audit.state.isAuditing ? 'Auditing...' : 'Ready'}
        </p>
        <p>
          <strong>Risk Score:</strong> {audit.state.riskScore}/100
        </p>
        <p>
          <strong>Findings:</strong> {audit.state.findings.length}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button onClick={audit.startAudit}>Start Audit</button>
        <button
          onClick={() =>
            audit.addFinding(
              'A03_INJECTION',
              'high',
              'SQL injection in user input',
              'Use parameterized queries'
            )
          }
        >
          Add Injection Finding
        </button>
        <button
          onClick={() =>
            audit.addFinding(
              'A07_AUTH_FAILURES',
              'critical',
              'Weak password hashing',
              'Use bcrypt or argon2'
            )
          }
        >
          Add Auth Finding
        </button>
        <button onClick={audit.endAudit}>End Audit</button>
        <button onClick={audit.clearFindings}>Clear</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Severity Counts</h3>
        <ul>
          <li>Critical: {audit.severityCounts.critical}</li>
          <li>High: {audit.severityCounts.high}</li>
          <li>Medium: {audit.severityCounts.medium}</li>
          <li>Low: {audit.severityCounts.low}</li>
          <li>Info: {audit.severityCounts.info}</li>
        </ul>
      </div>

      {audit.hasCriticalFindings && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '4px',
            color: '#dc2626',
          }}
        >
          ⚠️ Critical security findings detected!
        </div>
      )}
    </div>
  )
}

/**
 * Design Patterns Demo Component
 */
export function DesignPatternsDemo() {
  const patterns = useDesignPatterns()
  const [useCase, setUseCase] = useState('')

  return (
    <div style={{ fontFamily: 'system-ui', padding: '20px' }}>
      <h1>Design Patterns Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          placeholder="Describe your use case..."
          style={{ width: '300px', padding: '8px', marginRight: '8px' }}
        />
        <button onClick={() => patterns.setSearchQuery(useCase)}>Search</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Filter by Category</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'creational', 'structural', 'behavioral'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => patterns.setFilterCategory(cat)}
              style={{
                backgroundColor: patterns.state.filterCategory === cat ? '#3b82f6' : '#e5e7eb',
                color: patterns.state.filterCategory === cat ? 'white' : 'black',
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {useCase && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Suggested Patterns for: "{useCase}"</h3>
          <ul>
            {patterns.suggestPatterns(useCase).map((pattern) => (
              <li key={pattern}>
                <button onClick={() => patterns.selectPattern(pattern)}>
                  {pattern}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>Selected Patterns ({patterns.state.selectedPatterns.length})</h3>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {patterns.state.selectedPatterns.map((pattern) => (
            <span
              key={pattern}
              style={{
                padding: '4px 8px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => patterns.deselectPattern(pattern)}
            >
              {pattern} ×
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3>Available Patterns</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '8px',
          }}
        >
          {patterns.filteredPatterns.map((pattern) => {
            const info = patterns.getPatternDetails(pattern)
            return (
              <div
                key={pattern}
                style={{
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: patterns.isSelected(pattern) ? '#eff6ff' : 'white',
                }}
                onClick={() => patterns.togglePattern(pattern)}
              >
                <strong>{info.name}</strong>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{info.category}</div>
                <div style={{ fontSize: '13px', marginTop: '4px' }}>{info.intent}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ArchitectWorkflowDemo
