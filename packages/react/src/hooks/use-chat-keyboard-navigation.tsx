'use client'

/**
 * Chat-Specific Keyboard Navigation
 *
 * A comprehensive hook that integrates all keyboard navigation features
 * specifically tailored for chat interfaces.
 *
 * Features:
 * - Message navigation with j/k keys
 * - Quick actions (copy, regenerate, delete)
 * - Focus management between chat areas
 * - Smart context-aware shortcuts
 */

import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import {
  useKeyboardNavigation,
  useVimNavigation,
  useFocusScope,
  type KeyboardShortcutConfig,
} from './use-keyboard-navigation'

// ============================================================================
// Types
// ============================================================================

export interface ChatKeyboardNavigationOptions {
  /** Messages array */
  messages: Message[]
  /** Callback to scroll to message */
  onScrollToMessage?: (message: Message, index: number) => void
  /** Callback to copy message content */
  onCopyMessage?: (message: Message) => void
  /** Callback to regenerate message */
  onRegenerateMessage?: (message: Message) => void
  /** Callback to delete message */
  onDeleteMessage?: (message: Message) => void
  /** Callback to edit message */
  onEditMessage?: (message: Message) => void
  /** Callback to focus chat input */
  onFocusInput?: () => void
  /** Callback to send message */
  onSendMessage?: () => void
  /** Callback to create new chat */
  onNewChat?: () => void
  /** Callback to toggle sidebar */
  onToggleSidebar?: () => void
  /** Callback to open settings */
  onOpenSettings?: () => void
  /** Callback to open command palette */
  onOpenCommandPalette?: () => void
  /** Callback to show shortcuts help */
  onShowShortcutsHelp?: () => void
  /** Whether keyboard navigation is enabled */
  enabled?: boolean
  /** Scope for shortcuts */
  scope?: string
}

export interface ChatKeyboardNavigationReturn {
  /** Currently focused message index */
  focusedMessageIndex: number
  /** Set focused message index */
  setFocusedMessageIndex: (index: number) => void
  /** Get props for a message element */
  getMessageProps: (index: number) => {
    ref: (el: HTMLElement | null) => void
    tabIndex: number
    'data-focused': boolean
    onFocus: () => void
    onClick: () => void
  }
  /** Ref for the messages container */
  messagesContainerRef: React.RefObject<HTMLElement>
  /** Ref for the chat input */
  inputRef: React.RefObject<HTMLElement>
  /** Navigate to next message */
  navigateNext: () => void
  /** Navigate to previous message */
  navigatePrev: () => void
  /** Navigate to first message */
  navigateFirst: () => void
  /** Navigate to last message */
  navigateLast: () => void
  /** All registered shortcuts for help modal */
  shortcuts: KeyboardShortcutConfig[]
}

// ============================================================================
// Hook
// ============================================================================

export function useChatKeyboardNavigation({
  messages,
  onScrollToMessage,
  onCopyMessage,
  onRegenerateMessage,
  onDeleteMessage,
  onEditMessage,
  onFocusInput,
  onSendMessage,
  onNewChat,
  onToggleSidebar,
  onOpenSettings,
  onOpenCommandPalette,
  onShowShortcutsHelp,
  enabled = true,
  scope = 'chat',
}: ChatKeyboardNavigationOptions): ChatKeyboardNavigationReturn {
  const { registerShortcut, setScope, announceToScreenReader } =
    useKeyboardNavigation()

  const inputRef = React.useRef<HTMLElement>(null)

  // Track all shortcuts for help modal
  const [shortcuts, setShortcuts] = React.useState<KeyboardShortcutConfig[]>([])

  // Use vim navigation for messages
  const {
    focusedIndex,
    setFocusedIndex,
    getItemProps,
    navigate,
    itemRefs,
  } = useVimNavigation({
    items: messages,
    onSelect: (message) => {
      // Default action on Enter - copy the message
      onCopyMessage?.(message)
    },
    onFocus: (message, index) => {
      onScrollToMessage?.(message, index)
      announceToScreenReader(
        `Message ${index + 1} of ${messages.length} from ${message.role}`,
        false
      )
    },
    enabled,
    scope: `${scope}-messages`,
  })

  // Focus scope ref for messages container
  const messagesContainerRef = useFocusScope(`${scope}-messages`)

  // Register chat-specific shortcuts
  React.useEffect(() => {
    if (!enabled) return

    const chatShortcuts: KeyboardShortcutConfig[] = [
      // Navigation
      {
        id: 'chat-focus-input',
        keys: ['i', '/'],
        description: 'Focus message input',
        category: 'Chat',
        handler: () => {
          onFocusInput?.()
          inputRef.current?.focus()
        },
        priority: 80,
      },
      {
        id: 'chat-send',
        keys: 'mod+enter',
        description: 'Send message',
        category: 'Chat',
        handler: () => onSendMessage?.(),
        enableInInput: true,
        priority: 100,
      },
      {
        id: 'chat-new',
        keys: 'mod+n',
        description: 'New chat',
        category: 'Chat',
        handler: () => onNewChat?.(),
        priority: 70,
      },

      // Message actions
      {
        id: 'chat-copy-message',
        keys: ['c', 'mod+c'],
        description: 'Copy focused message',
        category: 'Messages',
        handler: () => {
          if (focusedIndex >= 0 && messages[focusedIndex]) {
            onCopyMessage?.(messages[focusedIndex])
            announceToScreenReader('Message copied to clipboard', true)
          }
        },
        scope: `${scope}-messages`,
        priority: 60,
      },
      {
        id: 'chat-regenerate',
        keys: 'r',
        description: 'Regenerate focused response',
        category: 'Messages',
        handler: () => {
          if (focusedIndex >= 0 && messages[focusedIndex]) {
            const message = messages[focusedIndex]
            if (message.role === 'assistant') {
              onRegenerateMessage?.(message)
              announceToScreenReader('Regenerating response', true)
            }
          }
        },
        scope: `${scope}-messages`,
        priority: 60,
      },
      {
        id: 'chat-edit-message',
        keys: 'e',
        description: 'Edit focused message',
        category: 'Messages',
        handler: () => {
          if (focusedIndex >= 0 && messages[focusedIndex]) {
            onEditMessage?.(messages[focusedIndex])
          }
        },
        scope: `${scope}-messages`,
        priority: 60,
      },
      {
        id: 'chat-delete-message',
        keys: ['d', 'delete'],
        description: 'Delete focused message',
        category: 'Messages',
        handler: () => {
          if (focusedIndex >= 0 && messages[focusedIndex]) {
            onDeleteMessage?.(messages[focusedIndex])
            announceToScreenReader('Message deleted', true)
          }
        },
        scope: `${scope}-messages`,
        priority: 60,
      },

      // Global actions
      {
        id: 'chat-toggle-sidebar',
        keys: 'mod+b',
        description: 'Toggle sidebar',
        category: 'Navigation',
        handler: () => onToggleSidebar?.(),
        priority: 50,
      },
      {
        id: 'chat-settings',
        keys: 'mod+,',
        description: 'Open settings',
        category: 'Navigation',
        handler: () => onOpenSettings?.(),
        priority: 50,
      },
      {
        id: 'chat-command-palette',
        keys: 'mod+k',
        description: 'Open command palette',
        category: 'Navigation',
        handler: () => onOpenCommandPalette?.(),
        priority: 100,
      },
      {
        id: 'chat-shortcuts-help',
        keys: ['?', 'shift+/'],
        description: 'Show keyboard shortcuts',
        category: 'Help',
        handler: () => onShowShortcutsHelp?.(),
        priority: 100,
      },

      // Scroll shortcuts
      {
        id: 'chat-scroll-bottom',
        keys: ['end', 'mod+down', 'shift+g'],
        description: 'Scroll to bottom',
        category: 'Navigation',
        handler: () => {
          if (messages.length > 0) {
            setFocusedIndex(messages.length - 1)
            navigate('last')
          }
        },
        priority: 40,
      },
      {
        id: 'chat-scroll-top',
        keys: ['home', 'mod+up', 'g g'],
        description: 'Scroll to top',
        category: 'Navigation',
        handler: () => {
          if (messages.length > 0) {
            setFocusedIndex(0)
            navigate('first')
          }
        },
        priority: 40,
      },

      // Copy last assistant message
      {
        id: 'chat-copy-last-response',
        keys: 'mod+shift+c',
        description: 'Copy last assistant message',
        category: 'Chat',
        handler: () => {
          const lastAssistant = [...messages]
            .reverse()
            .find((m) => m.role === 'assistant')
          if (lastAssistant) {
            onCopyMessage?.(lastAssistant)
            announceToScreenReader('Last response copied to clipboard', true)
          }
        },
        priority: 70,
      },

      // Escape to blur/exit
      {
        id: 'chat-escape',
        keys: 'escape',
        description: 'Exit current action',
        category: 'General',
        handler: () => {
          // Blur the currently focused element
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
          setFocusedIndex(-1)
          setScope(null)
        },
        enableInInput: true,
        priority: 100,
      },
    ]

    // Register all shortcuts
    const unsubscribers = chatShortcuts.map((s) => registerShortcut(s))

    // Store shortcuts for help modal
    setShortcuts(chatShortcuts)

    return () => {
      unsubscribers.forEach((u) => u())
    }
  }, [
    enabled,
    scope,
    messages,
    focusedIndex,
    registerShortcut,
    setScope,
    setFocusedIndex,
    navigate,
    announceToScreenReader,
    onCopyMessage,
    onRegenerateMessage,
    onDeleteMessage,
    onEditMessage,
    onFocusInput,
    onSendMessage,
    onNewChat,
    onToggleSidebar,
    onOpenSettings,
    onOpenCommandPalette,
    onShowShortcutsHelp,
  ])

  // Convert vim navigation props to message props
  const getMessageProps = React.useCallback(
    (index: number) => {
      const props = getItemProps(index)
      return {
        ...props,
        role: 'listitem' as const,
        'aria-label': `Message ${index + 1} from ${messages[index]?.role || 'unknown'}`,
      }
    },
    [getItemProps, messages]
  )

  return {
    focusedMessageIndex: focusedIndex,
    setFocusedMessageIndex: setFocusedIndex,
    getMessageProps,
    messagesContainerRef: messagesContainerRef as React.RefObject<HTMLElement>,
    inputRef,
    navigateNext: () => navigate('next'),
    navigatePrev: () => navigate('prev'),
    navigateFirst: () => navigate('first'),
    navigateLast: () => navigate('last'),
    shortcuts,
  }
}

// ============================================================================
// Utility Hook: Focus Input on Shortcut
// ============================================================================

export function useFocusInputShortcut(
  inputRef: React.RefObject<HTMLElement | null>,
  shortcut: string = 'i'
) {
  const { registerShortcut } = useKeyboardNavigation()

  React.useEffect(() => {
    return registerShortcut({
      id: 'focus-input',
      keys: shortcut,
      description: 'Focus input',
      category: 'Navigation',
      handler: () => {
        inputRef.current?.focus()
      },
      priority: 80,
    })
  }, [inputRef, shortcut, registerShortcut])
}

// ============================================================================
// Utility Hook: Escape to Close/Blur
// ============================================================================

export function useEscapeToClose(
  onClose: () => void,
  enabled: boolean = true
) {
  const { registerShortcut } = useKeyboardNavigation()

  React.useEffect(() => {
    if (!enabled) return

    return registerShortcut({
      id: 'escape-close',
      keys: 'escape',
      description: 'Close',
      category: 'General',
      handler: onClose,
      enableInInput: true,
      priority: 100,
    })
  }, [enabled, onClose, registerShortcut])
}

// ============================================================================
// Utility Hook: Quick Actions
// ============================================================================

export interface QuickAction {
  id: string
  shortcut: string
  description: string
  action: () => void
}

export function useQuickActions(actions: QuickAction[]) {
  const { registerShortcut } = useKeyboardNavigation()

  React.useEffect(() => {
    const unsubscribers = actions.map((action) =>
      registerShortcut({
        id: action.id,
        keys: action.shortcut,
        description: action.description,
        category: 'Quick Actions',
        handler: action.action,
        priority: 50,
      })
    )

    return () => unsubscribers.forEach((u) => u())
  }, [actions, registerShortcut])
}
