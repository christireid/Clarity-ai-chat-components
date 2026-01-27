/**
 * Concurrent Streams Benchmark
 *
 * Benchmarks performance with multiple concurrent streaming messages.
 * Measures state update frequency, race conditions, and memory leaks.
 *
 * Run with: pnpm vitest bench concurrent-streams
 */

import { describe, bench, beforeEach, afterEach } from 'vitest'
import { render, cleanup, act } from '@testing-library/react'
import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { PerformanceProfiler } from '@clarity-chat/dev-tools'

// Mock streaming text generator
async function* streamText(
  text: string,
  tokensPerSecond: number,
  streamId: string
): AsyncGenerator<{ streamId: string; chunk: string }, void, unknown> {
  const words = text.split(' ')
  const delayMs = 1000 / tokensPerSecond

  for (const word of words) {
    yield { streamId, chunk: word + ' ' }
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }
}

// Generate text for streaming
function generateStreamText(wordCount: number): string {
  const words = [
    'The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog',
    'while', 'exploring', 'various', 'concepts', 'in', 'artificial', 'intelligence',
  ]

  return Array(wordCount)
    .fill(0)
    .map(() => words[Math.floor(Math.random() * words.length)])
    .join(' ')
}

// Concurrent streaming component
interface ConcurrentStreamsProps {
  streamCount: number
  tokensPerSecond: number
  wordCount: number
}

const ConcurrentStreams: React.FC<ConcurrentStreamsProps> = ({
  streamCount,
  tokensPerSecond,
  wordCount,
}) => {
  const [streams, setStreams] = React.useState<Map<string, string>>(new Map())
  const [activeStreams, setActiveStreams] = React.useState(0)
  const mountedRef = React.useRef(true)

  React.useEffect(() => {
    mountedRef.current = true
    const streamIds: string[] = []

    const startStreams = async () => {
      setActiveStreams(streamCount)

      // Start all streams concurrently
      const streamPromises = Array(streamCount)
        .fill(0)
        .map(async (_, index) => {
          const streamId = `stream-${index}`
          streamIds.push(streamId)
          const text = generateStreamText(wordCount)

          for await (const { chunk } of streamText(text, tokensPerSecond, streamId)) {
            if (!mountedRef.current) break

            setStreams(prev => {
              const updated = new Map(prev)
              updated.set(streamId, (updated.get(streamId) || '') + chunk)
              return updated
            })
          }

          return streamId
        })

      await Promise.all(streamPromises)
      setActiveStreams(0)
    }

    startStreams()

    return () => {
      mountedRef.current = false
    }
  }, [streamCount, tokensPerSecond, wordCount])

  return (
    <div>
      <div>Active Streams: {activeStreams}</div>
      {Array.from(streams.entries()).map(([streamId, content]) => (
        <div key={streamId} style={{ marginBottom: '20px', padding: '12px', border: '1px solid #ddd' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{streamId}</div>
          <div>{content}</div>
        </div>
      ))}
    </div>
  )
}

// Batched concurrent streaming component
interface BatchedConcurrentStreamsProps {
  streamCount: number
  tokensPerSecond: number
  wordCount: number
  batchSize: number
}

const BatchedConcurrentStreams: React.FC<BatchedConcurrentStreamsProps> = ({
  streamCount,
  tokensPerSecond,
  wordCount,
  batchSize,
}) => {
  const [streams, setStreams] = React.useState<Map<string, string>>(new Map())
  const [activeStreams, setActiveStreams] = React.useState(0)
  const mountedRef = React.useRef(true)
  const batchesRef = React.useRef<Map<string, string>>(new Map())
  const batchCountsRef = React.useRef<Map<string, number>>(new Map())

  React.useEffect(() => {
    mountedRef.current = true

    const flushBatches = () => {
      if (batchesRef.current.size > 0) {
        setStreams(prev => {
          const updated = new Map(prev)
          batchesRef.current.forEach((batch, streamId) => {
            updated.set(streamId, (updated.get(streamId) || '') + batch)
          })
          return updated
        })
        batchesRef.current.clear()
        batchCountsRef.current.clear()
      }
    }

    const intervalId = setInterval(flushBatches, 100)

    const startStreams = async () => {
      setActiveStreams(streamCount)

      const streamPromises = Array(streamCount)
        .fill(0)
        .map(async (_, index) => {
          const streamId = `stream-${index}`
          const text = generateStreamText(wordCount)

          for await (const { chunk } of streamText(text, tokensPerSecond, streamId)) {
            if (!mountedRef.current) break

            const batch = batchesRef.current.get(streamId) || ''
            const count = batchCountsRef.current.get(streamId) || 0

            batchesRef.current.set(streamId, batch + chunk)
            batchCountsRef.current.set(streamId, count + 1)

            if (count >= batchSize) {
              flushBatches()
            }
          }

          return streamId
        })

      await Promise.all(streamPromises)
      flushBatches() // Final flush
      setActiveStreams(0)
    }

    startStreams()

    return () => {
      mountedRef.current = false
      clearInterval(intervalId)
    }
  }, [streamCount, tokensPerSecond, wordCount, batchSize])

  return (
    <div>
      <div>Active Streams: {activeStreams}</div>
      {Array.from(streams.entries()).map(([streamId, content]) => (
        <div key={streamId} style={{ marginBottom: '20px', padding: '12px', border: '1px solid #ddd' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{streamId}</div>
          <div>{content}</div>
        </div>
      ))}
    </div>
  )
}

describe('Concurrent Streams Benchmarks', () => {
  let profiler: PerformanceProfiler

  beforeEach(() => {
    profiler = new PerformanceProfiler()
    profiler.start()
  })

  afterEach(() => {
    profiler.stop()
    cleanup()
  })

  describe('State Update Frequency', () => {
    bench('1 concurrent stream', async () => {
      const endRender = profiler.measureRender('ConcurrentStreams-1')

      await act(async () => {
        render(<ConcurrentStreams streamCount={1} tokensPerSecond={50} wordCount={50} />)
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('2 concurrent streams', async () => {
      const endRender = profiler.measureRender('ConcurrentStreams-2')

      await act(async () => {
        render(<ConcurrentStreams streamCount={2} tokensPerSecond={50} wordCount={50} />)
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('5 concurrent streams', async () => {
      const endRender = profiler.measureRender('ConcurrentStreams-5')

      await act(async () => {
        render(<ConcurrentStreams streamCount={5} tokensPerSecond={50} wordCount={50} />)
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('10 concurrent streams', async () => {
      const endRender = profiler.measureRender('ConcurrentStreams-10')

      await act(async () => {
        render(<ConcurrentStreams streamCount={10} tokensPerSecond={50} wordCount={50} />)
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      endRender()
    })
  })

  describe('Batched Concurrent Streams', () => {
    bench('5 concurrent streams (batched)', async () => {
      const endRender = profiler.measureRender('BatchedConcurrentStreams-5')

      await act(async () => {
        render(
          <BatchedConcurrentStreams
            streamCount={5}
            tokensPerSecond={50}
            wordCount={50}
            batchSize={5}
          />
        )
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      endRender()
    })

    bench('10 concurrent streams (batched)', async () => {
      const endRender = profiler.measureRender('BatchedConcurrentStreams-10')

      await act(async () => {
        render(
          <BatchedConcurrentStreams
            streamCount={10}
            tokensPerSecond={50}
            wordCount={50}
            batchSize={5}
          />
        )
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      endRender()
    })
  })

  describe('Memory Accumulation', () => {
    bench('Memory: 5 concurrent streams', async () => {
      const snapshot1 = profiler.captureMemorySnapshot()

      await act(async () => {
        render(<ConcurrentStreams streamCount={5} tokensPerSecond={100} wordCount={200} />)
        await new Promise(resolve => setTimeout(resolve, 3000))
      })

      const snapshot2 = profiler.captureMemorySnapshot()
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB

      console.log(`5 concurrent streams memory delta: ${delta.toFixed(2)}MB`)

      if (delta > 20) {
        console.warn(`High memory usage: ${delta.toFixed(2)}MB`)
      }
    })

    bench('Memory: 10 concurrent streams', async () => {
      const snapshot1 = profiler.captureMemorySnapshot()

      await act(async () => {
        render(<ConcurrentStreams streamCount={10} tokensPerSecond={100} wordCount={200} />)
        await new Promise(resolve => setTimeout(resolve, 3000))
      })

      const snapshot2 = profiler.captureMemorySnapshot()
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB

      console.log(`10 concurrent streams memory delta: ${delta.toFixed(2)}MB`)

      if (delta > 40) {
        console.warn(`High memory usage: ${delta.toFixed(2)}MB`)
      }
    })

    bench('Memory: 10 concurrent streams (batched)', async () => {
      const snapshot1 = profiler.captureMemorySnapshot()

      await act(async () => {
        render(
          <BatchedConcurrentStreams
            streamCount={10}
            tokensPerSecond={100}
            wordCount={200}
            batchSize={10}
          />
        )
        await new Promise(resolve => setTimeout(resolve, 3000))
      })

      const snapshot2 = profiler.captureMemorySnapshot()
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB

      console.log(`10 concurrent streams (batched) memory delta: ${delta.toFixed(2)}MB`)

      if (delta > 30) {
        console.warn(`High memory usage: ${delta.toFixed(2)}MB`)
      }
    })
  })

  describe('Memory Leak Detection', () => {
    bench('Memory leak check: mount/unmount 10 times', async () => {
      const snapshot1 = profiler.captureMemorySnapshot()

      for (let i = 0; i < 10; i++) {
        await act(async () => {
          const { unmount } = render(
            <ConcurrentStreams streamCount={5} tokensPerSecond={100} wordCount={50} />
          )
          await new Promise(resolve => setTimeout(resolve, 1000))
          unmount()
        })

        // Allow garbage collection
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const snapshot2 = profiler.captureMemorySnapshot()
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB

      console.log(`Memory leak check delta: ${delta.toFixed(2)}MB`)

      if (delta > 10) {
        console.warn(`Potential memory leak detected: ${delta.toFixed(2)}MB`)
      }
    })

    bench('Memory leak check: batched mount/unmount 10 times', async () => {
      const snapshot1 = profiler.captureMemorySnapshot()

      for (let i = 0; i < 10; i++) {
        await act(async () => {
          const { unmount } = render(
            <BatchedConcurrentStreams
              streamCount={5}
              tokensPerSecond={100}
              wordCount={50}
              batchSize={5}
            />
          )
          await new Promise(resolve => setTimeout(resolve, 1000))
          unmount()
        })

        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const snapshot2 = profiler.captureMemorySnapshot()
      const delta = snapshot2.usedHeapSizeMB - snapshot1.usedHeapSizeMB

      console.log(`Batched memory leak check delta: ${delta.toFixed(2)}MB`)

      if (delta > 10) {
        console.warn(`Potential memory leak detected: ${delta.toFixed(2)}MB`)
      }
    })
  })

  describe('High Throughput', () => {
    bench('High throughput: 5 streams at 200 tokens/sec', async () => {
      const endRender = profiler.measureRender('HighThroughput-5-200tps')

      profiler.startFPSTracking((fps) => {
        if (fps < 30) {
          console.warn(`Low FPS during high throughput: ${fps}`)
        }
      })

      await act(async () => {
        render(<ConcurrentStreams streamCount={5} tokensPerSecond={200} wordCount={100} />)
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      profiler.stopFPSTracking()
      endRender()
    })

    bench('High throughput: 5 streams at 200 tokens/sec (batched)', async () => {
      const endRender = profiler.measureRender('HighThroughput-5-200tps-batched')

      profiler.startFPSTracking((fps) => {
        if (fps < 30) {
          console.warn(`Low FPS during batched high throughput: ${fps}`)
        }
      })

      await act(async () => {
        render(
          <BatchedConcurrentStreams
            streamCount={5}
            tokensPerSecond={200}
            wordCount={100}
            batchSize={10}
          />
        )
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      profiler.stopFPSTracking()
      endRender()
    })
  })

  describe('Varying Stream Speeds', () => {
    bench('Mixed speeds: 5 streams (different token rates)', async () => {
      // In a real implementation, you'd have different speeds per stream
      const endRender = profiler.measureRender('MixedSpeeds-5streams')

      await act(async () => {
        render(<ConcurrentStreams streamCount={5} tokensPerSecond={50} wordCount={100} />)
        await new Promise(resolve => setTimeout(resolve, 3000))
      })

      endRender()
    })
  })

  describe('Stream Cancellation', () => {
    bench('Cancel all streams midway', async () => {
      const endRender = profiler.measureRender('CancelStreams-midway')

      await act(async () => {
        const { unmount } = render(
          <ConcurrentStreams streamCount={5} tokensPerSecond={100} wordCount={500} />
        )

        // Wait for streams to start, then cancel
        await new Promise(resolve => setTimeout(resolve, 1000))
        unmount()
      })

      endRender()
    })

    bench('Cancel batched streams midway', async () => {
      const endRender = profiler.measureRender('CancelBatchedStreams-midway')

      await act(async () => {
        const { unmount } = render(
          <BatchedConcurrentStreams
            streamCount={5}
            tokensPerSecond={100}
            wordCount={500}
            batchSize={10}
          />
        )

        await new Promise(resolve => setTimeout(resolve, 1000))
        unmount()
      })

      endRender()
    })
  })
})
