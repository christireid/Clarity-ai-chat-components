/**
 * React hooks for embeddings
 */

import * as React from 'react'
import type { EmbeddingProvider } from './types'
import { createEmbeddingProvider } from './factory'

/**
 * Options for useEmbeddings
 */
export interface UseEmbeddingsOptions {
  /** Embedding provider */
  provider: 'openai' | 'cohere' | 'custom'
  /** API key */
  apiKey?: string
  /** Model name */
  model?: string
}

/**
 * Return type for useEmbeddings
 */
export interface UseEmbeddingsReturn {
  /** Generate embeddings for text */
  generate: (text: string | string[]) => Promise<number[] | number[][]>
  /** Provider instance */
  provider: EmbeddingProvider | null
}

/**
 * useEmbeddings - React hook for embeddings
 */
export function useEmbeddings(
  options: UseEmbeddingsOptions
): UseEmbeddingsReturn {
  const { provider, apiKey, model } = options

  const embeddingProvider = React.useMemo(() => {
    if (!apiKey) return null
    return createEmbeddingProvider({
      provider,
      apiKey,
      model,
    })
  }, [provider, apiKey, model])

  const generate = React.useCallback(
    async (text: string | string[]) => {
      if (!embeddingProvider) {
        throw new Error('Embedding provider not initialized')
      }
      const response = await embeddingProvider.embed({ input: text })
      return Array.isArray(text)
        ? response.embeddings
        : (response.embeddings[0] ?? [])
    },
    [embeddingProvider]
  )

  return {
    generate,
    provider: embeddingProvider,
  }
}
