# Clarity Chat - VS Code Extension

Supercharge your AI development workflow with intelligent code completion, snippets, and productivity tools for the Clarity Chat framework.

## Features

### 🎯 Intelligent Code Completion

Get context-aware suggestions for:
- **AI Model Names** - Auto-complete model names with pricing and capability info
- **Environment Variables** - Suggestions for API keys and configuration
- **API Parameters** - Parameter hints for all AI provider SDKs

![Completion Demo](https://via.placeholder.com/600x300?text=Completion+Demo)

### 💡 Hover Documentation

Hover over any element to see detailed information:
- **Model Information** - Context window, pricing, capabilities, best use cases
- **API Keys** - Setup instructions and links to get keys
- **Code Patterns** - Inline documentation for common patterns

![Hover Demo](https://via.placeholder.com/600x300?text=Hover+Demo)

### 📖 Code Snippets

60+ production-ready code snippets for:
- **OpenAI** - GPT-4, GPT-3.5 Turbo completions and streaming
- **Anthropic** - Claude 3 Opus, Sonnet, Haiku
- **Google AI** - Gemini Pro models
- **React Components** - Chat UI, hooks, message bubbles
- **Next.js API Routes** - Server-side endpoints with streaming
- **Utilities** - Error handling, cost tracking, RAG patterns

### 🔍 CodeLens Hints

See inline hints for:
- API call detection with provider info
- Quick links to documentation
- Test API call buttons

### ⚡ Commands

Access powerful commands via Command Palette (`Cmd/Ctrl+Shift+P`):

- **Clarity Chat: Initialize Project** - Set up a new project with AI providers
- **Clarity Chat: Add Provider** - Add OpenAI, Anthropic, or Google AI to existing project
- **Clarity Chat: Validate Configuration** - Check for common issues and misconfigurations
- **Clarity Chat: Show Examples** - Browse and insert code examples

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Cmd/Ctrl+Shift+X`)
3. Search for "Clarity Chat"
4. Click Install

### From VSIX File

```bash
code --install-extension clarity-chat-0.1.0.vsix
```

## Quick Start

1. **Initialize a New Project**
   - Open Command Palette (`Cmd/Ctrl+Shift+P`)
   - Run `Clarity Chat: Initialize Project`
   - Select your AI provider(s)
   - Select your framework (Next.js, Express, Hono, or Standalone)

2. **Use Code Snippets**
   - Type `cc-` in any TypeScript/JavaScript file
   - Browse available snippets
   - Select and customize

3. **Add a Provider**
   - Run `Clarity Chat: Add Provider`
   - Follow setup instructions
   - Get your API key
   - Add to `.env.local`

## Code Snippets Reference

### TypeScript/JavaScript

| Prefix | Description |
|--------|-------------|
| `cc-import` | Import AI provider SDK |
| `cc-openai-chat` | OpenAI chat completion |
| `cc-openai-stream` | OpenAI streaming chat |
| `cc-anthropic-chat` | Anthropic chat completion |
| `cc-anthropic-stream` | Anthropic streaming chat |
| `cc-google-chat` | Google AI chat completion |
| `cc-google-stream` | Google AI streaming chat |
| `cc-api-openai` | Next.js API route with OpenAI |
| `cc-api-stream` | Streaming API route with SSE |
| `cc-error-handler` | Error handling wrapper |
| `cc-token-counter` | Token estimation and cost calculation |
| `cc-rag-processor` | RAG document chunking |
| `cc-message-interface` | Chat message interfaces |
| `cc-env-check` | Environment variables validation |
| `cc-retry` | Retry logic with exponential backoff |

### React/TSX

| Prefix | Description |
|--------|-------------|
| `cc-react-chat` | Complete React chat component |
| `cc-react-stream` | React streaming chat component |
| `cc-use-chat` | Custom useChat hook |
| `cc-message-bubble` | Message bubble component |
| `cc-chat-input` | Chat input component |

## Configuration

Access settings via `Preferences > Settings > Clarity Chat`:

- **Enable IntelliSense** (default: `true`) - Enable code completion
- **Enable CodeLens** (default: `true`) - Show inline hints
- **Default Provider** (default: `openai`) - Default AI provider for snippets
- **Show Inline Hints** (default: `true`) - Show parameter hints

## Commands Reference

### Initialize Project

Set up a new Clarity Chat project with:
- AI provider selection (OpenAI, Anthropic, Google, or All)
- Framework choice (Next.js, Express, Hono, Standalone)
- Automatic `.env.local` template creation
- Example code generation
- Dependency installation instructions

### Add Provider

Add a new AI provider to existing project:
- Package installation guidance
- API key setup instructions
- Environment variable configuration
- Example code for the provider

### Validate Configuration

Run comprehensive validation checks:
- Check for required files (`package.json`, `.env.local`, `tsconfig.json`)
- Verify AI SDK installations
- Scan for hardcoded API keys
- Check for missing error handling
- TypeScript configuration validation

### Show Examples

Browse and insert 8 common patterns:
- **Basic Chat** - Simple chat completion
- **Streaming Chat** - Real-time streaming responses
- **Next.js API Route** - Server-side API endpoint
- **React Hook** - Custom `useChat` hook
- **Multi-turn Conversation** - Conversation history management
- **Function Calling** - OpenAI function calling/tools
- **Cost Tracking** - Token usage and cost calculation
- **RAG Pattern** - Retrieval Augmented Generation

## IntelliSense Features

### Model Completion

When typing model names, get auto-complete with:
- **Model name** and display name
- **Context window** size
- **Pricing** (input/output per 1K tokens)
- **Link to documentation**

Example models:
- `gpt-4-turbo` - Latest GPT-4 (128K context, $0.01/$0.03)
- `claude-3-opus-20240229` - Most capable Claude (200K context, $0.015/$0.075)
- `gemini-pro` - Google AI model (32K context, $0.00025/$0.0005)

### Environment Variable Completion

Get suggestions for:
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`

With hover documentation showing:
- Provider name
- How to get API key
- Setup instructions

## Hover Documentation

### Model Information

Hover over model names to see:
- Full model description
- Context window size
- Detailed pricing
- Capabilities (text generation, code, function calling, vision)
- Best use cases
- Link to official documentation

### API Keys

Hover over environment variables to see:
- Provider information
- Link to get API key
- Setup instructions for `.env.local`
- Code example for loading the key

## Tips & Tricks

1. **Quick Snippets**: Type `cc-` and press `Ctrl+Space` to see all available snippets

2. **Validate Often**: Run `Clarity Chat: Validate Configuration` before deploying

3. **Explore Examples**: Use `Clarity Chat: Show Examples` to learn patterns

4. **Hover for Info**: Hover over model names to see pricing and capabilities

5. **Use TypeScript**: Enable strict mode for better type safety with AI SDKs

## Troubleshooting

### Snippets Not Showing

- Ensure file language is set to TypeScript, JavaScript, or React
- Type `cc-` prefix to trigger snippets
- Check that the extension is activated

### IntelliSense Not Working

- Verify `clarity-chat.enableIntelliSense` is `true` in settings
- Reload VS Code window (`Developer: Reload Window`)

### Commands Not Found

- Open Command Palette (`Cmd/Ctrl+Shift+P`)
- Type "Clarity Chat" to see all available commands
- Ensure extension is installed and activated

## Requirements

- **VS Code** version 1.85.0 or higher
- **Node.js** 16.x or higher (for development)
- **TypeScript** 4.5+ (optional, for TypeScript projects)

## Contributing

Found a bug or have a feature request? Open an issue on [GitHub](https://github.com/clarity-chat/clarity-chat).

## License

MIT

## Links

- [Documentation](https://github.com/clarity-chat/clarity-chat)
- [OpenAI Documentation](https://platform.openai.com/docs)
- [Anthropic Documentation](https://docs.anthropic.com)
- [Google AI Documentation](https://ai.google.dev/docs)

---

**Enjoy using Clarity Chat!** ⚡
