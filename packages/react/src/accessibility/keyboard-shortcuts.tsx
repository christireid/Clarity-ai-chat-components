/**
 * Keyboard Shortcuts System
 * 
 * Customizable keyboard shortcuts with help modal
 */

import * as React from 'react'

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

const KeyboardShortcutsContext = React.createContext<KeyboardShortcutsContextValue | undefined>(
  undefined
)

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
  const [shortcuts, setShortcuts] = React.useState<KeyboardShortcut[]>(initialShortcuts)
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
        s => s.enabled !== false && s.keys.includes(key)
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
    setShortcuts(prev => [...prev.filter(s => s.id !== shortcut.id), shortcut])
    
    return () => {
      setShortcuts(prev => prev.filter(s => s.id !== shortcut.id))
    }
  }, [])
  
  const unregisterShortcut = React.useCallback((id: string) => {
    setShortcuts(prev => prev.filter(s => s.id !== id))
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
      {showHelpModal && <KeyboardShortcutsHelp onClose={hideHelp} shortcuts={shortcuts} />}
    </KeyboardShortcutsContext.Provider>
  )
}

/**
 * Hook to use keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const context = React.useContext(KeyboardShortcutsContext)
  
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider')
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
  }, [keys, handler, registerShortcut, options?.id, options?.description, options?.category, options?.enabled])
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
function formatKeyString(key: string): string {
  return key
    .replace('Ctrl', window.navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
    .replace('Alt', window.navigator.platform.includes('Mac') ? '⌥' : 'Alt')
    .replace('Shift', '⇧')
    .replace('Enter', '↵')
    .replace('Escape', 'Esc')
}

/**
 * Keyboard Shortcuts Help Modal
 */
interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[]
  onClose: () => void
}

function KeyboardShortcutsHelp({ shortcuts, onClose }: KeyboardShortcutsHelpProps) {
  // Group shortcuts by category
  const groupedShortcuts = React.useMemo(() => {
    const groups: Record<string, KeyboardShortcut[]> = {}
    
    shortcuts.forEach(shortcut => {
      const category = shortcut.category || 'General'
      if (!groups[category]) groups[category] = []
      groups[category].push(shortcut)
    })
    
    return groups
  }, [shortcuts])
  
  // Close on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 id="shortcuts-title" className="text-2xl font-bold">
              Keyboard Shortcuts
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-md"
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
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="space-y-2">
                  {categoryShortcuts.map(shortcut => (
                    <div
                      key={shortcut.id}
                      className="flex items-center justify-between p-2 hover:bg-accent rounded"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, index) => (
                          <kbd
                            key={index}
                            className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded"
                          >
                            {formatKeyString(key)}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/50 text-sm text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-background border border-border rounded">?</kbd> to show
            this help, <kbd className="px-2 py-1 bg-background border border-border rounded">Esc</kbd> to
            close
          </div>
        </div>
      </div>
    </>
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
