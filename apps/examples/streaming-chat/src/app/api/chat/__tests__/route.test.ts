/**
 * API Route Tests for Streaming Chat
 *
 * These tests verify the /api/chat endpoint works correctly:
 * - Request validation
 * - SSE response format
 * - Streaming behavior
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock NextRequest
class MockNextRequest {
  private body: object

  constructor(body: object) {
    this.body = body
  }

  async json() {
    return this.body
  }
}

describe('Streaming Chat API Route', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  describe('Request Validation', () => {
    it('should return 400 if messages is missing', async () => {
      const { POST } = await import('../route')
      const req = new MockNextRequest({}) as unknown as Request

      const response = await POST(req as any)

      expect(response.status).toBe(400)
    })

    it('should return 400 if messages is not an array', async () => {
      const { POST } = await import('../route')
      const req = new MockNextRequest({
        messages: 'not-an-array',
      }) as unknown as Request

      const response = await POST(req as any)

      expect(response.status).toBe(400)
    })

    it('should accept valid request with messages array', async () => {
      const { POST } = await import('../route')
      const req = new MockNextRequest({
        messages: [{ role: 'user', content: 'Hello' }],
      }) as unknown as Request

      const response = await POST(req as any)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('text/event-stream')
    })
  })

  describe('SSE Response Format', () => {
    it('should return correct SSE headers', async () => {
      const { POST } = await import('../route')
      const req = new MockNextRequest({
        messages: [{ role: 'user', content: 'Hello' }],
      }) as unknown as Request

      const response = await POST(req as any)

      expect(response.headers.get('Content-Type')).toBe('text/event-stream')
      expect(response.headers.get('Cache-Control')).toBe('no-cache')
      expect(response.headers.get('Connection')).toBe('keep-alive')
    })

    it('should stream SSE formatted data', async () => {
      const { POST } = await import('../route')
      const req = new MockNextRequest({
        messages: [{ role: 'user', content: 'Test message' }],
      }) as unknown as Request

      const response = await POST(req as any)
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      // Read first chunk
      const { done, value } = await reader.read()

      expect(done).toBe(false)
      expect(value).toBeDefined()

      const chunk = decoder.decode(value)
      expect(chunk).toContain('data:')

      // Cancel the stream to clean up
      await reader.cancel()
    })

    it('should send DONE signal at end of stream', async () => {
      const { POST } = await import('../route')
      const req = new MockNextRequest({
        messages: [{ role: 'user', content: 'Test' }],
      }) as unknown as Request

      const response = await POST(req as any)
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      // Read all chunks until done
      let fullContent = ''
      let isDone = false

      while (!isDone) {
        const { done, value } = await reader.read()
        if (done) {
          isDone = true
        } else {
          fullContent += decoder.decode(value, { stream: true })
        }
      }

      expect(fullContent).toContain('[DONE]')
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid JSON gracefully', async () => {
      const req = {
        json: () => Promise.reject(new Error('Invalid JSON')),
      } as unknown as Request

      const { POST } = await import('../route')
      const response = await POST(req as any)

      expect(response.status).toBe(500)
    })
  })
})
