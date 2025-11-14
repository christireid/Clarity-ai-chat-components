# @clarity-chat/memory

> A superior, developer-friendly memory system for AI applications. Zero-config, standalone, and works everywhere.

[![npm version](https://badge.fury.io/js/%40clarity-chat%2Fmemory.svg)](https://badge.fury.io/js/%40clarity-chat%2Fmemory)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

**Status**: 🚧 In Development

This package is currently in development. See the [design documentation](../../docs/clarity-memory/) for complete design specifications.

## Quick Start

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Zero-config - works immediately
const memory = clarityMemory()

// Add a memory
await memory.add("User prefers sarcastic humor.")

// Recall memories
const context = await memory.recall("Tell me your favorite jokes.")
console.log(context.memories)
```

## Features

- 🚀 **Zero-Config**: Works out of the box with sensible defaults
- 📦 **Standalone**: No server required - works in scripts, serverless, and browsers
- 🔄 **Universal**: Works with React, Node.js, serverless functions, and any AI SDK
- 🎯 **Type-Safe**: Full TypeScript support with excellent type inference
- 🧠 **Smart**: Automatic token budgeting, adaptive compression, and importance scoring
- 💾 **Flexible Storage**: In-memory, file, IndexedDB, Redis, Postgres, or vector DBs
- 🔍 **Semantic Search**: Vector-based semantic search with multiple embedding providers

## Documentation

Complete design documentation is available in [`docs/clarity-memory/`](../../docs/clarity-memory/):

- [Getting Started](../../docs/clarity-memory/GETTING_STARTED.md)
- [API Reference](../../docs/clarity-memory/API_REFERENCE.md)
- [Architecture](../../docs/clarity-memory/ARCHITECTURE.md)
- [Migration Guide](../../docs/clarity-memory/MIGRATION_GUIDE.md) (from MemMachine)
- [Implementation Roadmap](../../docs/clarity-memory/IMPLEMENTATION_ROADMAP.md)

## Installation

```bash
npm install @clarity-chat/memory
# or
yarn add @clarity-chat/memory
# or
pnpm add @clarity-chat/memory
```

## Quick Setup (Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file (optional - only needed for embeddings)
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY if using embeddings

# 3. Build the package
npm run build

# 4. Run tests
npm test
```

**That's it!** You're ready to develop. See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Development Commands

```bash
# Build
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev

# Test
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
npm run test:ui       # Interactive UI

# Code Quality
npm run typecheck     # Type check
npm run lint          # Lint
npm run lint:fix      # Auto-fix linting
npm run format        # Format code
npm run format:check  # Check formatting

# Cleanup
npm run clean         # Remove build artifacts

# Quick setup (install + build)
npm run setup
```

## License

MIT

## Status

This package is in **active development**. The design is complete and ready for implementation. See the [Implementation Roadmap](../../docs/clarity-memory/IMPLEMENTATION_ROADMAP.md) for details.
