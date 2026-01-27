'use client'

import * as React from 'react'
import {
  AccurateTokenCounter,
  LLMLinguaCompressor,
  ExtractiveCompressor,
  AdaptiveCompressor,
} from '@clarity-chat/token-optimization'
import type {
  ChatMessage,
  LLMLinguaOptions,
  ExtractiveOptions,
  AdaptiveOptions,
} from '@clarity-chat/token-optimization'
import type {
  UseContextWindowConfig,
  UseContextWindowReturn,
  ContextWindowState,
  ContextStrategy,
  TokenEncoding,
} from './types'

/**
 * Compression strategy type for context window
 */
export type CompressionStrategyType =
  | 'llmlingua'
  | 'extractive'
  | 'adaptive'
  | 'none'

/**
 * Compression options for context window
 */
export interface ContextCompressionOptions {
  /** Compression strategy to use */
  strategy?: CompressionStrategyType
  /** Target compression ratio (0.1-1.0) - lower = more aggressive */
  targetRatio?: number
  /** Minimum quality threshold */
  minQuality?: number
  /** LLMLingua-specific options */
  llmlinguaOptions?: Partial<LLMLinguaOptions>
  /** Extractive-specific options */
  extractiveOptions?: Partial<ExtractiveOptions>
  /** Adaptive-specific options */
  adaptiveOptions?: Partial<AdaptiveOptions>
}

/**
 * Extended context window config with compression support
 */
export interface UseContextWindowConfigWithCompression extends UseContextWindowConfig {
  /** Enable compression before summarization */
  enableCompression?: boolean
  /** Default compression options */
  compressionOptions?: ContextCompressionOptions
}

/**
 * Default summarizer that concatenates message content
 */
const defaultSummarizer = async (messages: ChatMessage[]): Promise<string> => {
  // In a real implementation, this would call an LLM to summarize
  // For now, just create a condensed version
  const summaryParts = messages.map((msg) => {
    const role = msg.role === 'assistant' ? 'AI' : msg.role
    const truncated =
      msg.content.length > 200 ? msg.content.slice(0, 200) + '...' : msg.content
    return `${role}: ${truncated}`
  })
  return `Previous conversation summary:\n${summaryParts.join('\n')}`
}

/**
 * useContextWindow - Sliding window context management with compression
 *
 * Manages chat history to fit within model context limits.
 * Implements LangChain-style memory patterns: Buffer (full history),
 * BufferWindow (last k messages), SummaryBuffer (recent verbatim + older summarized).
 *
 * **Compression Integration (new):**
 * Optionally compress messages before summarization using strategies from
 * @clarity-chat/token-optimization:
 * - **LLMLingua**: Token-level compression using importance scoring (best for prose)
 * - **Extractive**: Sentence-level compression (best for long documents)
 * - **Adaptive**: Automatically selects the best strategy based on content
 *
 * @param config - Configuration options
 * @returns Context window management utilities
 *
 * @example
 * ```tsx
 * function ChatWithContextManagement() {
 *   const {
 *     state,
 *     addMessage,
 *     getOptimizedContext,
 *     compressMessages,
 *   } = useContextWindow({
 *     maxTokens: 128000,
 *     strategy: 'summaryBuffer',
 *     reservedTokens: 4000,
 *     enableCompression: true,
 *     compressionOptions: {
 *       strategy: 'adaptive',
 *       targetRatio: 0.5,
 *       minQuality: 0.7,
 *     },
 *   })
 *
 *   const handleSend = async (content: string) => {
 *     addMessage({ id: Date.now().toString(), role: 'user', content })
 *
 *     // Get optimized context for API call
 *     const { messages } = await getOptimizedContext()
 *
 *     // Send to API with optimized context
 *     const response = await sendToAPI(messages)
 *
 *     addMessage({
 *       id: (Date.now() + 1).toString(),
 *       role: 'assistant',
 *       content: response,
 *     })
 *   }
 *
 *   return (
 *     <div>
 *       <span>Context: {state.utilizationPercent.toFixed(1)}% used</span>
 *       {state.summarizedCount > 0 && (
 *         <span>{state.summarizedCount} messages summarized</span>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useContextWindow(
  config: UseContextWindowConfigWithCompression
): UseContextWindowReturn & {
  /** Compress messages using the configured compression strategy */
  compressMessages: (
    messages: ChatMessage[],
    options?: ContextCompressionOptions
  ) => Promise<{
    messages: ChatMessage[]
    compressionRatio: number
    tokensSaved: number
  }>
  /** Compress a single text string */
  compressText: (
    text: string,
    options?: ContextCompressionOptions
  ) => Promise<{
    compressed: string
    compressionRatio: number
    originalTokens: number
    compressedTokens: number
  }>
} {
  const {
    maxTokens,
    reservedTokens = 1000,
    strategy: initialStrategy = 'summaryBuffer',
    windowSize = 10,
    summarizationThreshold = 0.7,
    summarizer = defaultSummarizer,
    preserveSystemPrompt = true,
    preserveRecentCount = 4,
    enableCompression = false,
    compressionOptions: defaultCompressionOptions = {},
  } = config

  // Compression instances (lazy-loaded)
  const llmlinguaRef = React.useRef<LLMLinguaCompressor | null>(null)
  const extractiveRef = React.useRef<ExtractiveCompressor | null>(null)
  const adaptiveRef = React.useRef<AdaptiveCompressor | null>(null)

  /**
   * Get or create compressor instance
   */
  const getCompressor = React.useCallback(
    (strategy: CompressionStrategyType) => {
      switch (strategy) {
        case 'llmlingua':
          if (!llmlinguaRef.current) {
            llmlinguaRef.current = new LLMLinguaCompressor(
              defaultCompressionOptions.llmlinguaOptions
            )
          }
          return llmlinguaRef.current
        case 'extractive':
          if (!extractiveRef.current) {
            extractiveRef.current = new ExtractiveCompressor(
              defaultCompressionOptions.extractiveOptions
            )
          }
          return extractiveRef.current
        case 'adaptive':
          if (!adaptiveRef.current) {
            adaptiveRef.current = new AdaptiveCompressor(
              defaultCompressionOptions.adaptiveOptions
            )
          }
          return adaptiveRef.current
        default:
          return null
      }
    },
    [defaultCompressionOptions]
  )

  // Token counter ref
  const counterRef = React.useRef<AccurateTokenCounter | null>(null)

  // Initialize token counter
  React.useEffect(() => {
    counterRef.current = new AccurateTokenCounter({
      model: 'gpt-4o',
      enableCaching: true,
    })

    return () => {
      if (counterRef.current) {
        counterRef.current.destroy()
      }
    }
  }, [])

  // Token counting helpers
  const countTokens = React.useCallback((text: string): number => {
    if (counterRef.current) {
      return counterRef.current.count(text)
    }
    return Math.ceil(text.length / 4)
  }, [])

  const countChatTokens = React.useCallback(
    (messages: ChatMessage[]): number => {
      if (counterRef.current) {
        return counterRef.current.countChat(messages)
      }
      return messages.reduce(
        (sum, msg) => sum + Math.ceil(msg.content.length / 4) + 4,
        3
      )
    },
    []
  )

  // State
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [summary, setSummary] = React.useState<string | null>(null)
  const [strategy, setStrategy] =
    React.useState<ContextStrategy>(initialStrategy)
  const [summarizedCount, setSummarizedCount] = React.useState(0)
  const [truncatedCount, setTruncatedCount] = React.useState(0)

  // Calculate total tokens
  const totalTokens = React.useMemo(() => {
    let tokens = countChatTokens(messages)
    if (summary) {
      tokens += countTokens(summary)
    }
    return tokens
  }, [messages, summary, countChatTokens, countTokens])

  // Available tokens
  const availableTokens = maxTokens - reservedTokens - totalTokens
  const utilizationPercent = (totalTokens / (maxTokens - reservedTokens)) * 100

  // State object
  const state: ContextWindowState = React.useMemo(
    () => ({
      messages,
      summary,
      totalTokens,
      availableTokens,
      utilizationPercent,
      truncatedCount,
      summarizedCount,
    }),
    [
      messages,
      summary,
      totalTokens,
      availableTokens,
      utilizationPercent,
      truncatedCount,
      summarizedCount,
    ]
  )

  /**
   * Estimate tokens for a message
   */
  const estimateMessageTokens = React.useCallback(
    (message: ChatMessage): number => {
      return countTokens(message.content) + 4 // Add overhead
    },
    [countTokens]
  )

  /**
   * Check if adding message would exceed limit
   */
  const willExceedLimit = React.useCallback(
    (newMessage: ChatMessage): boolean => {
      const newTokens = estimateMessageTokens(newMessage)
      return totalTokens + newTokens > maxTokens - reservedTokens
    },
    [totalTokens, maxTokens, reservedTokens, estimateMessageTokens]
  )

  /**
   * Estimate tokens after adding message
   */
  const estimateTokensAfterAdd = React.useCallback(
    (message: ChatMessage): number => {
      return totalTokens + estimateMessageTokens(message)
    },
    [totalTokens, estimateMessageTokens]
  )

  /**
   * Apply buffer strategy (keep all messages)
   */
  const applyBufferStrategy = React.useCallback(
    (msgs: ChatMessage[]): ChatMessage[] => {
      return msgs
    },
    []
  )

  /**
   * Apply window strategy (keep last k messages)
   */
  const applyWindowStrategy = React.useCallback(
    (msgs: ChatMessage[]): ChatMessage[] => {
      // Find system messages to preserve
      const systemMessages = preserveSystemPrompt
        ? msgs.filter((m) => m.role === 'system')
        : []

      const nonSystemMessages = msgs.filter((m) => m.role !== 'system')
      const recentMessages = nonSystemMessages.slice(-windowSize)

      return [...systemMessages, ...recentMessages]
    },
    [windowSize, preserveSystemPrompt]
  )

  /**
   * Apply summary buffer strategy
   */
  const applySummaryBufferStrategy = React.useCallback(
    async (
      msgs: ChatMessage[]
    ): Promise<{ messages: ChatMessage[]; newSummary: string | null }> => {
      const budget = maxTokens - reservedTokens

      // Check if we need to summarize
      if (totalTokens < budget * summarizationThreshold) {
        return { messages: msgs, newSummary: summary }
      }

      // Preserve system messages
      const systemMessages = preserveSystemPrompt
        ? msgs.filter((m) => m.role === 'system')
        : []

      const nonSystemMessages = msgs.filter((m) => m.role !== 'system')

      // Keep recent messages
      const recentMessages = nonSystemMessages.slice(-preserveRecentCount)
      const olderMessages = nonSystemMessages.slice(0, -preserveRecentCount)

      // Summarize older messages if we have any
      if (olderMessages.length > 0) {
        const newSummary = await summarizer(olderMessages)
        setSummarizedCount((prev) => prev + olderMessages.length)

        return {
          messages: [...systemMessages, ...recentMessages],
          newSummary,
        }
      }

      return { messages: msgs, newSummary: summary }
    },
    [
      maxTokens,
      reservedTokens,
      summarizationThreshold,
      totalTokens,
      summary,
      preserveSystemPrompt,
      preserveRecentCount,
      summarizer,
    ]
  )

  /**
   * Add single message
   */
  const addMessage = React.useCallback((message: ChatMessage): void => {
    setMessages((prev) => [...prev, message])
  }, [])

  /**
   * Add multiple messages
   */
  const addMessages = React.useCallback((newMessages: ChatMessage[]): void => {
    setMessages((prev) => [...prev, ...newMessages])
  }, [])

  /**
   * Get optimized context for API call
   */
  const getOptimizedContext = React.useCallback(async (): Promise<{
    messages: ChatMessage[]
    totalTokens: number
    wasTruncated: boolean
    wasSummarized: boolean
  }> => {
    let optimizedMessages: ChatMessage[]
    let newSummary = summary
    let wasSummarized = false

    switch (strategy) {
      case 'buffer':
        optimizedMessages = applyBufferStrategy(messages)
        break

      case 'window':
        optimizedMessages = applyWindowStrategy(messages)
        if (optimizedMessages.length < messages.length) {
          setTruncatedCount(messages.length - optimizedMessages.length)
        }
        break

      case 'summaryBuffer':
      default:
        const result = await applySummaryBufferStrategy(messages)
        optimizedMessages = result.messages
        if (result.newSummary !== summary) {
          newSummary = result.newSummary
          setSummary(newSummary)
          wasSummarized = true
        }
        break
    }

    // If we have a summary, prepend it as a system message
    if (newSummary) {
      const summaryMessage: ChatMessage = {
        role: 'system',
        content: newSummary,
      }
      // Insert after any existing system messages
      const systemCount = optimizedMessages.filter(
        (m) => m.role === 'system'
      ).length
      optimizedMessages = [
        ...optimizedMessages.slice(0, systemCount),
        summaryMessage,
        ...optimizedMessages.slice(systemCount),
      ]
    }

    const optimizedTokens = countChatTokens(optimizedMessages)

    return {
      messages: optimizedMessages,
      totalTokens: optimizedTokens,
      wasTruncated: truncatedCount > 0,
      wasSummarized,
    }
  }, [
    messages,
    strategy,
    summary,
    truncatedCount,
    applyBufferStrategy,
    applyWindowStrategy,
    applySummaryBufferStrategy,
    countChatTokens,
  ])

  /**
   * Manually trigger summarization
   */
  const triggerSummarization = React.useCallback(async (): Promise<void> => {
    if (strategy !== 'summaryBuffer') return

    const result = await applySummaryBufferStrategy(messages)
    if (result.newSummary !== summary) {
      setSummary(result.newSummary)
      setMessages(result.messages)
    }
  }, [strategy, messages, summary, applySummaryBufferStrategy])

  /**
   * Clear all history
   */
  const clearHistory = React.useCallback((): void => {
    setMessages([])
    setSummary(null)
    setSummarizedCount(0)
    setTruncatedCount(0)
  }, [])

  /**
   * Export state
   */
  const exportState = React.useCallback((): ContextWindowState => {
    return state
  }, [state])

  /**
   * Import state
   */
  const importState = React.useCallback(
    (newState: ContextWindowState): void => {
      setMessages(newState.messages)
      setSummary(newState.summary)
      setSummarizedCount(newState.summarizedCount)
      setTruncatedCount(newState.truncatedCount)
    },
    []
  )

  /**
   * Compress a single text string using the configured compression strategy
   */
  const compressText = React.useCallback(
    async (
      text: string,
      options?: ContextCompressionOptions
    ): Promise<{
      compressed: string
      compressionRatio: number
      originalTokens: number
      compressedTokens: number
    }> => {
      const opts = { ...defaultCompressionOptions, ...options }
      const strategy = opts.strategy || 'adaptive'
      const targetRatio = opts.targetRatio || 0.5

      if (strategy === 'none' || !text.trim()) {
        const tokens = countTokens(text)
        return {
          compressed: text,
          compressionRatio: 1,
          originalTokens: tokens,
          compressedTokens: tokens,
        }
      }

      const originalTokens = countTokens(text)
      let compressed: string
      let compressionRatio: number

      switch (strategy) {
        case 'llmlingua': {
          const compressor = getCompressor('llmlingua') as LLMLinguaCompressor
          const result = await compressor.compress(
            text,
            targetRatio,
            opts.llmlinguaOptions
          )
          compressed = result.compressed
          compressionRatio = result.compressionRatio
          break
        }
        case 'extractive': {
          const compressor = getCompressor('extractive') as ExtractiveCompressor
          const result = compressor.compress(
            text,
            targetRatio,
            opts.extractiveOptions
          )
          compressed = result.compressed
          compressionRatio = result.compressionRatio
          break
        }
        case 'adaptive':
        default: {
          const compressor = getCompressor('adaptive') as AdaptiveCompressor
          const result = await compressor.compress(text, {
            targetRatio,
            minQuality: opts.minQuality,
            ...opts.adaptiveOptions,
          })
          compressed = result.compressed
          compressionRatio = result.compressionRatio
          break
        }
      }

      const compressedTokens = countTokens(compressed)

      return {
        compressed,
        compressionRatio,
        originalTokens,
        compressedTokens,
      }
    },
    [countTokens, defaultCompressionOptions, getCompressor]
  )

  /**
   * Compress multiple chat messages
   */
  const compressMessages = React.useCallback(
    async (
      messagesToCompress: ChatMessage[],
      options?: ContextCompressionOptions
    ): Promise<{
      messages: ChatMessage[]
      compressionRatio: number
      tokensSaved: number
    }> => {
      const opts = { ...defaultCompressionOptions, ...options }
      const strategy = opts.strategy || 'adaptive'

      if (strategy === 'none' || messagesToCompress.length === 0) {
        return {
          messages: messagesToCompress,
          compressionRatio: 1,
          tokensSaved: 0,
        }
      }

      let totalOriginalTokens = 0
      let totalCompressedTokens = 0
      const compressedMessages: ChatMessage[] = []

      for (const message of messagesToCompress) {
        // Don't compress system messages or very short messages
        if (message.role === 'system' || message.content.length < 100) {
          compressedMessages.push(message)
          const tokens = countTokens(message.content)
          totalOriginalTokens += tokens
          totalCompressedTokens += tokens
          continue
        }

        const result = await compressText(message.content, opts)
        totalOriginalTokens += result.originalTokens
        totalCompressedTokens += result.compressedTokens

        compressedMessages.push({
          ...message,
          content: result.compressed,
        })
      }

      return {
        messages: compressedMessages,
        compressionRatio:
          totalOriginalTokens > 0
            ? totalCompressedTokens / totalOriginalTokens
            : 1,
        tokensSaved: totalOriginalTokens - totalCompressedTokens,
      }
    },
    [countTokens, compressText, defaultCompressionOptions]
  )

  return {
    state,
    addMessage,
    addMessages,
    getOptimizedContext,
    triggerSummarization,
    clearHistory,
    setStrategy,
    willExceedLimit,
    estimateTokensAfterAdd,
    exportState,
    importState,
    compressMessages,
    compressText,
  }
}
