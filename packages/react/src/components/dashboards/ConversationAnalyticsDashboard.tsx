'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  cn,
} from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'
import type { ConversationAnalyticsDashboardProps } from './ConversationAnalyticsDashboard.types'
import { useConversationAnalytics } from './hooks/useConversationAnalytics'
import {
  QualityScoreCard,
  TopicsCard,
  SentimentCard,
  KeyMomentsCard,
  SummaryCard,
} from './components'

// Re-export types
export type {
  TopicCluster,
  SentimentPoint,
  QualityMetrics,
  KeyMoment,
  KeyMomentType,
  ConversationSummary,
  ConversationAnalytics,
  ConversationAnalyticsDashboardProps,
} from './ConversationAnalyticsDashboard.types'

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

  const {
    analytics,
    isGenerating,
    isLoading,
    displayError,
    generateAnalytics,
  } = useConversationAnalytics({
    messages,
    analytics: externalAnalytics,
    onGenerateAnalytics,
    autoGenerate,
    updateInterval,
    onAnalyticsGenerated,
    isLoading: externalLoading,
    externalError,
  })

  // Empty state
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
        <CardHeader className="">
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

      {/* Error state */}
      {displayError && (
        <Card className="shadow-sm border-destructive">
          <CardContent className="p-4 text-sm text-destructive">
            {displayError}
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
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
            <QualityScoreCard
              quality={analytics.quality}
              prefersReducedMotion={prefersReducedMotion}
            />
            <TopicsCard
              topics={analytics.topics}
              prefersReducedMotion={prefersReducedMotion}
            />
            <SentimentCard
              sentiment={analytics.sentiment}
              detailed={detailed}
            />
            {detailed && (
              <KeyMomentsCard keyMoments={analytics.keyMoments} />
            )}
            <SummaryCard summary={analytics.summary} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="analytics"
              {...ANIMATION_PRESETS.slideUp}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <QualityScoreCard
                quality={analytics.quality}
                prefersReducedMotion={prefersReducedMotion}
              />
              <TopicsCard
                topics={analytics.topics}
                prefersReducedMotion={prefersReducedMotion}
              />
              <SentimentCard
                sentiment={analytics.sentiment}
                detailed={detailed}
              />
              {detailed && (
                <KeyMomentsCard keyMoments={analytics.keyMoments} />
              )}
              <SummaryCard summary={analytics.summary} />
            </motion.div>
          </AnimatePresence>
        )
      ) : null}
    </div>
  )
}

ConversationAnalyticsDashboard.displayName = 'ConversationAnalyticsDashboard'
