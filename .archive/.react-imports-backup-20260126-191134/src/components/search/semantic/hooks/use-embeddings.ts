/**
 * Hook for managing embeddings cache and generation
 */

import * as React from 'react'
import { generateFallbackEmbedding } from '../utils'

export interface UseEmbeddingsOptions {
  onGenerateEmbedding?: (text: string) => Promise<number[]>
}

export function useEmbeddings({ onGenerateEmbedding }: UseEmbeddingsOptions) {
  const embeddingsCache = React.useRef<Map<string, number[]>>(new Map())

  const generateEmbedding = React.useCallback(
    async (text: string): Promise<number[]> => {
      if (embeddingsCache.current.has(text)) {
        return embeddingsCache.current.get(text)!
      }

      if (onGenerateEmbedding) {
        const embedding = await onGenerateEmbedding(text)
        embeddingsCache.current.set(text, embedding)
        return embedding
      }

      // Fallback: generate simple bag-of-words embedding
      const embedding = generateFallbackEmbedding(text)
      embeddingsCache.current.set(text, embedding)
      return embedding
    },
    [onGenerateEmbedding]
  )

  return { generateEmbedding }
}
