# API Consolidation Guide

This document outlines the consolidated API structure and import patterns for Clarity Chat after the major consolidation effort.

## Overview

All duplicate implementations have been consolidated to canonical locations. This guide helps you understand where to import from and how to migrate from deprecated patterns.

## Package Architecture

### @clarity-chat/utils - General Utilities

**Canonical for:** Formatting, validation, caching, logging, async operations

```typescript
import {
  // Formatting
  formatBytes,
  formatDuration,
  formatNumber,
  formatPercent,
  truncate,

  // Validation
  isString,
  isNumber,
  isValidEmail,
  isValidUrl,
  assertDefined,

  // Async operations
  debounce,
  throttle,
  retry,
  sleep,

  // Caching
  LRUCache,
  TTLCache,
  memoize,

  // Logging
  getLogger,
  logger,

  // Environment
  isBrowser,
  isNode,
  isDev,
  isProd,
} from '@clarity-chat/utils'
```

**Location:** `/packages/utils/src/`

**Documentation:** [/packages/utils/README.md](../packages/utils/README.md)

---

### @clarity-chat/primitives - UI Primitives

**Canonical for:** Base UI components, ARIA utilities, class name merging

```typescript
import {
  // UI Components
  Button,
  Dialog,
  Tooltip,
  Checkbox,
  Input,

  // Class name utility
  cn,

  // ARIA utilities
  generateAriaId,
  announce,
  getFocusableElements,

  // Animation utilities
  useReducedMotion,
  fadeVariants,
  springPresets,
} from '@clarity-chat/primitives'
```

**Location:** `/packages/primitives/src/`

**Documentation:** [/packages/primitives/README.md](../packages/primitives/README.md)

---

### @clarity-chat/token-optimization - Token Management

**Canonical for:** Token counting, budgeting, compression, model registry

```typescript
import {
  // Token counting (CANONICAL)
  AccurateTokenCounter,
  countTokens,
  estimateTokens,

  // Budget monitoring
  useTokenBudgetMonitor,
  createModelBudgetMonitor,
  TokenBudgetProvider,
  useTokenBudget,

  // Cost calculation
  calculateCost,
  estimateTokenCost,

  // Model registry
  MODEL_REGISTRY,
  isValidModelId,
  getModelsByProvider,

  // Compression
  LLMLinguaCompressor,
  AdaptiveCompressor,
  compressAdaptively,
  ExtractiveCompressor,

  // Caching
  SmartCache,
  TieredCache,
  ExactCache,
} from '@clarity-chat/token-optimization'
```

**Location:** `/packages/token-optimization/src/`

**Documentation:** [/packages/token-optimization/README.md](../packages/token-optimization/README.md)

**Key Changes:**
- `AccurateTokenCounter` is now the canonical token counting implementation
- All compression APIs consolidated here
- Removed `TokenCounter` alias (use `AccurateTokenCounter`)
- Removed `text-compression.ts` module (use compression strategies)

---

### @clarity-chat/memory - Conversation Memory

**Canonical for:** Memory management, conversation persistence

```typescript
import {
  MemoryService,
  useMemory,
  MemoryProvider,
} from '@clarity-chat/memory'
```

**Location:** `/packages/memory/src/`

**Documentation:** [/packages/memory/README.md](../packages/memory/README.md)

---

### @clarity-chat/error-handling - Error Management

**Canonical for:** Error boundaries, error handling, recovery

```typescript
import {
  ErrorBoundary,
  EnhancedErrorBoundary,
  useErrorHandler,
  useErrorBoundary,
} from '@clarity-chat/error-handling'
```

**Location:** `/packages/error-handling/src/`

**Documentation:** [/packages/error-handling/README.md](../packages/error-handling/README.md)

---

### @clarity-chat/react - Chat UI Components

**Primary for:** Chat UI components and hooks

**Re-exports:** Token optimization, utils, primitives (for convenience)

```typescript
import {
  // Primary: Chat components
  ClarityChatApp,
  ChatWindow,
  ChatInput,
  Message,

  // Primary: Chat hooks
  useClarityChat,
  useChatComposable,
  useChat,

  // Re-exports from token-optimization (for convenience)
  AccurateTokenCounter,
  useTokenBudgetMonitor,

  // Re-exports from utils (for convenience)
  formatBytes,
  debounce,

  // Re-exports from primitives (for convenience)
  cn,
  Button,
} from '@clarity-chat/react'
```

**Location:** `/packages/react/src/`

**Documentation:** [/packages/react/README.md](../packages/react/README.md)

---

## Migration Guide

### Token Counting

```typescript
// ❌ Old (deprecated)
import { TokenCounter } from '@clarity-chat/react'
const counter = new TokenCounter()

// ✅ New (canonical)
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
```

### Text Compression

```typescript
// ❌ Old (removed)
import { compressText } from '@clarity-chat/react/utils/tokenization'
const result = compressText(text, 1000)

// ✅ New (canonical)
import { compressAdaptively } from '@clarity-chat/token-optimization'
const result = await compressAdaptively(text, { targetTokens: 1000 })
```

### Utilities

```typescript
// ❌ Old (adds bundle weight)
import { formatBytes, debounce, cn } from '@clarity-chat/react'

// ✅ New (better tree-shaking)
import { formatBytes, debounce } from '@clarity-chat/utils'
import { cn } from '@clarity-chat/primitives'
```

### Caching

```typescript
// ❌ Old (deprecated)
import { LRUCache } from '@clarity-chat/react'

// ✅ New (canonical)
import { LRUCache } from '@clarity-chat/utils'

// For advanced semantic caching:
import { SmartCache, TieredCache } from '@clarity-chat/token-optimization'
```

### Error Boundaries

```typescript
// ❌ Old (multiple implementations)
import { ErrorBoundary } from '@clarity-chat/react'

// ✅ New (canonical)
import { EnhancedErrorBoundary as ErrorBoundary } from '@clarity-chat/error-handling'
```

---

## Deleted/Removed APIs

The following implementations have been removed as duplicates:

### Token Counting
- ❌ `FastTokenCounter` → Use `AccurateTokenCounter`
- ❌ `SimpleTokenCounter` → Use `AccurateTokenCounter`
- ❌ `AdvancedTokenCounter` → Use `AccurateTokenCounter`
- ❌ `LegacyTokenCounter` → Use `AccurateTokenCounter`
- ❌ `TokenCounter` alias → Use `AccurateTokenCounter`

### Compression
- ❌ `text-compression.ts` module → Use compression strategies
- ❌ `compressText()` → Use `compressAdaptively()`
- ❌ `compressForBudget()` → Use `compressAdaptively()`
- ❌ React package compression implementations → Use token-optimization

### Caching
- ❌ Duplicate `LRUCache` in memory package → Use utils package
- ❌ React package cache implementations → Use utils or token-optimization

### Utilities
- ❌ Duplicate `cn()` implementations → Use primitives
- ❌ Duplicate `memoize()` → Use utils
- ❌ Duplicate `pick/omit` → Use utils validation module

---

## Best Practices

### 1. Import from Canonical Packages

```typescript
// ✅ Best: Import from canonical package
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import { formatBytes } from '@clarity-chat/utils'
import { cn } from '@clarity-chat/primitives'

// ⚠️ Works but not recommended: Import from React package
import { AccurateTokenCounter, formatBytes, cn } from '@clarity-chat/react'
```

**Why?**
- Smaller bundle size (better tree-shaking)
- Clearer dependency graph
- Better TypeScript support
- Follows package semantic boundaries

### 2. Use Typed Imports

```typescript
// ✅ Import types from canonical packages
import type { ModelId, TokenBudgetConfig } from '@clarity-chat/token-optimization'
import type { LogLevel, RetryOptions } from '@clarity-chat/utils'
import type { ButtonProps } from '@clarity-chat/primitives'
```

### 3. Avoid Internal Imports

```typescript
// ❌ Don't import from internal directories
import { something } from '@clarity-chat/react/internal/utils'

// ✅ Import from public package exports
import { something } from '@clarity-chat/react'
```

### 4. Check Package Documentation

Each package has comprehensive documentation:
- [@clarity-chat/utils](../packages/utils/README.md)
- [@clarity-chat/primitives](../packages/primitives/README.md)
- [@clarity-chat/token-optimization](../packages/token-optimization/README.md)
- [@clarity-chat/memory](../packages/memory/README.md)
- [@clarity-chat/error-handling](../packages/error-handling/README.md)
- [@clarity-chat/react](../packages/react/README.md)

---

## Verification Checklist

Use this checklist to verify your imports are using canonical packages:

- [ ] Token counting uses `AccurateTokenCounter` from `@clarity-chat/token-optimization`
- [ ] Compression uses strategies from `@clarity-chat/token-optimization`
- [ ] Formatting utils import from `@clarity-chat/utils`
- [ ] Validation utils import from `@clarity-chat/utils`
- [ ] Caching utils import from `@clarity-chat/utils` (or token-optimization for advanced)
- [ ] `cn()` utility imports from `@clarity-chat/primitives`
- [ ] UI components import from `@clarity-chat/primitives` or `@clarity-chat/react`
- [ ] Error handling imports from `@clarity-chat/error-handling`
- [ ] Memory features import from `@clarity-chat/memory`

---

## Quick Reference

| Need | Import From |
|------|-------------|
| Token counting | `@clarity-chat/token-optimization` |
| Compression | `@clarity-chat/token-optimization` |
| Formatting (formatBytes, etc.) | `@clarity-chat/utils` |
| Validation (isString, etc.) | `@clarity-chat/utils` |
| Caching (LRUCache, etc.) | `@clarity-chat/utils` |
| Logging | `@clarity-chat/utils` |
| Class names (`cn`) | `@clarity-chat/primitives` |
| UI primitives (Button, Dialog) | `@clarity-chat/primitives` |
| Chat UI components | `@clarity-chat/react` |
| Error boundaries | `@clarity-chat/error-handling` |
| Memory/context | `@clarity-chat/memory` |

---

## Further Reading

- [Main API Reference](./api-reference.md)
- [Package Architecture](./architecture.md)
- [Migration Guide](../MIGRATION_GUIDE.md)
- [Best Practices](./best-practices.md)
