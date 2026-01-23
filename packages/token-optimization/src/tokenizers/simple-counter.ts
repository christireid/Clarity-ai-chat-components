/**
 * @deprecated This file is deprecated. Import from fast-counter.ts instead.
 *
 * SimpleTokenCounter has been renamed to FastTokenCounter for clarity.
 * This file re-exports for backward compatibility and will be removed in v3.0.0
 *
 * Migration:
 * ```diff
 * - import { SimpleTokenCounter } from '@clarity-chat/token-optimization'
 * + import { FastTokenCounter } from '@clarity-chat/token-optimization'
 * ```
 */

export {
  FastTokenCounter as SimpleTokenCounter,
  type FastTokenCounterConfig as SimpleTokenCounterConfig,
} from './fast-counter'
