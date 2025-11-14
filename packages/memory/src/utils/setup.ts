/**
 * Clarity Memory - Setup Utilities
 * 
 * Utilities to help users get started quickly
 */

import type { MemoryConfig } from '../core/types'
import { checkEnvironmentSupport } from './validation'

/**
 * Detect the best default store for the current environment
 */
export function detectBestStore(): 'memory' | 'indexeddb' | 'filesystem' {
  if (checkEnvironmentSupport('indexeddb')) {
    return 'indexeddb'
  }
  
  if (checkEnvironmentSupport('filesystem')) {
    return 'filesystem'
  }
  
  return 'memory'
}

/**
 * Get recommended config for the current environment
 */
export function getRecommendedConfig(overrides: Partial<MemoryConfig> = {}): MemoryConfig {
  const store = detectBestStore()
  
  return {
    store,
    maxTokens: 8000,
    enableCompression: true,
    enableSummarization: false,
    ...overrides,
  }
}

/**
 * Quick setup - create a memory instance with smart defaults
 */
export function quickSetup(config?: Partial<MemoryConfig>) {
  // Dynamic import to avoid circular dependencies
  const { clarityMemory } = require('../clarity-memory')
  const recommended = getRecommendedConfig(config)
  return clarityMemory(recommended)
}

/**
 * Check if setup is complete and valid
 */
export function validateSetup(config: MemoryConfig): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check store availability
  if (config.store === 'indexeddb' && !checkEnvironmentSupport('indexeddb')) {
    errors.push('IndexedDB is not available in this environment')
  }
  
  if (config.store === 'filesystem' && !checkEnvironmentSupport('filesystem')) {
    errors.push('File system is not available in this environment')
  }
  
  // Check embedding provider if needed
  if (config.embeddingProvider) {
    if (!checkEnvironmentSupport('fetch')) {
      warnings.push('Fetch API not available - embedding provider may not work')
    }
  }
  
  // Check token budget
  if (config.tokenBudget) {
    const sum = 
      (config.tokenBudget.systemPrompt || 0) +
      (config.tokenBudget.memories || 0) +
      (config.tokenBudget.recentContext || 0) +
      (config.tokenBudget.responseReserve || 0)
    
    if (sum < 0.9 || sum > 1.1) {
      warnings.push(`Token budget percentages sum to ${sum.toFixed(2)}, should be close to 1.0`)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Print setup information (helpful for debugging)
 */
export function printSetupInfo(config: MemoryConfig): void {
  console.log('📦 Clarity Memory Setup Info')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Store: ${config.store || 'memory'}`)
  console.log(`Max Tokens: ${config.maxTokens || 8000}`)
  console.log(`Compression: ${config.enableCompression ? 'enabled' : 'disabled'}`)
  console.log(`Summarization: ${config.enableSummarization ? 'enabled' : 'disabled'}`)
  console.log(`Embedding Provider: ${config.embeddingProvider ? 'configured' : 'not configured'}`)
  
  const validation = validateSetup(config)
  if (validation.errors.length > 0) {
    console.log('\n❌ Errors:')
    validation.errors.forEach(error => console.log(`  - ${error}`))
  }
  if (validation.warnings.length > 0) {
    console.log('\n⚠️  Warnings:')
    validation.warnings.forEach(warning => console.log(`  - ${warning}`))
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}
