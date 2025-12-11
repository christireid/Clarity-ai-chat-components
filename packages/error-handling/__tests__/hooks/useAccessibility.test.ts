/**
 * Tests for accessibility hooks
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useFocusManagement,
  useFocusTrap,
  useAnnounce,
  usePrefersReducedMotion,
  useId,
} from '../../src/hooks/useAccessibility'
import { useRef } from 'react'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('reduce'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('useFocusManagement', () => {
  it('should return focus management functions', () => {
    const { result } = renderHook(() => useFocusManagement())

    expect(result.current.captureFocus).toBeDefined()
    expect(result.current.focusError).toBeDefined()
    expect(result.current.restoreFocus).toBeDefined()
    expect(result.current.previousFocusRef).toBeDefined()
    expect(result.current.errorContainerRef).toBeDefined()
  })

  it('should capture current focus', () => {
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()

    const { result } = renderHook(() => useFocusManagement())

    act(() => {
      result.current.captureFocus()
    })

    expect(result.current.previousFocusRef.current).toBe(button)

    document.body.removeChild(button)
  })

  it('should focus error container', () => {
    const container = document.createElement('div')
    container.tabIndex = -1
    document.body.appendChild(container)

    const { result } = renderHook(() => useFocusManagement())
    result.current.errorContainerRef.current = container

    act(() => {
      result.current.focusError()
    })

    expect(document.activeElement).toBe(container)

    document.body.removeChild(container)
  })

  it('should restore focus to previous element', () => {
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()

    const { result } = renderHook(() => useFocusManagement())

    act(() => {
      result.current.captureFocus()
    })

    // Focus something else
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    act(() => {
      result.current.restoreFocus()
    })

    expect(document.activeElement).toBe(button)
    expect(result.current.previousFocusRef.current).toBeNull()

    document.body.removeChild(button)
    document.body.removeChild(input)
  })

  it('should not throw if restore called without captured focus', () => {
    const { result } = renderHook(() => useFocusManagement())

    expect(() => {
      act(() => {
        result.current.restoreFocus()
      })
    }).not.toThrow()
  })
})

describe('useFocusTrap', () => {
  it('should trap focus within container on Tab', () => {
    const container = document.createElement('div')
    const button1 = document.createElement('button')
    const button2 = document.createElement('button')
    container.appendChild(button1)
    container.appendChild(button2)
    document.body.appendChild(container)

    const containerRef = { current: container }

    renderHook(() => useFocusTrap(containerRef))

    // Focus last element
    button2.focus()

    // Simulate Tab keydown
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
    })
    const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault')

    container.dispatchEvent(tabEvent)

    // Should prevent default and wrap to first element
    expect(preventDefaultSpy).toHaveBeenCalled()

    document.body.removeChild(container)
  })

  it('should trap focus within container on Shift+Tab', () => {
    const container = document.createElement('div')
    const button1 = document.createElement('button')
    const button2 = document.createElement('button')
    container.appendChild(button1)
    container.appendChild(button2)
    document.body.appendChild(container)

    const containerRef = { current: container }

    renderHook(() => useFocusTrap(containerRef))

    // Focus first element
    button1.focus()

    // Simulate Shift+Tab keydown
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    })
    const preventDefaultSpy = vi.spyOn(shiftTabEvent, 'preventDefault')

    container.dispatchEvent(shiftTabEvent)

    // Should prevent default and wrap to last element
    expect(preventDefaultSpy).toHaveBeenCalled()

    document.body.removeChild(container)
  })

  it('should not trap if not Tab key', () => {
    const container = document.createElement('div')
    const button = document.createElement('button')
    container.appendChild(button)
    document.body.appendChild(container)

    const containerRef = { current: container }

    renderHook(() => useFocusTrap(containerRef))

    button.focus()

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    })
    const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault')

    container.dispatchEvent(enterEvent)

    expect(preventDefaultSpy).not.toHaveBeenCalled()

    document.body.removeChild(container)
  })

  it('should handle null container ref', () => {
    const containerRef = { current: null }

    // Should not throw
    expect(() => {
      renderHook(() => useFocusTrap(containerRef))
    }).not.toThrow()
  })
})

describe('useAnnounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return announceRef and announce function', () => {
    const { result } = renderHook(() => useAnnounce())

    expect(result.current.announceRef).toBeDefined()
    expect(typeof result.current.announce).toBe('function')
  })

  it('should announce message to screen reader', () => {
    const announceDiv = document.createElement('div')
    document.body.appendChild(announceDiv)

    const { result } = renderHook(() => useAnnounce())
    result.current.announceRef.current = announceDiv

    act(() => {
      result.current.announce('Test message')
    })

    expect(announceDiv.getAttribute('aria-live')).toBe('polite')

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(announceDiv.textContent).toBe('Test message')

    document.body.removeChild(announceDiv)
  })

  it('should announce with assertive priority', () => {
    const announceDiv = document.createElement('div')
    document.body.appendChild(announceDiv)

    const { result } = renderHook(() => useAnnounce())
    result.current.announceRef.current = announceDiv

    act(() => {
      result.current.announce('Urgent message', 'assertive')
    })

    expect(announceDiv.getAttribute('aria-live')).toBe('assertive')

    document.body.removeChild(announceDiv)
  })

  it('should clear previous announcement before new one', () => {
    const announceDiv = document.createElement('div')
    announceDiv.textContent = 'Previous message'
    document.body.appendChild(announceDiv)

    const { result } = renderHook(() => useAnnounce())
    result.current.announceRef.current = announceDiv

    act(() => {
      result.current.announce('New message')
    })

    // Should clear immediately
    expect(announceDiv.textContent).toBe('')

    document.body.removeChild(announceDiv)
  })

  it('should not throw if announceRef is null', () => {
    const { result } = renderHook(() => useAnnounce())

    expect(() => {
      act(() => {
        result.current.announce('Test message')
      })
    }).not.toThrow()
  })
})

describe('usePrefersReducedMotion', () => {
  it('should return boolean preference', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())

    expect(typeof result.current).toBe('boolean')
  })

  it('should detect reduced motion preference', () => {
    // Our mock returns true when query includes 'reduce'
    const { result } = renderHook(() => usePrefersReducedMotion())

    expect(result.current).toBe(true)
  })
})

describe('useId', () => {
  it('should generate unique ID with prefix', () => {
    const { result } = renderHook(() => useId('error'))

    expect(result.current).toMatch(/^error-[a-z0-9]+$/)
  })

  it('should return same ID on re-render', () => {
    const { result, rerender } = renderHook(() => useId('test'))

    const firstId = result.current

    rerender()

    expect(result.current).toBe(firstId)
  })

  it('should generate different IDs for different hooks', () => {
    const { result: result1 } = renderHook(() => useId('prefix'))
    const { result: result2 } = renderHook(() => useId('prefix'))

    expect(result1.current).not.toBe(result2.current)
  })
})
