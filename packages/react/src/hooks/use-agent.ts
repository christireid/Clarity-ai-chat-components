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
import { useReactAgent } from '../agents/react-agent'
import type { Tool } from '../agents/types'

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
  const agent = useReactAgent({ model, tools, api, ...config })

  const run = React.useCallback(
    async (input: { query: string; context?: any }) => {
      try {
        const result = await agent.run(input.query, { context: input.context })
        return typeof result === 'string' ? result : JSON.stringify(result)
      } catch (err) {
        throw err instanceof Error ? err : new Error('Agent execution failed')
      }
    },
    [agent]
  )

  return {
    run,
    isLoading: agent.isRunning || false,
    error: agent.error || null,
    state: {
      currentStep: agent.currentStep || 0,
      totalSteps: agent.maxSteps || 1,
      toolCalls: agent.toolCalls || [],
    },
  }
}
