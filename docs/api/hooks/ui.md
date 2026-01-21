# UI & Utility Hooks

Essential React hooks for common UI patterns, animations, responsive design, and browser interactions.

## Overview

| Hook | Category | Purpose | Level |
|------|----------|---------|-------|
| [`useAutoScroll`](#useautoscroll) | Scrolling | Auto-scroll to bottom when content updates | High |
| [`useClipboard`](#useclipboard) | Browser | Copy text to clipboard with success tracking | High |
| [`useDebounce`](#usedebounce) | Performance | Delay value/callback updates during rapid changes | Mid |
| [`useThrottle`](#usethrottle) | Performance | Limit value/callback execution frequency | Mid |
| [`useAnimatedValue`](#useanimatedvalue) | Animation | Smoothly animate numeric value changes | High |
| [`useIntersectionObserver`](#useintersectionobserver) | Viewport | Detect when element enters/exits viewport | Mid |
| [`useMediaQuery`](#usemediaquery) | Responsive | Track CSS media query matches | Mid |
| [`useWindowSize`](#usewindowsize) | Responsive | Track window dimensions with throttling | Mid |
| [`useToggle`](#usetoggle) | State | Enhanced boolean state with toggle helpers | Low |
| [`usePrevious`](#useprevious) | State | Track previous value of a prop/state | Low |
| [`useMounted`](#usemounted) | Lifecycle | Safely run effects only when component is mounted | Low |
| [`useEventListener`](#useeventlistener) | Events | Declarative event listener management | Low |
| [`useMergedRef`](#usemergedref) | Refs | Merge multiple refs into one | Low |
| [`useSafeTimeout`](#usesafetimeout) | Timing | Timeouts that clean up on unmount | Low |
| [`useReducedMotion`](#usereducedmotion) | Accessibility | Detect prefers-reduced-motion preference | Low |

---

## useAutoScroll

**Auto-scroll to bottom of container when new content is added.**

Intelligently scrolls to bottom only if user is already near bottom, preventing disruption during manual scrolling. Essential for chat interfaces.

### Signature

```typescript
function useAutoScroll(
  options?: UseAutoScrollOptions
): UseAutoScrollReturn

interface UseAutoScrollOptions {
  /** Whether auto-scroll is enabled (default: true) */
  enabled?: boolean
  /** Scroll behavior (default: 'smooth') */
  behavior?: ScrollBehavior
  /** Distance from bottom (px) to trigger auto-scroll (default: 100) */
  threshold?: number
  /** Dependencies that trigger scroll check */
  dependencies?: DependencyList
}

interface UseAutoScrollReturn {
  /** Ref to attach to scrollable container */
  scrollRef: RefObject<HTMLElement | null>
  /** Whether user is near bottom */
  isNearBottom: boolean
  /** Manually scroll to bottom */
  scrollToBottom: () => void
  /** Manually enable/disable auto-scroll */
  setEnabled: (enabled: boolean) => void
}
```

### Examples

#### Basic Chat Auto-Scroll

```tsx
import { useAutoScroll } from '@clarity-chat/react'

function ChatMessages({ messages }: { messages: Message[] }) {
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages], // Auto-scroll when messages change
    threshold: 100, // Trigger when within 100px of bottom
  })

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="h-[600px] overflow-y-auto p-4 space-y-4"
      >
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Show "scroll to bottom" button when scrolled up */}
      {!isNearBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg"
        >
          ↓ New messages
        </button>
      )}
    </div>
  )
}
```

#### Conditional Auto-Scroll (User vs Bot Messages)

```tsx
function SmartAutoScroll() {
  const [messages, setMessages] = useState<Message[]>([])
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)

  const { scrollRef, scrollToBottom, setEnabled } = useAutoScroll({
    dependencies: [messages],
    enabled: autoScrollEnabled,
  })

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])

    // Only auto-scroll for bot messages, not user messages
    if (message.role === 'assistant') {
      scrollToBottom()
    }
  }

  return (
    <div ref={scrollRef} className="overflow-y-auto">
      {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
    </div>
  )
}
```

#### Auto-Scroll with Smooth Scroll Polyfill

```tsx
function PolyfillAutoScroll() {
  const { scrollRef, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    behavior: 'smooth', // Uses native smooth scrolling
  })

  // Manual scroll for older browsers
  const manualSmoothScroll = () => {
    const element = scrollRef.current
    if (!element) return

    // Fallback animation if smooth scroll not supported
    const start = element.scrollTop
    const end = element.scrollHeight
    const duration = 300

    let startTime: number | null = null

    const animateScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      element.scrollTop = start + (end - start) * easeOutCubic(progress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  return <div ref={scrollRef}>...</div>
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
```

### When to Use

✅ **Use `useAutoScroll` when you need:**
- Chat interfaces that scroll with new messages
- Live log/console viewers
- Notification feeds with real-time updates
- Any scrollable content that grows over time

❌ **Don't use when:**
- User should always maintain scroll position
- Content updates shouldn't affect scroll
- Non-scrollable containers

---

## useClipboard

**Copy text to clipboard with modern API and fallbacks.**

Provides cross-browser clipboard access with success tracking and timeout-based reset. Includes fallback for older browsers and non-secure contexts.

### Signature

```typescript
function useClipboard(
  options?: UseClipboardOptions
): UseClipboardReturn

interface UseClipboardOptions {
  /** Timeout in ms before resetting copied state (default: 2000) */
  timeout?: number
  /** Callback when copy succeeds */
  onSuccess?: () => void
  /** Callback when copy fails */
  onError?: (error: Error) => void
}

interface UseClipboardReturn {
  /** Current clipboard value */
  value: string
  /** Whether value was recently copied */
  copied: boolean
  /** Copy text to clipboard */
  copy: (text: string) => Promise<void>
  /** Reset copied state */
  reset: () => void
}
```

### Examples

#### Basic Copy Button

```tsx
import { useClipboard } from '@clarity-chat/react'

function CopyButton({ text }: { text: string }) {
  const { copy, copied } = useClipboard({ timeout: 3000 })

  return (
    <button
      onClick={() => copy(text)}
      className={cn(
        'px-4 py-2 rounded transition-colors',
        copied ? 'bg-green-500 text-white' : 'bg-gray-200'
      )}
    >
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  )
}
```

#### Copy Code Block with Toast Notification

```tsx
import { useClipboard, useToast } from '@clarity-chat/react'

function CodeBlock({ code, language }: { code: string; language: string }) {
  const toast = useToast()
  const { copy, copied } = useClipboard({
    timeout: 2000,
    onSuccess: () => {
      toast.success('Code copied to clipboard!')
    },
    onError: (error) => {
      toast.error(`Failed to copy: ${error.message}`)
    },
  })

  return (
    <div className="relative group">
      <pre className="p-4 bg-gray-900 text-white rounded overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>

      <button
        onClick={() => copy(code)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <CheckIcon className="w-5 h-5 text-green-500" />
        ) : (
          <CopyIcon className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </div>
  )
}
```

#### Copy with Analytics Tracking

```tsx
function AnalyticsCopyButton({ text, source }: { text: string; source: string }) {
  const { copy, copied, value } = useClipboard({
    onSuccess: () => {
      // Track copy event
      analytics.track('text_copied', {
        source,
        textLength: text.length,
        timestamp: Date.now(),
      })
    },
    onError: (error) => {
      analytics.track('copy_failed', {
        source,
        error: error.message,
      })
    },
  })

  return (
    <button onClick={() => copy(text)}>
      {copied ? `Copied ${value.length} chars` : 'Copy'}
    </button>
  )
}
```

#### Multi-Item Copy with History

```tsx
function CopyHistory() {
  const { copy, value, copied } = useClipboard()
  const [history, setHistory] = useState<string[]>([])

  const copyAndTrack = async (text: string) => {
    await copy(text)
    setHistory(prev => [text, ...prev.slice(0, 4)]) // Keep last 5
  }

  return (
    <div>
      <div className="space-x-2 mb-4">
        <button onClick={() => copyAndTrack('Hello World')}>Copy #1</button>
        <button onClick={() => copyAndTrack('React is awesome')}>Copy #2</button>
        <button onClick={() => copyAndTrack('useClipboard hook')}>Copy #3</button>
      </div>

      {copied && (
        <div className="p-2 bg-green-100 rounded">
          Copied: "{value}"
        </div>
      )}

      {/* Copy history */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Recent Copies:</h3>
        <ul className="space-y-1">
          {history.map((item, i) => (
            <li key={i} className="text-sm text-gray-600">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

### When to Use

✅ **Use `useClipboard` when you need:**
- Code block copy buttons
- Share links/URLs
- Copy formatted text
- Form field copy helpers
- Success feedback for copy operations

❌ **Don't use when:**
- Need to read from clipboard (use Clipboard API directly)
- Copying files/images (requires different API)

---

## useDebounce

**Delay value/callback updates until user stops making changes.**

Prevents expensive operations from running on every keystroke. Updates only after specified delay since last change.

### Signature

```typescript
// Debounce a value
function useDebounce<T>(
  value: T,
  delay?: number
): T

// Debounce a callback
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay?: number
): (...args: Parameters<T>) => void

// Debounce with controls (cancel/flush)
function useDebouncedCallbackWithControls<T extends (...args: any[]) => any>(
  callback: T,
  delay?: number
): {
  call: (...args: Parameters<T>) => void
  cancel: () => void
  flush: (...args: Parameters<T>) => void
}
```

### Examples

#### Search Input Debouncing

```tsx
import { useDebounce } from '@clarity-chat/react'

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)

  // Only fires 500ms after user stops typing
  useEffect(() => {
    if (debouncedSearch) {
      searchAPI(debouncedSearch).then(setResults)
    }
  }, [debouncedSearch])

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

#### Form Auto-Save with Debounced Callback

```tsx
import { useDebouncedCallback } from '@clarity-chat/react'

function AutoSaveForm() {
  const [formData, setFormData] = useState({ name: '', email: '' })

  const debouncedSave = useDebouncedCallback(
    (data) => {
      console.log('Auto-saving...', data)
      saveToAPI(data)
    },
    1000 // Save 1 second after user stops typing
  )

  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    debouncedSave(updated)
  }

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
    </form>
  )
}
```

#### Debounced Window Resize Handler

```tsx
import { useDebouncedCallback } from '@clarity-chat/react'

function ResponsiveComponent() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const handleResize = useDebouncedCallback(
    () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    },
    300
  )

  useEffect(() => {
    handleResize() // Initial size
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return <div>Window: {dimensions.width} x {dimensions.height}</div>
}
```

#### Debounce with Manual Control (Cancel/Flush)

```tsx
import { useDebouncedCallbackWithControls } from '@clarity-chat/react'

function ControlledDebounce() {
  const { call, cancel, flush } = useDebouncedCallbackWithControls(
    (query: string) => {
      console.log('Searching for:', query)
      searchAPI(query)
    },
    1000
  )

  return (
    <div>
      <input
        onChange={(e) => call(e.target.value)}
        placeholder="Type to search..."
      />

      <div className="mt-2 space-x-2">
        <button onClick={() => cancel()}>
          Cancel Pending Search
        </button>
        <button onClick={() => flush('immediate query')}>
          Search Now (Flush)
        </button>
      </div>
    </div>
  )
}
```

### When to Use

✅ **Use `useDebounce` when you need:**
- Search-as-you-type with API calls
- Form auto-save functionality
- Input validation with network requests
- Expensive computations on user input
- Filtering large lists

❌ **Don't use when:**
- Immediate feedback required (use controlled input)
- Need to limit frequency, not delay → Use `useThrottle`
- Single event, not rapid changes → Use direct callback

---

## useThrottle

**Limit value/callback updates to at most once per time period.**

Ensures updates happen at regular intervals during continuous changes. Unlike debounce, throttle guarantees periodic execution.

### Signature

```typescript
// Throttle a value
function useThrottle<T>(
  value: T,
  delay?: number
): T

// Throttle a callback
function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay?: number
): (...args: Parameters<T>) => void
```

### Examples

#### Throttled Scroll Position Tracking

```tsx
import { useThrottle } from '@clarity-chat/react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  const throttledScrollY = useThrottle(scrollY, 100) // Update every 100ms max

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 right-0 p-4 bg-white shadow">
      Scroll: {throttledScrollY}px
    </div>
  )
}
```

#### Throttled Mouse Position

```tsx
import { useThrottledCallback } from '@clarity-chat/react'

function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useThrottledCallback(
    (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    },
    50 // Update every 50ms
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      <div
        className="absolute w-4 h-4 bg-red-500 rounded-full"
        style={{ left: position.x, top: position.y }}
      />
    </div>
  )
}
```

#### Throttled API Analytics

```tsx
import { useThrottledCallback } from '@clarity-chat/react'

function AnalyticsTracker() {
  const trackEvent = useThrottledCallback(
    (event: string, data: any) => {
      // Send to analytics (max once per 5 seconds)
      analytics.track(event, data)
    },
    5000
  )

  const handleUserAction = (action: string) => {
    // This can be called rapidly, but analytics only fires every 5s
    trackEvent('user_action', { action, timestamp: Date.now() })
  }

  return (
    <div>
      <button onClick={() => handleUserAction('click_1')}>Action 1</button>
      <button onClick={() => handleUserAction('click_2')}>Action 2</button>
      <button onClick={() => handleUserAction('click_3')}>Action 3</button>
    </div>
  )
}
```

### When to Use

✅ **Use `useThrottle` when you need:**
- Scroll position tracking
- Mouse/touch position tracking
- Window resize handlers (when updates needed during resize)
- Game loop updates
- Animation frame callbacks
- Rate-limited API calls

❌ **Don't use when:**
- Want to wait until changes stop → Use `useDebounce`
- Need every value → Use direct callback

**Debounce vs Throttle:**
- **Debounce**: Waits for quiet period (search input)
- **Throttle**: Executes at regular intervals (scroll tracking)

---

## useAnimatedValue

**Smoothly animate numeric value changes with easing.**

Creates smooth transitions when numbers update, perfect for counters, metrics, and dashboard values. Respects `prefers-reduced-motion`.

### Signature

```typescript
function useAnimatedValue(
  value: number,
  options?: UseAnimatedValueOptions
): AnimatedValueResult

interface UseAnimatedValueOptions {
  /** Animation duration in ms (default: 500) */
  duration?: number
  /** Easing function (default: 'easeOut') */
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
  /** Decimal places (default: 0) */
  decimals?: number
  /** Prefix string (e.g., '$') */
  prefix?: string
  /** Suffix string (e.g., '%', 'ms') */
  suffix?: string
  /** Whether to animate (default: true) */
  animate?: boolean
  /** Callback when animation completes */
  onAnimationComplete?: (value: number) => void
}

interface AnimatedValueResult {
  /** Current displayed value (animated) */
  displayValue: number
  /** Formatted string with prefix/suffix */
  formattedValue: string
  /** Whether animation is running */
  isAnimating: boolean
  /** Target value */
  targetValue: number
  /** Direction of change ('up' | 'down' | 'none') */
  direction: 'up' | 'down' | 'none'
  /** Accessibility props */
  ariaProps: {
    'aria-live': 'polite'
    'aria-atomic': 'true'
  }
}
```

### Examples

#### Animated Token Counter

```tsx
import { useAnimatedValue } from '@clarity-chat/react'

function TokenCounter({ tokens }: { tokens: number }) {
  const { formattedValue, direction, ariaProps } = useAnimatedValue(tokens, {
    duration: 300,
    suffix: ' tokens',
    decimals: 0,
  })

  return (
    <span
      {...ariaProps}
      className={cn(
        'font-mono text-2xl font-bold transition-colors',
        direction === 'up' && 'text-green-500',
        direction === 'down' && 'text-red-500',
        direction === 'none' && 'text-gray-900'
      )}
    >
      {formattedValue}
    </span>
  )
}
```

#### Dashboard Metrics

```tsx
function DashboardMetric({ value, label }: { value: number; label: string }) {
  const animated = useAnimatedValue(value, {
    duration: 800,
    easing: 'easeOut',
    decimals: 1,
  })

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      <div
        {...animated.ariaProps}
        className="text-3xl font-bold"
      >
        {animated.formattedValue}
      </div>
      {animated.isAnimating && (
        <div className="mt-2 text-xs text-gray-500">Updating...</div>
      )}
    </div>
  )
}
```

#### Currency Display with Animation

```tsx
function CurrencyDisplay({ amount }: { amount: number }) {
  const { formattedValue, direction } = useAnimatedValue(amount, {
    duration: 500,
    decimals: 2,
    prefix: '$',
  })

  return (
    <div className="relative inline-block">
      <div className="text-4xl font-bold">{formattedValue}</div>
      {direction !== 'none' && (
        <div
          className={cn(
            'absolute -right-6 top-0 text-2xl',
            direction === 'up' && 'text-green-500',
            direction === 'down' && 'text-red-500'
          )}
        >
          {direction === 'up' ? '↑' : '↓'}
        </div>
      )}
    </div>
  )
}
```

#### Progress Percentage

```tsx
function ProgressBar({ progress }: { progress: number }) {
  const { displayValue, formattedValue, isAnimating } = useAnimatedValue(
    progress,
    {
      duration: 600,
      easing: 'easeInOut',
      decimals: 1,
      suffix: '%',
    }
  )

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm font-mono">{formattedValue}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            'h-2 rounded-full bg-blue-500 transition-all',
            isAnimating && 'duration-600'
          )}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  )
}
```

### When to Use

✅ **Use `useAnimatedValue` when you need:**
- Animated counters/metrics
- Dashboard statistics
- Real-time value updates
- Progress indicators
- Score displays
- Token/credit counters

❌ **Don't use when:**
- Value must be exact instantly (no animation delay)
- Non-numeric values
- User must input value (use controlled input)

---

## useIntersectionObserver

**Detect when element enters/exits viewport using IntersectionObserver API.**

Perfect for lazy loading, infinite scroll, scroll animations, and viewport-based triggers. Modern, performant alternative to scroll event listeners.

### Signature

```typescript
function useIntersectionObserver(
  options?: UseIntersectionObserverOptions
): UseIntersectionObserverReturn

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Freeze state on first intersection (default: false) */
  freezeOnceVisible?: boolean
}

interface UseIntersectionObserverReturn {
  /** Ref to attach to element */
  ref: RefObject<HTMLElement | null>
  /** IntersectionObserver entry */
  entry?: IntersectionObserverEntry
  /** Whether element is intersecting */
  isIntersecting: boolean
}
```

### Examples

#### Fade In on Scroll

```tsx
import { useIntersectionObserver } from '@clarity-chat/react'

function FadeInSection({ children }: { children: React.ReactNode }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.3, // Trigger when 30% visible
    freezeOnceVisible: true, // Only animate once
  })

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isIntersecting
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      )}
    >
      {children}
    </div>
  )
}
```

#### Lazy Load Image

```tsx
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0,
    rootMargin: '100px', // Start loading 100px before visible
    freezeOnceVisible: true,
  })

  return (
    <div ref={ref} className="min-h-[200px] bg-gray-200">
      {isIntersecting ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-auto fade-in"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-[200px] bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}
```

#### Infinite Scroll Trigger

```tsx
function InfiniteScrollList() {
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(false)

  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 1.0, // Fully visible
  })

  useEffect(() => {
    if (isIntersecting && !loading) {
      setLoading(true)
      loadMoreItems().then(newItems => {
        setItems(prev => [...prev, ...newItems])
        setLoading(false)
      })
    }
  }, [isIntersecting, loading])

  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}

      {/* Trigger element at bottom */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {loading && <Spinner />}
      </div>
    </div>
  )
}
```

#### Visibility Analytics Tracking

```tsx
function AnalyticsSection({ contentId }: { contentId: string }) {
  const { ref, entry } = useIntersectionObserver({
    threshold: 0.5, // 50% visible
  })

  useEffect(() => {
    if (entry?.isIntersecting) {
      // Track when content becomes visible
      analytics.track('content_viewed', {
        contentId,
        timestamp: Date.now(),
        intersectionRatio: entry.intersectionRatio,
      })
    }
  }, [entry?.isIntersecting, contentId])

  return (
    <section ref={ref} className="min-h-screen">
      {/* Content */}
    </section>
  )
}
```

### When to Use

✅ **Use `useIntersectionObserver` when you need:**
- Lazy loading images/components
- Infinite scroll pagination
- Scroll-triggered animations
- Viewport visibility tracking
- Video autoplay on scroll
- Analytics viewport tracking

❌ **Don't use when:**
- Need exact scroll position → Use scroll event
- Element visibility unrelated to viewport
- Browser doesn't support IntersectionObserver (rare, polyfill available)

---

## useMediaQuery

**Track CSS media query matches with SSR support.**

React to viewport size, color scheme preference, and other media features. Essential for responsive design.

### Signature

```typescript
function useMediaQuery(query: string): boolean

// Tailwind breakpoint helper
function useBreakpoint(): 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

### Examples

#### Responsive Component Rendering

```tsx
import { useMediaQuery } from '@clarity-chat/react'

function ResponsiveNav() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')

  if (isMobile) return <MobileNav />
  if (isTablet) return <TabletNav />
  return <DesktopNav />
}
```

#### Dark Mode Detection

```tsx
function ThemeAwareComponent() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <div className={prefersDark ? 'dark-theme' : 'light-theme'}>
      {prefersDark ? <MoonIcon /> : <SunIcon />}
      <p>Current theme: {prefersDark ? 'Dark' : 'Light'}</p>
    </div>
  )
}
```

#### Tailwind Breakpoint Helper

```tsx
import { useBreakpoint } from '@clarity-chat/react'

function AdaptiveLayout() {
  const breakpoint = useBreakpoint()

  const columns = {
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  }[breakpoint]

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map(item => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  )
}
```

#### Accessibility Preferences

```tsx
function AccessibleComponent() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)')

  return (
    <div
      className={cn(
        'transition-all',
        !prefersReducedMotion && 'duration-300',
        prefersHighContrast && 'high-contrast'
      )}
    >
      {/* Content with accessible animations */}
    </div>
  )
}
```

### When to Use

✅ **Use `useMediaQuery` when you need:**
- Responsive component logic
- Dark mode detection
- Accessibility preference detection
- Conditional rendering based on viewport
- Print stylesheet detection
- Orientation changes

❌ **Don't use when:**
- CSS media queries sufficient → Use CSS
- Only need window dimensions → Use `useWindowSize`
- Static breakpoints only → Use CSS

---

## useWindowSize

**Track window dimensions with automatic throttling.**

Returns current window width/height with built-in performance optimization. Updates throttled to prevent performance issues during resize.

### Signature

```typescript
function useWindowSize(): WindowSize

interface WindowSize {
  width: number
  height: number
}
```

### Examples

#### Responsive Layout Calculations

```tsx
import { useWindowSize } from '@clarity-chat/react'

function DynamicGrid() {
  const { width } = useWindowSize()

  const columns = width < 640 ? 1 : width < 1024 ? 2 : width < 1536 ? 3 : 4

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map(item => (
        <GridItem key={item.id} item={item} />
      ))}
    </div>
  )
}
```

#### Canvas Sizing

```tsx
function CanvasComponent() {
  const { width, height } = useWindowSize()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Update canvas internal dimensions
    canvas.width = width
    canvas.height = height

    // Redraw
    draw(ctx, width, height)
  }, [width, height])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
```

#### Window Size Display

```tsx
function WindowSizeIndicator() {
  const { width, height } = useWindowSize()

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-black text-white text-xs rounded">
      {width} x {height}
    </div>
  )
}
```

### When to Use

✅ **Use `useWindowSize` when you need:**
- Responsive calculations
- Canvas sizing
- Dynamic layout calculations
- Conditional rendering based on size
- Viewport-dependent logic

❌ **Don't use when:**
- CSS media queries sufficient → Use CSS or `useMediaQuery`
- Element size needed (not window) → Use ResizeObserver

---

## useToggle

**Enhanced boolean state with convenience toggle functions.**

Eliminates repetitive `setState` callbacks for boolean values. Provides explicit `setTrue`/`setFalse` helpers.

### Signature

```typescript
function useToggle(initialValue?: boolean): UseToggleReturn

interface UseToggleReturn {
  /** Current toggle state */
  value: boolean
  /** Toggle the state */
  toggle: () => void
  /** Set to true */
  setTrue: () => void
  /** Set to false */
  setFalse: () => void
  /** Set to specific value */
  setValue: Dispatch<SetStateAction<boolean>>
}
```

### Examples

#### Modal Control

```tsx
import { useToggle } from '@clarity-chat/react'

function ModalExample() {
  const modal = useToggle(false)

  return (
    <div>
      <button onClick={modal.setTrue}>Open Modal</button>

      {modal.value && (
        <Modal onClose={modal.setFalse}>
          <h2>Modal Content</h2>
          <button onClick={modal.setFalse}>Close</button>
        </Modal>
      )}
    </div>
  )
}
```

#### Sidebar Toggle

```tsx
function Layout() {
  const sidebar = useToggle(true)

  return (
    <div className="flex">
      {sidebar.value && (
        <aside className="w-64 bg-gray-100">
          <Sidebar />
        </aside>
      )}

      <main className="flex-1">
        <button onClick={sidebar.toggle}>
          {sidebar.value ? 'Hide' : 'Show'} Sidebar
        </button>
        <Content />
      </main>
    </div>
  )
}
```

#### Accordion

```tsx
function AccordionItem({ title, children }: AccordionItemProps) {
  const expanded = useToggle(false)

  return (
    <div className="border-b">
      <button
        onClick={expanded.toggle}
        className="w-full p-4 text-left flex justify-between"
      >
        {title}
        <span>{expanded.value ? '−' : '+'}</span>
      </button>

      {expanded.value && (
        <div className="p-4 bg-gray-50">{children}</div>
      )}
    </div>
  )
}
```

### When to Use

✅ **Use `useToggle` when you need:**
- Modal/dialog visibility
- Sidebar/drawer state
- Accordion expand/collapse
- Show/hide toggles
- Feature flags

❌ **Don't use when:**
- Need more than two states → Use `useState`
- Complex state transitions → Use `useReducer`

---

## Additional Hooks

### usePrevious

Track previous value of a prop/state:

```tsx
function usePrevious<T>(value: T): T | undefined
```

**Example:**
```tsx
const [count, setCount] = useState(0)
const prevCount = usePrevious(count)

// prevCount = 0, count = 1 after increment
```

### useMounted

Prevent state updates on unmounted components:

```tsx
function useMounted(): React.MutableRefObject<boolean>
```

**Example:**
```tsx
const isMounted = useMounted()

useEffect(() => {
  fetchData().then(data => {
    if (isMounted.current) {
      setData(data)
    }
  })
}, [])
```

### useEventListener

Declarative event listener management:

```tsx
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: HTMLElement | Window
): void
```

**Example:**
```tsx
useEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal()
})
```

### useMergedRef

Merge multiple refs into one:

```tsx
function useMergedRef<T>(...refs: ReactRef<T>[]): RefCallback<T>
```

**Example:**
```tsx
const internalRef = useRef<HTMLDivElement>(null)
const { ref: observerRef } = useIntersectionObserver()
const mergedRef = useMergedRef(internalRef, observerRef, forwardedRef)

return <div ref={mergedRef}>...</div>
```

### useSafeTimeout

Timeouts that clean up on unmount:

```tsx
function useSafeTimeout(): {
  setSafeTimeout: (callback: () => void, delay: number) => number
  clearSafeTimeout: (id: number) => void
}
```

**Example:**
```tsx
const { setSafeTimeout } = useSafeTimeout()

setSafeTimeout(() => {
  console.log('This will not run if component unmounts')
}, 1000)
```

### useReducedMotion

Detect `prefers-reduced-motion` preference:

```tsx
function useReducedMotion(): boolean
```

**Example:**
```tsx
const prefersReducedMotion = useReducedMotion()

return (
  <div className={cn(!prefersReducedMotion && 'animate-fade-in')}>
    {/* Content */}
  </div>
)
```

---

## Common Patterns

### Responsive Chat Interface

Combine multiple UI hooks for a production-ready chat:

```tsx
import {
  useAutoScroll,
  useClipboard,
  useMediaQuery,
  useToggle,
  useDebounce,
  useIntersectionObserver,
} from '@clarity-chat/react'

function ResponsiveChatInterface() {
  const { messages } = useClarityChat({ api: '/api/chat' })
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Auto-scroll
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
  })

  // Clipboard
  const { copy, copied } = useClipboard()

  // Sidebar toggle
  const sidebar = useToggle(!isMobile)

  // Search with debounce
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Lazy load older messages
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver()

  useEffect(() => {
    if (isIntersecting) {
      loadOlderMessages()
    }
  }, [isIntersecting])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {sidebar.value && (
        <aside className="w-64 bg-gray-100">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full p-2"
          />
          <ChatHistory query={debouncedSearch} />
        </aside>
      )}

      {/* Main chat */}
      <main className="flex-1 flex flex-col">
        <header className="p-4 border-b flex justify-between">
          <button onClick={sidebar.toggle}>☰</button>
          <h1>Chat</h1>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
          {/* Load more trigger */}
          <div ref={loadMoreRef} className="h-10" />

          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onCopy={(text) => copy(text)}
            />
          ))}

          {copied && (
            <div className="fixed bottom-20 right-4 p-2 bg-green-500 text-white rounded">
              Copied!
            </div>
          )}
        </div>

        {!isNearBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg"
          >
            ↓
          </button>
        )}

        <ChatInput />
      </main>
    </div>
  )
}
```

---

## Troubleshooting

### Auto-Scroll Not Working

**Problem:** Messages don't auto-scroll

**Solutions:**
```tsx
// 1. Check dependencies array includes messages
const { scrollRef } = useAutoScroll({
  dependencies: [messages], // Must include!
})

// 2. Ensure scrollRef is attached to scrollable element
<div ref={scrollRef} className="overflow-y-auto">

// 3. Check threshold setting
const { scrollRef, isNearBottom } = useAutoScroll({
  threshold: 100, // Increase if needed
})
```

### Debounce Not Delaying Enough

**Problem:** Updates still happening too frequently

**Solutions:**
```tsx
// 1. Increase delay
const debounced = useDebounce(value, 1000) // Longer delay

// 2. Use callback variant for direct control
const debouncedCallback = useDebouncedCallback(fn, 1000)

// 3. Check if you need throttle instead
const throttled = useThrottle(value, 1000) // Regular intervals
```

### Media Query Not Updating

**Problem:** `useMediaQuery` stuck on initial value

**Solutions:**
```tsx
// 1. Check query syntax
const isMobile = useMediaQuery('(max-width: 768px)') // Correct
// NOT: useMediaQuery('max-width: 768px') // Missing parens

// 2. Test in browser console
window.matchMedia('(max-width: 768px)').matches

// 3. Use useWindowSize for simple width checks
const { width } = useWindowSize()
const isMobile = width < 768
```

### Intersection Observer Not Firing

**Problem:** `isIntersecting` always false

**Solutions:**
```tsx
// 1. Check threshold (0 = any pixel, 1 = fully visible)
const { ref, isIntersecting } = useIntersectionObserver({
  threshold: 0, // More lenient
})

// 2. Add rootMargin for early triggering
const { ref, isIntersecting } = useIntersectionObserver({
  rootMargin: '100px', // Trigger 100px before visible
})

// 3. Ensure ref is attached
<div ref={ref}> // Must be here!
```

---

## Related Hooks

### Performance Hooks
- [`useMemoryStore`](./memory.md#usememorystore) - Memory management
- [`useContextMonitor`](./memory.md#usecontextmonitor) - Token usage monitoring

### Chat Hooks
- [`useClarityChat`](./chat.md#useclaritychat) - Complete chat management
- [`useMessageFormatter`](./chat.md#usemessageformatter) - Message formatting

### Streaming Hooks
- [`useStreaming`](./streaming.md#usestreaming) - Base streaming hook
- [`useSmoothedText`](./streaming.md#usesmoothedtext) - 60fps text smoothing
