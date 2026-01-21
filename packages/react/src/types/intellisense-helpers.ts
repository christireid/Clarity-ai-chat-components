/**
 * IntelliSense Helpers - Enhanced TypeScript Developer Experience
 *
 * These types and utilities improve the TypeScript development experience by providing
 * better IntelliSense, autocomplete, and type inference throughout the codebase.
 *
 * @module types/intellisense-helpers
 */

// =============================================================================
// CHAT API TYPE HELPERS
// =============================================================================

/**
 * Helper type for API endpoint configuration with IntelliSense
 */
export type ChatApiConfig =
  | `/${string}`  // Relative paths like "/api/chat"
  | `http://${string}`  // HTTP URLs
  | `https://${string}`  // HTTPS URLs
  | `ws://${string}`  // WebSocket URLs
  | `wss://${string}`  // Secure WebSocket URLs

/**
 * Helper type for common chat configurations
 */
export type ChatPreset =
  | 'minimal'      // Basic chat functionality
  | 'with-memory'  // Chat with memory enabled
  | 'streaming'    // Optimized for streaming
  | 'enterprise'   // Full-featured enterprise chat

/**
 * IntelliSense-friendly memory configuration
 */
export interface MemoryConfigHelper {
  /** Enable memory management */
  enabled: boolean

  /** Memory strategy - hover for descriptions */
  strategy: 'sliding-window' | 'semantic-chunks' | 'vector-store'

  /** Maximum tokens to store in memory */
  maxTokens: number

  /** Retry failed memory operations */
  retryOnError: boolean

  /** Maximum retry attempts */
  maxRetryAttempts: number

  /** Error callback for memory operations */
  onMemoryError?: (error: Error, operation: 'query' | 'store') => void
}

/**
 * IntelliSense-friendly streaming configuration
 */
export interface StreamingConfigHelper {
  /** Transport protocol */
  transport: 'sse' | 'websocket'

  /** WebSocket-specific options (only when transport is 'websocket') */
  websocket?: {
    /** Enable automatic reconnection */
    autoReconnect: boolean
    /** Maximum reconnection attempts */
    maxReconnectAttempts: number
    /** Enable heartbeat/ping-pong */
    enableHeartbeat: boolean
  }
}

/**
 * IntelliSense-friendly rate limiting configuration
 */
export interface RateLimitConfigHelper {
  /** Enable rate limiting */
  enabled: boolean

  /** Maximum requests per minute */
  maxRequestsPerMinute: number

  /** Queue size for pending requests */
  queueSize: number

  /** Retry strategy for rate-limited requests */
  retryStrategy: 'exponential-backoff' | 'linear' | 'immediate'

  /** Callback when rate limit is hit */
  onRateLimit?: (retryAfter: number) => void
}

// =============================================================================
// COMPONENT PROP HELPERS
// =============================================================================

/**
 * Helper type for header configuration with better IntelliSense
 */
export interface HeaderConfigHelper {
  /** Show the header */
  show: boolean

  /** Header title */
  title?: string

  /** Header subtitle */
  subtitle?: string

  /** Show message count badge */
  showMessageCount: boolean

  /** Custom header actions */
  actions?: React.ReactNode
}

/**
 * Helper type for message actions with better IntelliSense
 */
export interface MessageActionsConfigHelper {
  /** Callback when message is copied */
  onCopy?: (messageId: string, content: string) => void

  /** Callback when message feedback is provided */
  onFeedback?: (messageId: string, type: 'up' | 'down', comment?: string) => void

  /** Callback when message is edited */
  onEdit?: (messageId: string) => void

  /** Callback when message is regenerated */
  onRegenerate?: (messageId: string) => void

  /** Callback when message is deleted */
  onDelete?: (messageId: string) => void

  /** Callback when message is saved after editing */
  onSaveEdit?: (messageId: string, newContent: string) => void

  /** Callback when message editing is cancelled */
  onCancelEdit?: (messageId: string) => void
}

/**
 * Helper type for prompt configuration with better IntelliSense
 */
export interface PromptsConfigHelper {
  /** Enable starter prompts */
  showStarterPrompts: boolean

  /** Starter prompts to display */
  starterPrompts: Array<{
    /** Prompt text */
    text: string
    /** Optional category for organization */
    category?: string
    /** Optional icon */
    icon?: string
  }>

  /** Enable follow-up suggestions */
  showFollowUpSuggestions: boolean

  /** Follow-up suggestions */
  followUpSuggestions: Array<{
    /** Suggestion text */
    text: string
    /** Optional confidence score */
    confidence?: number
  }>
}

// =============================================================================
// ERROR TYPE HELPERS
// =============================================================================

/**
 * IntelliSense-friendly error types with descriptions
 */
export type ChatErrorType =
  | 'network'     // Network connectivity issues
  | 'auth'        // Authentication/authorization errors
  | 'ratelimit'   // Rate limiting errors
  | 'server'      // Server-side errors
  | 'validation'  // Input validation errors
  | 'timeout'     // Request timeout errors
  | 'parse'       // Response parsing errors
  | 'memory'      // Memory operation errors
  | 'unknown'     // Unknown/unexpected errors

/**
 * Helper interface for error handling configuration
 */
export interface ErrorHandlingConfigHelper {
  /** Enable error boundary */
  enabled: boolean

  /** Show error UI to user */
  showErrorUI: boolean

  /** Show retry button */
  showRetryButton: boolean

  /** Custom error fallback component */
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>

  /** Callback when error occurs */
  onError?: (error: Error, errorType: ChatErrorType) => void

  /** Callback when retry is attempted */
  onRetry?: () => void
}

// =============================================================================
// UTILITY TYPES FOR BETTER DX
// =============================================================================

/**
 * Helper type that makes all properties of T optional except for K
 */
export type RequireAtLeastOne<T, K extends keyof T = keyof T> = Pick<T, K> & Partial<Omit<T, K>>

/**
 * Helper type for component configuration that allows flexible composition
 */
export type ComponentConfig<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K]
}

/**
 * Helper type for API response types with better IntelliSense
 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code: string; details?: unknown } }

/**
 * Helper type for async operations with loading states
 */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

// =============================================================================
// INTELLISENSE ENHANCEMENT UTILITIES
// =============================================================================

/**
 * Utility type to extract IntelliSense-friendly props from component interfaces
 */
export type IntelliSenseProps<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T[K] extends object
    ? IntelliSenseProps<T[K]>
    : T[K]
}

/**
 * Utility type for creating branded types that help with IntelliSense
 */
export type Branded<T, Brand> = T & { readonly __brand: Brand }

/**
 * Branded types for better IntelliSense and type safety
 */
export type ApiUrl = Branded<string, 'ApiUrl'>
export type ChatId = Branded<string, 'ChatId'>
export type MessageId = Branded<string, 'MessageId'>

/**
 * Helper function to create branded types with validation
 */
export function createApiUrl(url: string): ApiUrl {
  // Basic validation - must look like a URL or path
  if (!url.startsWith('/') && !url.startsWith('http') && !url.startsWith('ws')) {
    throw new Error('API URL must start with "/", "http", or "ws"')
  }
  return url as ApiUrl
}

/**
 * Type-safe chat configuration builder
 */
export class TypeSafeChatConfig {
  private config: Partial<{
    api: ApiUrl
    memory: MemoryConfigHelper
    streaming: StreamingConfigHelper
    rateLimiting: RateLimitConfigHelper
    header: HeaderConfigHelper
    messageActions: MessageActionsConfigHelper
    prompts: PromptsConfigHelper
    errorHandling: ErrorHandlingConfigHelper
  }> = {}

  api(url: string): this {
    this.config.api = createApiUrl(url)
    return this
  }

  withMemory(config: Partial<MemoryConfigHelper>): this {
    this.config.memory = config as MemoryConfigHelper
    return this
  }

  withStreaming(config: Partial<StreamingConfigHelper>): this {
    this.config.streaming = config as StreamingConfigHelper
    return this
  }

  withRateLimiting(config: Partial<RateLimitConfigHelper>): this {
    this.config.rateLimiting = config as RateLimitConfigHelper
    return this
  }

  withHeader(config: Partial<HeaderConfigHelper>): this {
    this.config.header = config as HeaderConfigHelper
    return this
  }

  withMessageActions(config: Partial<MessageActionsConfigHelper>): this {
    this.config.messageActions = config as MessageActionsConfigHelper
    return this
  }

  withPrompts(config: Partial<PromptsConfigHelper>): this {
    this.config.prompts = config as PromptsConfigHelper
    return this
  }

  withErrorHandling(config: Partial<ErrorHandlingConfigHelper>): this {
    this.config.errorHandling = config as ErrorHandlingConfigHelper
    return this
  }

  build(): typeof this.config {
    return this.config
  }
}