# Testing Infrastructure

This document provides comprehensive documentation for the testing infrastructure in the Clarity
Chat monorepo.

**Last Updated**: 2025-12-08 **Test Framework**: Vitest 4.x **Build Tool**: Vite 7.x

---

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Package-Specific Configurations](#package-specific-configurations)
- [Test Patterns and Conventions](#test-patterns-and-conventions)
- [Mocking Patterns](#mocking-patterns)
- [Troubleshooting](#troubleshooting)
- [Configuration Reference](#configuration-reference)

---

## Quick Start

### Running All Tests

```bash
# Run all tests across the monorepo
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Running Tests for Specific Packages

```bash
# Run tests for a specific package
pnpm --filter @clarity-chat/react test
pnpm --filter @clarity-chat/primitives test
pnpm --filter @clarity-chat/memory test
pnpm --filter @clarity-chat/errors test

# Run tests in watch mode for a package
pnpm --filter @clarity-chat/react test -- --watch
```

### Running Specific Test Files

```bash
# Run a specific test file
pnpm --filter @clarity-chat/react test -- src/components/__tests__/ChatMessage.test.tsx

# Run tests matching a pattern
pnpm --filter @clarity-chat/react test -- --grep "ChatMessage"
```

---

## Architecture Overview

### Test Framework Stack

| Tool                        | Version | Purpose                           |
| --------------------------- | ------- | --------------------------------- |
| Vitest                      | 4.x     | Test runner and assertion library |
| Vite                        | 7.x     | Build tool and dev server         |
| @testing-library/react      | 16.x    | React component testing utilities |
| happy-dom                   | Latest  | DOM environment for React tests   |
| @testing-library/user-event | Latest  | User interaction simulation       |

### Directory Structure

```
packages/
├── react/
│   ├── src/
│   │   ├── components/
│   │   │   └── __tests__/        # Component tests
│   │   └── hooks/
│   │       └── __tests__/        # Hook tests
│   ├── vitest.config.mts         # Package config
│   └── vitest.setup.ts           # Test setup
├── primitives/
│   ├── src/
│   │   └── components/
│   │       └── __tests__/        # UI primitive tests
│   └── vitest.config.mts
├── memory/
│   ├── src/
│   │   └── **/*.test.ts          # Colocated tests
│   └── vitest.config.ts
├── errors/
│   ├── src/
│   │   └── __tests__/
│   └── vitest.config.ts
└── testing-utils/
    └── vitest.shared.ts          # Shared configuration
```

### Shared Configuration

A shared Vitest configuration is available at `packages/testing-utils/vitest.shared.ts`:

```typescript
import { sharedConfig } from '@clarity-chat/testing-utils/vitest.shared'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      // package-specific overrides
    },
  })
)
```

---

## Package-Specific Configurations

### @clarity-chat/react

**Environment**: `happy-dom` (optimized for React) **Pool**: `vmThreads` with `singleThread: true`
(memory-optimized)

```typescript
// vitest.config.mts
{
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    pool: 'vmThreads',
    poolOptions: {
      vmThreads: {
        singleThread: true,
        memoryLimit: '512MB',
      },
    },
    maxConcurrency: 1,
    testTimeout: 20000,
    isolate: false,
  }
}
```

**Key Features**:

- Memory-optimized for large test suites
- Uses `vmThreads` pool with single thread to prevent OOM crashes
- Extended timeout (20s) for complex component tests

### @clarity-chat/primitives

**Environment**: `happy-dom` **Pool**: `threads` with limited parallelism

```typescript
// vitest.config.mts
{
  test: {
    globals: true,
    environment: 'happy-dom',
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 2,
        minThreads: 1,
      },
    },
  }
}
```

### @clarity-chat/memory

**Environment**: `node` **Pool**: `threads`

```typescript
// vitest.config.ts
{
  test: {
    globals: true,
    environment: 'node',
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 2,
        minThreads: 1,
      },
    },
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  }
}
```

### @clarity-chat/errors

**Environment**: `node` **Pool**: `threads`

Standard Node.js test configuration for error handling utilities.

---

## Test Patterns and Conventions

### File Naming

| Pattern      | Description                     |
| ------------ | ------------------------------- |
| `*.test.ts`  | Unit tests                      |
| `*.test.tsx` | React component tests           |
| `*.spec.ts`  | Integration/specification tests |
| `*.e2e.ts`   | End-to-end tests (Playwright)   |

### Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render correctly', () => {
      render(<MyComponent />)
      expect(screen.getByText('Hello')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should handle click events', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      render(<MyComponent onClick={onClick} />)
      await user.click(screen.getByRole('button'))

      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<MyComponent />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should throw when used outside context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<ContextDependentComponent />)
      }).toThrow('Must be used within Provider')

      consoleSpy.mockRestore()
    })
  })
})
```

### Testing Best Practices

1. **Use `userEvent` over `fireEvent`**: More realistic user interactions

   ```typescript
   const user = userEvent.setup()
   await user.click(button)
   ```

2. **Query by role/label first**: Better accessibility testing

   ```typescript
   screen.getByRole('button', { name: 'Submit' })
   screen.getByLabelText('Email')
   ```

3. **Test behavior, not implementation**: Focus on what users see

   ```typescript
   // Good
   expect(screen.getByText('Success')).toBeInTheDocument()

   // Avoid
   expect(component.state.isSuccess).toBe(true)
   ```

4. **Clean up mocks in beforeEach**:
   ```typescript
   beforeEach(() => {
     vi.clearAllMocks()
   })
   ```

---

## Mocking Patterns

### Mocking Functions

```typescript
import { vi } from 'vitest'

// Simple mock
const mockFn = vi.fn()
mockFn.mockReturnValue('value')

// Mock with implementation
const mockFn = vi.fn((x) => x * 2)

// Async mock
const mockAsync = vi.fn().mockResolvedValue({ data: 'test' })
```

### Mocking Modules

```typescript
// Mock entire module
vi.mock('../api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' }),
}))

// Mock specific exports
vi.mock('../utils', async () => {
  const actual = await vi.importActual('../utils')
  return {
    ...actual,
    specificFunction: vi.fn(),
  }
})
```

### Mocking Timers

```typescript
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('handles timeout', async () => {
  const callback = vi.fn()
  setTimeout(callback, 1000)

  vi.advanceTimersByTime(1000)

  expect(callback).toHaveBeenCalled()
})
```

### Mocking React Context

```typescript
const mockValue = {
  user: { name: 'Test' },
  updateUser: vi.fn(),
}

render(
  <UserContext.Provider value={mockValue}>
    <ComponentUnderTest />
  </UserContext.Provider>
)
```

### Mocking Radix UI Components

For components using Radix UI primitives:

```typescript
// Mock animations for Radix components
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual('@radix-ui/react-dialog')
  return {
    ...actual,
    // Override specific behaviors if needed
  }
})
```

---

## Troubleshooting

### Common Issues

#### Out of Memory (OOM) Errors

**Symptoms**: Tests crash with `ERR_WORKER_OUT_OF_MEMORY`

**Solutions**:

1. Use `vmThreads` pool with `singleThread: true`
2. Reduce `maxConcurrency`
3. Add `memoryLimit` to pool options
4. Set `isolate: false` if tests don't need isolation

```typescript
{
  test: {
    pool: 'vmThreads',
    poolOptions: {
      vmThreads: {
        singleThread: true,
        memoryLimit: '512MB',
      },
    },
    maxConcurrency: 1,
    isolate: false,
  }
}
```

#### Tests Timing Out

**Symptoms**: Tests fail with timeout errors

**Solutions**:

1. Increase `testTimeout` in config
2. Check for unresolved promises
3. Ensure async operations are properly awaited

```typescript
{
  test: {
    testTimeout: 20000, // 20 seconds
    hookTimeout: 10000, // 10 seconds for hooks
  }
}
```

#### Module Resolution Errors

**Symptoms**: `Cannot find module` errors

**Solutions**:

1. Check path aliases in `resolve.alias`
2. Ensure dependencies are installed
3. Verify import paths

```typescript
{
  resolve: {
    alias: {
      '@clarity-chat/types': path.resolve(__dirname, '../types/src'),
    },
  },
}
```

#### Radix UI Component Tests Failing

**Symptoms**: Components not rendering in portal, animations not completing

**Solutions**:

1. Use `open` prop for controlled components in tests
2. Wait for async operations with `waitFor`
3. Mock animation frames if needed

```typescript
// Use controlled state for testing
render(
  <Dialog open>
    <DialogContent>Test</DialogContent>
  </Dialog>
)
```

#### Coverage Not Generating

**Symptoms**: Coverage reports empty or missing

**Solutions**:

1. Run with `--coverage` flag
2. Check `coverage.exclude` patterns
3. Ensure source maps are enabled

```bash
pnpm --filter @clarity-chat/react test -- --coverage
```

---

## Configuration Reference

### Vitest Global Options

| Option        | Description                        | Recommended                                       |
| ------------- | ---------------------------------- | ------------------------------------------------- |
| `globals`     | Enable global test functions       | `true`                                            |
| `environment` | Test environment                   | `happy-dom` for React, `node` otherwise           |
| `setupFiles`  | Files to run before tests          | `['./vitest.setup.ts']`                           |
| `pool`        | Worker pool type                   | `vmThreads` for memory-heavy, `threads` otherwise |
| `isolate`     | Isolate tests in separate contexts | `true` for stability, `false` for speed           |
| `testTimeout` | Test timeout in ms                 | `15000` - `20000`                                 |

### Pool Options

#### threads (default)

```typescript
poolOptions: {
  threads: {
    singleThread: false,
    maxThreads: 2,
    minThreads: 1,
  },
}
```

#### vmThreads (memory-optimized)

```typescript
poolOptions: {
  vmThreads: {
    singleThread: true,
    memoryLimit: '512MB',
  },
}
```

### Coverage Options

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  exclude: [
    'node_modules/',
    'dist/',
    '**/*.config.*',
    '**/*.d.ts',
    '**/__tests__/**',
  ],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Vite Configuration](https://vite.dev/config/)
- [Radix UI Testing](https://www.radix-ui.com/docs/primitives/overview/accessibility)

---

**Need help?** Check the [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup or open an issue
on GitHub.
