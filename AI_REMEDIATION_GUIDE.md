# AI Components Remediation Guide

**Purpose:** Practical implementation guide for fixing critical issues identified in the AI Components Audit
**Date:** 2026-01-21
**Priority:** Implement these fixes in order for maximum impact

---

## 🔴 CRITICAL FIX #1: Quick Start Guide for Hook Selection

### Problem
Developers face 140+ components/hooks with no clear guidance on which to use.

### Solution: Create Decision Tree Guide

#### File to Create: `docs/guides/choosing-the-right-hook.md`

```markdown
# Choosing the Right Hook - Decision Tree

## I want to... build a chat interface

### Simple chat (basic streaming, no memory)
→ Use `useClarityChat` with minimal config
```tsx
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse', // or 'websocket'
})
```

### Advanced chat (memory, token optimization, tools)
→ Use `useClarityChatWithTools` or `useClarityChat` with full config
```tsx
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse',
  memory: true,              // Enable memory
  tokenOptimization: 'smart', // Enable optimization
  tools: myTools,            // Add tool support
})
```

## I want to... optimize token costs

### Automatic optimization (recommended)
→ Enable smart defaults in `useClarityChat`
```tsx
const chat = useClarityChat({
  tokenOptimization: 'smart', // Enables caching, compression, routing
})
```

### Manual fine-tuned optimization
→ Use individual optimization hooks
```tsx
const cache = useSemanticCache({ similarityThreshold: 0.92 })
const compressor = usePromptCompressor({ targetRatio: 0.7 })
const budget = useTokenBudget({ sessionBudgetTokens: 200000 })
```

## I want to... handle streaming

### Basic streaming (just display text)
→ Use `StreamingMessage` component
```tsx
<StreamingMessage
  content={streamingText}
  isStreaming={true}
  smoothStreaming={true}
/>
```

### Custom streaming logic
→ Use `useStreaming` primitive
```tsx
const { content, isStreaming, startStreaming } = useStreaming({
  onChunk: (chunk) => console.log(chunk),
  onComplete: (full) => console.log('Done!', full)
})
```

## I want to... manage conversation history

### With built-in persistence
→ Use `useChatHistory` hook
```tsx
const history = useChatHistory({
  persist: true,
  maxHistorySize: 100,
})
```

### With advanced memory (episodic/semantic)
→ Use `useMemory` from @clarity-chat/memory
```tsx
const memory = useMemory({
  storageBackend: 'indexeddb',
  enableDecay: true,
})
```

## I want to... display AI responses

### Simple text/markdown
→ Use `Message` component
```tsx
<Message role="assistant" content={content} />
```

### Rich AI responses (citations, tool calls, thinking)
→ Use `StreamingMessage` component
```tsx
<StreamingMessage
  content={content}
  isStreaming={isStreaming}
  citations={citations}
  toolCalls={toolCalls}
  thinkingSteps={thinkingSteps}
  showCitations={true}
  showTools={true}
  showThinking={true}
/>
```

## Deprecated Hooks (Do Not Use)

❌ `useChat` → Use `useClarityChat` instead
❌ `useCompletion` → Use `useClarityChat` with completion mode
❌ Old `useTokenCounter` → Use new version from `@clarity-chat/token-optimization`

## Migration Guide

### From `useChat` to `useClarityChat`

Before:
```tsx
const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/chat',
})
```

After:
```tsx
const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})
// Handle input separately with controlled component
```
```

### Implementation Steps:

1. **Create the file** in `docs/guides/`
2. **Add to sidebar** in documentation nav
3. **Link from README.md** prominently
4. **Add to Storybook** as a "Getting Started" page
5. **Create interactive demo** showing each pattern

**Effort:** 1 day
**Impact:** HIGH - Dramatically improves developer onboarding

---

## 🔴 CRITICAL FIX #2: Smart Token Optimization Defaults

### Problem
Token optimization features exist but require manual enablement. Most developers don't use them, losing 50-70% cost savings.

### Solution: Opt-out Instead of Opt-in

#### File to Modify: `packages/react/src/hooks/chat/use-clarity-chat/index.tsx`

**Add new option:**

```typescript
export interface UseClarityChatOptions {
  // ... existing options ...

  /**
   * Token optimization mode
   *
   * - 'smart' (recommended): Auto-enables caching, compression, model routing
   * - 'aggressive': Maximum cost reduction, may sacrifice some quality
   * - 'balanced': Good cost-quality tradeoff (default)
   * - 'conservative': Minimal optimizations, preserves full quality
   * - 'off': No optimizations
   *
   * @default 'balanced'
   */
  tokenOptimization?: 'smart' | 'aggressive' | 'balanced' | 'conservative' | 'off'

  /**
   * Token optimization config (advanced)
   * Set this to override default behavior
   */
  tokenOptimizationConfig?: {
    enableCaching?: boolean
    enableCompression?: boolean
    enableModelRouting?: boolean
    cacheConfig?: SemanticCacheConfig
    compressionRatio?: number
  }
}
```

**Implementation logic:**

```typescript
function useClarityChat(options: UseClarityChatOptions) {
  const {
    tokenOptimization = 'balanced', // Default to balanced mode
    tokenOptimizationConfig,
    ...otherOptions
  } = options

  // Determine optimization settings based on mode
  const optimizationSettings = React.useMemo(() => {
    if (tokenOptimization === 'off') {
      return {
        enableCaching: false,
        enableCompression: false,
        enableModelRouting: false,
      }
    }

    if (tokenOptimizationConfig) {
      return tokenOptimizationConfig // Manual override
    }

    // Preset modes
    switch (tokenOptimization) {
      case 'aggressive':
        return {
          enableCaching: true,
          enableCompression: true,
          enableModelRouting: true,
          cacheConfig: { similarityThreshold: 0.80 }, // Lower threshold = more hits
          compressionRatio: 0.6, // More aggressive compression
        }

      case 'smart':
      case 'balanced':
        return {
          enableCaching: true,
          enableCompression: true,
          enableModelRouting: true,
          cacheConfig: { similarityThreshold: 0.85 },
          compressionRatio: 0.7,
        }

      case 'conservative':
        return {
          enableCaching: true,
          enableCompression: false,
          enableModelRouting: false,
          cacheConfig: { similarityThreshold: 0.92 }, // Higher threshold = more accurate
        }

      default:
        return {
          enableCaching: true,
          enableCompression: true,
          enableModelRouting: true,
        }
    }
  }, [tokenOptimization, tokenOptimizationConfig])

  // Initialize optimization hooks conditionally
  const cache = useSemanticCache(
    optimizationSettings.enableCaching
      ? optimizationSettings.cacheConfig
      : undefined
  )

  const compressor = usePromptCompressor(
    optimizationSettings.enableCompression
      ? { targetRatio: optimizationSettings.compressionRatio }
      : undefined
  )

  // ... rest of implementation
}
```

### Testing Requirements:

```typescript
// tests/use-clarity-chat-optimization.test.ts
describe('useClarityChat token optimization', () => {
  it('enables caching by default (balanced mode)', () => {
    const { result } = renderHook(() => useClarityChat({ api: '/api/chat' }))
    expect(result.current.optimizationEnabled).toBe(true)
  })

  it('respects opt-out with "off" mode', () => {
    const { result } = renderHook(() =>
      useClarityChat({ api: '/api/chat', tokenOptimization: 'off' })
    )
    expect(result.current.optimizationEnabled).toBe(false)
  })

  it('uses aggressive settings in aggressive mode', () => {
    const { result } = renderHook(() =>
      useClarityChat({ api: '/api/chat', tokenOptimization: 'aggressive' })
    )
    expect(result.current.optimizationSettings.compressionRatio).toBe(0.6)
  })
})
```

**Effort:** 3 days (implementation + testing + docs)
**Impact:** CRITICAL - Enables 50-70% cost savings for all users by default

---

## 🔴 CRITICAL FIX #3: Integration Test Suite

### Problem
Limited integration testing for AI-specific failure scenarios.

### Solution: Comprehensive Integration Test Suite

#### File to Create: `tests/integration/streaming-resilience.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useClarityChat } from '@clarity-chat/react'
import { MockSSEServer } from './test-utils/mock-sse-server'

describe('Streaming Resilience - Integration Tests', () => {
  let server: MockSSEServer

  beforeAll(() => {
    server = new MockSSEServer()
    server.start()
  })

  afterAll(() => {
    server.stop()
  })

  it('reconnects automatically after network interruption', async () => {
    const { result } = renderHook(() => useClarityChat({
      api: server.url,
      transport: 'sse',
    }))

    // Start streaming
    await result.current.append({ role: 'user', content: 'Hello' })

    // Simulate network interruption after 100ms
    setTimeout(() => server.interrupt(), 100)

    // Should reconnect and complete
    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(1)
      expect(result.current.isLoading).toBe(false)
    }, { timeout: 10000 })

    // Verify reconnection happened
    expect(server.reconnectionCount).toBeGreaterThan(0)
  })

  it('handles partial JSON gracefully', async () => {
    server.setStreamMode('partial-json')

    const { result } = renderHook(() => useClarityChat({
      api: server.url,
    }))

    await result.current.append({ role: 'user', content: 'Give me JSON' })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Should parse successfully despite partial chunks
    const lastMessage = result.current.messages[result.current.messages.length - 1]
    expect(lastMessage.content).toBeTruthy()
    expect(() => JSON.parse(lastMessage.content)).not.toThrow()
  })

  it('respects token budget limits', async () => {
    const { result } = renderHook(() => useClarityChat({
      api: server.url,
      tokenBudget: { sessionBudgetTokens: 100 }, // Very low limit
    }))

    // Try to send message that exceeds budget
    await expect(async () => {
      await result.current.append({
        role: 'user',
        content: 'A'.repeat(500) // ~125 tokens
      })
    }).rejects.toThrow('BudgetExceededError')
  })

  it('handles rate limiting gracefully', async () => {
    server.enableRateLimiting({ maxRequests: 2, windowMs: 1000 })

    const { result } = renderHook(() => useClarityChat({
      api: server.url,
    }))

    // Send 3 rapid requests (3rd should be rate limited)
    await result.current.append({ role: 'user', content: '1' })
    await result.current.append({ role: 'user', content: '2' })

    const startTime = Date.now()
    await result.current.append({ role: 'user', content: '3' })
    const elapsed = Date.now() - startTime

    // 3rd request should have been delayed
    expect(elapsed).toBeGreaterThan(900)
  })

  it('recovers from circuit breaker open state', async () => {
    server.setFailureRate(1.0) // Fail all requests

    const { result } = renderHook(() => useClarityChat({
      api: server.url,
      circuitBreaker: {
        failureThreshold: 3,
        resetTimeout: 2000,
      }
    }))

    // Trigger circuit breaker
    for (let i = 0; i < 5; i++) {
      try {
        await result.current.append({ role: 'user', content: `${i}` })
      } catch (e) {
        // Expected to fail
      }
    }

    // Circuit should be open
    expect(result.current.circuitBreakerState).toBe('OPEN')

    // Restore server
    server.setFailureRate(0)

    // Wait for reset timeout
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Should be able to send again
    await result.current.append({ role: 'user', content: 'recovered' })
    expect(result.current.circuitBreakerState).toBe('CLOSED')
  })
})
```

#### Additional Test Files to Create:

1. `tests/integration/token-optimization.test.ts` - Test caching, compression, routing
2. `tests/integration/memory-management.test.ts` - Test memory persistence, recall, decay
3. `tests/integration/error-recovery.test.ts` - Test all error scenarios
4. `tests/integration/accessibility.test.ts` - Test screen reader, keyboard nav
5. `tests/integration/performance.test.ts` - Test load, memory leaks, concurrent streams

**Effort:** 1 week (5 days)
**Impact:** HIGH - Catches critical bugs before production

---

## 🟡 HIGH PRIORITY FIX #4: Code Consolidation

### Problem
3 markdown renderers, 4 caching implementations, multiple token counters.

### Solution: Consolidate to Single Implementation

#### Markdown Renderers - Before:
```
packages/react/src/components/message/markdown-renderer.tsx
packages/react/src/components/ai/markdown-renderer-enhanced.tsx
packages/react/src/components/ai/enhanced-markdown-renderer.tsx
```

#### Markdown Renderers - After:
```
packages/react/src/components/message/markdown-renderer.tsx (unified)
```

**Implementation:**

```typescript
// packages/react/src/components/message/markdown-renderer.tsx
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'

export interface MarkdownRendererProps {
  content: string
  className?: string

  /**
   * Feature set to enable
   * - 'basic': Standard markdown only
   * - 'enhanced': + code highlighting
   * - 'full': + LaTeX, diagrams, custom components (default)
   */
  features?: 'basic' | 'enhanced' | 'full'

  /** Custom components for advanced rendering */
  components?: Record<string, React.ComponentType<any>>
}

export function MarkdownRenderer({
  content,
  className,
  features = 'full',
  components: customComponents,
}: MarkdownRendererProps) {
  // Configure plugins based on feature set
  const remarkPlugins = React.useMemo(() => {
    const plugins = [remarkGfm]
    if (features === 'full') {
      plugins.push(remarkMath)
    }
    return plugins
  }, [features])

  const rehypePlugins = React.useMemo(() => {
    const plugins = []
    if (features === 'full') {
      plugins.push(rehypeKatex)
    }
    return plugins
  }, [features])

  // Default components
  const components = React.useMemo(() => ({
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\\w+)/.exec(className || '')
      return !inline && match && features !== 'basic' ? (
        <SyntaxHighlighter
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    ...customComponents,
  }), [features, customComponents])

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// Export deprecated names for backward compatibility
/** @deprecated Use MarkdownRenderer with features='enhanced' instead */
export const MarkdownRendererEnhanced = (props: any) => (
  <MarkdownRenderer {...props} features="enhanced" />
)

/** @deprecated Use MarkdownRenderer with features='full' instead */
export const EnhancedMarkdownRenderer = (props: any) => (
  <MarkdownRenderer {...props} features="full" />
)
```

**Migration Guide:**

```typescript
// Before (3 different components)
import { MarkdownRenderer } from './markdown-renderer'
import { MarkdownRendererEnhanced } from './markdown-renderer-enhanced'
import { EnhancedMarkdownRenderer } from './enhanced-markdown-renderer'

// After (1 unified component)
import { MarkdownRenderer } from './markdown-renderer'

// Usage:
<MarkdownRenderer content={text} features="basic" />
<MarkdownRenderer content={text} features="enhanced" />
<MarkdownRenderer content={text} features="full" />
```

**Effort:** 3-4 days for all consolidations
**Impact:** HIGH - Reduces maintenance burden and confusion

---

## 🟡 HIGH PRIORITY FIX #5: Accessibility Improvements

### Problem
Limited ARIA support, keyboard navigation gaps, focus management issues.

### Solution: Comprehensive Accessibility Enhancements

#### 1. Add ARIA Live Regions for Streaming

**File to modify:** `packages/react/src/components/message/streaming-message.tsx`

```typescript
export function StreamingMessage({
  content,
  isStreaming,
  ...props
}: StreamingMessageProps) {
  const [announcement, setAnnouncement] = React.useState('')

  // Announce streaming start/stop
  React.useEffect(() => {
    if (isStreaming) {
      setAnnouncement('AI response streaming started')
    } else if (content) {
      setAnnouncement(`AI response complete. ${content.length} characters.`)
    }
  }, [isStreaming, content])

  return (
    <div>
      {/* Screen reader announcement */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Streaming content */}
      <div
        role="article"
        aria-label="AI response"
        aria-busy={isStreaming}
      >
        {content}
        {isStreaming && <StreamingCursor />}
      </div>
    </div>
  )
}
```

#### 2. Complete Keyboard Navigation

**File to modify:** `packages/react/src/components/chat/chat-input.tsx`

```typescript
export function ChatInput({ onSubmit }: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter to submit (Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e.currentTarget.value)
    }

    // Escape to clear
    if (e.key === 'Escape') {
      e.currentTarget.value = ''
    }
  }

  return (
    <textarea
      ref={textareaRef}
      onKeyDown={handleKeyDown}
      aria-label="Chat message input"
      aria-describedby="chat-input-help"
      placeholder="Type your message..."
    />
  )
}
```

#### 3. Focus Management for Modals

**File to create:** `packages/react/src/hooks/accessibility/use-focus-trap.ts`

```typescript
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Get focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus first element on mount
    firstElement?.focus()

    // Trap focus within container
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [containerRef])
}
```

**Effort:** 2-3 days
**Impact:** HIGH - Makes library accessible to all users

---

## 📋 Implementation Checklist

Use this checklist to track progress:

### Week 1: Critical Fixes
- [ ] Create Quick Start Guide
  - [ ] Write decision tree content
  - [ ] Add to documentation
  - [ ] Create interactive examples
  - [ ] Link from README
- [ ] Enable Smart Token Optimization
  - [ ] Add tokenOptimization option
  - [ ] Implement preset modes
  - [ ] Write tests
  - [ ] Update documentation
- [ ] Start Integration Tests
  - [ ] Set up test infrastructure
  - [ ] Write streaming tests
  - [ ] Write token budget tests

### Week 2: High Priority
- [ ] Code Consolidation
  - [ ] Merge markdown renderers
  - [ ] Consolidate caching
  - [ ] Remove deprecated code
  - [ ] Update imports
- [ ] Accessibility
  - [ ] Add ARIA live regions
  - [ ] Complete keyboard nav
  - [ ] Implement focus traps
  - [ ] Test with screen readers

### Week 3-4: Remaining Items
- [ ] Complete integration tests
- [ ] Documentation expansion
- [ ] Security hardening
- [ ] Performance optimization
- [ ] Final review and testing

---

## 🧪 Testing Strategy

After each fix:

1. **Run existing tests:** `pnpm test`
2. **Run type checking:** `pnpm typecheck`
3. **Manual testing:** Test in Storybook
4. **Accessibility testing:** Use axe DevTools
5. **Performance testing:** Check bundle size impact

---

## 📊 Success Metrics

Track these metrics to measure improvement:

1. **Developer Onboarding Time**
   - Before: ~8 hours to understand hooks
   - Target: ~2 hours with quick start guide

2. **Token Optimization Adoption**
   - Before: ~20% enable optimizations
   - Target: ~80% (auto-enabled)

3. **Integration Test Coverage**
   - Before: ~10% of AI flows
   - Target: ~80% of critical AI flows

4. **Accessibility Score**
   - Before: ~65/100 (axe audit)
   - Target: ~95/100 (WCAG 2.1 AA)

5. **Code Duplication**
   - Before: 3 markdown renderers, 4 caching implementations
   - Target: 1 of each

---

## 💬 Questions or Issues?

If you encounter problems implementing these fixes:

1. Check the full audit report: `AI_COMPONENTS_AUDIT_REPORT.md`
2. Review test examples in `tests/integration/`
3. Ask in team Slack #ai-components-audit channel

---

**Guide Maintained By:** Claude (AI Integration Specialist)
**Last Updated:** 2026-01-21
**Version:** 1.0
