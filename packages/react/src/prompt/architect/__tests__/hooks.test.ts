/**
 * Tests for Architect React Hooks
 */

import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useArchitectWorkflow } from '../hooks/use-architect-workflow'
import { useSecurityAudit } from '../hooks/use-security-audit'
import { useDesignPatterns } from '../hooks/use-design-patterns'
import { createAuditResult, createSecurityFinding } from '../phases/phase1-audit'
import { createStrategicPlan, createPlanningStep } from '../phases/phase2-planning'
import { createImplementationOutput } from '../phases/phase3-implementation'
import { createReviewResult, createDRYCheckResult } from '../phases/phase4-review'

describe('Architect Hooks', () => {
  describe('useArchitectWorkflow', () => {
    it('should initialize with analysis phase', () => {
      const { result } = renderHook(() => useArchitectWorkflow())

      expect(result.current.state.currentPhase).toBe('analysis')
      expect(result.current.state.isComplete).toBe(false)
      expect(result.current.progress).toBe(0)
    })

    it('should have default config', () => {
      const { result } = renderHook(() => useArchitectWorkflow())

      expect(result.current.config.styleGuide.language).toBe('typescript')
      expect(result.current.config.enableSecurityScan).toBe(true)
    })

    it('should accept custom config', () => {
      const { result } = renderHook(() =>
        useArchitectWorkflow({
          config: {
            styleGuide: {
              language: 'python',
              styleGuide: 'google',
              naming: {
                variables: 'snake_case',
                functions: 'snake_case',
                classes: 'PascalCase',
                constants: 'SCREAMING_SNAKE_CASE',
                files: 'snake_case',
              },
              preferImmutability: false,
              strictTyping: true,
              indentation: 'spaces',
              indentSize: 4,
            },
          },
        })
      )

      expect(result.current.config.styleGuide.language).toBe('python')
    })

    it('should update config', () => {
      const { result } = renderHook(() => useArchitectWorkflow())

      act(() => {
        result.current.updateConfig({
          enableSecurityScan: false,
        })
      })

      expect(result.current.config.enableSecurityScan).toBe(false)
    })

    it('should complete audit phase and advance to planning', () => {
      const onPhaseComplete = vi.fn()
      const { result } = renderHook(() =>
        useArchitectWorkflow({ onPhaseComplete })
      )

      const auditResult = createAuditResult({})

      act(() => {
        result.current.completeAudit(auditResult)
      })

      expect(result.current.state.currentPhase).toBe('planning')
      expect(result.current.state.auditResult).toBeDefined()
      expect(result.current.progress).toBe(25)
      expect(onPhaseComplete).toHaveBeenCalledWith('analysis', auditResult)
    })

    it('should complete planning phase and advance to implementation', () => {
      const { result } = renderHook(() => useArchitectWorkflow())

      const auditResult = createAuditResult({})
      const plan = createStrategicPlan({
        chainOfThought: 'Test',
        steps: [
          createPlanningStep({
            stepNumber: 1,
            title: 'Step',
            description: 'Desc',
            expectedOutcome: 'Done',
          }),
        ],
      })

      act(() => {
        result.current.completeAudit(auditResult)
      })

      act(() => {
        result.current.completePlanning(plan)
      })

      expect(result.current.state.currentPhase).toBe('implementation')
      expect(result.current.state.strategicPlan).toBeDefined()
      expect(result.current.progress).toBe(50)
    })

    it('should complete implementation phase and advance to review', () => {
      const { result } = renderHook(() => useArchitectWorkflow())

      act(() => {
        result.current.completeAudit(createAuditResult({}))
      })

      act(() => {
        result.current.completePlanning(
          createStrategicPlan({
            chainOfThought: 'T',
            steps: [
              createPlanningStep({
                stepNumber: 1,
                title: 'S',
                description: 'D',
                expectedOutcome: 'E',
              }),
            ],
          })
        )
      })

      const implementation = createImplementationOutput({
        code: 'const x = 1',
        language: 'typescript',
      })

      act(() => {
        result.current.completeImplementation(implementation)
      })

      expect(result.current.state.currentPhase).toBe('review')
      expect(result.current.progress).toBe(75)
    })

    it('should complete review phase and finish workflow', () => {
      const onWorkflowComplete = vi.fn()
      const { result } = renderHook(() =>
        useArchitectWorkflow({ onWorkflowComplete })
      )

      act(() => {
        result.current.completeAudit(createAuditResult({}))
      })

      act(() => {
        result.current.completePlanning(
          createStrategicPlan({
            chainOfThought: 'T',
            steps: [
              createPlanningStep({
                stepNumber: 1,
                title: 'S',
                description: 'D',
                expectedOutcome: 'E',
              }),
            ],
          })
        )
      })

      act(() => {
        result.current.completeImplementation(
          createImplementationOutput({
            code: 'x',
            language: 'typescript',
          })
        )
      })

      const review = createReviewResult({
        selfCorrections: [],
        dryCheck: createDRYCheckResult({ isDRY: true }),
        securityRecheck: [],
      })

      act(() => {
        result.current.completeReview(review)
      })

      expect(result.current.state.isComplete).toBe(true)
      expect(result.current.progress).toBe(100)
      expect(onWorkflowComplete).toHaveBeenCalled()
    })

    it('should reset workflow', () => {
      const { result } = renderHook(() => useArchitectWorkflow())

      act(() => {
        result.current.completeAudit(createAuditResult({}))
      })

      expect(result.current.state.currentPhase).toBe('planning')

      act(() => {
        result.current.resetWorkflow()
      })

      expect(result.current.state.currentPhase).toBe('analysis')
      expect(result.current.state.auditResult).toBeUndefined()
    })

    it('should add and clear errors', () => {
      const onError = vi.fn()
      const { result } = renderHook(() => useArchitectWorkflow({ onError }))

      act(() => {
        result.current.addError('Test error')
      })

      expect(result.current.state.errors).toContain('Test error')
      expect(onError).toHaveBeenCalledWith('Test error')

      act(() => {
        result.current.clearErrors()
      })

      expect(result.current.state.errors).toEqual([])
    })

    it('should check canProceed correctly', () => {
      const { result } = renderHook(() => useArchitectWorkflow())

      expect(result.current.canProceed).toBe(true)

      act(() => {
        result.current.completeAudit(createAuditResult({}))
      })

      expect(result.current.canProceed).toBe(true)
    })

    it('should check isPhase correctly', () => {
      const { result } = renderHook(() => useArchitectWorkflow())

      expect(result.current.isPhase('analysis')).toBe(true)
      expect(result.current.isPhase('planning')).toBe(false)

      act(() => {
        result.current.completeAudit(createAuditResult({}))
      })

      expect(result.current.isPhase('analysis')).toBe(false)
      expect(result.current.isPhase('planning')).toBe(true)
    })
  })

  describe('useSecurityAudit', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useSecurityAudit())

      expect(result.current.state.isAuditing).toBe(false)
      expect(result.current.state.findings).toEqual([])
      expect(result.current.state.riskScore).toBe(0)
    })

    it('should start audit', () => {
      const { result } = renderHook(() => useSecurityAudit())

      act(() => {
        result.current.startAudit()
      })

      expect(result.current.state.isAuditing).toBe(true)
      expect(result.current.state.findings).toEqual([])
    })

    it('should add findings', () => {
      const onFindingDetected = vi.fn()
      const { result } = renderHook(() =>
        useSecurityAudit({ onFindingDetected })
      )

      act(() => {
        result.current.startAudit()
      })

      act(() => {
        result.current.addFinding(
          'A03_INJECTION',
          'high',
          'SQL injection',
          'Use params'
        )
      })

      expect(result.current.state.findings.length).toBe(1)
      expect(result.current.state.riskScore).toBeGreaterThan(0)
      expect(onFindingDetected).toHaveBeenCalled()
    })

    it('should end audit', () => {
      const onAuditComplete = vi.fn()
      const { result } = renderHook(() =>
        useSecurityAudit({ onAuditComplete })
      )

      act(() => {
        result.current.startAudit()
      })

      act(() => {
        result.current.addFinding('A03_INJECTION', 'high', 'Test', 'Fix')
      })

      act(() => {
        result.current.endAudit()
      })

      expect(result.current.state.isAuditing).toBe(false)
      expect(result.current.state.lastAuditTime).toBeInstanceOf(Date)
      expect(onAuditComplete).toHaveBeenCalled()
    })

    it('should remove finding by index', () => {
      const { result } = renderHook(() => useSecurityAudit())

      act(() => {
        result.current.addFinding('A03_INJECTION', 'high', 'Test 1', 'Fix')
        result.current.addFinding('A07_AUTH_FAILURES', 'medium', 'Test 2', 'Fix')
      })

      expect(result.current.state.findings.length).toBe(2)

      act(() => {
        result.current.removeFinding(0)
      })

      expect(result.current.state.findings.length).toBe(1)
      expect(result.current.state.findings[0].type).toBe('A07_AUTH_FAILURES')
    })

    it('should clear all findings', () => {
      const { result } = renderHook(() => useSecurityAudit())

      act(() => {
        result.current.addFinding('A03_INJECTION', 'high', 'Test', 'Fix')
        result.current.addFinding('A07_AUTH_FAILURES', 'high', 'Test', 'Fix')
      })

      act(() => {
        result.current.clearFindings()
      })

      expect(result.current.state.findings).toEqual([])
      expect(result.current.state.riskScore).toBe(0)
    })

    it('should get findings by severity', () => {
      const { result } = renderHook(() => useSecurityAudit())

      act(() => {
        result.current.addFinding('A03_INJECTION', 'high', 'Test', 'Fix')
        result.current.addFinding('A07_AUTH_FAILURES', 'medium', 'Test', 'Fix')
        result.current.addFinding('A01_BROKEN_ACCESS_CONTROL', 'high', 'Test', 'Fix')
      })

      const highFindings = result.current.getFindingsBySeverity('high')
      expect(highFindings.length).toBe(2)

      const mediumFindings = result.current.getFindingsBySeverity('medium')
      expect(mediumFindings.length).toBe(1)
    })

    it('should get findings by type', () => {
      const { result } = renderHook(() => useSecurityAudit())

      act(() => {
        result.current.addFinding('A03_INJECTION', 'high', 'Test 1', 'Fix')
        result.current.addFinding('A03_INJECTION', 'medium', 'Test 2', 'Fix')
        result.current.addFinding('A07_AUTH_FAILURES', 'high', 'Test 3', 'Fix')
      })

      const injectionFindings = result.current.getFindingsByType('A03_INJECTION')
      expect(injectionFindings.length).toBe(2)
    })

    it('should calculate severity counts', () => {
      const { result } = renderHook(() => useSecurityAudit())

      act(() => {
        result.current.addFinding('A03_INJECTION', 'critical', 'Test', 'Fix')
        result.current.addFinding('A03_INJECTION', 'high', 'Test', 'Fix')
        result.current.addFinding('A07_AUTH_FAILURES', 'high', 'Test', 'Fix')
        result.current.addFinding('A01_BROKEN_ACCESS_CONTROL', 'medium', 'Test', 'Fix')
      })

      expect(result.current.severityCounts.critical).toBe(1)
      expect(result.current.severityCounts.high).toBe(2)
      expect(result.current.severityCounts.medium).toBe(1)
      expect(result.current.severityCounts.low).toBe(0)
    })

    it('should detect critical findings', () => {
      const { result } = renderHook(() => useSecurityAudit())

      expect(result.current.hasCriticalFindings).toBe(false)

      act(() => {
        result.current.addFinding('A03_INJECTION', 'critical', 'Test', 'Fix')
      })

      expect(result.current.hasCriticalFindings).toBe(true)
    })

    it('should get vulnerability info', () => {
      const { result } = renderHook(() => useSecurityAudit())

      const info = result.current.getVulnerabilityInfo('A03_INJECTION')

      expect(info.name).toBe('Injection')
      expect(info.patterns.length).toBeGreaterThan(0)
    })
  })

  describe('useDesignPatterns', () => {
    it('should initialize with empty selection', () => {
      const { result } = renderHook(() => useDesignPatterns())

      expect(result.current.state.selectedPatterns).toEqual([])
      expect(result.current.state.filterCategory).toBe('all')
      expect(result.current.allPatterns.length).toBe(23)
    })

    it('should accept initial patterns', () => {
      const { result } = renderHook(() =>
        useDesignPatterns({
          initialPatterns: ['SINGLETON', 'FACTORY_METHOD'],
        })
      )

      expect(result.current.state.selectedPatterns).toEqual([
        'SINGLETON',
        'FACTORY_METHOD',
      ])
    })

    it('should select pattern', () => {
      const onPatternSelected = vi.fn()
      const { result } = renderHook(() =>
        useDesignPatterns({ onPatternSelected })
      )

      act(() => {
        result.current.selectPattern('OBSERVER')
      })

      expect(result.current.state.selectedPatterns).toContain('OBSERVER')
      expect(onPatternSelected).toHaveBeenCalledWith('OBSERVER')
    })

    it('should not duplicate selected patterns', () => {
      const { result } = renderHook(() => useDesignPatterns())

      act(() => {
        result.current.selectPattern('OBSERVER')
        result.current.selectPattern('OBSERVER')
      })

      expect(result.current.state.selectedPatterns.length).toBe(1)
    })

    it('should deselect pattern', () => {
      const onPatternDeselected = vi.fn()
      const { result } = renderHook(() =>
        useDesignPatterns({
          initialPatterns: ['SINGLETON', 'OBSERVER'],
          onPatternDeselected,
        })
      )

      act(() => {
        result.current.deselectPattern('SINGLETON')
      })

      expect(result.current.state.selectedPatterns).not.toContain('SINGLETON')
      expect(result.current.state.selectedPatterns).toContain('OBSERVER')
      expect(onPatternDeselected).toHaveBeenCalledWith('SINGLETON')
    })

    it('should toggle pattern', () => {
      const { result } = renderHook(() => useDesignPatterns())

      act(() => {
        result.current.togglePattern('STRATEGY')
      })

      expect(result.current.state.selectedPatterns).toContain('STRATEGY')

      act(() => {
        result.current.togglePattern('STRATEGY')
      })

      expect(result.current.state.selectedPatterns).not.toContain('STRATEGY')
    })

    it('should clear selections', () => {
      const { result } = renderHook(() =>
        useDesignPatterns({
          initialPatterns: ['SINGLETON', 'OBSERVER', 'STRATEGY'],
        })
      )

      act(() => {
        result.current.clearSelections()
      })

      expect(result.current.state.selectedPatterns).toEqual([])
    })

    it('should filter by category', () => {
      const { result } = renderHook(() => useDesignPatterns())

      act(() => {
        result.current.setFilterCategory('creational')
      })

      expect(result.current.state.filterCategory).toBe('creational')
      expect(result.current.filteredPatterns.length).toBe(5)
      expect(result.current.filteredPatterns).toContain('SINGLETON')
      expect(result.current.filteredPatterns).not.toContain('OBSERVER')
    })

    it('should filter by search query', () => {
      const { result } = renderHook(() => useDesignPatterns())

      act(() => {
        result.current.setSearchQuery('factory')
      })

      expect(result.current.filteredPatterns).toContain('FACTORY_METHOD')
      expect(result.current.filteredPatterns).toContain('ABSTRACT_FACTORY')
    })

    it('should add recommendation', () => {
      const { result } = renderHook(() => useDesignPatterns())

      act(() => {
        result.current.addRecommendation(
          'STRATEGY',
          'Allows flexible algorithm selection',
          ['Pro 1', 'Con 1'],
          'Use interfaces'
        )
      })

      expect(result.current.state.recommendations.length).toBe(1)
      expect(result.current.state.recommendations[0].pattern).toBe('STRATEGY')
      expect(result.current.state.selectedPatterns).toContain('STRATEGY')
    })

    it('should remove recommendation', () => {
      const { result } = renderHook(() => useDesignPatterns())

      act(() => {
        result.current.addRecommendation('STRATEGY', 'Test')
        result.current.addRecommendation('OBSERVER', 'Test')
      })

      act(() => {
        result.current.removeRecommendation('STRATEGY')
      })

      expect(result.current.state.recommendations.length).toBe(1)
      expect(result.current.state.recommendations[0].pattern).toBe('OBSERVER')
    })

    it('should get pattern details', () => {
      const { result } = renderHook(() => useDesignPatterns())

      const details = result.current.getPatternDetails('OBSERVER')

      expect(details.name).toBe('Observer')
      expect(details.category).toBe('behavioral')
      expect(details.intent).toBeTruthy()
    })

    it('should suggest patterns for use case', () => {
      const { result } = renderHook(() => useDesignPatterns())

      const suggestions = result.current.suggestPatterns('event notification system')

      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions).toContain('OBSERVER')
    })

    it('should check if pattern is selected', () => {
      const { result } = renderHook(() =>
        useDesignPatterns({
          initialPatterns: ['SINGLETON'],
        })
      )

      expect(result.current.isSelected('SINGLETON')).toBe(true)
      expect(result.current.isSelected('OBSERVER')).toBe(false)
    })

    it('should get patterns by category', () => {
      const { result } = renderHook(() => useDesignPatterns())

      const behavioral = result.current.getByCategory('behavioral')

      expect(behavioral.length).toBe(11)
      expect(behavioral).toContain('OBSERVER')
      expect(behavioral).toContain('STRATEGY')
    })
  })
})
