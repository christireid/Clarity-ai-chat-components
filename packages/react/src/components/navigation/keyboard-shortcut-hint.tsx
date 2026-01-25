'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

/**
 * Props for KeyboardShortcutHint component
 */
export interface KeyboardShortcutHintProps {
  /** Storage key for localStorage persistence */
  storageKey?: string
  /** Delay before showing the hint (ms) */
  showDelay?: number
  /** Duration to show the hint before auto-dismissing (ms) */
  displayDuration?: number
  /** Position of the hint */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** Custom hint message */
  message?: string
  /** Shortcut key to highlight */
  shortcutKey?: string
  /** Custom className */
  className?: string
  /** Callback when hint is dismissed */
  onDismiss?: () => void
  /** Force show (ignores localStorage) */
  forceShow?: boolean
}

const STORAGE_PREFIX = 'clarity-shortcut-hint-'

/**
 * Hook to manage keyboard shortcut hint visibility
 */
export function useKeyboardShortcutHint(
  storageKey: string = 'default',
  options: {
    showDelay?: number
    displayDuration?: number
    forceShow?: boolean
  } = {}
): {
  isVisible: boolean
  dismiss: () => void
  reset: () => void
} {
  const {
    showDelay = 1500,
    displayDuration = 8000,
    forceShow = false,
  } = options
  const [isVisible, setIsVisible] = React.useState(false)
  const fullKey = `${STORAGE_PREFIX}${storageKey}`

  React.useEffect(() => {
    // Check if running in browser
    if (typeof window === 'undefined') return

    // Check if already dismissed
    const dismissed = localStorage.getItem(fullKey)
    if (dismissed && !forceShow) return

    // Show after delay
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, showDelay)

    return () => clearTimeout(showTimer)
  }, [fullKey, showDelay, forceShow])

  // Auto-dismiss after duration
  React.useEffect(() => {
    if (!isVisible) return

    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      if (typeof window !== 'undefined') {
        localStorage.setItem(fullKey, 'true')
      }
    }, displayDuration)

    return () => clearTimeout(hideTimer)
  }, [isVisible, displayDuration, fullKey])

  const dismiss = React.useCallback(() => {
    setIsVisible(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(fullKey, 'true')
    }
  }, [fullKey])

  const reset = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(fullKey)
    }
    setIsVisible(false)
  }, [fullKey])

  return { isVisible, dismiss, reset }
}

/**
 * Keyboard shortcut hint component that shows once per user.
 *
 * Features:
 * - Auto-shows on first visit after a delay
 * - Persists dismissed state to localStorage
 * - Auto-dismisses after configurable duration
 * - Smooth fade in/out animation
 * - Click to dismiss
 *
 * @example
 * ```tsx
 * <KeyboardShortcutHint
 *   storageKey="ab-testing-shortcuts"
 *   message="Press ? for keyboard shortcuts"
 *   shortcutKey="?"
 *   position="bottom-right"
 * />
 * ```
 */
export function KeyboardShortcutHint({
  storageKey = 'default',
  showDelay = 1500,
  displayDuration = 8000,
  position = 'bottom-right',
  message = 'Keyboard shortcuts available',
  shortcutKey = '?',
  className,
  onDismiss,
  forceShow = false,
}: KeyboardShortcutHintProps): React.ReactElement | null {
  const { isVisible, dismiss } = useKeyboardShortcutHint(storageKey, {
    showDelay,
    displayDuration,
    forceShow,
  })

  const handleDismiss = React.useCallback(() => {
    dismiss()
    onDismiss?.()
  }, [dismiss, onDismiss])

  // Handle escape key to dismiss
  React.useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, handleDismiss])

  if (!isVisible) return null

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }

  return (
    <div
      className={cn(
        'fixed z-50 animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
        positionClasses[position],
        className
      )}
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={handleDismiss}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border',
          'bg-background/95 backdrop-blur-sm shadow-lg',
          'px-4 py-2.5 text-sm',
          'hover:bg-accent transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
        )}
        aria-label={`${message}. Press ${shortcutKey} to view. Click to dismiss.`}
      >
        <span className="text-muted-foreground">{message}</span>
        <kbd
          className={cn(
            'inline-flex h-6 min-w-6 items-center justify-center',
            'rounded border border-border bg-muted',
            'px-1.5 font-mono text-xs font-medium'
          )}
        >
          {shortcutKey}
        </kbd>
        <span className="sr-only">Click to dismiss</span>
      </button>
    </div>
  )
}

KeyboardShortcutHint.displayName = 'KeyboardShortcutHint'

/**
 * Compound component for inline shortcut hints within content
 */
export interface InlineShortcutHintProps {
  /** The shortcut key(s) to display */
  shortcut: string
  /** Description of what the shortcut does */
  description: string
  /** Custom className */
  className?: string
}

/**
 * Inline shortcut hint for use within content areas.
 *
 * @example
 * ```tsx
 * <p className="text-sm text-muted-foreground">
 *   <InlineShortcutHint shortcut="j/k" description="navigate" />
 * </p>
 * ```
 */
export function InlineShortcutHint({
  shortcut,
  description,
  className,
}: InlineShortcutHintProps): React.ReactElement {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <kbd
        className={cn(
          'inline-flex h-5 items-center justify-center',
          'rounded border border-border bg-muted',
          'px-1 font-mono text-xs font-medium text-muted-foreground'
        )}
      >
        {shortcut}
      </kbd>
      <span className="text-muted-foreground">{description}</span>
    </span>
  )
}

InlineShortcutHint.displayName = 'InlineShortcutHint'
