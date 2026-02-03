/**
 * Security Tests for RAG Optimized Library
 *
 * Ensures API keys and sensitive data are not exposed in error logs
 */

import { hybridSearch } from '@/lib/ai/ragOptimized'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('RAGOptimized Security', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should not log API keys in semantic search errors', async () => {
    // Set a fake API key that should never appear in logs
    const originalKey = process.env.OPENAI_API_KEY
    process.env.OPENAI_API_KEY = 'sk-secret-openai-key-99999'

    try {
      // Trigger semantic search which might error
      await hybridSearch('test query', { topK: 5 })
    } catch {
      // Ignore errors - we're testing logging behavior
    }

    // Check all console.error calls
    const errorCalls = consoleSpy.mock.calls
    for (const call of errorCalls) {
      const callString = JSON.stringify(call)
      expect(callString).not.toContain('sk-secret')
      expect(callString).not.toContain('99999')
      expect(callString).not.toContain('openai')
    }

    // Restore original key
    if (originalKey) {
      process.env.OPENAI_API_KEY = originalKey
    } else {
      delete process.env.OPENAI_API_KEY
    }
  })

  it('should only log errorType and timestamp in semantic search errors', async () => {
    try {
      await hybridSearch('test query', { topK: 5 })
    } catch {
      // Ignore errors
    }

    // If there were any errors logged from semantic search, verify format
    const errorCalls = consoleSpy.mock.calls.filter((call: unknown[]) =>
      (call[0] as string | undefined)?.includes?.('Semantic search error')
    )

    for (const call of errorCalls) {
      const args = call.slice(1) // Skip the message prefix
      for (const arg of args) {
        if (typeof arg === 'object' && arg !== null) {
          // Should have errorType and timestamp
          if (arg.errorType || arg.timestamp) {
            expect(arg).toHaveProperty('timestamp')
            expect(typeof arg.timestamp).toBe('string')

            // Should NOT have sensitive fields
            expect(arg).not.toHaveProperty('message')
            expect(arg).not.toHaveProperty('stack')
            expect(arg).not.toHaveProperty('apiKey')
          }
        }
      }
    }
  })
})
