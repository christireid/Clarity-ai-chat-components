/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render } from '@testing-library/react'
import {
  testAccessibility,
  assertNoAccessibilityViolations,
  assertWCAG2_1AACompliance,
  checkColorContrast,
  logAccessibilityViolations,
  useAccessibilityTesting,
} from '../accessibility-testing'

// Mock axe-core
const mockAxe = {
  run: jest.fn(),
}

beforeAll(() => {
  // Mock axe globally
  ;(global as any).window = {
    axe: mockAxe,
    location: { href: 'http://localhost:3000' },
  }
})

afterAll(() => {
  delete (global as any).window
})

describe('Accessibility Testing', () => {
  beforeEach(() => {
    mockAxe.run.mockClear()
  })

  describe('testAccessibility', () => {
    it('should run accessibility tests successfully', async () => {
      const mockResults = {
        violations: [],
        passes: [{ id: 'button-name', impact: 'serious', description: 'test', help: 'help' }],
        incomplete: [],
        inapplicable: [],
      }

      mockAxe.run.mockResolvedValue(mockResults)

      const component = <button>Click me</button>
      const report = await testAccessibility(component)

      expect(mockAxe.run).toHaveBeenCalled()
      expect(report.violations).toEqual([])
      expect(report.passes).toEqual(mockResults.passes)
      expect(report.timestamp).toBeDefined()
    })

    it('should handle axe-core not available', async () => {
      delete (global as any).window.axe

      const component = <button>Click me</button>
      const report = await testAccessibility(component)

      expect(report.violations).toEqual([])
      expect(report.passes).toEqual([])
    })

    it('should handle test failures', async () => {
      mockAxe.run.mockRejectedValue(new Error('Test failed'))

      const component = <button>Click me</button>
      const report = await testAccessibility(component)

      expect(report.violations).toHaveLength(1)
      expect(report.violations[0].id).toBe('test-failure')
    })
  })

  describe('assertNoAccessibilityViolations', () => {
    it('should pass when no violations', () => {
      const report = {
        violations: [],
        passes: [],
        incomplete: [],
        inapplicable: [],
        timestamp: Date.now(),
      }

      expect(() => assertNoAccessibilityViolations(report)).not.toThrow()
    })

    it('should throw when violations exist', () => {
      const report = {
        violations: [{
          id: 'color-contrast',
          impact: 'serious' as const,
          description: 'Color contrast is insufficient',
          help: 'Fix color contrast',
          helpUrl: 'https://example.com',
          nodes: [],
          tags: ['wcag2aa'],
        }],
        passes: [],
        incomplete: [],
        inapplicable: [],
        timestamp: Date.now(),
      }

      expect(() => assertNoAccessibilityViolations(report)).toThrow(
        'Accessibility violations found'
      )
    })

    it('should allow specified impacts', () => {
      const report = {
        violations: [{
          id: 'color-contrast',
          impact: 'minor' as const,
          description: 'Minor issue',
          help: 'Fix it',
          helpUrl: 'https://example.com',
          nodes: [],
          tags: [],
        }],
        passes: [],
        incomplete: [],
        inapplicable: [],
        timestamp: Date.now(),
      }

      expect(() => assertNoAccessibilityViolations(report, ['minor'])).not.toThrow()
    })
  })

  describe('assertWCAG2_1AACompliance', () => {
    it('should pass when no serious/critical violations', () => {
      const report = {
        violations: [{
          id: 'color-contrast',
          impact: 'moderate' as const,
          description: 'Moderate issue',
          help: 'Fix it',
          helpUrl: 'https://example.com',
          nodes: [],
          tags: [],
        }],
        passes: [],
        incomplete: [],
        inapplicable: [],
        timestamp: Date.now(),
      }

      expect(() => assertWCAG2_1AACompliance(report)).not.toThrow()
    })

    it('should throw on serious violations', () => {
      const report = {
        violations: [{
          id: 'color-contrast',
          impact: 'serious' as const,
          description: 'Serious issue',
          help: 'Fix it',
          helpUrl: 'https://example.com',
          nodes: [],
          tags: [],
        }],
        passes: [],
        incomplete: [],
        inapplicable: [],
        timestamp: Date.now(),
      }

      expect(() => assertWCAG2_1AACompliance(report)).toThrow(
        'WCAG 2.1 AA violations found'
      )
    })
  })

  describe('checkColorContrast', () => {
    it('should identify color contrast violations', () => {
      const report = {
        violations: [
          {
            id: 'color-contrast',
            impact: 'serious' as const,
            description: 'Color contrast violation',
            help: 'Fix contrast',
            helpUrl: 'https://example.com',
            nodes: [],
            tags: [],
          },
          {
            id: 'button-name',
            impact: 'moderate' as const,
            description: 'Button name missing',
            help: 'Add name',
            helpUrl: 'https://example.com',
            nodes: [],
            tags: [],
          },
        ],
        passes: [],
        incomplete: [],
        inapplicable: [],
        timestamp: Date.now(),
      }

      const result = checkColorContrast(report)

      expect(result.violations).toHaveLength(1)
      expect(result.violations[0].id).toBe('color-contrast')
      expect(result.summary).toContain('1 color contrast violation')
    })

    it('should report no violations', () => {
      const report = {
        violations: [],
        passes: [],
        incomplete: [],
        inapplicable: [],
        timestamp: Date.now(),
      }

      const result = checkColorContrast(report)

      expect(result.violations).toHaveLength(0)
      expect(result.summary).toContain('No color contrast violations')
    })
  })

  describe('useAccessibilityTesting', () => {
    it('should provide testing interface', () => {
      let hookResult: any

      const TestComponent = () => {
        hookResult = useAccessibilityTesting()
        return <div>Test</div>
      }

      render(<TestComponent />)

      expect(hookResult).toHaveProperty('report')
      expect(hookResult).toHaveProperty('isTesting')
      expect(hookResult).toHaveProperty('runTest')
      expect(hookResult).toHaveProperty('hasViolations')
      expect(hookResult).toHaveProperty('violationsCount')
    })
  })
})