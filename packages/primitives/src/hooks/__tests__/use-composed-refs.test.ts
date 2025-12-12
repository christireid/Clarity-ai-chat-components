import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import * as React from 'react'
import {
  composeRefs,
  useComposedRefs,
  useForwardedRef,
} from '../use-composed-refs'

describe('composeRefs', () => {
  it('sets value on callback ref', () => {
    const callbackRef = vi.fn()
    const composedRef = composeRefs(callbackRef)

    const element = document.createElement('div')
    composedRef(element)

    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  it('sets value on object ref', () => {
    const objectRef = { current: null as HTMLDivElement | null }
    const composedRef = composeRefs(objectRef)

    const element = document.createElement('div')
    composedRef(element)

    expect(objectRef.current).toBe(element)
  })

  it('handles multiple refs', () => {
    const callbackRef = vi.fn()
    const objectRef = { current: null as HTMLDivElement | null }
    const composedRef = composeRefs(callbackRef, objectRef)

    const element = document.createElement('div')
    composedRef(element)

    expect(callbackRef).toHaveBeenCalledWith(element)
    expect(objectRef.current).toBe(element)
  })

  it('handles undefined refs', () => {
    const callbackRef = vi.fn()
    const composedRef = composeRefs(undefined, callbackRef, undefined)

    const element = document.createElement('div')
    composedRef(element)

    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  it('handles null refs', () => {
    const callbackRef = vi.fn()
    const composedRef = composeRefs(null, callbackRef)

    const element = document.createElement('div')
    composedRef(element)

    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  it('sets null when cleaning up', () => {
    const objectRef = {
      current: document.createElement('div') as HTMLDivElement | null,
    }
    const callbackRef = vi.fn()
    const composedRef = composeRefs(objectRef, callbackRef)

    composedRef(null as unknown as HTMLDivElement)

    expect(objectRef.current).toBe(null)
    expect(callbackRef).toHaveBeenCalledWith(null)
  })
})

describe('useComposedRefs', () => {
  it('returns a stable ref callback', () => {
    const ref1 = { current: null }
    const ref2 = vi.fn()

    const { result, rerender } = renderHook(() => useComposedRefs(ref1, ref2))

    const firstResult = result.current
    rerender()
    const secondResult = result.current

    // Should be same reference (memoized)
    expect(firstResult).toBe(secondResult)
  })

  it('updates when refs change', () => {
    const ref1 = { current: null }
    const ref2 = vi.fn()
    const ref3 = vi.fn()

    const { result, rerender } = renderHook(
      ({ refs }) => useComposedRefs(...refs),
      { initialProps: { refs: [ref1, ref2] as const } }
    )

    const firstResult = result.current
    rerender({ refs: [ref1, ref3] as const })
    const secondResult = result.current

    // Should be different reference when deps change
    expect(firstResult).not.toBe(secondResult)
  })

  it('works correctly in component context', () => {
    const externalRef = { current: null as HTMLDivElement | null }
    const internalRef = { current: null as HTMLDivElement | null }

    const { result } = renderHook(() =>
      useComposedRefs(externalRef, internalRef)
    )

    const element = document.createElement('div')
    result.current(element)

    expect(externalRef.current).toBe(element)
    expect(internalRef.current).toBe(element)
  })
})

describe('useForwardedRef', () => {
  it('returns local ref and composed ref', () => {
    const forwardedRef = { current: null as HTMLDivElement | null }

    const { result } = renderHook(() => useForwardedRef(forwardedRef))

    const [localRef, composedRef] = result.current

    expect(localRef).toHaveProperty('current')
    expect(typeof composedRef).toBe('function')
  })

  it('sets both local and forwarded refs', () => {
    const forwardedRef = { current: null as HTMLDivElement | null }

    const { result } = renderHook(() => useForwardedRef(forwardedRef))

    const [localRef, composedRef] = result.current
    const element = document.createElement('div')

    composedRef(element)

    expect(localRef.current).toBe(element)
    expect(forwardedRef.current).toBe(element)
  })

  it('handles null forwarded ref', () => {
    const { result } = renderHook(() => useForwardedRef(null))

    const [localRef, composedRef] = result.current
    const element = document.createElement('div')

    // Should not throw
    composedRef(element)

    expect(localRef.current).toBe(element)
  })

  it('handles callback forwarded ref', () => {
    const forwardedRef = vi.fn()

    const { result } = renderHook(() => useForwardedRef(forwardedRef))

    const [localRef, composedRef] = result.current
    const element = document.createElement('div')

    composedRef(element)

    expect(localRef.current).toBe(element)
    expect(forwardedRef).toHaveBeenCalledWith(element)
  })
})
