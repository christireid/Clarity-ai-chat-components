'use client'

import * as React from 'react'
import type { KeyboardShortcutConfig } from './types'
import { keyboardNavigationReducer } from './reducer'
import { formatShortcutDisplay } from './shortcut-formatting'
import { matchesKeyPattern, isInputElement } from './key-matching'
import { KeyboardNavigationContext } from './context'

/**
 * Keyboard Navigation Provider Component
 */

export interface KeyboardNavigationProviderProps {
  children: React.ReactNode
  /** Initial shortcuts to register */
  defaultShortcuts?: KeyboardShortcutConfig[]
  /** Timeout for key sequences (ms) */
  sequenceTimeout?: number
  /** Enable development warnings for conflicts */
  warnOnConflicts?: boolean
}

export function KeyboardNavigationProvider({
  children,
  defaultShortcuts = [],
  sequenceTimeout = 1000,
  warnOnConflicts = process.env['NODE_ENV'] === 'development',
}: KeyboardNavigationProviderProps) {
  const [state, dispatch] = React.useReducer(keyboardNavigationReducer, {
    shortcuts: new Map(defaultShortcuts.map((s) => [s.id, s])),
    conflicts: [],
    sequenceBuffer: [],
    activeScope: null,
    isKeyboardNavigating: false,
    focusedIndex: -1,
    showHints: false,
  })

  // Screen reader live region ref
  const liveRegionRef = React.useRef<HTMLDivElement>(null)
  const sequenceTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const announceTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  // Warn about conflicts in development
  React.useEffect(() => {
    if (warnOnConflicts && state.conflicts.length > 0) {
      console.warn(
        '[KeyboardNavigation] Shortcut conflicts detected:',
        state.conflicts.map((c) => ({
          key: c.key,
          shortcuts: c.shortcuts.map((s) => s.id),
        }))
      )
    }
  }, [state.conflicts, warnOnConflicts])

  // Clear sequence buffer after timeout
  React.useEffect(() => {
    if (state.sequenceBuffer.length > 0) {
      sequenceTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'CLEAR_SEQUENCE' })
      }, sequenceTimeout)
    }
    return () => {
      if (sequenceTimeoutRef.current) {
        clearTimeout(sequenceTimeoutRef.current)
      }
    }
  }, [state.sequenceBuffer, sequenceTimeout])

  // Track keyboard navigation mode
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        dispatch({ type: 'SET_KEYBOARD_NAVIGATING', isNavigating: true })
      }
    }

    const handleMouseDown = () => {
      dispatch({ type: 'SET_KEYBOARD_NAVIGATING', isNavigating: false })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Global keyboard event handler
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if in input element
      const inInput = isInputElement(event.target)

      // Get current sequence including this key
      const currentKey = event.key.toLowerCase()
      const newSequence = [...state.sequenceBuffer, currentKey]
      const sequencePattern = newSequence.join(' ')

      // Sort shortcuts by priority (higher first)
      const sortedShortcuts = Array.from(state.shortcuts.values()).sort(
        (a, b) => (b.priority || 0) - (a.priority || 0)
      )

      // Try to match shortcuts
      for (const shortcut of sortedShortcuts) {
        if (shortcut.enabled === false) continue
        if (inInput && !shortcut.enableInInput) continue
        if (shortcut.scope && shortcut.scope !== state.activeScope) continue

        const keys = Array.isArray(shortcut.keys)
          ? shortcut.keys
          : [shortcut.keys]

        for (const keyPattern of keys) {
          // Check for sequence match (e.g., 'g i')
          if (keyPattern.includes(' ')) {
            if (sequencePattern === keyPattern.toLowerCase()) {
              if (shortcut.preventDefault !== false) {
                event.preventDefault()
              }
              shortcut.handler(event)
              dispatch({ type: 'CLEAR_SEQUENCE' })
              return
            }
            // Check if this could be the start of a sequence
            if (keyPattern.toLowerCase().startsWith(sequencePattern)) {
              // Append to sequence buffer
              dispatch({ type: 'APPEND_SEQUENCE', key: currentKey })
              return
            }
          } else {
            // Single key match
            if (matchesKeyPattern(event, keyPattern)) {
              if (shortcut.preventDefault !== false) {
                event.preventDefault()
              }
              shortcut.handler(event)
              dispatch({ type: 'CLEAR_SEQUENCE' })
              return
            }
          }
        }
      }

      // If we get here and have a sequence buffer, check if this key could start a new sequence
      if (state.sequenceBuffer.length > 0) {
        // Clear the old sequence and try this key as a potential new sequence start
        dispatch({ type: 'CLEAR_SEQUENCE' })

        // Check if this single key matches any sequence start
        for (const shortcut of sortedShortcuts) {
          if (shortcut.enabled === false) continue
          const keys = Array.isArray(shortcut.keys)
            ? shortcut.keys
            : [shortcut.keys]
          for (const keyPattern of keys) {
            if (
              keyPattern.includes(' ') &&
              keyPattern.toLowerCase().startsWith(currentKey)
            ) {
              dispatch({ type: 'APPEND_SEQUENCE', key: currentKey })
              return
            }
          }
        }
      } else {
        // Check if this key starts a sequence
        for (const shortcut of sortedShortcuts) {
          if (shortcut.enabled === false) continue
          if (inInput && !shortcut.enableInInput) continue
          const keys = Array.isArray(shortcut.keys)
            ? shortcut.keys
            : [shortcut.keys]
          for (const keyPattern of keys) {
            if (
              keyPattern.includes(' ') &&
              keyPattern.toLowerCase().startsWith(currentKey)
            ) {
              dispatch({ type: 'APPEND_SEQUENCE', key: currentKey })
              return
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.shortcuts, state.sequenceBuffer, state.activeScope])

  // Context value
  const registerShortcut = React.useCallback(
    (config: KeyboardShortcutConfig) => {
      dispatch({ type: 'REGISTER_SHORTCUT', shortcut: config })
      return () => {
        dispatch({ type: 'UNREGISTER_SHORTCUT', id: config.id })
      }
    },
    []
  )

  const setScope = React.useCallback((scope: string | null) => {
    dispatch({ type: 'SET_SCOPE', scope })
  }, [])

  const formatShortcut = React.useCallback((pattern: string) => {
    return formatShortcutDisplay(pattern)
  }, [])

  const getShortcutsByCategory = React.useCallback(() => {
    const categories = new Map<string, KeyboardShortcutConfig[]>()
    state.shortcuts.forEach((shortcut) => {
      if (shortcut.enabled === false) return
      const category = shortcut.category || 'General'
      const existing = categories.get(category) || []
      categories.set(category, [...existing, shortcut])
    })
    return categories
  }, [state.shortcuts])

  const announceToScreenReader = React.useCallback(
    (message: string, assertive = false) => {
      if (liveRegionRef.current) {
        // Clear any pending timeout to prevent race conditions
        if (announceTimeoutRef.current) {
          clearTimeout(announceTimeoutRef.current)
        }

        liveRegionRef.current.setAttribute(
          'aria-live',
          assertive ? 'assertive' : 'polite'
        )
        liveRegionRef.current.textContent = message

        // Clear after a delay to allow re-announcement of same message
        announceTimeoutRef.current = setTimeout(() => {
          if (liveRegionRef.current) {
            liveRegionRef.current.textContent = ''
          }
        }, 1000)
      }
    },
    []
  )

  // Cleanup announcement timeout on unmount
  React.useEffect(() => {
    return () => {
      if (announceTimeoutRef.current) {
        clearTimeout(announceTimeoutRef.current)
      }
    }
  }, [])

  const value = React.useMemo(
    () => ({
      state,
      dispatch,
      registerShortcut,
      setScope,
      formatShortcut,
      getShortcutsByCategory,
      announceToScreenReader,
    }),
    [
      state,
      registerShortcut,
      setScope,
      formatShortcut,
      getShortcutsByCategory,
      announceToScreenReader,
    ]
  )

  return (
    <KeyboardNavigationContext.Provider value={value}>
      {children}
      {/* Screen reader live region */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />
      {/* Sequence indicator */}
      {state.sequenceBuffer.length > 0 && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-150"
          role="status"
          aria-live="polite"
        >
          <span className="text-sm font-medium">
            {state.sequenceBuffer.join(' ')}
            <span className="animate-pulse ml-1">_</span>
          </span>
        </div>
      )}
    </KeyboardNavigationContext.Provider>
  )
}
