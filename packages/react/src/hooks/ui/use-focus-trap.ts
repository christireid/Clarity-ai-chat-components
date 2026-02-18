/**
 * Focus Trap Hook
 *
 * Traps focus within a container element for modals/dialogs.
 * Supports Tab/Shift+Tab cycling through focusable elements.
 */

import { useRef, useEffect, useCallback } from 'react'

export interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  enabled?: boolean
  /** Custom selector for focusable elements */
  focusableElements?: string
}

const DEFAULT_FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'

/**
 * Trap focus within a container element
 *
 * @param enabled - Whether the focus trap is active
 * @returns Ref to attach to the container element
 */
export function useFocusTrap<T extends HTMLElement>(
  enabled: boolean = true,
  options: UseFocusTrapOptions = {}
) {
  const ref = useRef<T>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const getFocusableElements = useCallback(() => {
    if (!ref.current) return []
    const selector = options.focusableElements || DEFAULT_FOCUSABLE
    return Array.from(ref.current.querySelectorAll<HTMLElement>(selector))
  }, [options.focusableElements])

  useEffect(() => {
    if (!enabled || !ref.current) return

    // Store the previously focused element to restore on cleanup
    previouslyFocused.current = document.activeElement as HTMLElement

    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const elements = getFocusableElements()
      if (elements.length === 0) return

      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]

      if (event.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    const container = ref.current
    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      // Restore focus to the previously focused element
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus()
      }
    }
  }, [enabled, getFocusableElements])

  return ref
}
