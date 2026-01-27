/**
 * Tool Executor - Validation Module
 *
 * Provides JSON Schema validation for tool parameters with detailed error messages.
 *
 * @module core/tool-executor/validation
 */

import type {
  ToolDefinition,
  ToolArguments,
} from '../../types/tool-definition'

/**
 * Validation error details
 */
export interface ToolValidationErrorDetails {
  received?: unknown
  expected?: string | string[]
  hint?: string
}

/**
 * Validation error
 */
export class ToolValidationError extends Error {
  constructor(
    public toolName: string,
    public field: string,
    message: string,
    public details?: ToolValidationErrorDetails
  ) {
    let formattedMessage = `[${toolName}] Parameter validation failed for '${field}': ${message}`

    if (details?.expected) {
      const expectedStr = Array.isArray(details.expected)
        ? details.expected.join(' | ')
        : details.expected
      formattedMessage += `\n  Expected: ${expectedStr}`
    }

    if (details?.received !== undefined) {
      try {
        const receivedStr = JSON.stringify(details.received)
        formattedMessage += `\n  Received: ${receivedStr}`
      } catch {
        formattedMessage += `\n  Received: [Unserializable]`
      }
    }

    if (details?.hint) {
      formattedMessage += `\n  Hint: ${details.hint}`
    }

    super(formattedMessage)
    this.name = 'ToolValidationError'
  }
}

/**
 * Validate tool arguments against parameter schema
 *
 * @param tool - Tool definition
 * @param args - Arguments to validate
 * @throws ToolValidationError if validation fails
 */
export function validateToolArguments(
  tool: ToolDefinition,
  args: ToolArguments
): void {
  const { parameters } = tool

  // Check required fields
  if (parameters.required) {
    for (const field of parameters.required) {
      if (!(field in args)) {
        throw new ToolValidationError(
          tool.name,
          field,
          'Required field is missing',
          {
            hint: `The parameter '${field}' is mandatory for this tool.`,
          }
        )
      }
    }
  }

  // Validate each property
  for (const [key, value] of Object.entries(args)) {
    const schema = parameters.properties[key]

    if (!schema) {
      // Unknown field
      if (parameters.additionalProperties === false) {
        throw new ToolValidationError(
          tool.name,
          key,
          'Unknown field (additionalProperties: false)',
          {
            hint: 'This field is not defined in the tool schema and cannot be passed.',
          }
        )
      }
      continue
    }

    // Type validation
    validateValue(tool.name, key, value, schema)
  }
}

/**
 * Validate a single value against schema
 */
function validateValue(
  toolName: string,
  field: string,
  value: unknown,
  schema: any
): void {
  // Null check
  if (value === null || value === undefined) {
    if (schema.type === 'null' || schema.type?.includes('null')) {
      return
    }
    throw new ToolValidationError(
      toolName,
      field,
      'Value is null or undefined',
      {
        received: value,
        expected: schema.type,
        hint: 'This field cannot be null or undefined.',
      }
    )
  }

  // Type check
  const actualType = Array.isArray(value) ? 'array' : typeof value
  const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type]

  if (!expectedTypes.includes(actualType)) {
    // Special case for integer (which is number in JS)
    if (actualType === 'number' && expectedTypes.includes('integer')) {
      // Handled in type-specific validation
    } else {
      throw new ToolValidationError(
        toolName,
        field,
        `Expected type ${expectedTypes.join(' | ')}, got ${actualType}`,
        {
          received: actualType,
          expected: expectedTypes,
          hint: `Ensure the value matches one of the expected types.`,
        }
      )
    }
  }

  // Type-specific validation
  switch (schema.type) {
    case 'string':
      validateString(toolName, field, value as string, schema)
      break
    case 'number':
    case 'integer':
      validateNumber(toolName, field, value as number, schema)
      break
    case 'array':
      validateArray(toolName, field, value as unknown[], schema)
      break
    case 'object':
      validateObject(toolName, field, value as Record<string, unknown>, schema)
      break
  }

  // Enum validation
  if (schema.enum && !schema.enum.includes(value)) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value must be one of: ${schema.enum.join(', ')}`,
      {
        received: value,
        expected: schema.enum.join(', '),
        hint: 'The value must exactly match one of the allowed options.',
      }
    )
  }
}

/**
 * Validate string value
 */
function validateString(
  toolName: string,
  field: string,
  value: string,
  schema: any
): void {
  if (schema.minLength !== undefined && value.length < schema.minLength) {
    throw new ToolValidationError(
      toolName,
      field,
      `String length ${value.length} is less than minimum ${schema.minLength}`,
      {
        received: value.length,
        expected: `>= ${schema.minLength}`,
        hint: `The string is too short.`,
      }
    )
  }

  if (schema.maxLength !== undefined && value.length > schema.maxLength) {
    throw new ToolValidationError(
      toolName,
      field,
      `String length ${value.length} exceeds maximum ${schema.maxLength}`,
      {
        received: value.length,
        expected: `<= ${schema.maxLength}`,
        hint: `The string is too long.`,
      }
    )
  }

  if (schema.pattern) {
    const regex = new RegExp(schema.pattern)
    if (!regex.test(value)) {
      throw new ToolValidationError(
        toolName,
        field,
        `String does not match pattern: ${schema.pattern}`,
        {
          received: value,
          expected: schema.pattern,
          hint: 'The string format is invalid according to the regex pattern.',
        }
      )
    }
  }
}

/**
 * Validate number value
 */
function validateNumber(
  toolName: string,
  field: string,
  value: number,
  schema: any
): void {
  if (schema.type === 'integer' && !Number.isInteger(value)) {
    throw new ToolValidationError(toolName, field, 'Value must be an integer', {
      received: value,
      expected: 'integer',
      hint: 'Decimal values are not allowed.',
    })
  }

  if (schema.minimum !== undefined && value < schema.minimum) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} is less than minimum ${schema.minimum}`,
      {
        received: value,
        expected: `>= ${schema.minimum}`,
      }
    )
  }

  if (schema.maximum !== undefined && value > schema.maximum) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} exceeds maximum ${schema.maximum}`,
      {
        received: value,
        expected: `<= ${schema.maximum}`,
      }
    )
  }

  if (
    schema.exclusiveMinimum !== undefined &&
    value <= schema.exclusiveMinimum
  ) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} must be greater than ${schema.exclusiveMinimum}`,
      {
        received: value,
        expected: `> ${schema.exclusiveMinimum}`,
      }
    )
  }

  if (
    schema.exclusiveMaximum !== undefined &&
    value >= schema.exclusiveMaximum
  ) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} must be less than ${schema.exclusiveMaximum}`,
      {
        received: value,
        expected: `< ${schema.exclusiveMaximum}`,
      }
    )
  }

  if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} is not a multiple of ${schema.multipleOf}`,
      {
        received: value,
        expected: `Multiple of ${schema.multipleOf}`,
      }
    )
  }
}

/**
 * Validate array value
 */
function validateArray(
  toolName: string,
  field: string,
  value: unknown[],
  schema: any
): void {
  if (schema.minItems !== undefined && value.length < schema.minItems) {
    throw new ToolValidationError(
      toolName,
      field,
      `Array length ${value.length} is less than minimum ${schema.minItems}`,
      {
        received: value.length,
        expected: `>= ${schema.minItems} items`,
      }
    )
  }

  if (schema.maxItems !== undefined && value.length > schema.maxItems) {
    throw new ToolValidationError(
      toolName,
      field,
      `Array length ${value.length} exceeds maximum ${schema.maxItems}`,
      {
        received: value.length,
        expected: `<= ${schema.maxItems} items`,
      }
    )
  }

  if (schema.uniqueItems) {
    const unique = new Set(value.map((v) => JSON.stringify(v)))
    if (unique.size !== value.length) {
      throw new ToolValidationError(
        toolName,
        field,
        'Array items must be unique',
        {
          hint: 'Duplicate items are not allowed in this array.',
        }
      )
    }
  }

  // Validate items
  if (schema.items) {
    value.forEach((item, index) => {
      validateValue(toolName, `${field}[${index}]`, item, schema.items)
    })
  }
}

/**
 * Validate object value
 */
function validateObject(
  toolName: string,
  field: string,
  value: Record<string, unknown>,
  schema: any
): void {
  if (schema.required) {
    for (const requiredField of schema.required) {
      if (!(requiredField in value)) {
        throw new ToolValidationError(
          toolName,
          `${field}.${requiredField}`,
          'Required field is missing',
          {
            hint: `The nested object '${field}' requires property '${requiredField}'.`,
          }
        )
      }
    }
  }

  if (schema.properties) {
    for (const [key, val] of Object.entries(value)) {
      const propSchema = schema.properties[key]
      if (propSchema) {
        validateValue(toolName, `${field}.${key}`, val, propSchema)
      }
    }
  }
}
