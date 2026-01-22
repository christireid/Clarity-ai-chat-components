'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import {
  Send,
  User,
  Sparkles,
  Zap,
  Code,
  Palette,
  Wand2,
  RefreshCw,
  AlertCircle,
  MessageCircle,
} from 'lucide-react'
import {
  useAutoScroll,
  useStreaming,
  TypingIndicator,
} from '@clarity-chat/react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from '../MDX/CodeBlock'
import { durations } from '@/lib/animations'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isStreaming?: boolean
  isError?: boolean
}

// Generate unique message IDs (collision-safe)
const generateId = () => crypto.randomUUID()

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hi! I'm your Clarity Chat documentation assistant. Ask me anything about building chat interfaces with our 155+ components and 70+ hooks!",
    sender: 'bot',
    timestamp: new Date(Date.now() - 60000),
  },
]

const SUGGESTIONS = [
  { text: 'How do I add streaming?', icon: Zap },
  { text: 'Show me a code snippet', icon: Code },
  { text: 'Can I customize the theme?', icon: Palette },
  { text: 'What hooks are available?', icon: Wand2 },
]

/**
 * Memoized Markdown component using react-markdown
 * This replaces the custom regex parser for robust Markdown support
 */
const MemoizedReactMarkdown = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    (prevProps as { className?: string }).className === (nextProps as { className?: string }).className
)

export function LiveChatDemo() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isError, setIsError] = useState(false)

  // Use ref to avoid closure issues in callbacks
  const currentBotMessageIdRef = useRef<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Use the shared useAutoScroll hook from @clarity-chat/react
  const { scrollRef, scrollToBottom, setEnabled } = useAutoScroll({
    dependencies: [messages],
    threshold: 100,
  })

  // Use the shared useStreaming hook from @clarity-chat/react
  const {
    content,
    isStreaming,
    startStreaming,
    reset: resetStreaming,
  } = useStreaming({
    onError: (error) => {
      console.error('Streaming error:', error)
      setIsError(true)
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1]
        // If the last message was the one streaming, mark it as error
        if (lastMsg && lastMsg.id === currentBotMessageIdRef.current) {
          return prev.map((msg) =>
            msg.id === lastMsg.id
              ? {
                  ...msg,
                  isStreaming: false,
                  isError: true,
                  text: msg.text + '\n\n[Connection interrupted]',
                }
              : msg
          )
        }
        return [
          ...prev,
          {
            id: generateId(),
            text: "I'm having trouble connecting right now. Please try again in a moment!",
            sender: 'bot',
            timestamp: new Date(),
            isError: true,
          },
        ]
      })
      currentBotMessageIdRef.current = null
    },
    onComplete: () => {
      // Mark streaming as complete
      const msgId = currentBotMessageIdRef.current
      if (msgId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === msgId ? { ...msg, isStreaming: false } : msg
          )
        )
        currentBotMessageIdRef.current = null
      }
    },
  })

  // Sync streaming content to the current bot message
  useEffect(() => {
    const msgId = currentBotMessageIdRef.current
    if (msgId && content) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === msgId ? { ...msg, text: content } : msg))
      )
    }
  }, [content])

  // Scroll during streaming
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => scrollToBottom(), 100)
      return () => clearInterval(interval)
    }
  }, [isStreaming, scrollToBottom])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleSend = async (textInput?: string) => {
    const messageText = textInput || input
    if (!messageText.trim() || isTyping || isStreaming) return

    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    const userMessage: Message = {
      id: generateId(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    }

    const currentInput = messageText
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setShowSuggestions(false)
    setIsError(false)
    setEnabled(true) // Enable auto-scroll
    scrollToBottom() // Force scroll
    setIsTyping(true)

    try {
      const response = await fetch('/api/live-demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response')
      }

      setIsTyping(false)

      // Create placeholder message for streaming
      const botMessageId = generateId()
      currentBotMessageIdRef.current = botMessageId
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          text: '',
          sender: 'bot',
          timestamp: new Date(),
          isStreaming: true,
        },
      ])

      // Use the streaming hook to handle the response
      await startStreaming(response.body)
    } catch (error: unknown) {
      // Clear typing state on abort to prevent stuck UI
      if (error instanceof Error && error.name === 'AbortError') {
        setIsTyping(false)
        return
      }

      console.error('Error getting response:', error)
      setIsError(true)
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: "I'm having trouble connecting right now. Please try again in a moment!",
          sender: 'bot',
          timestamp: new Date(),
          isError: true,
        },
      ])
      resetStreaming()
    } finally {
      abortControllerRef.current = null
    }
  }

  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setMessages(initialMessages)
    setInput('')
    setShowSuggestions(true)
    setIsTyping(false)
    setIsError(false)
    resetStreaming()
    currentBotMessageIdRef.current = null
  }, [resetStreaming])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Demo Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
          AI-Powered Demo - Ask anything about Clarity Chat!
        </span>
      </motion.div>

      {/* Chat Window - Premium glass effect with multi-layer shadows */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: durations.slow }}
        className="rounded-2xl overflow-hidden bg-bg-primary relative group
          border border-white/[0.08] dark:border-white/[0.06]

          /* Multi-layer shadow system */
          shadow-[0_2px_4px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.05),0_16px_32px_rgba(0,0,0,0.05)]
          dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.2),0_8px_16px_rgba(0,0,0,0.15),0_16px_32px_rgba(0,0,0,0.1)]

          /* Hover glow effect */
          transition-shadow duration-300 ease-out
          hover:shadow-[0_4px_8px_rgba(99,102,241,0.08),0_8px_16px_rgba(99,102,241,0.06),0_16px_32px_rgba(99,102,241,0.04),0_0_60px_rgba(99,102,241,0.08)]
          dark:hover:shadow-[0_4px_8px_rgba(129,140,248,0.15),0_8px_16px_rgba(129,140,248,0.1),0_16px_32px_rgba(129,140,248,0.05),0_0_60px_rgba(129,140,248,0.12)]
        "
      >
        {/* Header - Premium indigo to pink gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-4 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] w-[200%] translate-x-[-100%] animate-[shimmer_3s_infinite]" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              {/* Unique AI icon - replaces generic bot */}
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner ring-1 ring-white/30 relative">
                <MessageCircle className="w-5 h-5" />
                <Sparkles className="w-3 h-3 absolute -top-0.5 -right-0.5 text-yellow-300 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold flex items-center gap-2 truncate">
                  <span className="truncate">Clarity Chat</span>
                  <span className="flex h-2 w-2 relative flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </span>
                </div>
                <div className="text-xs opacity-90 font-medium truncate">
                  Powered by Claude
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleReset}
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              viewport={{ once: true }}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none flex items-center justify-center flex-shrink-0"
              title="Reset Demo"
              aria-label="Reset chat demo"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef as React.RefObject<HTMLDivElement>}
          className="h-[450px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-bg-secondary/50 to-bg-primary scroll-smooth"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                viewport={{ once: true }}
                transition={{
                  duration: durations.moderate,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar - consistent 32x32px with unique AI icon */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-inset relative ${
                    message.sender === 'bot'
                      ? message.isError
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-red-500/20'
                        : 'bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20'
                      : 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 ring-brand-500/20'
                  }`}
                >
                  {message.sender === 'bot' ? (
                    message.isError ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        <Sparkles className="w-2 h-2 absolute -top-0.5 -right-0.5 text-yellow-500" />
                      </>
                    )
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                    message.sender === 'bot'
                      ? message.isError
                        ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-tl-sm'
                        : 'bg-bg-secondary dark:bg-bg-tertiary text-text-primary rounded-tl-sm border border-border'
                      : 'bg-brand-500 text-white rounded-tr-sm'
                  }`}
                >
                  <div className="text-sm">
                    {message.sender === 'bot' ? (
                      <>
                        <div className="markdown-body">
                          <MemoizedReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({
                                node,
                                className,
                                children,
                                ...props
                              }: any) {
                                const match = /language-(\w+)/.exec(
                                  className || ''
                                )
                                const isInline =
                                  !match && !String(children).includes('\n')

                                if (!isInline) {
                                  return (
                                    <div className="my-3 not-prose w-full overflow-hidden rounded-md">
                                      <CodeBlock
                                        code={String(children).replace(
                                          /\n$/,
                                          ''
                                        )}
                                        language={
                                          match ? match[1] : 'typescript'
                                        }
                                        className="!my-0 !shadow-none border border-border/50 text-xs"
                                      />
                                    </div>
                                  )
                                }
                                return (
                                  <code
                                    className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-xs text-brand-600 dark:text-brand-400 break-words"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                )
                              },
                              // Style other markdown elements
                              p: ({ children }) => (
                                <p className="leading-relaxed whitespace-pre-wrap mb-2 last:mb-0">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc pl-5 space-y-1 my-2">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-5 space-y-1 my-2">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="pl-1">{children}</li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-brand-700 dark:text-brand-300">
                                  {children}
                                </strong>
                              ),
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-600 dark:text-brand-400 hover:underline"
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {message.text}
                          </MemoizedReactMarkdown>
                        </div>
                        {message.isStreaming && (
                          <span className="inline-block w-1.5 h-4 ml-1 bg-brand-500 animate-pulse align-middle" />
                        )}
                      </>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
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
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-1 ring-inset ring-indigo-500/20 relative">
                  <MessageCircle className="w-4 h-4" />
                  <Sparkles className="w-2 h-2 absolute -top-0.5 -right-0.5 text-yellow-500 animate-pulse" />
                </div>
                <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50 shadow-sm">
                  <TypingIndicator
                    label="Thinking..."
                    variant="dots"
                    className="text-brand-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-bg-primary relative z-20">
          {/* Gradient Mask for Suggestions */}
          <AnimatePresence>
            {showSuggestions && !isTyping && !isStreaming && !isError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade">
                  {SUGGESTIONS.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSend(suggestion.text)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-bg-secondary hover:bg-brand-50 dark:hover:bg-brand-900/30 border border-border rounded-full text-sm font-medium text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-700 transition-colors whitespace-nowrap shadow-sm focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                    >
                      <suggestion.icon className="w-3 h-3" />
                      {suggestion.text}
                    </motion.button>
                  ))}
                </div>
                {/* Fade masks */}
                <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2 relative group/input"
            role="search"
            aria-label="Chat with Clarity assistant"
          >
            <label htmlFor="chat-demo-input" className="sr-only">
              Type your message to the Clarity Chat Assistant
            </label>
            <input
              id="chat-demo-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isError
                  ? 'Try asking again...'
                  : 'Ask about components, hooks, theming...'
              }
              disabled={isTyping || isStreaming}
              aria-describedby="chat-demo-status"
              className={`flex-1 px-4 py-3.5 min-h-[48px] pl-4 pr-12 rounded-xl border bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus-visible:ring-2 transition-all shadow-sm disabled:opacity-50 ${
                isError
                  ? 'border-red-300 focus:border-red-500 focus-visible:ring-red-200'
                  : 'border-border focus:border-brand-500 focus-visible:ring-brand-500/50'
              }`}
            />
            <AnimatePresence mode="wait">
              {input.trim() ? (
                <motion.button
                  key="send"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  viewport={{ once: true }}
                  type="submit"
                  disabled={isTyping || isStreaming}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-1 top-1 bottom-1 w-[46px] bg-brand-500 hover:bg-brand-600 text-white rounded-lg flex items-center justify-center transition-colors shadow-md focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.5 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  viewport={{ once: true }}
                  className="absolute right-2 top-1.5 bottom-1.5 aspect-square flex items-center justify-center pointer-events-none"
                >
                  <Sparkles className="w-4 h-4 text-text-tertiary" />
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          <div id="chat-demo-status" className="text-[11px] text-text-secondary mt-2 text-center opacity-70 flex items-center justify-center gap-1.5" role="status" aria-live="polite">
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${isError ? 'bg-red-500' : 'bg-green-500'}`}
              aria-hidden="true"
            />
            {isError
              ? 'Connection interrupted'
              : 'Powered by Claude - Reads entire documentation in real-time'}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
