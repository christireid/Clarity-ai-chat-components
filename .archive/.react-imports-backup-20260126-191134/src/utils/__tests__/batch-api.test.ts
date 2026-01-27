/**
 * Tests for BatchRequestManager and batch API utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  BatchRequestManager,
  estimateBatchSavings,
  shouldUseBatch,
  createOpenAIBatchFile,
  createAnthropicBatchFile,
  parseOpenAIBatchResults,
  type BatchRequest,
  type BatchMessage,
  type BatchJob,
} from '../batch-api'

// Mock the estimator
vi.mock('../tokenization/estimator', () => ({
  estimateTokens: vi.fn((text: string) => Math.ceil(text.length / 4)),
}))

describe('BatchRequestManager', () => {
  let manager: BatchRequestManager
  let onProgress: ReturnType<typeof vi.fn>
  let onStatusChange: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    onProgress = vi.fn()
    onStatusChange = vi.fn()

    manager = new BatchRequestManager({
      provider: 'openai',
      maxBatchSize: 5,
      maxWaitTime: 1000,
      onProgress,
      onStatusChange,
    })
  })

  afterEach(() => {
    manager.destroy()
    vi.useRealTimers()
  })

  describe('addRequest', () => {
    it('should add request to queue', async () => {
      const request: BatchRequest = {
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      }

      manager.enqueueRequest(request)

      expect(manager.getQueueSize()).toBe(1)
    })

    it('should auto-submit when maxBatchSize reached', async () => {
      const promises: Promise<unknown>[] = []

      // Add maxBatchSize requests
      for (let i = 0; i < 5; i++) {
        promises.push(
          manager.addRequest({
            id: `req${i}`,
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Hello' }],
            priority: 'normal',
          })
        )
      }

      // Should have triggered submitBatch
      expect(onStatusChange).toHaveBeenCalled()
      expect(manager.getQueueSize()).toBe(0) // Queue cleared after submit

      // Wait for batch processing
      await vi.runAllTimersAsync()
    })

    it('should resolve promise when batch completes', async () => {
      const resultPromise = manager.addRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      // Trigger batch
      await manager.submitBatch()
      await vi.runAllTimersAsync()

      const result = await resultPromise
      expect(result.success).toBe(true)
      expect(result.requestId).toBe('req1')
    })
  })

  describe('submitBatch', () => {
    it('should return null for empty queue', async () => {
      const job = await manager.submitBatch()
      expect(job).toBeNull()
    })

    it('should create job with correct properties', async () => {
      manager.enqueueRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      const job = await manager.submitBatch()

      expect(job).not.toBeNull()
      expect(job!.provider).toBe('openai')
      expect(job!.requestIds).toContain('req1')
      expect(job!.status).toBe('pending')
    })

    it('should call onStatusChange with job updates', async () => {
      manager.enqueueRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      await manager.submitBatch()
      await vi.runAllTimersAsync()

      expect(onStatusChange).toHaveBeenCalled()
      const lastCall =
        onStatusChange.mock.calls[onStatusChange.mock.calls.length - 1][0]
      expect(lastCall.status).toBe('completed')
    })

    it('should call onProgress during processing', async () => {
      for (let i = 0; i < 3; i++) {
        manager.enqueueRequest({
          id: `req${i}`,
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Hello' }],
          priority: 'normal',
        })
      }

      await manager.submitBatch()
      await vi.runAllTimersAsync()

      expect(onProgress).toHaveBeenCalled()
      expect(onProgress).toHaveBeenCalledWith(3, 3) // Final call
    })
  })

  describe('getBatchStatus', () => {
    it('should return undefined for unknown job', () => {
      expect(manager.getBatchStatus('unknown')).toBeUndefined()
    })

    it('should return job status', async () => {
      manager.enqueueRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      const job = await manager.submitBatch()
      await vi.runAllTimersAsync()

      const status = manager.getBatchStatus(job!.id)
      expect(status).toBeDefined()
      expect(status!.status).toBe('completed')
    })
  })

  describe('cancelBatch', () => {
    it('should return false for unknown job', async () => {
      const result = await manager.cancelBatch('unknown')
      expect(result).toBe(false)
    })

    it('should cancel pending job', async () => {
      manager.addRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      const job = await manager.submitBatch()

      const result = await manager.cancelBatch(job!.id)
      expect(result).toBe(true)

      const status = manager.getBatchStatus(job!.id)
      expect(status!.status).toBe('cancelled')
    })

    it('should reject pending promises on cancel', async () => {
      const promise = manager.addRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      const job = await manager.submitBatch()
      await manager.cancelBatch(job!.id)

      await expect(promise).rejects.toThrow('Batch cancelled')
    })
  })

  describe('getResults', () => {
    it('should return undefined for unknown job', () => {
      expect(manager.getResults('unknown')).toBeUndefined()
    })

    it('should return results after completion', async () => {
      manager.enqueueRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      const job = await manager.submitBatch()
      await vi.runAllTimersAsync()

      const results = manager.getResults(job!.id)
      expect(results).toBeDefined()
      expect(results!.length).toBe(1)
      expect(results![0].requestId).toBe('req1')
    })
  })

  describe('getStats', () => {
    it('should return initial empty stats', () => {
      const stats = manager.getStats()

      expect(stats.totalBatched).toBe(0)
      expect(stats.totalCompleted).toBe(0)
      expect(stats.totalFailed).toBe(0)
    })

    it('should update stats after batch completion', async () => {
      for (let i = 0; i < 3; i++) {
        manager.enqueueRequest({
          id: `req${i}`,
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Hello' }],
          priority: 'normal',
        })
      }

      await manager.submitBatch()
      await vi.runAllTimersAsync()

      const stats = manager.getStats()
      expect(stats.totalBatched).toBe(3)
      expect(stats.totalCompleted).toBe(3)
    })
  })

  describe('flush', () => {
    it('should submit current queue immediately', async () => {
      manager.enqueueRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      const job = await manager.flush()

      expect(job).not.toBeNull()
      expect(manager.getQueueSize()).toBe(0)
    })
  })

  describe('clearQueue', () => {
    it('should clear queue and reject pending promises', async () => {
      const promise = manager.addRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      manager.clearQueue()

      expect(manager.getQueueSize()).toBe(0)
      await expect(promise).rejects.toThrow('Queue cleared')
    })
  })

  describe('destroy', () => {
    it('should clean up all resources', async () => {
      manager.enqueueRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      const job = await manager.submitBatch()
      await vi.runAllTimersAsync()

      manager.destroy()

      expect(manager.getQueueSize()).toBe(0)
      expect(manager.getBatchStatus(job!.id)).toBeUndefined()
    })
  })

  describe('auto-submit timer', () => {
    it('should auto-submit after maxWaitTime', async () => {
      manager.enqueueRequest({
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      })

      expect(manager.getQueueSize()).toBe(1)

      // Advance timer past maxWaitTime
      await vi.advanceTimersByTimeAsync(1100)

      expect(manager.getQueueSize()).toBe(0)
      expect(onStatusChange).toHaveBeenCalled()
    })
  })
})

describe('estimateBatchSavings', () => {
  it('should return zero savings for empty requests', () => {
    const estimate = estimateBatchSavings([])

    expect(estimate.regularCost).toBe(0)
    expect(estimate.batchCost).toBe(0)
    expect(estimate.savings).toBe(0)
  })

  it('should calculate 50% savings', () => {
    const requests: Array<{ messages: BatchMessage[]; model?: string }> = [
      {
        messages: [{ role: 'user', content: 'Hello World!' }],
        model: 'gpt-4o-mini',
      },
    ]

    const estimate = estimateBatchSavings(requests)

    expect(estimate.savingsPercent).toBe(50)
    expect(estimate.savings).toBeCloseTo(estimate.regularCost / 2)
  })

  it('should use default model pricing if model not specified', () => {
    const requests = [
      { messages: [{ role: 'user' as const, content: 'Hello' }] },
    ]

    const estimate = estimateBatchSavings(requests)

    expect(estimate.regularCost).toBeGreaterThan(0)
  })
})

describe('shouldUseBatch', () => {
  it('should not recommend batch for high urgency', () => {
    const result = shouldUseBatch(
      { messages: [{ role: 'user', content: 'Hello' }] },
      { urgency: 'high' }
    )

    expect(result.useBatch).toBe(false)
    expect(result.reason).toContain('high urgency')
  })

  it('should not recommend batch for small requests', () => {
    const result = shouldUseBatch(
      { messages: [{ role: 'user', content: 'Hi' }] }, // Very small
      { urgency: 'low' }
    )

    expect(result.useBatch).toBe(false)
    expect(result.reason).toContain('too small')
  })

  it('should recommend batch for low urgency, large requests', () => {
    const result = shouldUseBatch(
      { messages: [{ role: 'user', content: 'A'.repeat(1000) }] },
      { urgency: 'low' }
    )

    expect(result.useBatch).toBe(true)
    expect(result.reason).toContain('recommended')
  })

  it('should not recommend batch if wait time unacceptable', () => {
    const result = shouldUseBatch(
      { messages: [{ role: 'user', content: 'A'.repeat(1000) }] },
      { maxWaitAcceptable: 60000 } // 1 minute (less than 1 hour)
    )

    expect(result.useBatch).toBe(false)
    expect(result.reason).toContain('Wait time')
  })
})

describe('createOpenAIBatchFile', () => {
  it('should create valid JSONL format', () => {
    const requests: BatchRequest[] = [
      {
        id: 'req1',
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      },
      {
        id: 'req2',
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are helpful' },
          { role: 'user', content: 'Hi' },
        ],
        priority: 'normal',
        options: { maxTokens: 100, temperature: 0.7 },
      },
    ]

    const jsonl = createOpenAIBatchFile(requests)
    const lines = jsonl.split('\n')

    expect(lines.length).toBe(2)

    const parsed1 = JSON.parse(lines[0])
    expect(parsed1.custom_id).toBe('req1')
    expect(parsed1.method).toBe('POST')
    expect(parsed1.url).toBe('/v1/chat/completions')
    expect(parsed1.body.model).toBe('gpt-4o-mini')
    expect(parsed1.body.messages).toHaveLength(1)

    const parsed2 = JSON.parse(lines[1])
    expect(parsed2.body.max_tokens).toBe(100)
    expect(parsed2.body.temperature).toBe(0.7)
  })
})

describe('createAnthropicBatchFile', () => {
  it('should create valid batch format', () => {
    const requests: BatchRequest[] = [
      {
        id: 'req1',
        model: 'claude-3-5-haiku',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
      },
    ]

    const batch = createAnthropicBatchFile(requests)

    expect(batch).toHaveLength(1)
    expect(batch[0].custom_id).toBe('req1')
    expect(batch[0].params.model).toBe('claude-3-5-haiku')
    expect(batch[0].params.max_tokens).toBe(1024) // Default
  })

  it('should use custom max_tokens if provided', () => {
    const requests: BatchRequest[] = [
      {
        id: 'req1',
        model: 'claude-3-5-haiku',
        messages: [{ role: 'user', content: 'Hello' }],
        priority: 'normal',
        options: { maxTokens: 500 },
      },
    ]

    const batch = createAnthropicBatchFile(requests)

    expect(batch[0].params.max_tokens).toBe(500)
  })
})

describe('parseOpenAIBatchResults', () => {
  it('should parse successful results', () => {
    const jsonl = `{"custom_id":"req1","response":{"body":{"choices":[{"message":{"content":"Hello!"}}],"usage":{"prompt_tokens":10,"completion_tokens":5}}}}`

    const results = parseOpenAIBatchResults(jsonl)

    expect(results).toHaveLength(1)
    expect(results[0].requestId).toBe('req1')
    expect(results[0].success).toBe(true)
    expect(results[0].content).toBe('Hello!')
    expect(results[0].usage?.inputTokens).toBe(10)
    expect(results[0].usage?.outputTokens).toBe(5)
  })

  it('should parse error results', () => {
    const jsonl = `{"custom_id":"req1","error":{"message":"Rate limit exceeded"}}`

    const results = parseOpenAIBatchResults(jsonl)

    expect(results).toHaveLength(1)
    expect(results[0].requestId).toBe('req1')
    expect(results[0].success).toBe(false)
    expect(results[0].error).toBe('Rate limit exceeded')
  })

  it('should handle multiple lines', () => {
    const jsonl = `{"custom_id":"req1","response":{"body":{"choices":[{"message":{"content":"One"}}]}}}
{"custom_id":"req2","response":{"body":{"choices":[{"message":{"content":"Two"}}]}}}`

    const results = parseOpenAIBatchResults(jsonl)

    expect(results).toHaveLength(2)
    expect(results[0].content).toBe('One')
    expect(results[1].content).toBe('Two')
  })

  it('should handle invalid JSON gracefully', () => {
    const jsonl = `not valid json`

    const results = parseOpenAIBatchResults(jsonl)

    expect(results).toHaveLength(1)
    expect(results[0].success).toBe(false)
    expect(results[0].error).toBe('Failed to parse result')
  })

  it('should skip empty lines', () => {
    const jsonl = `{"custom_id":"req1","response":{"body":{"choices":[{"message":{"content":"Hello"}}]}}}

{"custom_id":"req2","response":{"body":{"choices":[{"message":{"content":"World"}}]}}}`

    const results = parseOpenAIBatchResults(jsonl)

    expect(results).toHaveLength(2)
  })
})
