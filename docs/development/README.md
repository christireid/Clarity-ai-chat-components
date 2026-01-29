# Development Documentation

Quick links to development guides and resources.

## Core Guides

- **[Development Commands](DEVELOPMENT_COMMANDS.md)** - Complete command reference for testing, building, linting, type-checking, and documentation generation

## Quick Start

### Essential Commands

```bash
# Install dependencies
pnpm install

# Run all checks
pnpm check

# Start development
pnpm dev

# Run tests
pnpm test

# Build packages
pnpm build
```

### Pre-Commit Checklist

```bash
pnpm typecheck  # Check types
pnpm lint       # Lint code
pnpm test       # Run tests
```

## Common Tasks

### Testing

```bash
# Run all tests
pnpm test

# Test specific package
cd packages/react && pnpm test

# Test with coverage
pnpm test:coverage

# Test in watch mode
pnpm test:watch
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
cd packages/react && pnpm build

# Build with watch mode
cd packages/react && pnpm dev
```

### Linting & Formatting

```bash
# Lint and auto-fix
pnpm lint:fix

# Format all files
pnpm format

# Type-check
pnpm typecheck
```

### Documentation

```bash
# Generate API docs
pnpm docs:generate

# Sync documentation
pnpm docs:sync

# Start docs site
pnpm docs
```

## Package Structure

```
packages/
├── react/              # Main React components
├── types/              # Shared TypeScript types
├── utils/              # Utility functions
├── primitives/         # Base primitives
├── memory/             # Memory management
├── token-optimization/ # Token optimization
├── error-handling/     # Error handling
└── license/            # License checking
```

## Resources

### Internal Guides

- [DEVELOPMENT_COMMANDS.md](DEVELOPMENT_COMMANDS.md) - Complete command reference
- [React Package Guide](../../packages/react/CLAUDE.md) - React-specific development
- [Main CLAUDE.md](../../apps/streamlined-docs/CLAUDE.md) - Repository guide
- [Architecture](../architecture.md) - System architecture
- [Best Practices](../best-practices.md) - Coding standards

### External Resources

- [Turbo Documentation](https://turbo.build/repo/docs) - Monorepo build system
- [Vitest Documentation](https://vitest.dev) - Testing framework
- [TypeDoc Documentation](https://typedoc.org) - API documentation
- [pnpm Documentation](https://pnpm.io) - Package manager

## Getting Help

- Check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) for common issues
- Review [FAQ.md](../FAQ.md) for frequently asked questions
- See [Known Issues](../known-issues.md) for current limitations

---

**Last Updated**: January 28, 2026
