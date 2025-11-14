/**
 * Clarity Memory - Importance Scoring
 * 
 * Various importance scoring strategies
 */

import type { MemoryItem, ImportanceScorer, ImportanceScore } from '../core/types'
import { getAge } from '../core/memory-item'

/**
 * Auto importance scorer (default)
 * Combines multiple factors
 */
export class AutoImportanceScorer implements ImportanceScorer {
  async score(memory: MemoryItem, context?: any): Promise<ImportanceScore> {
    let score = 0.5 // Base score
    
    // Boost semantic memories
    if (memory.type === 'semantic') {
      score += 0.2
    }
    
    // Boost persistent memories
    if (memory.type === 'persistent') {
      score += 0.15
    }
    
    // Boost memories with high explicit importance
    score += memory.importance * 0.3
    
    // Boost memories with tags (indicates categorization)
    if (memory.tags && memory.tags.length > 0) {
      score += 0.1
    }
    
    // Boost memories with metadata (indicates structure)
    if (memory.metadata && Object.keys(memory.metadata).length > 0) {
      score += 0.05
    }
    
    // Normalize to [0, 1]
    return Math.min(1, Math.max(0, score))
  }
}

/**
 * Time-weighted importance scorer
 * Decays importance over time
 */
export class TimeWeightedScorer implements ImportanceScorer {
  constructor(
    private recencyWeight: number = 0.3,
    private importanceWeight: number = 0.7,
    private halfLife: number = 86400 // 24 hours in seconds
  ) {}

  async score(memory: MemoryItem, context?: any): Promise<ImportanceScore> {
    const age = getAge(memory)
    
    // Calculate recency score (exponential decay)
    const recencyScore = Math.exp(-age / this.halfLife)
    
    // Combine with explicit importance
    const combinedScore = 
      (recencyScore * this.recencyWeight) + 
      (memory.importance * this.importanceWeight)
    
    // Normalize to [0, 1]
    return Math.min(1, Math.max(0, combinedScore))
  }
}

/**
 * Manual importance scorer
 * Uses explicit importance only
 */
export class ManualImportanceScorer implements ImportanceScorer {
  async score(memory: MemoryItem, context?: any): Promise<ImportanceScore> {
    return memory.importance
  }
}

/**
 * Hybrid importance scorer
 * Combines multiple scoring strategies
 */
export class HybridImportanceScorer implements ImportanceScorer {
  constructor(
    private scorers: ImportanceScorer[],
    private weights: number[] = []
  ) {
    // Default to equal weights if not provided
    if (weights.length === 0) {
      this.weights = new Array(scorers.length).fill(1 / scorers.length)
    }
    
    // Normalize weights
    const sum = this.weights.reduce((a, b) => a + b, 0)
    if (sum > 0) {
      this.weights = this.weights.map(w => w / sum)
    }
  }

  async score(memory: MemoryItem, context?: any): Promise<ImportanceScore> {
    const scores = await Promise.all(
      this.scorers.map(scorer => scorer.score(memory, context))
    )
    
    // Weighted average
    let combinedScore = 0
    const minLength = Math.min(scores.length, this.weights.length)
    for (let i = 0; i < minLength; i++) {
      const weight = this.weights[i]
      const score = scores[i]
      if (weight !== undefined && score !== undefined) {
        combinedScore += score * weight
      }
    }
    
    return Math.min(1, Math.max(0, combinedScore))
  }
}

/**
 * Create an importance scorer from configuration
 */
export function createImportanceScorer(
  type: 'auto' | 'manual' | 'time-weighted' | 'hybrid',
  config?: {
    recencyWeight?: number
    importanceWeight?: number
    halfLife?: number
    scorers?: ImportanceScorer[]
    weights?: number[]
  }
): ImportanceScorer {
  switch (type) {
    case 'auto':
      return new AutoImportanceScorer()
    
    case 'manual':
      return new ManualImportanceScorer()
    
    case 'time-weighted':
      return new TimeWeightedScorer(
        config?.recencyWeight,
        config?.importanceWeight,
        config?.halfLife
      )
    
    case 'hybrid':
      if (!config?.scorers) {
        throw new Error('Hybrid scorer requires scorers array')
      }
      return new HybridImportanceScorer(config.scorers, config.weights)
    
    default:
      return new AutoImportanceScorer()
  }
}
