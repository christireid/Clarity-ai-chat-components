'use client'

/**
 * DocsAssistant - Documentation Assistant Component
 *
 * A fully integrated documentation assistant that leverages the @clarity-chat/react
 * library components and hooks instead of custom implementations.
 *
 * Library Components Used:
 * - ChatWindow - Main chat interface
 * - CitationCard - Display RAG sources with confidence scores
 * - EmptyChatState - Empty state with starter prompts (replaces custom)
 * - ErrorBoundary - Error handling wrapper
 * - MessageSearch - Search through conversation history (Cmd+K)
 * - NetworkStatus - Connection status indicator
 * - TokenCounter - Display token usage and cost estimates
 * - VoiceInput - Voice input support
 *
 * Library Hooks Used:
 * - useKeyboardShortcuts - Keyboard handling (replaces custom)
 * - useClipboard - Copy functionality
 * - useFocusTrap - Modal focus management (WCAG compliance)
 * - useFocusRestoration - Restore focus on close
 * - useLocalStorage - Session ID & conversation storage (replaces custom)
 * - useReducedMotion - Accessibility preferences
 * - useThrottledCallback - Throttled streaming updates (replaces custom)
 * - useToast - Toast notifications
 * - useTokenTracker - Track conversation token usage and costs
 *
 * Animation Utilities:
 * - createFadeVariant - Fade animation presets
 * - createSlideVariant - Slide animation presets
 *
 * Keyboard Shortcuts:
 * - Cmd+. - Toggle assistant
 * - Cmd+K - Toggle message search (when open)
 * - ? - Show keyboard shortcuts help
 * - Escape - Close assistant or search
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Code2, Lightbulb, MessageSquare, Sparkles, AlertCircle, Search } from 'lucide-react'
import {
  // Components
  ChatWindow,
  CitationCard,
  EmptyChatState,
  ErrorBoundary,
  ExportDialog,
  MessageSearch,
  NetworkStatus,
  TokenCounter,
  VoiceInput,
  // Hooks
  useToast,
  useKeyboardShortcuts,
  useClipboard,
  useLocalStorage,
  useThrottledCallback,
  useReducedMotion,
  useTokenTracker,
  // Types
  type PromptSuggestion,
  type Citation,
  // Accessibility hooks
  useFocusTrap,
  useFocusRestoration,
  // Animation utilities
  createSlideVariant,
  createFadeVariant,
} from '@clarity-chat/react'
import type { Message, AIStatus } from '@clarity-chat/types'
import { ChatButton } from './ChatButton'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

interface DocsAssistantProps {
  className?: string
}

// SSE-like status tracking for streaming (inspired by useStreamingSSE)
type StreamingStatus = 'idle' | 'connecting' | 'streaming' | 'error' | 'retrying'

interface SavedConversation {
  messages: Message[]
  timestamp: number
}

// Queued message for offline support
interface QueuedMessage {
  id: string
  content: string
  timestamp: number
}

// Conversation branch for branching feature
interface ConversationBranch {
  id: string
  name: string
  messages: Message[]
  parentBranchId: string | null
  branchPointMessageId: string | null
  createdAt: Date
}

// Branch state type
interface BranchState {
  branches: ConversationBranch[]
  currentBranchId: string
}

interface Source {
  id?: string
  source?: string
  title?: string
  url: string
  confidence?: number
  chunkText?: string // Content preview from enhanced RAG
  score?: number
}

// ============================================================================
// Constants
// ============================================================================

const SESSION_ID_KEY = 'clarity-docs-assistant-session-id'
const MESSAGES_KEY = 'clarity-docs-assistant-messages'
const MESSAGE_QUEUE_KEY = 'clarity-docs-assistant-queue' // Offline message queue
const BRANCHES_KEY = 'clarity-docs-assistant-branches' // Conversation branches
const CONVERSATION_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
const STREAM_THROTTLE_MS = 50 // Throttle streaming updates
const CLIPBOARD_TIMEOUT_MS = 2000 // Clipboard success display time
const TOAST_DURATION_MS = 3000 // Toast notification duration
const FOCUS_DELAY_MS = 100 // Delay before focusing input

// Streaming retry configuration (inspired by useStreamingSSE)
const MAX_RETRY_ATTEMPTS = 3
const INITIAL_RETRY_DELAY_MS = 1000
const MAX_RETRY_DELAY_MS = 10000
const RETRY_BACKOFF_MULTIPLIER = 2

// Offline queue configuration
const QUEUE_PROCESS_DELAY_MS = 1000 // Delay before processing queue after coming online

// Token tracking constants
const MODEL_MAX_TOKENS = 128000 // Claude/GPT-4 turbo context window
const TOKEN_COST_PER_TOKEN = 0.000003 // Claude 3 Sonnet pricing
const TOKEN_WARNING_THRESHOLD = 0.75 // Warn at 75% usage
const TOKEN_CRITICAL_THRESHOLD = 0.9 // Critical at 90% usage

// Static animation variants using library utilities (moved outside component for performance)
const BACKDROP_VARIANTS = createFadeVariant('fast', 'out')
// Dialog slide variant for reduced motion fallback
const DIALOG_VARIANTS_REDUCED = createFadeVariant('fast', 'out')
// Dialog slide variant for normal motion
const DIALOG_VARIANTS_NORMAL = createSlideVariant('up', 20, 'fast', 'out')

// Suggested questions to help users get started (using library PromptSuggestion type)
const DOCS_STARTER_PROMPTS: PromptSuggestion[] = [
  {
    id: 'getting-started',
    text: 'How do I get started with Clarity Chat?',
    label: 'Get Started',
    description: 'Learn the basics of installation and setup',
    icon: <Sparkles className="w-4 h-4" />,
    type: 'starter',
    category: 'Setup',
    keywords: ['installation', 'setup', 'quickstart'],
  },
  {
    id: 'streaming',
    text: 'How do I implement streaming messages?',
    label: 'Streaming',
    description: 'Add real-time streaming to your chat interface',
    icon: <MessageSquare className="w-4 h-4" />,
    type: 'starter',
    category: 'Features',
    keywords: ['streaming', 'real-time', 'SSE'],
  },
  {
    id: 'components',
    text: 'What components are available?',
    label: 'Components',
    description: 'Explore all available UI components',
    icon: <Code2 className="w-4 h-4" />,
    type: 'starter',
    category: 'Reference',
    keywords: ['components', 'ui', 'reference'],
  },
  {
    id: 'theming',
    text: 'How do I customize the theme?',
    label: 'Theming',
    description: 'Learn about theming and customization options',
    icon: <Lightbulb className="w-4 h-4" />,
    type: 'starter',
    category: 'Customization',
    keywords: ['theme', 'customize', 'styling'],
  },
]

// ============================================================================
// Code Playground Integration
// ============================================================================

interface CodeBlock {
  language: string
  code: string
  startIndex: number
  endIndex: number
}

/**
 * Extract code blocks from markdown content
 */
function extractCodeBlocks(content: string): CodeBlock[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const blocks: CodeBlock[] = []
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    })
  }

  return blocks
}

/**
 * Detect if code is React/TypeScript and suitable for playground
 */
function isPlaygroundCompatible(language: string, code: string): boolean {
  const supportedLanguages = ['tsx', 'jsx', 'typescript', 'javascript', 'ts', 'js', 'react']
  if (!supportedLanguages.includes(language.toLowerCase())) return false

  // Check for React-like patterns
  const reactPatterns = [
    /import.*from\s+['"]react['"]/,
    /import.*@clarity-chat/,
    /<\w+[\s/>]/,  // JSX tags
    /export\s+(default\s+)?function/,
    /const.*=.*\(.*\)\s*=>/,  // Arrow function components
  ]

  return reactPatterns.some(pattern => pattern.test(code))
}

/**
 * Generate CodeSandbox URL for React code
 */
function generateCodeSandboxUrl(code: string, _language: string): string {
  // Wrap code in a basic React app structure if needed
  const hasImport = /import.*from/.test(code)

  let fullCode = code

  // Add basic React imports if not present
  if (!hasImport) {
    fullCode = `import React from 'react';\nimport { useState } from 'react';\n\n${code}`
  }

  // Create CodeSandbox parameters
  const files = {
    'App.tsx': {
      content: fullCode,
    },
    'index.tsx': {
      content: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
`,
    },
    'package.json': {
      content: JSON.stringify({
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          '@clarity-chat/react': 'latest',
        },
        devDependencies: {
          'typescript': '^5.0.0',
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
        },
      }, null, 2),
    },
  }

  // Encode for URL - convert UTF-8 to base64 safely
  // Use chunked approach to avoid "Maximum call stack size exceeded" with large payloads
  const filesJson = JSON.stringify({ files })
  const encoder = new TextEncoder()
  const bytes = encoder.encode(filesJson)

  // Convert bytes to base64 in chunks to avoid stack overflow
  let binary = ''
  const chunkSize = 8192
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }
  const encoded = btoa(binary)

  return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${encoded}`
}

/**
 * Open code in playground (CodeSandbox by default)
 */
function openInPlayground(code: string, language: string): void {
  const url = generateCodeSandboxUrl(code, language)
  window.open(url, '_blank', 'noopener,noreferrer')
}

// ============================================================================
// URL Normalization Utilities
// ============================================================================

function normalizeSourceUrl(rawUrl: string, title: string): string {
  if (!rawUrl || rawUrl === '#' || rawUrl === 'undefined' || rawUrl.trim() === '') {
    return generateUrlFromTitle(title)
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl
  }

  const validPrefixes = ['/learn', '/guides/', '/reference/', '/examples/', '/integrations/', '/tools/', '/blog/', '/enterprise/']
  if (validPrefixes.some(prefix => rawUrl.startsWith(prefix))) {
    return rawUrl
  }

  return generateUrlFromTitle(title)
}

function generateUrlFromTitle(title: string): string {
  if (!title || title.trim() === '') {
    return '/learn'
  }

  const lowerTitle = title.toLowerCase()

  // Route mappings
  const routeMappings: Record<string, string> = {
    'getting started': '/learn',
    'quickstart': '/learn',
    'introduction': '/learn',
    'installation': '/guides/installation',
    'theme': '/guides/theming',
    'styling': '/guides/theming',
    'error': '/guides/error-handling',
    'memory': '/guides/memory',
    'hook': '/reference/hooks',
    'component': '/reference/components',
    'streaming': '/reference/hooks/use-streaming-sse',
    'voice': '/reference/components/voice-input',
  }

  for (const [key, route] of Object.entries(routeMappings)) {
    if (lowerTitle.includes(key)) {
      return route
    }
  }

  return '/learn'
}

function normalizeLinksInContent(content: string): string {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g

  return content.replace(linkRegex, (match, text, url) => {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#')) {
      return match
    }
    const normalizedUrl = normalizeSourceUrl(url, text)
    return `[${text}](${normalizedUrl})`
  })
}

// Session ID generation helper
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// ============================================================================
// Inner Component (wrapped by ErrorBoundary)
// ============================================================================

function DocsAssistantInner({ className }: DocsAssistantProps) {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState<AIStatus | undefined>(undefined)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [streamingStatus, setStreamingStatus] = useState<StreamingStatus>('idle')
  const [retryCount, setRetryCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [messageQueue, setMessageQueue] = useState<QueuedMessage[]>([])
  const [branchState, setBranchState] = useState<BranchState>({
    branches: [{
      id: 'main',
      name: 'Main Conversation',
      messages: [],
      parentBranchId: null,
      branchPointMessageId: null,
      createdAt: new Date(),
    }],
    currentBranchId: 'main',
  })

  // Refs
  const dialogRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const partialContentRef = useRef<string>('') // Track partial response for recovery
  const isProcessingQueueRef = useRef<boolean>(false) // Prevent concurrent queue processing

  // Library hooks
  const toast = useToast()
  const prefersReducedMotion = useReducedMotion()
  const { copy } = useClipboard({
    timeout: CLIPBOARD_TIMEOUT_MS,
    onSuccess: () => toast.success('Copied to clipboard'),
    onError: () => toast.error('Failed to copy'),
  })

  // Focus trap for modal accessibility (Critical: traps focus within dialog)
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen)
  const { saveFocus, restoreFocus } = useFocusRestoration()

  // Token tracking using library hook
  const {
    tokens: totalTokens,
    isNearLimit,
    isCritical,
    addMessage: trackMessage,
    clear: clearTokens,
  } = useTokenTracker({
    modelName: 'claude-3-sonnet',
    maxTokens: MODEL_MAX_TOKENS,
    warningThreshold: TOKEN_WARNING_THRESHOLD,
    criticalThreshold: TOKEN_CRITICAL_THRESHOLD,
    onWarning: () => toast.warning('Approaching context limit'),
    onCritical: () => toast.error('Near context limit - consider clearing conversation'),
  })

  // State for citation display
  const [currentCitations, setCurrentCitations] = useState<Citation[]>([])

  // Session ID using library hook (replaces custom useSessionId)
  const [sessionId] = useLocalStorage<string>(SESSION_ID_KEY, generateSessionId())

  // Persistent conversation storage using library hook
  const [savedConversation, setSavedConversation, clearSavedConversation] = useLocalStorage<SavedConversation | null>(
    MESSAGES_KEY,
    null
  )

  // Initialize messages from saved conversation
  useEffect(() => {
    if (savedConversation) {
      const isValid = savedConversation.timestamp &&
        Date.now() - savedConversation.timestamp < CONVERSATION_TTL_MS

      if (isValid && savedConversation.messages) {
        setMessages(savedConversation.messages)
      } else {
        clearSavedConversation()
      }
    }
  }, []) // Only run on mount

  // Save messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      setSavedConversation({
        messages,
        timestamp: Date.now(),
      })
    }
  }, [messages, setSavedConversation])

  // Keyboard shortcuts using library hook
  // Note: Using mod+. instead of mod+a to avoid conflict with "select all"
  useKeyboardShortcuts([
    {
      key: 'mod+.',
      callback: () => {
        const willOpen = !isOpen
        if (willOpen) {
          saveFocus() // Save focus before opening
        }
        setIsOpen(willOpen)
        if (willOpen) {
          toast.info('Press Escape or Cmd+. to close', 'Documentation Assistant', TOAST_DURATION_MS)
        } else {
          restoreFocus() // Restore focus when closing
        }
      },
      description: 'Toggle documentation assistant',
    },
    {
      key: '?',
      callback: () => {
        if (isOpen) setShowShortcuts(true)
      },
      description: 'Show keyboard shortcuts',
      enableInInput: false,
    },
    {
      key: 'escape',
      callback: () => {
        if (showSearch) {
          setShowSearch(false)
        } else if (isOpen) {
          setIsOpen(false)
          restoreFocus()
        }
      },
      description: 'Close assistant or search',
    },
    {
      key: 'mod+k',
      callback: () => {
        if (isOpen && messages.length > 0) {
          setShowSearch((prev) => !prev)
        }
      },
      description: 'Toggle message search',
    },
  ])

  // Focus management - focus input when dialog opens
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const timer = setTimeout(() => {
        const textarea = dialogRef.current?.querySelector('textarea')
        textarea?.focus()
      }, FOCUS_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  // Load message queue from localStorage on mount
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(MESSAGE_QUEUE_KEY)
      if (savedQueue) {
        const parsed = JSON.parse(savedQueue) as QueuedMessage[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessageQueue(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load message queue:', e)
    }
  }, [])

  // Load branch state from localStorage on mount
  useEffect(() => {
    try {
      const savedBranches = localStorage.getItem(BRANCHES_KEY)
      if (savedBranches) {
        const parsed = JSON.parse(savedBranches) as BranchState
        if (parsed.branches && parsed.branches.length > 0) {
          // Restore Date objects
          parsed.branches = parsed.branches.map(b => ({
            ...b,
            createdAt: new Date(b.createdAt),
          }))
          setBranchState(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load branch state:', e)
    }
  }, [])

  // Save message queue to localStorage when it changes
  useEffect(() => {
    try {
      if (messageQueue.length > 0) {
        localStorage.setItem(MESSAGE_QUEUE_KEY, JSON.stringify(messageQueue))
      } else {
        localStorage.removeItem(MESSAGE_QUEUE_KEY)
      }
    } catch (e) {
      console.error('Failed to save message queue:', e)
    }
  }, [messageQueue])

  // Save branch state to localStorage when it changes
  useEffect(() => {
    try {
      // Only persist if we have more than just the main branch
      if (branchState.branches.length > 1 || branchState.currentBranchId !== 'main') {
        localStorage.setItem(BRANCHES_KEY, JSON.stringify(branchState))
      } else {
        localStorage.removeItem(BRANCHES_KEY)
      }
    } catch (e) {
      console.error('Failed to save branch state:', e)
    }
  }, [branchState])

  // Handle network status changes
  const handleNetworkStatusChange = useCallback((status: 'online' | 'offline' | 'slow' | 'unstable') => {
    const wasOffline = !isOnline
    const nowOnline = status === 'online' || status === 'slow' || status === 'unstable'

    setIsOnline(nowOnline)

    // If we just came back online and have queued messages, show a notification
    if (wasOffline && nowOnline && messageQueue.length > 0) {
      toast.info(`You're back online! ${messageQueue.length} message${messageQueue.length > 1 ? 's' : ''} queued.`)
    }

    // Show offline notification
    if (!wasOffline && status === 'offline') {
      toast.warning('You are offline. Messages will be queued and sent when you reconnect.')
    }
  }, [isOnline, messageQueue.length, toast])

  // Add message to queue when offline
  const queueMessage = useCallback((content: string) => {
    const queuedMsg: QueuedMessage = {
      id: `queued-${Date.now()}`,
      content,
      timestamp: Date.now(),
    }
    setMessageQueue(prev => [...prev, queuedMsg])

    // Add a pending message to the UI
    const pendingMessage: Message = {
      id: queuedMsg.id,
      chatId: 'docs-assistant',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sending',
    }
    setMessages(prev => [...prev, pendingMessage])

    toast.info('Message queued. Will be sent when you reconnect.')
  }, [toast])

  // Process the message queue when back online
  const processMessageQueue = useCallback(async () => {
    // Prevent concurrent processing using ref (survives re-renders)
    if (isProcessingQueueRef.current) return
    if (!isOnline || messageQueue.length === 0 || isLoading) return

    isProcessingQueueRef.current = true
    const queue = [...messageQueue]
    setMessageQueue([]) // Clear queue first to prevent duplicate processing

    toast.info(`Sending ${queue.length} queued message${queue.length > 1 ? 's' : ''}...`)

    try {
      for (const queuedMsg of queue) {
        // Remove the pending message from UI
        setMessages(prev => prev.filter(m => m.id !== queuedMsg.id))

        // Send the actual message (this will add it back as a real message)
        await handleSendMessageInternal(queuedMsg.content, 0)

        // Small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } finally {
      isProcessingQueueRef.current = false
    }
  // Note: handleSendMessageInternal intentionally omitted to avoid circular dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, messageQueue, isLoading, toast])

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline && messageQueue.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        processMessageQueue()
      }, QUEUE_PROCESS_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [isOnline, messageQueue.length, isLoading, processMessageQueue])

  // Switch to a different branch
  const switchBranch = useCallback((branchId: string) => {
    const targetBranch = branchState.branches.find(b => b.id === branchId)
    if (!targetBranch) {
      toast.error('Branch not found')
      return
    }

    // Save current messages to current branch before switching
    setBranchState(prev => ({
      ...prev,
      branches: prev.branches.map(b =>
        b.id === prev.currentBranchId
          ? { ...b, messages: messages }
          : b
      ),
      currentBranchId: branchId,
    }))

    // Load messages from target branch
    setMessages(targetBranch.messages)

    toast.info(`Switched to: ${targetBranch.name}`)
  }, [branchState, messages, toast])

  // Get current branch info
  const currentBranch = useMemo(() => {
    return branchState.branches.find(b => b.id === branchState.currentBranchId) || branchState.branches[0]
  }, [branchState])

  // Open code in playground handler
  const handleOpenInPlayground = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || message.role !== 'assistant') return

    const codeBlocks = extractCodeBlocks(message.content)
    const playgroundCompatibleBlocks = codeBlocks.filter(
      block => isPlaygroundCompatible(block.language, block.code)
    )

    if (playgroundCompatibleBlocks.length === 0) {
      toast.warning('No playground-compatible code found in this message')
      return
    }

    // If multiple blocks, use the first one or the largest one
    const blockToOpen = playgroundCompatibleBlocks.reduce((largest, current) =>
      current.code.length > largest.code.length ? current : largest
    )

    openInPlayground(blockToOpen.code, blockToOpen.language)
    toast.success('Opening code in playground...')
  }, [messages, toast])

  // Check if a message has playground-compatible code (memoized for performance)
  const messagesWithPlaygroundCode = useMemo(() => {
    const result = new Set<string>()
    for (const message of messages) {
      if (message.role !== 'assistant') continue
      const codeBlocks = extractCodeBlocks(message.content)
      if (codeBlocks.some(block => isPlaygroundCompatible(block.language, block.code))) {
        result.add(message.id)
      }
    }
    return result
  }, [messages])

  // Check if a message has playground-compatible code
  const messageHasPlaygroundCode = useCallback((messageId: string): boolean => {
    return messagesWithPlaygroundCode.has(messageId)
  }, [messagesWithPlaygroundCode])

  // Throttled message update for streaming using library hook
  const updateStreamingMessage = useThrottledCallback(
    (messageId: string, content: string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, content } : m
        )
      )
    },
    STREAM_THROTTLE_MS
  )

  // Calculate exponential backoff delay for retries (inspired by useStreamingSSE)
  const calculateRetryDelay = useCallback((attempt: number): number => {
    const delay = INITIAL_RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt)
    return Math.min(delay, MAX_RETRY_DELAY_MS)
  }, [])

  // Check if an error is retryable (network errors, rate limits, server errors)
  const isRetryableError = useCallback((error: Error): boolean => {
    const errorMsg = error.message.toLowerCase()
    // Retry on network errors, rate limits (429), and server errors (5xx)
    return (
      error.name === 'TypeError' || // Network error
      errorMsg.includes('network') ||
      errorMsg.includes('fetch') ||
      errorMsg.includes('429') || // Rate limit
      errorMsg.includes('500') ||
      errorMsg.includes('502') ||
      errorMsg.includes('503') ||
      errorMsg.includes('504')
    )
  }, [])

  // Internal send message handler with validation and automatic retry
  const handleSendMessageInternal = useCallback(async (content: string, currentRetry = 0) => {
    // Validate message content
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      toast.warning('Please enter a message')
      return
    }

    // Only add user message on first attempt (not retries)
    if (currentRetry === 0) {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        chatId: 'docs-assistant',
        role: 'user',
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }

      setMessages((prev) => [...prev, userMessage])
      // Track user message tokens
      trackMessage({ role: 'user', content })
    }

    setIsLoading(true)
    setStreamingStatus('connecting')
    setRetryCount(currentRetry)
    setCurrentCitations([]) // Clear previous citations when starting new request
    partialContentRef.current = '' // Reset partial content
    setAiStatus({
      stage: 'researching',
      topic: currentRetry > 0 ? `Retrying (${currentRetry}/${MAX_RETRY_ATTEMPTS})...` : 'Searching documentation',
      startedAt: new Date(),
    })

    try {
      abortControllerRef.current?.abort()
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      const response = await fetch('/api/docs-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId,
          currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        chatId: 'docs-assistant',
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'streaming',
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
      setStreamingStatus('streaming')
      setAiStatus({
        stage: 'generating',
        topic: 'Generating response',
        startedAt: new Date(),
      })

      let accumulatedContent = ''
      let sources: Source[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'text' && data.content) {
                accumulatedContent += data.content
                partialContentRef.current = accumulatedContent // Track for recovery
                updateStreamingMessage(assistantMessage.id, accumulatedContent)
              } else if (data.type === 'sources' && data.data?.sources) {
                sources = data.data.sources
                // Convert sources to Citation objects for CitationCard display
                const citations: Citation[] = sources
                  .filter((s) => s && (s.title || s.source || s.url))
                  .map((source, index) => ({
                    id: source.id || `citation-${index}-${Date.now()}`,
                    source: (source.title || source.source || 'Documentation').trim(),
                    // Use chunkText from enhanced RAG if available, fall back to title
                    chunkText: source.chunkText || source.title || source.source || 'See documentation for more details',
                    confidence: Number(source.score) || Number(source.confidence) || 0,
                    url: normalizeSourceUrl(source.url || '', source.title || source.source || ''),
                  }))
                setCurrentCitations(citations)
              } else if (data.type === 'error') {
                throw new Error(data.content || 'Stream error')
              } else if (data.type === 'done') {
                const normalizedContent = normalizeLinksInContent(accumulatedContent)
                const finalContent = normalizedContent

                // Track assistant message tokens
                trackMessage({ role: 'assistant', content: finalContent })

                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: finalContent, status: 'sent' as const }
                      : m
                  )
                )
                setAiStatus(undefined)
              }
            } catch (parseError) {
              // Log parse errors for debugging incomplete JSON chunks
              if (process.env.NODE_ENV === 'development') {
                console.debug('[DocsAssistant] JSON parse error (may be incomplete chunk):', parseError)
              }
            }
          }
        }
      }

      // Finalize any streaming message that didn't receive a 'done' event
      // This handles cases where the stream ends abruptly
      if (accumulatedContent && accumulatedContent.length > 0) {
        const finalContent = normalizeLinksInContent(accumulatedContent)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id && m.status === 'streaming'
              ? { ...m, content: finalContent, status: 'sent' as const }
              : m
          )
        )
        trackMessage({ role: 'assistant', content: finalContent })
      }

      // Success - reset retry count and status
      abortControllerRef.current = null
      setIsLoading(false)
      setStreamingStatus('idle')
      setRetryCount(0)
      setAiStatus(undefined)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled - preserve partial content if any
        if (partialContentRef.current) {
          setMessages((prev) =>
            prev.map((m) =>
              m.status === 'streaming'
                ? { ...m, content: partialContentRef.current + '\n\n_(Response interrupted)_', status: 'sent' as const }
                : m
            )
          )
          toast.info('Response interrupted. Partial content preserved.')
        }
        setIsLoading(false)
        setStreamingStatus('idle')
        setAiStatus(undefined)
        return
      }

      abortControllerRef.current = null
      const err = error instanceof Error ? error : new Error('Unknown error')
      const errorMsg = err.message

      // Check if we should retry with exponential backoff
      if (isRetryableError(err) && currentRetry < MAX_RETRY_ATTEMPTS) {
        const retryDelay = calculateRetryDelay(currentRetry)
        setStreamingStatus('retrying')
        toast.warning(`Connection issue. Retrying in ${Math.round(retryDelay / 1000)}s...`, 'Retry')

        // Schedule retry with exponential backoff
        setTimeout(() => {
          handleSendMessageInternal(content, currentRetry + 1)
        }, retryDelay)
        return
      }

      // Max retries reached or non-retryable error
      setStreamingStatus('error')

      // Check if we have partial content to preserve
      if (partialContentRef.current && partialContentRef.current.length > 50) {
        // Preserve partial response with error indicator
        setMessages((prev) =>
          prev.map((m) =>
            m.status === 'streaming'
              ? {
                  ...m,
                  content: partialContentRef.current + '\n\n_(Stream interrupted - click retry to continue)_',
                  status: 'error' as const,
                }
              : m
          )
        )
        toast.warning('Response interrupted. Partial content preserved - use retry to continue.')
      } else {
        // No meaningful partial content - show error message
        const retryInfo = currentRetry > 0 ? ` (after ${currentRetry} retries)` : ''
        toast.error(`${errorMsg}${retryInfo}`, 'Failed to get response')
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          chatId: 'docs-assistant',
          role: 'assistant',
          content: `I encountered an error while processing your request. ${errorMsg}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'error',
        }
        setMessages((prev) => [...prev, errorMessage])
      }

      setIsLoading(false)
      setRetryCount(0)
      setAiStatus(undefined)
    }
  }, [messages, sessionId, toast, updateStreamingMessage, trackMessage, isRetryableError, calculateRetryDelay])

  // Public send message handler that checks for offline status
  const handleSendMessage = useCallback(async (content: string) => {
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      toast.warning('Please enter a message')
      return
    }

    // If offline, queue the message
    if (!isOnline) {
      queueMessage(trimmedContent)
      return
    }

    // Otherwise, send normally
    await handleSendMessageInternal(trimmedContent, 0)
  }, [isOnline, queueMessage, handleSendMessageInternal, toast])

  // Message copy handler using library clipboard hook
  const handleMessageCopy = useCallback(async (_messageId: string, content: string) => {
    await copy(content)
  }, [copy])

  // Message retry handler
  const handleMessageRetry = useCallback((messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex > 0) {
      const previousMessage = messages[messageIndex - 1]
      if (previousMessage.role === 'user') {
        setMessages((prev) => prev.filter((m) => m.id !== messageId))
        handleSendMessage(previousMessage.content)
        toast.info('Retrying message...')
      }
    }
  }, [messages, toast, handleSendMessage])

  // Voice input handler
  const handleVoiceTranscript = useCallback((transcript: string) => {
    if (transcript.trim()) {
      handleSendMessage(transcript.trim())
    }
  }, [handleSendMessage])

  // Export handler with multi-format support
  const handleExportWithFormat = useCallback(async (options: {
    format: string
    includeMetadata?: boolean
    includeImages?: boolean
  }) => {
    // Escape HTML to prevent XSS in HTML export
    const escapeHtml = (text: string) =>
      text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>')

    try {
      const { format, includeMetadata = true } = options
      const timestamp = new Date().toLocaleString()
      let content: string
      let mimeType: string
      let extension: string

      switch (format) {
        case 'json':
          content = JSON.stringify({
            exportedAt: timestamp,
            sessionId,
            messageCount: messages.length,
            messages: messages.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
              ...(includeMetadata && { status: m.status }),
            })),
          }, null, 2)
          mimeType = 'application/json'
          extension = 'json'
          break

        case 'html':
          content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clarity Chat Export</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .message { margin: 1rem 0; padding: 1rem; border-radius: 8px; }
    .user { background: #e3f2fd; }
    .assistant { background: #f5f5f5; }
    .meta { font-size: 0.75rem; color: #666; margin-bottom: 0.5rem; }
    pre { background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Clarity Chat Documentation Assistant</h1>
  <p>Exported: ${escapeHtml(timestamp)}</p>
  <hr>
  ${messages.map((m) => `
  <div class="message ${m.role}">
    ${includeMetadata ? `<div class="meta">${m.role === 'user' ? 'You' : 'Assistant'} • ${new Date(m.createdAt).toLocaleTimeString()}</div>` : ''}
    <div>${escapeHtml(m.content)}</div>
  </div>`).join('')}
</body>
</html>`
          mimeType = 'text/html'
          extension = 'html'
          break

        case 'markdown':
        default:
          content = '# Clarity Chat Documentation Assistant\n\n'
          content += `Exported: ${timestamp}\n\n---\n\n`
          messages.forEach((message) => {
            const role = message.role === 'user' ? 'You' : 'Assistant'
            const time = new Date(message.createdAt).toLocaleTimeString()
            content += `## ${role}${includeMetadata ? ` (${time})` : ''}\n\n${message.content}\n\n`
          })
          mimeType = 'text/markdown'
          extension = 'md'
          break
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `clarity-chat-${Date.now()}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`Conversation exported as ${extension.toUpperCase()}`)
    } catch (error) {
      console.error('Failed to export conversation:', error)
      toast.error('Failed to export conversation')
      throw error // Re-throw for ExportDialog to handle
    }
  }, [messages, sessionId, toast])

  // Quick export (opens dialog)
  const handleOpenExportDialog = useCallback(() => {
    setShowExportDialog(true)
  }, [])

  // Handler for library PromptSuggestion (uses text property)
  const handleSelectSuggestion = useCallback((suggestion: PromptSuggestion) => {
    handleSendMessage(suggestion.text)
  }, [handleSendMessage])

  // Feedback handler for thumbs up/down on assistant messages
  const handleFeedback = useCallback(async (
    messageId: string,
    type: 'up' | 'down'
  ) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          feedbackType: type,
          sessionId,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Feedback submission failed: ${response.status}`)
      }

      toast.success(
        type === 'up'
          ? 'Thanks for your feedback!'
          : "Feedback received. We'll work on improving."
      )
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      toast.error('Failed to submit feedback. Please try again.')
    }
  }, [sessionId, toast])

  const handleClear = useCallback(() => {
    setMessages([])
    clearSavedConversation()
    clearTokens() // Reset token tracking
    setCurrentCitations([]) // Clear citations
    setShowSearch(false) // Close search
    toast.info('Conversation cleared')
  }, [clearSavedConversation, clearTokens, toast])

  // Animation variants - respect reduced motion preference using library utilities
  const dialogVariants = useMemo(
    () => prefersReducedMotion ? DIALOG_VARIANTS_REDUCED : DIALOG_VARIANTS_NORMAL,
    [prefersReducedMotion]
  )

  // Combine refs for both dialog and focus trap
  const setDialogRefs = useCallback((node: HTMLDivElement | null) => {
    // Set both refs to the same node
    dialogRef.current = node
    // The focusTrapRef is managed by the hook, but we need to sync them
    if (focusTrapRef.current !== node) {
      (focusTrapRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    }
  }, [focusTrapRef])

  return (
    <>
      {/* Chat Button */}
      <ChatButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={setDialogRefs}
            variants={dialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: prefersReducedMotion ? 0.1 : 0.25,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={cn(
              'fixed inset-2 sm:inset-4 md:inset-6',
              'lg:right-6 lg:left-auto lg:top-6 lg:bottom-6 lg:w-[640px] xl:w-[720px]',
              'z-[70]',
              'flex flex-col',
              'rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden',
              'bg-white dark:bg-gray-900',
              'border border-gray-200/80 dark:border-gray-800',
              'touch-manipulation',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="docs-assistant-title"
            aria-describedby="docs-assistant-description"
          >
            {/* Screen reader title (hidden visually) */}
            <h2 id="docs-assistant-title" className="sr-only">
              Documentation Assistant
            </h2>
            {/* Screen reader description (hidden visually) */}
            <span id="docs-assistant-description" className="sr-only">
              Chat with the Clarity Chat documentation assistant. Ask questions about components, hooks, and features.
            </span>

            {/* Network Status Indicator */}
            <NetworkStatus
              className="absolute top-2 right-12 z-10"
              show={!isOnline || messageQueue.length > 0}
              onStatusChange={handleNetworkStatusChange}
              showDetails={!isOnline}
            />

            {/* Offline Queue Indicator */}
            {messageQueue.length > 0 && (
              <div
                className="absolute top-2 right-4 z-10 flex items-center gap-1.5 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-md text-xs font-medium"
                title="Messages waiting to be sent"
              >
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                {messageQueue.length} queued
              </div>
            )}

            {/* Voice Input Button */}
            <div className="absolute top-2 right-24 z-10">
              <VoiceInput
                onTranscript={handleVoiceTranscript}
                size="sm"
                variant="ghost"
                tooltipText="Speak your question"
                autoSubmit
              />
            </div>

            {/* Branch Selector/Indicator */}
            {(branchState.branches.length > 1 || branchState.currentBranchId !== 'main') && (
              <div className="absolute top-2 left-4 z-10 flex items-center gap-2">
                {/* Branch icon */}
                <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {branchState.branches.length > 1 ? (
                  <>
                    <label htmlFor="branch-selector" className="sr-only">
                      Select conversation branch
                    </label>
                    <select
                      id="branch-selector"
                      value={branchState.currentBranchId}
                      onChange={(e) => switchBranch(e.target.value)}
                      className="px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      aria-label="Switch conversation branch"
                    >
                      {branchState.branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                    {currentBranch.name}
                  </span>
                )}
              </div>
            )}

            {/* Search Toggle Button - shows when there are messages */}
            {messages.length > 0 && (
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className={cn(
                  'absolute top-2 right-36 z-10 p-2 rounded-lg transition-colors',
                  'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring/40',
                  showSearch && 'bg-accent text-accent-foreground'
                )}
                title="Search messages (Cmd+K)"
                aria-label="Toggle message search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Message Search Panel - shows when search is active */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-14 left-4 right-4 z-10 bg-background/95 backdrop-blur-sm rounded-lg border border-border/40 shadow-lg overflow-hidden"
                >
                  <div className="p-3">
                    <MessageSearch
                      messages={messages}
                      placeholder="Search conversation..."
                      className="w-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Token Counter - shows when conversation has tokens */}
            {totalTokens > 0 && (
              <div className="absolute top-2 left-4 z-10 max-w-[200px]">
                <TokenCounter
                  currentTokens={totalTokens}
                  maxTokens={MODEL_MAX_TOKENS}
                  costPerToken={TOKEN_COST_PER_TOKEN}
                  showWarning={isNearLimit || isCritical}
                  warningThreshold={TOKEN_WARNING_THRESHOLD}
                  criticalThreshold={TOKEN_CRITICAL_THRESHOLD}
                  showCost
                  showBar
                  size="sm"
                  className="bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-border/40"
                />
              </div>
            )}

            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              aiStatus={aiStatus}
              onSendMessage={handleSendMessage}
              onMessageCopy={handleMessageCopy}
              onMessageRetry={handleMessageRetry}
              onMessageFeedback={handleFeedback}
              showHeader
              sessionTitle="Documentation Assistant"
              sessionSubtitle="Powered by Clarity Chat"
              showMessageCount
              onExport={messages.length > 0 ? handleOpenExportDialog : undefined}
              onClear={messages.length > 0 ? handleClear : undefined}
              headerActions={
                // Playground button - show when there are messages with code
                messagesWithPlaygroundCode.size > 0 ? (
                  <button
                    onClick={() => {
                      // Find the last assistant message with playground code
                      const lastWithCode = [...messages]
                        .reverse()
                        .find(m => m.role === 'assistant' && messagesWithPlaygroundCode.has(m.id))
                      if (lastWithCode) {
                        handleOpenInPlayground(lastWithCode.id)
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                    title="Open code in playground"
                    aria-label="Open code in CodeSandbox playground"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Try Code
                  </button>
                ) : undefined
              }
              emptyState={
                <EmptyChatState
                  suggestions={DOCS_STARTER_PROMPTS}
                  onSuggestionSelect={handleSelectSuggestion}
                  showSuggestions
                />
              }
              className="h-full flex flex-col"
            />

            {/* Citations Panel - shows when citations available */}
            <AnimatePresence>
              {currentCitations.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="border-t border-border/40 bg-muted/30 overflow-hidden"
                >
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Sources ({currentCitations.length})
                    </h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {currentCitations.map((citation) => (
                        <CitationCard
                          key={citation.id}
                          citation={citation}
                          previewLength={80}
                          showConfidence
                          onSourceClick={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
                          className="text-sm"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={BACKDROP_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.25 }}
            className="fixed inset-0 bg-black/40 sm:bg-black/30 backdrop-blur-sm sm:backdrop-blur-md z-[60]"
            onClick={() => {
              setIsOpen(false)
              restoreFocus()
            }}
            style={{ backdropFilter: 'blur(8px)' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExportWithFormat}
        resourceType="chat"
        resourceName="Documentation Assistant Conversation"
      />
    </>
  )
}

// ============================================================================
// Exported Component with Error Boundary
// ============================================================================

export function DocsAssistant({ className }: DocsAssistantProps) {
  const toast = useToast()

  return (
    <ErrorBoundary
      fallback={(error, resetError) => (
        <div className="fixed bottom-4 right-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Documentation Assistant Error</h3>
              <p className="text-sm text-muted-foreground">
                {error.message || 'An unexpected error occurred.'}
              </p>
              <button
                onClick={resetError}
                className="text-sm text-primary hover:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('[DocsAssistant] Error:', error, errorInfo)
      }}
      onReset={() => {
        toast.info('Documentation Assistant has been reset')
      }}
    >
      <DocsAssistantInner className={className} />
    </ErrorBoundary>
  )
}
