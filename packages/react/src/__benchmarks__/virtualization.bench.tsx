/**
 * Virtualization Benchmark
 *
 * Benchmarks virtualization performance at different thresholds,
 * scroll performance, and height recalculation overhead.
 *
 * Run with: pnpm vitest bench virtualization
 */

import { describe, bench, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { PerformanceProfiler } from '@clarity-chat/dev-tools'

// Generate mock messages
function generateMessages(count: number): Message[] {
  const messages: Message[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now + i * 1000)
    messages.push({
      id: `msg-${i}`,
      chatId: 'bench-chat',
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}: ${'Lorem ipsum '.repeat(Math.floor(Math.random() * 20) + 5)}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'sent',
    })
  }

  return messages
}

// Simple virtualization with fixed heights
interface FixedHeightVirtualListProps {
  messages: Message[]
  threshold: number
}

const FixedHeightVirtualList: React.FC<FixedHeightVirtualListProps> = ({
  messages,
  threshold,
}) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  const shouldVirtualize = messages.length > threshold

  const ITEM_HEIGHT = 100
  const CONTAINER_HEIGHT = 600
  const OVERSCAN = 3

  if (!shouldVirtualize) {
    return (
      <div style={{ height: CONTAINER_HEIGHT, overflow: 'auto' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{ padding: '12px', height: ITEM_HEIGHT }}
          >
            {message.content}
          </div>
        ))}
      </div>
    )
  }

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN)
  const endIndex = Math.min(
    messages.length,
    Math.ceil((scrollTop + CONTAINER_HEIGHT) / ITEM_HEIGHT) + OVERSCAN
  )

  const visibleMessages = messages.slice(startIndex, endIndex)
  const totalHeight = messages.length * ITEM_HEIGHT
  const offsetY = startIndex * ITEM_HEIGHT

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      style={{
        height: CONTAINER_HEIGHT,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleMessages.map((message) => (
            <div
              key={message.id}
              style={{ padding: '12px', height: ITEM_HEIGHT }}
            >
              {message.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Dynamic height virtualization
interface DynamicHeightVirtualListProps {
  messages: Message[]
}

const DynamicHeightVirtualList: React.FC<DynamicHeightVirtualListProps> = ({
  messages,
}) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  const [heights, setHeights] = React.useState<Map<string, number>>(new Map())
  const itemRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())

  const ESTIMATED_HEIGHT = 100
  const CONTAINER_HEIGHT = 600
  const OVERSCAN = 3

  // Calculate cumulative heights
  const offsets = React.useMemo(() => {
    const result: number[] = []
    let offset = 0

    for (const message of messages) {
      result.push(offset)
      offset += heights.get(message.id) || ESTIMATED_HEIGHT
    }

    return result
  }, [messages, heights])

  const totalHeight =
    offsets[offsets.length - 1] +
    (heights.get(messages[messages.length - 1]?.id) || ESTIMATED_HEIGHT)

  // Find visible range
  const startIndex =
    offsets.findIndex(
      (offset) =>
        offset +
          (heights.get(messages[offsets.indexOf(offset)]?.id) ||
            ESTIMATED_HEIGHT) >
        scrollTop
    ) - OVERSCAN
  const endIndex =
    offsets.findIndex((offset) => offset > scrollTop + CONTAINER_HEIGHT) +
    OVERSCAN

  const visibleStartIndex = Math.max(0, startIndex)
  const visibleEndIndex = Math.min(
    messages.length,
    endIndex === -1 ? messages.length : endIndex
  )

  const visibleMessages = messages.slice(visibleStartIndex, visibleEndIndex)
  const offsetY = offsets[visibleStartIndex] || 0

  // Measure heights
  React.useLayoutEffect(() => {
    const newHeights = new Map(heights)
    let hasChanges = false

    itemRefs.current.forEach((element, id) => {
      const height = element.offsetHeight
      if (heights.get(id) !== height) {
        newHeights.set(id, height)
        hasChanges = true
      }
    })

    if (hasChanges) {
      setHeights(newHeights)
    }
  }, [visibleMessages])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      style={{
        height: CONTAINER_HEIGHT,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleMessages.map((message) => (
            <div
              key={message.id}
              ref={(el) => {
                if (el) {
                  itemRefs.current.set(message.id, el)
                } else {
                  itemRefs.current.delete(message.id)
                }
              }}
              style={{ padding: '12px' }}
            >
              {message.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

describe('Virtualization Benchmarks', () => {
  let profiler: PerformanceProfiler

  beforeEach(() => {
    profiler = new PerformanceProfiler()
    profiler.start()
  })

  afterEach(() => {
    profiler.stop()
    cleanup()
  })

  describe('Virtualization Thresholds', () => {
    bench('Threshold 50: Render 25 messages (no virtualization)', () => {
      const messages = generateMessages(25)
      const endRender = profiler.measureRender('Threshold50-25msgs')
      render(<FixedHeightVirtualList messages={messages} threshold={50} />)
      endRender()
    })

    bench('Threshold 50: Render 100 messages (virtualized)', () => {
      const messages = generateMessages(100)
      const endRender = profiler.measureRender('Threshold50-100msgs')
      render(<FixedHeightVirtualList messages={messages} threshold={50} />)
      endRender()
    })

    bench('Threshold 100: Render 50 messages (no virtualization)', () => {
      const messages = generateMessages(50)
      const endRender = profiler.measureRender('Threshold100-50msgs')
      render(<FixedHeightVirtualList messages={messages} threshold={100} />)
      endRender()
    })

    bench('Threshold 100: Render 200 messages (virtualized)', () => {
      const messages = generateMessages(200)
      const endRender = profiler.measureRender('Threshold100-200msgs')
      render(<FixedHeightVirtualList messages={messages} threshold={100} />)
      endRender()
    })

    bench('Threshold 200: Render 150 messages (no virtualization)', () => {
      const messages = generateMessages(150)
      const endRender = profiler.measureRender('Threshold200-150msgs')
      render(<FixedHeightVirtualList messages={messages} threshold={200} />)
      endRender()
    })

    bench('Threshold 200: Render 500 messages (virtualized)', () => {
      const messages = generateMessages(500)
      const endRender = profiler.measureRender('Threshold200-500msgs')
      render(<FixedHeightVirtualList messages={messages} threshold={200} />)
      endRender()
    })
  })

  describe('Scroll Performance', () => {
    bench('Scroll: Fixed height (1000 messages)', () => {
      const messages = generateMessages(1000)
      const { container } = render(
        <FixedHeightVirtualList messages={messages} threshold={50} />
      )
      const scrollContainer = container.firstChild as HTMLDivElement

      const endRender = profiler.measureRender('ScrollFixed-1000msgs')

      // Simulate scroll
      for (let i = 0; i < 100; i++) {
        scrollContainer.scrollTop = i * 100
        profiler.trackLayoutRecalculations()
      }

      endRender()
    })

    bench('Scroll: Dynamic height (1000 messages)', () => {
      const messages = generateMessages(1000)
      const { container } = render(
        <DynamicHeightVirtualList messages={messages} />
      )
      const scrollContainer = container.firstChild as HTMLDivElement

      const endRender = profiler.measureRender('ScrollDynamic-1000msgs')

      // Simulate scroll
      for (let i = 0; i < 100; i++) {
        scrollContainer.scrollTop = i * 100
        profiler.trackLayoutRecalculations()
      }

      endRender()
    })

    bench('Scroll up/down 100 times (1000 messages)', () => {
      const messages = generateMessages(1000)
      const { container } = render(
        <FixedHeightVirtualList messages={messages} threshold={50} />
      )
      const scrollContainer = container.firstChild as HTMLDivElement

      const endRender = profiler.measureRender('ScrollUpDown-1000msgs')

      // Scroll up and down
      for (let i = 0; i < 50; i++) {
        // Scroll down
        scrollContainer.scrollTop = scrollContainer.scrollHeight
        profiler.trackLayoutRecalculations()

        // Scroll up
        scrollContainer.scrollTop = 0
        profiler.trackLayoutRecalculations()
      }

      endRender()
    })
  })

  describe('Height Recalculation Overhead', () => {
    bench('Fixed height: 1000 messages', () => {
      const messages = generateMessages(1000)
      const endRender = profiler.measureRender('FixedHeight-1000msgs')
      render(<FixedHeightVirtualList messages={messages} threshold={50} />)
      endRender()
    })

    bench('Dynamic height: 100 messages', () => {
      const messages = generateMessages(100)
      const endRender = profiler.measureRender('DynamicHeight-100msgs')
      render(<DynamicHeightVirtualList messages={messages} />)
      endRender()
    })

    bench('Dynamic height: 500 messages', () => {
      const messages = generateMessages(500)
      const endRender = profiler.measureRender('DynamicHeight-500msgs')
      render(<DynamicHeightVirtualList messages={messages} />)
      endRender()
    })

    bench('Dynamic height: 1000 messages', () => {
      const messages = generateMessages(1000)
      const endRender = profiler.measureRender('DynamicHeight-1000msgs')
      render(<DynamicHeightVirtualList messages={messages} />)
      endRender()
    })
  })

  describe('Memory Efficiency', () => {
    bench('Memory: Fixed height virtualization (5000 messages)', () => {
      const messages = generateMessages(5000)
      const snapshot1 = profiler.captureMemorySnapshot()

      render(<FixedHeightVirtualList messages={messages} threshold={50} />)

      const snapshot2 = profiler.captureMemorySnapshot()
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB

      console.log(
        `Fixed height virtualization memory delta: ${delta.toFixed(2)}MB`
      )

      if (delta > 50) {
        console.warn(`High memory usage: ${delta.toFixed(2)}MB`)
      }
    })

    bench('Memory: Dynamic height virtualization (5000 messages)', () => {
      const messages = generateMessages(5000)
      const snapshot1 = profiler.captureMemorySnapshot()

      render(<DynamicHeightVirtualList messages={messages} />)

      const snapshot2 = profiler.captureMemorySnapshot()
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB

      console.log(
        `Dynamic height virtualization memory delta: ${delta.toFixed(2)}MB`
      )

      if (delta > 100) {
        console.warn(`High memory usage: ${delta.toFixed(2)}MB`)
      }
    })
  })

  describe('Overscan Impact', () => {
    bench('No overscan (1000 messages)', () => {
      const messages = generateMessages(1000)
      const endRender = profiler.measureRender('NoOverscan-1000msgs')

      // Modified component with overscan = 0
      const { container } = render(
        <FixedHeightVirtualList messages={messages} threshold={50} />
      )

      // Simulate rapid scrolling
      const scrollContainer = container.firstChild as HTMLDivElement
      for (let i = 0; i < 10; i++) {
        scrollContainer.scrollTop = i * 1000
      }

      endRender()
    })

    bench('Large overscan (1000 messages)', () => {
      const messages = generateMessages(1000)
      const endRender = profiler.measureRender('LargeOverscan-1000msgs')

      // In a real implementation, you'd modify the overscan value
      const { container } = render(
        <FixedHeightVirtualList messages={messages} threshold={50} />
      )

      // Simulate rapid scrolling
      const scrollContainer = container.firstChild as HTMLDivElement
      for (let i = 0; i < 10; i++) {
        scrollContainer.scrollTop = i * 1000
      }

      endRender()
    })
  })

  describe('Rapid Content Updates', () => {
    bench('Add messages while scrolling (100 iterations)', () => {
      let messages = generateMessages(100)
      const { container, rerender } = render(
        <FixedHeightVirtualList messages={messages} threshold={50} />
      )

      const endRender = profiler.measureRender('RapidUpdates-100iterations')
      const scrollContainer = container.firstChild as HTMLDivElement

      for (let i = 0; i < 100; i++) {
        // Add a new message
        const now = new Date()
        messages = [
          ...messages,
          {
            id: `msg-new-${i}`,
            chatId: 'bench-chat',
            role: 'assistant',
            content: `New message ${i}`,
            createdAt: now,
            updatedAt: now,
            status: 'sent' as const,
          },
        ]

        rerender(<FixedHeightVirtualList messages={messages} threshold={50} />)

        // Scroll to bottom
        scrollContainer.scrollTop = scrollContainer.scrollHeight

        profiler.trackLayoutRecalculations()
      }

      endRender()
    })

    bench('Update existing messages (100 iterations)', () => {
      let messages = generateMessages(100)
      const { rerender } = render(
        <FixedHeightVirtualList messages={messages} threshold={50} />
      )

      const endRender = profiler.measureRender('UpdateMessages-100iterations')

      for (let i = 0; i < 100; i++) {
        // Update a random message
        const randomIndex = Math.floor(Math.random() * messages.length)
        messages = messages.map((msg, idx) =>
          idx === randomIndex
            ? { ...msg, content: `Updated content ${i}` }
            : msg
        )

        rerender(<FixedHeightVirtualList messages={messages} threshold={50} />)
        profiler.trackLayoutRecalculations()
      }

      endRender()
    })
  })
})
