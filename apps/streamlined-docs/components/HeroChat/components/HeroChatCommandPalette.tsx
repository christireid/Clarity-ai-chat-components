'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Trash2,
  Sun,
  Download,
  Command as CommandIcon,
  Settings,
  LucideIcon,
  PanelLeft,
  Plus,
  Mic,
  Copy,
  MessageSquare,
  Volume2,
  RefreshCw,
  Database,
  GitBranch,
} from 'lucide-react'

interface CommandItem {
  id: string
  icon: LucideIcon
  label: string
  shortcut: string
  action?: () => void
}

interface HeroChatCommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onExecuteCommand: (commandId: string) => void
  commands?: CommandItem[]
}

export const DEFAULT_COMMANDS: CommandItem[] = [
  // Navigation
  { id: 'sidebar', icon: PanelLeft, label: 'Toggle Sidebar', shortcut: '⌘B' },
  { id: 'new', icon: Plus, label: 'New Conversation', shortcut: '⌘N' },
  { id: 'search', icon: Search, label: 'Search Conversations', shortcut: '⌘F' },

  // Actions
  { id: 'clear', icon: Trash2, label: 'Clear History', shortcut: '⌘⇧K' },
  {
    id: 'regenerate',
    icon: RefreshCw,
    label: 'Regenerate Response',
    shortcut: '⌘R',
  },
  { id: 'copy', icon: Copy, label: 'Copy Last Response', shortcut: '⌘⇧C' },

  // Input
  { id: 'voice', icon: Mic, label: 'Start Voice Input', shortcut: '⌘⇧V' },
  { id: 'focus', icon: MessageSquare, label: 'Focus Input', shortcut: '/' },

  // Output
  { id: 'speak', icon: Volume2, label: 'Read Last Response', shortcut: '⌘⇧S' },
  {
    id: 'export',
    icon: Download,
    label: 'Export Conversation',
    shortcut: '⌘E',
  },
  {
    id: 'export-all',
    icon: Database,
    label: 'Export All Conversations',
    shortcut: '⌘⇧E',
  },

  // Settings
  { id: 'theme', icon: Sun, label: 'Toggle Theme', shortcut: '⌘T' },
  {
    id: 'shortcuts',
    icon: CommandIcon,
    label: 'Keyboard Shortcuts',
    shortcut: '⌘/',
  },
  { id: 'settings', icon: Settings, label: 'Settings', shortcut: '⌘,' },
]

export function HeroChatCommandPalette({
  isOpen,
  onClose,
  onExecuteCommand,
  commands = DEFAULT_COMMANDS,
}: HeroChatCommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter commands based on search
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
      // Small delay to ensure modal is rendered
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            onExecuteCommand(filteredCommands[selectedIndex].id)
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    },
    [filteredCommands, selectedIndex, onExecuteCommand, onClose]
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
                  aria-label="Search commands"
                  autoComplete="off"
                />
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Close command palette"
                >
                  <X className="w-4 h-4 text-slate-400" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Commands list */}
            <div
              className="p-2 max-h-80 overflow-y-auto"
              role="listbox"
              aria-label="Available commands"
            >
              {filteredCommands.length === 0 ? (
                <div className="px-3 py-6 text-center text-slate-400 text-sm">
                  No commands found
                </div>
              ) : (
                filteredCommands.map((command, index) => (
                  <motion.button
                    key={command.id}
                    onClick={() => onExecuteCommand(command.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      index === selectedIndex
                        ? 'bg-indigo-100 dark:bg-indigo-900/30'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    whileHover={{ x: 4 }}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <command.icon
                      className={`w-4 h-4 ${
                        index === selectedIndex
                          ? 'text-indigo-500'
                          : 'text-slate-500'
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`flex-1 text-left text-sm ${
                        index === selectedIndex
                          ? 'text-indigo-900 dark:text-indigo-200 font-medium'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {command.label}
                    </span>
                    <kbd className="text-xs text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
                      {command.shortcut}
                    </kbd>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>
                  <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                    ↑↓
                  </kbd>{' '}
                  navigate
                </span>
                <span>
                  <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                    ↵
                  </kbd>{' '}
                  select
                </span>
                <span>
                  <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                    esc
                  </kbd>{' '}
                  close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
