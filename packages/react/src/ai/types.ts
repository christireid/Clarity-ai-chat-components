/**
 * AI Types
 * 
 * Type definitions for AI features
 */

/**
 * Suggestion types
 */
export type SuggestionType = 'quick-reply' | 'completion' | 'prompt' | 'command'

/**
 * Suggestion object
 */
export interface Suggestion {
  /**
   * Unique ID
   */
  id: string
  
  /**
   * Suggestion type
   */
  type: SuggestionType
  
  /**
   * Display text
   */
  text: string
  
  /**
   * Optional description
   */
  description?: string
  
  /**
   * Optional icon
   */
  icon?: React.ReactNode
  
  /**
   * Confidence score (0-1)
   */
  confidence?: number
  
  /**
   * Additional metadata
   */
  metadata?: Record<string, any>
}

/**
 * Suggestion provider function
 */
export type SuggestionProvider = (context: SuggestionContext) => Promise<Suggestion[]> | Suggestion[]

/**
 * Context for generating suggestions
 */
export interface SuggestionContext {
  /**
   * Current input text
   */
  input: string
  
  /**
   * Cursor position in input
   */
  cursorPosition?: number
  
  /**
   * Previous messages in conversation
   */
  messages?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  
  /**
   * User preferences
   */
  userPreferences?: Record<string, any>
  
  /**
   * Additional context
   */
  context?: Record<string, any>
}

/**
 * Content moderation result
 */
export interface ModerationResult {
  /**
   * Whether content is flagged
   */
  flagged: boolean
  
  /**
   * Reasons for flagging
   */
  reasons: string[]
  
  /**
   * Confidence scores by category
   */
  scores?: {
    profanity?: number
    toxicity?: number
    spam?: number
    pii?: number
    [key: string]: number | undefined
  }
  
  /**
   * Suggested action
   */
  action: 'allow' | 'warn' | 'block'
  
  /**
   * Additional details
   */
  details?: Record<string, any>
}

/**
 * Moderation provider function
 */
export type ModerationProvider = (content: string, context?: ModerationContext) => Promise<ModerationResult> | ModerationResult

/**
 * Context for content moderation
 */
export interface ModerationContext {
  /**
   * User ID (for personalization)
   */
  userId?: string
  
  /**
   * Type of content
   */
  contentType?: 'message' | 'file' | 'image' | 'url'
  
  /**
   * Additional context
   */
  context?: Record<string, any>
}

/**
 * Sentiment analysis result
 */
export interface SentimentResult {
  /**
   * Overall sentiment
   */
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed'
  
  /**
   * Confidence score (0-1)
   */
  confidence: number
  
  /**
   * Detailed scores
   */
  scores: {
    positive: number
    negative: number
    neutral: number
  }
  
  /**
   * Detected emotions
   */
  emotions?: string[]
  
  /**
   * Detected topics
   */
  topics?: string[]
}

/**
 * Sentiment analyzer function
 */
export type SentimentAnalyzer = (text: string) => Promise<SentimentResult> | SentimentResult

/**
 * AI feature configuration
 */
export interface AIConfig {
  /**
   * Enable suggestions
   */
  enableSuggestions?: boolean
  
  /**
   * Enable content moderation
   */
  enableModeration?: boolean
  
  /**
   * Enable sentiment analysis
   */
  enableSentiment?: boolean
  
  /**
   * Suggestion providers
   */
  suggestionProviders?: SuggestionProvider[]
  
  /**
   * Moderation provider
   */
  moderationProvider?: ModerationProvider
  
  /**
   * Sentiment analyzer
   */
  sentimentAnalyzer?: SentimentAnalyzer
  
  /**
   * Debug mode
   */
  debug?: boolean
}
