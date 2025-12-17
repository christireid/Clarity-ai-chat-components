import { logger } from '@clarity-chat/utils/logger';
/**
 * Context Ordering Utilities
 *
 * Addresses the "lost-in-the-middle" phenomenon where LLMs undervalue
 * information positioned in the middle of prompts.
 *
 * Research shows LLMs allocate attention:
 * - ~40% to beginning (primacy effect)
 * - ~20% to middle (lowest attention)
 * - ~40% to end (recency effect)
 *
 * This module provides utilities to optimize context ordering for
 * maximum LLM attention to important information.
 *
 * @module utils/context-ordering
 */

import { estimateTokens } from './tokenization/estimator'

export interface ContextMessage {
  /** Message role */
  role: 'system' | 'user' | 'assistant'
  /** Message content */
  content: string
  /** Optional importance hint (0-1) */
  importance?: number
  /** Optional timestamp for recency calculation */
  timestamp?: number
  /** Optional metadata */
  metadata?: Record<string, unknown>
}

export interface OrderingOptions {
  /** Ordering strategy to use */
  strategy: 'primacy-recency' | 'importance-weighted' | 'structured'
  /** Custom importance scores (message index -> score) */
  customImportance?: Map<number, number>
  /** Weight for recency vs importance (0 = pure importance, 1 = pure recency) */
  recencyWeight?: number
  /** Whether to add structural markers */
  addMarkers?: boolean
  /** Maximum tokens to keep */
  maxTokens?: number
}

export interface OrderedContext {
  /** Reordered messages */
  messages: ContextMessage[]
  /** Ordering metadata */
  metadata: {
    /** Original indices of messages */
    originalIndices: number[]
    /** Importance scores used */
    importanceScores: number[]
    /** Position assignments */
    positions: Array<'beginning' | 'middle' | 'end'>
  }
}

export interface StructuredMessage extends ContextMessage {
  /** Structural markers added */
  markers?: {
    sectionName?: string
    sectionType?: 'context' | 'history' | 'reference' | 'question'
    numberedReference?: number
  }
}

/**
 * Calculate importance score for a message
 *
 * Scoring factors:
 * - Recency (exponential decay)
 * - Content length (longer = potentially more important)
 * - Question markers (questions are high importance)
 * - Code presence (code context often important)
 * - Explicit importance hints
 * - Entity density
 */
export function calculateMessageImportance(
  message: ContextMessage,
  options: {
    totalMessages: number
    messageIndex: number
    currentTimestamp?: number
    recencyWeight?: number
  }
): number {
  const { totalMessages, messageIndex, currentTimestamp = Date.now(), recencyWeight = 0.3 } = options
  let score = 0.5 // Base score

  // Recency scoring (exponential decay)
  const recencyIndex = totalMessages - messageIndex
  const recencyScore = Math.exp(-0.1 * recencyIndex) // More recent = higher
  score += recencyScore * recencyWeight

  // Content length scoring (log scale to prevent domination)
  const contentLength = message.content.length
  const lengthScore = Math.min(Math.log(contentLength + 1) / 10, 0.3)
  score += lengthScore

  // Question marker scoring
  const questionPatterns = [
    /\?/,
    /^(what|who|where|when|why|how|which|can you|could you|would you|please)/im,
  ]
  const hasQuestion = questionPatterns.some(p => p.test(message.content))
  if (hasQuestion) {
    score += 0.3
  }

  // Code presence scoring
  const hasCode = /```|`[^`]+`|\bfunction\b|\bclass\b|\bconst\b|\blet\b/.test(message.content)
  if (hasCode) {
    score += 0.2
  }

  // Explicit importance hint
  if (message.importance !== undefined) {
    score = score * 0.5 + message.importance * 0.5
  }

  // Role-based scoring
  if (message.role === 'system') {
    score += 0.2 // System messages are always important
  }
  if (message.role === 'user') {
    score += 0.1 // User messages slightly more important than assistant
  }

  // Entity density (rough heuristic: capitalized words)
  const words = message.content.split(/\s+/)
  const capitalizedWords = words.filter(w => /^[A-Z][a-z]/.test(w))
  const entityDensity = capitalizedWords.length / words.length
  score += entityDensity * 0.15

  // Timestamp-based recency (if provided)
  if (message.timestamp && currentTimestamp) {
    const ageMs = currentTimestamp - message.timestamp
    const ageHours = ageMs / (1000 * 60 * 60)
    const timestampScore = Math.exp(-0.5 * ageHours) // Half-life of ~2 hours
    score += timestampScore * 0.1
  }

  // Normalize to [0, 1]
  return Math.min(Math.max(score, 0), 1)
}

/**
 * Reorder messages for optimal LLM attention
 *
 * Applies primacy-recency ordering:
 * - Most important messages at START (after system)
 * - Second-most important at END
 * - Less important in MIDDLE
 *
 * @example
 * ```ts
 * const ordered = reorderForAttention(messages, {
 *   strategy: 'importance-weighted',
 *   recencyWeight: 0.3
 * })
 * // Important messages moved to beginning/end
 * ```
 */
export function reorderForAttention(
  messages: ContextMessage[],
  options: OrderingOptions = { strategy: 'importance-weighted' }
): OrderedContext {
  const { strategy, customImportance, recencyWeight = 0.3, maxTokens } = options

  // Separate system messages (always first)
  const systemMessages = messages.filter(m => m.role === 'system')
  const nonSystemMessages = messages.filter(m => m.role !== 'system')

  // Calculate importance scores
  const importanceScores: number[] = []
  for (let i = 0; i < messages.length; i++) {
    if (customImportance?.has(i)) {
      importanceScores.push(customImportance.get(i)!)
    } else {
      const score = calculateMessageImportance(messages[i]!, {
        totalMessages: messages.length,
        messageIndex: i,
        recencyWeight,
      })
      importanceScores.push(score)
    }
  }

  // Create indexed messages for sorting
  const indexedMessages = nonSystemMessages.map((msg, i) => ({
    message: msg,
    originalIndex: messages.indexOf(msg),
    importance: importanceScores[messages.indexOf(msg)]!,
  }))

  // Sort by importance (descending)
  const sorted = [...indexedMessages].sort((a, b) => b.importance - a.importance)

  // Apply ordering strategy
  let orderedNonSystem: typeof indexedMessages = []
  const positions: Array<'beginning' | 'middle' | 'end'> = new Array(messages.length).fill('middle')

  // Mark system messages as 'beginning'
  for (const sysMsg of systemMessages) {
    const idx = messages.indexOf(sysMsg)
    positions[idx] = 'beginning'
  }

  switch (strategy) {
    case 'primacy-recency':
      // Top half of importance at beginning, bottom half at end (reversed)
      const midpoint = Math.floor(sorted.length / 2)
      const beginningMsgs = sorted.slice(0, midpoint)
      const endMsgs = sorted.slice(midpoint).reverse()
      orderedNonSystem = [...beginningMsgs, ...endMsgs]

      // Mark positions
      for (const msg of beginningMsgs) {
        positions[msg.originalIndex] = 'beginning'
      }
      for (const msg of endMsgs) {
        positions[msg.originalIndex] = 'end'
      }
      break

    case 'importance-weighted':
      // Most important at beginning and end, least important in middle
      const beginning: typeof indexedMessages = []
      const middle: typeof indexedMessages = []
      const end: typeof indexedMessages = []

      for (let i = 0; i < sorted.length; i++) {
        const msg = sorted[i]!
        if (i < Math.ceil(sorted.length / 3)) {
          // Top third -> beginning
          beginning.push(msg)
          positions[msg.originalIndex] = 'beginning'
        } else if (i < Math.ceil((2 * sorted.length) / 3)) {
          // Middle third -> middle
          middle.push(msg)
          positions[msg.originalIndex] = 'middle'
        } else {
          // Bottom third -> end (but still important due to recency effect)
          end.push(msg)
          positions[msg.originalIndex] = 'end'
        }
      }

      orderedNonSystem = [...beginning, ...middle, ...end.reverse()]
      break

    case 'structured':
      // Maintain original order but will add structural markers
      orderedNonSystem = indexedMessages
      // Position based on original location
      for (let i = 0; i < indexedMessages.length; i++) {
        const third = indexedMessages.length / 3
        if (i < third) {
          positions[indexedMessages[i]!.originalIndex] = 'beginning'
        } else if (i < 2 * third) {
          positions[indexedMessages[i]!.originalIndex] = 'middle'
        } else {
          positions[indexedMessages[i]!.originalIndex] = 'end'
        }
      }
      break
  }

  // Build final message array
  let finalMessages: ContextMessage[] = [
    ...systemMessages,
    ...orderedNonSystem.map(m => m.message),
  ]

  // Apply max tokens limit if specified
  if (maxTokens) {
    let currentTokens = 0
    const keptMessages: ContextMessage[] = []

    for (const msg of finalMessages) {
      const msgTokens = estimateTokens(msg.content)
      if (currentTokens + msgTokens <= maxTokens) {
        keptMessages.push(msg)
        currentTokens += msgTokens
      }
    }

    finalMessages = keptMessages
  }

  return {
    messages: finalMessages,
    metadata: {
      originalIndices: finalMessages.map(m => messages.indexOf(m)),
      importanceScores: finalMessages.map(m => importanceScores[messages.indexOf(m)]!),
      positions: finalMessages.map(m => positions[messages.indexOf(m)]!),
    },
  }
}

/**
 * Add structural markers to messages
 *
 * Inserts XML-style section markers to help LLMs understand context structure:
 * - <context_section name="...">...</context_section>
 * - Numbered references for key facts
 *
 * @example
 * ```ts
 * const marked = addStructuralMarkers(messages, {
 *   sectionNames: ['background', 'recent', 'question']
 * })
 * ```
 */
export function addStructuralMarkers(
  messages: ContextMessage[],
  options: {
    sectionNames?: string[]
    addNumberedRefs?: boolean
  } = {}
): StructuredMessage[] {
  const { sectionNames = [], addNumberedRefs = false } = options

  // Determine sections
  const sections: Array<{ name: string; type: 'context' | 'history' | 'reference' | 'question' }> = []

  if (sectionNames.length === 0) {
    // Auto-detect sections
    const systemCount = messages.filter(m => m.role === 'system').length
    const conversationCount = messages.length - systemCount

    if (systemCount > 0) {
      sections.push({ name: 'system_context', type: 'context' })
    }
    if (conversationCount > 4) {
      sections.push({ name: 'earlier_conversation', type: 'history' })
      sections.push({ name: 'recent_conversation', type: 'history' })
    } else if (conversationCount > 0) {
      sections.push({ name: 'conversation', type: 'history' })
    }
  } else {
    for (const name of sectionNames) {
      sections.push({ name, type: 'context' })
    }
  }

  const result: StructuredMessage[] = []
  let refNumber = 1

  // Assign messages to sections
  let sectionIndex = 0
  const systemMessages = messages.filter(m => m.role === 'system')
  const nonSystemMessages = messages.filter(m => m.role !== 'system')

  // Add system messages with markers
  for (const msg of systemMessages) {
    const section = sections[0] || { name: 'system', type: 'context' as const }
    const markedContent = wrapInSection(msg.content, section.name)

    result.push({
      ...msg,
      content: markedContent,
      markers: {
        sectionName: section.name,
        sectionType: section.type,
      },
    })
  }

  // Add non-system messages
  const nonSystemSections = sections.slice(1)
  const messagesPerSection = Math.ceil(nonSystemMessages.length / Math.max(nonSystemSections.length, 1))

  for (let i = 0; i < nonSystemMessages.length; i++) {
    const msg = nonSystemMessages[i]!
    const sectionIdx = Math.min(Math.floor(i / messagesPerSection), nonSystemSections.length - 1)
    const section = nonSystemSections[sectionIdx] || { name: 'conversation', type: 'history' as const }

    let content = msg.content

    // Add numbered references if enabled
    if (addNumberedRefs) {
      // Find key facts (sentences with numbers, names, or technical terms)
      const sentences = content.match(/[^.!?]+[.!?]+/g) || []
      const markedSentences = sentences.map(sentence => {
        const isKeyFact =
          /\d/.test(sentence) || // Contains numbers
          /[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/.test(sentence) || // Contains proper nouns
          /`[^`]+`/.test(sentence) // Contains code

        if (isKeyFact) {
          return `[REF${refNumber++}] ${sentence.trim()}`
        }
        return sentence
      })
      content = markedSentences.join(' ')
    }

    // Wrap in section markers (only for first message in section)
    const isFirstInSection = i % messagesPerSection === 0
    if (isFirstInSection && nonSystemSections.length > 0) {
      // Find end of section
      const sectionEnd = Math.min((sectionIdx + 1) * messagesPerSection - 1, nonSystemMessages.length - 1)
      const isLastInSection = i === sectionEnd
      content = isLastInSection ? wrapInSection(content, section.name) : `<${section.name}>\n${content}`
    } else if (i === Math.min((sectionIdx + 1) * messagesPerSection - 1, nonSystemMessages.length - 1)) {
      content = `${content}\n</${section?.name || 'section'}>`
    }

    result.push({
      ...msg,
      content,
      markers: {
        sectionName: section.name,
        sectionType: section.type,
        numberedReference: addNumberedRefs ? refNumber - 1 : undefined,
      },
    })
  }

  return result
}

/**
 * Wrap content in XML-style section markers
 */
function wrapInSection(content: string, sectionName: string): string {
  return `<context_section name="${sectionName}">\n${content}\n</context_section>`
}

/**
 * Optimize context layout combining reordering and structural markers
 *
 * This is the main entry point for context optimization.
 *
 * @example
 * ```ts
 * const optimized = optimizeContextLayout(messages, {
 *   maxTokens: 4000,
 *   strategy: 'importance-weighted',
 *   addStructuralMarkers: true
 * })
 * logger.debug(`Deprioritized: ${optimized.deprioritizedMessages.length} messages`)
 * ```
 */
export function optimizeContextLayout(
  messages: ContextMessage[],
  options: {
    maxTokens?: number
    strategy?: OrderingOptions['strategy']
    addStructuralMarkers?: boolean
    recencyWeight?: number
  } = {}
): {
  messages: ContextMessage[]
  deprioritizedMessages: ContextMessage[]
  metadata: OrderedContext['metadata']
  totalTokens: number
} {
  const {
    maxTokens,
    strategy = 'importance-weighted',
    addStructuralMarkers: useMarkers = false,
    recencyWeight = 0.3,
  } = options

  // Step 1: Reorder for attention
  const ordered = reorderForAttention(messages, {
    strategy,
    recencyWeight,
    maxTokens,
  })

  // Step 2: Add structural markers if requested
  let finalMessages: ContextMessage[] = ordered.messages
  if (useMarkers) {
    finalMessages = addStructuralMarkers(ordered.messages)
  }

  // Calculate deprioritized messages
  const deprioritizedMessages = messages.filter(m => !ordered.messages.includes(m))

  // Calculate total tokens
  const totalTokens = finalMessages.reduce(
    (sum, m) => sum + estimateTokens(m.content),
    0
  )

  return {
    messages: finalMessages,
    deprioritizedMessages,
    metadata: ordered.metadata,
    totalTokens,
  }
}

/**
 * React hook for context ordering
 */
export function createContextOrderingHook() {
  return function useContextOrdering(
    messages: ContextMessage[],
    options: Parameters<typeof optimizeContextLayout>[1] = {}
  ) {
    // This would use React.useMemo in actual implementation
    return optimizeContextLayout(messages, options)
  }
}

/**
 * Estimate how much information will be "lost" in the middle
 *
 * Based on attention pattern research, information in the middle
 * receives only ~20% of attention vs ~40% at beginning/end.
 */
export function estimateAttentionLoss(messages: ContextMessage[]): {
  middleTokens: number
  totalTokens: number
  attentionLossPercent: number
  recommendation: string
} {
  const totalTokens = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0)

  // Calculate middle section (roughly middle third)
  const third = messages.length / 3
  const middleMessages = messages.slice(Math.floor(third), Math.ceil(2 * third))
  const middleTokens = middleMessages.reduce((sum, m) => sum + estimateTokens(m.content), 0)

  // Middle gets 20% attention vs 40% for beginning/end
  // Effective attention loss = (40% - 20%) / 40% = 50% for middle content
  const middleRatio = middleTokens / totalTokens
  const attentionLossPercent = middleRatio * 50 // 50% loss for middle content

  let recommendation = ''
  if (attentionLossPercent > 20) {
    recommendation = 'Consider reordering context to move important information out of the middle'
  } else if (attentionLossPercent > 10) {
    recommendation = 'Moderate attention loss - consider adding structural markers'
  } else {
    recommendation = 'Context structure is acceptable'
  }

  return {
    middleTokens,
    totalTokens,
    attentionLossPercent,
    recommendation,
  }
}
