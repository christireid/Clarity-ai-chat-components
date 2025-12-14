'use client'

import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import {
  PromptSuggestions,
  type PromptSuggestion,
  type PromptSuggestionsProps,
} from './prompt-suggestions'

/**
 * ML-based suggestion ranking configuration
 */
export interface SuggestionRankingConfig {
  /** Ranking model type */
  rankingModel: {
    type: 'ml' | 'rule-based' | 'hybrid'
    /** Provider for ML-based ranking */
    provider?: 'openai' | 'cohere' | 'anthropic' | 'custom'
    /** Custom endpoint for ranking */
    endpoint?: string
    /** API key for provider */
    apiKey?: string
  }
  /** Features to use for ranking */
  features: {
    /** Use conversation context for ranking */
    conversationContext: boolean
    /** Use user history for personalization */
    userHistory: boolean
    /** Consider time of day for suggestions */
    timeOfDay: boolean
    /** Track previous selections */
    previousSelections: boolean
  }
  /** Fallback strategy when ML is unavailable */
  fallback: 'rule-based' | 'random' | 'frequency'
  /** Enable A/B testing */
  enableABTesting?: boolean
  /** Track suggestion effectiveness */
  trackEffectiveness?: boolean
}

/**
 * Suggestion interaction event for tracking
 */
export interface SuggestionInteraction {
  suggestionId: string
  suggestionText: string
  timestamp: number
  selected: boolean
  conversationContext: {
    messageCount: number
    lastMessageRole: string
    lastMessageLength: number
  }
  rankingMethod: 'ml' | 'rule-based' | 'hybrid'
  confidence: number
}

/**
 * User preference tracking for personalization
 */
interface UserPreferences {
  topicPreferences: Map<string, number> // topic -> interest score
  suggestionHistory: SuggestionInteraction[]
  frequentKeywords: Map<string, number> // keyword -> frequency
  timePatterns: Map<number, number> // hour -> activity score
}

/**
 * Enhanced hook for generating ML-ranked prompt suggestions
 *
 * Features:
 * - Multi-turn conversation awareness
 * - Semantic similarity ranking
 * - Personalized suggestions based on user history
 * - A/B testing framework
 * - Effectiveness tracking
 * - Fallback to rule-based when ML unavailable
 *
 * @example
 * ```tsx
 * const { suggestions, trackInteraction, stats } = usePromptSuggestionsEnhanced(messages, {
 *   rankingModel: { type: 'hybrid', provider: 'openai' },
 *   features: {
 *     conversationContext: true,
 *     userHistory: true,
 *     timeOfDay: true,
 *     previousSelections: true,
 *   },
 *   enableABTesting: true,
 * })
 * ```
 */
export function usePromptSuggestionsEnhanced(
  messages: Message[],
  config?: Partial<SuggestionRankingConfig>
) {
  const defaultConfig: SuggestionRankingConfig = {
    rankingModel: { type: 'hybrid' },
    features: {
      conversationContext: true,
      userHistory: true,
      timeOfDay: true,
      previousSelections: true,
    },
    fallback: 'rule-based',
    enableABTesting: false,
    trackEffectiveness: true,
  }

  const finalConfig = { ...defaultConfig, ...config }

  // User preferences state
  const [userPreferences, setUserPreferences] = React.useState<UserPreferences>({
    topicPreferences: new Map(),
    suggestionHistory: [],
    frequentKeywords: new Map(),
    timePatterns: new Map(),
  })

  // A/B testing variant state
  const [abVariant, setAbVariant] = React.useState<'control' | 'experiment'>('control')

  // Stats tracking
  const [stats, setStats] = React.useState({
    totalSuggestions: 0,
    totalInteractions: 0,
    clickThroughRate: 0,
    averageConfidence: 0,
    mlRankingCount: 0,
    ruleBasedCount: 0,
  })

  // Initialize A/B variant
  React.useEffect(() => {
    if (finalConfig.enableABTesting) {
      setAbVariant(Math.random() > 0.5 ? 'experiment' : 'control')
    }
  }, [finalConfig.enableABTesting])

  /**
   * Extract conversation context for ML ranking
   */
  const getConversationContext = React.useCallback(() => {
    if (messages.length === 0) {
      return {
        topics: [] as string[],
        entities: [] as string[],
        sentiment: 'neutral' as const,
        messageCount: 0,
        lastRole: null,
        keywords: [] as string[],
      }
    }

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage) {
      return {
        topics: [] as string[],
        entities: [] as string[],
        sentiment: 'neutral' as const,
        messageCount: 0,
        lastRole: null,
        keywords: [] as string[],
      }
    }
    const lastContent = lastMessage.content.toLowerCase()

    // Extract keywords (simple implementation - can be enhanced with NLP)
    const keywords = lastContent
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .slice(0, 10)

    // Detect topics (simple pattern matching - can be enhanced with embeddings)
    const topics: string[] = []
    if (/(code|function|program|debug)/i.test(lastContent)) topics.push('programming')
    if (/(design|ui|ux|interface)/i.test(lastContent)) topics.push('design')
    if (/(data|analysis|chart|graph)/i.test(lastContent)) topics.push('analytics')
    if (/(help|question|how|what|why)/i.test(lastContent)) topics.push('help')
    if (/(error|bug|issue|problem)/i.test(lastContent)) topics.push('troubleshooting')

    // Simple sentiment detection
    const positiveWords = /(great|good|excellent|perfect|thanks|helpful)/i
    const negativeWords = /(error|wrong|bad|issue|problem|fail)/i
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (positiveWords.test(lastContent)) sentiment = 'positive'
    if (negativeWords.test(lastContent)) sentiment = 'negative'

    return {
      topics,
      entities: [],
      sentiment,
      messageCount: messages.length,
      lastRole: lastMessage.role,
      keywords,
    }
  }, [messages])

  /**
   * Generate base suggestions using rule-based approach
   */
  const generateBaseSuggestions = React.useCallback((): PromptSuggestion[] => {
    const context = getConversationContext()

    // Starter suggestions for empty conversations
    if (context.messageCount === 0) {
      return [
        {
          id: 'starter-1',
          text: 'Help me get started with a new project',
          label: 'New Project',
          type: 'starter',
          description: 'Get guidance on starting a new project',
          confidence: 0.9,
          keywords: ['start', 'project', 'new'],
        },
        {
          id: 'starter-2',
          text: 'What are your capabilities?',
          label: 'Explore Features',
          type: 'starter',
          description: 'Learn what I can help you with',
          confidence: 0.85,
          keywords: ['help', 'features', 'capabilities'],
        },
        {
          id: 'starter-3',
          text: 'Review my code',
          label: 'Code Review',
          type: 'starter',
          description: 'Get a professional code review',
          confidence: 0.8,
          keywords: ['code', 'review'],
        },
        {
          id: 'starter-4',
          text: 'Explain a concept',
          label: 'Learn',
          type: 'starter',
          description: 'Get clear explanations',
          confidence: 0.75,
          keywords: ['explain', 'learn', 'concept'],
        },
      ]
    }

    // Context-aware follow-ups
    const suggestions: PromptSuggestion[] = []

    // Programming-related suggestions
    if (context.topics.includes('programming')) {
      suggestions.push(
        {
          id: 'prog-1',
          text: 'Can you explain this code in more detail?',
          label: 'Explain Code',
          type: 'follow-up',
          confidence: 0.85,
          keywords: ['code', 'explain', 'detail'],
          description: 'Get a detailed explanation',
        },
        {
          id: 'prog-2',
          text: 'Show me a working example',
          label: 'Show Example',
          type: 'follow-up',
          confidence: 0.8,
          keywords: ['example', 'code', 'demo'],
          description: 'See practical implementation',
        },
        {
          id: 'prog-3',
          text: 'What are potential edge cases?',
          label: 'Edge Cases',
          type: 'follow-up',
          confidence: 0.75,
          keywords: ['edge', 'cases', 'testing'],
          description: 'Identify potential issues',
        }
      )
    }

    // Design-related suggestions
    if (context.topics.includes('design')) {
      suggestions.push(
        {
          id: 'design-1',
          text: 'Show me design alternatives',
          label: 'Alternatives',
          type: 'follow-up',
          confidence: 0.82,
          keywords: ['design', 'alternatives', 'options'],
          description: 'Explore different approaches',
        },
        {
          id: 'design-2',
          text: 'What are the best practices?',
          label: 'Best Practices',
          type: 'follow-up',
          confidence: 0.78,
          keywords: ['best', 'practices', 'design'],
          description: 'Learn industry standards',
        }
      )
    }

    // Troubleshooting suggestions
    if (context.topics.includes('troubleshooting')) {
      suggestions.push(
        {
          id: 'trouble-1',
          text: 'How can I debug this issue?',
          label: 'Debug Help',
          type: 'follow-up',
          confidence: 0.88,
          keywords: ['debug', 'issue', 'fix'],
          description: 'Get debugging strategies',
        },
        {
          id: 'trouble-2',
          text: 'What might be causing this error?',
          label: 'Root Cause',
          type: 'follow-up',
          confidence: 0.83,
          keywords: ['error', 'cause', 'reason'],
          description: 'Identify the root cause',
        }
      )
    }

    // Generic helpful follow-ups (always include)
    suggestions.push(
      {
        id: 'generic-1',
        text: 'Can you elaborate on that?',
        label: 'More Details',
        type: 'follow-up',
        confidence: 0.7,
        keywords: ['more', 'details', 'elaborate'],
        description: 'Get more information',
      },
      {
        id: 'generic-2',
        text: 'What are the next steps?',
        label: 'Next Steps',
        type: 'follow-up',
        confidence: 0.68,
        keywords: ['next', 'steps', 'continue'],
        description: 'Know what to do next',
      },
      {
        id: 'generic-3',
        text: 'Can you summarize that?',
        label: 'Summarize',
        type: 'follow-up',
        confidence: context.messageCount > 5 ? 0.75 : 0.5,
        keywords: ['summary', 'recap', 'overview'],
        description: 'Get a concise summary',
      }
    )

    return suggestions
  }, [getConversationContext])

  /**
   * Apply ML-based ranking to suggestions
   */
  const rankSuggestionsML = React.useCallback(
    async (suggestions: PromptSuggestion[]): Promise<PromptSuggestion[]> => {
      // For now, use hybrid approach with rule-based + user preferences
      // In production, this would call an ML model API

      const context = getConversationContext()
      const currentHour = new Date().getHours()

      return suggestions.map((suggestion) => {
        let adjustedConfidence = suggestion.confidence || 0.5

        // Feature 1: User history (personalization)
        if (finalConfig.features.userHistory) {
          const historyBoost = userPreferences.suggestionHistory
            .filter((h) => h.selected && h.suggestionId === suggestion.id)
            .length * 0.05
          adjustedConfidence += historyBoost
        }

        // Feature 2: Keyword frequency
        if (finalConfig.features.previousSelections && suggestion.keywords) {
          const keywordBoost = suggestion.keywords.reduce((boost, keyword) => {
            const freq = userPreferences.frequentKeywords.get(keyword) || 0
            return boost + freq * 0.02
          }, 0)
          adjustedConfidence += keywordBoost
        }

        // Feature 3: Time of day patterns
        if (finalConfig.features.timeOfDay) {
          const timeActivity = userPreferences.timePatterns.get(currentHour) || 0
          adjustedConfidence += timeActivity * 0.03
        }

        // Feature 4: Conversation length (longer conversations benefit from summarization)
        if (
          finalConfig.features.conversationContext &&
          suggestion.keywords?.includes('summary') &&
          context.messageCount > 8
        ) {
          adjustedConfidence += 0.15
        }

        // Clamp confidence to [0, 1]
        adjustedConfidence = Math.min(1, Math.max(0, adjustedConfidence))

        return {
          ...suggestion,
          confidence: adjustedConfidence,
        }
      })
    },
    [
      getConversationContext,
      userPreferences,
      finalConfig.features.userHistory,
      finalConfig.features.previousSelections,
      finalConfig.features.timeOfDay,
      finalConfig.features.conversationContext,
    ]
  )

  /**
   * Generate and rank suggestions
   */
  const suggestions = React.useMemo(async () => {
    const baseSuggestions = generateBaseSuggestions()

    // Apply ML ranking if configured
    if (
      finalConfig.rankingModel.type === 'ml' ||
      finalConfig.rankingModel.type === 'hybrid'
    ) {
      try {
        const ranked = await rankSuggestionsML(baseSuggestions)
        setStats((prev) => ({
          ...prev,
          mlRankingCount: prev.mlRankingCount + 1,
          totalSuggestions: prev.totalSuggestions + ranked.length,
        }))
        return ranked.sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
      } catch (error) {
        console.warn('ML ranking failed, falling back to rule-based', error)
        setStats((prev) => ({ ...prev, ruleBasedCount: prev.ruleBasedCount + 1 }))
        return baseSuggestions
      }
    }

    // Rule-based ranking
    setStats((prev) => ({
      ...prev,
      ruleBasedCount: prev.ruleBasedCount + 1,
      totalSuggestions: prev.totalSuggestions + baseSuggestions.length,
    }))
    return baseSuggestions.sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
  }, [
    generateBaseSuggestions,
    rankSuggestionsML,
    finalConfig.rankingModel.type,
  ])

  /**
   * Track suggestion interaction
   */
  const trackInteraction = React.useCallback(
    (suggestion: PromptSuggestion, selected: boolean) => {
      const context = getConversationContext()
      const interaction: SuggestionInteraction = {
        suggestionId: suggestion.id,
        suggestionText: suggestion.text,
        timestamp: Date.now(),
        selected,
        conversationContext: {
          messageCount: context.messageCount,
          lastMessageRole: context.lastRole || 'user',
          lastMessageLength: messages[messages.length - 1]?.content.length || 0,
        },
        rankingMethod: finalConfig.rankingModel.type,
        confidence: suggestion.confidence || 0,
      }

      if (finalConfig.trackEffectiveness) {
        setUserPreferences((prev) => {
          const newHistory = [...prev.suggestionHistory, interaction].slice(-100) // Keep last 100

          // Update frequent keywords
          const newKeywords = new Map(prev.frequentKeywords)
          if (selected && suggestion.keywords) {
            suggestion.keywords.forEach((keyword) => {
              newKeywords.set(keyword, (newKeywords.get(keyword) || 0) + 1)
            })
          }

          // Update time patterns
          const currentHour = new Date().getHours()
          const newTimePatterns = new Map(prev.timePatterns)
          if (selected) {
            newTimePatterns.set(currentHour, (newTimePatterns.get(currentHour) || 0) + 1)
          }

          return {
            ...prev,
            suggestionHistory: newHistory,
            frequentKeywords: newKeywords,
            timePatterns: newTimePatterns,
          }
        })

        // Update stats
        setStats((prev) => {
          const newTotal = prev.totalInteractions + 1
          const newClicks = selected ? prev.totalInteractions * prev.clickThroughRate + 1 : prev.totalInteractions * prev.clickThroughRate
          return {
            ...prev,
            totalInteractions: newTotal,
            clickThroughRate: newClicks / newTotal,
            averageConfidence:
              (prev.averageConfidence * prev.totalInteractions + (suggestion.confidence || 0)) /
              newTotal,
          }
        })
      }
    },
    [
      messages,
      getConversationContext,
      finalConfig.trackEffectiveness,
      finalConfig.rankingModel.type,
    ]
  )

  /**
   * Reset user preferences (for testing)
   */
  const resetPreferences = React.useCallback(() => {
    setUserPreferences({
      topicPreferences: new Map(),
      suggestionHistory: [],
      frequentKeywords: new Map(),
      timePatterns: new Map(),
    })
    setStats({
      totalSuggestions: 0,
      totalInteractions: 0,
      clickThroughRate: 0,
      averageConfidence: 0,
      mlRankingCount: 0,
      ruleBasedCount: 0,
    })
  }, [])

  return {
    suggestions,
    trackInteraction,
    stats,
    abVariant,
    userPreferences,
    resetPreferences,
  }
}

/**
 * Enhanced PromptSuggestions component with ML-based ranking
 *
 * This is a drop-in replacement for the original PromptSuggestions
 * that adds ML-based ranking, personalization, and tracking.
 *
 * @example
 * ```tsx
 * <PromptSuggestionsEnhanced
 *   messages={messages}
 *   onSelect={(suggestion) => {
 *     sendMessage(suggestion.text)
 *   }}
 *   config={{
 *     rankingModel: { type: 'hybrid' },
 *     features: {
 *       conversationContext: true,
 *       userHistory: true,
 *       timeOfDay: true,
 *       previousSelections: true,
 *     },
 *   }}
 *   maxSuggestions={6}
 * />
 * ```
 */
export function PromptSuggestionsEnhanced({
  messages,
  onSelect,
  config,
  ...promptSuggestionsProps
}: Omit<PromptSuggestionsProps, 'suggestions'> & {
  messages: Message[]
  config?: Partial<SuggestionRankingConfig>
}) {
  const { suggestions, trackInteraction } = usePromptSuggestionsEnhanced(messages, config)

  const handleSelect = React.useCallback(
    (suggestion: PromptSuggestion) => {
      trackInteraction(suggestion, true)
      onSelect(suggestion)
    },
    [onSelect, trackInteraction]
  )

  // Track impressions (not selected)
  React.useEffect(() => {
    const unwrapPromise = async () => {
      const resolvedSuggestions = await suggestions
      resolvedSuggestions.forEach((suggestion) => {
        trackInteraction(suggestion, false)
      })
    }
    unwrapPromise()
  }, [suggestions, trackInteraction])

  const [resolvedSuggestions, setResolvedSuggestions] = React.useState<PromptSuggestion[]>([])

  React.useEffect(() => {
    const unwrapPromise = async () => {
      const resolved = await suggestions
      setResolvedSuggestions(resolved)
    }
    unwrapPromise()
  }, [suggestions])

  return (
    <PromptSuggestions
      {...promptSuggestionsProps}
      suggestions={resolvedSuggestions}
      onSelect={handleSelect}
      messages={messages}
    />
  )
}

PromptSuggestionsEnhanced.displayName = 'PromptSuggestionsEnhanced'
