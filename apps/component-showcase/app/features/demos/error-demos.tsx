'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import {
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  RotateCw,
  CheckCircle,
} from 'lucide-react'

export function ErrorDisplayDemo() {
  const errors = [
    {
      severity: 'error',
      title: 'Connection Failed',
      message: 'Unable to reach the API server',
      icon: AlertCircle,
    },
    {
      severity: 'warning',
      title: 'Rate Limited',
      message: 'Too many requests. Retry in 30s',
      icon: AlertTriangle,
    },
    {
      severity: 'info',
      title: 'Maintenance',
      message: 'Scheduled downtime at 2:00 AM',
      icon: Info,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Error Display Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {errors.map((error, i) => (
          <div
            key={i}
            className={cn(
              'flex items-start gap-3 p-4 rounded-lg border',
              error.severity === 'error' && 'bg-red-500/10 border-red-500/30',
              error.severity === 'warning' &&
                'bg-yellow-500/10 border-yellow-500/30',
              error.severity === 'info' && 'bg-blue-500/10 border-blue-500/30'
            )}
          >
            <error.icon
              className={cn(
                'h-5 w-5 shrink-0',
                error.severity === 'error' && 'text-red-500',
                error.severity === 'warning' && 'text-yellow-500',
                error.severity === 'info' && 'text-blue-500'
              )}
            />
            <div className="flex-1">
              <p className="font-medium">{error.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {error.message}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ErrorBoundaryDemo() {
  const [hasError, setHasError] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Error Boundary</CardTitle>
      </CardHeader>
      <CardContent>
        {hasError ? (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <p className="font-medium text-red-600">Something went wrong</p>
            <p className="text-sm text-muted-foreground mt-1">
              An unexpected error occurred
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 gap-2"
              onClick={() => setHasError(false)}
            >
              <RotateCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        ) : (
          <div className="p-6 border rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Click to simulate an error
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setHasError(true)}
            >
              Trigger Error
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RetryCountdownDemo() {
  const [isRetrying, setIsRetrying] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [attempt, setAttempt] = useState(0)

  const startRetry = () => {
    setIsRetrying(true)
    setCountdown(5)
    setAttempt(1)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsRetrying(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Retry Countdown</CardTitle>
      </CardHeader>
      <CardContent>
        {isRetrying ? (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
            <div className="w-16 h-16 rounded-full border-4 border-yellow-500/30 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-yellow-600">
                {countdown}
              </span>
            </div>
            <p className="text-sm font-medium">Retrying in {countdown}s</p>
            <p className="text-xs text-muted-foreground mt-1">
              Attempt {attempt} of 3
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => setIsRetrying(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="p-4 border rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Simulate retry with countdown
            </p>
            <Button size="sm" onClick={startRetry} className="gap-2">
              <RotateCw className="h-4 w-4" />
              Start Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function CircuitBreakerDemo() {
  const [state, setState] = useState<'closed' | 'open' | 'half-open'>('closed')
  const [failures, setFailures] = useState(0)

  const simulateRequest = () => {
    if (state === 'open') return

    const willFail = Math.random() > 0.5
    if (willFail) {
      setFailures((prev) => {
        const newFailures = prev + 1
        if (newFailures >= 3) {
          setState('open')
          setTimeout(() => setState('half-open'), 3000)
        }
        return newFailures
      })
    } else {
      setFailures(0)
      setState('closed')
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Circuit Breaker</CardTitle>
          <Badge
            className={cn(
              state === 'closed' && 'bg-green-500/20 text-green-600',
              state === 'open' && 'bg-red-500/20 text-red-600',
              state === 'half-open' && 'bg-yellow-500/20 text-yellow-600'
            )}
          >
            {state.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm">Failures</span>
            <span className="font-mono">{failures} / 3</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                state === 'closed' && 'bg-green-500',
                state === 'open' && 'bg-red-500',
                state === 'half-open' && 'bg-yellow-500 animate-pulse'
              )}
            />
            <p className="text-sm">
              {state === 'closed' && 'Accepting requests'}
              {state === 'open' && 'Rejecting all requests'}
              {state === 'half-open' && 'Testing connection...'}
            </p>
          </div>
          <Button
            size="sm"
            className="w-full"
            disabled={state === 'open'}
            onClick={simulateRequest}
          >
            Simulate Request
          </Button>
          {state !== 'closed' && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setState('closed')
                setFailures(0)
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ErrorToastDemo() {
  const [toasts, setToasts] = useState<
    Array<{ id: number; message: string; type: string }>
  >([])

  const addToast = (type: string) => {
    const messages = {
      error: 'Failed to save changes',
      warning: 'Your session will expire soon',
      success: 'Changes saved successfully',
    }
    const id = Date.now()
    setToasts((prev) => [
      ...prev,
      { id, message: messages[type as keyof typeof messages], type },
    ])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Error Toast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => addToast('error')}
          >
            Error
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addToast('warning')}
          >
            Warning
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => addToast('success')}
          >
            Success
          </Button>
        </div>
        <div className="space-y-2 min-h-[100px]">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg animate-in slide-in-from-right',
                toast.type === 'error' &&
                  'bg-red-500/10 border border-red-500/30',
                toast.type === 'warning' &&
                  'bg-yellow-500/10 border border-yellow-500/30',
                toast.type === 'success' &&
                  'bg-green-500/10 border border-green-500/30'
              )}
            >
              {toast.type === 'error' && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              {toast.type === 'warning' && (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
              {toast.type === 'success' && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm flex-1">{toast.message}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
