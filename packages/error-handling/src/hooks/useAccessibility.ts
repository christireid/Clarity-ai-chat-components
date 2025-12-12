/**
 * Accessibility utilities for error handling components
 */

import { useEffect, useRef, useCallback } from 'react'

/**
 * Hook to manage focus when errors occur
 * Returns focus to the previously focused element on recovery
 */
export function useFocusManagement() {
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const errorContainerRef = useRef<HTMLDivElement | null>(null)

  /**
   * Capture current focus before error
   */
  const captureFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
  }, [])

  /**
   * Move focus to error container
   */
  const focusError = useCallback(() => {
    if (errorContainerRef.current) {
      errorContainerRef.current.focus()
    }
  }, [])

  /**
   * Restore focus to previously focused element
   */
  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && previousFocusRef.current.focus) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [])

  return {
    previousFocusRef,
    errorContainerRef,
    captureFocus,
    focusError,
    restoreFocus,
  }
}

/**
 * Hook to trap focus within a container (for modal-like error displays)
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [containerRef])
}

/**
 * Hook to announce messages to screen readers
 */
export function useAnnounce() {
  const announceRef = useRef<HTMLDivElement | null>(null)

  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!announceRef.current) return

      // Clear previous announcement
      announceRef.current.textContent = ''

      // Set aria-live attribute
      announceRef.current.setAttribute('aria-live', priority)

      // Use setTimeout to ensure screen readers pick up the change
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = message
        }
      }, 100)
    },
    []
  )

  return { announceRef, announce }
}

/**
 * Check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const mediaQuery =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null

  return mediaQuery?.matches ?? false
}

/**
 * Generate unique IDs for ARIA relationships
 */
export function useId(prefix: string): string {
  const idRef = useRef<string | undefined>(undefined)
  if (!idRef.current) {
    idRef.current = `${prefix}-${Math.random().toString(36).substring(2, 9)}`
  }
  return idRef.current
}
