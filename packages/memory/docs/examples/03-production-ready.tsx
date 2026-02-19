/**
 * Example 3: Complete Template
 *
 * Demonstrates production-grade implementation with:
 * - Configuration presets for production
 * - Comprehensive error handling with typed errors
 * - Performance monitoring
 * - Graceful degradation
 * - Logging and alerting
 */

import { clarityMemory, createConfig } from '@clarity-chat/memory'
import {
  MemoryError,
  MemoryConsentError,
  MemoryOperationError,
  MemoryQueryError,
} from '@clarity-chat/memory'
import { OpenAIEmbeddings } from '@langchain/openai'

// Production configuration with presets
function createProductionMemory() {
  return clarityMemory(
    createConfig('production', 'chatbot', {
      // Custom overrides
      embeddingProvider: new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'text-embedding-3-small',
      }),
      monitoring: {
        enabled: true,
        logLevel: 'info',
      },
      errorReporting: {
        enabled: true,
        reportToSentry: true,
      },
    })
  )
}

// Error handling wrapper with retry logic
class MemoryService {
  private memory = createProductionMemory()
  private maxRetries = 3
  private retryDelay = 1000 // ms

  async addWithRetry(
    content: string,
    options: any,
    retryCount = 0
  ): Promise<any> {
    try {
      return await this.memory.add(content, options)
    } catch (error) {
      if (error instanceof MemoryConsentError) {
        // Don't retry consent errors
        console.error('Consent required:', error.userId)
        throw error
      }

      if (error instanceof MemoryOperationError) {
        // Retry transient operation errors
        if (retryCount < this.maxRetries) {
          await this.delay(this.retryDelay * Math.pow(2, retryCount))
          return this.addWithRetry(content, options, retryCount + 1)
        }
      }

      // Log and report error
      this.reportError(error, 'addMemory', { content, options })
      throw error
    }
  }

  async queryWithFallback(query: string, options: any): Promise<any[]> {
    try {
      // Try semantic search first
      return await this.memory.query(query, {
        ...options,
        useSemanticSearch: true,
      })
    } catch (error) {
      if (error instanceof MemoryQueryError) {
        console.warn('Semantic search failed, falling back to keyword search')

        // Fallback to keyword search
        return await this.memory.query(query, {
          ...options,
          useSemanticSearch: false,
        })
      }

      this.reportError(error, 'queryMemory', { query, options })
      throw error
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private reportError(error: any, operation: string, context: any) {
    // Log to console
    console.error(`[MemoryService] ${operation} failed:`, error)

    // Send to error tracking service
    if (typeof Sentry !== 'undefined') {
      Sentry.captureException(error, {
        tags: {
          component: 'memory-service',
          operation,
        },
        contexts: {
          memory: context,
        },
      })
    }

    // Send metrics
    if (typeof metrics !== 'undefined') {
      metrics.increment('memory.error', {
        operation,
        error_type: error.constructor.name,
      })
    }
  }
}

// Performance monitoring
class MemoryMonitor {
  private metrics = new Map<string, number[]>()

  async measure<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()

    try {
      const result = await fn()
      const duration = performance.now() - start

      this.recordMetric(operation, duration, 'success')

      return result
    } catch (error) {
      const duration = performance.now() - start

      this.recordMetric(operation, duration, 'error')

      throw error
    }
  }

  private recordMetric(
    operation: string,
    duration: number,
    status: 'success' | 'error'
  ) {
    // Record locally
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, [])
    }
    this.metrics.get(operation)!.push(duration)

    // Log slow operations
    if (duration > 1000) {
      console.warn(`⚠️ Slow operation: ${operation} took ${duration}ms`)
    }

    // Send to monitoring service
    if (typeof metrics !== 'undefined') {
      metrics.histogram('memory.operation.duration', duration, {
        operation,
        status,
      })
    }
  }

  getStats(operation: string) {
    const times = this.metrics.get(operation) || []
    if (times.length === 0) return null

    const sorted = [...times].sort((a, b) => a - b)

    return {
      count: times.length,
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      p50: sorted[Math.floor(times.length * 0.5)],
      p95: sorted[Math.floor(times.length * 0.95)],
      p99: sorted[Math.floor(times.length * 0.99)],
    }
  }
}

// Production React Component
import React, { useState, useEffect, useCallback } from 'react'
import { useMemoryService } from '@clarity-chat/memory'

export function ProductionChatComponent({ userId }: { userId: string }) {
  const memory = useMemoryService()
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const memoryService = new MemoryService()
  const monitor = new MemoryMonitor()

  // Load messages with error handling
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const results = await monitor.measure('loadMessages', () =>
        memoryService.queryWithFallback('', {
          filters: {
            type: 'episodic',
            scope: 'thread',
            metadata: { userId },
          },
          limit: 50,
        })
      )

      setMessages(results)
    } catch (err) {
      setError(err as Error)
      console.error('Failed to load messages:', err)

      // Show user-friendly error message
      if (err instanceof MemoryConsentError) {
        alert('Please grant consent to view conversation history')
      } else {
        alert('Failed to load messages. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Send message with error handling
  const handleSend = useCallback(async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('') // Optimistic update

    try {
      // Store user message
      await monitor.measure('addMessage', () =>
        memoryService.addWithRetry(userMessage, {
          type: 'episodic',
          scope: 'thread',
          metadata: {
            userId,
            threadId: 'thread_123',
            role: 'user',
          },
        })
      )

      // Reload messages
      await loadMessages()
    } catch (err) {
      // Revert optimistic update
      setInput(userMessage)
      setError(err as Error)

      console.error('Failed to send message:', err)

      if (err instanceof MemoryConsentError) {
        alert(
          'Please grant consent to send messages. Check your privacy settings.'
        )
      } else if (err instanceof MemoryOperationError) {
        alert(
          'Failed to send message. Please check your connection and try again.'
        )
      } else {
        alert('An unexpected error occurred. Please try again.')
      }
    }
  }, [input, userId])

  // Load messages on mount
  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Monitor memory usage
  useEffect(() => {
    const interval = setInterval(async () => {
      const stats = await memory.getStats()

      // Alert if approaching limits
      if (stats.totalTokens / stats.maxTotalTokens > 0.9) {
        console.warn('⚠️ Memory usage approaching limit:', {
          current: stats.totalTokens,
          max: stats.maxTotalTokens,
        })
      }

      // Send metrics
      if (typeof metrics !== 'undefined') {
        metrics.gauge('memory.count', stats.totalMemories)
        metrics.gauge('memory.tokens', stats.totalTokens)
        metrics.gauge(
          'memory.usage_percent',
          (stats.totalTokens / stats.maxTotalTokens) * 100
        )
      }
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [memory])

  if (loading && messages.length === 0) {
    return <div>Loading conversation...</div>
  }

  return (
    <div>
      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error.message}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.metadata.role}`}>
            <strong>{msg.metadata.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

// Health check endpoint for monitoring
export async function memoryHealthCheck() {
  const memory = createProductionMemory()

  try {
    // Test basic operations
    const testMemory = await memory.add('Health check test', {
      type: 'working',
      scope: 'session',
      metadata: { healthCheck: true },
    })

    await memory.query('health', { limit: 1 })
    await memory.deleteMemory(testMemory.id)

    const stats = await memory.getStats()

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      stats: {
        totalMemories: stats.totalMemories,
        tokenUsage: `${stats.totalTokens} / ${stats.maxTotalTokens}`,
        cacheHitRate: stats.cacheHitRate,
      },
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Run example
if (require.main === module) {
  memoryHealthCheck()
    .then((result) => console.log('Health check:', result))
    .catch(console.error)
}
