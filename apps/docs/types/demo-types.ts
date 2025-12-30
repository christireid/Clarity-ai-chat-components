/**
 * Shared Demo Types
 *
 * This file consolidates type definitions used across documentation demo pages.
 * These types mirror library internal types that are not publicly exported.
 *
 * When types are exported from the library in the future, this file should
 * be updated to re-export from the library instead.
 *
 * @see https://github.com/clarity-chat/components/issues/XXX (Type exports tracking)
 */

// Types that ARE exported from the library - re-export for convenience
export type { MessageAttachment } from '@clarity-chat/types'

/**
 * Tool call structure matching OpenAI function call format.
 * Used by StreamingMessage, ToolInvocationCard, and related components.
 *
 * @internal Mirrors @clarity-chat/react/src/adapters/types.ts#ToolCall
 */
export interface ToolCall {
  /** Unique tool call ID */
  id: string
  /** Tool call type - always 'function' for OpenAI format */
  type: 'function'
  /** Function details */
  function: {
    /** Function name */
    name: string
    /** Function arguments as JSON string */
    arguments: string
  }
}

/**
 * Citation/source reference for AI responses.
 * Used by StreamingMessage for RAG-based responses.
 *
 * @internal Mirrors @clarity-chat/react/src/adapters/types.ts#Citation
 */
export interface Citation {
  /** Unique citation ID */
  id: string
  /** Source name/title */
  source: string
  /** Chunk of text cited */
  chunkText: string
  /** Confidence score (0-1) */
  confidence?: number
  /** URL to source */
  url?: string
}

/**
 * AI model information for model selector.
 * Includes capability ratings and provider info.
 *
 * @internal Mirrors @clarity-chat/react/src/adapters/types.ts#ModelInfo
 */
export interface ModelInfo {
  /** Model ID (e.g., 'gpt-4-turbo', 'claude-3-opus') */
  id: string
  /** Display name */
  name: string
  /** Provider */
  provider: 'openai' | 'anthropic' | 'google'
  /** Speed rating */
  speed: 'fast' | 'medium' | 'slow'
  /** Cost rating */
  cost: 'low' | 'medium' | 'high'
  /** Quality rating */
  quality: 'good' | 'excellent' | 'best'
  /** Context window size in tokens */
  contextWindow: number
  /** Model description */
  description?: string
  /** Maximum output tokens */
  maxTokens?: number
  /** Supports vision/images */
  vision?: boolean
  /** Supports tool/function calling */
  toolCalling?: boolean
  /** Supports streaming */
  streaming?: boolean
}

/**
 * Agent run step for AgentRunFeed component.
 * Represents a single step in an agent's execution.
 *
 * @internal Mirrors @clarity-chat/react/src/components/ai/agent-run-feed.tsx#AgentRunStep
 */
export interface AgentRunStep {
  /** Unique step ID */
  id: string
  /** Step title/description */
  title: string
  /** Detailed information */
  detail?: string
  /** Step status */
  status: 'pending' | 'running' | 'succeeded' | 'failed'
  /** Tool being used (if any) */
  tool?: string
  /** When the step started */
  startedAt: Date
  /** When the step completed */
  completedAt?: Date
  /** Preview of the output */
  outputPreview?: string
}

/**
 * Token optimization metrics for dashboard.
 * Tracks savings across different optimization strategies.
 *
 * @internal Mirrors @clarity-chat/react/src/components/token/token-optimization-dashboard.tsx#OptimizationMetrics
 */
export interface OptimizationMetrics {
  /** Total tokens processed */
  totalTokens: number
  /** Tokens saved through optimization */
  tokensSaved: number
  /** Cost saved in USD */
  costSaved: number
  /** Overall savings percentage */
  savingsPercent: number
  /** Breakdown by optimization strategy */
  breakdown: {
    /** Prompt compression savings */
    promptCompression: {
      tokens: number
      percent: number
    }
    /** Cache hit savings */
    caching: {
      hits: number
      savings: number
    }
    /** Model routing savings (using cheaper models when appropriate) */
    modelRouting: {
      savings: number
      percent: number
    }
    /** Response length limiting */
    responseLimiting: {
      tokens: number
      percent: number
    }
    /** Request batching savings */
    batching: {
      requests: number
      savings: number
    }
    /** Rate limiting/throttling savings */
    throttling: {
      callsSaved: number
    }
    /** Context referencing instead of repeating */
    referencing: {
      bytesSaved: number
      percent: number
    }
  }
}

/**
 * Saved prompt template for AdvancedChatInput.
 *
 * @internal Mirrors internal SavedPrompt type
 */
export interface SavedPrompt {
  /** Unique prompt ID */
  id: string
  /** Prompt label */
  label: string
  /** Prompt template text */
  template: string
  /** Category for organization */
  category?: string
  /** Keyboard shortcut */
  shortcut?: string
}

/**
 * Command item for CommandPalette.
 *
 * @internal Mirrors CommandItem type from command-palette
 */
export interface CommandItem {
  /** Unique command ID */
  id: string
  /** Display label */
  label: string
  /** Command category for grouping */
  category: string
  /** Keyboard shortcut keys */
  shortcut?: string[]
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Command handler */
  action: () => void
}

/**
 * Input suggestion for AdvancedChatInput autocomplete.
 *
 * @internal Mirrors InputSuggestion type
 */
export interface InputSuggestion {
  /** Unique suggestion ID */
  id: string
  /** Suggestion text */
  text: string
  /** Optional description */
  description?: string
}

/**
 * Message for chat demos.
 * Extends the base message with demo-specific fields.
 */
export interface DemoMessage {
  /** Unique message ID */
  id: string
  /** Message role */
  role: 'user' | 'assistant' | 'system'
  /** Message content */
  content: string
  /** Chat session ID */
  chatId: string
  /** Current status */
  status: 'pending' | 'streaming' | 'complete' | 'error'
  /** Creation timestamp */
  createdAt: Date
  /** Last update timestamp */
  updatedAt: Date
  /** Optional attachments */
  attachments?: import('@clarity-chat/types').MessageAttachment[]
  /** Optional tool calls */
  toolCalls?: ToolCall[]
  /** Optional citations */
  citations?: Citation[]
}
