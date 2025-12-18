/**
 * Conversation-Aware RAG
 *
 * High-level interface for RAG with conversation context awareness.
 * Integrates multi-turn context, follow-up detection, and contextual reranking.
 */

import {
  retrieveWithContext,
  buildConversationContext,
  generateContextualSystemPrompt,
  detectTopicShift,
  formatConversationHistory,
  type ConversationMessage,
  type ConversationContext,
} from './advancedRAG'
import { buildContext, formatCitations, type Citation } from './rag'
import type { SearchResult } from './vectorStore'

export interface ConversationAwareRAGOptions {
  /** Conversation history for context */
  conversationHistory?: ConversationMessage[]
  /** Number of documents to retrieve */
  topK?: number
  /** Minimum similarity score */
  minScore?: number
  /** Maximum context length in characters */
  maxContextLength?: number
  /** Maximum conversation messages to consider */
  maxConversationMessages?: number
  /** Base system prompt */
  baseSystemPrompt?: string
  /** Current page path */
  currentPath?: string
}

export interface ConversationAwareRAGResult {
  /** Retrieved and ranked sources */
  sources: SearchResult[]
  /** Formatted context for LLM */
  context: string
  /** Complete system prompt with context */
  systemPrompt: string
  /** Enhanced user message */
  enhancedMessage: string
  /** Citations for UI display */
  citations: Citation[]
  /** Whether this was detected as a follow-up */
  isFollowUp: boolean
  /** Conversation context used */
  conversationContext: ConversationContext
  /** Whether a topic shift was detected */
  topicShift?: {
    hasShifted: boolean
    previousTopic?: string
    newTopic?: string
  }
  /** Metadata about the retrieval */
  metadata: {
    originalQuery: string
    enhancedQuery: string
    sourcesFound: number
    conversationMessagesUsed: number
  }
}

/**
 * Perform conversation-aware RAG retrieval
 */
export async function conversationAwareRAG(
  userQuery: string,
  options: ConversationAwareRAGOptions = {}
): Promise<ConversationAwareRAGResult> {
  const {
    conversationHistory = [],
    topK = 5,
    minScore = 0.7,
    maxContextLength = 4000,
    maxConversationMessages = 5,
    baseSystemPrompt = '',
    currentPath = '/',
  } = options

  // Detect topic shift
  const topicShift = detectTopicShift(userQuery, conversationHistory)

  if (topicShift.hasShifted) {
    logger.debug(`📊 Topic shift detected: ${topicShift.previousTopic} → ${topicShift.newTopic}`)
  }

  // Retrieve with conversation context
  const {
    results: sources,
    enhancedQuery,
    isFollowUp,
    context: conversationContext,
  } = await retrieveWithContext(userQuery, conversationHistory, {
    topK,
    minScore,
    maxMessages: maxConversationMessages,
  })

  logger.debug(`🔍 Retrieved ${sources.length} sources (follow-up: ${isFollowUp})`)

  // Build documentation context
  const docContext = buildContext(sources, maxContextLength)

  // Build conversation history context
  const conversationHistoryText = formatConversationHistory(
    conversationContext.recentMessages,
    Math.floor(maxContextLength * 0.2) // Use 20% of context for conversation
  )

  // Combine contexts
  let combinedContext = ''

  if (conversationHistoryText) {
    combinedContext += conversationHistoryText + '\n\n'
  }

  combinedContext += docContext

  // Generate contextual system prompt
  const systemPrompt = generateContextualSystemPrompt(
    baseSystemPrompt,
    conversationContext,
    isFollowUp
  )

  // Format citations
  const citations = formatCitations(sources)

  // Build enhanced message
  let enhancedMessage = `User Question: ${userQuery}\n\n`

  if (isFollowUp && conversationContext.currentTopic) {
    enhancedMessage += `**Context:** This is a follow-up question about ${conversationContext.currentTopic}.\n\n`
  }

  if (sources.length > 0) {
    enhancedMessage += `I found ${sources.length} relevant documentation sections:\n\n`
    enhancedMessage += combinedContext
    enhancedMessage += '\n\nPlease provide a helpful answer based on the documentation above. '

    if (isFollowUp) {
      enhancedMessage += 'Reference our previous discussion where appropriate. '
    }

    enhancedMessage += 'Include code examples and links to relevant pages.\n'
  } else {
    enhancedMessage += 'No specific documentation found. '
    enhancedMessage += 'Please provide a general answer or suggest where to find this information.\n'
  }

  return {
    sources,
    context: combinedContext,
    systemPrompt,
    enhancedMessage,
    citations,
    isFollowUp,
    conversationContext,
    topicShift,
    metadata: {
      originalQuery: userQuery,
      enhancedQuery,
      sourcesFound: sources.length,
      conversationMessagesUsed: conversationContext.recentMessages.length,
    },
  }
}

/**
 * Convert chat messages to ConversationMessage format
 */
export function convertToChatHistory(
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp?: string
  }>
): ConversationMessage[] {
  return messages
    .filter(m => m.role !== 'system') // Exclude system messages
    .map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
      timestamp: m.timestamp,
    }))
}

/**
 * Simplified helper for common use case
 */
export async function enhanceWithConversation(
  userQuery: string,
  chatHistory: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<{
  enhancedMessage: string
  systemPrompt: string
  citations: Citation[]
  isFollowUp: boolean
}> {
  const conversationHistory = convertToChatHistory(
    chatHistory as Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  )

  const result = await conversationAwareRAG(userQuery, {
    conversationHistory,
    baseSystemPrompt: systemPrompt,
  })

  return {
    enhancedMessage: result.enhancedMessage,
    systemPrompt: result.systemPrompt,
    citations: result.citations,
    isFollowUp: result.isFollowUp,
  }
}

/**
 * Get conversation insights for analytics/debugging
 */
export function getConversationInsights(
  conversationHistory: ConversationMessage[]
): {
  messageCount: number
  userMessages: number
  assistantMessages: number
  topics: string[]
  averageMessageLength: number
  hasFollowUps: boolean
} {
  const context = buildConversationContext(conversationHistory, 100)

  const userMessages = conversationHistory.filter(m => m.role === 'user').length
  const assistantMessages = conversationHistory.filter(m => m.role === 'assistant').length

  const totalLength = conversationHistory.reduce((sum, m) => sum + m.content.length, 0)
  const averageMessageLength = conversationHistory.length > 0
    ? Math.round(totalLength / conversationHistory.length)
    : 0

  return {
    messageCount: conversationHistory.length,
    userMessages,
    assistantMessages,
    topics: context.discussedTopics,
    averageMessageLength,
    hasFollowUps: conversationHistory.some((_, i, arr) =>
      i > 0 // At least one previous message
    ),
  }
}
