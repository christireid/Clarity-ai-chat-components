'use client'

import { useState, useCallback } from 'react'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import { useCircuitBreaker } from '@clarity-chat/react'
import {
  useRetryWithBackoff,
  useSafeInterval,
} from '@clarity-chat/react/internal'
import {
  Play,
  X,
  Trash2,
  Timer,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Demo: useRetryWithBackoff – using the real hook
// ---------------------------------------------------------------------------

export function RetryWithBackoffDemo() {
  const [log, setLog] = useState<string[]>([])

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [...prev, msg])
  }, [])

  const { execute, isRetrying, attempt, cancel, lastError, reset } =
    useRetryWithBackoff({
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 8000,
      onRetry: (attemptNum: number, delay: number) => {
        addLog(`Retry #${attemptNum} after ${delay}ms delay...`)
      },
    })

  const maxRetries = 3

  const handleExecute = useCallback(async () => {
    setLog([])
    addLog('Initial attempt...')

    try {
      await execute(async () => {
        // Simulate a request that always fails
        const errorMsg = `Request failed (${500 + Math.floor(Math.random() * 10)})`
        addLog(`Failed: ${errorMsg}`)
        throw new Error(errorMsg)
      })
    } catch {
      addLog('All retries exhausted')
    }
  }, [execute, addLog])

  const handleCancel = useCallback(() => {
    cancel()
    addLog('Cancelled by user')
  }, [cancel, addLog])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={handleExecute}
          disabled={isRetrying}
          variant="default"
          size="sm"
        >
          <Play className="h-4 w-4 mr-1" />
          Simulate Failing Request
        </Button>
        {isRetrying && (
          <Button onClick={handleCancel} variant="destructive" size="sm">
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
          {lastError && (
            <Badge variant="destructive">{(lastError as Error).message}</Badge>
          )}
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

// ---------------------------------------------------------------------------
// Demo: useSafeInterval – using the real hook
// ---------------------------------------------------------------------------

export function SafeIntervalDemo() {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const { setSafeInterval, clearAllIntervals } = useSafeInterval()
  const [currentId, setCurrentId] = useState<ReturnType<
    typeof setInterval
  > | null>(null)

  const start = useCallback(() => {
    setIsRunning(true)
    const id = setSafeInterval(() => {
      setCount((c) => c + 1)
    }, 100)
    setCurrentId(id)
  }, [setSafeInterval])

  const stop = useCallback(() => {
    setIsRunning(false)
    clearAllIntervals()
    setCurrentId(null)
  }, [clearAllIntervals])

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

// ---------------------------------------------------------------------------
// Demo: useCircuitBreaker – using the real hook
// ---------------------------------------------------------------------------

export function CircuitBreakerDemo() {
  const [log, setLog] = useState<string[]>([])
  const [successes, setSuccesses] = useState(0)
  const threshold = 3

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [...prev.slice(-6), msg])
  }, [])

  const {
    execute,
    state,
    stats,
    reset: resetBreaker,
  } = useCircuitBreaker({
    failureThreshold: threshold,
    resetTimeout: 3000,
    name: 'demo-circuit',
    onStateChange: (newState: string) => {
      if (newState === 'open') {
        addLog(
          `CIRCUIT OPEN: ${threshold} failures reached - blocking requests`
        )
      } else if (newState === 'half-open') {
        addLog('HALF-OPEN: Allowing one test request...')
      } else if (newState === 'closed') {
        addLog('CIRCUIT CLOSED: Recovery successful')
      }
    },
  })

  const simulateRequest = useCallback(
    async (shouldFail: boolean) => {
      try {
        await execute(async () => {
          if (shouldFail) {
            throw new Error('Simulated failure')
          }
          return 'success'
        })
        setSuccesses((s) => s + 1)
        addLog('SUCCESS: Request succeeded')
      } catch (error) {
        const msg = (error as Error).message
        if (msg.includes('Circuit breaker') || msg.includes('circuit')) {
          addLog('BLOCKED: Circuit is OPEN - request rejected')
        } else {
          addLog(`FAILURE #${stats.failures + 1}: Request failed`)
        }
      }
    },
    [execute, addLog, stats.failures]
  )

  const reset = useCallback(() => {
    resetBreaker()
    setSuccesses(0)
    setLog([])
  }, [resetBreaker])

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
                i < stats.failures ? 'bg-destructive' : 'bg-muted'
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
        <Badge variant="destructive">failures: {stats.failures}</Badge>
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
