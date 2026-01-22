# Security, Storage & Dashboard Hooks

Advanced hooks for security validation, storage management, and dashboard data composition.

## Overview

### Security Hooks

| Hook | Purpose | Key Feature |
|------|---------|-------------|
| `useSecurity` | Full security manager | Input/output validation, PII detection |
| `useSecurityMonitor` | Real-time metrics | Security event monitoring |
| `useSecureInput` | Input validation | Async validation with loading states |
| `useSecureChat` | Secure chat interface | Built-in security checks |
| `useSecurityEvents` | Event subscription | Real-time security alerts |
| `useRateLimitStatus` | Rate limit tracking | Check user rate limits |

### Storage Hooks

| Hook | Purpose | Key Feature |
|------|---------|-------------|
| `useMemoryStore` | Conversation memory | Episodic/semantic memory storage |

### Dashboard Hooks

| Hook | Purpose | Key Feature |
|------|---------|-------------|
| `useDashboardData` | Single data source | Loading, retry, polling, stale detection |
| `useDashboardComposer` | Multiple data sources | Parallel fetching, progress tracking |

---

## Security Hooks

### useSecurity

**Full security manager with input/output validation, PII detection, and jailbreak prevention.**

#### Signature

```typescript
function useSecurity(config?: SecurityConfig): {
  validateInput: (input: string, context?: SecurityContext) => Promise<SecurityResult>
  prepareMessages: (messages: SafetyMessage[]) => SafetyMessage[]
  validateOutput: (output: string, context?: SecurityContext) => Promise<OutputValidationResult>
  getMetrics: (timeRange?: { start?: number; end?: number }) => SecurityMetrics
  getEvents: (filter?: EventFilter) => SecurityEvent[]
  onAlert: (handler: (event: SecurityEvent) => void) => void
  manager: SecurityManager
}

interface SecurityConfig {
  promptInjection?: { enabled: boolean }
  pii?: {
    enabled: boolean
    redactionStrategy?: 'mask' | 'synthetic' | 'remove'
  }
  rateLimit?: {
    enabled: boolean
    maxRequestsPerMinute?: number
  }
  contentFilter?: { enabled: boolean }
}

interface SecurityResult {
  allowed: boolean
  action?: 'allow' | 'block' | 'warn'
  reason?: string
  sanitizedInput?: string
  details?: any
}
```

#### Examples

##### Basic Security Validation

```tsx
import { useSecurity } from '@clarity-chat/react/hooks/security'

function SecureChat() {
  const { validateInput, validateOutput } = useSecurity({
    promptInjection: { enabled: true },
    pii: {
      enabled: true,
      redactionStrategy: 'synthetic',
    },
  })

  const handleSend = async (userInput: string) => {
    // Validate user input
    const validation = await validateInput(userInput)

    if (!validation.allowed) {
      alert(`Blocked: ${validation.reason}`)
      return
    }

    // Use sanitized input if available
    const safeInput = validation.sanitizedInput || userInput

    // Send to LLM
    const response = await callLLM(safeInput)

    // Validate output
    const outputValidation = await validateOutput(response)

    if (!outputValidation.safe) {
      console.error('Unsafe output blocked')
      return
    }

    // Display safe response
    displayMessage(outputValidation.output)
  }

  return <ChatInterface onSend={handleSend} />
}
```

##### PII Redaction Strategies

```tsx
function PIIRedactionDemo() {
  // Mask strategy: Replace with asterisks
  const maskSecurity = useSecurity({
    pii: { enabled: true, redactionStrategy: 'mask' },
  })

  // Synthetic strategy: Replace with fake data
  const syntheticSecurity = useSecurity({
    pii: { enabled: true, redactionStrategy: 'synthetic' },
  })

  // Remove strategy: Delete PII entirely
  const removeSecurity = useSecurity({
    pii: { enabled: true, redactionStrategy: 'remove' },
  })

  const testInput = "My email is john@example.com and SSN is 123-45-6789"

  // Mask: "My email is ****@*******.*** and SSN is ***-**-****"
  // Synthetic: "My email is user284@domain.com and SSN is 987-65-4321"
  // Remove: "My email is  and SSN is "

  return <div>...</div>
}
```

##### Security Metrics Dashboard

```tsx
function SecurityDashboard() {
  const { getMetrics, getEvents } = useSecurity({
    promptInjection: { enabled: true },
    pii: { enabled: true },
  })

  const metrics = getMetrics()
  const recentEvents = getEvents({ limit: 10 })

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Security Metrics</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="text-2xl font-bold">{metrics.totalRequests}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">Blocked</p>
          <p className="text-2xl font-bold text-destructive">
            {metrics.blocked}
          </p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">Warnings</p>
          <p className="text-2xl font-bold text-yellow-500">
            {metrics.warnings}
          </p>
        </div>
      </div>

      <h3 className="font-semibold mb-2">Recent Events</h3>
      <div className="space-y-2">
        {recentEvents.map((event, i) => (
          <div key={i} className="p-3 bg-muted rounded text-sm">
            <div className="flex justify-between">
              <span className="font-mono">{event.type}</span>
              <span className="text-muted-foreground">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
            {event.details && (
              <p className="text-xs mt-1">{event.details}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

##### Alert Subscriptions

```tsx
function SecurityAlerts() {
  const { onAlert } = useSecurity({
    promptInjection: { enabled: true },
  })

  const [alerts, setAlerts] = useState<SecurityEvent[]>([])

  useEffect(() => {
    onAlert((event) => {
      // Send to monitoring service
      if (event.severity === 'critical') {
        sendToSlack(`Critical security event: ${event.type}`)
      }

      // Add to local alerts
      setAlerts((prev) => [...prev, event].slice(-50))
    })
  }, [onAlert])

  return (
    <div>
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={`
            p-2 mb-1 rounded
            ${alert.severity === 'critical' ? 'bg-destructive text-white' : ''}
            ${alert.severity === 'warning' ? 'bg-yellow-500/20' : ''}
          `}
        >
          {alert.type}: {alert.reason}
        </div>
      ))}
    </div>
  )
}
```

---

### useSecureChat

**Chat interface with built-in security validation at every step.**

#### Signature

```typescript
function useSecureChat(options?: {
  config?: SecurityConfig
  userId?: string
  tenantId?: string
  onSecurityBlock?: (reason: string, details?: any) => void
  onSecurityWarning?: (warning: string, details?: any) => void
}): {
  messages: SafetyMessage[]
  sendMessage: (userMessage: string, onLLMResponse?: (messages: SafetyMessage[]) => Promise<string>) => Promise<void>
  clearMessages: () => void
  addSystemMessage: (content: string) => void
  isProcessing: boolean
  error: string | null
}
```

#### Examples

##### Complete Secure Chat

```tsx
function SecureChatApp() {
  const {
    messages,
    sendMessage,
    isProcessing,
    error,
  } = useSecureChat({
    config: {
      promptInjection: { enabled: true },
      pii: { enabled: true, redactionStrategy: 'synthetic' },
      rateLimit: { enabled: true, maxRequestsPerMinute: 10 },
    },
    userId: 'user-123',
    onSecurityBlock: (reason, details) => {
      toast.error(`Message blocked: ${reason}`)
      console.log('Block details:', details)
    },
    onSecurityWarning: (warning, details) => {
      toast.warning(`Security warning: ${warning}`)
    },
  })

  const handleSend = async (input: string) => {
    await sendMessage(input, async (secureMessages) => {
      // All security checks passed - call your LLM
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: secureMessages }),
      })

      const data = await response.json()
      return data.response
    })
  }

  return (
    <div>
      {error && (
        <div className="p-3 mb-4 bg-destructive/10 text-destructive rounded">
          {error}
        </div>
      )}

      <div className="space-y-3 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded ${
              msg.role === 'user' ? 'bg-primary/10' : 'bg-muted'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <ChatInput
        onSend={handleSend}
        disabled={isProcessing}
        placeholder={isProcessing ? 'Processing...' : 'Type a message...'}
      />
    </div>
  )
}
```

##### Multi-Tenant Security

```tsx
function MultiTenantChat({ tenantId, userId }: { tenantId: string; userId: string }) {
  const { messages, sendMessage } = useSecureChat({
    config: {
      promptInjection: { enabled: true },
      pii: { enabled: true },
    },
    userId,
    tenantId,
    onSecurityBlock: (reason) => {
      // Log security events per tenant
      logSecurityEvent(tenantId, userId, reason)
    },
  })

  return <ChatInterface messages={messages} onSend={sendMessage} />
}
```

---

### useSecurityMonitor

**Real-time security metrics monitoring with automatic updates.**

#### Signature

```typescript
function useSecurityMonitor(options?: {
  config?: SecurityConfig
  updateInterval?: number        // Default: 60000 (1 minute)
  timeRange?: { start?: number; end?: number }
}): SecurityMetrics | null
```

#### Examples

```tsx
function SecurityMonitorWidget() {
  const metrics = useSecurityMonitor({
    updateInterval: 30000,  // Update every 30 seconds
  })

  if (!metrics) return <div>Loading...</div>

  return (
    <div className="p-4 bg-card rounded-lg">
      <h3 className="font-semibold mb-3">Live Security Monitor</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total Requests</span>
          <span className="font-mono">{metrics.totalRequests}</span>
        </div>
        <div className="flex justify-between">
          <span>Blocked</span>
          <span className="font-mono text-destructive">{metrics.blocked}</span>
        </div>
        <div className="flex justify-between">
          <span>Block Rate</span>
          <span className="font-mono">
            {((metrics.blocked / metrics.totalRequests) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
```

---

### useRateLimitStatus

**Check rate limit status for users.**

#### Signature

```typescript
function useRateLimitStatus(options: {
  config?: SecurityConfig
  userId: string
  checkInterval?: number         // Default: 30000
}): {
  remaining: number
  isLimited: boolean
  check: () => Promise<void>
}
```

#### Examples

```tsx
function RateLimitIndicator({ userId }: { userId: string }) {
  const { remaining, isLimited, check } = useRateLimitStatus({
    userId,
    checkInterval: 10000,  // Check every 10s
  })

  if (isLimited) {
    return (
      <div className="p-3 bg-destructive/10 text-destructive rounded">
        ⚠️ Rate limit exceeded. Please wait before sending more messages.
        <button onClick={check} className="ml-2 underline">
          Check again
        </button>
      </div>
    )
  }

  return (
    <div className="text-xs text-muted-foreground">
      {remaining >= 0 ? `${remaining} requests remaining` : 'Checking...'}
    </div>
  )
}
```

---

## Storage Hooks

### useMemoryStore

**Conversation memory with episodic and semantic storage.**

#### Signature

```typescript
function useMemoryStore(options?: UseMemoryStoreOptions): UseMemoryStoreReturn

interface UseMemoryStoreOptions {
  enabled?: boolean
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  maxTokens?: number
  scope?: 'session' | 'user' | 'global'
}

interface UseMemoryStoreReturn {
  enabled: boolean
  service: MemoryContextValue | null
  config: {
    enabled: boolean
    strategy?: string
    maxTokens?: number
  }
  addMemory: (content: string, type?: MemoryType, metadata?: Record<string, any>) => Promise<void>
  query: (query: string) => Promise<any[]>
  clear: () => Promise<void>
}
```

#### Examples

##### Basic Memory Usage

```tsx
import { useMemoryStore } from '@clarity-chat/react/hooks/storage'

function MemoryChat() {
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'semantic-chunks',
    maxTokens: 4000,
  })

  const handleSend = async (message: string) => {
    // Store user message in memory
    await memory.addMemory(message, 'episodic', {
      timestamp: Date.now(),
      userId: 'user-123',
    })

    // Query relevant memories
    const relevantMemories = await memory.query(message)
    console.log('Relevant context:', relevantMemories)

    // Send with memory context
    const response = await sendToLLM(message, relevantMemories)

    // Store assistant response
    await memory.addMemory(response, 'episodic')

    return response
  }

  return <ChatInterface onSend={handleSend} />
}
```

##### Integration with ClarityChat

```tsx
import { ClarityChat } from '@clarity-chat/react'

function ChatWithMemory() {
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'vector-store',
    scope: 'user',
  })

  return (
    <ClarityChat
      api="/api/chat"
      memory={memory.config}
      onMessage={async (msg) => {
        // Automatically stores messages in memory
        await memory.addMemory(msg.content, 'episodic')
      }}
    />
  )
}
```

##### Clear Memory

```tsx
function ChatWithClearButton() {
  const memory = useMemoryStore({ enabled: true })

  const handleClear = async () => {
    await memory.clear()
    toast.success('Conversation memory cleared')
  }

  return (
    <div>
      <ChatInterface />
      <button onClick={handleClear}>Clear Memory</button>
    </div>
  )
}
```

---

## Dashboard Hooks

### useDashboardData

**Fetch and manage single data source with loading, retry, polling, and stale detection.**

#### Signature

```typescript
function useDashboardData<T>(options: UseDashboardDataOptions<T>): DashboardDataState<T> & DashboardDataActions<T>

interface UseDashboardDataOptions<T> {
  fetcher: () => Promise<T>
  initialData?: T
  fetchOnMount?: boolean          // Default: true
  pollingInterval?: number | null // null to disable
  enableRetry?: boolean           // Default: true
  maxRetries?: number             // Default: 3
  retryBackoffMs?: number         // Default: 1000
  staleTime?: number              // Time until stale
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  dependencies?: React.DependencyList
}

interface DashboardDataState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  isStale: boolean
  isRefetching: boolean
  lastFetchedAt: number | null
  retryCount: number
}

interface DashboardDataActions<T> {
  refetch: () => Promise<void>
  reset: () => void
  invalidate: () => void
  setOptimistic: (newData: T) => { rollback: () => void }
  setData: (newData: T) => void
}
```

#### Examples

##### Basic Dashboard Data

```tsx
import { useDashboardData } from '@clarity-chat/react/hooks/dashboard'

function AnalyticsDashboard() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useDashboardData({
    fetcher: async () => {
      const response = await fetch('/api/analytics')
      return response.json()
    },
    pollingInterval: 60000,  // Refresh every minute
    staleTime: 30000,        // Consider stale after 30s
  })

  if (isLoading) return <div>Loading analytics...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <button onClick={refetch}>Refresh</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

##### With Retry and Error Handling

```tsx
function RobustDashboard() {
  const {
    data,
    isLoading,
    error,
    retryCount,
    refetch,
  } = useDashboardData({
    fetcher: fetchAnalytics,
    enableRetry: true,
    maxRetries: 5,
    retryBackoffMs: 2000,
    onError: (error) => {
      console.error('Failed to fetch analytics:', error)
      sendToErrorTracking(error)
    },
    onSuccess: (data) => {
      console.log('Analytics loaded successfully')
    },
  })

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 rounded">
        <p className="text-destructive font-semibold">Error loading data</p>
        <p className="text-sm mt-1">{error.message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Retry attempt: {retryCount}
        </p>
        <button onClick={refetch} className="mt-2 px-4 py-2 bg-primary text-white rounded">
          Try Again
        </button>
      </div>
    )
  }

  return <DashboardView data={data} isLoading={isLoading} />
}
```

##### Optimistic Updates

```tsx
function OptimisticDashboard() {
  const {
    data,
    setOptimistic,
    refetch,
  } = useDashboardData({
    fetcher: fetchUserSettings,
  })

  const handleUpdate = async (newValue: string) => {
    // Update UI immediately
    const { rollback } = setOptimistic({
      ...data,
      setting: newValue,
    })

    try {
      // Save to API
      await fetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ setting: newValue }),
      })

      // Refetch to ensure sync
      await refetch()
    } catch (error) {
      // Revert on error
      rollback()
      toast.error('Failed to save')
    }
  }

  return <SettingsForm data={data} onUpdate={handleUpdate} />
}
```

##### Polling with Stop/Start

```tsx
function PollingDashboard() {
  const [polling, setPolling] = useState(true)

  const {
    data,
    isLoading,
    isRefetching,
  } = useDashboardData({
    fetcher: fetchRealtimeMetrics,
    pollingInterval: polling ? 5000 : null,  // Poll every 5s when enabled
  })

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setPolling(!polling)}>
          {polling ? '⏸️ Pause' : '▶️ Resume'} Auto-refresh
        </button>
        {isRefetching && <span className="text-sm">Refreshing...</span>}
      </div>
      <MetricsDisplay data={data} />
    </div>
  )
}
```

---

### useDashboardComposer

**Compose multiple data sources with parallel fetching and progress tracking.**

#### Signature

```typescript
function useDashboardComposer<T extends Record<string, unknown>>(
  options: UseDashboardComposerOptions<T>
): DashboardComposerState<T> & DashboardComposerActions

interface UseDashboardComposerOptions<T> {
  sources: Array<DataSourceConfig<T[keyof T]>>
  fetchOnMount?: boolean          // Default: true
  parallel?: boolean              // Default: true
  onAllSuccess?: (data: T) => void
  onError?: (key: string, error: Error) => void
}

interface DataSourceConfig<T> {
  key: string
  fetcher: () => Promise<T>
  required?: boolean
  staleTime?: number
  maxRetries?: number
}

interface DashboardComposerState<T> {
  sources: { [K in keyof T]: DataSourceState<T[K]> }
  isLoading: boolean
  isReady: boolean
  hasError: boolean
  errors: Array<{ key: string; error: Error }>
  isStale: boolean
  loadingProgress: number
}
```

#### Examples

##### Multi-Source Dashboard

```tsx
import { useDashboardComposer } from '@clarity-chat/react/hooks/dashboard'

interface DashboardData {
  users: { total: number; active: number }
  revenue: { total: number; monthly: number[] }
  activity: { messages: number; sessions: number }
}

function CompleteDashboard() {
  const {
    sources,
    isLoading,
    isReady,
    hasError,
    loadingProgress,
    refetchAll,
  } = useDashboardComposer<DashboardData>({
    sources: [
      {
        key: 'users',
        fetcher: async () => {
          const res = await fetch('/api/users/stats')
          return res.json()
        },
        required: true,
      },
      {
        key: 'revenue',
        fetcher: async () => {
          const res = await fetch('/api/revenue')
          return res.json()
        },
        required: true,
      },
      {
        key: 'activity',
        fetcher: async () => {
          const res = await fetch('/api/activity')
          return res.json()
        },
        required: false,
      },
    ],
    parallel: true,
    onAllSuccess: (data) => {
      console.log('All data loaded:', data)
    },
  })

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="text-lg mb-2">Loading Dashboard...</div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {loadingProgress}% complete
        </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={refetchAll} className="px-4 py-2 bg-primary text-white rounded">
          Refresh All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Users Card */}
        <div className="p-4 bg-card rounded-lg">
          {sources.users.isLoading ? (
            <div>Loading users...</div>
          ) : sources.users.error ? (
            <div className="text-destructive">Error loading users</div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold mb-2">Users</h3>
              <p className="text-3xl font-bold">{sources.users.data?.total}</p>
              <p className="text-sm text-muted-foreground">
                {sources.users.data?.active} active
              </p>
            </div>
          )}
        </div>

        {/* Revenue Card */}
        <div className="p-4 bg-card rounded-lg">
          {sources.revenue.data && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Revenue</h3>
              <p className="text-3xl font-bold">
                ${sources.revenue.data.total.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Activity Card */}
        <div className="p-4 bg-card rounded-lg">
          {sources.activity.data && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Activity</h3>
              <p className="text-xl">{sources.activity.data.messages} messages</p>
              <p className="text-sm text-muted-foreground">
                {sources.activity.data.sessions} sessions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

##### Sequential Loading

```tsx
function SequentialDashboard() {
  const { sources, isLoading } = useDashboardComposer({
    sources: [
      { key: 'config', fetcher: fetchConfig },
      { key: 'data', fetcher: fetchData },  // Waits for config
    ],
    parallel: false,  // Load sequentially
  })

  return <div>...</div>
}
```

---

## Common Patterns

### Secure Dashboard with Memory

```tsx
function SecureAnalyticsDashboard() {
  const security = useSecurity({
    rateLimit: { enabled: true, maxRequestsPerMinute: 30 },
  })

  const memory = useMemoryStore({
    enabled: true,
    strategy: 'semantic-chunks',
  })

  const dashboard = useDashboardData({
    fetcher: async () => {
      // Validate request before fetching
      const validation = await security.validateInput('fetch_analytics')
      if (!validation.allowed) {
        throw new Error('Rate limit exceeded')
      }

      const data = await fetchAnalytics()

      // Store in memory for context
      await memory.addMemory(JSON.stringify(data), 'episodic')

      return data
    },
  })

  return <DashboardView {...dashboard} />
}
```

---

## Troubleshooting

### Security False Positives

**Problem:** Legitimate messages being blocked.

**Solutions:**

1. Adjust security thresholds
2. Whitelist patterns
3. Use 'warn' instead of 'block'

```tsx
const security = useSecurity({
  promptInjection: { enabled: true, threshold: 0.8 },  // Less strict
})
```

### Memory Not Persisting

**Problem:** Memory cleared on page refresh.

**Solution:** Ensure memory service has persistent storage configured:

```tsx
const memory = useMemoryStore({
  enabled: true,
  scope: 'user',  // Persist per user, not per session
})
```

### Dashboard Stuck Loading

**Problem:** `isLoading` never becomes false.

**Solutions:**

1. Check fetcher returns a Promise
2. Verify no infinite loops in dependencies
3. Add error handling

```tsx
const { data, error } = useDashboardData({
  fetcher: async () => {
    try {
      return await fetchData()
    } catch (err) {
      console.error('Fetch failed:', err)
      throw err
    }
  },
  onError: (error) => console.error('Dashboard error:', error),
})
```

---

## Related Hooks

- **[Chat Hooks](/docs/api/hooks/chat.md)**: Core chat functionality
- **[Memory Hooks](/docs/api/hooks/memory.md)**: Context management
- **[Token Hooks](/docs/api/hooks/token.md)**: Token tracking

---

## Best Practices

### 1. Always Validate User Input

```tsx
// Good - validate before processing
const { validateInput } = useSecurity()
const validation = await validateInput(userInput)
if (!validation.allowed) return

// Avoid - no validation
await sendToLLM(userInput)
```

### 2. Use Appropriate Memory Scope

```tsx
// Session scope - cleared on logout
const sessionMemory = useMemoryStore({ scope: 'session' })

// User scope - persists across sessions
const userMemory = useMemoryStore({ scope: 'user' })
```

### 3. Handle Dashboard Errors Gracefully

```tsx
const { data, error } = useDashboardData({
  fetcher: fetchData,
  onError: (error) => {
    // Log to monitoring
    logError(error)

    // Show user-friendly message
    toast.error('Failed to load dashboard')
  },
})
```

### 4. Show Loading Progress

```tsx
const { loadingProgress, isLoading } = useDashboardComposer({
  sources: [...],
})

{isLoading && (
  <ProgressBar value={loadingProgress} />
)}
```

### 5. Implement Rate Limiting

Always enable rate limiting in production:

```tsx
const security = useSecurity({
  rateLimit: {
    enabled: true,
    maxRequestsPerMinute: 60,
  },
})
```
