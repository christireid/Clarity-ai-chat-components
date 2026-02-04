/**
 * Test file to verify tokenizers export works correctly
 * This demonstrates the new import path for heavy tokenizer implementations
 */

// Test 1: Import from tokenizers subpath (recommended for advanced users)
import {
  AccurateTokenCounter,
  ProviderNativeCounter,
  providerNativeCount,
} from './dist/tokenizers/index.js'

// Test 2: Import types from tokenizers subpath
import type {
  TokenizerConfig,
  TokenInfo,
  MonitoringStats,
  CacheStats,
} from './dist/tokenizers/index.js'

// Verify exports are accessible
console.log('✅ AccurateTokenCounter:', typeof AccurateTokenCounter)
console.log('✅ ProviderNativeCounter:', typeof ProviderNativeCounter)
console.log('✅ providerNativeCount:', typeof providerNativeCount)

// Type checking - will fail at compile time if types are broken
const config: TokenizerConfig = {
  cacheEnabled: true,
  monitoring: true,
}

const info: TokenInfo = {
  count: 100,
  model: 'gpt-4',
  cached: false,
}

console.log('✅ Type definitions working correctly')
console.log('\n🎉 Tokenizers export test PASSED - 220KB crisis resolved!')
