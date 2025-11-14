/**
 * Tests for Prompt Utilities
 */

import { describe, it, expect } from 'vitest'
import {
  exceedsTokenBudget,
  getTokenUsagePercent,
  formatTokenCount,
  formatCost,
  getTokenBudgetStatus,
  getRemainingTokens,
} from '../utils'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'

describe('Prompt Utilities', () => {
  const testMessages: CoreMessage[] = [
    { role: 'user', content: 'Hello, world!' },
    { role: 'assistant', content: 'Hi there!' },
  ]

  describe('exceedsTokenBudget', () => {
    it('should return false when under budget', () => {
      const exceeds = exceedsTokenBudget(testMessages, 1000)
      expect(exceeds).toBe(false)
    })

    it('should return true when over budget', () => {
      const largeMessages: CoreMessage[] = Array.from({ length: 100 }, () => ({
        role: 'user',
        content: 'x'.repeat(1000),
      }))
      
      const exceeds = exceedsTokenBudget(largeMessages, 100)
      expect(exceeds).toBe(true)
    })
  })

  describe('getTokenUsagePercent', () => {
    it('should calculate usage percentage', () => {
      const percent = getTokenUsagePercent(testMessages, 1000)
      expect(percent).toBeGreaterThan(0)
      expect(percent).toBeLessThanOrEqual(100)
    })

    it('should cap at 100%', () => {
      const largeMessages: CoreMessage[] = Array.from({ length: 100 }, () => ({
        role: 'user',
        content: 'x'.repeat(1000),
      }))
      
      const percent = getTokenUsagePercent(largeMessages, 100)
      expect(percent).toBe(100)
    })
  })

  describe('formatTokenCount', () => {
    it('should format small numbers', () => {
      expect(formatTokenCount(500)).toBe('500')
      expect(formatTokenCount(999)).toBe('999')
    })

    it('should format thousands', () => {
      expect(formatTokenCount(1000)).toBe('1.0K')
      expect(formatTokenCount(1500)).toBe('1.5K')
      expect(formatTokenCount(9999)).toContain('K')
    })

    it('should format millions', () => {
      expect(formatTokenCount(1000000)).toContain('M')
    })
  })

  describe('formatCost', () => {
    it('should format small costs as cents', () => {
      const formatted = formatCost(0.005)
      expect(formatted).toContain('¢')
    })

    it('should format larger costs as dollars', () => {
      const formatted = formatCost(0.1)
      expect(formatted).toContain('$')
    })
  })

  describe('getTokenBudgetStatus', () => {
    it('should return safe for low usage', () => {
      const status = getTokenBudgetStatus(100, 1000)
      expect(status).toBe('safe')
    })

    it('should return warning for high usage', () => {
      const status = getTokenBudgetStatus(850, 1000)
      expect(status).toBe('warning')
    })

    it('should return exceeded when over budget', () => {
      const status = getTokenBudgetStatus(1100, 1000)
      expect(status).toBe('exceeded')
    })
  })

  describe('getRemainingTokens', () => {
    it('should calculate remaining tokens', () => {
      const remaining = getRemainingTokens(500, 1000)
      expect(remaining).toBe(500)
    })

    it('should not return negative', () => {
      const remaining = getRemainingTokens(1500, 1000)
      expect(remaining).toBe(0)
    })
  })
})
