'use client'

/**
 * DocsAssistant - Simplified Documentation Assistant
 *
 * A clean, working implementation using available components.
 * Can be enhanced as more token optimization components become available.
 */

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  BookOpen,
  Sparkles,
  Send,
  AlertTriangle,
} from 'lucide-react'
import { ChatButton } from './ChatButton'
import { useDocsChat } from './hooks'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

interface DocsAssistantProps {
  className?: string
}

function DocsAssistantInner({ className }: DocsAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    isLoading,
    tokenTracker,
    handleSendMessage,
    handleClear,
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
        setIsOpen(prev => !prev)
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const suggestionButtons = [
    'How do I optimize token usage?',
    'Show me streaming examples',
    'What components are available?',
  ]

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <ChatButton
          onClick={() => setIsOpen(true)}
          isOpen={false}
        />
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
              transition={{ duration: durations.moderate, ease: [0.25, 0.1, 0.25, 1] }}
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
