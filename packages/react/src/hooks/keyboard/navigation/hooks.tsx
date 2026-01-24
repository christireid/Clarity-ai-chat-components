'use client'

import * as React from 'react'
import { KeyboardNavigationContext } from './context'
import type { KeyboardShortcutConfig } from './types'

/**
 * Keyboard Navigation Hooks
 */

/**
 * Access the keyboard navigation context
 */
export function useKeyboardNavigation() {
  const context = React.useContext(KeyboardNavigationContext)
  if (!context) {
    throw new Error(
      'useKeyboardNavigation must be used within KeyboardNavigationProvider'
    )
  }
  return context
}

/**
 * Register a keyboard shortcut
 */
export function useKeyboardShortcut(
  config: Omit<KeyboardShortcutConfig, 'id'> & { id?: string }
) {
  const { registerShortcut } = useKeyboardNavigation()
  const idRef = React.useRef(
    config.id || `shortcut-${Math.random().toString(36).substr(2, 9)}`
  )

  // Use a ref to always have the latest handler - prevents stale closures
  const handlerRef = React.useRef(config.handler)
  React.useEffect(() => {
    handlerRef.current = config.handler
  }, [config.handler])

  // Stable handler that always calls the latest handler ref
  const stableHandler = React.useCallback((event: KeyboardEvent) => {
    handlerRef.current(event)
  }, [])

  React.useEffect(() => {
    return registerShortcut({
      ...config,
      handler: stableHandler,
      id: idRef.current,
    })
  }, [
    config.keys,
    config.enabled,
    config.scope,
    config.description,
    config.category,
    config.priority,
    config.enableInInput,
    config.preventDefault,
    stableHandler,
    registerShortcut,
  ])
}

/**
 * Vim-style list navigation hook
 */
export interface UseVimNavigationOptions<T> {
  items: T[]
  onSelect?: (item: T, index: number) => void
  onFocus?: (item: T, index: number) => void
  loop?: boolean
  orientation?: 'vertical' | 'horizontal'
  enabled?: boolean
  scope?: string
}

export function useVimNavigation<T>({
  items,
  onSelect,
  onFocus,
  loop = true,
  orientation = 'vertical',
  enabled = true,
  scope,
}: UseVimNavigationOptions<T>) {
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const { registerShortcut, setScope, announceToScreenReader } =
    useKeyboardNavigation()
  const itemRefs = React.useRef<(HTMLElement | null)[]>([])

  // Use refs for callbacks to prevent stale closures and unnecessary re-renders
  const callbacksRef = React.useRef({ onSelect, onFocus })
  React.useEffect(() => {
    callbacksRef.current = { onSelect, onFocus }
  }, [onSelect, onFocus])

  // Reset focusedIndex if it becomes out of bounds when items change
  React.useEffect(() => {
    if (focusedIndex >= items.length) {
      setFocusedIndex(items.length > 0 ? items.length - 1 : -1)
    }
  }, [items.length, focusedIndex])

  // Update refs array when items change
  React.useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length)
  }, [items.length])

  const navigate = React.useCallback(
    (direction: 'next' | 'prev' | 'first' | 'last') => {
      if (items.length === 0) return

      let newIndex: number
      switch (direction) {
        case 'next':
          newIndex = focusedIndex + 1
          if (newIndex >= items.length) {
            newIndex = loop ? 0 : items.length - 1
          }
          break
        case 'prev':
          newIndex = focusedIndex - 1
          if (newIndex < 0) {
            newIndex = loop ? items.length - 1 : 0
          }
          break
        case 'first':
          newIndex = 0
          break
        case 'last':
          newIndex = items.length - 1
          break
      }

      setFocusedIndex(newIndex)
      callbacksRef.current.onFocus?.(items[newIndex], newIndex)
      itemRefs.current[newIndex]?.focus()
      announceToScreenReader(`Item ${newIndex + 1} of ${items.length}`, false)
    },
    [items, focusedIndex, loop, announceToScreenReader]
  )

  // Register vim-style shortcuts
  React.useEffect(() => {
    if (!enabled) return

    const shortcuts: KeyboardShortcutConfig[] = [
      {
        id: `vim-nav-${scope}-j`,
        keys: orientation === 'vertical' ? 'j' : 'l',
        description: 'Next item',
        category: 'Navigation',
        handler: () => navigate('next'),
        scope,
        priority: 10,
      },
      {
        id: `vim-nav-${scope}-k`,
        keys: orientation === 'vertical' ? 'k' : 'h',
        description: 'Previous item',
        category: 'Navigation',
        handler: () => navigate('prev'),
        scope,
        priority: 10,
      },
      {
        id: `vim-nav-${scope}-down`,
        keys: orientation === 'vertical' ? 'arrowdown' : 'arrowright',
        description: 'Next item',
        category: 'Navigation',
        handler: () => navigate('next'),
        scope,
        priority: 10,
      },
      {
        id: `vim-nav-${scope}-up`,
        keys: orientation === 'vertical' ? 'arrowup' : 'arrowleft',
        description: 'Previous item',
        category: 'Navigation',
        handler: () => navigate('prev'),
        scope,
        priority: 10,
      },
      {
        id: `vim-nav-${scope}-g`,
        keys: 'g g',
        description: 'Go to first item',
        category: 'Navigation',
        handler: () => navigate('first'),
        scope,
        priority: 10,
      },
      {
        id: `vim-nav-${scope}-G`,
        keys: 'shift+g',
        description: 'Go to last item',
        category: 'Navigation',
        handler: () => navigate('last'),
        scope,
        priority: 10,
      },
      {
        id: `vim-nav-${scope}-home`,
        keys: 'home',
        description: 'Go to first item',
        category: 'Navigation',
        handler: () => navigate('first'),
        scope,
        priority: 10,
      },
      {
        id: `vim-nav-${scope}-end`,
        keys: 'end',
        description: 'Go to last item',
        category: 'Navigation',
        handler: () => navigate('last'),
        scope,
        priority: 10,
      },
      {
        id: `vim-nav-${scope}-enter`,
        keys: 'enter',
        description: 'Select item',
        category: 'Navigation',
        handler: () => {
          if (focusedIndex >= 0 && focusedIndex < items.length) {
            callbacksRef.current.onSelect?.(items[focusedIndex], focusedIndex)
          }
        },
        scope,
        priority: 10,
      },
    ]

    const unsubscribes = shortcuts.map((s) => registerShortcut(s))
    return () => unsubscribes.forEach((u) => u())
    // Note: onSelect is accessed via callbacksRef.current to prevent unnecessary re-registrations
  }, [
    enabled,
    scope,
    orientation,
    navigate,
    focusedIndex,
    items,
    registerShortcut,
  ])

  // Set scope when this navigation is active
  React.useEffect(() => {
    if (enabled && scope) {
      setScope(scope)
      return () => setScope(null)
    }
    return undefined
  }, [enabled, scope, setScope])

  const getItemProps = React.useCallback(
    (index: number) => ({
      ref: (el: HTMLElement | null) => {
        itemRefs.current[index] = el
      },
      tabIndex: focusedIndex === index ? 0 : -1,
      'data-focused': focusedIndex === index,
      onFocus: () => {
        setFocusedIndex(index)
        callbacksRef.current.onFocus?.(items[index], index)
      },
      onClick: () => {
        setFocusedIndex(index)
        callbacksRef.current.onSelect?.(items[index], index)
      },
    }),
    // Note: onFocus/onSelect accessed via callbacksRef.current
    [focusedIndex, items]
  )

  return {
    focusedIndex,
    setFocusedIndex,
    getItemProps,
    navigate,
    itemRefs,
  }
}

/**
 * Focus scope hook - sets the active scope when focused
 */
export function useFocusScope(scope: string) {
  const { setScope } = useKeyboardNavigation()
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleFocus = () => setScope(scope)
    const handleBlur = (e: FocusEvent) => {
      // Only clear scope if focus is leaving the element entirely
      if (!element.contains(e.relatedTarget as Node)) {
        setScope(null)
      }
    }

    element.addEventListener('focusin', handleFocus)
    element.addEventListener('focusout', handleBlur)

    return () => {
      element.removeEventListener('focusin', handleFocus)
      element.removeEventListener('focusout', handleBlur)
    }
  }, [scope, setScope])

  return ref
}

/**
 * Hook to show keyboard hints on long press of a modifier key
 */
export function useKeyboardHintsOnModifier(
  modifierKey: 'alt' | 'ctrl' | 'meta' = 'alt',
  delay = 500
) {
  const { dispatch, state } = useKeyboardNavigation()
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier =
        (modifierKey === 'alt' && e.key === 'Alt') ||
        (modifierKey === 'ctrl' && e.key === 'Control') ||
        (modifierKey === 'meta' && e.key === 'Meta')

      if (isModifier && !e.repeat) {
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'SET_HINTS', show: true })
        }, delay)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const isModifier =
        (modifierKey === 'alt' && e.key === 'Alt') ||
        (modifierKey === 'ctrl' && e.key === 'Control') ||
        (modifierKey === 'meta' && e.key === 'Meta')

      if (isModifier) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        if (state.showHints) {
          dispatch({ type: 'SET_HINTS', show: false })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [modifierKey, delay, dispatch, state.showHints])

  return state.showHints
}
