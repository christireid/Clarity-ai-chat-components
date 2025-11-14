/**
 * Advanced Clarity Chat Example
 * 
 * Demonstrates advanced features of useClarityChat including:
 * - Memory integration with different strategies
 * - Transport selection
 * - Custom error handling
 * - Memory context display
 * 
 * @example
 * ```tsx
 * // With MemoryProvider
 * <MemoryProvider config={memoryConfig}>
 *   <AdvancedClarityChatExample />
 * </MemoryProvider>
 * ```
 */

import * as React from 'react'
import { useClarityChat } from '../hooks/use-clarity-chat'
import { ChatWindow } from '../components/chat-window'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'
import { Button, Badge, Card } from '@clarity-chat/primitives'

export function AdvancedClarityChatExample() {
  const [memoryStrategy, setMemoryStrategy] = React.useState<
    'sliding-window' | 'semantic-chunks' | 'vector-store'
  >('sliding-window')
  const [transport, setTransport] = React.useState<'sse' | 'websocket'>('sse')

  const {
    messages: coreMessages,
    input,
    setInput,
    append,
    isLoading,
    error,
    contextSummary,
    memoryEnabled,
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: memoryStrategy,
      maxTokens: 4000,
    },
    transport,
    onError: (err) => {
      console.error('Chat error:', err)
      // Custom error handling
    },
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
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
    <div className="flex h-screen flex-col">
      {/* Configuration Panel */}
      <Card className="border-b p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Memory Strategy:</label>
            <select
              value={memoryStrategy}
              onChange={(e) =>
                setMemoryStrategy(
                  e.target.value as 'sliding-window' | 'semantic-chunks' | 'vector-store'
                )
              }
              className="rounded-lg border px-3 py-1 text-sm"
            >
              <option value="sliding-window">Sliding Window</option>
              <option value="semantic-chunks">Semantic Chunks</option>
              <option value="vector-store">Vector Store</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Transport:</label>
            <select
              value={transport}
              onChange={(e) =>
                setTransport(e.target.value as 'sse' | 'websocket')
              }
              className="rounded-lg border px-3 py-1 text-sm"
            >
              <option value="sse">SSE</option>
              <option value="websocket">WebSocket</option>
            </select>
          </div>

          {memoryEnabled && (
            <Badge variant="success" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Memory Active
            </Badge>
          )}
        </div>

        {/* Memory Context Preview */}
        {contextSummary && (
          <div className="mt-3 rounded-lg border bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Memory Context:
            </p>
            <p className="text-xs text-foreground/80 line-clamp-2">
              {contextSummary}
            </p>
          </div>
        )}
      </Card>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          showHeader
          sessionTitle="Advanced Clarity Chat"
          sessionSubtitle={`Memory: ${memoryStrategy} | Transport: ${transport.toUpperCase()}`}
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
