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

import * as React from 'react'
import { ReactAgent } from '../agents/react-agent'
import type { Tool, AgentConfig } from '../agents/types'

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
 */
export function useAgent(options: UseAgentOptions): UseAgentReturn {
  const { model, tools = [], api, config } = options

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
      api,
      maxIterations: config?.maxIterations || 10,
      ...config,
    }
    agentRef.current = new ReactAgent(agentConfig)
  }, [model, tools, api, config])

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
        const error = err instanceof Error ? err : new Error('Agent execution failed')
        setError(error)
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
