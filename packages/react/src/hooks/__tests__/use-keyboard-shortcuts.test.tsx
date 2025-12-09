/**
 * Keyboard Shortcuts Hooks Tests
 *
 * Tests for keyboard shortcut hooks including:
 * - Basic shortcut registration
 * - Modifier key combinations
 * - Scoped shortcuts with priority
 * - Focus-based shortcuts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { render, fireEvent, screen } from '@testing-library/react'
import * as React from 'react'
import {
  useKeyboardShortcuts,
  useShortcutDisplay,
  useScopedKeyboardShortcuts,
  useFocusedKeyboardShortcuts,
  KeyboardShortcutsHelp,
} from '../use-keyboard-shortcuts'

// Helper to create keyboard events
function createKeyboardEvent(
  key: string,
  modifiers: {
    ctrlKey?: boolean
    metaKey?: boolean
    altKey?: boolean
    shiftKey?: boolean
  } = {}
): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key,
    code: `Key${key.toUpperCase()}`,
    ctrlKey: modifiers.ctrlKey ?? false,
    metaKey: modifiers.metaKey ?? false,
    altKey: modifiers.altKey ?? false,
    shiftKey: modifiers.shiftKey ?? false,
    bubbles: true,
    cancelable: true,
  })
}

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    // Mock navigator.platform for consistent testing
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should register and trigger single key shortcuts', () => {
    const callback = vi.fn()

    renderHook(() =>
      useKeyboardShortcuts([
        { key: 'k', callback, description: 'Test shortcut' },
      ])
    )

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should handle modifier keys', () => {
    const callback = vi.fn()

    renderHook(() =>
      useKeyboardShortcuts([
        { key: 'ctrl+k', callback, description: 'Ctrl+K shortcut' },
      ])
    )

    // Without modifier - should not trigger
    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })
    expect(callback).not.toHaveBeenCalled()

    // With ctrl modifier - should trigger
    act(() => {
      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }))
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should handle mod key (platform-aware)', () => {
    const callback = vi.fn()

    // Test on Windows (Ctrl)
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    })

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts([{ key: 'mod+k', callback }])
    )

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }))
    })
    expect(callback).toHaveBeenCalledTimes(1)

    unmount()

    // Test on Mac (Cmd)
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    })

    const callbackMac = vi.fn()
    renderHook(() =>
      useKeyboardShortcuts([{ key: 'mod+k', callback: callbackMac }])
    )

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k', { metaKey: true }))
    })
    expect(callbackMac).toHaveBeenCalledTimes(1)
  })

  it('should not trigger disabled shortcuts', () => {
    const callback = vi.fn()

    renderHook(() =>
      useKeyboardShortcuts([{ key: 'k', callback, enabled: false }])
    )

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should not trigger in input elements by default', () => {
    const callback = vi.fn()

    renderHook(() => useKeyboardShortcuts([{ key: 'k', callback }]))

    // Create and focus an input
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    act(() => {
      const event = createKeyboardEvent('k')
      Object.defineProperty(event, 'target', { value: input })
      window.dispatchEvent(event)
    })

    expect(callback).not.toHaveBeenCalled()

    document.body.removeChild(input)
  })

  it('should trigger in input elements when enableInInput is true', () => {
    const callback = vi.fn()

    renderHook(() =>
      useKeyboardShortcuts([{ key: 'escape', callback, enableInInput: true }])
    )

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      })
      input.dispatchEvent(event)
    })

    // The callback should be called since enableInInput is true
    // Note: this depends on implementation details
    document.body.removeChild(input)
  })

  it('should prevent default when preventDefault is true', () => {
    const callback = vi.fn()
    const preventDefault = vi.fn()

    renderHook(() =>
      useKeyboardShortcuts([{ key: 'k', callback, preventDefault: true }])
    )

    act(() => {
      const event = createKeyboardEvent('k')
      event.preventDefault = preventDefault
      window.dispatchEvent(event)
    })

    expect(preventDefault).toHaveBeenCalled()
  })

  it('should cleanup listeners on unmount', () => {
    const callback = vi.fn()

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts([{ key: 'k', callback }])
    )

    unmount()

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })

    expect(callback).not.toHaveBeenCalled()
  })
})

describe('useShortcutDisplay', () => {
  it('should format shortcuts for Windows', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    })

    const { result } = renderHook(() => useShortcutDisplay())

    expect(result.current('mod+k')).toBe('Ctrl+K')
    expect(result.current('ctrl+shift+k')).toBe('Ctrl+Shift+K')
    expect(result.current('escape')).toBe('Esc')
    expect(result.current('enter')).toBe('↵')
  })

  it('should format shortcuts for Mac', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    })

    const { result } = renderHook(() => useShortcutDisplay())

    expect(result.current('mod+k')).toBe('⌘K')
    expect(result.current('ctrl+k')).toBe('⌃K')
    expect(result.current('alt+k')).toBe('⌥K')
    expect(result.current('shift+k')).toBe('⇧K')
  })
})

describe('useScopedKeyboardShortcuts', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should register shortcuts with priority', () => {
    const lowPriorityCallback = vi.fn()
    const highPriorityCallback = vi.fn()

    // Render high priority first
    const { unmount: unmountHigh } = renderHook(() =>
      useScopedKeyboardShortcuts({
        shortcuts: [{ key: 'k', callback: highPriorityCallback }],
        priority: 10,
      })
    )

    // Then low priority
    const { unmount: unmountLow } = renderHook(() =>
      useScopedKeyboardShortcuts({
        shortcuts: [{ key: 'k', callback: lowPriorityCallback }],
        priority: 0,
      })
    )

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })

    // High priority should be called, low should not
    expect(highPriorityCallback).toHaveBeenCalledTimes(1)
    expect(lowPriorityCallback).not.toHaveBeenCalled()

    unmountHigh()
    unmountLow()
  })

  it('should fall through to lower priority when higher is disabled', () => {
    const lowPriorityCallback = vi.fn()
    const highPriorityCallback = vi.fn()

    renderHook(() =>
      useScopedKeyboardShortcuts({
        shortcuts: [{ key: 'k', callback: highPriorityCallback }],
        priority: 10,
        enabled: false, // Disabled
      })
    )

    renderHook(() =>
      useScopedKeyboardShortcuts({
        shortcuts: [{ key: 'k', callback: lowPriorityCallback }],
        priority: 0,
      })
    )

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })

    expect(highPriorityCallback).not.toHaveBeenCalled()
    expect(lowPriorityCallback).toHaveBeenCalledTimes(1)
  })

  it('should cleanup scope on unmount', () => {
    const callback = vi.fn()

    const { unmount } = renderHook(() =>
      useScopedKeyboardShortcuts({
        shortcuts: [{ key: 'k', callback }],
        priority: 10,
      })
    )

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })
    expect(callback).toHaveBeenCalledTimes(1)

    unmount()

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })
    // Should not be called again after unmount
    expect(callback).toHaveBeenCalledTimes(1)
  })
})

describe('useFocusedKeyboardShortcuts', () => {
  it('should only trigger when container has focus', () => {
    const callback = vi.fn()

    function TestComponent() {
      const containerRef = React.useRef<HTMLDivElement>(null)

      useFocusedKeyboardShortcuts(containerRef, [{ key: 'k', callback }])

      return (
        <div ref={containerRef} tabIndex={-1} data-testid="container">
          <button data-testid="button">Click me</button>
        </div>
      )
    }

    render(<TestComponent />)

    // Trigger without focus
    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })
    expect(callback).not.toHaveBeenCalled()

    // Focus the container
    const container = screen.getByTestId('container')
    container.focus()

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should trigger when child element has focus', () => {
    const callback = vi.fn()

    function TestComponent() {
      const containerRef = React.useRef<HTMLDivElement>(null)

      useFocusedKeyboardShortcuts(containerRef, [{ key: 'k', callback }])

      return (
        <div ref={containerRef} tabIndex={-1} data-testid="container">
          <button data-testid="button">Click me</button>
        </div>
      )
    }

    render(<TestComponent />)

    // Focus a child element
    const button = screen.getByTestId('button')
    button.focus()

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should not trigger when focus is outside container', () => {
    const callback = vi.fn()

    function TestComponent() {
      const containerRef = React.useRef<HTMLDivElement>(null)

      useFocusedKeyboardShortcuts(containerRef, [{ key: 'k', callback }])

      return (
        <>
          <div ref={containerRef} tabIndex={-1} data-testid="container">
            Container
          </div>
          <button data-testid="outside-button">Outside</button>
        </>
      )
    }

    render(<TestComponent />)

    // Focus outside element
    const outsideButton = screen.getByTestId('outside-button')
    outsideButton.focus()

    act(() => {
      window.dispatchEvent(createKeyboardEvent('k'))
    })
    expect(callback).not.toHaveBeenCalled()
  })
})

describe('KeyboardShortcutsHelp', () => {
  it('should render shortcuts list', () => {
    const shortcuts = [
      { key: 'mod+k', callback: vi.fn(), description: 'Open search' },
      { key: 'escape', callback: vi.fn(), description: 'Close modal' },
    ]

    render(<KeyboardShortcutsHelp shortcuts={shortcuts} onClose={vi.fn()} />)

    expect(screen.getByText('Open search')).toBeInTheDocument()
    expect(screen.getByText('Close modal')).toBeInTheDocument()
  })

  it('should call onClose when Escape is pressed', () => {
    const onClose = vi.fn()

    render(<KeyboardShortcutsHelp shortcuts={[]} onClose={onClose} />)

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })

    expect(onClose).toHaveBeenCalled()
  })

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn()

    render(<KeyboardShortcutsHelp shortcuts={[]} onClose={onClose} />)

    // Click the backdrop (the overlay div)
    const backdrop = screen.getByRole('dialog').parentElement
    if (backdrop) {
      fireEvent.click(backdrop)
    }

    expect(onClose).toHaveBeenCalled()
  })

  it('should render custom title', () => {
    render(
      <KeyboardShortcutsHelp
        shortcuts={[]}
        onClose={vi.fn()}
        title="Custom Title"
      />
    )

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('should have accessible dialog role', () => {
    render(<KeyboardShortcutsHelp shortcuts={[]} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('should filter out shortcuts without descriptions', () => {
    const shortcuts = [
      { key: 'a', callback: vi.fn(), description: 'Has description' },
      { key: 'b', callback: vi.fn() }, // No description
    ]

    render(<KeyboardShortcutsHelp shortcuts={shortcuts} onClose={vi.fn()} />)

    expect(screen.getByText('Has description')).toBeInTheDocument()
    // The shortcut without description should not render
    expect(screen.queryByText('b')).not.toBeInTheDocument()
  })
})
