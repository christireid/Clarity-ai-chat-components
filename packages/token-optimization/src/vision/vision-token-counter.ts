/**
 * Vision Token Counter
 *
 * Accurate token counting for images in multimodal LLM requests.
 * Supports OpenAI, Anthropic, and Google vision models.
 *
 * References:
 * - OpenAI: https://platform.openai.com/docs/guides/vision
 * - Anthropic: https://docs.anthropic.com/en/docs/vision
 * - Google: https://cloud.google.com/vertex-ai/docs/generative-ai/multimodal/overview
 */

/**
 * Image dimensions
 */
export interface ImageDimensions {
  width: number
  height: number
}

/**
 * Image detail level for OpenAI
 */
export type ImageDetail = 'low' | 'high' | 'auto'

/**
 * Provider-specific vision token calculation
 */
export type VisionProvider = 'openai' | 'anthropic' | 'google'

/**
 * Image format metadata
 */
export interface ImageMetadata {
  /** Image format (png, jpeg, webp, gif) */
  format?: string
  /** File size in bytes */
  sizeBytes?: number
  /** Image dimensions */
  dimensions: ImageDimensions
  /** For data URLs or base64 */
  encoding?: 'base64' | 'url'
  /** Detail level (OpenAI-specific) */
  detail?: ImageDetail
}

/**
 * Vision token count result
 */
export interface VisionTokenResult {
  /** Total tokens for this image */
  tokens: number
  /** Base/minimum tokens */
  baseTokens: number
  /** Additional tokens from tiles/size */
  tileTokens: number
  /** Number of tiles (for high detail) */
  tileCount?: number
  /** Effective dimensions after resizing */
  effectiveDimensions: ImageDimensions
  /** Provider used for calculation */
  provider: VisionProvider
  /** Recommendations for optimization */
  recommendations: string[]
}

/**
 * Configuration for vision token counting
 */
export interface VisionTokenConfig {
  /** Provider to use for token calculation */
  provider: VisionProvider
  /** Default detail level for OpenAI (default: 'auto') */
  defaultDetail?: ImageDetail
  /** Include optimization recommendations (default: true) */
  includeRecommendations?: boolean
}

// ============================================================================
// OpenAI Vision Token Calculation
// ============================================================================

/**
 * Calculate vision tokens for OpenAI models (GPT-4o, GPT-4-turbo, etc.)
 *
 * OpenAI pricing:
 * - Low detail: 85 tokens per image
 * - High detail:
 *   - First, scale image to fit 2048x2048, maintain aspect ratio
 *   - Then scale to shortest side = 768px
 *   - Split into 512x512 tiles
 *   - Base: 85 tokens
 *   - Each tile: 170 tokens
 *
 * Example:
 * - 1024x1024 image: 85 + (4 tiles * 170) = 765 tokens
 * - 2048x4096 image: 85 + (8 tiles * 170) = 1445 tokens
 */
export function calculateOpenAIVisionTokens(
  dimensions: ImageDimensions,
  detail: ImageDetail = 'auto'
): VisionTokenResult {
  const recommendations: string[] = []

  // Low detail is always 85 tokens
  if (detail === 'low') {
    return {
      tokens: 85,
      baseTokens: 85,
      tileTokens: 0,
      tileCount: 0,
      effectiveDimensions: dimensions,
      provider: 'openai',
      recommendations: ['Low detail mode uses minimal tokens but reduces visual accuracy'],
    }
  }

  let { width, height } = dimensions

  // Auto detail: use low if image is small enough
  if (detail === 'auto') {
    // Use low detail if image is 512x512 or smaller
    if (width <= 512 && height <= 512) {
      return {
        tokens: 85,
        baseTokens: 85,
        tileTokens: 0,
        tileCount: 0,
        effectiveDimensions: { width, height },
        provider: 'openai',
        recommendations: ['Image is small enough for low detail mode'],
      }
    }
  }

  // High detail calculation

  // Step 1: Scale to fit within 2048x2048
  if (width > 2048 || height > 2048) {
    const scale = Math.min(2048 / width, 2048 / height)
    width = Math.floor(width * scale)
    height = Math.floor(height * scale)

    recommendations.push(
      `Image scaled down from ${dimensions.width}x${dimensions.height} to fit 2048x2048`
    )
  }

  // Step 2: Scale shortest side to 768
  const shortestSide = Math.min(width, height)
  if (shortestSide > 768) {
    const scale = 768 / shortestSide
    width = Math.floor(width * scale)
    height = Math.floor(height * scale)
  }

  // Step 3: Calculate tiles (512x512)
  const tilesX = Math.ceil(width / 512)
  const tilesY = Math.ceil(height / 512)
  const tileCount = tilesX * tilesY

  // Calculate tokens
  const baseTokens = 85
  const tileTokens = tileCount * 170
  const totalTokens = baseTokens + tileTokens

  // Recommendations
  if (tileCount > 4) {
    recommendations.push(
      `Image uses ${tileCount} tiles (${tileTokens} tokens). Consider resizing to reduce costs.`
    )
  }

  if (dimensions.width > 2048 || dimensions.height > 2048) {
    recommendations.push(
      'Image exceeds 2048px on one dimension - will be scaled down automatically'
    )
  }

  return {
    tokens: totalTokens,
    baseTokens,
    tileTokens,
    tileCount,
    effectiveDimensions: { width, height },
    provider: 'openai',
    recommendations,
  }
}

// ============================================================================
// Anthropic Vision Token Calculation
// ============================================================================

/**
 * Calculate vision tokens for Anthropic Claude models
 *
 * Anthropic pricing (as of January 2025):
 * - Images are resized to fit within 1568 pixels on longest side
 * - Shortest side scaled to maintain aspect ratio
 * - Token calculation based on tiles (similar to OpenAI but different tile size)
 * - Approximate: ~1.4 tokens per tile (more efficient than OpenAI)
 *
 * Token formula:
 * - tokens = (width / 512) * (height / 512) * 750
 */
export function calculateAnthropicVisionTokens(
  dimensions: ImageDimensions
): VisionTokenResult {
  const recommendations: string[] = []
  let { width, height } = dimensions

  // Anthropic resizes to max 1568px on longest side
  const longestSide = Math.max(width, height)
  if (longestSide > 1568) {
    const scale = 1568 / longestSide
    width = Math.floor(width * scale)
    height = Math.floor(height * scale)

    recommendations.push(
      `Image scaled from ${dimensions.width}x${dimensions.height} to fit within 1568px`
    )
  }

  // Calculate tokens based on image size
  // Anthropic uses a more efficient encoding than OpenAI
  const tilesX = Math.ceil(width / 512)
  const tilesY = Math.ceil(height / 512)
  const tileCount = tilesX * tilesY

  // Anthropic: approximately 750 tokens per tile
  const tokensPerTile = 750
  const tokens = tileCount * tokensPerTile

  // Recommendations
  if (tokens > 2000) {
    recommendations.push(
      `Image uses ${tokens} tokens. Consider resizing to reduce costs.`
    )
  }

  if (dimensions.width > 1568 || dimensions.height > 1568) {
    recommendations.push('Image will be automatically resized to 1568px max dimension')
  }

  return {
    tokens,
    baseTokens: 0,
    tileTokens: tokens,
    tileCount,
    effectiveDimensions: { width, height },
    provider: 'anthropic',
    recommendations,
  }
}

// ============================================================================
// Google Vision Token Calculation
// ============================================================================

/**
 * Calculate vision tokens for Google Gemini models
 *
 * Google Gemini pricing:
 * - Images are charged at 258 tokens per image regardless of size
 * - Video frames charged separately
 *
 * Note: This is simpler than OpenAI/Anthropic but less granular
 */
export function calculateGoogleVisionTokens(
  dimensions: ImageDimensions
): VisionTokenResult {
  const recommendations: string[] = []

  // Google: flat 258 tokens per image
  const tokens = 258

  // Even though tokens are flat, still provide size optimization recommendations
  const pixels = dimensions.width * dimensions.height
  if (pixels > 2048 * 2048) {
    recommendations.push(
      'Image is very large. Consider resizing for faster upload/processing (tokens are flat).'
    )
  }

  return {
    tokens,
    baseTokens: 258,
    tileTokens: 0,
    tileCount: 0,
    effectiveDimensions: dimensions,
    provider: 'google',
    recommendations,
  }
}

// ============================================================================
// Unified Vision Token Counter
// ============================================================================

/**
 * Main vision token counter class
 */
export class VisionTokenCounter {
  private config: Required<VisionTokenConfig>

  constructor(config: VisionTokenConfig) {
    this.config = {
      provider: config.provider,
      defaultDetail: config.defaultDetail ?? 'auto',
      includeRecommendations: config.includeRecommendations ?? true,
    }
  }

  /**
   * Count tokens for an image
   */
  count(metadata: ImageMetadata): VisionTokenResult {
    switch (this.config.provider) {
      case 'openai':
        return calculateOpenAIVisionTokens(
          metadata.dimensions,
          metadata.detail ?? this.config.defaultDetail
        )

      case 'anthropic':
        return calculateAnthropicVisionTokens(metadata.dimensions)

      case 'google':
        return calculateGoogleVisionTokens(metadata.dimensions)

      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`)
    }
  }

  /**
   * Count tokens for multiple images
   */
  countBatch(images: ImageMetadata[]): VisionTokenResult[] {
    return images.map((img) => this.count(img))
  }

  /**
   * Get total tokens for multiple images
   */
  countTotal(images: ImageMetadata[]): number {
    return this.countBatch(images).reduce((sum, result) => sum + result.tokens, 0)
  }

  /**
   * Estimate tokens from image URL or data URL
   * Requires image dimensions to be provided or extracted
   */
  async countFromURL(url: string, detail?: ImageDetail): Promise<VisionTokenResult> {
    // In a real implementation, this would:
    // 1. Fetch the image
    // 2. Extract dimensions
    // 3. Calculate tokens
    //
    // For now, this is a placeholder that requires dimensions to be passed separately
    throw new Error(
      'countFromURL requires image loading. Use count() with extracted dimensions instead.'
    )
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create an OpenAI vision token counter
 */
export function createOpenAIVisionCounter(
  defaultDetail: ImageDetail = 'auto'
): VisionTokenCounter {
  return new VisionTokenCounter({
    provider: 'openai',
    defaultDetail,
  })
}

/**
 * Create an Anthropic vision token counter
 */
export function createAnthropicVisionCounter(): VisionTokenCounter {
  return new VisionTokenCounter({
    provider: 'anthropic',
  })
}

/**
 * Create a Google vision token counter
 */
export function createGoogleVisionCounter(): VisionTokenCounter {
  return new VisionTokenCounter({
    provider: 'google',
  })
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract dimensions from image data URL
 * Returns estimated dimensions based on base64 length
 * For accurate dimensions, use actual image loading
 */
export function estimateDimensionsFromDataURL(dataURL: string): ImageDimensions {
  // Remove data URL prefix
  const base64Data = dataURL.split(',')[1] || dataURL

  // Estimate based on base64 length
  // This is very rough - real implementation should decode image
  const bytes = (base64Data.length * 3) / 4

  // Rough estimation assuming uncompressed RGB
  // bytes = width * height * 3 (for RGB)
  const pixels = bytes / 3
  const dimension = Math.sqrt(pixels)

  return {
    width: Math.floor(dimension),
    height: Math.floor(dimension),
  }
}

/**
 * Get optimal image dimensions for provider
 */
export function getOptimalDimensions(
  dimensions: ImageDimensions,
  provider: VisionProvider
): ImageDimensions {
  switch (provider) {
    case 'openai':
      // OpenAI optimal: ≤2048px longest side, ≤768px shortest side
      const openaiMaxLong = 2048
      const openaiMaxShort = 768
      const longSide = Math.max(dimensions.width, dimensions.height)
      const shortSide = Math.min(dimensions.width, dimensions.height)

      if (longSide <= openaiMaxLong && shortSide <= openaiMaxShort) {
        return dimensions
      }

      const openaiScale = Math.min(openaiMaxLong / longSide, openaiMaxShort / shortSide)
      return {
        width: Math.floor(dimensions.width * openaiScale),
        height: Math.floor(dimensions.height * openaiScale),
      }

    case 'anthropic':
      // Anthropic optimal: ≤1568px on longest side
      const anthropicMax = 1568
      const anthropicLongSide = Math.max(dimensions.width, dimensions.height)

      if (anthropicLongSide <= anthropicMax) {
        return dimensions
      }

      const anthropicScale = anthropicMax / anthropicLongSide
      return {
        width: Math.floor(dimensions.width * anthropicScale),
        height: Math.floor(dimensions.height * anthropicScale),
      }

    case 'google':
      // Google doesn't have strict size requirements
      // But keeping reasonable size for performance
      const googleMax = 2048
      const googleLongSide = Math.max(dimensions.width, dimensions.height)

      if (googleLongSide <= googleMax) {
        return dimensions
      }

      const googleScale = googleMax / googleLongSide
      return {
        width: Math.floor(dimensions.width * googleScale),
        height: Math.floor(dimensions.height * googleScale),
      }

    default:
      return dimensions
  }
}

/**
 * Calculate token cost for vision input
 */
export function calculateVisionCost(
  result: VisionTokenResult,
  costPer1MTokens: number
): number {
  return (result.tokens / 1_000_000) * costPer1MTokens
}

/**
 * Compare token counts across providers
 */
export function compareProvidersForImage(dimensions: ImageDimensions): {
  openai: VisionTokenResult
  anthropic: VisionTokenResult
  google: VisionTokenResult
  cheapest: VisionProvider
  mostExpensive: VisionProvider
} {
  const openai = calculateOpenAIVisionTokens(dimensions, 'auto')
  const anthropic = calculateAnthropicVisionTokens(dimensions)
  const google = calculateGoogleVisionTokens(dimensions)

  const providers: Array<{ provider: VisionProvider; tokens: number }> = [
    { provider: 'openai', tokens: openai.tokens },
    { provider: 'anthropic', tokens: anthropic.tokens },
    { provider: 'google', tokens: google.tokens },
  ]

  providers.sort((a, b) => a.tokens - b.tokens)

  return {
    openai,
    anthropic,
    google,
    cheapest: providers[0].provider,
    mostExpensive: providers[providers.length - 1].provider,
  }
}
