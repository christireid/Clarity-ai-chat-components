# Phase 2 Migration Guide

## Overview

Phase 2 introduces a domain-organized architecture while maintaining **100% backward compatibility**. All existing imports continue to work exactly as before.

## What Changed

### Architecture
- **Before**: All exports from single `index.ts` (470+ lines)
- **After**: Domain-organized exports (6 domain files) + main `index.ts` re-exports everything

### Organization
- **Before**: No clear domain boundaries
- **After**: 6 core domains with clear layering (top/mid/low)

### Naming
- **Before**: Some overlapping names (`useChat` in multiple files)
- **After**: Clear naming with backward-compatible aliases

## Migration Path

### Option 1: No Migration Required (Recommended)

**All existing code continues to work**. You don't need to change anything.

```tsx
// This still works exactly as before
import { ClarityChat, useChat, ChatWindow } from '@clarity-chat/react'
```

### Option 2: Use Domain-Organized Imports (Optional)

If you want to use the new domain-organized structure, you can import from domain-specific files:

```tsx
// Chat UI domain
import { ClarityChat, useChat, ChatWindow } from '@clarity-chat/react/exports/chat-ui'

// Memory domain
import { useMemory, MemoryProvider } from '@clarity-chat/react/exports/memory-context'

// AI Infrastructure domain
import { createAgent, useStreaming } from '@clarity-chat/react/exports/ai-infrastructure'
```

**Note**: This is optional. The main `index.ts` re-exports everything, so domain-specific imports are just for better organization.

## API Changes

### Message Conversion

**Before**:
```tsx
import { coreMessagesToMessages } from '@clarity-chat/react'
```

**After** (still works):
```tsx
import { coreMessagesToMessages } from '@clarity-chat/react' // Still works
```

**Recommended** (new canonical name):
```tsx
import { convertCoreMessagesToMessages } from '@clarity-chat/react'
```

### Chat Hooks

**Before**:
```tsx
import { useChat } from '@clarity-chat/react'
// Could be from use-chat.ts, use-chat-enhanced.ts, or use-chat-unified.ts
```

**After** (still works):
```tsx
import { useChat } from '@clarity-chat/react' // Now resolves to unified version
```

**For specific versions**:
```tsx
import { useChatLegacy } from '@clarity-chat/react' // Legacy version
import { useChatEnhanced } from '@clarity-chat/react' // Enhanced version
import { useChat } from '@clarity-chat/react' // Unified version (recommended)
```

## New APIs Available

### Domain-Organized Exports

You can now import from domain-specific files for better organization:

```tsx
// Chat UI
import { ClarityChat, useChat } from '@clarity-chat/react/exports/chat-ui'

// Memory & Context
import { useMemory, MemoryProvider } from '@clarity-chat/react/exports/memory-context'

// AI Infrastructure
import { createAgent, useStreaming } from '@clarity-chat/react/exports/ai-infrastructure'

// Enterprise Platform
import { useRBAC, useAudit } from '@clarity-chat/react/exports/enterprise-platform'

// Analytics & Observability
import { useAnalytics, AnalyticsProvider } from '@clarity-chat/react/exports/analytics-observability'

// Developer Experience
import { chatPresets, applyChatPreset } from '@clarity-chat/react/exports/developer-experience'
```

### Improved Type Exports

Types are now better organized:

```tsx
// Chat UI types
import type { ClarityChatProps, UseChatOptions, UseChatReturn } from '@clarity-chat/react'

// Memory types
import type { MemoryProviderProps } from '@clarity-chat/react'

// AI Infrastructure types
import type { Agent, AgentConfig } from '@clarity-chat/react'
```

## Breaking Changes

**None**. All existing code continues to work.

## Deprecations

### Deprecated (but still works)

1. **`coreMessagesToMessages`** → Use `convertCoreMessagesToMessages` instead
   - Still works, but `convertCoreMessagesToMessages` is the canonical name

2. **`useClarityChatWithWindow`** → Use `ClarityChat` component instead
   - Still works, but component pattern is simpler

## Best Practices

### For New Code

1. **Use top-level APIs** for common use cases:
   ```tsx
   <ClarityChat api="/api/chat" />
   ```

2. **Use domain-organized imports** if you want better organization:
   ```tsx
   import { ClarityChat } from '@clarity-chat/react/exports/chat-ui'
   ```

3. **Use canonical names**:
   ```tsx
   import { convertCoreMessagesToMessages } from '@clarity-chat/react'
   ```

### For Existing Code

1. **No changes required** - everything still works
2. **Gradually adopt** new patterns when convenient
3. **Use DESIGN.md** to understand the architecture

## Examples

### Before (still works)
```tsx
import { ClarityChat, useChat, ChatWindow, coreMessagesToMessages } from '@clarity-chat/react'

function App() {
  const { messages, sendMessage } = useChat({ api: '/api/chat' })
  return <ChatWindow messages={messages} onSendMessage={sendMessage} />
}
```

### After (optional, better organization)
```tsx
import { ClarityChat } from '@clarity-chat/react/exports/chat-ui'
import { useMemory } from '@clarity-chat/react/exports/memory-context'

function App() {
  return <ClarityChat api="/api/chat" />
}
```

## Questions?

- See `DESIGN.md` for architecture details
- See `PHASE_2_FINAL_OUTPUT.md` for complete summary
- All existing examples continue to work

---

**Status**: ✅ Fully backward compatible
**Migration Required**: ❌ No
**Recommended**: Use new domain-organized imports for better organization (optional)
