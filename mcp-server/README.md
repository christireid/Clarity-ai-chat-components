# @clarity-chat/mcp-server

Model Context Protocol (MCP) server for Clarity Chat - enables AI agents like Claude Desktop to interact with Clarity Chat projects through standardized tools, resources, and prompts.

## What is MCP?

Model Context Protocol is an open protocol developed by Anthropic that standardizes how AI agents interact with external tools and data sources. This MCP server exposes Clarity Chat's functionality to any MCP-compatible AI agent.

## Features

### 🛠️ Tools (7 available)

AI agents can call these tools to interact with Clarity Chat projects:

1. **init_project** - Initialize a new Clarity Chat project
2. **list_examples** - List all available code examples
3. **get_example** - Get code for a specific example
4. **validate_config** - Validate project configuration
5. **get_model_info** - Get detailed AI model information
6. **calculate_cost** - Calculate costs for token usage
7. **analyze_project** - Analyze a Clarity Chat project

### 📚 Resources (6 available)

AI agents can read these resources to learn about Clarity Chat:

1. **clarity://docs/getting-started** - Getting started guide
2. **clarity://docs/architecture** - Architecture overview
3. **clarity://docs/api-reference** - Complete API reference
4. **clarity://examples/list** - List of all examples
5. **clarity://models/pricing** - Model pricing information
6. **clarity://models/capabilities** - Model capabilities

### 💬 Prompts (5 available)

Pre-built prompt templates for common tasks:

1. **implement-feature** - Generate implementation plan
2. **debug-issue** - Analyze and fix issues
3. **optimize-performance** - Suggest optimizations
4. **review-code** - Perform code review
5. **convert-example** - Convert code between providers

## Installation

### Global Installation

```bash
npm install -g @clarity-chat/mcp-server
```

### Local Installation

```bash
npm install @clarity-chat/mcp-server
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "clarity-chat": {
      "command": "npx",
      "args": ["@clarity-chat/mcp-server"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "clarity-chat": {
      "command": "clarity-mcp"
    }
  }
}
```

### With Other MCP Clients

The server uses stdio transport and can be integrated with any MCP-compatible client:

```bash
# Run directly
clarity-mcp

# Or via npx
npx @clarity-chat/mcp-server
```

## Examples

### Using Tools

Once configured, you can ask Claude Desktop to use Clarity Chat tools:

**Example 1: Initialize a Project**
```
"Can you initialize a new Clarity Chat project with OpenAI in /path/to/my-app?"
```

Claude will use the `init_project` tool with:
```json
{
  "provider": "openai",
  "framework": "nextjs",
  "projectPath": "/path/to/my-app"
}
```

**Example 2: Get Model Information**
```
"What are the capabilities and pricing of GPT-4 Turbo?"
```

Claude will use the `get_model_info` tool:
```json
{
  "modelName": "gpt-4-turbo"
}
```

**Example 3: Calculate Costs**
```
"How much would it cost to process 1000 input tokens and 500 output tokens with Claude 3 Opus?"
```

Claude will use the `calculate_cost` tool:
```json
{
  "modelName": "claude-3-opus-20240229",
  "promptTokens": 1000,
  "completionTokens": 500
}
```

### Using Resources

Resources are automatically available to Claude:

```
"Show me the getting started guide for Clarity Chat"
```

Claude will read `clarity://docs/getting-started`

```
"What examples are available?"
```

Claude will read `clarity://examples/list`

### Using Prompts

Prompts provide structured guidance for common tasks:

```
"I need to implement a streaming chat feature with rate limiting. Can you help?"
```

Claude will use the `implement-feature` prompt with the feature description.

```
"Review this code for security issues: [paste code]"
```

Claude will use the `review-code` prompt with focus on security.

## Tool Reference

### init_project

Initialize a new Clarity Chat project.

**Parameters:**
- `provider` (required): `"openai"` | `"anthropic"` | `"google"` | `"all"`
- `framework` (required): `"nextjs"` | `"express"` | `"hono"` | `"standalone"`
- `projectPath` (required): Path where project should be created

**Returns:**
```json
{
  "success": true,
  "message": "Project initialized at /path",
  "files": [".env.local", "app/api/chat/route.ts", "package.json"],
  "nextSteps": ["cd /path", "npm install", "Add API keys", "npm run dev"]
}
```

### list_examples

List all available code examples.

**Parameters:** None

**Returns:**
```json
{
  "examples": [
    {
      "name": "basic-chat",
      "description": "Simple chat completion"
    }
  ]
}
```

### get_example

Get code for a specific example.

**Parameters:**
- `exampleName` (required): Name of the example

**Returns:**
```json
{
  "name": "basic-chat",
  "code": "import { OpenAI } from 'openai'..."
}
```

### validate_config

Validate project configuration.

**Parameters:**
- `projectPath` (required): Path to project directory

**Returns:**
```json
{
  "valid": true,
  "issues": [],
  "warnings": ["No AI provider SDK installed"]
}
```

### get_model_info

Get detailed information about an AI model.

**Parameters:**
- `modelName` (required): Name of the model (e.g., "gpt-4-turbo")

**Returns:**
```json
{
  "provider": "OpenAI",
  "contextWindow": 128000,
  "pricing": { "input": 0.01, "output": 0.03 },
  "capabilities": ["text", "code", "functions"],
  "bestFor": ["complex reasoning", "long-form content"]
}
```

### calculate_cost

Calculate cost for token usage.

**Parameters:**
- `modelName` (required): Model name
- `promptTokens` (required): Number of input tokens
- `completionTokens` (required): Number of output tokens

**Returns:**
```json
{
  "modelName": "gpt-4-turbo",
  "promptTokens": 1000,
  "completionTokens": 500,
  "totalTokens": 1500,
  "inputCost": 0.01,
  "outputCost": 0.015,
  "totalCost": 0.025,
  "currency": "USD"
}
```

### analyze_project

Analyze a Clarity Chat project.

**Parameters:**
- `projectPath` (required): Path to project directory

**Returns:**
```json
{
  "path": "/path/to/project",
  "fileCount": 42,
  "hasPackageJson": true,
  "hasEnvFile": true,
  "hasTsConfig": true,
  "providers": ["OpenAI", "Anthropic"],
  "framework": "Next.js"
}
```

## Resource Reference

All resources return markdown or JSON content:

- **clarity://docs/getting-started** - Complete getting started guide
- **clarity://docs/architecture** - System architecture documentation
- **clarity://docs/api-reference** - Full API reference for all providers
- **clarity://examples/list** - JSON list of all available examples
- **clarity://models/pricing** - JSON pricing data for all models
- **clarity://models/capabilities** - JSON capabilities data for all models

## Prompt Reference

### implement-feature

Generate implementation plan for a new feature.

**Arguments:**
- `feature` (required): Description of feature to implement
- `provider` (optional): AI provider to use

**Output:** Detailed implementation plan with code examples

### debug-issue

Analyze and suggest fixes for an issue.

**Arguments:**
- `issue` (required): Description of the issue
- `code` (optional): Relevant code snippet

**Output:** Root cause analysis and step-by-step fix

### optimize-performance

Suggest performance optimizations.

**Arguments:**
- `context` (required): Context about current implementation

**Output:** Optimization suggestions with code examples

### review-code

Perform code review.

**Arguments:**
- `code` (required): Code to review
- `focus` (optional): Aspect to focus on (security, performance, readability)

**Output:** Comprehensive code review with suggested improvements

### convert-example

Convert code to different provider/framework.

**Arguments:**
- `code` (required): Original code
- `from` (required): Source provider/framework
- `to` (required): Target provider/framework

**Output:** Converted code with migration notes

## Development

### Building

```bash
npm run build
```

### Running Locally

```bash
npm start
```

### Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx @clarity-chat/mcp-server
```

## Architecture

The MCP server is organized into three main modules:

1. **Tools** (`src/tools/`) - Executable operations
2. **Resources** (`src/resources/`) - Read-only documentation and data
3. **Prompts** (`src/prompts/`) - Templated prompts for common tasks

Each module exports:
- List of available items
- Handler function for requests

## Requirements

- Node.js 18.0.0 or higher
- MCP-compatible client (e.g., Claude Desktop 0.5.0+)

## License

MIT

## Links

- [Clarity Chat Documentation](https://github.com/clarity-chat/clarity-chat)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Anthropic Claude Desktop](https://claude.ai/download)
