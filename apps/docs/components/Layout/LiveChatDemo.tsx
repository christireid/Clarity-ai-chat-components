'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Sparkles, Zap, Code, Palette, Wand2 } from 'lucide-react'
import { useAutoScroll, useStreaming, TypingIndicator } from '@clarity-chat/react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isStreaming?: boolean
}

// Generate unique message IDs (collision-safe)
const generateId = () => crypto.randomUUID()

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hi! I'm your Clarity Chat documentation assistant. Ask me anything about building chat interfaces with our 70+ components and 35+ hooks!",
    sender: 'bot',
    timestamp: new Date(Date.now() - 60000),
  },
]

const SUGGESTIONS = [
  { text: "How do I add streaming?", icon: Zap },
  { text: "Show me a code snippet", icon: Code },
  { text: "Can I customize the theme?", icon: Palette },
  { text: "What hooks are available?", icon: Wand2 },
]

export function LiveChatDemo() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Use ref to avoid closure issues in callbacks
  const currentBotMessageIdRef = useRef<string | null>(null)

  // Use the shared useAutoScroll hook from @clarity-chat/react
  const { scrollRef, scrollToBottom, setEnabled } = useAutoScroll({
    dependencies: [messages],
    threshold: 100,
  })

  // Use the shared useStreaming hook from @clarity-chat/react
  // The hook provides `content` which accumulates all streamed text
  const { content, isStreaming, startStreaming, reset } = useStreaming({
    onError: (error) => {
      console.error('Streaming error:', error)
      setMessages(prev => [...prev, {
        id: generateId(),
        text: "I'm having trouble connecting right now. Please try again in a moment!",
        sender: 'bot',
        timestamp: new Date(),
      }])
      currentBotMessageIdRef.current = null
    },
    onComplete: () => {
      // Mark streaming as complete
      const msgId = currentBotMessageIdRef.current
      if (msgId) {
        setMessages(prev => prev.map(msg =>
          msg.id === msgId ? { ...msg, isStreaming: false } : msg
        ))
        currentBotMessageIdRef.current = null
      }
    }
  })

  // Sync streaming content to the current bot message
  // This is more reliable than using onChunk with closures
  useEffect(() => {
    const msgId = currentBotMessageIdRef.current
    if (msgId && content) {
      setMessages(prev => prev.map(msg =>
        msg.id === msgId ? { ...msg, text: content } : msg
      ))
    }
  }, [content])

  // Scroll during streaming
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => scrollToBottom(), 100)
      return () => clearInterval(interval)
    }
  }, [isStreaming, scrollToBottom])

  const handleSend = async (textInput?: string) => {
    const messageText = textInput || input
    if (!messageText.trim() || isTyping || isStreaming) return

    const userMessage: Message = {
      id: generateId(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    }

    const currentInput = messageText
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setShowSuggestions(false)
    setEnabled(true) // Enable auto-scroll
    scrollToBottom() // Force scroll
    setIsTyping(true)

    try {
      const response = await fetch('/api/live-demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      })

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response')
      }

      setIsTyping(false)

      // Create placeholder message for streaming
      const botMessageId = generateId()
      currentBotMessageIdRef.current = botMessageId
      setMessages(prev => [...prev, {
        id: botMessageId,
        text: '',
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: true,
      }])

      // Use the streaming hook to handle the response
      await startStreaming(response.body)

    } catch (error) {
      console.error('Error getting response:', error)
      setMessages(prev => [...prev, {
        id: generateId(),
        text: "I'm having trouble connecting right now. Please try again in a moment!",
        sender: 'bot',
        timestamp: new Date(),
      }])
      setIsTyping(false)
      reset()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Demo Label */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
          AI-Powered Demo - Ask anything about Clarity Chat!
        </span>
      </motion.div>

      {/* Chat Window */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border-2 border-brand-500/20 shadow-2xl overflow-hidden bg-bg-primary relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-4 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] w-[200%] translate-x-[-100%] animate-[shimmer_3s_infinite]" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">
                Clarity Chat Assistant
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
              </div>
              <div className="text-xs opacity-90">Powered by Gemini</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef as React.RefObject<HTMLDivElement>}
          className="h-[400px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-bg-secondary/50 to-bg-primary scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  message.sender === 'bot'
                    ? 'bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400'
                    : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                }`}>
                  {message.sender === 'bot' ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                  message.sender === 'bot'
                    ? 'bg-white dark:bg-gray-800 text-text-primary rounded-tl-sm border border-border/50'
                    : 'bg-brand-500 text-white rounded-tr-sm'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap markdown-body">
                    {message.text}
                    {message.isStreaming && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-brand-500 animate-pulse align-middle" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <TypingIndicator
                  showAvatar
                  avatarFallback="AI"
                  label="Thinking..."
                  variant="dots"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-bg-primary relative z-20">
          <AnimatePresence>
            {showSuggestions && !isTyping && !isStreaming && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide"
              >
                {SUGGESTIONS.map((suggestion, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05, backgroundColor: "var(--brand-50)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSend(suggestion.text)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-bg-secondary border border-border rounded-full text-xs font-medium text-text-secondary hover:text-brand-600 hover:border-brand-200 transition-colors whitespace-nowrap"
                  >
                    <suggestion.icon className="w-3 h-3" />
                    {suggestion.text}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2 relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about components, hooks, theming, accessibility..."
              disabled={isTyping || isStreaming}
              className="flex-1 px-4 py-3 pl-4 pr-12 rounded-xl border border-border bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-sm disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isTyping || isStreaming}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1.5 bottom-1.5 aspect-square bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:cursor-not-allowed shadow-md"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
          <div className="text-[10px] text-text-secondary mt-2 text-center opacity-70">
            Powered by Gemini • Reads entire documentation in real-time
          </div>
        </div>
      </motion.div>
    </div>
  )
}
