import { ClarityError } from './base-error'
import { ValidationErrorCode } from './error-codes'

export { ValidationErrorCode }

/**
 * Field-level error details
 */
export interface FieldError {
  /** Name of the field with the error */
  field: string
  /** Human-readable error message */
  message: string
  /** Error code for programmatic handling */
  code: ValidationErrorCode
  /** The invalid value (if safe to include) */
  value?: unknown
  /** Expected format or constraint */
  expected?: string
}

/**
 * Input validation errors with field-level details
 */
export class ValidationError extends ClarityError {
  readonly code: string = 'VALIDATION_ERROR'
  readonly statusCode: number = 400
  readonly fields: FieldError[]

  constructor(
    message: string,
    options: {
      fields: FieldError[]
      context?: Record<string, unknown>
      solution?: string
      docs?: string
    }
  ) {
    super(message, {
      context: options.context,
      recoverable: true,
      solution:
        options.solution ??
        'Please correct the highlighted fields and try again.',
      docs: options.docs,
    })

    // Required for proper instanceof checks
    Object.setPrototypeOf(this, ValidationError.prototype)

    this.fields = options.fields
  }

  /**
   * Create a validation error for a single field
   */
  static field(
    field: string,
    message: string,
    code: ValidationErrorCode,
    options?: { value?: unknown; expected?: string }
  ): ValidationError {
    return new ValidationError(`Validation failed: ${message}`, {
      fields: [
        {
          field,
          message,
          code,
          value: options?.value,
          expected: options?.expected,
        },
      ],
    })
  }

  /**
   * Create a required field error
   */
  static required(field: string): ValidationError {
    return ValidationError.field(
      field,
      `${field} is required`,
      ValidationErrorCode.REQUIRED_FIELD
    )
  }

  /**
   * Create an invalid format error
   */
  static invalidFormat(
    field: string,
    expected: string,
    value?: unknown
  ): ValidationError {
    return ValidationError.field(
      field,
      `${field} has an invalid format`,
      ValidationErrorCode.INVALID_FORMAT,
      { value, expected }
    )
  }

  /**
   * Create an out of range error
   */
  static outOfRange(
    field: string,
    min?: number,
    max?: number,
    value?: number
  ): ValidationError {
    const rangeText =
      min !== undefined && max !== undefined
        ? `between ${min} and ${max}`
        : min !== undefined
          ? `at least ${min}`
          : max !== undefined
            ? `at most ${max}`
            : 'within the valid range'

    return ValidationError.field(
      field,
      `${field} must be ${rangeText}`,
      ValidationErrorCode.OUT_OF_RANGE,
      { value, expected: rangeText }
    )
  }

  /**
   * Create an invalid type error
   */
  static invalidType(
    field: string,
    expected: string,
    actual: string
  ): ValidationError {
    return ValidationError.field(
      field,
      `${field} must be a ${expected}, got ${actual}`,
      ValidationErrorCode.INVALID_TYPE,
      { value: actual, expected }
    )
  }

  /**
   * Create a too long error
   */
  static tooLong(
    field: string,
    maxLength: number,
    actual: number
  ): ValidationError {
    return ValidationError.field(
      field,
      `${field} exceeds maximum length of ${maxLength}`,
      ValidationErrorCode.TOO_LONG,
      { value: actual, expected: `max ${maxLength} characters` }
    )
  }

  /**
   * Create a too short error
   */
  static tooShort(
    field: string,
    minLength: number,
    actual: number
  ): ValidationError {
    return ValidationError.field(
      field,
      `${field} must be at least ${minLength} characters`,
      ValidationErrorCode.TOO_SHORT,
      { value: actual, expected: `min ${minLength} characters` }
    )
  }

  /**
   * Create a pattern mismatch error
   */
  static patternMismatch(
    field: string,
    pattern: string,
    value?: unknown
  ): ValidationError {
    return ValidationError.field(
      field,
      `${field} does not match the required pattern`,
      ValidationErrorCode.PATTERN_MISMATCH,
      { value, expected: pattern }
    )
  }

  /**
   * Combine multiple validation errors into one
   */
  static combine(errors: ValidationError[]): ValidationError {
    const allFields = errors.flatMap((e) => e.fields)
    return new ValidationError(
      `Validation failed for ${allFields.length} field(s)`,
      { fields: allFields }
    )
  }

  /**
   * Get error message for a specific field
   */
  getFieldError(fieldName: string): string | undefined {
    return this.fields.find((f) => f.field === fieldName)?.message
  }

  /**
   * Check if a specific field has an error
   */
  hasFieldError(fieldName: string): boolean {
    return this.fields.some((f) => f.field === fieldName)
  }

  /**
   * Get all field names with errors
   */
  get errorFields(): string[] {
    return this.fields.map((f) => f.field)
  }

  /**
   * Get a map of field names to error messages
   */
  get fieldErrorMap(): Record<string, string> {
    return this.fields.reduce(
      (acc, f) => {
        acc[f.field] = f.message
        return acc
      },
      {} as Record<string, string>
    )
  }

  override get userMessage(): string {
    const firstField = this.fields[0]
    if (this.fields.length === 1 && firstField) {
      return firstField.message
    }
    return `Please fix the following: ${this.fields.map((f) => f.message).join(', ')}`
  }
}

/**
 * Type guard for ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}
