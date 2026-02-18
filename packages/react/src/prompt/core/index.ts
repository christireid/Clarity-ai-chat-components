/**
 * Core Prompt & Token Optimization Utilities
 *
 * Framework-agnostic core utilities for prompt building and optimization.
 * Can be used in any JavaScript/TypeScript project.
 */

// Toon DSL
export {
  type ToonNode,
  type ToonNodeBase,
  type ToonText,
  type ToonVariable,
  type ToonSection,
  type ToonRole,
  type ToonSequence,
  type ToonConditional,
  ToonBuilder,
  toon,
  renderToon,
  toonToMessages,
  extractImportanceTags,
} from './toon'

// Tokenizer
export {
  type Tokenizer,
  type ModelMetadata,
  ApproximateTokenizer,
  ClaudeTokenizer,
  getTokenizerForModel,
  MODEL_PRESETS,
  estimateSingleMessageTokens,
  estimateMessageTokens,
  estimatePromptTokens,
  estimateCost,
} from './tokenizer'

// Recipe System
export {
  type PromptRecipe,
  createPromptRecipe,
  buildMessagesFromRecipe,
  BUILT_IN_RECIPES,
  getBuiltInRecipe,
  mergeRecipes,
} from './recipe'

// Optimizer
export {
  type OptimizationStrategy,
  type MessagePriority,
  type OptimizationOptions,
  type OptimizationResult,
  optimizeMessagesForBudget,
  summarizeHistoryForCompression,
} from './optimizer'

// Model Profiles
export {
  type ModelProfile,
  type PromptStyle,
  type ModelFamily,
  MODEL_PROFILES,
  getModelProfile,
  getModelProfileOrDefault,
  getModelsByFamily,
  getModelsWithinBudget,
  getModelsWithinCostBudget,
  compareModels,
} from './model-profiles'

// Compression Chain exports are deferred until compression-chain module is implemented

// Strategy Router
export {
  type StrategySelection,
  type ModelSwitchRecommendation,
  chooseOptimizationStrategy,
  shouldSwitchModel,
  shouldSwitchModelSync,
  analyzeTokenCapacity,
  getRoutingRecommendation,
} from './strategy-router'

// Builder
export {
  type BuildModelPromptOptions,
  type BuildModelPromptResult,
  buildModelPrompt,
  buildPrompt,
  appendToConversation,
  createConversation,
} from './builder'

// Engine
export {
  type OptimizationStage,
  type OptimizationDiagnostics,
  type OptimizePromptOptions,
  type OptimizePromptResult,
  optimizePrompt,
} from './engine/prompt-optimizer'
