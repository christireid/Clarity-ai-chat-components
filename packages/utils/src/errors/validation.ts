/**
 * Validation Error Classes
 *
 * Errors for input validation including missing fields, type mismatches,
 * and invalid formats.
 */

import { ClarityError, type ErrorSolution } from './base.js'

/**
 * Generic validation error
 *
 * @example
 * ```ts
 * if (!isValidEmail(input)) {
 *   throw new ValidationError('Invalid email format', 'email', input)
 * }
 * ```
 */
export class ValidationError extends ClarityError {
  public readonly field?: string
  public readonly value?: unknown
  public readonly expected?: string

  constructor(
    message: string,
    field?: string,
    value?: unknown,
    expected?: string,
    solutions?: ErrorSolution[],
    originalError?: Error
  ) {
    super(
      'VALIDATION_ERROR',
      message,
      field
        ? `Validation failed for "${field}": expected ${expected || 'valid value'}, received ${typeof value}`
        : message,
      solutions || [
        {
          description: 'Provide valid input',
          steps: field
            ? [
                `Check the value for "${field}"`,
                expected
                  ? `Expected: ${expected}`
                  : 'Ensure the value is valid',
                'Fix the input and try again',
              ]
            : ['Check your input and try again'],
        },
      ],
      {
        action: 'Validating input',
        data: field ? { field, value, expected } : undefined,
      },
      originalError
    )

    this.field = field
    this.value = value
    this.expected = expected
  }
}

/**
 * Error thrown when input is invalid
 */
export class InvalidInputError extends ClarityError {
  public readonly field: string
  public readonly value: unknown
  public readonly expected: string

  constructor(
    field: string,
    value: unknown,
    expected: string,
    originalError?: Error
  ) {
    super(
      'INVALID_INPUT',
      `Invalid input for ${field}`,
      `Expected ${expected}, received ${typeof value}: ${JSON.stringify(value)}`,
      [
        {
          description: 'Provide valid input',
          steps: [
            `Check the value for "${field}"`,
            `Expected type: ${expected}`,
            `Received: ${typeof value}`,
            'Update your input and try again',
          ],
        },
      ],
      {
        action: 'Validating input',
        data: { field, value, expected },
      },
      originalError
    )

    this.field = field
    this.value = value
    this.expected = expected
  }
}

/**
 * Error thrown when a required field is missing
 */
export class MissingFieldError extends ClarityError {
  public readonly field: string

  constructor(field: string, context?: string, originalError?: Error) {
    super(
      'MISSING_FIELD',
      `Missing required field: ${field}`,
      context || `The field "${field}" is required but was not provided`,
      [
        {
          description: 'Provide the missing field',
          steps: [
            `Add the "${field}" field to your input`,
            'Ensure it has a valid value',
          ],
        },
      ],
      {
        action: 'Validating required fields',
        data: { field },
      },
      originalError
    )

    this.field = field
  }
}

/**
 * Error thrown when a value has the wrong type
 */
export class TypeMismatchError extends ClarityError {
  public readonly field: string
  public readonly expectedType: string
  public readonly actualType: string
  public readonly value: unknown

  constructor(
    field: string,
    expectedType: string,
    value: unknown,
    originalError?: Error
  ) {
    const actualType =
      value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value

    super(
      'TYPE_MISMATCH',
      `Type mismatch for ${field}`,
      `Expected ${expectedType}, received ${actualType}`,
      [
        {
          description: 'Provide the correct type',
          steps: [
            `The "${field}" field expects: ${expectedType}`,
            `You provided: ${actualType}`,
            'Convert or replace the value with the correct type',
          ],
        },
      ],
      {
        action: 'Type checking',
        data: { field, expectedType, actualType, value },
      },
      originalError
    )

    this.field = field
    this.expectedType = expectedType
    this.actualType = actualType
    this.value = value
  }
}

/**
 * Error thrown when a value is out of valid range
 */
export class RangeError extends ClarityError {
  public readonly field: string
  public readonly value: number
  public readonly min?: number
  public readonly max?: number

  constructor(
    field: string,
    value: number,
    options: { min?: number; max?: number },
    originalError?: Error
  ) {
    const rangeDesc =
      options.min !== undefined && options.max !== undefined
        ? `between ${options.min} and ${options.max}`
        : options.min !== undefined
          ? `at least ${options.min}`
          : `at most ${options.max}`

    super(
      'VALUE_OUT_OF_RANGE',
      `Value out of range for ${field}`,
      `Value ${value} must be ${rangeDesc}`,
      [
        {
          description: 'Provide a value within the valid range',
          steps: [
            `The "${field}" field must be ${rangeDesc}`,
            `You provided: ${value}`,
            'Update the value to be within range',
          ],
        },
      ],
      {
        action: 'Range validation',
        data: { field, value, min: options.min, max: options.max },
      },
      originalError
    )

    this.field = field
    this.value = value
    this.min = options.min
    this.max = options.max
  }
}

/**
 * Error thrown when a value doesn't match expected format/pattern
 */
export class FormatError extends ClarityError {
  public readonly field: string
  public readonly value: string
  public readonly expectedFormat: string

  constructor(
    field: string,
    value: string,
    expectedFormat: string,
    example?: string,
    originalError?: Error
  ) {
    super(
      'INVALID_FORMAT',
      `Invalid format for ${field}`,
      `Expected format: ${expectedFormat}`,
      [
        {
          description: 'Use the correct format',
          steps: [
            `The "${field}" field requires format: ${expectedFormat}`,
            `You provided: "${value}"`,
            'Update the value to match the expected format',
          ],
          ...(example && { example }),
        },
      ],
      {
        action: 'Format validation',
        data: { field, value, expectedFormat },
      },
      originalError
    )

    this.field = field
    this.value = value
    this.expectedFormat = expectedFormat
  }
}
