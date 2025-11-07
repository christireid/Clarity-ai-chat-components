import * as React from 'react'
import { RequestBatcher, BatcherOptions, BatchResult } from '../utils/request-batcher'

export interface UseRequestBatcherOptions<T = any, R = any> extends Omit<BatcherOptions<T, R>, 'processor'> {
  /** Batch processor function */
  processor: (requests: T[]) => Promise<R[]>
  /** Enable batching (default: true) */
  enabled?: boolean
}

export interface UseRequestBatcherReturn<T = any, R = any> {
  /** Add request to batch */
  add: (data: T, options?: { priority?: number; tags?: string[] }) => Promise<R>
  /** Flush pending requests */
  flush: () => Promise<void>
  /** Clear queue */
  clear: () => void
  /** Batch statistics */
  stats: {
    totalRequests: number
    totalBatches: number
    averageBatchSize: number
    totalSavings: number
    queueSize: number
    pendingRequests: number
  }
  /** Whether batching is enabled */
  isEnabled: boolean
  /** Toggle batching */
  setEnabled: (enabled: boolean) => void
}

/**
 * Hook for request batching
 * 
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const batcher = useRequestBatcher({
 *     maxBatchSize: 5,
 *     maxWaitTime: 1000,
 *     processor: async (queries) => {
 *       // Process all queries in one API call
 *       const response = await fetch('/api/batch', {
 *         method: 'POST',
 *         body: JSON.stringify({ queries })
 *       })
 *       return response.json()
 *     },
 *     onBatchProcessed: (results) => {
 *       console.log(`Processed batch of ${results.length} requests`)
 *     }
 *   })
 * 
 *   const handleQuery = async (query: string) => {
 *     // Will be batched automatically
 *     const result = await batcher.add({ query })
 *     return result
 *   }
 * 
 *   return (
 *     <div>
 *       <div>Total Batches: {batcher.stats.totalBatches}</div>
 *       <div>Avg Batch Size: {batcher.stats.averageBatchSize.toFixed(1)}</div>
 *       <div>Queue Size: {batcher.stats.queueSize}</div>
 *       <button onClick={() => batcher.flush()}>Flush Now</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useRequestBatcher<T = any, R = any>(
  options: UseRequestBatcherOptions<T, R>
): UseRequestBatcherReturn<T, R> {
  const {
    processor,
    enabled: initialEnabled = true,
    ...batcherOptions
  } = options

  const [isEnabled, setIsEnabled] = React.useState(initialEnabled)
  const [stats, setStats] = React.useState({
    totalRequests: 0,
    totalBatches: 0,
    averageBatchSize: 0,
    totalSavings: 0,
    queueSize: 0,
    pendingRequests: 0,
  })

  // Wrap processor to extract data
  const wrappedProcessor = React.useCallback(
    async (requests: any[]) => {
      const data = requests.map(r => r.data)
      return processor(data)
    },
    [processor]
  )

  // Create batcher instance (memoized)
  const batcher = React.useMemo(
    () => new RequestBatcher<T, R>({
      ...batcherOptions,
      processor: wrappedProcessor,
      onBatchProcessed: (results) => {
        setStats(batcher.getStats())
        batcherOptions.onBatchProcessed?.(results)
      },
    }),
    [batcherOptions, wrappedProcessor]
  )

  // Update stats periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats(batcher.getStats())
    }, 1000)
    return () => clearInterval(interval)
  }, [batcher])

  const add = React.useCallback(
    async (data: T, opts?: { priority?: number; tags?: string[] }): Promise<R> => {
      if (!isEnabled) {
        // Bypass batching if disabled
        const result = await processor([data])
        return result[0]
      }
      return batcher.add(data, opts)
    },
    [batcher, processor, isEnabled]
  )

  const flush = React.useCallback(async () => {
    await batcher.flush()
    setStats(batcher.getStats())
  }, [batcher])

  const clear = React.useCallback(() => {
    batcher.clear()
    setStats(batcher.getStats())
  }, [batcher])

  return {
    add,
    flush,
    clear,
    stats,
    isEnabled,
    setEnabled: setIsEnabled,
  }
}
