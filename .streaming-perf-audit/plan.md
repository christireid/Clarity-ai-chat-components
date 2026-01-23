# STREAMING, VIRTUALIZATION & PERFORMANCE OPTIMIZATION - REMEDIATION PLAN

**Generated:** 2026-01-22
**Scope:** Complete remediation of all identified performance, streaming, virtualization, API, and documentation issues
**Total Issues:** 138 issues across 5 audit areas
**Estimated Total Effort:** 18-24 person-days

---

## EXECUTIVE SUMMARY

### Issues by Audit Area

| Audit Area | Critical | High | Medium | Low | Total |
|------------|----------|------|--------|-----|-------|
| **Performance & Scalability** | 13 | 16 | 12 | 3 | **44** |
| **Streaming Pipeline** | 8 | 7 | 3 | 0 | **18** |
| **Virtualization & Windowing** | 5 | 8 | 24 | 10 | **47** |
| **API & DX** | 5 | 8 | 7 | 2 | **22** |
| **Documentation** | 4 | 4 | 8 | 9 | **25** |
| **TOTAL** | **35** | **43** | **54** | **24** | **138** |

### Priority Distribution (Execution Order)

| Priority | Description | Count | Effort | Impact |
|----------|-------------|-------|--------|--------|
| **P0** | Blocking - Ship stoppers, critical bugs | 35 | 8-10 days | **90% of performance gains** |
| **P1** | High - Major UX/performance issues | 43 | 6-8 days | **9% additional gains** |
| **P2** | Medium - Nice-to-have optimizations | 54 | 4-6 days | **1% additional gains** |
| **P3** | Low - Polish and future-proofing | 24 | 2-3 days | Minimal impact |

**80/20 Rule:** Fixing P0 issues (25% of work) delivers 90% of performance improvements.

---

## PHASE 9 EXECUTION STRATEGY

### Sprint Structure

```
SPRINT 1 (Days 1-5): P0 Critical Fixes + Blocking Docs
├── Implement layout thrashing fixes (90% improvement)
├── Add RAF batching to streaming (80% render reduction)
├── Fix keyboard navigation (WCAG compliance)
├── Add screen reader mode (WCAG compliance)
└── Remove false documentation claims

SPRINT 2 (Days 6-10): P1 High Priority
├── Implement message windowing (79% memory reduction)
├── Add connection ID tracking (prevents corruption)
├── ResizeObserver for height measurement
├── Virtualization migration guide
└── Performance monitoring integration

SPRINT 3 (Days 11-15): P2 Medium Priority + Polish
├── API consistency improvements
├── Complete documentation coverage
├── Storybook story enhancements
├── Edge case handling
└── Performance profiling tools

SPRINT 4 (Days 16-18): P3 Low Priority + Verification
├── Long-term architectural improvements
├── Developer tooling enhancements
├── Final verification and testing
└── Rubric scoring
```

---

## P0: CRITICAL / BLOCKING ISSUES (35 Issues, 8-10 Days)

### 🔴 PERFORMANCE FIXES (13 Issues)

#### PERF-1: Layout Thrashing in Height Measurement
- **Files:** `virtualized-message-list.tsx:125-138`, `tanstack-message-list.tsx:120`
- **Issue:** Forced synchronous layouts on every message render (100+ recalcs)
- **Impact:** 90% reduction in forced layouts
- **Effort:** 3 hours
- **Fix:**
  ```typescript
  // Replace offsetHeight reads with ResizeObserver
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height
        setItemHeight(index, height)
      }
    })
    if (itemRef.current) observer.observe(itemRef.current)
    return () => observer.disconnect()
  }, [index])
  ```
- **Acceptance Criteria:**
  - Zero forced layouts in normal rendering
  - Height updates async via ResizeObserver
  - Chrome DevTools shows <10 layout recalculations/sec

#### PERF-2: Unbatched Style Writes
- **File:** `mobile-chat-optimized.tsx:527-536`
- **Issue:** 3 separate style writes = 3 layout recalculations
- **Impact:** 66% reduction (3 recalcs → 1 recalc)
- **Effort:** 30 minutes
- **Fix:**
  ```typescript
  // Replace individual style writes with CSS class
  .body-scroll-lock {
    overflow: hidden;
    position: fixed;
    width: 100%;
  }

  document.body.classList.add('body-scroll-lock')
  ```
- **Acceptance Criteria:**
  - Single layout recalculation
  - No individual style assignments
  - Works across browsers

#### PERF-3: Unthrottled Scroll Handlers
- **Files:** Multiple scroll handlers (6 files)
- **Issue:** 100+ scroll events/sec with layout reads
- **Impact:** Consistent 60fps scrolling
- **Effort:** 2 hours
- **Fix:**
  ```typescript
  const handleScroll = useThrottle(() => {
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    // ... scroll logic
  }, 16) // 60fps
  ```
- **Acceptance Criteria:**
  - Max 60 scroll events/sec
  - No layout reads in hot path
  - Scroll feels smooth

#### PERF-4: TanStack Virtual Measurement Caching
- **File:** `tanstack-message-list.tsx:120`
- **Issue:** `getBoundingClientRect()` called 10-20 times per scroll
- **Impact:** 70-80% reduction with caching
- **Effort:** 1 hour
- **Fix:**
  ```typescript
  const heightCache = useRef<Map<number, number>>(new Map())

  measureElement: (element) => {
    const cached = heightCache.current.get(index)
    if (cached) return cached

    const height = element.getBoundingClientRect().height + gap
    heightCache.current.set(index, height)
    return height
  }
  ```
- **Acceptance Criteria:**
  - Heights cached per message
  - Cache invalidated on content change
  - <5 getBoundingClientRect calls per scroll

#### PERF-5: useAutoScroll Layout Reads
- **File:** `use-auto-scroll.tsx` - reads 3 layout properties on every scroll
- **Issue:** scrollTop, scrollHeight, clientHeight read on every event
- **Impact:** 83% reduction (3 reads → 0-1 reads)
- **Effort:** 1 hour
- **Fix:**
  ```typescript
  // Cache dimensions outside scroll handler
  const dimensionsRef = useRef({ scrollHeight: 0, clientHeight: 0 })

  useResizeObserver(scrollRef, (entry) => {
    dimensionsRef.current = {
      scrollHeight: entry.target.scrollHeight,
      clientHeight: entry.contentRect.height
    }
  })

  const handleScroll = useThrottle((e) => {
    const scrollTop = e.target.scrollTop
    const { scrollHeight, clientHeight } = dimensionsRef.current
    // ... no forced layout
  }, 16)
  ```
- **Acceptance Criteria:**
  - Layout properties cached
  - Updated via ResizeObserver
  - Zero forced layouts in scroll handler

#### PERF-6-13: Additional Critical Performance Fixes
- **PERF-6:** Batch markdown rendering (message-markdown.tsx)
- **PERF-7:** Remove inline function creation in render (message-list.tsx)
- **PERF-8:** Memoize message transformations (message-utils.ts)
- **PERF-9:** Fix scroll position setTimeout(0) race condition
- **PERF-10:** Optimize Framer Motion animations (reduce layout triggers)
- **PERF-11:** Add will-change hints for animations
- **PERF-12:** Fix O(n) scroll height calculation
- **PERF-13:** Memory leak in event listener cleanup

**Total Performance Fixes Effort:** 12-14 hours

---

### 🔴 STREAMING FIXES (8 Issues)

#### STREAM-1: Integrate RAF Batching into useChat
- **File:** `use-chat-enhanced.ts:468-474`
- **Issue:** Every token triggers full React re-render (10-25 renders/sec)
- **Impact:** 80% render reduction (10-25 FPS → 60 FPS cap)
- **Effort:** 8 hours
- **Dependencies:** None
- **Fix:**
  ```typescript
  // Add RAF batching to streaming loop
  const updateQueue = useRef<string[]>([])
  const rafIdRef = useRef<number | null>(null)

  const flushUpdates = useCallback(() => {
    const batchedContent = updateQueue.current.join('')
    updateQueue.current = []
    rafIdRef.current = null

    setMessages(prev => {
      const updated = [...prev]
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        content: accumulatedContent + batchedContent
      }
      return updated
    })
  }, [])

  // In streaming loop:
  if (contentDelta) {
    accumulatedContent += contentDelta
    updateQueue.current.push(contentDelta)

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(flushUpdates)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        flushUpdates()
      }
    }
  }, [flushUpdates])
  ```
- **Acceptance Criteria:**
  - Max 60 renders/sec during streaming
  - No dropped tokens
  - Smooth visual updates
  - Proper cleanup on abort

#### STREAM-2: Add Connection ID Tracking
- **File:** `use-chat-enhanced.ts`
- **Issue:** No tracking of concurrent streams = state corruption
- **Impact:** Prevents message corruption from rapid requests
- **Effort:** 4 hours
- **Dependencies:** STREAM-1
- **Fix:**
  ```typescript
  const connectionIdRef = useRef(0)

  const append = async (message: Message) => {
    const currentConnectionId = ++connectionIdRef.current

    try {
      while (true) {
        // Check if this connection is stale
        if (connectionIdRef.current !== currentConnectionId) {
          console.log('Stream cancelled - newer request started')
          break
        }

        const { done, value } = await reader.read()
        if (done) break

        // Process token...
      }
    } catch (error) {
      // Only handle error if this is still the active connection
      if (connectionIdRef.current === currentConnectionId) {
        handleError(error)
      }
    }
  }

  const abort = () => {
    connectionIdRef.current++ // Invalidate current connection
    abortControllerRef.current?.abort()
  }
  ```
- **Acceptance Criteria:**
  - Concurrent streams don't corrupt state
  - Old streams auto-cancel when new starts
  - Connection ID logged for debugging

#### STREAM-3: Fix Reader Cancellation
- **File:** `use-chat-enhanced.ts`
- **Issue:** Reader not cancelled on abort = dangling promises
- **Impact:** No orphaned promises
- **Effort:** 2 hours
- **Fix:**
  ```typescript
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null)

  const abort = () => {
    connectionIdRef.current++

    if (readerRef.current) {
      readerRef.current.cancel('User aborted stream')
        .catch(() => {}) // Ignore cancel errors
      readerRef.current = null
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }

  // Store reader reference
  readerRef.current = response.body.getReader()
  ```
- **Acceptance Criteria:**
  - Reader cancelled on abort
  - No dangling promises
  - Cleanup verified in dev tools

#### STREAM-4-8: Additional Streaming Fixes
- **STREAM-4:** Add model switching detection (2h)
- **STREAM-5:** Implement backpressure mechanism (16h) - or remove claims
- **STREAM-6:** Fix race condition in SSE reconnection (3h)
- **STREAM-7:** Add streaming state machine (4h)
- **STREAM-8:** Memory bounds on streaming buffers (3h)

**Total Streaming Fixes Effort:** 42 hours

---

### 🔴 VIRTUALIZATION FIXES (5 Issues)

#### VIRT-1: Add Keyboard Navigation (WCAG Level A Requirement)
- **Files:** `virtualized-message-list.tsx`, `tanstack-message-list.tsx`
- **Issue:** No keyboard navigation = WCAG 2.1.1 violation
- **Impact:** Accessibility compliance
- **Effort:** 6 hours
- **Fix:**
  ```typescript
  const [focusedIndex, setFocusedIndex] = useState(0)

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, messages.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusedIndex(messages.length - 1)
        break
    }
  }

  // Sync focus with DOM
  useEffect(() => {
    const item = itemRefs.current[focusedIndex]
    item?.focus()
  }, [focusedIndex])

  // Make items focusable
  <div
    role="article"
    tabIndex={0}
    ref={el => itemRefs.current[index] = el}
    onKeyDown={handleKeyDown}
  >
    {renderMessage(message)}
  </div>
  ```
- **Acceptance Criteria:**
  - Arrow keys navigate messages
  - Home/End keys work
  - Focus visible indicator
  - Scrolls to focused item
  - Tab key moves to next focusable
  - Passes axe-core tests

#### VIRT-2: Add Screen Reader Mode
- **Files:** `virtualized-message-list.tsx`, `tanstack-message-list.tsx`
- **Issue:** Virtualized content not accessible to screen readers
- **Impact:** WCAG 4.1.3 compliance
- **Effort:** 8 hours
- **Fix:**
  ```typescript
  const [screenReaderMode, setScreenReaderMode] = useState(false)

  useEffect(() => {
    // Detect screen reader
    const detectScreenReader = () => {
      const ariaLive = document.createElement('div')
      ariaLive.setAttribute('aria-live', 'polite')
      ariaLive.style.position = 'absolute'
      ariaLive.style.left = '-9999px'
      document.body.appendChild(ariaLive)

      setTimeout(() => {
        if (ariaLive.offsetHeight > 0) {
          setScreenReaderMode(true)
        }
        document.body.removeChild(ariaLive)
      }, 100)
    }

    detectScreenReader()
  }, [])

  // Render all messages for screen readers
  if (screenReaderMode) {
    return (
      <div role="log" aria-live="polite" aria-atomic="false">
        {messages.map((msg, index) => (
          <div key={msg.id} role="article">
            {renderMessage(msg, index)}
          </div>
        ))}
      </div>
    )
  }

  // Virtualized for sighted users
  return <TanStackVirtualizer ... />
  ```
- **Acceptance Criteria:**
  - Screen reader detection works
  - All messages rendered in SR mode
  - Aria attributes correct
  - NVDA/JAWS can navigate
  - Performance acceptable (<1000 msgs)

#### VIRT-3: Implement Message Windowing
- **Files:** `use-messages.tsx`, `message-list.tsx`
- **Issue:** No max message limit = memory leak with 3000+ messages
- **Impact:** 79% memory reduction (380MB → 80MB at 5000 messages)
- **Effort:** 6 hours
- **Fix:**
  ```typescript
  const MAX_RENDERED_MESSAGES = 1000
  const WINDOW_SLIDE_SIZE = 200

  const useMessageWindow = (messages: Message[]) => {
    const [windowEnd, setWindowEnd] = useState(MAX_RENDERED_MESSAGES)

    const windowedMessages = useMemo(() => {
      if (messages.length <= MAX_RENDERED_MESSAGES) {
        return messages
      }

      const start = Math.max(0, messages.length - windowEnd)
      return messages.slice(start)
    }, [messages, windowEnd])

    const loadOlder = useCallback(() => {
      setWindowEnd(prev => prev + WINDOW_SLIDE_SIZE)
    }, [])

    return { windowedMessages, hasOlder: windowedMessages.length < messages.length, loadOlder }
  }

  // In component:
  const { windowedMessages, hasOlder, loadOlder } = useMessageWindow(messages)

  return (
    <>
      {hasOlder && (
        <button onClick={loadOlder}>
          Load older messages
        </button>
      )}
      <TanStackMessageList messages={windowedMessages} />
    </>
  )
  ```
- **Acceptance Criteria:**
  - Max 1000 messages rendered
  - "Load older" button works
  - Memory usage capped
  - Scroll position preserved
  - Original messages kept in state

#### VIRT-4-5: Additional Virtualization Fixes
- **VIRT-4:** Fix scroll jump on iOS keyboard (4h)
- **VIRT-5:** Add browser zoom support (50%, 200%) (3h)

**Total Virtualization Fixes Effort:** 27 hours

---

### 🔴 API & DX FIXES (5 Issues)

#### API-1: Add Runtime Validation
- **Files:** All component prop interfaces
- **Issue:** No validation = crashes with invalid props
- **Impact:** Better error messages, prevents crashes
- **Effort:** 4 hours
- **Fix:**
  ```typescript
  const VirtualizedMessageList = ({ messages, threshold = 100, ... }: Props) => {
    // Validate in development
    if (process.env.NODE_ENV === 'development') {
      if (threshold < 0) {
        console.error('[VirtualizedMessageList] threshold must be >= 0, got:', threshold)
      }
      if (!Array.isArray(messages)) {
        throw new Error('[VirtualizedMessageList] messages must be an array')
      }
      if (messages.some(m => !m.id)) {
        console.warn('[VirtualizedMessageList] All messages should have an id')
      }
    }

    // ... component
  }
  ```
- **Acceptance Criteria:**
  - Helpful errors in development
  - No runtime overhead in production
  - Validates all critical props
  - Errors are actionable

#### API-2: Fix Unsafe Defaults
- **Files:** `SmartCache.ts` (defaultTTL=0), `useBatchedState.ts`
- **Issue:** Unsafe defaults cause bugs
- **Impact:** Prevents stale data, memory leaks
- **Effort:** 2 hours
- **Fix:**
  ```typescript
  // SmartCache.ts
  export class SmartCache<T> {
    constructor(options: CacheOptions = {}) {
      this.defaultTTL = options.defaultTTL ?? 3600000 // 1 hour, not 0
      this.maxSize = options.maxSize ?? 1000
    }
  }

  // useBatchedState.ts
  export const useBatchedState = <T>(initialValue: T, options?: Options) => {
    const autoFlushMs = options?.autoFlushMs ?? 100 // Auto-flush after 100ms

    useEffect(() => {
      if (autoFlushMs > 0) {
        const timer = setTimeout(flushBatch, autoFlushMs)
        return () => clearTimeout(timer)
      }
    }, [autoFlushMs, flushBatch])
  }
  ```
- **Acceptance Criteria:**
  - TTL defaults to 1 hour
  - Batched state auto-flushes
  - Tests verify safe defaults

#### API-3-5: Additional API Fixes
- **API-3:** Standardize prop names with aliases (4h)
- **API-4:** Export useVirtualList hook (5 min)
- **API-5:** Add dev-time warnings for common mistakes (3h)

**Total API Fixes Effort:** 13 hours

---

### 🔴 DOCUMENTATION FIXES (4 Issues)

#### DOC-1: Remove False Backpressure Claims
- **Files:** `Overview.mdx`, `STREAMING_TOOLS.md`
- **Issue:** Claims backpressure is implemented (it's not)
- **Impact:** Accurate documentation
- **Effort:** 30 minutes
- **Fix:** Remove "Backpressure Handling" from feature lists, add to "Planned Features"
- **Acceptance Criteria:**
  - No false claims
  - Marked as planned feature
  - Issue linked

#### DOC-2: Move Audit Reports to /docs/
- **Files:** `VIRTUALIZATION_COMPONENTS_INDEX.md`, etc.
- **Issue:** Excellent docs hidden in root directory
- **Impact:** Users can find documentation
- **Effort:** 2 hours
- **Fix:**
  ```bash
  mkdir -p docs/guides
  mv VIRTUALIZATION_COMPONENTS_INDEX.md docs/guides/virtualization-guide.md
  mv STREAMING_PIPELINE_AUDIT.md docs/guides/streaming-architecture.md
  mv VIRTUALIZATION_WINDOWING_AUDIT.md docs/guides/virtualization-deep-dive.md

  # Update internal links
  # Add to main README
  ```
- **Acceptance Criteria:**
  - Files in docs/guides/
  - Linked from main README
  - Internal links updated
  - Navigation working

#### DOC-3: Add TanStack to Performance Guide
- **File:** `PERFORMANCE_GUIDE.md`
- **Issue:** Only mentions VirtualizedMessageList
- **Impact:** Users use recommended component
- **Effort:** 1 hour
- **Fix:** Add section comparing both with clear recommendation
- **Acceptance Criteria:**
  - TanStack mentioned first
  - Comparison table included
  - Migration guide linked

#### DOC-4: Verify Streaming Examples Exist
- **File:** `StreamingExamples.stories.tsx`
- **Issue:** Imports may not exist
- **Impact:** Story renders without errors
- **Effort:** 1 hour
- **Fix:** Verify exports exist, create if missing, or remove broken story
- **Acceptance Criteria:**
  - All imports resolve
  - Story renders
  - No console errors

**Total Documentation Fixes Effort:** 4.5 hours

---

## P0 SUMMARY

**Total P0 Issues:** 35
**Total Estimated Effort:** 103 hours (12-13 days for one developer)
**Impact:** 90% of total performance improvements
**Dependencies:** Clear execution order defined

**Sprint 1 Focus:** PERF-1 through PERF-5, STREAM-1 through STREAM-3, DOC-1 through DOC-4
**Expected Results:**
- 90% reduction in forced layouts
- 80% reduction in renders during streaming
- 60fps consistent scrolling
- WCAG Level A compliance
- Accurate documentation

---

## P1: HIGH PRIORITY (43 Issues, 6-8 Days)

### Performance (16 Issues)
- Additional layout optimization
- Render batching improvements
- Memory leak fixes
- Animation optimization

### Streaming (7 Issues)
- Model switching detection
- Enhanced error handling
- Reconnection improvements
- State machine refactoring

### Virtualization (8 Issues)
- Edge case handling
- Mobile optimization
- RTL support improvements
- Height calculation optimization

### API (8 Issues)
- Consistent naming conventions
- Better TypeScript types
- Enhanced error messages
- Documentation improvements

### Documentation (4 Issues)
- Migration guides
- Troubleshooting guide
- Performance metrics in stories
- Accessibility guide

**Effort:** 48 hours (6 days)
**Impact:** 9% additional performance improvements

---

## P2: MEDIUM PRIORITY (54 Issues, 4-6 Days)

### Performance (12 Issues)
- Further optimizations
- Profiling improvements
- Cache tuning
- Bundle size reduction

### Streaming (3 Issues)
- Advanced features
- Edge case handling
- Monitoring improvements

### Virtualization (24 Issues)
- Polish and refinements
- Additional edge cases
- Enhanced customization
- Performance tuning

### API (7 Issues)
- DX improvements
- Type refinements
- Documentation polish
- Example improvements

### Documentation (8 Issues)
- Complete coverage
- Additional examples
- Advanced guides
- Video tutorials

**Effort:** 38 hours (4-5 days)
**Impact:** 1% additional improvements, significantly better DX

---

## P3: LOW PRIORITY (24 Issues, 2-3 Days)

- Long-term architectural improvements
- Future-proofing
- Advanced customization
- Developer tooling
- Nice-to-have features

**Effort:** 20 hours (2-3 days)
**Impact:** Minimal performance impact, improved maintainability

---

## DEPENDENCY GRAPH

```
P0 CRITICAL PATH:
├── PERF-1 (Layout Thrashing) ──→ PERF-3 (Throttling) ──→ PERF-5 (useAutoScroll)
├── STREAM-1 (RAF Batching) ──→ STREAM-2 (Connection ID) ──→ STREAM-3 (Cancellation)
├── VIRT-1 (Keyboard Nav) ──→ VIRT-2 (Screen Reader)
├── API-1 (Validation) ──→ API-2 (Safe Defaults)
└── DOC-2 (Move Docs) ──→ DOC-3 (Update Links)

P1 BUILD ON P0:
├── Message Windowing (depends on: Virtualization fixes)
├── Backpressure (depends on: RAF batching)
├── Migration Guide (depends on: All fixes)
└── Performance Monitoring (depends on: Baseline established)
```

---

## ACCEPTANCE CRITERIA (Phase 9 Complete)

### Code Quality
- ✅ All P0 issues resolved
- ✅ All P1 issues resolved
- ✅ All tests passing
- ✅ No new console errors
- ✅ TypeScript strict mode passes
- ✅ ESLint clean

### Performance Targets
- ✅ Forced layouts < 10/sec (from 100+)
- ✅ Streaming renders ≤ 60/sec (from 10-25)
- ✅ Scroll FPS = 60 (from 45-55)
- ✅ Memory usage < 100MB for 1000 messages
- ✅ No memory leaks detected

### Accessibility
- ✅ WCAG Level AA compliance
- ✅ Keyboard navigation working
- ✅ Screen reader compatible
- ✅ axe-core tests passing
- ✅ Focus management correct

### Documentation
- ✅ All false claims removed
- ✅ All features documented
- ✅ Migration guides complete
- ✅ Examples working
- ✅ Storybook stories passing

### Testing
- ✅ Performance benchmarks baseline established
- ✅ Regression tests in place
- ✅ Accessibility tests automated
- ✅ Visual regression tests passing

---

## TESTING STRATEGY

### Performance Testing
```bash
# Before fixes (baseline)
pnpm bench --reporter=json > baseline.json

# After each sprint
pnpm bench --reporter=json > sprint-1.json
node scripts/compare-benchmarks.mjs baseline.json sprint-1.json

# Acceptance: No regressions > 10%
```

### Manual Testing
- [ ] Test with 1000+ message conversation
- [ ] Test rapid streaming (100 tokens/sec)
- [ ] Test on low-end device (CPU throttle 4x)
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Test keyboard-only navigation
- [ ] Test browser zoom (50%, 200%)
- [ ] Test on mobile (iOS keyboard)
- [ ] Test RTL languages

### Automated Testing
```bash
# Run all tests
pnpm test

# Performance tests
pnpm test:perf

# Accessibility tests
pnpm test:a11y

# Visual regression
pnpm test:visual
```

---

## RISK MITIGATION

### High Risk Areas
1. **RAF Batching** - Could introduce subtle timing bugs
   - Mitigation: Extensive testing, feature flag
2. **Screen Reader Detection** - May not work on all platforms
   - Mitigation: Manual override option
3. **Message Windowing** - Could break existing integrations
   - Mitigation: Opt-in initially, deprecation period

### Rollback Plan
- Feature flags for major changes
- Incremental rollout strategy
- Revert capability for each change
- Comprehensive test coverage

---

## COMMUNICATION PLAN

### Stakeholder Updates
- **Daily:** Progress updates in standup
- **Weekly:** Sprint review with demos
- **End of Phase 9:** Complete performance report

### Documentation Updates
- Update CHANGELOG.md for each fix
- Migration guides for breaking changes
- Release notes with before/after metrics
- Blog post highlighting improvements

---

## SUCCESS METRICS

### Performance
- 90% reduction in layout thrashing ✓ Target
- 80% reduction in streaming renders ✓ Target
- 79% reduction in memory usage ✓ Target
- 60fps consistent scrolling ✓ Target

### Quality
- Zero WCAG violations ✓ Target
- 100% test coverage on fixes ✓ Target
- Zero new console errors ✓ Target

### User Experience
- Smooth streaming on low-end devices ✓ Target
- Keyboard navigation works ✓ Target
- Screen readers can navigate ✓ Target
- No visual jank ✓ Target

---

## NEXT STEPS

1. **Validate Plan** - Review with team (if applicable)
2. **Set Up Baseline** - Run benchmarks before changes
3. **Begin Sprint 1** - Start with P0 critical fixes
4. **Track Progress** - Update progress.json after each task
5. **Continuous Testing** - Run tests after each fix
6. **Document Changes** - Update docs as you go
7. **Phase 10 Verification** - Final rubric scoring

---

**Plan Status:** ✅ READY FOR EXECUTION
**Next Phase:** Phase 9 - Implementation
**Estimated Completion:** 18-24 days for all priorities
