import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useWindowSize } from '../use-window-size'

describe('useWindowSize', () => {
  it('should return window dimensions', () => {
    const { result } = renderHook(() => useWindowSize())
    
    expect(result.current).toHaveProperty('width')
    expect(result.current).toHaveProperty('height')
    expect(typeof result.current.width).toBe('number')
    expect(typeof result.current.height).toBe('number')
  })

  it('should return current window size', () => {
    const { result } = renderHook(() => useWindowSize())
    
    // In jsdom, these are typically the default window size
    expect(result.current.width).toBeGreaterThan(0)
    expect(result.current.height).toBeGreaterThan(0)
  })

  it('should not error on multiple renders', () => {
    const { result, rerender } = renderHook(() => useWindowSize())
    
    const firstSize = result.current
    rerender()
    const secondSize = result.current
    
    expect(secondSize).toEqual(firstSize)
  })
})
