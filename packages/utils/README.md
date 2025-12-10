# @clarity-chat/utils

Shared utility functions for Clarity Chat packages.

## Installation

```bash
pnpm add @clarity-chat/utils
```

## Usage

### Format Utilities

```typescript
import { formatBytes, formatDelta, formatDuration } from '@clarity-chat/utils'

// Format bytes
formatBytes(1024) // "1 KB"
formatBytes(1536) // "1.5 KB"
formatBytes(1073741824) // "1 GB"

// Format deltas with indicators
formatDelta(110, 100) // "110 (↑ +10)"
formatDelta(90, 100) // "90 (↓ -10)"
formatDelta(100, 100) // "100 (no change)"

// Format durations
formatDuration(500) // "500ms"
formatDuration(1500) // "1.5s"
formatDuration(90000) // "1m 30s"
```

### File System Utilities

```typescript
import { pathExists, directoryExists, fileExists } from '@clarity-chat/utils'

// Check if path exists
if (await pathExists('/path/to/file')) {
  // exists
}

// Aliases for clarity
await directoryExists('/path/to/dir')
await fileExists('/path/to/file.txt')
```

## API Reference

### Format Functions

| Function                                      | Description                               |
| --------------------------------------------- | ----------------------------------------- |
| `formatBytes(bytes, decimals?)`               | Format bytes to human-readable string     |
| `formatDelta(current, previous, unit?)`       | Format numeric delta with arrow indicator |
| `formatDuration(ms)`                          | Format milliseconds to readable duration  |
| `formatNumber(num, options?)`                 | Format number with locale separators      |
| `formatPercent(value, decimals?, isDecimal?)` | Format percentage value                   |

### File System Functions

| Function                | Description            |
| ----------------------- | ---------------------- |
| `pathExists(path)`      | Check if a path exists |
| `directoryExists(path)` | Alias for pathExists   |
| `fileExists(path)`      | Alias for pathExists   |

## Why This Package?

This package consolidates common utility functions that were previously duplicated across multiple
packages in the Clarity Chat monorepo:

- `packages/memory/src/utils/core.ts`
- `packages/dev-tools/src/performance/profiler.ts`
- `packages/react/src/components/performance-dashboard.tsx`
- `tools/scripts/analyze-bundle.js`
- `apps/docs/scripts/lib/utils.ts`

By centralizing these utilities, we:

- Reduce code duplication
- Ensure consistent behavior
- Make maintenance easier
- Provide a single source of truth
