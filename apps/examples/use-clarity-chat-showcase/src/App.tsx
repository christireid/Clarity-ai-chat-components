/**
 * useClarityChat Showcase Example
 *
 * Comprehensive example demonstrating all features of useClarityChat:
 * - Basic chat functionality
 * - Memory integration with different strategies
 * - Transport selection (SSE/WebSocket)
 * - Error handling
 * - Memory context visualization
 */

import * as React from 'react'
import { useClarityChat, ChatWindow, MemoryProvider } from '@clarity-chat/react'
import { convertCoreMessagesToMessages } from '@clarity-chat/react'
import { Button, Card, Badge } from '@clarity-chat/primitives'

const memoryConfig = {
  maxTokens: 10000,
}

function ChatShowcase() {
  const [memoryStrategy, setMemoryStrategy] = React.useState<
    'sliding-window' | 'semantic-chunks' | 'vector-store'
  >('sliding-window')
  const [transport, setTransport] = React.useState<'sse' | 'websocket'>('sse')
  const [memoryEnabled, setMemoryEnabled] = React.useState(false)

  const {
    messages: coreMessages,
    append,
    isLoading,
    error,
    memoryInfo,
    input,
    setInput,
    handleSubmit,
  } = useClarityChat({
    api: '/api/chat',
    memory: memoryEnabled
      ? {
          enabled: true,
          strategy: memoryStrategy,
          maxTokens: 4000,
        }
      : undefined,
    transport,
    onError: (err) => {
      console.error('Chat error:', err)
    },
  })

  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await append({
        role: 'user',
        content,
      })
    },
    [append]
  )

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Configuration Panel */}
      <Card className="border-b p-4 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enable-memory"
              checked={memoryEnabled}
              onChange={(e) => setMemoryEnabled(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="enable-memory" className="text-sm font-medium">
              Enable Memory
            </label>
          </div>

          {memoryEnabled && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Strategy:</label>
                <select
                  value={memoryStrategy}
                  onChange={(e) =>
                    setMemoryStrategy(e.target.value as typeof memoryStrategy)
                  }
                  className="rounded border px-2 py-1 text-sm"
                >
                  <option value="sliding-window">Sliding Window</option>
                  <option value="semantic-chunks">Semantic Chunks</option>
                  <option value="vector-store">Vector Store</option>
                </select>
              </div>
            </>
          )}

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Transport:</label>
            <select
              value={transport}
              onChange={(e) => setTransport(e.target.value as typeof transport)}
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="sse">SSE</option>
              <option value="websocket">WebSocket</option>
            </select>
          </div>

          {memoryInfo?.enabled && (
            <Badge variant="success" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Memory Active
            </Badge>
          )}
        </div>

        {/* Memory Context Preview */}
        {memoryInfo?.lastContextSummary && (
          <div className="mt-3 rounded-lg border bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Memory Context:
            </p>
            <p className="text-xs text-foreground/80 line-clamp-2">
              {memoryInfo.lastContextSummary}
            </p>
          </div>
        )}
      </Card>

      {/* Chat Window */}
      <div className="flex-1 min-h-0">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          showHeader
          sessionTitle="useClarityChat Showcase"
          sessionSubtitle={
            memoryEnabled
              ? `Memory: ${memoryStrategy} | Transport: ${transport.toUpperCase()}`
              : `Transport: ${transport.toUpperCase()}`
          }
        />
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-t border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-xs text-red-600">{error.message}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default function App() {
  return (
    <MemoryProvider config={memoryConfig}>
      <ChatShowcase />
    </MemoryProvider>
  )
}
