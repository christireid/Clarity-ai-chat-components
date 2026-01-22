/**
 * Agent Orchestration Types
 *
 * Framework for building agentic AI systems with tool calling, planning,
 * and multi-step execution.
 *
 * NOTE: Tool definition types have been moved to '../types/tool-definition'
 * These types are kept for backward compatibility but are deprecated.
 */

// Re-export canonical types without confusing aliases
export type {
  ToolDefinition,
  ToolParameters,
  ToolArguments,
  ToolResult,
  ToolParameterProperty,
  ToolExecutionContext,
  ToolLifecycleHooks,
  IToolRegistry,
} from '../types/tool-definition'

/**
 * @deprecated Use ToolDefinition from '../types/tool-definition' instead
 *
 * This simplified Tool interface is missing critical fields like:
 * - displayName, cacheable, cacheTtl, timeout, parallelizable
 * - hooks (lifecycle callbacks)
 * - execute function doesn't receive ToolExecutionContext
 *
 * Migrate to ToolDefinition for full feature support and security.
 */
export interface LegacyToolParameterProperty {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'
  description?: string
  enum?: (string | number | boolean)[]
  default?: unknown
  items?: LegacyToolParameterProperty
  properties?: Record<string, LegacyToolParameterProperty>
  required?: string[]
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
}

/** JSON Schema for tool parameters */
export interface LegacyToolParameters {
  type: 'object'
  properties: Record<string, LegacyToolParameterProperty>
  required?: string[]
  additionalProperties?: boolean
}

/** Arguments passed to tool execution */
export type LegacyToolArguments = Record<
  string,
  string | number | boolean | string[] | number[] | Record<string, unknown>
>

/** Result from tool execution */
export type LegacyToolResult =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[]
  | null
  | undefined

export interface Tool {
  /** Tool name */
  name: string
  /** Tool description for AI */
  description: string
  /** Input schema (JSON Schema) */
  parameters: LegacyToolParameters
  /** Tool execution function */
  execute: (args: LegacyToolArguments) => Promise<LegacyToolResult>
  /** Whether tool requires approval */
  requiresApproval?: boolean
  /** Tool category */
  category?: string
  /** Tags for discovery */
  tags?: string[]
}

export interface AgentConfig {
  /** Agent name */
  name: string
  /** Agent description/role */
  description: string
  /** System prompt */
  systemPrompt?: string
  /** Available tools */
  tools?: Tool[]
  /** Model to use */
  model?: string
  /** Max iterations for multi-step tasks */
  maxIterations?: number
  /** Temperature for LLM */
  temperature?: number
  /** Whether to automatically execute approved tools */
  autoExecute?: boolean
  /** Memory/context configuration */
  memory?: {
    type: 'buffer' | 'summary' | 'vectorstore'
    maxMessages?: number
    summaryModel?: string
  }
  /** Planning strategy */
  planningStrategy?: 'react' | 'plan-and-execute' | 'tree-of-thought'
}

/** Metadata attached to agent messages */
export type AgentMessageMetadata = Record<
  string,
  string | number | boolean | null
>

export interface AgentMessage {
  /** Message role */
  role: 'system' | 'user' | 'assistant' | 'function'
  /** Message content */
  content: string
  /** Function call (if any) */
  functionCall?: {
    name: string
    arguments: string
  }
  /** Function result (if role is 'function') */
  functionResult?: LegacyToolResult
  /** Tool calls (for parallel function calling) */
  toolCalls?: Array<{
    id: string
    type: 'function'
    function: {
      name: string
      arguments: string
    }
  }>
  /** Metadata */
  metadata?: AgentMessageMetadata
}

export interface AgentStep {
  /** Step number */
  step: number
  /** Step type */
  type: 'thought' | 'action' | 'observation' | 'answer'
  /** Step content */
  content: string
  /** Tool used (if action) */
  tool?: string
  /** Tool arguments (if action) */
  args?: LegacyToolArguments
  /** Tool result (if observation) */
  result?: LegacyToolResult
  /** Error (if failed) */
  error?: string
  /** Timestamp */
  timestamp: number
}

export interface AgentExecution {
  /** Execution ID */
  id: string
  /** Agent name */
  agent: string
  /** User query */
  query: string
  /** Execution steps */
  steps: AgentStep[]
  /** Final answer */
  answer?: string
  /** Status */
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  /** Start time */
  startTime: number
  /** End time */
  endTime?: number
  /** Total tokens used */
  tokensUsed?: number
  /** Cost */
  cost?: number
  /** Error message */
  error?: string
}

export interface AgentPlan {
  /** Plan ID */
  id: string
  /** High-level goal */
  goal: string
  /** Planned steps */
  steps: Array<{
    description: string
    tool?: string
    completed: boolean
  }>
  /** Current step index */
  currentStep: number
  /** Status */
  status: 'planning' | 'executing' | 'completed' | 'failed'
}

export interface Agent {
  /** Agent name */
  name: string
  /** Agent description */
  description: string
  /** Available tools */
  tools: Tool[]

  /**
   * Execute a query
   */
  execute(query: string, context?: AgentMessage[]): Promise<AgentExecution>

  /**
   * Execute a single step
   */
  step(execution: AgentExecution): Promise<AgentStep>

  /**
   * Add a tool
   */
  addTool(tool: Tool): void

  /**
   * Remove a tool
   */
  removeTool(toolName: string): void

  /**
   * Get tool by name
   */
  getTool(name: string): Tool | undefined

  /**
   * Create a plan for a query
   */
  plan?(query: string): Promise<AgentPlan>
}

export interface AgentMemory {
  /**
   * Add message to memory
   */
  addMessage(message: AgentMessage): void

  /**
   * Get recent messages
   */
  getMessages(limit?: number): AgentMessage[]

  /**
   * Clear memory
   */
  clear(): void

  /**
   * Summarize memory if needed
   */
  summarize?(): Promise<string>
}

export interface ToolApprovalCallback {
  (tool: Tool, args: LegacyToolArguments): Promise<boolean>
}

export interface AgentCallbacks {
  /** Called when agent starts thinking */
  onThought?: (thought: string) => void
  /** Called when agent decides on an action */
  onAction?: (tool: string, args: LegacyToolArguments) => void
  /** Called when tool execution completes */
  onObservation?: (result: LegacyToolResult) => void
  /** Called when agent provides final answer */
  onAnswer?: (answer: string) => void
  /** Called on error */
  onError?: (error: Error) => void
  /** Called for tool approval (if required) */
  onToolApproval?: ToolApprovalCallback
}
