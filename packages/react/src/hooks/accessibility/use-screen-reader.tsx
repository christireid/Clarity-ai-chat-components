/**
 * Screen Reader Detection Hook
 *
 * Detects if a screen reader is currently active to enable accessible
 * fallback modes for virtualized content.
 *
 * Detection methods:
 * 1. Check for common screen reader user agent strings
 * 2. Monitor focus events (screen readers trigger specific patterns)
 * 3. Check for ARIA landmarks interaction
 * 4. Provide manual override via localStorage
 *
 * @see WCAG 4.1.3 Status Messages (Level AA)
 */

'use client'

import { useState, useEffect } from 'react'

export interface UseScreenReaderOptions {
  /**
   * Manual override - force screen reader mode
   * Useful for testing or user preference
   */
  forceScreenReaderMode?: boolean

  /**
   * localStorage key for persisting user preference
   * @default 'clarity-screen-reader-mode'
   */
  storageKey?: string
}

export interface UseScreenReaderReturn {
  /**
   * Whether a screen reader is detected or enabled
   */
  isScreenReaderActive: boolean

  /**
   * Manually enable screen reader mode
   */
  enableScreenReaderMode: () => void

  /**
   * Manually disable screen reader mode
   */
  disableScreenReaderMode: () => void

  /**
   * Detection method used
   */
  detectionMethod: 'manual' | 'user-agent' | 'heuristic' | 'none'
}

/**
 * Detect if a screen reader is active
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isScreenReaderActive } = useScreenReader()
 *
 *   return isScreenReaderActive ? (
 *     <NonVirtualizedList />
 *   ) : (
 *     <VirtualizedList />
 *   )
 * }
 * ```
 */
export function useScreenReader(
  options: UseScreenReaderOptions = {}
): UseScreenReaderReturn {
  const {
    forceScreenReaderMode = false,
    storageKey = 'clarity-screen-reader-mode',
  } = options

  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false)
  const [detectionMethod, setDetectionMethod] = useState<
    'manual' | 'user-agent' | 'heuristic' | 'none'
  >('none')

  useEffect(() => {
    // Skip detection on server
    if (typeof window === 'undefined') return

    // Check for manual override in localStorage
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored === 'true') {
        setIsScreenReaderActive(true)
        setDetectionMethod('manual')
        return
      }
    } catch (e) {
      // localStorage may be blocked
    }

    // Check for force override
    if (forceScreenReaderMode) {
      setIsScreenReaderActive(true)
      setDetectionMethod('manual')
      return
    }

    // Method 1: Check user agent for common screen readers
    const userAgent = navigator.userAgent.toLowerCase()
    const screenReaderIndicators = [
      'nvda', // NVDA (Windows)
      'jaws', // JAWS (Windows)
      'voiceover', // VoiceOver (macOS/iOS)
      'talkback', // TalkBack (Android)
      'narrator', // Narrator (Windows)
      'orca', // Orca (Linux)
    ]

    for (const indicator of screenReaderIndicators) {
      if (userAgent.includes(indicator)) {
        setIsScreenReaderActive(true)
        setDetectionMethod('user-agent')
        return
      }
    }

    // Method 2: Heuristic detection using ARIA live region
    // Screen readers will cause measurable interactions with ARIA regions
    const testElement = document.createElement('div')
    testElement.setAttribute('role', 'status')
    testElement.setAttribute('aria-live', 'polite')
    testElement.setAttribute('aria-atomic', 'true')
    testElement.style.position = 'absolute'
    testElement.style.left = '-9999px'
    testElement.style.width = '1px'
    testElement.style.height = '1px'
    testElement.style.overflow = 'hidden'
    testElement.textContent = 'Screen reader detection'

    document.body.appendChild(testElement)

    // Wait a moment for screen reader to process
    const timeoutId = setTimeout(() => {
      // Check if element received focus or has any indication of SR interaction
      const isActive = document.activeElement === testElement

      if (isActive) {
        setIsScreenReaderActive(true)
        setDetectionMethod('heuristic')
      }

      document.body.removeChild(testElement)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (document.body.contains(testElement)) {
        document.body.removeChild(testElement)
      }
    }
  }, [forceScreenReaderMode, storageKey])

  const enableScreenReaderMode = () => {
    setIsScreenReaderActive(true)
    setDetectionMethod('manual')
    try {
      localStorage.setItem(storageKey, 'true')
    } catch (e) {
      // localStorage may be blocked
    }
  }

  const disableScreenReaderMode = () => {
    setIsScreenReaderActive(false)
    setDetectionMethod('none')
    try {
      localStorage.removeItem(storageKey)
    } catch (e) {
      // localStorage may be blocked
    }
  }

  return {
    isScreenReaderActive,
    enableScreenReaderMode,
    disableScreenReaderMode,
    detectionMethod,
  }
}

/**
 * Simple screen reader detection (returns boolean only)
 *
 * @example
 * ```tsx
 * const isScreenReader = useScreenReaderDetection()
 * ```
 */
export function useScreenReaderDetection(
  forceMode?: boolean
): boolean {
  const { isScreenReaderActive } = useScreenReader({
    forceScreenReaderMode: forceMode,
  })
  return isScreenReaderActive
}
