/**
 * Context Utilities for PromptComposer
 *
 * Utilities for managing context items with progressive expansion
 * and token-aware relevance ranking.
 */

import { estimateTokens } from '../../utils/tokenization/estimator'
import type {
  ContextItem,
  ContextRelevanceScore,
  ContextType,
  DEFAULT_TOKEN_BUDGETS,
} from './types'

// ============================================================================
// Token Counting
// ============================================================================

/**
 * Calculate tokens for a context item at different levels
 */
export function calculateContextTokens(item: Partial<ContextItem>): {
  summary: number
  preview: number
  full: number
} {
  return {
    summary: item.summary ? estimateTokens(item.summary) : 0,
    preview: item.preview ? estimateTokens(item.preview) : 0,
    full: item.full ? estimateTokens(item.full) : 0,
  }
}

/**
 * Create a context item with automatic token calculation
 */
export function createContextItem(
  data: Omit<ContextItem, 'tokens'>
): ContextItem {
  const tokens = calculateContextTokens(data)

  return {
    ...data,
    tokens,
  }
}

// ============================================================================
// Progressive Expansion
// ============================================================================

/**
 * Get token budget for a context type
 */
export function getTokenBudget(
  type: ContextType,
  budgets: typeof DEFAULT_TOKEN_BUDGETS
) {
  return budgets[type]
}

/**
 * Check if context item should auto-expand based on message content
 */
export function shouldAutoExpand(
  item: ContextItem,
  message: string
): boolean {
  if (item.autoExpand === false) return false
  if (item.autoExpand === true) return true

  // Auto-expand if directly mentioned in message
  const directMention = message.toLowerCase().includes(item.label.toLowerCase())
  if (directMention) return true

  // Auto-expand if high relevance
  if (item.relevance && item.relevance > 0.7) return true

  return false
}

/**
 * Build prompt with progressive context expansion
 */
export interface BuildPromptOptions {
  message: string
  contextItems: ContextItem[]
  maxTokens: number
}

export interface BuildPromptResult {
  prompt: string
  totalTokens: number
  itemsIncluded: Array<{
    id: string
    level: 'summary' | 'preview' | 'full'
    tokens: number
  }>
}

export function buildPromptWithContext(
  options: BuildPromptOptions
): BuildPromptResult {
  const { message, contextItems, maxTokens } = options

  let prompt = message
  let totalTokens = estimateTokens(message)
  const itemsIncluded: BuildPromptResult['itemsIncluded'] = []

  // Phase 1: Add all summaries (lightweight)
  for (const item of contextItems) {
    if (totalTokens + item.tokens.summary < maxTokens) {
      prompt += `\n\nContext: ${item.summary}`
      totalTokens += item.tokens.summary
      itemsIncluded.push({
        id: item.id,
        level: 'summary',
        tokens: item.tokens.summary,
      })
    }
  }

  // Phase 2: Add previews for relevant items (if budget allows)
  const relevantItems = rankByRelevance(contextItems, message)
  for (const item of relevantItems) {
    // Skip if no preview or already at full
    if (!item.preview) continue

    const previewTokens = item.tokens.preview - item.tokens.summary // Additional tokens for preview
    if (totalTokens + previewTokens < maxTokens) {
      // Replace summary with preview in prompt
      prompt = prompt.replace(
        `Context: ${item.summary}`,
        `Context: ${item.preview}`
      )
      totalTokens += previewTokens

      // Update itemsIncluded
      const idx = itemsIncluded.findIndex((i) => i.id === item.id)
      if (idx !== -1) {
        itemsIncluded[idx] = {
          id: item.id,
          level: 'preview',
          tokens: item.tokens.preview,
        }
      }
    }
  }

  // Phase 3: Expand to full for auto-expand items
  for (const item of relevantItems) {
    if (!shouldAutoExpand(item, message)) continue
    if (!item.full) continue

    const fullTokens = item.tokens.full - item.tokens.preview // Additional tokens for full
    if (totalTokens + fullTokens < maxTokens) {
      // Replace preview with full in prompt
      const currentContent = item.preview || item.summary
      prompt = prompt.replace(`Context: ${currentContent}`, `Context: ${item.full}`)
      totalTokens += fullTokens

      // Update itemsIncluded
      const idx = itemsIncluded.findIndex((i) => i.id === item.id)
      if (idx !== -1) {
        itemsIncluded[idx] = {
          id: item.id,
          level: 'full',
          tokens: item.tokens.full,
        }
      }
    }
  }

  return {
    prompt,
    totalTokens,
    itemsIncluded,
  }
}

// ============================================================================
// Relevance Ranking
// ============================================================================

/**
 * Extract keywords from text for relevance matching
 */
function extractKeywords(text: string): string[] {
  // Simple keyword extraction (can be enhanced with NLP)
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3) // Filter out short words
    .slice(0, 20) // Limit to 20 keywords
}

/**
 * Rank context items by relevance to message
 */
export function rankByRelevance(
  contextItems: ContextItem[],
  message: string
): ContextItem[] {
  const scores: ContextRelevanceScore[] = contextItems.map((item) => {
    let score = 0
    const reasons: string[] = []

    // 1. Direct mention in message (+0.5)
    if (message.toLowerCase().includes(item.label.toLowerCase())) {
      score += 0.5
      reasons.push('directly mentioned')
    }

    // 2. Related keywords (+0.3)
    const messageKeywords = extractKeywords(message)
    const itemKeywords = extractKeywords(item.summary)
    const overlap = messageKeywords.filter((k) => itemKeywords.includes(k))
    if (overlap.length > 0) {
      const keywordScore = 0.3 * (overlap.length / messageKeywords.length)
      score += keywordScore
      reasons.push(`${overlap.length} keyword matches`)
    }

    // 3. Recently accessed (+0.2)
    if (item.lastAccessed) {
      const minutesAgo = (Date.now() - item.lastAccessed) / 60000
      if (minutesAgo < 5) {
        score += 0.2
        reasons.push('recently accessed')
      }
    }

    // 4. Use existing relevance score if set
    if (item.relevance !== undefined) {
      score = Math.max(score, item.relevance)
    }

    // 5. Priority boost
    if (item.priority !== undefined) {
      score += item.priority / 1000 // Small boost from priority
    }

    return {
      item,
      score: Math.min(score, 1),
      reason: reasons.join(', '),
    }
  })

  return scores
    .sort((a, b) => b.score - a.score)
    .map((s) => ({ ...s.item, relevance: s.score }))
}

// ============================================================================
// Context Search
// ============================================================================

/**
 * Fuzzy match for context search
 */
export function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase()
  const t = target.toLowerCase()

  // Simple substring match
  if (t.includes(q)) return true

  // Character-by-character fuzzy match
  let qIndex = 0
  for (let i = 0; i < t.length && qIndex < q.length; i++) {
    if (t[i] === q[qIndex]) {
      qIndex++
    }
  }

  return qIndex === q.length
}

/**
 * Filter context items by search query
 */
export function filterContextItems(
  items: ContextItem[],
  query: string,
  useFuzzy = true
): ContextItem[] {
  if (!query) return items

  const matcher = useFuzzy ? fuzzyMatch : (q: string, t: string) => t.toLowerCase().includes(q.toLowerCase())

  return items.filter(
    (item) =>
      matcher(query, item.label) ||
      (item.description && matcher(query, item.description))
  )
}

// ============================================================================
// Token Savings Calculation
// ============================================================================

export interface TokenSavings {
  traditional: number // Token usage with traditional approach (full context)
  clarity: number // Token usage with Clarity's progressive approach
  saved: number // Tokens saved
  savedPercentage: number // Percentage saved (0-100)
  costSaved: number // Cost saved in dollars (assuming $10/1M tokens)
}

/**
 * Calculate token savings from progressive expansion
 */
export function calculateTokenSavings(
  contextItems: ContextItem[],
  itemsIncluded: BuildPromptResult['itemsIncluded']
): TokenSavings {
  // Traditional approach: Send full context for all items
  const traditional = contextItems.reduce(
    (sum, item) => sum + (item.tokens.full || item.tokens.preview || item.tokens.summary),
    0
  )

  // Clarity approach: Only send what was included
  const clarity = itemsIncluded.reduce((sum, item) => sum + item.tokens, 0)

  const saved = traditional - clarity
  const savedPercentage = traditional > 0 ? (saved / traditional) * 100 : 0
  const costSaved = (saved / 1_000_000) * 10 // $10 per 1M tokens

  return {
    traditional,
    clarity,
    saved,
    savedPercentage,
    costSaved,
  }
}
