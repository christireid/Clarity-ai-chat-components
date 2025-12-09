/**
 * Accessibility Helper Utilities
 *
 * Reusable utilities for implementing accessible interactive elements.
 * Based on WCAG 2.1 guidelines and React best practices.
 *
 * @module accessibility
 */

import { useEffect, useRef, RefObject, KeyboardEvent } from 'react'

// =============================================================================
// 💡 Types
// =============================================================================

/**
 * Props required for accessible click handlers on non-button elements
 */
export interface AccessibleClickProps {
  role: 'button'
  tabIndex: 0
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

/**
 * Options for focus trap behavior
 */
export interface FocusTrapOptions {
  /** Whether the focus trap is active */
  enabled?: boolean
  /** Selector for focusable elements */
  focusableSelector?: string
  /** Auto-focus first element when enabled */
  autoFocus?: boolean
  /** Return focus to trigger when disabled */
  returnFocus?: boolean
}

/**
 * Result of useFocusTrap hook
 */
export interface FocusTrapResult {
  /** Ref to attach to the container element */
  containerRef: RefObject<HTMLDivElement>
}

// =============================================================================
// 💡 Accessible Click Handler
// =============================================================================

/**
 * Creates accessible props for making a non-button element clickable.
 *
 * Use this when you absolutely must use a div or span as a button.
 * Prefer using actual <button> elements whenever possible.
 *
 * @param handler - Click handler function
 * @returns Object with role, tabIndex, onClick, and onKeyDown props
 *
 * @example
 * ```tsx
 * function ClickableCard({ onClick }) {
 *   return (
 *     <div
 *       {...accessibleClickHandler(onClick)}
 *       className="card cursor-pointer"
 *     >
 *       Card content
 *     </div>
 *   )
 * }
 * ```
 */
export function accessibleClickHandler(
  handler: (e: React.MouseEvent | React.KeyboardEvent) => void
): AccessibleClickProps {
  return {
    role: 'button',
    tabIndex: 0,
    onClick: handler,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handler(e)
      }
    },
  }
}

// =============================================================================
// 💡 Focus Trap Hook
// =============================================================================

const DEFAULT_FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Hook that traps focus within a container element.
 *
 * Essential for modals, dialogs, and other overlay content
 * to meet WCAG 2.4.3 (Focus Order) requirements.
 *
 * @param options - Focus trap configuration
 * @returns Object containing containerRef to attach to the trap container
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const { containerRef } = useFocusTrap({ enabled: isOpen })
 *
 *   return isOpen ? (
 *     <div ref={containerRef} role="dialog" aria-modal="true">
 *       <button onClick={onClose}>Close</button>
 *       <p>Modal content...</p>
 *     </div>
 *   ) : null
 * }
 * ```
 */
export function useFocusTrap(options: FocusTrapOptions = {}): FocusTrapResult {
  const {
    enabled = true,
    focusableSelector = DEFAULT_FOCUSABLE_SELECTOR,
    autoFocus = true,
    returnFocus = true,
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Store previously focused element
    if (returnFocus) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement
    }

    // Auto-focus first focusable element
    if (autoFocus && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector<HTMLElement>(
        focusableSelector
      )
      firstFocusable?.focus()
    }

    // Focus trap handler
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return

      const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
        focusableSelector
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift+Tab: wrap to last element
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab: wrap to first element
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)

      // Return focus when trap is disabled
      if (returnFocus && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus()
      }
    }
  }, [enabled, focusableSelector, autoFocus, returnFocus])

  return { containerRef }
}

// =============================================================================
// 💡 Auto-Focus Hook
// =============================================================================

/**
 * Hook that auto-focuses an element when a condition is met.
 *
 * Useful for focusing form fields, buttons, or other elements
 * when a component mounts or state changes.
 *
 * @param condition - Whether to focus the element
 * @returns Ref to attach to the element to focus
 *
 * @example
 * ```tsx
 * function SearchModal({ isOpen }) {
 *   const inputRef = useAutoFocus<HTMLInputElement>(isOpen)
 *
 *   return isOpen ? (
 *     <input ref={inputRef} type="search" placeholder="Search..." />
 *   ) : null
 * }
 * ```
 */
export function useAutoFocus<T extends HTMLElement>(
  condition: boolean
): RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (condition && ref.current) {
      ref.current.focus()
    }
  }, [condition])

  return ref
}

// =============================================================================
// 💡 Escape Key Handler Hook
// =============================================================================

/**
 * Hook that calls a handler when the Escape key is pressed.
 *
 * Useful for closing modals, dropdowns, and other dismissible content.
 *
 * @param handler - Function to call when Escape is pressed
 * @param enabled - Whether the handler is active (default: true)
 *
 * @example
 * ```tsx
 * function Modal({ onClose }) {
 *   useEscapeKey(onClose)
 *
 *   return <div role="dialog">...</div>
 * }
 * ```
 */
export function useEscapeKey(
  handler: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handler()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handler, enabled])
}

// =============================================================================
// 💡 Announce to Screen Readers
// =============================================================================

/**
 * Announces a message to screen readers using an ARIA live region.
 *
 * Useful for announcing dynamic content changes, form errors,
 * or other important updates.
 *
 * @param message - Message to announce
 * @param priority - 'polite' (default) or 'assertive'
 *
 * @example
 * ```tsx
 * function SubmitButton() {
 *   const handleSubmit = async () => {
 *     try {
 *       await submit()
 *       announceToScreenReader('Form submitted successfully')
 *     } catch {
 *       announceToScreenReader('Form submission failed', 'assertive')
 *     }
 *   }
 * }
 * ```
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.style.cssText =
    'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement is read
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}
