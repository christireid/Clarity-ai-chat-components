/**
 * Utility functions for Advanced Semantic Message Search
 *
 * Extracted from AdvancedMessageSearchSemantic.tsx for better maintainability
 */

import type { Message } from '@clarity-chat/types'

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    const ai = a[i]!
    const bi = b[i]!
    dotProduct += ai * bi
    normA += ai * ai
    normB += bi * bi
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

/**
 * Escape special regex characters to prevent ReDoS
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Simple keyword search with TF-IDF-like scoring
 */
export function keywordSearch(
  query: string,
  messages: Message[]
): Map<string, number> {
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2)
  const scores = new Map<string, number>()
  const queryLower = query.toLowerCase()

  messages.forEach((message) => {
    const content = message.content.toLowerCase()
    let score = 0

    queryTerms.forEach((term) => {
      // Escape special regex characters to prevent ReDoS
      const escapedTerm = escapeRegex(term)
      const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi')
      const matches = content.match(regex)
      if (matches) {
        score += Math.log(1 + matches.length)
      }

      if (content.includes(queryLower)) {
        score += 5
      }
    })

    if (score > 0) {
      scores.set(message.id, score)
    }
  })

  return scores
}

/**
 * Expand query with synonyms and related terms
 */
export function expandQuery(query: string): string[] {
  const synonyms: Record<string, string[]> = {
    error: ['bug', 'issue', 'problem', 'failure', 'exception', 'crash'],
    fix: ['solve', 'repair', 'correct', 'patch', 'resolve', 'debug'],
    code: ['function', 'script', 'program', 'implementation', 'snippet'],
    explain: ['describe', 'clarify', 'elaborate', 'detail', 'break down'],
    help: ['assist', 'support', 'aid', 'guide', 'show'],
    create: ['make', 'build', 'generate', 'construct', 'develop'],
    improve: ['enhance', 'optimize', 'refactor', 'upgrade', 'better'],
    remove: ['delete', 'eliminate', 'drop', 'clear', 'purge'],
    add: ['include', 'insert', 'append', 'attach', 'incorporate'],
    update: ['modify', 'change', 'edit', 'alter', 'revise'],
  }

  const expansions = [query]
  const terms = query.toLowerCase().split(/\s+/)

  terms.forEach((term) => {
    if (synonyms[term]) {
      expansions.push(...synonyms[term]!)
    }
  })

  return [...new Set(expansions)]
}

/**
 * Get match quality metrics
 */
export function getMatchQualityMetrics(score: number): {
  label: string
  color: string
} {
  if (score >= 0.9) {
    return {
      label: 'Excellent',
      color: 'bg-green-500',
    }
  } else if (score >= 0.8) {
    return {
      label: 'Very Good',
      color: 'bg-emerald-500',
    }
  } else if (score >= 0.7) {
    return {
      label: 'Good',
      color: 'bg-blue-500',
    }
  } else if (score >= 0.6) {
    return {
      label: 'Fair',
      color: 'bg-yellow-500',
    }
  }
  return {
    label: 'Partial',
    color: 'bg-orange-500',
  }
}
