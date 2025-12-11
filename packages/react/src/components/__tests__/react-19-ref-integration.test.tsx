/**
 * Integration tests for React 19 ref-as-prop pattern
 *
 * These tests verify that refs are correctly forwarded to DOM elements
 * across all components refactored to use the ref-as-prop pattern.
 */

import { describe, it, expect, vi } from 'vitest'
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Import refactored components
import { KeyboardHint } from '../keyboard-hint'
import { ThemeSwitcher } from '../theme-switcher'
import { DashboardProgress } from '../dashboard-progress'
import { InteractiveCard, InteractiveButton } from '../interactive-card'
import { AdvancedChatInput } from '../advanced-chat-input'

// Note: Some components require complex setup (portals, providers) and are
// tested separately in their own test files.

describe('React 19 Ref Integration Tests', () => {
  describe('KeyboardHint', () => {
    const shortcuts = [
      { keys: ['Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['Escape'], description: 'Close dialog' },
    ]

    it('should forward object ref to root element when visible', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(<KeyboardHint shortcuts={shortcuts} visible={true} ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toBeInTheDocument()
    })

    it('should call callback ref with DOM element when visible', () => {
      const callbackRef = vi.fn()

      render(<KeyboardHint shortcuts={shortcuts} visible={true} ref={callbackRef} />)

      expect(callbackRef).toHaveBeenCalledTimes(1)
      expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    })

    it('should work with useRef pattern', () => {
      function TestComponent() {
        const ref = React.useRef<HTMLDivElement>(null)
        const [mounted, setMounted] = React.useState(false)

        React.useEffect(() => {
          if (ref.current) {
            setMounted(true)
          }
        }, [])

        return (
          <>
            <KeyboardHint shortcuts={shortcuts} visible={true} ref={ref} />
            {mounted && <div data-testid="mounted">Ref worked!</div>}
          </>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('mounted')).toBeInTheDocument()
    })

    it('should not call ref when not visible (AnimatePresence)', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(<KeyboardHint shortcuts={shortcuts} visible={false} ref={ref} />)

      // When visible=false, AnimatePresence doesn't render the child
      expect(ref.current).toBeNull()
    })
  })

  describe('ThemeSwitcher', () => {
    it('should forward object ref to root element', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(
        <ThemeSwitcher
          currentTheme="light"
          onThemeChange={vi.fn()}
          ref={ref}
        />
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('should call callback ref with DOM element', () => {
      const callbackRef = vi.fn()

      render(
        <ThemeSwitcher
          currentTheme="dark"
          onThemeChange={vi.fn()}
          ref={callbackRef}
        />
      )

      expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    })
  })

  describe('DashboardProgress', () => {
    it('should forward object ref to root element', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(
        <DashboardProgress
          value={50}
          max={100}
          label="Progress"
          ref={ref}
        />
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('should call callback ref with DOM element', () => {
      const callbackRef = vi.fn()

      render(
        <DashboardProgress
          value={75}
          max={100}
          label="Loading"
          ref={callbackRef}
        />
      )

      expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    })
  })

  describe('InteractiveCard', () => {
    it('should forward object ref to root element', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(
        <InteractiveCard ref={ref}>
          <div>Card content</div>
        </InteractiveCard>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('should call callback ref with DOM element', () => {
      const callbackRef = vi.fn()

      render(
        <InteractiveCard ref={callbackRef}>
          <div>Card content</div>
        </InteractiveCard>
      )

      expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    })
  })

  describe('InteractiveButton', () => {
    it('should forward object ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>()

      render(
        <InteractiveButton onClick={vi.fn()} ref={ref}>
          Click me
        </InteractiveButton>
      )

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('should call callback ref with button element', () => {
      const callbackRef = vi.fn()

      render(
        <InteractiveButton onClick={vi.fn()} ref={callbackRef}>
          Click me
        </InteractiveButton>
      )

      expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
    })
  })

  describe('AdvancedChatInput with useMergedRef', () => {
    it('should forward ref to textarea while maintaining internal ref functionality', async () => {
      const externalRef = React.createRef<HTMLTextAreaElement>()
      const user = userEvent.setup()

      render(
        <AdvancedChatInput
          value=""
          onChange={vi.fn()}
          onSubmit={vi.fn()}
          ref={externalRef}
        />
      )

      // External ref should be set
      expect(externalRef.current).toBeInstanceOf(HTMLTextAreaElement)

      // Verify it's the actual textarea we can interact with
      const textarea = externalRef.current!
      await user.type(textarea, 'Hello')

      // The textarea should be focusable and typeable
      expect(document.activeElement).toBe(textarea)
    })

    it('should work with callback ref pattern', () => {
      const callbackRef = vi.fn()

      render(
        <AdvancedChatInput
          value=""
          onChange={vi.fn()}
          onSubmit={vi.fn()}
          ref={callbackRef}
        />
      )

      expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement))
    })

    it('should allow parent to imperatively focus the textarea', () => {
      function ParentComponent() {
        const inputRef = React.useRef<HTMLTextAreaElement>(null)

        return (
          <>
            <button onClick={() => inputRef.current?.focus()}>Focus Input</button>
            <AdvancedChatInput
              value=""
              onChange={vi.fn()}
              onSubmit={vi.fn()}
              ref={inputRef}
            />
          </>
        )
      }

      render(<ParentComponent />)

      const focusButton = screen.getByText('Focus Input')
      focusButton.click()

      // After clicking, the textarea should be focused
      expect(document.activeElement?.tagName).toBe('TEXTAREA')
    })
  })

  describe('Ref cleanup on unmount', () => {
    it('should handle unmount gracefully for DashboardProgress', () => {
      const ref = React.createRef<HTMLDivElement>()

      const { unmount } = render(
        <DashboardProgress
          value={50}
          max={100}
          label="Test"
          ref={ref}
        />
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      const element = ref.current

      // Should unmount without errors
      expect(() => unmount()).not.toThrow()

      // Note: createRef objects maintain their value after unmount
      // This is expected React behavior
      expect(element).toBeInstanceOf(HTMLDivElement)
    })

    it('should call callback ref on mount and handle unmount', () => {
      const callbackRef = vi.fn()

      const { unmount } = render(
        <InteractiveCard ref={callbackRef}>
          <div>Content</div>
        </InteractiveCard>
      )

      // Should have been called at least once on mount
      expect(callbackRef).toHaveBeenCalled()
      // First call should be with the element
      expect(callbackRef.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement)

      // Should unmount without errors
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('Ref stability across re-renders', () => {
    it('should maintain ref across prop changes', () => {
      const ref = React.createRef<HTMLDivElement>()

      const { rerender } = render(
        <DashboardProgress value={25} max={100} label="Loading" ref={ref} />
      )

      const initialElement = ref.current
      expect(initialElement).toBeInstanceOf(HTMLDivElement)

      // Re-render with different props
      rerender(
        <DashboardProgress value={75} max={100} label="Almost done" ref={ref} />
      )

      // Ref should still point to the same DOM element
      expect(ref.current).toBe(initialElement)
    })
  })

  describe('Wrapper component pattern (React 19 migration)', () => {
    // This tests the pattern described in the migration guide
    it('should work with wrapper components using ref-as-prop', () => {
      interface WrapperProps {
        label: string
        ref?: React.Ref<HTMLDivElement>
      }

      function CustomProgressWrapper({ label, ref }: WrapperProps) {
        return (
          <div data-testid="wrapper">
            <DashboardProgress value={50} max={100} label={label} ref={ref} />
          </div>
        )
      }

      const ref = React.createRef<HTMLDivElement>()

      render(<CustomProgressWrapper label="Test" ref={ref} />)

      // Ref should be forwarded through the wrapper to DashboardProgress
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(screen.getByTestId('wrapper')).toBeInTheDocument()
    })
  })
})
