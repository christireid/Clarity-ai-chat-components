/**
 * Type definitions for ConversationAnalyticsDashboard
 *
 * This file contains all type interfaces and enums used by the analytics dashboard.
 */

import type { Message } from '@clarity-chat/types'

/**
 * Topic cluster identified in conversation
 */
export interface TopicCluster {
  /** Topic name */
  name: string
  /** Confidence score (0-1) */
  confidence: number
  /** Number of messages related to this topic */
  messageCount: number
  /** Keywords associated with this topic */
  keywords: string[]
  /** Representative message snippets (optional) */
  representativeMessages?: string[]
}

/**
 * Sentiment timeline data point
 */
export interface SentimentPoint {
  /** Timestamp of the sentiment point */
  timestamp: number
  /** Sentiment score (-1 to 1) */
  score: number
  /** Sentiment classification */
  label: 'positive' | 'neutral' | 'negative'
}

/**
 * Conversation quality metrics
 */
export interface QualityMetrics {
  /** Overall quality score (0-100) */
  score: number
  /** Individual quality factors */
  factors: {
    /** Engagement level (0-100) */
    engagement: number
    /** Coherence of conversation (0-100) */
    coherence: number
    /** Depth of discussion (0-100) */
    depth: number
    /** Efficiency of conversation (0-100) */
    efficiency: number
  }
}

/**
 * Key moment types in conversation
 */
export type KeyMomentType =
  | 'breakthrough'
  | 'confusion'
  | 'question'
  | 'decision'
  | 'insight'

/**
 * Key moment in conversation
 */
export interface KeyMoment {
  /** Timestamp when the moment occurred */
  timestamp: number
  /** ID of the message containing this moment */
  messageId: string
  /** Type of key moment */
  type: KeyMomentType
  /** Description of the moment */
  description: string
  /** Importance score (0-1) */
  importance: number
}

/**
 * Conversation summary
 */
export interface ConversationSummary {
  /** Key discussion points */
  keyPoints: string[]
  /** Action items or next steps */
  nextSteps: string[]
  /** Unresolved questions */
  openQuestions: string[]
  /** Decisions made (optional) */
  decisions?: string[]
  /** Action items (optional) */
  actionItems?: string[]
}

/**
 * Complete conversation analytics
 */
export interface ConversationAnalytics {
  /** Identified topics */
  topics: TopicCluster[]
  /** Sentiment analysis */
  sentiment: {
    /** Sentiment over time */
    timeline: SentimentPoint[]
    /** Overall sentiment classification */
    overall: 'positive' | 'neutral' | 'negative'
    /** Confidence in overall sentiment (0-1) */
    confidence: number
  }
  /** Quality metrics */
  quality: QualityMetrics
  /** Key moments identified */
  keyMoments: KeyMoment[]
  /** Conversation summary */
  summary: ConversationSummary
  /** Conversation metadata */
  metadata: {
    /** Total number of messages */
    totalMessages: number
    /** Conversation duration in milliseconds */
    duration: number
    /** Number of participants */
    participantCount: number
    /** Average message length in characters */
    averageMessageLength: number
  }
}

/**
 * Props for ConversationAnalyticsDashboard component
 */
export interface ConversationAnalyticsDashboardProps {
  /** Messages to analyze */
  messages: Message[]
  /** Pre-computed analytics data (optional) */
  analytics?: ConversationAnalytics
  /** Custom analytics generation function */
  onGenerateAnalytics?: (messages: Message[]) => Promise<ConversationAnalytics>
  /** Enable automatic analytics generation */
  autoGenerate?: boolean
  /** Update interval for auto-generation in milliseconds */
  updateInterval?: number
  /** Callback when analytics are generated */
  onAnalyticsGenerated?: (analytics: ConversationAnalytics) => void
  /** Show detailed breakdown */
  detailed?: boolean
  /** Additional CSS classes */
  className?: string
  /** External loading state control */
  isLoading?: boolean
  /** External error state control */
  externalError?: Error | string | null
}
