/**
 * Tests for useTimeTravel hook
 * Tests React 19 useOptimistic functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimeTravel } from '../hooks/use-time-travel'
import { TimeTravelDebugger } from '../../debug/time-travel'

// Mock the TimeTravelDebugger
vi.mock('../../debug/time-travel', () => {
  const mockDebugger = {
    record: vi.fn(() => 'snapshot-1'),
    getCurrent: vi.fn(() => ({
      id: 'snapshot-1',
      messages: [],
      config: {},
      metadata: {},
      label: 'Test Snapshot',
      timestamp: new Date(),
    })),
    jumpTo: vi.fn(() => ({
      id: 'snapshot-1',
      messages: [],
      config: {},
      metadata: {},
      label: 'Test Snapshot',
      timestamp: new Date(),
    })),
    goBack: vi.fn(() => ({
      id: 'snapshot-1',
      messages: [],
      config: {},
      metadata: {},
      label: 'Test Snapshot',
      timestamp: new Date(),
    })),
    goForward: vi.fn(() => ({
      id: 'snapshot-1',
      messages: [],
      config: {},
      metadata: {},
      label: 'Test Snapshot',
      timestamp: new Date(),
    })),
    clear: vi.fn(),
    getAll: vi.fn(() => []),
    currentIndex: -1,
  }

  return {
    TimeTravelDebugger: vi.fn(() => mockDebugger),
  }
})

describe('useTimeTravel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty snapshots', () => {
    const { result } = renderHook(() => useTimeTravel())

    expect(result.current.snapshots).toEqual([])
    expect(result.current.currentIndex).toBe(-1)
    expect(result.current.current).toBeNull()
  })

  it('should record a snapshot', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.record([], {}, {}, 'Test Label')
    })

    expect(result.current.snapshots.length).toBeGreaterThan(0)
  })

  it('should jump to a snapshot', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.record([], {}, {}, 'Snapshot 1')
    })

    const snapshotId = result.current.snapshots[0]?.id
    if (snapshotId) {
      act(() => {
        result.current.jumpTo(snapshotId)
      })

      expect(result.current.currentIndex).toBeGreaterThanOrEqual(0)
    }
  })

  it('should go back in history', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.record([], {}, {}, 'Snapshot 1')
      result.current.record([], {}, {}, 'Snapshot 2')
    })

    act(() => {
      result.current.goBack(1)
    })

    // Should have moved back
    expect(result.current.currentIndex).toBeLessThan(result.current.snapshots.length - 1)
  })

  it('should go forward in history', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.record([], {}, {}, 'Snapshot 1')
      result.current.record([], {}, {}, 'Snapshot 2')
    })

    act(() => {
      result.current.goBack(1)
      result.current.goForward(1)
    })

    // Should have moved forward
    expect(result.current.currentIndex).toBeGreaterThanOrEqual(0)
  })

  it('should clear all snapshots', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.record([], {}, {}, 'Snapshot 1')
      result.current.record([], {}, {}, 'Snapshot 2')
    })

    act(() => {
      result.current.clear()
    })

    expect(result.current.snapshots.length).toBe(0)
    expect(result.current.currentIndex).toBe(-1)
  })

  it('should calculate stats correctly', () => {
    const { result } = renderHook(() => useTimeTravel())

    act(() => {
      result.current.record([{ role: 'user', content: 'Hello' }], {}, {}, 'Snapshot 1')
      result.current.record([{ role: 'user', content: 'Hello' }, { role: 'assistant', content: 'Hi' }], {}, {}, 'Snapshot 2')
    })

    expect(result.current.stats.totalSnapshots).toBeGreaterThan(0)
    expect(result.current.stats.averageMessageCount).toBeGreaterThan(0)
  })
})
