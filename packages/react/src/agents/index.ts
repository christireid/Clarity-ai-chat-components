/**
 * Agent Orchestration System
 * 
 * Framework for building agentic AI applications with tool calling,
 * planning, and multi-step execution.
 * 
 * @example
 * ```tsx
 * // Create an agent with tools
 * const agent = new ReactAgent({
 *   name: 'ResearchAgent',
 *   description: 'An agent that can research topics using web search',
 *   tools: [webSearchTool, calculatorTool],
 *   maxIterations: 10,
 * })
 * 
 * // Execute a query
 * const execution = await agent.execute(
 *   'What is the population of Tokyo and how does it compare to New York?'
 * )
 * 
 * console.log(execution.answer)
 * console.log(execution.steps) // See the agent's reasoning process
 * ```
 * 
 * @example
 * ```tsx
 * // Create a custom tool
 * const weatherTool: Tool = {
 *   name: 'get_weather',
 *   description: 'Get current weather for a location',
 *   parameters: {
 *     type: 'object',
 *     properties: {
 *       location: { type: 'string', description: 'City name' },
 *       units: { type: 'string', enum: ['celsius', 'fahrenheit'] },
 *     },
 *     required: ['location'],
 *   },
 *   async execute(args) {
 *     // Call weather API
 *     const response = await fetch(`/api/weather?location=${args.location}`)
 *     return await response.json()
 *   },
 * }
 * 
 * agent.addTool(weatherTool)
 * ```
 */

export * from './types'
export * from './react-agent'
export * from './tools'
export * from './tool-ui-registry'

import type { Agent, AgentConfig, AgentCallbacks } from './types'
import { ReactAgent } from './react-agent'

/**
 * createAgent - Top-Level Agent Factory
 * 
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Tools & Agents
 * 
 * Factory function that creates an agent with the specified configuration.
 * Currently supports ReAct agent type. Future versions may support additional
 * agent types (plan-and-execute, tree-of-thought, etc.).
 * 
 * For tool integration with chat, use mid-level `useClarityChatWithTools` instead.
 * 
 * @param config - Agent configuration
 * @param config.name - Agent name
 * @param config.description - Agent description
 * @param config.tools - Array of tools the agent can use
 * @param config.maxIterations - Maximum iterations (default: 10)
 * @param callbacks - Optional callbacks for agent events
 * @returns Configured agent instance
 * 
 * @example
 * ```tsx
 * const agent = createAgent({
 *   name: 'ResearchAgent',
 *   description: 'An agent that can research topics',
 *   tools: [webSearchTool, calculatorTool],
 *   maxIterations: 10,
 * })
 * 
 * const execution = await agent.execute('What is the population of Tokyo?')
 * console.log(execution.answer)
 * ```
 * 
 * @throws {Error} If agent configuration is invalid
 */
export function createAgent(
  config: AgentConfig,
  callbacks?: AgentCallbacks
): Agent {
  // Validate required config
  if (!config.name || typeof config.name !== 'string' || config.name.trim().length === 0) {
    throw new Error(
      'createAgent: "name" is required in agent configuration.\n\n' +
      'Example:\n' +
      '  const agent = createAgent({ name: "MyAgent", description: "...", tools: [...] })\n\n' +
      'For more help, see: https://clarity-chat.dev/docs/agents'
    )
  }

  if (!config.description || typeof config.description !== 'string' || config.description.trim().length === 0) {
    throw new Error(
      'createAgent: "description" is required in agent configuration.\n\n' +
      'Example:\n' +
      '  const agent = createAgent({ name: "MyAgent", description: "Agent description", tools: [...] })\n\n' +
      'For more help, see: https://clarity-chat.dev/docs/agents'
    )
  }

  // For now, only ReAct agent is implemented
  // In the future, support other agent types (plan-and-execute, tree-of-thought, etc.)
  return new ReactAgent(config, callbacks)
}

/**
 * Agent utilities
 */
export const AgentUtils = {
  /**
   * Format tool for LLM (OpenAI function calling format)
   */
  formatToolForLLM(tool: any): any {
    return {
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }
  },
  
  /**
   * Format tools array for LLM
   */
  formatToolsForLLM(tools: any[]): any[] {
    return tools.map(t => this.formatToolForLLM(t))
  },
  
  /**
   * Parse tool call response from LLM
   */
  parseToolCall(functionCall: any): { name: string; arguments: Record<string, any> } {
    return {
      name: functionCall.name,
      arguments: typeof functionCall.arguments === 'string'
        ? JSON.parse(functionCall.arguments)
        : functionCall.arguments,
    }
  },
  
  /**
   * Validate tool arguments against schema
   */
  validateArguments(tool: any, args: Record<string, any>): { valid: boolean; errors?: string[] } {
    const errors: string[] = []
    
    // Check required fields
    if (tool.parameters.required) {
      for (const field of tool.parameters.required) {
        if (!(field in args)) {
          errors.push(`Missing required field: ${field}`)
        }
      }
    }
    
    // Type checking (simplified)
    for (const [key, value] of Object.entries(args)) {
      const schema = tool.parameters.properties[key]
      if (!schema) {
        errors.push(`Unknown parameter: ${key}`)
        continue
      }
      
      const actualType = typeof value
      const expectedType = schema.type
      
      if (expectedType === 'number' && actualType !== 'number') {
        errors.push(`Parameter ${key} should be ${expectedType}, got ${actualType}`)
      }
      if (expectedType === 'string' && actualType !== 'string') {
        errors.push(`Parameter ${key} should be ${expectedType}, got ${actualType}`)
      }
      if (expectedType === 'boolean' && actualType !== 'boolean') {
        errors.push(`Parameter ${key} should be ${expectedType}, got ${actualType}`)
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  },
}

