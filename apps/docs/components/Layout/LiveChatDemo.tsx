'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Code,
  Palette,
  Wand2,
  RefreshCw,
  AlertCircle,
  X,
} from 'lucide-react'
import {
  useAutoScroll,
  useStreaming,
  TypingIndicator,
} from '@clarity-chat/react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
    text: "👋 Hi! I'm your **Clarity Chat** documentation assistant. Ask me anything about building chat interfaces with our **155+ components** and **70+ hooks**!\n\n💡 **Try asking:**\n- How do I add streaming?\n- Show me a code snippet\n- Can I customize the theme?\n- What hooks are available?",
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
// Memoized markdown component for performance
const MemoizedReactMarkdown = memo(
  ReactMarkdown,
  (prevProps, nextProps) => {
    // Only re-render if children actually changed
    return prevProps.children === nextProps.children
  }
)

export function LiveChatDemo() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isError, setIsError] = useState(false)
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false)
  const [apiKey, setApiKey] = useState<string>('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [currentProvider, setCurrentProvider] = useState<'gemini' | 'rag' | 'demo'>('rag')

  // Load API key from sessionStorage on mount
  useEffect(() => {
    const storedKey = sessionStorage.getItem('gemini_api_key')
    if (storedKey) {
      setApiKey(storedKey)
      setShowApiKeyPrompt(false)
    } else {
      // Show prompt after a short delay to let the component render first
      const timer = setTimeout(() => {
        setShowApiKeyPrompt(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

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
    onError: (error: Error) => {
      console.error('Streaming error:', error)
      setIsError(true)
      setIsTyping(false)
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1]
        // If the last message was the one streaming, mark it as error
        if (lastMsg && lastMsg.id === currentBotMessageIdRef.current) {
      const errorMessage = lastMsg.text.trim() 
        ? `${lastMsg.text}\n\n---\n\n⚠️ **Connection Interrupted**\n\nI encountered an error while responding. ${lastMsg.text.length > 50 ? 'Your partial response is shown above.' : 'Please try again.'}\n\n**What you can do:**\n- Check your internet connection\n- Try sending your message again\n- Refresh the page if the issue persists`
        : "⚠️ **Connection Error**\n\nI'm having trouble connecting right now. Please try again in a moment!\n\n**Troubleshooting:**\n- Check your internet connection\n- Try refreshing the page\n- If the problem persists, the service may be temporarily unavailable"
          
          return prev.map((msg) =>
            msg.id === lastMsg.id
              ? {
                  ...msg,
                  isStreaming: false,
                  isError: true,
                  text: errorMessage,
                }
              : msg
          )
        }
        return [
          ...prev,
          {
            id: generateId(),
            text: "⚠️ **Connection Error**\n\nI'm having trouble connecting right now. Please try again in a moment!",
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

  // Sync streaming content to the current bot message with optimized updates
  useEffect(() => {
    const msgId = currentBotMessageIdRef.current
    if (msgId && content !== undefined) {
      // Only update if content is not empty or if it's the first chunk
      if (content.trim().length > 0 || content.length === 0) {
        // Use requestAnimationFrame for smooth, batched updates
        const rafId = requestAnimationFrame(() => {
          // Double-check msgId is still current (streaming might have completed)
          if (msgId === currentBotMessageIdRef.current) {
            setMessages((prev) =>
              prev.map((msg) => 
                msg.id === msgId 
                  ? { ...msg, text: content, isStreaming: true }
                  : msg
              )
            )
          }
        })
        return () => cancelAnimationFrame(rafId)
      }
    }
  }, [content])

  // Scroll during streaming - optimized to only scroll when content changes
  useEffect(() => {
    if (isStreaming && content) {
      // Use requestAnimationFrame to batch scroll calls with content updates
      const rafId = requestAnimationFrame(() => {
        scrollToBottom()
      })
      return () => cancelAnimationFrame(rafId)
    }
  }, [isStreaming, content, scrollToBottom])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleSend = async (textInput?: string) => {
    const messageText = (textInput || input).trim()
    // Validate message length and content
    if (!messageText || messageText.length === 0) {
      return
    }
    if (messageText.length > 4096) {
      setIsError(true)
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: '⚠️ **Message too long**\n\nYour message exceeds the maximum length of 4096 characters. Please shorten it and try again.',
          sender: 'bot',
          timestamp: new Date(),
          isError: true,
        },
      ])
      return
    }
    if (isTyping || isStreaming) return

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
      // Include API key in headers if provided
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (apiKey) {
        headers['X-Gemini-API-Key'] = apiKey
      }

      const response = await fetch('/api/live-demo-chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: currentInput }),
        signal: abortControllerRef.current.signal,
      })

      // Check if response indicates RAG mode (no API key available)
      // This will be detected by checking the response or we can add a header
      const responseProvider = response.headers.get('X-Response-Provider') as 'gemini' | 'rag' | 'demo' | null
      if (responseProvider) {
        setCurrentProvider(responseProvider)
        // Show API key prompt if using RAG/demo and no key is set
        if ((responseProvider === 'rag' || responseProvider === 'demo') && !apiKey) {
          setShowApiKeyPrompt(true)
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error || `Server error: ${response.status} ${response.statusText}`
        )
      }

      if (!response.body) {
        throw new Error('Response body is null')
      }

      setIsTyping(false)

      // Create placeholder message for streaming
      const botMessageId = generateId()
      currentBotMessageIdRef.current = botMessageId
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          text: '', // Start with empty string, will be populated by streaming
          sender: 'bot',
          timestamp: new Date(),
          isStreaming: true,
        },
      ])
      
      // Ensure scroll happens after message is added
      setTimeout(() => scrollToBottom(), 0)

      // Use the streaming hook to handle the response
      await startStreaming(response.body)
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Request was cancelled, don't show error
        return
      }

      console.error('Error getting response:', error)
      setIsError(true)
      setIsTyping(false)
      
      // Clear any streaming message that might have been created
      if (currentBotMessageIdRef.current) {
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== currentBotMessageIdRef.current)
        )
        currentBotMessageIdRef.current = null
      }
      
      // Show user-friendly error message with better formatting
      let errorMessage = ''
      if (error.message?.includes('Failed to fetch')) {
        errorMessage = "⚠️ **Connection Error**\n\nUnable to connect to the server.\n\n**Possible solutions:**\n- Check your internet connection\n- Try refreshing the page\n- The service may be temporarily unavailable"
      } else if (error.message?.includes('API key')) {
        errorMessage = `⚠️ **API Configuration Error**\n\n${error.message}\n\n**What to do:**\n- Verify your API key is correct\n- Check that the key has the necessary permissions\n- Try adding the key again`
      } else {
        errorMessage = `⚠️ **Error**\n\n${error.message || "I'm having trouble connecting right now. Please try again in a moment!"}\n\n**Troubleshooting:**\n- Try sending your message again\n- Refresh the page if needed\n- Check your internet connection`
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: errorMessage,
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
    setCurrentProvider('rag') // Reset to default provider
    resetStreaming()
    currentBotMessageIdRef.current = null
  }, [resetStreaming])

  const handleApiKeySubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      const trimmedKey = apiKey.trim()
      sessionStorage.setItem('gemini_api_key', trimmedKey)
      setShowApiKeyPrompt(false)
      setShowApiKeyInput(false)
      setCurrentProvider('gemini') // Optimistically set to gemini
      // Show confirmation message
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: '✅ Gemini API key saved! I\'ll use it for enhanced AI responses. Try asking me something!',
          sender: 'bot',
          timestamp: new Date(),
        },
      ])
    }
  }, [apiKey])

  const handleSkipApiKey = useCallback(() => {
    setShowApiKeyPrompt(false)
    setShowApiKeyInput(false)
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Demo Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles className="w-4 h-4 text-brand-500 drop-shadow-sm" />
        </motion.div>
        <span className="text-sm font-medium text-brand-600 dark:text-brand-400 bg-gradient-to-r from-brand-600 to-brand-500 dark:from-brand-400 dark:to-brand-300 bg-clip-text text-transparent">
          AI-Powered Demo - Ask anything about Clarity Chat!
        </span>
      </motion.div>

      {/* Chat Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: durations.slow, ease: 'easeOut' }}
        className="rounded-2xl border-2 border-brand-500/20 shadow-2xl overflow-hidden bg-bg-primary relative group hover:shadow-3xl transition-shadow duration-300"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none" 
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
               backgroundSize: '24px 24px'
             }}
        />
        {/* Subtle glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500/0 via-brand-500/10 to-brand-500/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
        {/* API Key Prompt Banner */}
        <AnimatePresence>
          {showApiKeyPrompt && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gradient-to-r from-brand-50 via-brand-100/50 to-brand-50 dark:from-brand-900/20 dark:via-brand-800/15 dark:to-brand-900/20 border-b-2 border-brand-200 dark:border-brand-800 overflow-hidden shadow-sm"
            >
              <div className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-100 mb-1">
                      🚀 Want Enhanced AI Responses?
                    </h3>
                    <p className="text-xs text-brand-700 dark:text-brand-300 mb-3">
                      Add your Gemini API key for more intelligent, context-aware answers. 
                      Your key is stored locally and only used for this session.
                    </p>
                    {showApiKeyInput ? (
                      <form onSubmit={handleApiKeySubmit} className="space-y-2">
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter your Gemini API key (AIza...)"
                          className="w-full px-3 py-2 text-sm border-2 border-brand-300 dark:border-brand-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all duration-200 shadow-sm focus:shadow-md"
                          autoFocus
                        />
                        <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                        >
                          Save Key
                        </button>
                        <button
                          type="button"
                          onClick={handleSkipApiKey}
                          className="px-4 py-1.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                          Skip
                        </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowApiKeyInput(true)}
                          className="px-4 py-1.5 text-xs font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                        >
                          Add API Key
                        </button>
                        <button
                          onClick={handleSkipApiKey}
                          className="px-4 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200 transition-colors duration-200 underline-offset-2 hover:underline"
                        >
                          Continue with RAG mode
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSkipApiKey}
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
                    aria-label="Dismiss"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 via-brand-550 to-brand-600 px-6 py-4 text-white relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] w-[200%] translate-x-[-100%] animate-[shimmer_3s_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg ring-2 ring-white/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                <Bot className="w-6 h-6 relative z-10 drop-shadow-sm" />
              </div>
              <div>
                <div className="font-semibold flex items-center gap-2">
                  Clarity Chat Assistant
                  <motion.span 
                    className="flex h-2 w-2 relative"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400 shadow-lg shadow-green-400/50"></span>
                  </motion.span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProvider}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 0.9, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-medium"
                  >
                    {currentProvider === 'gemini' 
                      ? 'Powered by Gemini AI' 
                      : currentProvider === 'rag'
                      ? 'Powered by RAG'
                      : 'Demo Mode'}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              onClick={handleReset}
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none flex items-center justify-center backdrop-blur-sm shadow-md hover:shadow-lg"
              title="Reset Demo"
              aria-label="Reset chat demo"
            >
              <RefreshCw className="w-4 h-4 drop-shadow-sm" />
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef as React.RefObject<HTMLDivElement | null>}
          className="h-[450px] overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-bg-secondary/50 via-bg-primary to-bg-secondary/30 dark:from-bg-secondary/30 dark:via-bg-primary dark:to-bg-secondary/20 scroll-smooth relative scrollbar-thin"
          role="log"
          aria-live={isStreaming ? 'polite' : 'off'}
          aria-label="Chat messages"
          aria-atomic="false"
        >
          {/* Subtle gradient overlay at top */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-bg-primary to-transparent pointer-events-none z-10" />
          {/* Subtle gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none z-10" />
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                transition={{
                  duration: durations.moderate,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
                whileHover={{ scale: 1.01 }}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-md ring-2 ring-inset transition-all duration-200 ${
                    message.sender === 'bot'
                      ? message.isError
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-red-500/30 shadow-red-200/50 dark:shadow-red-900/30'
                        : 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 ring-brand-500/30 shadow-brand-200/50 dark:shadow-brand-900/30'
                      : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 ring-indigo-500/30 shadow-indigo-200/50 dark:shadow-indigo-900/30'
                  }`}
                >
                  {message.sender === 'bot' ? (
                    message.isError ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>

                {/* Message Bubble */}
                <motion.div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 transition-all duration-200 ${
                    message.sender === 'bot'
                      ? message.isError
                        ? 'bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-tl-sm shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg'
                      : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-sm shadow-lg hover:shadow-xl'
                  }`}
                  role={message.sender === 'bot' ? 'article' : undefined}
                  aria-label={message.sender === 'bot' ? 'Assistant message' : 'Your message'}
                  aria-live={message.sender === 'bot' && message.isStreaming ? 'polite' : 'off'}
                  whileHover={{ 
                    scale: message.sender === 'user' ? 1.02 : 1.01,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="text-sm">
                    {message.sender === 'bot' ? (
                      <>
                        <motion.div 
                          className="prose prose-sm dark:prose-invert max-w-none
                            [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                            prose-headings:mt-8 prose-headings:mb-4 prose-headings:font-semibold prose-headings:first:mt-0
                            prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-200
                            prose-ul:my-4 prose-ol:my-4 prose-li:leading-relaxed
                            prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                            prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                            prose-code:text-sm prose-code:font-mono
                            prose-hr:my-8 prose-hr:border-gray-200 dark:prose-hr:border-gray-700
                            prose-blockquote:my-6 prose-blockquote:pl-4
                            prose-pre:my-6 prose-pre:bg-transparent prose-pre:p-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {message.text && message.text.trim() ? (
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
                                const codeString = String(children).replace(/\n$/, '')
                                const isInline =
                                  !match && !codeString.includes('\n')

                                if (!isInline) {
                                  // Extract language from className
                                  let language = match ? match[1] : 'text'
                                  
                                  // Enhanced language detection from code content
                                  if (!match && codeString) {
                                    const codeLower = codeString.toLowerCase().trim()
                                    
                                    // Shell/terminal commands
                                    if (codeLower.includes('npm install') || 
                                        codeLower.includes('yarn add') || 
                                        codeLower.includes('pnpm add') ||
                                        codeLower.startsWith('$') ||
                                        codeLower.startsWith('#')) {
                                      language = 'bash'
                                    }
                                    // TypeScript/TSX (imports with 'from' or JSX)
                                    else if ((codeString.includes('import') && codeString.includes('from')) ||
                                             codeString.includes('export') ||
                                             codeString.includes('interface') ||
                                             codeString.includes('type ') ||
                                             codeString.includes('<') && codeString.includes('>')) {
                                      language = codeString.includes('tsx') || (codeString.includes('<') && codeString.includes('>')) 
                                        ? 'tsx' 
                                        : 'typescript'
                                    }
                                    // JavaScript/JSX
                                    else if (codeString.includes('function') || 
                                             codeString.includes('const ') ||
                                             codeString.includes('let ') ||
                                             codeString.includes('=>')) {
                                      language = codeString.includes('<') && codeString.includes('>') ? 'jsx' : 'javascript'
                                    }
                                    // JSON
                                    else if ((codeString.trim().startsWith('{') && codeString.trim().endsWith('}')) ||
                                             (codeString.trim().startsWith('[') && codeString.trim().endsWith(']'))) {
                                      language = 'json'
                                    }
                                    // CSS
                                    else if (codeString.includes('{') && codeString.includes(':') && codeString.includes(';')) {
                                      language = 'css'
                                    }
                                    // HTML
                                    else if (codeString.includes('<html') || codeString.includes('<!DOCTYPE')) {
                                      language = 'html'
                                    }
                                    // Default to text if can't detect
                                    else {
                                      language = 'text'
                                    }
                                  }
                                  
                                  return (
                                    <div className="my-6 -mx-2 not-prose w-full [&+*]:mt-6">
                                      <CodeBlock
                                        code={codeString}
                                        language={language}
                                        className="w-full"
                                      />
                                    </div>
                                  )
                                }
                                return (
                                  <code
                                    className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 font-mono text-xs text-brand-600 dark:text-brand-400 break-words border border-gray-200 dark:border-gray-700 shadow-sm"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                )
                              },
                              pre: ({ children }: any) => {
                                // Handle pre tags (usually contain code blocks)
                                // The code component will handle the actual rendering
                                // Return fragment to avoid double wrapping
                                // Pre tags are typically wrapped by the code component, so we just pass through
                                return <>{children}</>
                              },
                              // Handle em and i tags
                              em: ({ children }: any) => (
                                <em className="italic text-gray-700 dark:text-gray-200">{children}</em>
                              ),
                              i: ({ children }: any) => (
                                <i className="italic text-gray-700 dark:text-gray-200">{children}</i>
                              ),
                              // Handle del/strikethrough
                              del: ({ children }: any) => (
                                <del className="line-through text-gray-500 dark:text-gray-400">{children}</del>
                              ),
                              s: ({ children }: any) => (
                                <s className="line-through text-gray-500 dark:text-gray-400">{children}</s>
                              ),
                              // Handle br tags
                              br: () => <br className="block my-2" />,
                              // Handle lists (including nested)
                              ul: ({ children, ...props }: any) => {
                                // Check if this is a nested list by checking parent
                                return (
                                  <ul className="list-disc pl-6 space-y-1.5 my-4 text-gray-700 dark:text-gray-200 [&>li]:my-1.5 [&_ul]:ml-4 [&_ul]:mt-2 marker:text-brand-500 dark:marker:text-brand-400">
                                    {children}
                                  </ul>
                                )
                              },
                              ol: ({ children, ...props }: any) => {
                                return (
                                  <ol className="list-decimal pl-6 space-y-1.5 my-4 text-gray-700 dark:text-gray-200 [&>li]:my-1.5 [&_ol]:ml-4 [&_ol]:mt-2 marker:font-semibold marker:text-brand-500 dark:marker:text-brand-400">
                                    {children}
                                  </ol>
                                )
                              },
                              // Style other markdown elements with consistent spacing
                              p: ({ children }: any) => {
                                // Check if paragraph contains only whitespace or is empty
                                const text = String(children).trim()
                                if (!text || text.length === 0) return null
                                
                                // Filter out empty text nodes
                                const filteredChildren = Array.isArray(children)
                                  ? children.filter((child: any) => {
                                      if (typeof child === 'string') {
                                        return child.trim().length > 0
                                      }
                                      return child !== null && child !== undefined
                                    })
                                  : children
                                
                                if (Array.isArray(filteredChildren) && filteredChildren.length === 0) {
                                  return null
                                }
                                
                                return (
                                  <p className="leading-relaxed my-4 first:mt-0 last:mb-0 text-gray-700 dark:text-gray-200">
                                    {filteredChildren}
                                  </p>
                                )
                              },
                              h2: ({ children }: any) => (
                                <h2 className="text-xl font-bold mt-8 mb-4 first:mt-0 text-gray-900 dark:text-gray-100 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }: any) => (
                                <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">
                                  {children}
                                </h3>
                              ),
                              h4: ({ children }: any) => (
                                <h4 className="text-base font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100">
                                  {children}
                                </h4>
                              ),
                              h5: ({ children }: any) => (
                                <h5 className="text-sm font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">
                                  {children}
                                </h5>
                              ),
                              h6: ({ children }: any) => (
                                <h6 className="text-xs font-semibold mt-3 mb-2 text-gray-900 dark:text-gray-100">
                                  {children}
                                </h6>
                              ),
                              hr: () => (
                                <hr className="my-8 border-0 border-t-2 border-gray-200 dark:border-gray-700 shadow-sm" />
                              ),
                              li: ({ children }: any) => (
                                <li className="pl-1 leading-relaxed">{children}</li>
                              ),
                              small: ({ children }: any) => (
                                <small className="block text-xs text-gray-500 dark:text-gray-400 italic pt-3 mt-4 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 px-2 py-2 rounded-b">
                                  {children}
                                </small>
                              ),
                              blockquote: ({ children }: any) => (
                                <blockquote className="border-l-4 border-brand-500 pl-4 my-6 italic text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900/30 dark:to-transparent py-3 pr-3 rounded-r shadow-sm">
                                  {children}
                                </blockquote>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-brand-700 dark:text-brand-300">
                                  {children}
                                </strong>
                              ),
                              a: ({ href, children }: any) => {
                                // Handle null/undefined href
                                if (!href) {
                                  return <span className="text-brand-600 dark:text-brand-400">{children}</span>
                                }
                                
                                // Check if it's an internal link (starts with /) or hash link
                                const isInternal = href.startsWith('/') || href.startsWith('#')
                                const isHashLink = href.startsWith('#')
                                
                                if (isInternal && !isHashLink) {
                                  return (
                                    <Link
                                      href={href}
                                      className="text-brand-600 dark:text-brand-400 hover:underline font-medium transition-colors"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        router.push(href)
                                      }}
                                    >
                                      {children}
                                    </Link>
                                  )
                                }
                                
                                // Hash links (anchor links)
                                if (isHashLink) {
                                  return (
                                    <a
                                      href={href}
                                      className="text-brand-600 dark:text-brand-400 hover:underline font-medium transition-colors"
                                    >
                                      {children}
                                    </a>
                                  )
                                }
                                
                                // External links
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-600 dark:text-brand-400 hover:underline font-medium transition-colors inline-flex items-center gap-1"
                                  >
                                    {children}
                                    <span className="text-xs opacity-70" aria-hidden="true">↗</span>
                                  </a>
                                )
                              },
                              // Table support for GFM tables
                              table: ({ children }: any) => (
                                <div className="overflow-x-auto my-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                                  <table className="min-w-full table-auto border-collapse divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({ children }: any) => (
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50">
                                  {children}
                                </thead>
                              ),
                              tbody: ({ children }: any) => (
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                  {children}
                                </tbody>
                              ),
                              tr: ({ children }: any) => (
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                  {children}
                                </tr>
                              ),
                              th: ({ children }: any) => (
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-300 dark:border-gray-600">
                                  {children}
                                </th>
                              ),
                              td: ({ children }: any) => (
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                  {children}
                                </td>
                              ),
                              // Image support
                              img: ({ src, alt }: any) => (
                                <img
                                  src={src}
                                  alt={alt}
                                  className="max-w-full h-auto rounded-lg my-4 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200"
                                  loading="lazy"
                                />
                              ),
                              }}
                              key={message.id}
                            >
                              {message.text}
                            </MemoizedReactMarkdown>
                          ) : message.isStreaming ? (
                            <motion.div 
                              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 py-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.span 
                                className="inline-block w-1.5 h-4 bg-brand-500 rounded shadow-sm"
                                animate={{ 
                                  opacity: [0.5, 1, 0.5],
                                  scaleY: [1, 1.2, 1]
                                }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                              />
                              <motion.span 
                                className="text-sm italic font-medium"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                Generating response...
                              </motion.span>
                            </motion.div>
                          ) : null}
                        </motion.div>
                        {message.isStreaming && message.text && (
                          <motion.span 
                            className="inline-block w-1.5 h-4 ml-1 bg-brand-500 align-middle rounded shadow-sm"
                            aria-label="Streaming"
                            role="status"
                            animate={{ 
                              opacity: [0.5, 1, 0.5],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        )}
                        {message.isError && message.sender === 'bot' && (
                          <motion.button
                            onClick={() => {
                              // Retry the last user message
                              const userMessages = messages.filter(m => m.sender === 'user')
                              const lastUserMessage = userMessages[userMessages.length - 1]
                              if (lastUserMessage) {
                                handleSend(lastUserMessage.text)
                              }
                            }}
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                            aria-label="Retry message"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.5, ease: 'easeInOut' }}
                            >
                              <RefreshCw className="w-3 h-3" />
                            </motion.div>
                            <span>↻ Retry</span>
                          </motion.button>
                        )}
                      </>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    )}
                  </div>
                </motion.div>
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
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex items-center gap-3"
              >
                <motion.div 
                  className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center ring-2 ring-inset ring-brand-500/30 shadow-md"
                  animate={{ 
                    boxShadow: [
                      '0 4px 6px -1px rgba(59, 130, 246, 0.1)',
                      '0 10px 15px -3px rgba(59, 130, 246, 0.2)',
                      '0 4px 6px -1px rgba(59, 130, 246, 0.1)'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Bot className="w-5 h-5 drop-shadow-sm" />
                </motion.div>
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border-2 border-border/50 shadow-md backdrop-blur-sm"
                  animate={{ 
                    boxShadow: [
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <TypingIndicator
                    avatarSrc=""
                    label="Thinking..."
                    variant="dots"
                    className="text-brand-500"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="border-t-2 border-border p-4 bg-gradient-to-b from-bg-primary to-bg-secondary/30 dark:from-bg-primary dark:to-bg-secondary/20 relative z-20 backdrop-blur-sm">
          {/* Gradient Mask for Suggestions */}
          <AnimatePresence>
            {showSuggestions && !isTyping && !isStreaming && !isError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative"
              >
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade">
                  {SUGGESTIONS.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSend(suggestion.text)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 min-h-[44px] bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-brand-50 hover:to-brand-100/50 dark:hover:from-brand-900/30 dark:hover:to-brand-800/20 border border-gray-200 dark:border-gray-700 rounded-full text-xs sm:text-sm font-medium text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none backdrop-blur-sm group"
                      aria-label={`Ask: ${suggestion.text}`}
                    >
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <suggestion.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200" />
                      </motion.div>
                      <span className="hidden sm:inline">{suggestion.text}</span>
                      <span className="sm:hidden">{suggestion.text.split(' ')[0]}</span>
                    </motion.button>
                  ))}
                </div>
                {/* Fade masks */}
                <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none z-10" />
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
              onChange={(e) => {
                setInput(e.target.value)
                // Clear error state when user starts typing
                if (isError) {
                  setIsError(false)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (!isTyping && !isStreaming && input.trim()) {
                    handleSend()
                  }
                } else if (e.key === 'Escape') {
                  // Cancel current request on Escape
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort()
                    setIsTyping(false)
                    setIsError(false)
                  }
                }
              }}
              placeholder={
                isError
                  ? 'Try asking again...'
                  : isTyping || isStreaming
                  ? 'Waiting for response...'
                  : 'Ask about components, hooks, theming...'
              }
              disabled={isTyping || isStreaming}
              aria-describedby="chat-demo-status"
              aria-required="true"
              aria-invalid={isError}
              maxLength={4096}
              className={`flex-1 px-4 py-3.5 min-h-[48px] pl-4 pr-12 rounded-xl border-2 bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm ${
                isError
                  ? 'border-red-300 focus:border-red-500 focus-visible:ring-red-200 dark:border-red-700 dark:focus:border-red-500'
                  : 'border-border focus:border-brand-500 focus-visible:ring-brand-500/50 dark:border-gray-600 dark:focus:border-brand-400'
              }`}
            />
            <AnimatePresence mode="wait">
              {input.trim() ? (
                <motion.button
                  key="send"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  type="submit"
                  disabled={isTyping || isStreaming}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-1 top-1 bottom-1 w-[46px] bg-gradient-to-br from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 drop-shadow-sm" />
                </motion.button>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.5 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute right-2 top-1.5 bottom-1.5 aspect-square flex items-center justify-center pointer-events-none"
                >
                  <Sparkles className="w-4 h-4 text-text-tertiary" />
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          <motion.div 
            id="chat-demo-status" 
            className="text-[10px] text-text-secondary mt-2 text-center opacity-70 flex items-center justify-center gap-1.5 px-2" 
            role="status" 
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span
              className={`w-1.5 h-1.5 rounded-full shadow-sm ${isError ? 'bg-red-500 shadow-red-500/50' : 'bg-green-500 shadow-green-500/50'}`}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            <AnimatePresence mode="wait">
              <motion.span
                key={`${currentProvider}-${isError}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.2 }}
                className="font-medium"
              >
                {isError
                  ? 'Connection interrupted'
                  : currentProvider === 'gemini'
                  ? 'Powered by Gemini AI - Enhanced responses'
                  : currentProvider === 'rag'
                  ? 'Powered by RAG - Searches documentation for contextual answers'
                  : 'Demo Mode - Pre-defined responses'}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
