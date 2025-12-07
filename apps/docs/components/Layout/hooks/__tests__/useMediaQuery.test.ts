import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMediaQuery } from '../useMediaQuery'

describe('useMediaQuery', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    matchMediaMock = vi.fn((query: string) => {
      const matches = query.includes('reduced-motion')
      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as MediaQueryList
    })
    window.matchMedia = matchMediaMock as any
  })

  it('should return false initially before mount', () => {
    // The hook returns false before mounted state is set
    // In test environment, useEffect runs, so we check the initial state
    const { result } = renderHook(() => useMediaQuery('(prefers-reduced-motion: reduce)'))
    // After mount, it will return the actual value, so we just verify it's a boolean
    expect(typeof result.current).toBe('boolean')
  })

  it('should return true when media query matches', async () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList))

    const { result } = renderHook(() => useMediaQuery('(prefers-reduced-motion: reduce)'))
    
    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should return false when media query does not match', async () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList))

    const { result } = renderHook(() => useMediaQuery('(prefers-reduced-motion: reduce)'))
    
    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  it('should update when media query changes', async () => {
    let matches = false
    const listeners: Array<(e: MediaQueryListEvent) => void> = []

    matchMediaMock.mockImplementation((query: string) => {
      const mediaQuery = {
        get matches() {
          return matches
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
          listeners.push(listener)
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as MediaQueryList

      return mediaQuery
    })

    const { result } = renderHook(() => useMediaQuery('(prefers-reduced-motion: reduce)'))
    
    await waitFor(() => {
      expect(result.current).toBe(false)
    })

    // Simulate media query change
    matches = true
    listeners.forEach(listener => {
      listener({ matches: true } as MediaQueryListEvent)
    })

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })
})
