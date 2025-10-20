import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useMounted } from '../use-mounted'

describe('useMounted', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => useMounted())
    expect(typeof result.current).toBe('function')
  })

  it('should return true when mounted', () => {
    const { result } = renderHook(() => useMounted())
    expect(result.current()).toBe(true)
  })

  it('should return false after unmount', () => {
    const { result, unmount } = renderHook(() => useMounted())
    
    expect(result.current()).toBe(true)
    
    unmount()
    
    expect(result.current()).toBe(false)
  })

  it('should persist function reference', () => {
    const { result, rerender } = renderHook(() => useMounted())
    
    const firstRef = result.current
    rerender()
    const secondRef = result.current
    
    expect(firstRef).toBe(secondRef)
  })
})
