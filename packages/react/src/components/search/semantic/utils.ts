/**
 * Utility functions for semantic search
 */

import type { MatchQuality } from './types'
import { DEFAULT_EMBEDDING_DIM } from './config'

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
      expansions.push(...synonyms[term])
    }
  })

  return [...new Set(expansions)]
}

/**
 * Get match quality label and styling based on score
 */
export function getMatchQuality(
  score: number,
  icons: {
    target: React.ReactNode
    trending: React.ReactNode
    check: React.ReactNode
    lightbulb: React.ReactNode
    search: React.ReactNode
  }
): MatchQuality {
  if (score >= 0.9) {
    return {
      label: 'Excellent',
      color: 'bg-green-500',
      icon: icons.target,
    }
  } else if (score >= 0.8) {
    return {
      label: 'Very Good',
      color: 'bg-emerald-500',
      icon: icons.trending,
    }
  } else if (score >= 0.7) {
    return {
      label: 'Good',
      color: 'bg-blue-500',
      icon: icons.check,
    }
  } else if (score >= 0.6) {
    return {
      label: 'Fair',
      color: 'bg-yellow-500',
      icon: icons.lightbulb,
    }
  }
  return {
    label: 'Partial',
    color: 'bg-orange-500',
    icon: icons.search,
  }
}

/**
 * Generate simple bag-of-words embedding for fallback
 */
export function generateFallbackEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/)
  const embedding = new Array(DEFAULT_EMBEDDING_DIM).fill(0)

  words.forEach((word) => {
    const hash = word.split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0
    }, 0)
    const position = Math.abs(hash) % embedding.length
    embedding[position] += 1
  })

  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map((val) => val / (norm || 1))
}
