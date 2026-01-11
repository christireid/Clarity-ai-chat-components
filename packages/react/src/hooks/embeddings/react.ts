/**
 * Embeddings React hook
 */

'use client'

import * as React from 'react'

export interface EmbeddingsConfig {
  provider: 'openai' | 'cohere' | 'custom'
  apiKey?: string
  model?: string
}

export interface UseEmbeddingsReturn {
  embed: (text: string) => Promise<number[]>
  embedBatch: (texts: string[]) => Promise<number[][]>
  /** Alias for embed - generates embedding for a single text */
  generate: (text: string) => Promise<number[]>
  isReady: boolean
  error: Error | null
}

/**
 * Hook for generating embeddings
 */
export function useEmbeddings(config: EmbeddingsConfig): UseEmbeddingsReturn {
  const [isReady, setIsReady] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    // Initialize embeddings provider
    setIsReady(true)
  }, [config])

  const embed = React.useCallback(async (text: string): Promise<number[]> => {
    // Stub implementation - return empty embedding
    console.log(`[useEmbeddings] Embedding text: ${text.slice(0, 50)}...`)
    return new Array(1536).fill(0)
  }, [])

  const embedBatch = React.useCallback(async (texts: string[]): Promise<number[][]> => {
    console.log(`[useEmbeddings] Embedding ${texts.length} texts`)
    return texts.map(() => new Array(1536).fill(0))
  }, [])

  return {
    embed,
    embedBatch,
    generate: embed, // Alias for embed
    isReady,
    error,
  }
}
