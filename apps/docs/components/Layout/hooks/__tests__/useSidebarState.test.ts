import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useSidebarState } from '../useSidebarState'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock requestAnimationFrame
const rafMock = vi.fn((cb: (time: number) => void) => {
  cb(0)
  return 0
})
const cafMock = vi.fn()

Object.defineProperty(window, 'requestAnimationFrame', { value: rafMock })
Object.defineProperty(window, 'cancelAnimationFrame', { value: cafMock })

describe('useSidebarState', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return default values', () => {
    const { result } = renderHook(() => useSidebarState())

    expect(result.current.visible).toBe(true)
    expect(result.current.width).toBe(280) // default
    expect(result.current.isResizing).toBe(false)
  })

  it('should use custom config values', () => {
    const { result } = renderHook(() =>
      useSidebarState({
        defaultWidth: 300,
        minWidth: 150,
        maxWidth: 500,
      })
    )

    expect(result.current.width).toBe(300)
  })

  it('should toggle visibility', async () => {
    const { result, rerender } = renderHook(() => useSidebarState())

    // Wait for mount
    await act(async () => {
      rerender()
    })

    expect(result.current.visible).toBe(true)

    await act(async () => {
      result.current.toggleVisibility()
    })

    expect(result.current.visible).toBe(false)

    await act(async () => {
      result.current.toggleVisibility()
    })

    expect(result.current.visible).toBe(true)
  })

  it('should set visibility directly', async () => {
    const { result, rerender } = renderHook(() => useSidebarState())

    await act(async () => {
      rerender()
    })

    await act(async () => {
      result.current.setVisible(false)
    })

    expect(result.current.visible).toBe(false)
  })

  it('should set width within bounds', async () => {
    const { result, rerender } = renderHook(() =>
      useSidebarState({
        minWidth: 200,
        maxWidth: 400,
        defaultWidth: 280,
      })
    )

    await act(async () => {
      rerender()
    })

    // Set within bounds
    await act(async () => {
      result.current.setWidth(350)
    })
    expect(result.current.width).toBe(350)

    // Set below min - should clamp
    await act(async () => {
      result.current.setWidth(100)
    })
    expect(result.current.width).toBe(200)

    // Set above max - should clamp
    await act(async () => {
      result.current.setWidth(500)
    })
    expect(result.current.width).toBe(400)
  })

  it('should handle keyboard resize', async () => {
    const { result, rerender } = renderHook(() =>
      useSidebarState({
        minWidth: 200,
        maxWidth: 400,
        defaultWidth: 280,
      })
    )

    await act(async () => {
      rerender()
    })

    // ArrowRight should increase width
    await act(async () => {
      result.current.handleKeyboardResize({
        key: 'ArrowRight',
        shiftKey: false,
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent)
    })
    expect(result.current.width).toBe(290)

    // ArrowLeft should decrease width
    await act(async () => {
      result.current.handleKeyboardResize({
        key: 'ArrowLeft',
        shiftKey: false,
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent)
    })
    expect(result.current.width).toBe(280)

    // Shift + ArrowRight should increase by 50
    await act(async () => {
      result.current.handleKeyboardResize({
        key: 'ArrowRight',
        shiftKey: true,
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent)
    })
    expect(result.current.width).toBe(330)

    // Home should set to min
    await act(async () => {
      result.current.handleKeyboardResize({
        key: 'Home',
        shiftKey: false,
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent)
    })
    expect(result.current.width).toBe(200)

    // End should set to max
    await act(async () => {
      result.current.handleKeyboardResize({
        key: 'End',
        shiftKey: false,
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent)
    })
    expect(result.current.width).toBe(400)
  })

  it('should start resize on mouse down', async () => {
    const { result, rerender } = renderHook(() => useSidebarState())

    await act(async () => {
      rerender()
    })

    expect(result.current.isResizing).toBe(false)

    await act(async () => {
      result.current.startResize({
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent)
    })

    expect(result.current.isResizing).toBe(true)
  })

  it('should report mounted state', async () => {
    const { result, rerender } = renderHook(() => useSidebarState())

    // After mount
    await act(async () => {
      rerender()
    })

    expect(result.current.isMounted).toBe(true)
  })

  it('should respond to Cmd+B keyboard shortcut', async () => {
    const { result, rerender } = renderHook(() => useSidebarState())

    await act(async () => {
      rerender()
    })

    expect(result.current.visible).toBe(true)

    // Simulate Cmd+B
    await act(async () => {
      const event = new KeyboardEvent('keydown', {
        key: 'b',
        metaKey: true,
      })
      document.dispatchEvent(event)
    })

    expect(result.current.visible).toBe(false)
  })
})
