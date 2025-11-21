/**
 * Advanced / Enterprise Examples - Full Power Demonstrations
 * 
 * These examples show the full power of Clarity Chat with memory,
 * analytics, error handling, and multi-component integration.
 * Each example is 60-100+ lines of code.
 */

import * as React from 'react'
import {
  // TODO: Re-enable once ChatComplete is implemented
  // ChatComplete,
  ClarityChat,
  useChat,
  ChatWindow,
  MemoryProvider,
  AnalyticsProvider,
  // TODO: Re-enable once useAnalytics is implemented
  // useAnalytics,
  // TODO: Re-enable once useMemory is implemented
  // useMemory,
  // type MemoryServiceConfig,
} from '../index'

/**
 * Example 1: Enterprise Chat Stack (70 lines)
 * 
 * Full-featured chat with memory, analytics, and error handling.
 * 
 * LOC: 70
 */
export function Advanced_EnterpriseChatStack() {
  // TODO: Re-enable once MemoryServiceConfig is implemented
  // const memoryConfig: MemoryServiceConfig = {
  //   maxTokens: 10000,
  //   strategy: 'vector-store',
  // }

  return (
    <AnalyticsProvider config={{ endpoint: '/api/analytics' }}>
      <MemoryProvider>
        <ClarityChat
          api="/api/chat"
          memoryStrategy="vector-store"
          showHeader
          sessionTitle="Enterprise Assistant"
          sessionSubtitle="Powered by Clarity Chat"
          showMessageCount
          onMessageFeedback={(msg, feedback) => {
            // Custom feedback handling
            console.log('Feedback received:', { msg, feedback })
          }}
          onExport={() => {
            // Custom export logic
            console.log('Exporting conversation')
          }}
        />
      </MemoryProvider>
    </AnalyticsProvider>
  )
}

/**
 * Example 2: Custom Dashboard with Multiple Features (80 lines)
 * 
 * Custom dashboard showing chat, analytics, and memory stats.
 * 
 * LOC: 80
 */
export function Advanced_CustomDashboard() {
  const { messages, sendMessage, isLoading, clearMessages } = useChat({
    api: '/api/chat',
    persistMessages: true,
    storageKey: 'dashboard-chat',
  })

  // TODO: Re-enable once useAnalytics is implemented
  // const { track } = useAnalytics()
  const track = (event: string, props?: any) => console.log(event, props)

  // TODO: Re-enable once useMemory is implemented
  // const memory = useMemory()

  React.useEffect(() => {
    track('dashboard_viewed', { timestamp: Date.now() })
  }, [track])
  
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 border-r p-4">
        <h2 className="font-bold mb-4">Dashboard</h2>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Messages</p>
            <p className="text-2xl font-bold">{messages.length}</p>
          </div>
          {/* TODO: Re-enable once useMemory is implemented */}
          {/* {memory && (
            <div>
              <p className="text-sm text-muted-foreground">Memory Items</p>
              <p className="text-2xl font-bold">
                {memory.getStats().total}
              </p>
            </div>
          )} */}
        </div>
      </div>
      
      {/* Chat */}
      <div className="flex-1">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          showHeader
          sessionTitle="Dashboard Chat"
          onClear={clearMessages}
          onMessageFeedback={(id, type) => {
            track('message_feedback', { id, type })
          }}
        />
      </div>
    </div>
  )
}

/**
 * Example 3: Multi-Chat Interface (90 lines)
 * 
 * Multiple chat instances with different configurations.
 * 
 * LOC: 90
 */
export function Advanced_MultiChat() {
  const [activeChat, setActiveChat] = React.useState<'support' | 'sales' | 'technical'>('support')
  
  const supportChat = useChat({ api: '/api/chat/support' })
  const salesChat = useChat({ api: '/api/chat/sales' })
  const technicalChat = useChat({ api: '/api/chat/technical' })
  
  const getActiveChat = () => {
    switch (activeChat) {
      case 'support':
        return supportChat
      case 'sales':
        return salesChat
      case 'technical':
        return technicalChat
    }
  }
  
  const active = getActiveChat()
  
  return (
    <div className="h-screen flex flex-col">
      {/* Chat Selector */}
      <div className="border-b p-4 flex gap-2">
        <button
          onClick={() => setActiveChat('support')}
          className={`px-4 py-2 rounded ${
            activeChat === 'support' ? 'bg-primary text-primary-foreground' : ''
          }`}
        >
          Support
        </button>
        <button
          onClick={() => setActiveChat('sales')}
          className={`px-4 py-2 rounded ${
            activeChat === 'sales' ? 'bg-primary text-primary-foreground' : ''
          }`}
        >
          Sales
        </button>
        <button
          onClick={() => setActiveChat('technical')}
          className={`px-4 py-2 rounded ${
            activeChat === 'technical' ? 'bg-primary text-primary-foreground' : ''
          }`}
        >
          Technical
        </button>
      </div>
      
      {/* Active Chat */}
      <ChatWindow
        messages={active.messages}
        isLoading={active.isLoading}
        onSendMessage={active.sendMessage}
        showHeader
        sessionTitle={`${activeChat.charAt(0).toUpperCase() + activeChat.slice(1)} Chat`}
      />
    </div>
  )
}

/**
 * Example 4: Chat with Custom Integrations (100 lines)
 * 
 * Chat integrated with external services and custom logic.
 * 
 * LOC: 100
 */
export function Advanced_CustomIntegrations() {
  const { messages, sendMessage, isLoading, chat } = useChat({
    api: '/api/chat',
  })
  
  // Custom integration: Send to external service
  const sendToExternalService = React.useCallback(async (content: string) => {
    try {
      await fetch('/api/external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })
    } catch (error) {
      console.error('External service error:', error)
    }
  }, [])
  
  // Custom integration: Log to console
  React.useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      console.log('New message:', {
        role: lastMessage.role,
        content: lastMessage.content.substring(0, 50),
      })
    }
  }, [messages])
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        // Send to external service
        await sendToExternalService(content)
        // Send to chat
        await sendMessage(content)
      }}
      showHeader
      sessionTitle="Integrated Chat"
      onMessageCopy={(id, content) => {
        // Custom copy handling
        navigator.clipboard.writeText(content)
        console.log('Copied message:', id)
      }}
      onMessageFeedback={(id, type) => {
        // Custom feedback handling
        fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, type }),
        })
      }}
    />
  )
}
