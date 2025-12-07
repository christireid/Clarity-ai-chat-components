import { useEffect, useRef, useState } from 'react'
import type { Engine } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

// Dynamic import to reduce initial bundle size
let initParticlesEnginePromise: Promise<typeof import('@tsparticles/react')> | null = null

async function getInitParticlesEngine() {
  if (!initParticlesEnginePromise) {
    initParticlesEnginePromise = import('@tsparticles/react')
  }
  const module = await initParticlesEnginePromise
  return module.initParticlesEngine
}

interface UseParticlesEngineResult {
  isInitialized: boolean
  error: Error | null
}

/**
 * Hook to initialize the tsparticles engine with error handling and cleanup.
 * Handles async initialization and prevents memory leaks on unmount.
 *
 * @returns Object with `isInitialized` boolean and `error` Error | null
 *
 * @example
 * ```tsx
 * const { isInitialized, error } = useParticlesEngine()
 * if (error) {
 *   // Handle error
 * }
 * ```
 */
export function useParticlesEngine(): UseParticlesEngineResult {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const isMountedRef = useRef(true)
  const cancelledRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    cancelledRef.current = false

    const initEngine = async () => {
      try {
        const initParticlesEngine = await getInitParticlesEngine()
        await initParticlesEngine(async (engine: Engine) => {
          await loadSlim(engine)
        })

        if (!cancelledRef.current && isMountedRef.current) {
          setIsInitialized(true)
          setError(null)
        }
      } catch (err) {
        if (!cancelledRef.current && isMountedRef.current) {
          const error = err instanceof Error ? err : new Error('Failed to initialize particles engine')
          setError(error)
          console.error('Failed to initialize particles engine:', error)
        }
      }
    }

    initEngine()

    return () => {
      cancelledRef.current = true
      isMountedRef.current = false
    }
  }, [])

  return { isInitialized, error }
}
