'use client'

import { useState, useRef, useCallback, useEffect, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Sun,
  Moon,
  Monitor,
  Trash2,
  Search,
  Command,
  Copy,
  RotateCcw,
  Volume2,
  Edit3,
  GitBranch,
  X,
  Sparkles,
  Loader2,
  ChevronDown,
  MessageSquare,
  Settings,
  Download,
  Keyboard,
} from 'lucide-react'
import { ToolUIRegistry } from './ToolUIRegistry'

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolResults?: Array<{
    id: string
    name: string
    data: Record<string, unknown>
    ui: string
  }>
}

interface HeroChatProps {
  className?: string
}

type Theme = 'light' | 'dark' | 'system'
type SSEEvent =
  | { type: 'text-delta'; content: string }
  | { type: 'tool-call'; id: string; name: string; args: Record<string, unknown> }
  | { type: 'tool-result'; id: string; name: string; data: unknown; ui: string }
  | { type: 'error'; message: string }
  | { type: 'done' }

// ============================================================================
// PROMPT SUGGESTIONS
// ============================================================================

const PROMPT_SUGGESTIONS = [
  { icon: '🌤️', text: "What's the weather in Tokyo?", category: 'weather' },
  { icon: '📈', text: "How's Apple stock doing?", category: 'stocks' },
  { icon: '💻', text: 'Show me a React useState example', category: 'code' },
  { icon: '✅', text: 'Help me plan a new project', category: 'tasks' },
  { icon: '🚀', text: 'What can Clarity Chat do?', category: 'info' },
  { icon: '🎨', text: 'Show me the theming capabilities', category: 'info' },
]

// ============================================================================
// COMMAND PALETTE COMMANDS
// ============================================================================

const COMMANDS = [
  { id: 'clear', icon: Trash2, label: 'Clear History', shortcut: '⌘⇧K' },
  { id: 'theme', icon: Sun, label: 'Toggle Theme', shortcut: '⌘T' },
  { id: 'search', icon: Search, label: 'Search Messages', shortcut: '⌘F' },
  { id: 'export', icon: Download, label: 'Export Chat', shortcut: '⌘E' },
  { id: 'shortcuts', icon: Keyboard, label: 'Keyboard Shortcuts', shortcut: '⌘/' },
  { id: 'settings', icon: Settings, label: 'Settings', shortcut: '⌘,' },
]

// ============================================================================
// CONTEXT MENU ACTIONS
// ============================================================================

const CONTEXT_MENU_ACTIONS = [
  { id: 'copy', icon: Copy, label: 'Copy' },
  { id: 'regenerate', icon: RotateCcw, label: 'Regenerate', assistantOnly: true },
  { id: 'edit', icon: Edit3, label: 'Edit', userOnly: true },
  { id: 'speak', icon: Volume2, label: 'Speak' },
  { id: 'branch', icon: GitBranch, label: 'Branch from here' },
  { id: 'delete', icon: Trash2, label: 'Delete', danger: true },
]

// ============================================================================
// HOOKS
// ============================================================================

function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const stored = localStorage.getItem('hero-chat-theme') as Theme | null
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    localStorage.setItem('hero-chat-theme', theme)
    const root = document.documentElement

    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', isDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  const cycleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'system'
      return 'light'
    })
  }, [])

  return { theme, setTheme, cycleTheme }
}

function useAutoScroll(deps: unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  const scrollToBottom = useCallback((force = false) => {
    if (!containerRef.current) return
    if (isUserScrolling && !force) return

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [isUserScrolling])

  useEffect(() => {
    scrollToBottom()
  }, deps)

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100

    if (!isAtBottom) {
      setIsUserScrolling(true)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false)
      }, 3000)
    } else {
      setIsUserScrolling(false)
    }
  }, [])

  return { containerRef, scrollToBottom, handleScroll, isUserScrolling }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HeroChat({ className = '' }: HeroChatProps) {
  // State
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageId: string } | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Hooks
  const { theme, cycleTheme } = useTheme()
  const { containerRef, scrollToBottom, handleScroll, isUserScrolling } = useAutoScroll([messages])

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsStreaming(true)

    // Create assistant message placeholder
    const assistantId = `assistant-${Date.now()}`
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      toolResults: []
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/hero-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed === 'data: [DONE]') continue
          if (!trimmed.startsWith('data: ')) continue

          try {
            const event: SSEEvent = JSON.parse(trimmed.slice(6))

            if (event.type === 'text-delta') {
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: m.content + event.content }
                  : m
              ))
            } else if (event.type === 'tool-result') {
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? {
                      ...m,
                      toolResults: [
                        ...(m.toolResults || []),
                        {
                          id: event.id,
                          name: event.name,
                          data: event.data as Record<string, unknown>,
                          ui: event.ui
                        }
                      ]
                    }
                  : m
              ))
            } else if (event.type === 'error') {
              showToast(event.message, 'error')
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        showToast('Failed to send message. Please try again.', 'error')
        // Remove the empty assistant message
        setMessages(prev => prev.filter(m => m.id !== assistantId))
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }, [messages, isStreaming, showToast])

  // Handle input key press
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // Cmd+K or / to open command palette
      if ((e.metaKey && e.key === 'k') || (e.key === '/' && !input)) {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowCommandPalette(false)
        setContextMenu(null)
      }
      // Cmd+T to toggle theme
      if (e.metaKey && e.key === 't') {
        e.preventDefault()
        cycleTheme()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [cycleTheme, input])

  // Handle command execution
  const executeCommand = useCallback((commandId: string) => {
    switch (commandId) {
      case 'clear':
        setMessages([])
        showToast('Chat history cleared')
        break
      case 'theme':
        cycleTheme()
        showToast(`Theme changed to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'}`)
        break
      case 'export':
        const data = JSON.stringify(messages, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'chat-export.json'
        a.click()
        showToast('Chat exported')
        break
      default:
        showToast('Command not implemented yet')
    }
    setShowCommandPalette(false)
  }, [cycleTheme, messages, showToast, theme])

  // Handle context menu action
  const handleContextAction = useCallback((actionId: string, messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return

    switch (actionId) {
      case 'copy':
        navigator.clipboard.writeText(message.content)
        showToast('Copied to clipboard')
        break
      case 'regenerate':
        // Find previous user message and resend
        const index = messages.findIndex(m => m.id === messageId)
        if (index > 0) {
          const userMsg = messages[index - 1]
          if (userMsg.role === 'user') {
            setMessages(prev => prev.slice(0, index))
            sendMessage(userMsg.content)
          }
        }
        break
      case 'speak':
        const utterance = new SpeechSynthesisUtterance(message.content)
        speechSynthesis.speak(utterance)
        showToast('Speaking...')
        break
      case 'delete':
        setMessages(prev => prev.filter(m => m.id !== messageId))
        showToast('Message deleted')
        break
      default:
        showToast('Action not implemented yet')
    }
    setContextMenu(null)
  }, [messages, sendMessage, showToast])

  // Voice input
  const toggleVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showToast('Voice input not supported in this browser', 'error')
      return
    }

    if (isRecording) {
      setIsRecording(false)
      return
    }

    const SpeechRecognition = (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + transcript)
    }

    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => {
      setIsRecording(false)
      showToast('Voice recognition error', 'error')
    }

    setIsRecording(true)
    recognition.start()
  }, [isRecording, showToast])

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`relative flex flex-col h-[700px] w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Clarity Chat</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            onClick={cycleTheme}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`Theme: ${theme}`}
          >
            {theme === 'light' && <Sun className="w-5 h-5 text-slate-600" />}
            {theme === 'dark' && <Moon className="w-5 h-5 text-slate-400" />}
            {theme === 'system' && <Monitor className="w-5 h-5 text-slate-500" />}
          </motion.button>

          {/* Command palette trigger */}
          <motion.button
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Command className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">K</span>
          </motion.button>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6"
      >
        {/* Empty state */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(99, 102, 241, 0.3)',
                  '0 0 40px rgba(99, 102, 241, 0.5)',
                  '0 0 20px rgba(99, 102, 241, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageSquare className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome to Clarity Chat
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
              Your AI assistant with beautiful interactive tools. Try asking about weather, stocks, code, or tasks!
            </p>

            {/* Prompt suggestions */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
              {PROMPT_SUGGESTIONS.map((suggestion, i) => (
                <motion.button
                  key={suggestion.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => sendMessage(suggestion.text)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{suggestion.icon}</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">{suggestion.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message list */}
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              onContextMenu={(e) => {
                e.preventDefault()
                setContextMenu({ x: e.clientX, y: e.clientY, messageId: message.id })
              }}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                {/* Avatar */}
                <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <motion.div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {message.role === 'user' ? (
                      <span className="text-white text-sm font-medium">U</span>
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </motion.div>

                  <div className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {/* Message bubble */}
                    <motion.div
                      className={`px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      {message.content ? (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      ) : isStreaming && message.role === 'assistant' && index === messages.length - 1 ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="flex gap-1"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-slate-400 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              />
                            ))}
                          </motion.div>
                          <span className="text-sm text-slate-400">Thinking...</span>
                        </div>
                      ) : null}
                    </motion.div>

                    {/* Tool results */}
                    {message.toolResults && message.toolResults.length > 0 && (
                      <div className="flex flex-col gap-3 mt-2">
                        {message.toolResults.map((tool) => (
                          <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          >
                            <ToolUIRegistry toolResult={{ ui: tool.ui, data: tool.data }} />
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <span className="text-xs text-slate-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {isUserScrolling && messages.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => scrollToBottom(true)}
              className="fixed bottom-32 right-8 p-3 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="relative z-10 p-4 border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-end gap-3">
          {/* Attachment button */}
          <motion.button
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Attach file"
          >
            <Paperclip className="w-5 h-5 text-slate-500" />
          </motion.button>

          {/* Input field */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything... (Press / for commands)"
              rows={1}
              className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none text-slate-900 dark:text-white placeholder-slate-400 transition-all"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <div className="absolute right-3 bottom-2.5 text-xs text-slate-400">
              {input.length > 0 && `${input.length}/4096`}
            </div>
          </div>

          {/* Voice input */}
          <motion.button
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl transition-colors ${
              isRecording
                ? 'bg-red-500 text-white'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={isRecording ? { duration: 0.5, repeat: Infinity } : {}}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5 text-slate-500" />
            )}
          </motion.button>

          {/* Send button */}
          <motion.button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Keyboard hint */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-400">
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">Enter</kbd> to send</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">Shift+Enter</kbd> for new line</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">⌘K</kbd> commands</span>
        </div>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCommandPalette(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search commands..."
                    className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
                    autoFocus
                  />
                  <button
                    onClick={() => setShowCommandPalette(false)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
              <div className="p-2 max-h-80 overflow-y-auto">
                {COMMANDS.map((command) => (
                  <motion.button
                    key={command.id}
                    onClick={() => executeCommand(command.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <command.icon className="w-4 h-4 text-slate-500" />
                    <span className="flex-1 text-left text-sm text-slate-700 dark:text-slate-300">
                      {command.label}
                    </span>
                    <span className="text-xs text-slate-400">{command.shortcut}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setContextMenu(null)}
              className="fixed inset-0 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ top: contextMenu.y, left: contextMenu.x }}
              className="fixed bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 py-1"
            >
              {CONTEXT_MENU_ACTIONS.map((action) => {
                const message = messages.find(m => m.id === contextMenu.messageId)
                if (!message) return null
                if (action.assistantOnly && message.role !== 'assistant') return null
                if (action.userOnly && message.role !== 'user') return null

                return (
                  <button
                    key={action.id}
                    onClick={() => handleContextAction(action.id, contextMenu.messageId)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                      action.danger
                        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg z-50 ${
              toast.type === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
