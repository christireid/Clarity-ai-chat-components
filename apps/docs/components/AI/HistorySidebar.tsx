'use client'

/**
 * HistorySidebar - Conversation History Panel
 *
 * A slide-out sidebar for managing conversation branches and history.
 * Features smooth animations, premium styling, and full accessibility support.
 */

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Clock, Plus, ChevronLeft, Sparkles } from 'lucide-react'
import { useReducedMotion } from '@clarity-chat/react'
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

  // Animation variants
  const sidebarVariants = useMemo(() => ({
    initial: prefersReducedMotion
      ? { opacity: 0 }
      : { x: '-100%', opacity: 0 },
    animate: prefersReducedMotion
      ? { opacity: 1 }
      : { x: 0, opacity: 1 },
    exit: prefersReducedMotion
      ? { opacity: 0 }
      : { x: '-100%', opacity: 0 },
  }), [prefersReducedMotion])

  const overlayVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }), [])

  const springTransition = useMemo(
    () =>
      prefersReducedMotion
        ? { duration: 0.1 }
        : {
            type: 'spring' as const,
            stiffness: 400,
            damping: 35,
            mass: 0.8,
          },
    [prefersReducedMotion]
  )

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - closes sidebar when clicked */}
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute inset-0 z-10',
              'bg-gray-900/10 dark:bg-black/20',
              'backdrop-blur-[2px]'
            )}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sidebar Panel */}
          <motion.div
            variants={sidebarVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={springTransition}
            className={cn(
              'absolute inset-y-0 left-0 z-20',
              'w-72 max-w-[85%]',
              'flex flex-col',
              // Premium glass background
              'bg-white/95 dark:bg-gray-900/95',
              'backdrop-blur-xl backdrop-saturate-150',
              // Border and shadow
              'border-r border-gray-200/60 dark:border-gray-700/50',
              'shadow-2xl shadow-gray-900/10 dark:shadow-black/30'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Chat history"
          >
            {/* Header */}
            <header className={cn(
              'flex items-center justify-between',
              'px-4 py-4',
              'border-b border-gray-100 dark:border-gray-800/80',
              'bg-gradient-to-b from-gray-50/80 to-transparent dark:from-gray-800/40 dark:to-transparent'
            )}>
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  'flex items-center justify-center',
                  'w-8 h-8 rounded-lg',
                  'bg-gradient-to-br from-gray-100 to-gray-50',
                  'dark:from-gray-800 dark:to-gray-800/50'
                )}>
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    History
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-none mt-0.5">
                    {branches.length} conversation{branches.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={cn(
                  'flex items-center justify-center',
                  'w-8 h-8 rounded-lg',
                  'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                )}
                aria-label="Close history"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </header>

            {/* New Chat Button */}
            <div className="p-3">
              <button
                onClick={onCreateBranch}
                className={cn(
                  'w-full flex items-center justify-center gap-2',
                  'px-4 py-2.5',
                  'text-sm font-medium',
                  // Gradient background
                  'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent',
                  'hover:from-primary/15 hover:via-primary/10 hover:to-primary/5',
                  'dark:from-primary/20 dark:via-primary/10 dark:to-transparent',
                  'dark:hover:from-primary/25 dark:hover:via-primary/15 dark:hover:to-primary/5',
                  // Text color
                  'text-primary',
                  // Border and rounding
                  'rounded-xl',
                  'border border-primary/20 dark:border-primary/30',
                  // Transition
                  'transition-all duration-200',
                  // Focus
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                )}
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1 scrollbar-thin">
              {branches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className={cn(
                    'flex items-center justify-center',
                    'w-12 h-12 rounded-2xl mb-4',
                    'bg-gray-100 dark:bg-gray-800'
                  )}>
                    <MessageSquare className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    No conversations yet
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Start a new chat to get started
                  </p>
                </div>
              ) : (
                branches.map((branch, index) => {
                  const isActive = branch.id === currentBranchId
                  const lastMessage = branch.messages[branch.messages.length - 1]
                  const preview = lastMessage?.content?.slice(0, 60) || 'No messages'

                  return (
                    <motion.button
                      key={branch.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                      onClick={() => onSwitchBranch(branch.id)}
                      className={cn(
                        'w-full text-left',
                        'px-3 py-3',
                        'rounded-xl',
                        'transition-all duration-200',
                        'flex flex-col gap-1.5',
                        'group',
                        // Focus styles
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                        // Active state
                        isActive
                          ? [
                              'bg-white dark:bg-gray-800',
                              'shadow-sm',
                              'ring-1 ring-gray-200/80 dark:ring-gray-700/50',
                            ]
                          : [
                              'hover:bg-gray-100/70 dark:hover:bg-gray-800/50',
                            ]
                      )}
                    >
                      {/* Title Row */}
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                        )}
                        <span className={cn(
                          'font-medium text-sm truncate flex-1',
                          isActive
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300'
                        )}>
                          {branch.name}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {formatRelativeTime(branch.createdAt)}
                        </span>
                      </div>

                      {/* Preview Row */}
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        <span className={cn(
                          'text-xs truncate',
                          'text-gray-500 dark:text-gray-400'
                        )}>
                          {branch.messages.length} message{branch.messages.length !== 1 ? 's' : ''}
                          {preview !== 'No messages' && ` - ${preview}...`}
                        </span>
                      </div>
                    </motion.button>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <footer className={cn(
              'px-4 py-3',
              'border-t border-gray-100 dark:border-gray-800/80',
              'bg-gradient-to-t from-gray-50/80 to-transparent dark:from-gray-800/40 dark:to-transparent'
            )}>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
                Press{' '}
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold border border-gray-200 dark:border-gray-700 rounded bg-gray-100 dark:bg-gray-800">
                  Esc
                </kbd>{' '}
                to close
              </p>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
