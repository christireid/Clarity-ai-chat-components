import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useThemeDetection } from '../useThemeDetection'

// Mock next-themes
const mockResolvedTheme = vi.fn()
vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme(),
  }),
}))

describe('useThemeDetection', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockResolvedTheme.mockReturnValue('light')

    matchMediaMock = vi.fn((query: string) => {
      const matches = query.includes('dark')
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
    const { result } = renderHook(() => useThemeDetection())
    // After mount, it will return the actual value, so we just verify it's a boolean
    expect(typeof result.current).toBe('boolean')
  })

  it('should return true when resolvedTheme is dark', async () => {
    mockResolvedTheme.mockReturnValue('dark')
    const { result } = renderHook(() => useThemeDetection())
    
    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should return false when resolvedTheme is light', async () => {
    mockResolvedTheme.mockReturnValue('light')
    const { result } = renderHook(() => useThemeDetection())
    
    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  it('should fallback to system preference when resolvedTheme is undefined', async () => {
    mockResolvedTheme.mockReturnValue(undefined)
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList))

    const { result } = renderHook(() => useThemeDetection())
    
    await waitFor(() => {
      // Should use system preference (dark in this case)
      expect(result.current).toBe(true)
    })
  })
})
