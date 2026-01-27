'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClarityChat } from '../../hooks/use-clarity-chat/use-clarity-chat'
import { springPresets, animationPresets } from '@clarity-chat/primitives'
import {
  Sparkles,
  Key,
  X,
  Bot,
  User,
  Loader2,
  Send,
  ChevronDown,
  MessageCircle,
} from 'lucide-react'
import type {
  ClarityMemoryOptions,
  ClarityPromptOptimizationOptions,
} from '../../hooks/use-clarity-chat/types'
import { ANIMATION_PRESETS } from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

export interface FloatingChatWidgetProps {
  apiEndpoint?: string
  initialMessage?: string
  title?: string
  subtitle?: string
  /** Memory configuration for long-term recall */
  memoryConfig?: ClarityMemoryOptions
  /** Prompt optimization configuration for token management */
  optimizationConfig?: ClarityPromptOptimizationOptions
}

export function FloatingChatWidget({
  apiEndpoint = '/api/chat',
  initialMessage = "Hi! 👋 I'm Aura. Ask me anything!",
  title = 'Aura',
  subtitle = 'AI Specialist • Online',
  memoryConfig,
  optimizationConfig,
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [userApiKey, setUserApiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Use Clarity Chat Hook
  const { messages, input, setInput, handleSubmit, isLoading, error } =
    useClarityChat({
      api: apiEndpoint,
      body: {
        apiKey: userApiKey,
      },
      initialMessages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: initialMessage,
        },
      ],
      memory: memoryConfig,
      promptOptimization: optimizationConfig,
    })

  // Helper to extract text content from message
  const getMessageContent = (content: unknown): string => {
    if (typeof content === 'string') return content
    if (Array.isArray(content)) {
      return content
        .filter(
          (part): part is { type: 'text'; text: string } =>
            typeof part === 'object' && part !== null && part.type === 'text'
        )
        .map((part) => part.text)
        .join('')
    }
    return String(content)
  }

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading, error])

  // Use standardized animation variants from primitives
  // Using 'popover' preset for the chat window as it matches the behavior best
  const windowVariants = animationPresets.tooltip.variants // Tooltip variants are simple fades/scales, good for chat

  // Custom variant combining slide-up with scale for a more "chat-like" entrance
  const customChatVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: {
          opacity: 0,
          scale: 0.9,
          y: 20,
          transformOrigin: 'bottom right',
        },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
      }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={customChatVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={
              prefersReducedMotion ? { duration: 0 } : springPresets.snappy
            }
            viewport={{ once: true }}
            className="mb-4 w-[min(95vw,350px)] sm:w-96 md:w-[400px] h-[min(70vh,500px)] max-h-[500px] bg-popover/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{title}</h3>
                  <p className="text-xs text-white/80">{subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  className={`p-2 rounded-lg transition-colors ${userApiKey ? 'text-white bg-white/20' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                  title="Enter API Key"
                  aria-label="Enter API Key"
                >
                  <Key className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* API Key Input (Collapsible) */}
            <AnimatePresence>
              {showKeyInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-muted/50 border-b border-border overflow-hidden"
                >
                  <div className="p-3">
                    <label className="text-[10px] uppercase text-muted-foreground font-bold mb-1 block">
                      OpenAI API Key (Optional)
                    </label>
                    <input
                      type="password"
                      placeholder="sk-..."
                      value={userApiKey}
                      onChange={(e) => setUserApiKey(e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:border-primary outline-none"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {userApiKey
                        ? 'Key set! Using your custom key.'
                        : 'Using default demo key.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <motion.div
                  {...ANIMATION_PRESETS.slideUp}
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none shadow-md'
                        : 'bg-muted text-foreground border border-border rounded-bl-none shadow-sm'
                    }`}
                  >
                    {getMessageContent(msg.content)}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Error Message */}
              {error && (
                <motion.div
                  {...ANIMATION_PRESETS.fadeIn}
                  className="flex justify-center my-2"
                >
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs px-3 py-2 rounded-lg max-w-[90%] text-center">
                    <span className="font-bold block mb-1">Error</span>
                    {error.message || 'Something went wrong. Please try again.'}
                  </div>
                </motion.div>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted border border-border rounded-2xl rounded-bl-none p-3 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-muted/30 border-t border-border">
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center"
              >
                <input
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        viewport={{ once: true }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 focus:outline-none"
        aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
      >
        {/* Pulse effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping" />
        )}

        {isOpen ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              {...ANIMATION_PRESETS.slideLeft}
              className="absolute right-16 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs font-semibold px-3 py-1.5 rounded-lg border border-border whitespace-nowrap shadow-xl"
            >
              Chat with {title}
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-popover border-r border-b border-border rotate-[-45deg]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
