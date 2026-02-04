/**
 * Conversation Context Manager
 *
 * Manages multi-turn conversation context for improved query understanding:
 * - Coreference resolution (pronouns, "it", "this", "that")
 * - Context carryover between turns
 * - Topic tracking
 * - Entity persistence
 * - Conversation state management
 *
 * Enables natural follow-up questions and contextual understanding.
 *
 * @module conversation-context-manager
 * @version 1.0.0
 */

import { ClassifiedIntent, QueryEntity } from './query-intent-classifier'

// ============================================================================
// Types
// ============================================================================

export interface ConversationTurn {
  /** Turn ID */
  id: string
  /** User query */
  query: string
  /** Classified intent */
  intent: ClassifiedIntent
  /** AI response */
  response?: string
  /** Timestamp */
  timestamp: number
  /** Entities mentioned in this turn */
  entities: {
    type: QueryEntity
    value: string
    /** Is this entity still active in conversation? */
    active: boolean
  }[]
  /** Main topic of this turn */
  topic?: string
}

export interface ConversationContext {
  /** Conversation ID */
  id: string
  /** All turns in this conversation */
  turns: ConversationTurn[]
  /** Currently active entities across all turns */
  activeEntities: Map<QueryEntity, string[]>
  /** Current topic thread */
  currentTopic?: string
  /** Topic history */
  topicHistory: string[]
  /** Conversation metadata */
  metadata: {
    startTime: number
    lastUpdateTime: number
    turnCount: number
    /** Domain detected from conversation */
    domain?: 'react' | 'typescript' | 'ai' | 'general'
    /** User skill level inferred from conversation */
    skillLevel?: 'beginner' | 'intermediate' | 'advanced'
  }
}

export interface ResolvedQuery {
  /** Original query */
  original: string
  /** Query with resolved references */
  resolved: string
  /** Entities carried over from previous turns */
  carriedOverEntities: {
    type: QueryEntity
    value: string
    fromTurn: number
  }[]
  /** Context summary from previous turns */
  contextSummary: string
  /** Whether this query continues previous topic */
  continuesTopic: boolean
}

// ============================================================================
// Context Manager Class
// ============================================================================

export class ConversationContextManager {
  private contexts: Map<string, ConversationContext> = new Map()
  private maxTurnsToKeep = 10 // Keep last 10 turns for context
  private entityDecayTurns = 3 // Entity stays active for 3 turns

  /**
   * Create or get conversation context
   */
  getOrCreateContext(conversationId: string): ConversationContext {
    if (!this.contexts.has(conversationId)) {
      this.contexts.set(conversationId, {
        id: conversationId,
        turns: [],
        activeEntities: new Map(),
        topicHistory: [],
        metadata: {
          startTime: Date.now(),
          lastUpdateTime: Date.now(),
          turnCount: 0,
        },
      })
    }

    return this.contexts.get(conversationId)!
  }

  /**
   * Add a turn to the conversation
   */
  addTurn(
    conversationId: string,
    query: string,
    intent: ClassifiedIntent,
    response?: string
  ): ConversationTurn {
    const context = this.getOrCreateContext(conversationId)

    // Extract entities from intent
    const entities = intent.entities.map((e) => ({
      type: e.type,
      value: e.value,
      active: true,
    }))

    // Detect topic
    const topic = this.detectTopic(query, intent, context)

    // Create turn
    const turn: ConversationTurn = {
      id: `${conversationId}-${context.turns.length}`,
      query,
      intent,
      response,
      timestamp: Date.now(),
      entities,
      topic,
    }

    // Add to context
    context.turns.push(turn)
    context.metadata.lastUpdateTime = Date.now()
    context.metadata.turnCount++

    // Update active entities
    this.updateActiveEntities(context)

    // Update topic
    if (topic && topic !== context.currentTopic) {
      if (context.currentTopic) {
        context.topicHistory.push(context.currentTopic)
      }
      context.currentTopic = topic
    }

    // Update metadata
    this.updateContextMetadata(context)

    // Cleanup old turns
    this.cleanupOldTurns(context)

    return turn
  }

  /**
   * Resolve query references using conversation context
   */
  resolveQuery(conversationId: string, query: string, intent: ClassifiedIntent): ResolvedQuery {
    const context = this.getOrCreateContext(conversationId)

    if (context.turns.length === 0) {
      // First turn, no resolution needed
      return {
        original: query,
        resolved: query,
        carriedOverEntities: [],
        contextSummary: '',
        continuesTopic: false,
      }
    }

    // Resolve coreferences
    const resolved = this.resolveCoreferences(query, context)

    // Get carried over entities
    const carriedOverEntities = this.getCarriedOverEntities(context)

    // Generate context summary
    const contextSummary = this.generateContextSummary(context)

    // Check if continues topic
    const continuesTopic = this.checkTopicContinuity(query, intent, context)

    return {
      original: query,
      resolved,
      carriedOverEntities,
      contextSummary,
      continuesTopic,
    }
  }

  /**
   * Get conversation history for RAG context
   */
  getConversationHistory(conversationId: string, maxTurns: number = 3): string {
    const context = this.contexts.get(conversationId)
    if (!context || context.turns.length === 0) {
      return ''
    }

    const recentTurns = context.turns.slice(-maxTurns)
    const history = recentTurns
      .map((turn, index) => {
        const turnNum = context.turns.length - maxTurns + index + 1
        return `Turn ${turnNum}:\nUser: ${turn.query}\nAssistant: ${turn.response || '(no response)'}`.trim()
      })
      .join('\n\n')

    return `## Previous Conversation\n\n${history}`
  }

  /**
   * Clear conversation context
   */
  clearContext(conversationId: string): void {
    this.contexts.delete(conversationId)
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Resolve coreferences (it, this, that, etc.)
   */
  private resolveCoreferences(query: string, context: ConversationContext): string {
    let resolved = query

    // Get recent entities
    const recentEntities = this.getRecentEntities(context, 2)

    // Patterns to resolve
    const patterns = [
      { regex: /\b(it|this|that)\b/gi, entityTypes: ['component', 'hook', 'concept'] },
      { regex: /\b(them|these|those)\b/gi, entityTypes: ['component', 'hook', 'concept'] },
      { regex: /\bthe (component|hook|function)\b/gi, entityTypes: ['component', 'hook'] },
    ]

    for (const { regex, entityTypes } of patterns) {
      const matches = resolved.match(regex)
      if (!matches) continue

      // Find most recent entity of matching type
      for (const match of matches) {
        for (const type of entityTypes) {
          const entity = recentEntities.find((e) => e.type === type)
          if (entity) {
            // Replace pronoun with entity
            const replacement = entityTypes.includes('component')
              ? `the ${entity.value} component`
              : entity.value
            resolved = resolved.replace(new RegExp(match, 'gi'), replacement)
            break
          }
        }
      }
    }

    // Handle "previous" references
    if (resolved.match(/\b(previous|last|earlier)\b/i) && context.turns.length > 0) {
      const lastTurn = context.turns[context.turns.length - 1]
      resolved += ` (referring to: ${lastTurn.topic || lastTurn.query})`
    }

    return resolved
  }

  /**
   * Get recent entities from context
   */
  private getRecentEntities(
    context: ConversationContext,
    maxTurns: number = 3
  ): { type: QueryEntity; value: string; turnIndex: number }[] {
    const entities: { type: QueryEntity; value: string; turnIndex: number }[] = []
    const recentTurns = context.turns.slice(-maxTurns)

    for (let i = recentTurns.length - 1; i >= 0; i--) {
      const turn = recentTurns[i]
      for (const entity of turn.entities) {
        if (entity.active) {
          entities.push({
            type: entity.type,
            value: entity.value,
            turnIndex: context.turns.length - maxTurns + i,
          })
        }
      }
    }

    return entities
  }

  /**
   * Update active entities based on recency
   */
  private updateActiveEntities(context: ConversationContext): void {
    context.activeEntities.clear()

    // Get entities from recent turns
    const recentTurns = context.turns.slice(-this.entityDecayTurns)

    for (const turn of recentTurns) {
      for (const entity of turn.entities) {
        if (!context.activeEntities.has(entity.type)) {
          context.activeEntities.set(entity.type, [])
        }
        const entities = context.activeEntities.get(entity.type)!
        if (!entities.includes(entity.value)) {
          entities.push(entity.value)
        }
      }
    }
  }

  /**
   * Detect topic from query
   */
  private detectTopic(
    query: string,
    intent: ClassifiedIntent,
    context: ConversationContext
  ): string | undefined {
    // Extract main entity as topic
    const mainEntity = intent.entities.find(
      (e) => e.type === 'component' || e.type === 'hook' || e.type === 'concept'
    )

    if (mainEntity) {
      return mainEntity.value
    }

    // Use intent focus as topic
    if (intent.focus && intent.focus !== query) {
      return intent.focus
    }

    // Continue previous topic if query is short and conversational
    if (query.split(/\s+/).length < 5 && context.currentTopic) {
      return context.currentTopic
    }

    return undefined
  }

  /**
   * Get entities carried over from previous turns
   */
  private getCarriedOverEntities(
    context: ConversationContext
  ): ResolvedQuery['carriedOverEntities'] {
    const carried: ResolvedQuery['carriedOverEntities'] = []

    // Get entities from recent turns
    const recentTurns = context.turns.slice(-3)

    for (let i = 0; i < recentTurns.length; i++) {
      const turn = recentTurns[i]
      const turnIndex = context.turns.length - 3 + i

      for (const entity of turn.entities) {
        if (entity.active) {
          carried.push({
            type: entity.type,
            value: entity.value,
            fromTurn: turnIndex,
          })
        }
      }
    }

    return carried
  }

  /**
   * Generate context summary from recent turns
   */
  private generateContextSummary(context: ConversationContext): string {
    if (context.turns.length === 0) return ''

    const summaryParts: string[] = []

    // Current topic
    if (context.currentTopic) {
      summaryParts.push(`Current topic: ${context.currentTopic}`)
    }

    // Active entities
    const entitySummaries: string[] = []
    for (const [type, values] of context.activeEntities.entries()) {
      if (values.length > 0) {
        entitySummaries.push(`${type}: ${values.join(', ')}`)
      }
    }
    if (entitySummaries.length > 0) {
      summaryParts.push(`Active entities: ${entitySummaries.join('; ')}`)
    }

    // Recent intents
    const recentIntents = context.turns.slice(-3).map((t) => t.intent.primary)
    if (recentIntents.length > 0) {
      summaryParts.push(`Recent intents: ${recentIntents.join(' → ')}`)
    }

    return summaryParts.join('\n')
  }

  /**
   * Check if query continues previous topic
   */
  private checkTopicContinuity(
    query: string,
    intent: ClassifiedIntent,
    context: ConversationContext
  ): boolean {
    if (!context.currentTopic) return false

    // Check for explicit continuation words
    const continuationWords = /^(and|also|additionally|furthermore|moreover|what about|how about)/i
    if (continuationWords.test(query)) return true

    // Check for pronouns suggesting continuation
    const pronouns = /\b(it|this|that|them|these|those)\b/i
    if (pronouns.test(query)) return true

    // Check if current topic is mentioned
    if (query.toLowerCase().includes(context.currentTopic.toLowerCase())) return true

    // Check if any active entities are mentioned
    for (const entities of context.activeEntities.values()) {
      for (const entity of entities) {
        if (query.toLowerCase().includes(entity.toLowerCase())) return true
      }
    }

    return false
  }

  /**
   * Update context metadata (domain, skill level)
   */
  private updateContextMetadata(context: ConversationContext): void {
    // Detect domain from entities
    const domains = {
      react: ['component', 'hook', 'prop'],
      typescript: ['type', 'interface'],
      ai: ['llm', 'prompt', 'token'],
    }

    const entityTypes = Array.from(context.activeEntities.keys())
    for (const [domain, types] of Object.entries(domains)) {
      if (types.some((t) => entityTypes.includes(t as QueryEntity))) {
        context.metadata.domain = domain as 'react' | 'typescript' | 'ai'
        break
      }
    }

    // Infer skill level from intents
    const recentTurns = context.turns.slice(-5)
    const skillCounts = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    }

    for (const turn of recentTurns) {
      const level = turn.intent.skillLevel
      skillCounts[level]++
    }

    const maxCount = Math.max(...Object.values(skillCounts))
    const detectedLevel = Object.entries(skillCounts).find(([_, count]) => count === maxCount)?.[0]

    if (detectedLevel) {
      context.metadata.skillLevel = detectedLevel as 'beginner' | 'intermediate' | 'advanced'
    }
  }

  /**
   * Cleanup old turns to prevent memory bloat
   */
  private cleanupOldTurns(context: ConversationContext): void {
    if (context.turns.length > this.maxTurnsToKeep) {
      // Keep only recent turns
      context.turns = context.turns.slice(-this.maxTurnsToKeep)
    }

    // Cleanup old topics
    if (context.topicHistory.length > 10) {
      context.topicHistory = context.topicHistory.slice(-10)
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let instance: ConversationContextManager | null = null

/**
 * Get singleton instance of conversation context manager
 */
export function getConversationContextManager(): ConversationContextManager {
  if (!instance) {
    instance = new ConversationContextManager()
  }
  return instance
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format conversation context for RAG prompt
 */
export function formatContextForRAG(
  conversationId: string,
  includeHistory: boolean = true
): string {
  const manager = getConversationContextManager()
  const context = manager.getOrCreateContext(conversationId)

  const parts: string[] = []

  // Add metadata
  if (context.metadata.domain) {
    parts.push(`Domain: ${context.metadata.domain}`)
  }
  if (context.metadata.skillLevel) {
    parts.push(`User skill level: ${context.metadata.skillLevel}`)
  }

  // Add current topic
  if (context.currentTopic) {
    parts.push(`Current topic: ${context.currentTopic}`)
  }

  // Add active entities
  const entities: string[] = []
  for (const [type, values] of context.activeEntities.entries()) {
    if (values.length > 0) {
      entities.push(`${type}: ${values.join(', ')}`)
    }
  }
  if (entities.length > 0) {
    parts.push(`Active context: ${entities.join('; ')}`)
  }

  // Add conversation history
  if (includeHistory && context.turns.length > 0) {
    parts.push('\n' + manager.getConversationHistory(conversationId, 3))
  }

  return parts.join('\n')
}

/**
 * Check if query requires context from previous turns
 */
export function requiresConversationContext(query: string): boolean {
  // Short queries likely depend on context
  if (query.split(/\s+/).length < 5) return true

  // Pronouns suggest context dependency
  if (/\b(it|this|that|them|these|those)\b/i.test(query)) return true

  // Continuation words
  if (/^(and|also|additionally|what about|how about)/i.test(query)) return true

  // Vague references
  if (/\b(previous|last|earlier|same|different)\b/i.test(query)) return true

  return false
}
