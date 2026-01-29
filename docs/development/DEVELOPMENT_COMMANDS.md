# Development Commands Guide

> **Last Updated**: January 28, 2026
> **Version**: 2.0.0

Complete command reference for working with Clarity Chat Components. This guide covers testing, building, linting, type-checking, and documentation generation.

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Running Tests](#running-tests)
3. [Building Components](#building-components)
4. [Linting and Formatting](#linting-and-formatting)
5. [Type-Checking](#type-checking)
6. [Generating Documentation](#generating-documentation)
7. [Development Workflow](#development-workflow)
8. [Component-Specific Commands](#component-specific-commands)
9. [CI/CD Commands](#cicd-commands)
10. [Troubleshooting](#troubleshooting)

---

## Quick Reference

### Essential Commands

```bash
# Install dependencies (from monorepo root)
pnpm install

# Run all checks before committing
pnpm check

# Run all checks including build
pnpm check:all

# Start development server
pnpm dev

# Run tests
pnpm test

# Build all packages
pnpm build
```

### Pre-Commit Checklist

```bash
# Run these before every commit
pnpm typecheck  # Check TypeScript types
pnpm lint       # Lint code
pnpm test       # Run tests
```

---

## Running Tests

### Root-Level Test Commands

Run tests across the entire monorepo:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run smoke tests
pnpm test:smoke

# Run smoke tests with UI
pnpm test:smoke:ui
```

### Package-Specific Tests

Test individual packages:

```bash
# Test React components package
cd packages/react
pnpm test

# Test with watch mode
pnpm test:watch

# Test with UI
pnpm test:ui

# Test with coverage
pnpm test:coverage

# Test with reduced memory (2GB limit)
pnpm test:memory
```

### Component-Specific Tests

Test specific components or files:

```bash
# Test a single component
cd packages/react
pnpm test ChatMessage.test.tsx

# Test a specific folder
pnpm test src/components/message

# Test with pattern matching
pnpm test --grep "ChatMessage"

# Test with file name pattern
pnpm test -- --testNamePattern="renders message"
```

### Testing Hooks

```bash
# Test all hooks
cd packages/react
pnpm test src/hooks

# Test specific hook
pnpm test use-clarity-chat.test.ts

# Test with watch mode
pnpm test:watch use-clarity-chat
```

### Benchmark Tests

Run performance benchmarks:

```bash
cd packages/react

# Run all benchmarks
pnpm bench

# Run specific benchmarks
pnpm bench:long-list        # Long message list
pnpm bench:streaming        # Streaming performance
pnpm bench:virtualization   # Virtualization performance
pnpm bench:concurrent       # Concurrent streams
pnpm bench:layout           # Layout thrashing

# Export benchmark results as JSON
pnpm bench:json
```

### Test Configuration

Tests use Vitest. Configuration files:

- `/packages/react/vitest.config.mts` - React package tests
- Test setup files in `packages/react/tests/`

---

## Building Components

### Build Commands

```bash
# Build all packages and apps
pnpm build

# Build only packages (not apps)
pnpm build:packages

# Build sequentially (slower but more reliable)
pnpm build:sequential

# Build with legacy settings (4GB memory)
pnpm build:legacy

# Build with optimization flags
pnpm build:optimized
```

### Package-Specific Builds

```bash
# Build React package
cd packages/react
pnpm build

# Build with watch mode for development
pnpm dev

# Build only types
pnpm build:types

# Build in parallel mode (faster)
pnpm build:parallel

# Clean build artifacts
pnpm clean
```

### Build Individual Components

Using Turbo's filter option:

```bash
# Build specific package
turbo run build --filter=@clarity-chat/react

# Build specific package and its dependencies
turbo run build --filter=@clarity-chat/react...

# Build multiple packages
turbo run build --filter=@clarity-chat/react --filter=@clarity-chat/types
```

### Build Storybook

```bash
# Develop Storybook
pnpm storybook

# Build Storybook static site
pnpm storybook:build
```

### Build Documentation Site

```bash
# Develop docs site
pnpm docs

# Build docs site for production
pnpm docs:build
```

### Build Analysis

```bash
# Analyze bundle size
pnpm analyze

# Run bundle analysis script
pnpm bundle-analysis

# Check bundle size against limits
cd packages/react
pnpm size

# Get bundle size details
pnpm size:why

# Generate bundle size report
pnpm size:analyze

# Track bundle size over time
pnpm size:track

# Compare bundle sizes
pnpm size:compare

# Visualize bundle composition
pnpm size:visualize

# Open bundle visualization in browser
pnpm size:visualize:open

# View bundle dashboard
pnpm size:dashboard
```

### Memory Configuration

Build commands support memory limits via NODE_OPTIONS:

```bash
# Default: 2GB
pnpm build

# With 4GB (legacy mode)
pnpm build:legacy

# Custom memory limit
NODE_OPTIONS='--max-old-space-size=3072' pnpm build
```

---

## Linting and Formatting

### Linting Commands

```bash
# Lint all files
pnpm lint

# Lint and auto-fix issues
pnpm lint:fix

# Lint React package only
cd packages/react
pnpm lint

# Lint and fix
pnpm lint:fix

# Check without fixing
pnpm lint:check

# Lint for accessibility issues
pnpm lint:accessibility
```

### Formatting Commands

```bash
# Format all files
pnpm format

# Check formatting without fixing
pnpm format:check

# Format specific files
pnpm format src/**/*.tsx
```

### Code Review Commands

```bash
# Run comprehensive code review
pnpm review

# Review specific aspects
pnpm review:security      # Security issues
pnpm review:performance   # Performance issues
pnpm review:typescript    # TypeScript issues
pnpm review:tailwind      # Tailwind CSS issues

# Review only staged files
pnpm review:staged

# Run review checks
pnpm review:check

# Review staged files only
pnpm review:check:staged

# Auto-fix review issues
pnpm review:check:fix

# Output review as JSON
pnpm review:check:json

# Run review tests
pnpm review:test

# Watch mode for review tests
pnpm review:test:watch
```

### Linting Specific Files

```bash
# Lint specific component
cd packages/react
eslint src/components/message/ChatMessage.tsx

# Lint with specific rule
eslint src --rule 'jsx-a11y/*:error'

# Lint and fix specific files
eslint src/components/message --fix
```

### Import Validation

```bash
# Validate imports across codebase
pnpm validate:imports
```

---

## Type-Checking

### Type-Check Commands

```bash
# Type-check entire monorepo
pnpm typecheck

# Type-check React package
cd packages/react
pnpm typecheck

# Type-check with build dependencies
turbo run typecheck
```

### Advanced TypeScript Analysis

```bash
# Analyze TypeScript performance
pnpm analyze:ts-performance

# Generate TypeScript trace
pnpm analyze:ts-trace

# Check for circular dependencies
pnpm analyze:circular

# Visualize circular dependencies
pnpm analyze:circular:graph

# Analyze all dependencies
pnpm analyze:deps
```

### Type-Checking Specific Files

```bash
# Type-check specific file
cd packages/react
tsc --noEmit src/components/message/ChatMessage.tsx

# Type-check with strict mode
tsc --strict --noEmit src/components/message/ChatMessage.tsx
```

### Fix Type Errors

```bash
# Generate declaration files
cd packages/react
pnpm build:types

# Clean and rebuild types
pnpm clean && pnpm build:types
```

---

## Generating Documentation

### API Documentation

```bash
# Generate TypeDoc API documentation
pnpm docs:generate

# Generate for React package
cd packages/react
pnpm docs:generate

# Serve generated docs locally
pnpm docs:serve
```

### Documentation Sync

Automated documentation generation and synchronization:

```bash
# Sync all documentation
pnpm docs:sync

# Dry run (preview changes)
pnpm docs:sync:dry-run

# Extract API documentation
pnpm docs:extract-apis

# Generate docs from APIs
pnpm docs:generate-docs

# Generate changelog
pnpm docs:changelog
```

### Component Documentation

```bash
# Generate component inventory
pnpm generate:component-inventory

# Create API documentation for all components
cd packages/react
pnpm docs:all
```

### Peer Dependencies Documentation

```bash
# Generate peer dependency docs
cd packages/react
pnpm docs:peer-deps

# Validate peer dependencies
pnpm docs:validate-peers
```

### Search Index Documentation

```bash
# Index documentation for search
pnpm index-docs

# Clear search index
pnpm index-docs:clear

# Dry run indexing
pnpm index-docs:dry-run
```

---

## Development Workflow

### Starting Development

```bash
# Start all development servers
pnpm dev

# Start React package development
pnpm dev:react

# Start docs development
pnpm dev:docs

# Start Storybook
pnpm storybook
```

### Before Committing

```bash
# Run quick checks
pnpm check

# Run comprehensive checks
pnpm check:all

# Check consistency
pnpm check:consistency
```

### Creating New Components

```bash
# Interactive component generator
pnpm generate

# Generate component
pnpm generate:component

# Generate hook
pnpm generate:hook

# Generate context
pnpm generate:context
```

### Creating Examples

```bash
# Generate example (interactive)
pnpm generate:example:interactive

# Generate example (CLI)
pnpm generate:example
```

---

## Component-Specific Commands

### Testing Individual Components

```bash
# Test ChatMessage component
cd packages/react
pnpm test ChatMessage.test.tsx

# Test with coverage
pnpm test:coverage ChatMessage.test.tsx

# Test in watch mode
pnpm test:watch ChatMessage
```

### Building Individual Components

Components are built as part of the package build. To work on individual components:

```bash
# Start dev mode (watches all files)
cd packages/react
pnpm dev

# Build entire package
pnpm build
```

### Linting Individual Components

```bash
# Lint specific component
cd packages/react
eslint src/components/message/ChatMessage.tsx --fix

# Lint component folder
eslint src/components/message --fix
```

### Type-Checking Individual Components

```bash
# Type-check specific component
cd packages/react
tsc --noEmit src/components/message/ChatMessage.tsx
```

---

## CI/CD Commands

### Pre-CI Validation

```bash
# Validate exports
cd packages/react
pnpm validate:exports

# Check for duplicate dependencies
pnpm validate:duplicates

# Validate bundle size
pnpm validate:bundle

# Run all validations
pnpm validate
```

### Security Audits

```bash
# Run security audit
pnpm security:audit

# Generate JSON report
pnpm security:audit:json

# Generate Markdown report
pnpm security:audit:markdown
```

### Dependency Management

```bash
# Audit dependencies
pnpm dependency-audit

# Modernize dependencies
pnpm modernize-deps

# Check for circular dependencies
pnpm analyze:circular
```

### Release Preparation

```bash
# Create changeset
pnpm changeset

# Version packages
pnpm version-packages

# Build and publish
pnpm release

# Prepare release checklist
pnpm prepare-release
```

---

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clean and rebuild
pnpm clean && pnpm install && pnpm build

# Build with more memory
NODE_OPTIONS='--max-old-space-size=4096' pnpm build

# Build sequentially
pnpm build:sequential
```

#### Test Failures

```bash
# Clear test cache and rerun
cd packages/react
rm -rf node_modules/.vitest
pnpm test

# Run with reduced memory
pnpm test:memory

# Run specific failing test
pnpm test -- --testNamePattern="test name"
```

#### Type Errors

```bash
# Rebuild all type dependencies
cd packages/react
pnpm typecheck

# Clean and rebuild types
pnpm clean && pnpm build:types

# Check TypeScript performance
pnpm analyze:ts-performance
```

#### Lint Errors

```bash
# Auto-fix lint issues
pnpm lint:fix

# Check specific files
eslint src/path/to/file.tsx --fix

# Review and fix automatically
pnpm review:check:fix
```

#### Memory Issues

```bash
# Increase Node.js memory limit
NODE_OPTIONS='--max-old-space-size=4096' pnpm [command]

# Use memory-optimized test command
cd packages/react
pnpm test:memory
```

#### Peer Dependency Issues

```bash
# Install required peers
cd packages/react
pnpm install-peers

# Install for CI
pnpm install-peers:ci

# Install minimal set
pnpm install-peers:minimal

# Install standard set
pnpm install-peers:standard

# Install full set
pnpm install-peers:full

# Get install command
pnpm install-peers:cmd
```

### Debug Commands

```bash
# Check what Turbo will run
turbo run build --dry-run

# Run with verbose output
turbo run build --verbose

# Check Turbo cache
turbo run build --force

# Analyze why a package is included
pnpm why package-name
```

### Verification Commands

```bash
# Verify externalized dependencies
cd packages/react
pnpm verify:externals

# Validate configuration
pnpm validate:config

# Check imports
pnpm validate:imports

# Check docs health
tsx scripts/check-docs-health.ts
```

---

## Performance Optimization

### Build Performance

```bash
# Use Turbo's concurrency control
pnpm build --concurrency=2

# Build only changed packages
turbo run build --filter=[origin/main]

# Build with cache
turbo run build  # Cache is enabled by default
```

### Test Performance

```bash
# Run tests in parallel (default)
pnpm test

# Run with limited workers
pnpm test -- --maxWorkers=2

# Run without coverage (faster)
pnpm test -- --coverage=false
```

### Size Optimization

```bash
# Check bundle size
cd packages/react
pnpm size

# Analyze what's in the bundle
pnpm size:why

# Track size over time
pnpm size:track

# Compare with baseline
pnpm size:compare

# Visualize bundle composition
pnpm size:visualize:open
```

---

## Advanced Commands

### Visual Testing

```bash
# Run visual regression tests
pnpm test:visual

# Update visual snapshots
pnpm test:visual:update
```

### Theme Generation

```bash
# Generate custom theme
pnpm generate:theme
```

### Worktree Management

```bash
# Create Git worktrees
pnpm create-worktrees
```

### Code Analysis

```bash
# Run comprehensive code analysis
pnpm code_analysis

# Analyze specific aspect
cd packages/react
pnpm test src/__tests__/complexity.test.ts
```

---

## Environment Variables

### Build Environment

```bash
# Production build
NODE_ENV=production pnpm build

# Development build
NODE_ENV=development pnpm build
```

### Memory Limits

```bash
# Default (2GB)
NODE_OPTIONS='--max-old-space-size=2048' pnpm build

# Large builds (4GB)
NODE_OPTIONS='--max-old-space-size=4096' pnpm build

# Custom limit
NODE_OPTIONS='--max-old-space-size=3072' pnpm build
```

### CI Environment

```bash
# CI mode (skips interactive prompts)
CI=true pnpm test

# Local CI simulation
CI=true pnpm build
```

---

## Package Manager

This project uses **pnpm** (v10.21.0+) exclusively:

```bash
# Install dependencies
pnpm install

# Add dependency
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Add to specific workspace
pnpm add package-name --filter=@clarity-chat/react

# Update dependencies
pnpm update

# Remove dependency
pnpm remove package-name
```

### Workspace Commands

```bash
# Run command in specific workspace
pnpm --filter @clarity-chat/react build

# Run in all workspaces
pnpm -r build

# Run in parallel
pnpm -r --parallel build
```

---

## Monorepo Structure

```
clarity-chat/
├── packages/
│   ├── react/              # Main React components
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # Utility functions
│   ├── primitives/         # Base primitives
│   ├── memory/             # Memory management
│   ├── token-optimization/ # Token optimization
│   ├── error-handling/     # Error handling
│   └── license/            # License checking
├── apps/
│   ├── streamlined-docs/   # Documentation site
│   ├── storybook/          # Component showcase
│   ├── examples/           # Example implementations
│   └── test-*/             # Test applications
└── docs/                   # Documentation
```

---

## Resources

### Internal Documentation

- [Main CLAUDE.md](../../apps/streamlined-docs/CLAUDE.md) - Repository guide
- [React Package Guide](../../packages/react/CLAUDE.md) - React-specific guide
- [Architecture](../architecture.md) - System architecture
- [Best Practices](../best-practices.md) - Coding standards

### External Tools

- [Turbo Documentation](https://turbo.build/repo/docs) - Monorepo build system
- [Vitest Documentation](https://vitest.dev) - Testing framework
- [TypeDoc Documentation](https://typedoc.org) - API documentation
- [pnpm Documentation](https://pnpm.io) - Package manager

---

## Quick Command Reference Table

| Task | Command | Location |
|------|---------|----------|
| Run tests | `pnpm test` | Root or package |
| Run tests (watch) | `pnpm test:watch` | Root or package |
| Run tests (coverage) | `pnpm test:coverage` | Root or package |
| Build all | `pnpm build` | Root |
| Build package | `pnpm build` | Package directory |
| Build with watch | `pnpm dev` | Package directory |
| Lint code | `pnpm lint` | Root or package |
| Fix lint issues | `pnpm lint:fix` | Root or package |
| Type-check | `pnpm typecheck` | Root or package |
| Format code | `pnpm format` | Root |
| Generate docs | `pnpm docs:generate` | Root |
| Run all checks | `pnpm check` | Root |
| Start dev server | `pnpm dev` | Root |
| Start Storybook | `pnpm storybook` | Root |
| Create component | `pnpm generate:component` | Root |
| Bundle analysis | `pnpm analyze` | Root |
| Security audit | `pnpm security:audit` | Root |
| Clean build | `pnpm clean` | Root or package |

---

## Examples

### Test a specific component

```bash
cd /Users/christireid/Dev/Clarity-ai-chat-components
cd packages/react
pnpm test ChatMessage.test.tsx
```

### Build and test the React package

```bash
cd /Users/christireid/Dev/Clarity-ai-chat-components/packages/react
pnpm clean
pnpm build
pnpm test
pnpm typecheck
pnpm lint
```

### Run comprehensive pre-commit checks

```bash
cd /Users/christireid/Dev/Clarity-ai-chat-components
pnpm typecheck
pnpm lint:fix
pnpm test
pnpm format
```

### Generate and view API documentation

```bash
cd /Users/christireid/Dev/Clarity-ai-chat-components
pnpm docs:generate
cd packages/react
pnpm docs:serve
```

### Create a new component with tests

```bash
cd /Users/christireid/Dev/Clarity-ai-chat-components
pnpm generate:component
# Follow prompts to create component
cd packages/react
pnpm test NewComponent.test.tsx
```

---

**Last Updated**: January 28, 2026
**Maintainer**: Code & Clarity
**Repository**: https://github.com/christireid/Clarity-ai-chat-components
