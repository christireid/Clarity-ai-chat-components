import { logger } from '@clarity-chat/utils/logger';
import { useCallback, useState, useRef, useLayoutEffect } from 'react'

/**
 * Recovery strategy function type
 */
export type RecoveryStrategy = () => void | Promise<void>

/**
 * Hook for managing custom error recovery strategies
 * 
 * @example
 * ```tsx
 * const { registerStrategy, recover, isRecovering } = useErrorRecovery()
 * 
 * // Register recovery strategies
 * registerStrategy('API_ERROR', async () => {
 *   await reconnectToAPI()
 * })
 * 
 * registerStrategy('AUTH_ERROR', async () => {
 *   await refreshToken()
 * })
 * 
 * // Trigger recovery
 * await recover('API_ERROR')
 * ```
 */
export function useErrorRecovery() {
  const [strategies, setStrategies] = useState<Map<string, RecoveryStrategy>>(
    new Map()
  )
  const [isRecovering, setIsRecovering] = useState(false)
  const [lastRecoveryError, setLastRecoveryError] = useState<Error | null>(
    null
  )

  const registerStrategy = useCallback(
    (errorType: string, strategy: RecoveryStrategy) => {
      setStrategies((prev) => {
        const updated = new Map(prev)
        updated.set(errorType, strategy)
        return updated
      })
    },
    []
  )

  const unregisterStrategy = useCallback((errorType: string) => {
    setStrategies((prev) => {
      const updated = new Map(prev)
      updated.delete(errorType)
      return updated
    })
  }, [])

  // Store strategies in ref to avoid dependency issues
  const strategiesRef = useRef(strategies)
  
  useLayoutEffect(() => {
    strategiesRef.current = strategies
  }, [strategies])

  const recover = useCallback(
    async (errorType: string): Promise<boolean> => {
      const strategy = strategiesRef.current.get(errorType)

      if (!strategy) {
        logger.warn(`No recovery strategy found for error type: ${errorType}`)
        return false
      }

      setIsRecovering(true)
      setLastRecoveryError(null)

      try {
        await strategy()
        setIsRecovering(false)
        return true
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setLastRecoveryError(error)
        setIsRecovering(false)
        logger.logger.error('Recovery strategy failed:', error)
        return false
      }
    },
    [] // Strategies accessed via ref
  )

  const reset = useCallback(() => {
    setLastRecoveryError(null)
    setIsRecovering(false)
  }, [])

  return {
    /** Register a recovery strategy for an error type */
    registerStrategy,
    /** Unregister a recovery strategy */
    unregisterStrategy,
    /** Attempt to recover from an error using its registered strategy */
    recover,
    /** Whether a recovery operation is in progress */
    isRecovering,
    /** Last error that occurred during recovery */
    lastRecoveryError,
    /** Reset recovery state */
    reset,
    /** Map of all registered strategies */
    strategies,
  }
}
