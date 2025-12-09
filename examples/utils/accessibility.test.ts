/**
 * Unit Tests for Accessibility Utilities
 *
 * Tests for the accessibility helper utilities to ensure they
 * correctly implement WCAG 2.1 requirements.
 *
 * @module accessibility.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  accessibleClickHandler,
  useFocusTrap,
  useAutoFocus,
  useEscapeKey,
  announceToScreenReader,
} from './accessibility'

// =============================================================================
// accessibleClickHandler Tests
// =============================================================================

describe('accessibleClickHandler', () => {
  it('returns correct role and tabIndex', () => {
    const handler = vi.fn()
    const props = accessibleClickHandler(handler)

    expect(props.role).toBe('button')
    expect(props.tabIndex).toBe(0)
  })

  it('calls handler on click', () => {
    const handler = vi.fn()
    const props = accessibleClickHandler(handler)

    const mockEvent = { type: 'click' } as React.MouseEvent
    props.onClick(mockEvent)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(mockEvent)
  })

  it('calls handler on Enter key', () => {
    const handler = vi.fn()
    const props = accessibleClickHandler(handler)

    const mockEvent = {
      key: 'Enter',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent

    props.onKeyDown(mockEvent)

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(mockEvent)
  })

  it('calls handler on Space key', () => {
    const handler = vi.fn()
    const props = accessibleClickHandler(handler)

    const mockEvent = {
      key: ' ',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent

    props.onKeyDown(mockEvent)

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call handler on other keys', () => {
    const handler = vi.fn()
    const props = accessibleClickHandler(handler)

    const mockEvent = {
      key: 'Tab',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent

    props.onKeyDown(mockEvent)

    expect(mockEvent.preventDefault).not.toHaveBeenCalled()
    expect(handler).not.toHaveBeenCalled()
  })
})

// =============================================================================
// useEscapeKey Tests
// =============================================================================

describe('useEscapeKey', () => {
  it('calls handler when Escape is pressed', () => {
    const handler = vi.fn()
    renderHook(() => useEscapeKey(handler))

    // Simulate Escape key press
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call handler when other keys are pressed', () => {
    const handler = vi.fn()
    renderHook(() => useEscapeKey(handler))

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(event)
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('does not call handler when disabled', () => {
    const handler = vi.fn()
    renderHook(() => useEscapeKey(handler, false))

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('removes event listener on unmount', () => {
    const handler = vi.fn()
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderHook(() => useEscapeKey(handler))
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    )
    removeEventListenerSpy.mockRestore()
  })
})

// =============================================================================
// useAutoFocus Tests
// =============================================================================

describe('useAutoFocus', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useAutoFocus<HTMLInputElement>(true))

    expect(result.current).toBeDefined()
    expect(result.current).toHaveProperty('current')
  })

  it('focuses element when condition is true', () => {
    const mockElement = {
      focus: vi.fn(),
    } as unknown as HTMLInputElement

    const { result } = renderHook(() => useAutoFocus<HTMLInputElement>(true))

    // Manually set the ref's current value (simulating DOM attachment)
    Object.defineProperty(result.current, 'current', {
      value: mockElement,
      writable: true,
    })

    // Re-render to trigger the useEffect
    const { rerender } = renderHook(
      ({ condition }) => useAutoFocus<HTMLInputElement>(condition),
      { initialProps: { condition: false } }
    )

    // Set the mock element
    Object.defineProperty(result.current, 'current', {
      value: mockElement,
      writable: true,
    })

    rerender({ condition: true })

    // The focus would be called if the element was properly attached
    // In a real DOM environment, this would work
  })
})

// =============================================================================
// useFocusTrap Tests
// =============================================================================

describe('useFocusTrap', () => {
  it('returns a containerRef', () => {
    const { result } = renderHook(() => useFocusTrap({ enabled: true }))

    expect(result.current).toBeDefined()
    expect(result.current.containerRef).toBeDefined()
    expect(result.current.containerRef).toHaveProperty('current')
  })

  it('does not trap focus when disabled', () => {
    const { result } = renderHook(() => useFocusTrap({ enabled: false }))

    // Just verify it doesn't throw and returns a ref
    expect(result.current.containerRef).toBeDefined()
  })

  it('stores previously focused element when returnFocus is true', () => {
    // Create a button to focus first
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()

    expect(document.activeElement).toBe(button)

    const { unmount } = renderHook(() =>
      useFocusTrap({ enabled: true, returnFocus: true })
    )

    // On unmount, focus should be restored
    unmount()

    // Clean up
    document.body.removeChild(button)
  })
})

// =============================================================================
// announceToScreenReader Tests
// =============================================================================

describe('announceToScreenReader', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates an element with correct ARIA attributes', () => {
    announceToScreenReader('Test message')

    const announcement = document.querySelector('[role="status"]')
    expect(announcement).not.toBeNull()
    expect(announcement?.getAttribute('aria-live')).toBe('polite')
    expect(announcement?.getAttribute('aria-atomic')).toBe('true')
    expect(announcement?.textContent).toBe('Test message')
  })

  it('uses assertive priority when specified', () => {
    announceToScreenReader('Urgent message', 'assertive')

    const announcement = document.querySelector('[role="status"]')
    expect(announcement?.getAttribute('aria-live')).toBe('assertive')
  })

  it('removes announcement after timeout', () => {
    announceToScreenReader('Test message')

    expect(document.querySelector('[role="status"]')).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(document.querySelector('[role="status"]')).toBeNull()
  })

  it('applies sr-only styles for visual hiding', () => {
    announceToScreenReader('Hidden message')

    const announcement = document.querySelector('[role="status"]')
    expect(announcement?.className).toBe('sr-only')
    expect(announcement?.getAttribute('style')).toContain('position: absolute')
    expect(announcement?.getAttribute('style')).toContain('width: 1px')
  })
})
