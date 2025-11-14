import * as React from 'react'
import { createEmbeddingProvider, createCachedEmbeddingProvider } from './index'
import type {
  EmbeddingProvider,
  EmbeddingConfig,
  EmbeddingCache,
  EmbeddingRequest,
  EmbeddingResponse,
} from './types'

export interface UseEmbeddingsOptions extends EmbeddingConfig {
  /**
   * Provide a custom cache implementation. When present, the provider will be wrapped
   * with `createCachedEmbeddingProvider`.
   */
  cache?: EmbeddingCache
  /**
   * Whether caching should be enabled (defaults to true when a cache is supplied).
   */
  useCache?: boolean
}

export interface UseEmbeddingsReturn {
  provider: EmbeddingProvider | null
  status: 'idle' | 'ready' | 'error'
  error: Error | null
  embed: (request: EmbeddingRequest) => Promise<EmbeddingResponse>
  embedText: (text: string, model?: string) => Promise<number[]>
  embedBatch: (texts: string[], model?: string) => Promise<number[][]>
  getDimension: (model?: string) => number
  reset: () => void
}

/**
 * React hook that returns a memoised embedding provider with optional caching.
 */
export function useEmbeddings(
  options: UseEmbeddingsOptions
): UseEmbeddingsReturn {
  const { cache, useCache = cache != null, ...config } = options
  const configKey = React.useMemo(() => JSON.stringify(config), [config])

  const providerRef = React.useRef<EmbeddingProvider | null>(null)
  const [status, setStatus] = React.useState<'idle' | 'ready' | 'error'>('idle')
  const [error, setError] = React.useState<Error | null>(null)

  const instantiate = React.useCallback(() => {
    try {
      const base = createEmbeddingProvider(config as EmbeddingConfig)
      providerRef.current =
        useCache || cache
          ? createCachedEmbeddingProvider(base, { cache })
          : base
      setStatus('ready')
      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setStatus('error')
      setError(error)
      providerRef.current = null
    }
  }, [configKey, useCache, cache])

  React.useEffect(() => {
    instantiate()
  }, [instantiate])

  const ensureProvider = React.useCallback(() => {
    if (!providerRef.current) {
      instantiate()
    }
    if (!providerRef.current) {
      throw new Error('Failed to create embedding provider')
    }
    return providerRef.current
  }, [instantiate])

  const embed = React.useCallback(
    async (request: EmbeddingRequest) => {
      const provider = ensureProvider()
      return provider.embed(request)
    },
    [ensureProvider]
  )

  const embedText = React.useCallback(
    async (text: string, model?: string) => {
      const provider = ensureProvider()
      return provider.embedText(text, model)
    },
    [ensureProvider]
  )

  const embedBatch = React.useCallback(
    async (texts: string[], model?: string) => {
      const provider = ensureProvider()
      return provider.embedBatch(texts, model)
    },
    [ensureProvider]
  )

  const getDimension = React.useCallback(
    (model?: string) => {
      const provider = ensureProvider()
      return provider.getDimension(model)
    },
    [ensureProvider]
  )

  const reset = React.useCallback(() => {
    providerRef.current = null
    setStatus('idle')
    setError(null)
    instantiate()
  }, [instantiate])

  return {
    provider: providerRef.current,
    status,
    error,
    embed,
    embedText,
    embedBatch,
    getDimension,
    reset,
  }
}
