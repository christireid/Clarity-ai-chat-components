# API Surface Cohesion Audit - Technical Appendix

**Companion to**: API_COHESION_AUDIT.md **Date**: 2026-01-27

This document provides detailed technical analysis, code examples, and specific file locations for
all issues identified in the main audit report.

---

## Table of Contents

1. [Export Analysis by File](#1-export-analysis-by-file)
2. [Duplicate Export Details](#2-duplicate-export-details)
3. [Naming Inconsistencies](#3-naming-inconsistencies)
4. [Type Coverage Gaps](#4-type-coverage-gaps)
5. [JSDoc Examples](#5-jsdoc-examples)
6. [Bundle Size Analysis](#6-bundle-size-analysis)
7. [Migration Scripts](#7-migration-scripts)

---

## 1. Export Analysis by File

### packages/react/src/public-api.ts

**Total Exports**: 1078+ named exports across 116 export statements

**Breakdown by Category**:

```typescript
// CORE COMPONENTS (Lines 29-50)
export { ClarityChat } // Drop-in component
export { ClarityChatPresets } // Preset configs
export { ChatComplete, ChatWithMemory } // Recipe components

// CORE HOOKS (Lines 52-89)
export { useClarityChat } // Main hook (26 hooks total)
export { useChat as useHeadlessChat } // ⚠️ Alias causing confusion

// AI COMPONENTS (Lines 91-223)
export { Citation } // 15+ AI components
export { EnhancedMarkdownRenderer }
export { CodeBlock } // + 8 code-related exports

// UI COMPONENTS (Lines 225-293)
export { ChatWindow } // 20+ UI components
export { MessageList } // ⚠️ See duplication section
export { FloatingChatWidget }

// MEMORY SYSTEM (Lines 295-319)
export { MemoryProvider } // 5 memory exports

// TOKEN OPTIMIZATION (Lines 321-353)
export type { TokenUsage } // Re-exported from package
export { useTokenCount } // Re-exported hooks

// THEME SYSTEM (Line 359)
export { ThemeProvider, useTheme }

// LICENSE (Lines 362-384)
export { LicenseInfo } // Re-exported from @clarity-chat/license

// TYPES (Lines 386-425)
export type { MessageContent } // ~20 essential types
export type { CoreMessage } // ⚠️ Confusion with Message type

// UTILITIES (Lines 427-617)
export { cn } // CSS utility
export { createUserMessage } // Message helpers
export { toast } // Notifications
export { mockChatAPI } // Testing helpers (~50 test utils)

// ANIMATION UTILITIES (Lines 694-714)
export { createFadeVariant } // ~15 animation helpers

// CHAT PRIMITIVES (Lines 717-744)
export { ChatPrimitive } // Headless primitives

// APP API (Lines 747-756)
export { ClarityChatApp } // Modern unified API
export { useClarityChatApp }

// TOKEN COMPONENTS (Lines 759-784)
export { TokenOptimizationPanel } // Analytics dashboards

// DASHBOARDS (Lines 789-794)
export { AnalyticsDashboard } // 5 dashboard components

// MESSAGE COMPONENTS (Lines 797-807)
export { Message } // ⚠️ Overlap with CoreMessage
export { StreamingTextRenderer }

// CONTEXT & MEMORY (Lines 811-818)
export { ContextManager } // 6 context components

// ADVANCED AI (Lines 821-832)
export { AgentRunFeed } // 8 advanced components
export { createAgent } // ⚠️ No types exported

// ADVANCED INPUT (Lines 835-844)
export { AdvancedChatInput } // 5 advanced inputs

// CONVERSATION (Lines 847-858)
export { ConversationList } // 6 conversation components

// MEDIA (Lines 861-865)
export { DocumentViewer } // 2 media components

// FEEDBACK (Lines 869-877)
export { RetryButton } // 3 feedback components

// UI PRIMITIVES (Lines 881-885)
export { Tabs, Progress, Draggable } // Basic UI primitives

// ADVANCED HOOKS (Lines 889-925)
export { useAssistant } // ~25 advanced hooks
export { useStreamingSSE }
export { useWindowSize }

// AI OPERATIONS (Lines 938-949)
export { PromptTestHarness } // Testing tools
export { EvaluationDashboard }

// UTILITIES (Lines 952-1077)
export { usePerformanceTracking } // Performance
export { testAccessibility } // Testing
export { sanitizeHTML } // Security
export { analyticsManager } // Analytics
```

**Issues**:

1. Single file with 1078+ exports is unmanageable
2. No clear organization beyond comments
3. Difficult to tree-shake when importing from main entry
4. High risk of naming collisions
5. Slow TypeScript compilation time

**Recommendation**: Split into domain-specific files

```typescript
// src/exports/core.ts
export * from './core/components'
export * from './core/hooks'

// src/exports/advanced.ts
export * from './advanced/components'
export * from './advanced/hooks'

// src/public-api.ts
export * from './exports/core'
// Advanced features opt-in
// export * from './exports/advanced'
```

---

### packages/react/package.json Exports

**Current Structure**:

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./core": "./dist/core.js",
    "./core-minimal": "./dist/core-minimal.js",
    "./animations": "./dist/animations/index.js",
    "./utils": "./dist/utils/index.js",
    "./prompt": "./dist/prompt/index.js",
    "./analytics": "./dist/analytics/index.js",
    "./memory": "./dist/memory/index.js",
    "./adapters": "./dist/adapters/index.js",
    "./test-utils": "./dist/test-utils.js",
    "./internal": "./dist/internal.js",
    "./slim": "./dist/slim.js",
    "./namespaced": "./dist/namespaced.js"
  }
}
```

**Issues**:

1. No documentation on differences between:
   - `./core` (what's included?)
   - `./core-minimal` (how minimal?)
   - `./slim` (slimmer than core-minimal?)
2. Missing useful subpaths:
   - `./hooks` - For importing hooks only
   - `./components` - For importing components only
   - `./types` - For type-only imports
3. `./namespaced` exists but unclear what it provides

**Recommended Structure**:

```json
{
  "exports": {
    // Main entry - everything
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },

    // Bundles (by size)
    "./core": {
      "types": "./dist/core.d.ts",
      "import": "./dist/core.js",
      "require": "./dist/core.cjs",
      "description": "Core components and hooks (200KB)"
    },
    "./minimal": {
      "types": "./dist/minimal.d.ts",
      "import": "./dist/minimal.js",
      "require": "./dist/minimal.cjs",
      "description": "Essential features only (50KB)"
    },

    // Feature domains
    "./hooks": {
      "types": "./dist/hooks/index.d.ts",
      "import": "./dist/hooks/index.js",
      "require": "./dist/hooks/index.cjs"
    },
    "./components": {
      "types": "./dist/components/index.d.ts",
      "import": "./dist/components/index.js",
      "require": "./dist/components/index.cjs"
    },
    "./types": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/types/index.js",
      "require": "./dist/types/index.cjs"
    },

    // Specialized features
    "./memory": "./dist/memory/index.js",
    "./analytics": "./dist/analytics/index.js",
    "./test-utils": "./dist/test-utils.js",

    // Internal (discouraged)
    "./internal": {
      "types": "./dist/internal.d.ts",
      "import": "./dist/internal.js",
      "require": "./dist/internal.cjs",
      "description": "⚠️ Unstable internal APIs - use at your own risk"
    }
  }
}
```

---

## 2. Duplicate Export Details

### 2.1 Message List Components

**File**: `packages/react/src/public-api.ts`

**Duplicate Exports**:

```typescript
// Line 252: Aliased export
export { VirtualizedMessageList as MessageList } from './components/chat/VirtualizedMessageList'

// Line 253-262: TanStack variants
export {
  TanStackMessageList,
  AutoTanStackMessageList,
  useMessageListScrollControl,
  useJumpToBottom,
} from './components/chat/TanstackMessageList'

// Line 805: Different component with same name!
export { MessageList as MessageListComponent } from './components/message/MessageList'
```

**Analysis**:

- `VirtualizedMessageList` - Uses react-window for virtualization
- `TanStackMessageList` - Uses @tanstack/react-virtual
- `MessageList` (aliased) - Points to VirtualizedMessageList
- `MessageListComponent` - Completely different component!

**Actual Implementation** (from source files):

```typescript
// packages/react/src/components/chat/VirtualizedMessageList.tsx
export function VirtualizedMessageList(props) {
  // Uses react-window
  return <FixedSizeList {...props} />
}

// packages/react/src/components/chat/TanstackMessageList.tsx
export function TanStackMessageList(props) {
  // Uses @tanstack/react-virtual
  const virtualizer = useVirtualizer({...})
  return <div>...</div>
}

// packages/react/src/components/message/MessageList.tsx
export function MessageList(props) {
  // Simple array.map - NO virtualization
  return <div>{messages.map(...)}</div>
}
```

**Problem**:

1. Three implementations with unclear differences
2. Aliasing creates confusion (`MessageList` → `VirtualizedMessageList`)
3. TanStack exposed as implementation detail

**Recommendation**:

```typescript
// Remove aliases
// export { VirtualizedMessageList as MessageList }  // ❌ Remove

// Clear, descriptive names
export {
  MessageList, // Default (auto-selects implementation)
  MessageListBasic, // Simple array.map
  MessageListVirtual, // High-performance (uses @tanstack/react-virtual)
} from './components/message'

// Implementation detail remains internal
// TanStackMessageList - not exported
```

---

### 2.2 Token Budget Hooks

**File**: `packages/react/src/public-api.ts`

**Duplicate Exports**:

```typescript
// Line 334-337: Context-based API
export {
  TokenBudgetProvider,
  useTokenBudget,
  type TokenBudgetContextValue,
} from './context/token-budget-context'

// Line 913: Standalone hook
export { useTokenBudgetMonitor } from './hooks/token/use-token-budget-monitor'
```

**From token-optimization package**:

```typescript
// packages/token-optimization/src/hooks/index.ts

// Line 487-490: Two names for same hook!
export {
  useTokenBudgetTracking, // New canonical name
  useTokenBudgetMonitor, // Deprecated alias
} from './use-token-budget-monitor'
```

**Analysis**: Three ways to track token budget:

1. `TokenBudgetProvider` + `useTokenBudget` - React Context pattern
2. `useTokenBudgetMonitor` - Standalone hook
3. `useTokenBudgetTracking` - Same as #2, different name

**Problem**:

- No clear guidance on which to use
- Duplication leads to confusion
- Two names for same hook (#2 and #3)

**Recommendation**:

````typescript
// Keep context pattern for shared state
export {
  TokenBudgetProvider,
  useTokenBudget, // Use when inside TokenBudgetProvider
} from './context/token-budget-context'

// Standalone hook - deprecate old name
export {
  useTokenBudgetTracking, // ✅ Use this for standalone
  // useTokenBudgetMonitor, // ❌ Deprecated - use useTokenBudgetTracking
} from '@clarity-chat/token-optimization'

// Add JSDoc to clarify:
/**
 * Track token budget in your component.
 *
 * @example Context pattern (recommended for shared state)
 * ```tsx
 * <TokenBudgetProvider budget={10000}>
 *   <App />
 * </TokenBudgetProvider>
 *
 * function App() {
 *   const { usage } = useTokenBudget()
 * }
 * ```
 *
 * @example Standalone (recommended for isolated components)
 * ```tsx
 * function Chat() {
 *   const { usage } = useTokenBudgetTracking({ budget: 10000 })
 * }
 * ```
 */
````

---

### 2.3 Chat Hooks Hierarchy

**File**: `packages/react/src/public-api.ts`

**Duplicate Exports**:

```typescript
// Lines 56-59: Main hook
export { useClarityChat, type UseClarityChatOptions } from './hooks/chat/use-clarity-chat'

// Lines 63-67: Headless hook (confusing alias)
export {
  useChat as useHeadlessChat, // ⚠️ Alias
  type UseChatOptions as UseHeadlessChatOptions,
} from './hooks/chat/use-chat-enhanced'

// Lines 71-74: Structured output
export { useClarityObject } from './hooks/chat/use-clarity-object'

// Lines 77-81: With tools
export { useClarityChatWithTools } from './hooks/chat/use-clarity-chat-with-tools'

// Lines 84-88: Sync-specific
export { useChatSync } from './hooks/chat/use-chat-sync'

// Lines 750-755: App API hook
export { useClarityChatApp } from './app-api'
```

**Analysis**: Six hooks for chat functionality:

1. `useClarityChat` - Main hook with features
2. `useHeadlessChat` - Alias of `useChat` (different hook!)
3. `useClarityObject` - Structured output
4. `useClarityChatWithTools` - Tool integration
5. `useChatSync` - Cross-device sync
6. `useClarityChatApp` - App API

**Problem**:

- Naming inconsistency ("Clarity" prefix on some, not others)
- `useHeadlessChat` alias is confusing
- No clear hierarchy

**Actual Implementation**:

```typescript
// packages/react/src/hooks/chat/use-chat-enhanced.ts
export function useChat(options) {
  // Minimal hook - AI SDK compatible
  // No memory, no analytics, no rate limiting
}

// packages/react/src/hooks/chat/use-clarity-chat.ts
export function useClarityChat(options) {
  // Enhanced hook with features:
  // - Memory integration
  // - Token optimization
  // - Analytics
  // - Rate limiting
  // Wraps useChat internally
}
```

**Recommendation**:

```typescript
// Clear hierarchy with variants:
export {
  useChat, // Base hook (minimal, AI SDK compatible)
  useChatEnhanced, // Enhanced with memory, analytics (rename from useClarityChat)
  useChatObject, // Structured output (rename from useClarityObject)
  useChatTools, // With tool calling (rename from useClarityChatWithTools)
  useChatSync, // Cross-device sync (keep as-is)
  useChatApp, // App API (rename from useClarityChatApp)
  type UseChatOptions,
  type UseChatEnhancedOptions,
} from './hooks/chat'

// Remove confusing alias
// useChat as useHeadlessChat  // ❌ Delete
```

---

### 2.4 Error Handling Duplication

**Multiple Packages**:

**From @clarity-chat/utils**:

```typescript
// packages/utils/src/errors/utils.ts
export function handleError(error: unknown, context?: ErrorContext) {
  // Basic error handling
}

// packages/utils/src/error-handler.ts
export function handleError(error: unknown, config?: ErrorHandlerConfig) {
  // ⚠️ Different signature, same name!
  // Unified error handler with retry logic
}
```

**From @clarity-chat/react**:

```typescript
// packages/react/src/components/ui/ErrorBoundary.tsx
export function useErrorHandler() {
  // React-specific error handling
}

export function useAsyncErrorHandler() {
  // Async error handling in React
}
```

**Problem**:

1. Two functions named `handleError` in same package!
2. No clear distinction between React and vanilla JS handlers
3. Overlapping functionality

**Recommendation**:

```typescript
// @clarity-chat/utils - Rename for clarity
export { handleError as handleErrorSync } from './errors/utils'
export { handleError as handleErrorAsync } from './error-handler'

// Or merge into single function:
export function handleError(
  error: unknown,
  options?: {
    retry?: boolean
    context?: ErrorContext
    // ...
  }
) {
  // Unified error handling
}

// @clarity-chat/react - Keep as-is (React-specific)
export { useErrorHandler, useAsyncErrorHandler }
```

---

### 2.5 Performance Monitoring Duplication

**From @clarity-chat/utils**:

```typescript
// packages/utils/src/performance-unified.ts
export function measurePerformance(label: string, fn: () => void) {
  // Sync performance measurement
}

export function measurePerformanceAsync(label: string, fn: () => Promise<void>) {
  // Async performance measurement
}
```

**From @clarity-chat/react**:

```typescript
// packages/react/src/hooks/performance/usePerformanceMonitoring.ts
export function usePerformanceTracking(options) {
  // Track component performance
}

export function usePerformanceMonitoring(options) {
  // ⚠️ Very similar to usePerformanceTracking!
}
```

**Analysis**:

```typescript
// Checking the implementations:

// usePerformanceTracking - tracks individual metrics
function usePerformanceTracking(options: {
  componentName?: string
  trackRender?: boolean
  trackInteractions?: boolean
}) {
  // Returns: { metrics, trackEvent }
}

// usePerformanceMonitoring - monitors overall performance
function usePerformanceMonitoring(options: {
  threshold?: number
  onThresholdExceeded?: (metric) => void
}) {
  // Returns: { isMonitoring, metrics, alerts }
}
```

**Problem**:

- Two hooks with overlapping purposes
- Naming doesn't clearly distinguish them
- Could be merged into single hook with options

**Recommendation**:

```typescript
// Merge into single hook:
export function usePerformance(options?: {
  // Tracking options
  componentName?: string
  trackRender?: boolean
  trackInteractions?: boolean

  // Monitoring options
  threshold?: number
  onThresholdExceeded?: (metric) => void

  // Mode selection
  mode?: 'track' | 'monitor' | 'both'
}) {
  // Returns unified interface
  return {
    metrics,
    trackEvent,
    isMonitoring,
    alerts,
  }
}

// Or keep separate with clearer names:
export function usePerformanceMetrics() // Just collect metrics
export function usePerformanceAlerts() // Monitor and alert
```

---

## 3. Naming Inconsistencies

### 3.1 Hook Prefixes

**Inconsistent "Clarity" Prefix**:

```typescript
// ✅ With "Clarity" prefix
useClarityChat
useClarityChatApp
useClarityObject
useClarityChatWithTools

// ❌ Without "Clarity" prefix (in same package!)
useChat
useChatSync
useTokenCount
useMemoryContext
useTheme
```

**Problem**: No clear rule for when to use "Clarity" prefix

**Recommendation**:

```typescript
// Option 1: Remove "Clarity" prefix from all hooks
useChat // Instead of useClarityChat
useChatApp // Instead of useClarityChatApp
useChatObject // Instead of useClarityObject

// Option 2: Add "Clarity" to all main hooks (inconsistent with ecosystem)
useClarityTokenCount // ❌ Verbose
useClarityMemory
useClarityTheme

// RECOMMENDED: Option 1 (align with React ecosystem conventions)
```

---

### 3.2 Component Implementation Leakage

**Problem**: Component names expose implementation details

```typescript
// ❌ Bad: Exposes that we use TanStack Virtual
export { TanStackMessageList }

// ❌ Bad: Exposes that we use React Window
export { VirtualizedMessageList }

// ❌ Bad: What makes this "Auto"?
export { AutoTanStackMessageList }
```

**Recommendation**:

```typescript
// ✅ Good: Names describe behavior, not implementation
export { MessageList } // Smart default
export { MessageListBasic } // Simple, no virtualization
export { MessageListVirtual } // High-performance
export { MessageListOptimized } // Alias for Virtual
```

---

### 3.3 Type Suffix Inconsistency

**Multiple Suffixes for Same Concept**:

```typescript
// Configuration types use different suffixes:
ChatApiConfig // Config suffix
UseChatOptions // Options suffix
TokenBudgetSettings // Settings suffix
ModelRouterConfig // Config suffix
TokenizerOptions // Options suffix

// Return types inconsistent:
UseChatReturn // Return suffix
UseTokenCountResult // Result suffix (different!)
```

**Problem**: Developers can't predict type names

**Recommendation** (Standardize):

```typescript
// Component props: [Component]Props
ChatWindowProps
MessageListProps

// Hook options: Use[Hook]Options
UseChatOptions
UseTokenCountOptions

// Hook returns: Use[Hook]Return
UseChatReturn
UseTokenCountReturn

// Configuration objects: [Feature]Config
TokenBudgetConfig
ModelRouterConfig
CachingConfig

// Function options: [Function]Options
CompressOptions
CountOptions

// Function results: [Function]Result
CompressResult
CountResult
```

---

### 3.4 Constant Naming Inconsistency

**Mixed Case Conventions**:

```typescript
// UPPER_CASE (correct for constants)
DEFAULT_MODEL
MODEL_PRICING
CODE_THEMES

// camelCase (wrong for constants)
smoothingPresets // Should be SMOOTHING_PRESETS
animationFrame // Should be ANIMATION_FRAME

// PascalCase (wrong for constants, right for classes)
ModelRouter // Class (correct)
OptimizerPresets // Object with configs (should be OPTIMIZER_PRESETS)
```

**Recommendation**:

```typescript
// Constants: UPPER_CASE
const DEFAULT_MODEL = 'gpt-4o'
const MODEL_PRICING = { ... }
const SMOOTHING_PRESETS = { ... }

// Config objects: UPPER_CASE
const OPTIMIZER_PRESETS = { ... }

// Classes: PascalCase
class ModelRouter { ... }

// Functions: camelCase
function createOptimizer() { ... }
```

---

## 4. Type Coverage Gaps

### 4.1 Missing Hook Return Types

**Examples**:

```typescript
// ❌ Missing return type
export { useAutoScroll } from './hooks/ui/use-auto-scroll'
// No UseAutoScrollReturn type exported!

// ✅ Has return type
export { useTokenCount, type UseTokenCountReturn } from '@clarity-chat/token-optimization'

// ❌ Missing options type
export { useContextMonitor } from './hooks/context/use-context-monitor'
// No UseContextMonitorOptions exported!
```

**Files Missing Types**:

```typescript
// packages/react/src/public-api.ts

// Line 685-689: Missing types
export { useAutoScroll } from './hooks/ui/use-auto-scroll'
// Missing: UseAutoScrollOptions, UseAutoScrollReturn

// Line 905: Missing types
export { useWindowSize } from './hooks/ui/use-window-size'
// Missing: UseWindowSizeReturn

// Line 922: Missing types
export { useContextMonitor } from './hooks/context/use-context-monitor'
// Missing: UseContextMonitorOptions, UseContextMonitorReturn
```

**Recommendation**:

```typescript
// Audit all hook exports and ensure types are exported:

export {
  useAutoScroll,
  type UseAutoScrollOptions,
  type UseAutoScrollReturn,
} from './hooks/ui/use-auto-scroll'

export { useWindowSize, type UseWindowSizeReturn } from './hooks/ui/use-window-size'

export {
  useContextMonitor,
  type UseContextMonitorOptions,
  type UseContextMonitorReturn,
} from './hooks/context/use-context-monitor'
```

---

### 4.2 Missing Engine Configuration Types

**Problem**:

```typescript
// Line 833-934: Engines exported without config types
export { createRAGEngine } from './app-api/rag-engine'
// ❌ Missing: RAGEngineConfig, RAGEngineReturn

export { createToolsEngine } from './app-api/tools-engine'
// ❌ Missing: ToolsEngineConfig, ToolsEngineReturn

export { createAgent } from './agents'
// ❌ Missing: AgentConfig, Agent
```

**Check Source Files**:

```typescript
// packages/react/src/app-api/rag-engine.ts
export function createRAGEngine(config: RAGEngineConfig) {
  // ✅ Type exists in source
  return { ... }
}

// packages/react/src/app-api/index.ts
export { createRAGEngine } from './rag-engine'
// ❌ Type not re-exported!

// packages/react/src/public-api.ts
export { createRAGEngine } from './app-api/rag-engine'
// ❌ Type not re-exported!
```

**Recommendation**:

```typescript
// Add to public-api.ts:

export { createRAGEngine, type RAGEngineConfig, type RAGEngine } from './app-api/rag-engine'

export { createToolsEngine, type ToolsEngineConfig, type ToolsEngine } from './app-api/tools-engine'

export { createAgent, type AgentConfig, type Agent } from './agents'
```

---

### 4.3 Internal Types Exposed

**Problem**: Debug and internal types exported publicly

```typescript
// packages/token-optimization/src/index.ts

// Lines 246-267: Too many internal types
export type {
  LLMLinguaDebugInfo, // ❌ Internal debug type
  ExtractiveDebugInfo, // ❌ Internal
  AdaptiveDebugInfo, // ❌ Internal
  MonitoringStats, // ❌ Internal
  CacheStats, // ⚠️ Maybe useful?
}
```

**Recommendation**:

```typescript
// Create separate internal exports
// packages/token-optimization/src/internal.ts
export type {
  LLMLinguaDebugInfo,
  ExtractiveDebugInfo,
  AdaptiveDebugInfo,
  MonitoringStats,
}

// Main index.ts - only public types
export type {
  LLMLinguaResult,          // ✅ Public API
  LLMLinguaOptions,         // ✅ Public API
  CacheStats,               // ✅ Useful for monitoring
}

// package.json
{
  "exports": {
    ".": "./dist/index.js",
    "./internal": {
      "types": "./dist/internal.d.ts",
      "import": "./dist/internal.js"
    }
  }
}
```

---

## 5. JSDoc Examples

### 5.1 Missing JSDoc

**Bad Examples** (No JSDoc):

```typescript
// packages/react/src/agents/index.ts
export function createAgent(config) {
  // ❌ No JSDoc!
  return new Agent(config)
}

// packages/react/src/utils/quick-start.ts
export function chat(api: string, options?: any) {
  // ❌ No JSDoc!
  return <ClarityChat api={api} {...options} />
}
```

**Good Examples** (With JSDoc):

````typescript
// packages/token-optimization/src/index.ts
/**
 * Count tokens in text using the specified model.
 *
 * @param text - The text to count tokens for
 * @param options - Token counting options
 * @returns Token count
 *
 * @example
 * ```typescript
 * const count = countTokens('Hello world')
 * console.log(`${count} tokens`)
 * ```
 *
 * @example With model selection
 * ```typescript
 * const count = countTokens('Hello world', { model: 'gpt-4' })
 * ```
 */
export function countTokens(text: string, options?: CountOptions): number {
  // Implementation
}
````

---

### 5.2 Incomplete JSDoc

**Bad Example** (Missing @example):

```typescript
/**
 * Creates a chat configuration
 * @param options - Configuration options
 */
export function createConfig(options) {
  // ❌ No example!
  // ❌ No description of what config is created
  // ❌ No return type documented
}
```

**Good Example**:

````typescript
/**
 * Creates a chat configuration with sensible defaults.
 *
 * Merges provided options with default configuration values,
 * validates the result, and returns a complete config object.
 *
 * @param options - Partial configuration options
 * @returns Complete validated configuration
 * @throws {ValidationError} If configuration is invalid
 *
 * @example Basic usage
 * ```typescript
 * const config = createConfig({
 *   api: '/api/chat',
 *   model: 'gpt-4'
 * })
 * ```
 *
 * @example With memory enabled
 * ```typescript
 * const config = createConfig({
 *   api: '/api/chat',
 *   features: {
 *     memory: true,
 *     analytics: true
 *   }
 * })
 * ```
 *
 * @see {@link ChatConfig} for all available options
 * @see {@link validateConfig} for validation rules
 */
export function createConfig(options: Partial<ChatConfig>): ChatConfig {
  // Implementation
}
````

---

### 5.3 Missing Type Documentation

**Bad Example**:

```typescript
// packages/types/src/message.ts
export interface Message {
  id: string
  role: string
  content: string
  chatId: string
  createdAt: Date
  updatedAt: Date
}
// ❌ No documentation on any field!
```

**Good Example**:

````typescript
/**
 * Represents a message in a conversation.
 *
 * Messages are immutable once created. To modify a message,
 * create a new message object with updated fields.
 *
 * @example User message
 * ```typescript
 * const message: Message = {
 *   id: 'msg_123',
 *   role: 'user',
 *   content: 'Hello!',
 *   chatId: 'chat_456',
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * }
 * ```
 */
export interface Message {
  /**
   * Unique identifier for the message.
   * Format: `msg_[a-zA-Z0-9]{21}`
   */
  id: string

  /**
   * Role of the message sender.
   * - `user`: Message from the end user
   * - `assistant`: Message from the AI assistant
   * - `system`: System message (prompts, instructions)
   * - `tool`: Response from a tool call
   */
  role: 'user' | 'assistant' | 'system' | 'tool'

  /**
   * Message content. Can be:
   * - Plain text string
   * - Markdown string
   * - Structured content (for multi-modal messages)
   */
  content: string

  /**
   * ID of the chat/conversation this message belongs to.
   * Foreign key to {@link ChatSession.id}
   */
  chatId: string

  /**
   * Timestamp when the message was created.
   * Immutable after creation.
   */
  createdAt: Date

  /**
   * Timestamp of the last update to this message.
   * Updated when message is edited.
   */
  updatedAt: Date
}
````

---

## 6. Bundle Size Analysis

### 6.1 Current Bundle Sizes (Estimated)

**@clarity-chat/react**:

```
Main entry (.):           ~450 KB (gzipped: ~120 KB)
  ├─ Core features:       200 KB
  ├─ Advanced features:   150 KB
  ├─ Utils & helpers:     50 KB
  └─ Dependencies:        50 KB

./core:                   ~200 KB (gzipped: ~55 KB)
  ├─ Components:          120 KB
  ├─ Hooks:               50 KB
  └─ Types:               30 KB

./core-minimal:           ~150 KB (gzipped: ~40 KB)
  ├─ Essential only:      120 KB
  └─ Types:               30 KB

./slim:                   ~100 KB (gzipped: ~28 KB)
  ├─ Bare minimum:        80 KB
  └─ Types:               20 KB
```

**Issue**: No clear documentation on what's included in each

---

### 6.2 Recommended Bundle Strategy

**Create Bundle Analyzer Script**:

```typescript
// packages/react/scripts/analyze-bundles.ts

import { analyzeBundle } from '../src/bundle-analyzer'

// Analyze each export path
const bundles = [
  { path: '.', name: 'Full' },
  { path: './core', name: 'Core' },
  { path: './core-minimal', name: 'Core Minimal' },
  { path: './slim', name: 'Slim' },
]

for (const bundle of bundles) {
  const analysis = await analyzeBundle(bundle.path)
  console.log(`
${bundle.name} Bundle Analysis:
  Size: ${analysis.size} KB
  Gzipped: ${analysis.gzipped} KB
  Components: ${analysis.components.length}
  Hooks: ${analysis.hooks.length}
  Dependencies: ${analysis.dependencies.join(', ')}
  `)
}
```

**Document in README**:

```markdown
## Bundle Sizes

| Import                             | Size   | Gzipped | Use Case                           |
| ---------------------------------- | ------ | ------- | ---------------------------------- |
| `@clarity-chat/react`              | 450 KB | 120 KB  | Full-featured applications         |
| `@clarity-chat/react/core`         | 200 KB | 55 KB   | Core features only                 |
| `@clarity-chat/react/core-minimal` | 150 KB | 40 KB   | Essential features                 |
| `@clarity-chat/react/slim`         | 100 KB | 28 KB   | Minimal bundle (bring your own UI) |

### What's included in each bundle?

**Full** (default):

- All components and hooks
- Memory, analytics, RAG
- Development tools
- Testing utilities

**Core**:

- Essential components (ChatWindow, MessageList, ChatInput)
- Core hooks (useClarityChat, useTokenCount)
- Basic theming
- No advanced features

**Core Minimal**:

- Minimal components
- Core hooks only
- No theming, no analytics

**Slim**:

- Hooks only
- No pre-built components
- Bring your own UI
```

---

## 7. Migration Scripts

### 7.1 Hook Naming Migration

**Codemod Script**:

```typescript
// scripts/codemods/standardize-hook-names.ts

import { transformSync } from '@babel/core'

/**
 * Migrates deprecated hook names to new standardized names:
 * - useHeadlessChat → useChat
 * - useClarityChatApp → useChatApp
 * - useTokenBudgetMonitor → useTokenBudgetTracking
 */
export function migrateHookNames(code: string): string {
  const migrations = {
    useHeadlessChat: 'useChat',
    useClarityChatApp: 'useChatApp',
    useTokenBudgetMonitor: 'useTokenBudgetTracking',
  }

  let result = code
  for (const [oldName, newName] of Object.entries(migrations)) {
    // Update import statements
    result = result.replace(
      new RegExp(`import\\s*{([^}]*?)\\b${oldName}\\b([^}]*?)}`, 'g'),
      `import {$1${newName}$2}`
    )

    // Update usage
    result = result.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName)
  }

  return result
}

// Run migration
import { globSync } from 'glob'
import { readFileSync, writeFileSync } from 'fs'

const files = globSync('src/**/*.{ts,tsx}')
for (const file of files) {
  const code = readFileSync(file, 'utf-8')
  const migrated = migrateHookNames(code)
  if (code !== migrated) {
    writeFileSync(file, migrated)
    console.log(`✓ Migrated ${file}`)
  }
}
```

---

### 7.2 Component Naming Migration

**Codemod Script**:

```typescript
// scripts/codemods/standardize-component-names.ts

/**
 * Migrates component names to remove implementation details:
 * - TanStackMessageList → MessageListVirtual
 * - VirtualizedMessageList → MessageListVirtual
 * - AutoTanStackMessageList → MessageListAuto
 */
export function migrateComponentNames(code: string): string {
  const migrations = {
    TanStackMessageList: 'MessageListVirtual',
    VirtualizedMessageList: 'MessageListVirtual',
    AutoTanStackMessageList: 'MessageListAuto',
    StreamStatusProgress: 'StreamProgressIndicator',
  }

  let result = code
  for (const [oldName, newName] of Object.entries(migrations)) {
    // Update imports
    result = result.replace(
      new RegExp(`import\\s*{([^}]*?)\\b${oldName}\\b([^}]*?)}`, 'g'),
      `import {$1${newName}$2}`
    )

    // Update JSX usage
    result = result.replace(new RegExp(`<${oldName}\\b`, 'g'), `<${newName}`)
    result = result.replace(new RegExp(`</${oldName}>`, 'g'), `</${newName}>`)
  }

  return result
}
```

---

### 7.3 Type Suffix Migration

**Codemod Script**:

```typescript
// scripts/codemods/standardize-type-suffixes.ts

/**
 * Standardizes type suffixes:
 * - *Result → *Return (for hooks)
 * - *Settings → *Config (for configuration)
 */
export function migrateTypeSuffixes(code: string): string {
  // Hook return types
  code = code.replace(/\bUse(\w+)Result\b/g, 'Use$1Return')

  // Configuration types
  code = code.replace(/\b(\w+)Settings\b/g, '$1Config')

  return code
}
```

---

## 8. Automated Fixes

### 8.1 JSDoc Generator

**Script to auto-generate JSDoc skeletons**:

```typescript
// scripts/generate-jsdoc.ts

import * as ts from 'typescript'
import { readFileSync, writeFileSync } from 'fs'

/**
 * Generates JSDoc skeletons for functions missing documentation
 */
export function generateJSDoc(filename: string) {
  const code = readFileSync(filename, 'utf-8')
  const sourceFile = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true)

  const transformer =
    <T extends ts.Node>(context: ts.TransformationContext) =>
    (rootNode: T) => {
      function visit(node: ts.Node): ts.Node {
        if (ts.isFunctionDeclaration(node) && !hasJSDoc(node)) {
          const jsDoc = generateJSDocForFunction(node)
          return ts.addSyntheticLeadingComment(
            node,
            ts.SyntaxKind.MultiLineCommentTrivia,
            jsDoc,
            true
          )
        }
        return ts.visitEachChild(node, visit, context)
      }
      return ts.visitNode(rootNode, visit)
    }

  const result = ts.transform(sourceFile, [transformer])
  const printer = ts.createPrinter()
  const transformed = printer.printNode(ts.EmitHint.SourceFile, result.transformed[0], sourceFile)

  writeFileSync(filename, transformed)
}

function hasJSDoc(node: ts.Node): boolean {
  return ts.getJSDocTags(node).length > 0
}

function generateJSDocForFunction(node: ts.FunctionDeclaration): string {
  const name = node.name?.getText() || 'function'
  const params = node.parameters
    .map((p) => {
      const name = p.name.getText()
      return `@param ${name} - TODO: Document parameter`
    })
    .join('\n * ')

  return `*
 * TODO: Document ${name}
 *
 * ${params}
 * @returns TODO: Document return value
 *
 * @example
 * \`\`\`typescript
 * // TODO: Add example
 * \`\`\`
 `
}

// Run for all source files
import { globSync } from 'glob'

const files = globSync('packages/*/src/**/*.ts')
for (const file of files) {
  generateJSDoc(file)
  console.log(`✓ Generated JSDoc skeletons for ${file}`)
}
```

---

## Summary

This technical appendix provides:

1. ✅ **Detailed file locations** for all issues
2. ✅ **Code examples** showing problems and solutions
3. ✅ **Migration scripts** for automated fixes
4. ✅ **Bundle analysis** recommendations
5. ✅ **JSDoc templates** for documentation

**Next Steps**:

1. Review technical details with team
2. Prioritize fixes based on severity
3. Run migration scripts on codebase
4. Re-audit after changes

---

**Companion Document**: API_COHESION_AUDIT.md **Last Updated**: 2026-01-27
