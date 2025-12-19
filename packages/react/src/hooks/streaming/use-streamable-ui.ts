'use client'

import * as React from 'react'

export type StreamableValueLike<T> = {
  value?: T | null
  /** Subscribe to incremental updates */
  subscribe: (listener: (value: T) => void) => void | (() => void)
  /** Optional completion listener (mirrors Vercel StreamableValue.onDone) */
  onDone?: (listener: () => void) => void | (() => void)
  /** Hint that streaming completed */
  done?: boolean
}

type StreamableSource<T> =
  | StreamableValueLike<T>
  | AsyncIterable<T>
  | PromiseLike<T>
  | ReadableStream<T | Uint8Array | string>

type TransformFn<T> = (value: unknown) => T | null | undefined
type CompleteWhenFn = (value: unknown) => boolean

export interface UseStreamableUIOptions<T> {
  /** Append (default) or replace values on each update */
  mode?: 'append' | 'replace'
  /** Transform incoming payloads (e.g. decode Uint8Array) */
  transform?: TransformFn<T>
  /** Decide when streaming should be marked complete */
  completeWhen?: CompleteWhenFn
  /** Invoked on each transformed update */
  onUpdate?: (value: T) => void
  /** Invoked when stream completes */
  onComplete?: (finalValue: T | null) => void
  /** Invoked on error */
  onError?: (error: Error) => void
}

export interface UseStreamableUIState<T> {
  values: T[]
  latest: T | null
  status: 'idle' | 'streaming' | 'complete' | 'error'
  isStreaming: boolean
  /** Current error (undefined when no error) */
  error: Error | undefined
  reset: () => void
}

const identityTransform: TransformFn<any> = (value) => value as any

const isAsyncIterable = <T>(value: unknown): value is AsyncIterable<T> =>
  Boolean(value) && typeof (value as any)[Symbol.asyncIterator] === 'function'

const isPromiseLike = <T>(value: unknown): value is PromiseLike<T> =>
  Boolean(value) && typeof (value as any).then === 'function'

const isReadableStream = (value: unknown): value is ReadableStream<any> =>
  Boolean(value) &&
  typeof (value as ReadableStream<any>).getReader === 'function'

const toAsyncIterableFromReadable = (
  stream: ReadableStream<any>
): AsyncIterable<any> => ({
  [Symbol.asyncIterator]() {
    const reader = stream.getReader()
    return {
      async next() {
        const { value, done } = await reader.read()
        if (done) {
          reader.releaseLock?.()
          return { value: undefined, done: true }
        }
        return { value, done: false }
      },
      async return() {
        try {
          await reader.cancel()
        } catch {
          // ignore cancellation errors
        }
        reader.releaseLock?.()
        return { value: undefined, done: true }
      },
    }
  },
})

export function useStreamableUI<T>(
  source: StreamableSource<T> | null | undefined,
  options: UseStreamableUIOptions<T> = {}
): UseStreamableUIState<T> {
  const {
    mode = 'append',
    transform = identityTransform,
    completeWhen,
    onUpdate,
    onComplete,
    onError,
  } = options

  const transformRef = React.useRef<TransformFn<T>>(transform)
  const completeWhenRef = React.useRef<CompleteWhenFn | undefined>(completeWhen)
  const onUpdateRef = React.useRef<((value: T) => void) | undefined>(onUpdate)
  const onCompleteRef = React.useRef<((value: T | null) => void) | undefined>(
    onComplete
  )
  const onErrorRef = React.useRef<((error: Error) => void) | undefined>(onError)

  React.useEffect(() => {
    transformRef.current = transform
  }, [transform])

  React.useEffect(() => {
    completeWhenRef.current = completeWhen
  }, [completeWhen])

  React.useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  React.useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  React.useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const [values, setValues] = React.useState<T[]>([])
  const [latest, setLatest] = React.useState<T | null>(null)
  const [status, setStatus] = React.useState<
    'idle' | 'streaming' | 'complete' | 'error'
  >('idle')
  const [error, setError] = React.useState<Error | undefined>(undefined)
  const latestRef = React.useRef<T | null>(null)

  const reset = React.useCallback(() => {
    setValues([])
    setLatest(null)
    setStatus('idle')
    setError(undefined)
    latestRef.current = null
  }, [])

  React.useEffect(() => {
    if (!source) {
      reset()
      return
    }

    let cancelled = false

    const setComplete = (finalValue: T | null) => {
      if (cancelled) return
      setStatus('complete')
      onCompleteRef.current?.(finalValue ?? latestRef.current)
    }

    const handleError = (err: unknown) => {
      if (cancelled) return
      const errorInstance = err instanceof Error ? err : new Error(String(err))
      setError(errorInstance)
      setStatus('error')
      onErrorRef.current?.(errorInstance)
    }

    const pushValue = (raw: unknown) => {
      if (cancelled) return

      const shouldComplete = completeWhenRef.current?.(raw) ?? false

      if (raw == null) {
        if (shouldComplete) {
          setComplete(latestRef.current)
        }
        return
      }

      const transformed = transformRef.current(raw)

      if (transformed == null) {
        if (shouldComplete) {
          setComplete(latestRef.current)
        }
        return
      }

      latestRef.current = transformed
      setLatest(transformed)
      setValues((prev) =>
        mode === 'append' ? [...prev, transformed] : [transformed]
      )
      onUpdateRef.current?.(transformed)

      if (shouldComplete) {
        setComplete(transformed)
      }
    }

    const beginStreaming = () => {
      setStatus('streaming')
      setError(undefined)
      setValues([])
      setLatest(null)
      latestRef.current = null
    }

    beginStreaming()

    const cleanupFns: Array<() => void> = []

    const registerCleanup = (fn?: void | (() => void)) => {
      if (typeof fn === 'function') {
        cleanupFns.push(fn)
      }
    }

    const normalizedSource = isReadableStream(source)
      ? toAsyncIterableFromReadable(source)
      : source

    if (isAsyncIterable<T>(normalizedSource)) {
      const iterator = normalizedSource[Symbol.asyncIterator]()

      ;(async () => {
        try {
          while (!cancelled) {
            const { value, done } = await iterator.next()
            if (cancelled) {
              return
            }
            if (done) {
              setComplete(latestRef.current)
              return
            }
            pushValue(value)
          }
        } catch (err) {
          handleError(err)
        } finally {
          if (typeof iterator.return === 'function') {
            try {
              await iterator.return()
            } catch {
              // ignore iterator.return errors
            }
          }
        }
      })()

      return () => {
        cancelled = true
      }
    }

    if (isPromiseLike<T>(normalizedSource)) {
      ;(async () => {
        try {
          const value = await normalizedSource
          pushValue(value)
          setComplete(latestRef.current)
        } catch (err) {
          handleError(err)
        }
      })()

      return () => {
        cancelled = true
      }
    }

    const streamable = normalizedSource as StreamableValueLike<T>

    if (streamable) {
      if ('value' in streamable && streamable.value != null) {
        pushValue(streamable.value)
        if (streamable.done) {
          setComplete(streamable.value)
        }
      }

      const unsubscribe = streamable.subscribe((value) => {
        pushValue(value)
      })

      registerCleanup(unsubscribe)

      if (typeof streamable.onDone === 'function') {
        const unsubscribeDone = streamable.onDone(() => {
          setComplete(latestRef.current)
        })
        registerCleanup(unsubscribeDone)
      } else if (streamable.done) {
        setComplete(latestRef.current)
      }

      return () => {
        cancelled = true
        cleanupFns.forEach((fn) => {
          try {
            fn()
          } catch {
            // noop
          }
        })
      }
    }

    return () => {
      cancelled = true
      cleanupFns.forEach((fn) => {
        try {
          fn()
        } catch {
          // noop
        }
      })
    }
  }, [source, mode, reset])

  return {
    values,
    latest,
    status,
    isStreaming: status === 'streaming',
    error,
    reset,
  }
}
