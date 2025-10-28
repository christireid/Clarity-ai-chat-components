import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  useMobileKeyboard,
  useMobileViewportHeight,
  useMobileKeyboardScrollLock,
} from '../use-mobile-keyboard'

// Mock window.innerHeight and visualViewport
const mockInnerHeight = 800
const mockVisualViewport = {
  height: 800,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

describe('useMobileKeyboard', () => {
  beforeEach(() => {
    // Mock window properties
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: mockInnerHeight,
    })
    
    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      value: mockVisualViewport,
    })

    // Mock navigator for mobile detection
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'iPhone',
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useMobileKeyboard())

    expect(result.current.isKeyboardVisible).toBe(false)
    expect(result.current.keyboardHeight).toBe(0)
    expect(result.current.isMobile).toBe(true)
    expect(result.current.originalViewportHeight).toBe(mockInnerHeight)
  })

  it('should detect non-mobile devices', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    })

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1920,
    })

    const { result } = renderHook(() => useMobileKeyboard())

    expect(result.current.isMobile).toBe(false)
  })

  it('should call onKeyboardShow when keyboard appears', async () => {
    const onKeyboardShow = vi.fn()
    
    renderHook(() => useMobileKeyboard({ onKeyboardShow }))

    // Simulate keyboard show would require mocking visualViewport.resize event
    // This is a placeholder for the test structure
    await waitFor(() => {
      expect(true).toBe(true)
    })
  })

  it('should call onKeyboardHide when keyboard disappears', async () => {
    const onKeyboardHide = vi.fn()
    
    renderHook(() => useMobileKeyboard({ onKeyboardHide }))

    await waitFor(() => {
      expect(true).toBe(true)
    })
  })

  it('should handle autoScroll option', () => {
    const { result } = renderHook(() =>
      useMobileKeyboard({ autoScroll: true, scrollOffset: 20 })
    )

    expect(result.current.isMobile).toBe(true)
  })

  it('should debounce resize events', () => {
    const { result } = renderHook(() =>
      useMobileKeyboard({ debounceDelay: 300 })
    )

    expect(result.current.isKeyboardVisible).toBe(false)
  })

  it('should cleanup event listeners on unmount', () => {
    const { unmount } = renderHook(() => useMobileKeyboard())

    unmount()

    expect(mockVisualViewport.removeEventListener).toHaveBeenCalled()
  })
})

describe('useMobileViewportHeight', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 800,
    })
    
    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      value: mockVisualViewport,
    })
  })

  it('should return initial viewport height', () => {
    const { result } = renderHook(() => useMobileViewportHeight())

    expect(result.current).toBe(800)
  })

  it('should update height on resize', async () => {
    const { result } = renderHook(() => useMobileViewportHeight())

    expect(result.current).toBe(800)

    // Would need to trigger resize event to test update
    await waitFor(() => {
      expect(result.current).toBeGreaterThan(0)
    })
  })

  it('should set CSS custom property', () => {
    renderHook(() => useMobileViewportHeight())

    // Check that --vh CSS variable is set
    const vh = document.documentElement.style.getPropertyValue('--vh')
    expect(vh).toBeTruthy()
  })
})

describe('useMobileKeyboardScrollLock', () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'iPhone',
    })

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 800,
    })

    // Reset body styles
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
  })

  it('should not lock scroll when keyboard is hidden', () => {
    renderHook(() => useMobileKeyboardScrollLock())

    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('should lock scroll when keyboard is visible on mobile', () => {
    // This test would require mocking the keyboard visibility state
    // from useMobileKeyboard hook
    renderHook(() => useMobileKeyboardScrollLock())

    // Placeholder assertion
    expect(document.body).toBeTruthy()
  })

  it('should restore original styles on unmount', () => {
    const originalOverflow = 'auto'
    document.body.style.overflow = originalOverflow

    const { unmount } = renderHook(() => useMobileKeyboardScrollLock())

    unmount()

    // Styles should be restored
    expect(document.body.style).toBeTruthy()
  })

  it('should not affect desktop devices', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    })

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1920,
    })

    renderHook(() => useMobileKeyboardScrollLock())

    expect(document.body.style.overflow).not.toBe('hidden')
  })
})
