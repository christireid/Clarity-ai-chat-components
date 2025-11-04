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
export * from './types';
export * from './react-agent';
export * from './tools';
import type { Agent, AgentConfig, AgentCallbacks } from './types';
/**
 * Create an agent
 *
 * Factory function that creates an agent with the specified configuration.
 */
export declare function createAgent(config: AgentConfig, callbacks?: AgentCallbacks): Agent;
/**
 * Agent utilities
 */
export declare const AgentUtils: {
    /**
     * Format tool for LLM (OpenAI function calling format)
     */
    formatToolForLLM(tool: any): any;
    /**
     * Format tools array for LLM
     */
    formatToolsForLLM(tools: any[]): any[];
    /**
     * Parse tool call response from LLM
     */
    parseToolCall(functionCall: any): {
        name: string;
        arguments: Record<string, any>;
    };
    /**
     * Validate tool arguments against schema
     */
    validateArguments(tool: any, args: Record<string, any>): {
        valid: boolean;
        errors?: string[];
    };
};
//# sourceMappingURL=index.d.ts.map