import { useEffect, useState, useRef } from 'react'
import { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine } from '@tsparticles/engine'

interface UseParticlesEngineResult {
  /** Whether the engine has been initialized */
  isInitialized: boolean
  /** Error that occurred during initialization, if any */
  error: Error | null
  /** Whether initialization is in progress */
  isLoading: boolean
}

/**
 * Hook to initialize the tsparticles engine with error handling and cleanup.
 * 
 * @returns Object containing initialization state and error
 * 
 * @example
 * ```tsx
 * const { isInitialized, error, isLoading } = useParticlesEngine()
 * if (error) {
 *   // Handle error
 * }
 * ```
 */
export function useParticlesEngine(): UseParticlesEngineResult {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initAbortedRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError(null)

    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine)
    })
      .then(() => {
        if (isMounted && !initAbortedRef.current) {
          setIsInitialized(true)
          setError(null)
          setIsLoading(false)
        }
      })
      .catch((err: Error) => {
        if (isMounted && !initAbortedRef.current) {
          setError(err)
          setIsInitialized(false)
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
      initAbortedRef.current = true
    }
  }, [])

  return { isInitialized, error, isLoading }
}
