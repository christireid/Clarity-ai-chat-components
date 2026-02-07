'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import { ApiKeyInput } from '@/components/api-key-input'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import { ClarityChatProvider, useClarityChatContext } from '@clarity-chat/react'
import { createLiveChatAdapter } from '@/lib/live-chat-adapter'
import type {
  ChatMessage,
  StreamStatus,
  ThinkingStep,
  ClarityChatContextValue,
} from '@/lib/clarity-chat-types'
import { connectedDocs } from '@/data/docs/connected-docs'
import {
  Send,
  Bot,
  User,
  Wifi,
  WifiOff,
  RotateCcw,
  Sparkles,
  Zap,
  MessageSquare,
  Settings2,
  Brain,
} from 'lucide-react'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

// Helper to get typed context from provider
function useTypedChat(): ClarityChatContextValue {
  return useClarityChatContext() as unknown as ClarityChatContextValue
}

// ---------------------------------------------------------------------------
// Connected Chat Messages – uses useChatMessages() hook
// ---------------------------------------------------------------------------

function ConnectedMessages() {
  const { messages, streamingMessage } = useTypedChat()
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new content
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages, streamingMessage?.content])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]"
    >
      {messages.length === 0 && !streamingMessage && (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="icon-container mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h4 className="font-medium mb-1">Connected Chat Demo</h4>
          <p className="text-sm text-muted-foreground max-w-sm">
            This is a fully connected chat powered by ClarityChatProvider with a
            real Anthropic API adapter. Send a message to get a live AI
            response.
          </p>
        </div>
      )}

      {messages.map((msg: ChatMessage) => (
        <div
          key={msg.id}
          className={cn(
            'flex gap-3',
            msg.role === 'user' ? 'flex-row-reverse' : ''
          )}
        >
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
              msg.role === 'user'
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {msg.role === 'user' ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </div>
          <div
            className={cn(
              'rounded-xl px-4 py-2.5 max-w-[80%] text-sm',
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'glass-panel',
              msg.status === 'error' && 'border border-red-500/50'
            )}
          >
            <p className="whitespace-pre-wrap">
              {msg.content}
              {msg.status === 'streaming' && (
                <span className="inline-block w-0.5 h-4 bg-foreground animate-pulse ml-0.5" />
              )}
            </p>
            {msg.status === 'error' && (
              <p className="text-xs text-red-400 mt-1">
                Error generating response
              </p>
            )}
            <span className="text-[10px] opacity-50 mt-1 block">
              {msg.createdAt.toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Connected Status Bar – uses useChatStreamStatus() hook
// ---------------------------------------------------------------------------

function ConnectedStatusBar() {
  const { streamStatus, isStreaming } = useTypedChat()

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-t border-border/50 text-xs text-muted-foreground">
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          isStreaming
            ? 'bg-green-500 animate-pulse'
            : streamStatus.phase === 'error'
              ? 'bg-red-500'
              : 'bg-muted-foreground/30'
        )}
      />
      <span className="capitalize">{streamStatus.phase}</span>
      {isStreaming && streamStatus.tokensUsed > 0 && (
        <Badge variant="secondary" className="text-[10px] h-4 font-mono">
          <Zap className="h-2.5 w-2.5 mr-0.5" />
          {streamStatus.tokensUsed} tokens
        </Badge>
      )}
      {streamStatus.phase === 'error' && streamStatus.error && (
        <span className="text-red-400 truncate max-w-[200px]">
          {streamStatus.error}
        </span>
      )}
      <div className="flex-1" />
      <span>ClarityChatProvider</span>
      {isStreaming ? (
        <Wifi className="h-3 w-3 text-green-500" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Connected Thinking Display – uses useChatThinking() hook
// ---------------------------------------------------------------------------

function ConnectedThinking() {
  const { thinkingSteps, isThinking } = useTypedChat()

  if (thinkingSteps.length === 0) return null

  return (
    <div className="px-4 py-2 border-b border-border/50">
      <div className="flex items-center gap-2 mb-1">
        <Brain className="h-3 w-3 text-violet-400" />
        <span className="text-xs font-medium text-violet-400">
          {isThinking ? 'Thinking...' : 'Thought process'}
        </span>
      </div>
      <div className="text-xs text-muted-foreground max-h-20 overflow-y-auto">
        {thinkingSteps.map((step: ThinkingStep) => (
          <p key={step.id} className="whitespace-pre-wrap">
            {step.content.slice(0, 200)}
            {step.content.length > 200 && '...'}
          </p>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Connected Chat Input – uses useClarityChat() hook
// ---------------------------------------------------------------------------

function ConnectedChatInput() {
  const { sendMessage, stopGeneration, clearMessages, isStreaming } =
    useTypedChat()
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
    setInput('')
  }

  return (
    <div className="p-3 border-t border-border/50">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={isStreaming}
        />
        {isStreaming ? (
          <Button variant="destructive" onClick={stopGeneration} size="sm">
            Stop
          </Button>
        ) : (
          <Button onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={clearMessages}
          disabled={isStreaming}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Connected Chat Wrapper – creates adapter and wraps in ClarityChatProvider
// ---------------------------------------------------------------------------

function ConnectedChatInner({
  apiKey,
  model,
}: {
  apiKey: string
  model: string
}) {
  const adapter = useMemo(
    () => createLiveChatAdapter({ apiKey, model }),
    [apiKey, model]
  )

  const noop = useCallback(() => {}, [])

  return (
    <ClarityChatProvider
      adapter={adapter as Parameters<typeof ClarityChatProvider>[0]['adapter']}
      onMessagesChange={noop as () => void}
      onError={noop as (error: Error) => void}
    >
      <div className="glass-card overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">Clarity Assistant</h4>
            <p className="text-xs text-muted-foreground">
              Live AI — powered by Anthropic
            </p>
          </div>
        </div>

        {/* Thinking */}
        <ConnectedThinking />

        {/* Messages */}
        <ConnectedMessages />

        {/* Input */}
        <ConnectedChatInput />

        {/* Status bar */}
        <ConnectedStatusBar />
      </div>
    </ClarityChatProvider>
  )
}

// ---------------------------------------------------------------------------
// Architecture Diagram
// ---------------------------------------------------------------------------

function ArchitectureDiagram() {
  const layers = [
    {
      label: 'ClarityChatProvider',
      color: 'bg-primary/20 border-primary/40',
      items: ['ChatConfig', 'ChatAdapter', 'State Store'],
    },
    {
      label: 'Connected Hooks',
      color: 'bg-violet-500/20 border-violet-500/40',
      items: [
        'useChatMessages()',
        'useChatStreamStatus()',
        'useChatTools()',
        'useChatThinking()',
      ],
    },
    {
      label: 'UI Components',
      color: 'bg-cyan-500/20 border-cyan-500/40',
      items: [
        'MessageList',
        'ChatInput',
        'StreamingProgress',
        'ToolInvocationCard',
      ],
    },
  ]

  return (
    <div className="space-y-3">
      {layers.map((layer) => (
        <div
          key={layer.label}
          className={cn('rounded-xl border p-4', layer.color)}
        >
          <h5 className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">
            {layer.label}
          </h5>
          <div className="flex flex-wrap gap-2">
            {layer.items.map((item) => (
              <Badge key={item} variant="outline" className="text-xs font-mono">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground text-center">
        Each layer subscribes reactively — no prop drilling required
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ConnectedPage() {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('claude-sonnet-4-5-20250929')

  return (
    <div>
      <PageHeader
        title="Connected Demo"
        description="A full chat interface powered by ClarityChatProvider with a live Anthropic adapter. All components use real connected hooks — useChatMessages(), useChatStreamStatus(), useChatThinking() — wired through React context."
        icon={MessageSquare}
        badge="Live AI"
      />

      <ComponentSection
        title="API Configuration"
        description="Enter your Anthropic API key to power the live chat demo. Your key is stored locally and proxied server-side."
        icon={Settings2}
      >
        <ApiKeyInput
          onKeyChange={setApiKey}
          onModelChange={setModel}
          compact={!!apiKey}
        />
      </ComponentSection>

      <ComponentSection
        title="Live Connected Chat"
        description="Send messages and receive real AI responses. All child components (messages, input, status bar, thinking display) use connected hooks — zero prop drilling."
        icon={Sparkles}
        docs={connectedDocs['Live Connected Chat']}
      >
        {apiKey ? (
          <ConnectedChatInner apiKey={apiKey} model={model} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Bot className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Enter your API key above to enable the live connected chat demo.
            </p>
          </div>
        )}
      </ComponentSection>

      <ComponentSection
        title="Provider Architecture"
        description="The three-layer architecture: Provider → Connected Hooks → UI Components. Each layer is independently testable and composable."
        icon={Settings2}
        docs={connectedDocs['Provider Architecture']}
      >
        <ArchitectureDiagram />
      </ComponentSection>
    </div>
  )
}
