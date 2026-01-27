/**
 * Agent types for useAgent hook
 */

/**
 * Tool definition for agent
 */
export interface Tool {
  name: string
  description: string
  execute: (args: Record<string, unknown>) => Promise<unknown>
  parameters?: Record<string, unknown>
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  name: string
  description: string
  model: string
  tools: Tool[]
  maxIterations?: number
  [key: string]: unknown
}

/**
 * Step in agent execution
 */
export interface AgentStep {
  type: 'thought' | 'action' | 'observation'
  content?: string
  tool?: string
  args?: Record<string, unknown>
  result?: unknown
}

/**
 * Agent execution result
 */
export interface AgentExecution {
  steps: AgentStep[]
  answer: string | null
  success: boolean
}
