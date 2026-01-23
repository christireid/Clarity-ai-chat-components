/**
 * Canonical Tool Definition Types
 *
 * This module defines the canonical format for tool definitions in Clarity Chat.
 * All internal tool systems should use these types.
 *
 * **Design Principles**:
 * - Type-safe and well-documented
 * - Security-first (explicit approval, safe defaults)
 * - Extensible via lifecycle hooks
 * - Compatible with OpenAI function calling format
 *
 * @module tool-definition
 */

// =============================================================================
// JSON Schema Types (for parameter validation)
// =============================================================================

/**
 * JSON Schema property definition (subset of JSON Schema Draft 7)
 */
export interface ToolParameterProperty {
  /** Property type */
  type:
    | 'string'
    | 'number'
    | 'integer'
    | 'boolean'
    | 'array'
    | 'object'
    | 'null'

  /** Human-readable description */
  description?: string

  /** Allowed values (enum) */
  enum?: (string | number | boolean)[]

  /** Default value */
  default?: unknown

  /** For array type: item schema */
  items?: ToolParameterProperty

  /** For object type: property schemas */
  properties?: Record<string, ToolParameterProperty>

  /** For object type: required property names */
  required?: string[]

  /** Numeric constraints */
  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
  multipleOf?: number

  /** String constraints */
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: string

  /** Array constraints */
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean

  /** Composition */
  anyOf?: ToolParameterProperty[]
  oneOf?: ToolParameterProperty[]
  allOf?: ToolParameterProperty[]
  not?: ToolParameterProperty
}

/**
 * JSON Schema for tool parameters
 * Always an object at the root level
 */
export interface ToolParameters {
  type: 'object'
  properties: Record<string, ToolParameterProperty>
  required?: string[]
  additionalProperties?: boolean
}

// =============================================================================
// Tool Execution Types
// =============================================================================

/**
 * Arguments passed to tool execution
 * Generic type parameter allows type-safe tools
 */
export type ToolArguments<T = Record<string, unknown>> = T

/**
 * Result from tool execution
 * Can be any JSON-serializable value
 */
export type ToolResult<T = unknown> = T

/**
 * Tool execution context (passed to lifecycle hooks)
 */
export interface ToolExecutionContext {
  /** Tool call ID */
  callId: string

  /** Timestamp when execution started */
  startedAt: number

  /** User who initiated the call (if available) */
  userId?: string

  /** Session or conversation ID */
  sessionId?: string

  /** Additional context data */
  metadata?: Record<string, unknown>
}

// =============================================================================
// Tool Lifecycle Hooks
// =============================================================================

/**
 * Hooks for tool execution lifecycle
 * All hooks are optional and support async operations
 */
export interface ToolLifecycleHooks<
  TArgs = Record<string, unknown>,
  TResult = unknown,
> {
  /**
   * Called before parameter validation
   * Can modify arguments or throw to prevent execution
   */
  onBefore?: (
    args: TArgs,
    context: ToolExecutionContext
  ) => void | Promise<void>

  /**
   * Called after successful execution
   * Can modify result or perform side effects (logging, analytics)
   */
  onAfter?: (
    result: TResult,
    args: TArgs,
    context: ToolExecutionContext
  ) => void | Promise<void>

  /**
   * Called when execution fails
   * Can perform cleanup or error logging
   */
  onError?: (
    error: Error,
    args: TArgs,
    context: ToolExecutionContext
  ) => void | Promise<void>

  /**
   * Called when execution times out
   * Can perform cleanup specific to timeout scenarios
   */
  onTimeout?: (
    args: TArgs,
    context: ToolExecutionContext
  ) => void | Promise<void>

  /**
   * Called when execution is cancelled
   * Can perform cleanup for cancelled operations
   */
  onCancel?: (
    args: TArgs,
    context: ToolExecutionContext
  ) => void | Promise<void>
}

// =============================================================================
// Tool Definition (Canonical Format)
// =============================================================================

/**
 * Canonical Tool Definition
 *
 * This is the single source of truth for tool definitions in Clarity Chat.
 * Use generic type parameters for type-safe tool implementations.
 *
 * @template TArgs - Type of tool arguments (default: Record<string, unknown>)
 * @template TResult - Type of tool result (default: unknown)
 *
 * @example
 * ```typescript
 * const weatherTool: ToolDefinition<{ location: string }, WeatherData> = {
 *   name: 'get_weather',
 *   description: 'Get current weather for a location',
 *   parameters: {
 *     type: 'object',
 *     properties: {
 *       location: {
 *         type: 'string',
 *         description: 'City and state, e.g. San Francisco, CA'
 *       }
 *     },
 *     required: ['location']
 *   },
 *   execute: async (args) => {
 *     // args is typed as { location: string }
 *     const data = await fetchWeather(args.location)
 *     return data // typed as WeatherData
 *   },
 *   category: 'information',
 *   tags: ['weather', 'api']
 * }
 * ```
 */
export interface ToolDefinition<
  TArgs extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
> {
  // ===== IDENTIFICATION =====

  /**
   * Unique tool identifier
   * Must be a valid function name (alphanumeric + underscore)
   * Recommended format: lowercase_with_underscores
   */
  name: string

  /**
   * Human-readable tool description
   * Used by LLM to decide when to call the tool
   * Should clearly explain what the tool does and when to use it
   */
  description: string

  /**
   * Display name for UI (optional)
   * If not provided, name will be used
   */
  displayName?: string

  // ===== PARAMETERS =====

  /**
   * Parameter schema (JSON Schema)
   * Defines and validates tool input
   */
  parameters: ToolParameters

  // ===== EXECUTION =====

  /**
   * Tool execution function
   * Must be async and return a JSON-serializable result
   *
   * @param args - Validated arguments matching the parameter schema
   * @param context - Execution context (call ID, timestamps, etc.)
   * @returns Tool result (must be JSON-serializable)
   * @throws Error if execution fails
   */
  execute: (
    args: ToolArguments<TArgs>,
    context: ToolExecutionContext
  ) => Promise<ToolResult<TResult>>

  // ===== SECURITY & BEHAVIOR =====

  /**
   * Whether tool requires user approval before execution
   *
   * **Default**: `true` (safe default)
   * **Set to `false`** only for:
   * - Pure functions with no side effects
   * - Read-only operations
   * - Trusted, safe operations
   *
   * **Must be `true`** for:
   * - Network requests
   * - File system operations
   * - Database modifications
   * - Any operation with side effects
   */
  requiresApproval?: boolean

  /**
   * Whether tool results can be cached
   *
   * **Default**: `false` (safe default)
   * **Set to `true`** only for:
   * - Pure, deterministic functions
   * - Expensive operations that benefit from caching
   *
   * **Must be `false`** for:
   * - Operations with side effects
   * - Non-deterministic operations (random, time-based)
   * - Operations that return different results for same input
   */
  cacheable?: boolean

  /**
   * Cache time-to-live in milliseconds
   * Only used if cacheable is true
   *
   * @default 300000 (5 minutes)
   */
  cacheTtl?: number

  /**
   * Execution timeout in milliseconds
   * Tool execution will be aborted if it exceeds this time
   *
   * @default 30000 (30 seconds)
   */
  timeout?: number

  /**
   * Whether tool can be executed in parallel with other tools
   * If false, tool will be executed sequentially
   *
   * @default true
   */
  parallelizable?: boolean

  // ===== DISCOVERY & UX =====

  /**
   * Tool category for organization and filtering
   * Common categories: 'utility', 'information', 'data', 'integration', 'development'
   */
  category?: string

  /**
   * Tags for discovery and search
   * Examples: ['math', 'calculation'], ['weather', 'api']
   */
  tags?: string[]

  /**
   * Icon identifier (emoji, icon name, or URL)
   * Used in UI components
   */
  icon?: string

  /**
   * Color theme for UI display
   * Can be a CSS color, Tailwind class, or theme token
   */
  color?: string

  // ===== LIFECYCLE HOOKS =====

  /**
   * Lifecycle hooks for advanced control
   * All hooks are optional
   */
  hooks?: ToolLifecycleHooks<TArgs, TResult>

  // ===== METADATA =====

  /**
   * Additional metadata for extensions
   * Not used by core system but available for custom integrations
   */
  metadata?: Record<string, unknown>
}

// =============================================================================
// Tool Registry Types
// =============================================================================

/**
 * Tool registry interface
 * Manages collection of tools
 */
export interface IToolRegistry {
  /** Register a tool */
  register(tool: ToolDefinition): void

  /** Unregister a tool by name */
  unregister(name: string): boolean

  /** Get tool by name */
  get(name: string): ToolDefinition | undefined

  /** Check if tool exists */
  has(name: string): boolean

  /** Get all registered tools */
  getAll(): ToolDefinition[]

  /** Get tools by category */
  getByCategory(category: string): ToolDefinition[]

  /** Get tools by tag */
  getByTag(tag: string): ToolDefinition[]

  /** Search tools by query */
  search(query: string): ToolDefinition[]

  /** Clear all tools */
  clear(): void
}

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Type guard to check if an object is a valid ToolDefinition
 */
export function isToolDefinition(obj: unknown): obj is ToolDefinition {
  if (typeof obj !== 'object' || obj === null) return false

  const tool = obj as Partial<ToolDefinition>

  return (
    typeof tool.name === 'string' &&
    typeof tool.description === 'string' &&
    typeof tool.parameters === 'object' &&
    tool.parameters !== null &&
    tool.parameters.type === 'object' &&
    typeof tool.execute === 'function'
  )
}

/**
 * Validate tool definition
 * Throws detailed error if invalid
 */
export function validateToolDefinition(
  tool: unknown
): asserts tool is ToolDefinition {
  if (!isToolDefinition(tool)) {
    throw new Error('Invalid tool definition: missing required properties')
  }

  // Validate name format
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tool.name)) {
    throw new Error(
      `Invalid tool name: "${tool.name}". Must be alphanumeric with underscores.`
    )
  }

  // Validate description
  if (tool.description.length === 0) {
    throw new Error(`Tool "${tool.name}" must have a non-empty description`)
  }

  // Validate parameters
  if (
    !tool.parameters.properties ||
    typeof tool.parameters.properties !== 'object'
  ) {
    throw new Error(
      `Tool "${tool.name}" parameters must have a properties object`
    )
  }
}

// Note: All types are exported inline above
