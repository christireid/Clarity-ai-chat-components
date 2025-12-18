'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Download, Upload, AlertTriangle, Trash2 } from 'lucide-react'
import { durations } from '@/lib/animations'
import { Conversation } from '../hooks/useHeroChat'

interface HeroChatStorageIndicatorProps {
  conversations: Conversation[]
  onExportAll: () => void
  onImport: (conversations: Conversation[]) => void
  onClearAll: () => void
}

const MAX_STORAGE_BYTES = 5 * 1024 * 1024 // 5MB localStorage limit
const WARNING_THRESHOLD = 0.8 // 80%

export function HeroChatStorageIndicator({
  conversations,
  onExportAll,
  onImport,
  onClearAll,
}: HeroChatStorageIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [storageUsed, setStorageUsed] = useState(0)
  const [showWarning, setShowWarning] = useState(false)

  // Calculate storage usage
  useEffect(() => {
    const calculateStorage = () => {
      try {
        const data = JSON.stringify(conversations)
        const bytes = new Blob([data]).size
        setStorageUsed(bytes)
        setShowWarning(bytes / MAX_STORAGE_BYTES >= WARNING_THRESHOLD)
      } catch {
        setStorageUsed(0)
      }
    }
    calculateStorage()
  }, [conversations])

  const usagePercent = Math.min((storageUsed / MAX_STORAGE_BYTES) * 100, 100)
  const usageFormatted = formatBytes(storageUsed)
  const maxFormatted = formatBytes(MAX_STORAGE_BYTES)

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        // Validate structure
        if (Array.isArray(data)) {
          const validConversations = data.filter(
            (c) =>
              c.id &&
              c.title &&
              Array.isArray(c.messages) &&
              typeof c.createdAt === 'number'
          )
          if (validConversations.length > 0) {
            onImport(validConversations)
          }
        }
      } catch {
        logger.error('Failed to import conversations')
      }
    }
    input.click()
  }, [onImport])

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          showWarning
            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
        aria-expanded={isExpanded}
        aria-label="Storage settings"
      >
        <Database className="w-4 h-4" />
        <span>{usageFormatted}</span>
        {showWarning && <AlertTriangle className="w-4 h-4" />}
      </button>

      {/* Expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50"
          >
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Storage
            </h4>

            {/* Usage bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>{usageFormatted} used</span>
                <span>{maxFormatted} max</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    usagePercent >= 90
                      ? 'bg-red-500'
                      : usagePercent >= 80
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercent}%` }}
                  transition={{ duration: durations.moderate }}
                />
              </div>
            </div>

            {/* Warning */}
            {showWarning && (
              <div className="mb-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-700 dark:text-amber-400">
                Storage is {Math.round(usagePercent)}% full. Consider exporting
                and clearing old conversations.
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                <p className="text-slate-500 dark:text-slate-400">
                  Conversations
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {conversations.length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                <p className="text-slate-500 dark:text-slate-400">Messages</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {conversations.reduce((acc, c) => acc + c.messages.length, 0)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={onExportAll}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Export All
              </button>
              <button
                onClick={handleImport}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
              {conversations.length > 0 && (
                <button
                  onClick={() => {
                    if (
                      confirm(
                        'Delete all conversations? This cannot be undone.'
                      )
                    ) {
                      onClearAll()
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Export a single conversation
 */
export function exportConversation(conversation: Conversation) {
  const data = JSON.stringify(conversation, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Export all conversations
 */
export function exportAllConversations(conversations: Conversation[]) {
  const data = JSON.stringify(conversations, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `clarity-chat-export-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
