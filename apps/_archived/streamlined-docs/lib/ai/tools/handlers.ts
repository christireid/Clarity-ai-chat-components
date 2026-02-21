/**
 * Docs Assistant Tool Handlers
 *
 * Implements the execution logic for each tool available to the docs assistant.
 * Includes handlers for documentation tools and user management CRUD operations.
 */

import {
  TOOL_NAMES,
  type ToolName,
  type ToolInputs,
  type ToolOutputs,
} from './definitions'
import {
  USER_TOOL_NAMES,
  type UserToolName,
} from './user-management-tools'
import { executeUserManagementTool } from './user-management-handlers'
import {
  MESSAGE_TOOL_NAMES,
  type MessageToolName,
} from './message-management-tools'
import { executeMessageManagementTool } from './message-management-handlers'

/**
 * Bundle Optimization Context Path
 *
 * This file contains the documented patterns and size estimates for bundle reasoning.
 * The AI should read and apply these patterns rather than using hardcoded lookups.
 */
const BUNDLE_OPTIMIZATION_CONTEXT_PATH =
  './prompts/bundle-optimization-context.md'

/**
 * Execute a tool and return the result
 */
export async function executeToolCall(
  toolName: ToolName | UserToolName | MessageToolName,
  input: ToolInputs[keyof ToolInputs]
): Promise<ToolOutputs[keyof ToolOutputs]> {
  // Check if this is a user management tool
  if (Object.values(USER_TOOL_NAMES).includes(toolName as UserToolName)) {
    return executeUserManagementTool(toolName as UserToolName, input)
  }

  // Check if this is a message management tool
  if (Object.values(MESSAGE_TOOL_NAMES).includes(toolName as MessageToolName)) {
    return executeMessageManagementTool(toolName as MessageToolName, input)
  }

  // Handle documentation tools
  switch (toolName) {
    case TOOL_NAMES.GENERATE_DIAGRAM:
      return handleGenerateDiagram(input as ToolInputs['generate_diagram'])
    case TOOL_NAMES.LOOKUP_COMPONENT:
      return handleLookupComponent(input as ToolInputs['lookup_component'])
    case TOOL_NAMES.LOOKUP_HOOK:
      return handleLookupHook(input as ToolInputs['lookup_hook'])
    case TOOL_NAMES.GENERATE_CODE_EXAMPLE:
      return handleGenerateCodeExample(
        input as ToolInputs['generate_code_example']
      )
    case TOOL_NAMES.CALCULATE_BUNDLE_IMPACT:
      return handleCalculateBundleImpact(
        input as ToolInputs['calculate_bundle_impact']
      )
    default:
      throw new Error(`Unknown tool: ${toolName}`)
  }
}

/**
 * Handle generate_diagram tool
 */
function handleGenerateDiagram(
  input: ToolInputs['generate_diagram']
): ToolOutputs['generate_diagram'] {
  // Validate Mermaid code syntax (basic validation)
  const validPrefixes = [
    'flowchart',
    'sequenceDiagram',
    'classDiagram',
    'stateDiagram',
    'erDiagram',
    'graph',
  ]
  const firstLine = input.mermaid_code.trim().split('\n')[0].toLowerCase()
  const hasValidPrefix = validPrefixes.some((prefix) =>
    firstLine.startsWith(prefix.toLowerCase())
  )

  if (!hasValidPrefix) {
    // Try to fix common issues
    const fixedCode = fixMermaidSyntax(input.diagram_type, input.mermaid_code)
    return {
      success: true,
      diagram: {
        type: input.diagram_type,
        title: input.title,
        description: input.description,
        mermaid_code: fixedCode,
      },
    }
  }

  return {
    success: true,
    diagram: {
      type: input.diagram_type,
      title: input.title,
      description: input.description,
      mermaid_code: input.mermaid_code,
    },
  }
}

/**
 * Fix common Mermaid syntax issues
 */
function fixMermaidSyntax(diagramType: string, code: string): string {
  const trimmedCode = code.trim()

  // Add diagram type prefix if missing
  switch (diagramType) {
    case 'flowchart':
      if (
        !trimmedCode.toLowerCase().startsWith('flowchart') &&
        !trimmedCode.toLowerCase().startsWith('graph')
      ) {
        return `flowchart TD\n${trimmedCode}`
      }
      break
    case 'sequence':
      if (!trimmedCode.toLowerCase().startsWith('sequencediagram')) {
        return `sequenceDiagram\n${trimmedCode}`
      }
      break
    case 'classDiagram':
      if (!trimmedCode.toLowerCase().startsWith('classdiagram')) {
        return `classDiagram\n${trimmedCode}`
      }
      break
    case 'stateDiagram':
      if (!trimmedCode.toLowerCase().startsWith('statediagram')) {
        return `stateDiagram-v2\n${trimmedCode}`
      }
      break
    case 'erDiagram':
      if (!trimmedCode.toLowerCase().startsWith('erdiagram')) {
        return `erDiagram\n${trimmedCode}`
      }
      break
  }

  return trimmedCode
}

/**
 * Handle lookup_component tool
 */
async function handleLookupComponent(
  input: ToolInputs['lookup_component']
): Promise<ToolOutputs['lookup_component']> {
  try {
    // Fetch from the AI API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'
    const response = await fetch(
      `${baseUrl}/api/ai/components/${encodeURIComponent(input.component_name)}`
    )

    if (!response.ok) {
      // Try to get suggestions
      const listResponse = await fetch(`${baseUrl}/api/ai/components`)
      const listData = await listResponse.json()

      const suggestions =
        listData.components
          ?.filter(
            (c: { name: string }) =>
              c.name
                .toLowerCase()
                .includes(input.component_name.toLowerCase()) ||
              input.component_name
                .toLowerCase()
                .includes(c.name.toLowerCase().replace(/[^a-z]/g, ''))
          )
          .slice(0, 5)
          .map((c: { name: string }) => c.name) || []

      return {
        success: false,
        error: `Component "${input.component_name}" not found`,
        suggestions:
          suggestions.length > 0
            ? suggestions
            : ['ChatWindow', 'ClarityChat', 'MessageList', 'ChatInput'],
      }
    }

    const data = await response.json()

    return {
      success: true,
      component: {
        name: data.name,
        description: data.description,
        category: data.category,
        props: data.props || [],
        example: data.example,
        docsUrl: data.docsUrl,
      },
    }
  } catch (error) {
    console.error('Error looking up component:', error)
    return {
      success: false,
      error: `Failed to look up component: ${error instanceof Error ? error.message : 'Unknown error'}`,
      suggestions: ['ChatWindow', 'ClarityChat', 'MessageList', 'ChatInput'],
    }
  }
}

/**
 * Handle lookup_hook tool
 */
async function handleLookupHook(
  input: ToolInputs['lookup_hook']
): Promise<ToolOutputs['lookup_hook']> {
  try {
    // Fetch from the AI API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'
    const response = await fetch(
      `${baseUrl}/api/ai/hooks/${encodeURIComponent(input.hook_name)}`
    )

    if (!response.ok) {
      // Try to get suggestions
      const listResponse = await fetch(`${baseUrl}/api/ai/hooks`)
      const listData = await listResponse.json()

      const suggestions =
        listData.hooks
          ?.filter(
            (h: { name: string }) =>
              h.name.toLowerCase().includes(input.hook_name.toLowerCase()) ||
              input.hook_name
                .toLowerCase()
                .includes(h.name.toLowerCase().replace(/^use/i, ''))
          )
          .slice(0, 5)
          .map((h: { name: string }) => h.name) || []

      return {
        success: false,
        error: `Hook "${input.hook_name}" not found`,
        suggestions:
          suggestions.length > 0
            ? suggestions
            : [
                'useClarityChat',
                'useStreamingSSE',
                'useTokenTracker',
                'useMemoryContext',
              ],
      }
    }

    const data = await response.json()

    return {
      success: true,
      hook: {
        name: data.name,
        description: data.description,
        category: data.category,
        signature: data.signature,
        parameters: data.parameters,
        returns: data.returns,
        example: data.example,
        docsUrl: data.docsUrl,
      },
    }
  } catch (error) {
    console.error('Error looking up hook:', error)
    return {
      success: false,
      error: `Failed to look up hook: ${error instanceof Error ? error.message : 'Unknown error'}`,
      suggestions: [
        'useClarityChat',
        'useStreamingSSE',
        'useTokenTracker',
        'useMemoryContext',
      ],
    }
  }
}

/**
 * Handle generate_code_example tool
 */
function handleGenerateCodeExample(
  input: ToolInputs['generate_code_example']
): ToolOutputs['generate_code_example'] {
  return {
    success: true,
    example: {
      title: input.title,
      description: input.description,
      language: input.language,
      code: input.code,
      features_used: input.features_used,
      notes: input.notes,
    },
  }
}

/**
 * Handle calculate_bundle_impact tool (Prompt-Native)
 *
 * This tool is prompt-native: it returns structured context that guides the AI's
 * reasoning rather than performing hardcoded calculations.
 *
 * The AI should:
 * 1. Read bundle-optimization-context.md patterns
 * 2. Parse user requirements into feature needs
 * 3. Reason about optimal entry point based on documented patterns
 * 4. Calculate sizes using documented estimates
 * 5. Provide optimization recommendations
 */
function handleCalculateBundleImpact(
  input: ToolInputs['calculate_bundle_impact']
): ToolOutputs['calculate_bundle_impact'] {
  // Return structured guidance for AI reasoning
  return {
    success: true,
    analysis: {
      user_requirements: input.user_requirements,
      context: input.context,
      reasoning_guidance: {
        step_1: 'Parse user requirements into a list of needed features',
        step_2:
          'Categorize features: core-minimal (chat, messages, input, streaming), core (+ theming, memory), or full (advanced features)',
        step_3:
          'Identify which advanced features are lazy-loadable vs required immediately',
        step_4:
          'Calculate base bundle size + non-lazy features using documented estimates',
        step_5: 'List lazy-loadable features for progressive enhancement',
        step_6:
          'Recommend optimal entry point and specific optimization strategies',
      },
      bundle_context_reference: BUNDLE_OPTIMIZATION_CONTEXT_PATH,
      available_entry_points: [
        {
          name: '@clarity-chat/react/core-minimal',
          base_size: '~30KB',
          includes: ['chat', 'messages', 'input', 'streaming'],
        },
        {
          name: '@clarity-chat/react/core',
          base_size: '~60KB',
          includes: [
            'chat',
            'messages',
            'input',
            'streaming',
            'theming',
            'memory',
          ],
        },
        {
          name: '@clarity-chat/react',
          base_size: '~120KB',
          includes: ['all features'],
        },
      ],
      instruction:
        'Use the bundle optimization context patterns to reason about the best approach for these requirements. Provide specific size estimates, identify lazy-loadable features, and give concrete optimization tips.',
    },
  }
}
