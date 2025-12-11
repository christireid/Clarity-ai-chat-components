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
          'Configure the API URL and optionally add headers for authentication.',
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
