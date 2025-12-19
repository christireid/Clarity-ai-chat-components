/**
 * Enhanced Tools for Clarity Chat MCP Server
 *
 * Additional tools for batch operations, analytics, health checks,
 * plugin management, and advanced functionality.
 *
 * @module tools/enhanced-tools
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { logger } from '../utils/logger.js'
import { ValidationError, NotFoundError } from '../utils/errors.js'
import { pluginRegistry } from '../plugins/index.js'
import {
  getServerHealth,
  getDiagnostics,
  metrics,
  formatBytes,
  formatDuration,
} from '../utils/health.js'
import { globalRateLimiter, toolRateLimiter } from '../utils/rate-limiter.js'
import { projectCache, modelCache, exampleCache } from '../utils/cache.js'
import {
  searchComponents,
  searchHooks,
  getComponent,
  getHook,
  COMPONENTS,
  HOOKS as _HOOKS,
} from '../data/component-registry.js'
import { getAllModels } from '../data/model-registry.js'
import { z as _z } from 'zod'

// =============================================================================
// Version and Counts Configuration
// =============================================================================

/** Server version - should match package.json and index.ts */
const SERVER_VERSION = '2.0.0'

/** Base resource count (without plugins) */
const BASE_RESOURCE_COUNT = 6

/** Base prompt count (without plugins) */
const BASE_PROMPT_COUNT = 10

// =============================================================================
// Enhanced Tool Definitions
// =============================================================================

export const enhancedTools: Tool[] = [
  // =========================================================================
  // Health & Diagnostics Tools
  // =========================================================================
  {
    name: 'clarity_health',
    description: `Get comprehensive health status of the Clarity Chat MCP server.

Use this tool when you want to:
- Check if the server is running properly
- Monitor server performance and resource usage
- Diagnose issues with the MCP server
- View cache statistics and hit rates

Returns: Server status, uptime, memory usage, cache stats, and health check results.

Example output:
{
  "status": "healthy",
  "uptime": "2h 30m",
  "memory": { "heapUsed": "45 MB", "heapTotal": "128 MB" },
  "checks": [
    { "name": "memory", "status": "healthy" },
    { "name": "cache", "status": "healthy" }
  ]
}`,
    inputSchema: {
      type: 'object',
      properties: {
        verbose: {
          type: 'boolean',
          description:
            'Include detailed metrics and diagnostics (default: false)',
        },
      },
      required: [],
    },
  },
  {
    name: 'clarity_metrics',
    description: `Get detailed usage metrics and statistics.

Use this tool when you want to:
- See how many tool calls have been made
- View most frequently used tools
- Check error rates
- Monitor cache performance

Returns: Comprehensive metrics including request counts, tool usage, and cache statistics.`,
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },

  // =========================================================================
  // Batch Operations Tools
  // =========================================================================
  {
    name: 'clarity_batch_get_docs',
    description: `Get documentation for multiple components or hooks in a single request.

Use this tool when you want to:
- Get docs for several components at once
- Compare multiple components
- Efficiently gather information for a feature

Returns: Array of component/hook documentation.

Example:
{
  "items": ["ClarityChat", "ChatInput", "MessageList"],
  "type": "component"
}`,
    inputSchema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { type: 'string' },
          description:
            'List of component or hook names to get documentation for',
        },
        type: {
          type: 'string',
          enum: ['component', 'hook'],
          description: 'Type of items to look up',
        },
      },
      required: ['items', 'type'],
    },
  },
  {
    name: 'clarity_batch_generate_code',
    description: `Generate code for multiple components in a single request.

Use this tool when you want to:
- Generate code for an entire feature
- Get starter code for related components
- Build a complete UI section

Returns: Array of generated code snippets.`,
    inputSchema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of component names to generate code for',
        },
        variant: {
          type: 'string',
          enum: ['basic', 'typescript', 'complete'],
          description: 'Code variant for all components',
        },
      },
      required: ['components'],
    },
  },
  {
    name: 'clarity_smart_suggest',
    description: `Get intelligent suggestions based on your current context and needs.

Use this tool when you want to:
- Get component recommendations for a use case
- Find the best tools for a specific task
- Discover related functionality

Example:
{
  "context": "building a customer support chatbot with streaming responses"
}`,
    inputSchema: {
      type: 'object',
      properties: {
        context: {
          type: 'string',
          description: 'Description of what you are trying to build or achieve',
        },
        currentComponents: {
          type: 'array',
          items: { type: 'string' },
          description: 'Components you are already using (optional)',
        },
      },
      required: ['context'],
    },
  },

  // =========================================================================
  // Plugin Management Tools
  // =========================================================================
  {
    name: 'clarity_list_plugins',
    description: `List all registered plugins and their status.

Use this tool when you want to:
- See what plugins are installed
- Check plugin status (enabled/disabled)
- View plugin metadata

Returns: List of plugins with their status and capabilities.`,
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['all', 'enabled', 'disabled'],
          description: 'Filter by plugin status (default: all)',
        },
      },
      required: [],
    },
  },
  {
    name: 'clarity_plugin_info',
    description: `Get detailed information about a specific plugin.

Use this tool when you want to:
- See what tools/resources a plugin provides
- Check plugin configuration
- View plugin documentation

Returns: Detailed plugin information including tools, resources, and prompts.`,
    inputSchema: {
      type: 'object',
      properties: {
        pluginId: {
          type: 'string',
          description: 'ID of the plugin to get information about',
        },
      },
      required: ['pluginId'],
    },
  },

  // =========================================================================
  // Cache Management Tools
  // =========================================================================
  {
    name: 'clarity_cache_stats',
    description: `Get cache statistics and performance metrics.

Use this tool when you want to:
- Check cache hit rates
- Monitor cache size
- Optimize caching behavior

Returns: Cache statistics for all cache types.`,
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'clarity_clear_cache',
    description: `Clear cached data to force fresh lookups.

Use this tool when you want to:
- Force reload of cached data
- Clear stale cache entries
- Reset cache for testing

Returns: Confirmation of cleared cache.`,
    inputSchema: {
      type: 'object',
      properties: {
        cacheType: {
          type: 'string',
          enum: ['all', 'project', 'model', 'example'],
          description: 'Type of cache to clear (default: all)',
        },
      },
      required: [],
    },
  },

  // =========================================================================
  // Search & Discovery Tools
  // =========================================================================
  {
    name: 'clarity_advanced_search',
    description: `Perform advanced search across all components, hooks, and examples.

Use this tool when you want to:
- Search with complex queries
- Find components by multiple criteria
- Get ranked search results with relevance scores

Returns: Search results with scores and match highlights.`,
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        types: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['component', 'hook', 'example', 'model'],
          },
          description: 'Types to search (default: all)',
        },
        limit: {
          type: 'number',
          description: 'Maximum results per type (default: 5)',
        },
        fuzzy: {
          type: 'boolean',
          description: 'Enable fuzzy matching (default: true)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'clarity_component_tree',
    description: `Get a hierarchical tree view of components and their relationships.

Use this tool when you want to:
- Understand component composition
- See parent-child relationships
- Plan component architecture

Returns: Tree structure of components and their relationships.`,
    inputSchema: {
      type: 'object',
      properties: {
        rootComponent: {
          type: 'string',
          description: 'Root component to start from (default: ClarityChat)',
        },
        depth: {
          type: 'number',
          description: 'Maximum tree depth (default: 3)',
        },
      },
      required: [],
    },
  },

  // =========================================================================
  // Comparison & Analysis Tools
  // =========================================================================
  {
    name: 'clarity_compare_components',
    description: `Compare two or more components side by side.

Use this tool when you want to:
- Understand differences between similar components
- Choose the right component for your use case
- Compare props and features

Returns: Side-by-side comparison of components.`,
    inputSchema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of component names to compare',
          minItems: 2,
          maxItems: 5,
        },
      },
      required: ['components'],
    },
  },
  {
    name: 'clarity_feature_matrix',
    description: `Get a feature matrix showing which components support which features.

Use this tool when you want to:
- Find components with specific features
- Compare feature support across components
- Plan feature implementation

Returns: Matrix of components and their supported features.`,
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (optional)',
        },
        features: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific features to check (optional)',
        },
      },
      required: [],
    },
  },
]

// =============================================================================
// Enhanced Tool Handlers
// =============================================================================

export async function handleEnhancedToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  logger.debug('Enhanced tool call received', { tool: name, args })

  switch (name) {
    case 'clarity_health':
      return handleHealth(args)

    case 'clarity_metrics':
      return handleMetrics()

    case 'clarity_batch_get_docs':
      return handleBatchGetDocs(args)

    case 'clarity_batch_generate_code':
      return handleBatchGenerateCode(args)

    case 'clarity_smart_suggest':
      return handleSmartSuggest(args)

    case 'clarity_list_plugins':
      return handleListPlugins(args)

    case 'clarity_plugin_info':
      return handlePluginInfo(args)

    case 'clarity_cache_stats':
      return handleCacheStats()

    case 'clarity_clear_cache':
      return handleClearCache(args)

    case 'clarity_advanced_search':
      return handleAdvancedSearch(args)

    case 'clarity_component_tree':
      return handleComponentTree(args)

    case 'clarity_compare_components':
      return handleCompareComponents(args)

    case 'clarity_feature_matrix':
      return handleFeatureMatrix(args)

    default:
      throw new ValidationError(`Unknown enhanced tool: ${name}`, {
        tool: name,
      })
  }
}

// =============================================================================
// Handler Implementations
// =============================================================================

async function handleHealth(args: Record<string, unknown>) {
  const verbose = args.verbose === true
  const pluginStats = pluginRegistry.getStats()

  // Calculate dynamic counts including plugin contributions
  const totalResources = BASE_RESOURCE_COUNT + pluginStats.resources
  const totalPrompts = BASE_PROMPT_COUNT + pluginStats.prompts

  const health = await getServerHealth(
    SERVER_VERSION,
    COMPONENTS.length + pluginStats.tools,
    totalResources,
    totalPrompts,
    { total: pluginStats.total, enabled: pluginStats.enabled }
  )

  const result: Record<string, unknown> = {
    status: health.status,
    uptime: formatDuration(health.uptime),
    timestamp: health.timestamp,
    checks: health.checks.map((c) => ({
      name: c.name,
      status: c.status,
      message: c.message,
    })),
  }

  if (verbose) {
    result.metrics = {
      memory: {
        heapUsed: formatBytes(health.metrics.memory.heapUsed),
        heapTotal: formatBytes(health.metrics.memory.heapTotal),
        rss: formatBytes(health.metrics.memory.rss),
      },
      requests: health.metrics.requests,
      cache: {
        project: {
          hitRate: `${(health.metrics.cache.project.hitRate * 100).toFixed(1)}%`,
          size: health.metrics.cache.project.size,
        },
        model: {
          hitRate: `${(health.metrics.cache.model.hitRate * 100).toFixed(1)}%`,
          size: health.metrics.cache.model.size,
        },
        example: {
          hitRate: `${(health.metrics.cache.example.hitRate * 100).toFixed(1)}%`,
          size: health.metrics.cache.example.size,
        },
      },
      plugins: health.metrics.plugins,
    }
    result.diagnostics = getDiagnostics()
  }

  return result
}

function handleMetrics() {
  const pluginStats = pluginRegistry.getStats()
  const totalResources = BASE_RESOURCE_COUNT + pluginStats.resources
  const totalPrompts = BASE_PROMPT_COUNT + pluginStats.prompts
  const serverMetrics = metrics.getMetrics(
    COMPONENTS.length + pluginStats.tools,
    totalResources,
    totalPrompts,
    pluginStats
  )

  return {
    uptime: formatDuration(metrics.getUptime()),
    requests: serverMetrics.requests,
    tools: {
      total: serverMetrics.tools.total,
      mostUsed: Object.entries(serverMetrics.tools.calls)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
      errorRates: Object.entries(serverMetrics.tools.errors).map(
        ([name, errors]) => ({
          name,
          errors,
          rate: serverMetrics.tools.calls[name]
            ? `${((errors / serverMetrics.tools.calls[name]) * 100).toFixed(1)}%`
            : '0%',
        })
      ),
    },
    cache: {
      project: projectCache.getStats(),
      model: modelCache.getStats(),
      example: exampleCache.getStats(),
    },
    rateLimit: {
      global: globalRateLimiter.getStats(),
      tools: toolRateLimiter.getStats(),
    },
  }
}

function handleBatchGetDocs(args: Record<string, unknown>) {
  const items = args.items as string[]
  const type = args.type as 'component' | 'hook'

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Items array is required and cannot be empty')
  }

  if (items.length > 20) {
    throw new ValidationError('Maximum 20 items allowed per batch request')
  }

  const results: Array<{
    name: string
    found: boolean
    docs?: unknown
    error?: string
  }> = []

  for (const name of items) {
    try {
      if (type === 'component') {
        const component = getComponent(name)
        if (component) {
          results.push({
            name,
            found: true,
            docs: {
              name: component.name,
              displayName: component.displayName,
              description: component.description,
              category: component.category,
              package: component.package,
              props: component.props,
              examples: component.examples.slice(0, 2),
              relatedComponents: component.relatedComponents,
            },
          })
        } else {
          results.push({ name, found: false, error: 'Component not found' })
        }
      } else {
        const hook = getHook(name)
        if (hook) {
          results.push({
            name,
            found: true,
            docs: {
              name: hook.name,
              displayName: hook.displayName,
              description: hook.description,
              package: hook.package,
              parameters: hook.parameters,
              returns: hook.returns,
              examples: hook.examples.slice(0, 2),
            },
          })
        } else {
          results.push({ name, found: false, error: 'Hook not found' })
        }
      }
    } catch (error) {
      results.push({
        name,
        found: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return {
    type,
    requested: items.length,
    found: results.filter((r) => r.found).length,
    results,
  }
}

function handleBatchGenerateCode(args: Record<string, unknown>) {
  const components = args.components as string[]
  const variant = (args.variant as string) || 'typescript'

  if (!components || !Array.isArray(components) || components.length === 0) {
    throw new ValidationError('Components array is required')
  }

  if (components.length > 10) {
    throw new ValidationError('Maximum 10 components allowed per batch request')
  }

  const results: Array<{
    name: string
    success: boolean
    code?: string
    imports?: string
    error?: string
  }> = []

  for (const name of components) {
    const component = getComponent(name)
    if (!component) {
      results.push({ name, success: false, error: 'Component not found' })
      continue
    }

    const imports = `import { ${component.name} } from '${component.importPath}'`
    const requiredProps = component.props.filter((p) => p.required)

    const generatePropValue = (p: { type: string }) => {
      if (p.type.includes('string')) return '"example"'
      if (p.type.includes('boolean')) return 'true'
      if (p.type.includes('number')) return '0'
      if (p.type.includes('[]')) return '[]'
      if (p.type.includes('=>')) return '() => {}'
      return 'undefined'
    }

    const propsStr = requiredProps
      .map((p) => `      ${p.name}={${generatePropValue(p)}}`)
      .join('\n')

    const code =
      variant === 'basic'
        ? `${imports}\n\nfunction Example() {\n  return (\n    <${component.name}\n${propsStr}\n    />\n  )\n}`
        : `${imports}\nimport type { ${component.name}Props } from '${component.importPath}'\n\nconst Example: React.FC = () => {\n  return (\n    <${component.name}\n${propsStr}\n    />\n  )\n}\n\nexport default Example`

    results.push({ name, success: true, code, imports })
  }

  return {
    variant,
    requested: components.length,
    generated: results.filter((r) => r.success).length,
    results,
    combinedImports: results
      .filter((r) => r.success && r.imports)
      .map((r) => r.imports)
      .join('\n'),
  }
}

function handleSmartSuggest(args: Record<string, unknown>) {
  const context = args.context as string
  const currentComponents = (args.currentComponents as string[]) || []

  if (!context) {
    throw new ValidationError('Context is required')
  }

  const contextLower = context.toLowerCase()
  const suggestions: Array<{
    type: string
    name: string
    reason: string
    priority: number
  }> = []

  // Analyze context for keywords
  const keywords = {
    streaming: ['streaming', 'real-time', 'live', 'stream'],
    voice: ['voice', 'audio', 'speech', 'talk', 'speak'],
    file: ['file', 'upload', 'attachment', 'document'],
    history: ['history', 'conversation', 'memory', 'persist'],
    error: ['error', 'retry', 'fallback', 'handle'],
    loading: ['loading', 'spinner', 'progress', 'wait'],
    chat: ['chat', 'message', 'conversation', 'bot'],
    analytics: ['analytics', 'track', 'monitor', 'usage'],
    accessibility: ['accessibility', 'a11y', 'screen reader', 'wcag'],
  }

  // Find matching keywords
  const matchedKeywords: string[] = []
  for (const [key, terms] of Object.entries(keywords)) {
    if (terms.some((term) => contextLower.includes(term))) {
      matchedKeywords.push(key)
    }
  }

  // Suggest components based on matched keywords
  const componentSuggestions: Record<
    string,
    { name: string; reason: string }[]
  > = {
    streaming: [
      {
        name: 'StreamingMessage',
        reason: 'Displays streaming responses with animation',
      },
      {
        name: 'TypingIndicator',
        reason: 'Shows when AI is generating response',
      },
    ],
    voice: [
      { name: 'VoiceInput', reason: 'Enables voice-to-text input' },
      { name: 'AudioPlayer', reason: 'Plays audio responses' },
    ],
    file: [
      { name: 'FileUpload', reason: 'Handles file attachments' },
      { name: 'FilePreview', reason: 'Previews uploaded files' },
    ],
    history: [
      { name: 'ConversationList', reason: 'Displays conversation history' },
      { name: 'MessageHistory', reason: 'Manages message persistence' },
    ],
    error: [
      { name: 'ErrorState', reason: 'Displays error messages with retry' },
      {
        name: 'RetryButton',
        reason: 'Allows users to retry failed operations',
      },
    ],
    loading: [
      { name: 'LoadingSpinner', reason: 'Shows loading state' },
      { name: 'SkeletonLoader', reason: 'Provides skeleton loading UI' },
    ],
    chat: [
      { name: 'ClarityChat', reason: 'Complete chat interface component' },
      { name: 'ChatInput', reason: 'Text input with send button' },
      { name: 'MessageList', reason: 'Scrollable message container' },
    ],
    analytics: [
      { name: 'TokenUsageDisplay', reason: 'Shows token usage and costs' },
      { name: 'AnalyticsDashboard', reason: 'Comprehensive analytics view' },
    ],
    accessibility: [
      { name: 'AccessibleChat', reason: 'Fully accessible chat component' },
    ],
  }

  // Add suggestions based on matched keywords
  let priority = 100
  for (const keyword of matchedKeywords) {
    const componentList = componentSuggestions[keyword] || []
    for (const comp of componentList) {
      if (!currentComponents.includes(comp.name)) {
        suggestions.push({
          type: 'component',
          name: comp.name,
          reason: comp.reason,
          priority: priority--,
        })
      }
    }
  }

  // Always suggest core components if not present
  const coreComponents = ['ClarityChat', 'ChatInput', 'MessageList']
  for (const core of coreComponents) {
    if (
      !currentComponents.includes(core) &&
      !suggestions.find((s) => s.name === core)
    ) {
      suggestions.push({
        type: 'component',
        name: core,
        reason: 'Core chat component',
        priority: 50,
      })
    }
  }

  // Sort by priority and limit
  suggestions.sort((a, b) => b.priority - a.priority)

  return {
    context,
    matchedKeywords,
    suggestions: suggestions.slice(0, 10),
    tip:
      matchedKeywords.length > 0
        ? `Based on your context, we found features related to: ${matchedKeywords.join(', ')}`
        : 'Try being more specific about what features you need',
  }
}

function handleListPlugins(args: Record<string, unknown>) {
  const statusFilter = (args.status as string) || 'all'
  let plugins = pluginRegistry.getAllPlugins()

  if (statusFilter === 'enabled') {
    plugins = plugins.filter((p) => p.state === 'enabled')
  } else if (statusFilter === 'disabled') {
    plugins = plugins.filter((p) => p.state === 'disabled')
  }

  return {
    total: plugins.length,
    plugins: plugins.map((p) => ({
      id: p.plugin.metadata.id,
      name: p.plugin.metadata.name,
      version: p.plugin.metadata.version,
      description: p.plugin.metadata.description,
      state: p.state,
      registeredAt: p.registeredAt.toISOString(),
      tools: p.plugin.tools?.length ?? 0,
      resources: p.plugin.resources?.length ?? 0,
      prompts: p.plugin.prompts?.length ?? 0,
    })),
    stats: pluginRegistry.getStats(),
  }
}

function handlePluginInfo(args: Record<string, unknown>) {
  const pluginId = args.pluginId as string
  if (!pluginId) {
    throw new ValidationError('Plugin ID is required')
  }

  const registered = pluginRegistry.getPlugin(pluginId)
  if (!registered) {
    throw new NotFoundError('Plugin', pluginId)
  }

  const { plugin, state, registeredAt, enabledAt, error } = registered

  return {
    id: plugin.metadata.id,
    name: plugin.metadata.name,
    version: plugin.metadata.version,
    description: plugin.metadata.description,
    author: plugin.metadata.author,
    homepage: plugin.metadata.homepage,
    license: plugin.metadata.license,
    keywords: plugin.metadata.keywords,
    state,
    registeredAt: registeredAt.toISOString(),
    enabledAt: enabledAt?.toISOString(),
    error: error?.message,
    tools: plugin.tools?.map((t) => ({
      name: t.definition.name,
      description: t.definition.description,
    })),
    resources: plugin.resources?.map((r) => ({
      uri: r.definition.uri,
      name: r.definition.name,
      description: r.definition.description,
    })),
    prompts: plugin.prompts?.map((p) => ({
      name: p.definition.name,
      description: p.definition.description,
    })),
  }
}

function handleCacheStats() {
  return {
    caches: {
      project: {
        ...projectCache.getStats(),
        description: 'Caches project analysis results',
        ttl: '30 seconds',
      },
      model: {
        ...modelCache.getStats(),
        description: 'Caches model information',
        ttl: '1 hour',
      },
      example: {
        ...exampleCache.getStats(),
        description: 'Caches code examples',
        ttl: '1 hour',
      },
    },
    totalHitRate: (() => {
      const p = projectCache.getStats()
      const m = modelCache.getStats()
      const e = exampleCache.getStats()
      const totalHits = p.hits + m.hits + e.hits
      const totalMisses = p.misses + m.misses + e.misses
      return totalHits + totalMisses > 0
        ? `${((totalHits / (totalHits + totalMisses)) * 100).toFixed(1)}%`
        : '0%'
    })(),
  }
}

function handleClearCache(args: Record<string, unknown>) {
  const cacheType = (args.cacheType as string) || 'all'

  const cleared: string[] = []

  if (cacheType === 'all' || cacheType === 'project') {
    projectCache.clear()
    cleared.push('project')
  }
  if (cacheType === 'all' || cacheType === 'model') {
    modelCache.clear()
    cleared.push('model')
  }
  if (cacheType === 'all' || cacheType === 'example') {
    exampleCache.clear()
    cleared.push('example')
  }

  return {
    success: true,
    cleared,
    message: `Cleared ${cleared.join(', ')} cache(s)`,
  }
}

function handleAdvancedSearch(args: Record<string, unknown>) {
  const query = args.query as string
  const types = (args.types as string[]) || ['component', 'hook', 'model']
  const limit = (args.limit as number) || 5
  const fuzzy = args.fuzzy !== false

  if (!query) {
    throw new ValidationError('Query is required')
  }

  const results: Record<
    string,
    Array<{ name: string; score: number; description: string }>
  > = {}

  if (types.includes('component')) {
    const components = searchComponents(query, { limit })
    results.components = components.map((c) => ({
      name: c.name,
      score: 0.9,
      description: c.description,
    }))
  }

  if (types.includes('hook')) {
    const hooks = searchHooks(query, { limit })
    results.hooks = hooks.map((h) => ({
      name: h.name,
      score: 0.9,
      description: h.description,
    }))
  }

  if (types.includes('model')) {
    const models = getAllModels()
    const queryLower = query.toLowerCase()
    const matchedModels = models
      .filter(
        (m) =>
          m.name.toLowerCase().includes(queryLower) ||
          m.provider.toLowerCase().includes(queryLower) ||
          m.capabilities.some((c) => c.toLowerCase().includes(queryLower))
      )
      .slice(0, limit)
    results.models = matchedModels.map((m) => ({
      name: m.name,
      score: 0.8,
      description: `${m.provider} - ${m.capabilities.slice(0, 3).join(', ')}`,
    }))
  }

  const totalResults = Object.values(results).reduce(
    (sum, arr) => sum + arr.length,
    0
  )

  return {
    query,
    totalResults,
    fuzzyEnabled: fuzzy,
    results,
    suggestion:
      totalResults === 0
        ? `No results found for "${query}". Try broader terms.`
        : undefined,
  }
}

function handleComponentTree(args: Record<string, unknown>) {
  const rootName = (args.rootComponent as string) || 'ClarityChat'
  const maxDepth = (args.depth as number) || 3

  interface TreeNode {
    name: string
    category: string
    children: TreeNode[]
  }

  function buildTree(
    componentName: string,
    depth: number,
    visited: Set<string>
  ): TreeNode | null {
    if (depth > maxDepth || visited.has(componentName)) {
      return null
    }

    const component = getComponent(componentName)
    if (!component) {
      return null
    }

    visited.add(componentName)

    const children: TreeNode[] = []
    for (const relatedName of component.relatedComponents.slice(0, 5)) {
      const childNode = buildTree(relatedName, depth + 1, visited)
      if (childNode) {
        children.push(childNode)
      }
    }

    return {
      name: component.name,
      category: component.category,
      children,
    }
  }

  const tree = buildTree(rootName, 0, new Set())

  if (!tree) {
    throw new NotFoundError('Component', rootName)
  }

  return {
    root: rootName,
    maxDepth,
    tree,
  }
}

function handleCompareComponents(args: Record<string, unknown>) {
  const componentNames = args.components as string[]

  if (!componentNames || componentNames.length < 2) {
    throw new ValidationError(
      'At least 2 components are required for comparison'
    )
  }

  if (componentNames.length > 5) {
    throw new ValidationError('Maximum 5 components allowed for comparison')
  }

  const components = componentNames.map((name) => {
    const component = getComponent(name)
    if (!component) {
      throw new NotFoundError('Component', name)
    }
    return component
  })

  // Get all unique prop names with reasonable limit
  const MAX_TOTAL_PROPS = 500
  const allProps = new Set<string>()
  outer: for (const c of components) {
    for (const p of c.props) {
      if (allProps.size >= MAX_TOTAL_PROPS) {
        break outer
      }
      allProps.add(p.name)
    }
  }

  const comparison = {
    components: componentNames,
    categories: components.map((c) => c.category),
    propComparison: Array.from(allProps).map((propName) => ({
      prop: propName,
      support: components.map((c) => {
        const prop = c.props.find((p) => p.name === propName)
        return prop
          ? { supported: true, required: prop.required, type: prop.type }
          : { supported: false }
      }),
    })),
    accessibility: components.map((c) => ({
      name: c.name,
      wcagLevel: c.accessibility.wcagLevel,
      keyboardShortcuts: c.accessibility.keyboardSupport.length,
    })),
    summary: {
      mostProps: components.reduce((prev, curr) =>
        prev.props.length > curr.props.length ? prev : curr
      ).name,
      mostAccessible: components.reduce((prev, curr) => {
        const levels = ['A', 'AA', 'AAA']
        return levels.indexOf(curr.accessibility.wcagLevel) >
          levels.indexOf(prev.accessibility.wcagLevel)
          ? curr
          : prev
      }).name,
    },
  }

  return comparison
}

function handleFeatureMatrix(args: Record<string, unknown>) {
  const category = args.category as string | undefined
  const requestedFeatures = args.features as string[] | undefined

  let components = COMPONENTS
  if (category) {
    components = components.filter((c) => c.category === category)
  }

  // Define feature detection rules
  const featureRules: Record<string, (c: (typeof COMPONENTS)[0]) => boolean> = {
    streaming: (c) =>
      c.name.includes('Streaming') ||
      c.tags.includes('streaming') ||
      c.props.some((p) => p.name.includes('stream')),
    voice: (c) =>
      c.name.includes('Voice') ||
      c.tags.includes('voice') ||
      c.tags.includes('audio'),
    'file-upload': (c) =>
      c.name.includes('File') ||
      c.name.includes('Upload') ||
      c.tags.includes('file'),
    accessibility: (c) =>
      c.accessibility.wcagLevel === 'AA' || c.accessibility.wcagLevel === 'AAA',
    'keyboard-support': (c) => c.accessibility.keyboardSupport.length >= 3,
    typescript: (_c) => true, // All components support TypeScript
    theming: (c) =>
      c.props.some(
        (p) =>
          p.name === 'theme' || p.name === 'className' || p.name === 'style'
      ),
  }

  const features = requestedFeatures || Object.keys(featureRules)

  const matrix = components.slice(0, 20).map((c) => {
    const featureSupport: Record<string, boolean> = {}
    for (const feature of features) {
      const rule = featureRules[feature]
      featureSupport[feature] = rule ? rule(c) : false
    }
    return {
      name: c.name,
      category: c.category,
      features: featureSupport,
    }
  })

  // Calculate feature coverage
  const coverage: Record<string, number> = {}
  for (const feature of features) {
    const supportCount = matrix.filter((m) => m.features[feature]).length
    coverage[feature] = Math.round((supportCount / matrix.length) * 100)
  }

  return {
    totalComponents: matrix.length,
    features,
    matrix,
    coverage,
    summary: {
      mostCommonFeature: Object.entries(coverage).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0],
      leastCommonFeature: Object.entries(coverage).sort(
        ([, a], [, b]) => a - b
      )[0]?.[0],
    },
  }
}
