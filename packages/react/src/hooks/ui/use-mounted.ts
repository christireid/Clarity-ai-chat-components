'use client'

import * as React from 'react'

/**
 * Track if component is currently mounted.
 * 
 * ⚠️ **DEPRECATED**: This pattern is discouraged in React 18+ with concurrent rendering.
 * 
 * **Why deprecated:**
 * - Masks real bugs (updating unmounted components)
 * - Doesn't work well with Suspense/concurrent features
 * - AbortController is the modern standard for cancellation
 * - Can lead to "zombie children" that appear to work but have subtle issues
 * 
 * **Migration Path:**
 * 
 * **Before (with useMounted):**
 * ```tsx
 * const isMounted = useMounted()
 * 
 * useEffect(() => {
 *   async function fetchData() {
 *     const data = await api.get('/data')
 *     if (isMounted()) {
 *       setData(data)
 *     }
 *   }
 *   fetchData()
 * }, [])
 * ```
 * 
 * **After (with AbortController - RECOMMENDED):**
 * ```tsx
 * useEffect(() => {
 *   const controller = new AbortController()
 *   
 *   async function fetchData() {
 *     try {
 *       const data = await api.get('/data', { signal: controller.signal })
 *       setData(data) // Won't execute if aborted
 *     } catch (error) {
 *       if (error.name !== 'AbortError') {
 *         logger.logger.error('Fetch failed:', error)
 *       }
 *     }
 *   }
 *   
 *   fetchData()
 *   
 *   return () => {
 *     controller.abort() // Cancels the request
 *   }
 * }, [])
 * ```
 * 
 * **After (with ignore flag for non-cancellable operations):**
 * ```tsx
 * useEffect(() => {
 *   let ignore = false
 *   
 *   async function fetchData() {
 *     const data = await api.get('/data')
 *     if (!ignore) {
 *       setData(data)
 *     }
 *   }
 *   
 *   fetchData()
 *   
 *   return () => {
 *     ignore = true
 *   }
 * }, [])
 * ```
 * 
 * **For backwards compatibility**, this hook remains available but will log a
 * warning in development mode. It will be removed in v3.0.
 * 
 * @deprecated Use AbortController or ignore flags instead
 * @see https://react.dev/learn/synchronizing-with-effects#fetching-data
 * @returns {() => boolean} Function that returns true if component is mounted
 */
export function useMounted(): () => boolean {
  const mountedRef = React.useRef(false)

  React.useEffect(() => {
    // Log deprecation warning in development
    if (process.env['NODE_ENV'] === 'development') {
      logger.warn(
        '[useMounted] This hook is deprecated and will be removed in v3.0. ' +
        'Use AbortController for cancellable operations instead. ' +
        'See https://react.dev/learn/synchronizing-with-effects#fetching-data'
      )
    }

    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return React.useCallback(() => mountedRef.current, [])
}
