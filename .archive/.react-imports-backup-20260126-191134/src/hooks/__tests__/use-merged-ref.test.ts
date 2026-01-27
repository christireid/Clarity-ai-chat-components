import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import * as React from 'react'
import { useMergedRef, mergeRefs, useMergedRefWithCleanup, assignRef } from '../use-merged-ref'

describe('useMergedRef', () => {
  it('should set value on object ref', () => {
    const ref = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const { result } = renderHook(() => useMergedRef(ref))

    const element = document.createElement('div')
    act(() => {
      result.current(element)
    })

    expect(ref.current).toBe(element)
  })

  it('should call callback ref with element', () => {
    const callbackRef = vi.fn()
    const { result } = renderHook(() => useMergedRef(callbackRef))

    const element = document.createElement('div')
    act(() => {
      result.current(element)
    })

    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  it('should merge multiple refs', () => {
    const ref1 = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const ref2 = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const callbackRef = vi.fn()

    const { result } = renderHook(() => useMergedRef(ref1, ref2, callbackRef))

    const element = document.createElement('div')
    act(() => {
      result.current(element)
    })

    expect(ref1.current).toBe(element)
    expect(ref2.current).toBe(element)
    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  it('should handle null values', () => {
    const ref = { current: document.createElement('div') } as React.MutableRefObject<HTMLDivElement | null>
    const { result } = renderHook(() => useMergedRef(ref))

    act(() => {
      result.current(null)
    })

    expect(ref.current).toBeNull()
  })

  it('should skip null and undefined refs', () => {
    const ref = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const { result } = renderHook(() => useMergedRef(null, ref, undefined))

    const element = document.createElement('div')
    act(() => {
      result.current(element)
    })

    expect(ref.current).toBe(element)
  })

  it('should be memoized based on refs', () => {
    const ref = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const { result, rerender } = renderHook(
      ({ myRef }) => useMergedRef(myRef),
      { initialProps: { myRef: ref } }
    )

    const firstCallback = result.current

    // Rerender with same ref
    rerender({ myRef: ref })
    expect(result.current).toBe(firstCallback)

    // Rerender with new ref
    const newRef = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    rerender({ myRef: newRef })
    expect(result.current).not.toBe(firstCallback)
  })
})

describe('mergeRefs', () => {
  it('should merge refs without memoization', () => {
    const ref1 = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const ref2 = vi.fn()

    const merged = mergeRefs(ref1, ref2)
    const element = document.createElement('div')
    merged(element)

    expect(ref1.current).toBe(element)
    expect(ref2).toHaveBeenCalledWith(element)
  })

  it('should return a new function each time', () => {
    const ref = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const merged1 = mergeRefs(ref)
    const merged2 = mergeRefs(ref)

    expect(merged1).not.toBe(merged2)
  })
})

describe('useMergedRefWithCleanup', () => {
  it('should call cleanup when element is null', () => {
    const ref = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const cleanup = vi.fn()

    const { result } = renderHook(() => useMergedRefWithCleanup([ref], cleanup))

    const element = document.createElement('div')

    // Set element
    act(() => {
      result.current(element)
    })
    expect(cleanup).not.toHaveBeenCalled()
    expect(ref.current).toBe(element)

    // Clear element (unmount scenario)
    act(() => {
      result.current(null)
    })
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(ref.current).toBeNull()
  })

  it('should not call cleanup when element is set', () => {
    const cleanup = vi.fn()
    const { result } = renderHook(() => useMergedRefWithCleanup([], cleanup))

    const element = document.createElement('div')
    act(() => {
      result.current(element)
    })

    expect(cleanup).not.toHaveBeenCalled()
  })

  it('should work with multiple refs', () => {
    const ref1 = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const ref2 = vi.fn()
    const cleanup = vi.fn()

    const { result } = renderHook(() => useMergedRefWithCleanup([ref1, ref2], cleanup))

    const element = document.createElement('div')
    act(() => {
      result.current(element)
    })

    expect(ref1.current).toBe(element)
    expect(ref2).toHaveBeenCalledWith(element)

    act(() => {
      result.current(null)
    })
    expect(cleanup).toHaveBeenCalled()
  })
})

describe('assignRef', () => {
  it('should assign to object ref', () => {
    const ref = { current: null } as React.MutableRefObject<string | null>
    assignRef(ref, 'test')
    expect(ref.current).toBe('test')
  })

  it('should call callback ref', () => {
    const callbackRef = vi.fn()
    assignRef(callbackRef, 'test')
    expect(callbackRef).toHaveBeenCalledWith('test')
  })

  it('should handle null ref gracefully', () => {
    expect(() => assignRef(null, 'test')).not.toThrow()
    expect(() => assignRef(undefined, 'test')).not.toThrow()
  })
})

describe('React 19 ref-as-prop integration', () => {
  it('should work with internal and external ref pattern', () => {
    // Simulates the common pattern in refactored components
    const internalRef = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const externalRef = { current: null } as React.MutableRefObject<HTMLDivElement | null>

    const { result } = renderHook(() => useMergedRef(internalRef, externalRef))

    const element = document.createElement('div')
    act(() => {
      result.current(element)
    })

    // Both refs should point to the same element
    expect(internalRef.current).toBe(element)
    expect(externalRef.current).toBe(element)

    // Internal ref can be used for imperative methods
    expect(internalRef.current?.tagName).toBe('DIV')
  })

  it('should handle undefined external ref (when parent does not provide ref)', () => {
    const internalRef = { current: null } as React.MutableRefObject<HTMLDivElement | null>
    const externalRef = undefined

    const { result } = renderHook(() => useMergedRef(internalRef, externalRef))

    const element = document.createElement('div')
    act(() => {
      result.current(element)
    })

    expect(internalRef.current).toBe(element)
  })
})
