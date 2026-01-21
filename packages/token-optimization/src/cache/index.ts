/**
 * Cache Entry Point for Token Optimization
 *
 * Import from '@clarity-chat/token-optimization/cache' for cache-specific features.
 *
 * @module cache
 */

export { ExactCache } from './exact-cache'
export type {
  ExactCacheConfig,
  ExactCacheResult,
  ExactCacheStats,
} from './exact-cache'

export { SmartCache } from './smart-cache'
export type {
  SmartCacheConfig,
  SmartCacheResult,
  SmartCacheStats,
} from './smart-cache'

export { TieredCache } from './tiered-cache'
export type {
  TieredCacheConfig,
  TieredCacheResult,
  CacheStats,
  TierStats,
  PrefetchItem,
} from './tiered-cache'
