/**
 * Tests for useProfiler hook
 * Tests React 19 useOptimistic functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProfiler } from '../hooks/use-profiler'

// Create a stable mock instance that persists across calls
const mockProfiler = {
  getAllMetrics: vi.fn(() => []),
  start: vi.fn(),
  end: vi.fn(() => ({
    name: 'test-operation',
    startTime: 1000,
    endTime: 2000,
    duration: 1000,
  })),
  getMetrics: vi.fn(() => ({
    name: 'test-operation',
    startTime: 1000,
    endTime: 2000,
    duration: 1000,
  })),
  getSummary: vi.fn(() => ({
    totalOperations: 0,
    totalDuration: 0,
    avgDuration: 0,
  })),
  clear: vi.fn(),
  setEnabled: vi.fn(),
  enabled: false,
}

// Mock the profiler to return the same instance
vi.mock('../../performance', () => ({
  getProfiler: vi.fn(() => mockProfiler),
}))

describe('useProfiler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty metrics', () => {
    const { result } = renderHook(() => useProfiler())

    expect(result.current.metrics).toEqual([])
    expect(result.current.enabled).toBe(false)
  })

  it('should start profiling and optimistically add metric', () => {
    const { result } = renderHook(() => useProfiler())

    act(() => {
      result.current.start('test-operation', { trackMemory: true })
    })

    expect(mockProfiler.start).toHaveBeenCalledWith('test-operation', { trackMemory: true })
  })

  it('should end profiling and update metric', () => {
    const { result } = renderHook(() => useProfiler())

    act(() => {
      result.current.end('test-operation', { custom: 'data' })
    })

    expect(mockProfiler.end).toHaveBeenCalledWith('test-operation', { custom: 'data' })
  })

  it('should profile async function', async () => {
    const { result } = renderHook(() => useProfiler())

    await act(async () => {
      const { result: fnResult, metrics } = await result.current.profile(
        'test-operation',
        async () => 'test-result'
      )

      expect(fnResult).toBe('test-result')
      expect(metrics).toBeDefined()
    })
  })

  it('should clear metrics', () => {
    const { result } = renderHook(() => useProfiler())

    act(() => {
      result.current.clear()
    })

    expect(mockProfiler.clear).toHaveBeenCalled()
  })

  it('should toggle enabled state', () => {
    const { result } = renderHook(() => useProfiler())

    act(() => {
      result.current.setEnabled(true)
    })

    expect(mockProfiler.setEnabled).toHaveBeenCalledWith(true)
  })
})
