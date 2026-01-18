/**
 * Docs Assistant Tool Handlers
 *
 * Implements the execution logic for each tool available to the docs assistant.
 */

import {
  TOOL_NAMES,
  type ToolName,
  type ToolInputs,
  type ToolOutputs,
} from './definitions'
import { logger } from '@/lib/logger'

// Bundle size data for the calculator
const BUNDLE_SIZES = {
  full: { name: '@clarity-chat/react', size: '~120KB', features: ['all'] },
  core: {
    name: '@clarity-chat/react/core',
    size: '~60KB',
    features: ['chat', 'messages', 'input', 'streaming', 'theming', 'memory'],
  },
  coreMinimal: {
    name: '@clarity-chat/react/core-minimal',
    size: '~30KB',
    features: ['chat', 'messages', 'input', 'streaming'],
  },
}

const FEATURE_SIZES: Record<
  string,
  { size: string; entryPoint: string; lazyLoadable: boolean }
> = {
  chat: { size: '~15KB', entryPoint: 'core-minimal', lazyLoadable: false },
  messages: { size: '~10KB', entryPoint: 'core-minimal', lazyLoadable: false },
  input: { size: '~8KB', entryPoint: 'core-minimal', lazyLoadable: false },
  streaming: { size: '~5KB', entryPoint: 'core-minimal', lazyLoadable: false },
  theming: { size: '~12KB', entryPoint: 'core', lazyLoadable: false },
  memory: { size: '~8KB', entryPoint: 'core', lazyLoadable: false },
  rag: { size: '~15KB', entryPoint: 'full', lazyLoadable: true },
  agents: { size: '~12KB', entryPoint: 'full', lazyLoadable: true },
  analytics: { size: '~10KB', entryPoint: 'full', lazyLoadable: true },
  tokenOptimization: { size: '~8KB', entryPoint: 'full', lazyLoadable: true },
  vectorStores: { size: '~10KB', entryPoint: 'full', lazyLoadable: true },
  enterprise: { size: '~20KB', entryPoint: 'full', lazyLoadable: true },
  animations: { size: '~15KB', entryPoint: 'full', lazyLoadable: false },
  voice: { size: '~12KB', entryPoint: 'full', lazyLoadable: true },
  fileUpload: { size: '~10KB', entryPoint: 'full', lazyLoadable: true },
}

/**
 * Execute a tool and return the result
 */
export async function executeToolCall(
  toolName: ToolName,
  input: ToolInputs[keyof ToolInputs]
): Promise<ToolOutputs[keyof ToolOutputs]> {
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
    logger.error('Error looking up component:', error)
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
    logger.error('Error looking up hook:', error)
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
 * Handle calculate_bundle_impact tool
 */
function handleCalculateBundleImpact(
  input: ToolInputs['calculate_bundle_impact']
): ToolOutputs['calculate_bundle_impact'] {
  const normalizedFeatures = input.features.map((f) =>
    f.toLowerCase().replace(/[^a-z]/g, '')
  )

  // Determine which features are needed
  const featureAnalysis = normalizedFeatures
    .map((feature) => {
      // Map user input to known features
      const featureKey = Object.keys(FEATURE_SIZES).find(
        (key) =>
          key.toLowerCase() === feature ||
          key.toLowerCase().includes(feature) ||
          feature.includes(key.toLowerCase())
      )
      return featureKey ? FEATURE_SIZES[featureKey] : null
    })
    .filter(Boolean) as (typeof FEATURE_SIZES)[keyof typeof FEATURE_SIZES][]

  // Determine recommended entry point
  let recommendedEntryPoint = 'core-minimal'
  let estimatedSize = '~30KB'

  if (featureAnalysis.some((f) => f.entryPoint === 'full' && !f.lazyLoadable)) {
    recommendedEntryPoint = 'full'
    estimatedSize = '~120KB'
  } else if (featureAnalysis.some((f) => f.entryPoint === 'core')) {
    recommendedEntryPoint = 'core'
    estimatedSize = '~60KB'
  } else if (
    featureAnalysis.some((f) => f.entryPoint === 'full' && f.lazyLoadable)
  ) {
    recommendedEntryPoint = 'core-minimal + lazy loading'
    estimatedSize = '~30KB initial + lazy loaded'
  }

  // Features included in each bundle
  const coreMinimalFeatures = ['chat', 'messages', 'input', 'streaming']
  const coreFeatures = [...coreMinimalFeatures, 'theming', 'memory']

  let includedFeatures: string[] = []
  let lazyLoadFeatures: string[] = []

  switch (recommendedEntryPoint) {
    case 'core-minimal':
      includedFeatures = coreMinimalFeatures
      break
    case 'core':
      includedFeatures = coreFeatures
      break
    case 'core-minimal + lazy loading':
      includedFeatures = coreMinimalFeatures
      lazyLoadFeatures = featureAnalysis
        .filter((f) => f.lazyLoadable)
        .map((_, i) => normalizedFeatures[i])
        .filter(Boolean)
      break
    case 'full':
      includedFeatures = ['all features']
      break
  }

  // Size breakdown
  const sizeBreakdown = featureAnalysis.map((f, i) => ({
    feature: input.features[i],
    size: f.size,
  }))

  // Optimization tips
  const optimizationTips: string[] = []

  if (recommendedEntryPoint === 'full') {
    optimizationTips.push(
      'Consider using core-minimal with lazy loading to reduce initial bundle size'
    )
  }
  if (featureAnalysis.some((f) => f.lazyLoadable)) {
    optimizationTips.push(
      'Use lazyLoadRAG, lazyLoadAnalytics, etc. for features not needed immediately'
    )
  }
  if (
    normalizedFeatures.includes('rag') ||
    normalizedFeatures.includes('vectorstores')
  ) {
    optimizationTips.push('RAG features can be lazy loaded with lazyLoadRAG()')
  }
  if (normalizedFeatures.includes('analytics')) {
    optimizationTips.push(
      'Analytics can be lazy loaded with lazyLoadAnalytics()'
    )
  }
  if (optimizationTips.length === 0) {
    optimizationTips.push(
      'Your feature set is well optimized for the recommended entry point'
    )
  }

  return {
    success: true,
    analysis: {
      recommended_entry_point:
        recommendedEntryPoint === 'core-minimal + lazy loading'
          ? '@clarity-chat/react/core-minimal'
          : recommendedEntryPoint === 'core'
            ? '@clarity-chat/react/core'
            : recommendedEntryPoint === 'full'
              ? '@clarity-chat/react'
              : '@clarity-chat/react/core-minimal',
      estimated_size: estimatedSize,
      features_included: includedFeatures,
      features_requiring_lazy_load: lazyLoadFeatures,
      size_breakdown: sizeBreakdown,
      optimization_tips: optimizationTips,
    },
  }
}
