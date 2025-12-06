'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isStreaming?: boolean
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hi! I'm your Clarity Chat documentation assistant. Ask me anything about building chat interfaces with our 70+ components and 35+ hooks!",
    sender: 'bot',
    timestamp: new Date(Date.now() - 60000),
  },
]

export function LiveChatDemo() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [userHasScrolledUp, setUserHasScrolledUp] = useState(false)

  // Refs for auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect if user manually scrolled up (wants to read previous content)
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100
    setUserHasScrolledUp(!isAtBottom)
  }, [])

  // Scroll to bottom (respects user intent)
  const scrollToBottom = useCallback((force = false) => {
    if (userHasScrolledUp && !force) return

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }, [userHasScrolledUp])

  // Scroll when new message is added
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Scroll during streaming (throttled)
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => scrollToBottom(), 100)
      return () => clearInterval(interval)
    }
  }, [isStreaming, scrollToBottom])

  const handleSend = async () => {
    if (!input.trim() || isTyping || isStreaming) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    const currentInput = input
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setUserHasScrolledUp(false) // Reset scroll lock
    scrollToBottom(true) // Force scroll
    setIsTyping(true)

    try {
      const response = await fetch('/api/live-demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      setIsTyping(false)
      setIsStreaming(true)

      // Create placeholder message for streaming
      const botMessageId = (Date.now() + 1).toString()
      setMessages(prev => [...prev, {
        id: botMessageId,
        text: '',
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: true,
      }])

      // Read streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let accumulatedText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          accumulatedText += chunk

          // Update the bot message with accumulated text
          setMessages(prev => prev.map(msg =>
            msg.id === botMessageId
              ? { ...msg, text: accumulatedText }
              : msg
          ))
        }

        // Mark streaming as complete
        setMessages(prev => prev.map(msg =>
          msg.id === botMessageId
            ? { ...msg, isStreaming: false }
            : msg
        ))
      }
    } catch (error) {
      console.error('Error getting response:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment!",
        sender: 'bot',
        timestamp: new Date(),
      }])
    } finally {
      setIsTyping(false)
      setIsStreaming(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Demo Label */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-brand-500" />
        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
          AI-Powered Demo - Ask anything about Clarity Chat!
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
              <div className="text-xs opacity-90">Powered by Gemini</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary scroll-smooth"
        >
          {messages.map((message) => (
            <div
              key={message.id}
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
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-brand-500 animate-pulse" />
                  )}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3">
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
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
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
              placeholder="Ask about components, hooks, theming, accessibility..."
              disabled={isTyping || isStreaming}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping || isStreaming}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-text-secondary mt-2 text-center">
            Try: "How do I add streaming?" or "What hooks are available?"
          </p>
        </div>
      </div>
    </div>
  )
}
