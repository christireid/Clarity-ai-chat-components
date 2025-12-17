import { logger } from './logger/index.js';
/**
 * Configuration Manager
 * 
 * Unified configuration validation and management utility
 * 
 * @module @clarity-chat/utils/config-manager
 * 
 * @example
 * ```ts
 * import { createConfigManager } from '@clarity-chat/utils/config-manager'
 * 
 * const configManager = createConfigManager({
 *   apiKey: { type: 'string', required: true },
 *   timeout: { type: 'number', default: 5000 },
 *   retries: { type: 'number', min: 0, max: 10, default: 3 }
 * })
 * 
 * const result = configManager.validate(userConfig)
 * if (!result.success) {
 *   console.error('Invalid config:', result.errors)
 * }
 * ```
 */

import { StrictValidation } from './typescript-strict.js'
import { isString, isNumber, isBoolean, isObject } from './validation/index.js'

export type ConfigSchema<T = any> = {
  [K in keyof T]: ConfigFieldSchema<T[K]>
}

export interface ConfigFieldSchema<T = any> {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required?: boolean
  default?: T
  min?: number
  max?: number
  pattern?: RegExp
  enum?: T[]
  validate?: (value: unknown) => boolean
  transform?: (value: unknown) => T
}

export interface ConfigManager<T = any> {
  validate(config: unknown): StrictValidation<T>
  getDefaults(): Partial<T>
  merge(partial: Partial<T>): T
  getSchema(): ConfigSchema<T>
}

/**
 * Create a configuration manager
 */
export function createConfigManager<T extends Record<string, any>>(
  schema: ConfigSchema<T>
): ConfigManager<T> {
  const validateField = (
    key: string,
    fieldSchema: ConfigFieldSchema,
    value: unknown
  ): { success: boolean; errors: string[]; data?: any } => {
    const errors: string[] = []
    let processedValue = value

    // Apply transform if provided
    if (fieldSchema.transform && value !== undefined) {
      try {
        processedValue = fieldSchema.transform(value)
      } catch (error) {
        errors.push(`Error transforming field '${key}': ${error instanceof Error ? error.message : String(error)}`)
        return { success: false, errors }
      }
    }

    // Check if field is required
    if (fieldSchema.required && (processedValue === undefined || processedValue === null)) {
      errors.push(`Field '${key}' is required`)
      return { success: false, errors }
    }

    // Use default if value is undefined
    if (processedValue === undefined && fieldSchema.default !== undefined) {
      processedValue = fieldSchema.default
    }

    // Skip validation if value is still undefined (and not required)
    if (processedValue === undefined) {
      return { success: true, errors: [], data: undefined }
    }

    // Type validation
    switch (fieldSchema.type) {
      case 'string':
        if (!isString(processedValue)) {
          errors.push(`Field '${key}' must be a string`)
          return { success: false, errors }
        }
        if (fieldSchema.pattern && !fieldSchema.pattern.test(processedValue)) {
          errors.push(`Field '${key}' does not match the required pattern`)
        }
        break

      case 'number':
        const numValue = isString(processedValue) ? parseFloat(processedValue) : processedValue
        if (!isNumber(numValue)) {
          errors.push(`Field '${key}' must be a number`)
          return { success: false, errors }
        }
        if (fieldSchema.min !== undefined && numValue < fieldSchema.min) {
          errors.push(`Field '${key}' must be at least ${fieldSchema.min}`)
        }
        if (fieldSchema.max !== undefined && numValue > fieldSchema.max) {
          errors.push(`Field '${key}' must be at most ${fieldSchema.max}`)
        }
        processedValue = numValue
        break

      case 'boolean':
        if (processedValue === 'true') processedValue = true
        if (processedValue === 'false') processedValue = false
        if (!isBoolean(processedValue)) {
          errors.push(`Field '${key}' must be a boolean`)
          return { success: false, errors }
        }
        break

      case 'object':
        if (!isObject(processedValue)) {
          errors.push(`Field '${key}' must be an object`)
          return { success: false, errors }
        }
        break

      case 'array':
        if (!Array.isArray(processedValue)) {
          errors.push(`Field '${key}' must be an array`)
          return { success: false, errors }
        }
        break
    }

    // Enum validation
    if (fieldSchema.enum && !fieldSchema.enum.includes(processedValue)) {
      errors.push(`Field '${key}' must be one of: ${fieldSchema.enum.join(', ')}`)
    }

    // Custom validation
    if (fieldSchema.validate && !fieldSchema.validate(processedValue)) {
      errors.push(`Field '${key}' failed custom validation`)
    }

    return { success: errors.length === 0, errors, data: processedValue }
  }

  const validate = (config: unknown): StrictValidation<T> => {
    if (!isObject(config)) {
      return { success: false, errors: ['Configuration must be an object'] }
    }

    const errors: string[] = []
    const result: any = {}

    for (const [key, fieldSchema] of Object.entries(schema)) {
      const value = (config as any)[key]
      const fieldResult = validateField(key, fieldSchema, value)

      if (!fieldResult.success) {
        errors.push(...fieldResult.errors)
      } else if (fieldResult.data !== undefined) {
        result[key] = fieldResult.data
      }
    }

    // Check for unknown fields
    for (const key of Object.keys(config)) {
      if (!(key in schema)) {
        errors.push(`Unknown field '${key}'`)
      }
    }

    if (errors.length > 0) {
      return { success: false, errors }
    }

    return { success: true, data: result } as any
  }

  const getDefaults = (): Partial<T> => {
    const defaults: any = {}
    for (const [key, fieldSchema] of Object.entries(schema)) {
      if (fieldSchema.default !== undefined) {
        defaults[key] = fieldSchema.default
      }
    }
    return defaults as any
  }

  const merge = (partial: Partial<T>): T => {
    const defaults = getDefaults()
    const result = { ...defaults, ...partial }
    const validation = validate(result)

    if (!validation.success) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`)
    }

    return validation.data
  }

  return {
    validate,
    getDefaults,
    merge,
    getSchema: () => schema,
  }
}

/**
 * Create a simple configuration validator for common patterns
 */
export function createSimpleConfig<T extends Record<string, any>>(
  schema: ConfigSchema<T>
): (config: unknown) => StrictValidation<T> {
  const manager = createConfigManager(schema)
  return manager.validate
}

/**
 * Validate configuration with detailed error messages
 */
export function validateConfig<T>(
  config: unknown,
  schema: ConfigSchema<T>
): StrictValidation<T> {
  return createConfigManager(schema).validate(config) as StrictValidation<T>
}

/**
 * Get default values from a configuration schema
 */
export function getConfigDefaults<T>(
  schema: ConfigSchema<T>
): Partial<T> {
  return createConfigManager(schema).getDefaults() as Partial<T>
}

/**
 * Merge configuration with defaults and validate
 */
export function mergeConfig<T extends Record<string, any>>(
  partial: Partial<T>,
  schema: ConfigSchema<T>
): T {
  return createConfigManager(schema).merge(partial) as T
}