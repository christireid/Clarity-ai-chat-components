/**
 * Utility functions for ConversationAnalyticsDashboard
 *
 * This file contains pure functions for analytics generation.
 */

import type { Message } from '@clarity-chat/types'
import type {
  TopicCluster,
  ConversationAnalytics,
  KeyMoment,
  ConversationSummary,
  QualityMetrics,
} from './ConversationAnalyticsDashboard.types'

/**
 * Common stopwords to ignore in topic extraction
 */
const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'can',
  'this',
  'that',
  'these',
  'those',
  'i',
  'you',
  'he',
  'she',
  'it',
  'we',
  'they',
  'what',
  'which',
  'who',
  'when',
  'where',
  'why',
  'how',
  'all',
  'each',
  'every',
  'both',
  'few',
])

/**
 * Positive sentiment words
 */
const POSITIVE_WORDS = new Set([
  'good',
  'great',
  'excellent',
  'perfect',
  'amazing',
  'wonderful',
  'fantastic',
  'helpful',
  'thanks',
  'thank',
  'appreciate',
  'love',
  'best',
  'awesome',
  'brilliant',
  'impressive',
  'outstanding',
])

/**
 * Negative sentiment words
 */
const NEGATIVE_WORDS = new Set([
  'bad',
  'terrible',
  'awful',
  'horrible',
  'wrong',
  'error',
  'issue',
  'problem',
  'fail',
  'broken',
  'bug',
  'difficult',
  'hard',
  'confusing',
  'frustrated',
  'disappointed',
  'poor',
  'worst',
])

/**
 * Topic patterns for simple classification
 */
const TOPIC_PATTERNS = [
  {
    name: 'Programming',
    keywords: ['code', 'function', 'program', 'debug', 'error', 'bug'],
  },
  {
    name: 'Design',
    keywords: ['design', 'interface', 'user', 'experience', 'layout'],
  },
  {
    name: 'Data',
    keywords: ['data', 'database', 'query', 'analysis', 'chart'],
  },
  {
    name: 'Help/Support',
    keywords: ['help', 'question', 'issue', 'problem', 'solve'],
  },
  {
    name: 'Planning',
    keywords: ['plan', 'schedule', 'timeline', 'task', 'project'],
  },
]

/**
 * Extract topics using simple keyword clustering
 */
export function extractTopics(messages: Message[]): TopicCluster[] {
  const allContent = messages.map((m) => m.content.toLowerCase()).join(' ')

  // Extract words and count frequency
  const wordFreq = new Map<string, number>()
  const words = allContent.match(/\b\w{4,}\b/g) || []

  words.forEach((word) => {
    if (!STOPWORDS.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
    }
  })

  // Get top keywords
  const topKeywords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word)

  // Simple topic clustering based on keyword co-occurrence
  const topics: TopicCluster[] = []

  TOPIC_PATTERNS.forEach((pattern) => {
    const matchingKeywords = topKeywords.filter((kw) =>
      pattern.keywords.some((pk) => kw.includes(pk) || pk.includes(kw))
    )

    if (matchingKeywords.length > 0) {
      const messageCount = messages.filter((m) =>
        matchingKeywords.some((kw) => m.content.toLowerCase().includes(kw))
      ).length

      topics.push({
        name: pattern.name,
        confidence: Math.min(
          matchingKeywords.length / pattern.keywords.length,
          1
        ),
        messageCount,
        keywords: matchingKeywords.slice(0, 5),
      })
    }
  })

  return topics.sort((a, b) => b.messageCount - a.messageCount)
}

/**
 * Analyze sentiment over time
 */
export function analyzeSentiment(
  messages: Message[]
): ConversationAnalytics['sentiment'] {
  const timeline = messages.map((message, index) => {
    const content = message.content.toLowerCase()
    const words = content.split(/\s+/)

    let positiveCount = 0
    let negativeCount = 0

    words.forEach((word) => {
      if (POSITIVE_WORDS.has(word)) positiveCount++
      if (NEGATIVE_WORDS.has(word)) negativeCount++
    })

    const total = positiveCount + negativeCount
    const score = total === 0 ? 0 : (positiveCount - negativeCount) / total

    let label: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (score > 0.2) label = 'positive'
    if (score < -0.2) label = 'negative'

    return {
      timestamp: Date.now() - (messages.length - index) * 60000, // Mock timestamps
      score,
      label,
    }
  })

  // Calculate overall sentiment - guard against empty timeline
  const avgScore =
    timeline.length > 0
      ? timeline.reduce((sum, point) => sum + point.score, 0) / timeline.length
      : 0
  const overall: 'positive' | 'neutral' | 'negative' =
    avgScore > 0.2 ? 'positive' : avgScore < -0.2 ? 'negative' : 'neutral'

  return {
    timeline,
    overall,
    confidence: Math.abs(avgScore),
  }
}

/**
 * Calculate conversation quality metrics
 */
export function calculateQuality(messages: Message[]): QualityMetrics {
  if (messages.length === 0) {
    return {
      score: 0,
      factors: { engagement: 0, coherence: 0, depth: 0, efficiency: 0 },
    }
  }

  // Engagement: based on message frequency and length
  const avgMessageLength =
    messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length
  const engagement = Math.min((avgMessageLength / 100) * 100, 100)

  // Coherence: based on keyword continuity
  const coherence = messages.length > 1 ? 75 : 50 // Simplified

  // Depth: based on message length and question count
  const questionCount = messages.filter((m) => m.content.includes('?')).length
  const depth = Math.min((questionCount / messages.length) * 200 + 30, 100)

  // Efficiency: based on conversation flow
  const efficiency = Math.min((messages.length / 10) * 100, 100)

  const score = (engagement + coherence + depth + efficiency) / 4

  return {
    score,
    factors: { engagement, coherence, depth, efficiency },
  }
}

/**
 * Detect key moments in conversation
 */
export function detectKeyMoments(messages: Message[]): KeyMoment[] {
  const moments: KeyMoment[] = []

  messages.forEach((message, index) => {
    const content = message.content.toLowerCase()

    // Detect questions (potential confusion or request for clarity)
    if (content.includes('?')) {
      moments.push({
        timestamp: Date.now() - (messages.length - index) * 60000,
        messageId: message.id,
        type: 'question',
        description: 'Question asked',
        importance: 0.6,
      })
    }

    // Detect breakthroughs (positive language + length)
    if (
      message.content.length > 200 &&
      (content.includes('understand') ||
        content.includes('got it') ||
        content.includes('makes sense'))
    ) {
      moments.push({
        timestamp: Date.now() - (messages.length - index) * 60000,
        messageId: message.id,
        type: 'breakthrough',
        description: 'Understanding achieved',
        importance: 0.8,
      })
    }

    // Detect decisions
    if (
      content.includes('decided') ||
      content.includes('will do') ||
      content.includes('going to')
    ) {
      moments.push({
        timestamp: Date.now() - (messages.length - index) * 60000,
        messageId: message.id,
        type: 'decision',
        description: 'Decision made',
        importance: 0.9,
      })
    }
  })

  return moments.sort((a, b) => b.importance - a.importance).slice(0, 5)
}

/**
 * Generate conversation summary
 */
export function generateSummary(messages: Message[]): ConversationSummary {
  const keyPoints: string[] = []
  const nextSteps: string[] = []
  const openQuestions: string[] = []

  messages.forEach((message) => {
    const content = message.content

    // Extract questions
    if (content.includes('?')) {
      const questions = content.split('?').filter((q) => q.trim())
      openQuestions.push(...questions.map((q) => q.trim() + '?'))
    }

    // Extract action items
    const actionPatterns = [
      /(?:I will|I'll|we should|need to|going to)\s+([^.!?\n]+)/gi,
      /(?:TODO:|Action:)\s+([^.!?\n]+)/gi,
    ]

    actionPatterns.forEach((pattern) => {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) nextSteps.push(match[1].trim())
      }
    })

    // Key points (sentences with important keywords)
    if (
      content.includes('important') ||
      content.includes('key') ||
      content.includes('main') ||
      content.includes('critical')
    ) {
      const sentences = content.split(/[.!]/).filter((s) => s.trim())
      keyPoints.push(...sentences.slice(0, 2).map((s) => s.trim()))
    }
  })

  return {
    keyPoints: keyPoints.slice(0, 5),
    nextSteps: nextSteps.slice(0, 5),
    openQuestions: openQuestions.slice(0, 5),
  }
}
