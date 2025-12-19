// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
// Import directly from source to verify isolation from other modules in public-api
import { useChat as useHeadlessChat } from '../hooks/chat/use-chat-enhanced'

// Mock global fetch
global.fetch = vi.fn()

describe('Headless Chat Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useHeadlessChat({ api: '/api/chat' }))
    
    expect(result.current.messages).toEqual([])
    expect(result.current.input).toBe('')
    expect(result.current.isLoading).toBe(false)
  })

  it('should append a user message and handle loading state', async () => {
    // Mock successful stream response
    const mockStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        controller.enqueue(encoder.encode('Hello'))
        controller.close()
      }
    })
    
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      body: mockStream,
      headers: new Headers(),
    })

    const { result } = renderHook(() => useHeadlessChat({ api: '/api/chat' }))
    
    // Send a message
    await act(async () => {
      await result.current.append({ role: 'user', content: 'Hi' })
    })

    // Should be in loading state or finished
    expect(result.current.messages).toHaveLength(2) // User + Assistant placeholder
    expect(result.current.messages[0].content).toBe('Hi')
    expect(result.current.messages[0].role).toBe('user')
    expect(result.current.messages[1].role).toBe('assistant')
  })

  it('should handle API errors correctly', async () => {
    // Mock error response
    ;(global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    const { result } = renderHook(() => useHeadlessChat({ api: '/api/chat' }))
    
    // Send a message
    await act(async () => {
      try {
        await result.current.append({ role: 'user', content: 'Trigger Error' })
      } catch (e) {
        // Expected error
      }
    })

    // Should have error state
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeDefined()
    expect(result.current.error?.message).toContain('HTTP error')
  })
})
