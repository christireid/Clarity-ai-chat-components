# 🎣 Custom Hooks Guide

Clarity Chat provides a comprehensive set of **13 production-ready custom hooks** that handle common React patterns. These hooks follow modern best practices and are fully typed with TypeScript.

## 📚 Table of Contents

- [useAutoScroll](#useautoscroll) - Auto-scroll to bottom with user control
- [useClipboard](#useclipboard) - Copy to clipboard with success tracking
- [useDebounce](#usedebounce) - Debounce values and callbacks
- [useThrottle](#usethrottle) - Throttle values and callbacks
- [useEventListener](#useeventlistener) - Attach event listeners safely
- [useIntersectionObserver](#useintersectionobserver) - Detect element visibility
- [useKeyboardShortcuts](#usekeyboardshortcuts) - Register keyboard shortcuts
- [useLocalStorage](#uselocalstorage) - Persist state in localStorage
- [useMediaQuery](#usemediaquery) - Track media queries and breakpoints
- [useMounted](#usemounted) - Check if component is mounted
- [usePrevious](#useprevious) - Get previous value of state/prop
- [useToggle](#usetoggle) - Enhanced boolean state management
- [useWindowSize](#usewindowsize) - Track window dimensions

---

## useAutoScroll

Auto-scroll to bottom of container when new content is added. Only scrolls if user is near bottom to avoid disrupting manual scrolling.

### Usage

```tsx
import { useAutoScroll } from '@clarity-chat/react'

function ChatMessages({ messages }) {
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    threshold: 100,
    behavior: 'smooth'
  })

  return (
    <div className="relative">
      <div ref={scrollRef} className="overflow-y-auto h-96">
        {messages.map(msg => <Message key={msg.id} {...msg} />)}
      </div>
      
      {!isNearBottom && (
        <button onClick={scrollToBottom}>
          Scroll to bottom
        </button>
      )}
    </div>
  )
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether auto-scroll is enabled |
| `behavior` | `'smooth' \| 'auto'` | `'smooth'` | Scroll behavior |
| `threshold` | `number` | `100` | Distance from bottom (px) to trigger auto-scroll |
| `dependencies` | `any[]` | `[]` | Dependencies that trigger scroll check |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `scrollRef` | `RefObject<HTMLElement>` | Ref to attach to scrollable container |
| `isNearBottom` | `boolean` | Whether user is near bottom |
| `scrollToBottom` | `() => void` | Manually scroll to bottom |
| `setEnabled` | `(enabled: boolean) => void` | Enable/disable auto-scroll |

---

## useClipboard

Copy text to clipboard with success tracking and automatic reset.

### Usage

```tsx
import { useClipboard } from '@clarity-chat/react'

function CodeBlock({ code }) {
  const { copy, copied } = useClipboard({
    timeout: 3000,
    onSuccess: () => console.log('Copied!')
  })

  return (
    <div className="relative">
      <pre><code>{code}</code></pre>
      <button onClick={() => copy(code)}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | `number` | `2000` | Timeout in ms before resetting copied state |
| `onSuccess` | `() => void` | `undefined` | Callback when copy succeeds |
| `onError` | `(error: Error) => void` | `undefined` | Callback when copy fails |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Current clipboard value |
| `copied` | `boolean` | Whether value was recently copied |
| `copy` | `(text: string) => Promise<void>` | Copy text to clipboard |
| `reset` | `() => void` | Reset copied state |

---

## useDebounce

Debounce a value or callback - only updates after delay has passed since last change.

### Usage

```tsx
import { useDebounce, useDebouncedCallback } from '@clarity-chat/react'

// Debounce a value
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    // Only fires 500ms after user stops typing
    searchAPI(debouncedSearch)
  }, [debouncedSearch])

  return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
}

// Debounce a callback
function AutoSave({ data }) {
  const debouncedSave = useDebouncedCallback(
    (value) => saveToAPI(value),
    1000
  )

  useEffect(() => {
    debouncedSave(data)
  }, [data])

  return <div>Auto-saving...</div>
}
```

### API

```tsx
// Debounce value
const debouncedValue = useDebounce<T>(value: T, delay?: number): T

// Debounce callback
const debouncedCallback = useDebouncedCallback<T>(
  callback: T,
  delay?: number
): (...args: Parameters<T>) => void
```

---

## useThrottle

Throttle a value or callback - only updates at most once per delay period.

### Usage

```tsx
import { useThrottle, useThrottledCallback } from '@clarity-chat/react'

// Throttle a value
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  const throttledScrollY = useThrottle(scrollY, 100)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <div>Scroll position: {throttledScrollY}</div>
}

// Throttle a callback
function ResizeHandler() {
  const throttledResize = useThrottledCallback(
    () => console.log('Resized!'),
    200
  )

  useEffect(() => {
    window.addEventListener('resize', throttledResize)
    return () => window.removeEventListener('resize', throttledResize)
  }, [throttledResize])

  return <div>Resize the window</div>
}
```

---

## useEventListener

Attach event listener to element with automatic cleanup.

### Usage

```tsx
import { useEventListener } from '@clarity-chat/react'

function KeyboardHandler() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Listen to specific element
  useEventListener('click', (e) => {
    console.log('Button clicked!', e)
  }, buttonRef)

  // Listen to window
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setModalOpen(false)
    }
  })

  return <button ref={buttonRef}>Click me</button>
}
```

---

## useIntersectionObserver

Observe element intersection with viewport using IntersectionObserver. Perfect for lazy loading, infinite scroll, and animations on scroll.

### Usage

```tsx
import { useIntersectionObserver } from '@clarity-chat/react'

function LazyImage({ src }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true
  })

  return (
    <div
      ref={ref}
      className={isIntersecting ? 'animate-fade-in' : 'opacity-0'}
    >
      {isIntersecting && <img src={src} alt="" />}
    </div>
  )
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | `number \| number[]` | `0` | Percentage of element visibility to trigger |
| `root` | `Element \| null` | `null` | Root element for intersection |
| `rootMargin` | `string` | `'0%'` | Margin around root |
| `freezeOnceVisible` | `boolean` | `false` | Freeze observed state on first intersection |

---

## useKeyboardShortcuts

Register keyboard shortcuts with support for modifiers.

### Usage

```tsx
import { useKeyboardShortcuts, useShortcutDisplay } from '@clarity-chat/react'

function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const getShortcut = useShortcutDisplay()

  useKeyboardShortcuts([
    {
      key: 'mod+k',
      callback: () => setSearchOpen(true),
      description: 'Open search'
    },
    {
      key: 'escape',
      callback: () => setSearchOpen(false),
      description: 'Close search'
    },
    {
      key: 'mod+enter',
      callback: handleSubmit,
      description: 'Submit form',
      enableInInput: true
    }
  ])

  return (
    <div>
      <p>Press <kbd>{getShortcut('mod+k')}</kbd> to search</p>
      {/* Shows ⌘K on Mac, Ctrl+K on Windows */}
    </div>
  )
}
```

### Shortcut Pattern

Use these patterns for key combinations:
- `mod` - Cmd on Mac, Ctrl on Windows/Linux
- `ctrl`, `alt`, `shift`, `meta` - Specific modifiers
- Combine with `+`: `mod+k`, `ctrl+shift+f`, `alt+enter`

---

## useLocalStorage

Persist state in localStorage with automatic serialization and cross-tab sync.

### Usage

```tsx
import { useLocalStorage } from '@clarity-chat/react'

function ThemeToggle() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <button onClick={removeTheme}>
        Reset to default
      </button>
    </div>
  )
}

// Works with complex objects
function UserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('prefs', {
    fontSize: 'medium',
    language: 'en',
    notifications: true
  })

  return (
    <div>
      <select 
        value={preferences.fontSize} 
        onChange={(e) => setPreferences(prev => ({
          ...prev,
          fontSize: e.target.value
        }))}
      >
        <option>small</option>
        <option>medium</option>
        <option>large</option>
      </select>
    </div>
  )
}
```

### API

```tsx
const [storedValue, setValue, removeValue] = useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options?: {
    serializer?: (value: T) => string
    deserializer?: (value: string) => T
    initializeWithValue?: boolean
  }
): [T, Dispatch<SetStateAction<T>>, () => void]
```

---

## useMediaQuery

Track media queries and responsive breakpoints with SSR support.

### Usage

```tsx
import { useMediaQuery, useBreakpoint } from '@clarity-chat/react'

function ResponsiveNav() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return isMobile ? <MobileNav /> : <DesktopNav />
}

// Or use Tailwind breakpoints
function BreakpointAware() {
  const breakpoint = useBreakpoint()
  // Returns: 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  return (
    <div>
      Current breakpoint: {breakpoint}
      {breakpoint === 'md' ? <TabletView /> : <MobileView />}
    </div>
  )
}
```

---

## useMounted

Track if component is currently mounted. Useful for preventing state updates after unmount.

### Usage

```tsx
import { useMounted } from '@clarity-chat/react'

function DataFetcher() {
  const [data, setData] = useState(null)
  const isMounted = useMounted()

  useEffect(() => {
    async function fetchData() {
      const result = await api.get('/data')
      
      // Only update state if component is still mounted
      if (isMounted()) {
        setData(result)
      }
    }
    fetchData()
  }, [isMounted])

  return <div>{data?.title}</div>
}
```

---

## usePrevious

Get previous value of state or prop.

### Usage

```tsx
import { usePrevious } from '@clarity-chat/react'

function Counter() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount ?? 'N/A'}</p>
      <p>Change: {count - (prevCount ?? 0)}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

---

## useToggle

Enhanced boolean state with helper functions.

### Usage

```tsx
import { useToggle } from '@clarity-chat/react'

function Modal() {
  const modal = useToggle(false)
  const sidebar = useToggle(true)

  return (
    <div>
      <button onClick={modal.toggle}>Toggle Modal</button>
      <button onClick={modal.setTrue}>Open Modal</button>
      <button onClick={modal.setFalse}>Close Modal</button>
      
      {modal.value && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={modal.setFalse}>Close</button>
        </div>
      )}
    </div>
  )
}
```

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `value` | `boolean` | Current toggle state |
| `toggle` | `() => void` | Toggle the state |
| `setTrue` | `() => void` | Set to true |
| `setFalse` | `() => void` | Set to false |
| `setValue` | `Dispatch<SetStateAction<boolean>>` | Set to specific value |

---

## useWindowSize

Track window dimensions with throttled updates.

### Usage

```tsx
import { useWindowSize } from '@clarity-chat/react'

function ResponsiveComponent() {
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width < 768 ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  )
}
```

---

## 🎯 Hook Combinations

These hooks are designed to work together. Here are some powerful combinations:

### Smart Search with Debouncing

```tsx
function SmartSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery).then(setResults)
    }
  }, [debouncedQuery])

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {results.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  )
}
```

### Infinite Scroll with Intersection Observer

```tsx
function InfiniteList({ items, loadMore }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 1.0
  })

  useEffect(() => {
    if (isIntersecting) {
      loadMore()
    }
  }, [isIntersecting, loadMore])

  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
      <div ref={ref} className="loading">
        Loading more...
      </div>
    </div>
  )
}
```

### Keyboard Shortcuts with Local Storage

```tsx
function App() {
  const [shortcutsEnabled, setShortcutsEnabled] = useLocalStorage(
    'shortcuts-enabled',
    true
  )

  useKeyboardShortcuts([
    {
      key: 'mod+k',
      callback: () => console.log('Search opened'),
      enabled: shortcutsEnabled
    },
    {
      key: 'mod+/',
      callback: () => setShortcutsEnabled(!shortcutsEnabled),
      description: 'Toggle keyboard shortcuts'
    }
  ])

  return <div>Shortcuts {shortcutsEnabled ? 'enabled' : 'disabled'}</div>
}
```

---

## 💡 Best Practices

1. **Use Dependencies Wisely** - Only include necessary dependencies to avoid unnecessary re-renders
2. **Memoize Callbacks** - Use `useCallback` for callbacks passed to hooks
3. **SSR Support** - All hooks handle server-side rendering gracefully
4. **TypeScript** - Leverage TypeScript generics for type safety
5. **Cleanup** - Hooks automatically clean up timers, listeners, and observers
6. **Performance** - Hooks use `useCallback` and `useMemo` internally for optimization

---

## 🚀 What's Next?

Check out:
- [Component Examples](./EXAMPLES.md) - Real-world usage examples
- [Recipes](./RECIPES.md) - Common patterns and solutions
- [API Reference](./API.md) - Complete API documentation
- [Storybook](./apps/storybook) - Interactive component playground

---

**Built with ❤️ by Code & Clarity**
