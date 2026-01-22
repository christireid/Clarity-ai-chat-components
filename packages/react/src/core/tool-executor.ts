/**
 * Tool Executor
 *
 * Executes tools with validation, timeout protection, and caching.
 * Integrates with lifecycle manager for state tracking and event emission.
 *
 * **Features**:
 * - JSON Schema validation of parameters
 * - Timeout protection with AbortSignal
 * - Result caching for cacheable tools
 * - Lifecycle integration
 * - Error handling and recovery
 * - Execution hooks
 *
 * @module core/tool-executor
 */

import type {
  ToolDefinition,
  ToolArguments,
  ToolResult,
  ToolExecutionContext,
  ToolParameterProperty,
} from '../types/tool-definition'
import type { ToolLifecycleManager } from './tool-lifecycle'

// =============================================================================
// Validation
// =============================================================================

/**
 * Validation error
 */
export class ToolValidationError extends Error {
  constructor(
    public toolName: string,
    public field: string,
    message: string
  ) {
    super(`[${toolName}] Parameter validation failed for '${field}': ${message}`)
    this.name = 'ToolValidationError'
  }
}

/**
 * Tool Timeout Error
 */
export class ToolTimeoutError extends Error {
  constructor(public toolName: string, public timeoutMs: number) {
    super(`Tool execution timeout after ${timeoutMs}ms: ${toolName}`)
    this.name = 'ToolTimeoutError'
  }
}

/**
 * Tool Execution Error
 */
export class ToolExecutionError extends Error {
  constructor(public toolName: string, message: string, public originalError?: Error) {
    super(`Tool execution failed: ${toolName} - ${message}`)
    this.name = 'ToolExecutionError'
    if (originalError) {
      this.cause = originalError
    }
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
        throw new ToolValidationError(tool.name, field, 'Required field is missing')
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
          'Unknown field (additionalProperties: false)'
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
  schema: ToolParameterProperty
): void {
  // 1. Validate composition (oneOf, anyOf, allOf, not)
  // FIX: TOOL-001 - Incomplete schema validation
  if (schema.oneOf) {
    let matchCount = 0
    for (const subSchema of schema.oneOf) {
      try {
        validateValue(toolName, field, value, subSchema)
        matchCount++
      } catch (e) {
        // Ignore errors in sub-schemas
      }
    }
    if (matchCount !== 1) {
      throw new ToolValidationError(
        toolName,
        field,
        `Value must match exactly one of the oneOf schemas (matched ${matchCount})`
      )
    }
  }

  if (schema.anyOf) {
    let matched = false
    for (const subSchema of schema.anyOf) {
      try {
        validateValue(toolName, field, value, subSchema)
        matched = true
        break
      } catch (e) {
        // Ignore errors
      }
    }
    if (!matched) {
      throw new ToolValidationError(
        toolName,
        field,
        'Value must match at least one of the anyOf schemas'
      )
    }
  }

  if (schema.allOf) {
    for (const subSchema of schema.allOf) {
      validateValue(toolName, field, value, subSchema)
    }
  }

  if (schema.not) {
    try {
      validateValue(toolName, field, value, schema.not)
    } catch (e) {
      // Success if it throws
      return
    }
    throw new ToolValidationError(toolName, field, 'Value matches "not" schema')
  }

  // Null check
  if (value === null || value === undefined) {
    if (schema.type === 'null' || (Array.isArray(schema.type) && schema.type.includes('null'))) {
      return
    }
    throw new ToolValidationError(toolName, field, 'Value is null or undefined')
  }

  // Type check
  if (schema.type) {
    const actualType = Array.isArray(value) ? 'array' : typeof value
    // Handle 'integer' type which is 'number' in JS
    const normalizedActualType = actualType === 'number' && Number.isInteger(value) ? 'integer' : actualType
    
    const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type]

    // Allow 'number' to match 'integer' if it is an integer, or 'integer' to match 'number'
    const isTypeMatch = expectedTypes.some(type => {
      if (type === actualType) return true
      if (type === 'integer' && normalizedActualType === 'integer') return true
      if (type === 'number' && actualType === 'number') return true
      return false
    })

    if (!isTypeMatch) {
      throw new ToolValidationError(
        toolName,
        field,
        `Expected type ${expectedTypes.join(' | ')}, got ${actualType}`
      )
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
  }

  // Enum validation
  if (schema.enum && !schema.enum.includes(value as any)) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value must be one of: ${schema.enum.join(', ')}`
    )
  }
}

/**
 * Validate string value
 */
function validateString(toolName: string, field: string, value: string, schema: ToolParameterProperty): void {
  if (schema.minLength !== undefined && value.length < schema.minLength) {
    throw new ToolValidationError(
      toolName,
      field,
      `String length ${value.length} is less than minimum ${schema.minLength}`
    )
  }

  if (schema.maxLength !== undefined && value.length > schema.maxLength) {
    throw new ToolValidationError(
      toolName,
      field,
      `String length ${value.length} exceeds maximum ${schema.maxLength}`
    )
  }

  if (schema.pattern) {
    // FIX: TOOL-003 - Safe regex validation
    // 1. Enforce length limit if pattern is present to mitigate ReDoS
    const SAFE_REGEX_MAX_LENGTH = 10000
    if (value.length > SAFE_REGEX_MAX_LENGTH) {
      throw new ToolValidationError(
        toolName,
        field,
        `String length ${value.length} exceeds safety limit ${SAFE_REGEX_MAX_LENGTH} for regex validation`
      )
    }

    try {
      const regex = new RegExp(schema.pattern)
      if (!regex.test(value)) {
        throw new ToolValidationError(
          toolName,
          field,
          `String does not match pattern: ${schema.pattern}`
        )
      }
    } catch (e) {
      if (e instanceof ToolValidationError) throw e
      throw new ToolValidationError(
        toolName,
        field,
        `Invalid regex pattern in schema: ${schema.pattern}`
      )
    }
  }

  // FIX: TOOL-001 - Format validation
  if (schema.format) {
    validateFormat(toolName, field, value, schema.format)
  }
}

/**
 * Validate string formats
 */
function validateFormat(toolName: string, field: string, value: string, format: string): void {
  switch (format) {
    case 'date-time':
      if (isNaN(Date.parse(value))) {
        throw new ToolValidationError(toolName, field, 'Invalid date-time format')
      }
      break
    case 'email':
      // Basic email regex
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        throw new ToolValidationError(toolName, field, 'Invalid email format')
      }
      break
    case 'uri':
    case 'url':
      try {
        new URL(value)
      } catch {
        throw new ToolValidationError(toolName, field, 'Invalid URI/URL format')
      }
      break
    case 'ipv4':
      if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)) {
        throw new ToolValidationError(toolName, field, 'Invalid IPv4 format')
      }
      break
    // Add other formats as needed
  }
}

/**
 * Validate number value
 */
function validateNumber(toolName: string, field: string, value: number, schema: ToolParameterProperty): void {
  if (schema.type === 'integer' && !Number.isInteger(value)) {
    throw new ToolValidationError(toolName, field, 'Value must be an integer')
  }

  if (schema.minimum !== undefined && value < schema.minimum) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} is less than minimum ${schema.minimum}`
    )
  }

  if (schema.maximum !== undefined && value > schema.maximum) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} exceeds maximum ${schema.maximum}`
    )
  }

  if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} must be greater than ${schema.exclusiveMinimum}`
    )
  }

  if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} must be less than ${schema.exclusiveMaximum}`
    )
  }

  if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0) {
    throw new ToolValidationError(
      toolName,
      field,
      `Value ${value} is not a multiple of ${schema.multipleOf}`
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
  schema: ToolParameterProperty
): void {
  if (schema.minItems !== undefined && value.length < schema.minItems) {
    throw new ToolValidationError(
      toolName,
      field,
      `Array length ${value.length} is less than minimum ${schema.minItems}`
    )
  }

  if (schema.maxItems !== undefined && value.length > schema.maxItems) {
    throw new ToolValidationError(
      toolName,
      field,
      `Array length ${value.length} exceeds maximum ${schema.maxItems}`
    )
  }

  if (schema.uniqueItems) {
    const unique = new Set(value.map((v) => JSON.stringify(v)))
    if (unique.size !== value.length) {
      throw new ToolValidationError(toolName, field, 'Array items must be unique')
    }
  }

  // Validate items
  if (schema.items) {
    value.forEach((item, index) => {
      validateValue(toolName, `${field}[${index}]`, item, schema.items!)
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
  schema: ToolParameterProperty
): void {
  if (schema.required) {
    for (const requiredField of schema.required) {
      if (!(requiredField in value)) {
        throw new ToolValidationError(
          toolName,
          `${field}.${requiredField}`,
          'Required field is missing'
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

// =============================================================================
// Cache
// =============================================================================

/**
 * Cache entry
 */
interface CacheEntry {
  result: ToolResult
  timestamp: number
  ttl: number
}

/**
 * Stable stringify for cache keys
 * FIX: TOOL-010 - Cache key collisions / Misses due to property ordering
 */
function stableStringify(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj)
  }

  if (Array.isArray(obj)) {
    return `[${obj.map(stableStringify).join(',')}]`
  }

  const keys = Object.keys(obj as Record<string, unknown>).sort()
  const parts = keys.map(key => {
    const val = (obj as Record<string, unknown>)[key]
    // Skip undefined values to match JSON.stringify behavior, but keep explicit nulls
    if (val === undefined) return '' 
    return `"${key}":${stableStringify(val)}`
  }).filter(Boolean)

  return `{${parts.join(',')}}`
}

/**
 * Tool result cache
 */
export class ToolResultCache {
  private cache = new Map<string, CacheEntry>()

  /**
   * Generate cache key
   */
  private getCacheKey(toolName: string, args: ToolArguments, idempotencyKey?: string): string {
    // FIX: TOOL-010 - Use stable stringify for consistent keys
    const stableArgs = stableStringify(args)
    
    // FIX: TOOL-017 - Include idempotency key if present
    const idPart = idempotencyKey ? `:idemp:${idempotencyKey}` : ''
    
    return `${toolName}:${stableArgs}${idPart}`
  }

  /**
   * Get cached result
   */
  get(toolName: string, args: ToolArguments, idempotencyKey?: string): ToolResult | undefined {
    const key = this.getCacheKey(toolName, args, idempotencyKey)
    const entry = this.cache.get(key)

    if (!entry) {
      return undefined
    }

    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return undefined
    }

    return entry.result
  }

  /**
   * Set cache entry
   */
  set(toolName: string, args: ToolArguments, result: ToolResult, ttl: number, idempotencyKey?: string): void {
    const key = this.getCacheKey(toolName, args, idempotencyKey)
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * Clear cache for tool
   */
  clear(toolName?: string): void {
    if (!toolName) {
      this.cache.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.startsWith(`${toolName}:`)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; entries: Array<{ toolName: string; age: number }> } {
    const entries: Array<{ toolName: string; age: number }> = []
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      const toolName = key.split(':')[0]
      entries.push({
        toolName,
        age: now - entry.timestamp,
      })
    }

    return {
      size: this.cache.size,
      entries,
    }
  }
}

// =============================================================================
// Tool Executor
// =============================================================================

/**
 * Execution options
 */
export interface ExecutionOptions {
  /** Timeout in milliseconds (overrides tool.timeout) */
  timeout?: number

  /** Abort signal for cancellation */
  signal?: AbortSignal

  /** Skip validation */
  skipValidation?: boolean

  /** Skip cache */
  skipCache?: boolean

  /** Additional context */
  context?: Partial<ToolExecutionContext>

  /** 
   * Idempotency key for deduplication and caching
   * FIX: TOOL-017 - Missing idempotency
   */
  idempotencyKey?: string
}

/**
 * Execution result
 */
export interface ExecutionResult {
  /** Tool result */
  result: ToolResult

  /** Execution duration in milliseconds */
  duration: number

  /** Whether result came from cache */
  cached: boolean

  /** Error (if execution failed) */
  error?: Error
}

/**
 * Tool Executor
 *
 * Executes tools with validation, timeout, and caching.
 *
 * @example
 * ```typescript
 * const executor = new ToolExecutor(lifecycle)
 *
 * const result = await executor.execute(tool, args, {
 *   timeout: 5000,
 *   signal: abortSignal
 * })
 *
 * console.log(`Result: ${result.result}, Duration: ${result.duration}ms, Cached: ${result.cached}`)
 * ```
 */
export class ToolExecutor {
  private cache = new ToolResultCache()

  constructor(private lifecycle?: ToolLifecycleManager) {}

  /**
   * Execute a tool
   *
   * @param tool - Tool definition
   * @param args - Tool arguments
   * @param options - Execution options
   * @returns Execution result
   */
  async execute(
    tool: ToolDefinition,
    args: ToolArguments,
    options: ExecutionOptions = {}
  ): Promise<ExecutionResult> {
    const startTime = Date.now()

    // Create execution context
    const context: ToolExecutionContext = {
      callId: this.generateCallId(),
      startedAt: startTime,
      ...options.context,
    }

    try {
      // Validate arguments
      if (!options.skipValidation) {
        validateToolArguments(tool, args)
      }

      // Check cache
      if (!options.skipCache && tool.cacheable) {
        const cached = this.cache.get(tool.name, args, options.idempotencyKey)
        if (cached !== undefined) {
          return {
            result: cached,
            duration: Date.now() - startTime,
            cached: true,
            // FIX: TOOL-014 - No error on success
            error: undefined,
          }
        }
      }

      // Call onBefore hook
      if (tool.hooks?.onBefore) {
        await tool.hooks.onBefore(args, context)
      }

      // Execute with timeout
      const timeout = options.timeout ?? tool.timeout ?? 30000
      const result = await this.executeWithTimeout(
        tool,
        args,
        context,
        timeout,
        options.signal
      )

      const duration = Date.now() - startTime

      // Cache result
      if (tool.cacheable && !options.skipCache) {
        const ttl = tool.cacheTtl ?? 300000 // 5 minutes default
        this.cache.set(tool.name, args, result, ttl, options.idempotencyKey)
      }

      // Call onAfter hook
      if (tool.hooks?.onAfter) {
        await tool.hooks.onAfter(result, args, context)
      }

      return {
        result,
        duration,
        cached: false,
      }
    } catch (error) {
      // FIX: TOOL-014 - Fragile error classification
      const err = error instanceof Error ? error : new Error(String(error))
      
      // Wrap generic errors in ToolExecutionError if they aren't already specific
      const isSpecificError = 
        err instanceof ToolValidationError || 
        err instanceof ToolTimeoutError ||
        err instanceof ToolExecutionError
        
      const finalError = isSpecificError 
        ? err 
        : new ToolExecutionError(tool.name, err.message, err)

      // Call onError hook
      if (tool.hooks?.onError) {
        await tool.hooks.onError(finalError, args, context)
      }

      throw finalError
    }
  }

  /**
   * Execute tool with timeout protection
   */
  private async executeWithTimeout(
    tool: ToolDefinition,
    args: ToolArguments,
    context: ToolExecutionContext,
    timeoutMs: number,
    signal?: AbortSignal
  ): Promise<ToolResult> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | undefined
      let completed = false

      // Check if already aborted
      if (signal?.aborted) {
        reject(new Error(`Tool execution aborted: ${tool.name}`))
        return
      }

      // Set up timeout
      timeoutId = setTimeout(() => {
        if (!completed) {
          completed = true
          // FIX: TOOL-014 - Specific error type
          reject(new ToolTimeoutError(tool.name, timeoutMs))

          // Call onTimeout hook
          if (tool.hooks?.onTimeout) {
            Promise.resolve(tool.hooks.onTimeout(args, context)).catch((err) => {
              console.error('Error in onTimeout hook:', err)
            })
          }
        }
      }, timeoutMs)

      // Set up abort listener
      const abortListener = () => {
        if (!completed) {
          completed = true
          if (timeoutId) clearTimeout(timeoutId)
          reject(new Error(`Tool execution cancelled: ${tool.name}`))

          // Call onCancel hook
          if (tool.hooks?.onCancel) {
            Promise.resolve(tool.hooks.onCancel(args, context)).catch((err) => {
              console.error('Error in onCancel hook:', err)
            })
          }
        }
      }

      signal?.addEventListener('abort', abortListener)

      // Execute tool
      tool
        .execute(args, context)
        .then((result) => {
          if (!completed) {
            completed = true
            if (timeoutId) clearTimeout(timeoutId)
            signal?.removeEventListener('abort', abortListener)
            resolve(result)
          }
        })
        .catch((error) => {
          if (!completed) {
            completed = true
            if (timeoutId) clearTimeout(timeoutId)
            signal?.removeEventListener('abort', abortListener)
            reject(error)
          }
        })
    })
  }

  /**
   * Get cache instance
   */
  getCache(): ToolResultCache {
    return this.cache
  }

  /**
   * Clear cache
   */
  clearCache(toolName?: string): void {
    this.cache.clear(toolName)
  }

  /**
   * Generate unique call ID
   */
  private generateCallId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}

// =============================================================================
// Exports
// =============================================================================

export type { ExecutionOptions, ExecutionResult }
