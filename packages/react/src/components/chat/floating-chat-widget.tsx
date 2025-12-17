'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClarityChat } from '../../hooks/use-clarity-chat/use-clarity-chat'
import { MessageSquare, X, Send, Sparkles, Bot, Key, ChevronDown, User } from 'lucide-react'

// Simple helper for durations since we might not have access to primitives directly if not exported
const durations = {
    short: 0.2,
    medium: 0.4,
    long: 0.6
}

export interface FloatingChatWidgetProps {
    apiEndpoint?: string
    initialMessage?: string
    title?: string
    subtitle?: string
}

export function FloatingChatWidget({
    apiEndpoint = '/api/chat',
    initialMessage = "Hi! 👋 I'm Aura. Ask me anything!",
    title = 'Aura',
    subtitle = 'AI Specialist • Online'
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [userApiKey, setUserApiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Use Clarity Chat Hook
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useClarityChat({
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
    onError: (err: Error) => {
        console.error("Chat error:", err);
    }
  })

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-surface-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-surface-900 to-surface-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clarity-500 to-cosmic-500 flex items-center justify-center shadow-lg shadow-clarity-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
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
                 >
                    <Key className="w-4 h-4" />
                 </button>
                 <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
                      <Bot className="w-4 h-4 text-clarity-400" />
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
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-clarity-400" />
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
                >
                  <Send className="w-4 h-4" />
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
      >
        {/* Pulse effect */}
        {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-clarity-400 opacity-20 animate-ping" />
        )}
        
        {isOpen ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
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
