# @clarity-chat/mcp-server

Model Context Protocol (MCP) server for Clarity Chat - enables AI assistants like Claude Desktop,
Cursor, and Windsurf to interact with Clarity Chat's component library and projects.

**Version**: 1.0.0 | **Protocol**: MCP 2024-11

## What is MCP?

Model Context Protocol is an open protocol developed by Anthropic that standardizes how AI agents
interact with external tools and data sources. This MCP server provides AI assistants with:

- Component discovery and documentation for 70+ React components
- Hook documentation for 35+ specialized React hooks
- WCAG accessibility guidance for all components
- Code generation and examples
- Updated AI model pricing and capabilities (2024/2025)
- Project management tools

## Features

### Tools (15 available)

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

### Resources (6 available)

| Resource URI                     | Description               |
| -------------------------------- | ------------------------- |
| `clarity://docs/getting-started` | Getting started guide     |
| `clarity://docs/architecture`    | Architecture overview     |
| `clarity://docs/api-reference`   | Complete API reference    |
| `clarity://examples/list`        | List of all examples      |
| `clarity://models/pricing`       | Model pricing information |
| `clarity://models/capabilities`  | Model capabilities        |

### Prompts (5 available)

| Prompt                 | Description                    |
| ---------------------- | ------------------------------ |
| `implement-feature`    | Generate implementation plan   |
| `debug-issue`          | Analyze and fix issues         |
| `optimize-performance` | Suggest optimizations          |
| `review-code`          | Perform code review            |
| `convert-example`      | Convert code between providers |

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

## Examples

### Component Discovery

**Find chat components:**

```
"What components are available for building a chat interface?"
```

The AI will use `clarity_discover_components` to search for relevant components.

**Get component documentation:**

```
"How do I use the ClarityChat component? What props does it accept?"
```

The AI will use `clarity_get_component_docs` to retrieve full documentation.

**Get accessibility guidance:**

```
"What accessibility requirements does the ChatInput component have?"
```

The AI will use `clarity_get_accessibility` to provide WCAG guidance.

### Code Generation

**Generate component code:**

```
"Generate code to integrate the TokenBudgetBar component"
```

The AI will use `clarity_generate_code` to provide ready-to-use code.

### Model Information

**Get model pricing:**

```
"What's the pricing for Claude 3.5 Sonnet?"
```

The AI will use `get_model_info` with updated 2024/2025 pricing:

```json
{
  "id": "claude-3-5-sonnet-20241022",
  "name": "Claude 3.5 Sonnet (Oct 2024)",
  "provider": "Anthropic",
  "contextWindow": 200000,
  "pricing": {
    "input": 3.0,
    "output": 15.0,
    "cached": 0.3,
    "formatted": "Input: $3.00/1M tokens, Output: $15.00/1M tokens, Cached: $0.30/1M tokens"
  },
  "capabilities": ["text", "code", "vision", "tool-use", "streaming"],
  "bestFor": ["coding", "analysis", "writing", "general-purpose"]
}
```

**Supported Models (2024/2025):**

| Provider  | Models                                             |
| --------- | -------------------------------------------------- |
| OpenAI    | GPT-4o, GPT-4o Mini, GPT-4 Turbo, O1, O1 Mini      |
| Anthropic | Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus |
| Google    | Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash |
| Mistral   | Mistral Large, Mistral Small, Codestral            |

### Project Management

**Initialize a new project:**

```
"Create a new Clarity Chat project with OpenAI at ~/my-chat-app"
```

**Analyze existing project:**

```
"Analyze my project at ./apps/chat to see what's configured"
```

## Tool Reference

### clarity_discover_components

Search and discover Clarity Chat React components.

**Parameters:**

- `query` (required): Search query (e.g., "chat input", "message list")
- `category` (optional): Filter by category
- `limit` (optional): Max results (default: 10, max: 50)

**Categories:** `top-level`, `chat`, `message`, `input`, `display`, `feedback`, `navigation`,
`analytics`, `enterprise`, `ai-ops`, `memory`, `primitives`, `hooks`, `utilities`

### clarity_get_component_docs

Get comprehensive documentation for a component.

**Parameters:**

- `componentName` (required): Name of the component (e.g., "ClarityChat", "ChatInput")

**Returns:** Props, examples, related components, tags

### clarity_get_accessibility

Get WCAG accessibility guidance for a component.

**Parameters:**

- `componentName` (required): Name of the component

**Returns:**

```json
{
  "wcagLevel": "AA",
  "keyboardSupport": ["Tab navigation", "Enter to send"],
  "ariaAttributes": ["aria-live=\"polite\"", "aria-label"],
  "screenReaderNotes": "Messages are announced as they arrive",
  "focusManagement": "Focus returns to input after sending"
}
```

### clarity_generate_code

Generate ready-to-use code snippets.

**Parameters:**

- `componentName` (required): Name of the component
- `variant` (optional): Specific variant or style
- `withProvider` (optional): Include provider wrapper (default: false)
- `typescript` (optional): Generate TypeScript (default: true)

### get_model_info

Get detailed AI model information.

**Parameters:**

- `modelName` (required): Model ID or alias (e.g., "gpt-4o", "claude-sonnet", "gemini-pro")

**Aliases Supported:** `gpt4`, `claude-sonnet`, `sonnet`, `haiku`, `opus`, `gemini-pro`,
`gemini-flash`

### calculate_cost

Calculate cost for token usage with 2024/2025 pricing.

**Parameters:**

- `modelName` (required): Model name
- `promptTokens` (required): Number of input tokens
- `completionTokens` (required): Number of output tokens

**Returns:**

```json
{
  "modelId": "gpt-4o",
  "inputTokens": 1000,
  "outputTokens": 500,
  "inputCost": 0.0025,
  "outputCost": 0.005,
  "totalCost": 0.0075,
  "currency": "USD"
}
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

### Tool Not Working

If a specific tool fails:

1. Check the error message in the response
2. Verify required parameters are provided
3. For component tools, ensure the component name is correct (case-insensitive)

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

## Architecture

```
tools/mcp-server/
├── src/
│   ├── index.ts           # Server entry point with graceful shutdown
│   ├── tools/             # Tool handlers (15 tools)
│   ├── resources/         # Resource providers (6 resources)
│   ├── prompts/           # Prompt templates (5 prompts)
│   ├── data/
│   │   ├── component-registry.ts  # 70+ components, 35+ hooks
│   │   └── model-registry.ts      # 2024/2025 model pricing
│   └── utils/
│       ├── schemas.ts     # Zod validation schemas
│       ├── validation.ts  # Input validation
│       ├── errors.ts      # Custom error classes
│       ├── security.ts    # Path traversal prevention
│       ├── logger.ts      # Structured logging
│       └── cache.ts       # LRU cache with TTL
└── README.md
```

### Key Features

- **Zod Schema Validation** - Type-safe input validation
- **Comprehensive Error Handling** - Structured errors with codes
- **Security** - Path validation and input sanitization
- **Graceful Shutdown** - Proper cleanup on SIGINT/SIGTERM
- **Structured Logging** - Request tracing and debugging
- **Caching** - Resource caching for performance
- **Type Safety** - Full TypeScript with strict mode

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
