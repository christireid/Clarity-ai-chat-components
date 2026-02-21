/**
 * Advanced RAG Features
 *
 * Multi-turn conversation awareness, follow-up detection,
 * and contextual search refinement for better responses.
 */

import type { SearchResult } from './vectorStore'
import { generateEmbedding } from './embeddings'
import { getVectorStore } from './vectorStore'
import { rerankResults } from './rag'
import { logger } from '@/lib/logger'

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  sources?: SearchResult[]
}

export interface ConversationContext {
  /** Recent messages for context */
  recentMessages: ConversationMessage[]
  /** Previously discussed topics */
  discussedTopics: string[]
  /** Previously cited sources */
  citedSources: SearchResult[]
  /** Current conversation focus */
  currentTopic?: string
}

/**
 * Detect if a query is a follow-up question
 */
export function isFollowUpQuestion(
  query: string,
  conversationHistory: ConversationMessage[]
): boolean {
  if (conversationHistory.length === 0) {
    return false
  }

  const lowerQuery = query.toLowerCase()

  // Follow-up indicators
  const followUpPatterns = [
    /^(and|also|what about|how about)/i,
    /^(can you|could you) (explain|show|tell)/i,
    /(more|another) (example|detail|information)/i,
    /(that|this|it|these|those)/i,
    /^(yes|no|ok|sure),?\s/i,
    /follow[ -]?up/i,
    /instead/i,
    /differently/i,
    /alternative/i,
  ]

  // Pronouns that suggest reference to previous context
  const pronouns = ['it', 'this', 'that', 'these', 'those', 'them', 'they']
  const startsWithPronoun = pronouns.some(
    (p) => lowerQuery.startsWith(p + ' ') || lowerQuery.startsWith(p + '?')
  )

  // Very short questions are often follow-ups
  const isVeryShort = query.split(/\s+/).length <= 3

  return (
    followUpPatterns.some((pattern) => pattern.test(query)) ||
    startsWithPronoun ||
    (isVeryShort && conversationHistory.length > 0)
  )
}

/**
 * Extract key topics from conversation history
 */
export function extractTopics(messages: ConversationMessage[]): string[] {
  const topics = new Set<string>()

  // Common Clarity Chat topics/entities
  const entities = [
    'ChatWindow',
    'StreamingMessage',
    'TypingIndicator',
    'useChat',
    'useChatStream',
    'MessageList',
    'Avatar',
    'Attachment',
    'RAG',
    'streaming',
    'authentication',
    'styling',
    'theming',
    'hooks',
    'components',
  ]

  for (const message of messages) {
    const content = message.content.toLowerCase()

    // Extract mentioned entities
    for (const entity of entities) {
      if (content.includes(entity.toLowerCase())) {
        topics.add(entity)
      }
    }

    // Extract from cited sources
    if (message.sources) {
      for (const source of message.sources) {
        topics.add(source.category)
      }
    }
  }

  return Array.from(topics)
}

/**
 * Build conversation context from message history
 */
export function buildConversationContext(
  messages: ConversationMessage[],
  maxMessages = 5
): ConversationContext {
  // Get recent messages (exclude current)
  const recentMessages = messages.slice(-maxMessages)

  // Extract topics
  const discussedTopics = extractTopics(recentMessages)

  // Collect cited sources
  const citedSources: SearchResult[] = []
  for (const message of recentMessages) {
    if (message.sources) {
      citedSources.push(...message.sources)
    }
  }

  // Determine current topic (most recent assistant message sources)
  let currentTopic: string | undefined
  for (let i = recentMessages.length - 1; i >= 0; i--) {
    const msg = recentMessages[i]
    if (msg.role === 'assistant' && msg.sources && msg.sources.length > 0) {
      currentTopic = msg.sources[0].category
      break
    }
  }

  return {
    recentMessages,
    discussedTopics,
    citedSources,
    currentTopic,
  }
}

/**
 * Enhance query with conversation context for better retrieval
 */
export function enhanceQueryWithContext(
  query: string,
  context: ConversationContext
): string {
  const isFollowUp = isFollowUpQuestion(query, context.recentMessages)

  if (!isFollowUp || context.recentMessages.length === 0) {
    return query
  }

  // Get the last user question and assistant response
  const lastMessages = context.recentMessages.slice(-2)
  const lastUserMessage = lastMessages.find((m) => m.role === 'user')
  const lastAssistantMessage = lastMessages.find((m) => m.role === 'assistant')

  // Build enhanced query
  let enhancedQuery = query

  // Add context from previous question if it exists
  if (lastUserMessage) {
    // If current query is very short, prepend previous context
    if (query.split(/\s+/).length <= 3) {
      enhancedQuery = `${lastUserMessage.content} ${query}`
    } else {
      // Otherwise, add key topics
      const topics = extractTopics([lastUserMessage])
      if (topics.length > 0) {
        enhancedQuery = `${query} (context: ${topics.join(', ')})`
      }
    }
  }

  // Add current topic if available
  if (context.currentTopic && !enhancedQuery.includes(context.currentTopic)) {
    enhancedQuery += ` ${context.currentTopic}`
  }

  return enhancedQuery
}

/**
 * Re-rank results based on conversation context
 */
export function rerankWithConversationContext(
  query: string,
  results: SearchResult[],
  context: ConversationContext
): SearchResult[] {
  // First apply standard reranking
  let reranked = rerankResults(query, results)

  // Boost sources related to current topic
  if (context.currentTopic) {
    reranked = reranked.map((result) => ({
      ...result,
      score:
        result.category === context.currentTopic
          ? Math.min(result.score + 0.1, 1.0)
          : result.score,
    }))
  }

  // Boost sources that were previously cited (continuation of topic)
  const citedUrls = new Set(context.citedSources.map((s) => s.url))
  reranked = reranked.map((result) => ({
    ...result,
    score: citedUrls.has(result.url)
      ? Math.min(result.score + 0.05, 1.0)
      : result.score,
  }))

  // De-boost exact duplicates of recently cited sources
  // (avoid repetition unless score is very high)
  const recentlyShownUrls = new Set(
    context.recentMessages
      .flatMap((m) => m.sources || [])
      .slice(-5) // Last 5 sources
      .map((s) => s.url)
  )

  reranked = reranked.map((result) => ({
    ...result,
    score:
      recentlyShownUrls.has(result.url) && result.score < 0.9
        ? result.score * 0.9 // Slight penalty for repetition
        : result.score,
  }))

  // Re-sort by adjusted scores
  return reranked.sort((a, b) => b.score - a.score)
}

/**
 * Retrieve documents with conversation context awareness
 */
export async function retrieveWithContext(
  query: string,
  conversationHistory: ConversationMessage[],
  options: {
    topK?: number
    minScore?: number
    maxMessages?: number
  } = {}
): Promise<{
  results: SearchResult[]
  enhancedQuery: string
  isFollowUp: boolean
  context: ConversationContext
}> {
  const { topK = 5, minScore = 0.7, maxMessages = 5 } = options

  // Build conversation context
  const context = buildConversationContext(conversationHistory, maxMessages)

  // Check if this is a follow-up
  const isFollowUp = isFollowUpQuestion(query, context.recentMessages)

  // Enhance query with context
  const enhancedQuery = enhanceQueryWithContext(query, context)

  logger.debug(`Original query: "${query}"`)
  logger.debug(`Enhanced query: "${enhancedQuery}"`)
  logger.debug(`Is follow-up: ${isFollowUp}`)

  // Generate embedding for enhanced query
  const queryEmbedding = await generateEmbedding(enhancedQuery)

  // Search vector store
  const vectorStore = getVectorStore()
  await vectorStore.initialize()

  let results = await vectorStore.search(queryEmbedding, topK * 2) // Get more for reranking

  // Filter by minimum score
  results = results.filter((result) => result.score >= minScore)

  // Re-rank with conversation context
  results = rerankWithConversationContext(query, results, context)

  // Trim to topK
  results = results.slice(0, topK)

  return {
    results,
    enhancedQuery,
    isFollowUp,
    context,
  }
}

/**
 * Generate contextual system prompt that includes conversation awareness
 */
export function generateContextualSystemPrompt(
  basePrompt: string,
  context: ConversationContext,
  isFollowUp: boolean
): string {
  if (!isFollowUp || context.recentMessages.length === 0) {
    return basePrompt
  }

  // Add conversation awareness to the prompt
  let contextualPrompt = basePrompt + '\n\n## Conversation Context\n'

  if (context.currentTopic) {
    contextualPrompt += `Current topic: ${context.currentTopic}\n`
  }

  if (context.discussedTopics.length > 0) {
    contextualPrompt += `Previously discussed: ${context.discussedTopics.join(', ')}\n`
  }

  contextualPrompt += '\n**Important:** This is a follow-up question. '
  contextualPrompt +=
    'Reference the previous conversation context when relevant. '
  contextualPrompt +=
    'Use phrases like "as I mentioned earlier" or "building on that" when appropriate.\n'

  return contextualPrompt
}

/**
 * Format conversation history for context window
 */
export function formatConversationHistory(
  messages: ConversationMessage[],
  maxLength = 1000
): string {
  if (messages.length === 0) {
    return ''
  }

  let formatted = '## Recent Conversation\n\n'
  let currentLength = formatted.length

  // Start from most recent and work backwards
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    const role = msg.role === 'user' ? 'User' : 'Assistant'
    const snippet =
      msg.content.slice(0, 200) + (msg.content.length > 200 ? '...' : '')
    const entry = `**${role}:** ${snippet}\n\n`

    if (currentLength + entry.length > maxLength) {
      break
    }

    // Prepend (since we're going backwards)
    formatted = formatted.slice(0, formatted.length) + entry
    currentLength += entry.length
  }

  return formatted
}

/**
 * Detect topic shifts in conversation
 */
export function detectTopicShift(
  currentQuery: string,
  conversationHistory: ConversationMessage[]
): {
  hasShifted: boolean
  previousTopic?: string
  newTopic?: string
} {
  if (conversationHistory.length === 0) {
    return { hasShifted: false }
  }

  const context = buildConversationContext(conversationHistory)
  const currentTopics = extractTopics([{ role: 'user', content: currentQuery }])

  // No shift if same topic
  if (currentTopics.length > 0 && currentTopics[0] === context.currentTopic) {
    return { hasShifted: false, previousTopic: context.currentTopic }
  }

  // Topic shift detected
  if (
    context.currentTopic &&
    currentTopics.length > 0 &&
    currentTopics[0] !== context.currentTopic
  ) {
    return {
      hasShifted: true,
      previousTopic: context.currentTopic,
      newTopic: currentTopics[0],
    }
  }

  return { hasShifted: false }
}
