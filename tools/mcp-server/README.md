# @clarity-chat/mcp-server

A world-class Model Context Protocol (MCP) server for Clarity Chat - enables AI assistants like Claude Desktop, Cursor, and Windsurf to interact with Clarity Chat's component library and projects.

**Version**: 2.0.0 | **Protocol**: MCP 2024-11

## Highlights

- **28+ Tools** for component discovery, code generation, project management, and more
- **Plugin System** - Extend functionality with custom plugins
- **Event-Driven Architecture** - Monitor and hook into server events
- **Rate Limiting & Caching** - Enterprise-grade performance and protection
- **Health Monitoring** - Built-in diagnostics and metrics
- **Fuzzy Search** - Intelligent component and hook discovery
- **Batch Operations** - Process multiple items in single requests
- **Recovery Suggestions** - Helpful error messages with actionable fixes

## What is MCP?

Model Context Protocol is an open protocol developed by Anthropic that standardizes how AI agents interact with external tools and data sources. This MCP server provides AI assistants with:

- Component discovery and documentation for 70+ React components
- Hook documentation for 35+ specialized React hooks
- WCAG accessibility guidance for all components
- Code generation and examples
- Updated AI model pricing and capabilities (2024/2025)
- Project management tools
- Plugin system for extensibility
- Health monitoring and diagnostics

## Features

### Core Tools (15 available)

#### Component Discovery Tools

| Tool                             | Description                                              |
| -------------------------------- | -------------------------------------------------------- |
| `clarity_discover_components`    | Search 70+ components by name, category, or use case     |
| `clarity_get_component_docs`     | Get full documentation for a component (props, examples) |
| `clarity_discover_hooks`         | Search 35+ React hooks by functionality                  |
| `clarity_get_hook_docs`          | Get documentation for a hook (parameters, return values) |
| `clarity_get_accessibility`      | Get WCAG accessibility guidance for a component          |
| `clarity_generate_code`          | Generate ready-to-use code snippets                      |
| `clarity_get_related_components` | Find components that work well together                  |
| `clarity_list_categories`        | List all component categories with counts                |

#### Project Management Tools

| Tool              | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `init_project`    | Initialize a new Clarity Chat project                    |
| `list_examples`   | List all available code examples                         |
| `get_example`     | Get code for a specific example                          |
| `validate_config` | Validate project configuration                           |
| `get_model_info`  | Get AI model info (GPT-4o, Claude 3.5, Gemini 2.0, etc.) |
| `calculate_cost`  | Calculate costs for token usage                          |
| `analyze_project` | Analyze a Clarity Chat project                           |

### Enhanced Tools (13 available)

#### Health & Diagnostics

| Tool              | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `clarity_health`  | Get comprehensive health status of the MCP server   |
| `clarity_metrics` | Get detailed usage metrics and statistics            |

#### Batch Operations

| Tool                       | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `clarity_batch_get_docs`   | Get documentation for multiple components at once  |
| `clarity_batch_generate_code` | Generate code for multiple components           |
| `clarity_smart_suggest`    | Get intelligent suggestions based on context       |

#### Plugin Management

| Tool                  | Description                                        |
| --------------------- | -------------------------------------------------- |
| `clarity_list_plugins` | List all registered plugins and their status      |
| `clarity_plugin_info` | Get detailed information about a specific plugin   |

#### Cache Management

| Tool                  | Description                                        |
| --------------------- | -------------------------------------------------- |
| `clarity_cache_stats` | Get cache statistics and performance metrics       |
| `clarity_clear_cache` | Clear cached data to force fresh lookups           |

#### Search & Discovery

| Tool                      | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `clarity_advanced_search` | Advanced search across components, hooks, models |
| `clarity_component_tree`  | Get hierarchical tree view of components         |

#### Comparison & Analysis

| Tool                       | Description                                     |
| -------------------------- | ----------------------------------------------- |
| `clarity_compare_components` | Compare multiple components side by side      |
| `clarity_feature_matrix`   | Get feature matrix for components               |

### Resources (6 available)

| Resource URI                     | Description               |
| -------------------------------- | ------------------------- |
| `clarity://docs/getting-started` | Getting started guide     |
| `clarity://docs/architecture`    | Architecture overview     |
| `clarity://docs/api-reference`   | Complete API reference    |
| `clarity://examples/list`        | List of all examples      |
| `clarity://models/pricing`       | Model pricing information |
| `clarity://models/capabilities`  | Model capabilities        |

### Prompts (10 available)

| Prompt                 | Description                                |
| ---------------------- | ------------------------------------------ |
| `implement-feature`    | Generate implementation plan               |
| `debug-issue`          | Analyze and fix issues                     |
| `optimize-performance` | Suggest optimizations                      |
| `review-code`          | Perform code review                        |
| `convert-example`      | Convert code between providers             |
| `quick-start-demo`     | Interactive 5-minute getting started guide |
| `explore-components`   | Interactive component library walkthrough  |
| `build-chatbot`        | Step-by-step chatbot building guide        |
| `accessibility-guide`  | Accessibility audit and implementation     |
| `model-comparison`     | Interactive model comparison tool          |

## Installation

### Quick Start (npx)

Once published to npm, use directly with npx:

```bash
npx @clarity-chat/mcp-server
```

### From Monorepo

```bash
# Clone the repository
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# Install dependencies (requires pnpm)
pnpm install

# Build the MCP server
pnpm --filter @clarity-chat/mcp-server build
```

## IDE Configuration

### Claude Desktop

**Config Location:**

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "clarity-chat": {
      "command": "npx",
      "args": ["-y", "@clarity-chat/mcp-server@latest"]
    }
  }
}
```

**From local build:**

```json
{
  "mcpServers": {
    "clarity-chat": {
      "command": "node",
      "args": ["/path/to/Clarity-ai-chat-components/tools/mcp-server/dist/index.js"]
    }
  }
}
```

### Cursor

**Config Location:** `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "clarity-chat": {
      "command": "npx",
      "args": ["-y", "@clarity-chat/mcp-server@latest"]
    }
  }
}
```

### Windsurf

**Config Location:** `~/.codeium/windsurf/mcp_config.json`

```json
{
  "mcpServers": {
    "clarity-chat": {
      "command": "npx",
      "args": ["-y", "@clarity-chat/mcp-server@latest"]
    }
  }
}
```

### VS Code (with Continue extension)

**Config Location:** `.vscode/mcp.json` in your project or global settings

```json
{
  "servers": {
    "clarity-chat": {
      "command": "npx",
      "args": ["-y", "@clarity-chat/mcp-server@latest"]
    }
  }
}
```

### Claude Code

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "clarity-chat": {
      "command": "npx",
      "args": ["-y", "@clarity-chat/mcp-server@latest"]
    }
  }
}
```

## Plugin System

The MCP server includes a powerful plugin system that allows you to extend functionality with custom tools, resources, and prompts.

### Creating a Plugin

```typescript
import { createPlugin, pluginRegistry } from '@clarity-chat/mcp-server/plugins'

// Create a custom plugin
const myPlugin = createPlugin()
  .metadata({
    id: 'my-custom-plugin',
    name: 'My Custom Plugin',
    version: '1.0.0',
    description: 'Adds custom functionality',
  })
  .tool(
    {
      name: 'my_custom_tool',
      description: 'Does something custom',
      inputSchema: {
        type: 'object',
        properties: {
          input: { type: 'string', description: 'Input value' }
        },
        required: ['input']
      }
    },
    async (args) => {
      return { result: `Processed: ${args.input}` }
    }
  )
  .lifecycle({
    onEnable: () => console.log('Plugin enabled!'),
    onDisable: () => console.log('Plugin disabled!'),
  })
  .build()

// Register the plugin
await pluginRegistry.register(myPlugin)
```

### Plugin Lifecycle Hooks

Plugins can hook into various lifecycle events:

- `onRegister` - Called when plugin is registered
- `onEnable` - Called when plugin is enabled
- `onDisable` - Called when plugin is disabled
- `onUnregister` - Called when plugin is unregistered
- `beforeToolCall` - Called before any tool is executed
- `afterToolCall` - Called after any tool is executed
- `onError` - Called when an error occurs

## Event System

The server emits events that you can subscribe to for monitoring and integration:

```typescript
import { serverEvents } from '@clarity-chat/mcp-server'

// Subscribe to tool calls
serverEvents.on('tool:called', ({ name, args, requestId }) => {
  console.log(`Tool ${name} called with:`, args)
})

// Subscribe to errors
serverEvents.on('tool:error', ({ name, error, requestId }) => {
  console.error(`Tool ${name} failed:`, error.message)
})

// Subscribe to server lifecycle
serverEvents.on('server:started', ({ tools, resources, prompts }) => {
  console.log(`Server started with ${tools} tools`)
})
```

### Available Events

- `server:starting`, `server:started`, `server:stopping`, `server:stopped`, `server:error`
- `tool:called`, `tool:success`, `tool:error`
- `resource:read`, `resource:success`, `resource:error`
- `prompt:get`, `prompt:success`, `prompt:error`
- `plugin:registered`, `plugin:enabled`, `plugin:disabled`, `plugin:unregistered`
- `cache:hit`, `cache:miss`, `cache:evicted`, `cache:cleared`
- `ratelimit:exceeded`, `ratelimit:warning`

## Configuration

The server can be configured via environment variables:

| Variable         | Default | Description                     |
| ---------------- | ------- | ------------------------------- |
| `MCP_RATE_LIMIT` | `true`  | Enable/disable rate limiting    |
| `MCP_METRICS`    | `true`  | Enable/disable metrics collection |
| `MCP_PLUGINS`    | `true`  | Enable/disable plugin system    |
| `MCP_LOG_LEVEL`  | `info`  | Log level (debug, info, warn, error) |

## Examples

### Component Discovery

**Find chat components:**

```
"What components are available for building a chat interface?"
```

The AI will use `clarity_discover_components` to search for relevant components.

**Get batch documentation:**

```
"Get documentation for ClarityChat, ChatInput, and MessageList"
```

The AI will use `clarity_batch_get_docs` to retrieve all docs in one request.

**Advanced search:**

```
"Search for streaming components with fuzzy matching"
```

The AI will use `clarity_advanced_search` for intelligent results.

### Health Monitoring

**Check server health:**

```
"What's the health status of the MCP server?"
```

The AI will use `clarity_health` to provide comprehensive diagnostics.

### Model Information

**Get model pricing:**

```
"What's the pricing for Claude 3.5 Sonnet?"
```

**Supported Models (2024/2025):**

| Provider  | Models                                             |
| --------- | -------------------------------------------------- |
| OpenAI    | GPT-4o, GPT-4o Mini, GPT-4 Turbo, O1, O1 Mini      |
| Anthropic | Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus |
| Google    | Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash |
| Mistral   | Mistral Large, Mistral Small, Codestral            |

## Architecture

```
tools/mcp-server/
├── src/
│   ├── index.ts              # Server entry point with enhanced features
│   ├── tools/
│   │   ├── index.ts          # Core tool handlers (15 tools)
│   │   └── enhanced-tools.ts # Enhanced tool handlers (13 tools)
│   ├── resources/            # Resource providers (6 resources)
│   ├── prompts/              # Prompt templates (10 prompts)
│   ├── plugins/
│   │   └── index.ts          # Plugin registry system
│   ├── data/
│   │   ├── component-registry.ts  # 70+ components, 35+ hooks
│   │   └── model-registry.ts      # 2024/2025 model pricing
│   └── utils/
│       ├── schemas.ts        # Zod validation schemas
│       ├── validation.ts     # Input validation
│       ├── errors.ts         # Enhanced error classes with recovery suggestions
│       ├── events.ts         # Event emitter system
│       ├── health.ts         # Health monitoring and diagnostics
│       ├── rate-limiter.ts   # Rate limiting implementation
│       ├── search.ts         # Fuzzy search utilities
│       ├── security.ts       # Path traversal prevention
│       ├── logger.ts         # Structured logging
│       └── cache.ts          # LRU cache with TTL
└── README.md
```

### Key Features

- **Plugin System** - Extend with custom tools, resources, and prompts
- **Event-Driven** - Subscribe to server events for monitoring
- **Rate Limiting** - Token bucket and sliding window protection
- **Health Monitoring** - Built-in health checks and metrics
- **Fuzzy Search** - Intelligent search with relevance scoring
- **Batch Operations** - Process multiple items efficiently
- **Recovery Suggestions** - Helpful error messages with actionable fixes
- **Zod Schema Validation** - Type-safe input validation
- **Security** - Path validation and input sanitization
- **Graceful Shutdown** - Proper cleanup on SIGINT/SIGTERM
- **Structured Logging** - Request tracing and debugging
- **Caching** - LRU cache with TTL for performance

## Development

### Building

```bash
pnpm build
```

### Running Locally

```bash
pnpm start
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

### Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Troubleshooting

### Server Not Found

If your IDE can't find the MCP server:

1. Ensure Node.js 20+ is installed: `node --version`
2. Check the config file location for your IDE
3. Restart your IDE after adding the configuration
4. Verify npx can run the package: `npx @clarity-chat/mcp-server --version`

### Connection Issues

If the server starts but tools don't work:

1. Check IDE logs for error messages
2. Ensure the MCP server is listed in your IDE's MCP panel
3. Try restarting the MCP server from your IDE

### Rate Limiting

If you're hitting rate limits:

1. Wait for the retry-after period indicated in the error
2. Consider using batch operations to reduce request count
3. Check `clarity_metrics` for current usage statistics

### Local Development Issues

```bash
# Rebuild the server
cd tools/mcp-server
pnpm build

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js

# Run tests
pnpm test
```

## Requirements

- Node.js 20.0.0 or higher
- MCP-compatible client:
  - Claude Desktop 0.5.0+
  - Cursor
  - Windsurf
  - VS Code with Continue extension
  - Claude Code

## License

MIT

## Links

- [Clarity Chat Documentation](https://github.com/christireid/Clarity-ai-chat-components)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP Specification](https://modelcontextprotocol.io/specification/2025-06-18)
- [Anthropic Claude Desktop](https://claude.ai/download)
