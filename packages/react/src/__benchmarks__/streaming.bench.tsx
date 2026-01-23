/**
 * Streaming Performance Benchmark
 *
 * Benchmarks streaming text rendering performance at various token rates.
 * Measures render frequency, dropped frames, and memory accumulation.
 *
 * Run with: pnpm vitest bench streaming
 */

import { describe, bench, beforeEach, afterEach } from 'vitest'
import { render, cleanup, act } from '@testing-library/react'
import * as React from 'react'
import { PerformanceProfiler } from '../utils/profiling/performance-profiler'
import {
  createDeviceSimulator,
  DEVICE_PROFILES,
} from '../utils/profiling/device-simulation'

// Mock streaming text generator
async function* streamText(
  text: string,
  tokensPerSecond: number
): AsyncGenerator<string, void, unknown> {
  const words = text.split(' ')
  const delayMs = 1000 / tokensPerSecond

  for (const word of words) {
    yield word + ' '
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
}

// Generate long text for streaming
function generateLongText(wordCount: number): string {
  const words = [
    'The',
    'quick',
    'brown',
    'fox',
    'jumps',
    'over',
    'the',
    'lazy',
    'dog',
    'while',
    'exploring',
    'various',
    'concepts',
    'in',
    'artificial',
    'intelligence',
    'and',
    'machine',
    'learning',
    'with',
    'advanced',
    'algorithms',
  ]

  return Array(wordCount)
    .fill(0)
    .map(() => words[Math.floor(Math.random() * words.length)])
    .join(' ')
}

// Simple streaming component without batching
interface SimpleStreamingProps {
  text: string
  tokensPerSecond: number
}

const SimpleStreaming: React.FC<SimpleStreamingProps> = ({
  text,
  tokensPerSecond,
}) => {
  const [displayedText, setDisplayedText] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(true)

  React.useEffect(() => {
    let mounted = true

    const stream = async () => {
      for await (const chunk of streamText(text, tokensPerSecond)) {
        if (!mounted) break

        // Immediate update - no batching
        setDisplayedText((prev) => prev + chunk)
      }
      setIsStreaming(false)
    }

    stream()

    return () => {
      mounted = false
    }
  }, [text, tokensPerSecond])

  return (
    <div>
      <div>{displayedText}</div>
      {isStreaming && <span>▊</span>}
    </div>
  )
}

// Batched streaming component
interface BatchedStreamingProps {
  text: string
  tokensPerSecond: number
  batchSize: number
}

const BatchedStreaming: React.FC<BatchedStreamingProps> = ({
  text,
  tokensPerSecond,
  batchSize,
}) => {
  const [displayedText, setDisplayedText] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    let batch = ''
    let batchCount = 0

    const stream = async () => {
      for await (const chunk of streamText(text, tokensPerSecond)) {
        if (!mounted) break

        batch += chunk
        batchCount++

        if (batchCount >= batchSize) {
          setDisplayedText((prev) => prev + batch)
          batch = ''
          batchCount = 0
        }
      }

      // Flush remaining batch
      if (batch && mounted) {
        setDisplayedText((prev) => prev + batch)
      }

      setIsStreaming(false)
    }

    stream()

    return () => {
      mounted = false
    }
  }, [text, tokensPerSecond, batchSize])

  return (
    <div>
      <div>{displayedText}</div>
      {isStreaming && <span>▊</span>}
    </div>
  )
}

// RAF-based streaming component
interface RAFStreamingProps {
  text: string
  tokensPerSecond: number
}

const RAFStreaming: React.FC<RAFStreamingProps> = ({
  text,
  tokensPerSecond,
}) => {
  const [displayedText, setDisplayedText] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(true)
  const pendingTextRef = React.useRef('')
  const rafIdRef = React.useRef<number | undefined>(undefined)

  React.useEffect(() => {
    let mounted = true

    const flushPending = () => {
      if (pendingTextRef.current) {
        setDisplayedText((prev) => prev + pendingTextRef.current)
        pendingTextRef.current = ''
      }

      if (mounted) {
        rafIdRef.current = requestAnimationFrame(flushPending)
      }
    }

    rafIdRef.current = requestAnimationFrame(flushPending)

    const stream = async () => {
      for await (const chunk of streamText(text, tokensPerSecond)) {
        if (!mounted) break
        pendingTextRef.current += chunk
      }

      // Final flush
      if (pendingTextRef.current && mounted) {
        setDisplayedText((prev) => prev + pendingTextRef.current)
      }

      setIsStreaming(false)
    }

    stream()

    return () => {
      mounted = false
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [text, tokensPerSecond])

  return (
    <div>
      <div>{displayedText}</div>
      {isStreaming && <span>▊</span>}
    </div>
  )
}

describe('Streaming Performance Benchmarks', () => {
  let profiler: PerformanceProfiler

  beforeEach(() => {
    profiler = new PerformanceProfiler()
    profiler.start()
  })

  afterEach(() => {
    profiler.stop()
    cleanup()
  })

  describe('Simple Streaming (No Batching)', () => {
    bench('Stream at 10 tokens/sec', async () => {
      const text = generateLongText(100)
      const endRender = profiler.measureRender('SimpleStreaming-10tps')

      await act(async () => {
        render(<SimpleStreaming text={text} tokensPerSecond={10} />)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('Stream at 50 tokens/sec', async () => {
      const text = generateLongText(100)
      const endRender = profiler.measureRender('SimpleStreaming-50tps')

      await act(async () => {
        render(<SimpleStreaming text={text} tokensPerSecond={50} />)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('Stream at 100 tokens/sec', async () => {
      const text = generateLongText(100)
      const endRender = profiler.measureRender('SimpleStreaming-100tps')

      await act(async () => {
        render(<SimpleStreaming text={text} tokensPerSecond={100} />)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('Stream at 200 tokens/sec', async () => {
      const text = generateLongText(100)
      const endRender = profiler.measureRender('SimpleStreaming-200tps')

      await act(async () => {
        render(<SimpleStreaming text={text} tokensPerSecond={200} />)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      endRender()
    })
  })

  describe('Batched Streaming', () => {
    bench('Stream at 50 tokens/sec (batch size 5)', async () => {
      const text = generateLongText(100)
      const endRender = profiler.measureRender('BatchedStreaming-50tps-batch5')

      await act(async () => {
        render(
          <BatchedStreaming text={text} tokensPerSecond={50} batchSize={5} />
        )
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('Stream at 100 tokens/sec (batch size 10)', async () => {
      const text = generateLongText(100)
      const endRender = profiler.measureRender(
        'BatchedStreaming-100tps-batch10'
      )

      await act(async () => {
        render(
          <BatchedStreaming text={text} tokensPerSecond={100} batchSize={10} />
        )
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('Stream at 200 tokens/sec (batch size 20)', async () => {
      const text = generateLongText(100)
      const endRender = profiler.measureRender(
        'BatchedStreaming-200tps-batch20'
      )

      await act(async () => {
        render(
          <BatchedStreaming text={text} tokensPerSecond={200} batchSize={20} />
        )
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      endRender()
    })
  })

  describe('RAF-Based Streaming', () => {
    bench('Stream at 50 tokens/sec (RAF)', async () => {
      const text = generateLongText(100)
      const endRender = profiler.measureRender('RAFStreaming-50tps')

      await act(async () => {
        render(<RAFStreaming text={text} tokensPerSecond={50} />)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('Stream at 100 tokens/sec (RAF)', async () => {
      const text = generateLongText(100)
      const endRender = profiler.measureRender('RAFStreaming-100tps')

      await act(async () => {
        render(<RAFStreaming text={text} tokensPerSecond={100} />)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('Stream at 200 tokens/sec (RAF)', async () => {
      const text = generateLongText(100)
      const endRender = profiler.measureRender('RAFStreaming-200tps')

      await act(async () => {
        render(<RAFStreaming text={text} tokensPerSecond={200} />)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      endRender()
    })
  })

  describe('Memory Accumulation', () => {
    bench('Memory: Stream 1000 words at 100 tokens/sec', async () => {
      const text = generateLongText(1000)
      const snapshot1 = profiler.captureMemorySnapshot()

      await act(async () => {
        render(<SimpleStreaming text={text} tokensPerSecond={100} />)
        await new Promise((resolve) => setTimeout(resolve, 5000))
      })

      const snapshot2 = profiler.captureMemorySnapshot()
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB

      if (delta > 10) {
        console.warn(`High memory accumulation: ${delta.toFixed(2)}MB`)
      }
    })

    bench('Memory: Stream 1000 words at 100 tokens/sec (batched)', async () => {
      const text = generateLongText(1000)
      const snapshot1 = profiler.captureMemorySnapshot()

      await act(async () => {
        render(
          <BatchedStreaming text={text} tokensPerSecond={100} batchSize={10} />
        )
        await new Promise((resolve) => setTimeout(resolve, 5000))
      })

      const snapshot2 = profiler.captureMemorySnapshot()
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB

      if (delta > 10) {
        console.warn(
          `High memory accumulation (batched): ${delta.toFixed(2)}MB`
        )
      }
    })
  })

  describe('FPS During Streaming', () => {
    bench('FPS: Stream at 100 tokens/sec', async () => {
      const text = generateLongText(200)

      profiler.startFPSTracking((fps) => {
        if (fps < 30) {
          console.warn(`Low FPS during streaming: ${fps}`)
        }
      })

      await act(async () => {
        render(<SimpleStreaming text={text} tokensPerSecond={100} />)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      profiler.stopFPSTracking()
    })

    bench('FPS: Stream at 100 tokens/sec (RAF)', async () => {
      const text = generateLongText(200)

      profiler.startFPSTracking((fps) => {
        if (fps < 30) {
          console.warn(`Low FPS during RAF streaming: ${fps}`)
        }
      })

      await act(async () => {
        render(<RAFStreaming text={text} tokensPerSecond={100} />)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      })

      profiler.stopFPSTracking()
    })
  })

  describe('Low-End Device Simulation', () => {
    bench('Low-end device: Stream at 50 tokens/sec', async () => {
      const simulator = createDeviceSimulator(DEVICE_PROFILES.lowEnd)
      simulator.start()

      const text = generateLongText(100)
      const endRender = profiler.measureRender('LowEnd-Streaming-50tps')

      await act(async () => {
        await simulator.getCPUThrottler().throttledExecute(async () => {
          render(<SimpleStreaming text={text} tokensPerSecond={50} />)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        })
      })

      endRender()
      simulator.stop()
    })

    bench('Low-end device: Stream at 50 tokens/sec (batched)', async () => {
      const simulator = createDeviceSimulator(DEVICE_PROFILES.lowEnd)
      simulator.start()

      const text = generateLongText(100)
      const endRender = profiler.measureRender('LowEnd-BatchedStreaming-50tps')

      await act(async () => {
        await simulator.getCPUThrottler().throttledExecute(async () => {
          render(
            <BatchedStreaming text={text} tokensPerSecond={50} batchSize={5} />
          )
          await new Promise((resolve) => setTimeout(resolve, 2000))
        })
      })

      endRender()
      simulator.stop()
    })
  })

  describe('Long Streaming Sessions', () => {
    bench('Stream 5000 words at 100 tokens/sec', async () => {
      const text = generateLongText(5000)
      const endRender = profiler.measureRender('LongStream-5000words')

      const snapshot1 = profiler.captureMemorySnapshot()

      await act(async () => {
        render(
          <BatchedStreaming text={text} tokensPerSecond={100} batchSize={10} />
        )
        await new Promise((resolve) => setTimeout(resolve, 10000))
      })

      const snapshot2 = profiler.captureMemorySnapshot()
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB

      endRender()

      console.log(`Long stream memory delta: ${delta.toFixed(2)}MB`)
    })
  })
})
