#!/usr/bin/env node

/**
 * Clarity Chat MCP Server
 *
 * Model Context Protocol server that enables AI agents to interact
 * with Clarity Chat projects through standardized tools and resources.
 *
 * Features:
 * - 15 tools for component discovery, documentation, and project management
 * - 6 resources for docs, examples, and model information
 * - 5 prompt templates for common AI chat development tasks
 * - Comprehensive component registry with 70+ components and 35+ hooks
 * - Full accessibility (WCAG AA) documentation for all components
 * - Updated AI model pricing for 2024/2025 models
 *
 * @module mcp-server
 * @version 1.0.0
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
import { resources, handleResourceRead } from './resources/index.js'
import { prompts, handlePromptGet } from './prompts/index.js'
import { logger } from './utils/logger.js'
import { formatErrorResponse } from './utils/errors.js'

const SERVER_VERSION = '1.0.0'

/**
 * Create and configure MCP server
 */
const server = new Server(
  {
    name: 'clarity-chat',
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

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools }
})

/**
 * Handle tool calls with proper error handling
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  const requestId = `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  logger.setRequestId(requestId)

  try {
    const result = await handleToolCall(name, args || {})
    logger.info('Tool call succeeded', { tool: name })

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              data: result,
              metadata: { requestId, timestamp: new Date().toISOString() },
            },
            null,
            2
          ),
        },
      ],
    }
  } catch (error) {
    logger.error(
      'Tool call failed',
      error instanceof Error ? error : undefined,
      { tool: name }
    )
    return formatErrorResponse(error)
  } finally {
    logger.clearRequestId()
  }
})

/**
 * List available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources }
})

/**
 * Read resource content with proper MIME type detection
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params
  const requestId = `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  logger.setRequestId(requestId)

  try {
    const content = await handleResourceRead(uri)

    // Determine MIME type based on URI
    let mimeType = 'text/plain'
    if (uri.includes('/docs/')) {
      mimeType = 'text/markdown'
    } else if (uri.includes('/examples/list') || uri.includes('/models/')) {
      mimeType = 'application/json'
    }

    logger.info('Resource read succeeded', { uri })

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

/**
 * List available prompts
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return { prompts }
})

/**
 * Get prompt content with proper error handling
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  const requestId = `prompt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  logger.setRequestId(requestId)

  try {
    const result = await handlePromptGet(name, args || {})
    logger.info('Prompt generated successfully', { prompt: name })

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

/**
 * Graceful shutdown handling
 */
let isShuttingDown = false

async function shutdown(signal: string) {
  if (isShuttingDown) return
  isShuttingDown = true

  logger.info(`Received ${signal}, shutting down gracefully...`)

  try {
    // Close the server connection
    await server.close()
    logger.info('Server closed successfully')
    process.exit(0)
  } catch (error) {
    logger.error(
      'Error during shutdown',
      error instanceof Error ? error : undefined
    )
    process.exit(1)
  }
}

// Register signal handlers for graceful shutdown
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error)
  shutdown('uncaughtException')
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error(
    'Unhandled rejection',
    reason instanceof Error ? reason : new Error(String(reason))
  )
  shutdown('unhandledRejection')
})

/**
 * Start server
 */
async function main() {
  try {
    const transport = new StdioServerTransport()
    await server.connect(transport)

    logger.info('Clarity Chat MCP server started', {
      tools: tools.length,
      resources: resources.length,
      prompts: prompts.length,
      version: SERVER_VERSION,
    })
  } catch (error) {
    logger.error(
      'Fatal error starting server',
      error instanceof Error ? error : undefined
    )
    process.exit(1)
  }
}

main().catch((error) => {
  logger.error(
    'Unhandled error in main',
    error instanceof Error ? error : undefined
  )
  process.exit(1)
})
