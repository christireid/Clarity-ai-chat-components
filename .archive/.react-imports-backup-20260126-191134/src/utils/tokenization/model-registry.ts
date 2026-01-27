/**
 * @deprecated Import from '@clarity-chat/token-optimization' instead
 * This re-export will be removed in v3.0.0
 *
 * Model Registry - Re-exported from token-optimization package
 *
 * @example Migration
 * ```typescript
 * // OLD (deprecated)
 * import { MODEL_REGISTRY, ModelId } from '@clarity-chat/react'
 *
 * // NEW (recommended)
 * import { MODEL_REGISTRY, ModelId } from '@clarity-chat/token-optimization'
 * ```
 */

// Re-export everything from token-optimization
export {
  MODEL_REGISTRY,
  getAllModelIds,
  getModelsByProvider,
  getModelsWithCapability,
  getModelsWithMinContextWindow,
  isValidModelId,
  getModelConfig,
  tryGetModelConfig,
  type ModelId,
  type ModelProvider,
  type TokenizerEncoding,
  type TokenModelConfig,
} from '@clarity-chat/token-optimization'

// Runtime deprecation warning in development
if (process.env['NODE_ENV'] === 'development') {
  console.warn(
    '[Deprecation] model-registry: Import from @clarity-chat/token-optimization instead of @clarity-chat/react. ' +
      'This re-export will be removed in v3.0.0. ' +
      'See migration guide: https://github.com/clarity-ai/token-optimization#migration'
  )
}
