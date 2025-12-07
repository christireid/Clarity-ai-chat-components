/**
 * Tests for useTimeTravel hook
 * Tests React 19 useOptimistic functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimeTravel } from '../hooks/use-time-travel'

// Create a stable mock instance
let snapshotCounter = 0
const createSnapshot = (messages: any[] = [], label?: string) => ({
  id: `snapshot-${++snapshotCounter}`,
  messages,
  config: {},
  metadata: {},
  label: label || 'Test Snapshot',
  timestamp: new Date(),
})

const mockDebugger = {
  record: vi.fn(() => `snapshot-${snapshotCounter + 1}`),
  getCurrent: vi.fn(() => createSnapshot()),
  jumpTo: vi.fn(() => createSnapshot()),
  goBack: vi.fn(() => createSnapshot()),
  goForward: vi.fn(() => createSnapshot()),
  clear: vi.fn(),
  getAll: vi.fn(() => []),
  getTimeline: vi.fn(() => []),
  getStats: vi.fn(() => ({
    totalSnapshots: 0,
    totalTransitions: 0,
    timeSpan: 0,
    averageMessageCount: 0,
    actionCounts: {},
  })),
  currentIndex: -1,
}

// Mock the TimeTravelDebugger class
vi.mock('../../debug/time-travel', () => ({
  TimeTravelDebugger: vi.fn(() => mockDebugger),
}))

describe('useTimeTravel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    snapshotCounter = 0
  })

  it('should initialize with empty snapshots', () => {
    const { result } = renderHook(() => useTimeTravel())

    expect(result.current.snapshots).toEqual([])
    expect(result.current.currentIndex).toBe(-1)
    expect(result.current.current).toBeNull()
  })

  it('should record a snapshot and call the debugger', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.record([], {}, {}, 'Test Label')
    })

    expect(mockDebugger.record).toHaveBeenCalled()
    expect(mockDebugger.getCurrent).toHaveBeenCalled()
  })

  it('should jump to a snapshot', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.jumpTo('snapshot-1')
    })

    expect(mockDebugger.jumpTo).toHaveBeenCalledWith('snapshot-1')
  })

  it('should go back in history', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.goBack(1)
    })

    expect(mockDebugger.goBack).toHaveBeenCalledWith(1)
  })

  it('should go forward in history', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.goForward(1)
    })

    expect(mockDebugger.goForward).toHaveBeenCalledWith(1)
  })

  it('should clear all snapshots', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.clear()
    })

    expect(mockDebugger.clear).toHaveBeenCalled()
    expect(result.current.snapshots.length).toBe(0)
    expect(result.current.currentIndex).toBe(-1)
  })

  it('should return stats from debugger', () => {
    const { result } = renderHook(() => useTimeTravel())

    // Stats come from the mocked getStats
    expect(result.current.stats).toEqual({
      totalSnapshots: 0,
      totalTransitions: 0,
      timeSpan: 0,
      averageMessageCount: 0,
      actionCounts: {},
    })
    expect(mockDebugger.getStats).toHaveBeenCalled()
  })
})
