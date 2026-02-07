/**
 * ComplexityAnalyzer - Prompt complexity scoring for model routing
 *
 * Analyzes prompts to determine their complexity and recommend
 * appropriate model tiers for cost-effective processing.
 *
 * This is the canonical, full-featured complexity analysis implementation
 * in the monorepo. It provides:
 *   - Weighted multi-factor scoring (code, multi-step, reasoning, domain, length)
 *   - 4-level classification (Low / Medium / High / Critical)
 *   - Numeric score (0-1) with configurable thresholds and weights
 *   - Confidence estimation
 *   - Model tier recommendation (small / medium / large / premium)
 *
 * RELATED IMPLEMENTATIONS (for awareness and future consolidation):
 *
 *   1. @clarity-chat/ai-infrastructure `classifyQueryComplexity()`
 *      (packages/ai-infrastructure/src/streaming/provider-streaming.ts)
 *      - Lightweight server-side classifier using regex patterns
 *      - 3 levels: simple / moderate / complex
 *      - Tightly coupled to provider dispatch (selects streaming function + model
 *        based on env-configured API keys)
 *      - Does NOT use this analyzer; duplicates a subset of the logic
 *
 *   2. apps/streamlined-docs `classifyQueryComplexity()`
 *      (apps/streamlined-docs/lib/ai/query-complexity-classifier.ts)
 *      - App-local classifier for the advanced prompting pipeline
 *      - 3 levels: SIMPLE / MODERATE / COMPLEX
 *      - Used alongside ai-infrastructure's routing in the same API route
 *
 * If consolidation is pursued, those implementations could delegate to this
 * ComplexityAnalyzer for the analysis step while retaining their own mapping
 * logic for their specific output formats.
 *
 * @module complexity-analyzer
 */

/**
 * Complexity level classifications
 */
export enum ComplexityLevel {
  /** Simple queries, greetings, factual lookups */
  Low = 'low',
  /** Moderate tasks like basic coding, explanations */
  Medium = 'medium',
  /** Complex analysis, multi-step reasoning */
  High = 'high',
  /** Critical tasks requiring maximum capability */
  Critical = 'critical',
}

/**
 * Factors contributing to complexity score
 */
export interface ComplexityFactors {
  /** Whether the prompt involves code generation/analysis */
  hasCodeTask: boolean
  /** Whether the prompt requires multiple steps */
  multiStep: boolean
  /** Number of distinct steps detected */
  stepCount: number
  /** Whether reasoning/analysis is required */
  requiresReasoning: boolean
  /** Whether domain expertise is needed */
  requiresDomainExpertise: boolean
  /** Normalized length factor (0-1) */
  lengthFactor: number
}

/**
 * Result of complexity analysis
 */
export interface ComplexityResult {
  /** Complexity level classification */
  level: ComplexityLevel
  /** Numeric score from 0 (trivial) to 1 (maximum complexity) */
  score: number
  /** Breakdown of contributing factors */
  factors: ComplexityFactors
  /** Recommended model tier */
  recommendedModelTier: 'small' | 'medium' | 'large' | 'premium'
  /** Confidence in the analysis (0-1) */
  confidence: number
}

/**
 * Weight configuration for complexity factors
 */
export interface ComplexityWeights {
  /** Weight for code-related tasks */
  codeTask: number
  /** Weight for multi-step requirements */
  multiStep: number
  /** Weight for reasoning requirements */
  reasoning: number
  /** Weight for domain expertise */
  domain: number
  /** Weight for prompt length */
  length: number
}

/**
 * Configuration for complexity analyzer
 */
export interface ComplexityAnalyzerConfig {
  /** Threshold for LOW complexity (default: 0.25) */
  lowThreshold?: number
  /** Threshold for MEDIUM complexity (default: 0.45) */
  mediumThreshold?: number
  /** Threshold for HIGH complexity (default: 0.7) */
  highThreshold?: number
  /** Custom weights for factors */
  weights?: Partial<ComplexityWeights>
}

// Keyword patterns for detection
const CODE_KEYWORDS = [
  'function',
  'code',
  'implement',
  'write',
  'program',
  'algorithm',
  'debug',
  'fix',
  'refactor',
  'class',
  'method',
  'variable',
  'api',
  'endpoint',
  'database',
  'query',
  'sql',
  'javascript',
  'typescript',
  'python',
  'react',
  'node',
]

const REASONING_KEYWORDS = [
  'explain',
  'why',
  'analyze',
  'compare',
  'evaluate',
  'assess',
  'consider',
  'trade-off',
  'pros and cons',
  'recommend',
  'justify',
  'reason',
  'think',
  'implications',
]

const DOMAIN_KEYWORDS = [
  'hipaa',
  'pci',
  'gdpr',
  'compliance',
  'security',
  'encryption',
  'authentication',
  'medical',
  'financial',
  'legal',
  'architecture',
  'distributed',
  'scalability',
  'enterprise',
  'production',
]

const STEP_INDICATORS = [
  'first',
  'then',
  'next',
  'finally',
  'step',
  'after',
  'before',
  '1.',
  '2.',
  '3.',
  '4.',
  '5.',
  'a)',
  'b)',
  'c)',
]

/**
 * Analyzes prompt complexity to guide model selection
 *
 * @example
 * ```typescript
 * const analyzer = new ComplexityAnalyzer()
 *
 * const result = analyzer.analyze('Write a quicksort implementation')
 * console.log(result.level)              // 'medium'
 * console.log(result.recommendedModelTier) // 'medium'
 *
 * const complex = analyzer.analyze('Design a distributed system...')
 * console.log(complex.level)              // 'high' or 'critical'
 * console.log(complex.recommendedModelTier) // 'large' or 'premium'
 * ```
 */
export class ComplexityAnalyzer {
  private config: Required<ComplexityAnalyzerConfig>
  private weights: ComplexityWeights

  constructor(config: ComplexityAnalyzerConfig = {}) {
    this.config = {
      lowThreshold: config.lowThreshold ?? 0.25,
      mediumThreshold: config.mediumThreshold ?? 0.45,
      highThreshold: config.highThreshold ?? 0.7,
      weights: config.weights ?? {},
    }

    this.weights = {
      codeTask: config.weights?.codeTask ?? 0.25,
      multiStep: config.weights?.multiStep ?? 0.2,
      reasoning: config.weights?.reasoning ?? 0.2,
      domain: config.weights?.domain ?? 0.15,
      length: config.weights?.length ?? 0.2,
    }
  }

  /**
   * Analyze a prompt's complexity
   *
   * @param prompt - The prompt to analyze
   * @returns Complexity analysis result
   */
  analyze(prompt: string): ComplexityResult {
    if (!prompt || prompt.trim().length === 0) {
      return {
        level: ComplexityLevel.Low,
        score: 0,
        factors: {
          hasCodeTask: false,
          multiStep: false,
          stepCount: 0,
          requiresReasoning: false,
          requiresDomainExpertise: false,
          lengthFactor: 0,
        },
        recommendedModelTier: 'small',
        confidence: 1,
      }
    }

    const factors = this.extractFactors(prompt)
    const score = this.calculateScore(factors)
    const level = this.classifyLevel(score)
    const recommendedModelTier = this.recommendModel(level)

    return {
      level,
      score,
      factors,
      recommendedModelTier,
      confidence: this.calculateConfidence(factors),
    }
  }

  /**
   * Extract complexity factors from prompt
   */
  private extractFactors(prompt: string): ComplexityFactors {
    const lowerPrompt = prompt.toLowerCase()

    return {
      hasCodeTask: this.detectKeywords(lowerPrompt, CODE_KEYWORDS),
      multiStep: this.detectKeywords(lowerPrompt, STEP_INDICATORS),
      stepCount: this.countSteps(prompt),
      requiresReasoning: this.detectKeywords(lowerPrompt, REASONING_KEYWORDS),
      requiresDomainExpertise: this.detectKeywords(
        lowerPrompt,
        DOMAIN_KEYWORDS
      ),
      lengthFactor: this.calculateLengthFactor(prompt),
    }
  }

  /**
   * Detect if prompt contains keywords from a list (word boundary matching)
   */
  private detectKeywords(prompt: string, keywords: string[]): boolean {
    return keywords.some((keyword) => {
      // Escape regex special characters in the keyword
      const escaped = keyword
        .toLowerCase()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      // Use word boundary regex to avoid false positives like "capital" matching "api"
      const pattern = new RegExp(`\\b${escaped}\\b`)
      return pattern.test(prompt)
    })
  }

  /**
   * Count distinct steps in the prompt
   */
  private countSteps(prompt: string): number {
    // Count numbered items (1., 2., etc.)
    const numbered = prompt.match(/\b\d+\./g)?.length ?? 0

    // Count step indicators
    const indicators =
      prompt.toLowerCase().match(/\b(first|then|next|finally|after that)\b/g)
        ?.length ?? 0

    // Count bullet points
    const bullets = prompt.match(/^[\s]*[-*•]/gm)?.length ?? 0

    return Math.max(numbered, indicators, bullets)
  }

  /**
   * Calculate normalized length factor
   */
  private calculateLengthFactor(prompt: string): number {
    // Normalize length: 0 at 0 chars, 1 at 2000+ chars
    const length = prompt.length
    return Math.min(1, length / 2000)
  }

  /**
   * Calculate overall complexity score
   */
  private calculateScore(factors: ComplexityFactors): number {
    let score = 0

    if (factors.hasCodeTask) {
      score += this.weights.codeTask
    }

    if (factors.multiStep) {
      // Scale by step count (more steps = higher score)
      const stepMultiplier = Math.min(1, factors.stepCount / 5)
      score += this.weights.multiStep * (0.5 + 0.5 * stepMultiplier)
    }

    if (factors.requiresReasoning) {
      score += this.weights.reasoning
    }

    if (factors.requiresDomainExpertise) {
      score += this.weights.domain
    }

    // Length contributes proportionally
    score += this.weights.length * factors.lengthFactor

    // Clamp to [0, 1]
    return Math.min(1, Math.max(0, score))
  }

  /**
   * Classify complexity level based on score
   */
  private classifyLevel(score: number): ComplexityLevel {
    if (score < this.config.lowThreshold) {
      return ComplexityLevel.Low
    } else if (score < this.config.mediumThreshold) {
      return ComplexityLevel.Medium
    } else if (score < this.config.highThreshold) {
      return ComplexityLevel.High
    } else {
      return ComplexityLevel.Critical
    }
  }

  /**
   * Recommend model tier based on complexity level
   */
  private recommendModel(
    level: ComplexityLevel
  ): 'small' | 'medium' | 'large' | 'premium' {
    switch (level) {
      case ComplexityLevel.Low:
        return 'small'
      case ComplexityLevel.Medium:
        return 'medium'
      case ComplexityLevel.High:
        return 'large'
      case ComplexityLevel.Critical:
        return 'premium'
    }
  }

  /**
   * Calculate confidence in the analysis
   */
  private calculateConfidence(factors: ComplexityFactors): number {
    // Count how many signals we detected
    const signals = [
      factors.hasCodeTask,
      factors.multiStep,
      factors.requiresReasoning,
      factors.requiresDomainExpertise,
      factors.lengthFactor > 0.3,
    ].filter(Boolean).length

    // More signals = higher confidence
    // Few or no signals = could be ambiguous
    if (signals === 0) {
      return 0.7 // Default confidence for simple prompts
    } else if (signals >= 3) {
      return 0.95
    } else {
      return 0.8 + signals * 0.05
    }
  }
}
