'use client'

/**
 * Clarity Chat - Tools Engine
 *
 * A comprehensive tool execution engine with:
 * - Type-safe tool registry
 * - Automatic parameter validation
 * - Timeout handling
 * - Result caching
 * - Auto-approval for safe tools
 */

import type { ToolsConfig, ToolDefinition } from './types'
import { safeEvaluate } from '../utils/math/safe-evaluator'

// =============================================================================
// Types
// =============================================================================

/**
 * ToolsEngine call state
 *
 * **IMPORTANT**: This type is specific to the ToolsEngine functional API.
 * It represents the immutable state for React/functional components.
 *
 * **When to use**:
 * - When using the ToolsEngine functional API (createToolsEngine, executeToolCall, etc.)
 * - For React state management with immutable updates
 * - For functional/pure component architectures
 *
 * **Related types** (use for different purposes):
 * - `ToolCallRecord` (core/tool-lifecycle.ts): Full lifecycle tracking with 11 states
 * - `ToolInvocation` (types/tool-invocation.ts): Message format for chat UI (5 states)
 *
 * **Property Alignment**: Uses `name` and `parameters` for backwards compatibility,
 * but converters are provided to align with `toolName` and `args` used elsewhere.
 *
 * @see {@link toToolCallRecord} for conversion to ToolCallRecord
 * @see {@link ToolCallRecord} for full lifecycle tracking
 */
export interface ToolsEngineCall {
  /** Unique call identifier */
  id: string

  /** Tool name */
  name: string

  /** Tool parameters/arguments */
  parameters: Record<string, unknown>

  /** Current execution status */
  status:
    | 'pending' // Awaiting approval
    | 'approved' // Approved, ready to execute
    | 'executing' // Currently executing
    | 'completed' // Successfully completed
    | 'failed' // Execution failed
    | 'timeout' // Execution timed out

  /** Execution result (if completed) */
  result?: unknown

  /** Error message (if failed) */
  error?: string

  /** Execution start timestamp */
  startTime?: number

  /** Execution end timestamp */
  endTime?: number
}

/**
 * @deprecated Use ToolsEngineCall instead. This alias is provided for backwards compatibility.
 * Will be removed in v2.0.0.
 */
export type ToolCall = ToolsEngineCall

export interface ToolExecutionResult {
  success: boolean
  result?: unknown
  error?: string
  executionTimeMs: number
}

/**
 * ToolsEngine state container
 *
 * Immutable state object for functional/React-based tool management.
 */
export interface ToolsEngineState {
  /** Tool registry (map of tool name to definition) */
  registry: Map<string, ToolDefinition>

  /** Pending tool calls (awaiting approval or execution) */
  pendingCalls: ToolsEngineCall[]

  /** Completed tool calls (completed, failed, or timeout) */
  completedCalls: ToolsEngineCall[]

  /** Auto-approve tools without user confirmation (NEVER use in production) */
  autoApprove: boolean

  /** Tool execution timeout in milliseconds */
  timeoutMs: number

  /** Result cache */
  cache: Map<string, { result: unknown; timestamp: number }>

  /** Cache TTL in milliseconds */
  cacheTtlMs: number
}

// =============================================================================
// Built-in Safe Tools
// =============================================================================

const BUILT_IN_TOOLS: ToolDefinition[] = [
  {
    name: 'get_current_time',
    description: 'Get the current date and time',
    parameters: {
      type: 'object',
      properties: {
        timezone: {
          type: 'string',
          description: 'Timezone (e.g., "America/New_York")',
        },
      },
    },
    execute: async (params) => {
      const { timezone } = params as { timezone?: string }
      const now = new Date()
      if (timezone) {
        return now.toLocaleString('en-US', { timeZone: timezone })
      }
      return now.toISOString()
    },
  },
  {
    name: 'calculate',
    description: 'Perform a mathematical calculation',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Mathematical expression to evaluate (e.g., "2 + 2")',
        },
      },
      required: ['expression'],
    },
    execute: async (params) => {
      const { expression } = params as { expression: string }
      // SECURITY: Use safe recursive descent parser - no eval() or Function()
      const result = safeEvaluate(expression)
      return { expression, result }
    },
  },
  {
    name: 'generate_uuid',
    description: 'Generate a unique identifier',
    parameters: {
      type: 'object',
      properties: {
        format: {
          type: 'string',
          enum: ['uuid', 'short', 'nano'],
          description: 'Format of the ID',
        },
      },
    },
    execute: async (params) => {
      const { format = 'uuid' } = params as { format?: string }
      if (format === 'short') {
        return Math.random().toString(36).slice(2, 10)
      }
      if (format === 'nano') {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      }
      // UUID v4
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
  },
  {
    name: 'format_json',
    description: 'Format or validate JSON data',
    parameters: {
      type: 'object',
      properties: {
        json: {
          type: 'string',
          description: 'JSON string to format',
        },
        indent: {
          type: 'number',
          description: 'Indentation spaces (default: 2)',
        },
      },
      required: ['json'],
    },
    execute: async (params) => {
      const { json, indent = 2 } = params as { json: string; indent?: number }
      try {
        const parsed = JSON.parse(json)
        return {
          valid: true,
          formatted: JSON.stringify(parsed, null, indent),
        }
      } catch {
        return {
          valid: false,
          error: 'Invalid JSON',
        }
      }
    },
  },
]

// =============================================================================
// Parameter Validation
// =============================================================================

interface JsonSchema {
  type?: string
  properties?: Record<string, JsonSchema>
  required?: string[]
  enum?: unknown[]
}

/**
 * Validate parameters against a JSON Schema
 */
function validateParameters(
  params: Record<string, unknown>,
  schema: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const jsonSchema = schema as JsonSchema

  if (jsonSchema.type !== 'object') {
    return { valid: true, errors: [] }
  }

  const properties = jsonSchema.properties || {}
  const required = jsonSchema.required || []

  // Check required properties
  for (const prop of required) {
    if (!(prop in params)) {
      errors.push(`Missing required parameter: ${prop}`)
    }
  }

  // Validate property types
  for (const [key, value] of Object.entries(params)) {
    const propSchema = properties[key] as JsonSchema | undefined
    if (!propSchema) continue

    if (propSchema.type === 'string' && typeof value !== 'string') {
      errors.push(`Parameter "${key}" must be a string`)
    }
    if (propSchema.type === 'number' && typeof value !== 'number') {
      errors.push(`Parameter "${key}" must be a number`)
    }
    if (propSchema.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`Parameter "${key}" must be a boolean`)
    }
    if (propSchema.enum && !propSchema.enum.includes(value)) {
      errors.push(
        `Parameter "${key}" must be one of: ${propSchema.enum.join(', ')}`
      )
    }
  }

  return { valid: errors.length === 0, errors }
}

// =============================================================================
// Cache Key Generation
// =============================================================================

/**
 * Generate a cache key for a tool call
 */
function generateCacheKey(
  name: string,
  params: Record<string, unknown>
): string {
  return `${name}:${JSON.stringify(params, Object.keys(params).sort())}`
}

// =============================================================================
// Tools Engine
// =============================================================================

/**
 * Create a new tools engine instance
 */
export function createToolsEngine(config: ToolsConfig = {}): ToolsEngineState {
  const registry = new Map<string, ToolDefinition>()

  // Register built-in tools
  for (const tool of BUILT_IN_TOOLS) {
    registry.set(tool.name, tool)
  }

  // Register custom tools
  for (const tool of config.registry || []) {
    registry.set(tool.name, tool)
  }

  // SECURITY: Default to requiring approval for tool execution
  const autoApprove = config.autoApprove ?? false

  // SECURITY: Prevent autoApprove in production
  if (autoApprove) {
    const isProduction =
      typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'

    if (isProduction) {
      throw new Error(
        '[Clarity Chat] SECURITY ERROR: autoApprove cannot be enabled in production. ' +
          'Tools must require explicit user approval. Set autoApprove: false.'
      )
    }

    // Warn in non-production environments
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Clarity Chat] SECURITY WARNING: autoApprove is enabled. Tools will execute without user consent. ' +
          'This should only be used in trusted development/testing environments.'
      )
    }
  }

  return {
    registry,
    pendingCalls: [],
    completedCalls: [],
    autoApprove,
    timeoutMs: config.timeoutMs || 30000,
    cache: new Map(),
    cacheTtlMs: 60000, // 1 minute cache
  }
}

/**
 * Register a new tool
 */
export function registerTool(
  state: ToolsEngineState,
  tool: ToolDefinition
): ToolsEngineState {
  const registry = new Map(state.registry)
  registry.set(tool.name, tool)
  return { ...state, registry }
}

/**
 * Unregister a tool
 */
export function unregisterTool(
  state: ToolsEngineState,
  toolName: string
): ToolsEngineState {
  const registry = new Map(state.registry)
  registry.delete(toolName)
  return { ...state, registry }
}

/**
 * Get list of available tools
 */
export function getAvailableTools(state: ToolsEngineState): Array<{
  name: string
  description: string
  parameters: Record<string, unknown>
}> {
  return Array.from(state.registry.values()).map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  }))
}

/**
 * Create a tool call (request execution)
 */
export function createToolCall(
  state: ToolsEngineState,
  name: string,
  parameters: Record<string, unknown>
): { state: ToolsEngineState; call: ToolsEngineCall } {
  const tool = state.registry.get(name)

  if (!tool) {
    const call: ToolsEngineCall = {
      id: `call_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name,
      parameters,
      status: 'failed',
      error: `Unknown tool: ${name}. Available tools: ${Array.from(state.registry.keys()).join(', ')}`,
    }
    return {
      state: { ...state, completedCalls: [...state.completedCalls, call] },
      call,
    }
  }

  // Validate parameters
  const validation = validateParameters(parameters, tool.parameters)
  if (!validation.valid) {
    const call: ToolsEngineCall = {
      id: `call_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name,
      parameters,
      status: 'failed',
      error: `Parameter validation failed: ${validation.errors.join('; ')}`,
    }
    return {
      state: { ...state, completedCalls: [...state.completedCalls, call] },
      call,
    }
  }

  const call: ToolsEngineCall = {
    id: `call_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name,
    parameters,
    status: state.autoApprove ? 'approved' : 'pending',
  }

  return {
    state: { ...state, pendingCalls: [...state.pendingCalls, call] },
    call,
  }
}

/**
 * Approve a pending tool call
 */
export function approveToolCall(
  state: ToolsEngineState,
  callId: string
): ToolsEngineState {
  const pendingCalls = state.pendingCalls.map((call) =>
    call.id === callId ? { ...call, status: 'approved' as const } : call
  )
  return { ...state, pendingCalls }
}

/**
 * Reject a pending tool call
 */
export function rejectToolCall(
  state: ToolsEngineState,
  callId: string,
  reason: string
): ToolsEngineState {
  const call = state.pendingCalls.find((c) => c.id === callId)
  if (!call) return state

  const rejectedCall: ToolsEngineCall = {
    ...call,
    status: 'failed',
    error: `Rejected: ${reason}`,
  }

  return {
    ...state,
    pendingCalls: state.pendingCalls.filter((c) => c.id !== callId),
    completedCalls: [...state.completedCalls, rejectedCall],
  }
}

/**
 * Execute a tool call
 */
export async function executeToolCall(
  state: ToolsEngineState,
  callId: string
): Promise<{ state: ToolsEngineState; result: ToolExecutionResult }> {
  const call = state.pendingCalls.find((c) => c.id === callId)
  if (!call || call.status !== 'approved') {
    return {
      state,
      result: {
        success: false,
        error: 'Call not found or not approved',
        executionTimeMs: 0,
      },
    }
  }

  const tool = state.registry.get(call.name)
  if (!tool) {
    return {
      state,
      result: {
        success: false,
        error: `Tool not found: ${call.name}`,
        executionTimeMs: 0,
      },
    }
  }

  // Check cache
  const cacheKey = generateCacheKey(call.name, call.parameters)
  const cached = state.cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < state.cacheTtlMs) {
    const completedCall: ToolsEngineCall = {
      ...call,
      status: 'completed',
      result: cached.result,
      startTime: Date.now(),
      endTime: Date.now(),
    }

    return {
      state: {
        ...state,
        pendingCalls: state.pendingCalls.filter((c) => c.id !== callId),
        completedCalls: [...state.completedCalls, completedCall],
      },
      result: {
        success: true,
        result: cached.result,
        executionTimeMs: 0,
      },
    }
  }

  // Execute with timeout
  const startTime = Date.now()

  // Update call status to executing
  const executingState = {
    ...state,
    pendingCalls: state.pendingCalls.map((c) =>
      c.id === callId ? { ...c, status: 'executing' as const, startTime } : c
    ),
  }

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Execution timeout')), state.timeoutMs)
    })

    const result = await Promise.race([
      tool.execute(call.parameters),
      timeoutPromise,
    ])

    const endTime = Date.now()
    const executionTimeMs = endTime - startTime

    // Cache the result
    const newCache = new Map(state.cache)
    newCache.set(cacheKey, { result, timestamp: Date.now() })

    const completedCall: ToolsEngineCall = {
      ...call,
      status: 'completed',
      result,
      startTime,
      endTime,
    }

    return {
      state: {
        ...executingState,
        pendingCalls: executingState.pendingCalls.filter(
          (c) => c.id !== callId
        ),
        completedCalls: [...executingState.completedCalls, completedCall],
        cache: newCache,
      },
      result: {
        success: true,
        result,
        executionTimeMs,
      },
    }
  } catch (err) {
    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    const errorMessage = err instanceof Error ? err.message : String(err)

    const failedCall: ToolsEngineCall = {
      ...call,
      status: errorMessage === 'Execution timeout' ? 'timeout' : 'failed',
      error: errorMessage,
      startTime,
      endTime,
    }

    return {
      state: {
        ...executingState,
        pendingCalls: executingState.pendingCalls.filter(
          (c) => c.id !== callId
        ),
        completedCalls: [...executingState.completedCalls, failedCall],
      },
      result: {
        success: false,
        error: errorMessage,
        executionTimeMs,
      },
    }
  }
}

/**
 * Execute a tool call immediately (convenience method)
 */
export async function executeTool(
  state: ToolsEngineState,
  name: string,
  parameters: Record<string, unknown>
): Promise<{ state: ToolsEngineState; result: ToolExecutionResult }> {
  // Create the call
  const { state: stateWithCall, call } = createToolCall(state, name, parameters)

  if (call.status === 'failed') {
    return {
      state: stateWithCall,
      result: {
        success: false,
        error: call.error,
        executionTimeMs: 0,
      },
    }
  }

  // Approve if needed
  let readyState = stateWithCall
  if (call.status === 'pending') {
    readyState = approveToolCall(stateWithCall, call.id)
  }

  // Execute
  return executeToolCall(readyState, call.id)
}

/**
 * Get tool execution statistics
 */
export function getToolStats(state: ToolsEngineState): {
  totalCalls: number
  successfulCalls: number
  failedCalls: number
  pendingCalls: number
  averageExecutionTimeMs: number
  registeredTools: number
} {
  const completed = state.completedCalls
  const successful = completed.filter((c) => c.status === 'completed')
  const failed = completed.filter(
    (c) => c.status === 'failed' || c.status === 'timeout'
  )

  const executionTimes = successful
    .filter((c) => c.startTime && c.endTime)
    .map((c) => c.endTime! - c.startTime!)

  const averageExecutionTimeMs =
    executionTimes.length > 0
      ? executionTimes.reduce((sum, t) => sum + t, 0) / executionTimes.length
      : 0

  return {
    totalCalls: completed.length,
    successfulCalls: successful.length,
    failedCalls: failed.length,
    pendingCalls: state.pendingCalls.length,
    averageExecutionTimeMs: Math.round(averageExecutionTimeMs),
    registeredTools: state.registry.size,
  }
}

/**
 * Clear completed calls history
 */
export function clearToolHistory(state: ToolsEngineState): ToolsEngineState {
  return { ...state, completedCalls: [] }
}

/**
 * Clear tool cache
 */
export function clearToolCache(state: ToolsEngineState): ToolsEngineState {
  return { ...state, cache: new Map() }
}

// =============================================================================
// Type Converters (Interoperability with Other Tool Calling APIs)
// =============================================================================

/**
 * Convert ToolsEngineCall to ToolCallRecord format (for lifecycle tracking)
 *
 * **Use case**: When integrating ToolsEngine with ToolLifecycleManager
 *
 * @param call - ToolsEngineCall to convert
 * @returns ToolCallRecord compatible object
 *
 * @example
 * ```typescript
 * import { ToolLifecycleManager } from '../core/tool-lifecycle'
 *
 * const engineCall = createToolCall(state, 'get_weather', { location: 'SF' })
 * const lifecycleRecord = toToolCallRecord(engineCall.call)
 * lifecycle.trackCall(lifecycleRecord)
 * ```
 */
export function toToolCallRecord(call: ToolsEngineCall): {
  id: string
  toolName: string
  args: Record<string, unknown>
  status: import('../core/tool-lifecycle').ToolCallStatus
  timestamps: {
    requested?: number
    executionStarted?: number
    executionEnded?: number
  }
  result?: unknown
  error?: {
    message: string
  }
} {
  // Map ToolsEngineCall status to ToolCallStatus
  const statusMap: Record<
    ToolsEngineCall['status'],
    import('../core/tool-lifecycle').ToolCallStatus
  > = {
    pending: 'pending_approval',
    approved: 'approved',
    executing: 'executing',
    completed: 'completed',
    failed: 'failed',
    timeout: 'timeout',
  }

  return {
    id: call.id,
    toolName: call.name, // name → toolName
    args: call.parameters, // parameters → args
    status: statusMap[call.status],
    timestamps: {
      requested: call.startTime,
      executionStarted: call.startTime,
      executionEnded: call.endTime,
    },
    result: call.result,
    error: call.error ? { message: call.error } : undefined,
  }
}

/**
 * Convert ToolsEngineCall to ToolInvocation format (for message/UI layer)
 *
 * **Use case**: When adding tool calls to chat messages
 *
 * @param call - ToolsEngineCall to convert
 * @returns ToolInvocation compatible object
 *
 * @example
 * ```typescript
 * import type { AssistantMessage } from '../types/tool-invocation'
 *
 * const engineCall = createToolCall(state, 'calculator', { expression: '2+2' })
 * const invocation = toToolInvocation(engineCall.call)
 *
 * const message: AssistantMessage = {
 *   id: 'msg_123',
 *   role: 'assistant',
 *   content: 'Let me calculate that...',
 *   toolInvocations: [invocation]
 * }
 * ```
 */
export function toToolInvocation(
  call: ToolsEngineCall
): import('../types/tool-invocation').ToolInvocation {
  // Map ToolsEngineCall status to ToolInvocation state
  if (call.status === 'completed' && call.result !== undefined) {
    return {
      toolCallId: call.id,
      toolName: call.name,
      state: 'result',
      args: call.parameters,
      result: call.result,
      executionStartedAt: call.startTime,
      executionCompletedAt: call.endTime,
      duration:
        call.startTime && call.endTime
          ? call.endTime - call.startTime
          : undefined,
    }
  }

  if (call.status === 'failed' || call.status === 'timeout') {
    return {
      toolCallId: call.id,
      toolName: call.name,
      state: 'error',
      args: call.parameters,
      error: call.error ?? 'Unknown error',
      errorCode: call.status === 'timeout' ? 'timeout' : 'execution',
      executionStartedAt: call.startTime,
      errorTimestamp: call.endTime,
    }
  }

  if (call.status === 'executing') {
    return {
      toolCallId: call.id,
      toolName: call.name,
      state: 'executing',
      args: call.parameters,
      executionStartedAt: call.startTime,
    }
  }

  // pending or approved
  return {
    toolCallId: call.id,
    toolName: call.name,
    state: 'call',
    args: call.parameters,
  }
}
