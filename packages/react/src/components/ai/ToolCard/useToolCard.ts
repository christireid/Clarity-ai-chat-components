/**
 * useToolCard Hook
 *
 * Hook for managing ToolCard state and execution lifecycle
 * @packageDocumentation
 */

import * as React from 'react'
import type { UseToolCardOptions, UseToolCardReturn, ToolCardStatus } from './types'

/**
 * Hook for managing ToolCard state
 *
 * @example
 * ```tsx
 * const { status, start, complete, fail, cardProps } = useToolCard({
 *   name: 'web_search',
 *   initialStatus: 'pending'
 * })
 *
 * // Start execution
 * start({ query: 'React hooks' })
 *
 * // Complete with result
 * complete({ results: [...] })
 *
 * // Or fail with error
 * fail('Request timeout')
 *
 * // Use in ToolCard
 * <ToolCard {...cardProps} />
 * ```
 */
export function useToolCard({
  name,
  initialStatus = 'pending',
  initialArgs,
}: UseToolCardOptions): UseToolCardReturn {
  const [status, setStatus] = React.useState<ToolCardStatus>(initialStatus)
  const [args, setArgs] = React.useState<Record<string, unknown> | undefined>(initialArgs)
  const [result, setResult] = React.useState<unknown | undefined>(undefined)
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [duration, setDuration] = React.useState<number | undefined>(undefined)
  const startTimeRef = React.useRef<number | null>(null)

  const start = React.useCallback((newArgs?: Record<string, unknown>) => {
    startTimeRef.current = Date.now()
    setStatus('running')
    if (newArgs) setArgs(newArgs)
    setResult(undefined)
    setError(undefined)
    setDuration(undefined)
  }, [])

  const complete = React.useCallback((newResult: unknown) => {
    setStatus('success')
    setResult(newResult)
    if (startTimeRef.current) {
      setDuration(Date.now() - startTimeRef.current)
    }
  }, [])

  const fail = React.useCallback((errorMsg: string) => {
    setStatus('error')
    setError(errorMsg)
    if (startTimeRef.current) {
      setDuration(Date.now() - startTimeRef.current)
    }
  }, [])

  const reset = React.useCallback(() => {
    startTimeRef.current = null
    setStatus('pending')
    setResult(undefined)
    setError(undefined)
    setDuration(undefined)
  }, [])

  return {
    status,
    args,
    result,
    error,
    duration,
    start,
    complete,
    fail,
    reset,
    cardProps: {
      name,
      status,
      args,
      result,
      error,
      duration,
    },
  }
}
