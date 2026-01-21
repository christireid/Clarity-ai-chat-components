/**
 * Vision and Multimodal Optimization
 *
 * Week 4: Complete toolkit for optimizing multimodal (text + images) LLM requests
 *
 * Features:
 * - Vision token counting for OpenAI, Anthropic, and Google
 * - Image optimization and resizing
 * - Multimodal message types and utilities
 * - Cost estimation for text + images
 *
 * @module vision
 */

// ============================================================================
// Vision Token Counter
// ============================================================================

export {
  VisionTokenCounter,
  createOpenAIVisionCounter,
  createAnthropicVisionCounter,
  createGoogleVisionCounter,
  calculateOpenAIVisionTokens,
  calculateAnthropicVisionTokens,
  calculateGoogleVisionTokens,
  estimateDimensionsFromDataURL,
  getOptimalDimensions,
  calculateVisionCost,
  compareProvidersForImage,
} from './vision-token-counter'

export type {
  ImageDimensions,
  ImageDetail,
  VisionProvider,
  ImageMetadata,
  VisionTokenResult,
  VisionTokenConfig,
} from './vision-token-counter'

// ============================================================================
// Image Optimizer
// ============================================================================

export {
  ImageOptimizer,
  createBalancedOptimizer,
  createQualityOptimizer,
  createCostOptimizer,
  createAggressiveOptimizer,
  calculateResizeDimensions,
  calculateDimensionsForTokenBudget,
  getQuickOptimizationAdvice,
  compareOptimizationStrategies,
} from './image-optimizer'

export type {
  ImageFormat,
  OptimizationStrategy,
  ImageOptimizationConfig,
  ImageOptimizationResult,
} from './image-optimizer'

// ============================================================================
// Multimodal Types
// ============================================================================

export {
  toOpenAIFormat,
  toAnthropicFormat,
  toGeminiFormat,
  countImages,
  extractText,
  extractImages,
  hasImages,
  isTextOnly,
  createTextMessage,
  createMultimodalMessage,
  addImageToMessage,
  removeImagesFromMessage,
  createImageContent,
  createImageURLContent,
  validateMultimodalMessage,
} from './multimodal-types'

export type {
  ContentBlockType,
  ImageSource,
  TextContent,
  ImageContent,
  ImageURLContent,
  MessageContent,
  MultimodalMessage,
  MultimodalMessageWithMetadata,
  OpenAIMultimodalMessage,
  AnthropicMultimodalMessage,
  GeminiMultimodalMessage,
  GeminiContentPart,
} from './multimodal-types'

// ============================================================================
// Multimodal Cost Estimator
// ============================================================================

export {
  MultimodalCostEstimator,
  createGPT4oEstimator,
  createGPT4oMiniEstimator,
  createClaude35SonnetEstimator,
  createClaude35HaikuEstimator,
  createGeminiProEstimator,
  createGeminiFlashEstimator,
  compareMultimodalProviders,
  findCheapestModel,
  MULTIMODAL_MODEL_PRICING,
} from './multimodal-cost-estimator'

export type {
  MultimodalModelPricing,
  MultimodalTokenBreakdown,
  MultimodalCostEstimate,
  MultimodalCostEstimatorConfig,
} from './multimodal-cost-estimator'
