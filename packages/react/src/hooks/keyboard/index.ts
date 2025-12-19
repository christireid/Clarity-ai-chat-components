/**
 * Keyboard Hooks
 *
 * Hooks for keyboard navigation, shortcuts, and command palette.
 */

export {
  KeyboardNavigationProvider,
  useKeyboardNavigation,
  useKeyboardShortcut,
  useVimNavigation,
  useFocusScope,
  useKeyboardHintsOnModifier,
  useIsMac,
  formatShortcutDisplay,
  defaultChatShortcuts,
  type KeyboardShortcutConfig,
  type ShortcutConflict,
  type KeyboardNavigationState,
  type KeyboardNavigationProviderProps,
  type UseVimNavigationOptions,
} from './use-keyboard-navigation'

export {
  useKeyboardShortcuts,
  useShortcutDisplay,
  useScopedKeyboardShortcuts,
  useFocusedKeyboardShortcuts,
  KeyboardShortcutsHelp,
  type KeyboardShortcut,
  type KeyboardShortcutsHelpProps,
  type ScopedKeyboardShortcutsOptions,
} from './use-keyboard-shortcuts'

export {
  useChatKeyboardNavigation,
  useFocusInputShortcut,
  useEscapeToClose,
  useQuickActions,
  type ChatKeyboardNavigationOptions,
  type ChatKeyboardNavigationReturn,
  type QuickAction,
} from './use-chat-keyboard-navigation'

export * from './use-command-palette'
// NOTE: Commented out due to missing dependencies
// export * from './use-command-palette-commands'
