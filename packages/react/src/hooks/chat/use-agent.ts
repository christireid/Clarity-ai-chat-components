/**
 * useAgent - Top-level hook for AI agents
 *
 * Drop-in ready hook for agent orchestration with tool calling.
 *
 * @example
 * ```tsx
 * const agent = useAgent({
 *   model: 'gpt-4',
 *   tools: [webSearchTool, calculatorTool],
 * })
 *
 * const response = await agent.run({ query: 'What is 2+2?' })
 * ```
 */

'use client'

import * as React from 'react'
import { ReactAgent } from '../agents/react-agent'
import type { Tool, AgentConfig } from '../agents/types'
import {
  validateModel,
  validateTools,
} from '../../utils/config/runtime-validation'

/**
 * Options for useAgent
 */
export interface UseAgentOptions {
  /** Model identifier */
  model: string
  /** Available tools */
  tools?: Tool[]
  /** API endpoint */
  api?: string
  /** Additional configuration */
  config?: Record<string, any>
}

/**
 * Return type for useAgent
 */
export interface UseAgentReturn {
  /** Run the agent with a query */
  run: (input: { query: string; context?: any }) => Promise<string>
  /** Whether agent is running */
  isLoading: boolean
  /** Current error, if any */
  error: Error | null
  /** Agent state */
  state: {
    currentStep: number
    totalSteps: number
    toolCalls: any[]
  }
}

/**
 * useAgent - Top-level agent hook
 *
 * Provides a simple API for agent orchestration with automatic
 * tool management and error handling.
 *
 * @param options - Configuration options for the agent
 * @param options.model - Model identifier (e.g., 'gpt-4', 'claude-3')
 * @param options.tools - Array of tools the agent can use
 * @param options.api - API endpoint for agent execution (optional)
 * @param options.config - Additional configuration options (optional)
 *
 * @returns Agent instance with run method, loading state, error state, and execution state
 *
 * @throws {Error} If agent initialization fails or execution fails
 *
 * @example
 * ```tsx
 * const agent = useAgent({
 *   model: 'gpt-4',
 *   tools: [webSearchTool, calculatorTool],
 *   api: '/api/agent',
 * })
 *
 * const response = await agent.run({ query: 'What is 2+2?' })
 * console.log(response) // "4"
 * ```
 */
export function useAgent(options: UseAgentOptions): UseAgentReturn {
  const { model, tools = [], api, config } = options

  // Runtime validation
  React.useEffect(() => {
    try {
      validateModel(model)
      if (tools.length > 0) {
        validateTools(tools)
      }
    } catch (error) {
      if (process.env['NODE_ENV'] === 'development') {
        console.error('[useAgent] Validation error:', error)
        throw error
      }
    }
  }, [model, tools])

  const agentRef = React.useRef<ReactAgent | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [state, setState] = React.useState({
    currentStep: 0,
    totalSteps: 1,
    toolCalls: [] as any[],
  })

  // Initialize agent
  React.useEffect(() => {
    const agentConfig: AgentConfig = {
      name: 'agent',
      description: 'AI Agent',
      model,
      tools,
      maxIterations: config?.['maxIterations'] || 10,
      ...config,
    }
    agentRef.current = new ReactAgent(agentConfig)
  }, [model, tools, config])

  const run = React.useCallback(
    async (input: { query: string; context?: any }) => {
      if (!agentRef.current) {
        throw new Error('Agent not initialized')
      }

      setIsLoading(true)
      setError(null)
      setState({ currentStep: 0, totalSteps: 1, toolCalls: [] })

      try {
        const execution = await agentRef.current.execute(input.query)

        // Update state from execution
        setState({
          currentStep: execution.steps.length,
          totalSteps: execution.steps.length,
          toolCalls: execution.steps
            .filter((s) => s.type === 'action')
            .map((s) => ({ tool: s.tool, args: s.args, result: s.result })),
        })

        return execution.answer || 'No answer generated'
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Agent execution failed')
        setError(error)
        // Log error for debugging
        if (process.env['NODE_ENV'] === 'development') {
          console.error('[useAgent] Execution failed:', error)
        }
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    run,
    isLoading,
    error,
    state,
  }
}
