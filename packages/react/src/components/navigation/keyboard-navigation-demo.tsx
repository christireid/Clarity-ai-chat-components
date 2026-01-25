'use client'

/**
 * Keyboard Navigation Demo
 *
 * A comprehensive demo showcasing all keyboard navigation features.
 * Use this as a reference for implementing keyboard navigation in your app.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { useReducedMotion } from '@/hooks/accessibility/use-reduced-motion'
import {
  KeyboardNavigationProvider,
  useKeyboardNavigation,
  useVimNavigation,
  useIsMac,
  defaultChatShortcuts,
} from '../../hooks/keyboard/use-keyboard-navigation'
import { SkipLinks, Landmark } from './skip-links'
import { FocusIndicator } from './focus-indicator'
import { KeyboardShortcutsModal } from './keyboard-shortcuts-modal'
import { ContextualKeyboardHints, WithShortcut } from './keyboard-hints-overlay'
import {
  CommandPaletteEnhanced,
  type CommandAction,
} from './command-palette-enhanced'

// ============================================================================
// Demo Messages
// ============================================================================

interface DemoMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const demoMessages: DemoMessage[] = [
  { id: '1', role: 'user', content: 'Hello! Can you help me with something?' },
  {
    id: '2',
    role: 'assistant',
    content:
      "Of course! I'd be happy to help. What do you need assistance with?",
  },
  {
    id: '3',
    role: 'user',
    content: 'I want to learn about keyboard navigation.',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      'Great choice! Keyboard navigation improves accessibility and productivity. Here are some tips:\n\n1. Use Tab to move between focusable elements\n2. Use j/k for vim-style list navigation\n3. Press ? to see all shortcuts\n4. Use Cmd/Ctrl+K for the command palette',
  },
  { id: '5', role: 'user', content: "That's very helpful, thank you!" },
  {
    id: '6',
    role: 'assistant',
    content:
      "You're welcome! Feel free to explore the keyboard shortcuts. Try pressing ? to see all available shortcuts, or hold Alt to see contextual hints.",
  },
]

// ============================================================================
// Demo Commands
// ============================================================================

const createDemoCommands = (handlers: {
  onNewChat: () => void
  onCopyMessage: () => void
  onToggleTheme: () => void
  onOpenSettings: () => void
}): CommandAction[] => [
  {
    id: 'new-chat',
    label: 'New Chat',
    description: 'Start a new conversation',
    shortcut: 'mod+n',
    category: 'Chat',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    onSelect: handlers.onNewChat,
  },
  {
    id: 'copy-last',
    label: 'Copy Last Response',
    description: 'Copy the last assistant message',
    shortcut: 'mod+shift+c',
    category: 'Chat',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    onSelect: handlers.onCopyMessage,
  },
  {
    id: 'toggle-theme',
    label: 'Toggle Theme',
    description: 'Switch between light and dark mode',
    shortcut: 'mod+shift+l',
    category: 'Appearance',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
    onSelect: handlers.onToggleTheme,
  },
  {
    id: 'settings',
    label: 'Open Settings',
    description: 'Configure your preferences',
    shortcut: 'mod+,',
    category: 'Navigation',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    onSelect: handlers.onOpenSettings,
  },
  {
    id: 'go-navigation',
    label: 'Go to...',
    description: 'Navigate to different sections',
    category: 'Navigation',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 5l7 7-7 7M5 5l7 7-7 7"
        />
      </svg>
    ),
    onSelect: () => {},
    children: [
      {
        id: 'go-home',
        label: 'Home',
        shortcut: 'g h',
        category: 'Navigation',
        onSelect: () => console.log('Go to home'),
      },
      {
        id: 'go-settings',
        label: 'Settings',
        shortcut: 'g s',
        category: 'Navigation',
        onSelect: () => console.log('Go to settings'),
      },
      {
        id: 'go-history',
        label: 'Chat History',
        shortcut: 'g c',
        category: 'Navigation',
        onSelect: () => console.log('Go to history'),
      },
    ],
  },
]

// ============================================================================
// Message Item Component
// ============================================================================

interface MessageItemProps {
  message: DemoMessage
  isFocused: boolean
  itemProps: ReturnType<ReturnType<typeof useVimNavigation>['getItemProps']>
}

function MessageItem({ message, isFocused, itemProps }: MessageItemProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      {...itemProps}
      className={cn(
        'p-4 rounded-lg transition-all duration-150 outline-none',
        message.role === 'user' ? 'bg-primary/10 ml-8' : 'bg-muted/50 mr-8',
        isFocused && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      tabIndex={itemProps.tabIndex}
      role="article"
      aria-label={`Message from ${message.role}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
            message.role === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted-foreground/20 text-muted-foreground'
          )}
        >
          {message.role === 'user' ? 'U' : 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-muted-foreground mb-1 capitalize">
            {message.role}
          </div>
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Inner Demo Component (uses context)
// ============================================================================

function KeyboardNavigationDemoInner() {
  const prefersReducedMotion = useReducedMotion()
  const [showShortcuts, setShowShortcuts] = React.useState(false)
  const [showCommandPalette, setShowCommandPalette] = React.useState(false)
  const [notification, setNotification] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const { registerShortcut, state, announceToScreenReader } =
    useKeyboardNavigation()
  const isMac = useIsMac()

  // Vim navigation for messages
  const { focusedIndex, getItemProps, navigate } = useVimNavigation({
    items: demoMessages,
    onSelect: (message) => {
      setNotification(`Selected: "${message.content.slice(0, 50)}..."`)
      announceToScreenReader(`Selected message from ${message.role}`)
    },
    onFocus: (message) => {
      announceToScreenReader(`Focused message from ${message.role}`)
    },
    scope: 'messages',
  })

  // Register global shortcuts
  React.useEffect(() => {
    const unsubscribers = [
      registerShortcut({
        id: 'demo-show-shortcuts',
        keys: ['?', 'shift+/'],
        description: 'Show keyboard shortcuts',
        category: 'Help',
        handler: () => setShowShortcuts(true),
        priority: 100,
      }),
      registerShortcut({
        id: 'demo-command-palette',
        keys: 'mod+k',
        description: 'Open command palette',
        category: 'Navigation',
        handler: () => setShowCommandPalette(true),
        priority: 100,
      }),
      registerShortcut({
        id: 'demo-focus-input',
        keys: ['i', '/'],
        description: 'Focus input',
        category: 'Chat',
        handler: () => inputRef.current?.focus(),
        priority: 80,
      }),
      registerShortcut({
        id: 'demo-escape',
        keys: 'escape',
        description: 'Close dialogs',
        category: 'General',
        handler: () => {
          setShowShortcuts(false)
          setShowCommandPalette(false)
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
        },
        enableInInput: true,
        priority: 100,
      }),
    ]

    return () => unsubscribers.forEach((u) => u())
  }, [registerShortcut])

  // Auto-hide notification
  React.useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000)
      return () => clearTimeout(timeout)
    }
    return undefined
  }, [notification])

  const commands = createDemoCommands({
    onNewChat: () => setNotification('New chat created!'),
    onCopyMessage: () => setNotification('Message copied!'),
    onToggleTheme: () => setNotification('Theme toggled!'),
    onOpenSettings: () => setNotification('Opening settings...'),
  })

  // Convert shortcuts to modal format
  const shortcutItems = React.useMemo(() => {
    return Array.from(state.shortcuts.values()).map((s) => ({
      id: s.id,
      keys: s.keys,
      description: s.description,
      category: s.category,
    }))
  }, [state.shortcuts])

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Links */}
      <SkipLinks />

      {/* Focus Indicator */}
      <FocusIndicator enabled keyboardOnly />

      {/* Contextual Hints */}
      <ContextualKeyboardHints enabled />

      {/* Header */}
      <Landmark id="navigation" role="navigation" aria-label="Main navigation">
        <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-bold">Keyboard Navigation Demo</h1>
            <div className="flex items-center gap-2">
              <WithShortcut shortcut="mod+k" description="Search">
                <button
                  onClick={() => setShowCommandPalette(true)}
                  className="px-3 py-1.5 text-sm bg-muted rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
                  data-shortcut="mod+k"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Search</span>
                  <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs bg-background rounded border">
                    {isMac ? '⌘K' : 'Ctrl+K'}
                  </kbd>
                </button>
              </WithShortcut>
              <WithShortcut shortcut="?" description="Help">
                <button
                  onClick={() => setShowShortcuts(true)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  aria-label="Keyboard shortcuts"
                  data-shortcut="?"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </WithShortcut>
            </div>
          </div>
        </header>
      </Landmark>

      {/* Main Content */}
      <Landmark id="main-content" role="main" aria-label="Chat messages">
        <main className="max-w-4xl mx-auto px-4 py-6">
          {/* Instructions */}
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h2 className="font-semibold mb-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Try these keyboard shortcuts
            </h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">j</kbd>{' '}
                /{' '}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">k</kbd>{' '}
                - Navigate messages
              </li>
              <li>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">?</kbd>{' '}
                - Show all shortcuts
              </li>
              <li>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  Cmd/Ctrl+K
                </kbd>{' '}
                - Command palette
              </li>
              <li>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  g g
                </kbd>{' '}
                - Go to first message
              </li>
              <li>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">i</kbd>{' '}
                or{' '}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">/</kbd>{' '}
                - Focus input
              </li>
              <li>
                Hold{' '}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  Alt
                </kbd>{' '}
                to see contextual hints
              </li>
            </ul>
          </div>

          {/* Messages */}
          <div
            id="chat-messages"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            className="space-y-4 mb-6"
          >
            {demoMessages.map((message, index) => (
              <MessageItem
                key={message.id}
                message={message}
                isFocused={focusedIndex === index}
                itemProps={getItemProps(index)}
              />
            ))}
          </div>

          {/* Sequence Indicator */}
          {state.sequenceBuffer.length > 0 && (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-foreground text-background rounded-lg shadow-lg text-sm font-medium">
              {state.sequenceBuffer.join(' ')}
              <span className="animate-pulse ml-1">_</span>
            </div>
          )}
        </main>
      </Landmark>

      {/* Chat Input */}
      <Landmark id="chat-input" role="complementary" aria-label="Message input">
        <div className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message... (Press i or / to focus)"
                className="flex-1 px-4 py-2.5 bg-muted/50 border border-border/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    setNotification('Message sent!')
                  }
                }}
              />
              <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Send
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press <kbd className="px-1 bg-muted rounded">Enter</kbd> to send,{' '}
              <kbd className="px-1 bg-muted rounded">Escape</kbd> to blur
            </p>
          </div>
        </div>
      </Landmark>

      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? false : { opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-foreground text-background rounded-lg shadow-lg text-sm font-medium"
        >
          {notification}
        </motion.div>
      )}

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        shortcuts={shortcutItems}
      />

      {/* Command Palette */}
      <CommandPaletteEnhanced
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        commands={commands}
        enableRecents
      />
    </div>
  )
}

// ============================================================================
// Main Demo Component
// ============================================================================

export function KeyboardNavigationDemo() {
  return (
    <KeyboardNavigationProvider
      defaultShortcuts={defaultChatShortcuts}
      warnOnConflicts
    >
      <KeyboardNavigationDemoInner />
    </KeyboardNavigationProvider>
  )
}

KeyboardNavigationDemo.displayName = 'KeyboardNavigationDemo'
