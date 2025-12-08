# Quick Start Reference

> Get from zero to productive in 5 minutes

## Instant Setup

```bash
# 1. Clone and install (1-2 min)
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components
pnpm install

# 2. Start development (choose one)
pnpm dev          # All packages
pnpm storybook    # Component playground
pnpm docs         # Documentation site
```

## Common Commands Cheatsheet

| Task              | Command           |
| ----------------- | ----------------- |
| Start dev server  | `pnpm dev`        |
| Run all tests     | `pnpm test`       |
| Run tests (watch) | `pnpm test:watch` |
| Type check        | `pnpm typecheck`  |
| Lint & fix        | `pnpm lint:fix`   |
| Format code       | `pnpm format`     |
| Build all         | `pnpm build`      |
| Clean everything  | `pnpm clean`      |

## Code Generators

Save time with our built-in generators:

```bash
# Create a new component with tests and story
pnpm generate:component

# Create a new React hook with tests
pnpm generate:hook

# Create a new React context with provider
pnpm generate:context
```

## Project Structure

```
packages/
├── react/          # Main components & hooks (start here!)
├── primitives/     # shadcn/ui base components
├── memory/         # Conversation memory system
├── types/          # Shared TypeScript types
├── error-handling/ # Error recovery system
└── dev-tools/      # Developer utilities

apps/
├── docs/           # Documentation site
├── storybook/      # Component playground
└── examples/       # Reference implementations
```

## VS Code Setup

Open the project and install recommended extensions when prompted, or run:

```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension vitest.explorer
```

## Your First Contribution

### Option A: Fix a typo (5 min)

1. Find something to fix in `/docs` or any `README.md`
2. Make your change
3. `pnpm format && pnpm lint:fix`
4. Open a PR!

### Option B: Add a test (15 min)

1. Run `pnpm test:coverage`
2. Find a file with low coverage
3. Add tests
4. Open a PR!

### Option C: Create a component (30 min)

```bash
# Use the generator
pnpm generate:component

# Follow prompts:
# → Component name: MyComponent
# → Package: react
# → Include tests: yes
# → Include story: yes

# Files created:
# ✓ packages/react/src/components/MyComponent/MyComponent.tsx
# ✓ packages/react/src/components/MyComponent/MyComponent.test.tsx
# ✓ packages/react/src/components/MyComponent/MyComponent.stories.tsx
# ✓ packages/react/src/components/MyComponent/index.ts
```

## Troubleshooting

### "Module not found" errors

```bash
pnpm install
pnpm build
```

### Type errors

```bash
pnpm typecheck
# Review and fix errors
```

### Tests failing

```bash
pnpm test -- --verbose
# Check specific error messages
```

### Everything broken

```bash
pnpm clean
pnpm install
pnpm build
```

## Getting Help

- **Discord**: [Join our community](https://discord.gg/clarity-chat)
- **Issues**: [Report bugs](https://github.com/christireid/Clarity-ai-chat-components/issues)
- **Discussions**:
  [Ask questions](https://github.com/christireid/Clarity-ai-chat-components/discussions)
