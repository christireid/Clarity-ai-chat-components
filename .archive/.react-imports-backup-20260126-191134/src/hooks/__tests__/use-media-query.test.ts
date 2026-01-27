import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useMediaQuery, useBreakpoint } from '../use-media-query'

describe('useMediaQuery', () => {
  it('should return false for non-matching query', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 10000px)'))
    expect(result.current).toBe(false)
  })

  it('should return boolean for any query', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(typeof result.current).toBe('boolean')
  })

  it('should handle prefers-color-scheme', () => {
    const { result } = renderHook(() =>
      useMediaQuery('(prefers-color-scheme: dark)')
    )
    expect(typeof result.current).toBe('boolean')
  })

  it('should handle prefers-reduced-motion', () => {
    const { result } = renderHook(() =>
      useMediaQuery('(prefers-reduced-motion: reduce)')
    )
    expect(typeof result.current).toBe('boolean')
  })
})

describe('useBreakpoint', () => {
  it('should return a valid breakpoint', () => {
    const { result } = renderHook(() => useBreakpoint())
    
    const validBreakpoints = ['base', 'sm', 'md', 'lg', 'xl', '2xl']
    expect(validBreakpoints).toContain(result.current)
  })

  it('should return base for narrow viewports', () => {
    // In jsdom, window size is typically small
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('base')
  })
})
