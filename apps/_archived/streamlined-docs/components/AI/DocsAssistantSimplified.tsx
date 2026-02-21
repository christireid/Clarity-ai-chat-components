'use client'

/**
 * DocsAssistant - Simplified Documentation Assistant
 *
 * A clean, working implementation using available components.
 * Can be enhanced as more token optimization components become available.
 */

import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  BookOpen,
  Sparkles,
  Send,
  AlertTriangle,
  Loader2,
  Target,
  Zap,
  FileCode,
  Users,
  CheckCircle2,
  Link2,
  Download,
  MessageCircle,
} from 'lucide-react'
import { ChatButton } from './ChatButton'
import { useDocsChat } from './hooks'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

interface DocsAssistantProps {
  className?: string
}

// Export Menu Component
function ExportMenu({
  showExportMenu,
  onToggle,
  onExport,
  exportButtonRef,
}: {
  showExportMenu: boolean
  onToggle: () => void
  onExport: (format: 'json' | 'markdown' | 'html') => void
  exportButtonRef: React.RefObject<HTMLButtonElement>
}) {
  return (
    <div className="relative" ref={exportButtonRef}>
      <button
        onClick={onToggle}
        className="px-3 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
        aria-label="Export conversation"
        aria-expanded={showExportMenu}
        aria-haspopup="true"
      >
        <Download className="w-3 h-3" />
        Export
      </button>
      <AnimatePresence>
        {showExportMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: durations.faster }}
            className="absolute top-full right-0 mt-1 w-40 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-10"
            viewport={{ once: true }}
          >
            <button
              onClick={() => onExport('markdown')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Markdown (.md)
            </button>
            <button
              onClick={() => onExport('json')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              JSON (.json)
            </button>
            <button
              onClick={() => onExport('html')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              HTML (.html)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Header Component
function AssistantHeader({
  hasMessages,
  showExportMenu,
  onClose,
  onClear,
  onExport,
  onToggleExportMenu,
  exportButtonRef,
}: {
  hasMessages: boolean
  showExportMenu: boolean
  onClose: () => void
  onClear: () => void
  onExport: (format: 'json' | 'markdown' | 'html') => void
  onToggleExportMenu: () => void
  exportButtonRef: React.RefObject<HTMLButtonElement>
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 id="docs-assistant-title" className="font-semibold">
            Documentation Assistant
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Ask me anything about Clarity Chat
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasMessages && (
          <>
            <ExportMenu
              showExportMenu={showExportMenu}
              onToggle={onToggleExportMenu}
              onExport={onExport}
              exportButtonRef={exportButtonRef}
            />
            <button
              onClick={onClear}
              className="px-3 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Clear conversation history"
            >
              Clear
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Close (Esc)"
          aria-label="Close documentation assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Follow-up Suggestions Component
function FollowUpSuggestions({
  suggestions,
  isLoading,
  onSuggestionClick,
}: {
  suggestions: string[]
  isLoading: boolean
  onSuggestionClick: (suggestion: string) => void
}) {
  if (isLoading || suggestions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.moderate }}
      className="pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50"
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-4 h-4 text-brand-500" />
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Suggested follow-ups:
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-2 text-sm rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-500/20 hover:border-brand-500/30 transition-colors text-left"
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function DocsAssistantInner({ className }: DocsAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const exportButtonRef = useRef<HTMLButtonElement>(null)

  const {
    messages,
    isLoading,
    aiStatus,
    currentCitations,
    tokenTracker,
    ragMetadata,
    suggestedFollowUps,
    handleSendMessage,
    handleClear,
    handleExportWithFormat,
  } = useDocsChat()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle send
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    await handleSendMessage(inputValue)
    setInputValue('')
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + . to toggle
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        if (showExportMenu) {
          setShowExportMenu(false)
        } else {
          setIsOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, showExportMenu])

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showExportMenu &&
        exportButtonRef.current &&
        !exportButtonRef.current.contains(e.target as Node)
      ) {
        setShowExportMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportMenu])

  // Handle export
  const handleExport = async (format: 'json' | 'markdown' | 'html') => {
    setShowExportMenu(false)
    await handleExportWithFormat({
      format,
      includeMetadata: true,
    })
  }

  const suggestionButtons = [
    'How do I optimize token usage?',
    'Show me streaming examples',
    'What components are available?',
  ]

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <ChatButton onClick={() => setIsOpen(true)} isOpen={isOpen} />
      )}

      {/* Main Assistant Dialog */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: durations.moderate }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              aria-hidden="true"
              viewport={{ once: true }}
            />

            {/* Dialog */}
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className={cn(
                'fixed inset-4 md:inset-8 z-[70]',
                'lg:right-8 lg:left-auto lg:max-w-3xl',
                'flex flex-col',
                'rounded-2xl overflow-hidden',
                'bg-white dark:bg-neutral-950',
                'border border-neutral-200 dark:border-neutral-800',
                'shadow-2xl',
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="docs-assistant-title"
              viewport={{ once: true }}
            >
              {/* Header */}
              <AssistantHeader
                hasMessages={messages.length > 0}
                showExportMenu={showExportMenu}
                onClose={() => setIsOpen(false)}
                onClear={handleClear}
                onExport={handleExport}
                onToggleExportMenu={() => setShowExportMenu((prev) => !prev)}
                exportButtonRef={exportButtonRef}
              />

              {/* Token Counter */}
              {tokenTracker.tokenCount > 0 && (
                <div className="px-4 py-2 bg-brand-500/5 border-b border-brand-500/20 flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Tokens used this session:
                  </span>
                  <span className="font-mono font-semibold text-brand-500">
                    {tokenTracker.tokenCount.toLocaleString()}
                  </span>
                </div>
              )}

              {/* RAG Metadata Display */}
              {ragMetadata && (
                <div className="px-4 py-3 bg-gradient-to-r from-purple-500/5 to-brand-500/5 border-b border-purple-500/20">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Query Intent */}
                    {ragMetadata.intent && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/50 dark:bg-neutral-900/50 border border-purple-500/20">
                        <Target className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-purple-700 dark:text-purple-300">
                          {ragMetadata.intent.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}

                    {/* Confidence Score */}
                    {ragMetadata.confidence !== undefined && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/50 dark:bg-neutral-900/50 border border-green-500/20">
                        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-700 dark:text-green-300">
                          {(ragMetadata.confidence * 100).toFixed(0)}% confident
                        </span>
                      </div>
                    )}

                    {/* Complexity */}
                    {ragMetadata.complexity && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/50 dark:bg-neutral-900/50 border border-orange-500/20">
                        <Zap className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                        <span className="font-medium text-orange-700 dark:text-orange-300 capitalize">
                          {ragMetadata.complexity}
                        </span>
                      </div>
                    )}

                    {/* Code Example Required */}
                    {ragMetadata.requiresCode && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/50 dark:bg-neutral-900/50 border border-blue-500/20">
                        <FileCode className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-700 dark:text-blue-300">
                          Code needed
                        </span>
                      </div>
                    )}

                    {/* Entity Count */}
                    {ragMetadata.entityCount !== undefined &&
                      ragMetadata.entityCount > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/50 dark:bg-neutral-900/50 border border-indigo-500/20">
                          <Users className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-medium text-indigo-700 dark:text-indigo-300">
                            {ragMetadata.entityCount}{' '}
                            {ragMetadata.entityCount === 1
                              ? 'entity'
                              : 'entities'}
                          </span>
                        </div>
                      )}

                    {/* Model Used */}
                    {ragMetadata.modelUsed && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/50 dark:bg-neutral-900/50 border border-neutral-500/20">
                        <Sparkles className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
                        <span className="font-medium text-neutral-700 dark:text-neutral-300 text-[10px]">
                          {ragMetadata.modelUsed
                            .replace('claude-', '')
                            .replace('gpt-', 'GPT-')}
                        </span>
                      </div>
                    )}

                    {/* Sources Count */}
                    {currentCitations.length > 0 && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/50 dark:bg-neutral-900/50 border border-cyan-500/20">
                        <Link2 className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="font-medium text-cyan-700 dark:text-cyan-300">
                          {currentCitations.length}{' '}
                          {currentCitations.length === 1 ? 'source' : 'sources'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-500/10 to-purple-500/10">
                        <Sparkles className="w-8 h-8 text-brand-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Welcome to Docs Assistant
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        Ask me anything about Clarity Chat components, hooks, or
                        best practices.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {suggestionButtons.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSendMessage(suggestion)}
                            className="px-3 py-1.5 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                            aria-label={`Ask: ${suggestion}`}
                            disabled={isLoading}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => {
                      const isError = message.id.includes('-error')
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            'flex gap-3',
                            message.role === 'user'
                              ? 'justify-end'
                              : 'justify-start'
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[85%] rounded-2xl px-4 py-3',
                              message.role === 'user'
                                ? 'bg-brand-500 text-white'
                                : isError
                                  ? 'bg-red-500/10 dark:bg-red-500/20 border border-red-500/30'
                                  : 'bg-neutral-100 dark:bg-neutral-800'
                            )}
                          >
                            {isError && (
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                                  Error
                                </span>
                              </div>
                            )}
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      )
                    })}

                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-neutral-100 dark:bg-neutral-800">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <motion.div
                                className="w-2 h-2 rounded-full bg-neutral-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: durations.slower,
                                  delay: 0,
                                }}
                                viewport={{ once: true }}
                              />
                              <motion.div
                                className="w-2 h-2 rounded-full bg-neutral-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: durations.slower,
                                  delay: 0.2,
                                }}
                                viewport={{ once: true }}
                              />
                              <motion.div
                                className="w-2 h-2 rounded-full bg-neutral-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: durations.slower,
                                  delay: 0.4,
                                }}
                                viewport={{ once: true }}
                              />
                            </div>
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">
                              Thinking...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Follow-up Suggestions */}
                    <FollowUpSuggestions
                      suggestions={suggestedFollowUps}
                      isLoading={isLoading}
                      onSuggestionClick={(suggestion) => {
                        setInputValue(suggestion)
                        inputRef.current?.focus()
                      }}
                    />

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything about Clarity Chat..."
                    className="flex-1 min-h-[60px] max-h-[120px] p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    aria-label={
                      isLoading ? 'Sending message...' : 'Send message'
                    }
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  Press Enter to send • Shift+Enter for new line • ⌘. to toggle
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Export with proper error boundary
export class DocsAssistantErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('DocsAssistant error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-4 right-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg shadow-lg max-w-sm z-[100]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold">Assistant Error</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="text-sm font-medium text-brand-500 hover:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function DocsAssistant({ className }: DocsAssistantProps) {
  return (
    <DocsAssistantErrorBoundary>
      <DocsAssistantInner className={className} />
    </DocsAssistantErrorBoundary>
  )
}
