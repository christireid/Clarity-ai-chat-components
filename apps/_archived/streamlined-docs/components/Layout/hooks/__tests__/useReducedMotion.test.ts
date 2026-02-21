import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useReducedMotion } from '../useReducedMotion'

describe('useReducedMotion', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>
  let mockAddEventListener: ReturnType<typeof vi.fn>
  let mockRemoveEventListener: ReturnType<typeof vi.fn>
  let mockAddListener: ReturnType<typeof vi.fn>
  let mockRemoveListener: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockAddEventListener = vi.fn()
    mockRemoveEventListener = vi.fn()
    mockAddListener = vi.fn()
    mockRemoveListener = vi.fn()

    mockMatchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: vi.fn(),
    }))

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    })
  })

  it('should return false when prefers-reduced-motion is not set', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
    })

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('should return true when prefers-reduced-motion is enabled', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
    })

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('should listen for changes in prefers-reduced-motion', () => {
    const { unmount } = renderHook(() => useReducedMotion())

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    unmount()
    expect(mockRemoveEventListener).toHaveBeenCalled()
  })

  it('should handle errors gracefully', () => {
    mockMatchMedia.mockImplementation(() => {
      throw new Error('matchMedia not supported')
    })

    const { result } = renderHook(() => useReducedMotion())
    // Should default to false when error occurs
    expect(result.current).toBe(false)
  })
})
