# @clarity-chat/cli

🎨 Beautiful CLI for Clarity Chat - Developer productivity toolkit

## Features

- 🚀 **Project Initialization** - Interactive setup wizard with framework detection
- ➕ **Component Management** - Add components with automatic dependency installation
- 🔑 **API Key Manager** - Securely manage provider API keys
- 🔥 **Dev Server** - Hot reload development server
- ⚡ **Code Generation** - Generate components, hooks, adapters, and tests
- 📚 **Documentation** - Quick access to docs and examples
- 🩺 **Health Check** - Diagnose and fix project issues

## Installation

```bash
npm install -g @clarity-chat/cli
```

Or use without installation:

```bash
npx @clarity-chat/cli init
```

## Commands

### `clarity-chat init`

Initialize a new Clarity Chat project with interactive wizard:

```bash
clarity-chat init

# With options
clarity-chat init --template basic --framework nextjs
clarity-chat init --no-install --no-git
```

**Options:**
- `-t, --template <template>` - Project template (basic, chat, rag, analytics)
- `-f, --framework <framework>` - Framework (nextjs, remix, vite)
- `--no-install` - Skip dependency installation
- `--no-git` - Skip git initialization

### `clarity-chat add <component>`

Add a component to your project:

```bash
clarity-chat add chat-interface
clarity-chat add model-selector --path ./src/components
```

**Available Components:**
- `chat-interface` - Full-featured chat UI
- `model-selector` - AI model dropdown
- `token-counter` - Token usage display
- `cost-estimator` - API cost calculator
- `streaming-handler` - SSE streaming utilities

### `clarity-chat keys`

Manage API keys interactively or with commands:

```bash
# Interactive menu
clarity-chat keys

# Add key for specific provider
clarity-chat keys add openai
clarity-chat keys add anthropic

# List configured keys
clarity-chat keys list

# Validate all keys
clarity-chat keys validate

# Remove key
clarity-chat keys remove google
```

### `clarity-chat dev`

Start development server with hot reload:

```bash
clarity-chat dev
clarity-chat dev --port 3001
clarity-chat dev --open  # Open browser automatically
```

### `clarity-chat generate <type>`

Generate code from templates:

```bash
clarity-chat generate component
clarity-chat generate hook --name useChat
clarity-chat generate adapter --name StreamOpenAI
clarity-chat generate test --name ChatInterface
```

**Types:**
- `component` - React component with TypeScript
- `hook` - Custom React hook
- `adapter` - Model adapter with streaming
- `test` - Test file with Vitest

### `clarity-chat docs [query]`

Open documentation or search:

```bash
clarity-chat docs                 # Open main docs
clarity-chat docs chat-interface  # Open specific component docs
clarity-chat docs streaming       # Search for "streaming"
clarity-chat docs --offline       # Use offline docs (coming soon)
```

### `clarity-chat doctor`

Check project health and configuration:

```bash
clarity-chat doctor       # Run health check
clarity-chat doctor --fix # Auto-fix common issues
```

## Examples

### Quick Start

```bash
# Create new project
npx @clarity-chat/cli init

# Add components
clarity-chat add chat-interface
clarity-chat add model-selector

# Configure API keys
clarity-chat keys add openai

# Start development
clarity-chat dev
```

### Adding to Existing Project

```bash
cd my-existing-app
clarity-chat add chat-interface
clarity-chat keys add anthropic
```

### Generate Custom Component

```bash
clarity-chat generate component --name CustomChat --output ./src/components
```

## Configuration

Create `clarity-chat.config.js` in your project root:

```javascript
/** @type {import('@clarity-chat/cli').Config} */
module.exports = {
  framework: 'nextjs',
  components: ['chat-interface', 'model-selector'],
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    google: process.env.GOOGLE_API_KEY,
  },
  defaults: {
    temperature: 0.7,
    maxTokens: 1000,
    streaming: true,
  }
}
```

## Environment Variables

The CLI manages `.env.local` for your API keys:

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
```

**Security Note**: `.env.local` is automatically added to `.gitignore`

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run build

# Test
npm test
```

## License

MIT
