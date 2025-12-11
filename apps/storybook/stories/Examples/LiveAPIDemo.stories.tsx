/**
 * Live API Demo Stories
 *
 * Demonstrates connecting to real AI APIs with configurable endpoints.
 * Use this to test against your own API or explore different providers.
 *
 * ## Configuration
 * Set your API endpoint in the controls panel to test against your backend.
 *
 * ## Supported Formats
 * - OpenAI-compatible streaming (SSE)
 * - Custom streaming endpoints
 * - Non-streaming responses
 *
 * ## CORS Considerations
 *
 * **Important**: Direct browser requests to AI APIs (OpenAI, Anthropic) will be
 * blocked by CORS policies. To use real providers:
 *
 * 1. **Use a backend proxy** (recommended): Create an API route in your app that
 *    forwards requests to the AI provider
 * 2. **Use Ollama locally**: Ollama runs on localhost and allows CORS by default
 * 3. **Use a CORS proxy**: For development only, use a service like cors-anywhere
 *
 * ## Quick Start with Ollama (Local AI)
 *
 * Ollama is the easiest way to test with real AI locally:
 *
 * ```bash
 * # 1. Install Ollama (macOS)
 * brew install ollama
 *
 * # Or download from https://ollama.ai
 *
 * # 2. Start Ollama server
 * ollama serve
 *
 * # 3. Pull a model (in another terminal)
 * ollama pull llama3.2
 *
 * # 4. Test the API
 * curl http://localhost:11434/api/chat -d '{
 *   "model": "llama3.2",
 *   "messages": [{"role": "user", "content": "Hello!"}]
 * }'
 * ```
 *
 * Then select "Ollama (Local)" in the provider selector below.
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState, useCallback } from 'react'
import { ClarityChat } from '@clarity-chat/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Badge,
} from '@clarity-chat/primitives'

const meta: Meta = {
  title: 'Examples/Live API Demo',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Test Clarity Chat components against your own API endpoint. ' +
          'Configure the API URL and optionally add headers for authentication. ' +
          '**Note**: Direct browser requests to OpenAI/Anthropic APIs will be blocked by CORS. ' +
          'Use Ollama for local testing or create a backend proxy for production providers.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Configurable API endpoint demo.
 * Enter your own API URL to test the chat components against a real backend.
 */
export const ConfigurableEndpoint: Story = {
  render: () => {
    const [apiUrl, setApiUrl] = useState('/api/chat')
    const [apiKey, setApiKey] = useState('')
    const [isConfigured, setIsConfigured] = useState(false)

    const handleConfigure = useCallback(() => {
      if (apiUrl) {
        setIsConfigured(true)
      }
    }, [apiUrl])

    const handleReset = useCallback(() => {
      setIsConfigured(false)
    }, [])

    if (!isConfigured) {
      return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Configure API Endpoint</CardTitle>
              <CardDescription>
                Enter your chat API endpoint to test Clarity Chat components
                with your own backend.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="api-url">
                  API URL
                </label>
                <Input
                  id="api-url"
                  placeholder="https://api.example.com/chat"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your API should accept POST requests with a messages array and
                  return SSE-formatted streaming responses.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="api-key">
                  API Key (optional)
                </label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Will be sent as Authorization: Bearer header
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-sm text-amber-800 dark:text-amber-200">
                For security, never use production API keys in public demos. Use
                test keys or local development endpoints.
              </div>

              <Button onClick={handleConfigure} className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Live API</Badge>
            <span className="text-sm text-muted-foreground truncate max-w-md">
              {apiUrl}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Change Endpoint
          </Button>
        </div>
        <div className="flex-1">
          <ClarityChat
            api={apiUrl}
            headers={apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined}
            showHeader
            sessionTitle="Live API Test"
            sessionSubtitle={apiUrl}
            showNetworkStatus
          />
        </div>
      </div>
    )
  },
}

/**
 * Mock server demo - works without any configuration.
 * Uses the built-in MSW mock server to simulate AI responses.
 */
export const MockServerDemo: Story = {
  parameters: {
    msw: {
      handlers: [
        // This story uses the global MSW handlers configured in preview.tsx
      ],
    },
  },
  render: () => {
    return (
      <div className="h-screen">
        <ClarityChat
          api="/api/chat"
          showHeader
          sessionTitle="Mock Server Demo"
          sessionSubtitle="Using MSW to simulate responses"
          showMessageCount
        />
      </div>
    )
  },
}

/**
 * API Response Inspector
 * Shows the raw API responses as they stream in, useful for debugging.
 */
export const ResponseInspector: Story = {
  render: () => {
    const [logs, setLogs] = useState<
      Array<{ timestamp: Date; type: string; data: string }>
    >([])

    const addLog = useCallback((type: string, data: string) => {
      setLogs((prev) => [
        ...prev.slice(-50),
        { timestamp: new Date(), type, data },
      ])
    }, [])

    return (
      <div className="h-screen flex">
        <div className="flex-1 border-r">
          <ClarityChat
            api="/api/chat"
            showHeader
            sessionTitle="Response Inspector"
            onError={(error) => addLog('error', error.message)}
          />
        </div>
        <div className="w-96 flex flex-col bg-muted/30">
          <div className="p-4 border-b font-medium flex items-center justify-between">
            <span>Response Log</span>
            <Button variant="ghost" size="sm" onClick={() => setLogs([])}>
              Clear
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2 font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">
                Send a message to see API responses here...
              </p>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className={`p-2 rounded ${
                    log.type === 'error'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-background'
                  }`}
                >
                  <div className="text-muted-foreground">
                    {log.timestamp.toLocaleTimeString()} [{log.type}]
                  </div>
                  <div className="break-all">{log.data}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Real Provider Integration
 * Connect to real AI providers with pre-configured endpoints.
 *
 * **IMPORTANT**: API keys are stored in localStorage for convenience during testing.
 * Never use production API keys in public demos. Use test keys only.
 */
export const RealProviderIntegration: Story = {
  render: () => {
    const PROVIDERS = [
      {
        id: 'openai',
        name: 'OpenAI',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        placeholder: 'sk-...',
        docs: 'https://platform.openai.com/api-keys',
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        endpoint: 'https://api.anthropic.com/v1/messages',
        placeholder: 'sk-ant-...',
        docs: 'https://console.anthropic.com/settings/keys',
      },
      {
        id: 'ollama',
        name: 'Ollama (Local)',
        endpoint: 'http://localhost:11434/api/chat',
        placeholder: '(no key needed)',
        docs: 'https://ollama.ai',
      },
      {
        id: 'custom',
        name: 'Custom Endpoint',
        endpoint: '',
        placeholder: 'Your API key',
        docs: '',
      },
    ]

    const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0])
    const [customEndpoint, setCustomEndpoint] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [isConnected, setIsConnected] = useState(false)

    // Load saved API key from localStorage
    React.useEffect(() => {
      const saved = localStorage.getItem(
        `clarity-demo-key-${selectedProvider.id}`
      )
      if (saved) setApiKey(saved)
    }, [selectedProvider.id])

    const handleConnect = useCallback(() => {
      // Save key to localStorage (with warning)
      if (apiKey && selectedProvider.id !== 'ollama') {
        localStorage.setItem(`clarity-demo-key-${selectedProvider.id}`, apiKey)
      }
      setIsConnected(true)
    }, [apiKey, selectedProvider.id])

    const handleDisconnect = useCallback(() => {
      setIsConnected(false)
    }, [])

    const handleClearKey = useCallback(() => {
      localStorage.removeItem(`clarity-demo-key-${selectedProvider.id}`)
      setApiKey('')
    }, [selectedProvider.id])

    const endpoint =
      selectedProvider.id === 'custom'
        ? customEndpoint
        : selectedProvider.endpoint

    if (!isConnected) {
      return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🔌</span> Real Provider Integration
              </CardTitle>
              <CardDescription>
                Connect to a real AI provider to test Clarity Chat with live
                responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Provider Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => {
                        setSelectedProvider(provider)
                        const saved = localStorage.getItem(
                          `clarity-demo-key-${provider.id}`
                        )
                        setApiKey(saved || '')
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedProvider.id === provider.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium text-sm">{provider.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {provider.endpoint || 'Custom URL'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Endpoint */}
              {selectedProvider.id === 'custom' && (
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="custom-endpoint"
                  >
                    Custom Endpoint URL
                  </label>
                  <Input
                    id="custom-endpoint"
                    placeholder="https://your-api.com/chat"
                    value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                  />
                </div>
              )}

              {/* API Key */}
              {selectedProvider.id !== 'ollama' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      className="text-sm font-medium"
                      htmlFor="provider-key"
                    >
                      API Key
                    </label>
                    {apiKey && (
                      <button
                        onClick={handleClearKey}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Clear saved key
                      </button>
                    )}
                  </div>
                  <Input
                    id="provider-key"
                    type="password"
                    placeholder={selectedProvider.placeholder}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  {selectedProvider.docs && (
                    <p className="text-xs text-muted-foreground">
                      Get your API key from{' '}
                      <a
                        href={selectedProvider.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        {selectedProvider.name} Console
                      </a>
                    </p>
                  )}
                </div>
              )}

              {/* Security Warning */}
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-sm text-amber-800 dark:text-amber-200">
                <strong>⚠️ Security Notice:</strong>
                <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
                  <li>
                    API keys are stored in localStorage for demo convenience
                  </li>
                  <li>Never use production keys in public environments</li>
                  <li>Clear your keys when done testing</li>
                  <li>API calls are made directly from your browser</li>
                </ul>
              </div>

              <Button
                onClick={handleConnect}
                className="w-full"
                disabled={
                  !endpoint || (selectedProvider.id !== 'ollama' && !apiKey)
                }
              >
                Connect to {selectedProvider.name}
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500">Connected</Badge>
            <span className="font-medium">{selectedProvider.name}</span>
            <span className="text-sm text-muted-foreground truncate max-w-md">
              {endpoint}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </div>
        <div className="flex-1">
          <ClarityChat
            api={endpoint}
            headers={
              apiKey
                ? {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                  }
                : { 'Content-Type': 'application/json' }
            }
            showHeader
            sessionTitle={`${selectedProvider.name} Demo`}
            sessionSubtitle="Live API Connection"
            showNetworkStatus
          />
        </div>
      </div>
    )
  },
}

/**
 * Multi-Provider Comparison
 * Compare responses from different AI providers side by side.
 */
export const ProviderComparison: Story = {
  render: () => {
    const [provider1, setProvider1] = useState('/api/chat')
    const [provider2, setProvider2] = useState('/api/chat')

    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b bg-muted/50">
          <h2 className="font-semibold mb-2">Multi-Provider Comparison</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">
                Provider 1
              </label>
              <Input
                value={provider1}
                onChange={(e) => setProvider1(e.target.value)}
                placeholder="API endpoint 1"
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">
                Provider 2
              </label>
              <Input
                value={provider2}
                onChange={(e) => setProvider2(e.target.value)}
                placeholder="API endpoint 2"
                className="mt-1"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 border-r">
            <ClarityChat
              api={provider1}
              showHeader
              sessionTitle="Provider 1"
              sessionSubtitle={provider1}
            />
          </div>
          <div className="flex-1">
            <ClarityChat
              api={provider2}
              showHeader
              sessionTitle="Provider 2"
              sessionSubtitle={provider2}
            />
          </div>
        </div>
      </div>
    )
  },
}
