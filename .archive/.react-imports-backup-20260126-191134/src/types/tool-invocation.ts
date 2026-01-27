/**
 * Tool Invocation Message Format
 *
 * Canonical format for representing tool calls and results in conversation messages.
 * This is the single source of truth for how tools are represented in message history.
 *
 * **Design Principles**:
 * - Self-contained: Tool call and result in same structure
 * - Clear state machine: Explicit state transitions
 * - Streaming-friendly: Supports partial/progressive updates
 * - UI-ready: All data needed for rendering
 * - Debuggable: Rich metadata for inspection
 *
 * @module types/tool-invocation
 */

// =============================================================================
// Tool Invocation State Machine
// =============================================================================

/**
 * Tool invocation state
 *
 * **State Transitions**:
 * ```
 * call → executing → result
 *                  └→ error
 *
 * partial-call → call (during streaming)
 * ```
 *
 * **States**:
 * - `partial-call`: Tool call is being streamed (partial arguments)
 * - `call`: Complete tool call received, awaiting execution
 * - `executing`: Tool is currently executing
 * - `result`: Tool completed successfully
 * - `error`: Tool execution failed
 */
export type ToolInvocationState =
  | 'partial-call' // Streaming: incomplete tool call
  | 'call' // Complete tool call, not yet executed
  | 'executing' // Currently executing
  | 'result' // Successfully completed
  | 'error' // Execution failed

// =============================================================================
// Tool Invocation
// =============================================================================

/**
 * Tool invocation metadata
 * Common fields across all states
 */
interface ToolInvocationBase {
  /** Unique identifier for this tool call */
  toolCallId: string

  /** Name of the tool being called */
  toolName: string

  /** Current state of the invocation */
  state: ToolInvocationState

  /** Timestamp when invocation was created (ms since epoch) */
  timestamp?: number
}

/**
 * Partial tool call (streaming in progress)
 */
export interface PartialToolCall extends ToolInvocationBase {
  state: 'partial-call'

  /** Partial arguments (may be incomplete JSON) */
  args?: Partial<Record<string, unknown>>

  /** Raw partial arguments string (for debugging) */
  rawArgs?: string
}

/**
 * Complete tool call (ready for execution)
 */
export interface CompleteToolCall extends ToolInvocationBase {
  state: 'call'

  /** Complete, validated arguments */
  args: Record<string, unknown>
}

/**
 * Executing tool call
 */
export interface ExecutingToolCall extends ToolInvocationBase {
  state: 'executing'

  /** Arguments being executed */
  args: Record<string, unknown>

  /** Timestamp when execution started */
  executionStartedAt?: number

  /** Progress (0-100) for long-running tools */
  progress?: number

  /** Status message (e.g., "Fetching data...") */
  statusMessage?: string
}

/**
 * Successful tool result
 */
export interface ToolCallResult extends ToolInvocationBase {
  state: 'result'

  /** Arguments that were executed */
  args: Record<string, unknown>

  /** Tool execution result */
  result: unknown

  /** Timestamp when execution started */
  executionStartedAt?: number

  /** Timestamp when execution completed */
  executionCompletedAt?: number

  /** Execution duration in milliseconds */
  duration?: number

  /** Whether result came from cache */
  cached?: boolean
}

/**
 * Failed tool call
 */
export interface ToolCallError extends ToolInvocationBase {
  state: 'error'

  /** Arguments that were attempted */
  args?: Record<string, unknown>

  /** Error message */
  error: string

  /** Error code for programmatic handling */
  errorCode?:
    | 'validation'
    | 'timeout'
    | 'execution'
    | 'rejected'
    | 'cancelled'
    | 'unknown'

  /** Detailed error information (for debugging) */
  errorDetails?: unknown

  /** Timestamp when execution started (if it started) */
  executionStartedAt?: number

  /** Timestamp when error occurred */
  errorTimestamp?: number

  /** Whether this error is retryable */
  retryable?: boolean
}

/**
 * Tool invocation (discriminated union)
 *
 * Use this type to handle any tool invocation state.
 * TypeScript will narrow the type based on the `state` field.
 *
 * @example
 * ```typescript
 * function handleToolInvocation(invocation: ToolInvocation) {
 *   switch (invocation.state) {
 *     case 'call':
 *       // TypeScript knows: invocation.args is Record<string, unknown>
 *       executeTool(invocation.toolName, invocation.args)
 *       break
 *     case 'result':
 *       // TypeScript knows: invocation.result exists
 *       displayResult(invocation.result)
 *       break
 *     case 'error':
 *       // TypeScript knows: invocation.error exists
 *       displayError(invocation.error)
 *       break
 *   }
 * }
 * ```
 */
export type ToolInvocation =
  | PartialToolCall
  | CompleteToolCall
  | ExecutingToolCall
  | ToolCallResult
  | ToolCallError

// =============================================================================
// Message Types with Tool Invocations
// =============================================================================

/**
 * Base message interface
 * Compatible with Vercel AI SDK and other chat frameworks
 */
export interface BaseMessage {
  /** Message ID */
  id: string

  /** Message role */
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'

  /** Message content */
  content: string

  /** Creation timestamp */
  createdAt?: Date

  /** Additional metadata */
  metadata?: Record<string, unknown>
}

/**
 * User message
 */
export interface UserMessage extends BaseMessage {
  role: 'user'
}

/**
 * System message
 */
export interface SystemMessage extends BaseMessage {
  role: 'system'
}

/**
 * Assistant message with optional tool invocations
 *
 * This is the canonical format for assistant messages that may include tool calls.
 *
 * @example
 * ```typescript
 * const message: AssistantMessage = {
 *   id: 'msg_123',
 *   role: 'assistant',
 *   content: 'Let me check the weather for you.',
 *   toolInvocations: [{
 *     toolCallId: 'call_456',
 *     toolName: 'get_weather',
 *     state: 'result',
 *     args: { location: 'San Francisco, CA' },
 *     result: { temp: 72, condition: 'sunny' },
 *     duration: 234
 *   }]
 * }
 * ```
 */
export interface AssistantMessage extends BaseMessage {
  role: 'assistant'

  /** Tool invocations in this message */
  toolInvocations?: ToolInvocation[]
}

/**
 * Function/tool message (legacy OpenAI format)
 *
 * @deprecated Use AssistantMessage with toolInvocations instead
 */
export interface FunctionMessage extends BaseMessage {
  role: 'function' | 'tool'

  /** Function/tool name */
  name: string

  /** Function call ID (for OpenAI format) */
  toolCallId?: string
}

/**
 * Chat message (discriminated union)
 */
export type ChatMessage =
  | UserMessage
  | AssistantMessage
  | SystemMessage
  | FunctionMessage

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Check if message is an assistant message
 */
export function isAssistantMessage(
  message: ChatMessage
): message is AssistantMessage {
  return message.role === 'assistant'
}

/**
 * Check if message has tool invocations
 */
export function hasToolInvocations(
  message: ChatMessage
): message is AssistantMessage {
  return (
    isAssistantMessage(message) &&
    Array.isArray(message.toolInvocations) &&
    message.toolInvocations.length > 0
  )
}

/**
 * Check if tool invocation is in a specific state
 */
export function isToolInvocationState<S extends ToolInvocationState>(
  invocation: ToolInvocation,
  state: S
): invocation is Extract<ToolInvocation, { state: S }> {
  return invocation.state === state
}

/**
 * Check if tool invocation is complete (has result or error)
 */
export function isToolInvocationComplete(
  invocation: ToolInvocation
): invocation is ToolCallResult | ToolCallError {
  return invocation.state === 'result' || invocation.state === 'error'
}

/**
 * Check if tool invocation is pending (call or executing)
 */
export function isToolInvocationPending(
  invocation: ToolInvocation
): invocation is CompleteToolCall | ExecutingToolCall {
  return invocation.state === 'call' || invocation.state === 'executing'
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get all tool invocations from a message
 */
export function getToolInvocations(message: ChatMessage): ToolInvocation[] {
  if (!hasToolInvocations(message)) {
    return []
  }
  return message.toolInvocations ?? []
}

/**
 * Get tool invocations by state
 */
export function getToolInvocationsByState<S extends ToolInvocationState>(
  message: ChatMessage,
  state: S
): Extract<ToolInvocation, { state: S }>[] {
  return getToolInvocations(message).filter(
    (inv): inv is Extract<ToolInvocation, { state: S }> => inv.state === state
  )
}

/**
 * Get pending tool invocations (call or executing)
 */
export function getPendingToolInvocations(
  message: ChatMessage
): (CompleteToolCall | ExecutingToolCall)[] {
  return getToolInvocations(message).filter(isToolInvocationPending)
}

/**
 * Get completed tool invocations (result or error)
 */
export function getCompletedToolInvocations(
  message: ChatMessage
): (ToolCallResult | ToolCallError)[] {
  return getToolInvocations(message).filter(isToolInvocationComplete)
}

/**
 * Find tool invocation by ID
 */
export function findToolInvocation(
  message: ChatMessage,
  toolCallId: string
): ToolInvocation | undefined {
  return getToolInvocations(message).find(
    (inv) => inv.toolCallId === toolCallId
  )
}

/**
 * Count tool invocations by state
 */
export function countToolInvocationsByState(
  message: ChatMessage
): Record<ToolInvocationState, number> {
  const invocations = getToolInvocations(message)
  return {
    'partial-call': invocations.filter((inv) => inv.state === 'partial-call')
      .length,
    call: invocations.filter((inv) => inv.state === 'call').length,
    executing: invocations.filter((inv) => inv.state === 'executing').length,
    result: invocations.filter((inv) => inv.state === 'result').length,
    error: invocations.filter((inv) => inv.state === 'error').length,
  }
}

// =============================================================================
// State Transition Helpers
// =============================================================================

/**
 * Create a tool call from partial call
 */
export function completeToolCall(
  partial: PartialToolCall,
  args: Record<string, unknown>
): CompleteToolCall {
  return {
    toolCallId: partial.toolCallId,
    toolName: partial.toolName,
    state: 'call',
    args,
    timestamp: partial.timestamp,
  }
}

/**
 * Mark tool call as executing
 */
export function markToolExecuting(
  call: CompleteToolCall,
  options?: { progress?: number; statusMessage?: string }
): ExecutingToolCall {
  return {
    toolCallId: call.toolCallId,
    toolName: call.toolName,
    state: 'executing',
    args: call.args,
    timestamp: call.timestamp,
    executionStartedAt: Date.now(),
    progress: options?.progress,
    statusMessage: options?.statusMessage,
  }
}

/**
 * Complete tool call with result
 */
export function completeToolWithResult(
  executing: ExecutingToolCall,
  result: unknown,
  options?: { cached?: boolean }
): ToolCallResult {
  const completedAt = Date.now()
  return {
    toolCallId: executing.toolCallId,
    toolName: executing.toolName,
    state: 'result',
    args: executing.args,
    result,
    timestamp: executing.timestamp,
    executionStartedAt: executing.executionStartedAt,
    executionCompletedAt: completedAt,
    duration: executing.executionStartedAt
      ? completedAt - executing.executionStartedAt
      : undefined,
    cached: options?.cached,
  }
}

/**
 * Fail tool call with error
 */
export function failToolWithError(
  invocation: CompleteToolCall | ExecutingToolCall,
  error: string,
  options?: {
    errorCode?: ToolCallError['errorCode']
    errorDetails?: unknown
    retryable?: boolean
  }
): ToolCallError {
  return {
    toolCallId: invocation.toolCallId,
    toolName: invocation.toolName,
    state: 'error',
    args: invocation.args,
    error,
    errorCode: options?.errorCode,
    errorDetails: options?.errorDetails,
    timestamp: invocation.timestamp,
    executionStartedAt:
      'executionStartedAt' in invocation
        ? invocation.executionStartedAt
        : undefined,
    errorTimestamp: Date.now(),
    retryable: options?.retryable ?? false,
  }
}

// =============================================================================
// Validation
// =============================================================================

/**
 * Validate tool invocation structure
 */
export function validateToolInvocation(
  obj: unknown
): asserts obj is ToolInvocation {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Tool invocation must be an object')
  }

  const inv = obj as Partial<ToolInvocation>

  if (typeof inv.toolCallId !== 'string' || inv.toolCallId.length === 0) {
    throw new Error('Tool invocation must have a non-empty toolCallId')
  }

  if (typeof inv.toolName !== 'string' || inv.toolName.length === 0) {
    throw new Error('Tool invocation must have a non-empty toolName')
  }

  const validStates: ToolInvocationState[] = [
    'partial-call',
    'call',
    'executing',
    'result',
    'error',
  ]
  if (!validStates.includes(inv.state as ToolInvocationState)) {
    throw new Error(`Invalid tool invocation state: ${inv.state}`)
  }

  // State-specific validation
  if (inv.state === 'result' && inv.result === undefined) {
    throw new Error('Tool invocation in "result" state must have a result')
  }

  if (inv.state === 'error' && typeof inv.error !== 'string') {
    throw new Error(
      'Tool invocation in "error" state must have an error message'
    )
  }
}

// =============================================================================
// Exports (already exported inline above)
// =============================================================================
// All exports are handled inline throughout the file
