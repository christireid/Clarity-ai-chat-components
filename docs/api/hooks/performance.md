# Performance Monitoring Hooks

Hooks for monitoring, optimizing, and managing component performance in production applications.

## Overview

| Hook | Purpose | Key Features |
|------|---------|--------------|
| `useRenderPerformance` | Monitor component render performance | Circular buffer (O(1)), automatic slow render warnings, average/last metrics |
| `useWhyDidYouUpdate` | Debug component re-renders | Props change tracking, development warnings, shallow comparison |
| `useBatteryAware` | Battery-aware optimizations | Battery API, adaptive throttling, 4-tier optimization levels |
| `useSmartCache` | Intelligent caching with metrics | Semantic matching, TTL, tag-based invalidation, savings tracking |
| `useSmartThrottle` | Adaptive throttling with savings tracking | Length-based delay, cancel-on-new, API call savings metrics |
| `useMountTime` | Track component lifetime | Mount/unmount time, development logging |
| `useSlowRenderDetection` | Detect slow renders | Configurable threshold, custom callbacks |
| `useMemoryLeakDetector` | Detect memory leaks | Event listener tracking, development-only |
| `useLazyLoad` | Lazy load resources | Async loading, error handling, cancellation |

---

## useRenderPerformance

Monitor component render performance with circular buffer for O(1) time tracking.

### Signature

```typescript
function useRenderPerformance(componentName: string): PerformanceMetrics

interface PerformanceMetrics {
  renderCount: number
  renderTime: number
  lastRenderTime: number
  averageRenderTime: number
}
```

### Examples

#### Basic Performance Monitoring

```tsx
function ChatMessage({ message }: { message: Message }) {
  const metrics = useRenderPerformance('ChatMessage')

  // Automatic warnings in dev when render > 16ms
  // Example: "[Performance] ChatMessage took 23.45ms to render (12 renders)"

  return (
    <div>
      <p>{message.content}</p>
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground">
          Renders: {metrics.renderCount} |
          Avg: {metrics.averageRenderTime.toFixed(2)}ms
        </div>
      )}
    </div>
  )
}
```

#### Production Performance Dashboard

```tsx
function PerformanceDashboard() {
  const chatMetrics = useRenderPerformance('ChatWindow')
  const inputMetrics = useRenderPerformance('MessageInput')
  const listMetrics = useRenderPerformance('MessageList')

  const components = [
    { name: 'ChatWindow', metrics: chatMetrics },
    { name: 'MessageInput', metrics: inputMetrics },
    { name: 'MessageList', metrics: listMetrics },
  ]

  return (
    <div className="performance-dashboard">
      {components.map(({ name, metrics }) => (
        <div key={name} className="metric-row">
          <span>{name}</span>
          <span>{metrics.renderCount} renders</span>
          <span className={metrics.averageRenderTime > 16 ? 'text-red-500' : ''}>
            {metrics.averageRenderTime.toFixed(2)}ms avg
          </span>
          <span>{metrics.lastRenderTime.toFixed(2)}ms last</span>
        </div>
      ))}
    </div>
  )
}
```

#### Performance Report Component

```tsx
import { PerformanceReport } from '@clarity/react/hooks/performance'

function App() {
  const metrics = useRenderPerformance('App')

  return (
    <>
      <YourAppContent />
      {/* Development-only performance overlay */}
      <PerformanceReport metrics={metrics} threshold={16} />
    </>
  )
}
```

### Implementation Details

**Circular Buffer for O(1) Performance:**
- Stores last 100 render times without O(n) shift operations
- Fixed memory footprint regardless of render count
- Automatic overflow handling via modulo arithmetic

**Performance.now() vs Date.now():**
- Uses `performance.now()` when available (sub-millisecond precision)
- Falls back to `Date.now()` for SSR compatibility
- Measures from render start to useEffect execution

**Automatic Warnings:**
- Logs when render time > 16ms (60fps threshold) in development
- Shows render count to identify excessive re-renders
- Disabled in production to avoid console spam

### When to Use

✅ **Use when:**
- Debugging slow components in development
- Monitoring production performance metrics
- Identifying optimization opportunities
- Building performance dashboards
- Tracking render count increases

❌ **Avoid when:**
- Component renders < 5ms (overhead not worth it)
- Production builds where monitoring isn't needed
- Using React DevTools Profiler instead (better tooling)

### Related Hooks
- `useWhyDidYouUpdate` - Debug why component re-rendered
- `useSlowRenderDetection` - Detect and respond to slow renders
- `useMountTime` - Track component lifetime

---

## useWhyDidYouUpdate

Debug component re-renders by tracking prop changes.

### Signature

```typescript
function useWhyDidYouUpdate(
  name: string,
  props: Record<string, any>
): void
```

### Examples

#### Debug Unnecessary Re-renders

```tsx
function ChatMessage({ message, user, onEdit, theme }: ChatMessageProps) {
  // Development-only debugging
  if (process.env.NODE_ENV === 'development') {
    useWhyDidYouUpdate('ChatMessage', { message, user, onEdit, theme })
  }

  // Console output when props change:
  // [WhyDidYouUpdate] ChatMessage {
  //   onEdit: { from: [Function], to: [Function] }  ← Anonymous function recreated!
  // }

  return <div>{message.content}</div>
}
```

#### Find Memo Optimization Opportunities

```tsx
function ExpensiveList({ items, filters, onItemClick }: Props) {
  useWhyDidYouUpdate('ExpensiveList', { items, filters, onItemClick })

  // Example console output revealing optimization opportunity:
  // [WhyDidYouUpdate] ExpensiveList {
  //   onItemClick: { from: [Function], to: [Function] }
  // }
  // → Wrap onItemClick in useCallback!

  const memoizedCallback = React.useCallback(
    (id: string) => onItemClick(id),
    [onItemClick]  // Still shows changes if parent recreates it
  )

  return items.map(item => (
    <Item key={item.id} onClick={memoizedCallback} />
  ))
}
```

#### Debug Complex Component

```tsx
function ChatWindow(props: ChatWindowProps) {
  const {
    messages,
    user,
    config,
    onSend,
    onEdit,
    onDelete,
    theme,
    settings,
  } = props

  useWhyDidYouUpdate('ChatWindow', props)

  // Typical output showing multiple sources of re-renders:
  // [WhyDidYouUpdate] ChatWindow {
  //   messages: { from: [...], to: [...] },      ← New message arrived
  //   config: { from: {...}, to: {...} },        ← Config object recreated
  //   onEdit: { from: [Function], to: [Function] }  ← Callback not memoized
  // }

  return (
    <div>
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} />
    </div>
  )
}
```

#### Conditional Debugging

```tsx
function DebugWrapper<P extends object>(
  Component: React.ComponentType<P>,
  name: string
) {
  return function WithDebug(props: P) {
    useWhyDidYouUpdate(name, props)
    return <Component {...props} />
  }
}

// Enable debugging only for specific components
const DebugChatMessage = process.env.DEBUG_RENDERS
  ? DebugWrapper(ChatMessage, 'ChatMessage')
  : ChatMessage
```

### When to Use

✅ **Use when:**
- Component re-renders unexpectedly
- Optimizing with React.memo() but still seeing re-renders
- Parent recreates callbacks/objects on every render
- Debugging performance issues in development

❌ **Avoid when:**
- In production builds (use conditional wrapping)
- Props are primitive values that change frequently
- Re-renders are expected and acceptable
- Using React DevTools Profiler's "Why did this render?" feature

### Common Patterns

**Pattern 1: Identify Unstable Callbacks**

```tsx
// Before (causes re-render)
<ChatMessage onEdit={(id) => handleEdit(id)} />

// After (stable reference)
const handleEditCallback = React.useCallback(
  (id: string) => handleEdit(id),
  [handleEdit]
)
<ChatMessage onEdit={handleEditCallback} />
```

**Pattern 2: Find Object Recreation**

```tsx
// Before (new object every render)
<ChatWindow config={{ theme: 'dark', fontSize: 14 }} />

// After (stable reference)
const config = React.useMemo(
  () => ({ theme: 'dark', fontSize: 14 }),
  []
)
<ChatWindow config={config} />
```

### Related Hooks
- `useRenderPerformance` - Measure render time impact
- `React.memo()` - Prevent re-renders when props haven't changed
- `React.useCallback()` - Memoize callbacks
- `React.useMemo()` - Memoize objects/arrays

---

## useBatteryAware

Optimize performance based on device battery level using the Battery API.

### Signature

```typescript
function useBatteryAware(
  config?: Partial<BatteryAwareConfig>
): {
  batteryStatus: BatteryStatus | null
  isSupported: boolean
  recommendations: OptimizationRecommendations
  batteryDescription: string
  batteryIcon: string
  shouldEnableBatterySaver: boolean
  error: Error | null
}

interface BatteryStatus {
  level: number                    // 0-1
  charging: boolean
  dischargingTime: number | null   // seconds
  chargingTime: number | null      // seconds
  batterySaverRecommended: boolean
}

interface OptimizationRecommendations {
  disableAnimations: boolean
  throttleUpdates: boolean
  deferNonCritical: boolean
  reduceStreaming: boolean
  updateInterval: number           // ms
  level: 'none' | 'minimal' | 'moderate' | 'aggressive'
}

interface BatteryAwareConfig {
  batterySaverThreshold: number    // Default: 0.2 (20%)
  optimizations: {
    reduceAnimations: boolean
    throttleUpdates: boolean
    deferNonCritical: boolean
    reduceStreamingQuality: boolean
  }
  autoOptimize: boolean            // Default: true
  thresholds?: {
    critical: number               // Default: 0.05 (5%)
    low: number                    // Default: 0.20 (20%)
    medium: number                 // Default: 0.50 (50%)
  }
}
```

### Examples

#### Adaptive Chat Performance

```tsx
function ChatWindow() {
  const { recommendations, batteryStatus, isSupported } = useBatteryAware({
    batterySaverThreshold: 0.2,
    autoOptimize: true,
  })

  const chat = useClarityChat({
    api: '/api/chat',
    streaming: !recommendations.reduceStreaming,
    streamingUpdateInterval: recommendations.updateInterval,
  })

  return (
    <div>
      {isSupported && batteryStatus && batteryStatus.level < 0.2 && (
        <div className="bg-yellow-100 p-2 text-sm">
          Battery low ({Math.round(batteryStatus.level * 100)}%).
          Performance optimizations enabled.
        </div>
      )}
      <MessageList
        messages={chat.messages}
        enableAnimations={!recommendations.disableAnimations}
      />
      <MessageInput onSend={chat.sendMessage} />
    </div>
  )
}
```

#### Battery-Aware Streaming

```tsx
function StreamingResponse() {
  const { recommendations, batteryStatus } = useBatteryAware()

  const chat = useClarityChat({
    api: '/api/chat',
    onChunk: (chunk) => {
      // Optimization level affects update frequency
      // none: 100ms, minimal: 250ms, moderate: 500ms, aggressive: 1000ms
      if (recommendations.throttleUpdates) {
        throttledUpdate(chunk, recommendations.updateInterval)
      } else {
        immediateUpdate(chunk)
      }
    },
  })

  return (
    <div>
      {recommendations.level !== 'none' && (
        <div className="text-xs text-muted-foreground">
          Battery Saver: {recommendations.level} mode
          ({batteryStatus ? Math.round(batteryStatus.level * 100) : 0}%)
        </div>
      )}
      <StreamingMessage content={chat.currentMessage} />
    </div>
  )
}
```

#### Battery Indicator UI

```tsx
function BatteryIndicator() {
  const {
    batteryStatus,
    batteryDescription,
    batteryIcon,
    shouldEnableBatterySaver,
    isSupported,
  } = useBatteryAware()

  if (!isSupported || !batteryStatus) {
    return null // Battery API not supported
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon name={batteryIcon} />
      <span>{batteryDescription}</span>
      {shouldEnableBatterySaver && (
        <span className="text-yellow-600">Low Battery</span>
      )}
    </div>
  )
}
```

#### HOC Pattern

```tsx
import { withBatteryOptimizations } from '@clarity/react/hooks/performance'

const BatteryAwareChatWindow = withBatteryOptimizations(ChatWindow, {
  batterySaverThreshold: 0.2,
  autoOptimize: true,
})

// ChatWindow receives batteryOptimizations prop
function ChatWindow({
  batteryOptimizations
}: {
  batteryOptimizations?: OptimizationRecommendations
}) {
  const animationsEnabled = !batteryOptimizations?.disableAnimations
  const updateInterval = batteryOptimizations?.updateInterval || 100

  return <MessageList enableAnimations={animationsEnabled} />
}
```

#### Four-Tier Optimization Levels

```tsx
function AdaptiveChat() {
  const { recommendations, batteryStatus } = useBatteryAware({
    thresholds: {
      critical: 0.05,   // 5%  - aggressive
      low: 0.20,        // 20% - moderate
      medium: 0.50,     // 50% - minimal
    },
  })

  // Optimization levels:
  // - none:       > 50% battery, 100ms updates
  // - minimal:    20-50% battery, 250ms updates, throttle only
  // - moderate:   5-20% battery, 500ms updates, disable animations + streaming
  // - aggressive: < 5% battery, 1000ms updates, all optimizations

  const getConfig = () => {
    switch (recommendations.level) {
      case 'aggressive':
        return {
          streaming: false,
          animations: false,
          updateInterval: 1000,
          deferSearch: true,
        }
      case 'moderate':
        return {
          streaming: false,
          animations: false,
          updateInterval: 500,
          deferSearch: false,
        }
      case 'minimal':
        return {
          streaming: true,
          animations: true,
          updateInterval: 250,
          deferSearch: false,
        }
      default:
        return {
          streaming: true,
          animations: true,
          updateInterval: 100,
          deferSearch: false,
        }
    }
  }

  const config = getConfig()

  return (
    <ChatWindow
      streaming={config.streaming}
      enableAnimations={config.animations}
      updateInterval={config.updateInterval}
    />
  )
}
```

### Browser Support

**Battery API Status:**
- ❌ Safari: Not supported
- ✅ Chrome/Edge: Supported
- ⚠️ Firefox: Deprecated but still works
- 🔒 Requires HTTPS in production

**Graceful Fallback:**
```tsx
const { isSupported, batteryStatus } = useBatteryAware()

if (!isSupported) {
  // Battery API not available, use defaults
  return <ChatWindow streaming={true} />
}

// Use battery-aware optimizations
```

### When to Use

✅ **Use when:**
- Building mobile-first chat applications
- Streaming responses consume battery
- Users may have low battery during long sessions
- Providing accessibility to battery-constrained users

❌ **Avoid when:**
- Desktop-only applications
- Battery API not widely supported in target browsers
- Safari is primary browser (not supported)
- Optimizations aren't meaningful (static content)

### Related Hooks
- `useSmartThrottle` - Adaptive throttling based on input
- `useThrottle` - General-purpose throttling
- `useReducedMotion` - Respect prefers-reduced-motion

---

## useSmartCache

Intelligent caching with semantic similarity matching and performance tracking.

### Signature

```typescript
function useSmartCache<T = any>(
  options?: UseSmartCacheOptions<T>
): UseSmartCacheReturn<T>

interface UseSmartCacheOptions<T> extends CacheOptions {
  enabled?: boolean                                    // Default: true
  costPerToken?: number                                // For savings calculation
  onCacheHit?: (query: string, response: T) => void
  onCacheMiss?: (query: string) => void
  // From CacheOptions:
  enableSemanticMatching?: boolean
  embedFunction?: (text: string) => Promise<number[]>
  similarityThreshold?: number
}

interface UseSmartCacheReturn<T> {
  get: (query: string) => Promise<T | null>
  set: (query: string, response: T, options?: { ttl?: number; tags?: string[] }) => Promise<void>
  clear: () => void
  clearByTag: (tag: string) => void
  stats: CacheStats
  isEnabled: boolean
  setEnabled: (enabled: boolean) => void
}

interface CacheStats {
  size: number
  hits: number
  misses: number
  hitRate: number                // Percentage (0-100)
  tokensSaved: number
  costSaved: number
}
```

### Examples

#### Basic Query Caching

```tsx
function ChatComponent() {
  const cache = useSmartCache<string>({
    enableSemanticMatching: false,  // Exact match only
  })

  const handleQuery = async (query: string) => {
    // Try cache first
    const cached = await cache.get(query)
    if (cached) {
      console.log('Cache hit! Saved API call')
      return cached
    }

    // Query API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }).then(r => r.text())

    // Cache for 1 hour
    await cache.set(query, response, { ttl: 3600000 })

    return response
  }

  return (
    <div>
      <div className="cache-stats">
        Hit Rate: {cache.stats.hitRate.toFixed(1)}%
        | Tokens Saved: {cache.stats.tokensSaved.toLocaleString()}
        | Cost Saved: ${cache.stats.costSaved.toFixed(2)}
      </div>
      <ChatInput onSubmit={handleQuery} />
    </div>
  )
}
```

#### Semantic Similarity Caching

```tsx
function SemanticChat() {
  const cache = useSmartCache<string>({
    enableSemanticMatching: true,
    embedFunction: async (text) => {
      // Use OpenAI embeddings
      const response = await fetch('/api/embed', {
        method: 'POST',
        body: JSON.stringify({ text }),
      })
      const { embedding } = await response.json()
      return embedding
    },
    similarityThreshold: 0.85,  // 85% similarity required
    costPerToken: 0.00001,      // $0.01 per 1000 tokens
    onCacheHit: (query, response) => {
      console.log('Semantic cache hit!', query)
      analytics.track('cache_hit', { query })
    },
    onCacheMiss: (query) => {
      analytics.track('cache_miss', { query })
    },
  })

  const handleQuery = async (query: string) => {
    const cached = await cache.get(query)
    if (cached) return cached

    const response = await queryLLM(query)
    await cache.set(query, response)
    return response
  }

  // Examples of semantic matches:
  // "What's the weather?" → matches "How's the weather today?"
  // "Tell me about dogs" → matches "Can you explain about dogs?"

  return <ChatWindow onQuery={handleQuery} />
}
```

#### Tag-Based Cache Invalidation

```tsx
function ProductChat() {
  const cache = useSmartCache<ChatResponse>({
    enableSemanticMatching: true,
  })

  const handleProductQuery = async (query: string, productId: string) => {
    const cached = await cache.get(query)
    if (cached) return cached

    const response = await fetch('/api/product-chat', {
      method: 'POST',
      body: JSON.stringify({ query, productId }),
    }).then(r => r.json())

    // Tag with product ID for invalidation
    await cache.set(query, response, {
      ttl: 3600000,               // 1 hour
      tags: ['product', productId],
    })

    return response
  }

  const handleProductUpdate = (productId: string) => {
    // Invalidate all cached responses for this product
    cache.clearByTag(productId)
  }

  return (
    <div>
      <ChatWindow onQuery={handleProductQuery} />
      <AdminPanel onProductUpdate={handleProductUpdate} />
    </div>
  )
}
```

#### Cost Tracking Dashboard

```tsx
function CacheDashboard() {
  const cache = useSmartCache<string>({
    costPerToken: 0.00001,  // GPT-4: ~$0.01/1K tokens
  })

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Cache Performance</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Hit Rate</div>
          <div className="text-2xl font-bold">
            {cache.stats.hitRate.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Cache Size</div>
          <div className="text-2xl font-bold">{cache.stats.size}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Tokens Saved</div>
          <div className="text-2xl font-bold">
            {cache.stats.tokensSaved.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Cost Saved</div>
          <div className="text-2xl font-bold text-green-600">
            ${cache.stats.costSaved.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => cache.setEnabled(!cache.isEnabled)}
          className="px-3 py-1 border rounded text-sm"
        >
          {cache.isEnabled ? 'Disable' : 'Enable'} Cache
        </button>
        <button
          onClick={() => cache.clear()}
          className="px-3 py-1 border rounded text-sm"
        >
          Clear Cache
        </button>
      </div>
    </div>
  )
}
```

#### Multi-Tier Caching Strategy

```tsx
function ProductionChat() {
  // Tier 1: Exact match cache (fast)
  const exactCache = useSmartCache<string>({
    enableSemanticMatching: false,
  })

  // Tier 2: Semantic cache (slower but finds similar queries)
  const semanticCache = useSmartCache<string>({
    enableSemanticMatching: true,
    embedFunction: getEmbedding,
    similarityThreshold: 0.85,
  })

  const handleQuery = async (query: string) => {
    // Tier 1: Check exact match
    let cached = await exactCache.get(query)
    if (cached) {
      console.log('Exact cache hit')
      return cached
    }

    // Tier 2: Check semantic similarity
    cached = await semanticCache.get(query)
    if (cached) {
      console.log('Semantic cache hit')
      // Promote to exact cache
      await exactCache.set(query, cached)
      return cached
    }

    // Cache miss: Query API
    const response = await queryAPI(query)

    // Store in both caches
    await Promise.all([
      exactCache.set(query, response),
      semanticCache.set(query, response),
    ])

    return response
  }

  return <ChatWindow onQuery={handleQuery} />
}
```

### When to Use

✅ **Use when:**
- LLM API calls are expensive ($0.01+ per query)
- Users ask similar questions repeatedly
- Reducing latency for common queries
- Building production RAG systems
- Cost optimization is important

❌ **Avoid when:**
- Responses must always be fresh (real-time data)
- Queries are always unique
- Memory constraints (cache grows unbounded)
- Semantic matching isn't needed (use simpler cache)

### Related Hooks
- `useSemanticCache` - RAG-specific semantic caching
- `useSmartThrottle` - Throttle with savings tracking
- `useRAGPipeline` - Full RAG pipeline with caching

---

## useSmartThrottle

Adaptive throttling with API call savings tracking.

### Signature

```typescript
function useSmartThrottle<T = any>(
  options?: UseSmartThrottleOptions
): UseSmartThrottleReturn<T>

interface UseSmartThrottleOptions {
  delay?: number              // Default: 500ms
  adaptive?: boolean          // Default: true (length-based delay)
  minLength?: number          // Default: 0 (no minimum)
  cancelOnNew?: boolean       // Default: false (debounce mode)
  trackSavings?: boolean      // Default: true
  onThrottle?: () => void
  onExecute?: (value: any) => void
}

interface UseSmartThrottleReturn<T> {
  throttledValue: T | undefined
  isThrottled: boolean        // Currently waiting
  setValue: (value: T) => void
  executeNow: () => void      // Execute immediately
  cancel: () => void
  throttleCount: number       // Times throttled
  callsSaved: number          // API calls prevented
  resetStats: () => void
}
```

### Examples

#### Adaptive Search Throttling

```tsx
function SearchInput() {
  const [query, setQuery] = React.useState('')

  const {
    throttledValue,
    isThrottled,
    callsSaved,
    setValue,
  } = useSmartThrottle<string>({
    delay: 500,
    adaptive: true,     // Longer delay for short inputs
    minLength: 3,       // Don't search until 3+ chars
    trackSavings: true,
  })

  React.useEffect(() => {
    if (throttledValue && throttledValue.length >= 3) {
      performSearch(throttledValue)
    }
  }, [throttledValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setValue(value)  // Will be throttled
  }

  // Adaptive delays:
  // < 10 chars: 750ms (user still typing)
  // 10-20 chars: 600ms
  // > 20 chars: 500ms (full query)

  return (
    <div>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search..."
      />
      {isThrottled && <Spinner className="ml-2" />}
      <div className="text-xs text-muted-foreground">
        API calls saved: {callsSaved}
      </div>
    </div>
  )
}
```

#### Debounce Mode (Cancel on New Input)

```tsx
function AutosaveEditor() {
  const [content, setContent] = React.useState('')

  const {
    throttledValue,
    isThrottled,
    callsSaved,
    setValue,
  } = useSmartThrottle<string>({
    delay: 2000,
    cancelOnNew: true,  // Cancel previous autosave if user keeps typing
    onExecute: (value) => {
      console.log('Autosaving...', value)
      saveToAPI(value)
    },
  })

  React.useEffect(() => {
    if (throttledValue !== undefined) {
      saveToAPI(throttledValue)
    }
  }, [throttledValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)
    setValue(value)  // Restarts 2s timer each keystroke
  }

  return (
    <div>
      <textarea value={content} onChange={handleChange} />
      {isThrottled && <span>Saving in 2s...</span>}
      <div>Autosaves prevented: {callsSaved}</div>
    </div>
  )
}
```

#### Stream Throttling

```tsx
import { useStreamThrottle } from '@clarity/react/hooks/performance'

function StreamingChat() {
  const { isReady, throttle, reset } = useStreamThrottle(300)

  const chat = useClarityChat({
    api: '/api/chat',
    streaming: true,
    onChunk: (chunk) => {
      if (isReady) {
        updateUI(chunk)
        throttle()  // Prevent updates for next 300ms
      }
    },
  })

  const handleNewMessage = () => {
    reset()  // Allow immediate update for new message
    chat.sendMessage('Hello')
  }

  return <ChatWindow messages={chat.messages} />
}
```

#### Cost Savings Dashboard

```tsx
function ThrottleDashboard() {
  const searchThrottle = useSmartThrottle({ delay: 500, trackSavings: true })
  const autosaveThrottle = useSmartThrottle({ delay: 2000, cancelOnNew: true })

  const totalCallsSaved =
    searchThrottle.callsSaved + autosaveThrottle.callsSaved

  const estimatedCostSavings = totalCallsSaved * 0.01 // $0.01 per API call

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Throttle Performance</h3>
      <div className="space-y-2">
        <div>
          Search calls saved: {searchThrottle.callsSaved}
          {searchThrottle.isThrottled && ' (throttled)'}
        </div>
        <div>
          Autosave calls saved: {autosaveThrottle.callsSaved}
          {autosaveThrottle.isThrottled && ' (waiting...)'}
        </div>
        <div className="font-bold text-green-600">
          Total Cost Saved: ${estimatedCostSavings.toFixed(2)}
        </div>
        <button onClick={() => {
          searchThrottle.resetStats()
          autosaveThrottle.resetStats()
        }}>
          Reset Stats
        </button>
      </div>
    </div>
  )
}
```

#### Execute Immediately on Demand

```tsx
function SearchWithShortcut() {
  const [query, setQuery] = React.useState('')
  const { throttledValue, executeNow, setValue } = useSmartThrottle({
    delay: 500,
  })

  useKeyboardShortcuts([
    {
      key: 'mod+enter',
      callback: executeNow,  // Search immediately (bypass throttle)
      enableInInput: true,
    },
  ])

  React.useEffect(() => {
    if (throttledValue) performSearch(throttledValue)
  }, [throttledValue])

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setValue(e.target.value)
        }}
        placeholder="Type to search (⌘↩ for instant)"
      />
    </div>
  )
}
```

### When to Use

✅ **Use when:**
- Search input needs API calls on every keystroke
- Autosave that shouldn't fire constantly
- Streaming updates are too frequent
- Tracking API call savings for cost analysis
- Adaptive delay based on input length

❌ **Avoid when:**
- Simple debounce is sufficient (use `useDebounce`)
- Throttle without tracking (use `useThrottle`)
- Fixed delay without adaptation
- Not calling external APIs

### Related Hooks
- `useDebounce` - Simple debounce without tracking
- `useThrottle` - Simple throttle without tracking
- `useSmartCache` - Cache to avoid API calls entirely
- `useStreamThrottle` - Throttle streaming responses

---

## Additional Performance Hooks

### useMountTime

Track component mount duration for performance analysis.

```typescript
function useMountTime(componentName: string): void
```

**Example:**

```tsx
function ExpensiveComponent() {
  useMountTime('ExpensiveComponent')

  // Development console output:
  // [Mount Time] ExpensiveComponent was mounted for 1234.56ms

  return <div>Content</div>
}
```

---

### useSlowRenderDetection

Detect slow renders and trigger callbacks.

```typescript
function useSlowRenderDetection(
  threshold?: number,                      // Default: 16ms
  onSlowRender?: (renderTime: number) => void
): void
```

**Example:**

```tsx
function MonitoredComponent() {
  useSlowRenderDetection(16, (renderTime) => {
    analytics.track('slow_render', {
      component: 'MonitoredComponent',
      renderTime,
    })
  })

  return <div>Content</div>
}
```

---

### useMemoryLeakDetector

Detect unremoved event listeners (development only).

```typescript
function useMemoryLeakDetector(componentName: string): void
```

**Example:**

```tsx
function ComponentWithListeners() {
  useMemoryLeakDetector('ComponentWithListeners')

  React.useEffect(() => {
    const handler = () => console.log('click')
    window.addEventListener('click', handler)

    // Forgot to remove listener!
    // Console warning on unmount:
    // [Memory Leak] ComponentWithListeners may have 1 unremoved event listeners: ["click"]
  }, [])

  return <div>Content</div>
}
```

**⚠️ Warning:** Modifies global prototypes in development. Use with caution.

---

### useLazyLoad

Lazy load resources with cancellation support.

```typescript
function useLazyLoad<T>(
  loader: () => Promise<T>,
  deps?: React.DependencyList
): {
  data: T | null
  loading: boolean
  error: Error | null
}
```

**Example:**

```tsx
function LazyChart() {
  const { data: ChartLib, loading, error } = useLazyLoad(
    () => import('chart.js'),
    []
  )

  if (loading) return <Spinner />
  if (error) return <div>Failed to load chart</div>
  if (!ChartLib) return null

  return <ChartLib.default data={chartData} />
}
```

---

## Common Patterns

### Production Performance Monitoring Stack

```tsx
function ProductionChat() {
  // 1. Render performance tracking
  const metrics = useRenderPerformance('ChatWindow')

  // 2. Battery-aware optimizations
  const { recommendations } = useBatteryAware({
    batterySaverThreshold: 0.2,
  })

  // 3. Smart caching for API calls
  const cache = useSmartCache<string>({
    enableSemanticMatching: true,
    costPerToken: 0.00001,
  })

  // 4. Throttle search input
  const searchThrottle = useSmartThrottle({
    delay: 500,
    adaptive: true,
  })

  const chat = useClarityChat({
    api: '/api/chat',
    streaming: !recommendations.reduceStreaming,
    streamingUpdateInterval: recommendations.updateInterval,
    onSubmit: async (messages) => {
      const lastMessage = messages[messages.length - 1]
      const cached = await cache.get(lastMessage.content)
      if (cached) return { content: cached }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages }),
      }).then(r => r.text())

      await cache.set(lastMessage.content, response)
      return { content: response }
    },
  })

  return (
    <div>
      {/* Performance dashboard (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceReport metrics={metrics} threshold={16} />
      )}

      {/* Battery warning */}
      {recommendations.level !== 'none' && (
        <div className="bg-yellow-100 p-2 text-sm">
          Battery Saver: {recommendations.level} mode
        </div>
      )}

      {/* Cache stats */}
      <div className="text-xs text-muted-foreground">
        Cache: {cache.stats.hitRate.toFixed(1)}% hit rate
        | Saved: ${cache.stats.costSaved.toFixed(2)}
      </div>

      <ChatWindow
        messages={chat.messages}
        enableAnimations={!recommendations.disableAnimations}
      />
    </div>
  )
}
```

### Development Debugging Stack

```tsx
function DebugChat(props: ChatProps) {
  // Only in development
  if (process.env.NODE_ENV === 'development') {
    useWhyDidYouUpdate('DebugChat', props)
    useRenderPerformance('DebugChat')
    useMountTime('DebugChat')
    useMemoryLeakDetector('DebugChat')
    useSlowRenderDetection(16, (time) => {
      console.warn(`Slow render: ${time.toFixed(2)}ms`)
    })
  }

  return <ChatWindow {...props} />
}
```

---

## Troubleshooting

### "Performance warnings flooding console"

**Problem:** `useRenderPerformance` logs every slow render.

**Solutions:**
1. Increase threshold:
   ```tsx
   // Only warn for renders > 50ms instead of 16ms
   useSlowRenderDetection(50, callback)
   ```

2. Disable in development:
   ```tsx
   if (process.env.NODE_ENV === 'production') {
     useRenderPerformance('MyComponent')
   }
   ```

3. Use analytics instead of console:
   ```tsx
   useSlowRenderDetection(16, (time) => {
     analytics.track('slow_render', { time })  // Don't log to console
   })
   ```

---

### "Battery API not working in Safari"

**Problem:** Safari doesn't support Battery API.

**Solution:** Check `isSupported` and provide fallback:

```tsx
const { isSupported, recommendations } = useBatteryAware()

const config = isSupported
  ? recommendations
  : {
      // Default optimizations for Safari
      disableAnimations: false,
      throttleUpdates: false,
      updateInterval: 100,
      level: 'none' as const,
    }

<ChatWindow updateInterval={config.updateInterval} />
```

---

### "Semantic cache not finding similar queries"

**Problem:** Similarity threshold too high or embed function not working.

**Solutions:**
1. Lower similarity threshold:
   ```tsx
   useSmartCache({
     similarityThreshold: 0.75,  // Was 0.90 (too strict)
   })
   ```

2. Verify embed function:
   ```tsx
   embedFunction: async (text) => {
     const embedding = await getEmbedding(text)
     console.log('Embedding length:', embedding.length)  // Should be 1536 for OpenAI
     return embedding
   }
   ```

3. Test with known similar queries:
   ```tsx
   await cache.set("What's the weather?", "Sunny")
   const hit = await cache.get("How's the weather today?")
   console.log('Cache hit:', hit)  // Should be "Sunny" if working
   ```

---

### "useWhyDidYouUpdate shows everything changing"

**Problem:** Parent recreates all props on every render.

**Solutions:**
1. Memoize callbacks:
   ```tsx
   const handleClick = React.useCallback(() => {
     doSomething()
   }, [])
   ```

2. Memoize objects:
   ```tsx
   const config = React.useMemo(
     () => ({ theme: 'dark', fontSize: 14 }),
     []
   )
   ```

3. Use React.memo() on child:
   ```tsx
   export const ChatMessage = React.memo(ChatMessageComponent)
   ```

---

### "Throttle not saving API calls"

**Problem:** `trackSavings` disabled or `cancelOnNew` not enabled for debounce pattern.

**Solutions:**
1. Enable tracking:
   ```tsx
   useSmartThrottle({ trackSavings: true })
   ```

2. Use debounce mode for autosave:
   ```tsx
   useSmartThrottle({
     delay: 2000,
     cancelOnNew: true,  // Essential for autosave pattern
   })
   ```

3. Check if throttle is actually preventing calls:
   ```tsx
   const { callsSaved, throttleCount } = useSmartThrottle({...})
   console.log('Throttled:', throttleCount, 'Saved:', callsSaved)
   ```

---

## Related Hooks

**Monitoring:**
- `useRenderPerformance` - Track render times
- `useWhyDidYouUpdate` - Debug re-renders
- `useMountTime` - Track component lifetime
- `useSlowRenderDetection` - Detect slow renders
- `useMemoryLeakDetector` - Find memory leaks

**Optimization:**
- `useBatteryAware` - Battery-based optimizations
- `useSmartCache` - Intelligent caching
- `useSmartThrottle` - Adaptive throttling
- `useStreamThrottle` - Throttle streaming
- `useLazyLoad` - Lazy load resources

**UI:**
- `useDebounce` - Simple debounce
- `useThrottle` - Simple throttle
- `useReducedMotion` - Respect motion preferences
- `useMediaQuery` - Responsive optimizations
