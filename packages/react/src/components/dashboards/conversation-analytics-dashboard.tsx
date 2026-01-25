'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { DURATION_SECONDS as durations } from '../../animations/constants'
import type { Message } from '@clarity-chat/types'
import { useReducedMotion } from '@/hooks/ui/use-reduced-motion'

/**
 * Topic cluster
 */
export interface TopicCluster {
  name: string
  confidence: number
  messageCount: number
  keywords: string[]
  representativeMessages?: string[]
}

/**
 * Sentiment timeline point
 */
export interface SentimentPoint {
  timestamp: number
  score: number // -1 to 1
  label: 'positive' | 'neutral' | 'negative'
}

/**
 * Conversation quality metrics
 */
export interface QualityMetrics {
  score: number // 0-100
  factors: {
    engagement: number // 0-100
    coherence: number // 0-100
    depth: number // 0-100
    efficiency: number // 0-100
  }
}

/**
 * Key moment in conversation
 */
export interface KeyMoment {
  timestamp: number
  messageId: string
  type: 'breakthrough' | 'confusion' | 'question' | 'decision' | 'insight'
  description: string
  importance: number // 0-1
}

/**
 * Conversation summary
 */
export interface ConversationSummary {
  keyPoints: string[]
  nextSteps: string[]
  openQuestions: string[]
  decisions?: string[]
  actionItems?: string[]
}

/**
 * Complete conversation analytics
 */
export interface ConversationAnalytics {
  topics: TopicCluster[]
  sentiment: {
    timeline: SentimentPoint[]
    overall: 'positive' | 'neutral' | 'negative'
    confidence: number
  }
  quality: QualityMetrics
  keyMoments: KeyMoment[]
  summary: ConversationSummary
  metadata: {
    totalMessages: number
    duration: number // milliseconds
    participantCount: number
    averageMessageLength: number
  }
}

/**
 * Props for ConversationAnalyticsDashboard
 */
export interface ConversationAnalyticsDashboardProps {
  /** Messages to analyze */
  messages: Message[]
  /** Analytics data (if pre-computed) */
  analytics?: ConversationAnalytics
  /** Callback for custom analytics generation */
  onGenerateAnalytics?: (messages: Message[]) => Promise<ConversationAnalytics>
  /** Auto-generate analytics */
  autoGenerate?: boolean
  /** Update interval for auto-generation (milliseconds) */
  updateInterval?: number
  /** Callback when analytics are generated */
  onAnalyticsGenerated?: (analytics: ConversationAnalytics) => void
  /** Show detailed breakdown */
  detailed?: boolean
  className?: string
  /** Whether the dashboard is in a loading state (external control) */
  isLoading?: boolean
  /** Error to display (renders error state when provided, external control) */
  externalError?: Error | string | null
}

/**
 * Extract topics using simple keyword clustering
 */
function extractTopics(messages: Message[]): TopicCluster[] {
  const allContent = messages.map((m) => m.content.toLowerCase()).join(' ')

  // Common stopwords to ignore
  const stopwords = new Set([
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

  // Extract words and count frequency
  const wordFreq = new Map<string, number>()
  const words = allContent.match(/\b\w{4,}\b/g) || []

  words.forEach((word) => {
    if (!stopwords.has(word)) {
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

  // Predefined topic patterns (in production, use LLM or ML clustering)
  const topicPatterns = [
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

  topicPatterns.forEach((pattern) => {
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
function analyzeSentiment(
  messages: Message[]
): ConversationAnalytics['sentiment'] {
  const timeline: SentimentPoint[] = []

  // Simple sentiment lexicon
  const positiveWords = new Set([
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

  const negativeWords = new Set([
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

  messages.forEach((message, index) => {
    const content = message.content.toLowerCase()
    const words = content.split(/\s+/)

    let positiveCount = 0
    let negativeCount = 0

    words.forEach((word) => {
      if (positiveWords.has(word)) positiveCount++
      if (negativeWords.has(word)) negativeCount++
    })

    const total = positiveCount + negativeCount
    const score = total === 0 ? 0 : (positiveCount - negativeCount) / total

    let label: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (score > 0.2) label = 'positive'
    if (score < -0.2) label = 'negative'

    timeline.push({
      timestamp: Date.now() - (messages.length - index) * 60000, // Mock timestamps
      score,
      label,
    })
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
function calculateQuality(messages: Message[]): QualityMetrics {
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
function detectKeyMoments(messages: Message[]): KeyMoment[] {
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
function generateSummary(messages: Message[]): ConversationSummary {
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

/**
 * ConversationAnalyticsDashboard Component
 *
 * Provides AI-powered insights into conversation patterns, topics, sentiment,
 * and quality metrics.
 *
 * Features:
 * - Topic extraction and clustering
 * - Sentiment analysis over time
 * - Conversation quality scoring
 * - Key moment detection
 * - Automatic summarization
 * - Visual analytics dashboard
 *
 * @example
 * ```tsx
 * <ConversationAnalyticsDashboard
 *   messages={messages}
 *   autoGenerate
 *   updateInterval={30000}
 *   onGenerateAnalytics={async (messages) => {
 *     const response = await fetch('/api/analyze', {
 *       method: 'POST',
 *       body: JSON.stringify({ messages }),
 *     })
 *     return response.json()
 *   }}
 * />
 * ```
 */
export function ConversationAnalyticsDashboard({
  messages,
  analytics: externalAnalytics,
  onGenerateAnalytics,
  autoGenerate = false,
  updateInterval = 30000,
  onAnalyticsGenerated,
  detailed = false,
  className,
  isLoading: externalLoading = false,
  externalError = null,
}: ConversationAnalyticsDashboardProps) {
  const prefersReducedMotion = useReducedMotion()
  const [analytics, setAnalytics] =
    React.useState<ConversationAnalytics | null>(externalAnalytics || null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Combined loading state (external or internal)
  const isLoading = externalLoading || isGenerating
  // Combined error state (external takes precedence)
  const displayError = externalError
    ? externalError instanceof Error
      ? externalError.message
      : String(externalError)
    : error

  /**
   * Generate analytics using fallback logic
   */
  const generateAnalyticsFallback = React.useCallback(
    (msgs: Message[]): ConversationAnalytics => {
      return {
        topics: extractTopics(msgs),
        sentiment: analyzeSentiment(msgs),
        quality: calculateQuality(msgs),
        keyMoments: detectKeyMoments(msgs),
        summary: generateSummary(msgs),
        metadata: {
          totalMessages: msgs.length,
          duration: msgs.length * 60000, // Mock duration
          participantCount: new Set(msgs.map((m) => m.role)).size,
          averageMessageLength:
            msgs.reduce((sum, m) => sum + m.content.length, 0) / msgs.length ||
            0,
        },
      }
    },
    []
  )

  /**
   * Generate analytics
   */
  const generateAnalytics = React.useCallback(async () => {
    if (messages.length === 0) return

    setIsGenerating(true)
    setError(null)

    try {
      let result: ConversationAnalytics

      if (onGenerateAnalytics) {
        result = await onGenerateAnalytics(messages)
      } else {
        result = generateAnalyticsFallback(messages)
      }

      setAnalytics(result)
      onAnalyticsGenerated?.(result)
    } catch (err) {
      console.error('Analytics generation error:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to generate analytics'
      )
    } finally {
      setIsGenerating(false)
    }
  }, [
    messages,
    onGenerateAnalytics,
    generateAnalyticsFallback,
    onAnalyticsGenerated,
  ])

  // Auto-generate on interval
  React.useEffect(() => {
    if (autoGenerate && messages.length > 0) {
      generateAnalytics()

      const interval = setInterval(generateAnalytics, updateInterval)
      return () => clearInterval(interval)
    }
    return undefined
  }, [autoGenerate, messages.length, updateInterval, generateAnalytics])

  if (messages.length === 0) {
    return (
      <Card className={cn('shadow-sm', className)}>
        <CardContent className="p-8 text-center text-muted-foreground">
          Start a conversation to see analytics
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className={cn('space-y-4', className)}
      role="region"
      aria-label="Conversation Analytics Dashboard"
    >
      {/* Header */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <CardTitle className="text-base">
                  Conversation Analytics
                </CardTitle>
                <CardDescription className="text-xs">
                  AI-powered insights from {messages.length} messages
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={generateAnalytics}
              disabled={isGenerating}
              size="sm"
              variant="outline"
            >
              {isGenerating ? 'Analyzing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {displayError && (
        <Card className="shadow-sm border-destructive">
          <CardContent className="p-4 text-sm text-destructive">
            {displayError}
          </CardContent>
        </Card>
      )}

      {isLoading && !analytics ? (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            {prefersReducedMotion ? (
              <div className="inline-block h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <motion.div
                className="inline-block h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{
                  duration: durations.slower,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                viewport={{ once: true }}
              />
            )}
            <div className="mt-3 text-sm text-muted-foreground">
              Analyzing conversation...
            </div>
          </CardContent>
        </Card>
      ) : analytics ? (
        prefersReducedMotion ? (
          <div className="space-y-4">
            {/* Quality Score */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Conversation Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold" aria-hidden="true">
                    {Math.round(analytics.quality.score)}
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-2 w-full rounded-full bg-muted overflow-hidden"
                      role="progressbar"
                      aria-label="Conversation quality score"
                      aria-valuenow={Math.round(analytics.quality.score)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuetext={`Quality score: ${Math.round(analytics.quality.score)} out of 100`}
                    >
                      {prefersReducedMotion ? (
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${analytics.quality.score}%` }}
                        />
                      ) : (
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${analytics.quality.score}%` }}
                          transition={{
                            duration: durations.slower,
                            ease: 'easeOut',
                          }}
                          viewport={{ once: true }}
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3 text-xs">
                      {Object.entries(analytics.quality.factors).map(
                        ([key, value]) => (
                          <div key={key}>
                            <div className="text-muted-foreground capitalize">
                              {key}
                            </div>
                            <div className="font-semibold">
                              {Math.round(value)}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topics */}
            {analytics.topics.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Topics Discussed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analytics.topics.map((topic, index) =>
                    prefersReducedMotion ? (
                      <div
                        key={topic.name}
                        className="flex items-center justify-between"
                      >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {topic.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {topic.messageCount} messages
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {topic.keywords.map((kw) => (
                            <Badge
                              key={kw}
                              variant="outline"
                              className="text-xs"
                            >
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                        <div className="text-2xl font-bold text-muted-foreground">
                          {Math.round(topic.confidence * 100)}%
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        key={topic.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {topic.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {topic.messageCount} messages
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {topic.keywords.map((kw) => (
                              <Badge
                                key={kw}
                                variant="outline"
                                className="text-xs"
                              >
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-muted-foreground">
                          {Math.round(topic.confidence * 100)}%
                        </div>
                      </motion.div>
                    )
                  )}
                </CardContent>
              </Card>
            )}

            {/* Sentiment */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Badge
                    variant={
                      analytics.sentiment.overall === 'positive'
                        ? 'success'
                        : analytics.sentiment.overall === 'negative'
                          ? 'destructive'
                          : 'secondary'
                    }
                    className="text-lg px-4 py-2"
                  >
                    {analytics.sentiment.overall}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(analytics.sentiment.confidence * 100)}%
                    confidence
                  </div>
                </div>

                {detailed && (
                  <div
                    className="h-20 flex items-end gap-1"
                    role="img"
                    aria-label={`Sentiment timeline showing ${analytics.sentiment.timeline.length} data points with overall ${analytics.sentiment.overall} sentiment`}
                  >
                    {analytics.sentiment.timeline.map((point, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex-1 rounded-t',
                          point.label === 'positive' && 'bg-green-500',
                          point.label === 'neutral' && 'bg-gray-400',
                          point.label === 'negative' && 'bg-red-500'
                        )}
                        style={{
                          height: `${((point.score + 1) / 2) * 100}%`,
                        }}
                        title={`${point.label}: ${point.score.toFixed(2)}`}
                        role="presentation"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Moments */}
            {detailed && analytics.keyMoments.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Key Moments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analytics.keyMoments.map((moment, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2 rounded-lg border"
                    >
                      <Badge
                        variant={
                          moment.type === 'breakthrough'
                            ? 'success'
                            : moment.type === 'decision'
                              ? 'default'
                              : 'secondary'
                        }
                        className="mt-1"
                      >
                        {moment.type}
                      </Badge>
                      <div className="flex-1 text-sm">{moment.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(moment.importance * 100)}%
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Conversation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.summary.keyPoints.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Key Points</h4>
                    <ul className="space-y-1 text-sm">
                      {analytics.summary.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analytics.summary.nextSteps.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Next Steps</h4>
                    <ul className="space-y-1 text-sm">
                      {analytics.summary.nextSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analytics.summary.openQuestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">
                      Open Questions
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {analytics.summary.openQuestions.map((question, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">?</span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* Quality Score */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Conversation Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold" aria-hidden="true">
                      {Math.round(analytics.quality.score)}
                    </div>
                    <div className="flex-1">
                      <div
                        className="h-2 w-full rounded-full bg-muted overflow-hidden"
                        role="progressbar"
                        aria-label="Conversation quality score"
                        aria-valuenow={Math.round(analytics.quality.score)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuetext={`Quality score: ${Math.round(analytics.quality.score)} out of 100`}
                      >
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${analytics.quality.score}%` }}
                          transition={{
                            duration: durations.slower,
                            ease: 'easeOut',
                          }}
                          viewport={{ once: true }}
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3 text-xs">
                        {Object.entries(analytics.quality.factors).map(
                          ([key, value]) => (
                            <div key={key}>
                              <div className="text-muted-foreground capitalize">
                                {key}
                              </div>
                              <div className="font-semibold">
                                {Math.round(value)}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Topics */}
              {analytics.topics.length > 0 && (
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm">Topics Discussed</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analytics.topics.map((topic, index) => (
                      <motion.div
                        key={topic.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {topic.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {topic.messageCount} messages
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {topic.keywords.map((kw) => (
                              <Badge
                                key={kw}
                                variant="outline"
                                className="text-xs"
                              >
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-muted-foreground">
                          {Math.round(topic.confidence * 100)}%
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Sentiment */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge
                      variant={
                        analytics.sentiment.overall === 'positive'
                          ? 'success'
                          : analytics.sentiment.overall === 'negative'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="text-lg px-4 py-2"
                    >
                      {analytics.sentiment.overall}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(analytics.sentiment.confidence * 100)}%
                      confidence
                    </div>
                  </div>

                  {detailed && (
                    <div
                      className="h-20 flex items-end gap-1"
                      role="img"
                      aria-label={`Sentiment timeline showing ${analytics.sentiment.timeline.length} data points with overall ${analytics.sentiment.overall} sentiment`}
                    >
                      {analytics.sentiment.timeline.map((point, index) => (
                        <div
                          key={index}
                          className={cn(
                            'flex-1 rounded-t',
                            point.label === 'positive' && 'bg-green-500',
                            point.label === 'neutral' && 'bg-gray-400',
                            point.label === 'negative' && 'bg-red-500'
                          )}
                          style={{
                            height: `${((point.score + 1) / 2) * 100}%`,
                          }}
                          title={`${point.label}: ${point.score.toFixed(2)}`}
                          role="presentation"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Key Moments */}
              {detailed && analytics.keyMoments.length > 0 && (
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm">Key Moments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {analytics.keyMoments.map((moment, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-2 rounded-lg border"
                      >
                        <Badge
                          variant={
                            moment.type === 'breakthrough'
                              ? 'success'
                              : moment.type === 'decision'
                                ? 'default'
                                : 'secondary'
                          }
                          className="mt-1"
                        >
                          {moment.type}
                        </Badge>
                        <div className="flex-1 text-sm">{moment.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(moment.importance * 100)}%
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Summary */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Conversation Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.summary.keyPoints.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Key Points</h4>
                      <ul className="space-y-1 text-sm">
                        {analytics.summary.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analytics.summary.nextSteps.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Next Steps</h4>
                      <ul className="space-y-1 text-sm">
                        {analytics.summary.nextSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">→</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analytics.summary.openQuestions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">
                        Open Questions
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {analytics.summary.openQuestions.map((question, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">?</span>
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        )
      ) : null}
    </div>
  )
}

ConversationAnalyticsDashboard.displayName = 'ConversationAnalyticsDashboard'
