'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  MessageSquare,
} from 'lucide-react'
import { durations } from '@/lib/animations'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Branch {
  id: string
  name: string
  parentMessageId: string
  messages: Message[]
  createdAt: number
}

interface HeroChatBranchingProps {
  currentBranch: Branch | null
  branches: Branch[]
  onCreateBranch: (parentMessageId: string, name?: string) => void
  onSwitchBranch: (branchId: string) => void
  onDeleteBranch: (branchId: string) => void
  onBackToMain: () => void
}

export function HeroChatBranching({
  currentBranch,
  branches,
  onCreateBranch,
  onSwitchBranch,
  onDeleteBranch,
  onBackToMain,
}: HeroChatBranchingProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (branches.length === 0 && !currentBranch) return null

  return (
    <div className="relative">
      {/* Branch indicator button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          currentBranch
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isExpanded}
        aria-label={`Branches: ${branches.length}`}
      >
        <GitBranch className="w-4 h-4" />
        <span>{currentBranch ? currentBranch.name : 'main'}</span>
        {branches.length > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-purple-500 text-white text-xs">
            {branches.length}
          </span>
        )}
      </motion.button>

      {/* Expanded branch list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: durations.fast }}
            className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
          >
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Conversation Branches
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Explore alternative conversation paths
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {/* Main branch */}
              <button
                onClick={() => {
                  onBackToMain()
                  setIsExpanded(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                  !currentBranch
                    ? 'bg-indigo-50 dark:bg-indigo-900/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    !currentBranch ? 'bg-indigo-500' : 'bg-slate-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    main
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Original conversation
                  </p>
                </div>
              </button>

              {/* Other branches */}
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className={`flex items-center gap-2 px-3 py-2 transition-colors ${
                    currentBranch?.id === branch.id
                      ? 'bg-purple-50 dark:bg-purple-900/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSwitchBranch(branch.id)
                      setIsExpanded(false)
                    }}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        currentBranch?.id === branch.id
                          ? 'bg-purple-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {branch.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {branch.messages.length} messages
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => onDeleteBranch(branch.id)}
                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
                    aria-label={`Delete branch ${branch.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                Right-click a message to create a branch
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Branch indicator shown on messages that have branches
 */
interface BranchIndicatorProps {
  branchCount: number
  onClick: () => void
}

export function HeroChatBranchIndicator({
  branchCount,
  onClick,
}: BranchIndicatorProps) {
  if (branchCount === 0) return null

  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`${branchCount} branch${branchCount > 1 ? 'es' : ''} from this message`}
    >
      <GitBranch className="w-3 h-3" />
      <span>{branchCount}</span>
    </motion.button>
  )
}

/**
 * Dialog for creating a new branch
 */
interface CreateBranchDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string) => void
  messagePreview: string
}

export function HeroChatCreateBranchDialog({
  isOpen,
  onClose,
  onConfirm,
  messagePreview,
}: CreateBranchDialogProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(name.trim() || `Branch ${Date.now()}`)
    setName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Create Branch
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Explore an alternative conversation path
              </p>
            </div>
          </div>

          {/* Message preview */}
          <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Branching from
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
              {messagePreview}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="branch-name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Branch Name (optional)
            </label>
            <input
              id="branch-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alternative approach"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
              >
                Create Branch
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Branch navigation arrows (for navigating between sibling branches)
 */
interface BranchNavigatorProps {
  currentIndex: number
  totalBranches: number
  onPrevious: () => void
  onNext: () => void
}

export function HeroChatBranchNavigator({
  currentIndex,
  totalBranches,
  onPrevious,
  onNext,
}: BranchNavigatorProps) {
  if (totalBranches <= 1) return null

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous branch"
      >
        <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      </button>
      <span className="text-xs text-slate-500 dark:text-slate-400 min-w-[3rem] text-center">
        {currentIndex + 1} / {totalBranches}
      </span>
      <button
        onClick={onNext}
        disabled={currentIndex === totalBranches - 1}
        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next branch"
      >
        <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      </button>
    </div>
  )
}

/**
 * Hook to manage conversation branching
 */
export function useConversationBranching(conversationId: string | null) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [currentBranchId, setCurrentBranchId] = useState<string | null>(null)

  const currentBranch = branches.find((b) => b.id === currentBranchId) || null

  const createBranch = useCallback(
    (parentMessageId: string, messages: Message[], name?: string) => {
      const newBranch: Branch = {
        id: `branch-${Date.now()}`,
        name: name || `Branch ${branches.length + 1}`,
        parentMessageId,
        messages: messages.slice(
          0,
          messages.findIndex((m) => m.id === parentMessageId) + 1
        ),
        createdAt: Date.now(),
      }
      setBranches((prev) => [...prev, newBranch])
      setCurrentBranchId(newBranch.id)
      return newBranch
    },
    [branches.length]
  )

  const switchBranch = useCallback((branchId: string) => {
    setCurrentBranchId(branchId)
  }, [])

  const deleteBranch = useCallback(
    (branchId: string) => {
      setBranches((prev) => prev.filter((b) => b.id !== branchId))
      if (currentBranchId === branchId) {
        setCurrentBranchId(null)
      }
    },
    [currentBranchId]
  )

  const backToMain = useCallback(() => {
    setCurrentBranchId(null)
  }, [])

  const getBranchesForMessage = useCallback(
    (messageId: string) => {
      return branches.filter((b) => b.parentMessageId === messageId)
    },
    [branches]
  )

  return {
    branches,
    currentBranch,
    currentBranchId,
    createBranch,
    switchBranch,
    deleteBranch,
    backToMain,
    getBranchesForMessage,
  }
}
