# Inventory - Main Branch

**Date:** 2026-01-22
**Branch:** `main` @ `7ed57c479`

---

## 1. Streaming Infrastructure

### Core Hooks

#### `packages/react/src/internal/hooks/use-chat-enhanced.ts`
- **Purpose:** Internal enhanced chat hook with streaming
- **Key Features:**
  - Basic streaming with AbortController
  - Message state management
  - SSE format parsing
  - ❌ NO connection ID tracking
  - ❌ NO reader ref tracking
  - ❌ NO RAF batching
- **Refs Used:** `abortControllerRef`, `currentAssistantMessageRef`, `messageIdRef`, `mountedRef`
- **Export Surface:** `useChat()`, types
- **Critical Gap:** No protection against concurrent stream corruption

#### `packages/react/src/hooks/streaming/use-streaming.ts`
- **Purpose:** Low-level streaming primitive
- **Key Features:**
  - ReadableStream handling
  - Text decoding
  - Chunk processing
  - ❌ Reader cancellation WITHOUT error handling
- **Refs Used:** `readerRef`, `abortControllerRef`, `timeoutRef`, `rafRef`
- **Critical Gap:** `reader.cancel()` can throw unhandled promise rejections

#### `packages/react/src/hooks/streaming/use-streaming-sse.tsx`
- **Purpose:** SSE streaming with reconnection
- **Key Features:**
  - Auto-reconnect with backoff
  - Heartbeat monitoring
  - Event buffer management
  - ❌ Reader cancellation WITHOUT error handling
- **Critical Gap:** `reader.cancel()` in disconnect() lacks error handling

#### `packages/react/src/hooks/streaming/use-streaming-websocket.tsx`
- **Purpose:** WebSocket streaming
- **Status:** Exists on main, branch modifies

---

## 2. Virtualization Components

#### `packages/react/src/components/chat/virtualized-message-list.tsx`
- **Purpose:** react-window based virtualization
- **Key Features:**
  - Basic virtualization with VariableSizeList
  - Height caching
  - Auto-scroll
  - ❌ NO keyboard navigation
  - ❌ NO screen reader mode
  - ❌ NO runtime validation
- **Props:** messages, renderMessage, estimatedItemSize, overscanCount, etc.
- **Critical Gap:** Not accessible for keyboard/screen reader users

#### `packages/react/src/components/chat/tanstack-message-list.tsx`
- **Purpose:** @tanstack/react-virtual based virtualization
- **Key Features:**
  - Dynamic height measurement
  - Smooth scrolling
  - ❌ NO keyboard navigation
  - ❌ NO screen reader mode
  - ❌ NO runtime validation
- **Critical Gap:** Same accessibility issues as VirtualizedMessageList

---

## 3. Chat Components

### Existing on Main

- `chat-input.tsx` - Message input component
- `chat-window.tsx` - Main chat window wrapper
- `clarity-chat.tsx` - Top-level chat component
- `mobile-chat-optimized.tsx` - Mobile optimizations
- `chat-layout.tsx` - Chat layout utilities
- `chat-recipes.tsx` - Pre-configured chat setups
- `chat-sync-status.tsx` - Sync status indicator
- `chat-with-error-boundary.tsx` - Error boundary wrapper
- `clarity-chat-presets.tsx` - Preset configurations
- `clarity-chat-simple.tsx` - Simple chat variant
- `floating-chat-widget.tsx` - Floating widget
- `offline-chat-sync.tsx` - Offline sync handling
- `resizable-chat-layout.tsx` - Resizable layout

### NOT on Main (Branch Additions)
- ❌ `chat-window-header.tsx`
- ❌ `empty-state.tsx`
- ❌ `follow-up-suggestions.tsx`

---

## 4. Message Components

### Existing on Main

- `message.tsx` - Core message component
- `message-list.tsx` - List of messages
- `message-actions.tsx` - Message action buttons
- `message-actions-secure.tsx` - Secure actions
- `message-metadata.tsx` - Message metadata display
- `message-thread-view.tsx` - Thread view
- `message-optimized.tsx` - Optimized variant
- `editable-message-content.tsx` - Editable content
- `markdown-code-block.tsx` - Markdown code rendering
- `stream-block.tsx` - Streaming block
- `streaming-message.tsx` - Streaming message variant
- `streaming-text-renderer.tsx` - Streaming text
- `thinking-indicator.tsx` - Thinking animation
- `typing-indicator.tsx` - Typing animation
- `copy-button.tsx` - Copy functionality
- `delete-button.tsx` - Delete functionality
- `feedback-dialog.tsx` - Feedback collection
- Many more...

### NOT on Main (Branch Additions)
- ❌ `markdown-renderer.tsx`
- ❌ `message-header.tsx`

**Analysis:** Main has extensive message components. Branch additions may duplicate existing functionality.

---

## 5. Hooks

### Chat Hooks (`hooks/chat/`)
**Existing on Main:**
- `use-agent.ts`
- `use-assistant.ts`
- `use-chat-enhanced.ts`
- `use-chat-handlers.ts`
- `use-chat-history.ts`
- `use-chat-sync.ts`
- `use-chat-unified.tsx`
- `use-clarity-chat-with-tools.ts`
- `use-clarity-chat.ts`
- `use-clarity-object.ts`
- `use-completion.ts`
- `use-rag-pipeline.ts`

**NOT on Main (Branch Additions):**
- ❌ `use-chat-editor.ts`
- ❌ `use-message-normalization.ts`

### Accessibility Hooks
**Directory Status:** ❌ Does NOT exist on main
**Branch Additions:**
- `use-screen-reader.tsx` (NEW directory and file)

### UI Hooks (`hooks/ui/`)
**Existing on Main:**
- `use-auto-scroll.tsx` (modified by branch)

### Input Hooks (`hooks/input/`)
**Existing on Main:**
- `use-mobile-keyboard.tsx` (modified by branch)

---

## 6. Runtime Validation

#### `packages/react/src/utils/config/runtime-validation.ts`
**Existing on Main:**
- Basic validators: validateModel, validateTools, validateApiEndpoint, validateEnum, etc.
- ❌ NO validateNumberProp
- ❌ NO validateVirtualizationProps
- ❌ NO validateStreamingProps
- ❌ NO validateCallbacks
- ❌ NO validateMessages

---

## 7. Documentation Structure

### Performance Guides
- ❌ `docs/guides/performance/` directory does NOT exist on main

### Benchmarking
- ❌ `packages/react/__benchmarks__/` directory does NOT exist on main
- ❌ NO benchmarking infrastructure

### Audit Documentation
- ❌ `.streaming-perf-audit/` directory does NOT exist on main

---

## 8. UI Components

### Existing on Main
- Extensive shadcn/ui based component library
- Many UI primitives in `components/ui/`

**NOT on Main (Branch Additions):**
- ❌ `error-banner.tsx`

---

## 9. Profiling Utilities

### Status
- ❌ `packages/react/src/utils/profiling/` directory does NOT exist on main

---

## Key Findings

### ✅ Main Has (Not Modified by Branch)
1. Extensive chat component library
2. Rich message component ecosystem
3. Multiple chat hooks
4. Basic runtime validation
5. Comprehensive UI component library

### ❌ Main Does NOT Have (Branch Adds)
1. Connection ID tracking in streaming
2. Reader cancellation error handling
3. RAF batching in streaming
4. Keyboard navigation for virtualization
5. Screen reader mode for virtualization
6. Expanded runtime validation
7. Accessibility hooks directory
8. Performance documentation structure
9. Benchmarking infrastructure
10. Profiling utilities
11. Several new components (chat-window-header, empty-state, etc.)
12. New hooks (use-chat-editor, use-message-normalization, use-screen-reader)

### 🔍 Modified by Branch (Merge Required)
1. `use-chat-enhanced.ts` - Adds connection tracking
2. `use-streaming.ts` - Adds error handling
3. `use-streaming-sse.tsx` - Adds error handling
4. `virtualized-message-list.tsx` - Adds accessibility
5. `tanstack-message-list.tsx` - Adds accessibility
6. `runtime-validation.ts` - Adds validators
7. `chat-input.tsx`, `chat-window.tsx`, `clarity-chat.tsx` - Various updates
8. `mobile-chat-optimized.tsx` - Style batching
9. `message-list.tsx`, `message.tsx` - Updates
10. `use-auto-scroll.tsx` - Throttling
11. `use-mobile-keyboard.tsx` - Updates
12. `use-clarity-chat.ts` - Updates
13. Storybook stories - Performance notes
14. Package.json - Dependency updates

---

**Summary:** Main has extensive existing infrastructure, but branch adds critical performance and accessibility improvements. No direct conflicts detected, mostly additive with enhancements to existing files.
