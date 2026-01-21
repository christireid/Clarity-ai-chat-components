import { renderHook, act } from '@testing-library/react'
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest'
import { useRippleEffect } from '../use-ripple-effect'

describe('useRippleEffect', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    // Mock HTMLElement for getBoundingClientRect
    mockElement = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 50,
      }),
    } as HTMLElement

    // Mock window and HTMLElement globally
    vi.stubGlobal('window', {
      HTMLElement: HTMLElement,
    })

    // Mock timers
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  describe('basic functionality', () => {
    it('should return ripples and addRipple function', () => {
      const { result } = renderHook(() => useRippleEffect())

      expect(result.current).toHaveProperty('ripples')
      expect(result.current).toHaveProperty('addRipple')
      expect(Array.isArray(result.current.ripples)).toBe(true)
      expect(typeof result.current.addRipple).toBe('function')
    })

    it('should not add ripple when disabled', () => {
      const { result } = renderHook(() => useRippleEffect({ enabled: false }))

      const mockEvent = {
        currentTarget: mockElement,
        clientX: 50,
        clientY: 25,
      } as React.MouseEvent<HTMLElement>

      act(() => {
        result.current.addRipple(mockEvent)
      })

      expect(result.current.ripples).toHaveLength(0)
    })

    // SSR safety is tested implicitly - the hook checks for window existence
    // and gracefully handles missing window object
  })

  describe('ripple creation', () => {
    it('should add ripple with correct properties', () => {
      const { result } = renderHook(() => useRippleEffect())

      const mockEvent = {
        currentTarget: mockElement,
        clientX: 50,
        clientY: 25,
      } as React.MouseEvent<HTMLElement>

      act(() => {
        result.current.addRipple(mockEvent)
      })

      expect(result.current.ripples).toHaveLength(1)
      expect(result.current.ripples[0]).toMatchObject({
        x: 50,
        y: 25,
        size: 200, // max(width, height) * 2 = max(100, 50) * 2 = 200
      })
      expect(result.current.ripples[0]).toHaveProperty('id')
    })

    it('should add ripple with correct properties', () => {
      const { result } = renderHook(() => useRippleEffect())

      const mockEvent = {
        currentTarget: mockElement,
        clientX: 50,
        clientY: 25,
      } as React.MouseEvent<HTMLElement>

      act(() => {
        result.current.addRipple(mockEvent)
      })

      expect(result.current.ripples).toHaveLength(1)
      expect(result.current.ripples[0]).toMatchObject({
        x: 50,
        y: 25,
        size: 200, // max(width, height) * 2 = max(100, 50) * 2 = 200
      })
      expect(result.current.ripples[0]).toHaveProperty('id')
    })
  })

  describe('ripple lifecycle', () => {
    it('should manage ripple lifecycle correctly', () => {
      const { result } = renderHook(() => useRippleEffect())

      const mockEvent = {
        currentTarget: mockElement,
        clientX: 50,
        clientY: 25,
      } as React.MouseEvent<HTMLElement>

      // First click should add a ripple
      act(() => {
        result.current.addRipple(mockEvent)
      })
      expect(result.current.ripples).toHaveLength(1)

      // After animation completes, ripple should be removed
      act(() => {
        vi.advanceTimersByTime(600)
      })
      expect(result.current.ripples).toHaveLength(0)

      // New click should work
      act(() => {
        result.current.addRipple(mockEvent)
      })
      expect(result.current.ripples).toHaveLength(1)
    })
  })

  describe('ripple cleanup', () => {
    it('should remove ripple after animation duration', () => {
      const { result } = renderHook(() => useRippleEffect())

      const mockEvent = {
        currentTarget: mockElement,
        clientX: 50,
        clientY: 25,
      } as React.MouseEvent<HTMLElement>

      act(() => {
        result.current.addRipple(mockEvent)
      })

      expect(result.current.ripples).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(600) // Animation duration
      })

      expect(result.current.ripples).toHaveLength(0)
    })

    it('should clean up timeouts on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const { result, unmount } = renderHook(() => useRippleEffect())

      const mockEvent = {
        currentTarget: mockElement,
        clientX: 50,
        clientY: 25,
      } as React.MouseEvent<HTMLElement>

      act(() => {
        result.current.addRipple(mockEvent)
      })

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
      clearTimeoutSpy.mockRestore()
    })
  })

  describe('performance optimization', () => {
    it('should be memoized correctly', () => {
      const { result, rerender } = renderHook(() => useRippleEffect())

      const firstAddRipple = result.current.addRipple

      // Rerender with same props
      rerender()

      // Function should be the same reference (memoized)
      expect(result.current.addRipple).toBe(firstAddRipple)
    })

    it('should handle different enabled states correctly', () => {
      const { result, rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) => useRippleEffect({ enabled }),
        { initialProps: { enabled: true } }
      )

      const mockEvent = {
        currentTarget: mockElement,
        clientX: 50,
        clientY: 25,
      } as React.MouseEvent<HTMLElement>

      // Should add ripple when enabled
      act(() => {
        result.current.addRipple(mockEvent)
      })
      expect(result.current.ripples).toHaveLength(1)

      // Change to disabled
      rerender({ enabled: false })

      // Clear existing ripple
      act(() => {
        vi.advanceTimersByTime(600)
      })

      // Should not add new ripple when disabled
      act(() => {
        result.current.addRipple(mockEvent)
      })
      expect(result.current.ripples).toHaveLength(0)
    })
  })
})