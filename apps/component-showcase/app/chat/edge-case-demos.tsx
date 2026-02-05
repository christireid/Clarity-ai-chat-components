'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Input,
  Avatar,
  cn,
} from '@clarity-chat/primitives'
import {
  FileText,
  Timer,
  Send,
  Loader2,
  Hourglass,
  Wifi,
  WifiOff,
  AlertCircle,
  RotateCcw,
  Clock,
  Database,
  AlertTriangle,
  Gauge,
  Bug,
  CheckCircle,
  RotateCw,
  Activity,
  Info,
  History,
  GitBranch,
  GitMerge,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// ============================================================================
// EDGE CASE: VERY LONG MESSAGE HANDLING
// ============================================================================
export function VeryLongMessageDemo() {
  const [expanded, setExpanded] = useState(false)
  const longMessage = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?`

  const truncatedMessage = longMessage.slice(0, 200) + '...'

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-violet-500" />
          Very Long Messages
        </CardTitle>
        <CardDescription>
          Automatic truncation with expand/collapse functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Avatar
            fallback="AI"
            className="w-8 h-8 shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white"
          />
          <div className="flex-1 space-y-2">
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="text-sm whitespace-pre-wrap">
                {expanded ? longMessage : truncatedMessage}
              </div>
              {!expanded && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setExpanded(true)}
                  className="mt-2 h-auto p-0 text-primary"
                >
                  Show more <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              )}
              {expanded && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setExpanded(false)}
                  className="mt-2 h-auto p-0 text-primary"
                >
                  Show less <ChevronUp className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Characters: {longMessage.length.toLocaleString()}</span>
              <span>•</span>
              <span>Words: {longMessage.split(/\s+/).length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDGE CASE: RATE LIMITING
// ============================================================================
export function RateLimitingDemo() {
  const [messageCount, setMessageCount] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [input, setInput] = useState('')
  const maxMessages = 5
  const cooldownTime = 10

  const handleSend = () => {
    if (isRateLimited) return

    const newCount = messageCount + 1
    setMessageCount(newCount)
    setInput('')

    if (newCount >= maxMessages) {
      setIsRateLimited(true)
      setCooldownSeconds(cooldownTime)

      const interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setIsRateLimited(false)
            setMessageCount(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Timer className="h-5 w-5 text-yellow-500" />
          Rate Limiting
        </CardTitle>
        <CardDescription>
          Throttling with cooldown period and visual feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            'p-4 rounded-lg border-2',
            isRateLimited
              ? 'border-red-500/50 bg-red-500/10'
              : 'border-green-500/50 bg-green-500/10'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {isRateLimited ? 'Rate Limited' : 'Active'}
            </span>
            <Badge
              className={
                isRateLimited
                  ? 'bg-red-500/20 text-red-600'
                  : 'bg-green-500/20 text-green-600'
              }
            >
              {messageCount}/{maxMessages} messages
            </Badge>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                isRateLimited ? 'bg-red-500' : 'bg-green-500'
              )}
              style={{ width: `${(messageCount / maxMessages) * 100}%` }}
            />
          </div>
          {isRateLimited && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
              <Hourglass className="h-4 w-4 animate-pulse" />
              Cooldown: {cooldownSeconds}s remaining
            </div>
          )}
        </div>

        <div className="flex items-end gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isRateLimited
                ? `Wait ${cooldownSeconds}s...`
                : 'Type a message...'
            }
            disabled={isRateLimited}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isRateLimited || !input.trim()}
            className="gap-2"
          >
            {isRateLimited ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Wait
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDGE CASE: NETWORK ERRORS & RECONNECTION
// ============================================================================
export function NetworkErrorDemo() {
  const [status, setStatus] = useState<
    'online' | 'offline' | 'reconnecting' | 'error'
  >('online')
  const [retryAttempt, setRetryAttempt] = useState(0)

  const simulateOffline = () => {
    setStatus('offline')
    setTimeout(() => {
      setStatus('reconnecting')
      setRetryAttempt(1)

      const reconnectInterval = setInterval(() => {
        setRetryAttempt((prev) => {
          const next = prev + 1
          if (next >= 3) {
            clearInterval(reconnectInterval)
            setStatus('online')
            setRetryAttempt(0)
            return 0
          }
          return next
        })
      }, 1500)
    }, 2000)
  }

  const simulateError = () => {
    setStatus('error')
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Wifi className="h-5 w-5 text-blue-500" />
          Network Status
        </CardTitle>
        <CardDescription>
          Connection monitoring with auto-reconnection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            'p-4 rounded-lg border-2',
            status === 'online' && 'border-green-500/50 bg-green-500/10',
            status === 'offline' && 'border-gray-500/50 bg-gray-500/10',
            status === 'reconnecting' && 'border-yellow-500/50 bg-yellow-500/10',
            status === 'error' && 'border-red-500/50 bg-red-500/10'
          )}
        >
          <div className="flex items-center gap-3">
            {status === 'online' && (
              <>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="font-medium text-green-600">Connected</p>
                  <p className="text-xs text-muted-foreground">
                    Real-time sync enabled
                  </p>
                </div>
              </>
            )}
            {status === 'offline' && (
              <>
                <WifiOff className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-600">Offline</p>
                  <p className="text-xs text-muted-foreground">
                    Check your connection
                  </p>
                </div>
              </>
            )}
            {status === 'reconnecting' && (
              <>
                <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
                <div>
                  <p className="font-medium text-yellow-600">Reconnecting...</p>
                  <p className="text-xs text-muted-foreground">
                    Attempt {retryAttempt} of 3
                  </p>
                </div>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-600">Connection Error</p>
                  <p className="text-xs text-muted-foreground">
                    Failed to connect to server
                  </p>
                </div>
              </>
            )}
          </div>

          {status === 'error' && (
            <Button
              size="sm"
              className="mt-3 w-full gap-2"
              onClick={() => setStatus('online')}
            >
              <RotateCcw className="h-4 w-4" />
              Retry Connection
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={simulateOffline}
            disabled={status !== 'online'}
          >
            Simulate Offline
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={simulateError}
            disabled={status !== 'online'}
          >
            Simulate Error
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDGE CASE: OFFLINE MODE
// ============================================================================
export function OfflineModeDemo() {
  const [isOffline, setIsOffline] = useState(false)
  const [queuedMessages, setQueuedMessages] = useState<string[]>([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    if (isOffline) {
      setQueuedMessages((prev) => [...prev, input])
    }
    setInput('')
  }

  const syncMessages = () => {
    setIsOffline(false)
    setTimeout(() => {
      setQueuedMessages([])
    }, 1000)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <WifiOff className="h-5 w-5 text-gray-500" />
          Offline Mode
        </CardTitle>
        <CardDescription>
          Queue messages when offline, sync when reconnected
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isOffline && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-600">
                Offline Mode - Messages will be queued
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={syncMessages}>
              Reconnect
            </Button>
          </div>
        )}

        {queuedMessages.length > 0 && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Queued Messages</p>
              <Badge className="bg-yellow-500/20 text-yellow-600">
                {queuedMessages.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {queuedMessages.map((msg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 bg-background rounded text-sm"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 truncate">{msg}</span>
                  {!isOffline && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSend} className="gap-2">
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOffline(!isOffline)}
          className="w-full"
        >
          {isOffline ? 'Go Online' : 'Go Offline'}
        </Button>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDGE CASE: MEMORY LIMIT SCENARIOS
// ============================================================================
export function MemoryLimitDemo() {
  const [memoryUsage, setMemoryUsage] = useState(4200)
  const memoryLimit = 8000
  const [compressionActive, setCompressionActive] = useState(false)

  const simulateMemoryIncrease = () => {
    setMemoryUsage((prev) => Math.min(prev + 1000, memoryLimit))
  }

  const compressMemory = () => {
    setCompressionActive(true)
    setTimeout(() => {
      setMemoryUsage((prev) => Math.max(prev - 3000, 1000))
      setCompressionActive(false)
    }, 2000)
  }

  const memoryPercentage = (memoryUsage / memoryLimit) * 100
  const isNearLimit = memoryPercentage > 80

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-5 w-5 text-purple-500" />
          Memory Management
        </CardTitle>
        <CardDescription>
          Context window management with auto-compression
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            'p-4 rounded-lg border-2',
            isNearLimit
              ? 'border-red-500/50 bg-red-500/10'
              : 'border-blue-500/50 bg-blue-500/10'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Context Memory</span>
            <span className="text-sm font-mono">
              {memoryUsage.toLocaleString()} / {memoryLimit.toLocaleString()} KB
            </span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                isNearLimit ? 'bg-red-500' : 'bg-blue-500'
              )}
              style={{ width: `${memoryPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {memoryPercentage.toFixed(1)}% used
          </p>
        </div>

        {isNearLimit && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-600">
                Memory Warning
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Approaching context limit. Old messages will be compressed or
                archived.
              </p>
            </div>
          </div>
        )}

        {compressionActive && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            <span className="text-sm text-blue-600">
              Compressing older messages...
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={simulateMemoryIncrease}
            disabled={memoryUsage >= memoryLimit}
          >
            Add Messages
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={compressMemory}
            disabled={compressionActive || memoryUsage < 2000}
          >
            {compressionActive ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Compressing
              </>
            ) : (
              'Compress'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDGE CASE: TOKEN LIMIT WARNINGS
// ============================================================================
export function TokenLimitWarningDemo() {
  const [tokens, setTokens] = useState(85000)
  const tokenLimit = 100000
  const [showWarning, setShowWarning] = useState(true)

  const tokenPercentage = (tokens / tokenLimit) * 100
  const isWarning = tokenPercentage > 80
  const isCritical = tokenPercentage > 95

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Gauge className="h-5 w-5 text-orange-500" />
          Token Limit Warnings
        </CardTitle>
        <CardDescription>
          Progressive warnings as token limits approach
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Token Usage</span>
            <span className="text-sm font-mono">
              {tokens.toLocaleString()} / {tokenLimit.toLocaleString()}
            </span>
          </div>
          <div className="h-3 w-full bg-background rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                isCritical
                  ? 'bg-red-500'
                  : isWarning
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              )}
              style={{ width: `${tokenPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{tokenPercentage.toFixed(1)}% used</span>
            <span>{(tokenLimit - tokens).toLocaleString()} remaining</span>
          </div>
        </div>

        {isWarning && showWarning && (
          <div
            className={cn(
              'p-4 rounded-lg border-2 flex items-start gap-3',
              isCritical
                ? 'border-red-500/50 bg-red-500/10'
                : 'border-yellow-500/50 bg-yellow-500/10'
            )}
          >
            <AlertTriangle
              className={cn(
                'h-5 w-5 mt-0.5',
                isCritical ? 'text-red-500' : 'text-yellow-500'
              )}
            />
            <div className="flex-1">
              <p
                className={cn(
                  'font-medium text-sm',
                  isCritical ? 'text-red-600' : 'text-yellow-600'
                )}
              >
                {isCritical ? 'Critical: Token Limit' : 'Warning: High Token Usage'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isCritical
                  ? 'You are about to exceed the token limit. Consider starting a new conversation.'
                  : 'You are approaching the token limit. Some context may be removed soon.'}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">
                  New Conversation
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowWarning(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Simulate token usage:
          </label>
          <input
            type="range"
            min="0"
            max={tokenLimit}
            step="1000"
            value={tokens}
            onChange={(e) => {
              setTokens(Number(e.target.value))
              setShowWarning(true)
            }}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDGE CASE: TOOL EXECUTION FAILURES
// ============================================================================
export function ToolExecutionFailureDemo() {
  const [tools, setTools] = useState<Array<{
    id: string
    name: string
    status: 'completed' | 'failed' | 'running'
    error: string | null
  }>>([
    {
      id: '1',
      name: 'web_search',
      status: 'completed',
      error: null,
    },
    {
      id: '2',
      name: 'code_interpreter',
      status: 'failed',
      error: 'Timeout: Code execution exceeded 30s limit',
    },
    {
      id: '3',
      name: 'file_reader',
      status: 'failed',
      error: 'Permission denied: Cannot access /etc/shadow',
    },
  ])

  const retryTool = (id: string) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.id === id
          ? { ...tool, status: 'running' as const, error: null }
          : tool
      )
    )

    setTimeout(() => {
      setTools((prev) =>
        prev.map((tool) =>
          tool.id === id
            ? { ...tool, status: 'completed' as const, error: null }
            : tool
        )
      )
    }, 2000)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bug className="h-5 w-5 text-red-500" />
          Tool Execution Failures
        </CardTitle>
        <CardDescription>
          Graceful error handling with retry options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={cn(
              'p-4 rounded-lg border-2',
              tool.status === 'completed' &&
                'border-green-500/30 bg-green-500/5',
              tool.status === 'failed' && 'border-red-500/30 bg-red-500/5',
              tool.status === 'running' &&
                'border-yellow-500/30 bg-yellow-500/5'
            )}
          >
            <div className="flex items-start gap-3">
              {tool.status === 'completed' && (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              )}
              {tool.status === 'failed' && (
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              {tool.status === 'running' && (
                <Loader2 className="h-5 w-5 text-yellow-500 animate-spin mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-medium">
                    {tool.name}
                  </code>
                  <Badge
                    className={cn(
                      tool.status === 'completed' &&
                        'bg-green-500/20 text-green-600',
                      tool.status === 'failed' && 'bg-red-500/20 text-red-600',
                      tool.status === 'running' &&
                        'bg-yellow-500/20 text-yellow-600'
                    )}
                  >
                    {tool.status}
                  </Badge>
                </div>
                {tool.error && (
                  <p className="text-xs text-red-600 mt-2">{tool.error}</p>
                )}
                {tool.status === 'failed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 gap-2"
                    onClick={() => retryTool(tool.id)}
                  >
                    <RotateCw className="h-3 w-3" />
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDGE CASE: CONCURRENT STREAM HANDLING
// ============================================================================
export function ConcurrentStreamDemo() {
  const [streams] = useState([
    { id: 1, name: 'Main Response', progress: 85, active: true },
    { id: 2, name: 'Tool Output', progress: 60, active: true },
    { id: 3, name: 'Background Task', progress: 40, active: true },
  ])

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Concurrent Streams
        </CardTitle>
        <CardDescription>
          Multiple simultaneous streaming responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {streams.map((stream) => (
          <div key={stream.id} className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {stream.active && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                )}
                <span className="text-sm font-medium">{stream.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {stream.progress}%
              </span>
            </div>
            <div className="h-2 w-full bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${stream.progress}%` }}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <Info className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-blue-600">
            {streams.filter((s) => s.active).length} active streams
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDGE CASE: MESSAGE EDITING HISTORY
// ============================================================================
export function MessageEditHistoryDemo() {
  const [showHistory, setShowHistory] = useState(false)
  const editHistory = [
    {
      id: 1,
      content: 'How do I use React hooks?',
      timestamp: '10:30 AM',
      current: false,
    },
    {
      id: 2,
      content: 'How do I use React hooks like useState?',
      timestamp: '10:31 AM',
      current: false,
    },
    {
      id: 3,
      content: 'How do I use React hooks like useState and useEffect?',
      timestamp: '10:32 AM',
      current: true,
    },
  ]

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-purple-500" />
          Message Edit History
        </CardTitle>
        <CardDescription>
          Track all edits with version history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Avatar fallback="U" className="w-8 h-8 shrink-0 bg-primary" />
          <div className="flex-1 space-y-2">
            <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-3">
              <p className="text-sm">
                {editHistory[editHistory.length - 1].content}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="h-7 px-2 text-xs gap-1"
              >
                <History className="h-3 w-3" />
                {showHistory ? 'Hide' : 'Show'} History ({editHistory.length - 1}{' '}
                edits)
              </Button>
              <span className="text-xs text-muted-foreground">Edited</span>
            </div>
          </div>
        </div>

        {showHistory && (
          <div className="ml-11 p-4 bg-muted rounded-lg space-y-3">
            <p className="text-sm font-medium">Edit History</p>
            <div className="space-y-2">
              {editHistory.map((edit, index) => (
                <div
                  key={edit.id}
                  className={cn(
                    'p-3 rounded-lg text-sm',
                    edit.current
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-background'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Version {index + 1}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {edit.timestamp}
                    </span>
                  </div>
                  <p>{edit.content}</p>
                  {edit.current && (
                    <Badge className="mt-2 bg-primary/20 text-primary">
                      Current
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDGE CASE: BRANCH VISUALIZATION
// ============================================================================
export function BranchVisualizationDemo() {
  const [selectedBranch, setSelectedBranch] = useState('main')
  const branches = [
    {
      id: 'main',
      name: 'Main conversation',
      messages: 8,
      active: true,
    },
    {
      id: 'branch-1',
      name: 'Alternative approach',
      messages: 3,
      active: false,
      parent: 'main',
    },
    {
      id: 'branch-2',
      name: 'Deep dive into hooks',
      messages: 5,
      active: false,
      parent: 'main',
    },
  ]

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-green-500" />
          Conversation Branches
        </CardTitle>
        <CardDescription>
          Explore alternative conversation paths
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="space-y-3">
            {branches.map((branch, index) => (
              <div key={branch.id} className="relative">
                {index > 0 && (
                  <div className="absolute left-3 -top-3 w-0.5 h-6 bg-border" />
                )}
                <button
                  onClick={() => setSelectedBranch(branch.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                    selectedBranch === branch.id
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-background hover:bg-background/80',
                    index > 0 && 'ml-6'
                  )}
                >
                  <GitBranch
                    className={cn(
                      'h-4 w-4',
                      selectedBranch === branch.id
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{branch.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {branch.messages} messages
                    </p>
                  </div>
                  {branch.active && (
                    <Badge className="bg-green-500/20 text-green-600">
                      Active
                    </Badge>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <GitBranch className="h-4 w-4" />
            Create Branch
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <GitMerge className="h-4 w-4" />
            Merge Branch
          </Button>
        </div>

        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-500 mt-0.5" />
          <p className="text-xs text-blue-600">
            Branches let you explore different conversation paths without losing
            context. Switch between branches to compare approaches.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
