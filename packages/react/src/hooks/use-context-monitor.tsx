'use client'

import * as React from 'react'
import { estimateTokens } from '../utils/tokenization/estimator'

/**
 * Context utilization breakdown by category
 */
export interface ContextBreakdown {
  /** System prompt tokens */
  systemPrompt: number
  /** Conversation history tokens */
  conversationHistory: number
  /** Retrieved context (RAG) tokens */
  retrievedContext: number
  /** Current user message tokens */
  userMessage: number
  /** Reserved for response tokens */
  reserved: number
}

/**
 * Efficiency metrics for context usage
 */
export interface ContextEfficiency {
  /** Information density: useful vs filler tokens (0-1) */
  informationDensity: number
  /** Recency score: how recent is the context (0-1) */
  recencyScore: number
  /** Relevance score: semantic relevance to query (0-1) */
  relevanceScore: number
}

/**
 * Full context utilization metrics
 */
export interface ContextUtilization {
  /** Total tokens currently used */
  totalTokens: number
  /** Maximum context window size */
  maxTokens: number
  /** Utilization as percentage (0-100) */
  utilizationPercent: number
  /** Token breakdown by category */
  breakdown: ContextBreakdown
  /** Efficiency metrics */
  efficiency: ContextEfficiency
  /** Timestamp of analysis */
  timestamp: number
}

/**
 * Warning levels
 */
export type WarningLevel = 'info' | 'warning' | 'critical'

/**
 * Warning types
 */
export type WarningType = 'utilization' | 'efficiency' | 'staleness' | 'density'

/**
 * Context warning with recommendation
 */
export interface ContextWarning {
  /** Warning severity */
  level: WarningLevel
  /** Warning category */
  type: WarningType
  /** Human-readable message */
  message: string
  /** Actionable recommendation */
  recommendation: string
  /** Timestamp */
  timestamp: number
}

/**
 * Optimization recommendation
 */
export interface OptimizationRecommendation {
  /** Recommendation ID */
  id: string
  /** Priority (1 = highest) */
  priority: number
  /** Description */
  description: string
  /** Estimated savings in tokens */
  estimatedSavings: number
  /** Action to take */
  action: 'compress' | 'summarize' | 'archive' | 'prune' | 'switch-model'
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Message format for context analysis
 */
export interface ContextMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  /** Timestamp when message was created */
  timestamp?: number
  /** Pre-computed token count */
  tokens?: number
  /** Whether this is retrieved context (RAG) */
  isRetrievedContext?: boolean
  /** Explicit importance marker */
  importance?: 'high' | 'normal' | 'low'
}

/**
 * Context monitor options
 */
export interface UseContextMonitorOptions {
  /** Maximum context window tokens */
  maxTokens?: number
  /** Tokens reserved for response */
  reservedTokens?: number
  /** Warning threshold (default 0.8 = 80%) */
  warningThreshold?: number
  /** Critical threshold (default 0.95 = 95%) */
  criticalThreshold?: number
  /** Keep utilization history for analysis */
  trackHistory?: boolean
  /** Maximum history entries to keep */
  maxHistoryEntries?: number
  /** Model name for accurate token estimation */
  model?: string
  /** Staleness threshold in minutes */
  stalenessThresholdMinutes?: number
}

/**
 * Information density weights for different content types
 */
const DENSITY_WEIGHTS = {
  // High information content
  codeBlock: 0.9,
  question: 0.95,
  number: 0.85,
  namedEntity: 0.9,
  url: 0.7,

  // Low information content
  commonWord: 0.2,
  filler: 0.1,
  punctuation: 0.15,
  whitespace: 0.05,
}

/**
 * Common filler words and phrases
 */
const FILLER_PATTERNS = [
  /\b(um|uh|like|you know|basically|actually|literally)\b/gi,
  /\b(very|really|quite|pretty much)\b/gi,
  /\b(I think|I believe|I feel like|I mean)\b/gi,
]

/**
 * Question indicators
 */
const QUESTION_PATTERNS = [
  /\?$/,
  /^(what|who|where|when|why|how|can|could|would|should|is|are|do|does|did|have|has)/i,
]

/**
 * Calculate information density for text
 */
function calculateInformationDensity(text: string): number {
  if (!text || text.length === 0) return 0

  const words = text.split(/\s+/).filter(w => w.length > 0)
  if (words.length === 0) return 0

  let usefulWeight = 0
  let totalWeight = 0

  for (const word of words) {
    let weight = 0.5 // Default neutral weight

    // Code indicators
    if (/^[{}[\]()=>]$/.test(word) || /^(function|const|let|var|if|else|return|import|export)$/i.test(word)) {
      weight = DENSITY_WEIGHTS.codeBlock
    }
    // Numbers
    else if (/^\d+\.?\d*$/.test(word)) {
      weight = DENSITY_WEIGHTS.number
    }
    // URLs
    else if (/^https?:\/\//.test(word)) {
      weight = DENSITY_WEIGHTS.url
    }
    // Named entities (capitalized words)
    else if (/^[A-Z][a-z]+/.test(word) && word.length > 2) {
      weight = DENSITY_WEIGHTS.namedEntity
    }
    // Common/filler words
    else if (FILLER_PATTERNS.some(p => p.test(word))) {
      weight = DENSITY_WEIGHTS.filler
    }
    // Short common words
    else if (word.length <= 2) {
      weight = DENSITY_WEIGHTS.commonWord
    }

    usefulWeight += weight
    totalWeight += 1
  }

  // Boost for questions
  if (QUESTION_PATTERNS.some(p => p.test(text))) {
    usefulWeight += 0.2 * totalWeight
  }

  // Check for code blocks
  if (text.includes('```') || text.includes('function ') || text.includes('const ')) {
    usefulWeight += 0.1 * totalWeight
  }

  return Math.min(1, usefulWeight / totalWeight)
}

/**
 * Calculate recency score with exponential decay
 */
function calculateRecencyScore(
  messages: ContextMessage[],
  currentTime: number,
  halfLifeMinutes: number = 30
): number {
  if (messages.length === 0) return 1

  const halfLifeMs = halfLifeMinutes * 60 * 1000
  let totalScore = 0
  let totalWeight = 0

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    const msgTime = msg.timestamp ?? currentTime
    const age = currentTime - msgTime

    // Exponential decay: score = e^(-age / halfLife)
    const recency = Math.exp(-age / halfLifeMs)

    // Weight by message length (longer messages matter more)
    const weight = Math.log(1 + (msg.tokens ?? estimateTokens(msg.content)))

    totalScore += recency * weight
    totalWeight += weight
  }

  return totalWeight > 0 ? totalScore / totalWeight : 1
}

/**
 * Analyze messages and return context utilization
 */
function analyzeContext(
  messages: ContextMessage[],
  options: Required<UseContextMonitorOptions>,
  currentTime: number = Date.now()
): ContextUtilization {
  const breakdown: ContextBreakdown = {
    systemPrompt: 0,
    conversationHistory: 0,
    retrievedContext: 0,
    userMessage: 0,
    reserved: options.reservedTokens,
  }

  let totalDensity = 0
  let densityCount = 0

  // Calculate breakdown
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    const tokens = msg.tokens ?? estimateTokens(msg.content, options.model)

    if (msg.role === 'system') {
      breakdown.systemPrompt += tokens
    } else if (msg.isRetrievedContext) {
      breakdown.retrievedContext += tokens
    } else if (msg.role === 'user' && i === messages.length - 1) {
      breakdown.userMessage += tokens
    } else {
      breakdown.conversationHistory += tokens
    }

    // Calculate density
    const density = calculateInformationDensity(msg.content)
    totalDensity += density * tokens
    densityCount += tokens
  }

  const totalTokens =
    breakdown.systemPrompt +
    breakdown.conversationHistory +
    breakdown.retrievedContext +
    breakdown.userMessage

  const utilizationPercent = (totalTokens / options.maxTokens) * 100

  const efficiency: ContextEfficiency = {
    informationDensity: densityCount > 0 ? totalDensity / densityCount : 1,
    recencyScore: calculateRecencyScore(messages, currentTime),
    relevanceScore: 0.7, // Placeholder - would need semantic similarity to compute properly
  }

  return {
    totalTokens,
    maxTokens: options.maxTokens,
    utilizationPercent: Math.min(100, utilizationPercent),
    breakdown,
    efficiency,
    timestamp: currentTime,
  }
}

/**
 * Generate warnings based on context analysis
 */
function generateWarnings(
  utilization: ContextUtilization,
  options: Required<UseContextMonitorOptions>
): ContextWarning[] {
  const warnings: ContextWarning[] = []
  const now = Date.now()

  // Utilization warnings
  if (utilization.utilizationPercent >= options.criticalThreshold * 100) {
    warnings.push({
      level: 'critical',
      type: 'utilization',
      message: `Context window at ${utilization.utilizationPercent.toFixed(1)}% capacity`,
      recommendation: 'Immediately summarize or prune conversation history to avoid truncation',
      timestamp: now,
    })
  } else if (utilization.utilizationPercent >= options.warningThreshold * 100) {
    warnings.push({
      level: 'warning',
      type: 'utilization',
      message: `Context window at ${utilization.utilizationPercent.toFixed(1)}% capacity`,
      recommendation: 'Consider summarizing older messages to free up space',
      timestamp: now,
    })
  }

  // Information density warnings
  if (utilization.efficiency.informationDensity < 0.3) {
    warnings.push({
      level: 'info',
      type: 'density',
      message: `Low information density (${(utilization.efficiency.informationDensity * 100).toFixed(0)}%)`,
      recommendation: 'Enable prompt compression to remove filler content',
      timestamp: now,
    })
  }

  // Recency/staleness warnings
  if (utilization.efficiency.recencyScore < 0.3) {
    warnings.push({
      level: 'info',
      type: 'staleness',
      message: 'Conversation context is getting stale',
      recommendation: 'Consider archiving old context to vector store',
      timestamp: now,
    })
  }

  // System prompt consuming too much context
  const systemPromptPercent = (utilization.breakdown.systemPrompt / utilization.maxTokens) * 100
  if (systemPromptPercent > 40) {
    warnings.push({
      level: 'warning',
      type: 'efficiency',
      message: `System prompt consuming ${systemPromptPercent.toFixed(0)}% of context`,
      recommendation: 'Consider compressing or splitting system prompt',
      timestamp: now,
    })
  }

  return warnings
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(
  utilization: ContextUtilization,
  options: Required<UseContextMonitorOptions>
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = []

  // High utilization - suggest summarization
  if (utilization.utilizationPercent > 70) {
    const potentialSavings = Math.floor(utilization.breakdown.conversationHistory * 0.7)
    if (potentialSavings > 500) {
      recommendations.push({
        id: 'summarize-history',
        priority: 1,
        description: 'Summarize conversation history to reduce token usage',
        estimatedSavings: potentialSavings,
        action: 'summarize',
        metadata: {
          historyTokens: utilization.breakdown.conversationHistory,
          compressionRatio: 0.3,
        },
      })
    }
  }

  // Low density - suggest compression
  if (utilization.efficiency.informationDensity < 0.5) {
    const potentialSavings = Math.floor(
      utilization.totalTokens * (1 - utilization.efficiency.informationDensity) * 0.5
    )
    if (potentialSavings > 200) {
      recommendations.push({
        id: 'compress-content',
        priority: 2,
        description: 'Enable prompt compression to remove low-value content',
        estimatedSavings: potentialSavings,
        action: 'compress',
        metadata: {
          currentDensity: utilization.efficiency.informationDensity,
          targetDensity: 0.7,
        },
      })
    }
  }

  // Stale content - suggest archiving
  if (utilization.efficiency.recencyScore < 0.4 && utilization.breakdown.conversationHistory > 1000) {
    recommendations.push({
      id: 'archive-old-context',
      priority: 3,
      description: 'Archive old context to vector store for retrieval when needed',
      estimatedSavings: Math.floor(utilization.breakdown.conversationHistory * 0.5),
      action: 'archive',
      metadata: {
        recencyScore: utilization.efficiency.recencyScore,
      },
    })
  }

  // Critical utilization - suggest switching models
  if (utilization.utilizationPercent > 90) {
    recommendations.push({
      id: 'switch-model',
      priority: 1,
      description: 'Switch to a model with larger context window',
      estimatedSavings: 0,
      action: 'switch-model',
      metadata: {
        currentMax: utilization.maxTokens,
        suggestedModels: ['claude-3-5-sonnet', 'gemini-1.5-pro', 'gpt-4-turbo'],
      },
    })
  }

  // Sort by priority
  return recommendations.sort((a, b) => a.priority - b.priority)
}

/**
 * Context Utilization Monitor Hook
 *
 * Provides visibility into context window usage, efficiency metrics,
 * warnings, and optimization recommendations.
 *
 * @example
 * ```tsx
 * const {
 *   utilization,
 *   warnings,
 *   recommendations,
 *   analyzeMessages,
 * } = useContextMonitor({
 *   maxTokens: 128000,
 *   reservedTokens: 4096,
 *   warningThreshold: 0.8,
 * })
 *
 * // Analyze current context
 * const analysis = analyzeMessages(messages)
 *
 * // Display utilization
 * <ContextBar utilization={analysis.utilizationPercent} />
 *
 * // Show warnings
 * {warnings.map(w => (
 *   <Alert severity={w.level}>{w.message}</Alert>
 * ))}
 *
 * // Apply recommendations
 * {recommendations.map(r => (
 *   <Button onClick={() => applyRecommendation(r.action)}>
 *     {r.description} (save ~{r.estimatedSavings} tokens)
 *   </Button>
 * ))}
 * ```
 */
export function useContextMonitor(
  options: UseContextMonitorOptions = {}
): {
  /** Current context utilization (after last analysis) */
  utilization: ContextUtilization | null
  /** Current warnings */
  warnings: ContextWarning[]
  /** Optimization recommendations */
  recommendations: OptimizationRecommendation[]
  /** Utilization history (if tracking enabled) */
  history: ContextUtilization[]
  /** Analyze messages and update state */
  analyzeMessages: (messages: ContextMessage[]) => ContextUtilization
  /** Get utilization without updating state */
  getUtilization: (messages: ContextMessage[]) => ContextUtilization
  /** Clear history */
  clearHistory: () => void
  /** Check if context is at warning level */
  isWarning: boolean
  /** Check if context is at critical level */
  isCritical: boolean
} {
  // Memoize resolved options to prevent unnecessary re-renders
  const resolvedOptions = React.useMemo<Required<UseContextMonitorOptions>>(
    () => ({
      maxTokens: options.maxTokens ?? 128000,
      reservedTokens: options.reservedTokens ?? 4096,
      warningThreshold: options.warningThreshold ?? 0.8,
      criticalThreshold: options.criticalThreshold ?? 0.95,
      trackHistory: options.trackHistory ?? false,
      maxHistoryEntries: options.maxHistoryEntries ?? 100,
      model: options.model ?? '',
      stalenessThresholdMinutes: options.stalenessThresholdMinutes ?? 60,
    }),
    [
      options.maxTokens,
      options.reservedTokens,
      options.warningThreshold,
      options.criticalThreshold,
      options.trackHistory,
      options.maxHistoryEntries,
      options.model,
      options.stalenessThresholdMinutes,
    ]
  )

  const [utilization, setUtilization] = React.useState<ContextUtilization | null>(null)
  const [warnings, setWarnings] = React.useState<ContextWarning[]>([])
  const [recommendations, setRecommendations] = React.useState<OptimizationRecommendation[]>([])
  const [history, setHistory] = React.useState<ContextUtilization[]>([])

  /**
   * Analyze messages and update all state
   */
  const analyzeMessages = React.useCallback(
    (messages: ContextMessage[]): ContextUtilization => {
      const result = analyzeContext(messages, resolvedOptions)

      setUtilization(result)
      setWarnings(generateWarnings(result, resolvedOptions))
      setRecommendations(generateRecommendations(result, resolvedOptions))

      if (resolvedOptions.trackHistory) {
        setHistory(prev => {
          const updated = [...prev, result]
          if (updated.length > resolvedOptions.maxHistoryEntries) {
            return updated.slice(-resolvedOptions.maxHistoryEntries)
          }
          return updated
        })
      }

      return result
    },
    [resolvedOptions]
  )

  /**
   * Get utilization without updating state
   */
  const getUtilization = React.useCallback(
    (messages: ContextMessage[]): ContextUtilization => {
      return analyzeContext(messages, resolvedOptions)
    },
    [resolvedOptions]
  )

  /**
   * Clear history
   */
  const clearHistory = React.useCallback(() => {
    setHistory([])
  }, [])

  // Derived state
  const isWarning = utilization
    ? utilization.utilizationPercent >= resolvedOptions.warningThreshold * 100
    : false

  const isCritical = utilization
    ? utilization.utilizationPercent >= resolvedOptions.criticalThreshold * 100
    : false

  return {
    utilization,
    warnings,
    recommendations,
    history,
    analyzeMessages,
    getUtilization,
    clearHistory,
    isWarning,
    isCritical,
  }
}

/**
 * Get utilization color for UI components
 */
export function getUtilizationColor(percent: number): 'green' | 'yellow' | 'red' {
  if (percent < 60) return 'green'
  if (percent < 80) return 'yellow'
  return 'red'
}

/**
 * Format token count for display
 */
export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) return tokens.toString()
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`
  return `${(tokens / 1000000).toFixed(2)}M`
}

/**
 * Create a context monitoring integration helper
 * for use with other optimization hooks
 */
export function createContextMonitorIntegration(
  monitor: ReturnType<typeof useContextMonitor>
): {
  /** Check context before sending */
  canSendMessage: (estimatedTokens: number) => boolean
  /** Get context health summary */
  getHealthSummary: () => {
    status: 'healthy' | 'warning' | 'critical'
    utilization: number
    topWarning?: string
    topRecommendation?: string
  }
} {
  return {
    canSendMessage: (estimatedTokens: number) => {
      if (!monitor.utilization) return true
      const projected = monitor.utilization.totalTokens + estimatedTokens
      return projected < monitor.utilization.maxTokens * 0.95
    },

    getHealthSummary: () => {
      const status = monitor.isCritical
        ? 'critical'
        : monitor.isWarning
          ? 'warning'
          : 'healthy'

      return {
        status,
        utilization: monitor.utilization?.utilizationPercent ?? 0,
        topWarning: monitor.warnings[0]?.message,
        topRecommendation: monitor.recommendations[0]?.description,
      }
    },
  }
}
