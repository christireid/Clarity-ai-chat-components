/**
 * Embedding Provider Factory
 *
 * Centralized factory function for creating embedding providers.
 * This module exists to avoid circular dependencies between index.ts and react.tsx.
 *
 * @internal
 */

import type { EmbeddingProvider, EmbeddingConfig } from './types'
import { OpenAIEmbeddingProvider } from './openai'
import { CohereEmbeddingProvider } from './cohere'

/**
 * Create an embedding provider instance
 *
 * @param config - Configuration for the embedding provider
 * @returns An embedding provider instance
 * @throws Error if provider is not supported
 */
export function createEmbeddingProvider(
  config: EmbeddingConfig
): EmbeddingProvider {
  switch (config.provider) {
    case 'openai':
      return new OpenAIEmbeddingProvider(config)

    case 'cohere':
      return new CohereEmbeddingProvider(config)

    default:
      throw new Error(`Unsupported embedding provider: ${config.provider}`)
  }
}
