# Setup Guide - Clarity Memory

This guide will help you set up the Clarity Memory package for development.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Start development mode (watch)
npm run dev
```

## 📋 Prerequisites

- **Node.js**: >= 20.0.0
- **npm/pnpm/yarn**: Latest version
- **TypeScript**: ^5.0.0 (installed as dev dependency)

## 🔧 Installation

### Step 1: Install Dependencies

```bash
npm install
```

Or with pnpm (recommended for monorepo):

```bash
pnpm install
```

### Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
OPENAI_API_KEY=sk-your-key-here
```

**Note**: For basic development (in-memory store), you don't need API keys. They're only required for:
- Embeddings (OpenAI/Anthropic)
- Summarization (OpenAI/Anthropic)
- Vector database storage

### Step 3: Build

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Generate type definitions (.d.ts files)
- Create ESM and CJS builds
- Output to `dist/` directory

## 🧪 Testing

### Run Tests

```bash
# Run all tests once
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# UI mode (interactive)
npm run test:ui
```

### Writing Tests

Create test files next to your source files:

```typescript
// src/core/memory.test.ts
import { describe, it, expect } from 'vitest'
import { clarityMemory } from './memory'

describe('Memory', () => {
  it('should create a memory instance', () => {
    const memory = clarityMemory()
    expect(memory).toBeDefined()
  })
})
```

## 🛠️ Development

### Watch Mode

```bash
npm run dev
```

This will watch for file changes and rebuild automatically.

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Formatting

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

## 📁 Project Structure

```
packages/memory/
├── src/
│   ├── core/           # Core memory logic
│   ├── types/          # Type definitions
│   ├── stores/         # Storage adapters
│   ├── embeddings/     # Embedding providers
│   ├── scoring/        # Scoring system
│   ├── context/        # Context engine
│   ├── compression/    # Compression pipeline
│   └── index.ts        # Main entry point
├── dist/               # Build output (generated)
├── coverage/           # Test coverage (generated)
├── .env.example        # Environment variable template
├── package.json        # Package configuration
├── tsconfig.json       # TypeScript configuration
├── vitest.config.ts    # Test configuration
└── tsup.config.ts      # Build configuration
```

## 🔑 Environment Variables

See `.env.example` for all available environment variables.

**Required for embeddings:**
- `OPENAI_API_KEY` - OpenAI API key for embeddings

**Optional:**
- `ANTHROPIC_API_KEY` - For Anthropic embeddings
- `MEMORY_STORE_TYPE` - Storage backend type
- `MEMORY_STORE_PATH` - Path for file-based storage
- `MAX_CONTEXT_TOKENS` - Maximum context tokens
- `DEBUG` - Enable debug logging

## 🐛 Troubleshooting

### Build Errors

**Error**: `Cannot find module 'typescript'`
```bash
npm install --save-dev typescript
```

**Error**: `Cannot find module '@types/node'`
```bash
npm install --save-dev @types/node
```

### Test Errors

**Error**: `Cannot find module 'vitest'`
```bash
npm install --save-dev vitest @vitest/coverage-v8
```

### Type Errors

**Error**: Type errors in IDE
```bash
# Restart TypeScript server in your IDE
# Or run:
npm run typecheck
```

### Missing Dependencies

If you see missing dependency errors:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. **Read the Documentation**
   - [Getting Started](../../docs/clarity-memory/GETTING_STARTED.md)
   - [API Reference](../../docs/clarity-memory/API_REFERENCE.md)
   - [Architecture](../../docs/clarity-memory/ARCHITECTURE.md)

2. **Check Examples**
   - [Basic Demo](../../docs/clarity-memory/examples/basic-demo.ts)
   - [React Demo](../../docs/clarity-memory/examples/react-demo.tsx)

3. **Start Implementing**
   - Follow [Quick Start Implementation](../../docs/clarity-memory/QUICK_START_IMPLEMENTATION.md)
   - Check [Implementation Roadmap](../../docs/clarity-memory/IMPLEMENTATION_ROADMAP.md)

## 🎯 Common Tasks

### Add a New Dependency

```bash
npm install <package-name>
npm install --save-dev <package-name>  # For dev dependencies
```

### Update Dependencies

```bash
npm update
```

### Clean Build Artifacts

```bash
npm run clean
```

### Check Everything

```bash
npm run typecheck && npm run lint && npm run format:check && npm test
```

## 💡 Tips

1. **Use Watch Mode**: Keep `npm run dev` running while developing
2. **Run Tests Often**: Use `npm run test:watch` for TDD
3. **Check Types**: Run `npm run typecheck` before committing
4. **Format Code**: Use `npm run format` before committing
5. **Read Docs**: Check the docs folder for detailed information

## 🆘 Need Help?

- Check the [documentation](../../docs/clarity-memory/)
- Review [examples](../../docs/clarity-memory/examples/)
- See [troubleshooting section](#-troubleshooting) above

---

**Happy coding!** 🚀
