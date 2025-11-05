import * as React from 'react'
import { ResponseLimiter, ResponseLimitConfig, FormattedPrompt, RESPONSE_PRESETS } from '../utils/response-limiter'

export interface UseResponseLimiterOptions extends ResponseLimitConfig {
  /** Enable limiter (default: true) */
  enabled?: boolean
  /** Use preset configuration */
  preset?: keyof typeof RESPONSE_PRESETS
  /** Callback when response is truncated */
  onTruncate?: (original: string, truncated: string) => void
}

export interface UseResponseLimiterReturn {
  /** Create limited prompt */
  createPrompt: (userPrompt: string) => FormattedPrompt
  /** Enforce limits on response */
  enforce: (response: string) => {
    response: string
    truncated: boolean
    originalLength: number
    finalLength: number
    tokensSaved: number
  }
  /** Get statistics */
  stats: {
    totalResponses: number
    totalTruncated: number
    truncationRate: number
    avgOriginalLength: number
    avgFinalLength: number
    tokensSaved: number
    savingsPercent: number
  }
  /** Update configuration */
  updateConfig: (config: Partial<ResponseLimitConfig>) => void
  /** Reset statistics */
  resetStats: () => void
  /** Current configuration */
  config: ResponseLimitConfig
}

/**
 * Hook for response output limiting
 * 
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const limiter = useResponseLimiter({
 *     preset: 'brief',
 *     onTruncate: (original, truncated) => {
 *       console.log(`Truncated ${original.length - truncated.length} characters`)
 *     }
 *   })
 * 
 *   const handleQuery = async (query: string) => {
 *     // Create limited prompt
 *     const { prompt } = limiter.createPrompt(query)
 *     
 *     // Send to API with max_tokens from config
 *     const response = await queryAPI(prompt, {
 *       max_tokens: limiter.config.maxTokens
 *     })
 *     
 *     // Enforce limits on response
 *     const { response: limited, tokensSaved } = limiter.enforce(response)
 *     
 *     console.log(`Saved ${tokensSaved} tokens!`)
 *     return limited
 *   }
 * 
 *   return (
 *     <div>
 *       <div>Tokens Saved: {limiter.stats.tokensSaved}</div>
 *       <div>Savings: {limiter.stats.savingsPercent.toFixed(1)}%</div>
 *       <div>Truncation Rate: {limiter.stats.truncationRate.toFixed(1)}%</div>
 *     </div>
 *   )
 * }
 * ```
 */
export function useResponseLimiter(
  options: UseResponseLimiterOptions = {}
): UseResponseLimiterReturn {
  const {
    enabled = true,
    preset,
    onTruncate,
    ...configOptions
  } = options

  // Get config from preset or options
  const initialConfig = preset ? RESPONSE_PRESETS[preset] : configOptions

  const [config, setConfig] = React.useState<ResponseLimitConfig>(initialConfig)
  const [stats, setStats] = React.useState({
    totalResponses: 0,
    totalTruncated: 0,
    truncationRate: 0,
    avgOriginalLength: 0,
    avgFinalLength: 0,
    tokensSaved: 0,
    savingsPercent: 0,
  })

  // Create limiter instance (memoized)
  const limiter = React.useMemo(
    () => new ResponseLimiter(config),
    [config]
  )

  const createPrompt = React.useCallback(
    (userPrompt: string): FormattedPrompt => {
      if (!enabled) {
        return {
          prompt: userPrompt,
          original: userPrompt,
          constraints: [],
          estimatedMaxTokens: 1000,
        }
      }
      return limiter.createPrompt(userPrompt)
    },
    [limiter, enabled]
  )

  const enforce = React.useCallback(
    (response: string) => {
      if (!enabled) {
        return {
          response,
          truncated: false,
          originalLength: response.length,
          finalLength: response.length,
          tokensSaved: 0,
        }
      }

      const result = limiter.enforce(response)
      
      if (result.truncated) {
        onTruncate?.(response, result.response)
      }

      setStats(limiter.getStats())

      return result
    },
    [limiter, enabled, onTruncate]
  )

  const updateConfig = React.useCallback(
    (newConfig: Partial<ResponseLimitConfig>) => {
      setConfig((prev) => ({ ...prev, ...newConfig }))
      limiter.updateConfig(newConfig)
    },
    [limiter]
  )

  const resetStats = React.useCallback(() => {
    limiter.resetStats()
    setStats(limiter.getStats())
  }, [limiter])

  return {
    createPrompt,
    enforce,
    stats,
    updateConfig,
    resetStats,
    config,
  }
}
