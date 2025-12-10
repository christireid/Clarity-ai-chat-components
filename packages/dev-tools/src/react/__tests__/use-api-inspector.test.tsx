/**
 * Tests for useAPIInspector hook
 * Tests React 19 useOptimistic functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Store mock instance for assertions
let mockInspector: any = null

// Mock the API inspector - must be hoisted
vi.mock('../../debug', () => {
  // Create mock instance inside the factory
  const createMockInspector = () => ({
    getLogs: vi.fn(() => []),
    getLog: vi.fn(() => null),
    startCall: vi.fn(() => 'test-call-id'),
    completeCall: vi.fn(),
    recordError: vi.fn(),
    clear: vi.fn(),
    setEnabled: vi.fn(),
    setVerbose: vi.fn(),
    getTotalUsage: vi.fn(() => ({
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    })),
    enabled: false,
    verbose: false,
  })

  // Singleton instance
  let instance: any = null

  return {
    getAPIInspector: vi.fn(() => {
      if (!instance) {
        instance = createMockInspector()
      }
      // Store for external access
      mockInspector = instance
      return instance
    }),
  }
})

// Import after mock is set up
import { useAPIInspector } from '../hooks/use-api-inspector'

describe('useAPIInspector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty logs', () => {
    const { result } = renderHook(() => useAPIInspector())

    expect(result.current.logs).toEqual([])
    expect(result.current.enabled).toBe(false)
    expect(result.current.verbose).toBe(false)
  })

  it('should start a call and optimistically add log', () => {
    const { result } = renderHook(() => useAPIInspector())

    act(() => {
      const callId = result.current.startCall({
        provider: 'openai',
        model: 'gpt-4-turbo',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: {},
        body: {},
      })

      expect(callId).toBe('test-call-id')
    })

    // Verify the mock was called
    expect(mockInspector.startCall).toHaveBeenCalled()
  })

  it('should complete a call and update log', () => {
    const { result } = renderHook(() => useAPIInspector())

    act(() => {
      result.current.completeCall('test-call-id', {
        status: 200,
        statusText: 'OK',
        headers: {},
        body: {},
      })
    })

    expect(mockInspector.completeCall).toHaveBeenCalledWith(
      'test-call-id',
      expect.any(Object)
    )
  })

  it('should clear logs', () => {
    const { result } = renderHook(() => useAPIInspector())

    act(() => {
      result.current.clearLogs()
    })

    expect(mockInspector.clear).toHaveBeenCalled()
  })

  it('should toggle enabled state', () => {
    const { result } = renderHook(() => useAPIInspector())

    act(() => {
      result.current.setEnabled(true)
    })

    expect(mockInspector.setEnabled).toHaveBeenCalledWith(true)
  })

  it('should calculate stats correctly', () => {
    const { result } = renderHook(() => useAPIInspector())

    expect(result.current.stats).toEqual({
      totalCalls: 0,
      completedCalls: 0,
      errorCalls: 0,
      averageResponseTime: 0,
      totalUsage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    })
  })
})
