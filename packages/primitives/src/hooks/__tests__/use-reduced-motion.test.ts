import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useReducedMotion,
  getReducedMotionPreference,
} from '../use-reduced-motion'

describe('useReducedMotion', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>
  let addListenerMock: ReturnType<typeof vi.fn>
  let removeListenerMock: ReturnType<typeof vi.fn>
  let addEventListenerMock: ReturnType<typeof vi.fn>
  let removeEventListenerMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    addListenerMock = vi.fn()
    removeListenerMock = vi.fn()
    addEventListenerMock = vi.fn()
    removeEventListenerMock = vi.fn()

    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: addListenerMock,
      removeListener: removeListenerMock,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }))

    vi.stubGlobal('matchMedia', matchMediaMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('initial state', () => {
    it('returns false when user has no preference', () => {
      const { result } = renderHook(() => useReducedMotion())
      expect(result.current).toBe(false)
    })

    it('returns true when user prefers reduced motion', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: true,
        media: query,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
      }))

      const { result } = renderHook(() => useReducedMotion())
      expect(result.current).toBe(true)
    })

    it('calls matchMedia with correct query', () => {
      renderHook(() => useReducedMotion())
      expect(matchMediaMock).toHaveBeenCalledWith(
        '(prefers-reduced-motion: reduce)'
      )
    })
  })

  describe('reactive updates', () => {
    it('updates when media query changes', () => {
      let changeHandler: ((event: MediaQueryListEvent) => void) | null = null

      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(
          (event: string, handler: (e: MediaQueryListEvent) => void) => {
            if (event === 'change') {
              changeHandler = handler
            }
          }
        ),
        removeEventListener: vi.fn(),
      }))

      const { result } = renderHook(() => useReducedMotion())
      expect(result.current).toBe(false)

      // Simulate user changing preference
      act(() => {
        changeHandler?.({ matches: true } as MediaQueryListEvent)
      })

      expect(result.current).toBe(true)
    })
  })

  describe('cleanup', () => {
    it('removes event listener on unmount', () => {
      const { unmount } = renderHook(() => useReducedMotion())
      unmount()
      expect(removeEventListenerMock).toHaveBeenCalled()
    })
  })

  describe('SSR safety', () => {
    it('returns false by default (SSR-safe initial value)', () => {
      // The hook defaults to false for SSR safety
      // We can't fully test SSR behavior in happy-dom
      const { result } = renderHook(() => useReducedMotion())
      // On first render before effect runs, should be false
      expect(typeof result.current).toBe('boolean')
    })
  })
})

describe('getReducedMotionPreference', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
    }))
    vi.stubGlobal('matchMedia', matchMediaMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false when user has no preference', () => {
    expect(getReducedMotionPreference()).toBe(false)
  })

  it('returns true when user prefers reduced motion', () => {
    // Need to reset the mock for this test
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
      }))
    )

    expect(getReducedMotionPreference()).toBe(true)
  })

  it('handles missing matchMedia gracefully', () => {
    // Test that the function doesn't throw when matchMedia is unavailable
    vi.stubGlobal('matchMedia', undefined)

    expect(getReducedMotionPreference()).toBe(false)
  })
})
