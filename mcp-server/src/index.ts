#!/usr/bin/env node

/**
 * Clarity Chat MCP Server
 * 
 * Model Context Protocol server that enables AI agents to interact
 * with Clarity Chat projects through standardized tools and resources.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema
} from '@modelcontextprotocol/sdk/types.js'

import { tools, handleToolCall } from './tools/index.js'
import { resources, handleResourceRead } from './resources/index.js'
import { prompts, handlePromptGet } from './prompts/index.js'

/**
 * Create and configure MCP server
 */
const server = new Server(
  {
    name: 'clarity-chat',
    version: '0.1.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {}
    }
  }
)

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools }
})

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    const result = await handleToolCall(name, args || {})
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2)
        }
      ],
      isError: true
    }
  }
})

/**
 * List available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources }
})

/**
 * Read resource content
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params

  try {
    const content = await handleResourceRead(uri)
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: content
        }
      ]
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to read resource: ${errorMessage}`)
  }
})

/**
 * List available prompts
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return { prompts }
})

/**
 * Get prompt content
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    const result = await handlePromptGet(name, args || {})
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: result
          }
        }
      ]
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to get prompt: ${errorMessage}`)
  }
})

/**
 * Start server
 */
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)

  console.error('Clarity Chat MCP server running on stdio')
  console.error('Available tools:', tools.length)
  console.error('Available resources:', resources.length)
  console.error('Available prompts:', prompts.length)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
