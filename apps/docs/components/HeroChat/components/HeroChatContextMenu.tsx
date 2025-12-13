'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  RefreshCw,
  Edit3,
  Volume2,
  GitBranch,
  Trash2,
  LucideIcon,
} from 'lucide-react'

interface ContextMenuAction {
  id: string
  icon: LucideIcon
  label: string
  danger?: boolean
  assistantOnly?: boolean
  userOnly?: boolean
}

interface ContextMenuState {
  x: number
  y: number
  messageId: string
  messageRole: 'user' | 'assistant'
}

interface HeroChatContextMenuProps {
  contextMenu: ContextMenuState | null
  onClose: () => void
  onAction: (actionId: string, messageId: string) => void
  actions?: ContextMenuAction[]
}

export const DEFAULT_CONTEXT_ACTIONS: ContextMenuAction[] = [
  { id: 'copy', icon: Copy, label: 'Copy' },
  {
    id: 'regenerate',
    icon: RefreshCw,
    label: 'Regenerate',
    assistantOnly: true,
  },
  { id: 'edit', icon: Edit3, label: 'Edit', userOnly: true },
  { id: 'speak', icon: Volume2, label: 'Speak' },
  { id: 'branch', icon: GitBranch, label: 'Branch from here' },
  { id: 'delete', icon: Trash2, label: 'Delete', danger: true },
]

export function HeroChatContextMenu({
  contextMenu,
  onClose,
  onAction,
  actions = DEFAULT_CONTEXT_ACTIONS,
}: HeroChatContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!contextMenu) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [contextMenu, onClose])

  // Close on escape
  useEffect(() => {
    if (!contextMenu) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [contextMenu, onClose])

  // Filter actions based on message role
  const visibleActions = contextMenu
    ? actions.filter((action) => {
        if (action.assistantOnly && contextMenu.messageRole !== 'assistant')
          return false
        if (action.userOnly && contextMenu.messageRole !== 'user') return false
        return true
      })
    : []

  return (
    <AnimatePresence>
      {contextMenu && (
        <>
          {/* Invisible backdrop for click detection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            aria-hidden="true"
          />

          {/* Context menu */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
              // Prevent menu from going off-screen
              transform: 'translate(-50%, 0)',
            }}
            className="fixed bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 py-1 min-w-[160px]"
            role="menu"
            aria-label="Message actions"
          >
            {visibleActions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  onAction(action.id, contextMenu.messageId)
                  onClose()
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  action.danger
                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                role="menuitem"
              >
                <action.icon className="w-4 h-4" aria-hidden="true" />
                {action.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
