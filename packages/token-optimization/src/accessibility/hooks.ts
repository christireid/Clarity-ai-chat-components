/**
 * Accessibility React Hooks
 *
 * WCAG 2.1 AA compliant React hooks for token optimization accessibility features.
 * Provides screen reader announcements, keyboard shortcuts, and focus management.
 *
 * @module accessibility/hooks
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  announce,
  announceTokenUsage,
  announceCost,
  announceCompression,
  announceThresholdCrossing,
  cleanupAnnouncer,
} from './announcer'

/**
 * Options for the token announcer hook
 */
export interface TokenAnnouncerOptions {
  /**
   * Debounce delay in milliseconds for token change announcements
   * @default 500
   */
  debounceMs?: number

  /**
   * Minimum token change required to trigger an announcement
   * @default 100
   */
  minChangeThreshold?: number

  /**
   * Whether to announce threshold crossings
   * @default true
   */
  announceThresholds?: boolean

  /**
   * Warning threshold percentage (0-1)
   * @default 0.8
   */
  warningThreshold?: number

  /**
   * Critical threshold percentage (0-1)
   * @default 0.95
   */
  criticalThreshold?: number

  /**
   * Custom announcement formatter
   */
  formatAnnouncement?: (current: number, limit: number) => string
}

/**
 * Return type for the useTokenAnnouncer hook
 */
export interface UseTokenAnnouncerReturn {
  /**
   * Announce a token count change
   */
  announceChange: (current: number, limit: number) => void

  /**
   * Announce a warning message
   */
  announceWarning: (message: string) => void

  /**
   * Announce a critical message
   */
  announceCritical: (message: string) => void

  /**
   * Announce a cost update
   */
  announceCostUpdate: (amount: number, currency?: string) => void

  /**
   * Announce compression results
   */
  announceCompressionResult: (
    originalTokens: number,
    compressedTokens: number
  ) => void
}

/**
 * Hook for announcing token changes to screen readers
 *
 * Provides debounced announcements for token usage updates with
 * automatic threshold crossing detection.
 *
 * @param options - Configuration options
 * @returns Announcement functions
 *
 * @example
 * ```tsx
 * function TokenCounter({ current, limit }) {
 *   const { announceChange, announceWarning } = useTokenAnnouncer({
 *     debounceMs: 300,
 *     announceThresholds: true
 *   })
 *
 *   useEffect(() => {
 *     announceChange(current, limit)
 *   }, [current, limit])
 *
 *   return <div>Tokens: {current}/{limit}</div>
 * }
 * ```
 */
export function useTokenAnnouncer(
  options: TokenAnnouncerOptions = {}
): UseTokenAnnouncerReturn {
  const {
    debounceMs = 500,
    minChangeThreshold = 100,
    announceThresholds = true,
    warningThreshold = 0.8,
    criticalThreshold = 0.95,
    formatAnnouncement = announceTokenUsage,
  } = options

  const lastAnnouncedRef = useRef<number>(0)
  const lastLevelRef = useRef<'normal' | 'warning' | 'critical'>('normal')
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      cleanupAnnouncer()
    }
  }, [])

  const announceChange = useCallback(
    (current: number, limit: number) => {
      // Clear any pending announcement
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        const percentage = current / limit
        const change = Math.abs(current - lastAnnouncedRef.current)

        // Determine current level
        let currentLevel: 'normal' | 'warning' | 'critical' = 'normal'
        if (percentage >= criticalThreshold) {
          currentLevel = 'critical'
        } else if (percentage >= warningThreshold) {
          currentLevel = 'warning'
        }

        // Check if we should announce
        const levelChanged = currentLevel !== lastLevelRef.current
        const significantChange = change >= minChangeThreshold

        if (levelChanged || significantChange) {
          // Announce threshold crossing if level changed
          if (announceThresholds && levelChanged) {
            const thresholdMessage = announceThresholdCrossing(
              currentLevel,
              Math.round(percentage * 100)
            )
            announce(
              thresholdMessage,
              currentLevel === 'critical' ? 'assertive' : 'polite'
            )
          } else {
            // Regular token count announcement
            const message = formatAnnouncement(current, limit)
            announce(message, 'polite')
          }

          lastAnnouncedRef.current = current
          lastLevelRef.current = currentLevel
        }
      }, debounceMs)
    },
    [
      debounceMs,
      minChangeThreshold,
      announceThresholds,
      warningThreshold,
      criticalThreshold,
      formatAnnouncement,
    ]
  )

  const announceWarning = useCallback((message: string) => {
    announce(message, 'polite')
  }, [])

  const announceCritical = useCallback((message: string) => {
    announce(message, 'assertive')
  }, [])

  const announceCostUpdate = useCallback(
    (amount: number, currency?: string) => {
      const message = announceCost(amount, currency)
      announce(message, 'polite')
    },
    []
  )

  const announceCompressionResult = useCallback(
    (originalTokens: number, compressedTokens: number) => {
      const message = announceCompression(originalTokens, compressedTokens)
      announce(message, 'polite')
    },
    []
  )

  return {
    announceChange,
    announceWarning,
    announceCritical,
    announceCostUpdate,
    announceCompressionResult,
  }
}

/**
 * Options for keyboard shortcuts
 */
export interface KeyboardShortcutOptions {
  /**
   * Enable keyboard shortcuts
   * @default true
   */
  enabled?: boolean

  /**
   * Callback when user requests token count announcement
   */
  onAnnounceTokens?: () => void

  /**
   * Callback when user requests cost announcement
   */
  onAnnounceCost?: () => void

  /**
   * Callback when user triggers compression
   */
  onCompress?: () => void

  /**
   * Callback when user requests help
   */
  onHelp?: () => void

  /**
   * Custom key bindings
   */
  keyBindings?: {
    announceTokens?: string
    announceCost?: string
    compress?: string
    help?: string
  }
}

/**
 * Default key bindings for token optimization shortcuts
 */
const DEFAULT_KEY_BINDINGS = {
  announceTokens: 'Alt+T',
  announceCost: 'Alt+C',
  compress: 'Alt+K',
  help: 'Alt+H',
}

/**
 * Parses a key binding string into its components
 *
 * @param binding - Key binding string (e.g., "Alt+T")
 * @returns Object with modifier and key
 */
function parseKeyBinding(binding: string): {
  altKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  metaKey: boolean
  key: string
} {
  const parts = binding.toLowerCase().split('+')
  const key = parts[parts.length - 1]

  return {
    altKey: parts.includes('alt'),
    ctrlKey: parts.includes('ctrl') || parts.includes('control'),
    shiftKey: parts.includes('shift'),
    metaKey: parts.includes('meta') || parts.includes('cmd'),
    key,
  }
}

/**
 * Checks if a keyboard event matches a key binding
 *
 * @param event - Keyboard event
 * @param binding - Key binding to match
 * @returns Whether the event matches the binding
 */
function matchesBinding(event: KeyboardEvent, binding: string): boolean {
  const parsed = parseKeyBinding(binding)

  return (
    event.altKey === parsed.altKey &&
    event.ctrlKey === parsed.ctrlKey &&
    event.shiftKey === parsed.shiftKey &&
    event.metaKey === parsed.metaKey &&
    event.key.toLowerCase() === parsed.key
  )
}

/**
 * Hook for handling keyboard shortcuts
 *
 * Provides accessible keyboard navigation for token optimization features.
 * Follows WCAG 2.1 guidelines for keyboard accessibility.
 *
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function TokenOptimizer() {
 *   const [tokens, setTokens] = useState(0)
 *
 *   useTokenKeyboardShortcuts({
 *     onAnnounceTokens: () => {
 *       announce(`Current token count: ${tokens}`)
 *     },
 *     onCompress: () => {
 *       // Trigger compression
 *     }
 *   })
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useTokenKeyboardShortcuts(
  options: KeyboardShortcutOptions
): void {
  const {
    enabled = true,
    onAnnounceTokens,
    onAnnounceCost,
    onCompress,
    onHelp,
    keyBindings = {},
  } = options

  const bindings = useMemo(
    () => ({ ...DEFAULT_KEY_BINDINGS, ...keyBindings }),
    [keyBindings]
  )

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (onAnnounceTokens && matchesBinding(event, bindings.announceTokens)) {
        event.preventDefault()
        onAnnounceTokens()
        return
      }

      if (onAnnounceCost && matchesBinding(event, bindings.announceCost)) {
        event.preventDefault()
        onAnnounceCost()
        return
      }

      if (onCompress && matchesBinding(event, bindings.compress)) {
        event.preventDefault()
        onCompress()
        return
      }

      if (onHelp && matchesBinding(event, bindings.help)) {
        event.preventDefault()
        onHelp()
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, onAnnounceTokens, onAnnounceCost, onCompress, onHelp, bindings])
}

/**
 * Options for reduced motion preference
 */
export interface ReducedMotionOptions {
  /**
   * Whether to respect the user's motion preference
   * @default true
   */
  respectPreference?: boolean

  /**
   * Fallback value when preference cannot be determined
   * @default false
   */
  fallback?: boolean
}

/**
 * Hook for detecting user's reduced motion preference
 *
 * Follows WCAG 2.1 guideline 2.3.3 for motion-triggered effects.
 *
 * @param options - Configuration options
 * @returns Whether reduced motion is preferred
 *
 * @example
 * ```tsx
 * function AnimatedCounter({ value }) {
 *   const prefersReducedMotion = usePrefersReducedMotion()
 *
 *   return (
 *     <motion.div
 *       animate={{ scale: prefersReducedMotion ? 1 : [1, 1.1, 1] }}
 *     >
 *       {value}
 *     </motion.div>
 *   )
 * }
 * ```
 */
export function usePrefersReducedMotion(
  options: ReducedMotionOptions = {}
): boolean {
  const { respectPreference = true, fallback = false } = options

  // Always call hooks unconditionally to satisfy rules of hooks
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(fallback)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !respectPreference) {
      return
    }

    // Use matchMedia for the initial check and updates
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [respectPreference])

  return prefersReducedMotion
}

/**
 * Hook for detecting high contrast mode preference
 *
 * Follows WCAG 2.1 guideline 1.4.11 for non-text contrast.
 *
 * @returns Whether high contrast mode is active
 *
 * @example
 * ```tsx
 * function TokenBadge({ level }) {
 *   const highContrast = usePrefersHighContrast()
 *
 *   return (
 *     <span className={highContrast ? 'high-contrast-badge' : 'badge'}>
 *       {level}
 *     </span>
 *   )
 * }
 * ```
 */
export function usePrefersHighContrast(): boolean {
  // Always call hooks unconditionally to satisfy rules of hooks
  const [prefersHighContrast, setPrefersHighContrast] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-contrast: more)')
    setPrefersHighContrast(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersHighContrast
}
