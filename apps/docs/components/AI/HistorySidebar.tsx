'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Clock, Plus, Trash2, ChevronLeft } from 'lucide-react'
import { useReducedMotion } from '@clarity-chat/react/internal'
import { drawerTransition, durations } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { ConversationBranch } from './hooks/useBranching'

interface HistorySidebarProps {
  isOpen: boolean
  onClose: () => void
  branches: ConversationBranch[]
  currentBranchId: string
  onSwitchBranch: (branchId: string) => void
  onCreateBranch: () => void
}

export function HistorySidebar({
  isOpen,
  onClose,
  branches,
  currentBranchId,
  onSwitchBranch,
  onCreateBranch,
}: HistorySidebarProps) {
  const prefersReducedMotion = useReducedMotion()

  const variants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0, x: 0 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 0 },
        transition: { duration: durations.fast },
      }
    }
    return {
      ...drawerTransition('left'),
      initial: { ...drawerTransition('left').initial, opacity: 0 },
      animate: { ...drawerTransition('left').animate, opacity: 1 },
      exit: { ...drawerTransition('left').exit, opacity: 0 },
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    }
  }, [prefersReducedMotion])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-y-0 left-0 z-20 w-64 bg-secondary/50 backdrop-blur-md border-r border-border/50 flex flex-col"
        >
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              History
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-md transition-colors"
              aria-label="Close history"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <button
              onClick={onCreateBranch}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors mb-4"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>

            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => onSwitchBranch(branch.id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                  'flex flex-col gap-1',
                  branch.id === currentBranchId
                    ? 'bg-white shadow-sm ring-1 ring-border dark:bg-gray-800'
                    : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
                )}
              >
                <span className="font-medium truncate block">
                  {branch.name}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {branch.messages.length} messages
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
