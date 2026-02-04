/**
 * TOON validation logic and schema support
 * @module toon-optimizer/validators
 */

/**
 * Schema field definition for validation
 */
export interface TOONSchemaField {
  /** Field name */
  name: string
  /** Expected type */
  type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array'
  /** Whether the field is required (default: false) */
  required?: boolean
  /** Nested schema for object/array types */
  items?: TOONSchemaField[]
}

/**
 * Schema definition for TOON validation
 *
 * @example
 * ```typescript
 * const userSchema: TOONSchema = {
 *   fields: [
 *     { name: 'id', type: 'number', required: true },
 *     { name: 'name', type: 'string', required: true },
 *     { name: 'email', type: 'string' },
 *     { name: 'active', type: 'boolean' }
 *   ]
 * };
 * ```
 */
export interface TOONSchema {
  /** Array of field definitions */
  fields: TOONSchemaField[]
}

/**
 * Result of schema validation
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean
  /** Array of validation error messages */
  errors: ValidationError[]
}

/**
 * Individual validation error
 */
export interface ValidationError {
  /** Path to the invalid field (e.g., 'users[0].name') */
  path: string
  /** Error message */
  message: string
  /** Expected type or constraint */
  expected?: string
  /** Actual value or type */
  actual?: string
}

/**
 * Get the TOON type of a value
 */
function getValueType(
  value: unknown
): 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array' {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  const t = typeof value
  if (t === 'string') return 'string'
  if (t === 'number') return 'number'
  if (t === 'boolean') return 'boolean'
  if (t === 'object') return 'object'
  return 'string' // fallback
}

/**
 * Validate nested schema recursively
 */
function validateNestedSchema(
  value: unknown,
  fields: TOONSchemaField[],
  basePath: string
): ValidationError[] {
  const errors: ValidationError[] = []

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const itemPath = `${basePath}[${index}]`
      if (typeof item === 'object' && item !== null) {
        for (const field of fields) {
          const fieldValue = (item as Record<string, unknown>)[field.name]
          if (
            field.required &&
            (fieldValue === undefined || fieldValue === null)
          ) {
            errors.push({
              path: `${itemPath}.${field.name}`,
              message: `Required field '${field.name}' is missing`,
              expected: field.type,
              actual: fieldValue === undefined ? 'undefined' : 'null',
            })
          } else if (fieldValue !== undefined) {
            const actualType = getValueType(fieldValue)
            if (actualType !== field.type) {
              errors.push({
                path: `${itemPath}.${field.name}`,
                message: `Field '${field.name}' has wrong type`,
                expected: field.type,
                actual: actualType,
              })
            }
          }
        }
      }
    })
  } else if (typeof value === 'object' && value !== null) {
    for (const field of fields) {
      const fieldValue = (value as Record<string, unknown>)[field.name]
      if (
        field.required &&
        (fieldValue === undefined || fieldValue === null)
      ) {
        errors.push({
          path: `${basePath}.${field.name}`,
          message: `Required field '${field.name}' is missing`,
          expected: field.type,
          actual: fieldValue === undefined ? 'undefined' : 'null',
        })
      } else if (fieldValue !== undefined) {
        const actualType = getValueType(fieldValue)
        if (actualType !== field.type) {
          errors.push({
            path: `${basePath}.${field.name}`,
            message: `Field '${field.name}' has wrong type`,
            expected: field.type,
            actual: actualType,
          })
        }
      }
    }
  }

  return errors
}

/**
 * Validate data against a TOON schema
 *
 * @param data - Data to validate
 * @param schema - Schema to validate against
 * @returns Validation result with errors if any
 *
 * @example
 * ```typescript
 * const schema: TOONSchema = {
 *   fields: [
 *     { name: 'id', type: 'number', required: true },
 *     { name: 'name', type: 'string', required: true }
 *   ]
 * };
 *
 * const result = validateAgainstSchema(
 *   { id: 1, name: 'Alice' },
 *   schema
 * );
 * console.log(result.valid); // true
 * ```
 */
export function validateAgainstSchema(
  data: unknown,
  schema: TOONSchema
): ValidationResult {
  const errors: ValidationError[] = []

  if (typeof data !== 'object' || data === null) {
    errors.push({
      path: '',
      message: 'Root data must be an object',
      expected: 'object',
      actual: data === null ? 'null' : typeof data,
    })
    return { valid: false, errors }
  }

  const dataObj = data as Record<string, unknown>

  // Check each field in schema
  for (const field of schema.fields) {
    const value = dataObj[field.name]

    // Check required fields
    if (field.required && (value === undefined || value === null)) {
      errors.push({
        path: field.name,
        message: `Required field '${field.name}' is missing`,
        expected: field.type,
        actual: value === undefined ? 'undefined' : 'null',
      })
      continue
    }

    // Skip optional fields that are not present
    if (value === undefined) {
      continue
    }

    // Type checking
    const actualType = getValueType(value)
    if (actualType !== field.type) {
      errors.push({
        path: field.name,
        message: `Field '${field.name}' has wrong type`,
        expected: field.type,
        actual: actualType,
      })
    }

    // Recursive validation for nested schemas
    if (field.items && (field.type === 'object' || field.type === 'array')) {
      const nestedResult = validateNestedSchema(value, field.items, field.name)
      errors.push(...nestedResult)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
