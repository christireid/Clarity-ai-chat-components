'use client'

/**
 * Clarity Chat - Tools Engine
 *
 * A production-ready tool execution engine with:
 * - Type-safe tool registry
 * - Automatic parameter validation
 * - Timeout handling
 * - Result caching
 * - Auto-approval for safe tools
 */

import type { ToolsConfig, ToolDefinition, ToolAuditLog } from './types'

// =============================================================================
// Types
// =============================================================================

export interface ToolCall {
  id: string
  name: string
  parameters: Record<string, unknown>
  status:
    | 'pending'
    | 'approved'
    | 'executing'
    | 'completed'
    | 'failed'
    | 'timeout'
  result?: unknown
  error?: string
  startTime?: number
  endTime?: number
}

export interface ToolExecutionResult {
  success: boolean
  result?: unknown
  error?: string
  executionTimeMs: number
}

export interface ToolsEngineState {
  registry: Map<string, ToolDefinition>
  pendingCalls: ToolCall[]
  completedCalls: ToolCall[]
  autoApprove: boolean
  timeoutMs: number
  cache: Map<string, { result: unknown; timestamp: number }>
  cacheTtlMs: number
  // NEW: Approval system fields
  approvalMode?: 'auto' | 'manual' | 'allowlist' | 'blocklist'
  allowedTools?: string[]
  blockedTools?: string[]
  autoApproveRiskLevels?: Array<'safe' | 'low' | 'medium' | 'high'>
  approvalHandler?: (call: ToolCall) => Promise<boolean>
  auditLog: ToolAuditLog[]
}

// =============================================================================
// Built-in Safe Tools
// =============================================================================

const BUILT_IN_TOOLS: ToolDefinition[] = [
  {
    name: 'get_current_time',
    description: 'Get the current date and time',
    deterministic: false, // Time changes on each call
    riskLevel: 'safe',
    capabilities: [],
    requiresApproval: false,
    parameters: {
      type: 'object',
      properties: {
        timezone: {
          type: 'string',
          description: 'Timezone (e.g., "America/New_York")',
        },
      },
    },
    execute: async (params, signal) => {
      // Check if aborted before execution
      if (signal?.aborted) {
        throw new Error('Operation aborted')
      }

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
    riskLevel: 'safe',
    capabilities: [],
    requiresApproval: false,
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
    execute: async (params, signal) => {
      // Check if aborted before execution
      if (signal?.aborted) {
        throw new Error('Operation aborted')
      }

      const { expression } = params as { expression: string }
      // Simple safe expression evaluation
      const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '')
      if (!sanitized) {
        throw new Error('Invalid expression')
      }
      // Use Function instead of eval for slightly better isolation
      const result = new Function(`return (${sanitized})`)()
      return { expression: sanitized, result }
    },
  },
  {
    name: 'generate_uuid',
    description: 'Generate a unique identifier',
    deterministic: false, // Generates random/unique IDs each call
    riskLevel: 'safe',
    capabilities: [],
    requiresApproval: false,
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
    execute: async (params, signal) => {
      // Check if aborted before execution
      if (signal?.aborted) {
        throw new Error('Operation aborted')
      }

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
    riskLevel: 'safe',
    capabilities: [],
    requiresApproval: false,
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
    execute: async (params, signal) => {
      // Check if aborted before execution
      if (signal?.aborted) {
        throw new Error('Operation aborted')
      }

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
  type?: string | string[]
  properties?: Record<string, JsonSchema>
  required?: string[]
  enum?: unknown[]
  items?: JsonSchema
  minItems?: number
  maxItems?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  minimum?: number
  maximum?: number
  multipleOf?: number
  format?: string
}

/**
 * Validate a value against a JSON Schema type
 */
function validateType(value: unknown, expectedType: string): boolean {
  switch (expectedType) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value)
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'array':
      return Array.isArray(value)
    case 'object':
      return (
        typeof value === 'object' && value !== null && !Array.isArray(value)
      )
    case 'null':
      return value === null
    default:
      return true
  }
}

/**
 * Validate string format constraints
 */
function validateFormat(value: string, format: string): boolean {
  switch (format) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    case 'url':
    case 'uri':
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    case 'date':
      return !Number.isNaN(Date.parse(value))
    case 'uuid':
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
      )
    default:
      return true
  }
}

/**
 * Validate a single value against a JSON Schema
 */
function validateValue(
  value: unknown,
  schema: JsonSchema,
  path: string = 'root'
): string[] {
  const errors: string[] = []

  // Type validation
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type]
    const isValid = types.some((type) => validateType(value, type))
    if (!isValid) {
      errors.push(`${path} must be of type: ${types.join(' or ')}`)
      return errors // Stop further validation if type is wrong
    }
  }

  // Enum validation
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path} must be one of: ${schema.enum.join(', ')}`)
  }

  // String validations
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${path} must be at least ${schema.minLength} characters`)
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(`${path} must be at most ${schema.maxLength} characters`)
    }
    if (schema.pattern) {
      try {
        const regex = new RegExp(schema.pattern)
        if (!regex.test(value)) {
          errors.push(`${path} must match pattern: ${schema.pattern}`)
        }
      } catch {
        errors.push(`Invalid regex pattern in schema: ${schema.pattern}`)
      }
    }
    if (schema.format && !validateFormat(value, schema.format)) {
      errors.push(`${path} must be a valid ${schema.format}`)
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${path} must be >= ${schema.minimum}`)
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${path} must be <= ${schema.maximum}`)
    }
    if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0) {
      errors.push(`${path} must be a multiple of ${schema.multipleOf}`)
    }
  }

  // Array validations
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${path} must have at least ${schema.minItems} items`)
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${path} must have at most ${schema.maxItems} items`)
    }
    if (schema.items) {
      value.forEach((item, index) => {
        errors.push(...validateValue(item, schema.items!, `${path}[${index}]`))
      })
    }
  }

  // Object validations
  if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    schema.properties
  ) {
    const obj = value as Record<string, unknown>
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in obj) {
        errors.push(...validateValue(obj[key], propSchema, `${path}.${key}`))
      }
    }
  }

  return errors
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

  // Validate each property
  for (const [key, value] of Object.entries(params)) {
    const propSchema = properties[key] as JsonSchema | undefined
    if (!propSchema) continue

    // Use comprehensive validation
    errors.push(...validateValue(value, propSchema, key))
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

  return {
    registry,
    pendingCalls: [],
    completedCalls: [],
    autoApprove: config.autoApprove ?? true,
    timeoutMs: config.timeoutMs || 30000,
    cache: new Map(),
    cacheTtlMs: 60000, // 1 minute cache
    // NEW: Approval system configuration
    approvalMode: config.approvalMode,
    allowedTools: config.allowedTools,
    blockedTools: config.blockedTools,
    autoApproveRiskLevels: config.autoApproveRiskLevels,
    approvalHandler: config.approvalHandler,
    auditLog: [],
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

// =============================================================================
// Approval Logic & Audit Logging
// =============================================================================

/**
 * Sanitize parameters for logging (remove sensitive data)
 */
function sanitizeParameters(
  params: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}
  const sensitiveKeywords = [
    'password',
    'apikey',
    'api_key',
    'secret',
    'token',
    'auth',
    'key',
  ]

  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase()
    // Check if key contains any sensitive keyword
    const isSensitive = sensitiveKeywords.some((keyword) =>
      lowerKey.includes(keyword)
    )

    if (isSensitive) {
      sanitized[key] = '***REDACTED***'
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      sanitized[key] = sanitizeParameters(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Create an audit log entry
 */
function createAuditLog(
  toolName: string,
  callId: string,
  tool: ToolDefinition,
  parameters: Record<string, unknown>,
  approved: boolean,
  approvedBy: 'user' | 'auto' | 'allowlist',
  executionStatus: 'success' | 'failure' | 'timeout' | 'denied',
  executionTimeMs?: number,
  error?: string
): ToolAuditLog {
  return {
    timestamp: Date.now(),
    toolName,
    callId,
    riskLevel: tool.riskLevel || 'safe',
    capabilities: tool.capabilities || [],
    parameters: sanitizeParameters(parameters),
    approved,
    approvedBy: approved ? approvedBy : undefined,
    executionStatus,
    executionTimeMs,
    error,
  }
}

/**
 * Determine if a tool call requires user approval based on configuration
 */
function shouldRequireApproval(
  state: ToolsEngineState,
  tool: ToolDefinition
): boolean {
  // Check if tool is explicitly blocked
  if (state.blockedTools?.includes(tool.name)) {
    return true // Blocked tools always require approval (which will deny them)
  }

  // Check approval mode
  switch (state.approvalMode) {
    case 'auto':
      // Auto mode: never require approval (approve everything)
      return false

    case 'allowlist':
      // Allowlist mode: require approval unless in allowed list
      return !state.allowedTools?.includes(tool.name)

    case 'blocklist':
      // Blocklist mode: require approval only if in blocked list
      return state.blockedTools?.includes(tool.name) ?? false

    case 'manual':
    default:
      // Manual mode (default): check tool properties and risk level

      // If tool explicitly requires approval, honor that
      if (tool.requiresApproval === true) {
        return true
      }
      if (tool.requiresApproval === false) {
        return false
      }

      const riskLevel = tool.riskLevel || 'safe'

      // If autoApproveRiskLevels is configured, ONLY use that for approval decisions
      if (
        state.autoApproveRiskLevels &&
        state.autoApproveRiskLevels.length > 0
      ) {
        return !state.autoApproveRiskLevels.includes(riskLevel)
      }

      // Fall back to legacy autoApprove flag
      if (state.autoApprove) {
        return false
      }

      // Default: require approval for medium/high risk tools
      return riskLevel === 'medium' || riskLevel === 'high'
  }
}

/**
 * Create a tool call (request execution)
 */
export function createToolCall(
  state: ToolsEngineState,
  name: string,
  parameters: Record<string, unknown>
): { state: ToolsEngineState; call: ToolCall } {
  const tool = state.registry.get(name)

  if (!tool) {
    const call: ToolCall = {
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
    const call: ToolCall = {
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

  // Determine if approval is required using new approval system
  const requiresApproval = shouldRequireApproval(state, tool)

  const call: ToolCall = {
    id: `call_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name,
    parameters,
    status: requiresApproval ? 'pending' : 'approved',
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

  const rejectedCall: ToolCall = {
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
    // Audit log for denied execution
    if (call) {
      const tool = state.registry.get(call.name)
      if (tool) {
        const auditEntry = createAuditLog(
          call.name,
          call.id,
          tool,
          call.parameters,
          false,
          'auto',
          'denied'
        )
        return {
          state: {
            ...state,
            auditLog: [...(state.auditLog || []), auditEntry],
          },
          result: {
            success: false,
            error: 'Call not found or not approved',
            executionTimeMs: 0,
          },
        }
      }
    }
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

  // Check cache (skip for non-deterministic tools)
  const isDeterministic = tool.deterministic !== false // Default to true if not specified
  if (isDeterministic) {
    const cacheKey = generateCacheKey(call.name, call.parameters)
    const cached = state.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < state.cacheTtlMs) {
      const completedCall: ToolCall = {
        ...call,
        status: 'completed',
        result: cached.result,
        startTime: Date.now(),
        endTime: Date.now(),
      }

      // Audit log for cached execution
      const auditEntry = createAuditLog(
        call.name,
        call.id,
        tool,
        call.parameters,
        true,
        'auto',
        'success',
        0
      )

      return {
        state: {
          ...state,
          pendingCalls: state.pendingCalls.filter((c) => c.id !== callId),
          completedCalls: [...state.completedCalls, completedCall],
          auditLog: [...(state.auditLog || []), auditEntry],
        },
        result: {
          success: true,
          result: cached.result,
          executionTimeMs: 0,
        },
      }
    }
  }

  // Execute with timeout and proper cleanup via AbortController
  const startTime = Date.now()

  // Update call status to executing
  const executingState = {
    ...state,
    pendingCalls: state.pendingCalls.map((c) =>
      c.id === callId ? { ...c, status: 'executing' as const, startTime } : c
    ),
  }

  // Create AbortController for proper cancellation (scoped outside try for cleanup)
  const abortController = new AbortController()
  const { signal } = abortController

  // Set up timeout that aborts the signal
  const timeoutId = setTimeout(() => {
    abortController.abort()
  }, state.timeoutMs)

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      signal.addEventListener('abort', () => {
        reject(new Error('Execution timeout'))
      })
    })

    const result = await Promise.race([
      tool.execute(call.parameters, signal),
      timeoutPromise,
    ])

    // Clear timeout on successful completion
    clearTimeout(timeoutId)

    const endTime = Date.now()
    const executionTimeMs = endTime - startTime

    // Cache the result (only for deterministic tools)
    let newCache = state.cache
    if (isDeterministic) {
      newCache = new Map(state.cache)
      const cacheKey = generateCacheKey(call.name, call.parameters)
      newCache.set(cacheKey, { result, timestamp: Date.now() })
    }

    const completedCall: ToolCall = {
      ...call,
      status: 'completed',
      result,
      startTime,
      endTime,
    }

    // Audit log for successful execution
    const auditEntry = createAuditLog(
      call.name,
      call.id,
      tool,
      call.parameters,
      true,
      'auto', // TODO: Track actual approval source
      'success',
      executionTimeMs
    )

    return {
      state: {
        ...executingState,
        pendingCalls: executingState.pendingCalls.filter(
          (c) => c.id !== callId
        ),
        completedCalls: [...executingState.completedCalls, completedCall],
        cache: newCache,
        auditLog: [...(executingState.auditLog || []), auditEntry],
      },
      result: {
        success: true,
        result,
        executionTimeMs,
      },
    }
  } catch (err) {
    // Clear timeout on error/timeout
    clearTimeout(timeoutId)

    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    const errorMessage = err instanceof Error ? err.message : String(err)
    const isTimeout = errorMessage === 'Execution timeout'

    const failedCall: ToolCall = {
      ...call,
      status: isTimeout ? 'timeout' : 'failed',
      error: errorMessage,
      startTime,
      endTime,
    }

    // Audit log for failed/timeout execution
    const auditEntry = createAuditLog(
      call.name,
      call.id,
      tool,
      call.parameters,
      true,
      'auto', // TODO: Track actual approval source
      isTimeout ? 'timeout' : 'failure',
      executionTimeMs,
      errorMessage
    )

    return {
      state: {
        ...executingState,
        pendingCalls: executingState.pendingCalls.filter(
          (c) => c.id !== callId
        ),
        completedCalls: [...executingState.completedCalls, failedCall],
        auditLog: [...(executingState.auditLog || []), auditEntry],
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
