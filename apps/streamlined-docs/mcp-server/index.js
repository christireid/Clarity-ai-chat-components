#!/usr/bin/env node
/**
 * Clarity Chat MCP Server
 *
 * Model Context Protocol server for exposing Clarity Chat documentation
 * to AI systems like Claude Code.
 *
 * This server provides tools for:
 * - Listing all available components and their props
 * - Looking up specific component documentation
 * - Searching across all documentation
 * - Getting hook information
 *
 * Usage:
 *   npx ts-node mcp-server/index.ts
 *
 * Or add to Claude Code MCP config:
 *   {
 *     "mcpServers": {
 *       "clarity-chat": {
 *         "command": "npx",
 *         "args": ["ts-node", "apps/docs/mcp-server/index.ts"]
 *       }
 *     }
 *   }
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
const BASE_URL = 'https://clarity-chat.dev';
/**
 * Fetch data from the AI API
 */
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}/api/ai${endpoint}`);
        return (await response.json());
    }
    catch (error) {
        return {
            error: {
                code: 'FETCH_ERROR',
                message: error instanceof Error ? error.message : 'Failed to fetch data',
            },
        };
    }
}
/**
 * Create the MCP server
 */
const server = new Server({
    name: 'clarity-chat-docs',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'list_components',
                description: 'List all available Clarity Chat React components with their descriptions and categories',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'get_component',
                description: 'Get detailed documentation for a specific Clarity Chat component, including props, examples, and accessibility info',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the component (e.g., "ChatInput", "MessageList")',
                        },
                    },
                    required: ['name'],
                },
            },
            {
                name: 'list_hooks',
                description: 'List all available Clarity Chat React hooks with their descriptions and categories',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'get_hook',
                description: 'Get detailed documentation for a specific Clarity Chat hook, including parameters, return values, and examples',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the hook (e.g., "useChat", "useStreaming")',
                        },
                    },
                    required: ['name'],
                },
            },
            {
                name: 'search_docs',
                description: 'Search Clarity Chat documentation for components, hooks, guides, and examples',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Search query',
                        },
                        type: {
                            type: 'string',
                            enum: ['component', 'hook', 'guide', 'example', 'cookbook'],
                            description: 'Filter by content type',
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum number of results (default: 10)',
                        },
                    },
                },
            },
            {
                name: 'health_check',
                description: 'Check the health status of the Clarity Chat documentation API',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
        ],
    };
});
/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case 'list_components': {
            const data = await fetchAPI('/components');
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        case 'get_component': {
            const componentName = args.name;
            const data = await fetchAPI(`/components/${encodeURIComponent(componentName)}`);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        case 'list_hooks': {
            const data = await fetchAPI('/hooks');
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        case 'get_hook': {
            const hookName = args.name;
            const data = await fetchAPI(`/hooks/${encodeURIComponent(hookName)}`);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        case 'search_docs': {
            const { query, type, limit } = args;
            const params = new URLSearchParams();
            if (query)
                params.set('q', query);
            if (type)
                params.set('type', type);
            if (limit)
                params.set('limit', limit.toString());
            const data = await fetchAPI(`/search?${params.toString()}`);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        case 'health_check': {
            const data = await fetchAPI('/health');
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
});
/**
 * Main entry point
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Clarity Chat MCP Server running on stdio');
}
main().catch(console.error);
//# sourceMappingURL=index.js.map