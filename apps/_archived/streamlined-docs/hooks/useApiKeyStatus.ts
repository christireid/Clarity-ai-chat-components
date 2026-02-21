'use client'

import { useState, useEffect, useCallback } from 'react'

export type AIProvider = 'openai' | 'anthropic' | 'google'

export interface ProviderStatus {
  provider: AIProvider
  configured: boolean
  name: string
}

export interface ApiKeyStatus {
  /** Whether any provider is configured */
  isConfigured: boolean
  /** Whether the status check is still loading */
  isLoading: boolean
  /** Any error that occurred during status check */
  error: Error | null
  /** Status of OpenAI API key */
  hasOpenAI: boolean
  /** Status of Anthropic API key */
  hasAnthropic: boolean
  /** Status of Google API key */
  hasGoogle: boolean
  /** Array of all providers with their status */
  providers: ProviderStatus[]
  /** The first available provider (for default selection) */
  defaultProvider: AIProvider | null
  /** Refetch the status */
  refetch: () => Promise<void>
}

interface ProviderStatusResponse {
  openai: boolean
  anthropic: boolean
  google: boolean
}

/**
 * Hook to check the status of API keys for various AI providers.
 *
 * This hook fetches the provider status from a secure API endpoint
 * that checks environment variables server-side (never exposing keys).
 *
 * @example
 * ```tsx
 * function MyDemo() {
 *   const { isConfigured, hasOpenAI, isLoading } = useApiKeyStatus()
 *
 *   if (isLoading) return <Spinner />
 *
 *   if (!isConfigured) {
 *     return <SetupRequired provider="any" feature="demo" />
 *   }
 *
 *   return <LiveDemo provider={hasOpenAI ? 'openai' : 'anthropic'} />
 * }
 * ```
 */
export function useApiKeyStatus(): ApiKeyStatus {
  const [status, setStatus] = useState<ProviderStatusResponse>({
    openai: false,
    anthropic: false,
    google: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStatus = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/provider-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Cache for 5 minutes
        next: { revalidate: 300 },
        signal,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch provider status: ${response.status}`)
      }

      const data: ProviderStatusResponse = await response.json()
      setStatus(data)
    } catch (err) {
      // Ignore abort errors - component unmounted
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      // If the endpoint doesn't exist or fails, assume no providers configured
      // This is a graceful fallback for development
      console.warn('Could not fetch provider status, assuming none configured:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setStatus({
        openai: false,
        anthropic: false,
        google: false,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch on mount with AbortController for cleanup
  useEffect(() => {
    const controller = new AbortController()
    fetchStatus(controller.signal)
    return () => {
      controller.abort()
    }
  }, [fetchStatus])

  const providers: ProviderStatus[] = [
    { provider: 'openai', configured: status.openai, name: 'OpenAI' },
    { provider: 'anthropic', configured: status.anthropic, name: 'Anthropic' },
    { provider: 'google', configured: status.google, name: 'Google' },
  ]

  const configuredProviders = providers.filter((p) => p.configured)
  const defaultProvider = configuredProviders[0]?.provider ?? null

  return {
    isConfigured: status.openai || status.anthropic || status.google,
    isLoading,
    error,
    hasOpenAI: status.openai,
    hasAnthropic: status.anthropic,
    hasGoogle: status.google,
    providers,
    defaultProvider,
    refetch: fetchStatus,
  }
}

/**
 * Hook to check if a specific provider is configured.
 *
 * @param provider - The provider to check
 * @returns Object with loading state and configured status
 *
 * @example
 * ```tsx
 * function OpenAIDemo() {
 *   const { isConfigured, isLoading } = useProviderStatus('openai')
 *
 *   if (!isConfigured) {
 *     return <SetupRequired provider="openai" feature="demo" />
 *   }
 *
 *   return <LiveDemo />
 * }
 * ```
 */
export function useProviderStatus(provider: AIProvider) {
  const status = useApiKeyStatus()

  const isConfigured = (() => {
    switch (provider) {
      case 'openai':
        return status.hasOpenAI
      case 'anthropic':
        return status.hasAnthropic
      case 'google':
        return status.hasGoogle
      default:
        return false
    }
  })()

  return {
    isConfigured,
    isLoading: status.isLoading,
    error: status.error,
    refetch: status.refetch,
  }
}

export default useApiKeyStatus
