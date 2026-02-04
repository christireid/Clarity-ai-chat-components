/**
 * Request Queue with Rate Limiting Support
 *
 * Manages API requests with automatic queuing, retry, and rate limit handling.
 * Provides fair resource allocation and user feedback during queue delays.
 */

import { logger } from '@clarity-chat/utils/logger'

export interface QueuedRequest<T = any> {
  id: string
  priority: 'high' | 'normal' | 'low'
  createdAt: number
  retryCount: number
  maxRetries: number
  request: () => Promise<T>
  onSuccess?: (result: T) => void
  onError?: (error: Error) => void
  onQueueUpdate?: (position: number, estimatedWaitMs: number) => void
}

export interface QueueConfig {
  maxConcurrent: number
  maxQueueSize: number
  retryDelayMs: number
  maxRetries: number
  rateLimitCheck?: () => Promise<{ allowed: boolean; resetAt: number }>
  onQueueFull?: (request: QueuedRequest) => void
  onRateLimited?: (request: QueuedRequest, resetAt: number) => void
}

export class RequestQueue {
  private queue: QueuedRequest[] = []
  private activeRequests = new Set<string>()
  private config: QueueConfig
  private processing = false

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = {
      maxConcurrent: 3,
      maxQueueSize: 50,
      retryDelayMs: 1000,
      maxRetries: 3,
      ...config,
    }
  }

  /**
   * Add request to queue
   */
  async enqueue<T>(
    request: () => Promise<T>,
    options: {
      priority?: 'high' | 'normal' | 'low'
      maxRetries?: number
      onSuccess?: (result: T) => void
      onError?: (error: Error) => void
      onQueueUpdate?: (position: number, estimatedWaitMs: number) => void
    } = {}
  ): Promise<T> {
    const {
      priority = 'normal',
      maxRetries = this.config.maxRetries,
      ...callbacks
    } = options

    return new Promise<T>((resolve, reject) => {
      const queuedRequest: QueuedRequest<T> = {
        id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        priority,
        createdAt: Date.now(),
        retryCount: 0,
        maxRetries,
        request,
        onSuccess: (result) => {
          callbacks.onSuccess?.(result)
          resolve(result)
        },
        onError: (error) => {
          callbacks.onError?.(error)
          reject(error)
        },
        onQueueUpdate: callbacks.onQueueUpdate,
      }

      // Check queue size limit
      if (this.queue.length >= this.config.maxQueueSize) {
        this.config.onQueueFull?.(queuedRequest)
        reject(new Error('Request queue is full'))
        return
      }

      // Add to queue with priority ordering
      this.addToQueue(queuedRequest)
      this.notifyQueueUpdate(queuedRequest)

      // Start processing if not already running
      if (!this.processing) {
        this.processQueue()
      }
    })
  }

  /**
   * Cancel a queued request
   */
  cancel(requestId: string): boolean {
    const index = this.queue.findIndex((req) => req.id === requestId)
    if (index === -1) return false

    this.queue.splice(index, 1)
    return true
  }

  /**
   * Clear all queued requests
   */
  clear(): void {
    this.queue = []
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      activeCount: this.activeRequests.size,
      maxConcurrent: this.config.maxConcurrent,
      maxQueueSize: this.config.maxQueueSize,
    }
  }

  /**
   * Get estimated wait time for a request
   */
  private getEstimatedWaitTime(request: QueuedRequest): number {
    const position = this.queue.indexOf(request)
    if (position === -1) return 0

    // Estimate based on current active requests and position
    const activeCount = this.activeRequests.size
    const availableSlots = Math.max(0, this.config.maxConcurrent - activeCount)

    // Time for current batch to complete
    const currentBatchTime = availableSlots > 0 ? 0 : 5000 // Assume 5s per request

    // Time for queued requests ahead
    const aheadCount = position
    const aheadTime = aheadCount * 2000 // Assume 2s per queued request

    return currentBatchTime + aheadTime
  }

  /**
   * Add request to queue with priority ordering
   */
  private addToQueue(request: QueuedRequest): void {
    // Priority weights
    const priorityWeight = { high: 3, normal: 2, low: 1 }
    const requestWeight = priorityWeight[request.priority]

    // Find insertion point
    let insertIndex = this.queue.length
    for (let i = 0; i < this.queue.length; i++) {
      const existingWeight = priorityWeight[this.queue[i].priority]
      if (
        requestWeight > existingWeight ||
        (requestWeight === existingWeight &&
          request.createdAt < this.queue[i].createdAt)
      ) {
        insertIndex = i
        break
      }
    }

    this.queue.splice(insertIndex, 0, request)
  }

  /**
   * Process the queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing) return
    this.processing = true

    try {
      while (
        this.queue.length > 0 &&
        this.activeRequests.size < this.config.maxConcurrent
      ) {
        const request = this.queue.shift()
        if (!request) break

        this.activeRequests.add(request.id)
        this.notifyQueueUpdate(request)

        try {
          // Check rate limit if configured
          if (this.config.rateLimitCheck) {
            const rateLimit = await this.config.rateLimitCheck()
            if (!rateLimit.allowed) {
              // Re-queue with delay
              this.config.onRateLimited?.(request, rateLimit.resetAt)
              setTimeout(() => {
                if (request.retryCount < request.maxRetries) {
                  request.retryCount++
                  this.addToQueue(request)
                  this.processQueue()
                } else {
                  request.onError?.(
                    new Error('Rate limit exceeded and max retries reached')
                  )
                }
              }, rateLimit.resetAt - Date.now())
              continue
            }
          }

          const result = await request.request()
          request.onSuccess?.(result)
        } catch (error) {
          if (request.retryCount < request.maxRetries) {
            // Re-queue with exponential backoff
            request.retryCount++
            const delay =
              this.config.retryDelayMs * Math.pow(2, request.retryCount - 1)
            setTimeout(() => {
              this.addToQueue(request)
              this.processQueue()
            }, delay)
          } else {
            request.onError?.(error as Error)
          }
        } finally {
          this.activeRequests.delete(request.id)
        }
      }
    } finally {
      this.processing = false

      // Continue processing if there are more requests
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 100)
      }
    }
  }

  /**
   * Notify request of queue position update
   */
  private notifyQueueUpdate(request: QueuedRequest): void {
    const position = this.queue.indexOf(request)
    if (position === -1) return // Request is being processed

    const estimatedWaitMs = this.getEstimatedWaitTime(request)
    request.onQueueUpdate?.(position + 1, estimatedWaitMs) // +1 for 1-based indexing
  }
}

/**
 * React hook for request queue with rate limiting
 */
export function useRequestQueue(config: Partial<QueueConfig> = {}) {
  const queueRef = React.useRef<RequestQueue | null>(null)

  if (!queueRef.current) {
    queueRef.current = new RequestQueue(config)
  }

  return {
    enqueue: <T>(
      request: () => Promise<T>,
      options?: {
        priority?: 'high' | 'normal' | 'low'
        maxRetries?: number
        onSuccess?: (result: T) => void
        onError?: (error: Error) => void
        onQueueUpdate?: (position: number, estimatedWaitMs: number) => void
      }
    ) => queueRef.current!.enqueue(request, options),

    cancel: (requestId: string) => queueRef.current!.cancel(requestId),
    clear: () => queueRef.current!.clear(),
    getStatus: () => queueRef.current!.getStatus(),
  }
}

// Import React for the hook
import * as React from 'react'
