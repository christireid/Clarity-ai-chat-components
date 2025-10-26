/**
 * Model Adapter Types
 * 
 * Unified interface for AI model providers (OpenAI, Anthropic, Google, etc.)
 * Enables model-agnostic configuration and easy provider switching.
 */

export interface ModelConfig {
  /** Provider name */
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  /** Model identifier (e.g., 'gpt-4-turbo', 'claude-3-opus') */
  model: string
  /** API key for authentication */
  apiKey?: string
  /** Custom API base URL */
  baseURL?: string
  /** Temperature for randomness (0-2) */
  temperature?: number
  /** Maximum tokens to generate */
  maxTokens?: number
  /** Top-p sampling */
  topP?: number
  /** Frequency penalty */
  frequencyPenalty?: number
  /** Presence penalty */
  presencePenalty?: number
  /** Stop sequences */
  stop?: string[]
  /** Streaming options */
  streamOptions?: {
    /** Callback for each token */
    onToken?: (token: string) => void
    /** Callback for tool calls */
    onToolCall?: (tool: ToolCall) => void
    /** Callback for thinking steps */
    onThinking?: (step: string) => void
    /** Callback for citations */
    onCitation?: (citation: Citation) => void
  }
}

export interface ChatMessage {
  /** Message role */
  role: 'system' | 'user' | 'assistant'
  /** Message content (string or structured parts) */
  content: string | ContentPart[]
  /** Tool calls made by assistant */
  toolCalls?: ToolCall[]
  /** Citations/sources */
  citations?: Citation[]
  /** Message name (for function results) */
  name?: string
}

export interface ContentPart {
  /** Content part type */
  type: 'text' | 'image' | 'tool_result'
  /** Text content */
  text?: string
  /** Image URL */
  imageUrl?: string
  /** Tool call ID this result belongs to */
  toolCallId?: string
  /** Tool execution result */
  toolResult?: unknown
}

export interface ToolCall {
  /** Unique tool call ID */
  id: string
  /** Tool call type */
  type: 'function'
  /** Function details */
  function: {
    /** Function name */
    name: string
    /** Function arguments (JSON string) */
    arguments: string
  }
}

export interface Citation {
  /** Unique citation ID */
  id: string
  /** Source name/title */
  source: string
  /** Chunk of text cited */
  chunkText: string
  /** Confidence score (0-1) */
  confidence?: number
  /** Additional metadata */
  metadata?: Record<string, unknown>
  /** URL to source */
  url?: string
}

export interface StreamChunk {
  /** Chunk type */
  type: 'token' | 'tool_call' | 'thinking' | 'citation' | 'done' | 'error'
  /** Text content */
  content?: string
  /** Tool call data */
  toolCall?: ToolCall
  /** Thinking step description */
  thinkingStep?: string
  /** Citation data */
  citation?: Citation
  /** Token usage stats */
  usage?: TokenUsage
  /** Error message */
  error?: string
}

export interface TokenUsage {
  /** Tokens in prompt */
  promptTokens: number
  /** Tokens in completion */
  completionTokens: number
  /** Total tokens used */
  totalTokens: number
  /** Estimated cost in USD */
  estimatedCost?: number
}

export interface ModelAdapter {
  /** Adapter name */
  name: string
  
  /**
   * Send a chat completion request (non-streaming)
   */
  chat(
    messages: ChatMessage[],
    config: ModelConfig
  ): Promise<ChatMessage>
  
  /**
   * Stream a chat completion response
   */
  stream(
    messages: ChatMessage[],
    config: ModelConfig
  ): AsyncGenerator<StreamChunk, void, unknown>
  
  /**
   * Estimate cost for token usage
   */
  estimateCost(usage: TokenUsage, model: string): number
}

export interface ModelInfo {
  /** Model ID */
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
  /** Context window size */
  contextWindow: number
  /** Description */
  description?: string
  /** Supports streaming */
  streaming?: boolean
  /** Supports tool/function calling */
  toolCalling?: boolean
  /** Supports vision/images */
  vision?: boolean
}
