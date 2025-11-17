'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Code2, Lightbulb, MessageSquare, Sparkles } from 'lucide-react'
import { ChatWindow, FollowUpSuggestions, type FollowUpSuggestion } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { ChatButton } from './ChatButton'
import { cn } from '@/lib/utils'

interface DocsAssistantProps {
  className?: string
}

// Suggested questions to help users get started
const SUGGESTED_QUESTIONS: FollowUpSuggestion[] = [
  {
    id: 'getting-started',
    title: 'How do I get started with Clarity Chat?',
    description: 'Learn the basics of installation and setup',
    icon: <Sparkles className="w-4 h-4" />,
    keywords: ['installation', 'setup', 'quickstart'],
  },
  {
    id: 'streaming',
    title: 'How do I implement streaming messages?',
    description: 'Add real-time streaming to your chat interface',
    icon: <MessageSquare className="w-4 h-4" />,
    keywords: ['streaming', 'real-time', 'SSE'],
  },
  {
    id: 'components',
    title: 'What components are available?',
    description: 'Explore all available UI components',
    icon: <Code2 className="w-4 h-4" />,
    keywords: ['components', 'ui', 'reference'],
  },
  {
    id: 'theming',
    title: 'How do I customize the theme?',
    description: 'Learn about theming and customization options',
    icon: <Lightbulb className="w-4 h-4" />,
    keywords: ['theme', 'customize', 'styling'],
  },
]

// Custom empty state for the docs assistant
function DocsAssistantEmptyState({ onSelectSuggestion }: { onSelectSuggestion: (suggestion: FollowUpSuggestion) => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full p-6 space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      <motion.div
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 shadow-lg ring-1 ring-brand-500/30"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <BookOpen className="w-10 h-10 text-brand-600" />
      </motion.div>

      {/* Content */}
      <div className="space-y-2 text-center max-w-md">
        <h3 className="text-xl font-semibold text-foreground">
          Clarity Chat Documentation Assistant
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          I'm here to help you navigate the documentation and answer questions about Clarity Chat.
          Ask me anything about components, hooks, examples, or best practices.
        </p>
      </div>

      {/* Suggestions */}
      <div className="w-full max-w-2xl">
        <FollowUpSuggestions
          suggestions={SUGGESTED_QUESTIONS}
          onSelect={onSelectSuggestion}
          title="Quick Start"
          subtitle="Try asking about these topics"
          layout="grid"
        />
      </div>
    </motion.div>
  )
}

export function DocsAssistant({ className }: DocsAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date(),
      status: 'sent',
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // TODO: Phase 2.3 - Connect to API endpoint
    // For now, show a placeholder response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `Thank you for your question! The AI assistant is currently being set up.

This is Phase 2.1 - UI Foundation. In the next phases, I'll be connected to:
- **Phase 2.2**: Documentation indexing with vector search
- **Phase 2.3**: RAG-powered API endpoint
- **Phase 2.4**: Real-time streaming responses
- **Phase 2.5**: Session memory and persistence

For now, you can explore the [documentation](/docs) or try the [interactive examples](/examples).`,
        createdAt: new Date(),
        status: 'sent',
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSelectSuggestion = (suggestion: FollowUpSuggestion) => {
    handleSendMessage(suggestion.title)
  }

  return (
    <>
      {/* Chat Button */}
      <ChatButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              'fixed bottom-24 right-6 z-40',
              'w-[90vw] max-w-2xl h-[600px] max-h-[80vh]',
              'shadow-2xl',
              className
            )}
          >
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              showHeader
              sessionTitle="Documentation Assistant"
              sessionSubtitle="Powered by Clarity Chat"
              showMessageCount
              onClear={messages.length > 0 ? () => setMessages([]) : undefined}
              emptyState={<DocsAssistantEmptyState onSelectSuggestion={handleSelectSuggestion} />}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
