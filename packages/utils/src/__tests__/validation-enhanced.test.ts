/**
 * Test suite for enhanced validation utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  // Enhanced validation functions
  validateString,
  validateNumber,
  validateArray,
  validateUnion,
  validateEnum,
  validateDate,
  validateOptional,
  // Enhanced type guards
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isArray,
  isArrayOf,
  isNull,
  isUndefined,
  isNullish,
  isDefined,
  isNonEmptyString,
  isNonEmptyArray,
  isValidDate,
  isPromise,
  isError,
  // Enhanced assertions
  assertString,
  assertNumber,
  assertBoolean,
  assertObject,
  assertArray,
  assertFunction,
  assertDefined,
  assertNever,
  // Enhanced format validators
  isValidEmail,
  isValidUrl,
  isValidUuid,
  isValidJson,
  parseJson,
  // Enhanced object utilities
  hasKey,
  hasKeys,
  pick,
  omit,
  // Enhanced strict runtime checking
  strictTypeOf,
  strictProperty,
  strictArrayAccess,
  // Enhanced format validation
  isValidEmail as isValidEmailEnhanced,
  isValidUrl as isValidUrlEnhanced,
  isValidUuid as isValidUuidEnhanced,
  isValidJson as isValidJsonEnhanced,
  parseJson as parseJsonEnhanced,
  StrictValidation,
} from '../validation/enhanced'

describe('Enhanced Validation Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Type Guards', () => {
    describe('isString', () => {
      it('should return true for strings', () => {
        expect(isString('hello')).toBe(true)
        expect(isString('')).toBe(true)
      })

      it('should return false for non-strings', () => {
        expect(isString(123)).toBe(false)
        expect(isString(null)).toBe(false)
        expect(isString(undefined)).toBe(false)
      })
    })

    describe('isNumber', () => {
      it('should return true for valid numbers', () => {
        expect(isNumber(123)).toBe(true)
        expect(isNumber(0)).toBe(true)
        expect(isNumber(-123)).toBe(true)
        expect(isNumber(123.45)).toBe(true)
      })

      it('should return false for NaN and non-numbers', () => {
        expect(isNumber(NaN)).toBe(false)
        expect(isNumber('123')).toBe(false)
        expect(isNumber(null)).toBe(false)
      })
    })

    describe('isArrayOf', () => {
      it('should validate arrays of specific type', () => {
        const isStringArray = (value: unknown): value is string[] =>
          isArray(value) && value.every(isString)

        expect(isArrayOf(['a', 'b', 'c'], isString)).toBe(true)
        expect(isArrayOf(['a', 2, 'c'], isString)).toBe(false)
      })
    })
  })

  describe('Assertions', () => {
    describe('assertString', () => {
      it('should not throw for strings', () => {
        expect(() => assertString('hello')).not.toThrow()
      })

      it('should throw for non-strings', () => {
        expect(() => assertString(123)).toThrow(TypeError)
      })
    })

    describe('assertDefined', () => {
      it('should not throw for defined values', () => {
        expect(() => assertDefined('hello')).not.toThrow()
        expect(() => assertDefined(0)).not.toThrow()
        expect(() => assertDefined(false)).not.toThrow()
      })

      it('should throw for null or undefined', () => {
        expect(() => assertDefined(null)).toThrow(TypeError)
        expect(() => assertDefined(undefined)).toThrow(TypeError)
      })
    })
  })

  describe('Validation Functions', () => {
    describe('validateString', () => {
      it('should validate strings with options', () => {
        const result = validateString('hello', {
          minLength: 3,
          maxLength: 10,
        })

        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe('hello')
        }
      })

      it('should return errors for invalid strings', () => {
        const result = validateString('hi', {
          minLength: 5,
        })

        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.errors).toContain(
            'String must be at least 5 characters long'
          )
        }
      })
    })

    describe('validateNumber', () => {
      it('should validate numbers with options', () => {
        const result = validateNumber(42, {
          min: 0,
          max: 100,
          integer: true,
        })

        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toBe(42)
        }
      })

      it('should validate integers', () => {
        const result = validateNumber(42.5, {
          integer: true,
        })

        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.errors).toContain('Number must be an integer')
        }
      })
    })

    describe('validateArray', () => {
      it('should validate arrays with item validator', () => {
        const result = validateArray([1, 2, 3], (item): item is number =>
          isNumber(item)
        )

        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual([1, 2, 3])
        }
      })

      it('should validate array length', () => {
        const result = validateArray(
          [1, 2],
          (item): item is number => isNumber(item),
          { minLength: 3 }
        )

        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.errors).toContain('Array must have at least 3 items')
        }
      })
    })
  })

  describe('Format Validation', () => {
    describe('isValidEmail', () => {
      it('should validate email addresses', () => {
        expect(isValidEmail('user@example.com')).toBe(true)
        expect(isValidEmail('test.user@domain.co.uk')).toBe(true)
        expect(isValidEmail('invalid-email')).toBe(false)
        expect(isValidEmail('')).toBe(false)
      })
    })

    describe('isValidUrl', () => {
      it('should validate URLs', () => {
        expect(isValidUrl('https://example.com')).toBe(true)
        expect(isValidUrl('http://localhost:3000')).toBe(true)
        expect(isValidUrl('not-a-url')).toBe(false)
      })
    })

    describe('isValidUuid', () => {
      it('should validate UUIDs', () => {
        expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
        expect(isValidUuid('not-a-uuid')).toBe(false)
      })
    })

    describe('isValidJson', () => {
      it('should validate JSON strings', () => {
        expect(isValidJson('{"key": "value"}')).toBe(true)
        expect(isValidJson('invalid json')).toBe(false)
      })
    })

    describe('parseJson', () => {
      it('should parse valid JSON', () => {
        const result = parseJson('{"key": "value"}')
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual({ key: 'value' })
        }
      })

      it('should handle invalid JSON', () => {
        const result = parseJson('invalid json')
        expect(result.success).toBe(false)
        if (!result.success && result.error) {
          expect(result.error).toBeInstanceOf(Error)
        }
      })
    })
  })

  describe('Object Utilities', () => {
    const testObj = { a: 1, b: 2, c: 3 }

    describe('pick', () => {
      it('should pick specified properties', () => {
        const result = pick(testObj, ['a', 'c'])
        expect(result).toEqual({ a: 1, c: 3 })
      })
    })

    describe('omit', () => {
      it('should omit specified properties', () => {
        const result = omit(testObj, ['b'])
        expect(result).toEqual({ a: 1, c: 3 })
      })
    })

    describe('hasKey', () => {
      it('should check if object has key', () => {
        expect(hasKey(testObj, 'a')).toBe(true)
        expect(hasKey(testObj, 'd')).toBe(false)
      })
    })

    describe('hasKeys', () => {
      it('should check if object has all keys', () => {
        expect(hasKeys(testObj, ['a', 'b'])).toBe(true)
        expect(hasKeys(testObj, ['a', 'd'])).toBe(false)
      })
    })
  })

  describe('Strict Runtime Checking', () => {
    describe('strictTypeOf', () => {
      it('should return value if type guard passes', () => {
        const result = strictTypeOf('hello', isString, 'Expected string')
        expect(result).toBe('hello')
      })

      it('should throw if type guard fails', () => {
        expect(() => strictTypeOf(123, isString, 'Expected string')).toThrow(
          TypeError
        )
      })
    })

    describe('strictPropertyAccess', () => {
      it('should access object properties safely', () => {
        const obj = { a: { b: 'value' } }
        const result = strictProperty(obj, 'a')
        expect(result).toEqual({ b: 'value' })
      })

      it('should throw for null objects', () => {
        expect(() => strictProperty(null, 'a')).toThrow(TypeError)
      })
    })

    describe('strictArrayAccess', () => {
      it('should access array elements safely', () => {
        const arr = [1, 2, 3]
        const result = strictArrayAccess(arr, 1)
        expect(result).toBe(2)
      })

      it('should throw for out of bounds access', () => {
        const arr = [1, 2, 3]
        expect(() => strictArrayAccess(arr, 5)).toThrow(RangeError)
      })
    })
  })

  describe('Integration Tests', () => {
    it('should work together in a validation pipeline', () => {
      const data = {
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
      }

      // Validate each field
      const nameResult = validateString(data.name, { minLength: 1 })
      const ageResult = validateNumber(data.age, { min: 0, max: 150 })
      const emailResult = isValidEmail(data.email)

      expect(nameResult.success).toBe(true)
      expect(ageResult.success).toBe(true)
      expect(emailResult).toBe(true)

      if (nameResult.success && ageResult.success) {
        expect(nameResult.data).toBe('John Doe')
        expect(ageResult.data).toBe(30)
      }
    })

    it('should handle complex validation scenarios', () => {
      interface User {
        id: string
        name: string
        age: number
        email: string
      }

      const validateUser = (value: unknown): StrictValidation<User> => {
        if (!isObject(value)) {
          return { success: false, errors: ['Expected object'] }
        }

        const errors: string[] = []

        // Validate ID
        const idResult = validateString(value.id, { required: true })
        if (!idResult.success) {
          errors.push(`id: ${idResult.errors.join(', ')}`)
        }

        // Validate name
        const nameResult = validateString(value.name, { minLength: 1 })
        if (!nameResult.success) {
          errors.push(`name: ${nameResult.errors.join(', ')}`)
        }

        // Validate age
        const ageResult = validateNumber(value.age, { min: 0, max: 150 })
        if (!ageResult.success) {
          errors.push(`age: ${ageResult.errors.join(', ')}`)
        }

        // Validate email
        if (!isValidEmail(value.email)) {
          errors.push('email: Invalid email format')
        }

        if (errors.length > 0) {
          return { success: false, errors }
        }

        return {
          success: true,
          data: value as User,
        }
      }

      const validUser = {
        id: '123',
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
      }

      const result = validateUser(validUser)
      expect(result.success).toBe(true)

      const invalidUser = {
        id: '',
        name: '',
        age: -5,
        email: 'invalid-email',
      }

      const invalidResult = validateUser(invalidUser)
      expect(invalidResult.success).toBe(false)
      if (!invalidResult.success) {
        expect(invalidResult.errors.length).toBeGreaterThan(0)
      }
    })
  })
})
