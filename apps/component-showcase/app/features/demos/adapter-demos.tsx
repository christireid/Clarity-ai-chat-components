'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  Button,
  Badge,
  Separator,
  ScrollArea,
  Checkbox,
  cn,
} from '@clarity-chat/primitives'
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
} from 'lucide-react'

// ============================================================================
// MULTI-PROVIDER ADAPTER
// ============================================================================
export function MultiProviderAdapterDemo() {
  const [selectedProvider, setSelectedProvider] = useState<
    'openai' | 'anthropic' | 'google'
  >('openai')
  const [isConnecting, setIsConnecting] = useState(false)
  const [status, setStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected')

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      color: 'bg-green-500',
      icon: '🟢',
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      color: 'bg-orange-500',
      icon: '🟠',
    },
    {
      id: 'google',
      name: 'Google',
      models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
      color: 'bg-blue-500',
      icon: '🔵',
    },
  ]

  const handleConnect = () => {
    setIsConnecting(true)
    setStatus('connecting')
    setTimeout(() => {
      setIsConnecting(false)
      setStatus('connected')
    }, 1500)
  }

  const currentProvider = providers.find((p) => p.id === selectedProvider)!

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Provider Selector */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Select Provider</h4>
          <div className="grid grid-cols-3 gap-3">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => {
                  setSelectedProvider(provider.id as typeof selectedProvider)
                  setStatus('disconnected')
                }}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all text-left',
                  selectedProvider === provider.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-muted/50 hover:bg-muted'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{provider.icon}</span>
                  <span className="font-medium">{provider.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {provider.models.length} models
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-3 h-3 rounded-full',
                status === 'connected'
                  ? 'bg-green-500'
                  : status === 'connecting'
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-muted-foreground'
              )}
            />
            <div>
              <p className="font-medium">{currentProvider.name} Adapter</p>
              <p className="text-xs text-muted-foreground capitalize">
                {status}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleConnect}
            disabled={isConnecting || status === 'connected'}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : status === 'connected' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Connected
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </div>

        {/* Available Models */}
        {status === 'connected' && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Available Models</h4>
            <div className="flex flex-wrap gap-2">
              {currentProvider.models.map((model) => (
                <Badge key={model} variant="secondary">
                  {model}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Code Example */}
        <div className="p-3 rounded-lg bg-muted font-mono text-xs overflow-x-auto">
          <pre>{`import { getAdapter } from '@clarity-chat/react/adapters'

const adapter = getAdapter('${selectedProvider}')
const response = await adapter.chat({
  model: '${currentProvider.models[0]}',
  messages: [{ role: 'user', content: 'Hello!' }]
})`}</pre>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ADAPTER MODEL SELECTOR
// ============================================================================
export function AdapterModelSelectorDemo() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o')

  const models = [
    {
      id: 'gpt-4o',
      provider: 'OpenAI',
      name: 'GPT-4o',
      speed: 4,
      quality: 5,
      cost: 4,
      context: '128K',
    },
    {
      id: 'claude-3-sonnet',
      provider: 'Anthropic',
      name: 'Claude 3 Sonnet',
      speed: 4,
      quality: 5,
      cost: 3,
      context: '200K',
    },
    {
      id: 'gemini-1.5-pro',
      provider: 'Google',
      name: 'Gemini 1.5 Pro',
      speed: 5,
      quality: 4,
      cost: 3,
      context: '1M',
    },
    {
      id: 'gpt-3.5-turbo',
      provider: 'OpenAI',
      name: 'GPT-3.5 Turbo',
      speed: 5,
      quality: 3,
      cost: 1,
      context: '16K',
    },
  ]

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              'h-3 w-3',
              i <= count ? 'fill-yellow-500 text-yellow-500' : 'text-muted'
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <ScrollArea className="h-[250px]">
          <div className="space-y-2 pr-4">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={cn(
                  'w-full p-3 rounded-lg border text-left transition-all',
                  selectedModel === model.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-muted/30 hover:bg-muted/50'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {model.provider}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {model.context}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Speed</span>
                    {renderStars(model.speed)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quality</span>
                    {renderStars(model.quality)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost</span>
                    {renderStars(model.cost)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PROVIDER HEALTH
// ============================================================================
export function ProviderHealthDemo() {
  const [metrics, setMetrics] = useState({
    openai: { latency: 245, uptime: 99.9, errors: 0.1 },
    anthropic: { latency: 312, uptime: 99.8, errors: 0.2 },
    google: { latency: 189, uptime: 99.7, errors: 0.3 },
  })

  const providers = [
    { id: 'openai', name: 'OpenAI', icon: '🟢' },
    { id: 'anthropic', name: 'Anthropic', icon: '🟠' },
    { id: 'google', name: 'Google', icon: '🔵' },
  ]

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {providers.map((provider) => {
          const m = metrics[provider.id as keyof typeof metrics]
          const healthScore = m.uptime - m.errors * 10
          const status =
            healthScore >= 99
              ? 'healthy'
              : healthScore >= 95
                ? 'degraded'
                : 'down'

          return (
            <div
              key={provider.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <span>{provider.icon}</span>
                <div>
                  <p className="font-medium text-sm">{provider.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.latency}ms avg latency
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <p className="text-green-500">{m.uptime}% uptime</p>
                  <p className="text-muted-foreground">{m.errors}% errors</p>
                </div>
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full',
                    status === 'healthy'
                      ? 'bg-green-500'
                      : status === 'degraded'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  )}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RETRY / CIRCUIT BREAKER
// ============================================================================
export function RetryCircuitBreakerDemo() {
  const [state, setState] = useState<'closed' | 'open' | 'half-open'>('closed')
  const [attempts, setAttempts] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)

  const simulateRequest = () => {
    if (state === 'open') {
      setLastError('Circuit breaker is OPEN - requests blocked')
      return
    }

    setAttempts((prev) => prev + 1)

    // Simulate random failure
    if (Math.random() < 0.4) {
      setLastError('Request failed - retrying with exponential backoff...')
      if (attempts >= 2) {
        setState('open')
        setTimeout(() => setState('half-open'), 3000)
      }
    } else {
      setLastError(null)
      setState('closed')
      setAttempts(0)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                state === 'closed'
                  ? 'bg-green-500'
                  : state === 'open'
                    ? 'bg-red-500'
                    : 'bg-yellow-500 animate-pulse'
              )}
            />
            <div>
              <p className="font-medium">Circuit Breaker</p>
              <p className="text-xs text-muted-foreground capitalize">
                State: {state}
              </p>
            </div>
          </div>
          <Badge variant={state === 'closed' ? 'secondary' : 'destructive'}>
            {attempts} attempts
          </Badge>
        </div>

        {lastError && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
            <span className="text-red-700 dark:text-red-300">{lastError}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={simulateRequest}>
            Send Request
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setState('closed')
              setAttempts(0)
              setLastError(null)
            }}
          >
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <p className="font-medium mb-1">Retry Config:</p>
          <p>Max retries: 3 | Backoff: 1s, 2s, 4s | Circuit threshold: 3</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// REQUEST INSPECTOR
// ============================================================================
export function RequestInspectorDemo() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      method: 'POST',
      endpoint: '/v1/chat/completions',
      status: 200,
      latencyMs: 120,
      tokens: 156,
    },
    {
      id: 2,
      method: 'POST',
      endpoint: '/v1/chat/completions',
      status: 200,
      latencyMs: 350,
      tokens: 342,
    },
    {
      id: 3,
      method: 'POST',
      endpoint: '/v1/embeddings',
      status: 429,
      latencyMs: 500,
      tokens: 0,
    },
  ])

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant={req.status === 200 ? 'secondary' : 'destructive'}
                  className="font-mono"
                >
                  {req.status}
                </Badge>
                <span className="font-mono text-xs">{req.method}</span>
                <span className="text-muted-foreground text-xs">
                  {req.endpoint}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">{req.latencyMs}ms</span>
                {req.tokens > 0 && (
                  <span className="text-green-500">{req.tokens} tok</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setRequests((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                method: 'POST',
                endpoint: '/v1/chat/completions',
                status: Math.random() > 0.2 ? 200 : 429,
                latencyMs: Math.floor(Math.random() * 500) + 100,
                tokens: Math.floor(Math.random() * 300) + 50,
              },
            ])
          }
        >
          Simulate Request
        </Button>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ADAPTER CONFIG
// ============================================================================
export function AdapterConfigDemo() {
  const [config, setConfig] = useState({
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 4096,
    timeout: 30000,
    retries: 3,
    streaming: true,
  })

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <div className="flex gap-2">
                {['openai', 'anthropic', 'google'].map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={config.provider === p ? 'default' : 'outline'}
                    onClick={() =>
                      setConfig((prev) => ({ ...prev, provider: p }))
                    }
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Temperature</label>
                <span className="text-sm font-mono">{config.temperature}</span>
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={config.temperature}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    temperature: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Max Tokens</label>
                <span className="text-sm font-mono">{config.maxTokens}</span>
              </div>
              <input
                type="range"
                min={256}
                max={16384}
                step={256}
                value={config.maxTokens}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    maxTokens: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Timeout (ms)</label>
                <span className="text-sm font-mono">{config.timeout}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={120000}
                step={5000}
                value={config.timeout}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    timeout: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Max Retries</label>
                <span className="text-sm font-mono">{config.retries}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={config.retries}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    retries: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <label className="text-sm font-medium">Enable Streaming</label>
              <Checkbox
                checked={config.streaming}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({
                    ...prev,
                    streaming: checked as boolean,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Config Preview */}
        <div className="p-3 rounded-lg bg-muted font-mono text-xs overflow-x-auto">
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  )
}
