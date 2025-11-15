/**
 * Happy Path Workflows
 * 
 * These examples demonstrate the primary workflows that real users care about.
 * Each workflow uses primarily top-level + mid-level APIs with minimal boilerplate.
 */

import {
  // Top-level APIs
  ClarityChat,
  ChatWithMemory,
  ChatComplete,
  useChat,
  useMemory,
  createAgent,
  useAnalytics,
  // Mid-level APIs
  ChatWindow,
  useClarityChat,
  MemoryProvider,
  AnalyticsProvider,
  createGoogleAnalyticsProvider,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

// ============================================================================
// WORKFLOW 1: Spin Up a Full Chat UI with Memory
// ============================================================================

/**
 * Goal: Get a production-ready chat interface with memory in minimal code
 * Primary APIs: ClarityChat (top-level), ChatWithMemory (top-level)
 * Lines of code: 1-3
 * Why enterprise-grade: Memory enables context retention, better UX
 */
export function Workflow1_ChatWithMemory() {
  // Option 1: Simplest (1 line)
  return <ChatWithMemory api="/api/chat" strategy="vector-store" />

  // Option 2: With customization (3 lines)
  // return (
  //   <ChatWithMemory
  //     api="/api/chat"
  //     strategy="vector-store"
  //     showHeader
  //     sessionTitle="AI Assistant"
  //   />
  // )
}

// ============================================================================
// WORKFLOW 2: Create an AI-Powered Dashboard View
// ============================================================================

/**
 * Goal: Build a custom dashboard with chat, analytics, and monitoring
 * Primary APIs: useChat (mid-level), useAnalytics (top-level), ChatWindow (mid-level)
 * Lines of code: ~15
 * Why enterprise-grade: Composable, observable, production-ready
 */
export function Workflow2_AIPoweredDashboard() {
  const chat = useChat({ api: '/api/chat' })
  const { track } = useAnalytics()

  const handleSend = async (content: string) => {
    track('message_sent', { content })
    await chat.sendMessage(content)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1rem', height: '100vh' }}>
      {/* Main Chat Area */}
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handleSend}
        showHeader
        sessionTitle="AI Dashboard"
      />

      {/* Sidebar with Analytics */}
      <div style={{ border: '1px solid #e5e7eb', padding: '1rem' }}>
        <h3>Analytics</h3>
        <p>Messages: {chat.messages.length}</p>
        <p>Status: {chat.isLoading ? 'Loading...' : 'Ready'}</p>
      </div>
    </div>
  )
}

// ============================================================================
// WORKFLOW 3: Wire Memory Store + Chat Together
// ============================================================================

/**
 * Goal: Set up memory system with chat for long-term context
 * Primary APIs: MemoryProvider (top-level), useClarityChat (mid-level), ChatWindow (mid-level)
 * Lines of code: ~20
 * Why enterprise-grade: Proper separation of concerns, composable, testable
 */
export function Workflow3_MemoryAndChat() {
  return (
    <MemoryProvider
      config={{
        strategy: 'vector-store',
        vectorStore: {
          type: 'qdrant',
          url: process.env.VECTOR_STORE_URL || '',
          apiKey: process.env.VECTOR_STORE_API_KEY || '',
        },
      }}
    >
      <MemoryChatApp />
    </MemoryProvider>
  )
}

function MemoryChatApp() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
    },
  })

  const messages = chat.messages.map((msg) => ({
    id: msg.id || '',
    chatId: 'default',
    role: msg.role,
    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
    status: 'sent' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  return (
    <ChatWindow
      messages={messages}
      isLoading={chat.isLoading}
      onSendMessage={async (content) => {
        await chat.append({ role: 'user', content })
      }}
      showHeader
      sessionTitle="Memory-Enabled Chat"
    />
  )
}

// ============================================================================
// WORKFLOW 4: Enterprise Chat with Analytics, Memory, and Error Handling
// ============================================================================

/**
 * Goal: Production-ready chat with all enterprise features
 * Primary APIs: ChatComplete (top-level), AnalyticsProvider (top-level)
 * Lines of code: ~10
 * Why enterprise-grade: Everything enabled, error handling, observability
 */
export function Workflow4_EnterpriseChat() {
  const gaProvider = createGoogleAnalyticsProvider('G-XXXXXXXXXX')

  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers: [gaProvider],
        autoTrackPageViews: true,
        autoTrackErrors: true,
      }}
    >
      <ChatComplete
        api="/api/chat"
        memoryStrategy="vector-store"
        storageKey="enterprise-chat"
        onMessageSent={(content) => {
          console.log('Message sent:', content)
        }}
        onMessageReceived={(id) => {
          console.log('Message received:', id)
        }}
        onError={(error) => {
          console.error('Chat error:', error)
        }}
      />
    </AnalyticsProvider>
  )
}

// ============================================================================
// WORKFLOW 5: Custom Chat Flow with Agent Integration
// ============================================================================

/**
 * Goal: Build a custom chat that uses AI agents for complex tasks
 * Primary APIs: createAgent (top-level), useChat (mid-level), ChatWindow (mid-level)
 * Lines of code: ~25
 * Why enterprise-grade: Agent orchestration, tool calling, composable
 */
export function Workflow5_AgentChat() {
  const chat = useChat({ api: '/api/chat' })

  // Create an agent with tools
  const agent = createAgent({
    name: 'AssistantAgent',
    description: 'Helpful assistant with tool access',
    tools: [
      // Add your tools here
    ],
    maxIterations: 10,
  })

  const handleSend = async (content: string) => {
    await chat.sendMessage(content)

    // Use agent for complex queries
    if (content.includes('research') || content.includes('calculate')) {
      const result = await agent.execute(content)
      await chat.sendMessage(result.answer)
    }
  }

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handleSend}
      showHeader
      sessionTitle="Agent-Powered Chat"
    />
  )
}

// ============================================================================
// WORKFLOW SUMMARY
// ============================================================================

/**
 * Workflow Summary:
 * 
 * 1. Chat with Memory (1-3 lines)
 *    - Use: ChatWithMemory
 *    - Enterprise-grade: Context retention, better UX
 * 
 * 2. AI-Powered Dashboard (~15 lines)
 *    - Use: useChat + ChatWindow + useAnalytics
 *    - Enterprise-grade: Composable, observable
 * 
 * 3. Memory + Chat Integration (~20 lines)
 *    - Use: MemoryProvider + useClarityChat + ChatWindow
 *    - Enterprise-grade: Proper separation, testable
 * 
 * 4. Enterprise Chat (~10 lines)
 *    - Use: ChatComplete + AnalyticsProvider
 *    - Enterprise-grade: Everything enabled, production-ready
 * 
 * 5. Agent Chat (~25 lines)
 *    - Use: createAgent + useChat + ChatWindow
 *    - Enterprise-grade: Agent orchestration, tool calling
 */
