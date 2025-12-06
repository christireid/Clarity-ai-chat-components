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
 * Parse a shortcut string into its component parts
 */
function parseShortcut(shortcut: string): { modifiers: string[]; key: string } {
  const parts = shortcut.toLowerCase().split('+')
  const key = parts.pop() || ''
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
  const { modifiers, key } = parseShortcut(shortcut)

  // Check if the key matches
  if (event.key.toLowerCase() !== key) return false

  // Check modifiers
  const needsCtrl = modifiers.includes('ctrl')
  const needsMod = modifiers.includes('mod')
  const needsAlt = modifiers.includes('alt')
  const needsShift = modifiers.includes('shift')

  // 'mod' means Cmd on Mac, Ctrl on Windows/Linux
  const modKey = isMac ? event.metaKey : event.ctrlKey

  if (needsMod && !modKey) return false
  if (needsCtrl && !event.ctrlKey) return false
  if (needsAlt && !event.altKey) return false
  if (needsShift && !event.shiftKey) return false

  // Make sure we don't have extra modifiers
  const hasCtrlOrCmd = event.ctrlKey || event.metaKey
  const expectedCtrlOrCmd = needsMod || needsCtrl

  if (hasCtrlOrCmd !== expectedCtrlOrCmd) return false
  if (event.altKey !== needsAlt) return false
  if (event.shiftKey !== needsShift) return false

  return true
}

/**
 * Format a shortcut string for display
 */
function formatShortcutDisplay(shortcut: string, isMac: boolean): string {
  const { modifiers, key } = parseShortcut(shortcut)

  const formattedParts: string[] = []

  for (const mod of modifiers) {
    switch (mod) {
      case 'mod':
        formattedParts.push(isMac ? '⌘' : 'Ctrl')
        break
      case 'ctrl':
        formattedParts.push(isMac ? '⌃' : 'Ctrl')
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
  const [isMac, setIsMac] = useState(false)

  // Use refs for callbacks to avoid re-creating the effect
  const onOpenRef = useRef(onOpen)
  const onCloseRef = useRef(onClose)
  const onToggleRef = useRef(onToggle)

  useEffect(() => {
    onOpenRef.current = onOpen
    onCloseRef.current = onClose
    onToggleRef.current = onToggle
  }, [onOpen, onClose, onToggle])

  // Detect platform on mount
  useEffect(() => {
    setIsMac(
      typeof window !== 'undefined' &&
        navigator.platform.toLowerCase().includes('mac')
    )
  }, [])

  const setOpen = useCallback((open: boolean) => {
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

    const handleKeyDown = (event: KeyboardEvent) => {
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
        toggle()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
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
