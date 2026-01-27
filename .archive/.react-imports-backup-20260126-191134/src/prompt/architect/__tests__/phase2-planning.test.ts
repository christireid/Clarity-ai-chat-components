/**
 * Tests for Phase 2: Strategic Planning utilities
 */

import { describe, it, expect } from 'vitest'
import {
  DESIGN_PATTERN_CATALOG,
  createPlanningStep,
  createPatternRecommendation,
  createRejectedAlternative,
  createTestPlanItem,
  calculateTotalComplexity,
  createStrategicPlan,
  formatStrategicPlanAsMarkdown,
  generatePlanningBlockTemplate,
  getPatternInfo,
  getPatternIdsByCategory,
  suggestPatternsForUseCase,
} from '../phases/phase2-planning'
import type { DesignPattern, DesignPatternCategory } from '../types'

describe('Phase 2: Strategic Planning', () => {
  describe('DESIGN_PATTERN_CATALOG', () => {
    it('should contain all 23 GoF patterns', () => {
      const patterns = Object.keys(DESIGN_PATTERN_CATALOG)
      expect(patterns.length).toBe(23)
    })

    it('should have creational patterns', () => {
      const creational: DesignPattern[] = [
        'SINGLETON',
        'FACTORY_METHOD',
        'ABSTRACT_FACTORY',
        'BUILDER',
        'PROTOTYPE',
      ]

      for (const pattern of creational) {
        expect(DESIGN_PATTERN_CATALOG[pattern]).toBeDefined()
        expect(DESIGN_PATTERN_CATALOG[pattern].category).toBe('creational')
      }
    })

    it('should have structural patterns', () => {
      const structural: DesignPattern[] = [
        'ADAPTER',
        'BRIDGE',
        'COMPOSITE',
        'DECORATOR',
        'FACADE',
        'FLYWEIGHT',
        'PROXY',
      ]

      for (const pattern of structural) {
        expect(DESIGN_PATTERN_CATALOG[pattern]).toBeDefined()
        expect(DESIGN_PATTERN_CATALOG[pattern].category).toBe('structural')
      }
    })

    it('should have behavioral patterns', () => {
      const behavioral: DesignPattern[] = [
        'CHAIN_OF_RESPONSIBILITY',
        'COMMAND',
        'INTERPRETER',
        'ITERATOR',
        'MEDIATOR',
        'MEMENTO',
        'OBSERVER',
        'STATE',
        'STRATEGY',
        'TEMPLATE_METHOD',
        'VISITOR',
      ]

      for (const pattern of behavioral) {
        expect(DESIGN_PATTERN_CATALOG[pattern]).toBeDefined()
        expect(DESIGN_PATTERN_CATALOG[pattern].category).toBe('behavioral')
      }
    })

    it('should have complete pattern information', () => {
      for (const [key, pattern] of Object.entries(DESIGN_PATTERN_CATALOG)) {
        expect(pattern.name).toBeTruthy()
        expect(pattern.intent).toBeTruthy()
        expect(pattern.useCases.length).toBeGreaterThan(0)
        expect(pattern.tradeoffs.pros.length).toBeGreaterThan(0)
        expect(pattern.tradeoffs.cons.length).toBeGreaterThan(0)
        expect(pattern.implementation).toBeTruthy()
      }
    })
  })

  describe('createPlanningStep', () => {
    it('should create a planning step with defaults', () => {
      const step = createPlanningStep({
        stepNumber: 1,
        title: 'Setup project',
        description: 'Initialize the project structure',
        expectedOutcome: 'Project skeleton created',
      })

      expect(step.stepNumber).toBe(1)
      expect(step.title).toBe('Setup project')
      expect(step.dependencies).toEqual([])
      expect(step.complexity).toBe('moderate')
      expect(step.riskLevel).toBe('low')
    })

    it('should respect explicit values', () => {
      const step = createPlanningStep({
        stepNumber: 3,
        title: 'Complex refactor',
        description: 'Major refactoring',
        expectedOutcome: 'Cleaner code',
        dependencies: [1, 2],
        complexity: 'very_complex',
        riskLevel: 'high',
      })

      expect(step.dependencies).toEqual([1, 2])
      expect(step.complexity).toBe('very_complex')
      expect(step.riskLevel).toBe('high')
    })
  })

  describe('createPatternRecommendation', () => {
    it('should create a recommendation with pattern info', () => {
      const rec = createPatternRecommendation(
        'FACTORY_METHOD',
        'Allows flexible object creation'
      )

      expect(rec.pattern).toBe('FACTORY_METHOD')
      expect(rec.category).toBe('creational')
      expect(rec.rationale).toBe('Allows flexible object creation')
      expect(rec.tradeoffs.length).toBeGreaterThan(0)
    })

    it('should use custom tradeoffs when provided', () => {
      const rec = createPatternRecommendation(
        'SINGLETON',
        'Need single instance',
        ['Custom pro', 'Custom con'],
        'Use getInstance()'
      )

      expect(rec.tradeoffs).toEqual(['Custom pro', 'Custom con'])
      expect(rec.implementationNotes).toBe('Use getInstance()')
    })
  })

  describe('createRejectedAlternative', () => {
    it('should create a rejected alternative', () => {
      const alt = createRejectedAlternative(
        'Inheritance',
        'Use class hierarchy',
        'Too rigid for this use case',
        'When hierarchy is stable'
      )

      expect(alt.name).toBe('Inheritance')
      expect(alt.description).toBe('Use class hierarchy')
      expect(alt.rejectionReason).toBe('Too rigid for this use case')
      expect(alt.preferredWhen).toBe('When hierarchy is stable')
    })
  })

  describe('createTestPlanItem', () => {
    it('should create a test plan item with defaults', () => {
      const item = createTestPlanItem({
        strategy: 'UNIT',
        target: 'calculateTotal function',
        description: 'Test all calculation paths',
      })

      expect(item.strategy).toBe('UNIT')
      expect(item.target).toBe('calculateTotal function')
      expect(item.priority).toBe('medium')
    })

    it('should include coverage when provided', () => {
      const item = createTestPlanItem({
        strategy: 'INTEGRATION',
        target: 'API endpoints',
        description: 'Test all endpoints',
        coverage: '>90%',
        priority: 'critical',
      })

      expect(item.coverage).toBe('>90%')
      expect(item.priority).toBe('critical')
    })
  })

  describe('calculateTotalComplexity', () => {
    it('should return trivial for simple steps', () => {
      const steps = [
        createPlanningStep({
          stepNumber: 1,
          title: 'Step 1',
          description: 'Desc',
          expectedOutcome: 'Done',
          complexity: 'trivial',
        }),
        createPlanningStep({
          stepNumber: 2,
          title: 'Step 2',
          description: 'Desc',
          expectedOutcome: 'Done',
          complexity: 'trivial',
        }),
      ]

      expect(calculateTotalComplexity(steps)).toBe('trivial')
    })

    it('should return very_complex for complex steps', () => {
      const steps = [
        createPlanningStep({
          stepNumber: 1,
          title: 'Step 1',
          description: 'Desc',
          expectedOutcome: 'Done',
          complexity: 'very_complex',
        }),
        createPlanningStep({
          stepNumber: 2,
          title: 'Step 2',
          description: 'Desc',
          expectedOutcome: 'Done',
          complexity: 'complex',
        }),
      ]

      expect(calculateTotalComplexity(steps)).toBe('very_complex')
    })

    it('should return moderate for mixed complexity', () => {
      const steps = [
        createPlanningStep({
          stepNumber: 1,
          title: 'Step 1',
          description: 'Desc',
          expectedOutcome: 'Done',
          complexity: 'simple',
        }),
        createPlanningStep({
          stepNumber: 2,
          title: 'Step 2',
          description: 'Desc',
          expectedOutcome: 'Done',
          complexity: 'complex',
        }),
      ]

      const result = calculateTotalComplexity(steps)
      expect(['moderate', 'complex']).toContain(result)
    })
  })

  describe('createStrategicPlan', () => {
    it('should create a strategic plan', () => {
      const plan = createStrategicPlan({
        chainOfThought: 'Thinking through the problem...',
        steps: [
          createPlanningStep({
            stepNumber: 1,
            title: 'Step 1',
            description: 'First step',
            expectedOutcome: 'Done',
          }),
        ],
      })

      expect(plan.chainOfThought).toBe('Thinking through the problem...')
      expect(plan.steps.length).toBe(1)
      expect(plan.patternRecommendations).toEqual([])
      expect(plan.rejectedAlternatives).toEqual([])
      expect(plan.testPlan).toEqual([])
      expect(plan.totalComplexity).toBeDefined()
    })

    it('should include all optional fields', () => {
      const plan = createStrategicPlan({
        chainOfThought: 'Thinking...',
        steps: [
          createPlanningStep({
            stepNumber: 1,
            title: 'Step',
            description: 'Desc',
            expectedOutcome: 'Done',
          }),
        ],
        patternRecommendations: [
          createPatternRecommendation('FACTORY_METHOD', 'Good fit'),
        ],
        rejectedAlternatives: [
          createRejectedAlternative('Alt', 'Desc', 'Reason'),
        ],
        testPlan: [
          createTestPlanItem({
            strategy: 'UNIT',
            target: 'Function',
            description: 'Test it',
          }),
        ],
        approachSummary: 'Custom summary',
      })

      expect(plan.patternRecommendations.length).toBe(1)
      expect(plan.rejectedAlternatives.length).toBe(1)
      expect(plan.testPlan.length).toBe(1)
      expect(plan.approachSummary).toBe('Custom summary')
    })
  })

  describe('formatStrategicPlanAsMarkdown', () => {
    it('should format plan as markdown', () => {
      const plan = createStrategicPlan({
        chainOfThought: 'My reasoning...',
        steps: [
          createPlanningStep({
            stepNumber: 1,
            title: 'First Step',
            description: 'Do the first thing',
            expectedOutcome: 'First thing done',
          }),
        ],
        patternRecommendations: [
          createPatternRecommendation('STRATEGY', 'Flexible algorithms'),
        ],
      })

      const markdown = formatStrategicPlanAsMarkdown(plan)

      expect(markdown).toContain('# Strategic Plan')
      expect(markdown).toContain('Chain of Thought')
      expect(markdown).toContain('My reasoning...')
      expect(markdown).toContain('Step 1: First Step')
      expect(markdown).toContain('Design Pattern Recommendations')
      expect(markdown).toContain('STRATEGY')
    })
  })

  describe('generatePlanningBlockTemplate', () => {
    it('should generate a template with all sections', () => {
      const template = generatePlanningBlockTemplate()

      expect(template).toContain('<PLANNING>')
      expect(template).toContain('</PLANNING>')
      expect(template).toContain('Understanding')
      expect(template).toContain('Constraints')
      expect(template).toContain('Assumptions')
      expect(template).toContain('Steps')
      expect(template).toContain('Test Strategy')
    })
  })

  describe('getPatternInfo', () => {
    it('should return pattern information', () => {
      const info = getPatternInfo('OBSERVER')

      expect(info.name).toBe('Observer')
      expect(info.category).toBe('behavioral')
      expect(info.intent).toBeTruthy()
    })
  })

  describe('getPatternIdsByCategory', () => {
    it('should return only creational patterns', () => {
      const patterns = getPatternIdsByCategory('creational')

      expect(patterns.length).toBe(5)
      for (const pattern of patterns) {
        expect(DESIGN_PATTERN_CATALOG[pattern].category).toBe('creational')
      }
    })

    it('should return only behavioral patterns', () => {
      const patterns = getPatternIdsByCategory('behavioral')

      expect(patterns.length).toBe(11)
      for (const pattern of patterns) {
        expect(DESIGN_PATTERN_CATALOG[pattern].category).toBe('behavioral')
      }
    })
  })

  describe('suggestPatternsForUseCase', () => {
    it('should suggest patterns for object creation', () => {
      const suggestions = suggestPatternsForUseCase('object creation')

      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions.length).toBeLessThanOrEqual(5)
    })

    it('should suggest observer for event handling', () => {
      const suggestions = suggestPatternsForUseCase('event system notification')

      expect(suggestions).toContain('OBSERVER')
    })

    it('should suggest factory for framework extension', () => {
      const suggestions = suggestPatternsForUseCase(
        'framework extension plugin'
      )

      expect(suggestions).toContain('FACTORY_METHOD')
    })

    it('should return empty for unrelated use case', () => {
      const suggestions = suggestPatternsForUseCase('xyzabc123')

      expect(suggestions.length).toBe(0)
    })
  })
})
