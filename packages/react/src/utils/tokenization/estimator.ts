/**
 * @deprecated Import from '@clarity-chat/token-optimization' instead
 * This re-export will be removed in v3.0.0
 *
 * Token Estimation - Re-exported from token-optimization package
 *
 * @example Migration
 * ```typescript
 * // OLD (deprecated)
 * import { estimateTokens, countConversationTokens } from '@clarity-chat/react'
 *
 * // NEW (recommended)
 * import { estimateTokens, countConversationTokens } from '@clarity-chat/token-optimization'
 * ```
 */

// Re-export everything from token-optimization
export {
  estimateTokens,
  countConversationTokens,
  estimateMessagesTokens,
  getCharsPerToken,
  shouldUseAsyncEstimation,
  estimateTokensDebug,
} from '@clarity-chat/token-optimization'

// Runtime deprecation warning in development
if (process.env['NODE_ENV'] === 'development') {
  console.warn(
    '[Deprecation] estimator: Import from @clarity-chat/token-optimization instead of @clarity-chat/react. ' +
      'This re-export will be removed in v3.0.0. ' +
      'See migration guide: https://github.com/clarity-ai/token-optimization#migration'
  )
}
