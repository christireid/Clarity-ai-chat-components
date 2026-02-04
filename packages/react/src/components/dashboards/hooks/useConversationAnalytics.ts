import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import type { ConversationAnalytics } from '../ConversationAnalyticsDashboard.types'
import {
  extractTopics,
  analyzeSentiment,
  calculateQuality,
  detectKeyMoments,
  generateSummary,
} from '../ConversationAnalyticsDashboard.utils'

export interface UseConversationAnalyticsProps {
  /** Messages to analyze */
  messages: Message[]
  /** Pre-computed analytics (optional) */
  analytics?: ConversationAnalytics
  /** Custom analytics generation function */
  onGenerateAnalytics?: (messages: Message[]) => Promise<ConversationAnalytics>
  /** Enable automatic generation */
  autoGenerate?: boolean
  /** Update interval in milliseconds */
  updateInterval?: number
  /** Callback when analytics are generated */
  onAnalyticsGenerated?: (analytics: ConversationAnalytics) => void
  /** External loading state */
  isLoading?: boolean
  /** External error */
  externalError?: Error | string | null
}

export interface UseConversationAnalyticsReturn {
  /** Current analytics data */
  analytics: ConversationAnalytics | null
  /** Whether analytics are being generated */
  isGenerating: boolean
  /** Combined loading state (external or internal) */
  isLoading: boolean
  /** Error message (if any) */
  error: string | null
  /** Display error (external takes precedence) */
  displayError: string | null
  /** Manually trigger analytics generation */
  generateAnalytics: () => Promise<void>
}

/**
 * Custom hook for conversation analytics
 *
 * Handles analytics state management, generation, and auto-update logic.
 */
export function useConversationAnalytics({
  messages,
  analytics: externalAnalytics,
  onGenerateAnalytics,
  autoGenerate = false,
  updateInterval = 30000,
  onAnalyticsGenerated,
  isLoading: externalLoading = false,
  externalError = null,
}: UseConversationAnalyticsProps): UseConversationAnalyticsReturn {
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Analytics generation error:', err)
      }
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

  return {
    analytics,
    isGenerating,
    isLoading,
    error,
    displayError,
    generateAnalytics,
  }
}
