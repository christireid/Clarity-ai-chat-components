/**
 * Long Message List Benchmark
 *
 * Benchmarks rendering performance of long message lists with varying message counts.
 * Compares non-virtualized vs virtualized implementations.
 *
 * Run with: pnpm vitest bench long-message-list
 */

import { describe, bench, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { PerformanceProfiler } from '@clarity-chat/dev-tools'
import {
  createDeviceSimulator,
  DEVICE_PROFILES,
} from '@clarity-chat/dev-tools'

// Generate mock messages
function generateMessages(count: number): Message[] {
  const messages: Message[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const isUser = i % 2 === 0
    const timestamp = new Date(now + i * 1000)
    messages.push({
      id: `msg-${i}`,
      chatId: 'bench-chat',
      role: isUser ? 'user' : 'assistant',
      content: isUser
        ? `This is a user message ${i}. Here's some additional text to make it more realistic.`
        : `This is an assistant response ${i}. It includes multiple sentences to simulate real conversation. The response might include code examples, explanations, and detailed information that would typically appear in a chat interface.`,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'sent',
    })
  }

  return messages
}

// Simple MessageList component for testing (non-virtualized)
interface SimpleMessageListProps {
  messages: Message[]
}

const SimpleMessageList: React.FC<SimpleMessageListProps> = ({ messages }) => {
  return (
    <div role="log" aria-live="polite">
      {messages.map((message) => (
        <div
          key={message.id}
          data-message-id={message.id}
          style={{ padding: '12px', marginBottom: '8px' }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {message.role === 'user' ? 'User' : 'Assistant'}
          </div>
          <div>{message.content}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {message.createdAt.toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  )
}

// Virtualized MessageList using window virtualization concept
interface VirtualizedMessageListProps {
  messages: Message[]
}

const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
}) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const ITEM_HEIGHT = 100 // Approximate height
  const CONTAINER_HEIGHT = 600
  const OVERSCAN = 3

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
      ref={containerRef}
      role="log"
      aria-live="polite"
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
              data-message-id={message.id}
              style={{
                padding: '12px',
                marginBottom: '8px',
                height: ITEM_HEIGHT,
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {message.role === 'user' ? 'User' : 'Assistant'}
              </div>
              <div>{message.content}</div>
              <div
                style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}
              >
                {message.createdAt.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

describe('Long Message List Benchmarks', () => {
  let profiler: PerformanceProfiler

  beforeEach(() => {
    profiler = new PerformanceProfiler()
    profiler.start()
  })

  afterEach(() => {
    profiler.stop()
    cleanup()
  })

  describe('Non-Virtualized Message List', () => {
    bench('Render 100 messages', () => {
      const messages = generateMessages(100)
      const endRender = profiler.measureRender('SimpleMessageList-100')
      render(<SimpleMessageList messages={messages} />)
      endRender()
    })

    bench('Render 500 messages', () => {
      const messages = generateMessages(500)
      const endRender = profiler.measureRender('SimpleMessageList-500')
      render(<SimpleMessageList messages={messages} />)
      endRender()
    })

    bench('Render 1000 messages', () => {
      const messages = generateMessages(1000)
      const endRender = profiler.measureRender('SimpleMessageList-1000')
      render(<SimpleMessageList messages={messages} />)
      endRender()
    })

    bench('Render 5000 messages', () => {
      const messages = generateMessages(5000)
      const endRender = profiler.measureRender('SimpleMessageList-5000')
      render(<SimpleMessageList messages={messages} />)
      endRender()
    })
  })

  describe('Virtualized Message List', () => {
    bench('Render 100 messages (virtualized)', () => {
      const messages = generateMessages(100)
      const endRender = profiler.measureRender('VirtualizedMessageList-100')
      render(<VirtualizedMessageList messages={messages} />)
      endRender()
    })

    bench('Render 500 messages (virtualized)', () => {
      const messages = generateMessages(500)
      const endRender = profiler.measureRender('VirtualizedMessageList-500')
      render(<VirtualizedMessageList messages={messages} />)
      endRender()
    })

    bench('Render 1000 messages (virtualized)', () => {
      const messages = generateMessages(1000)
      const endRender = profiler.measureRender('VirtualizedMessageList-1000')
      render(<VirtualizedMessageList messages={messages} />)
      endRender()
    })

    bench('Render 5000 messages (virtualized)', () => {
      const messages = generateMessages(5000)
      const endRender = profiler.measureRender('VirtualizedMessageList-5000')
      render(<VirtualizedMessageList messages={messages} />)
      endRender()
    })
  })

  describe('Memory Usage', () => {
    bench('Memory: 100 messages', () => {
      const messages = generateMessages(100)
      const snapshot1 = profiler.captureMemorySnapshot()
      render(<SimpleMessageList messages={messages} />)
      const snapshot2 = profiler.captureMemorySnapshot()

      // Log memory delta
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB
      if (delta > 10) {
        console.warn(
          `High memory usage for 100 messages: ${delta.toFixed(2)}MB`
        )
      }
    })

    bench('Memory: 1000 messages', () => {
      const messages = generateMessages(1000)
      const snapshot1 = profiler.captureMemorySnapshot()
      render(<SimpleMessageList messages={messages} />)
      const snapshot2 = profiler.captureMemorySnapshot()

      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB
      if (delta > 50) {
        console.warn(
          `High memory usage for 1000 messages: ${delta.toFixed(2)}MB`
        )
      }
    })

    bench('Memory: 1000 messages (virtualized)', () => {
      const messages = generateMessages(1000)
      const snapshot1 = profiler.captureMemorySnapshot()
      render(<VirtualizedMessageList messages={messages} />)
      const snapshot2 = profiler.captureMemorySnapshot()

      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB
      if (delta > 20) {
        console.warn(
          `High memory usage for virtualized 1000 messages: ${delta.toFixed(2)}MB`
        )
      }
    })
  })

  describe('Low-End Device Simulation', () => {
    bench('Low-end device: 500 messages', async () => {
      const simulator = createDeviceSimulator(DEVICE_PROFILES.lowEnd)
      simulator.start()

      const messages = generateMessages(500)
      const endRender = profiler.measureRender('LowEnd-SimpleMessageList-500')

      await simulator.getCPUThrottler().throttledExecute(() => {
        render(<SimpleMessageList messages={messages} />)
      })

      endRender()
      simulator.stop()
    })

    bench('Low-end device: 500 messages (virtualized)', async () => {
      const simulator = createDeviceSimulator(DEVICE_PROFILES.lowEnd)
      simulator.start()

      const messages = generateMessages(500)
      const endRender = profiler.measureRender(
        'LowEnd-VirtualizedMessageList-500'
      )

      await simulator.getCPUThrottler().throttledExecute(() => {
        render(<VirtualizedMessageList messages={messages} />)
      })

      endRender()
      simulator.stop()
    })
  })

  describe('Incremental Message Addition', () => {
    bench('Add messages incrementally (1 to 100)', () => {
      const messages: Message[] = []

      for (let i = 1; i <= 100; i++) {
        const now = new Date()
        messages.push({
          id: `msg-${i}`,
          chatId: 'bench-chat',
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${i}`,
          createdAt: now,
          updatedAt: now,
          status: 'sent',
        })

        const endRender = profiler.measureRender(`Incremental-${i}`)
        const { unmount } = render(<SimpleMessageList messages={messages} />)
        endRender()
        unmount()
      }
    })

    bench('Add messages incrementally virtualized (1 to 100)', () => {
      const messages: Message[] = []

      for (let i = 1; i <= 100; i++) {
        const now = new Date()
        messages.push({
          id: `msg-${i}`,
          chatId: 'bench-chat',
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${i}`,
          createdAt: now,
          updatedAt: now,
          status: 'sent',
        })

        const endRender = profiler.measureRender(`IncrementalVirtualized-${i}`)
        const { unmount } = render(
          <VirtualizedMessageList messages={messages} />
        )
        endRender()
        unmount()
      }
    })
  })
})
