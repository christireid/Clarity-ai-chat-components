/**
 * Happy Path Workflows - Real-World Usage Examples
 * 
 * These examples demonstrate the primary workflows that real users
 * of this library care about, using the layered architecture.
 */

import * as React from 'react'
import '@clarity-chat/react/styles.css'

// ============================================================================
// WORKFLOW 1: Simple Chat UI (3 lines)
// ============================================================================

/**
 * Goal: Add a production-ready chat interface in 3 lines
 * APIs Used: ClarityChat (Top-level)
 * Lines of Code: 3
 * Why Enterprise-Grade: Includes error handling, loading states, accessibility,
 * responsive design, streaming support, and more out of the box.
 */
export function SimpleChatWorkflow() {
  return <ClarityChat api="/api/chat" />
}

// ============================================================================
// WORKFLOW 2: Chat with Memory (5-10 lines)
// ============================================================================

/**
 * Goal: Add context-aware chat with memory management
 * APIs Used: ClarityChatPresets.WithMemory (Top-level)
 * Lines of Code: 5-10
 * Why Enterprise-Grade: Includes memory management, context window optimization,
 * semantic search, and vector store integration.
 */
export function ChatWithMemoryWorkflow() {
  return (
    <ClarityChatPresets.WithMemory 
      api="/api/chat"
      memoryStrategy="vector-store"
    />
  )
}

// Alternative: Using hook + provider for more control
export function ChatWithMemoryWorkflowAdvanced() {
  const { MemoryProvider } = require('@clarity-chat/react')
  const { ClarityChat } = require('@clarity-chat/react')
  
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ClarityChat 
        api="/api/chat"
        memory={{
          enabled: true,
          strategy: 'vector-store',
          maxTokens: 10000,
        }}
      />
    </MemoryProvider>
  )
}

// ============================================================================
// WORKFLOW 3: Custom Chat with Tools (20-30 lines)
// ============================================================================

/**
 * Goal: Build a custom chat interface with tool calling
 * APIs Used: useClarityChat (Top-level), useChatHandlers (Mid-level),
 * ChatWindow (Mid-level), useClarityChatWithTools (Mid-level)
 * Lines of Code: 20-30
 * Why Enterprise-Grade: Full control over UI, tool integration, error handling,
 * and extensibility while maintaining type safety.
 */
export function CustomChatWithToolsWorkflow() {
  const { useClarityChat, useChatHandlers, ChatWindow, useClarityChatWithTools } = require('@clarity-chat/react')
  
  // Define tools
  const searchTool = {
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
      const response = await fetch(`/api/search?q=${encodeURIComponent(args.query)}`)
      return await response.json()
    },
  }

  const calculatorTool = {
    name: 'calculator',
    description: 'Perform mathematical calculations',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'Mathematical expression' },
      },
      required: ['expression'],
    },
    execute: async (args: { expression: string }) => {
      // In production, this would be a safe math evaluator
      return { result: eval(args.expression) }
    },
  }

  // Top-level hook for chat state
  const chat = useClarityChat({
    api: '/api/chat',
  })

  // Mid-level hook for handlers
  const handlers = useChatHandlers({
    chat,
    onMessageSent: (content) => {
      console.log('Message sent:', content)
    },
    onMessageError: (error) => {
      console.error('Failed to send message:', error)
    },
  })

  // Mid-level hook for tool integration
  const tools = useClarityChatWithTools({
    tools: [searchTool, calculatorTool],
  })

  // Mid-level component for UI
  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
      onClear={handlers.onClear}
      onMessageRetry={handlers.onRetry}
    />
  )
}

// ============================================================================
// WORKFLOW 4: Enterprise Application (15-25 lines)
// ============================================================================

/**
 * Goal: Full-featured enterprise chat with analytics, quotas, and RBAC
 * APIs Used: ClarityChatPresets.Enterprise (Top-level), AnalyticsProvider,
 * QuotaProvider, RBACProvider (Top-level)
 * Lines of Code: 15-25
 * Why Enterprise-Grade: Complete observability, usage tracking, access control,
 * and audit logging built-in.
 */
export function EnterpriseApplicationWorkflow() {
  const {
    ClarityChatPresets,
    AnalyticsProvider,
    QuotaProvider,
    RBACProvider,
  } = require('@clarity-chat/react')

  const analyticsConfig = {
    provider: 'console', // or 'google-analytics', 'mixpanel', etc.
    enabled: true,
  }

  const quotaConfig = {
    limits: {
      messagesPerDay: 1000,
      tokensPerMonth: 1000000,
    },
  }

  const rbacConfig = {
    roles: ['user', 'admin'],
    permissions: {
      user: ['chat:send', 'chat:view'],
      admin: ['chat:*', 'admin:*'],
    },
  }

  return (
    <AnalyticsProvider config={analyticsConfig}>
      <QuotaProvider config={quotaConfig}>
        <RBACProvider config={rbacConfig}>
          <ClarityChatPresets.Enterprise 
            api="/api/chat"
            sessionTitle="Enterprise Assistant"
            showHeader
          />
        </RBACProvider>
      </QuotaProvider>
    </AnalyticsProvider>
  )
}

// ============================================================================
// WORKFLOW 5: Structured Output (10-15 lines)
// ============================================================================

/**
 * Goal: Generate type-safe structured data from chat
 * APIs Used: useClarityObject<T> (Top-level)
 * Lines of Code: 10-15
 * Why Enterprise-Grade: Type-safe object generation with validation,
 * error handling, and streaming support.
 */
interface UserProfile {
  name: string
  email: string
  age: number
  interests: string[]
}

export function StructuredOutputWorkflow() {
  const { useClarityObject } = require('@clarity-chat/react')
  
  const { data, isLoading, error, generate } = useClarityObject<UserProfile>({
    api: '/api/chat',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        age: { type: 'number' },
        interests: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['name', 'email', 'age'],
    },
  })

  const handleGenerate = async () => {
    await generate({
      prompt: 'Create a user profile for a software engineer interested in AI',
    })
  }

  return (
    <div>
      <button onClick={handleGenerate} disabled={isLoading}>
        Generate Profile
      </button>
      {isLoading && <p>Generating...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <h3>{data.name}</h3>
          <p>{data.email}</p>
          <p>Age: {data.age}</p>
          <p>Interests: {data.interests.join(', ')}</p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// WORKFLOW 6: Custom Composition (30-50 lines)
// ============================================================================

/**
 * Goal: Build a completely custom chat experience using mid-level APIs
 * APIs Used: useChatEnhanced (Mid-level), ChatWindow (Mid-level),
 * useMemoryContext (Mid-level), various low-level utilities
 * Lines of Code: 30-50
 * Why Enterprise-Grade: Full control while leveraging battle-tested components
 * and hooks, maintaining type safety and best practices.
 */
export function CustomCompositionWorkflow() {
  const {
    useChatEnhanced,
    ChatWindow,
    useMemoryContext,
    createUserMessage,
    normalizeMessages,
  } = require('@clarity-chat/react')

  // Mid-level hook for chat state (Vercel-compatible)
  const chat = useChatEnhanced({
    api: '/api/chat',
    initialMessages: [
      createUserMessage('Hello!'),
    ],
  })

  // Mid-level hook for memory
  const memory = useMemoryContext()

  // Custom logic using low-level utilities
  const normalizedMessages = React.useMemo(
    () => normalizeMessages(chat.messages),
    [chat.messages]
  )

  const handleSend = async (content: string) => {
    // Add to memory before sending
    if (memory?.addMemory) {
      await memory.addMemory(
        content,
        'conversation',
        'session',
        { timestamp: Date.now() }
      )
    }

    // Send message
    await chat.append(createUserMessage(content))
  }

  return (
    <div className="custom-chat-container">
      <ChatWindow
        messages={normalizedMessages}
        isLoading={chat.isLoading}
        onSendMessage={handleSend}
        showHeader
        sessionTitle="Custom Chat"
      />
      {memory && (
        <div className="memory-info">
          <p>Memory: {memory.stats?.totalItems || 0} items</p>
        </div>
      )}
    </div>
  )
}

// Component imports (used as values)
import { ClarityChat } from '../components/clarity-chat'
import { ClarityChatPresets } from '../components/clarity-chat-presets'
