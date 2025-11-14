import { useCallback, useEffect, useMemo } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { 
  ChatWindow, 
  useAutoScroll,
  useTokenTracker,
  ErrorBoundary,
  TokenCounter,
  NetworkStatus,
} from '@clarity-chat/react'
import { queryClient } from '@/lib/queryClient'
import { useAppStore } from '@/lib/store'
import { useChat } from '@/hooks/useChat'
import { ConversationSidebar } from '@/components/ConversationSidebar'
import type { Message } from '@clarity-chat/types'

function ChatApp() {
  const { getCurrentConversation, addConversation } = useAppStore()
  const { sendMessage, isLoading } = useChat()

  const conversation = getCurrentConversation()

  // Memoize initial conversation object to prevent recreation
  const initialConversation = useMemo(() => ({
    id: Date.now().toString(),
    title: 'New Conversation',
    messages: [
      {
        id: '1',
        chatId: Date.now().toString(),
        role: 'assistant' as const,
        content: 'Hello! I\'m your AI assistant powered by TanStack Query. How can I help you today?',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent' as const,
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }), [])

  // Create initial conversation if none exists - moved to useEffect
  useEffect(() => {
    if (!conversation) {
      addConversation(initialConversation)
    }
  }, [conversation, addConversation, initialConversation])

  // Auto-scroll
  const { scrollRef } = useAutoScroll({
    dependencies: [conversation?.messages || []],
  })

  // Token tracking
  const { tokens: totalTokens } = useTokenTracker({
    modelName: 'gpt-3.5-turbo'
  })

  // Wrapped in useCallback to prevent ChatWindow re-renders
  const handleSendMessage = useCallback((content: string) => {
    sendMessage(content)
  }, [sendMessage])

  return (
    <div className="flex h-screen">
      <ConversationSidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="p-4 sm:p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                AI Assistant Demo
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Powered by TanStack Query with optimistic updates and caching
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <TokenCounter 
                currentTokens={totalTokens}
                maxTokens={16000}
                size="sm"
              />
              <NetworkStatus />
            </div>
          </div>
        </div>

        <div ref={scrollRef as any} className="flex-1 min-h-0 overflow-auto">
          {conversation && (
            <ChatWindow
              messages={conversation.messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="flex items-center justify-center min-h-screen">
          <div className="p-8 max-w-md text-center">
            <h1 className="text-xl font-semibold text-red-600 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              {error.message}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <ChatApp />
        {/* @ts-expect-error - React Query Devtools has type incompatibility with React 18 types */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
