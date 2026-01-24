/**
 * Layout Thrashing Benchmark
 *
 * Benchmarks and detects layout thrashing patterns.
 * Counts forced synchronous layouts and measures layout recalculation time.
 *
 * Run with: pnpm vitest bench layout-thrashing
 */

import { describe, bench, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { PerformanceProfiler } from '@clarity-chat/dev-tools'

// Generate mock messages
function generateMessages(count: number): Message[] {
  const messages: Message[] = []

  for (let i = 0; i < count; i++) {
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
  }

  return messages
}

// Component with layout thrashing (BAD)
interface ThrashingListProps {
  messages: Message[]
}

const ThrashingList: React.FC<ThrashingListProps> = ({ messages }) => {
  const itemRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())

  React.useLayoutEffect(() => {
    // BAD: Reading and writing to DOM in a loop causes layout thrashing
    itemRefs.current.forEach((element, id) => {
      const height = element.offsetHeight // FORCED LAYOUT
      element.style.marginBottom = `${height * 0.1}px` // WRITE
    })
  }, [messages])

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message.id}
          ref={(el) => {
            if (el) {
              itemRefs.current.set(message.id, el)
            } else {
              itemRefs.current.delete(message.id)
            }
          }}
        >
          {message.content}
        </div>
      ))}
    </div>
  )
}

// Component without layout thrashing (GOOD)
interface OptimizedListProps {
  messages: Message[]
}

const OptimizedList: React.FC<OptimizedListProps> = ({ messages }) => {
  const itemRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())

  React.useLayoutEffect(() => {
    // GOOD: Batch all reads first, then all writes
    const heights = new Map<string, number>()

    // Read phase
    itemRefs.current.forEach((element, id) => {
      heights.set(id, element.offsetHeight)
    })

    // Write phase
    itemRefs.current.forEach((element, id) => {
      const height = heights.get(id) || 0
      element.style.marginBottom = `${height * 0.1}px`
    })
  }, [messages])

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message.id}
          ref={(el) => {
            if (el) {
              itemRefs.current.set(message.id, el)
            } else {
              itemRefs.current.delete(message.id)
            }
          }}
        >
          {message.content}
        </div>
      ))}
    </div>
  )
}

// Streaming with layout thrashing
interface StreamingThrashingProps {
  text: string
}

const StreamingThrashing: React.FC<StreamingThrashingProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const words = text.split(' ')
    let index = 0

    const interval = setInterval(() => {
      if (index < words.length) {
        setDisplayedText((prev) => prev + words[index] + ' ')
        index++

        // BAD: Force layout after every update
        if (containerRef.current) {
          const height = containerRef.current.offsetHeight // FORCED LAYOUT
          containerRef.current.scrollTop = containerRef.current.scrollHeight // WRITE
        }
      } else {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [text])

  return (
    <div ref={containerRef} style={{ maxHeight: '400px', overflow: 'auto' }}>
      {displayedText}
    </div>
  )
}

// Streaming without layout thrashing
interface StreamingOptimizedProps {
  text: string
}

const StreamingOptimized: React.FC<StreamingOptimizedProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)
  const shouldScrollRef = React.useRef(true)

  React.useEffect(() => {
    const words = text.split(' ')
    let index = 0

    const interval = setInterval(() => {
      if (index < words.length) {
        setDisplayedText((prev) => prev + words[index] + ' ')
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [text])

  // GOOD: Use requestAnimationFrame for smooth scrolling
  React.useLayoutEffect(() => {
    if (shouldScrollRef.current && containerRef.current) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      })
    }
  }, [displayedText])

  return (
    <div ref={containerRef} style={{ maxHeight: '400px', overflow: 'auto' }}>
      {displayedText}
    </div>
  )
}

// Accordion with layout thrashing
interface AccordionThrashingProps {
  items: { id: string; title: string; content: string }[]
}

const AccordionThrashing: React.FC<AccordionThrashingProps> = ({ items }) => {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set())
  const itemRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  React.useLayoutEffect(() => {
    // BAD: Reading heights and animating in a loop
    itemRefs.current.forEach((element, id) => {
      const isOpen = openItems.has(id)
      const content = element.querySelector('.content') as HTMLElement

      if (content) {
        if (isOpen) {
          const height = content.scrollHeight // FORCED LAYOUT
          content.style.maxHeight = `${height}px` // WRITE
        } else {
          content.style.maxHeight = '0' // WRITE
        }
      }
    })
  }, [openItems])

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          ref={(el) => {
            if (el) {
              itemRefs.current.set(item.id, el)
            } else {
              itemRefs.current.delete(item.id)
            }
          }}
        >
          <button onClick={() => toggleItem(item.id)}>{item.title}</button>
          <div
            className="content"
            style={{ overflow: 'hidden', transition: 'max-height 0.3s' }}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  )
}

describe('Layout Thrashing Benchmarks', () => {
  let profiler: PerformanceProfiler

  beforeEach(() => {
    profiler = new PerformanceProfiler()
    profiler.start()
  })

  afterEach(() => {
    profiler.stop()
    cleanup()
  })

  describe('List Rendering', () => {
    bench('Layout thrashing: 100 items', () => {
      const messages = generateMessages(100)
      const endRender = profiler.measureRender('ThrashingList-100')

      const layoutCountBefore = profiler.trackLayoutRecalculations()
      render(<ThrashingList messages={messages} />)
      const layoutCountAfter = profiler.trackLayoutRecalculations()

      endRender()

      console.log(
        `Layout recalculations (thrashing): ${layoutCountAfter - layoutCountBefore}`
      )
    })

    bench('Optimized: 100 items', () => {
      const messages = generateMessages(100)
      const endRender = profiler.measureRender('OptimizedList-100')

      const layoutCountBefore = profiler.trackLayoutRecalculations()
      render(<OptimizedList messages={messages} />)
      const layoutCountAfter = profiler.trackLayoutRecalculations()

      endRender()

      console.log(
        `Layout recalculations (optimized): ${layoutCountAfter - layoutCountBefore}`
      )
    })

    bench('Layout thrashing: 500 items', () => {
      const messages = generateMessages(500)
      const endRender = profiler.measureRender('ThrashingList-500')

      const layoutCountBefore = profiler.trackLayoutRecalculations()
      render(<ThrashingList messages={messages} />)
      const layoutCountAfter = profiler.trackLayoutRecalculations()

      endRender()

      console.log(
        `Layout recalculations (thrashing, 500): ${layoutCountAfter - layoutCountBefore}`
      )
    })

    bench('Optimized: 500 items', () => {
      const messages = generateMessages(500)
      const endRender = profiler.measureRender('OptimizedList-500')

      const layoutCountBefore = profiler.trackLayoutRecalculations()
      render(<OptimizedList messages={messages} />)
      const layoutCountAfter = profiler.trackLayoutRecalculations()

      endRender()

      console.log(
        `Layout recalculations (optimized, 500): ${layoutCountAfter - layoutCountBefore}`
      )
    })
  })

  describe('Streaming with Auto-scroll', () => {
    bench('Streaming with layout thrashing', async () => {
      const text = 'The quick brown fox jumps over the lazy dog '.repeat(50)
      const endRender = profiler.measureRender('StreamingThrashing')

      profiler.startFPSTracking((fps) => {
        if (fps < 30) {
          console.warn(`Low FPS during thrashing stream: ${fps}`)
        }
      })

      render(<StreamingThrashing text={text} />)

      await new Promise((resolve) => setTimeout(resolve, 3000))

      profiler.stopFPSTracking()
      endRender()
    })

    bench('Streaming optimized', async () => {
      const text = 'The quick brown fox jumps over the lazy dog '.repeat(50)
      const endRender = profiler.measureRender('StreamingOptimized')

      profiler.startFPSTracking((fps) => {
        if (fps < 30) {
          console.warn(`Low FPS during optimized stream: ${fps}`)
        }
      })

      render(<StreamingOptimized text={text} />)

      await new Promise((resolve) => setTimeout(resolve, 3000))

      profiler.stopFPSTracking()
      endRender()
    })
  })

  describe('Accordion Animations', () => {
    bench('Accordion with layout thrashing', () => {
      const items = Array(50)
        .fill(0)
        .map((_, i) => ({
          id: `item-${i}`,
          title: `Item ${i}`,
          content: `Content for item ${i}. Lorem ipsum dolor sit amet.`,
        }))

      const endRender = profiler.measureRender('AccordionThrashing')
      const { container } = render(<AccordionThrashing items={items} />)

      // Simulate opening all items
      const buttons = container.querySelectorAll('button')
      buttons.forEach((button) => {
        button.click()
        profiler.trackLayoutRecalculations()
      })

      endRender()
    })
  })

  describe('Dynamic Height Calculations', () => {
    bench('Read/write in loop (BAD)', () => {
      const messages = generateMessages(100)
      const { container } = render(<ThrashingList messages={messages} />)

      const endRender = profiler.measureRender('ReadWriteLoop-BAD')
      const elements = container.querySelectorAll('div')

      // BAD: Interleaved reads and writes
      elements.forEach((el) => {
        const height = el.offsetHeight // READ
        el.style.marginTop = `${height * 0.05}px` // WRITE
        profiler.trackLayoutRecalculations()
      })

      endRender()
    })

    bench('Batched reads/writes (GOOD)', () => {
      const messages = generateMessages(100)
      const { container } = render(<OptimizedList messages={messages} />)

      const endRender = profiler.measureRender('BatchedReadWrite-GOOD')
      const elements = Array.from(container.querySelectorAll('div'))

      // GOOD: Batch all reads first
      const heights = elements.map((el) => el.offsetHeight)

      // Then batch all writes
      elements.forEach((el, i) => {
        el.style.marginTop = `${heights[i] * 0.05}px`
      })

      profiler.trackLayoutRecalculations()
      endRender()
    })
  })

  describe('Scroll Position Tracking', () => {
    bench('Frequent scroll position reads (BAD)', () => {
      const messages = generateMessages(1000)
      const { container } = render(<OptimizedList messages={messages} />)
      const scrollContainer = container.firstChild as HTMLDivElement

      const endRender = profiler.measureRender('FrequentScrollReads-BAD')

      // BAD: Reading scroll position in a loop
      for (let i = 0; i < 100; i++) {
        scrollContainer.scrollTop = i * 50
        const _ = scrollContainer.scrollTop // FORCED LAYOUT
        const __ = scrollContainer.offsetHeight // FORCED LAYOUT
        profiler.trackLayoutRecalculations()
      }

      endRender()
    })

    bench('Throttled scroll position reads (GOOD)', () => {
      const messages = generateMessages(1000)
      const { container } = render(<OptimizedList messages={messages} />)
      const scrollContainer = container.firstChild as HTMLDivElement

      const endRender = profiler.measureRender('ThrottledScrollReads-GOOD')

      // GOOD: Use requestAnimationFrame for reads
      const scrollPositions: number[] = []

      for (let i = 0; i < 100; i++) {
        scrollContainer.scrollTop = i * 50

        // Schedule read for next frame
        requestAnimationFrame(() => {
          scrollPositions.push(scrollContainer.scrollTop)
        })
      }

      profiler.trackLayoutRecalculations()
      endRender()
    })
  })

  describe('Class Name Changes', () => {
    bench('Frequent class changes with style reads (BAD)', () => {
      const messages = generateMessages(100)
      const { container } = render(<OptimizedList messages={messages} />)
      const elements = Array.from(container.querySelectorAll('div'))

      const endRender = profiler.measureRender('FrequentClassChanges-BAD')

      elements.forEach((el, i) => {
        el.className = `item-${i % 3}` // WRITE
        const _ = getComputedStyle(el).color // FORCED LAYOUT
        profiler.trackLayoutRecalculations()
      })

      endRender()
    })

    bench('Batched class changes (GOOD)', () => {
      const messages = generateMessages(100)
      const { container } = render(<OptimizedList messages={messages} />)
      const elements = Array.from(container.querySelectorAll('div'))

      const endRender = profiler.measureRender('BatchedClassChanges-GOOD')

      // GOOD: Batch all class changes
      elements.forEach((el, i) => {
        el.className = `item-${i % 3}`
      })

      // Then read styles if needed
      requestAnimationFrame(() => {
        elements.forEach((el) => {
          const _ = getComputedStyle(el).color
        })
      })

      profiler.trackLayoutRecalculations()
      endRender()
    })
  })

  describe('Performance Report', () => {
    bench('Generate layout thrashing report', () => {
      const messages = generateMessages(100)

      // Test thrashing scenario
      profiler.measureRender('ThrashingReport')
      render(<ThrashingList messages={messages} />)

      const report = profiler.generateReport()

      console.log('\n=== Layout Thrashing Report ===')
      console.log(`Total layouts: ${report.layouts.count}`)
      console.log(
        `Average layout duration: ${report.layouts.averageDuration.toFixed(2)}ms`
      )
      console.log(
        `Max layout duration: ${report.layouts.maxDuration.toFixed(2)}ms`
      )
      console.log(
        `Total blocking time: ${report.userExperience.totalBlockingTime.toFixed(2)}ms`
      )
      console.log('===============================\n')
    })

    bench('Generate optimized report', () => {
      const messages = generateMessages(100)

      // Test optimized scenario
      profiler.measureRender('OptimizedReport')
      render(<OptimizedList messages={messages} />)

      const report = profiler.generateReport()

      console.log('\n=== Optimized Report ===')
      console.log(`Total layouts: ${report.layouts.count}`)
      console.log(
        `Average layout duration: ${report.layouts.averageDuration.toFixed(2)}ms`
      )
      console.log(
        `Max layout duration: ${report.layouts.maxDuration.toFixed(2)}ms`
      )
      console.log(
        `Total blocking time: ${report.userExperience.totalBlockingTime.toFixed(2)}ms`
      )
      console.log('========================\n')
    })
  })
})
