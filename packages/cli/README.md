# @clarity-chat/cli

> **Beautiful CLI** - Developer productivity toolkit for Clarity Chat

🎨 Beautiful CLI for Clarity Chat - Developer productivity toolkit with interactive wizards, code generation, and comprehensive project management.

## ✨ Features

- 🚀 **Project Initialization** - Interactive setup wizard with framework detection
- ➕ **Component Management** - Add components with automatic dependency installation
- 🔑 **API Key Manager** - Securely manage provider API keys
- 🔥 **Dev Server** - Hot reload development server
- ⚡ **Code Generation** - Generate components, hooks, adapters, and tests
- 📚 **Documentation** - Quick access to docs and examples
- 🩺 **Health Check** - Diagnose and fix project issues
- 🎯 **Enhanced Developer Experience** - Comprehensive error handling, validation, and helpful suggestions
- 🔒 **Security** - Path validation, secure credential handling, and input sanitization
- 📊 **Multiple Output Modes** - Human-readable, JSON, quiet, and verbose modes
- ⌨️ **Shell Completion** - Bash, zsh, and fish completion support
- ⚙️ **Configuration Management** - Flexible config file support with cosmiconfig
- 🎨 **Beautiful UI/UX** - Eye-catching gradients, formatted tables, beautiful message boxes, and smooth animations

## Installation

```bash
npm install -g @clarity-chat/cli
```

Or use without installation:

```bash
npx @clarity-chat/cli init
```

## 🚀 Quick Start

> 📖 **New to Clarity?** Check the [Getting Started Guide](../../docs/getting-started-clarity-chat.md) or browse the [Cookbook](../../docs/cookbook/) for copy-paste ready patterns.

### Install CLI

```bash
npm install -g @clarity-chat/cli
```

### Initialize Project

```bash
clarity-chat init
```

That's it! The CLI will guide you through setup interactively.

## 📖 Commands

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

# Add multiple components at once
clarity-chat add chat-interface --batch "model-selector,token-counter"
```

**Available Components:**
- `chat-interface` - Full-featured chat UI
- `model-selector` - AI model dropdown
- `token-counter` - Token usage display
- `cost-estimator` - API cost calculator
- `streaming-handler` - SSE streaming utilities

**Options:**
- `-p, --path <path>` - Installation path (default: `./src/components`)
- `--no-deps` - Skip dependency installation
- `--batch <components>` - Add multiple components (comma-separated)

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
clarity-chat dev --watch  # Watch mode (auto-restart on changes)
```

**Features:**
- Automatic framework detection (Next.js, Remix, Vite, Astro)
- Package manager detection (npm, yarn, pnpm, bun)
- Port validation
- Graceful shutdown handling
- Browser auto-open option

**Options:**
- `-p, --port <port>` - Port number (default: `3000`)
- `--open` - Open browser automatically
- `--watch` - Watch mode (auto-restart on changes)

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

## Workflow Acceleration Features

### Batch Operations

Add multiple components at once:

```bash
clarity-chat add chat-interface --batch "model-selector,token-counter,cost-estimator"
```

### Watch Mode

Automatically restart dev server on file changes:

```bash
clarity-chat dev --watch
```

### Update Notifications

The CLI automatically checks for updates when running common commands (`init`, `add`, `dev`) and notifies you if a new version is available.

## Beautiful UI Features

The CLI features a stunning visual design with:

- **🌈 Gradient Banners** - Eye-catching headers for each command
- **📦 Message Boxes** - Beautiful success, error, warning, and info boxes
- **📊 Formatted Tables** - Professional table layouts for structured data
- **⚡ Smooth Spinners** - Color-coded loading indicators
- **🎯 Visual Hierarchy** - Clear structure with dividers and spacing
- **✨ Consistent Design** - Cohesive visual language throughout

### Visual Examples

**Init Command:**
```
┌─────────────────────────────────────┐
│   Initialize Project (gradient)     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🚀 Getting Started                  │
│ Setting up your AI-powered app...   │
└─────────────────────────────────────┘
```

**Success Messages:**
```
┌─────────────────────────────────────┐
│ ✨ All Set!                         │
│ Project initialized successfully!   │
└─────────────────────────────────────┘
```

**Status Tables:**
```
┌─────────────┬──────────────────────┐
│ Item        │ Status               │
├─────────────┼──────────────────────┤
│ ✅ package.json │ Found             │
│ ⚠️  API keys    │ Not configured    │
└─────────────┴──────────────────────┘
```

## Examples

### Quick Start

```bash
# Create new project (beautiful interactive wizard)
npx @clarity-chat/cli init

# Add components (single or batch)
clarity-chat add chat-interface
clarity-chat add chat-interface --batch "model-selector,token-counter"

# Configure API keys (beautiful prompts)
clarity-chat keys add openai

# Start development (eye-catching server start)
clarity-chat dev --open
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

## Output Modes

The CLI supports multiple output modes for different use cases:

### Human-readable (default)
```bash
clarity-chat add chat-interface
```

### JSON mode (for scripts/automation)
```bash
clarity-chat add chat-interface --json
```

### Quiet mode (minimal output)
```bash
clarity-chat add chat-interface --quiet
```

### Verbose mode (detailed output)
```bash
clarity-chat add chat-interface --verbose
```

### Debug mode
```bash
clarity-chat add chat-interface --debug
```

## Shell Completion

Install shell completion for better developer experience:

### Bash
```bash
eval "$(clarity-chat completion bash)"
# Add to ~/.bashrc or ~/.bash_profile
```

### Zsh
```bash
eval "$(clarity-chat completion zsh)"
# Add to ~/.zshrc
```

### Fish
```bash
clarity-chat completion fish > ~/.config/fish/completions/clarity-chat.fish
```

## Error Handling

The CLI provides comprehensive error handling with actionable suggestions:

- **Validation Errors**: Clear messages with suggestions for fixing invalid inputs
- **Not Found Errors**: Helpful hints when resources aren't found
- **Permission Errors**: Guidance on fixing permission issues
- **Config Errors**: Suggestions for configuration problems

All errors include:
- Clear error messages
- Actionable suggestions
- Links to documentation (when available)

## 📚 Documentation

- [Getting Started Guide](../../docs/getting-started-clarity-chat.md)
- [Cookbook](../../docs/cookbook/) - Copy-paste ready patterns
- [Troubleshooting](../../docs/TROUBLESHOOTING.md) - Common issues and solutions
- [CLI Examples](./examples/) - Usage examples

## 🧪 Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run build

# Test
npm test

# Type check
npm run type-check
```

## 📄 License

MIT

## 🔗 Links

- [GitHub Repository](https://github.com/christireid/Clarity-ai-chat-components)
- [Documentation](../../apps/docs/)
- [Examples](../../examples/)
- [Storybook](http://localhost:6006)

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)
