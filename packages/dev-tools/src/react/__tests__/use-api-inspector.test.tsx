/**
 * Tests for useAPIInspector hook
 * Tests React 19 useOptimistic functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAPIInspector } from '../hooks/use-api-inspector'
import { getAPIInspector } from '../../debug'

// Mock the API inspector
vi.mock('../../debug', () => ({
  getAPIInspector: vi.fn(() => ({
    getLogs: vi.fn(() => []),
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
  })),
}))

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
    const inspector = getAPIInspector()

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
      expect(inspector.startCall).toHaveBeenCalled()
    })

    // Optimistic update should add log immediately
    expect(result.current.logs.length).toBeGreaterThan(0)
  })

  it('should complete a call and update log', () => {
    const { result } = renderHook(() => useAPIInspector())
    const inspector = getAPIInspector()

    act(() => {
      result.current.completeCall('test-call-id', {
        status: 200,
        statusText: 'OK',
        headers: {},
        body: {},
      })

      expect(inspector.completeCall).toHaveBeenCalledWith('test-call-id', expect.any(Object))
    })
  })

  it('should clear logs', () => {
    const { result } = renderHook(() => useAPIInspector())
    const inspector = getAPIInspector()

    act(() => {
      result.current.clearLogs()
      expect(inspector.clear).toHaveBeenCalled()
    })
  })

  it('should toggle enabled state', () => {
    const { result } = renderHook(() => useAPIInspector())
    const inspector = getAPIInspector()

    act(() => {
      result.current.setEnabled(true)
      expect(inspector.setEnabled).toHaveBeenCalledWith(true)
    })
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
