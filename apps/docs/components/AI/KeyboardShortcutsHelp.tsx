'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Command, Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KeyboardShortcut {
  keys: string[]
  description: string
  category: 'navigation' | 'actions' | 'general'
}

const SHORTCUTS: KeyboardShortcut[] = [
  // Navigation
  { keys: ['Cmd/Ctrl', 'A'], description: 'Open/close assistant', category: 'navigation' },
  { keys: ['Esc'], description: 'Close assistant', category: 'navigation' },
  { keys: ['Tab'], description: 'Navigate forward', category: 'navigation' },
  { keys: ['Shift', 'Tab'], description: 'Navigate backward', category: 'navigation' },

  // Actions
  { keys: ['Enter'], description: 'Send message', category: 'actions' },
  { keys: ['Shift', 'Enter'], description: 'New line in message', category: 'actions' },
  { keys: ['Cmd/Ctrl', 'C'], description: 'Copy selected text', category: 'actions' },

  // General
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'general' },
]

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'))
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const formatKey = (key: string) => {
    if (key === 'Cmd/Ctrl') {
      return isMac ? '⌘' : 'Ctrl'
    }
    if (key === 'Shift') {
      return isMac ? '⇧' : 'Shift'
    }
    if (key === 'Enter') {
      return isMac ? '↵' : 'Enter'
    }
    if (key === 'Tab') {
      return isMac ? '⇥' : 'Tab'
    }
    if (key === 'Esc') {
      return 'Esc'
    }
    return key
  }

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    general: 'General',
  }

  const groupedShortcuts = SHORTCUTS.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, KeyboardShortcut[]>)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-[90vw] max-w-2xl max-h-[80vh]',
              'bg-white dark:bg-gray-900',
              'rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800',
              'overflow-hidden z-[101]'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-500/10">
                  <Keyboard className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h2 id="shortcuts-title" className="text-lg font-semibold text-foreground">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Quick access to common actions
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={cn(
                  'p-2 rounded-lg',
                  'hover:bg-gray-200 dark:hover:bg-gray-800',
                  'transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500'
                )}
                aria-label="Close shortcuts panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="space-y-6">
                {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </h3>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            'flex items-center justify-between',
                            'px-4 py-3 rounded-lg',
                            'bg-gray-50 dark:bg-gray-800/50',
                            'hover:bg-gray-100 dark:hover:bg-gray-800',
                            'transition-colors'
                          )}
                        >
                          <span className="text-sm text-foreground">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <div key={keyIndex} className="flex items-center gap-1">
                                <kbd
                                  className={cn(
                                    'inline-flex items-center justify-center',
                                    'min-w-[2rem] px-2 py-1',
                                    'text-xs font-semibold',
                                    'bg-white dark:bg-gray-900',
                                    'border border-gray-300 dark:border-gray-700',
                                    'rounded shadow-sm',
                                    'text-gray-700 dark:text-gray-300'
                                  )}
                                >
                                  {formatKey(key)}
                                </kbd>
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className="text-gray-400 text-xs mx-1">+</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <p className="text-xs text-muted-foreground text-center">
                Press <kbd className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">?</kbd> anytime to show this panel
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
