/**
 * Tests for internal assertion utilities
 */

import { describe, it, expect } from 'vitest'
import {
  assertDefined,
  isDefined,
  isNonEmptyString,
  isValidNumber,
  isPlainObject,
  isArray,
  isFunction,
  isPromise,
  assert,
  assertNever,
} from '../assertions'

describe('assertions', () => {
  describe('assertDefined', () => {
    it('should not throw for defined values', () => {
      expect(() => assertDefined('hello')).not.toThrow()
      expect(() => assertDefined(0)).not.toThrow()
      expect(() => assertDefined(false)).not.toThrow()
      expect(() => assertDefined({})).not.toThrow()
      expect(() => assertDefined([])).not.toThrow()
    })

    it('should throw for null', () => {
      expect(() => assertDefined(null)).toThrow('Expected value to be defined')
    })

    it('should throw for undefined', () => {
      expect(() => assertDefined(undefined)).toThrow(
        'Expected value to be defined'
      )
    })

    it('should throw with custom message', () => {
      expect(() => assertDefined(null, 'Custom error')).toThrow('Custom error')
    })
  })

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined('hello')).toBe(true)
      expect(isDefined(0)).toBe(true)
      expect(isDefined(false)).toBe(true)
      expect(isDefined({})).toBe(true)
      expect(isDefined([])).toBe(true)
    })

    it('should return false for null', () => {
      expect(isDefined(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isDefined(undefined)).toBe(false)
    })
  })

  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true)
      expect(isNonEmptyString(' ')).toBe(true)
      expect(isNonEmptyString('0')).toBe(true)
    })

    it('should return false for empty string', () => {
      expect(isNonEmptyString('')).toBe(false)
    })

    it('should return false for non-strings', () => {
      expect(isNonEmptyString(null)).toBe(false)
      expect(isNonEmptyString(undefined)).toBe(false)
      expect(isNonEmptyString(0)).toBe(false)
      expect(isNonEmptyString({})).toBe(false)
      expect(isNonEmptyString([])).toBe(false)
    })
  })

  describe('isValidNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isValidNumber(0)).toBe(true)
      expect(isValidNumber(1)).toBe(true)
      expect(isValidNumber(-1)).toBe(true)
      expect(isValidNumber(1.5)).toBe(true)
      expect(isValidNumber(Number.MAX_VALUE)).toBe(true)
      expect(isValidNumber(Number.MIN_VALUE)).toBe(true)
    })

    it('should return false for NaN', () => {
      expect(isValidNumber(NaN)).toBe(false)
    })

    it('should return false for Infinity', () => {
      expect(isValidNumber(Infinity)).toBe(false)
      expect(isValidNumber(-Infinity)).toBe(false)
    })

    it('should return false for non-numbers', () => {
      expect(isValidNumber('1')).toBe(false)
      expect(isValidNumber(null)).toBe(false)
      expect(isValidNumber(undefined)).toBe(false)
      expect(isValidNumber({})).toBe(false)
    })
  })

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true)
      expect(isPlainObject({ a: 1 })).toBe(true)
      expect(isPlainObject(Object.create(null))).toBe(true)
    })

    it('should return false for arrays', () => {
      expect(isPlainObject([])).toBe(false)
      expect(isPlainObject([1, 2, 3])).toBe(false)
    })

    it('should return false for null', () => {
      expect(isPlainObject(null)).toBe(false)
    })

    it('should return false for class instances with different toString', () => {
      // Note: Simple class instances pass Object.prototype.toString check
      // This test verifies Date which has a different toString
      expect(isPlainObject(new Date())).toBe(false)
      expect(isPlainObject(new Map())).toBe(false)
      expect(isPlainObject(new Set())).toBe(false)
    })

    it('should return false for primitives', () => {
      expect(isPlainObject('string')).toBe(false)
      expect(isPlainObject(123)).toBe(false)
      expect(isPlainObject(true)).toBe(false)
    })
  })

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
      expect(isArray(new Array(3))).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('string')).toBe(false)
      expect(isArray(null)).toBe(false)
      expect(isArray(undefined)).toBe(false)
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
      expect(isFunction(undefined)).toBe(false)
      expect(isFunction('function')).toBe(false)
    })
  })

  describe('isPromise', () => {
    it('should return true for promises', () => {
      expect(isPromise(Promise.resolve())).toBe(true)
      expect(isPromise(Promise.reject().catch(() => {}))).toBe(true)
      expect(isPromise(new Promise(() => {}))).toBe(true)
    })

    it('should return true for promise-like objects', () => {
      const thenable = { then: () => {} }
      expect(isPromise(thenable)).toBe(true)
    })

    it('should return false for non-promises', () => {
      expect(isPromise({})).toBe(false)
      expect(isPromise(null)).toBe(false)
      expect(isPromise(undefined)).toBe(false)
      expect(isPromise({ then: 'not a function' })).toBe(false)
    })
  })

  describe('assert', () => {
    it('should not throw for true condition', () => {
      expect(() => assert(true)).not.toThrow()
      expect(() => assert(1 === 1)).not.toThrow()
    })

    it('should throw for false condition', () => {
      expect(() => assert(false)).toThrow('Assertion failed')
    })

    it('should throw with custom message', () => {
      expect(() => assert(false, 'Custom error')).toThrow('Custom error')
    })
  })

  describe('assertNever', () => {
    it('should throw with value in message', () => {
      expect(() => assertNever('unexpected' as never)).toThrow(
        'Unexpected value: "unexpected"'
      )
    })

    it('should throw with custom message', () => {
      expect(() => assertNever('unexpected' as never, 'Custom error')).toThrow(
        'Custom error'
      )
    })
  })
})
