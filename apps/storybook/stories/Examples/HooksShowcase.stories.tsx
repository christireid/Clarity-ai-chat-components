import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import {
  useDebounce,
  useThrottle,
  useToggle,
  useLocalStorage,
  useMediaQuery,
  useWindowSize,
  usePrevious,
  useClipboard,
  useMounted,
} from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'

const meta = {
  title: 'Examples/HooksShowcase',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A comprehensive collection of React hooks for building chat interfaces and interactive experiences.

## Categories

- **Chat Hooks**: \`useChat\`, \`useStreaming\`, \`useMessageOperations\`
- **UI Hooks**: \`useToggle\`, \`useClipboard\`, \`useMediaQuery\`
- **Performance**: \`useDebounce\`, \`useThrottle\`, \`useDeferredSearch\`
- **DOM**: \`useEventListener\`, \`useIntersectionObserver\`, \`useAutoScroll\`
- **State**: \`useLocalStorage\`, \`usePrevious\`, \`useOptimisticMessage\`
- **Advanced**: \`useErrorRecovery\`, \`useTokenTracker\`, \`useVoiceInput\`
        `,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const UseDebounce: Story = {
  render: () => {
    const [text, setText] = useState('')
    const debouncedText = useDebounce(text, 500)

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">useDebounce</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Delays updating a value until after a specified delay has passed
            since the last change.
          </p>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
            className="w-full px-3 py-2 border rounded-md"
          />

          <div className="p-3 bg-muted rounded-md">
            <div className="text-sm">
              <strong>Immediate value:</strong> {text || '(empty)'}
            </div>
            <div className="text-sm">
              <strong>Debounced value (500ms):</strong>{' '}
              {debouncedText || '(empty)'}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Perfect for search inputs, auto-save, and API calls
        </div>
      </div>
    )
  },
}

export const UseThrottle: Story = {
  render: () => {
    const [scrollCount, setScrollCount] = useState(0)
    const throttledCount = useThrottle(scrollCount, 500)

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">useThrottle</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Limits how often a value can update to at most once per specified
            interval.
          </p>
        </div>

        <div
          className="h-64 overflow-y-scroll border rounded-md p-4 bg-muted/20"
          onScroll={() => setScrollCount((c) => c + 1)}
        >
          <div className="h-[800px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Scroll to test throttling
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-md space-y-1">
          <div className="text-sm">
            <strong>Scroll events:</strong> {scrollCount}
          </div>
          <div className="text-sm">
            <strong>Throttled updates (500ms):</strong> {throttledCount}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Perfect for scroll handlers, resize events, and mouse tracking
        </div>
      </div>
    )
  },
}

export const UseToggle: Story = {
  render: () => {
    const [isOn, toggle, setOn, setOff] = useToggle(false)

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">useToggle</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manages boolean state with convenient toggle, set, and reset
            functions.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-colors ${
              isOn
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {isOn ? '✓' : '✗'}
          </div>

          <div className="flex-1">
            <div className="text-lg font-semibold mb-2">
              State: {isOn ? 'ON' : 'OFF'}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => toggle()}>
                Toggle
              </Button>
              <Button size="sm" variant="outline" onClick={() => setOn()}>
                Turn On
              </Button>
              <Button size="sm" variant="outline" onClick={() => setOff()}>
                Turn Off
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Perfect for modals, menus, dark mode, and feature flags
        </div>
      </div>
    )
  },
}

export const UseLocalStorage: Story = {
  render: () => {
    const [name, setName] = useLocalStorage('storybook-name', '')
    const [count, setCount] = useLocalStorage('storybook-count', 0)

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">useLocalStorage</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Syncs state with localStorage, persisting across page reloads.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Counter</label>
            <div className="flex gap-2">
              <Button onClick={() => setCount(count - 1)}>-</Button>
              <div className="flex-1 flex items-center justify-center border rounded-md">
                {count}
              </div>
              <Button onClick={() => setCount(count + 1)}>+</Button>
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-md text-sm">
          <div className="font-semibold mb-1">Persisted State:</div>
          <code className="text-xs">
            {JSON.stringify(
              {
                'storybook-name': name || null,
                'storybook-count': count,
              },
              null,
              2
            )}
          </code>
        </div>

        <div className="text-xs text-muted-foreground">
          Reload the page to see the values persist! Perfect for user
          preferences, settings, and draft content.
        </div>
      </div>
    )
  },
}

export const UseMediaQuery: Story = {
  render: () => {
    const isMobile = useMediaQuery('(max-width: 640px)')
    const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
    const isDesktop = useMediaQuery('(min-width: 1025px)')
    const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">useMediaQuery</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Responds to CSS media queries in React, enabling responsive and
            adaptive UIs.
          </p>
        </div>

        <div className="space-y-2">
          {[
            { label: 'Mobile', value: isMobile, query: '(max-width: 640px)' },
            {
              label: 'Tablet',
              value: isTablet,
              query: '(min-width: 641px) and (max-width: 1024px)',
            },
            {
              label: 'Desktop',
              value: isDesktop,
              query: '(min-width: 1025px)',
            },
            {
              label: 'Dark Mode',
              value: isDarkMode,
              query: '(prefers-color-scheme: dark)',
            },
            {
              label: 'Reduced Motion',
              value: isReducedMotion,
              query: '(prefers-reduced-motion: reduce)',
            },
          ].map(({ label, value, query }) => (
            <div
              key={label}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div>
                <div className="font-medium">{label}</div>
                <code className="text-xs text-muted-foreground">{query}</code>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  value
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {value ? 'Active' : 'Inactive'}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          Resize your window to see responsive breakpoints change. Perfect for
          responsive layouts, adaptive components, and accessibility
          preferences.
        </div>
      </div>
    )
  },
}

export const UseWindowSize: Story = {
  render: () => {
    const { width, height } = useWindowSize()

    const getBreakpoint = () => {
      if (width < 640) return 'Mobile'
      if (width < 1024) return 'Tablet'
      return 'Desktop'
    }

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">useWindowSize</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tracks the current window dimensions and updates on resize.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-md text-center">
            <div className="text-3xl font-bold text-primary">{width}px</div>
            <div className="text-sm text-muted-foreground mt-1">Width</div>
          </div>

          <div className="p-4 border rounded-md text-center">
            <div className="text-3xl font-bold text-primary">{height}px</div>
            <div className="text-sm text-muted-foreground mt-1">Height</div>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-md text-center">
          <div className="text-lg font-semibold">{getBreakpoint()}</div>
          <div className="text-sm text-muted-foreground">
            Current Breakpoint
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Resize your browser to see values update. Perfect for responsive
          layouts, canvas sizing, and viewport calculations.
        </div>
      </div>
    )
  },
}

export const UsePrevious: Story = {
  render: () => {
    const [count, setCount] = useState(0)
    const previousCount = usePrevious(count)

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">usePrevious</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Stores and returns the previous value of a variable.
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Button onClick={() => setCount(count - 1)}>-</Button>
          <div className="flex-1 text-center">
            <div className="text-4xl font-bold text-primary">{count}</div>
            <div className="text-sm text-muted-foreground mt-1">Current</div>
          </div>
          <Button onClick={() => setCount(count + 1)}>+</Button>
        </div>

        <div className="p-4 bg-muted rounded-md text-center">
          <div className="text-2xl font-semibold">{previousCount ?? '—'}</div>
          <div className="text-sm text-muted-foreground mt-1">
            Previous Value
          </div>
        </div>

        {previousCount !== undefined && (
          <div className="p-3 border rounded-md text-center">
            <div className="text-sm">
              Changed by:{' '}
              <span
                className={`font-bold ${
                  count > previousCount ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {count > previousCount ? '+' : ''}
                {count - previousCount}
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Perfect for animations, transitions, and comparing value changes
        </div>
      </div>
    )
  },
}

export const UseClipboard: Story = {
  render: () => {
    const { copy, copied, error } = useClipboard()
    const [textToCopy, setTextToCopy] = useState('Hello from Clarity Chat! 👋')

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">useClipboard</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Provides an easy way to copy text to the clipboard with feedback.
          </p>
        </div>

        <div className="space-y-2">
          <textarea
            value={textToCopy}
            onChange={(e) => setTextToCopy(e.target.value)}
            className="w-full px-3 py-2 border rounded-md font-mono text-sm"
            rows={3}
            placeholder="Enter text to copy..."
          />

          <Button
            onClick={() => copy(textToCopy)}
            className="w-full"
            disabled={copied}
          >
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            Error: {error.message}
          </div>
        )}

        <div className="p-3 bg-muted rounded-md text-sm">
          <div className="font-semibold mb-1">Status:</div>
          <div>{copied ? '✓ Text copied successfully!' : 'Ready to copy'}</div>
        </div>

        <div className="text-xs text-muted-foreground">
          Perfect for code snippets, sharing links, and copy buttons. The copied
          state resets after 2 seconds.
        </div>
      </div>
    )
  },
}

export const UseMounted: Story = {
  render: () => {
    const isMounted = useMounted()
    const [showContent, setShowContent] = useState(false)

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">useMounted</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Returns whether the component is currently mounted (useful for
            preventing state updates after unmount).
          </p>
        </div>

        <div className="p-4 bg-muted rounded-md">
          <div className="text-sm space-y-2">
            <div>
              Component mounted: <strong>{isMounted ? 'Yes ✓' : 'No ✗'}</strong>
            </div>
            <div className="text-xs text-muted-foreground">
              This hook returns false on first render and true after the
              component mounts. It's useful for preventing SSR/hydration issues
              and avoiding state updates after unmount.
            </div>
          </div>
        </div>

        <Button onClick={() => setShowContent(!showContent)}>
          {showContent ? 'Hide' : 'Show'} Conditionally Rendered Content
        </Button>

        {showContent && isMounted && (
          <div className="p-4 border border-primary rounded-md bg-primary/5 animate-in fade-in">
            <div className="font-medium">
              This content only shows when mounted!
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Perfect for preventing "Can't perform a React state update on an
              unmounted component" warnings.
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Perfect for async operations, animations, and preventing memory leaks
        </div>
      </div>
    )
  },
}

export const HooksCatalog: Story = {
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Complete Hooks Catalog</h2>
          <p className="text-muted-foreground">
            Browse all available hooks organized by category
          </p>
        </div>

        <div className="space-y-6">
          {/* Chat Hooks */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">💬 Chat Hooks</h3>
            <div className="grid gap-2">
              {[
                {
                  name: 'useChat',
                  desc: 'Main hook for managing chat state and messages',
                },
                {
                  name: 'useStreaming',
                  desc: 'Handle streaming responses from AI models',
                },
                {
                  name: 'useStreamingSSE',
                  desc: 'Server-sent events streaming',
                },
                {
                  name: 'useStreamingWebSocket',
                  desc: 'WebSocket-based streaming',
                },
                {
                  name: 'useMessageOperations',
                  desc: 'CRUD operations for messages',
                },
                {
                  name: 'useOptimisticMessage',
                  desc: 'Optimistic UI updates',
                },
              ].map((hook) => (
                <div key={hook.name} className="flex gap-2 text-sm">
                  <code className="font-mono text-primary">{hook.name}</code>
                  <span className="text-muted-foreground">— {hook.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* UI Hooks */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">🎨 UI Hooks</h3>
            <div className="grid gap-2">
              {[
                {
                  name: 'useToggle',
                  desc: 'Boolean state with toggle helpers',
                },
                { name: 'useClipboard', desc: 'Copy text to clipboard' },
                { name: 'useMediaQuery', desc: 'Respond to CSS media queries' },
                { name: 'useWindowSize', desc: 'Track window dimensions' },
                { name: 'useAutoScroll', desc: 'Auto-scroll to bottom' },
                {
                  name: 'useIntersectionObserver',
                  desc: 'Track element visibility',
                },
              ].map((hook) => (
                <div key={hook.name} className="flex gap-2 text-sm">
                  <code className="font-mono text-primary">{hook.name}</code>
                  <span className="text-muted-foreground">— {hook.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Hooks */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">⚡ Performance Hooks</h3>
            <div className="grid gap-2">
              {[
                { name: 'useDebounce', desc: 'Delay value updates' },
                { name: 'useThrottle', desc: 'Limit update frequency' },
                { name: 'useDeferredSearch', desc: 'Non-blocking search' },
                { name: 'usePerformance', desc: 'Track component performance' },
              ].map((hook) => (
                <div key={hook.name} className="flex gap-2 text-sm">
                  <code className="font-mono text-primary">{hook.name}</code>
                  <span className="text-muted-foreground">— {hook.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* State Hooks */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">💾 State Hooks</h3>
            <div className="grid gap-2">
              {[
                {
                  name: 'useLocalStorage',
                  desc: 'Persist state in localStorage',
                },
                { name: 'usePrevious', desc: 'Access previous value' },
                { name: 'useMounted', desc: 'Check if component is mounted' },
                { name: 'useUndoRedo', desc: 'Undo/redo functionality' },
              ].map((hook) => (
                <div key={hook.name} className="flex gap-2 text-sm">
                  <code className="font-mono text-primary">{hook.name}</code>
                  <span className="text-muted-foreground">— {hook.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DOM Hooks */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">🌐 DOM Hooks</h3>
            <div className="grid gap-2">
              {[
                {
                  name: 'useEventListener',
                  desc: 'Add event listeners safely',
                },
                {
                  name: 'useIntersectionObserver',
                  desc: 'Observe element intersection',
                },
                { name: 'useHaptic', desc: 'Trigger haptic feedback' },
              ].map((hook) => (
                <div key={hook.name} className="flex gap-2 text-sm">
                  <code className="font-mono text-primary">{hook.name}</code>
                  <span className="text-muted-foreground">— {hook.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Hooks */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">🚀 Advanced Hooks</h3>
            <div className="grid gap-2">
              {[
                {
                  name: 'useErrorRecovery',
                  desc: 'Handle and recover from errors',
                },
                { name: 'useTokenTracker', desc: 'Track AI token usage' },
                { name: 'useVoiceInput', desc: 'Speech-to-text input' },
                { name: 'useMobileKeyboard', desc: 'Mobile keyboard handling' },
                { name: 'useRealisticTyping', desc: 'Typing animation effect' },
              ].map((hook) => (
                <div key={hook.name} className="flex gap-2 text-sm">
                  <code className="font-mono text-primary">{hook.name}</code>
                  <span className="text-muted-foreground">— {hook.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
}
