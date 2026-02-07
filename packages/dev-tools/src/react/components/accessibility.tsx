/**
 * Accessibility Utilities
 * Helpers for building accessible dev tools components
 */

'use client'

import * as React from 'react'

// ============================================================================
// Screen Reader Announcer
// ============================================================================

export interface AnnouncerProps {
  /** Message to announce */
  message: string
  /** Politeness level */
  politeness?: 'polite' | 'assertive'
  /** Additional CSS class */
  className?: string
}

/**
 * Screen reader announcer component
 * Announces dynamic content changes to assistive technologies
 */
export function ScreenReaderAnnouncer({
  message,
  politeness = 'polite',
  className,
}: AnnouncerProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={`sr-only ${className || ''}`}
    >
      {message}
    </div>
  )
}

/**
 * Hook for announcing messages to screen readers
 */
export function useAnnounce() {
  const [message, setMessage] = React.useState('')
  const [politeness, setPoliteness] = React.useState<'polite' | 'assertive'>(
    'polite'
  )

  const announce = React.useCallback(
    (text: string, level: 'polite' | 'assertive' = 'polite') => {
      // Clear first to ensure re-announcement of same message
      setMessage('')
      setPoliteness(level)
      // Set message in next tick
      setTimeout(() => setMessage(text), 50)
    },
    []
  )

  const Announcer = React.useCallback(
    () => <ScreenReaderAnnouncer message={message} politeness={politeness} />,
    [message, politeness]
  )

  return { announce, Announcer }
}

// ============================================================================
// Skip Link
// ============================================================================

export interface SkipLinkProps {
  /** ID of the main content element to skip to */
  targetId: string
  /** Skip link text */
  children?: React.ReactNode
  /** Additional CSS class */
  className?: string
}

/**
 * Skip link for keyboard navigation
 * Allows users to skip repetitive navigation
 */
export function SkipLink({
  targetId,
  children = 'Skip to main content',
  className,
}: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href={`#${targetId}`}
      className={`skip-link ${className || ''}`}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

// ============================================================================
// Focus Trap
// ============================================================================

export interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  enabled?: boolean
  /** Element to return focus to when trap is disabled */
  returnFocus?: boolean
  /** Initial focus element selector */
  initialFocus?: string
}

/**
 * Hook for trapping focus within a container
 * Useful for modals and dialogs
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseFocusTrapOptions = {}
) {
  const { enabled = true, returnFocus = true, initialFocus } = options
  const previousActiveElement = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!enabled || !containerRef.current) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Focus initial element or first focusable
    const container = containerRef.current
    const focusableElements = getFocusableElements(container)

    if (initialFocus) {
      const initial = container.querySelector(initialFocus) as HTMLElement
      initial?.focus()
    } else if (focusableElements.length > 0) {
      focusableElements[0].focus()
    } else {
      container.focus()
    }

    // Handle Tab key for trapping
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const elements = getFocusableElements(container)
      if (elements.length === 0) return

      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)

      // Return focus when trap is disabled
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [enabled, containerRef, returnFocus, initialFocus])
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ')

  const elements = container.querySelectorAll(focusableSelectors)
  return Array.from(elements) as HTMLElement[]
}

// ============================================================================
// Keyboard Navigation
// ============================================================================

export interface UseKeyboardNavigationOptions {
  /** List of items to navigate */
  items: unknown[]
  /** Currently selected index */
  selectedIndex: number
  /** Callback when selection changes */
  onSelect: (index: number) => void
  /** Whether navigation wraps around */
  wrap?: boolean
  /** Orientation for arrow key handling */
  orientation?: 'horizontal' | 'vertical' | 'both'
}

/**
 * Hook for keyboard navigation in lists
 */
export function useKeyboardNavigation({
  items,
  selectedIndex,
  onSelect,
  wrap = true,
  orientation = 'vertical',
}: UseKeyboardNavigationOptions) {
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const length = items.length
      if (length === 0) return

      let newIndex = selectedIndex
      const isVertical = orientation === 'vertical' || orientation === 'both'
      const isHorizontal =
        orientation === 'horizontal' || orientation === 'both'

      switch (e.key) {
        case 'ArrowDown':
          if (isVertical) {
            e.preventDefault()
            newIndex = wrap
              ? (selectedIndex + 1) % length
              : Math.min(selectedIndex + 1, length - 1)
          }
          break
        case 'ArrowUp':
          if (isVertical) {
            e.preventDefault()
            newIndex = wrap
              ? (selectedIndex - 1 + length) % length
              : Math.max(selectedIndex - 1, 0)
          }
          break
        case 'ArrowRight':
          if (isHorizontal) {
            e.preventDefault()
            newIndex = wrap
              ? (selectedIndex + 1) % length
              : Math.min(selectedIndex + 1, length - 1)
          }
          break
        case 'ArrowLeft':
          if (isHorizontal) {
            e.preventDefault()
            newIndex = wrap
              ? (selectedIndex - 1 + length) % length
              : Math.max(selectedIndex - 1, 0)
          }
          break
        case 'Home':
          e.preventDefault()
          newIndex = 0
          break
        case 'End':
          e.preventDefault()
          newIndex = length - 1
          break
        default:
          return
      }

      if (newIndex !== selectedIndex) {
        onSelect(newIndex)
      }
    },
    [items.length, selectedIndex, onSelect, wrap, orientation]
  )

  return { onKeyDown: handleKeyDown }
}

// ============================================================================
// Reduced Motion
// ============================================================================

/**
 * Hook to detect user's reduced motion preference
 * Re-exported from @clarity-chat/primitives (canonical source)
 */
export { useReducedMotion } from '@clarity-chat/primitives'

// ============================================================================
// High Contrast
// ============================================================================

/**
 * Hook to detect high contrast mode
 */
export function useHighContrast(): boolean {
  const [highContrast, setHighContrast] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(forced-colors: active)')
    setHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return highContrast
}

// ============================================================================
// ARIA Helpers
// ============================================================================

/**
 * Generate unique IDs for ARIA relationships
 */
export function useAriaIds(prefix: string = 'dt') {
  const id = React.useId()
  return {
    labelId: `${prefix}-label-${id}`,
    descriptionId: `${prefix}-desc-${id}`,
    errorId: `${prefix}-error-${id}`,
    controlId: `${prefix}-control-${id}`,
  }
}

/**
 * Props for accessible descriptions
 */
export function getDescribedByProps(
  hasError: boolean,
  hasDescription: boolean,
  errorId: string,
  descriptionId: string
) {
  const describedBy: string[] = []
  if (hasError) describedBy.push(errorId)
  if (hasDescription) describedBy.push(descriptionId)

  return describedBy.length > 0
    ? { 'aria-describedby': describedBy.join(' ') }
    : {}
}

// ============================================================================
// Visually Hidden
// ============================================================================

export interface VisuallyHiddenProps {
  children: React.ReactNode
  /** Also hide from screen readers */
  hidden?: boolean
}

/**
 * Component to visually hide content but keep it accessible to screen readers
 */
export function VisuallyHidden({
  children,
  hidden = false,
}: VisuallyHiddenProps) {
  if (hidden) {
    return <span hidden>{children}</span>
  }

  return <span className="sr-only">{children}</span>
}

export default {
  ScreenReaderAnnouncer,
  SkipLink,
  VisuallyHidden,
  useAnnounce,
  useFocusTrap,
  useKeyboardNavigation,
  useReducedMotion,
  useHighContrast,
  useAriaIds,
  getFocusableElements,
  getDescribedByProps,
}
