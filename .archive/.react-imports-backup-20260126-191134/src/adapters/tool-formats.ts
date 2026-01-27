/**
 * Tool Format Adapters
 *
 * Adapters for converting between different tool definition formats:
 * - Canonical format (internal)
 * - OpenAI function calling format (external)
 * - Legacy formats (backward compatibility)
 *
 * @module adapters/tool-formats
 */

import type {
  ToolDefinition,
  ToolParameters,
  ToolArguments,
  ToolResult,
  ToolExecutionContext,
} from '../types/tool-definition'

// =============================================================================
// OpenAI Function Calling Format
// =============================================================================

/**
 * OpenAI function calling format
 * See: https://platform.openai.com/docs/guides/function-calling
 */
export interface OpenAIFunction {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, unknown>
      required?: string[]
    }
  }
}

/**
 * OpenAI tool call format (in response)
 */
export interface OpenAIToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string // JSON string
  }
}

// =============================================================================
// Canonical → OpenAI
// =============================================================================

/**
 * Convert canonical ToolDefinition to OpenAI function format
 *
 * @param tool - Canonical tool definition
 * @returns OpenAI function definition
 *
 * @example
 * ```typescript
 * const openaiFunc = toOpenAIFunction(weatherTool)
 * // Use with OpenAI API:
 * await openai.chat.completions.create({
 *   model: 'gpt-4',
 *   messages,
 *   tools: [openaiFunc]
 * })
 * ```
 */
export function toOpenAIFunction(tool: ToolDefinition): OpenAIFunction {
  return {
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: 'object',
        properties: tool.parameters.properties,
        required: tool.parameters.required,
      },
    },
  }
}

/**
 * Convert multiple tools to OpenAI format
 */
export function toOpenAIFunctions(tools: ToolDefinition[]): OpenAIFunction[] {
  return tools.map(toOpenAIFunction)
}

// =============================================================================
// OpenAI → Canonical
// =============================================================================

/**
 * Convert OpenAI function to canonical ToolDefinition
 *
 * Note: OpenAI format doesn't include execution logic, so you must provide it.
 *
 * @param openaiFunc - OpenAI function definition
 * @param execute - Execution function
 * @param options - Additional tool options
 * @returns Canonical tool definition
 *
 * @example
 * ```typescript
 * const tool = fromOpenAIFunction(
 *   openaiFunction,
 *   async (args) => {
 *     // Implementation
 *     return result
 *   },
 *   { requiresApproval: true, category: 'api' }
 * )
 * ```
 */
export function fromOpenAIFunction(
  openaiFunc: OpenAIFunction,
  execute: (
    args: ToolArguments,
    context: ToolExecutionContext
  ) => Promise<ToolResult>,
  options?: Partial<
    Omit<ToolDefinition, 'name' | 'description' | 'parameters' | 'execute'>
  >
): ToolDefinition {
  return {
    name: openaiFunc.function.name,
    description: openaiFunc.function.description,
    parameters: {
      type: 'object',
      properties: openaiFunc.function.parameters.properties as Record<
        string,
        any
      >,
      required: openaiFunc.function.parameters.required,
    },
    execute,
    ...options,
  }
}

// =============================================================================
// Tool Call Parsing (OpenAI → Canonical)
// =============================================================================

/**
 * Parse OpenAI tool call arguments from JSON string
 *
 * @param toolCall - OpenAI tool call
 * @returns Parsed arguments
 */
export function parseOpenAIToolCallArguments(
  toolCall: OpenAIToolCall
): Record<string, unknown> {
  try {
    return JSON.parse(toolCall.function.arguments)
  } catch (error) {
    throw new Error(
      `Failed to parse tool call arguments for "${toolCall.function.name}": ${
        error instanceof Error ? error.message : 'Invalid JSON'
      }`
    )
  }
}

// =============================================================================
// Legacy Format Support
// =============================================================================

/**
 * Legacy Agent Tool format (backward compatibility)
 */
export interface LegacyAgentTool {
  name: string
  description: string
  parameters: ToolParameters
  execute: (args: Record<string, any>) => Promise<any>
  requiresApproval?: boolean
  category?: string
  tags?: string[]
}

/**
 * Convert legacy Agent Tool to canonical format
 */
export function fromLegacyAgentTool(
  legacyTool: LegacyAgentTool
): ToolDefinition {
  return {
    name: legacyTool.name,
    description: legacyTool.description,
    parameters: legacyTool.parameters,
    execute: async (args: ToolArguments, _context: ToolExecutionContext) => {
      // Legacy tools don't receive context
      return legacyTool.execute(args)
    },
    requiresApproval: legacyTool.requiresApproval,
    category: legacyTool.category,
    tags: legacyTool.tags,
  }
}

/**
 * Legacy tools-engine ToolDefinition (backward compatibility)
 */
export interface LegacyEngineToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
  execute: (params: Record<string, unknown>) => Promise<unknown>
}

/**
 * Convert legacy engine tool to canonical format
 */
export function fromLegacyEngineTool(
  legacyTool: LegacyEngineToolDefinition
): ToolDefinition {
  return {
    name: legacyTool.name,
    description: legacyTool.description,
    parameters: legacyTool.parameters as unknown as ToolParameters,
    execute: async (args: ToolArguments, _context: ToolExecutionContext) => {
      return legacyTool.execute(args)
    },
  }
}

// =============================================================================
// Format Detection
// =============================================================================

/**
 * Detect tool format
 */
export function detectToolFormat(
  obj: unknown
): 'canonical' | 'openai' | 'legacy-agent' | 'legacy-engine' | 'unknown' {
  if (typeof obj !== 'object' || obj === null) return 'unknown'

  const tool = obj as Record<string, unknown>

  // OpenAI format detection
  if (tool.type === 'function' && typeof tool.function === 'object') {
    return 'openai'
  }

  // Has execute function
  if (typeof tool.execute === 'function') {
    // Check if it has context parameter (canonical)
    if (tool.execute.length === 2) {
      return 'canonical'
    }

    // Check for agent tool indicators
    if (tool.category || tool.tags) {
      return 'legacy-agent'
    }

    return 'legacy-engine'
  }

  return 'unknown'
}

/**
 * Auto-convert any supported format to canonical
 *
 * @param tool - Tool in any supported format
 * @param execute - Execution function (required for OpenAI format)
 * @returns Canonical tool definition
 * @throws Error if format is unknown or conversion fails
 */
export function toCanonicalFormat(
  tool: unknown,
  execute?: (
    args: ToolArguments,
    context: ToolExecutionContext
  ) => Promise<ToolResult>
): ToolDefinition {
  const format = detectToolFormat(tool)

  switch (format) {
    case 'canonical':
      return tool as ToolDefinition

    case 'openai':
      if (!execute) {
        throw new Error(
          'Execute function required when converting from OpenAI format'
        )
      }
      return fromOpenAIFunction(tool as OpenAIFunction, execute)

    case 'legacy-agent':
      return fromLegacyAgentTool(tool as LegacyAgentTool)

    case 'legacy-engine':
      return fromLegacyEngineTool(tool as LegacyEngineToolDefinition)

    default:
      throw new Error(`Unknown or unsupported tool format`)
  }
}

// =============================================================================
// Batch Conversion Utilities
// =============================================================================

/**
 * Convert array of tools to canonical format
 */
export function convertToolsToCanonical(
  tools: unknown[],
  executeMap?: Map<
    string,
    (args: ToolArguments, context: ToolExecutionContext) => Promise<ToolResult>
  >
): ToolDefinition[] {
  return tools.map((tool) => {
    const format = detectToolFormat(tool)

    if (format === 'openai') {
      const openaiTool = tool as OpenAIFunction
      const execute = executeMap?.get(openaiTool.function.name)

      if (!execute) {
        throw new Error(
          `Execute function not provided for OpenAI tool: ${openaiTool.function.name}`
        )
      }

      return toCanonicalFormat(tool, execute)
    }

    return toCanonicalFormat(tool)
  })
}

/**
 * Convert array of canonical tools to OpenAI format
 */
export function convertToolsToOpenAI(
  tools: ToolDefinition[]
): OpenAIFunction[] {
  return tools.map(toOpenAIFunction)
}

// =============================================================================
// Validation Helpers
// =============================================================================

/**
 * Validate that tool can be converted to OpenAI format
 * OpenAI has some restrictions on function schemas
 */
export function isOpenAICompatible(tool: ToolDefinition): boolean {
  // Name must be valid function name
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(tool.name)) {
    return false
  }

  // Description required and must be non-empty
  if (!tool.description || tool.description.length === 0) {
    return false
  }

  // Parameters must be object type
  if (tool.parameters.type !== 'object') {
    return false
  }

  return true
}

/**
 * Get compatibility warnings for a tool
 */
export function getOpenAICompatibilityWarnings(tool: ToolDefinition): string[] {
  const warnings: string[] = []

  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(tool.name)) {
    warnings.push(
      'Tool name must be 1-64 characters, alphanumeric with underscores/hyphens'
    )
  }

  if (!tool.description || tool.description.length === 0) {
    warnings.push('Tool description is required')
  }

  if (tool.parameters.type !== 'object') {
    warnings.push('Tool parameters must be object type')
  }

  // Lifecycle hooks won't be preserved
  if (tool.hooks) {
    warnings.push('Lifecycle hooks will not be preserved in OpenAI format')
  }

  // Some properties won't be preserved
  const lostProperties = [
    'requiresApproval',
    'cacheable',
    'cacheTtl',
    'timeout',
    'parallelizable',
    'category',
    'tags',
    'icon',
    'color',
    'metadata',
  ].filter((prop) => tool[prop as keyof ToolDefinition] !== undefined)

  if (lostProperties.length > 0) {
    warnings.push(
      `Properties will not be preserved: ${lostProperties.join(', ')}`
    )
  }

  return warnings
}
