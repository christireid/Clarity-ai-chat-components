/**
 * Type definitions for useClarityChat hook
 *
 * @module hooks/use-clarity-chat/types
 */

import type {
  UseChatOptions as UseChatEnhancedOptions,
  UseChatReturn as UseChatEnhancedReturn,
  CoreMessage,
} from '../chat/use-chat-enhanced'

/**
 * Memory configuration options
 */
export interface ClarityMemoryOptions {
  /** Enable memory integration */
  enabled?: boolean
  /** Memory strategy: sliding-window, semantic-chunks, or vector-store */
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Maximum tokens for memory context */
  maxTokens?: number
  /** Retry failed memory operations (default: true) */
  retryOnError?: boolean
  /** Maximum retry attempts for memory operations (default: 2) */
  maxRetryAttempts?: number
  /** Callback when memory operation fails */
  onMemoryError?: (error: Error, operation: 'query' | 'store') => void
}

/**
 * Prompt optimization configuration options
 */
export interface ClarityPromptOptimizationOptions {
  /** Enable prompt optimization */
  enabled?: boolean
  /** Target token budget */
  targetTokens?: number
  /** Optimization strategy */
  strategy?: 'sliding-window' | 'summarize-old' | 'drop-low-priority' | 'hybrid'
  /** Model identifier for token counting */
  model?: string
  /** Message priorities for optimization */
  priorities?: Array<{ messageId: string; priority: number; reason?: string }>
  /** Summarization function for summarize-old strategy */
  summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
  /** Number of recent messages to always keep */
  keepRecent?: number
}

/**
 * WebSocket configuration options (when transport is 'websocket')
 */
export interface ClarityWebSocketOptions {
  /** Enable automatic reconnection (default: true) */
  autoReconnect?: boolean
  /** Maximum reconnection attempts (default: 5) */
  maxReconnectAttempts?: number
  /** Enable heartbeat/ping-pong (default: true) */
  enableHeartbeat?: boolean
  /** WebSocket protocols */
  protocols?: string | string[]
}

/**
 * Options for useClarityChat hook
 */
export interface UseClarityChatOptions extends Omit<
  UseChatEnhancedOptions,
  'experimental'
> {
  /** Memory configuration */
  memory?: ClarityMemoryOptions
  /** Transport protocol: 'sse' (default) or 'websocket' */
  transport?: 'sse' | 'websocket'
  /** WebSocket-specific options (only used when transport is 'websocket') */
  websocket?: ClarityWebSocketOptions
  /** Prompt optimization configuration */
  promptOptimization?: ClarityPromptOptimizationOptions
}

/**
 * Memory statistics and context summary
 */
export interface ClarityChatMemoryInfo {
  /** Number of memories stored */
  memoryCount: number
  /** Whether memory is enabled */
  enabled: boolean
  /** Current memory strategy */
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Last context that was added to messages */
  lastContextSummary?: string
}

/**
 * Token statistics from prompt optimization
 */
export interface ClarityChatTokenStats {
  /** Current input tokens */
  inputTokens: number
  /** Remaining budget */
  remainingBudget: number
  /** Budget utilization (0-1) */
  utilization: number
  /** Last optimization reason */
  lastOptimizationReason?: string
  /** Whether optimization was applied */
  wasOptimized: boolean
}

/**
 * Error information for Clarity Chat
 */
export interface ClarityChatErrorInfo {
  /** Last memory operation error */
  memoryError: Error | null
  /** Last memory operation that failed */
  memoryErrorOperation: 'query' | 'store' | null
  /** Error type classification */
  memoryErrorType:
    | 'network'
    | 'ratelimit'
    | 'server'
    | 'auth'
    | 'memory'
    | 'unknown'
    | null
}

/**
 * Internal memory error state
 */
export interface MemoryErrorState {
  error: Error | null
  operation: 'query' | 'store' | null
  errorType:
    | 'network'
    | 'ratelimit'
    | 'server'
    | 'auth'
    | 'memory'
    | 'unknown'
    | null
}

/**
 * Return type for useClarityChat hook
 * Extends UseChatEnhancedReturn with Clarity-specific additions
 */
export type UseClarityChatReturn = UseChatEnhancedReturn & {
  /** Memory information and statistics */
  memoryInfo: ClarityChatMemoryInfo
  /** Error information for memory operations */
  memoryErrorInfo: ClarityChatErrorInfo
  /** Token statistics (if prompt optimization enabled) */
  tokenStats?: ClarityChatTokenStats
}

// Re-export CoreMessage for convenience
export type { CoreMessage } from '../chat/use-chat-enhanced'
