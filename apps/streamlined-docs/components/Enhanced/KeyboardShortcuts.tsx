'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Command, Search, ArrowUp, ArrowDown, Keyboard, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KeyboardShortcutsProps {
  open: boolean
  onClose: () => void
}

const shortcuts = [
  {
    category: 'Navigation',
    items: [
      { keys: ['⌘', 'K'], description: 'Open search' },
      { keys: ['⌘', '.'], description: 'Toggle AI assistant' },
      { keys: ['ESC'], description: 'Close dialog/menu' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
    ],
  },
  {
    category: 'Search',
    items: [
      { keys: ['↑', '↓'], description: 'Navigate results' },
      { keys: ['↵'], description: 'Select result' },
      { keys: ['ESC'], description: 'Close search' },
    ],
  },
  {
    category: 'Playground',
    items: [
      { keys: ['⌘', 'Enter'], description: 'Run code' },
      { keys: ['⌘', 'S'], description: 'Download code' },
      { keys: ['⌘', 'R'], description: 'Reset code' },
    ],
  },
]

export function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4 z-50"
          >
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10">
                    <Keyboard className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Navigate faster with shortcuts</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Shortcuts List */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                {shortcuts.map((section, sectionIndex) => (
                  <motion.div
                    key={section.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1, duration: 0.3 }}
                  >
                    <h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-3">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {item.description}
                          </span>
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, keyIndex) => (
                              <kbd
                                key={keyIndex}
                                className="px-2 py-1 text-xs font-mono bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded shadow-sm min-w-[28px] text-center"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Zap className="w-4 h-4 text-brand-500" />
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded text-xs font-mono">?</kbd> anytime to see shortcuts</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
