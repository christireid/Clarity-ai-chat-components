/**
 * Streaming-Specific Accessibility Utilities
 *
 * Accessibility helpers specifically designed for streaming content.
 * For general accessibility utilities, use @clarity-chat/error-handling/accessibility
 *
 * @module utils/accessibility-streaming
 */

import * as React from 'react'

/**
 * Announce content to screen readers
 * Internal helper for streaming announcements
 */
function announceToScreenReader(
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
