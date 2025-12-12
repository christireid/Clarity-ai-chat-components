# Clarity Examples - Shared Utilities

Reusable utilities and components for all Clarity Chat examples.

## Available Utilities

### Error Handling

```tsx
import { classifyError, withRetry, formatErrorForUser } from '@clarity-examples/utils/error-handling'
import { ErrorDisplay } from '@clarity-examples/utils/error-handling/react'

// Classify and handle errors
const chatError = classifyError(error)
console.log(chatError.code, chatError.severity, chatError.retryable)

// Retry with exponential backoff
const result = await withRetry(
  () => fetchData(),
  { maxAttempts: 3, baseDelay: 1000 }
)

// Display user-friendly error
<ErrorDisplay
  error={chatError}
  onRetry={() => retry()}
  onDismiss={() => setError(null)}
/>
```

### Loading Skeletons

```tsx
import {
  Skeleton,
  TextSkeleton,
  MessageSkeleton,
  ChatSkeleton,
  FullChatSkeleton,
} from '@clarity-examples/utils/loading'

// Basic skeleton
<Skeleton width={200} height={20} rounded="md" />

// Text placeholder
<TextSkeleton lines={3} />

// Full chat loading state
<FullChatSkeleton />
```

### Dark Mode Toggle

```tsx
import {
  DarkModeToggle,
  DarkModeDropdown,
  useDarkMode,
} from '@clarity-examples/utils/theme'

// Simple toggle button
<DarkModeToggle showLabel size="md" />

// Dropdown with all options
<DarkModeDropdown />

// Hook for custom implementation
const { mode, isDark, setMode, toggle } = useDarkMode({
  defaultMode: 'system',
  storageKey: 'my-theme',
})
```

### Keyboard Shortcuts

```tsx
import {
  KeyboardShortcutsGuide,
  ShortcutsList,
  useKeyboardShortcuts,
  DEFAULT_CHAT_SHORTCUTS,
} from '@clarity-examples/utils/keyboard'

// Show shortcuts guide with trigger button
;<KeyboardShortcutsGuide shortcuts={DEFAULT_CHAT_SHORTCUTS} triggerKey="?" />

// Register custom shortcuts
useKeyboardShortcuts({
  shortcuts: [
    {
      key: 'k',
      modifiers: ['ctrl'],
      description: 'Clear chat',
      action: () => clearChat(),
    },
  ],
})
```

## Usage in Examples

Each example can import these utilities:

```typescript
// In your example's package.json
{
  "dependencies": {
    "@clarity-examples/utils": "workspace:*"
  }
}
```

Then import as needed:

```tsx
import { ErrorDisplay } from '@clarity-examples/utils/error-handling/react'
import { FullChatSkeleton } from '@clarity-examples/utils/loading'
import { DarkModeToggle } from '@clarity-examples/utils/theme'
import { KeyboardShortcutsGuide } from '@clarity-examples/utils/keyboard'
```

## API Reference

### Error Handling

| Export                         | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| `classifyError(error)`         | Converts any error to a structured `ChatError` |
| `withRetry(fn, config)`        | Executes function with automatic retry         |
| `formatErrorForUser(error)`    | Returns user-friendly error message            |
| `shouldShowRetryButton(error)` | Determines if retry is appropriate             |
| `ErrorDisplay`                 | React component for displaying errors          |

### Loading

| Export              | Description                      |
| ------------------- | -------------------------------- |
| `Skeleton`          | Base skeleton component          |
| `TextSkeleton`      | Multi-line text placeholder      |
| `MessageSkeleton`   | Chat message placeholder         |
| `ChatSkeleton`      | Multiple message placeholders    |
| `FullChatSkeleton`  | Complete chat interface skeleton |
| `SkeletonContainer` | Wrapper with loading state       |

### Theme

| Export             | Description                         |
| ------------------ | ----------------------------------- |
| `DarkModeToggle`   | Toggle button for light/dark/system |
| `DarkModeDropdown` | Dropdown selector for theme         |
| `useDarkMode`      | Hook for theme management           |

### Keyboard

| Export                   | Description                      |
| ------------------------ | -------------------------------- |
| `KeyboardShortcutsGuide` | Complete guide with dialog       |
| `ShortcutsList`          | List of shortcuts                |
| `ShortcutsDialog`        | Modal dialog component           |
| `useKeyboardShortcuts`   | Hook for registering shortcuts   |
| `DEFAULT_CHAT_SHORTCUTS` | Standard chat keyboard shortcuts |

## License

MIT
