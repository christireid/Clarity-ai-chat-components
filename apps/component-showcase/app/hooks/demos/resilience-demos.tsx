'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import {
  Play,
  X,
  Trash2,
  Timer,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react'

export function RetryWithBackoffDemo() {
  const [isRetrying, setIsRetrying] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [maxRetries] = useState(3)
  const [log, setLog] = useState<string[]>([])
  const [lastError, setLastError] = useState<string | null>(null)
  const cancelledRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [...prev, msg])
  }, [])

  const cancel = useCallback(() => {
    cancelledRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsRetrying(false)
    setAttempt(0)
    addLog('Cancelled by user')
  }, [addLog])

  const execute = useCallback(async () => {
    setLog([])
    setLastError(null)
    setIsRetrying(true)
    setAttempt(0)
    cancelledRef.current = false

    for (let i = 0; i <= maxRetries; i++) {
      if (cancelledRef.current) return
      setAttempt(i)

      const delay = Math.min(1000 * Math.pow(2, i), 8000)
      addLog(
        i === 0 ? 'Initial attempt...' : `Retry #${i} after ${delay}ms delay...`
      )

      await new Promise<void>((resolve) => {
        timerRef.current = setTimeout(resolve, i === 0 ? 500 : delay)
      })

      if (cancelledRef.current) return

      const shouldFail = i < maxRetries
      if (shouldFail) {
        const errorMsg = `Request failed (${500 + i * 2})`
        setLastError(errorMsg)
        addLog(`Failed: ${errorMsg}`)
      } else {
        addLog('All retries exhausted')
        setLastError('Request failed after all retries')
      }
    }
    setIsRetrying(false)
  }, [maxRetries, addLog])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={execute}
          disabled={isRetrying}
          variant="default"
          size="sm"
        >
          <Play className="h-4 w-4 mr-1" />
          Simulate Failing Request
        </Button>
        {isRetrying && (
          <Button onClick={cancel} variant="destructive" size="sm">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>

      <div className="glass-panel p-4 rounded-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex gap-1">
            {Array.from({ length: maxRetries + 1 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-2 w-8 rounded-full transition-colors',
                  i < attempt
                    ? 'bg-destructive'
                    : i === attempt && isRetrying
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-muted'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Attempt {attempt + 1} / {maxRetries + 1}
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant={isRetrying ? 'default' : 'secondary'}>
            {isRetrying ? 'Retrying...' : 'Idle'}
          </Badge>
          {lastError && <Badge variant="destructive">{lastError}</Badge>}
        </div>
      </div>

      {log.length > 0 && (
        <div className="glass-panel p-3 rounded-lg max-h-40 overflow-y-auto">
          <div className="space-y-1">
            {log.map((entry, i) => (
              <p key={i} className="text-xs font-mono text-muted-foreground">
                <span className="text-muted-foreground/60">
                  [{String(i).padStart(2, '0')}]
                </span>{' '}
                {entry}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function SafeIntervalDemo() {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setCount((c) => c + 1)
    }, 100)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Safe setInterval with automatic cleanup on unmount. Prevents memory
        leaks from intervals that outlive their component.
      </p>
      <div className="glass-panel p-6 rounded-lg text-center">
        <p className="text-4xl font-mono font-bold gradient-text mb-1">
          {count}
        </p>
        <p className="text-xs text-muted-foreground">ticks (100ms interval)</p>
      </div>
      <div className="flex gap-2 justify-center">
        <Button
          variant="default"
          size="sm"
          onClick={start}
          disabled={isRunning}
        >
          <Play className="h-4 w-4 mr-1" />
          Start
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={stop}
          disabled={!isRunning}
        >
          <Timer className="h-4 w-4 mr-1" />
          Stop
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            stop()
            setCount(0)
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
      <div className="flex gap-2 justify-center">
        <Badge variant={isRunning ? 'default' : 'secondary'}>
          {isRunning ? 'Running' : 'Stopped'}
        </Badge>
        <Badge variant="outline">cleanup: automatic on unmount</Badge>
      </div>
    </div>
  )
}

export function CircuitBreakerDemo() {
  const [state, setState] = useState<'closed' | 'open' | 'half-open'>('closed')
  const [failures, setFailures] = useState(0)
  const [successes, setSuccesses] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const threshold = 3
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [...prev.slice(-6), msg])
  }, [])

  const simulateRequest = useCallback(
    (shouldFail: boolean) => {
      if (state === 'open') {
        addLog('BLOCKED: Circuit is OPEN - request rejected')
        return
      }

      if (shouldFail) {
        const newFailures = failures + 1
        setFailures(newFailures)
        addLog(`FAILURE #${newFailures}: Request failed`)

        if (newFailures >= threshold) {
          setState('open')
          addLog(
            `CIRCUIT OPEN: ${threshold} failures reached - blocking requests`
          )
          if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
          resetTimerRef.current = setTimeout(() => {
            setState('half-open')
            addLog('HALF-OPEN: Allowing one test request...')
          }, 3000)
        }
      } else {
        setSuccesses((s) => s + 1)
        addLog('SUCCESS: Request succeeded')
        if (state === 'half-open') {
          setState('closed')
          setFailures(0)
          addLog('CIRCUIT CLOSED: Recovery successful')
        }
      }
    },
    [state, failures, threshold, addLog]
  )

  const reset = useCallback(() => {
    setState('closed')
    setFailures(0)
    setSuccesses(0)
    setLog([])
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
  }, [])

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [])

  const stateColor =
    state === 'closed'
      ? 'text-green-500'
      : state === 'open'
        ? 'text-destructive'
        : 'text-yellow-500'

  const StateIcon =
    state === 'closed'
      ? ShieldCheck
      : state === 'open'
        ? ShieldOff
        : ShieldAlert

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 rounded-lg flex items-center gap-4">
        <StateIcon className={cn('h-8 w-8', stateColor)} />
        <div>
          <p className={cn('text-lg font-bold uppercase', stateColor)}>
            {state}
          </p>
          <p className="text-xs text-muted-foreground">
            {state === 'closed' && 'Requests flowing normally'}
            {state === 'open' && 'All requests blocked (resets in 3s)'}
            {state === 'half-open' && 'Testing with one request...'}
          </p>
        </div>
        <div className="ml-auto flex gap-1">
          {Array.from({ length: threshold }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-3 w-3 rounded-full',
                i < failures ? 'bg-destructive' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => simulateRequest(true)}
        >
          Simulate Failure
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => simulateRequest(false)}
        >
          Simulate Success
        </Button>
        <Button variant="outline" size="sm" onClick={reset}>
          Reset
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline">threshold: {threshold}</Badge>
        <Badge variant="destructive">failures: {failures}</Badge>
        <Badge variant="default">successes: {successes}</Badge>
        <Badge variant="outline">resetTimeout: 3s</Badge>
      </div>

      {log.length > 0 && (
        <div className="glass-panel p-3 rounded-lg max-h-36 overflow-y-auto">
          <div className="space-y-1">
            {log.map((entry, i) => (
              <p key={i} className="text-xs font-mono text-muted-foreground">
                {entry}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
