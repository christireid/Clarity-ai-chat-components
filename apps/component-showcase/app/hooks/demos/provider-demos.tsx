'use client'

import { useState, useMemo, useCallback } from 'react'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import {
  ClarityChatProvider,
  useClarityChatContext,
  useFocusTrap,
} from '@clarity-chat/react'
import { createLiveChatAdapter } from '@/lib/live-chat-adapter'
import { ApiKeyInput } from '@/components/api-key-input'
import { parseSSEStream } from '@/lib/sse-utils'
import { getStoredApiKey, getStoredModel } from '@/lib/api-key-store'
import type {
  ChatMessage,
  ClarityChatContextValue,
} from '@/lib/clarity-chat-types'
import { RotateCcw, Wifi, WifiOff, Send, Key } from 'lucide-react'

// Helper to get typed context from provider
function useTypedChat(): ClarityChatContextValue {
  return useClarityChatContext() as unknown as ClarityChatContextValue
}

// ---------------------------------------------------------------------------
// Demo: ClarityChatProvider + Real Context Hooks
// ---------------------------------------------------------------------------

function ProviderChatUI() {
  const {
    messages,
    streamStatus,
    isStreaming,
    sendMessage,
    stopGeneration,
    clearMessages,
  } = useTypedChat()
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
    setInput('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="font-mono text-xs">
          {messages.length} messages
        </Badge>
        <Badge
          variant={isStreaming ? 'default' : 'secondary'}
          className="font-mono text-xs"
        >
          {isStreaming ? (
            <>
              <Wifi className="h-3 w-3 mr-1" /> {streamStatus.phase}
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 mr-1" /> {streamStatus.phase}
            </>
          )}
        </Badge>
        <Badge variant="secondary" className="font-mono text-xs">
          Provider connected
        </Badge>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="ghost"
          onClick={clearMessages}
          disabled={isStreaming}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="glass-panel p-3 rounded-xl max-h-48 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            Real ClarityChatProvider + useChatMessages(). Send a message!
          </p>
        ) : (
          messages.map((msg: ChatMessage) => (
            <div
              key={msg.id}
              className={cn(
                'text-xs p-2 rounded-lg max-w-[80%]',
                msg.role === 'user' ? 'bg-primary/10 ml-auto' : 'bg-muted/50'
              )}
            >
              <span className="font-medium text-muted-foreground">
                {msg.role}:
              </span>{' '}
              {msg.content}
              {msg.status === 'streaming' && (
                <span className="inline-block w-0.5 h-3 bg-foreground animate-pulse ml-0.5" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-md border border-border/50 bg-muted/30 px-3 py-1.5 text-sm"
          disabled={isStreaming}
        />
        {isStreaming ? (
          <Button size="sm" variant="destructive" onClick={stopGeneration}>
            Stop
          </Button>
        ) : (
          <Button size="sm" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function ProviderContextDemo() {
  const [apiKey, setApiKey] = useState(() => getStoredApiKey())
  const [model, setModel] = useState(() => getStoredModel())

  const adapter = useMemo(
    () => (apiKey ? createLiveChatAdapter({ apiKey, model }) : null),
    [apiKey, model]
  )

  const noop = useCallback(() => {}, [])

  if (!apiKey || !adapter) {
    return (
      <div className="space-y-3">
        <ApiKeyInput onKeyChange={setApiKey} onModelChange={setModel} />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <ApiKeyInput onKeyChange={setApiKey} onModelChange={setModel} compact />
      <ClarityChatProvider
        adapter={adapter as any}
        onMessagesChange={noop as any}
        onError={noop as any}
      >
        <ProviderChatUI />
      </ClarityChatProvider>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Demo: useFocusTrap
// ---------------------------------------------------------------------------

export function FocusTrapDemo() {
  const [trapped, setTrapped] = useState(false)
  const trapRef = useFocusTrap(trapped)

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={() => setTrapped(!trapped)}>
        {trapped ? 'Release Focus' : 'Trap Focus'}
      </Button>

      <div
        ref={trapRef as React.RefObject<HTMLDivElement | null>}
        className={cn(
          'glass-panel p-4 rounded-xl space-y-3 transition-all',
          trapped && 'ring-2 ring-primary/50'
        )}
      >
        <p className="text-xs text-muted-foreground">
          {trapped
            ? 'Focus is trapped! Tab will cycle through these controls only.'
            : 'Click "Trap Focus" to restrict tab navigation to this container.'}
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Button A
          </Button>
          <Button size="sm" variant="outline">
            Button B
          </Button>
          <Button size="sm" variant="outline">
            Button C
          </Button>
        </div>
        <input
          type="text"
          placeholder="Tab into this input..."
          className="w-full rounded-md border border-border/50 bg-muted/30 px-2 py-1 text-xs font-mono"
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Demo: Real Streaming via API
// ---------------------------------------------------------------------------

export function StreamingHookDemo() {
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([])
  const [inputVal, setInputVal] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamContent, setStreamContent] = useState('')
  const [apiKey] = useState(() => getStoredApiKey())
  const [model] = useState(() => getStoredModel())
  let abortController: AbortController | null = null

  const handleSend = async () => {
    if (!inputVal.trim() || isStreaming || !apiKey) return
    const userMsg = inputVal.trim()
    setInputVal('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setIsStreaming(true)
    setStreamContent('')

    const controller = new AbortController()
    abortController = controller

    try {
      const allMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMsg },
      ]

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ messages: allMessages, model }),
        signal: controller.signal,
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)
      if (!response.body) throw new Error('No response body')

      let fullContent = ''
      for await (const event of parseSSEStream(response.body)) {
        if (event.type === 'text') {
          fullContent += event.text
          setStreamContent(fullContent)
        }
        if (event.type === 'done') break
        if (event.type === 'error') throw new Error(event.error)
      }

      setIsStreaming(false)
      setStreamContent('')
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fullContent },
      ])
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setStreamContent('')
        setIsStreaming(false)
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${(error as Error).message}` },
        ])
      }
    }

    abortController = null
  }

  const handleStop = () => {
    abortController?.abort()
    setIsStreaming(false)
    if (streamContent) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: streamContent },
      ])
      setStreamContent('')
    }
  }

  if (!apiKey) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Key className="h-6 w-6 mx-auto mb-2 opacity-50" />
        <p className="text-xs">
          Set your API key in any demo above to enable streaming.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="glass-panel p-3 rounded-xl max-h-48 overflow-y-auto space-y-2">
        {messages.length === 0 && !isStreaming ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            Real streaming via Anthropic API. Type a message to see live
            streaming.
          </p>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'text-xs p-2 rounded-lg max-w-[80%]',
                  msg.role === 'user' ? 'bg-primary/10 ml-auto' : 'bg-muted/50'
                )}
              >
                {msg.content}
              </div>
            ))}
            {isStreaming && streamContent && (
              <div className="text-xs p-2 rounded-lg bg-muted/50 max-w-[80%]">
                {streamContent}
                <span className="inline-block w-0.5 h-3 bg-foreground animate-pulse ml-0.5" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-md border border-border/50 bg-muted/30 px-3 py-1.5 text-sm"
          disabled={isStreaming}
        />
        {isStreaming ? (
          <Button size="sm" variant="destructive" onClick={handleStop}>
            Stop
          </Button>
        ) : (
          <Button size="sm" onClick={handleSend} disabled={!inputVal.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
