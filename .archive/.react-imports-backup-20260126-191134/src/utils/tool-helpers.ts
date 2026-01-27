/**
 * Tool Development Helpers
 *
 * Utility functions to simplify common tool development patterns:
 * - Input validation
 * - Error handling
 * - Tool templates
 * - Common schemas
 *
 * @module utils/tool-helpers
 */

import type {
  ToolDefinition,
  ToolParameters,
  ToolArguments,
} from '../types/tool-definition'

// =============================================================================
// Input Validation Helpers
// =============================================================================

/**
 * Validate required string parameter
 *
 * @example
 * ```typescript
 * execute: async (args) => {
 *   const email = requireString(args, 'email', 'Email address is required')
 *   // email is guaranteed to be a non-empty string
 * }
 * ```
 */
export function requireString(
  args: ToolArguments,
  key: string,
  errorMessage?: string
): string {
  const value = args[key]

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      errorMessage || `Required parameter "${key}" must be a non-empty string`
    )
  }

  return value.trim()
}

/**
 * Validate required number parameter
 *
 * @example
 * ```typescript
 * execute: async (args) => {
 *   const age = requireNumber(args, 'age', 'Age must be a number')
 *   const count = requireNumber(args, 'count', 'Count is required', { min: 1, max: 100 })
 * }
 * ```
 */
export function requireNumber(
  args: ToolArguments,
  key: string,
  errorMessage?: string,
  options?: { min?: number; max?: number; integer?: boolean }
): number {
  const value = args[key]

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(
      errorMessage || `Required parameter "${key}" must be a number`
    )
  }

  if (options?.integer && !Number.isInteger(value)) {
    throw new Error(`Parameter "${key}" must be an integer`)
  }

  if (options?.min !== undefined && value < options.min) {
    throw new Error(`Parameter "${key}" must be >= ${options.min}`)
  }

  if (options?.max !== undefined && value > options.max) {
    throw new Error(`Parameter "${key}" must be <= ${options.max}`)
  }

  return value
}

/**
 * Validate required boolean parameter
 */
export function requireBoolean(
  args: ToolArguments,
  key: string,
  errorMessage?: string
): boolean {
  const value = args[key]

  if (typeof value !== 'boolean') {
    throw new Error(
      errorMessage || `Required parameter "${key}" must be a boolean`
    )
  }

  return value
}

/**
 * Validate required array parameter
 */
export function requireArray<T = unknown>(
  args: ToolArguments,
  key: string,
  errorMessage?: string,
  options?: { minLength?: number; maxLength?: number }
): T[] {
  const value = args[key]

  if (!Array.isArray(value)) {
    throw new Error(
      errorMessage || `Required parameter "${key}" must be an array`
    )
  }

  if (options?.minLength !== undefined && value.length < options.minLength) {
    throw new Error(
      `Parameter "${key}" must have at least ${options.minLength} items`
    )
  }

  if (options?.maxLength !== undefined && value.length > options.maxLength) {
    throw new Error(
      `Parameter "${key}" must have at most ${options.maxLength} items`
    )
  }

  return value as T[]
}

/**
 * Get optional parameter with default value
 *
 * @example
 * ```typescript
 * const units = optional(args, 'units', 'celsius')
 * const limit = optional(args, 'limit', 10)
 * ```
 */
export function optional<T>(
  args: ToolArguments,
  key: string,
  defaultValue: T
): T {
  return (args[key] as T) ?? defaultValue
}

/**
 * Validate enum parameter
 *
 * @example
 * ```typescript
 * const status = requireEnum(args, 'status', ['active', 'inactive', 'pending'])
 * ```
 */
export function requireEnum<T extends string>(
  args: ToolArguments,
  key: string,
  allowedValues: readonly T[],
  errorMessage?: string
): T {
  const value = args[key]

  if (!allowedValues.includes(value as T)) {
    throw new Error(
      errorMessage ||
        `Parameter "${key}" must be one of: ${allowedValues.join(', ')}. Got: ${value}`
    )
  }

  return value as T
}

// =============================================================================
// Error Handling Helpers
// =============================================================================

/**
 * Wrap tool execution with error handling
 *
 * Converts errors into user-friendly messages with context.
 *
 * @example
 * ```typescript
 * execute: withErrorHandling(async (args) => {
 *   const data = await riskyOperation()
 *   return { data }
 * }, 'Failed to fetch data')
 * ```
 */
export function withErrorHandling<TArgs extends ToolArguments, TResult>(
  fn: (args: TArgs, context: any) => Promise<TResult>,
  contextMessage?: string
): (args: TArgs, context: any) => Promise<TResult> {
  return async (args: TArgs, context: any) => {
    try {
      return await fn(args, context)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)

      if (contextMessage) {
        throw new Error(`${contextMessage}: ${errorMessage}`)
      } else {
        throw error
      }
    }
  }
}

/**
 * Create user-friendly error
 *
 * @example
 * ```typescript
 * throw userError('Invalid email format', {
 *   hint: 'Email must be in format: user@example.com',
 *   field: 'email',
 *   value: args.email
 * })
 * ```
 */
export function userError(
  message: string,
  details?: {
    hint?: string
    field?: string
    value?: unknown
    code?: string
  }
): Error {
  let fullMessage = message

  if (details?.hint) {
    fullMessage += `\nHint: ${details.hint}`
  }

  if (details?.field) {
    fullMessage += `\nField: ${details.field}`
  }

  if (details?.value !== undefined) {
    fullMessage += `\nProvided value: ${JSON.stringify(details.value)}`
  }

  const error = new Error(fullMessage)

  if (details?.code) {
    ;(error as any).code = details.code
  }

  return error
}

// =============================================================================
// Common Parameter Schemas
// =============================================================================

/**
 * String parameter schema
 */
export const stringParam = (
  description: string,
  options?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    default?: string
  }
): ToolParameters['properties'][string] => ({
  type: 'string',
  description,
  minLength: options?.minLength,
  maxLength: options?.maxLength,
  pattern: options?.pattern,
  default: options?.default,
})

/**
 * Number parameter schema
 */
export const numberParam = (
  description: string,
  options?: {
    minimum?: number
    maximum?: number
    default?: number
  }
): ToolParameters['properties'][string] => ({
  type: 'number',
  description,
  minimum: options?.minimum,
  maximum: options?.maximum,
  default: options?.default,
})

/**
 * Integer parameter schema
 */
export const integerParam = (
  description: string,
  options?: {
    minimum?: number
    maximum?: number
    default?: number
  }
): ToolParameters['properties'][string] => ({
  type: 'integer',
  description,
  minimum: options?.minimum,
  maximum: options?.maximum,
  default: options?.default,
})

/**
 * Boolean parameter schema
 */
export const booleanParam = (
  description: string,
  defaultValue?: boolean
): ToolParameters['properties'][string] => ({
  type: 'boolean',
  description,
  default: defaultValue,
})

/**
 * Enum parameter schema
 */
export const enumParam = <T extends string>(
  description: string,
  values: readonly T[],
  defaultValue?: T
): ToolParameters['properties'][string] => ({
  type: 'string',
  description,
  enum: [...values],
  default: defaultValue,
})

/**
 * Array parameter schema
 */
export const arrayParam = (
  description: string,
  itemType: 'string' | 'number' | 'boolean' | 'object',
  options?: {
    minItems?: number
    maxItems?: number
  }
): ToolParameters['properties'][string] => ({
  type: 'array',
  description,
  items: { type: itemType },
  minItems: options?.minItems,
  maxItems: options?.maxItems,
})

// =============================================================================
// Tool Templates
// =============================================================================

/**
 * Create a simple read-only tool
 *
 * @example
 * ```typescript
 * const weatherTool = createReadOnlyTool({
 *   name: 'get_weather',
 *   description: 'Get current weather',
 *   parameters: {
 *     city: stringParam('City name'),
 *   },
 *   required: ['city'],
 *   execute: async ({ city }) => {
 *     const weather = await fetchWeather(city)
 *     return { temperature: weather.temp, condition: weather.condition }
 *   },
 * })
 * ```
 */
export function createReadOnlyTool<
  TArgs extends Record<string, unknown>,
>(config: {
  name: string
  description: string
  parameters: Record<keyof TArgs, ToolParameters['properties'][string]>
  required?: (keyof TArgs)[]
  execute: (args: TArgs, context?: any) => Promise<any>
  cacheTTL?: number
}): ToolDefinition {
  return {
    name: config.name,
    description: config.description,
    parameters: {
      type: 'object',
      properties: config.parameters as any,
      required: (config.required || []) as string[],
    },
    execute: withErrorHandling(config.execute as any),
    requiresApproval: false,
    cacheable: true,
    timeout: 10000,
  }
}

/**
 * Create a tool that requires approval
 *
 * @example
 * ```typescript
 * const deleteUserTool = createApprovalTool({
 *   name: 'delete_user',
 *   description: 'Delete a user account (DESTRUCTIVE)',
 *   parameters: {
 *     userId: stringParam('User ID to delete'),
 *   },
 *   required: ['userId'],
 *   execute: async ({ userId }, context) => {
 *     // Check permissions
 *     if (!context.userId) throw userError('Authentication required')
 *
 *     await db.users.delete({ where: { id: userId } })
 *     return { deleted: true, userId }
 *   },
 * })
 * ```
 */
export function createApprovalTool<
  TArgs extends Record<string, unknown>,
>(config: {
  name: string
  description: string
  parameters: Record<keyof TArgs, ToolParameters['properties'][string]>
  required?: (keyof TArgs)[]
  execute: (args: TArgs, context?: any) => Promise<any>
  timeout?: number
}): ToolDefinition {
  return {
    name: config.name,
    description: config.description,
    parameters: {
      type: 'object',
      properties: config.parameters as any,
      required: (config.required || []) as string[],
    },
    execute: withErrorHandling(config.execute as any),
    requiresApproval: true,
    cacheable: false,
    timeout: config.timeout || 30000,
  }
}

/**
 * Create an API integration tool
 *
 * Handles common API patterns: auth, rate limiting, error handling.
 *
 * @example
 * ```typescript
 * const githubTool = createAPITool({
 *   name: 'github_search',
 *   description: 'Search GitHub repositories',
 *   parameters: {
 *     query: stringParam('Search query'),
 *   },
 *   required: ['query'],
 *   baseURL: 'https://api.github.com',
 *   endpoint: '/search/repositories',
 *   method: 'GET',
 *   buildRequest: (args) => ({
 *     params: { q: args.query },
 *     headers: { Accept: 'application/vnd.github+json' },
 *   }),
 *   parseResponse: (data) => ({
 *     total: data.total_count,
 *     repositories: data.items.slice(0, 5),
 *   }),
 * })
 * ```
 */
export function createAPITool<TArgs extends Record<string, unknown>>(config: {
  name: string
  description: string
  parameters: Record<keyof TArgs, ToolParameters['properties'][string]>
  required?: (keyof TArgs)[]
  baseURL: string
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  buildRequest: (args: TArgs) => {
    params?: Record<string, string>
    headers?: Record<string, string>
    body?: any
  }
  parseResponse: (data: any) => any
  cacheTTL?: number
  timeout?: number
}): ToolDefinition {
  return {
    name: config.name,
    description: config.description,
    parameters: {
      type: 'object',
      properties: config.parameters as any,
      required: (config.required || []) as string[],
    },
    execute: withErrorHandling(async (args: Record<string, unknown>) => {
      const request = config.buildRequest(args as TArgs)
      const url = new URL(config.endpoint, config.baseURL)

      // Add query parameters
      if (request.params) {
        for (const [key, value] of Object.entries(request.params)) {
          url.searchParams.set(key, value)
        }
      }

      // Make request
      const response = await fetch(url.toString(), {
        method: config.method || 'GET',
        headers: request.headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      })

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()
      return config.parseResponse(data)
    }, `Failed to call ${config.name} API`),
    requiresApproval: false,
    cacheable: true,
    timeout: config.timeout || 15000,
  }
}

// =============================================================================
// Schema Shorthand
// =============================================================================

/**
 * Simplified schema definition for createTool shorthand
 */
export type SchemaShorthand = Record<
  string,
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | string[] // Enum
  | ToolParameters['properties'][string] // Full schema object
>

/**
 * Expand shorthand schema to full JSON Schema
 */
function expandSchema(shorthand: SchemaShorthand): ToolParameters {
  const properties: ToolParameters['properties'] = {}
  const required: string[] = []

  for (const [key, value] of Object.entries(shorthand)) {
    // Add to required by default in shorthand unless explicitly optional in full schema
    if (
      typeof value !== 'object' ||
      Array.isArray(value) ||
      !('default' in value) // If it has a default, it's optional
    ) {
      required.push(key)
    }

    // Handle array of strings (Enum)
    if (Array.isArray(value)) {
      properties[key] = {
        type: 'string',
        enum: value,
      }
      continue
    }

    // Handle string shorthand
    if (typeof value === 'string') {
      properties[key] = {
        type: value as any,
      }
      continue
    }

    // Handle full schema object
    if (typeof value === 'object') {
      properties[key] = value
      continue
    }
  }

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined,
  }
}

/**
 * Create a tool with simplified schema definition
 *
 * @example
 * ```typescript
 * const tool = createTool({
 *   name: 'get_weather',
 *   description: 'Get weather',
 *   schema: {
 *     location: 'string',
 *     units: ['celsius', 'fahrenheit']
 *   },
 *   execute: async ({ location, units }) => { ... }
 * })
 * ```
 */
export function createTool<TArgs extends Record<string, unknown>>(config: {
  name: string
  description: string
  schema: SchemaShorthand
  execute: (args: TArgs, context?: any) => Promise<any>
  requiresApproval?: boolean
  cacheable?: boolean
}): ToolDefinition {
  return {
    name: config.name,
    description: config.description,
    parameters: expandSchema(config.schema),
    execute: withErrorHandling(config.execute as any),
    requiresApproval: config.requiresApproval ?? true,
    cacheable: config.cacheable ?? false,
  }
}

// =============================================================================
// Exports
// =============================================================================

export type { ToolDefinition, ToolParameters, ToolArguments }
