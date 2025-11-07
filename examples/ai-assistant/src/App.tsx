import { useCallback, useEffect, useMemo } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ChatWindow } from '@clarity-chat/react'
import { queryClient } from '@/lib/queryClient'
import { useAppStore } from '@/lib/store'
import { useChat } from '@/hooks/useChat'
import { ConversationSidebar } from '@/components/ConversationSidebar'

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
        role: 'assistant' as const,
        content: 'Hello! I\'m your AI assistant powered by TanStack Query. How can I help you today?',
        timestamp: Date.now(),
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

  // Wrapped in useCallback to prevent ChatWindow re-renders
  const handleSendMessage = useCallback((content: string) => {
    sendMessage(content)
  }, [sendMessage])

  return (
    <div className="flex h-screen">
      <ConversationSidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="p-4 sm:p-8 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-1">
            AI Assistant Demo
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by TanStack Query with optimistic updates and caching
          </p>
        </div>

        <div className="flex-1 min-h-0">
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
    <QueryClientProvider client={queryClient}>
      <ChatApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
