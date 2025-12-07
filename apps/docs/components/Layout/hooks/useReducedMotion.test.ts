/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns false when reduced motion is not preferred', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    })

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when reduced motion is preferred', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    })

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('handles matchMedia errors gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => {
        throw new Error('matchMedia not supported')
      }),
    })

    const { result } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'prefers-reduced-motion media query not supported:',
      expect.any(Error)
    )

    consoleWarnSpy.mockRestore()
  })

  it('updates when preference changes', () => {
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            changeHandler = handler
          }
        }),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    })

    const { result, rerender } = renderHook(() => useReducedMotion())

    expect(result.current).toBe(false)

    // Simulate preference change
    if (changeHandler) {
      changeHandler({ matches: true } as MediaQueryListEvent)
      rerender()
    }

    expect(result.current).toBe(true)
  })
})
