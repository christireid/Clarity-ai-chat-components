/**
 * Validation Errors Tests
 */
import { describe, it, expect } from 'vitest'
import {
  ValidationError,
  InvalidInputError,
  MissingFieldError,
  TypeMismatchError,
  RangeError,
  FormatError,
} from '../validation.js'
import { ClarityError } from '../base.js'

describe('ValidationError', () => {
  it('should create error with message', () => {
    const error = new ValidationError('Invalid email format')

    expect(error.code).toBe('VALIDATION_ERROR')
    expect(error.userMessage).toBe('Invalid email format')
  })

  it('should include field details when provided', () => {
    const error = new ValidationError(
      'Email is invalid',
      'email',
      'not-an-email',
      'valid email format'
    )

    expect(error.field).toBe('email')
    expect(error.value).toBe('not-an-email')
    expect(error.expected).toBe('valid email format')
    expect(error.technicalMessage).toContain('email')
  })

  it('should provide default solutions', () => {
    const error = new ValidationError('Invalid input', 'username')

    expect(error.solutions.length).toBeGreaterThan(0)
    expect(error.solutions[0].steps?.some((s) => s.includes('username'))).toBe(
      true
    )
  })

  it('should accept custom solutions', () => {
    const solutions = [
      {
        description: 'Custom solution',
        steps: ['Step 1', 'Step 2'],
      },
    ]
    const error = new ValidationError(
      'Invalid',
      'field',
      'value',
      'expected',
      solutions
    )

    expect(error.solutions).toEqual(solutions)
  })

  it('should be instance of ClarityError', () => {
    const error = new ValidationError('Test')
    expect(error).toBeInstanceOf(ClarityError)
  })

  it('should preserve original error', () => {
    const originalError = new Error('Zod validation failed')
    const error = new ValidationError(
      'Validation error',
      'field',
      'value',
      'expected',
      undefined,
      originalError
    )

    expect(error.originalError).toBe(originalError)
  })
})

describe('InvalidInputError', () => {
  it('should create error with field details', () => {
    const error = new InvalidInputError('email', 'not-an-email', 'email format')

    expect(error.code).toBe('INVALID_INPUT')
    expect(error.userMessage).toContain('email')
    expect(error.field).toBe('email')
    expect(error.value).toBe('not-an-email')
    expect(error.expected).toBe('email format')
  })

  it('should include expected format in solutions', () => {
    const error = new InvalidInputError('phone', '12345', 'phone number')

    expect(
      error.solutions[0].steps?.some((s) => s.includes('phone number'))
    ).toBe(true)
  })

  it('should include type info in technical message', () => {
    const error = new InvalidInputError('url', 123, 'string URL')

    expect(error.technicalMessage).toContain('string URL')
    expect(error.technicalMessage).toContain('number')
  })

  it('should include field data in context', () => {
    const error = new InvalidInputError('age', -5, 'positive number')

    expect(error.context.data?.field).toBe('age')
    expect(error.context.data?.expected).toBe('positive number')
    expect(error.context.data?.value).toBe(-5)
  })
})

describe('MissingFieldError', () => {
  it('should create error with field name', () => {
    const error = new MissingFieldError('username')

    expect(error.code).toBe('MISSING_FIELD')
    expect(error.userMessage).toContain('username')
    expect(error.field).toBe('username')
  })

  it('should provide fix instructions', () => {
    const error = new MissingFieldError('password')

    expect(error.solutions[0].steps?.some((s) => s.includes('password'))).toBe(
      true
    )
  })

  it('should include custom context', () => {
    const error = new MissingFieldError(
      'apiKey',
      'API key is required for authentication'
    )

    expect(error.technicalMessage).toContain('authentication')
  })

  it('should include field in context data', () => {
    const error = new MissingFieldError('token')

    expect(error.context.data?.field).toBe('token')
    expect(error.context.action).toContain('required fields')
  })

  it('should preserve original error', () => {
    const originalError = new Error('Required field missing')
    const error = new MissingFieldError('id', undefined, originalError)

    expect(error.originalError).toBe(originalError)
  })
})

describe('TypeMismatchError', () => {
  it('should create error with type details', () => {
    const error = new TypeMismatchError('count', 'number', 'abc')

    expect(error.code).toBe('TYPE_MISMATCH')
    expect(error.userMessage).toContain('count')
    expect(error.technicalMessage).toContain('number')
    expect(error.technicalMessage).toContain('string')
  })

  it('should detect actual type correctly', () => {
    const error = new TypeMismatchError('items', 'object', [1, 2, 3])

    expect(error.actualType).toBe('array')
    expect(error.expectedType).toBe('object')
    expect(error.field).toBe('items')
  })

  it('should handle null values', () => {
    const error = new TypeMismatchError('value', 'string', null)

    expect(error.actualType).toBe('null')
  })

  it('should include type conversion steps', () => {
    const error = new TypeMismatchError('age', 'number', 'twenty')

    expect(error.solutions[0].steps?.some((s) => s.includes('string'))).toBe(
      true
    )
    expect(error.solutions[0].steps?.some((s) => s.includes('number'))).toBe(
      true
    )
  })

  it('should include types in context', () => {
    const error = new TypeMismatchError('items', 'array', { key: 'value' })

    expect(error.context.data?.field).toBe('items')
    expect(error.context.data?.expectedType).toBe('array')
    expect(error.context.data?.actualType).toBe('object')
  })

  it('should preserve original error', () => {
    const originalError = new TypeError('Cannot convert')
    const error = new TypeMismatchError('test', 'string', 123, originalError)

    expect(error.originalError).toBe(originalError)
  })
})

describe('RangeError', () => {
  it('should create error with min and max', () => {
    const error = new RangeError('age', 150, { min: 0, max: 120 })

    expect(error.code).toBe('VALUE_OUT_OF_RANGE')
    expect(error.userMessage).toContain('age')
    expect(error.technicalMessage).toContain('0')
    expect(error.technicalMessage).toContain('120')
    expect(error.technicalMessage).toContain('150')
  })

  it('should handle min-only range', () => {
    const error = new RangeError('quantity', -5, { min: 0 })

    expect(error.technicalMessage).toContain('at least 0')
    expect(error.min).toBe(0)
    expect(error.max).toBeUndefined()
  })

  it('should handle max-only range', () => {
    const error = new RangeError('size', 150, { max: 100 })

    expect(error.technicalMessage).toContain('at most 100')
    expect(error.max).toBe(100)
    expect(error.min).toBeUndefined()
  })

  it('should include range in context', () => {
    const error = new RangeError('score', -5, { min: 0, max: 100 })

    expect(error.context.data?.value).toBe(-5)
    expect(error.context.data?.min).toBe(0)
    expect(error.context.data?.max).toBe(100)
    expect(error.context.data?.field).toBe('score')
  })

  it('should be instance of ClarityError', () => {
    const error = new RangeError('value', 150, { min: 0, max: 100 })
    expect(error).toBeInstanceOf(ClarityError)
  })
})

describe('FormatError', () => {
  it('should create error with format details', () => {
    const error = new FormatError('email', 'not-an-email', 'valid email')

    expect(error.code).toBe('INVALID_FORMAT')
    expect(error.userMessage).toContain('email')
    expect(error.technicalMessage).toContain('valid email')
  })

  it('should store field and value', () => {
    const error = new FormatError('phone', '123456', 'E.164 format')

    expect(error.field).toBe('phone')
    expect(error.value).toBe('123456')
    expect(error.expectedFormat).toBe('E.164 format')
  })

  it('should include example when provided', () => {
    const error = new FormatError(
      'date',
      'yesterday',
      'ISO 8601',
      '2024-01-15T12:00:00Z'
    )

    expect(error.solutions[0].example).toBe('2024-01-15T12:00:00Z')
  })

  it('should include format in context', () => {
    const error = new FormatError('uuid', 'not-a-uuid', 'UUID v4')

    expect(error.context.data?.field).toBe('uuid')
    expect(error.context.data?.value).toBe('not-a-uuid')
    expect(error.context.data?.expectedFormat).toBe('UUID v4')
  })

  it('should be instance of ClarityError', () => {
    const error = new FormatError('field', 'value', 'format')
    expect(error).toBeInstanceOf(ClarityError)
  })
})
