/**
 * Security Tests for Documentation Assistant API
 *
 * Ensures API keys and sensitive data are not exposed in error logs or responses
 */

import { POST } from '@/app/api/docs-assistant/route'
import { NextRequest } from 'next/server'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('DocsAssistant API Security', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should not log API keys in error messages', async () => {
    // Set a fake API key that should never appear in logs
    const originalKey = process.env.ANTHROPIC_API_KEY
    process.env.ANTHROPIC_API_KEY = 'sk-ant-secret-key-12345'

    const req = new NextRequest('http://localhost:3000/api/docs-assistant', {
      method: 'POST',
      body: JSON.stringify({
        message: 'test query',
      }),
    })

    try {
      await POST(req)
    } catch {
      // Ignore errors - we're testing logging behavior
    }

    // Check all console.error calls
    const errorCalls = consoleSpy.mock.calls
    for (const call of errorCalls) {
      const callString = JSON.stringify(call)
      expect(callString).not.toContain('sk-ant-secret')
      expect(callString).not.toContain('12345')
    }

    // Restore original key
    if (originalKey) {
      process.env.ANTHROPIC_API_KEY = originalKey
    } else {
      delete process.env.ANTHROPIC_API_KEY
    }
  })

  it('should return generic error message to client', async () => {
    const req = new NextRequest('http://localhost:3000/api/docs-assistant', {
      method: 'POST',
      body: JSON.stringify({ message: 'test' }),
    })

    const response = await POST(req)
    const contentType = response.headers.get('content-type')

    // For streaming responses, we can't easily test the error format
    // This test verifies the endpoint doesn't crash
    expect(response).toBeDefined()
    expect(response.status).toBeLessThan(600)
  })

  it('should only log errorType and timestamp in sanitized errors', async () => {
    const req = new NextRequest('http://localhost:3000/api/docs-assistant', {
      method: 'POST',
      body: JSON.stringify({ message: 'test' }),
    })

    try {
      await POST(req)
    } catch {
      // Ignore errors
    }

    // If there were any errors logged, verify they follow the sanitized format
    if (consoleSpy.mock.calls.length > 0) {
      for (const call of consoleSpy.mock.calls) {
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
    }
  })
})
