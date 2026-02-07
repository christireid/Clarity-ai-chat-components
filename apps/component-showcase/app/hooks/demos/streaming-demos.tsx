'use client'

import { useState, useCallback, useRef } from 'react'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import { useLocalStorage } from '@clarity-chat/react'
import { useSmoothedText } from '@clarity-chat/react/internal'
import { parseSSEStream } from '@/lib/sse-utils'
import {
  useAbortController,
  StreamingCursor,
  ApiKeyRequired,
} from '@/lib/demo-utils'
import { Play, RotateCcw, Pause, Zap, Gauge } from 'lucide-react'

// ---------------------------------------------------------------------------
// Demo: Raw vs Smoothed Text (Real API Streaming)
// ---------------------------------------------------------------------------

export function SmoothedTextDemo() {
  const [rawText, setRawText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [tokensPerSecond, setTokensPerSecond] = useState(0)
  const { abort: abortStream, create: createAbort } = useAbortController()
  const startTimeRef = useRef(0)
  const tokenCountRef = useRef(0)
  const [apiKey] = useLocalStorage('clarity-showcase-api-key', '')
  const [model] = useLocalStorage(
    'clarity-showcase-model',
    'claude-sonnet-4-5-20250929'
  )

  const { displayText, isAnimating } = useSmoothedText(rawText, {
    charsPerFrame: 3,
    frameDelay: 16,
  })

  const progress =
    rawText.length > 0 && isStreaming
      ? Math.min(95, rawText.length / 5)
      : rawText.length > 0
        ? 100
        : 0

  const start = useCallback(async () => {
    if (!apiKey) return
    setRawText('')
    setIsStreaming(true)
    setTokensPerSecond(0)
    startTimeRef.current = Date.now()
    tokenCountRef.current = 0

    const controller = createAbort()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content:
                'Explain the transformer architecture in about 150 words. Use markdown with bullet points.',
            },
          ],
          model,
          system:
            'You are a technical writer. Respond with well-formatted markdown.',
        }),
        signal: controller.signal,
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)
      if (!response.body) throw new Error('No response body')

      let accumulated = ''
      for await (const event of parseSSEStream(response.body)) {
        if (event.type === 'text') {
          accumulated += event.text
          tokenCountRef.current++
          setRawText(accumulated)

          const elapsed = (Date.now() - startTimeRef.current) / 1000
          if (elapsed > 0) {
            setTokensPerSecond(Math.round(tokenCountRef.current / elapsed))
          }
        }
        if (event.type === 'done') break
        if (event.type === 'error') throw new Error(event.error)
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setRawText((prev) => prev + `\n\n[Error: ${(error as Error).message}]`)
      }
    }

    setIsStreaming(false)
  }, [apiKey, model, createAbort])

  const stop = useCallback(() => {
    abortStream()
    setIsStreaming(false)
  }, [abortStream])

  const reset = useCallback(() => {
    stop()
    setRawText('')
    setTokensPerSecond(0)
  }, [stop])

  if (!apiKey) {
    return (
      <ApiKeyRequired
        message="Set your API key on the Connected Demo or Hooks Chat & AI tab to enable live streaming demos."
        className="py-8"
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          onClick={isStreaming ? stop : start}
          variant={isStreaming ? 'destructive' : 'default'}
        >
          {isStreaming ? (
            <>
              <Pause className="h-4 w-4 mr-1" /> Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" /> Stream
            </>
          )}
        </Button>
        <Button size="sm" variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reset
        </Button>
        {isStreaming && tokensPerSecond > 0 && (
          <Badge variant="secondary" className="font-mono text-xs">
            <Gauge className="h-3 w-3 mr-1" />
            {tokensPerSecond} tok/s
          </Badge>
        )}
        <Badge
          variant={isStreaming ? 'default' : 'outline'}
          className="font-mono text-xs"
        >
          {isStreaming ? 'Streaming...' : rawText ? 'Complete' : 'Ready'}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary/60 rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Side by side comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Raw Stream
            </span>
          </div>
          <div className="text-sm min-h-[200px] whitespace-pre-wrap">
            {rawText}
            {isStreaming && <StreamingCursor height="h-4" />}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5 text-green-500" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Smoothed (useSmoothedText)
            </span>
            {isAnimating && (
              <Badge variant="secondary" className="text-[10px] h-4">
                animating
              </Badge>
            )}
          </div>
          <div className="text-sm min-h-[200px] whitespace-pre-wrap">
            {displayText}
            {(isStreaming || isAnimating) && <StreamingCursor height="h-4" />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Demo: Speed Comparison (Real API with different smoothing rates)
// ---------------------------------------------------------------------------

export function StreamSpeedDemo() {
  const [rawText, setRawText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const { abort: abortStream, create: createAbort } = useAbortController()
  const [apiKey] = useLocalStorage('clarity-showcase-api-key', '')
  const [model] = useLocalStorage(
    'clarity-showcase-model',
    'claude-sonnet-4-5-20250929'
  )

  const { displayText: slowText } = useSmoothedText(rawText, {
    charsPerFrame: 1,
    frameDelay: 40,
  })
  const { displayText: mediumText } = useSmoothedText(rawText, {
    charsPerFrame: 3,
    frameDelay: 16,
  })
  const { displayText: fastText } = useSmoothedText(rawText, {
    charsPerFrame: 8,
    frameDelay: 8,
  })

  const startAll = useCallback(async () => {
    if (!apiKey) return
    setRawText('')
    setIsStreaming(true)

    const controller = createAbort()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content:
                'Explain React Server Components in about 80 words. Be concise and technical.',
            },
          ],
          model,
        }),
        signal: controller.signal,
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)
      if (!response.body) throw new Error('No response body')

      let accumulated = ''
      for await (const event of parseSSEStream(response.body)) {
        if (event.type === 'text') {
          accumulated += event.text
          setRawText(accumulated)
        }
        if (event.type === 'done') break
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setRawText((prev) => prev + `\n\n[Error: ${(error as Error).message}]`)
      }
    }

    setIsStreaming(false)
  }, [apiKey, model, createAbort])

  const resetAll = useCallback(() => {
    abortStream()
    setRawText('')
    setIsStreaming(false)
  }, [abortStream])

  if (!apiKey) {
    return <ApiKeyRequired />
  }

  const entries = [
    { label: 'Slow (1 char/40ms)', text: slowText, color: 'text-red-400' },
    {
      label: 'Medium (3 chars/16ms)',
      text: mediumText,
      color: 'text-amber-400',
    },
    { label: 'Fast (8 chars/8ms)', text: fastText, color: 'text-green-400' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={startAll} disabled={isStreaming}>
          <Play className="h-4 w-4 mr-1" /> Race All
        </Button>
        <Button size="sm" variant="outline" onClick={resetAll}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reset
        </Button>
        {isStreaming && (
          <Badge variant="default" className="text-xs">
            Streaming from API...
          </Badge>
        )}
      </div>

      {entries.map(({ label, text, color }) => {
        const pct =
          rawText.length > 0
            ? Math.min(100, (text.length / rawText.length) * 100)
            : 0

        return (
          <div key={label} className="glass-panel p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className={cn('text-xs font-medium', color)}>{label}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {Math.round(pct)}%
              </span>
            </div>
            <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden mb-2">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-100',
                  color.replace('text-', 'bg-').replace('400', '500/60')
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {text || 'Waiting...'}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Demo: Stream Status Lifecycle (Real API)
// ---------------------------------------------------------------------------

export function StreamStatusDemo() {
  const [status, setStatus] = useState<
    'idle' | 'connecting' | 'streaming' | 'complete' | 'error'
  >('idle')
  const { abort: abortStream, create: createAbort } = useAbortController()
  const [apiKey] = useLocalStorage('clarity-showcase-api-key', '')
  const [model] = useLocalStorage(
    'clarity-showcase-model',
    'claude-sonnet-4-5-20250929'
  )

  const STATUS_STEPS = [
    'idle',
    'connecting',
    'streaming',
    'complete',
    'error',
  ] as const

  const runRealCall = useCallback(async () => {
    if (!apiKey) return
    setStatus('connecting')

    const controller = createAbort()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Say "Hello!" in one word.' }],
          model,
        }),
        signal: controller.signal,
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)
      if (!response.body) throw new Error('No response body')

      setStatus('streaming')

      for await (const event of parseSSEStream(response.body)) {
        if (event.type === 'done') break
        if (event.type === 'error') throw new Error(event.error)
      }

      setStatus('complete')
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        setStatus('idle')
      } else {
        setStatus('error')
      }
    }
  }, [apiKey, model, createAbort])

  const triggerError = useCallback(async () => {
    abortStream()
    setStatus('connecting')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-ant-invalid-key',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'test' }],
          model: model || 'claude-sonnet-4-5-20250929',
        }),
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)
      setStatus('complete')
    } catch {
      setStatus('error')
    }
  }, [model, abortStream])

  if (!apiKey) {
    return <ApiKeyRequired />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          onClick={runRealCall}
          disabled={status === 'connecting' || status === 'streaming'}
        >
          <Play className="h-4 w-4 mr-1" /> Real API Call
        </Button>
        <Button size="sm" variant="outline" onClick={triggerError}>
          <Play className="h-4 w-4 mr-1" /> Trigger Error
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            abortStream()
            setStatus('idle')
          }}
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Reset
        </Button>
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-3 h-3 rounded-full transition-colors',
              status === 'idle' && 'bg-muted-foreground/30',
              status === 'connecting' && 'bg-amber-500 animate-pulse',
              status === 'streaming' && 'bg-green-500 animate-pulse',
              status === 'complete' && 'bg-green-500',
              status === 'error' && 'bg-red-500'
            )}
          />
          <span className="text-sm font-medium capitalize">{status}</span>
          {status === 'streaming' && (
            <Badge variant="secondary" className="text-xs font-mono">
              Receiving tokens...
            </Badge>
          )}
          {status === 'error' && (
            <Badge variant="destructive" className="text-xs">
              API error
            </Badge>
          )}
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1">
          {STATUS_STEPS.map((step) => (
            <div
              key={step}
              className={cn(
                'h-1 rounded-full transition-colors',
                step === status
                  ? 'bg-primary'
                  : STATUS_STEPS.indexOf(step) < STATUS_STEPS.indexOf(status)
                    ? 'bg-primary/40'
                    : 'bg-muted/30'
              )}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {STATUS_STEPS.map((step) => (
            <span
              key={step}
              className={cn(
                'text-[10px]',
                step === status
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
