/**
 * Image Optimization for Vision Models
 *
 * Utilities to optimize images for multimodal LLM requests:
 * - Resize to optimal dimensions
 * - Format conversion
 * - Quality/compression settings
 * - Token cost reduction
 */

import type { ImageDimensions, VisionProvider, VisionTokenResult } from './vision-token-counter'
import { getOptimalDimensions, calculateOpenAIVisionTokens, calculate AnthropicVisionTokens, calculateGoogleVisionTokens } from './vision-token-counter'

/**
 * Image format
 */
export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif'

/**
 * Optimization strategy
 */
export type OptimizationStrategy =
  | 'balanced' // Balance quality and token cost
  | 'quality' // Prioritize quality, accept higher token cost
  | 'cost' // Minimize token cost, accept lower quality
  | 'aggressive' // Maximum compression, minimum tokens

/**
 * Image optimization configuration
 */
export interface ImageOptimizationConfig {
  /** Target provider */
  provider: VisionProvider

  /** Optimization strategy */
  strategy?: OptimizationStrategy

  /** Target maximum dimensions (will maintain aspect ratio) */
  maxDimensions?: ImageDimensions

  /** Target format (default: auto-select best) */
  targetFormat?: ImageFormat

  /** JPEG/WebP quality (1-100, default: varies by strategy) */
  quality?: number

  /** Force resize even if within limits */
  forceResize?: boolean

  /** Maximum file size in bytes (best effort) */
  maxFileSize?: number
}

/**
 * Optimization result
 */
export interface ImageOptimizationResult {
  /** Optimized image dimensions */
  dimensions: ImageDimensions

  /** Recommended format */
  format: ImageFormat

  /** Quality setting used */
  quality: number

  /** Estimated file size reduction (0-1) */
  fileSizeReduction: number

  /** Token count before optimization */
  tokensBefore: number

  /** Token count after optimization */
  tokensAfter: number

  /** Token savings (percentage 0-1) */
  tokenSavings: number

  /** Cost savings at given price */
  costSavings: (costPer1MTokens: number) => number

  /** Optimization steps applied */
  optimizationSteps: string[]

  /** Recommendations for further optimization */
  recommendations: string[]
}

// ============================================================================
// Optimization Strategies
// ============================================================================

/**
 * Get quality setting for strategy
 */
function getQualityForStrategy(strategy: OptimizationStrategy): number {
  switch (strategy) {
    case 'quality':
      return 95
    case 'balanced':
      return 85
    case 'cost':
      return 75
    case 'aggressive':
      return 60
    default:
      return 85
  }
}

/**
 * Get target dimensions for strategy
 */
function getMaxDimensionsForStrategy(
  strategy: OptimizationStrategy,
  provider: VisionProvider
): ImageDimensions | undefined {
  switch (strategy) {
    case 'quality':
      // Use provider maximums
      return undefined

    case 'balanced':
      // Use provider optimal dimensions
      if (provider === 'openai') return { width: 2048, height: 2048 }
      if (provider === 'anthropic') return { width: 1568, height: 1568 }
      if (provider === 'google') return { width: 2048, height: 2048 }
      return { width: 2048, height: 2048 }

    case 'cost':
      // Reduce size more aggressively
      if (provider === 'openai') return { width: 1024, height: 1024 }
      if (provider === 'anthropic') return { width: 1024, height: 1024 }
      if (provider === 'google') return { width: 1024, height: 1024 }
      return { width: 1024, height: 1024 }

    case 'aggressive':
      // Minimize tokens
      return { width: 768, height: 768 }

    default:
      return undefined
  }
}

/**
 * Select best format for provider and strategy
 */
function selectOptimalFormat(
  strategy: OptimizationStrategy,
  currentFormat?: ImageFormat
): ImageFormat {
  switch (strategy) {
    case 'quality':
      // PNG for lossless, or keep current
      return currentFormat === 'png' ? 'png' : 'jpeg'

    case 'balanced':
      // WebP for good balance, fallback to JPEG
      return 'webp'

    case 'cost':
    case 'aggressive':
      // JPEG for maximum compression
      return 'jpeg'

    default:
      return 'jpeg'
  }
}

// ============================================================================
// Resize Utilities
// ============================================================================

/**
 * Calculate dimensions maintaining aspect ratio
 */
export function calculateResizeDimensions(
  original: ImageDimensions,
  maxDimensions: ImageDimensions
): ImageDimensions {
  const widthRatio = maxDimensions.width / original.width
  const heightRatio = maxDimensions.height / original.height
  const ratio = Math.min(widthRatio, heightRatio, 1) // Don't upscale

  if (ratio >= 1) {
    return original // No resize needed
  }

  return {
    width: Math.floor(original.width * ratio),
    height: Math.floor(original.height * ratio),
  }
}

/**
 * Calculate dimensions to fit within token budget
 */
export function calculateDimensionsForTokenBudget(
  original: ImageDimensions,
  provider: VisionProvider,
  targetTokens: number,
  detail?: 'low' | 'high' | 'auto'
): ImageDimensions {
  // Binary search for optimal dimensions
  let low = 0.1
  let high = 1.0
  let bestScale = 1.0

  for (let i = 0; i < 10; i++) {
    const mid = (low + high) / 2
    const testDimensions: ImageDimensions = {
      width: Math.floor(original.width * mid),
      height: Math.floor(original.height * mid),
    }

    let tokens: number
    switch (provider) {
      case 'openai':
        tokens = calculateOpenAIVisionTokens(testDimensions, detail || 'auto').tokens
        break
      case 'anthropic':
        tokens = calculateAnthropicVisionTokens(testDimensions).tokens
        break
      case 'google':
        tokens = calculateGoogleVisionTokens(testDimensions).tokens
        break
      default:
        tokens = 0
    }

    if (tokens <= targetTokens) {
      bestScale = mid
      low = mid
    } else {
      high = mid
    }
  }

  return {
    width: Math.floor(original.width * bestScale),
    height: Math.floor(original.height * bestScale),
  }
}

// ============================================================================
// Image Optimizer Class
// ============================================================================

/**
 * Main image optimizer
 */
export class ImageOptimizer {
  private config: Required<ImageOptimizationConfig>

  constructor(config: ImageOptimizationConfig) {
    this.config = {
      provider: config.provider,
      strategy: config.strategy ?? 'balanced',
      maxDimensions:
        config.maxDimensions ??
        getMaxDimensionsForStrategy(config.strategy ?? 'balanced', config.provider),
      targetFormat: config.targetFormat ?? selectOptimalFormat(config.strategy ?? 'balanced'),
      quality: config.quality ?? getQualityForStrategy(config.strategy ?? 'balanced'),
      forceResize: config.forceResize ?? false,
      maxFileSize: config.maxFileSize,
    }
  }

  /**
   * Optimize image dimensions and format
   * Returns optimization plan (does not perform actual image processing)
   */
  optimize(
    currentDimensions: ImageDimensions,
    currentFormat?: ImageFormat
  ): ImageOptimizationResult {
    const optimizationSteps: string[] = []
    const recommendations: string[] = []

    // Calculate original tokens
    let tokensBefore: number
    switch (this.config.provider) {
      case 'openai':
        tokensBefore = calculateOpenAIVisionTokens(currentDimensions, 'auto').tokens
        break
      case 'anthropic':
        tokensBefore = calculateAnthropicVisionTokens(currentDimensions).tokens
        break
      case 'google':
        tokensBefore = calculateGoogleVisionTokens(currentDimensions).tokens
        break
      default:
        tokensBefore = 0
    }

    // Determine target dimensions
    let targetDimensions = currentDimensions

    // Apply max dimensions constraint
    if (this.config.maxDimensions) {
      targetDimensions = calculateResizeDimensions(targetDimensions, this.config.maxDimensions)
      if (
        targetDimensions.width !== currentDimensions.width ||
        targetDimensions.height !== currentDimensions.height
      ) {
        optimizationSteps.push(
          `Resize from ${currentDimensions.width}x${currentDimensions.height} to ${targetDimensions.width}x${targetDimensions.height}`
        )
      }
    }

    // Apply provider-specific optimizations
    const providerOptimal = getOptimalDimensions(targetDimensions, this.config.provider)
    if (
      providerOptimal.width !== targetDimensions.width ||
      providerOptimal.height !== targetDimensions.height
    ) {
      targetDimensions = providerOptimal
      optimizationSteps.push(
        `Optimize for ${this.config.provider}: ${targetDimensions.width}x${targetDimensions.height}`
      )
    }

    // Calculate tokens after optimization
    let tokensAfter: number
    switch (this.config.provider) {
      case 'openai':
        tokensAfter = calculateOpenAIVisionTokens(targetDimensions, 'auto').tokens
        break
      case 'anthropic':
        tokensAfter = calculateAnthropicVisionTokens(targetDimensions).tokens
        break
      case 'google':
        tokensAfter = calculateGoogleVisionTokens(targetDimensions).tokens
        break
      default:
        tokensAfter = 0
    }

    // Format optimization
    const targetFormat = this.config.targetFormat
    if (currentFormat && currentFormat !== targetFormat) {
      optimizationSteps.push(`Convert from ${currentFormat} to ${targetFormat}`)
    }

    // Quality optimization
    if (this.config.quality < 90) {
      optimizationSteps.push(`Apply ${this.config.quality}% quality compression`)
    }

    // Calculate savings
    const tokenSavings = tokensBefore > 0 ? (tokensBefore - tokensAfter) / tokensBefore : 0

    // Estimate file size reduction (rough approximation)
    const dimensionReduction =
      (targetDimensions.width * targetDimensions.height) /
      (currentDimensions.width * currentDimensions.height)
    const qualityFactor = this.config.quality / 100
    const fileSizeReduction = 1 - dimensionReduction * qualityFactor

    // Generate recommendations
    if (tokensAfter > 1000 && this.config.provider === 'openai') {
      recommendations.push(
        'Consider using OpenAI low-detail mode for 85 tokens (if visual fidelity is not critical)'
      )
    }

    if (tokenSavings < 0.2 && tokensBefore > 500) {
      recommendations.push('More aggressive resizing could further reduce tokens')
    }

    if (this.config.strategy === 'quality' && tokensAfter > 1500) {
      recommendations.push('High token count - consider switching to balanced strategy')
    }

    if (targetDimensions.width > 1024 || targetDimensions.height > 1024) {
      recommendations.push('Image larger than 1024px - further resizing may not impact quality significantly')
    }

    return {
      dimensions: targetDimensions,
      format: targetFormat,
      quality: this.config.quality,
      fileSizeReduction,
      tokensBefore,
      tokensAfter,
      tokenSavings,
      costSavings: (costPer1MTokens: number) => {
        const tokensSaved = tokensBefore - tokensAfter
        return (tokensSaved / 1_000_000) * costPer1MTokens
      },
      optimizationSteps,
      recommendations,
    }
  }

  /**
   * Optimize for specific token budget
   */
  optimizeForTokenBudget(
    currentDimensions: ImageDimensions,
    targetTokens: number,
    currentFormat?: ImageFormat
  ): ImageOptimizationResult {
    const targetDimensions = calculateDimensionsForTokenBudget(
      currentDimensions,
      this.config.provider,
      targetTokens
    )

    // Create temporary config with calculated dimensions
    const tempConfig = {
      ...this.config,
      maxDimensions: targetDimensions,
    }

    const tempOptimizer = new ImageOptimizer(tempConfig)
    return tempOptimizer.optimize(currentDimensions, currentFormat)
  }

  /**
   * Batch optimize multiple images
   */
  optimizeBatch(
    images: Array<{ dimensions: ImageDimensions; format?: ImageFormat }>
  ): ImageOptimizationResult[] {
    return images.map((img) => this.optimize(img.dimensions, img.format))
  }

  /**
   * Calculate total savings for batch
   */
  calculateBatchSavings(results: ImageOptimizationResult[]): {
    totalTokensBefore: number
    totalTokensAfter: number
    totalTokensSaved: number
    totalSavingsPercentage: number
    averageSavingsPerImage: number
    totalCostSavings: (costPer1MTokens: number) => number
  } {
    const totalTokensBefore = results.reduce((sum, r) => sum + r.tokensBefore, 0)
    const totalTokensAfter = results.reduce((sum, r) => sum + r.tokensAfter, 0)
    const totalTokensSaved = totalTokensBefore - totalTokensAfter

    return {
      totalTokensBefore,
      totalTokensAfter,
      totalTokensSaved,
      totalSavingsPercentage: totalTokensBefore > 0 ? totalTokensSaved / totalTokensBefore : 0,
      averageSavingsPerImage: results.length > 0 ? totalTokensSaved / results.length : 0,
      totalCostSavings: (costPer1MTokens: number) => {
        return (totalTokensSaved / 1_000_000) * costPer1MTokens
      },
    }
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create balanced optimizer (default)
 */
export function createBalancedOptimizer(provider: VisionProvider): ImageOptimizer {
  return new ImageOptimizer({
    provider,
    strategy: 'balanced',
  })
}

/**
 * Create quality-focused optimizer
 */
export function createQualityOptimizer(provider: VisionProvider): ImageOptimizer {
  return new ImageOptimizer({
    provider,
    strategy: 'quality',
  })
}

/**
 * Create cost-focused optimizer
 */
export function createCostOptimizer(provider: VisionProvider): ImageOptimizer {
  return new ImageOptimizer({
    provider,
    strategy: 'cost',
  })
}

/**
 * Create aggressive optimizer (minimum tokens)
 */
export function createAggressiveOptimizer(provider: VisionProvider): ImageOptimizer {
  return new ImageOptimizer({
    provider,
    strategy: 'aggressive',
  })
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Quick optimization recommendation
 */
export function getQuickOptimizationAdvice(
  dimensions: ImageDimensions,
  provider: VisionProvider
): {
  shouldOptimize: boolean
  potentialSavings: number
  recommendation: string
} {
  // Calculate current cost
  let currentTokens: number
  switch (provider) {
    case 'openai':
      currentTokens = calculateOpenAIVisionTokens(dimensions, 'auto').tokens
      break
    case 'anthropic':
      currentTokens = calculateAnthropicVisionTokens(dimensions).tokens
      break
    case 'google':
      currentTokens = calculateGoogleVisionTokens(dimensions).tokens
      break
    default:
      currentTokens = 0
  }

  // Calculate optimized cost
  const optimal = getOptimalDimensions(dimensions, provider)
  let optimizedTokens: number
  switch (provider) {
    case 'openai':
      optimizedTokens = calculateOpenAIVisionTokens(optimal, 'auto').tokens
      break
    case 'anthropic':
      optimizedTokens = calculateAnthropicVisionTokens(optimal).tokens
      break
    case 'google':
      optimizedTokens = calculateGoogleVisionTokens(optimal).tokens
      break
    default:
      optimizedTokens = 0
  }

  const savings = currentTokens > 0 ? (currentTokens - optimizedTokens) / currentTokens : 0

  if (savings < 0.05) {
    return {
      shouldOptimize: false,
      potentialSavings: savings,
      recommendation: 'Image is already optimally sized - no action needed',
    }
  }

  if (savings < 0.2) {
    return {
      shouldOptimize: false,
      potentialSavings: savings,
      recommendation: `Minor optimization possible (${(savings * 100).toFixed(1)}% savings). Consider optimizing if processing many images.`,
    }
  }

  if (savings < 0.5) {
    return {
      shouldOptimize: true,
      potentialSavings: savings,
      recommendation: `Moderate optimization recommended (${(savings * 100).toFixed(1)}% token savings). Resize to ${optimal.width}x${optimal.height}.`,
    }
  }

  return {
    shouldOptimize: true,
    potentialSavings: savings,
    recommendation: `Strong optimization recommended (${(savings * 100).toFixed(1)}% token savings)! Image is much larger than needed. Resize to ${optimal.width}x${optimal.height}.`,
  }
}

/**
 * Compare optimization strategies
 */
export function compareOptimizationStrategies(
  dimensions: ImageDimensions,
  provider: VisionProvider,
  format?: ImageFormat
): Record<OptimizationStrategy, ImageOptimizationResult> {
  const strategies: OptimizationStrategy[] = ['balanced', 'quality', 'cost', 'aggressive']

  const results: Partial<Record<OptimizationStrategy, ImageOptimizationResult>> = {}

  for (const strategy of strategies) {
    const optimizer = new ImageOptimizer({ provider, strategy })
    results[strategy] = optimizer.optimize(dimensions, format)
  }

  return results as Record<OptimizationStrategy, ImageOptimizationResult>
}
