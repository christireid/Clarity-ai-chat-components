'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
  cn,
} from '@clarity-chat/primitives'
import {
  Activity,
  AlertCircle,
  CheckCircle,
  RotateCw,
  AlertTriangle,
  Loader2,
  Clock,
  Hash,
  X,
  ArrowUp,
  ArrowRight,
  ChevronDown,
  Trash2,
  Circle,
} from 'lucide-react'

interface QueuedRequest {
  id: string
  priority: 'high' | 'normal' | 'low'
  status: 'queued' | 'processing' | 'completed' | 'failed'
  message: string
  position: number
  estimatedWait: number
  createdAt: number
}

/**
 * Rate Limiting Demo Component
 *
 * Demonstrates ClarityChat's rate limiting features including:
 * - Request queue visualization
 * - Concurrent request limits
 * - Queue status indicators
 * - Rate limit warnings
 * - Queue full scenarios
 * - Request priority management
 * - Queue statistics
 */
export function RateLimitingDemo() {
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([])
  const [activeRequests, setActiveRequests] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [rateLimitResetAt, setRateLimitResetAt] = useState<Date | null>(null)
  const [requestsUsed, setRequestsUsed] = useState(42)
  const [tokensUsed, setTokensUsed] = useState(18500)
  const [queueStats, setQueueStats] = useState({
    totalProcessed: 156,
    avgWaitTime: 2.3,
    successRate: 98.7,
  })

  const maxConcurrent = 3
  const maxQueueSize = 10
  const requestLimit = 60
  const tokenLimit = 50000

  // Auto-process queue
  useEffect(() => {
    const interval = setInterval(() => {
      setQueuedRequests((prev) => {
        const updated = [...prev]
        const processing = updated.filter((r) => r.status === 'processing')
        const queued = updated.filter((r) => r.status === 'queued')

        // Complete processing requests
        processing.forEach((req) => {
          if (Math.random() > 0.3) {
            req.status = Math.random() > 0.05 ? 'completed' : 'failed'
            setActiveRequests((c) => Math.max(0, c - 1))
            setQueueStats((s) => ({
              ...s,
              totalProcessed: s.totalProcessed + 1,
            }))
          }
        })

        // Start new requests
        const available = maxConcurrent - processing.length
        if (available > 0 && queued.length > 0 && !isRateLimited) {
          for (let i = 0; i < Math.min(available, queued.length); i++) {
            const req = queued[i]
            req.status = 'processing'
            setActiveRequests((c) => c + 1)
          }
        }

        // Update positions and wait times
        const stillQueued = updated.filter((r) => r.status === 'queued')
        stillQueued.forEach((req, idx) => {
          req.position = idx + 1
          req.estimatedWait = (idx + 1) * 2000
        })

        // Remove completed/failed after delay
        return updated.filter(
          (r) =>
            r.status === 'queued' ||
            r.status === 'processing' ||
            Date.now() - r.createdAt < 3000
        )
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRateLimited])

  // Auto-reset rate limit
  useEffect(() => {
    if (isRateLimited && rateLimitResetAt) {
      const interval = setInterval(() => {
        if (Date.now() > rateLimitResetAt.getTime()) {
          setIsRateLimited(false)
          setRateLimitResetAt(null)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRateLimited, rateLimitResetAt])

  const addRequest = (priority: 'high' | 'normal' | 'low') => {
    const queuedCount = queuedRequests.filter((r) => r.status === 'queued').length

    if (queuedCount >= maxQueueSize) {
      alert('Queue is full! Please wait for requests to complete.')
      return
    }

    if (requestsUsed >= requestLimit) {
      setIsRateLimited(true)
      setRateLimitResetAt(new Date(Date.now() + 60000))
      return
    }

    const messages = {
      high: 'Emergency: System alert requires immediate attention',
      normal: 'Generate a summary of the latest quarterly report',
      low: 'Analyze background data for trends',
    }

    const newRequest: QueuedRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      priority,
      status: 'queued',
      message: messages[priority],
      position: queuedCount + 1,
      estimatedWait: (queuedCount + 1) * 2000,
      createdAt: Date.now(),
    }

    setQueuedRequests((prev) => {
      const sorted = [...prev, newRequest].sort((a, b) => {
        const priorityOrder = { high: 3, normal: 2, low: 1 }
        if (a.status !== 'queued') return 1
        if (b.status !== 'queued') return -1
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
      return sorted
    })

    setRequestsUsed((u) => u + 1)
    setTokensUsed((u) => u + Math.floor(Math.random() * 500) + 200)
  }

  const clearQueue = () => {
    setQueuedRequests((prev) => prev.filter((r) => r.status === 'processing'))
  }

  const resetDemo = () => {
    setQueuedRequests([])
    setActiveRequests(0)
    setIsRateLimited(false)
    setRateLimitResetAt(null)
    setRequestsUsed(0)
    setTokensUsed(0)
    setQueueStats({ totalProcessed: 0, avgWaitTime: 0, successRate: 100 })
  }

  const requestPercentage = (requestsUsed / requestLimit) * 100
  const tokenPercentage = (tokensUsed / tokenLimit) * 100
  const queuedCount = queuedRequests.filter((r) => r.status === 'queued').length
  const queuePercentage = (queuedCount / maxQueueSize) * 100

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Queue Visualization */}
      <Card className="lg:col-span-2 glass-card border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Request Queue Visualization
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  'gap-1',
                  isRateLimited
                    ? 'bg-red-500/20 text-red-600'
                    : 'bg-green-500/20 text-green-600'
                )}
              >
                {isRateLimited ? (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    Rate Limited
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </>
                )}
              </Badge>
              <Button variant="outline" size="sm" onClick={resetDemo}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rate Limit Warning */}
          {isRateLimited && rateLimitResetAt && (
            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600">Rate limit exceeded</p>
                <p className="text-xs text-muted-foreground">
                  Requests will resume in {Math.max(0, Math.ceil((rateLimitResetAt.getTime() - Date.now()) / 1000))}s
                </p>
              </div>
            </div>
          )}

          {/* Active Requests */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                {activeRequests > 0 && <Loader2 className="h-4 w-4 animate-spin" />}
                Active Requests
              </span>
              <span className="font-medium">
                {activeRequests} / {maxConcurrent}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  activeRequests >= maxConcurrent
                    ? 'bg-yellow-500'
                    : 'bg-primary'
                )}
                style={{ width: `${(activeRequests / maxConcurrent) * 100}%` }}
              />
            </div>
          </div>

          {/* Queue Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Queued Requests</span>
              <span className="font-medium">
                {queuedCount} / {maxQueueSize}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  queuePercentage >= 80
                    ? 'bg-red-500'
                    : queuePercentage >= 60
                      ? 'bg-yellow-500'
                      : 'bg-secondary'
                )}
                style={{ width: `${queuePercentage}%` }}
              />
            </div>
          </div>

          {/* Request List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {queuedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Circle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No requests in queue</p>
                <p className="text-xs">Add requests using the controls</p>
              </div>
            ) : (
              queuedRequests.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-all',
                    req.status === 'processing' &&
                      'bg-yellow-500/10 border-yellow-500/30',
                    req.status === 'queued' && 'bg-muted/50',
                    req.status === 'completed' &&
                      'bg-green-500/10 border-green-500/30',
                    req.status === 'failed' && 'bg-red-500/10 border-red-500/30'
                  )}
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      req.priority === 'high' && 'bg-red-500',
                      req.priority === 'normal' && 'bg-blue-500',
                      req.priority === 'low' && 'bg-gray-500'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{req.message}</p>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs shrink-0',
                          req.priority === 'high' && 'border-red-500 text-red-600',
                          req.priority === 'normal' &&
                            'border-blue-500 text-blue-600',
                          req.priority === 'low' && 'border-gray-500 text-gray-600'
                        )}
                      >
                        {req.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      {req.status === 'queued' && (
                        <>
                          <span className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            Position: {req.position}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            ~{(req.estimatedWait / 1000).toFixed(1)}s
                          </span>
                        </>
                      )}
                      {req.status === 'processing' && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing...
                        </span>
                      )}
                      {req.status === 'completed' && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Completed
                        </span>
                      )}
                      {req.status === 'failed' && (
                        <span className="flex items-center gap-1 text-red-600">
                          <X className="h-3 w-3" />
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Queue Full Warning */}
          {queuePercentage >= 80 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-yellow-600">
                Queue is {queuePercentage >= 100 ? 'full' : 'nearly full'}. New requests may be rejected.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right: Controls & Stats */}
      <div className="space-y-4">
        {/* Add Request Controls */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Add Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => addRequest('high')}
              className="w-full gap-2 bg-red-500 hover:bg-red-600"
              disabled={isRateLimited || queuedCount >= maxQueueSize}
            >
              <ArrowUp className="h-4 w-4" />
              High Priority
            </Button>
            <Button
              onClick={() => addRequest('normal')}
              className="w-full gap-2"
              disabled={isRateLimited || queuedCount >= maxQueueSize}
            >
              <ArrowRight className="h-4 w-4" />
              Normal Priority
            </Button>
            <Button
              onClick={() => addRequest('low')}
              variant="outline"
              className="w-full gap-2"
              disabled={isRateLimited || queuedCount >= maxQueueSize}
            >
              <ChevronDown className="h-4 w-4" />
              Low Priority
            </Button>
            {queuedCount > 0 && (
              <Button
                onClick={clearQueue}
                variant="destructive"
                className="w-full gap-2 mt-4"
              >
                <Trash2 className="h-4 w-4" />
                Clear Queue
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Rate Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Requests/min</span>
                <span className="font-medium">
                  {requestsUsed} / {requestLimit}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    requestPercentage >= 100
                      ? 'bg-red-500'
                      : requestPercentage >= 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  )}
                  style={{ width: `${Math.min(requestPercentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tokens/min</span>
                <span className="font-medium">
                  {tokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    tokenPercentage >= 100
                      ? 'bg-red-500'
                      : tokenPercentage >= 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  )}
                  style={{ width: `${Math.min(tokenPercentage, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Queue Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Processed</span>
              <span className="font-medium">{queueStats.totalProcessed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Wait Time</span>
              <span className="font-medium">{queueStats.avgWaitTime}s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-medium text-green-600">
                {queueStats.successRate}%
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Queue Health</span>
              <Badge
                className={cn(
                  queuePercentage >= 80
                    ? 'bg-red-500/20 text-red-600'
                    : queuePercentage >= 60
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-green-500/20 text-green-600'
                )}
              >
                {queuePercentage >= 80 ? 'Critical' : queuePercentage >= 60 ? 'Warning' : 'Healthy'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
