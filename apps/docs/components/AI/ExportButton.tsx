'use client'

import { useState } from 'react'
import { Download, Copy, FileText, FileCode, File, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  exportAsMarkdown,
  exportAsJSON,
  exportAsText,
  downloadConversation,
  copyToClipboard,
  getExportStats,
  type ExportMessage,
  type ExportMetadata,
} from '@/lib/ai/conversationExport'

export interface ExportButtonProps {
  messages: ExportMessage[]
  metadata?: Partial<ExportMetadata>
  className?: string
  variant?: 'compact' | 'full'
}

export function ExportButton({
  messages,
  metadata,
  className,
  variant = 'full',
}: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const stats = getExportStats(messages)

  const handleExport = async (format: 'markdown' | 'json' | 'text') => {
    setDownloading(true)

    try {
      let content: string

      switch (format) {
        case 'markdown':
          content = exportAsMarkdown(messages, metadata)
          break
        case 'json':
          content = exportAsJSON(messages, metadata)
          break
        case 'text':
          content = exportAsText(messages, metadata)
          break
      }

      downloadConversation(content, format)

      // Show success briefly
      setTimeout(() => setDownloading(false), 500)
      setTimeout(() => setShowMenu(false), 1000)
    } catch (error) {
      console.error('Export failed:', error)
      setDownloading(false)
    }
  }

  const handleCopy = async () => {
    const content = exportAsMarkdown(messages, metadata)
    const success = await copyToClipboard(content)

    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setTimeout(() => setShowMenu(false), 1500)
    }
  }

  // Don't show if no messages
  if (messages.length === 0) {
    return null
  }

  if (variant === 'compact') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          disabled={downloading}
          className={cn(
            'p-2 rounded-md transition-all duration-200',
            'hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'text-muted-foreground'
          )}
          aria-label="Export conversation"
        >
          <Download className="w-4 h-4" />
        </button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={cn(
                'absolute right-0 top-full mt-2 z-50',
                'bg-popover border border-border rounded-md shadow-lg',
                'min-w-[200px] p-2'
              )}
            >
              <ExportMenu
                onExport={handleExport}
                onCopy={handleCopy}
                copied={copied}
                downloading={downloading}
                stats={stats}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Full variant
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Export Conversation
        </span>
        <span className="text-xs text-muted-foreground">
          {stats.totalMessages} messages
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Markdown */}
        <button
          onClick={() => handleExport('markdown')}
          disabled={downloading}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md',
            'bg-secondary text-secondary-foreground',
            'hover:bg-secondary/80',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors text-sm'
          )}
        >
          <FileText className="w-4 h-4" />
          Markdown
        </button>

        {/* JSON */}
        <button
          onClick={() => handleExport('json')}
          disabled={downloading}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md',
            'bg-secondary text-secondary-foreground',
            'hover:bg-secondary/80',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors text-sm'
          )}
        >
          <FileCode className="w-4 h-4" />
          JSON
        </button>

        {/* Text */}
        <button
          onClick={() => handleExport('text')}
          disabled={downloading}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md',
            'bg-secondary text-secondary-foreground',
            'hover:bg-secondary/80',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors text-sm'
          )}
        >
          <File className="w-4 h-4" />
          Text
        </button>

        {/* Copy */}
        <button
          onClick={handleCopy}
          disabled={downloading}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md',
            'bg-secondary text-secondary-foreground',
            'hover:bg-secondary/80',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors text-sm'
          )}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>User messages:</span>
          <span>{stats.userMessages}</span>
        </div>
        <div className="flex justify-between">
          <span>Assistant messages:</span>
          <span>{stats.assistantMessages}</span>
        </div>
        {stats.sourcesCount > 0 && (
          <div className="flex justify-between">
            <span>Sources cited:</span>
            <span>{stats.sourcesCount}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Estimated tokens:</span>
          <span>{stats.estimatedTokens.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

interface ExportMenuProps {
  onExport: (format: 'markdown' | 'json' | 'text') => void
  onCopy: () => void
  copied: boolean
  downloading: boolean
  stats: ReturnType<typeof getExportStats>
}

function ExportMenu({
  onExport,
  onCopy,
  copied,
  downloading,
  stats,
}: ExportMenuProps) {
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
        Export as...
      </div>

      {/* Export options */}
      <button
        onClick={() => onExport('markdown')}
        disabled={downloading}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 rounded',
          'hover:bg-accent hover:text-accent-foreground',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors text-sm'
        )}
      >
        <FileText className="w-4 h-4" />
        Markdown (.md)
      </button>

      <button
        onClick={() => onExport('json')}
        disabled={downloading}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 rounded',
          'hover:bg-accent hover:text-accent-foreground',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors text-sm'
        )}
      >
        <FileCode className="w-4 h-4" />
        JSON (.json)
      </button>

      <button
        onClick={() => onExport('text')}
        disabled={downloading}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 rounded',
          'hover:bg-accent hover:text-accent-foreground',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors text-sm'
        )}
      >
        <File className="w-4 h-4" />
        Plain Text (.txt)
      </button>

      <div className="h-px bg-border my-1" />

      {/* Copy option */}
      <button
        onClick={onCopy}
        disabled={downloading}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 rounded',
          'hover:bg-accent hover:text-accent-foreground',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors text-sm'
        )}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied to clipboard!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy to clipboard
          </>
        )}
      </button>

      {/* Stats footer */}
      <div className="px-2 py-1 text-xs text-muted-foreground border-t border-border mt-1">
        {stats.totalMessages} messages • ~{stats.estimatedTokens.toLocaleString()} tokens
      </div>
    </div>
  )
}
