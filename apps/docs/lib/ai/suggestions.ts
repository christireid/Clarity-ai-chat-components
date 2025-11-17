/**
 * Smart Suggestions
 *
 * Generate contextual follow-up question suggestions based on
 * conversation context, sources, and common patterns.
 */

import type { SearchResult } from './vectorStore'
import { extractTopics, type ConversationMessage } from './advancedRAG'

export interface Suggestion {
  id: string
  question: string
  category: 'exploration' | 'clarification' | 'practical' | 'related'
  relevance: number
  icon?: string
}

export interface SuggestionContext {
  /** Recent messages for context */
  recentMessages: ConversationMessage[]
  /** Sources cited in last response */
  lastSources?: SearchResult[]
  /** Current topic */
  currentTopic?: string
  /** User's last query */
  lastQuery?: string
}

/**
 * Generate follow-up suggestions based on context
 */
export function generateSuggestions(context: SuggestionContext): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Extract topics from last sources
  const topics = context.lastSources?.map(s => s.category) || []
  const uniqueTopics = [...new Set(topics)]

  // Generate category-specific suggestions
  if (uniqueTopics.includes('component')) {
    suggestions.push(...getComponentSuggestions(context))
  }

  if (uniqueTopics.includes('hook')) {
    suggestions.push(...getHookSuggestions(context))
  }

  if (uniqueTopics.includes('guide')) {
    suggestions.push(...getGuideSuggestions(context))
  }

  if (uniqueTopics.includes('example')) {
    suggestions.push(...getExampleSuggestions(context))
  }

  // Add related topic suggestions
  suggestions.push(...getRelatedTopicSuggestions(context))

  // Add practical next steps
  suggestions.push(...getPracticalSuggestions(context))

  // Score and sort by relevance
  const scored = scoreAndDeduplicate(suggestions, context)

  // Return top 5 suggestions
  return scored.slice(0, 5)
}

/**
 * Component-specific suggestions
 */
function getComponentSuggestions(context: SuggestionContext): Suggestion[] {
  const componentName = extractComponentName(context)

  return [
    {
      id: 'comp-props',
      question: `What are the available props for ${componentName}?`,
      category: 'exploration',
      relevance: 0.9,
      icon: '⚙️',
    },
    {
      id: 'comp-styling',
      question: `How do I customize the styling of ${componentName}?`,
      category: 'practical',
      relevance: 0.85,
      icon: '🎨',
    },
    {
      id: 'comp-example',
      question: `Show me a complete example using ${componentName}`,
      category: 'practical',
      relevance: 0.8,
      icon: '💡',
    },
    {
      id: 'comp-events',
      question: `What events does ${componentName} emit?`,
      category: 'exploration',
      relevance: 0.75,
      icon: '⚡',
    },
  ].filter(s => componentName !== 'this component') // Only if we found a component name
}

/**
 * Hook-specific suggestions
 */
function getHookSuggestions(context: SuggestionContext): Suggestion[] {
  const hookName = extractHookName(context)

  return [
    {
      id: 'hook-usage',
      question: `How do I use ${hookName} with other hooks?`,
      category: 'practical',
      relevance: 0.9,
      icon: '🔗',
    },
    {
      id: 'hook-params',
      question: `What parameters does ${hookName} accept?`,
      category: 'exploration',
      relevance: 0.85,
      icon: '📋',
    },
    {
      id: 'hook-return',
      question: `What does ${hookName} return?`,
      category: 'exploration',
      relevance: 0.8,
      icon: '↩️',
    },
    {
      id: 'hook-performance',
      question: `What are the performance considerations for ${hookName}?`,
      category: 'clarification',
      relevance: 0.7,
      icon: '⚡',
    },
  ].filter(s => hookName !== 'this hook')
}

/**
 * Guide-specific suggestions
 */
function getGuideSuggestions(context: SuggestionContext): Suggestion[] {
  return [
    {
      id: 'guide-best-practices',
      question: 'What are the best practices for this?',
      category: 'clarification',
      relevance: 0.85,
      icon: '✨',
    },
    {
      id: 'guide-gotchas',
      question: 'What are common pitfalls to avoid?',
      category: 'clarification',
      relevance: 0.8,
      icon: '⚠️',
    },
    {
      id: 'guide-advanced',
      question: 'Show me advanced usage patterns',
      category: 'exploration',
      relevance: 0.75,
      icon: '🚀',
    },
  ]
}

/**
 * Example-specific suggestions
 */
function getExampleSuggestions(context: SuggestionContext): Suggestion[] {
  return [
    {
      id: 'example-explain',
      question: 'Can you explain how this example works?',
      category: 'clarification',
      relevance: 0.9,
      icon: '💬',
    },
    {
      id: 'example-adapt',
      question: 'How can I adapt this for my use case?',
      category: 'practical',
      relevance: 0.85,
      icon: '🔧',
    },
    {
      id: 'example-variations',
      question: 'Are there variations of this example?',
      category: 'exploration',
      relevance: 0.75,
      icon: '🔄',
    },
  ]
}

/**
 * Related topic suggestions
 */
function getRelatedTopicSuggestions(context: SuggestionContext): Suggestion[] {
  const topics = extractTopics(context.recentMessages)
  const suggestions: Suggestion[] = []

  // Component relationships
  const componentRelations: Record<string, string[]> = {
    'ChatWindow': ['MessageList', 'StreamingMessage', 'TypingIndicator'],
    'StreamingMessage': ['ChatWindow', 'useChat', 'useChatStream'],
    'MessageList': ['ChatWindow', 'Message', 'VirtualList'],
    'useChat': ['ChatWindow', 'StreamingMessage', 'useChatStream'],
  }

  for (const topic of topics) {
    const related = componentRelations[topic] || []
    for (const relatedTopic of related) {
      if (!topics.includes(relatedTopic)) {
        suggestions.push({
          id: `related-${relatedTopic}`,
          question: `How does ${relatedTopic} work?`,
          category: 'related',
          relevance: 0.65,
          icon: '🔗',
        })
      }
    }
  }

  return suggestions.slice(0, 2) // Max 2 related suggestions
}

/**
 * Practical next-step suggestions
 */
function getPracticalSuggestions(context: SuggestionContext): Suggestion[] {
  const hasSeenBasics = context.recentMessages.length > 2

  if (!hasSeenBasics) {
    // Early in conversation - suggest basics
    return [
      {
        id: 'practical-quickstart',
        question: 'Show me a quick start example',
        category: 'practical',
        relevance: 0.95,
        icon: '🚀',
      },
      {
        id: 'practical-installation',
        question: 'How do I install and set up?',
        category: 'practical',
        relevance: 0.9,
        icon: '📦',
      },
    ]
  }

  // Later in conversation - suggest advanced topics
  return [
    {
      id: 'practical-testing',
      question: 'How do I test this?',
      category: 'practical',
      relevance: 0.7,
      icon: '🧪',
    },
    {
      id: 'practical-typescript',
      question: 'Show me the TypeScript types',
      category: 'practical',
      relevance: 0.65,
      icon: '📘',
    },
    {
      id: 'practical-troubleshooting',
      question: 'What if something goes wrong?',
      category: 'practical',
      relevance: 0.6,
      icon: '🔧',
    },
  ]
}

/**
 * Extract component name from context
 */
function extractComponentName(context: SuggestionContext): string {
  // Check last sources for component names
  const componentSources = context.lastSources?.filter(s => s.category === 'component')

  if (componentSources && componentSources.length > 0) {
    // Extract from title (e.g., "ChatWindow Component" -> "ChatWindow")
    const title = componentSources[0].title
    const match = title.match(/^(\w+)/)
    if (match) return match[1]
  }

  // Check last query
  if (context.lastQuery) {
    const commonComponents = [
      'ChatWindow',
      'StreamingMessage',
      'MessageList',
      'TypingIndicator',
      'Avatar',
      'Attachment',
    ]

    for (const component of commonComponents) {
      if (context.lastQuery.includes(component)) {
        return component
      }
    }
  }

  return 'this component'
}

/**
 * Extract hook name from context
 */
function extractHookName(context: SuggestionContext): string {
  const hookSources = context.lastSources?.filter(s => s.category === 'hook')

  if (hookSources && hookSources.length > 0) {
    const title = hookSources[0].title
    const match = title.match(/(use\w+)/i)
    if (match) return match[1]
  }

  if (context.lastQuery) {
    const commonHooks = ['useChat', 'useChatStream', 'useMessages', 'useTyping']

    for (const hook of commonHooks) {
      if (context.lastQuery.includes(hook)) {
        return hook
      }
    }
  }

  return 'this hook'
}

/**
 * Score and deduplicate suggestions
 */
function scoreAndDeduplicate(
  suggestions: Suggestion[],
  context: SuggestionContext
): Suggestion[] {
  // Boost relevance based on recency
  const boostedSuggestions = suggestions.map(s => ({
    ...s,
    relevance: calculateRelevance(s, context),
  }))

  // Remove duplicates (same question)
  const seen = new Set<string>()
  const unique = boostedSuggestions.filter(s => {
    const key = s.question.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Sort by relevance
  return unique.sort((a, b) => b.relevance - a.relevance)
}

/**
 * Calculate suggestion relevance
 */
function calculateRelevance(
  suggestion: Suggestion,
  context: SuggestionContext
): number {
  let relevance = suggestion.relevance

  // Boost if related to current topic
  if (context.currentTopic) {
    if (suggestion.question.toLowerCase().includes(context.currentTopic.toLowerCase())) {
      relevance += 0.1
    }
  }

  // Boost practical suggestions for users deeper in conversation
  if (context.recentMessages.length > 3 && suggestion.category === 'practical') {
    relevance += 0.05
  }

  // Boost exploration for new conversations
  if (context.recentMessages.length <= 2 && suggestion.category === 'exploration') {
    relevance += 0.05
  }

  return Math.min(relevance, 1.0)
}

/**
 * Get category-based suggestions
 */
export function getSuggestionsByCategory(
  category: Suggestion['category']
): Suggestion[] {
  const allSuggestions: Record<Suggestion['category'], Suggestion[]> = {
    exploration: [
      {
        id: 'explore-components',
        question: 'What components are available?',
        category: 'exploration',
        relevance: 0.8,
        icon: '🧩',
      },
      {
        id: 'explore-hooks',
        question: 'What hooks can I use?',
        category: 'exploration',
        relevance: 0.8,
        icon: '🪝',
      },
    ],
    clarification: [
      {
        id: 'clarify-difference',
        question: "What's the difference between X and Y?",
        category: 'clarification',
        relevance: 0.75,
        icon: '❓',
      },
    ],
    practical: [
      {
        id: 'practical-start',
        question: 'How do I get started?',
        category: 'practical',
        relevance: 0.9,
        icon: '🚀',
      },
    ],
    related: [
      {
        id: 'related-topics',
        question: 'What else should I know?',
        category: 'related',
        relevance: 0.7,
        icon: '📚',
      },
    ],
  }

  return allSuggestions[category] || []
}

/**
 * Get default suggestions for new conversations
 */
export function getDefaultSuggestions(): Suggestion[] {
  return [
    {
      id: 'default-quickstart',
      question: 'How do I get started with Clarity Chat?',
      category: 'practical',
      relevance: 1.0,
      icon: '🚀',
    },
    {
      id: 'default-components',
      question: 'What components are available?',
      category: 'exploration',
      relevance: 0.95,
      icon: '🧩',
    },
    {
      id: 'default-examples',
      question: 'Show me example implementations',
      category: 'practical',
      relevance: 0.9,
      icon: '💡',
    },
    {
      id: 'default-streaming',
      question: 'How do I add streaming messages?',
      category: 'practical',
      relevance: 0.85,
      icon: '⚡',
    },
    {
      id: 'default-styling',
      question: 'How do I customize the styling?',
      category: 'practical',
      relevance: 0.8,
      icon: '🎨',
    },
  ]
}
