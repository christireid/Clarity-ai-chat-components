import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useInteraction } from './useInteraction'

describe('useInteraction', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const createMockMouseEvent = (
    clientX: number,
    clientY: number,
    rect = { left: 0, top: 0, width: 100, height: 100 }
  ): React.MouseEvent<HTMLDivElement> => {
    return {
      clientX,
      clientY,
      currentTarget: {
        getBoundingClientRect: () => rect,
      },
    } as unknown as React.MouseEvent<HTMLDivElement>
  }

  const createMockTouchEvent = (
    clientX: number,
    clientY: number,
    rect = { left: 0, top: 0, width: 100, height: 100 }
  ): React.TouchEvent<HTMLDivElement> => {
    return {
      touches: [{ clientX, clientY }],
      currentTarget: {
        getBoundingClientRect: () => rect,
      },
    } as unknown as React.TouchEvent<HTMLDivElement>
  }

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useInteraction())

    expect(result.current.interactionRef.current).toEqual({
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      isActive: false,
      source: 'none',
    })
  })

  it('should update target position on mouse move', () => {
    const { result } = renderHook(() => useInteraction())

    // Mouse at center of element
    act(() => {
      result.current.handleMouseMove(createMockMouseEvent(50, 50))
    })

    expect(result.current.interactionRef.current?.targetX).toBe(0)
    expect(result.current.interactionRef.current?.targetY).toBe(0)
    expect(result.current.interactionRef.current?.isActive).toBe(true)
    expect(result.current.interactionRef.current?.source).toBe('mouse')
  })

  it('should convert mouse position to NDC (-1 to 1)', () => {
    const { result } = renderHook(() => useInteraction())

    // Top-left corner should be (-1, 1)
    act(() => {
      result.current.handleMouseMove(createMockMouseEvent(0, 0))
    })
    expect(result.current.interactionRef.current?.targetX).toBe(-1)
    expect(result.current.interactionRef.current?.targetY).toBe(1)

    // Bottom-right corner should be (1, -1)
    act(() => {
      result.current.handleMouseMove(createMockMouseEvent(100, 100))
    })
    expect(result.current.interactionRef.current?.targetX).toBe(1)
    expect(result.current.interactionRef.current?.targetY).toBe(-1)
  })

  it('should deactivate on mouse leave', () => {
    const { result } = renderHook(() => useInteraction())

    // Activate with mouse move
    act(() => {
      result.current.handleMouseMove(createMockMouseEvent(50, 50))
    })
    expect(result.current.interactionRef.current?.isActive).toBe(true)

    // Deactivate with mouse leave
    act(() => {
      result.current.handleMouseLeave()
    })
    expect(result.current.interactionRef.current?.isActive).toBe(false)
    expect(result.current.interactionRef.current?.source).toBe('none')
  })

  it('should handle touch start', () => {
    const { result } = renderHook(() => useInteraction())

    act(() => {
      result.current.handleTouchStart(createMockTouchEvent(50, 50))
    })

    // Touch should set both target and current position for immediate response
    expect(result.current.interactionRef.current?.x).toBe(0)
    expect(result.current.interactionRef.current?.y).toBe(0)
    expect(result.current.interactionRef.current?.targetX).toBe(0)
    expect(result.current.interactionRef.current?.targetY).toBe(0)
    expect(result.current.interactionRef.current?.isActive).toBe(true)
    expect(result.current.interactionRef.current?.source).toBe('touch')
  })

  it('should handle touch move', () => {
    const { result } = renderHook(() => useInteraction())

    act(() => {
      result.current.handleTouchStart(createMockTouchEvent(50, 50))
    })

    act(() => {
      result.current.handleTouchMove(createMockTouchEvent(75, 25))
    })

    // Should have updated target position
    expect(result.current.interactionRef.current?.targetX).toBe(0.5)
    expect(result.current.interactionRef.current?.targetY).toBe(0.5)
  })

  it('should fade out touch interaction after touch end', () => {
    const { result } = renderHook(() => useInteraction())

    act(() => {
      result.current.handleTouchStart(createMockTouchEvent(50, 50))
    })
    expect(result.current.interactionRef.current?.isActive).toBe(true)

    act(() => {
      result.current.handleTouchEnd()
    })

    // Should still be active immediately
    expect(result.current.interactionRef.current?.isActive).toBe(true)

    // After fade duration, should be inactive
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(result.current.interactionRef.current?.isActive).toBe(false)
    expect(result.current.interactionRef.current?.source).toBe('none')
  })

  it('should cancel touch fade timeout on new touch', () => {
    const { result } = renderHook(() => useInteraction())

    // Start first touch
    act(() => {
      result.current.handleTouchStart(createMockTouchEvent(50, 50))
    })

    // End touch (starts fade timeout)
    act(() => {
      result.current.handleTouchEnd()
    })

    // Advance partially through fade
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Start new touch (should cancel fade)
    act(() => {
      result.current.handleTouchStart(createMockTouchEvent(75, 75))
    })

    // Advance past original fade time
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should still be active because new touch started
    expect(result.current.interactionRef.current?.isActive).toBe(true)
  })

  it('should provide stable handler references', () => {
    const { result, rerender } = renderHook(() => useInteraction())

    const firstHandlers = {
      handleMouseMove: result.current.handleMouseMove,
      handleMouseLeave: result.current.handleMouseLeave,
      handleTouchStart: result.current.handleTouchStart,
      handleTouchMove: result.current.handleTouchMove,
      handleTouchEnd: result.current.handleTouchEnd,
    }

    rerender()

    expect(result.current.handleMouseMove).toBe(firstHandlers.handleMouseMove)
    expect(result.current.handleMouseLeave).toBe(firstHandlers.handleMouseLeave)
    expect(result.current.handleTouchStart).toBe(firstHandlers.handleTouchStart)
    expect(result.current.handleTouchMove).toBe(firstHandlers.handleTouchMove)
    expect(result.current.handleTouchEnd).toBe(firstHandlers.handleTouchEnd)
  })

  it('should interpolate position smoothly', async () => {
    const { result } = renderHook(() => useInteraction())

    // Set target position
    act(() => {
      result.current.handleMouseMove(createMockMouseEvent(100, 0))
    })

    // Target should be set immediately
    expect(result.current.interactionRef.current?.targetX).toBe(1)

    // Current position should start at 0 and interpolate toward target
    const initialX = result.current.interactionRef.current?.x ?? 0

    // Advance animation frames
    act(() => {
      vi.advanceTimersByTime(100)
    })

    const afterX = result.current.interactionRef.current?.x ?? 0

    // Position should have moved toward target (but not reached it yet)
    expect(afterX).toBeGreaterThan(initialX)
    expect(afterX).toBeLessThan(1)
  })

  it('should clean up animation frame on unmount', () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame')

    const { unmount } = renderHook(() => useInteraction())

    unmount()

    expect(cancelAnimationFrameSpy).toHaveBeenCalled()
  })
})
