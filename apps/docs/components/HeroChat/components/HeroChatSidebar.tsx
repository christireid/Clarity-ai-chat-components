'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  ChevronLeft,
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { Conversation } from '../hooks/useHeroChat'

interface HeroChatSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  isOpen: boolean
  onClose: () => void
  onCreateConversation: () => void
  onSwitchConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, title: string) => void
}

export function HeroChatSidebar({
  conversations,
  currentConversationId,
  isOpen,
  onClose,
  onCreateConversation,
  onSwitchConversation,
  onDeleteConversation,
  onRenameConversation,
}: HeroChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const startEditing = useCallback((id: string, currentTitle: string) => {
    setEditingId(id)
    setEditTitle(currentTitle)
  }, [])

  const saveEdit = useCallback(() => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }, [editingId, editTitle, onRenameConversation])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setEditTitle('')
  }, [])

  const handleDelete = useCallback(
    (id: string) => {
      onDeleteConversation(id)
      setConfirmDeleteId(null)
    },
    [onDeleteConversation]
  )

  const formatDate = useCallback((timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }, [])

  // Group conversations by date
  const groupedConversations = conversations.reduce(
    (groups, conv) => {
      const date = formatDate(conv.updatedAt)
      if (!groups[date]) groups[date] = []
      groups[date].push(conv)
      return groups
    },
    {} as Record<string, Conversation[]>
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
            className="absolute inset-0 bg-black/20 z-20"
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-30 flex flex-col"
            role="navigation"
            aria-label="Conversation history"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Conversations
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close sidebar"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="p-3">
              <button
                onClick={() => {
                  onCreateConversation()
                  onClose()
                }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
                aria-label="Start new conversation"
              >
                <Plus className="w-5 h-5" />
                New Chat
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {Object.keys(groupedConversations).length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Start a new chat to begin</p>
                </div>
              ) : (
                Object.entries(groupedConversations).map(([date, convs]) => (
                  <div key={date} className="mb-4">
                    <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 mb-2 uppercase tracking-wider">
                      {date}
                    </h3>
                    <div className="space-y-1">
                      {convs.map((conv) => (
                        <motion.div
                          key={conv.id}
                          layout
                          className={`group relative rounded-xl transition-colors ${
                            currentConversationId === conv.id
                              ? 'bg-indigo-50 dark:bg-indigo-900/30'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {editingId === conv.id ? (
                            // Edit mode
                            <div className="flex items-center gap-2 p-2">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEdit()
                                  if (e.key === 'Escape') cancelEdit()
                                }}
                                className="flex-1 px-2 py-1 text-sm rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                                aria-label="Edit conversation title"
                              />
                              <button
                                onClick={saveEdit}
                                className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                                aria-label="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                                aria-label="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : confirmDeleteId === conv.id ? (
                            // Delete confirmation
                            <div className="flex items-center gap-2 p-3">
                              <span className="flex-1 text-sm text-red-600 dark:text-red-400">
                                Delete this chat?
                              </span>
                              <button
                                onClick={() => handleDelete(conv.id)}
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                aria-label="Confirm delete"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
                                aria-label="Cancel delete"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            // Normal view
                            <button
                              onClick={() => {
                                onSwitchConversation(conv.id)
                                onClose()
                              }}
                              className="w-full text-left p-3 flex items-start gap-3"
                              aria-current={
                                currentConversationId === conv.id
                                  ? 'true'
                                  : 'false'
                              }
                            >
                              <MessageSquare
                                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                  currentConversationId === conv.id
                                    ? 'text-indigo-500'
                                    : 'text-slate-400'
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-medium truncate ${
                                    currentConversationId === conv.id
                                      ? 'text-indigo-700 dark:text-indigo-300'
                                      : 'text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  {conv.title}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                  {conv.messages.length} message
                                  {conv.messages.length !== 1 ? 's' : ''}
                                </p>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    startEditing(conv.id, conv.title)
                                  }}
                                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                                  aria-label="Rename conversation"
                                >
                                  <Edit3 className="w-4 h-4 text-slate-500" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setConfirmDeleteId(conv.id)
                                  }}
                                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                                  aria-label="Delete conversation"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
