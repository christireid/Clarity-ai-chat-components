/**
 * Focus Trap Hook
 *
 * Traps keyboard focus within a container element, cycling through
 * focusable elements with Tab/Shift+Tab. Essential for accessible
 * modals, dialogs, and popovers.
 */

import { useRef, useEffect, useCallback } from 'react'

export interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  enabled?: boolean
  /** Custom selector for focusable elements */
  focusableElements?: string
  /** Whether to restore focus to the previously focused element on deactivation */
  restoreFocus?: boolean
  /** Whether to auto-focus the first focusable element on activation */
  autoFocus?: boolean
  /** Element to focus initially (overrides autoFocus) */
  initialFocusRef?: React.RefObject<HTMLElement | null>
}

const DEFAULT_FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'

function getFocusableElements(
  container: HTMLElement,
  selector: string
): HTMLElement[] {
  const elements = Array.from(container.querySelectorAll<HTMLElement>(selector))
  return elements.filter(
    (el) =>
      el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden'
  )
}

/**
 * Trap focus within a container element.
 *
 * Handles Tab and Shift+Tab to cycle through focusable elements,
 * preventing focus from escaping the container.
 *
 * @param enabled - Whether the focus trap is active
 * @param options - Configuration options
 * @returns Ref to attach to the container element
 */
export function useFocusTrap<T extends HTMLElement>(
  enabled: boolean = true,
  options: UseFocusTrapOptions = {}
) {
  const ref = useRef<T>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const {
    focusableElements: selector = DEFAULT_FOCUSABLE_SELECTOR,
    restoreFocus = true,
    autoFocus = true,
    initialFocusRef,
  } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !ref.current) return

      const focusable = getFocusableElements(ref.current, selector)
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]
      const activeElement = document.activeElement as HTMLElement

      if (event.shiftKey) {
        // Shift+Tab: if focus is on first element, wrap to last
        if (
          activeElement === firstElement ||
          !ref.current.contains(activeElement)
        ) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: if focus is on last element, wrap to first
        if (
          activeElement === lastElement ||
          !ref.current.contains(activeElement)
        ) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    },
    [selector]
  )

  useEffect(() => {
    if (!enabled || !ref.current) return

    const container = ref.current

    // Save previously focused element for restoration
    if (restoreFocus) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement
    }

    // Focus initial element
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus()
    } else if (autoFocus) {
      const focusable = getFocusableElements(container, selector)
      if (focusable.length > 0) {
        focusable[0].focus()
      }
    }

    // Attach keyboard handler
    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)

      // Restore focus on cleanup
      if (restoreFocus && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus()
      }
    }
  }, [
    enabled,
    selector,
    autoFocus,
    restoreFocus,
    initialFocusRef,
    handleKeyDown,
  ])

  return ref
}
