/**
 * Docs Assistant Tool Definitions
 *
 * Defines the tools available to the docs assistant for enhanced responses.
 * These tools enable the assistant to generate diagrams, look up documentation,
 * create code examples, and provide bundle size recommendations.
 */

import type Anthropic from '@anthropic-ai/sdk'

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
 */
export const DOCS_ASSISTANT_TOOLS: Anthropic.Tool[] = [
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
    description: `Calculate the bundle size impact of using specific Clarity Chat features and recommend the optimal entry point. Use this tool when:
- User asks about bundle size or optimization
- User wants to know which entry point to use
- User is comparing full vs core vs core-minimal bundles
- User wants to minimize their bundle size`,
    input_schema: {
      type: 'object' as const,
      properties: {
        features: {
          type: 'array',
          items: { type: 'string' },
          description:
            'List of features the user needs (e.g., ["streaming", "memory", "theming", "rag", "analytics"])',
        },
      },
      required: ['features'],
    },
  },
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
    features: string[]
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
      recommended_entry_point: string
      estimated_size: string
      features_included: string[]
      features_requiring_lazy_load: string[]
      size_breakdown: Array<{ feature: string; size: string }>
      optimization_tips: string[]
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
