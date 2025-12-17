'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClarityChat } from '../../hooks/use-clarity-chat/use-clarity-chat'
import { springPresets, animationPresets } from '@clarity-chat/primitives'
import { LoadingIcon, CloseIcon } from '@clarity-chat/primitives/components/icons'
import type { ClarityMemoryOptions, ClarityPromptOptimizationOptions } from '../../hooks/use-clarity-chat/types'

// --- Icons ---
const Icons = {
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  ),
  Key: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  Bot: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7V5.73C7.4 5.39 7 4.74 7 4a2 2 0 0 1 2-2h3z" />
    </svg>
  ),
  User: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Send: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Message: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

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
    optimizationConfig
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [userApiKey, setUserApiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Use Clarity Chat Hook
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useClarityChat({
    api: apiEndpoint,
    body: {
        apiKey: userApiKey
    },
    initialMessages: [
        {
            id: 'welcome',
            role: 'assistant',
            content: initialMessage
        }
    ],
    memory: memoryConfig,
    promptOptimization: optimizationConfig,
  })

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
  const customChatVariants = {
      initial: { opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 20 }
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
            transition={springPresets.snappy}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-surface-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-surface-900 to-surface-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clarity-500 to-cosmic-500 flex items-center justify-center shadow-lg shadow-clarity-500/20">
                    <Icons.Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface-900 rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{title}</h3>
                  <p className="text-xs text-clarity-400">{subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                 <button 
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className={`p-2 rounded-lg transition-colors ${userApiKey ? 'text-clarity-400 bg-clarity-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    title="Enter API Key"
                    aria-label="Enter API Key"
                 >
                    <Icons.Key className="w-4 h-4" />
                 </button>
                 <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    aria-label="Close Chat"
                 >
                    <CloseIcon className="w-5 h-5" />
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
                        className="bg-surface-800 border-b border-white/5 overflow-hidden"
                    >
                        <div className="p-3">
                            <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">OpenAI API Key (Optional)</label>
                            <input 
                                type="password" 
                                placeholder="sk-..." 
                                value={userApiKey}
                                onChange={(e) => setUserApiKey(e.target.value)}
                                className="w-full bg-surface-950 border border-white/10 rounded-md px-2 py-1.5 text-xs text-white focus:border-clarity-500 outline-none"
                            />
                            <p className="text-[10px] text-gray-500 mt-1">
                                {userApiKey ? 'Key set! Using your custom key.' : 'Using default demo key.'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center flex-shrink-0">
                      <Icons.Bot className="w-4 h-4 text-clarity-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-clarity-600 to-cosmic-600 text-white rounded-br-none shadow-lg shadow-clarity-500/10'
                        : 'bg-surface-800 border border-white/5 text-gray-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center flex-shrink-0">
                      <Icons.User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Error Message */}
              {error && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center my-2"
                >
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-3 py-2 rounded-lg max-w-[90%] text-center">
                        <span className="font-bold block mb-1">Error</span>
                        {error.message || 'Something went wrong. Please try again.'}
                    </div>
                </motion.div>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center flex-shrink-0">
                      <Icons.Bot className="w-4 h-4 text-clarity-400" />
                    </div>
                    <div className="bg-surface-800 border border-white/5 rounded-2xl rounded-bl-none p-3 flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100" />
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200" />
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-surface-900 border-t border-white/5">
              <form 
                onSubmit={handleSubmit}
                className="relative flex items-center"
              >
                <input
                  autoFocus
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about pricing, features..."
                  className="w-full bg-surface-800 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-clarity-500/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-1.5 bg-clarity-500 text-white rounded-lg hover:bg-clarity-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  {isLoading ? <LoadingIcon className="w-4 h-4" /> : (
                    <Icons.Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-clarity-500 to-cosmic-500 shadow-lg shadow-clarity-500/30 text-white focus:outline-none"
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        {/* Pulse effect */}
        {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-clarity-400 opacity-20 animate-ping" />
        )}
        
        {isOpen ? (
          <Icons.ChevronDown className="w-6 h-6" />
        ) : (
          <Icons.Message className="w-6 h-6" />
        )}

        {/* Tooltip */}
        <AnimatePresence>
            {isHovered && !isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute right-16 top-1/2 -translate-y-1/2 bg-surface-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 whitespace-nowrap shadow-xl"
                >
                    Chat with {title}
                    <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-surface-800 border-r border-b border-white/10 rotate-[-45deg]" />
                </motion.div>
            )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
