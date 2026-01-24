import * as React from 'react'
import type {
  KeyboardNavigationState,
  KeyboardNavigationAction,
  KeyboardShortcutConfig,
} from './types'

/**
 * React Context for Keyboard Navigation
 */

export interface KeyboardNavigationContextValue {
  state: KeyboardNavigationState
  dispatch: React.Dispatch<KeyboardNavigationAction>
  registerShortcut: (config: KeyboardShortcutConfig) => () => void
  setScope: (scope: string | null) => void
  formatShortcut: (pattern: string) => string
  getShortcutsByCategory: () => Map<string, KeyboardShortcutConfig[]>
  announceToScreenReader: (message: string, assertive?: boolean) => void
}

export const KeyboardNavigationContext = React.createContext<
  KeyboardNavigationContextValue | undefined
>(undefined)
