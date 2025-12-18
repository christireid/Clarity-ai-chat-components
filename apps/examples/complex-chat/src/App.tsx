/**
 * Complex Chat Example - Enterprise-Grade Usage
 * 
 * This example demonstrates advanced usage of Clarity Chat with:
 * - Custom layout with sidebar
 * - Memory integration
 * - Message operations (edit, regenerate, delete)
 * - Error handling
 * - Custom styling
 * - Analytics integration
 * 
 * This shows how to build a production-ready chat application
 * with enterprise features while maintaining simplicity.
 */

import * as React from 'react'
import {
  ClarityChat,
  ChatLayout,
  useMemoryStore,
  MemoryProvider,
  AnalyticsProvider,
  createGoogleAnalyticsProvider,
} from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

// Sidebar component showing memory context
function MemorySidebar() {
  const memory = useMemoryStore({ enabled: true })
  const [memories, setMemories] = React.useState<any[]>([])

  React.useEffect(() => {
    // Query recent memories
    memory.query('recent conversations').then(setMemories)
  }, [memory])

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm">Memory Context</h3>
      <div className="space-y-2">
        {memories.length === 0 ? (
          <p className="text-xs text-muted-foreground">No memories yet</p>
        ) : (
          memories.slice(0, 5).map((mem, i) => (
            <div key={i} className="text-xs p-2 bg-muted rounded">
              {mem.content}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Header component
function ChatHeader() {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div>
        <h1 className="font-semibold">Enterprise Chat</h1>
        <p className="text-sm text-muted-foreground">AI Assistant with Memory</p>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded">
          Settings
        </button>
      </div>
    </div>
  )
}

// Footer component
function ChatFooter() {
  return (
    <div className="p-2 border-t text-xs text-muted-foreground text-center">
      Powered by Clarity Chat
    </div>
  )
}

// Main app component
export default function App() {
  // Setup analytics provider (optional - can use empty array for no tracking)
  const gaProvider = React.useMemo(
    () => createGoogleAnalyticsProvider('G-XXXXXXXXXX'),
    []
  )

  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers: [gaProvider], // Add analytics providers here
        autoTrack: {
          pageViews: true,
          errors: true,
        },
      }}
    >
      <MemoryProvider>
        <div className="h-screen flex flex-col">
          <ChatLayout
            header={<ChatHeader />}
            sidebar={<MemorySidebar />}
            footer={<ChatFooter />}
            variant="split"
          >
            <ClarityChat
              api="/api/chat"
              theme="dark"
              enableMemory
              memoryStrategy="vector-store"
              showTokenCounter
              showNetworkStatus
              enableMessageOperations
              sessionTitle="Enterprise Chat"
              sessionSubtitle="AI Assistant with Memory & Analytics"
              onMessageSent={(msg) => {
                console.log('[Analytics] Message sent:', msg.id)
              }}
              onMessageReceived={(msg) => {
                console.log('[Analytics] Message received:', msg.id)
              }}
              onError={(error) => {
                console.error('[Error] Chat error:', error)
                // Analytics would track this automatically
              }}
            />
          </ChatLayout>
        </div>
      </MemoryProvider>
    </AnalyticsProvider>
  )
}
