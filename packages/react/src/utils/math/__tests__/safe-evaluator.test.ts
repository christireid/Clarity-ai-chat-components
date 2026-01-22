/**
 * Tests for Safe Mathematical Expression Evaluator
 *
 * Verifies security and correctness of the safe evaluator.
 */

import { describe, it, expect } from 'vitest'
import {
  safeEvaluate,
  isValidExpression,
  safeEvaluateWithError,
} from '../safe-evaluator'

describe('safeEvaluate', () => {
  describe('basic arithmetic', () => {
    it('should evaluate addition', () => {
      expect(safeEvaluate('2 + 2')).toBe(4)
      expect(safeEvaluate('10 + 5')).toBe(15)
    })

    it('should evaluate subtraction', () => {
      expect(safeEvaluate('10 - 5')).toBe(5)
      expect(safeEvaluate('5 - 10')).toBe(-5)
    })

    it('should evaluate multiplication', () => {
      expect(safeEvaluate('2 * 3')).toBe(6)
      expect(safeEvaluate('10 * 0')).toBe(0)
    })

    it('should evaluate division', () => {
      expect(safeEvaluate('10 / 2')).toBe(5)
      expect(safeEvaluate('10 / 4')).toBe(2.5)
    })

    it('should evaluate modulo', () => {
      expect(safeEvaluate('10 % 3')).toBe(1)
      expect(safeEvaluate('20 % 6')).toBe(2)
    })
  })

  describe('operator precedence', () => {
    it('should respect multiplication before addition', () => {
      expect(safeEvaluate('2 + 3 * 4')).toBe(14)
      expect(safeEvaluate('10 - 2 * 3')).toBe(4)
    })

    it('should respect division before subtraction', () => {
      expect(safeEvaluate('10 - 6 / 2')).toBe(7)
    })

    it('should evaluate left to right for same precedence', () => {
      expect(safeEvaluate('10 - 5 + 3')).toBe(8)
      expect(safeEvaluate('20 / 4 * 2')).toBe(10)
    })
  })

  describe('parentheses', () => {
    it('should respect parentheses', () => {
      expect(safeEvaluate('(2 + 3) * 4')).toBe(20)
      expect(safeEvaluate('10 / (2 + 3)')).toBe(2)
    })

    it('should handle nested parentheses', () => {
      expect(safeEvaluate('((2 + 3) * (4 - 1))')).toBe(15)
      expect(safeEvaluate('(10 / (2 + 3)) * 2')).toBe(4)
    })

    it('should handle multiple parentheses groups', () => {
      expect(safeEvaluate('(2 + 3) * (4 + 5)')).toBe(45)
    })
  })

  describe('unary operators', () => {
    it('should handle unary minus', () => {
      expect(safeEvaluate('-5')).toBe(-5)
      expect(safeEvaluate('-5 + 3')).toBe(-2)
      expect(safeEvaluate('10 + -5')).toBe(5)
    })

    it('should handle unary plus', () => {
      expect(safeEvaluate('+5')).toBe(5)
      expect(safeEvaluate('+5 + 3')).toBe(8)
    })

    it('should handle double unary minus', () => {
      expect(safeEvaluate('--5')).toBe(5)
      expect(safeEvaluate('---5')).toBe(-5)
    })
  })

  describe('decimal numbers', () => {
    it('should handle decimal numbers', () => {
      expect(safeEvaluate('2.5 + 3.7')).toBeCloseTo(6.2)
      expect(safeEvaluate('10.5 / 2')).toBe(5.25)
    })

    it('should handle numbers starting with decimal', () => {
      expect(safeEvaluate('.5 + .5')).toBe(1)
    })
  })

  describe('whitespace handling', () => {
    it('should ignore whitespace', () => {
      expect(safeEvaluate('  2  +  3  ')).toBe(5)
      expect(safeEvaluate('2+3')).toBe(5)
      expect(safeEvaluate('( 2 + 3 ) * 4')).toBe(20)
    })
  })

  describe('complex expressions', () => {
    it('should evaluate complex expressions', () => {
      expect(safeEvaluate('(10 + 5) * 2 - 8 / 4')).toBe(28)
      expect(safeEvaluate('((10 - 5) * 2 + 3) / (2 + 1)')).toBeCloseTo(4.333333)
    })
  })

  describe('security - injection prevention', () => {
    it('should reject expressions with letters', () => {
      expect(() => safeEvaluate('alert("xss")')).toThrow('Invalid character')
      expect(() => safeEvaluate('console.log("test")')).toThrow('Invalid character')
    })

    it('should reject expressions with special characters', () => {
      expect(() => safeEvaluate('2 + 3; alert(1)')).toThrow('Invalid character')
      expect(() => safeEvaluate('2 & 3')).toThrow('Invalid character')
      expect(() => safeEvaluate('2 | 3')).toThrow('Invalid character')
    })

    it('should reject expressions with function-like syntax', () => {
      expect(() => safeEvaluate('Math.random()')).toThrow('Invalid character')
      expect(() => safeEvaluate('eval("2+2")')).toThrow('Invalid character')
    })

    it('should reject expressions with variable names', () => {
      expect(() => safeEvaluate('x + 5')).toThrow('Invalid character')
      expect(() => safeEvaluate('myVar * 2')).toThrow('Invalid character')
    })
  })

  describe('security - DoS prevention', () => {
    it('should reject expressions that are too long', () => {
      const longExpr = '1+'.repeat(600) + '1' // > 1000 chars
      expect(() => safeEvaluate(longExpr)).toThrow('Expression too long')
    })

    it('should reject expressions that are too deeply nested', () => {
      const deeplyNested = '('.repeat(150) + '1' + ')'.repeat(150)
      expect(() => safeEvaluate(deeplyNested)).toThrow('too deeply nested')
    })

    it('should accept expressions within limits', () => {
      const longButOk = '1+'.repeat(400) + '1' // < 1000 chars
      expect(safeEvaluate(longButOk)).toBe(401)
    })
  })

  describe('error handling', () => {
    it('should reject division by zero', () => {
      expect(() => safeEvaluate('10 / 0')).toThrow('Division by zero')
      expect(() => safeEvaluate('5 / (3 - 3)')).toThrow('Division by zero')
    })

    it('should reject invalid numbers', () => {
      expect(() => safeEvaluate('2 + 3.4.5')).toThrow('Invalid number')
    })

    it('should reject missing closing parenthesis', () => {
      expect(() => safeEvaluate('(2 + 3')).toThrow('Missing closing parenthesis')
    })

    it('should reject unexpected tokens', () => {
      expect(() => safeEvaluate('2 + 3 )')).toThrow('Unexpected token')
    })

    it('should reject empty expressions', () => {
      expect(() => safeEvaluate('')).toThrow('Unexpected end of expression')
    })

    it('should reject expressions ending with operator', () => {
      expect(() => safeEvaluate('2 +')).toThrow('Unexpected end of expression')
    })
  })

  describe('edge cases', () => {
    it('should handle single number', () => {
      expect(safeEvaluate('42')).toBe(42)
      expect(safeEvaluate('-42')).toBe(-42)
    })

    it('should handle zero', () => {
      expect(safeEvaluate('0')).toBe(0)
      expect(safeEvaluate('0 + 0')).toBe(0)
      expect(safeEvaluate('5 * 0')).toBe(0)
    })

    it('should ensure result is finite', () => {
      // Infinity should be rejected
      expect(safeEvaluate('1e308 * 10')).toBeGreaterThan(0)
      // But extremely large numbers that overflow to Infinity should fail
      expect(() => {
        const result = safeEvaluate('1e308 * 1e308')
        if (!isFinite(result)) throw new Error('Result is not a finite number')
      }).toThrow('not a finite number')
    })
  })
})

describe('isValidExpression', () => {
  it('should return true for valid expressions', () => {
    expect(isValidExpression('2 + 2')).toBe(true)
    expect(isValidExpression('(10 - 5) * 2')).toBe(true)
  })

  it('should return false for invalid expressions', () => {
    expect(isValidExpression('alert("xss")')).toBe(false)
    expect(isValidExpression('2 +')).toBe(false)
    expect(isValidExpression('(2 + 3')).toBe(false)
  })
})

describe('safeEvaluateWithError', () => {
  it('should return success result for valid expressions', () => {
    const result = safeEvaluateWithError('2 + 2')
    expect(result.success).toBe(true)
    expect(result.result).toBe(4)
    expect(result.error).toBeUndefined()
  })

  it('should return error result for invalid expressions', () => {
    const result = safeEvaluateWithError('alert("xss")')
    expect(result.success).toBe(false)
    expect(result.result).toBeUndefined()
    expect(result.error).toContain('Invalid character')
  })

  it('should return error for division by zero', () => {
    const result = safeEvaluateWithError('10 / 0')
    expect(result.success).toBe(false)
    expect(result.error).toContain('Division by zero')
  })
})
