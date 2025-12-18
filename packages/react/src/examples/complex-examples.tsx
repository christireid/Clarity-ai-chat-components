import { logger } from '@clarity-chat/utils/logger'
/**
 * Complex Examples - Full Workflow Compositions
 *
 * These examples demonstrate complex, real-world use cases combining
 * multiple APIs and domains. Each example is 80-150 lines of code.
 */

import * as React from 'react'
import '@clarity-chat/react/styles.css'
import { useClarityChat } from '../hooks/chat/use-clarity-chat'
import { useChatHandlers } from '../hooks/use-chat-handlers'
import { ChatWindow } from '../components/chat-window'
import { MemoryProvider, useMemoryContext } from '../memory/memory-provider'
import {
  useClarityChatWithTools,
  createToolUIRegistry,
} from '../hooks/use-clarity-chat-with-tools'
import { createAgent } from '../agents'
import { useStreaming } from '../hooks/use-streaming'

// ============================================================================
// Example 1: Enterprise Chat with Memory and Advanced Features (100 lines)
// ============================================================================

/**
 * Full-featured enterprise chat with memory and advanced configuration
 * Shows how to compose multiple providers and hooks
 */
export function EnterpriseChatWithInfrastructure() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <EnterpriseChatInner />
    </MemoryProvider>
  )
}

function EnterpriseChatInner() {
  const memory = useMemoryContext()

  const chat = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
      maxTokens: 10000,
    },
    promptOptimization: {
      enabled: true,
      strategy: 'hybrid',
    },
  })

  const handlers = useChatHandlers({
    chat,
    onMessageSent: async (content) => {
      // Add to memory
      if (memory?.addMemory) {
        await memory.addMemory(content, 'conversation', 'session')
      }
    },
    onMessageError: (error) => {
      logger.error('Message error:', error)
    },
  })

  return (
    <div className="enterprise-chat">
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handlers.onSendMessage}
        showHeader
        sessionTitle="Enterprise Assistant"
        showMessageCount
      />
      <div className="enterprise-stats">
        <p>Memory: {memory?.stats?.totalItems || 0} items</p>
      </div>
    </div>
  )
}

// ============================================================================
// Example 2: Agent-Powered Chat with Tools (100 lines)
// ============================================================================

/**
 * Chat interface powered by an agent with tool calling
 * Shows agent orchestration with tool integration
 */
interface SearchResult {
  title: string
  url: string
  snippet: string
}

function SearchToolResult({ result }: { result: SearchResult }) {
  return (
    <div className="search-result">
      <h4>{result.title}</h4>
      <p>{result.snippet}</p>
      <a href={result.url} target="_blank" rel="noopener noreferrer">
        {result.url}
      </a>
    </div>
  )
}

export function AgentPoweredChat() {
  const toolRegistry = React.useMemo(
    () =>
      createToolUIRegistry({
        web_search: SearchToolResult,
      }),
    []
  )

  const { messages, toolResults, isLoading, append } = useClarityChatWithTools({
    api: '/api/chat',
    toolRegistry,
  })

  const handlers = useChatHandlers({
    chat: { messages, append, isLoading, setMessages: () => {} } as any,
  })

  // Create agent for complex workflows
  const agent = React.useMemo(
    () =>
      createAgent({
        name: 'ResearchAgent',
        description: 'An agent that can research topics using web search',
        tools: [
          {
            name: 'web_search',
            description: 'Search the web for information',
            parameters: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' },
              },
              required: ['query'],
            },
            execute: async (args: { query: string }) => {
              // In production, this would call your search API
              return { results: [] }
            },
          },
        ],
        maxIterations: 10,
      }),
    []
  )

  const handleComplexQuery = React.useCallback(
    async (query: string) => {
      // Use agent for complex multi-step queries
      const execution = await agent.execute(query)
      // Agent results can be integrated into chat
      logger.debug('Agent execution:', execution)
    },
    [agent]
  )

  return (
    <div>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handlers.onSendMessage}
      />
      {/* Render tool results */}
      <div className="tool-results">
        {toolResults.map((result, idx) => {
          const Component = toolRegistry.get(result.toolCall.function.name)
          return Component ? (
            <Component key={idx} result={result.result} />
          ) : null
        })}
      </div>
    </div>
  )
}

// ============================================================================
// Example 3: Multi-Chat Dashboard (150 lines)
// ============================================================================

/**
 * Dashboard with multiple chat instances
 * Shows how to manage multiple chat sessions
 */
export function MultiChatDashboard() {
  const [activeChat, setActiveChat] = React.useState<string>('chat-1')
  const [chats, setChats] = React.useState<Record<string, any>>({
    'chat-1': { id: 'chat-1', title: 'General Chat' },
    'chat-2': { id: 'chat-2', title: 'Technical Support' },
    'chat-3': { id: 'chat-3', title: 'Sales Inquiry' },
  })

  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <div className="multi-chat-dashboard">
        <div className="chat-sidebar">
          <h2>Chats</h2>
          {Object.values(chats).map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={activeChat === chat.id ? 'active' : ''}
            >
              {chat.title}
            </button>
          ))}
        </div>
        <div className="chat-main">
          {activeChat && <ChatInstance key={activeChat} chatId={activeChat} />}
        </div>
      </div>
    </MemoryProvider>
  )
}

function ChatInstance({ chatId }: { chatId: string }) {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
    },
  })

  const handlers = useChatHandlers({ chat })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
      showHeader
      sessionTitle={`Chat ${chatId}`}
    />
  )
}

// ============================================================================
// Example 4: Custom Streaming Implementation (90 lines)
// ============================================================================

/**
 * Custom streaming implementation using low-level primitives
 * Shows how to build custom streaming logic
 */
export function CustomStreamingChat() {
  const [messages, setMessages] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    content: streamContent,
    startStreaming,
    reset,
  } = useStreaming({
    onChunk: (chunk) => {
      // Update UI incrementally
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (last && last.role === 'assistant') {
          return [...prev.slice(0, -1), { ...last, content: streamContent }]
        }
        return prev
      })
    },
    onComplete: (fullContent) => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fullContent },
      ])
      setIsLoading(false)
      reset()
    },
    onError: (error) => {
      logger.error('Streaming error:', error)
      setIsLoading(false)
    },
  })

  const handleSend = React.useCallback(
    async (content: string) => {
      setIsLoading(true)
      setMessages((prev) => [...prev, { role: 'user', content }])

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content }),
        })

        if (!response.body) {
          throw new Error('No response body')
        }

        await startStreaming(response.body)
      } catch (error) {
        logger.error('Streaming error:', error)
        setIsLoading(false)
      }
    },
    [startStreaming]
  )

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSend}
    />
  )
}
