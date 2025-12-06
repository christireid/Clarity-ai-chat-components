'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface UseCommandPaletteOptions {
  /**
   * Initial open state
   * @default false
   */
  defaultOpen?: boolean

  /**
   * Keyboard shortcut to toggle the command palette
   * Uses 'mod' for Cmd on Mac and Ctrl on Windows/Linux
   *
   * Format: 'mod+k', 'ctrl+shift+p', 'alt+n'
   *
   * Special key names: 'space', 'plus', 'minus', 'comma', 'period',
   * 'slash', 'backslash', 'bracketleft', 'bracketright', 'semicolon',
   * 'quote', 'backquote', 'equals'
   *
   * @default 'mod+k'
   */
  shortcut?: string

  /**
   * Whether the keyboard shortcut is enabled
   * @default true
   */
  shortcutEnabled?: boolean

  /**
   * Callback when the command palette opens
   */
  onOpen?: () => void

  /**
   * Callback when the command palette closes
   */
  onClose?: () => void

  /**
   * Callback when the command palette toggles
   */
  onToggle?: (isOpen: boolean) => void

  /**
   * Whether to prevent the shortcut from working when focused on input elements
   * @default false
   */
  preventInInputs?: boolean
}

export interface UseCommandPaletteReturn {
  /**
   * Whether the command palette is open
   */
  isOpen: boolean

  /**
   * Open the command palette
   */
  open: () => void

  /**
   * Close the command palette
   */
  close: () => void

  /**
   * Toggle the command palette open/closed
   */
  toggle: () => void

  /**
   * Set the open state directly
   */
  setOpen: (open: boolean) => void

  /**
   * The keyboard shortcut string formatted for display
   * Returns platform-aware string (e.g., "⌘K" on Mac, "Ctrl+K" on Windows)
   */
  shortcutDisplay: string
}

/**
 * Detect if running on Mac platform
 * Uses a safe check that works in SSR and browser
 */
function detectIsMac(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }
  // Modern approach: navigator.userAgentData (Chrome 90+)
  // Fallback: navigator.platform (deprecated but widely supported)
  const platform =
    (navigator as { userAgentData?: { platform?: string } }).userAgentData
      ?.platform || navigator.platform
  return platform?.toLowerCase().includes('mac') ?? false
}

/**
 * Map of friendly key names to actual KeyboardEvent.key values
 * Handles cases where the intuitive name differs from the event key
 */
const KEY_NAME_MAP: Record<string, string> = {
  space: ' ',
  plus: '+',
  minus: '-',
  equals: '=',
  comma: ',',
  period: '.',
  slash: '/',
  backslash: '\\',
  bracketleft: '[',
  bracketright: ']',
  semicolon: ';',
  quote: "'",
  backquote: '`',
}

/**
 * Validate and parse a shortcut string into its component parts
 * Returns null if the shortcut is invalid
 *
 * Supports special key names: space, plus, minus, enter, escape, tab, etc.
 */
function parseShortcut(
  shortcut: string
): { modifiers: string[]; key: string } | null {
  if (!shortcut || typeof shortcut !== 'string') {
    return null
  }

  const parts = shortcut.toLowerCase().trim().split('+')

  // Must have at least a key
  if (parts.length === 0) {
    return null
  }

  let key = parts.pop() || ''

  // Key must be non-empty
  if (!key || key.length === 0) {
    return null
  }

  // Map friendly names to actual key values
  if (KEY_NAME_MAP[key]) {
    key = KEY_NAME_MAP[key]
  }

  // Validate modifiers
  const validModifiers = ['mod', 'ctrl', 'alt', 'shift', 'meta']
  for (const mod of parts) {
    if (!validModifiers.includes(mod)) {
      console.warn(
        `useCommandPalette: Invalid modifier "${mod}" in shortcut "${shortcut}". Valid modifiers: ${validModifiers.join(', ')}`
      )
      return null
    }
  }

  return { modifiers: parts, key }
}

/**
 * Check if a keyboard event matches the shortcut
 */
function matchesShortcut(
  event: KeyboardEvent,
  shortcut: string,
  isMac: boolean
): boolean {
  const parsed = parseShortcut(shortcut)
  if (!parsed) return false

  const { modifiers, key } = parsed

  // Check if the key matches (case-insensitive)
  if (event.key.toLowerCase() !== key) return false

  // Check modifiers
  const needsCtrl = modifiers.includes('ctrl')
  const needsMod = modifiers.includes('mod')
  const needsMeta = modifiers.includes('meta')
  const needsAlt = modifiers.includes('alt')
  const needsShift = modifiers.includes('shift')

  // 'mod' means Cmd on Mac, Ctrl on Windows/Linux
  const modKey = isMac ? event.metaKey : event.ctrlKey

  if (needsMod && !modKey) return false
  if (needsCtrl && !event.ctrlKey) return false
  if (needsMeta && !event.metaKey) return false
  if (needsAlt && !event.altKey) return false
  if (needsShift && !event.shiftKey) return false

  // Make sure we don't have extra modifiers pressed
  const hasCtrlOrCmd = event.ctrlKey || event.metaKey
  const expectedCtrlOrCmd = needsMod || needsCtrl || needsMeta

  if (hasCtrlOrCmd !== expectedCtrlOrCmd) return false
  if (event.altKey !== needsAlt) return false
  if (event.shiftKey !== needsShift) return false

  return true
}

/**
 * Format a shortcut string for display
 */
function formatShortcutDisplay(shortcut: string, isMac: boolean): string {
  const parsed = parseShortcut(shortcut)
  if (!parsed) return shortcut // Return raw string if invalid

  const { modifiers, key } = parsed
  const formattedParts: string[] = []

  for (const mod of modifiers) {
    switch (mod) {
      case 'mod':
        formattedParts.push(isMac ? '⌘' : 'Ctrl')
        break
      case 'ctrl':
        formattedParts.push(isMac ? '⌃' : 'Ctrl')
        break
      case 'meta':
        formattedParts.push(isMac ? '⌘' : 'Win')
        break
      case 'alt':
        formattedParts.push(isMac ? '⌥' : 'Alt')
        break
      case 'shift':
        formattedParts.push(isMac ? '⇧' : 'Shift')
        break
    }
  }

  formattedParts.push(key.toUpperCase())

  return isMac ? formattedParts.join('') : formattedParts.join('+')
}

/**
 * Hook to manage command palette state with keyboard shortcut support
 *
 * Features:
 * - Toggle behavior (Cmd+K opens if closed, closes if open)
 * - Platform-aware shortcuts (Cmd on Mac, Ctrl on Windows/Linux)
 * - Configurable shortcut key
 * - Callbacks for open/close/toggle events
 *
 * @warning If you use multiple instances of this hook with the same shortcut,
 * they will ALL respond to the keyboard event. Use different shortcuts or
 * disable shortcuts on secondary instances with `shortcutEnabled: false`.
 *
 * @example
 * ```tsx
 * const { isOpen, toggle, close, shortcutDisplay } = useCommandPalette()
 *
 * return (
 *   <>
 *     <button onClick={toggle}>
 *       Command Palette ({shortcutDisplay})
 *     </button>
 *     <CommandPalette
 *       items={commands}
 *       open={isOpen}
 *       onClose={close}
 *     />
 *   </>
 * )
 * ```
 *
 * @example
 * ```tsx
 * // With callbacks
 * const { isOpen, close } = useCommandPalette({
 *   onOpen: () => console.log('Opened'),
 *   onClose: () => console.log('Closed'),
 *   shortcut: 'mod+p', // Use Cmd+P instead of Cmd+K
 * })
 * ```
 */
export function useCommandPalette(
  options: UseCommandPaletteOptions = {}
): UseCommandPaletteReturn {
  const {
    defaultOpen = false,
    shortcut = 'mod+k',
    shortcutEnabled = true,
    onOpen,
    onClose,
    onToggle,
    preventInInputs = false,
  } = options

  const [isOpen, setIsOpenState] = useState(defaultOpen)

  // Detect platform once on mount, with SSR-safe initial value
  // Use lazy initialization to avoid hydration mismatch
  const [isMac, setIsMac] = useState(() => {
    // During SSR or initial render, return false
    // This will be corrected immediately on mount
    if (typeof window === 'undefined') return false
    return detectIsMac()
  })

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true)

  // Use refs for callbacks to avoid re-creating the effect
  const onOpenRef = useRef(onOpen)
  const onCloseRef = useRef(onClose)
  const onToggleRef = useRef(onToggle)

  useEffect(() => {
    onOpenRef.current = onOpen
    onCloseRef.current = onClose
    onToggleRef.current = onToggle
  }, [onOpen, onClose, onToggle])

  // Detect platform on mount (handles SSR hydration) and cleanup on unmount
  useEffect(() => {
    setIsMac(detectIsMac())

    return () => {
      isMountedRef.current = false
    }
  }, [])

  const setOpen = useCallback((open: boolean) => {
    if (!isMountedRef.current) return

    setIsOpenState((prev) => {
      if (prev === open) return prev

      if (open) {
        onOpenRef.current?.()
      } else {
        onCloseRef.current?.()
      }
      onToggleRef.current?.(open)

      return open
    })
  }, [])

  const open = useCallback(() => setOpen(true), [setOpen])
  const close = useCallback(() => setOpen(false), [setOpen])

  const toggle = useCallback(() => {
    if (!isMountedRef.current) return

    setIsOpenState((prev) => {
      const newState = !prev
      if (newState) {
        onOpenRef.current?.()
      } else {
        onCloseRef.current?.()
      }
      onToggleRef.current?.(newState)
      return newState
    })
  }, [])

  // Keyboard shortcut listener
  useEffect(() => {
    if (!shortcutEnabled) return

    // Validate shortcut early
    const parsed = parseShortcut(shortcut)
    if (!parsed) {
      console.warn(
        `useCommandPalette: Invalid shortcut "${shortcut}". Keyboard shortcut disabled.`
      )
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't process if component unmounted
      if (!isMountedRef.current) return

      // Optionally prevent in input elements
      if (preventInInputs) {
        const target = event.target as HTMLElement
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        if (isInput) return
      }

      if (matchesShortcut(event, shortcut, isMac)) {
        event.preventDefault()
        event.stopPropagation() // Prevent other listeners from firing
        toggle()
      }
    }

    // Use capture phase to handle before other listeners
    document.addEventListener('keydown', handleKeyDown, { capture: true })
    return () =>
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [shortcutEnabled, shortcut, isMac, toggle, preventInInputs])

  const shortcutDisplay = formatShortcutDisplay(shortcut, isMac)

  return {
    isOpen,
    open,
    close,
    toggle,
    setOpen,
    shortcutDisplay,
  }
}
