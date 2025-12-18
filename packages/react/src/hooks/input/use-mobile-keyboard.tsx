'use client'

import * as React from 'react'
import { useSafeTimeout } from './use-safe-timeout'

/**
 * Mobile keyboard state
 */
export interface MobileKeyboardState {
  /** Whether keyboard is currently visible */
  isKeyboardVisible: boolean
  /** Estimated keyboard height in pixels */
  keyboardHeight: number
  /** Whether device is mobile */
  isMobile: boolean
  /** Original viewport height (before keyboard) */
  originalViewportHeight: number
}

/**
 * Mobile keyboard hook options
 */
export interface UseMobileKeyboardOptions {
  /** Callback when keyboard shows */
  onKeyboardShow?: (height: number) => void
  /** Callback when keyboard hides */
  onKeyboardHide?: () => void
  /** Debounce delay for resize events in ms */
  debounceDelay?: number
  /** Enable auto-scroll to focused input */
  autoScroll?: boolean
  /** Additional offset for auto-scroll in px */
  scrollOffset?: number
}

/**
 * Detect if device is mobile
 */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  )
}

/**
 * Production-ready mobile keyboard detection hook.
 *
 * **Features:**
 * - Detects keyboard show/hide events
 * - Estimates keyboard height
 * - Auto-scroll to focused input
 * - Handles viewport changes
 * - iOS and Android support
 * - Debounced resize handling
 *
 * **Use Cases:**
 * - Adjust UI when keyboard appears
 * - Scroll chat input into view
 * - Prevent content from being hidden
 * - Improve mobile UX
 *
 * **Platform Notes:**
 * - iOS: Uses visualViewport API and focusin/focusout events
 * - Android: Uses window resize detection
 * - Falls back gracefully on desktop
 *
 * @example
 * ```tsx
 * // Basic usage
 * function ChatInput() {
 *   const { isKeyboardVisible, keyboardHeight } = useMobileKeyboard()
 *
 *   return (
 *     <div style={{ marginBottom: keyboardHeight }}>
 *       <input />
 *     </div>
 *   )
 * }
 *
 * // With callbacks
 * function ChatWindow() {
 *   const keyboard = useMobileKeyboard({
 *     onKeyboardShow: (height) => {
 *       logger.debug('Keyboard shown, height:', height)
 *     },
 *     onKeyboardHide: () => {
 *       logger.debug('Keyboard hidden')
 *     },
 *     autoScroll: true,
 *     scrollOffset: 20
 *   })
 *
 *   return <div>...</div>
 * }
 *
 * // Conditional rendering
 * function ChatFooter() {
 *   const { isKeyboardVisible, isMobile } = useMobileKeyboard()
 *
 *   if (!isMobile) return <FullFooter />
 *   if (isKeyboardVisible) return <CompactFooter />
 *   return <DefaultFooter />
 * }
 * ```
 */
export function useMobileKeyboard(
  options: UseMobileKeyboardOptions = {}
): MobileKeyboardState {
  const {
    onKeyboardShow,
    onKeyboardHide,
    debounceDelay = 150,
    autoScroll = true,
    scrollOffset = 20,
  } = options

  const [state, setState] = React.useState<MobileKeyboardState>(() => ({
    isKeyboardVisible: false,
    keyboardHeight: 0,
    isMobile: isMobileDevice(),
    originalViewportHeight:
      typeof window !== 'undefined' ? window.innerHeight : 0,
  }))

  // Use useSafeTimeout for automatic cleanup on unmount - prevents memory leaks
  const { setSafeTimeout, clearSafeTimeout, clearAllTimeouts } =
    useSafeTimeout()
  const previousHeightRef = React.useRef<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0
  )
  // Track debounce timer ID for proper debouncing (cancel previous before setting new)
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  /**
   * Scroll focused element into view
   */
  const scrollToFocusedElement = React.useCallback(() => {
    const activeElement = document.activeElement as HTMLElement

    if (
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable)
    ) {
      setSafeTimeout(() => {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })

        // Additional scroll offset
        if (scrollOffset > 0) {
          window.scrollBy(0, scrollOffset)
        }
      }, 300)
    }
  }, [scrollOffset, setSafeTimeout])

  /**
   * Handle viewport/window resize
   */
  const handleResize = React.useCallback(() => {
    if (!state.isMobile) return

    // Cancel previous debounce timer to ensure proper debouncing
    if (debounceTimerRef.current) {
      clearSafeTimeout(debounceTimerRef.current)
    }

    // Debounced resize handling with automatic cleanup via useSafeTimeout
    debounceTimerRef.current = setSafeTimeout(() => {
      debounceTimerRef.current = null
      const currentHeight = window.visualViewport?.height || window.innerHeight
      const previousHeight = previousHeightRef.current
      const heightDifference = previousHeight - currentHeight

      // Keyboard is considered visible if height decreased significantly (>150px)
      const isKeyboardVisible = heightDifference > 150

      if (isKeyboardVisible) {
        const keyboardHeight = heightDifference

        setState((prev) => ({
          ...prev,
          isKeyboardVisible: true,
          keyboardHeight,
        }))

        onKeyboardShow?.(keyboardHeight)

        if (autoScroll) {
          scrollToFocusedElement()
        }
      } else if (state.isKeyboardVisible) {
        setState((prev) => ({
          ...prev,
          isKeyboardVisible: false,
          keyboardHeight: 0,
        }))

        onKeyboardHide?.()
      }

      previousHeightRef.current = currentHeight
    }, debounceDelay)
  }, [
    state.isMobile,
    state.isKeyboardVisible,
    debounceDelay,
    onKeyboardShow,
    onKeyboardHide,
    autoScroll,
    scrollToFocusedElement,
    setSafeTimeout,
    clearSafeTimeout,
  ])

  /**
   * Handle focus events (for iOS)
   */
  const handleFocusIn = React.useCallback(
    (e: FocusEvent) => {
      const target = e.target as HTMLElement

      if (
        !state.isMobile ||
        !(
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        )
      ) {
        return
      }

      // On iOS, visual viewport will change when keyboard shows
      setSafeTimeout(() => {
        handleResize()
      }, 100)
    },
    [state.isMobile, handleResize, setSafeTimeout]
  )

  /**
   * Handle blur events (for iOS)
   */
  const handleFocusOut = React.useCallback(() => {
    if (!state.isMobile) return

    setSafeTimeout(() => {
      // Check if no input is focused
      const activeElement = document.activeElement
      if (
        !activeElement ||
        (activeElement.tagName !== 'INPUT' &&
          activeElement.tagName !== 'TEXTAREA' &&
          !(activeElement as HTMLElement).isContentEditable)
      ) {
        setState((prev) => ({
          ...prev,
          isKeyboardVisible: false,
          keyboardHeight: 0,
        }))

        onKeyboardHide?.()
        previousHeightRef.current = window.innerHeight
      }
    }, 100)
  }, [state.isMobile, onKeyboardHide, setSafeTimeout])

  /**
   * Setup event listeners
   */
  React.useEffect(() => {
    if (typeof window === 'undefined' || !state.isMobile) return

    // Save original viewport height
    previousHeightRef.current = window.innerHeight

    // Listen to visual viewport resize (iOS)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleResize)
    }

    // Listen to focus events (important for iOS)
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)

    return () => {
      // Timer cleanup is handled automatically by useSafeTimeout hook
      clearAllTimeouts()

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      } else {
        window.removeEventListener('resize', handleResize)
      }

      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [
    state.isMobile,
    handleResize,
    handleFocusIn,
    handleFocusOut,
    clearAllTimeouts,
  ])

  return state
}

/**
 * Utility hook for mobile-specific viewport height
 * Provides a stable viewport height that accounts for mobile browsers' address bar
 */
export function useMobileViewportHeight(): number {
  const [height, setHeight] = React.useState<number>(() =>
    typeof window !== 'undefined' ? window.innerHeight : 0
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const updateHeight = () => {
      // Use visual viewport if available (more accurate on mobile)
      const vh = window.visualViewport?.height || window.innerHeight
      setHeight(vh)

      // Also update CSS custom property
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`)
    }

    updateHeight()

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight)
      return () =>
        window.visualViewport?.removeEventListener('resize', updateHeight)
    } else {
      window.addEventListener('resize', updateHeight)
      return () => window.removeEventListener('resize', updateHeight)
    }
  }, [])

  return height
}

/**
 * Utility hook to prevent body scroll when keyboard is visible
 * Useful for modal/fullscreen chat interfaces
 *
 * @param state - Optional keyboard state from useMobileKeyboard. If not provided,
 *                creates its own instance. Pass state from an existing useMobileKeyboard
 *                call to avoid creating duplicate instances in the same component tree.
 *
 * @example
 * ```tsx
 * // Option 1: Standalone usage (creates its own hook instance)
 * function ChatModal() {
 *   useMobileKeyboardScrollLock()
 *   return <div>...</div>
 * }
 *
 * // Option 2: Shared state (recommended when using both hooks)
 * function ChatModal() {
 *   const keyboardState = useMobileKeyboard()
 *   useMobileKeyboardScrollLock(keyboardState)
 *   return <div style={{ paddingBottom: keyboardState.keyboardHeight }}>...</div>
 * }
 * ```
 */
export function useMobileKeyboardScrollLock(state?: MobileKeyboardState): void {
  // Use provided state or create own instance for backwards compatibility
  const ownState = useMobileKeyboard()
  const { isKeyboardVisible, isMobile } = state ?? ownState

  React.useEffect(() => {
    if (!isMobile || !isKeyboardVisible) return

    // Save original styles
    const originalStyle = window.getComputedStyle(document.body).overflow
    const originalPosition = window.getComputedStyle(document.body).position

    // Lock scroll
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'

    return () => {
      // Restore original styles
      document.body.style.overflow = originalStyle
      document.body.style.position = originalPosition
      document.body.style.width = ''
    }
  }, [isMobile, isKeyboardVisible])
}
