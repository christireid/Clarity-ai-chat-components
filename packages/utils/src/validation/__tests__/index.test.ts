/**
 * Validation Utilities Tests
 */
import { describe, it, expect } from 'vitest'
import {
  // Type guards
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
  // Assertions
  assertDefined,
  assertString,
  assertNumber,
  assertObject,
  assertArray,
  assertNever,
  // Format validators
  isValidEmail,
  isValidUrl,
  isValidUUID,
  isValidJSON,
  parseJSON,
  // Object utilities
  hasKey,
  hasKeys,
  pick,
  omit,
} from '../index.js'

describe('Type Guards', () => {
  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('')).toBe(true)
      expect(isString('hello')).toBe(true)
      expect(isString(String('test'))).toBe(true)
    })

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(undefined)).toBe(false)
      expect(isString({})).toBe(false)
      expect(isString([])).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(0)).toBe(true)
      expect(isNumber(123)).toBe(true)
      expect(isNumber(-456)).toBe(true)
      expect(isNumber(3.14)).toBe(true)
      expect(isNumber(Infinity)).toBe(true)
    })

    it('should return false for NaN', () => {
      expect(isNumber(NaN)).toBe(false)
    })

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false)
      expect(isNumber(null)).toBe(false)
      expect(isNumber(undefined)).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
    })

    it('should return false for non-booleans', () => {
      expect(isBoolean(0)).toBe(false)
      expect(isBoolean(1)).toBe(false)
      expect(isBoolean('true')).toBe(false)
      expect(isBoolean(null)).toBe(false)
    })
  })

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true)
      expect(isFunction(function () {})).toBe(true)
      expect(isFunction(async () => {})).toBe(true)
      expect(isFunction(class {})).toBe(true)
    })

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false)
      expect(isFunction(null)).toBe(false)
      expect(isFunction('function')).toBe(false)
    })
  })

  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
      expect(isObject(Object.create(null))).toBe(true)
    })

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false)
    })

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false)
      expect(isObject([1, 2, 3])).toBe(false)
    })

    it('should return false for primitives', () => {
      expect(isObject('string')).toBe(false)
      expect(isObject(123)).toBe(false)
      expect(isObject(undefined)).toBe(false)
    })
  })

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
      expect(isArray(new Array(5))).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('array')).toBe(false)
      expect(isArray(null)).toBe(false)
    })
  })

  describe('isArrayOf', () => {
    it('should return true for matching typed arrays', () => {
      expect(isArrayOf(['a', 'b', 'c'], isString)).toBe(true)
      expect(isArrayOf([1, 2, 3], isNumber)).toBe(true)
    })

    it('should return false for mixed arrays', () => {
      expect(isArrayOf(['a', 1, 'c'], isString)).toBe(false)
    })

    it('should return true for empty arrays', () => {
      expect(isArrayOf([], isString)).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(isArrayOf('not array', isString)).toBe(false)
    })
  })

  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true)
    })

    it('should return false for non-null', () => {
      expect(isNull(undefined)).toBe(false)
      expect(isNull(0)).toBe(false)
      expect(isNull('')).toBe(false)
    })
  })

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true)
    })

    it('should return false for defined values', () => {
      expect(isUndefined(null)).toBe(false)
      expect(isUndefined(0)).toBe(false)
      expect(isUndefined('')).toBe(false)
    })
  })

  describe('isNullish', () => {
    it('should return true for null and undefined', () => {
      expect(isNullish(null)).toBe(true)
      expect(isNullish(undefined)).toBe(true)
    })

    it('should return false for defined values', () => {
      expect(isNullish(0)).toBe(false)
      expect(isNullish('')).toBe(false)
      expect(isNullish(false)).toBe(false)
    })
  })

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(0)).toBe(true)
      expect(isDefined('')).toBe(true)
      expect(isDefined(false)).toBe(true)
      expect(isDefined({})).toBe(true)
    })

    it('should return false for null and undefined', () => {
      expect(isDefined(undefined)).toBe(false)
      expect(isDefined(null)).toBe(false)
    })
  })

  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true)
      expect(isNonEmptyString(' ')).toBe(true)
    })

    it('should return false for empty strings', () => {
      expect(isNonEmptyString('')).toBe(false)
    })

    it('should return false for non-strings', () => {
      expect(isNonEmptyString(123)).toBe(false)
      expect(isNonEmptyString(null)).toBe(false)
    })
  })

  describe('isNonEmptyArray', () => {
    it('should return true for non-empty arrays', () => {
      expect(isNonEmptyArray([1])).toBe(true)
      expect(isNonEmptyArray([1, 2, 3])).toBe(true)
    })

    it('should return false for empty arrays', () => {
      expect(isNonEmptyArray([])).toBe(false)
    })

    it('should return false for non-arrays', () => {
      expect(isNonEmptyArray('array')).toBe(false)
      expect(isNonEmptyArray(null)).toBe(false)
    })
  })

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidDate(new Date())).toBe(true)
      expect(isValidDate(new Date('2024-01-01'))).toBe(true)
    })

    it('should return false for invalid dates', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false)
    })

    it('should return false for non-dates', () => {
      expect(isValidDate('2024-01-01')).toBe(false)
      expect(isValidDate(Date.now())).toBe(false)
    })
  })

  describe('isPromise', () => {
    it('should return true for promises', () => {
      expect(isPromise(Promise.resolve())).toBe(true)
      expect(isPromise(new Promise(() => {}))).toBe(true)
    })

    it('should return true for promise-like objects', () => {
      expect(isPromise({ then: () => {} })).toBe(true)
    })

    it('should return false for non-promises', () => {
      expect(isPromise({})).toBe(false)
      expect(isPromise(() => {})).toBe(false)
    })
  })

  describe('isError', () => {
    it('should return true for errors', () => {
      expect(isError(new Error())).toBe(true)
      expect(isError(new TypeError())).toBe(true)
      expect(isError(new SyntaxError())).toBe(true)
    })

    it('should return false for non-errors', () => {
      expect(isError({ message: 'error' })).toBe(false)
      expect(isError('error')).toBe(false)
    })
  })
})

describe('Assertions', () => {
  describe('assertDefined', () => {
    it('should not throw for defined values', () => {
      expect(() => assertDefined(0)).not.toThrow()
      expect(() => assertDefined('')).not.toThrow()
      expect(() => assertDefined(false)).not.toThrow()
      expect(() => assertDefined({})).not.toThrow()
    })

    it('should throw for null and undefined', () => {
      expect(() => assertDefined(undefined)).toThrow()
      expect(() => assertDefined(null)).toThrow()
      expect(() => assertDefined(undefined, 'Custom message')).toThrow(
        'Custom message'
      )
    })
  })

  describe('assertString', () => {
    it('should not throw for strings', () => {
      expect(() => assertString('hello')).not.toThrow()
      expect(() => assertString('')).not.toThrow()
    })

    it('should throw for non-strings', () => {
      expect(() => assertString(123)).toThrow()
      expect(() => assertString(null)).toThrow()
      expect(() => assertString(null, 'Must be string')).toThrow(
        'Must be string'
      )
    })
  })

  describe('assertNumber', () => {
    it('should not throw for numbers', () => {
      expect(() => assertNumber(123)).not.toThrow()
      expect(() => assertNumber(0)).not.toThrow()
    })

    it('should throw for non-numbers', () => {
      expect(() => assertNumber('123')).toThrow()
      expect(() => assertNumber(NaN)).toThrow()
    })
  })

  describe('assertObject', () => {
    it('should not throw for objects', () => {
      expect(() => assertObject({})).not.toThrow()
      expect(() => assertObject({ a: 1 })).not.toThrow()
    })

    it('should throw for non-objects', () => {
      expect(() => assertObject(null)).toThrow()
      expect(() => assertObject([])).toThrow()
      expect(() => assertObject('object')).toThrow()
    })
  })

  describe('assertArray', () => {
    it('should not throw for arrays', () => {
      expect(() => assertArray([])).not.toThrow()
      expect(() => assertArray([1, 2, 3])).not.toThrow()
    })

    it('should throw for non-arrays', () => {
      expect(() => assertArray({})).toThrow()
      expect(() => assertArray('array')).toThrow()
    })
  })

  describe('assertNever', () => {
    it('should throw for any value', () => {
      // This is a type-level check primarily, but at runtime it throws
      expect(() => assertNever('value' as never)).toThrow()
    })
  })
})

describe('Format Validators', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('user.name@example.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('should return false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('not-an-email')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('user@.com')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('https://example.com/path?query=1')).toBe(true)
    })

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('example.com')).toBe(false)
    })
  })

  describe('isValidUUID', () => {
    it('should return true for valid UUIDs', () => {
      // UUID v4 format
      expect(isValidUUID('123e4567-e89b-42d3-a456-426614174000')).toBe(true)
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
    })

    it('should return false for invalid UUIDs', () => {
      expect(isValidUUID('')).toBe(false)
      expect(isValidUUID('not-a-uuid')).toBe(false)
      expect(isValidUUID('123e4567-e89b-12d3-a456')).toBe(false)
      expect(isValidUUID('123e4567-e89b-12d3-a456-42661417400g')).toBe(false)
    })
  })

  describe('isValidJSON', () => {
    it('should return true for valid JSON', () => {
      expect(isValidJSON('{"key": "value"}')).toBe(true)
      expect(isValidJSON('[1, 2, 3]')).toBe(true)
      expect(isValidJSON('"string"')).toBe(true)
      expect(isValidJSON('123')).toBe(true)
      expect(isValidJSON('true')).toBe(true)
      expect(isValidJSON('null')).toBe(true)
    })

    it('should return false for invalid JSON', () => {
      expect(isValidJSON('')).toBe(false)
      expect(isValidJSON('not json')).toBe(false)
      expect(isValidJSON('{key: "value"}')).toBe(false)
      expect(isValidJSON('undefined')).toBe(false)
    })
  })

  describe('parseJSON', () => {
    it('should parse valid JSON', () => {
      const result1 = parseJSON<{ key: string }>('{"key": "value"}')
      expect(result1.success).toBe(true)
      if (result1.success) {
        expect(result1.data).toEqual({ key: 'value' })
      }

      const result2 = parseJSON<number[]>('[1, 2, 3]')
      expect(result2.success).toBe(true)
      if (result2.success) {
        expect(result2.data).toEqual([1, 2, 3])
      }
    })

    it('should return error for invalid JSON', () => {
      const result = parseJSON('invalid')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error)
      }
    })
  })
})

describe('Object Utilities', () => {
  describe('hasKey', () => {
    it('should return true for existing keys', () => {
      const obj = { a: 1, b: 2 }
      expect(hasKey(obj, 'a')).toBe(true)
      expect(hasKey(obj, 'b')).toBe(true)
    })

    it('should return false for missing keys', () => {
      const obj = { a: 1 }
      expect(hasKey(obj, 'b')).toBe(false)
    })

    it('should work with undefined values', () => {
      const obj = { a: undefined }
      expect(hasKey(obj, 'a')).toBe(true)
    })
  })

  describe('hasKeys', () => {
    it('should return true when all keys exist', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(hasKeys(obj, ['a', 'b'])).toBe(true)
      expect(hasKeys(obj, ['a', 'b', 'c'])).toBe(true)
    })

    it('should return false when any key is missing', () => {
      const obj = { a: 1, b: 2 }
      expect(hasKeys(obj, ['a', 'c'])).toBe(false)
    })

    it('should return true for empty key array', () => {
      const obj = { a: 1 }
      expect(hasKeys(obj, [])).toBe(true)
    })
  })

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    })

    it('should ignore missing keys', () => {
      const obj = { a: 1, b: 2 }
      expect(pick(obj, ['a', 'c' as keyof typeof obj])).toEqual({ a: 1 })
    })

    it('should return empty object for empty keys', () => {
      const obj = { a: 1, b: 2 }
      expect(pick(obj, [])).toEqual({})
    })
  })

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 })
    })

    it('should handle missing keys', () => {
      const obj = { a: 1, b: 2 }
      expect(omit(obj, ['c' as keyof typeof obj])).toEqual({ a: 1, b: 2 })
    })

    it('should return copy for empty keys', () => {
      const obj = { a: 1, b: 2 }
      const result = omit(obj, [])
      expect(result).toEqual({ a: 1, b: 2 })
      expect(result).not.toBe(obj)
    })
  })
})
