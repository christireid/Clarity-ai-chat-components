#!/usr/bin/env node

/**
 * Clarity Chat MCP Server - Enhanced Edition
 *
 * A world-class Model Context Protocol server that enables AI agents to interact
 * with Clarity Chat projects through standardized tools, resources, and prompts.
 *
 * Features:
 * - 28+ tools for component discovery, documentation, project management, and more
 * - 6+ resources for docs, examples, and model information
 * - 10+ prompt templates for common AI chat development tasks
 * - Comprehensive component registry with 70+ components and 35+ hooks
 * - Full accessibility (WCAG AA) documentation for all components
 * - Updated AI model pricing for 2024/2025 models
 * - Plugin system for extending functionality
 * - Event-driven architecture for monitoring
 * - Rate limiting and caching for optimal performance
 * - Health checks and diagnostics
 *
 * @module mcp-server
 * @version 2.0.0
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

import { tools, handleToolCall } from './tools/index.js'
import { enhancedTools, handleEnhancedToolCall } from './tools/enhanced-tools.js'
import { resources, handleResourceRead } from './resources/index.js'
import { prompts, handlePromptGet } from './prompts/index.js'
import { pluginRegistry } from './plugins/index.js'
import { logger } from './utils/logger.js'
import { formatErrorResponse, ValidationError } from './utils/errors.js'
import { serverEvents } from './utils/events.js'
import { metrics, healthChecker } from './utils/health.js'
import {
  globalRateLimiter,
  toolRateLimiter,
  createRateLimitError,
} from './utils/rate-limiter.js'
import { stopCacheCleanup } from './utils/cache.js'

// =============================================================================
// Server Configuration
// =============================================================================

const SERVER_VERSION = '2.0.0'
const SERVER_NAME = 'clarity-chat-mcp'

/**
 * Server configuration options
 */
interface ServerConfig {
  /** Enable rate limiting (default: true) */
  rateLimit: boolean
  /** Enable metrics collection (default: true) */
  metrics: boolean
  /** Enable plugin system (default: true) */
  plugins: boolean
  /** Log level */
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

const config: ServerConfig = {
  rateLimit: process.env.MCP_RATE_LIMIT !== 'false',
  metrics: process.env.MCP_METRICS !== 'false',
  plugins: process.env.MCP_PLUGINS !== 'false',
  logLevel: (process.env.MCP_LOG_LEVEL as ServerConfig['logLevel']) || 'info',
}

// =============================================================================
// Combined Tool Lists
// =============================================================================

/**
 * Get all available tools including core, enhanced, and plugin tools
 */
function getAllTools() {
  const coreTools = [...tools, ...enhancedTools]
  const pluginTools = config.plugins ? pluginRegistry.getAllTools() : []
  return [...coreTools, ...pluginTools]
}

/**
 * Get all available resources including core and plugin resources
 */
function getAllResources() {
  const pluginResources = config.plugins ? pluginRegistry.getAllResources() : []
  return [...resources, ...pluginResources]
}

/**
 * Get all available prompts including core and plugin prompts
 */
function getAllPrompts() {
  const pluginPrompts = config.plugins ? pluginRegistry.getAllPrompts() : []
  return [...prompts, ...pluginPrompts]
}

// =============================================================================
// Server Initialization
// =============================================================================

/**
 * Create and configure MCP server
 */
const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
)

// =============================================================================
// Tool Handlers
// =============================================================================

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const allTools = getAllTools()
  logger.debug('Listing tools', { count: allTools.length })
  return { tools: allTools }
})

/**
 * Handle tool calls with comprehensive error handling, rate limiting, and metrics
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  const requestId = `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()

  logger.setRequestId(requestId)

  try {
    // Emit event for monitoring
    serverEvents.emit('tool:called', {
      name,
      args: args || {},
      requestId,
    })

    // Check rate limits
    if (config.rateLimit) {
      // Check global rate limit
      const globalResult = globalRateLimiter.check({
        type: 'tool',
        name,
        timestamp: Date.now(),
      })
      if (!globalResult.allowed) {
        throw createRateLimitError(globalResult)
      }

      // Check per-tool rate limit
      const toolResult = toolRateLimiter.check({
        type: 'tool',
        name,
        timestamp: Date.now(),
      })
      if (!toolResult.allowed) {
        throw createRateLimitError(toolResult)
      }
    }

    // Execute plugin before-hooks
    let processedArgs = args || {}
    if (config.plugins) {
      processedArgs = await pluginRegistry.executeBeforeToolCallHooks(
        name,
        processedArgs
      )
    }

    // Route to appropriate handler
    let result: unknown

    // Check if it's a core tool
    const isCoreToolName = tools.some((t) => t.name === name)
    const isEnhancedToolName = enhancedTools.some((t) => t.name === name)
    const isPluginTool = config.plugins && pluginRegistry.hasToolHandler(name)

    if (isCoreToolName) {
      result = await handleToolCall(name, processedArgs)
    } else if (isEnhancedToolName) {
      result = await handleEnhancedToolCall(name, processedArgs)
    } else if (isPluginTool) {
      const handler = pluginRegistry.getToolHandler(name)
      if (handler) {
        result = await handler(processedArgs)
      } else {
        throw new ValidationError(`Tool handler not found: ${name}`)
      }
    } else {
      throw new ValidationError(`Unknown tool: ${name}`, { tool: name })
    }

    // Execute plugin after-hooks
    if (config.plugins) {
      result = await pluginRegistry.executeAfterToolCallHooks(name, result)
    }

    // Record metrics
    const duration = Date.now() - startTime
    if (config.metrics) {
      metrics.recordRequest(duration, true)
      metrics.recordToolCall(name, true)
    }

    // Emit success event
    serverEvents.emit('tool:success', {
      name,
      duration,
      requestId,
    })

    logger.info('Tool call succeeded', { tool: name, duration })

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              data: result,
              metadata: {
                requestId,
                timestamp: new Date().toISOString(),
                duration: `${duration}ms`,
                version: SERVER_VERSION,
              },
            },
            null,
            2
          ),
        },
      ],
    }
  } catch (error) {
    const duration = Date.now() - startTime

    // Record error metrics
    if (config.metrics) {
      metrics.recordRequest(duration, false)
      metrics.recordToolCall(name, false)
    }

    // Emit error event
    serverEvents.emit('tool:error', {
      name,
      error: error instanceof Error ? error : new Error(String(error)),
      requestId,
    })

    logger.error(
      'Tool call failed',
      error instanceof Error ? error : undefined,
      { tool: name, duration }
    )

    return formatErrorResponse(error)
  } finally {
    logger.clearRequestId()
  }
})

// =============================================================================
// Resource Handlers
// =============================================================================

/**
 * List available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const allResources = getAllResources()
  logger.debug('Listing resources', { count: allResources.length })
  return { resources: allResources }
})

/**
 * Read resource content with proper MIME type detection
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params
  const requestId = `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()

  logger.setRequestId(requestId)

  try {
    // Emit event
    serverEvents.emit('resource:read', { uri, requestId })

    // Check for plugin resource handler
    let content: string
    const pluginHandler =
      config.plugins && pluginRegistry.getResourceHandler(uri)

    if (pluginHandler) {
      content = await pluginHandler()
    } else {
      content = await handleResourceRead(uri)
    }

    // Determine MIME type based on URI
    let mimeType = 'text/plain'
    if (uri.includes('/docs/')) {
      mimeType = 'text/markdown'
    } else if (
      uri.includes('/examples/list') ||
      uri.includes('/models/') ||
      uri.includes('/plugins/') ||
      uri.includes('/health/')
    ) {
      mimeType = 'application/json'
    }

    const duration = Date.now() - startTime
    if (config.metrics) {
      metrics.recordResourceRead(uri)
    }

    serverEvents.emit('resource:success', { uri, duration, requestId })
    logger.info('Resource read succeeded', { uri, duration })

    return {
      contents: [
        {
          uri,
          mimeType,
          text: content,
        },
      ],
    }
  } catch (error) {
    serverEvents.emit('resource:error', {
      uri,
      error: error instanceof Error ? error : new Error(String(error)),
      requestId,
    })

    logger.error(
      'Resource read failed',
      error instanceof Error ? error : undefined,
      { uri }
    )
    throw error
  } finally {
    logger.clearRequestId()
  }
})

// =============================================================================
// Prompt Handlers
// =============================================================================

/**
 * List available prompts
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  const allPrompts = getAllPrompts()
  logger.debug('Listing prompts', { count: allPrompts.length })
  return { prompts: allPrompts }
})

/**
 * Get prompt content with proper error handling
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  const requestId = `prompt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()

  logger.setRequestId(requestId)

  try {
    serverEvents.emit('prompt:get', {
      name,
      args: args || {},
      requestId,
    })

    // Check for plugin prompt handler
    let result: string
    const pluginHandler =
      config.plugins && pluginRegistry.getPromptHandler(name)

    if (pluginHandler) {
      result = await pluginHandler(args || {})
    } else {
      result = await handlePromptGet(name, args || {})
    }

    const duration = Date.now() - startTime
    if (config.metrics) {
      metrics.recordPromptGet(name)
    }

    serverEvents.emit('prompt:success', { name, duration, requestId })
    logger.info('Prompt generated successfully', { prompt: name, duration })

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: result,
          },
        },
      ],
    }
  } catch (error) {
    serverEvents.emit('prompt:error', {
      name,
      error: error instanceof Error ? error : new Error(String(error)),
      requestId,
    })

    logger.error(
      'Prompt generation failed',
      error instanceof Error ? error : undefined,
      { prompt: name }
    )
    throw error
  } finally {
    logger.clearRequestId()
  }
})

// =============================================================================
// Graceful Shutdown
// =============================================================================

let isShuttingDown = false

async function shutdown(signal: string) {
  if (isShuttingDown) return
  isShuttingDown = true

  const uptime = metrics.getUptime()
  logger.info(`Received ${signal}, shutting down gracefully...`, { uptime })

  // Emit shutdown event
  serverEvents.emit('server:stopping', { reason: signal })

  try {
    // Stop cache cleanup
    stopCacheCleanup()

    // Stop rate limiter cleanup
    globalRateLimiter.destroy()
    toolRateLimiter.destroy()

    // Close the server connection
    await server.close()

    serverEvents.emit('server:stopped', { uptime })
    logger.info('Server closed successfully', { uptime })

    process.exit(0)
  } catch (error) {
    logger.error(
      'Error during shutdown',
      error instanceof Error ? error : undefined
    )
    process.exit(1)
  }
}

// Register signal handlers
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error)
  serverEvents.emit('server:error', { error, fatal: true })
  shutdown('uncaughtException')
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason))
  logger.error('Unhandled rejection', error)
  serverEvents.emit('server:error', { error, fatal: true })
  shutdown('unhandledRejection')
})

// =============================================================================
// Server Startup
// =============================================================================

async function main() {
  try {
    // Emit starting event
    serverEvents.emit('server:starting', { version: SERVER_VERSION })

    // Initialize transport
    const transport = new StdioServerTransport()
    await server.connect(transport)

    const allTools = getAllTools()
    const allResources = getAllResources()
    const allPrompts = getAllPrompts()
    const pluginStats = pluginRegistry.getStats()

    // Emit started event
    serverEvents.emit('server:started', {
      tools: allTools.length,
      resources: allResources.length,
      prompts: allPrompts.length,
    })

    logger.info('Clarity Chat MCP server started', {
      version: SERVER_VERSION,
      tools: allTools.length,
      resources: allResources.length,
      prompts: allPrompts.length,
      plugins: pluginStats.enabled,
      rateLimit: config.rateLimit,
      metrics: config.metrics,
    })

    // Log feature summary
    logger.info('Server features', {
      coreTools: tools.length,
      enhancedTools: enhancedTools.length,
      pluginTools: pluginStats.tools,
      totalTools: allTools.length,
    })
  } catch (error) {
    logger.error(
      'Fatal error starting server',
      error instanceof Error ? error : undefined
    )
    serverEvents.emit('server:error', {
      error: error instanceof Error ? error : new Error(String(error)),
      fatal: true,
    })
    process.exit(1)
  }
}

// =============================================================================
// Export for programmatic usage
// =============================================================================

export {
  server,
  SERVER_VERSION,
  SERVER_NAME,
  config,
  getAllTools,
  getAllResources,
  getAllPrompts,
  pluginRegistry,
  serverEvents,
  metrics,
  healthChecker,
}

// Start the server
main().catch((error) => {
  logger.error(
    'Unhandled error in main',
    error instanceof Error ? error : undefined
  )
  process.exit(1)
})
