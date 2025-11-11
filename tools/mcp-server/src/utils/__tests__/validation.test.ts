/**
 * Tests for validation utilities
 */

import { describe, it, expect } from 'vitest'
import { validateRequired, validateEnum, validateString, validateNumber } from '../validation.js'
import { ValidationError } from '../errors.js'

describe('validation', () => {
  describe('validateRequired', () => {
    it('should pass when all required fields are present', () => {
      expect(() => {
        validateRequired({ a: 1, b: 2 } as any, ['a', 'b'])
      }).not.toThrow()
    })

    it('should throw ValidationError when required field is missing', () => {
      expect(() => {
        validateRequired({ a: 1 } as any, ['a', 'b'])
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError when field is null', () => {
      expect(() => {
        validateRequired({ a: null }, ['a'])
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError when field is empty string', () => {
      expect(() => {
        validateRequired({ a: '' }, ['a'])
      }).toThrow(ValidationError)
    })
  })

  describe('validateEnum', () => {
    it('should return value when valid', () => {
      const result = validateEnum('openai', ['openai', 'anthropic'] as const, 'provider')
      expect(result).toBe('openai')
    })

    it('should throw ValidationError when invalid', () => {
      expect(() => {
        validateEnum('invalid', ['openai', 'anthropic'] as const, 'provider')
      }).toThrow(ValidationError)
    })
  })

  describe('validateString', () => {
    it('should return string when valid', () => {
      const result = validateString('test', 'param')
      expect(result).toBe('test')
    })

    it('should throw ValidationError when not a string', () => {
      expect(() => {
        validateString(123 as any, 'param')
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError when too short', () => {
      expect(() => {
        validateString('', 'param', 1)
      }).toThrow(ValidationError)
    })
  })

  describe('validateNumber', () => {
    it('should return number when valid', () => {
      const result = validateNumber(100, 'param')
      expect(result).toBe(100)
    })

    it('should throw ValidationError when not a number', () => {
      expect(() => {
        validateNumber('123' as any, 'param')
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError when below minimum', () => {
      expect(() => {
        validateNumber(-1, 'param', 0)
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError when above maximum', () => {
      expect(() => {
        validateNumber(101, 'param', 0, 100)
      }).toThrow(ValidationError)
    })
  })
})
