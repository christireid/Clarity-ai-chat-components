'use client'

/**
 * useTool Hook and Tool Types
 *
 * Define tools that AI can call from the browser - DOM manipulation,
 * authenticated fetches, accessing React state, or any browser-side function.
 *
 * Tools are registered with schemas and the AI can intelligently call them
 * based on user requests.
 *
 * Features:
 * - Zod schema validation for inputs/outputs
 * - Async tool execution
 * - Error handling and retries
 * - Tool call history tracking
 * - Permission/confirmation support
 * - Type-safe tool definitions
 *
 * @example
 * ```tsx
 * const weatherTool = defineTool({
 *   name: 'getWeather',
 *   description: 'Fetches weather for a location',
 *   inputSchema: z.object({ location: z.string() }),
 *   outputSchema: z.object({
 *     temperature: z.number(),
 *     condition: z.string(),
 *   }),
 *   execute: async ({ location }) => {
 *     const res = await fetch(`/api/weather?q=${location}`)
 *     return res.json()
 *   },
 * })
 *
 * // In provider
 * <ToolProvider tools={[weatherTool]}>
 *   <App />
 * </ToolProvider>
 * ```
 */

import * as React from 'react'
import { z } from 'zod'

// ============================================================================
// Types
// ============================================================================

/** Tool execution status */
export type ToolStatus = 'idle' | 'pending' | 'success' | 'error'

/** Tool definition */
export interface Tool<TInput = unknown, TOutput = unknown> {
  /** Unique tool name */
  name: string
  /** Description for AI understanding */
  description: string
  /** Zod schema for input validation */
  inputSchema: z.ZodType<TInput>
  /** Zod schema for output validation */
  outputSchema: z.ZodType<TOutput>
  /** The tool function */
  execute: (input: TInput) => Promise<TOutput>
  /** Optional category */
  category?: string
  /** Optional tags for search */
  tags?: string[]
  /** Whether tool requires user confirmation */
  requiresConfirmation?: boolean
  /** Whether tool requires authentication */
  requiresAuth?: boolean
  /** Required permissions */
  permissions?: string[]
  /** Timeout in ms */
  timeout?: number
  /** Maximum retries on failure */
  maxRetries?: number
  /** Examples for AI context */
  examples?: Array<{
    description: string
    input: TInput
    output: TOutput
  }>
}

/** Tool call record */
export interface ToolCall<TInput = unknown, TOutput = unknown> {
  /** Unique call ID */
  id: string
  /** Tool name */
  toolName: string
  /** Input provided */
  input: TInput
  /** Output received */
  output?: TOutput
  /** Error if failed */
  error?: Error
  /** Call status */
  status: ToolStatus
  /** Start timestamp */
  startedAt: number
  /** End timestamp */
  completedAt?: number
  /** Duration in ms */
  duration?: number
  /** Retry count */
  retryCount: number
}

/** Tool registry */
export interface ToolRegistry {
  /** Get all registered tools */
  getTools: () => Tool[]
  /** Get a tool by name */
  getTool: (name: string) => Tool | undefined
  /** Check if tool exists */
  hasTool: (name: string) => boolean
  /** Execute a tool */
  executeTool: <TInput, TOutput>(
    name: string,
    input: TInput
  ) => Promise<{ success: boolean; output?: TOutput; error?: Error }>
  /** Search tools */
  searchTools: (query: string) => Tool[]
  /** Get tools by category */
  getToolsByCategory: (category: string) => Tool[]
  /** Export as JSON schema for AI */
  toJsonSchema: () => Record<string, unknown>
}

/** Context value for tool provider */
export interface ToolContextValue {
  registry: ToolRegistry
  /** Tool call history */
  history: ToolCall[]
  /** Currently executing tools */
  pendingCalls: ToolCall[]
  /** Clear history */
  clearHistory: () => void
  /** Subscribe to tool calls */
  onToolCall: (callback: (call: ToolCall) => void) => () => void
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

async function executeWithTimeout<T>(
  fn: () => Promise<T>,
  timeout: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Tool execution timed out after ${timeout}ms`))
    }, timeout)

    fn()
      .then((result) => {
        clearTimeout(timer)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

async function executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  timeout: number
): Promise<{ result?: T; error?: Error; retryCount: number }> {
  let lastError: Error | undefined
  let retryCount = 0

  while (retryCount <= maxRetries) {
    try {
      const result = await executeWithTimeout(fn, timeout)
      return { result, retryCount }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      retryCount++

      if (retryCount <= maxRetries) {
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retryCount) * 100))
      }
    }
  }

  return { error: lastError, retryCount: retryCount - 1 }
}

// ============================================================================
// Tool Definition Helper
// ============================================================================

/**
 * Helper to define a tool with type inference
 */
export function defineTool<TInput, TOutput>(
  config: Tool<TInput, TOutput>
): Tool<TInput, TOutput> {
  return config
}

/**
 * Create multiple tool definitions
 */
export function defineTools<T extends Tool[]>(tools: T): T {
  return tools
}

// ============================================================================
// Registry Implementation
// ============================================================================

/**
 * Create a tool registry instance
 */
export function createToolRegistry(tools: Tool[]): ToolRegistry {
  const toolMap = new Map<string, Tool>()
  tools.forEach((tool) => {
    if (toolMap.has(tool.name)) {
      console.warn(`ToolRegistry: Duplicate tool name "${tool.name}"`)
    }
    toolMap.set(tool.name, tool)
  })

  return {
    getTools: () => [...toolMap.values()],

    getTool: (name) => toolMap.get(name),

    hasTool: (name) => toolMap.has(name),

    executeTool: async <TInput, TOutput>(name: string, input: TInput) => {
      const tool = toolMap.get(name) as Tool<TInput, TOutput> | undefined
      if (!tool) {
        return { success: false, error: new Error(`Tool "${name}" not found`) }
      }

      // Validate input
      const inputResult = tool.inputSchema.safeParse(input)
      if (!inputResult.success) {
        return { success: false, error: new Error(`Invalid input: ${inputResult.error.message}`) }
      }

      try {
        const { result, error, retryCount } = await executeWithRetry(
          () => tool.execute(input),
          tool.maxRetries || 0,
          tool.timeout || 30000
        )

        if (error) {
          return { success: false, error }
        }

        // Validate output
        const outputResult = tool.outputSchema.safeParse(result)
        if (!outputResult.success) {
          return {
            success: false,
            error: new Error(`Invalid output: ${outputResult.error.message}`),
          }
        }

        return { success: true, output: result as TOutput }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }
      }
    },

    searchTools: (query) => {
      const lowerQuery = query.toLowerCase()
      return [...toolMap.values()].filter(
        (tool) =>
          tool.name.toLowerCase().includes(lowerQuery) ||
          tool.description.toLowerCase().includes(lowerQuery) ||
          tool.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
    },

    getToolsByCategory: (category) =>
      [...toolMap.values()].filter((tool) => tool.category === category),

    toJsonSchema: () => {
      const schema: Record<string, unknown> = {
        type: 'object',
        tools: [],
      }

      const toolsList = [...toolMap.values()].map((tool) => ({
        name: tool.name,
        description: tool.description,
        category: tool.category,
        tags: tool.tags,
        requiresConfirmation: tool.requiresConfirmation,
        requiresAuth: tool.requiresAuth,
        permissions: tool.permissions,
        examples: tool.examples,
        // Note: Would use zod-to-json-schema for full schema conversion
        inputDescription: 'See schema',
        outputDescription: 'See schema',
      }))

      schema.tools = toolsList
      return schema
    },
  }
}

// ============================================================================
// Context and Provider
// ============================================================================

const ToolContext = React.createContext<ToolContextValue | null>(null)

export interface ToolProviderProps {
  /** Array of tools to register */
  tools: Tool[]
  /** Children */
  children: React.ReactNode
  /** Maximum history size */
  maxHistory?: number
  /** Callback before tool execution */
  onBeforeExecute?: (call: ToolCall) => boolean | Promise<boolean>
  /** Callback after tool execution */
  onAfterExecute?: (call: ToolCall) => void
}

/**
 * Provider for tool context
 */
export function ToolProvider({
  tools,
  children,
  maxHistory = 100,
  onBeforeExecute,
  onAfterExecute,
}: ToolProviderProps) {
  const [history, setHistory] = React.useState<ToolCall[]>([])
  const [pendingCalls, setPendingCalls] = React.useState<ToolCall[]>([])
  const callbacksRef = React.useRef<Set<(call: ToolCall) => void>>(new Set())

  const registry = React.useMemo(() => createToolRegistry(tools), [tools])

  // Enhanced registry with tracking
  const trackedRegistry = React.useMemo<ToolRegistry>(() => ({
    ...registry,
    executeTool: async <TInput, TOutput>(name: string, input: TInput) => {
      const call: ToolCall<TInput, TOutput> = {
        id: generateId(),
        toolName: name,
        input,
        status: 'pending',
        startedAt: Date.now(),
        retryCount: 0,
      }

      // Check if execution should proceed
      if (onBeforeExecute) {
        const shouldProceed = await onBeforeExecute(call as ToolCall)
        if (!shouldProceed) {
          call.status = 'error'
          call.error = new Error('Execution cancelled')
          call.completedAt = Date.now()
          return { success: false, error: call.error }
        }
      }

      // Add to pending
      setPendingCalls((prev) => [...prev, call as ToolCall])

      // Execute
      const result = await registry.executeTool<TInput, TOutput>(name, input)

      // Update call record
      call.completedAt = Date.now()
      call.duration = call.completedAt - call.startedAt
      call.status = result.success ? 'success' : 'error'
      call.output = result.output
      call.error = result.error

      // Remove from pending, add to history
      setPendingCalls((prev) => prev.filter((c) => c.id !== call.id))
      setHistory((prev) => [...prev.slice(-maxHistory + 1), call as ToolCall])

      // Notify subscribers
      callbacksRef.current.forEach((cb) => cb(call as ToolCall))

      // After execute callback
      onAfterExecute?.(call as ToolCall)

      return result
    },
  }), [registry, maxHistory, onBeforeExecute, onAfterExecute])

  const value = React.useMemo<ToolContextValue>(() => ({
    registry: trackedRegistry,
    history,
    pendingCalls,
    clearHistory: () => setHistory([]),
    onToolCall: (callback) => {
      callbacksRef.current.add(callback)
      return () => {
        callbacksRef.current.delete(callback)
      }
    },
  }), [trackedRegistry, history, pendingCalls])

  return (
    <ToolContext.Provider value={value}>
      {children}
    </ToolContext.Provider>
  )
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to access tool context
 */
export function useToolContext(): ToolContextValue {
  const context = React.useContext(ToolContext)
  if (!context) {
    throw new Error('useToolContext must be used within a ToolProvider')
  }
  return context
}

/**
 * Hook to use a specific tool
 */
export function useTool<TInput, TOutput>(
  name: string
): {
  tool: Tool<TInput, TOutput> | undefined
  execute: (input: TInput) => Promise<{ success: boolean; output?: TOutput; error?: Error }>
  isLoading: boolean
  lastCall: ToolCall<TInput, TOutput> | undefined
  history: ToolCall<TInput, TOutput>[]
} {
  const { registry, history, pendingCalls } = useToolContext()

  const tool = React.useMemo(
    () => registry.getTool(name) as Tool<TInput, TOutput> | undefined,
    [registry, name]
  )

  const execute = React.useCallback(
    (input: TInput) => registry.executeTool<TInput, TOutput>(name, input),
    [registry, name]
  )

  const toolHistory = React.useMemo(
    () => history.filter((c) => c.toolName === name) as ToolCall<TInput, TOutput>[],
    [history, name]
  )

  const isLoading = React.useMemo(
    () => pendingCalls.some((c) => c.toolName === name),
    [pendingCalls, name]
  )

  const lastCall = toolHistory[toolHistory.length - 1]

  return { tool, execute, isLoading, lastCall, history: toolHistory }
}

/**
 * Hook to get all tools
 */
export function useTools(): Tool[] {
  const { registry } = useToolContext()
  return registry.getTools()
}

/**
 * Hook to get tool call history
 */
export function useToolHistory(): ToolCall[] {
  const { history } = useToolContext()
  return history
}

/**
 * Hook to get pending tool calls
 */
export function usePendingTools(): ToolCall[] {
  const { pendingCalls } = useToolContext()
  return pendingCalls
}

export default useTool
