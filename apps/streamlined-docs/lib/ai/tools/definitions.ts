/**
 * Docs Assistant Tool Definitions
 *
 * Defines the tools available to the docs assistant for enhanced responses.
 * These tools enable the assistant to generate diagrams, look up documentation,
 * create code examples, provide bundle size recommendations, and manage user data.
 *
 * **NEW** (Agent-Native Architecture): User management CRUD tools for action parity.
 */

import type Anthropic from '@anthropic-ai/sdk'
import { USER_MANAGEMENT_TOOLS } from './user-management-tools'
import { MESSAGE_MANAGEMENT_TOOLS } from './message-management-tools'

/**
 * Tool names as constants for type safety
 */
export const TOOL_NAMES = {
  GENERATE_DIAGRAM: 'generate_diagram',
  LOOKUP_COMPONENT: 'lookup_component',
  LOOKUP_HOOK: 'lookup_hook',
  GENERATE_CODE_EXAMPLE: 'generate_code_example',
  CALCULATE_BUNDLE_IMPACT: 'calculate_bundle_impact',
} as const

export type ToolName = (typeof TOOL_NAMES)[keyof typeof TOOL_NAMES]

/**
 * Tool definitions for Claude API
 *
 * Includes both documentation tools and user management tools for full action parity.
 */
export const DOCS_ASSISTANT_TOOLS: Anthropic.Tool[] = [
  // Documentation & Content Generation Tools
  {
    name: TOOL_NAMES.GENERATE_DIAGRAM,
    description: `Generate a Mermaid diagram to visually explain concepts, architecture, data flow, or component relationships. Use this tool when:
- User asks about how components relate to each other
- User wants to understand data flow or architecture
- User asks "how does X work?" for complex topics
- User needs to visualize a process or workflow
- Explaining hook dependencies or state management patterns`,
    input_schema: {
      type: 'object' as const,
      properties: {
        diagram_type: {
          type: 'string',
          enum: [
            'flowchart',
            'sequence',
            'classDiagram',
            'stateDiagram',
            'erDiagram',
          ],
          description: 'The type of Mermaid diagram to generate',
        },
        title: {
          type: 'string',
          description: 'A descriptive title for the diagram',
        },
        description: {
          type: 'string',
          description: 'Brief description of what the diagram shows',
        },
        mermaid_code: {
          type: 'string',
          description:
            'The complete Mermaid diagram code. Must be valid Mermaid syntax.',
        },
      },
      required: ['diagram_type', 'title', 'mermaid_code'],
    },
  },
  {
    name: TOOL_NAMES.LOOKUP_COMPONENT,
    description: `Look up detailed documentation for a Clarity Chat component. Use this tool when:
- User asks about a specific component's props or API
- User wants to know how to use a component
- User asks about component features or options
- You need accurate prop types and descriptions`,
    input_schema: {
      type: 'object' as const,
      properties: {
        component_name: {
          type: 'string',
          description:
            'The name of the component to look up (e.g., "ChatWindow", "MessageList", "ClarityChat")',
        },
      },
      required: ['component_name'],
    },
  },
  {
    name: TOOL_NAMES.LOOKUP_HOOK,
    description: `Look up detailed documentation for a Clarity Chat hook. Use this tool when:
- User asks about a specific hook's parameters or return values
- User wants to know which hook to use for a specific task
- User asks about hook usage patterns
- You need accurate hook signatures and examples`,
    input_schema: {
      type: 'object' as const,
      properties: {
        hook_name: {
          type: 'string',
          description:
            'The name of the hook to look up (e.g., "useClarityChat", "useStreamingSSE", "useTokenTracker")',
        },
      },
      required: ['hook_name'],
    },
  },
  {
    name: TOOL_NAMES.GENERATE_CODE_EXAMPLE,
    description: `Generate a complete, runnable code example tailored to the user's specific requirements. Use this tool when:
- User asks for a code example or implementation
- User wants to see how to combine multiple features
- User asks "how do I..." questions that require code
- User needs a starting point for their implementation`,
    input_schema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'A descriptive title for the code example',
        },
        description: {
          type: 'string',
          description: 'Brief description of what the code does',
        },
        language: {
          type: 'string',
          enum: ['tsx', 'typescript', 'javascript'],
          description: 'The programming language for the example',
        },
        code: {
          type: 'string',
          description:
            'The complete, runnable code example with imports and proper formatting',
        },
        features_used: {
          type: 'array',
          items: { type: 'string' },
          description:
            'List of Clarity Chat features/components used in the example',
        },
        notes: {
          type: 'string',
          description: 'Optional implementation notes or tips',
        },
      },
      required: ['title', 'description', 'language', 'code', 'features_used'],
    },
  },
  {
    name: TOOL_NAMES.CALCULATE_BUNDLE_IMPACT,
    description: `Analyze bundle size impact and recommend optimal entry point for Clarity Chat.

**Prompt-Native Tool**: This tool structures your reasoning about bundle optimization. You should:

1. Read the bundle optimization context from your system knowledge
2. Parse the user's requirements into a feature list
3. Reason about which entry point best fits their needs
4. Calculate approximate bundle sizes based on documented patterns
5. Identify lazy-loadable features for progressive enhancement
6. Provide specific optimization recommendations

Use this tool when:
- User asks "What's the bundle size?" or "Which package should I use?"
- User wants to optimize their bundle
- User compares full vs core vs core-minimal
- User asks about lazy loading strategies

**Important**: Use documented size estimates and reasoning, not hardcoded lookups. Refer to bundle-optimization-context.md patterns.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        user_requirements: {
          type: 'string',
          description:
            'Natural language description of what features the user needs. Examples: "I need streaming chat with dark mode", "Just basic chat for mobile", "Full enterprise features with analytics"',
        },
        context: {
          type: 'string',
          description:
            'Optional: Additional context about the use case (mobile app, desktop app, performance constraints, user tier, etc.)',
        },
      },
      required: ['user_requirements'],
    },
  },
  // User Management Tools (Agent-Native Architecture)
  ...USER_MANAGEMENT_TOOLS,
  // Message Management Tools (Agent-Native Architecture)
  ...MESSAGE_MANAGEMENT_TOOLS,
]

/**
 * Type for tool input parameters
 */
export interface ToolInputs {
  generate_diagram: {
    diagram_type:
      | 'flowchart'
      | 'sequence'
      | 'classDiagram'
      | 'stateDiagram'
      | 'erDiagram'
    title: string
    description?: string
    mermaid_code: string
  }
  lookup_component: {
    component_name: string
  }
  lookup_hook: {
    hook_name: string
  }
  generate_code_example: {
    title: string
    description: string
    language: 'tsx' | 'typescript' | 'javascript'
    code: string
    features_used: string[]
    notes?: string
  }
  calculate_bundle_impact: {
    user_requirements: string
    context?: string
  }
}

/**
 * Type for tool outputs
 */
export interface ToolOutputs {
  generate_diagram: {
    success: true
    diagram: {
      type: string
      title: string
      description?: string
      mermaid_code: string
    }
  }
  lookup_component:
    | {
        success: true
        component: {
          name: string
          description: string
          category: string
          props: Array<{
            name: string
            type: string
            description: string
            required: boolean
          }>
          example?: string
          docsUrl: string
        }
      }
    | {
        success: false
        error: string
        suggestions?: string[]
      }
  lookup_hook:
    | {
        success: true
        hook: {
          name: string
          description: string
          category: string
          signature: string
          parameters?: Array<{
            name: string
            type: string
            description: string
          }>
          returns?: { type: string; description: string }
          example?: string
          docsUrl: string
        }
      }
    | {
        success: false
        error: string
        suggestions?: string[]
      }
  generate_code_example: {
    success: true
    example: {
      title: string
      description: string
      language: string
      code: string
      features_used: string[]
      notes?: string
    }
  }
  calculate_bundle_impact: {
    success: true
    analysis: {
      user_requirements: string
      context?: string
      reasoning_guidance: {
        step_1: string
        step_2: string
        step_3: string
        step_4: string
        step_5: string
        step_6: string
      }
      bundle_context_reference: string
      available_entry_points: Array<{
        name: string
        base_size: string
        includes: string[]
      }>
      instruction: string
    }
  }
}

/**
 * Stream chunk type for tool results
 */
export interface ToolResultChunk {
  type: 'tool_result'
  tool_name: ToolName
  tool_use_id: string
  result: ToolOutputs[keyof ToolOutputs]
}
