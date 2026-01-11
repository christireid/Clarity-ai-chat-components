/**
 * Keyboard Shortcuts System
 *
 * Customizable keyboard shortcuts with help modal
 */

import * as React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
} from '../animations/constants'
import {
  getMotionSafeValue,
  getMotionSafeDuration,
  getMotionSafeScale,
} from '../animations/motion-safe'

// SSR-safe platform detection
function detectIsMac(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }

  const userAgentData = (navigator as any).userAgentData
  if (userAgentData?.platform) {
    return /macOS|iOS/i.test(userAgentData.platform)
  }
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export interface KeyboardShortcut {
  id: string
  keys: string[]
  description: string
  category?: string
  handler: (e: KeyboardEvent) => void
  enabled?: boolean
}

interface KeyboardShortcutsContextValue {
  shortcuts: KeyboardShortcut[]
  registerShortcut: (shortcut: KeyboardShortcut) => () => void
  unregisterShortcut: (id: string) => void
  showHelp: () => void
  hideHelp: () => void
}

const KeyboardShortcutsContext = React.createContext<
  KeyboardShortcutsContextValue | undefined
>(undefined)

export interface KeyboardShortcutsProviderProps {
  children: React.ReactNode
  shortcuts?: KeyboardShortcut[]
}

/**
 * Keyboard Shortcuts Provider
 *
 * Manages global keyboard shortcuts
 */
export function KeyboardShortcutsProvider({
  children,
  shortcuts: initialShortcuts = [],
}: KeyboardShortcutsProviderProps) {
  const [shortcuts, setShortcuts] =
    React.useState<KeyboardShortcut[]>(initialShortcuts)
  const [showHelpModal, setShowHelpModal] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = getKeyString(e)

      // Check if ? is pressed to show help
      if (e.shiftKey && e.key === '?') {
        e.preventDefault()
        setShowHelpModal(true)
        return
      }

      // Find matching shortcut
      const shortcut = shortcuts.find(
        (s) => s.enabled !== false && s.keys.includes(key)
      )

      if (shortcut) {
        e.preventDefault()
        shortcut.handler(e)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts])

  const registerShortcut = React.useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts((prev) => [
      ...prev.filter((s) => s.id !== shortcut.id),
      shortcut,
    ])

    return () => {
      setShortcuts((prev) => prev.filter((s) => s.id !== shortcut.id))
    }
  }, [])

  const unregisterShortcut = React.useCallback((id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const showHelp = React.useCallback(() => setShowHelpModal(true), [])
  const hideHelp = React.useCallback(() => setShowHelpModal(false), [])

  const value = React.useMemo(
    () => ({
      shortcuts,
      registerShortcut,
      unregisterShortcut,
      showHelp,
      hideHelp,
    }),
    [shortcuts, registerShortcut, unregisterShortcut, showHelp, hideHelp]
  )

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      {showHelpModal && (
        <KeyboardShortcutsHelp onClose={hideHelp} shortcuts={shortcuts} />
      )}
    </KeyboardShortcutsContext.Provider>
  )
}

/**
 * Hook to use keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const context = React.useContext(KeyboardShortcutsContext)

  if (!context) {
    throw new Error(
      'useKeyboardShortcuts must be used within KeyboardShortcutsProvider'
    )
  }

  return context
}

/**
 * Hook to register a keyboard shortcut
 */
export function useKeyboardShortcut(
  keys: string | string[],
  handler: (e: KeyboardEvent) => void,
  options?: {
    id?: string
    description?: string
    category?: string
    enabled?: boolean
  }
) {
  const { registerShortcut } = useKeyboardShortcuts()

  React.useEffect(() => {
    const shortcut: KeyboardShortcut = {
      id: options?.id || `shortcut-${Math.random().toString(36).substring(7)}`,
      keys: Array.isArray(keys) ? keys : [keys],
      description: options?.description || '',
      category: options?.category,
      handler,
      enabled: options?.enabled !== false,
    }

    return registerShortcut(shortcut)
  }, [
    keys,
    handler,
    registerShortcut,
    options?.id,
    options?.description,
    options?.category,
    options?.enabled,
  ])
}

/**
 * Get key string from KeyboardEvent
 */
function getKeyString(e: KeyboardEvent): string {
  const parts: string[] = []

  if (e.ctrlKey || e.metaKey) parts.push('Ctrl')
  if (e.altKey) parts.push('Alt')
  if (e.shiftKey) parts.push('Shift')

  parts.push(e.key)

  return parts.join('+')
}

/**
 * Format key string for display
 */
function formatKeyString(key: string, isMac = false): string {
  return key
    .replace(/Ctrl|Cmd/g, isMac ? '⌘' : 'Ctrl')
    .replace(/Alt/g, isMac ? '⌥' : 'Alt')
    .replace(/Shift/g, isMac ? '⇧' : 'Shift')
    .replace(/Enter/g, isMac ? '↵' : 'Enter')
    .replace(/Escape/g, 'Esc')
    .replace(/ArrowUp/g, '↑')
    .replace(/ArrowDown/g, '↓')
    .replace(/ArrowLeft/g, '←')
    .replace(/ArrowRight/g, '→')
    .replace(/Backspace/g, isMac ? '⌫' : 'Backspace')
    .replace(/Delete/g, isMac ? '⌦' : 'Del')
    .replace(/Tab/g, isMac ? '⇥' : 'Tab')
    .replace(/End/g, 'End')
    .replace(/Home/g, 'Home')
}

/**
 * Keyboard Shortcuts Help Modal - Enhanced UX with search and animations
 */
interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[]
  onClose: () => void
}

function KeyboardShortcutsHelp({
  shortcuts,
  onClose,
}: KeyboardShortcutsHelpProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isMac, setIsMac] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  // Detect platform (SSR-safe)
  React.useEffect(() => {
    setIsMac(detectIsMac())
  }, [])

  // Auto-focus search on open
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  // Filter shortcuts by search query
  const filteredShortcuts = React.useMemo(() => {
    if (!searchQuery.trim()) return shortcuts

    const query = searchQuery.toLowerCase()
    return shortcuts.filter(
      (shortcut) =>
        shortcut.description.toLowerCase().includes(query) ||
        shortcut.category?.toLowerCase().includes(query) ||
        shortcut.keys.some((key) => key.toLowerCase().includes(query))
    )
  }, [shortcuts, searchQuery])

  // Group shortcuts by category
  const groupedShortcuts = React.useMemo(() => {
    const groups: Record<string, KeyboardShortcut[]> = {}

    filteredShortcuts.forEach((shortcut) => {
      const category = shortcut.category || 'General'
      if (!groups[category]) groups[category] = []
      groups[category].push(shortcut)
    })

    return groups
  }, [filteredShortcuts])

  // Close on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('')
          searchInputRef.current?.focus()
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, searchQuery])

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: getMotionSafeDuration(prefersReducedMotion, durations.normal),
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        initial={{
          opacity: 0,
          scale: getMotionSafeScale(prefersReducedMotion, 0.95),
          y: getMotionSafeValue(prefersReducedMotion, 20, 0),
        }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: 0,
          scale: getMotionSafeScale(prefersReducedMotion, 0.95),
          y: getMotionSafeValue(prefersReducedMotion, 20, 0),
        }}
        transition={{
          duration: getMotionSafeDuration(prefersReducedMotion, durations.normal),
          ease: EASING_FRAMER.sharp,
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="bg-background rounded-xl border border-border/60 shadow-[0_24px_48px_rgba(15,23,42,0.32)] max-w-2xl w-full max-h-[85vh] overflow-hidden backdrop-blur-md pointer-events-auto">
          {/* Header with Search */}
          <div className="flex flex-col gap-3 p-5 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{
                  opacity: 0,
                  x: getMotionSafeValue(prefersReducedMotion, -10, 0),
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: getMotionSafeDuration(prefersReducedMotion, 0.1),
                  duration: getMotionSafeDuration(prefersReducedMotion, durations.normal),
                }}
              >
                <h2
                  id="shortcuts-title"
                  className="text-xl font-bold flex items-center gap-2"
                >
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
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  Keyboard Shortcuts
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredShortcuts.length} shortcut
                  {filteredShortcuts.length !== 1 ? 's' : ''} available
                </p>
              </motion.div>
              <motion.button
                onClick={onClose}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { scale: 1.05, rotate: 90 }
                }
                whileTap={
                  prefersReducedMotion ? undefined : { scale: 0.95 }
                }
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                aria-label="Close"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{
                opacity: 0,
                y: getMotionSafeValue(prefersReducedMotion, -10, 0),
              }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: getMotionSafeDuration(prefersReducedMotion, 0.15),
                duration: getMotionSafeDuration(prefersReducedMotion, durations.normal),
              }}
              className="relative"
            >
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
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
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shortcuts..."
                className={cn(
                  'w-full pl-10 pr-10 py-2.5 text-sm',
                  'bg-background border border-border/60 rounded-lg',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
                  'placeholder:text-muted-foreground/60',
                  'transition-all duration-200'
                )}
                aria-label="Search shortcuts"
              />
              {searchQuery && (
                <motion.button
                  initial={{
                    opacity: 0,
                    scale: getMotionSafeScale(prefersReducedMotion, 0.8),
                  }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: getMotionSafeScale(prefersReducedMotion, 0.8),
                  }}
                  transition={{
                    duration: getMotionSafeDuration(prefersReducedMotion, durations.fast),
                  }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded transition-colors"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto max-h-[calc(85vh-200px)]">
            {Object.keys(groupedShortcuts).length === 0 ? (
              <motion.div
                initial={{
                  opacity: 0,
                  y: getMotionSafeValue(prefersReducedMotion, 10, 0),
                }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: getMotionSafeDuration(prefersReducedMotion, durations.normal),
                }}
                className="text-center py-12"
              >
                <svg
                  className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3"
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
                <p className="text-sm text-muted-foreground">
                  No shortcuts found for &quot;{searchQuery}&quot;
                </p>
              </motion.div>
            ) : (
              <div className="space-y-5">
                {Object.entries(groupedShortcuts).map(
                  ([category, categoryShortcuts], categoryIndex) => (
                    <motion.div
                      key={category}
                      initial={{
                        opacity: 0,
                        y: getMotionSafeValue(prefersReducedMotion, 10, 0),
                      }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: getMotionSafeDuration(
                          prefersReducedMotion,
                          categoryIndex * 0.05
                        ),
                        duration: getMotionSafeDuration(
                          prefersReducedMotion,
                          durations.normal
                        ),
                      }}
                    >
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">
                        {category}
                      </h3>
                      <div className="space-y-1.5">
                        {categoryShortcuts.map((shortcut, index) => (
                          <motion.div
                            key={shortcut.id}
                            initial={{
                              opacity: 0,
                              x: getMotionSafeValue(prefersReducedMotion, -10, 0),
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: getMotionSafeDuration(
                                prefersReducedMotion,
                                categoryIndex * 0.05 + index * 0.02
                              ),
                              duration: getMotionSafeDuration(
                                prefersReducedMotion,
                                durations.normal
                              ),
                            }}
                            whileHover={
                              prefersReducedMotion
                                ? undefined
                                : {
                                    x: 2,
                                    backgroundColor: 'var(--accent)',
                                  }
                            }
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                          >
                            <span className="text-sm group-hover:text-foreground transition-colors">
                              {shortcut.description}
                            </span>
                            <div className="flex gap-1.5">
                              {shortcut.keys.map((key, keyIndex) => (
                                <React.Fragment key={keyIndex}>
                                  {keyIndex > 0 && (
                                    <span className="text-muted-foreground text-xs self-center">
                                      +
                                    </span>
                                  )}
                                  <motion.kbd
                                    whileHover={
                                      prefersReducedMotion
                                        ? undefined
                                        : { scale: 1.05 }
                                    }
                                    className={cn(
                                      'px-2.5 py-1.5 text-xs font-semibold',
                                      'bg-muted/80 border border-border/60 rounded-md shadow-sm',
                                      'group-hover:bg-background group-hover:border-border',
                                      'transition-all duration-200',
                                      'min-w-[28px] text-center'
                                    )}
                                  >
                                    {formatKeyString(key, isMac)}
                                  </motion.kbd>
                                </React.Fragment>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: getMotionSafeDuration(prefersReducedMotion, 0.2),
              duration: getMotionSafeDuration(prefersReducedMotion, durations.normal),
            }}
            className="px-5 py-3.5 border-t border-border bg-muted/30 text-xs text-muted-foreground flex items-center justify-between"
          >
            <span>
              Press{' '}
              <kbd className="px-2 py-1 bg-background border border-border/60 rounded shadow-sm font-semibold">
                ?
              </kbd>{' '}
              to toggle
            </span>
            <span>
              <kbd className="px-2 py-1 bg-background border border-border/60 rounded shadow-sm font-semibold">
                Esc
              </kbd>{' '}
              to close
            </span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Default keyboard shortcuts
 */
export const defaultShortcuts: Omit<KeyboardShortcut, 'handler'>[] = [
  {
    id: 'send-message',
    keys: ['Ctrl+Enter', 'Cmd+Enter'],
    description: 'Send message',
    category: 'Chat',
  },
  {
    id: 'new-chat',
    keys: ['Ctrl+n', 'Cmd+n'],
    description: 'New chat',
    category: 'Chat',
  },
  {
    id: 'search',
    keys: ['/'],
    description: 'Focus search',
    category: 'Navigation',
  },
  {
    id: 'command-palette',
    keys: ['Ctrl+k', 'Cmd+k'],
    description: 'Open command palette',
    category: 'Navigation',
  },
  {
    id: 'settings',
    keys: ['Ctrl+,', 'Cmd+,'],
    description: 'Open settings',
    category: 'Navigation',
  },
  {
    id: 'close',
    keys: ['Escape'],
    description: 'Close modal/dialog',
    category: 'General',
  },
  {
    id: 'help',
    keys: ['?'],
    description: 'Show keyboard shortcuts',
    category: 'General',
  },
]
