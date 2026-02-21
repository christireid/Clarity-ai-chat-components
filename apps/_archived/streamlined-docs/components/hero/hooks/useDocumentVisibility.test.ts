import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDocumentVisibility } from './useDocumentVisibility'

describe('useDocumentVisibility', () => {
  beforeEach(() => {
    vi.spyOn(document, 'addEventListener')
    vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return a boolean value', () => {
    const { result } = renderHook(() => useDocumentVisibility())
    expect(typeof result.current).toBe('boolean')
  })

  it('should return true by default (document visible in test env)', () => {
    const { result } = renderHook(() => useDocumentVisibility())
    // In JSDOM/Happy-DOM, document.visibilityState is 'visible' by default
    expect(result.current).toBe(true)
  })

  it('should register visibilitychange event listener', () => {
    renderHook(() => useDocumentVisibility())

    expect(document.addEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    )
  })

  it('should unregister event listener on unmount', () => {
    const { unmount } = renderHook(() => useDocumentVisibility())

    unmount()

    expect(document.removeEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    )
  })
})
