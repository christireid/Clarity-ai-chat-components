'use client'

import { useEffect, useState, useRef } from 'react'
import { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

type InitializationState = 'idle' | 'initializing' | 'initialized' | 'error'

/**
 * Hook to initialize and manage the particles engine
 * Uses singleton pattern to prevent multiple initializations
 * 
 * @returns Object with initialization state and error
 */
export function useParticlesEngine() {
  const [state, setState] = useState<InitializationState>('idle')
  const [error, setError] = useState<Error | null>(null)
  const initializationRef = useRef<Promise<void> | null>(null)
  const stateRef = useRef<InitializationState>('idle')
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    // If already initialized, set state immediately
    if (stateRef.current === 'initialized') {
      if (mountedRef.current) {
        setState('initialized')
      }
      return
    }

    // If already initializing, wait for existing promise
    if (stateRef.current === 'initializing' && initializationRef.current) {
      initializationRef.current
        .then(() => {
          if (mountedRef.current) {
            stateRef.current = 'initialized'
            setState('initialized')
            setError(null)
          }
        })
        .catch((err) => {
          if (mountedRef.current) {
            stateRef.current = 'error'
            setState('error')
            setError(err instanceof Error ? err : new Error('Failed to initialize particles engine'))
          }
        })
      return
    }

    // Start new initialization
    stateRef.current = 'initializing'
    if (mountedRef.current) {
      setState('initializing')
    }

    const initPromise = initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    })
      .then(() => {
        if (mountedRef.current) {
          stateRef.current = 'initialized'
          setState('initialized')
          setError(null)
        }
      })
      .catch((err) => {
        const error = err instanceof Error ? err : new Error('Failed to load particles engine')
        if (mountedRef.current) {
          stateRef.current = 'error'
          setState('error')
          setError(error)
        }
        if (process.env.NODE_ENV === 'development') {
          console.error('[AnimatedBackground] Failed to initialize particles:', error)
        }
        throw error
      })

    initializationRef.current = initPromise

    // Cleanup: mark as unmounted
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    isInitialized: state === 'initialized',
    isInitializing: state === 'initializing',
    hasError: state === 'error',
    error,
  }
}
