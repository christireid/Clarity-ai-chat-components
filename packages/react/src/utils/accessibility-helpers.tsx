/**
 * Accessibility Helpers - Enhanced A11y Support
 *
 * Comprehensive accessibility utilities for Clarity Chat components,
 * including screen reader support, keyboard navigation, and ARIA compliance.
 *
 * @module utils/accessibility-helpers
 */

import * as React from 'react'

// =============================================================================
// ARIA HELPERS
// =============================================================================

/**
 * Generate accessible button props with proper ARIA attributes
 */
export function createAccessibleButtonProps(options: {
  label: string
  description?: string
  expanded?: boolean
  pressed?: boolean
  disabled?: boolean
}) {
  const { label, description, expanded, pressed, disabled } = options

  return {
    'aria-label': label,
    'aria-describedby': description ? `${label}-description` : undefined,
    'aria-expanded': expanded,
    'aria-pressed': pressed,
    'aria-disabled': disabled,
    role: pressed !== undefined ? 'button' : undefined,
  }
}

/**
 * Generate accessible dialog props
 */
export function createAccessibleDialogProps(options: {
  open: boolean
  title: string
  description?: string
  labelledBy?: string
  describedBy?: string
}) {
  const { open, title, description, labelledBy, describedBy } = options

  return {
    role: 'dialog',
    'aria-modal': open,
    'aria-labelledby': labelledBy || title,
    'aria-describedby': describedBy || description,
    'aria-hidden': !open,
  }
}

/**
 * Generate accessible listbox props
 */
export function createAccessibleListboxProps(options: {
  expanded: boolean
  multiselectable?: boolean
  labelledBy?: string
}) {
  const { expanded, multiselectable, labelledBy } = options

  return {
    role: 'listbox',
    'aria-expanded': expanded,
    'aria-multiselectable': multiselectable,
    'aria-labelledby': labelledBy,
  }
}

// =============================================================================
// KEYBOARD NAVIGATION
// =============================================================================

/**
 * Keyboard navigation handler for lists
 */
export function useKeyboardListNavigation(options: {
  items: any[]
  onSelect: (item: any, index: number) => void
  loop?: boolean
  orientation?: 'vertical' | 'horizontal'
}) {
  const { items, onSelect, loop = true, orientation = 'vertical' } = options
  const [focusedIndex, setFocusedIndex] = React.useState(-1)

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      const { key } = event
      let newIndex = focusedIndex

      switch (key) {
        case orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight':
          event.preventDefault()
          newIndex =
            loop && focusedIndex === items.length - 1 ? 0 : focusedIndex + 1
          break
        case orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft':
          event.preventDefault()
          newIndex =
            loop && focusedIndex === 0 ? items.length - 1 : focusedIndex - 1
          break
        case 'Home':
          event.preventDefault()
          newIndex = 0
          break
        case 'End':
          event.preventDefault()
          newIndex = items.length - 1
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < items.length) {
            onSelect(items[focusedIndex], focusedIndex)
          }
          return
        default:
          return
      }

      if (newIndex >= 0 && newIndex < items.length) {
        setFocusedIndex(newIndex)
      }
    },
    [items, focusedIndex, onSelect, loop, orientation]
  )

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    getItemProps: (index: number) => ({
      'aria-selected': focusedIndex === index,
      tabIndex: focusedIndex === index ? 0 : -1,
    }),
  }
}

/**
 * Keyboard navigation for chat input
 */
export function useChatInputKeyboard(options: {
  onSend: (message: string) => void
  onNewLine?: () => void
  sendOnEnter?: boolean
}) {
  const { onSend, onNewLine, sendOnEnter = true } = options

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const { key, shiftKey, ctrlKey, metaKey } = event
      const target = event.target as HTMLTextAreaElement
      const value = target.value.trim()

      if (key === 'Enter') {
        if (sendOnEnter && !shiftKey && !ctrlKey && !metaKey) {
          event.preventDefault()
          if (value) {
            onSend(value)
            target.value = ''
          }
        } else if (!sendOnEnter || shiftKey) {
          // Allow new line
          onNewLine?.()
        }
      }

      if (key === 'Escape') {
        target.blur()
      }
    },
    [onSend, onNewLine, sendOnEnter]
  )

  return { handleKeyDown }
}

// =============================================================================
// SCREEN READER UTILITIES
// =============================================================================

/**
 * Announce content to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.style.position = 'absolute'
  announcement.style.left = '-10000px'
  announcement.style.width = '1px'
  announcement.style.height = '1px'
  announcement.style.overflow = 'hidden'

  document.body.appendChild(announcement)
  announcement.textContent = message

  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}

/**
 * Hook for screen reader announcements
 */
export function useScreenReaderAnnouncements() {
  const announce = React.useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      announceToScreenReader(message, priority)
    },
    []
  )

  return { announce }
}

/**
 * Hook for debounced streaming announcements
 * Prevents screen reader overload during rapid content updates
 *
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns Object with announce function and clear method
 *
 * @example
 * ```tsx
 * const { announce } = useDebouncedStreamingAnnouncements(500)
 *
 * // During streaming
 * useEffect(() => {
 *   if (isStreaming && content) {
 *     // Announces only after 500ms of no updates
 *     announce(content, 'polite')
 *   }
 * }, [content, isStreaming])
 * ```
 */
export function useDebouncedStreamingAnnouncements(delay: number = 500) {
  const timeoutRef = React.useRef<number | null>(null)
  const lastMessageRef = React.useRef<string>('')
  const mountedRef = React.useRef(true)

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const announce = React.useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Only announce if message has changed significantly (>10% difference)
      const isDifferent =
        Math.abs(message.length - lastMessageRef.current.length) >
        lastMessageRef.current.length * 0.1

      if (!isDifferent) {
        return
      }

      // Debounce the announcement
      timeoutRef.current = window.setTimeout(() => {
        if (mountedRef.current) {
          lastMessageRef.current = message
          announceToScreenReader(message, priority)
        }
      }, delay)
    },
    [delay]
  )

  const clear = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  return { announce, clear }
}

/**
 * Live region component for dynamic content
 */
export const LiveRegion: React.FC<{
  children: React.ReactNode
  priority?: 'polite' | 'assertive'
  atomic?: boolean
}> = ({ children, priority = 'polite', atomic = false }) => (
  <div
    aria-live={priority}
    aria-atomic={atomic}
    style={{
      position: 'absolute',
      left: '-10000px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
)

// =============================================================================
// FOCUS MANAGEMENT
// =============================================================================

/**
 * Hook for managing focus within a component
 */
export function useFocusManagement(
  options: {
    initialFocus?: React.RefObject<HTMLElement>
    returnFocus?: boolean
    trapFocus?: boolean
  } = {}
) {
  const { initialFocus, returnFocus = true, trapFocus = false } = options
  const containerRef = React.useRef<HTMLElement>(null)
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!containerRef.current) return

    // Store previously focused element
    previouslyFocusedRef.current = document.activeElement as HTMLElement

    // Focus initial element
    if (initialFocus?.current) {
      initialFocus.current.focus()
    } else {
      // Focus first focusable element
      const focusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      focusable?.focus()
    }

    return () => {
      // Return focus on unmount
      if (returnFocus && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus()
      }
    }
  }, [initialFocus, returnFocus])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!trapFocus || !containerRef.current) return

      const { key } = event
      if (key !== 'Tab') return

      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    },
    [trapFocus]
  )

  return {
    containerRef,
    handleKeyDown,
  }
}

/**
 * Hook for preserving focus during streaming content updates
 * Prevents focus from jumping to newly rendered content unexpectedly
 *
 * @param isStreaming - Whether content is currently streaming
 * @returns Focus lock state and controls
 *
 * @example
 * ```tsx
 * const { shouldPreserveFocus } = useStreamingFocusPreservation(isStreaming)
 *
 * return (
 *   <div {...(shouldPreserveFocus ? { 'aria-atomic': 'true' } : {})}>
 *     {streamingContent}
 *   </div>
 * )
 * ```
 */
export function useStreamingFocusPreservation(isStreaming: boolean) {
  const [shouldPreserveFocus, setShouldPreserveFocus] = React.useState(false)
  const focusedElementRef = React.useRef<HTMLElement | null>(null)
  const containerHasFocusRef = React.useRef(false)

  React.useEffect(() => {
    if (isStreaming) {
      // Store current focus when streaming starts
      const activeElement = document.activeElement as HTMLElement
      const isWithinContainer =
        activeElement && activeElement.closest('[data-streaming-container]')

      if (isWithinContainer) {
        focusedElementRef.current = activeElement
        containerHasFocusRef.current = true
        setShouldPreserveFocus(true)
      }
    } else {
      // Restore focus when streaming ends (if needed)
      if (containerHasFocusRef.current && focusedElementRef.current) {
        // Only restore if focus hasn't moved elsewhere
        const currentFocus = document.activeElement
        if (currentFocus === document.body || !currentFocus) {
          focusedElementRef.current.focus()
        }
      }

      setShouldPreserveFocus(false)
      containerHasFocusRef.current = false
      focusedElementRef.current = null
    }
  }, [isStreaming])

  return {
    shouldPreserveFocus,
    focusedElementRef,
  }
}

// =============================================================================
// ACCESSIBILITY TESTING UTILITIES
// =============================================================================

/**
 * Check if an element is keyboard accessible
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const styles = window.getComputedStyle(element)
  return (
    styles.display !== 'none' &&
    styles.visibility !== 'hidden' &&
    element.getAttribute('aria-hidden') !== 'true' &&
    !element.hasAttribute('disabled') &&
    !element.getAttribute('aria-disabled')
  )
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ]

  const elements = container.querySelectorAll(focusableSelectors.join(', '))
  return Array.from(elements).filter((el): el is HTMLElement =>
    el instanceof HTMLElement && isKeyboardAccessible(el)
  )
}

/**
 * Validate accessibility of a chat interface
 */
export function validateChatAccessibility(container: HTMLElement): {
  issues: string[]
  score: number
  suggestions: string[]
} {
  const issues: string[] = []
  const suggestions: string[] = []

  // Check for required ARIA labels
  const buttons = container.querySelectorAll('button')
  buttons.forEach((button, index) => {
    if (!button.getAttribute('aria-label') && !button.textContent?.trim()) {
      issues.push(`Button ${index + 1} missing accessible label`)
      suggestions.push(`Add aria-label or visible text to button ${index + 1}`)
    }
  })

  // Check for focus management
  const focusableElements = getFocusableElements(container)
  if (focusableElements.length === 0) {
    issues.push('No keyboard focusable elements found')
    suggestions.push('Add focusable elements like buttons or inputs')
  }

  // Check for heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  if (headings.length === 0) {
    issues.push('No headings found')
    suggestions.push('Add headings to structure content')
  }

  // Calculate accessibility score (0-100)
  const score = Math.max(0, 100 - issues.length * 20)

  return { issues, score, suggestions }
}

// =============================================================================
// MOTION & ANIMATION ACCESSIBILITY
// =============================================================================

/**
 * Hook for respecting user's motion preferences
 */
export function useMotionPreferences() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return { prefersReducedMotion }
}

/**
 * Create motion-safe animation props
 */
export function createAccessibleMotionProps(
  options: {
    duration?: number
    easing?: string
    reducedMotionFallback?: any
  } = {}
) {
  const { duration = 200, easing = 'ease-out', reducedMotionFallback } = options
  const { prefersReducedMotion } = useMotionPreferences()

  if (prefersReducedMotion && reducedMotionFallback) {
    return reducedMotionFallback
  }

  return {
    transition: `all ${duration}ms ${easing}`,
    style: {
      transition: prefersReducedMotion ? 'none' : `all ${duration}ms ${easing}`,
    },
  }
}

// =============================================================================
// HIGH CONTRAST SUPPORT
// =============================================================================

/**
 * Hook for detecting high contrast mode
 */
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = React.useState(false)

  React.useEffect(() => {
    const detectHighContrast = () => {
      // Check for Windows High Contrast mode
      const testElement = document.createElement('div')
      testElement.style.color = 'rgb(31, 41, 55)' // Gray-800
      document.body.appendChild(testElement)

      const computedColor = window.getComputedStyle(testElement).color
      const isHighContrastMode =
        computedColor === 'rgb(255, 255, 255)' ||
        computedColor === 'rgb(0, 0, 0)'

      document.body.removeChild(testElement)
      setIsHighContrast(isHighContrastMode)
    }

    detectHighContrast()

    // Listen for changes (though rare)
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    const handler = () => detectHighContrast()
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return isHighContrast
}

/**
 * Apply high contrast adjustments
 */
export function applyHighContrastAdjustments(
  theme: any,
  isHighContrast: boolean
) {
  if (!isHighContrast) return theme

  return {
    ...theme,
    colors: {
      ...theme.colors,
      border: '#ffffff',
      primary: '#ffff00', // High contrast yellow
      secondary: '#00ffff', // High contrast cyan
    },
  }
}

// =============================================================================
// ACCESSIBILITY COMPONENTS
// =============================================================================

/**
 * Skip link component for keyboard navigation
 */
export const SkipLink: React.FC<{
  href: string
  children: React.ReactNode
  className?: string
}> = ({ href, children, className = '' }) => (
  <a
    href={href}
    className={`skip-link ${className}`}
    style={{
      position: 'absolute',
      left: '-10000px',
      top: 'auto',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      zIndex: 999,
    }}
    onFocus={(e) => {
      e.target.style.left = '6px'
      e.target.style.top = '7px'
      e.target.style.width = 'auto'
      e.target.style.height = 'auto'
    }}
    onBlur={(e) => {
      e.target.style.left = '-10000px'
      e.target.style.top = 'auto'
      e.target.style.width = '1px'
      e.target.style.height = '1px'
    }}
  >
    {children}
  </a>
)

/**
 * Screen reader only text component
 */
export const ScreenReaderOnly: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => (
  <span
    className={`sr-only ${className}`}
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    }}
  >
    {children}
  </span>
)
