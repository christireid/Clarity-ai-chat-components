# Internal Utilities

> **Warning**: This directory contains internal implementation details. These APIs are **NOT part of
> the public API** and may change without notice.

## Purpose

This directory contains utilities that are:

- Used internally by the library
- Not intended for direct consumer use
- Subject to breaking changes without major version bumps

## Contents

### `assertions.ts`

Type guards and runtime assertions for type safety:

- `isDefined()`, `isNonEmptyString()`, `isValidNumber()`
- `assert()`, `assertDefined()`, `assertNever()`

### `constants.ts`

Shared configuration values:

- Token limits by model
- Streaming configuration defaults
- Animation durations
- Error codes

### `helpers.ts`

Common utility functions:

- `debounce()`, `throttle()`
- `generateId()`, `deepClone()`, `deepMerge()`
- `sleep()`, `retry()`
- `isBrowser()`, `isServer()`

## Usage Guidelines

**For library maintainers:**

```typescript
// Import from internal index
import { isDefined, generateId } from '../internal'
```

**For consumers:** If you find yourself needing these utilities, please:

1. Check if there's a public API that serves your needs
2. Open an issue to discuss making the utility public
3. Consider copying the utility into your own codebase

## Public API Alternatives

| Internal Utility | Public Alternative         |
| ---------------- | -------------------------- |
| `debounce`       | `useDebounce` hook         |
| `throttle`       | `useThrottle` hook         |
| `generateId`     | Use your own ID generation |
| `sleep`          | Standard `setTimeout`      |

## Adding New Utilities

When adding utilities to this directory:

1. Ensure it's truly internal (not needed by consumers)
2. Add comprehensive JSDoc documentation
3. Export from `index.ts`
4. Add tests in `__tests__/internal.test.ts`
