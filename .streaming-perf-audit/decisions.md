# Phase 0: Orientation & Performance Boundaries

**Completed:** 2026-01-22
**Status:** ✅ Complete

---

## Performance-Critical Surface Map

### 1. STREAMING ENTRY POINTS

#### Protocol Handlers (Low-Level)
- **`packages/react/src/hooks/streaming/use-streaming.ts`** - Generic ReadableStream primitive
- **`packages/react/src/hooks/streaming/use-streaming-sse.tsx`** - SSE with reconnection & resumption
- **`packages/react/src/hooks/streaming/use-streaming-websocket.tsx`** - WebSocket with heartbeat monitoring

#### High-Level Chat Hooks
- **`packages/react/src/hooks/streaming/use-streaming-chat.ts`** - Drop-in streaming chat hook
- **`packages/react/src/hooks/chat/use-assistant.ts`** - Main chat state management

#### Model Adapters with Streaming
- **Anthropic** (`adapters/anthropic.ts`) - Claude streaming with tool use
- **OpenAI** (`adapters/openai.ts`) - GPT streaming with deltas
- **Google** (`adapters/google.ts`) - Gemini streaming

### 2. VIRTUALIZATION COMPONENTS

#### Dual Virtualization Strategy
- **TanStack Virtual** (`components/chat/tanstack-message-list.tsx`) - Modern headless virtualization (50+ messages)
- **React-Window** (`components/chat/virtualized-message-list.tsx`) - Mature variable-size list (100+ messages)
- **Custom Implementation** (`dev-tools/src/react/components/virtual-list.tsx`) - Lightweight dev tools virtualization

#### Auto-Switching Strategy
- `AutoTanStackMessageList` - Switches at 50+ messages
- `AutoVirtualizedMessageList` - Switches at 100+ messages
- Standard `MessageList` - No virtualization for small lists

### 3. PERFORMANCE-CRITICAL RENDER PATHS

#### High-Frequency Components
1. **Message Renderers**
   - `components/message/message.tsx` - Main message component with LazyMarkdownRenderer
   - `components/message/streaming-message.tsx` - Token-by-token streaming display
   - `components/message/streaming-text-renderer.tsx` - Character animation (60fps)

2. **Status Indicators**
   - `components/message/typing-indicator.tsx` - Animated dots with framer-motion
   - `components/message/thinking-indicator.tsx` - Pulse rings with reduced motion support
   - `components/ai/streaming-progress.tsx` - Real-time progress tracking

3. **Virtual Lists**
   - Both virtualized list components use dynamic height caching
   - Scroll position preservation with isNearBottomRef pattern
   - Auto-scroll with 100px threshold detection

#### Performance Optimizations Found
- **React.memo**: Minimal usage (React 19 auto-optimization)
- **useMemo/useCallback**: Strategic usage in virtual lists and streaming hooks
- **useRef for stability**: Callback refs, height caches, scroll position tracking
- **Lazy rendering**: setTimeout(0) deferral for expensive markdown parsing

### 4. PERFORMANCE INSTRUMENTATION

#### Monitoring Hooks
- **`hooks/performance/use-performance.tsx`** - Comprehensive performance tracking
  - `useRenderPerformance()` - Track render times with circular buffer
  - `useWhyDidYouUpdate()` - Debug re-render causes
  - `useMemoryLeakDetector()` - Detect unremoved listeners

#### Specialized Optimization Hooks
- **`hooks/performance/use-battery-aware.tsx`** - Device-aware optimization
- **`hooks/performance/use-smart-throttle.tsx`** - Adaptive throttling
- **`hooks/performance/use-deferred-search.tsx`** - Concurrent search with useDeferredValue
- **`hooks/performance/enhanced.ts`** - Context selectors, batched state, virtual list utilities

#### Streaming Optimizations
- **`utils/streaming/streaming-optimizer.ts`** - Token-aware early stopping, completion detection
- **`hooks/streaming/use-smoothed-text.ts`** - 60fps text rendering with buffering
- **`utils/streaming/message-deduplicator.ts`** - LRU cache with FNV-1a hashing
- **`utils/streaming/sequence-validator.ts`** - Gap/duplicate/ordering detection

### 5. STATE MANAGEMENT PATTERNS

#### Global State
- Context providers for TokenBudget, Memory, Analytics
- Context selector pattern (`useContextSelector`) to prevent unnecessary re-renders

#### Local State
- Standard useState patterns with useState/useReducer
- Batched state updates via `useBatchedState` hook

#### Derived State
- Context monitoring with information density analysis
- Recency scoring with exponential decay
- Token utilization breakdowns

### 6. ACCESSIBILITY & DEVICE-AWARE

#### Accessibility Features
- `useReducedMotion` hook used across all animated components
- ARIA live regions for streaming announcements
- Screen reader-safe virtualization (both implementations)
- Keyboard navigation (End key for jump-to-bottom)

#### Device-Aware Features
- Battery status monitoring with adaptive optimization levels
- Reduced motion respect in all animations
- Deferred rendering for low-end devices

---

## Key Architectural Decisions

### 1. Dual Virtualization Strategy
**Decision:** Support both TanStack Virtual and React-Window
**Rationale:**
- TanStack Virtual is modern but newer
- React-Window is mature and battle-tested
- Provides flexibility for different use cases

**Performance Impact:** Potential for confusion, redundancy, and maintenance burden

### 2. Layered Streaming Architecture
**Decision:** Three-tier streaming (low/mid/high level)
**Rationale:**
- Low-level: Generic ReadableStream handling
- Mid-level: Protocol-specific (SSE, WebSocket)
- High-level: Drop-in chat hooks

**Performance Impact:** Good separation of concerns, but potential for over-abstraction

### 3. Automatic Virtualization Thresholds
**Decision:** Auto-enable virtualization at 50/100 messages
**Rationale:** Balance between simplicity and performance
**Performance Impact:** Good default, but threshold differences between implementations could confuse users

### 4. Height Caching Strategy
**Decision:** Map-based height cache with ref storage
**Rationale:** O(1) lookup, stable across renders
**Performance Impact:** Excellent for virtual scrolling performance

### 5. Scroll Preservation Pattern
**Decision:** isNearBottomRef with 100px threshold
**Rationale:** Users expect auto-scroll only when at bottom
**Performance Impact:** Prevents unwanted scroll jumps, good UX

---

## Performance-Critical Code Patterns Identified

### ✅ Good Patterns
1. **Circular Buffer for Metrics** - O(1) performance tracking without array.shift()
2. **useCallback for Virtual List Callbacks** - Prevents list re-initialization
3. **Height Cache with Map** - Fast O(1) lookups for dynamic heights
4. **Ref-based Callback Storage** - Avoids dependency issues in streaming hooks
5. **requestIdleCallback for Metrics** - Defers non-critical work
6. **Context Selector Pattern** - Prevents cascade re-renders
7. **Batched State Updates** - Reduces render cycles
8. **Battery-Aware Optimization** - Adapts to device state

### ⚠️ Patterns Requiring Investigation (Phase 2)
1. **Dual Virtualization** - Potential redundancy and confusion
2. **Multiple Streaming Formats** - Parser complexity across SSE, JSON-stream, NDJSON, plain-text
3. **Height Cache Invalidation** - Clears cache when message count changes >50 (could be optimized)
4. **Framer Motion Dependencies** - Animation library adds bundle size
5. **Multiple Deduplication Strategies** - Both LRU cache and FNV-1a hashing (could be consolidated)
6. **Force Render Anti-pattern** - useReducer for force updates (virtualized-message-list.tsx:176)

---

## Stop Condition Met ✅

The performance-critical surface has been fully mapped:
- ✅ Streaming entry points identified
- ✅ Virtualization components documented
- ✅ Performance-critical render paths mapped
- ✅ Instrumentation catalogued
- ✅ Architectural decisions captured

**Next Phase:** Phase 1 - Full Indexing
