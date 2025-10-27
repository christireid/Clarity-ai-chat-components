/**
 * Input validation errors
 */

import { ClarityError, ErrorSolution } from './base-error'

export class ValidationError extends ClarityError {
  constructor(message: string, errors: string[], originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: 'Fix the validation errors',
        steps: errors.map(err => `Fix: ${err}`)
      }
    ]

    super(
      'VALIDATION_ERROR',
      'Input validation failed',
      message,
      solutions,
      {
        location: 'Input validation',
        action: 'Validating user input',
        data: { errors }
      },
      originalError
    )
  }
}

export class InvalidInputError extends ClarityError {
  constructor(
    fieldName: string,
    expectedFormat: string,
    actualValue: any,
    originalError?: Error
  ) {
    const solutions: ErrorSolution[] = [
      {
        description: `Fix the ${fieldName} field`,
        steps: [
          `Expected format: ${expectedFormat}`,
          `You provided: ${JSON.stringify(actualValue)}`,
          'Update your input to match the expected format'
        ],
        example: getValidationExample(fieldName, expectedFormat)
      }
    ]

    super(
      'INVALID_INPUT',
      `Invalid value for ${fieldName}`,
      `Expected ${expectedFormat}, got ${typeof actualValue}`,
      solutions,
      {
        location: 'Input validation',
        action: `Validating ${fieldName}`,
        data: { fieldName, expectedFormat, actualValue }
      },
      originalError
    )
  }
}

export class MissingFieldError extends ClarityError {
  constructor(fieldName: string, originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: `Add the required ${fieldName} field`,
        steps: [
          `Include ${fieldName} in your request`,
          'Check the API documentation for required fields',
          'Ensure the field is not null or undefined'
        ],
        example: `{
  ${fieldName}: "value",
  // ... other fields
}`
      }
    ]

    super(
      'MISSING_FIELD',
      `Required field '${fieldName}' is missing`,
      `The field '${fieldName}' is required but was not provided`,
      solutions,
      {
        location: 'Input validation',
        action: 'Checking required fields',
        data: { fieldName }
      },
      originalError
    )
  }
}

export class TypeMismatchError extends ClarityError {
  constructor(
    fieldName: string,
    expectedType: string,
    actualType: string,
    originalError?: Error
  ) {
    const solutions: ErrorSolution[] = [
      {
        description: `Convert ${fieldName} to ${expectedType}`,
        steps: [
          `Current type: ${actualType}`,
          `Expected type: ${expectedType}`,
          'Convert the value before sending'
        ],
        example: getTypeConversionExample(fieldName, actualType, expectedType)
      }
    ]

    super(
      'TYPE_MISMATCH',
      `Type mismatch for ${fieldName}`,
      `Expected ${expectedType}, got ${actualType}`,
      solutions,
      {
        location: 'Type validation',
        action: `Validating type of ${fieldName}`,
        data: { fieldName, expectedType, actualType }
      },
      originalError
    )
  }
}

// Helper functions
function getValidationExample(fieldName: string, format: string): string {
  const examples: Record<string, string> = {
    email: `// Valid email format
const input = {
  ${fieldName}: "user@example.com"
}`,
    url: `// Valid URL format
const input = {
  ${fieldName}: "https://example.com"
}`,
    'phone number': `// Valid phone format
const input = {
  ${fieldName}: "+1-555-123-4567"
}`,
    'date': `// Valid date format (ISO 8601)
const input = {
  ${fieldName}: "2024-01-15T10:30:00Z"
}`
  }

  return examples[format.toLowerCase()] || `const input = {\n  ${fieldName}: /* ${format} */\n}`
}

function getTypeConversionExample(field: string, from: string, to: string): string {
  const conversions: Record<string, Record<string, string>> = {
    string: {
      number: `const ${field} = parseInt(stringValue, 10)\n// or\nconst ${field} = Number(stringValue)`,
      boolean: `const ${field} = stringValue === "true"`,
      array: `const ${field} = stringValue.split(",")`
    },
    number: {
      string: `const ${field} = numberValue.toString()`,
      boolean: `const ${field} = numberValue > 0`
    },
    boolean: {
      string: `const ${field} = boolValue.toString()`,
      number: `const ${field} = boolValue ? 1 : 0`
    }
  }

  return conversions[from]?.[to] || `// Convert ${from} to ${to}\nconst ${field} = /* conversion logic */`
}
