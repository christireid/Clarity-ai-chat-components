# Migration Guide: Consolidating to @clarity-chat/utils

This guide helps you migrate from the deprecated `@clarity-chat/shared-utils` and
`@clarity-chat/errors` packages to the unified `@clarity-chat/utils` package.

## Overview

The `@clarity-chat/utils` package now consolidates:

- `@clarity-chat/utils` (original format utilities)
- `@clarity-chat/shared-utils` (logger, cache, progress) → **DEPRECATED**
- `@clarity-chat/errors` (error classes and utilities) → **DEPRECATED**

The deprecated packages now re-export from `@clarity-chat/utils` and will display deprecation
warnings in development.

## Deprecation Timeline

- **v1.0.0** (current): Deprecation warnings in development
- **v2.0.0** (future): Deprecated packages will be removed

## Import Changes

### From @clarity-chat/shared-utils

```typescript
// Before
import { getLogger, LRUCache, startSpinner } from '@clarity-chat/shared-utils'

// After - Recommended: Import from specific modules
import { getLogger, LogLevel } from '@clarity-chat/utils/logger'
import { LRUCache, TTLCache, memoize } from '@clarity-chat/utils/cache'
import { startSpinner, ProgressTracker } from '@clarity-chat/utils/progress'

// After - Alternative: Import from main entry
import { getLogger, LRUCache, startSpinner } from '@clarity-chat/utils'
```

### From @clarity-chat/errors

```typescript
// Before
import {
  ClarityError,
  APIKeyMissingError,
  ValidationError,
  formatError,
  tryCatch,
} from '@clarity-chat/errors'

// After - Recommended: Import from specific modules
import { ClarityError, APIKeyMissingError, ValidationError } from '@clarity-chat/utils/errors'

import { formatError, tryCatch } from '@clarity-chat/utils/errors'

// After - Alternative: Import from main entry
import {
  ClarityError,
  APIKeyMissingError,
  ValidationError,
  formatError,
  tryCatch,
} from '@clarity-chat/utils'
```

## Module Structure

The new `@clarity-chat/utils` package has categorical exports for optimal tree-shaking:

| Module                           | Exports                                                             |
| -------------------------------- | ------------------------------------------------------------------- |
| `@clarity-chat/utils/format`     | `formatBytes`, `formatDuration`, `formatSize`, `truncate`, etc.     |
| `@clarity-chat/utils/cache`      | `LRUCache`, `TTLCache`, `memoize`, `memoizeAsync`, `createCacheKey` |
| `@clarity-chat/utils/logger`     | `getLogger`, `LogLevel`, `configureLogger`, `info`, `warn`, `error` |
| `@clarity-chat/utils/progress`   | `startSpinner`, `succeedSpinner`, `ProgressTracker`, etc.           |
| `@clarity-chat/utils/errors`     | All error classes and utilities                                     |
| `@clarity-chat/utils/async`      | `debounce`, `throttle`, `retry`, `timeout`, `sleep`, `pool`         |
| `@clarity-chat/utils/validation` | `isString`, `isNumber`, `assertDefined`, `isValidEmail`, etc.       |

## New Features

### TTLCache Auto-Prune

TTLCache now supports automatic pruning of expired entries:

```typescript
import { TTLCache } from '@clarity-chat/utils/cache'

// Enable auto-pruning every 30 seconds
const cache = new TTLCache<string, Data>(60000, { autoPrune: 30000 })

// Don't forget to dispose when done to prevent memory leaks
cache.dispose()
```

### Progress Fallback

When `ora` is not available, progress indicators now use console fallback:

```typescript
import { configureProgress, startSpinner } from '@clarity-chat/utils/progress'

// The spinner will show console output if ora is unavailable
const spinner = await startSpinner('Processing...')
succeedSpinner('Done!')

// To disable fallback output (silent mode)
configureProgress({ fallbackOutput: false })
```

### Async Utilities

New async utilities are now available:

```typescript
import { debounce, throttle, retry, timeout, pool } from '@clarity-chat/utils/async'

// Debounce with cancel/flush
const debouncedFn = debounce(fn, 300)
debouncedFn.cancel()
debouncedFn.flush()

// Retry with exponential backoff
const data = await retry(() => fetchData(), {
  retries: 3,
  delay: 1000,
  backoffFactor: 2,
  shouldRetry: (err) => err.status === 503,
})

// Run tasks with concurrency limit
const results = await pool(tasks, 3) // Max 3 concurrent
```

### Validation Utilities

Type guards and assertions are now available:

```typescript
import { isString, assertDefined, isValidEmail } from '@clarity-chat/utils/validation'

if (isString(value)) {
  // value is narrowed to string
}

assertDefined(user, 'User is required')
// user is now non-nullable

if (isValidEmail(input)) {
  sendEmail(input)
}
```

## API Changes

### Renamed Exports

Some error class names have changed (aliases are provided for backward compatibility):

| Old Name    | New Name       |
| ----------- | -------------- |
| `BaseError` | `ClarityError` |

### New Error Classes

Additional error classes are now available:

- `APITimeoutError` - For API timeout errors
- `CLIError`, `CLIValidationError`, `CLIConfigError` - For CLI-specific errors
- `RangeError`, `FormatError` - Additional validation errors
- `ConfigParseError` - For configuration parsing errors

## Quick Migration Script

For automated migration, you can use these find-and-replace patterns:

```bash
# Replace shared-utils imports
find . -name "*.ts" -exec sed -i 's/@clarity-chat\/shared-utils/@clarity-chat\/utils/g' {} \;

# Replace errors imports
find . -name "*.ts" -exec sed -i 's/@clarity-chat\/errors/@clarity-chat\/utils/g' {} \;
```

## Getting Help

If you encounter issues during migration:

1. Check that you've updated all imports
2. Verify that deprecated packages are updated to latest version
3. Look for deprecation warnings in the console

For bugs or feature requests, please open an issue on the repository.
