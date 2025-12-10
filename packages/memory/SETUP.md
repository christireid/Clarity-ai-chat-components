# Setup Guide

Quick setup instructions for @clarity-chat/memory.

## Prerequisites

- Node.js 20+ or Bun
- npm, pnpm, or yarn

## Installation

```bash
# Using npm
npm install @clarity-chat/memory

# Using pnpm
pnpm add @clarity-chat/memory

# Using yarn
yarn add @clarity-chat/memory
```

## Verify Installation

```bash
# In your project
npm run verify
```

Or manually:

```bash
npm run build
npm run typecheck
```

## Quick Test

Create `test-memory.ts`:

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const mem = clarityMemory()
await mem.add('Test memory')
const results = await mem.search('test')
console.log(results)
```

Run:

```bash
npx tsx test-memory.ts
```

## Development Setup

If you're developing the package itself:

```bash
# Clone repository
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# Install dependencies
pnpm install

# Build memory package
cd packages/memory
pnpm build

# Run examples
pnpm example:basic
```

## Common Issues

### TypeScript Errors

If you see TypeScript errors, ensure:

1. TypeScript is installed: `npm install -D typescript`
2. You have a `tsconfig.json` with proper settings
3. You're using Node.js 20+ or Bun

### Module Resolution Errors

If you see module resolution errors:

1. Ensure `"type": "module"` in package.json (or use `.mjs` extensions)
2. Use ESM imports: `import { clarityMemory } from '@clarity-chat/memory'`
3. Check your bundler/build tool supports ESM

### Build Errors

If build fails:

1. Run `npm run build` to see detailed errors
2. Check Node.js version: `node --version` (should be 18+)
3. Clear cache: `rm -rf node_modules dist && npm install`

## Next Steps

- Read [Getting Started](./GETTING_STARTED.md)
- Check [Examples](./examples/)
- See [README](./README.md)
