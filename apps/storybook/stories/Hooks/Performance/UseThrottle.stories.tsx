import type { Meta, StoryObj } from '@storybook/react-vite'
import { useThrottle } from '@clarity-chat/react/internal'
import { Button } from '@clarity-chat/primitives'
import { useState, useEffect } from 'react'

/**
 * **useThrottle Hook**
 *
 * Hook for throttling values - only updates at most once per delay period.
 * Useful for limiting the rate of updates from frequent events.
 *
 * **Key Features:**
 * - Throttle value updates
 * - Configurable delay
 * - Limits update frequency
 * - Automatic cleanup
 *
 * **Use Cases:**
 * - Scroll position tracking
 * - Resize handlers
 * - Mouse move events
 * - Window scroll events
 */
const meta = {
  title: 'Hooks/Performance/UseThrottle',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useThrottle\` hook limits value updates to at most once per delay period.
This is useful for limiting the rate of updates from frequent events like scroll or resize.

## Features

- ✅ Throttle value updates
- ✅ Configurable delay
- ✅ Limits update frequency
- ✅ Automatic cleanup
- ✅ Type-safe with TypeScript

## Basic Usage

\`\`\`tsx
const [scrollY, setScrollY] = useState(0)
const throttledScrollY = useThrottle(scrollY, 100)

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function ScrollTrackingDemo() {
  const [scrollY, setScrollY] = useState(0)
  const [delay, setDelay] = useState(100)
  const throttledScrollY = useThrottle(scrollY, delay)
  const [updates, setUpdates] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (throttledScrollY !== scrollY) {
      setUpdates((prev) => prev + 1)
    }
  }, [throttledScrollY])

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Throttle Delay (ms):</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full p-2 border rounded-lg"
          min="50"
          max="1000"
          step="50"
        />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg space-y-2">
        <div className="text-sm">
          <strong>Current Scroll Y:</strong> {scrollY}px
        </div>
        <div className="text-sm">
          <strong>Throttled Scroll Y:</strong> {throttledScrollY}px
        </div>
        <div className="text-sm">
          <strong>Throttled Updates:</strong> {updates}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Scroll the page to see throttling in action. Updates are limited to
          once per {delay}ms.
        </p>
      </div>

      <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded">
              Scroll item {i + 1} - Keep scrolling to see throttling effect
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const ScrollTracking: Story = {
  render: () => <ScrollTrackingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Throttling scroll position updates to limit update frequency.',
      },
    },
  },
}

function ResizeTrackingDemo() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [delay, setDelay] = useState(200)
  const throttledSize = useThrottle(windowSize, delay)
  const [updates, setUpdates] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setUpdates((prev) => prev + 1)
  }, [throttledSize])

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Throttle Delay (ms):</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full p-2 border rounded-lg"
          min="100"
          max="1000"
          step="100"
        />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg space-y-2">
        <div className="text-sm">
          <strong>Current Window Size:</strong> {windowSize.width} ×{' '}
          {windowSize.height}px
        </div>
        <div className="text-sm">
          <strong>Throttled Window Size:</strong> {throttledSize.width} ×{' '}
          {throttledSize.height}px
        </div>
        <div className="text-sm">
          <strong>Throttled Updates:</strong> {updates}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Resize the browser window to see throttling in action. Updates are
          limited to once per {delay}ms.
        </p>
      </div>
    </div>
  )
}

export const ResizeTracking: Story = {
  render: () => <ResizeTrackingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Throttling window resize events to limit update frequency.',
      },
    },
  },
}

function CounterDemo() {
  const [count, setCount] = useState(0)
  const [delay, setDelay] = useState(500)
  const throttledCount = useThrottle(count, delay)
  const [updates, setUpdates] = useState(0)

  useEffect(() => {
    setUpdates((prev) => prev + 1)
  }, [throttledCount])

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Throttle Delay (ms):</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full p-2 border rounded-lg"
          min="100"
          max="2000"
          step="100"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setCount((prev) => prev + 1)}>
          Increment Count
        </Button>
        <Button onClick={() => setCount(0)} variant="outline">
          Reset
        </Button>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg space-y-2">
        <div className="text-sm">
          <strong>Current Count:</strong> {count}
        </div>
        <div className="text-sm">
          <strong>Throttled Count:</strong> {throttledCount}
        </div>
        <div className="text-sm">
          <strong>Throttled Updates:</strong> {updates}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Click rapidly to see throttling effect. Updates are limited to once
          per {delay}ms.
        </p>
      </div>
    </div>
  )
}

export const Counter: Story = {
  render: () => <CounterDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Throttling counter updates to demonstrate throttling behavior.',
      },
    },
  },
}
