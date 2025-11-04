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
import { ReactAgent } from './react-agent';
/**
 * Create an agent
 *
 * Factory function that creates an agent with the specified configuration.
 */
export function createAgent(config, callbacks) {
    // For now, only ReAct agent is implemented
    // In the future, support other agent types (plan-and-execute, tree-of-thought, etc.)
    return new ReactAgent(config, callbacks);
}
/**
 * Agent utilities
 */
export const AgentUtils = {
    /**
     * Format tool for LLM (OpenAI function calling format)
     */
    formatToolForLLM(tool) {
        return {
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters,
            },
        };
    },
    /**
     * Format tools array for LLM
     */
    formatToolsForLLM(tools) {
        return tools.map(t => this.formatToolForLLM(t));
    },
    /**
     * Parse tool call response from LLM
     */
    parseToolCall(functionCall) {
        return {
            name: functionCall.name,
            arguments: typeof functionCall.arguments === 'string'
                ? JSON.parse(functionCall.arguments)
                : functionCall.arguments,
        };
    },
    /**
     * Validate tool arguments against schema
     */
    validateArguments(tool, args) {
        const errors = [];
        // Check required fields
        if (tool.parameters.required) {
            for (const field of tool.parameters.required) {
                if (!(field in args)) {
                    errors.push(`Missing required field: ${field}`);
                }
            }
        }
        // Type checking (simplified)
        for (const [key, value] of Object.entries(args)) {
            const schema = tool.parameters.properties[key];
            if (!schema) {
                errors.push(`Unknown parameter: ${key}`);
                continue;
            }
            const actualType = typeof value;
            const expectedType = schema.type;
            if (expectedType === 'number' && actualType !== 'number') {
                errors.push(`Parameter ${key} should be ${expectedType}, got ${actualType}`);
            }
            if (expectedType === 'string' && actualType !== 'string') {
                errors.push(`Parameter ${key} should be ${expectedType}, got ${actualType}`);
            }
            if (expectedType === 'boolean' && actualType !== 'boolean') {
                errors.push(`Parameter ${key} should be ${expectedType}, got ${actualType}`);
            }
        }
        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        };
    },
};
//# sourceMappingURL=index.js.map