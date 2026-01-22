# Phase 1: Full Indexing - Streaming & Virtualization Code Inventory

**Completed:** 2026-01-22
**Status:** ✅ Complete

---

## EXECUTIVE SUMMARY

This inventory documents 100% of the streaming, virtualization, and performance-critical code in the Clarity AI Chat Components repository. The codebase demonstrates a sophisticated three-tier streaming architecture, dual virtualization strategy, and comprehensive performance optimization toolkit.

### Key Statistics
- **Streaming Hooks:** 7 (all public API)
- **Virtualization Components:** 4 (3 production, 1 dev-tools)
- **Performance Hooks:** 5 major utilities
- **UI Performance Hooks:** 4 critical helpers
- **Streaming Utilities:** 6 specialized tools
- **Total LOC Analyzed:** ~5,000+ lines of performance-critical code

### Architecture Overview
1. **Three-Tier Streaming** - Low (ReadableStream) → Mid (SSE/WebSocket) → High (Chat)
2. **Dual Virtualization** - TanStack Virtual (modern) + React-Window (mature)
3. **Layered Optimization** - Battery-aware, adaptive throttling, deferred search, context selectors

---

## PART 1: STREAMING HOOKS (7 Files)

### 1. use-streaming.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/streaming/use-streaming.ts` |
| **Purpose** | Low-level ReadableStream primitive with text decoding and state management |
| **Public/Internal** | **PUBLIC** - Exported from `@clarity-chat/react`, `ai-infrastructure.ts`, `streaming/index.ts` |
| **Render Frequency** | Medium (1-10/sec) - Re-renders on every chunk and stream state change |
| **Performance Sensitivity** | **HIGH** - Foundation for all streaming features |

**Exports:**
- `useStreaming(options?: UseStreamingOptions): UseStreamingReturn`
- Types: `UseStreamingOptions`, `UseStreamingReturn`

**Key Features:**
- Automatic Uint8Array → string decoding
- Timeout protection (STREAM-1)
- Max content length limits (STREAM-2)
- Ref-based callbacks (prevents re-render cascades)
- AbortController support

**Dependencies:**
- React hooks: `useState`, `useRef`, `useCallback`, `useEffect`, `useLayoutEffect`

**Consumers (19 files):**
- Tests, examples, network status component
- Storybook, docs, CLI templates
- Internal exports

**Performance Optimizations:**
- Callbacks stored in refs
- Resource limits (timeout, max length)
- Clean abort handling

---

### 2. use-streaming-sse.tsx

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/streaming/use-streaming-sse.tsx` |
| **Purpose** | Production SSE streaming with reconnection, heartbeat, auth, resumption |
| **Public/Internal** | **PUBLIC** - Exported from main package and AI infrastructure |
| **Render Frequency** | High (5-20+/sec) - Re-renders on every event, status change, reconnection |
| **Performance Sensitivity** | **CRITICAL** - Enterprise-grade streaming infrastructure |

**Exports:**
- `useStreamingSSE(options: UseStreamingSSEOptions): UseStreamingSSEReturn`
- Types: `SSEStatus`, `SSEEvent`, `UseStreamingSSEOptions` (31 properties), `UseStreamingSSEReturn`

**Key Features:**
- Automatic reconnection with exponential backoff + jitter
- Heartbeat/ping monitoring (RECONNECT-3)
- Connection ID tracking (RECONNECT-1: prevents mount/unmount races)
- Sustained success tracking (RECONNECT-2: resets backoff after 3 successes)
- Last-Event-ID resumption (SSE-6)
- Event buffer management (DELIVERY-3: max 1000, configurable)
- Connection timeout (default: 15s)
- Authentication with cookie fallback

**Dependencies:**
- React, `@clarity-chat/utils/logger`

**Consumers (31 files):**
- Most widely used streaming hook
- Apps, Storybook, docs, VSCode extension, MCP server

**Performance Optimizations:**
- Exponential backoff with jitter (prevents thundering herd)
- Heartbeat jitter ±10%
- Memory-bounded event buffer
- Server-suggested retry support

---

### 3. use-streaming-websocket.tsx

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/streaming/use-streaming-websocket.tsx` |
| **Purpose** | Production WebSocket streaming with heartbeat, reconnection, binary support |
| **Public/Internal** | **PUBLIC** - Exported from main package and AI infrastructure |
| **Render Frequency** | High (10-50+/sec) - Re-renders on every message, status change |
| **Performance Sensitivity** | **CRITICAL** - Real-time bidirectional streaming |

**Exports:**
- `useStreamingWebSocket(options: UseStreamingWebSocketOptions): UseStreamingWebSocketReturn`
- Types: `WebSocketStatus`, `WebSocketMessage`, `UseStreamingWebSocketOptions` (29 properties), `UseStreamingWebSocketReturn`

**Key Features:**
- Binary message support (ArrayBuffer, Blob)
- Heartbeat/ping-pong with jitter (RECONNECT-3)
- Connection ID tracking (RECONNECT-1)
- Sustained success tracking (RECONNECT-2)
- Message buffer management (DELIVERY-3)
- Automatic acknowledgment system (DELIVERY-5: at-least-once delivery)
- Clean/unclean close differentiation
- Auto-reconnect on clean close (configurable)

**Dependencies:**
- React, `@clarity-chat/utils/logger`

**Consumers (19 files):**
- Docs, VSCode extension, examples, tests

**Performance Optimizations:**
- Binary message support
- Message buffer with overflow protection
- Heartbeat jitter
- Reconnection intelligence

---

### 4. use-streaming-chat.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/streaming/use-streaming-chat.ts` |
| **Purpose** | Top-level convenience hook for streaming chat with protocol selection |
| **Public/Internal** | **PUBLIC** - Exported from main package and streaming index |
| **Render Frequency** | Medium (2-5/message) - Re-renders on messages, streaming state, errors |
| **Performance Sensitivity** | **MEDIUM** - Convenience wrapper, delegates to useClarityChat |

**Exports:**
- `useStreamingChat(options: UseStreamingChatOptions): UseStreamingChatReturn`
- Types: `UseStreamingChatOptions`, `UseStreamingChatReturn`

**Key Features:**
- Automatic protocol handling (SSE/WebSocket)
- Message conversion (CoreMessage → Message)
- Runtime validation (dev mode only)
- Simplified API surface

**Dependencies:**
- React, `useClarityChat`, message conversion utilities, validation utilities

**Consumers (4 files):**
- Example apps, headless mode, streaming chat demos

**Performance Optimizations:**
- Runtime validation only in dev mode
- Memoized message conversion
- Delegates to optimized useClarityChat

---

### 5. use-stream-status.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/streaming/use-stream-status.ts` |
| **Purpose** | Comprehensive streaming progress tracking with token stats and per-field status |
| **Public/Internal** | **PUBLIC** - Exported from main package and streaming index |
| **Render Frequency** | Medium-High (10/sec default) - Interval-based updates every 100ms |
| **Performance Sensitivity** | **HIGH** - Real-time metrics for progress bars and dashboards |

**Exports:**
- `useStreamStatus(options?: UseStreamStatusOptions): UseStreamStatusReturn`
- `useSimpleStreamStatus(estimatedTotal?: number): StreamStatusReturn`
- Types: `FieldStreamStatus`, `StreamingState`, `FieldStatus`, `TokenStats`, `TimeStats`, `UseStreamStatusOptions`, `UseStreamStatusReturn`, `StreamStatusReturn`

**Key Features:**
- Per-field progress tracking for structured outputs
- Token statistics (received, estimated, tokens/sec)
- Time statistics (elapsed, remaining, TTFT)
- Progress percentage (0-100)
- Pause/resume capability
- Configurable update interval (default: 100ms)
- Debug mode for troubleshooting

**Dependencies:**
- React hooks: `useState`, `useMemo`, `useCallback`, `useRef`, `useLayoutEffect`, `useEffect`

**Consumers (1 file):**
- Public API export only (utility hook for integration)

**Performance Optimizations:**
- Interval-based updates (configurable)
- Ref-based callbacks
- Memoized derived state
- Automatic throughput calculation

---

### 6. use-smoothed-text.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/streaming/use-smoothed-text.ts` |
| **Purpose** | 60fps text rendering with buffering for smooth streaming animation |
| **Public/Internal** | **PUBLIC** - Exported from main package and streaming index |
| **Render Frequency** | Very High (~60fps) - Re-renders every 16ms during animation |
| **Performance Sensitivity** | **CRITICAL** - Animation performance directly affects UX |

**Exports:**
- `useSmoothedText(text: string, options?: UseSmoothedTextOptions): UseSmoothedTextReturn`
- Constants: `smoothingPresets` (default, fast, typewriter, instant)
- Types: `UseSmoothedTextOptions`, `UseSmoothedTextReturn`

**Key Features:**
- Consistent 60fps rendering (default: 16ms frame delay)
- Character-by-character reveal (default: 2 chars/frame)
- Buffer management (default: max 100 chars)
- Adaptive catch-up (default: 8 chars/frame when buffer full)
- Four presets: default, fast, typewriter, instant
- Flush and reset controls

**Dependencies:**
- React hooks: `useState`, `useMemo`, `useCallback`, `useRef`, `useEffect`

**Consumers (1 file):**
- Public API export only (UI enhancement hook)

**Performance Optimizations:**
- `requestAnimationFrame` for optimal rendering
- Throttled to configurable frame delay
- Adaptive catch-up when buffered
- Zero re-renders when disabled
- Cleanup of animation frames

---

### 7. use-streamable-ui.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/streaming/use-streamable-ui.ts` |
| **Purpose** | Universal adapter for streaming UI from multiple source types |
| **Public/Internal** | **PUBLIC** - Exported from main package and AI infrastructure |
| **Render Frequency** | High (5-50+/sec) - Re-renders on every streamed value, status change |
| **Performance Sensitivity** | **HIGH** - Universal streaming adapter with multiple protocols |

**Exports:**
- `useStreamableUI<T>(source: StreamableSource<T> | null | undefined, options?: UseStreamableUIOptions<T>): UseStreamableUIState<T>`
- Types: `StreamableValueLike<T>`, `StreamableSource<T>`, `TransformFn<T>`, `CompleteWhenFn`, `UseStreamableUIOptions<T>`, `UseStreamableUIState<T>`

**Key Features:**
- Multiple source types: StreamableValue, AsyncIterable, Promise, ReadableStream
- Vercel AI SDK compatibility
- Transform functions for payload processing
- Custom completion logic
- Append/replace modes
- Error handling with callbacks

**Dependencies:**
- React hooks: `useState`, `useCallback`, `useRef`, `useEffect`

**Consumers (1 file):**
- Storybook stories

**Performance Optimizations:**
- ReadableStream → AsyncIterable conversion
- Automatic cleanup and cancellation
- Iterator return() support
- Ref-based callbacks
- Mode selection (append vs replace)

---

## PART 2: VIRTUALIZATION COMPONENTS (4 Files)

### 1. VirtualizedMessageList (react-window)

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/components/chat/virtualized-message-list.tsx` |
| **Purpose** | Virtual scrolling with react-window for 1000+ message conversations |
| **LOC** | 472 lines |
| **Public/Internal** | **PUBLIC** - Exported as MessageList alias |
| **Render Frequency** | High - Re-renders on scroll, message changes, height updates |
| **Performance Sensitivity** | **CRITICAL** - Handles massive message lists |

**Exports:**
- `VirtualizedMessageList` - Main virtualized component
- `AutoVirtualizedMessageList` - Auto-enables at 100+ messages
- `useMessageListPerformance` - Performance metrics hook
- Types: `VirtualizedMessageListProps`, `AutoVirtualizedMessageListProps`

**Key Features:**
- Uses `VariableSizeList` from react-window
- Manual height caching with `MessageHeightCache` class
- AutoSizer for responsive layout
- Overscan: 3 items (configurable)
- Auto-scroll with 100px threshold
- Scroll position preservation
- Height cache invalidation when message count changes >50

**Dependencies:**
- `react-window` (v1.8.11)
- `react-virtualized-auto-sizer` (v1.0.26)
- React, internal types

**Consumers (21 files):**
- Most widely used virtualization component
- Apps, examples, docs, Storybook

**Height Management:**
- `MessageHeightCache` class: Map-based O(1) lookups
- Default height: 150px
- `resetAfterIndex()` for height updates
- Cache invalidation on major changes

**Performance Characteristics:**
- Bundle size: 25KB
- Render frequency: High
- Manual height management required
- Stable and battle-tested

---

### 2. TanStackMessageList (TanStack Virtual) ⭐ RECOMMENDED

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/components/chat/tanstack-message-list.tsx` |
| **Purpose** | Modern headless virtualization with built-in height measurement |
| **LOC** | 418 lines |
| **Public/Internal** | **PUBLIC** - Exported from main package |
| **Render Frequency** | Medium - Better than react-window due to built-in measurement |
| **Performance Sensitivity** | **HIGH** - Modern, optimized virtualization |

**Exports:**
- `TanStackMessageList` - Main virtualized component
- `AutoTanStackMessageList` - Auto-enables at 50+ messages
- `useMessageListScrollControl` - Scroll behavior hook
- `useJumpToBottom` - Jump-to-bottom button implementation
- Types: `TanStackMessageListProps`, `AutoTanStackMessageListProps`

**Key Features:**
- Uses `useVirtualizer` from @tanstack/react-virtual
- Built-in dynamic height measurement (`measureElement`)
- No manual cache required!
- Auto-scroll with smooth scrolling
- Scroll threshold: 100px
- Gap support: 8px between items
- Overscan: 5 items (default)

**Dependencies:**
- `@tanstack/react-virtual` (v3.11.2)
- React, internal types

**Consumers (5 files):**
- Newer, growing adoption
- Examples, docs, Storybook

**Height Management:**
- Automatic via `measureElement` callback
- No manual cache needed
- `getBoundingClientRect().height` measurement

**Performance Characteristics:**
- Bundle size: 16KB (36% smaller than VirtualizedMessageList!)
- Render frequency: Medium (more efficient)
- Built-in height measurement
- Modern headless architecture

**Recommendation:** Use for all new implementations

---

### 3. MessageList (Standard)

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/components/message/message-list.tsx` |
| **Purpose** | Standard message list with animations, grouping, separators |
| **LOC** | 524 lines |
| **Public/Internal** | **PUBLIC** - Exported from main package |
| **Render Frequency** | High - Framer Motion animations, all messages rendered |
| **Performance Sensitivity** | **LOW-MEDIUM** - Not virtualized, best for <50 messages |

**Exports:**
- `MessageList` - Main component
- Types: `MessageListProps`

**Key Features:**
- Message grouping (consecutive same sender)
- Time separators (day boundaries)
- Framer Motion animations (pulse, fade)
- Auto-scroll with threshold
- Jump-to-bottom button with badge
- ARIA live region for announcements
- Keyboard shortcut (End key)
- Scroll position preservation

**Dependencies:**
- `framer-motion`
- React, internal components, hooks

**Consumers (19 files):**
- Widely used for standard chat UIs
- Apps, examples, docs

**Performance Characteristics:**
- Bundle size: 70KB (with animations)
- Render frequency: High
- Best for <50 messages
- Rich features and animations

**Recommendation:** Use for small to medium message lists with rich UX

---

### 4. VirtualList (Dev Tools)

| Property | Value |
|----------|-------|
| **Path** | `/packages/dev-tools/src/react/components/virtual-list.tsx` |
| **Purpose** | Lightweight custom virtualization for dev tools |
| **LOC** | 199 lines |
| **Public/Internal** | **INTERNAL** - Dev-tools package only |
| **Render Frequency** | Low - Fixed heights only |
| **Performance Sensitivity** | **LOW** - Dev tool only, not production |

**Exports:**
- `VirtualList<T>` - Basic virtualized list
- `AutoSizeVirtualList<T>` - Auto-sizing variant with ResizeObserver
- `useVirtualListScrollTo<T>` - Scroll utilities
- Types: `VirtualListProps<T>`, etc.

**Key Features:**
- Fixed item heights only
- Simple overscan (3 items)
- ResizeObserver for container size
- Scroll position tracking
- No external dependencies

**Dependencies:**
- React only

**Consumers (2 files):**
- Internal dev tools only

**Performance Characteristics:**
- Minimal bundle size
- Fixed heights only
- Not for production use

---

## PART 3: PERFORMANCE HOOKS (5 Files)

### 1. use-performance.tsx

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/performance/use-performance.tsx` |
| **Purpose** | Performance monitoring for render tracking, timing, optimization detection |
| **Public/Internal** | **PUBLIC** - Exported via `@clarity-chat/react/analytics` and hooks/performance |
| **Render Frequency** | Every render (lightweight ref operations) |
| **Performance Sensitivity** | **CRITICAL** - Monitoring infrastructure |

**Exports:**
- **Hooks:** `useRenderPerformance`, `useWhyDidYouUpdate`, `useMountTime`, `useSlowRenderDetection`, `useLazyLoad`, `useDebouncePerformance`, `useThrottlePerformance`, `useMemoryLeakDetector`
- **Components:** `PerformanceReport` (dev only)
- **Classes:** `NumericCircularBuffer` (O(1) circular buffer)
- **Types:** `PerformanceMetrics`, `PerformanceReportProps`

**Key Features:**
- Circular buffer for render times (O(1), capacity: 100)
- Development-only warnings (>16ms = slow)
- Memory leak detection (event listeners)
- Lazy loading utilities
- Performance metrics display

**Dependencies:**
- React hooks

**Consumers (2 files):**
- Analytics/observability exports
- Marketing site knowledge base

**Performance Optimizations:**
- O(1) circular buffer (no array.shift())
- Ref-based tracking (minimal overhead)
- Dev-only logging
- Running average calculation

---

### 2. use-battery-aware.tsx

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/performance/use-battery-aware.tsx` |
| **Purpose** | Battery-aware optimization for reducing CPU/memory on low battery |
| **Public/Internal** | **PUBLIC** - Exported via hooks/performance |
| **Render Frequency** | Low - Only on battery status changes |
| **Performance Sensitivity** | **HIGH** - Device-aware optimization |

**Exports:**
- `useBatteryAware(config?)` - Monitor battery and provide recommendations
- `withBatteryOptimizations(Component, config)` - HOC wrapper
- Types: `BatteryStatus`, `BatteryAwareConfig`, `OptimizationRecommendations`

**Key Features:**
- Adaptive update intervals (100ms high battery → 1000ms critical)
- Optimization levels: none → minimal → moderate → aggressive
- Battery thresholds: critical (5%), low (20%), medium (50%)
- Graceful fallback for unsupported browsers

**Dependencies:**
- React, Browser Battery API

**Consumers:** None found (unused but valuable)

**Performance Optimizations:**
- Adaptive intervals based on battery
- Refs to avoid re-renders
- Graceful degradation

**Recommendation:** Promote this feature with documentation and examples

---

### 3. use-smart-throttle.tsx

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/performance/use-smart-throttle.tsx` |
| **Purpose** | Advanced throttling with adaptive delays and token savings tracking |
| **Public/Internal** | **PUBLIC** - Exported via hooks/performance |
| **Render Frequency** | On setValue and timer completion |
| **Performance Sensitivity** | **HIGH** - Prevents excessive API calls |

**Exports:**
- `useSmartThrottle(options)` - Smart throttling with adaptive delays
- `useStreamThrottle(delay)` - Throttle streaming responses
- Types: `UseSmartThrottleOptions`, `UseSmartThrottleReturn`

**Key Features:**
- Adaptive delays (1.5x for <10 chars, 1.2x for <20 chars)
- Token savings tracking (calls prevented)
- Cancel and execute now controls
- Minimum length threshold

**Dependencies:**
- React hooks

**Consumers:** None found (unused but valuable)

**Performance Optimizations:**
- Adaptive delays prevent premature API calls
- Statistics tracking (throttleCount, totalInputs, callsSaved)
- Reference-based state

**Recommendation:** Document use cases or deprecate

---

### 4. use-deferred-search.tsx

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/performance/use-deferred-search.tsx` |
| **Purpose** | React 18+ deferred search with fuzzy matching, regex, highlighting |
| **Public/Internal** | **PUBLIC** - Exported via hooks/performance |
| **Render Frequency** | Uses `useDeferredValue` for automatic priority deferral |
| **Performance Sensitivity** | **CRITICAL** - Prevents UI blocking during search |

**Exports:**
- `useDeferredSearch(messages, searchQuery, options)` - Deferred search
- `highlightText(text, indices, renderer)` - Generic highlighter
- `highlightSearchText(text, query, className)` - HTML highlighter
- `HighlightedText` - React component
- Types: `DeferredSearchOptions`, `SearchMatch`, `DeferredSearchResult`

**Key Features:**
- React 18's `useDeferredValue` for concurrent features
- Fuzzy matching with Levenshtein distance
- Regex support with ReDoS protection
- Position-based scoring
- Match highlighting with index merging

**Dependencies:**
- React, `@clarity-chat/types`

**Consumers (2 files):**
- Performance hooks index
- Message search component

**Performance Optimizations:**
- Deferred computation (non-blocking)
- Regex limits (100 chars max, 100 matches max)
- Max results limit
- Field-based scoring
- ReDoS protection

**Algorithms:**
- Levenshtein distance: O(m*n)
- Fuzzy scoring with similarity threshold
- Index merging for overlapping matches

---

### 5. enhanced.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/performance/enhanced.ts` |
| **Purpose** | Consolidated performance utilities for React 19 / Next.js 15 |
| **Public/Internal** | **PUBLIC** - Exported via hooks/performance and multiple entry points |
| **Render Frequency** | Varies by hook |
| **Performance Sensitivity** | **CRITICAL** - Core optimization infrastructure |

**Exports:**
- **Core:** `useMemoizedCallback`, `useBatchedState`
- **Effects:** `useUpdateEffect`, `useThrottledEffect`, `useDebouncedEffect`
- **Memoization:** `useMemoizedSelector`, `useDeepMemo`
- **Virtual:** `useVirtualList`, `useDynamicVirtualList`
- **Events:** `useEventDelegation`, `useIntersectionObserver`
- **Context:** `useContextSelector`, `useMultipleContexts`
- **Utils:** `measurePerformance`

**Key Features:**
- Virtual scrolling (fixed and dynamic heights)
- Batched state updates
- Deep equality memoization
- Context selectors (prevent cascade re-renders)
- Event delegation
- Performance measurement

**Dependencies:**
- React hooks

**Consumers (105 files):**
- Widely used across codebase
- Prompt optimization, chat hooks, utilities, components

**Performance Optimizations:**
- Virtual list: O(visible items) instead of O(n)
- Batched state: O(1) instead of O(updates)
- Deep memoization prevents recalculation
- Context selectors prevent full re-renders
- Dev mode logging

**Algorithms:**
- Deep equality: Recursive comparison
- Virtual list: Binary search for dynamic heights
- Batching: Accumulate in ref, flush on endBatch

---

## PART 4: UI PERFORMANCE HOOKS (4 Files)

### 1. use-auto-scroll.tsx

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/ui/use-auto-scroll.tsx` |
| **Purpose** | Auto-scroll to bottom with near-bottom detection |
| **Public/Internal** | **PUBLIC** - Exported via hooks/ui and multiple entry points |
| **Render Frequency** | On scroll events and dependency changes |
| **Performance Sensitivity** | **HIGH** - Critical for chat UX |

**Exports:**
- `useAutoScroll(options)` - Auto-scroll with threshold detection
- Types: `UseAutoScrollOptions`, `UseAutoScrollReturn`

**Key Features:**
- Near-bottom detection (default: 100px threshold)
- Smooth scroll behavior
- requestAnimationFrame for smooth updates
- Enable/disable toggle
- Manual scroll control

**Dependencies:**
- React, `useSafeAnimationFrame`

**Consumers (7 files):**
- Benchmarks, tests, hooks/ui index, internal API, public API, message-list, core-minimal

**Performance Optimizations:**
- Passive scroll listener (non-blocking)
- requestAnimationFrame for DOM updates
- Ref-based functions (avoid dependency issues)
- Threshold-based (reduces triggers)

**Algorithm:**
- Distance: `scrollHeight - scrollTop - clientHeight`
- Near bottom: `distance <= threshold (100px)`

---

### 2. use-throttle.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/ui/use-throttle.ts` |
| **Purpose** | Throttle value updates and callback execution |
| **Public/Internal** | **PUBLIC** - Exported via hooks/ui and public API |
| **Render Frequency** | Max once per delay period (default: 500ms) |
| **Performance Sensitivity** | **HIGH** - Prevents excessive updates |

**Exports:**
- `useThrottle(value, delay)` - Throttle value updates
- `useThrottledCallback(callback, delay)` - Throttle callbacks

**Dependencies:**
- React hooks

**Consumers (5 files):**
- Tests, hooks/ui index, internal API, public API, internal exports

**Performance Optimizations:**
- Trailing edge execution
- Cleanup on unmount
- Ref-based callback (avoid recreation)
- Timestamp tracking

**Algorithm:**
- Timer-based rate limiting
- Remaining time: `delay - timeSinceLastRun`

---

### 3. use-debounce.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/ui/use-debounce.ts` |
| **Purpose** | Debounce value updates and callbacks with controls |
| **Public/Internal** | **PUBLIC** - Exported via hooks/ui and public API |
| **Render Frequency** | Once after delay since last change (default: 500ms) |
| **Performance Sensitivity** | **HIGH** - Prevents rapid-fire updates |

**Exports:**
- `useDebounce(value, delay)` - Debounce value updates
- `useDebouncedCallback(callback, delay)` - Debounce callbacks
- `useDebouncedCallbackWithControls(callback, delay)` - With cancel/flush

**Dependencies:**
- React hooks

**Consumers (8 files):**
- Benchmarks, tests, hooks/ui index, internal/public API, advanced chat input, command palette

**Performance Optimizations:**
- Timer reset on value change
- Cancel mechanism (abort pending)
- Flush mechanism (immediate execution)
- Ref-based callback (prevents stale closures)

---

### 4. use-intersection-observer.tsx

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/hooks/ui/use-intersection-observer.tsx` |
| **Purpose** | Observe element visibility with IntersectionObserver API |
| **Public/Internal** | **PUBLIC** - Exported via hooks/ui and internal API |
| **Render Frequency** | On intersection state changes only |
| **Performance Sensitivity** | **MEDIUM** - Browser-optimized |

**Exports:**
- `useIntersectionObserver(options)` - Observe element intersection
- Types: `UseIntersectionObserverOptions`, `UseIntersectionObserverReturn`

**Key Features:**
- Native IntersectionObserver API
- Freeze-on-first-intersection (lazy loading optimization)
- SSR-safe (checks for window.IntersectionObserver)
- Configurable threshold and rootMargin

**Dependencies:**
- React hooks

**Consumers (2 files):**
- hooks/ui index, internal API

**Performance Optimizations:**
- Native browser API (optimized)
- Options in ref (prevents recreation)
- Freeze option (stops updates after first intersection)
- SSR handling

---

## PART 5: STREAMING UTILITIES (6 Files)

### 1. streaming-optimizer.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/utils/streaming/streaming-optimizer.ts` |
| **Purpose** | Streaming optimization with early stopping and token savings |
| **Public/Internal** | **PUBLIC** - Exported via utils/streaming |
| **Performance Sensitivity** | **CRITICAL** - 10-20% token savings potential |

**Exports:**
- Classes: `StreamingResponseMonitor`, `PartialResponseCache`
- Functions: `createOptimizedStreamHandler`, `hashQuery`, `estimateResponseLength`, `getRecommendedMaxTokens`
- Constants: `DEFAULT_COMPLETION_SIGNALS` (14 patterns), `DEFAULT_EARLY_STOP_PATTERNS` (6 regex, ReDoS-safe)
- Types: `StreamingOptimizationConfig`, `ChunkAnalysis`, `StreamingMetrics`, `PartialResponseEntry`

**Key Features:**
- Early stopping criteria (max tokens, completion signals, patterns, repetition)
- Minimum tokens before check: 100
- Confidence threshold: 0.7
- LRU cache with TTL (5 min, 100 entries)
- Checkpointing every 500 tokens

**Dependencies:**
- `../tokenization/estimator`

**Consumers (1 file):**
- utils/streaming index

**Performance Impact:**
- 10-20% output token savings
- Completion detection: sliding window (last 500 chars)
- Pattern matching: limited window (last 200 chars, max 100 matches)
- Repetition: word set uniqueness < 30%

**Algorithms:**
- FNV-1a hash for query hashing
- String matching in sliding windows
- ReDoS-safe regex patterns
- LRU cache with TTL

---

### 2. streaming-parser.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/utils/streaming/streaming-parser.ts` |
| **Purpose** | Parse various streaming formats from AI providers |
| **Public/Internal** | **PUBLIC** - Exported via utils/streaming |
| **Performance Sensitivity** | **HIGH** - Format detection and parsing |

**Exports:**
- Functions: `parseStreamingChunk`, `extractContentFromChunk`, `hasToolInvocation`, `extractToolInvocation`, `parseSSEDataLine`
- Generators: `createStreamingReader`, `parseStreamingResponse`
- Classes: `StreamingAccumulator`
- Types: `StreamingChunk`

**Key Features:**
- Format support: OpenAI chat, OpenAI completions, direct content, text, delta, message wrapper
- Line-based parsing (prevents memory buildup)
- Buffer management for incomplete lines
- Generator-based streaming (lazy evaluation)
- Tool invocation tracking

**Dependencies:** None (pure utility)

**Consumers:** None found (likely internal)

**Algorithms:**
- Streaming buffer: line-based accumulation
- Format detection: nested property checks
- SSE parsing: data: prefix, [DONE] handling
- Accumulator: string concatenation + tool tracking

---

### 3. streaming-helpers.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/utils/streaming/streaming-helpers.ts` |
| **Purpose** | Reusable streaming logic for SSE, JSON, plain text with retry |
| **Public/Internal** | **PUBLIC** - Exported via utils/streaming |
| **Performance Sensitivity** | **CRITICAL** - Core streaming infrastructure |

**Exports:**
- Classes: `SSEEventParser`, `StreamAccumulator`
- Functions: `parseSSELine`, `safeParseJSON`, `extractStreamContent`, `processStream`, `retryStream`, `mergeStreams`
- Generators: `createStreamReader`, `splitStream`, `filterStream`, `bufferStream`
- Types: `StreamFormat`, `StreamChunk`, `StreamOptions`, `StreamResult`

**Key Features:**
- Multi-format support: SSE, JSON-stream, plain-text, ndjson
- Exponential backoff (1s base, 30s max) with jitter
- Buffer management (max 64KB per chunk)
- Line ending support (\n and \r\n)
- SSE multi-line data accumulation
- AbortSignal support
- Performance tracking (duration, bytes, chunks)

**Dependencies:** None (pure utility)

**Consumers (5 files):**
- use-clarity-object, use-completion, tests, docs

**Performance Optimizations:**
- Max chunk size: 64KB
- Exponential backoff with jitter
- State machine for SSE framing
- Deduplication support (FNV-1a)

**Algorithms:**
- SSE parser: state machine
- Exponential backoff: `min(baseDelay * 2^(attempt-1) * (0.5 + random()), maxDelay)`
- Stream merging: Promise.all

---

### 4. message-deduplicator.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/utils/streaming/message-deduplicator.ts` |
| **Purpose** | Detect and remove duplicate messages using IDs or content hashing |
| **Public/Internal** | **PUBLIC** - Exported via utils/streaming |
| **Performance Sensitivity** | **HIGH** - Deduplication for streaming scenarios |

**Exports:**
- Classes: `MessageDeduplicator` (LRU cache with TTL)
- Hooks: `useMessageDeduplicator(options)`
- Types: `DeduplicatableMessage`, `MessageDeduplicatorOptions`

**Key Features:**
- LRU eviction (max 1000 entries)
- TTL cleanup (5 minutes default)
- FNV-1a hash for content-based deduplication
- Optional content hashing (disabled by default)

**Dependencies:**
- React (for hook)

**Consumers:** None found (utility for custom implementations)

**Performance:**
- LRU eviction: O(n) scan for oldest
- TTL cleanup: O(n) on isDuplicate call
- FNV-1a hash: fast, non-cryptographic
- Max tracked IDs: 1000

**Algorithms:**
- FNV-1a hash
- LRU cache with timestamp tracking
- TTL expiration on access

---

### 5. sequence-validator.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/utils/streaming/sequence-validator.ts` |
| **Purpose** | Detect out-of-order, missing, or duplicate messages |
| **Public/Internal** | **PUBLIC** - Exported via utils/streaming |
| **Performance Sensitivity** | **LOW** - Simple counter comparison |

**Exports:**
- Classes: `SequenceValidator`
- Hooks: `useSequenceValidator(options)`
- Types: `SequencedMessage`, `SequenceValidationResult`, `SequenceValidatorOptions`

**Key Features:**
- O(1) validation per message
- Gap detection (missing messages)
- Duplicate detection (same sequence)
- Reorder detection (out of order)
- Auto-resync after gaps
- Callbacks for issues

**Dependencies:**
- React (for hook)

**Consumers:** None found (utility for custom implementations)

**Performance:**
- O(1) per message
- Minimal state (expectedSeq, lastSeq)

**Algorithms:**
- Duplicate: `seq === lastSeq`
- Reorder: `seq < lastSeq`
- Gap: `seq > expected`

---

### 6. streamable-value.ts

| Property | Value |
|----------|-------|
| **Path** | `/packages/react/src/utils/streaming/streamable-value.ts` |
| **Purpose** | Vercel AI SDK-compatible utilities for streaming values and UI |
| **Public/Internal** | **PUBLIC** - Exported via utils/streaming |
| **Performance Sensitivity** | **MEDIUM** - Compatibility layer |

**Exports:**
- Functions: `createStreamableValue`, `readStreamableValue`, `readStreamableUI`, `createStreamableValueTransformer`
- Types: `StreamableValue`

**Key Features:**
- Vercel AI SDK compatibility
- SSE format parsing
- JSON deserialization
- Transform stream passthrough
- Listener cleanup

**Dependencies:**
- React (type import only)

**Consumers:** None found (Vercel AI SDK compatibility)

**Algorithms:**
- Listener pattern (Set of callbacks)
- SSE parsing: data: prefix + JSON
- Transform stream passthrough

---

## SUMMARY TABLES

### Performance Sensitivity Distribution

| Sensitivity | Count | Files |
|-------------|-------|-------|
| **CRITICAL** | 9 | use-streaming-sse, use-streaming-websocket, use-smoothed-text, VirtualizedMessageList, use-performance, use-deferred-search, enhanced.ts, streaming-optimizer, streaming-helpers |
| **HIGH** | 11 | use-streaming, use-stream-status, use-streamable-ui, TanStackMessageList, use-battery-aware, use-smart-throttle, use-auto-scroll, use-throttle, use-debounce, streaming-parser, message-deduplicator |
| **MEDIUM** | 4 | use-streaming-chat, use-intersection-observer, streamable-value, MessageList |
| **LOW** | 2 | VirtualList (dev-tools), sequence-validator |

### Render Frequency Distribution

| Frequency | Count | Hooks/Components |
|-----------|-------|------------------|
| **Very High** (~60fps) | 1 | use-smoothed-text |
| **High** (10-50/sec) | 5 | use-streaming-sse, use-streaming-websocket, use-streamable-ui, use-stream-status, VirtualizedMessageList |
| **Medium** (1-10/sec) | 4 | use-streaming, use-streaming-chat, TanStackMessageList, MessageList |
| **Low** | 6 | All UI hooks, battery-aware, throttle, debounce, intersection-observer, etc. |

### Public API Surface

| Export Location | Count | Files |
|-----------------|-------|-------|
| **Main Package** | 26 | All hooks + components |
| **AI Infrastructure** | 4 | use-streaming, use-streaming-sse, use-streaming-websocket, use-streamable-ui |
| **Analytics** | 1 | use-performance (aliased as usePerformance) |
| **Internal Only** | 1 | VirtualList (dev-tools) |

### Consumer Distribution

| Hook/Component | Consumers | Usage |
|----------------|-----------|-------|
| use-streaming-sse | 31 | Most widely used streaming |
| VirtualizedMessageList | 21 | Most widely used virtualization |
| MessageList | 19 | Standard chat UI |
| use-streaming | 19 | Low-level streaming |
| use-streaming-websocket | 19 | WebSocket streaming |
| enhanced.ts | 105 | Performance utilities |
| use-auto-scroll | 7 | Auto-scroll behavior |
| use-debounce | 8 | Debounced updates |

### Unused but Valuable

| Hook/Utility | Status | Recommendation |
|--------------|--------|----------------|
| use-battery-aware | 0 consumers | Promote with docs/examples |
| use-smart-throttle | 0 consumers | Document or deprecate |
| message-deduplicator | 0 consumers | Document use cases |
| sequence-validator | 0 consumers | Document use cases |
| streamable-value | 0 consumers | Vercel AI SDK compatibility layer |

---

## PHASE 1 STOP CONDITION ✅

All streaming and virtualization code has been indexed with:
- ✅ Path
- ✅ Purpose
- ✅ Public vs Internal
- ✅ Exports
- ✅ Dependencies
- ✅ Consumers
- ✅ Render frequency
- ✅ Performance sensitivity

**Total Files Indexed:** 26
**Total LOC Analyzed:** ~5,000+

**Next Phase:** Phase 2 - Performance & Scalability Audit
