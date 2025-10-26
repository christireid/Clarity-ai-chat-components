/**
 * Model Adapters
 * 
 * Export all model adapters and utilities
 */

export * from './types'
export { openAIAdapter, openAIModels } from './openai'
export { anthropicAdapter, anthropicModels } from './anthropic'
export { googleAdapter, googleModels } from './google'

// Export combined model list
import { openAIModels } from './openai'
import { anthropicModels } from './anthropic'
import { googleModels } from './google'

export const allModels = [
  ...openAIModels,
  ...anthropicModels,
  ...googleModels
]

// Helper to get adapter by provider name
import type { ModelAdapter } from './types'
import { openAIAdapter } from './openai'
import { anthropicAdapter } from './anthropic'
import { googleAdapter } from './google'

export function getAdapter(provider: string): ModelAdapter {
  switch (provider) {
    case 'openai':
      return openAIAdapter
    case 'anthropic':
      return anthropicAdapter
    case 'google':
      return googleAdapter
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
