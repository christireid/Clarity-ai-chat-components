/**
 * Tests for ValidationError static factory methods and properties
 */

import { describe, it, expect } from 'vitest'
import {
  ValidationError,
  ValidationErrorCode,
  isValidationError,
} from '../../src/errors/validation-error'

describe('ValidationError', () => {
  describe('constructor', () => {
    it('should create validation error with fields', () => {
      const error = new ValidationError('Validation failed', {
        fields: [
          {
            field: 'email',
            message: 'Invalid email',
            code: ValidationErrorCode.INVALID_FORMAT,
          },
        ],
      })

      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.statusCode).toBe(400)
      expect(error.fields).toHaveLength(1)
      expect(error.recoverable).toBe(true)
    })

    it('should use default solution if not provided', () => {
      const error = new ValidationError('Validation failed', {
        fields: [
          {
            field: 'name',
            message: 'Required',
            code: ValidationErrorCode.REQUIRED_FIELD,
          },
        ],
      })

      expect(error.solution).toContain('correct')
    })

    it('should use custom solution if provided', () => {
      const error = new ValidationError('Validation failed', {
        fields: [
          {
            field: 'name',
            message: 'Required',
            code: ValidationErrorCode.REQUIRED_FIELD,
          },
        ],
        solution: 'Custom solution',
      })

      expect(error.solution).toBe('Custom solution')
    })
  })

  describe('field', () => {
    it('should create single field error', () => {
      const error = ValidationError.field(
        'email',
        'Invalid email',
        ValidationErrorCode.INVALID_FORMAT
      )

      expect(error.fields).toHaveLength(1)
      expect(error.fields[0]?.field).toBe('email')
      expect(error.fields[0]?.message).toBe('Invalid email')
      expect(error.fields[0]?.code).toBe(ValidationErrorCode.INVALID_FORMAT)
    })

    it('should include value and expected if provided', () => {
      const error = ValidationError.field(
        'age',
        'Invalid age',
        ValidationErrorCode.OUT_OF_RANGE,
        { value: -5, expected: '0-120' }
      )

      expect(error.fields[0]?.value).toBe(-5)
      expect(error.fields[0]?.expected).toBe('0-120')
    })
  })

  describe('required', () => {
    it('should create required field error', () => {
      const error = ValidationError.required('username')

      expect(error.fields[0]?.field).toBe('username')
      expect(error.fields[0]?.code).toBe(ValidationErrorCode.REQUIRED_FIELD)
      expect(error.fields[0]?.message).toContain('required')
    })
  })

  describe('invalidFormat', () => {
    it('should create invalid format error', () => {
      const error = ValidationError.invalidFormat(
        'email',
        'email@example.com',
        'not-an-email'
      )

      expect(error.fields[0]?.field).toBe('email')
      expect(error.fields[0]?.code).toBe(ValidationErrorCode.INVALID_FORMAT)
      expect(error.fields[0]?.expected).toBe('email@example.com')
      expect(error.fields[0]?.value).toBe('not-an-email')
    })
  })

  describe('outOfRange', () => {
    it('should create out of range error with min and max', () => {
      const error = ValidationError.outOfRange('age', 0, 120, 150)

      expect(error.fields[0]?.code).toBe(ValidationErrorCode.OUT_OF_RANGE)
      expect(error.fields[0]?.message).toContain('between 0 and 120')
    })

    it('should create out of range error with min only', () => {
      const error = ValidationError.outOfRange('count', 1, undefined, 0)

      expect(error.fields[0]?.message).toContain('at least 1')
    })

    it('should create out of range error with max only', () => {
      const error = ValidationError.outOfRange('count', undefined, 100, 150)

      expect(error.fields[0]?.message).toContain('at most 100')
    })

    it('should create out of range error with no bounds', () => {
      const error = ValidationError.outOfRange(
        'value',
        undefined,
        undefined,
        500
      )

      expect(error.fields[0]?.message).toContain('valid range')
    })
  })

  describe('invalidType', () => {
    it('should create invalid type error', () => {
      const error = ValidationError.invalidType('count', 'number', 'string')

      expect(error.fields[0]?.code).toBe(ValidationErrorCode.INVALID_TYPE)
      expect(error.fields[0]?.message).toContain('number')
      expect(error.fields[0]?.message).toContain('string')
    })
  })

  describe('tooLong', () => {
    it('should create too long error', () => {
      const error = ValidationError.tooLong('name', 100, 150)

      expect(error.fields[0]?.code).toBe(ValidationErrorCode.TOO_LONG)
      expect(error.fields[0]?.message).toContain('100')
      expect(error.fields[0]?.value).toBe(150)
    })
  })

  describe('tooShort', () => {
    it('should create too short error', () => {
      const error = ValidationError.tooShort('password', 8, 3)

      expect(error.fields[0]?.code).toBe(ValidationErrorCode.TOO_SHORT)
      expect(error.fields[0]?.message).toContain('8')
      expect(error.fields[0]?.value).toBe(3)
    })
  })

  describe('patternMismatch', () => {
    it('should create pattern mismatch error', () => {
      const error = ValidationError.patternMismatch(
        'phone',
        '^[0-9]{10}$',
        'abc'
      )

      expect(error.fields[0]?.code).toBe(ValidationErrorCode.PATTERN_MISMATCH)
      expect(error.fields[0]?.expected).toBe('^[0-9]{10}$')
      expect(error.fields[0]?.value).toBe('abc')
    })
  })

  describe('combine', () => {
    it('should combine multiple validation errors', () => {
      const error1 = ValidationError.required('name')
      const error2 = ValidationError.invalidFormat('email', 'email format')
      const error3 = ValidationError.outOfRange('age', 0, 120, -5)

      const combined = ValidationError.combine([error1, error2, error3])

      expect(combined.fields).toHaveLength(3)
      expect(combined.message).toContain('3 field')
    })

    it('should work with single error', () => {
      const error1 = ValidationError.required('name')
      const combined = ValidationError.combine([error1])

      expect(combined.fields).toHaveLength(1)
    })

    it('should work with empty array', () => {
      const combined = ValidationError.combine([])

      expect(combined.fields).toHaveLength(0)
    })
  })

  describe('getFieldError', () => {
    it('should return error message for existing field', () => {
      const error = ValidationError.combine([
        ValidationError.required('name'),
        ValidationError.invalidFormat('email', 'email format'),
      ])

      expect(error.getFieldError('name')).toContain('required')
      expect(error.getFieldError('email')).toContain('invalid format')
    })

    it('should return undefined for non-existent field', () => {
      const error = ValidationError.required('name')

      expect(error.getFieldError('email')).toBeUndefined()
    })
  })

  describe('hasFieldError', () => {
    it('should return true for field with error', () => {
      const error = ValidationError.required('name')

      expect(error.hasFieldError('name')).toBe(true)
    })

    it('should return false for field without error', () => {
      const error = ValidationError.required('name')

      expect(error.hasFieldError('email')).toBe(false)
    })
  })

  describe('errorFields', () => {
    it('should return all field names with errors', () => {
      const error = ValidationError.combine([
        ValidationError.required('name'),
        ValidationError.invalidFormat('email', 'email format'),
        ValidationError.outOfRange('age', 0, 120),
      ])

      expect(error.errorFields).toEqual(['name', 'email', 'age'])
    })
  })

  describe('fieldErrorMap', () => {
    it('should return map of field names to messages', () => {
      const error = ValidationError.combine([
        ValidationError.required('name'),
        ValidationError.invalidFormat('email', 'email format'),
      ])

      const map = error.fieldErrorMap
      expect(map['name']).toContain('required')
      expect(map['email']).toContain('invalid format')
    })
  })

  describe('userMessage', () => {
    it('should return single field message when only one error', () => {
      const error = ValidationError.required('name')

      expect(error.userMessage).toBe('name is required')
    })

    it('should return combined message for multiple errors', () => {
      const error = ValidationError.combine([
        ValidationError.required('name'),
        ValidationError.required('email'),
      ])

      expect(error.userMessage).toContain('fix the following')
      expect(error.userMessage).toContain('name')
      expect(error.userMessage).toContain('email')
    })
  })

  describe('isValidationError type guard', () => {
    it('should return true for ValidationError', () => {
      const error = ValidationError.required('name')
      expect(isValidationError(error)).toBe(true)
    })

    it('should return false for regular Error', () => {
      const error = new Error('Test')
      expect(isValidationError(error)).toBe(false)
    })

    it('should return false for null', () => {
      expect(isValidationError(null)).toBe(false)
    })
  })
})
