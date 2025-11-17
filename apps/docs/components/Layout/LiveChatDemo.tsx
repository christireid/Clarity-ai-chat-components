'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hi! I can help you build amazing chat interfaces. What would you like to know?',
    sender: 'bot',
    timestamp: new Date(Date.now() - 60000),
  },
]

const predefinedResponses: Record<string, string> = {
  components: 'Clarity Chat includes 70+ components including ChatWindow, Message, MessageList, InputBar, FileUpload, and many more!',
  accessibility: 'All components are WCAG AAA compliant with full keyboard navigation, screen reader support, and ARIA attributes.',
  theming: 'Choose from 11 built-in themes or create your own! Dark mode is supported by default.',
  performance: 'Built with performance in mind - virtual scrolling for 1000+ messages, React.memo optimization, and tree-shaking support.',
  default: 'Great question! Clarity Chat makes it easy to build production-ready chat UIs. Try asking about components, accessibility, theming, or performance!',
}

export function LiveChatDemo() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const key = Object.keys(predefinedResponses).find(k =>
        input.toLowerCase().includes(k)
      ) || 'default'

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: predefinedResponses[key],
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      {/* Demo Label */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-brand-500" />
        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
          Interactive Demo - Try it!
        </span>
      </div>

      {/* Chat Window */}
      <div className="rounded-2xl border-2 border-brand-500/20 shadow-2xl overflow-hidden bg-bg-primary">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold">Clarity Chat Assistant</div>
              <div className="text-xs opacity-90">Always online</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
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
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.sender === 'bot'
                  ? 'bg-bg-secondary text-text-primary rounded-tl-sm'
                  : 'bg-brand-500 text-white rounded-tr-sm'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-text-secondary animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-text-secondary animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-text-secondary animate-bounce" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4 bg-bg-primary">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about components, theming, accessibility..."
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-text-secondary mt-2 text-center">
            Try asking about: components, accessibility, theming, performance
          </p>
        </div>
      </div>
    </motion.div>
  )
}
