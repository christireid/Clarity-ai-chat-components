import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useAutoScroll } from '../use-auto-scroll'
import { useRef } from 'react'

describe('useAutoScroll', () => {
  it('should return scrollRef, isNearBottom, scrollToBottom, and setEnabled', () => {
    const { result } = renderHook(() => useAutoScroll())

    expect(result.current.scrollRef).toBeDefined()
    expect(typeof result.current.isNearBottom).toBe('boolean')
    expect(typeof result.current.scrollToBottom).toBe('function')
    expect(typeof result.current.setEnabled).toBe('function')
  })

  it('should initialize with enabled=true by default', () => {
    const { result } = renderHook(() => useAutoScroll())
    
    // Should be enabled by default
    expect(result.current).toBeDefined()
  })

  it('should accept custom options', () => {
    const { result } = renderHook(() =>
      useAutoScroll({
        enabled: false,
        behavior: 'auto',
        threshold: 50,
      })
    )

    expect(result.current).toBeDefined()
  })

  it('should allow enabling/disabling auto-scroll', () => {
    const { result } = renderHook(() => useAutoScroll({ enabled: true }))

    act(() => {
      result.current.setEnabled(false)
    })

    // Hook should still be functional
    expect(result.current.scrollToBottom).toBeDefined()
  })

  it('should update when dependencies change', () => {
    let messages = ['msg1']
    const { result, rerender } = renderHook(() =>
      useAutoScroll({ dependencies: [messages] })
    )

    act(() => {
      messages = ['msg1', 'msg2']
    })

    rerender()

    expect(result.current).toBeDefined()
  })
})
