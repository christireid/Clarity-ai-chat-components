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

  // Create initial conversation if none exists
  if (!conversation) {
    const initialConversation = {
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
    }
    addConversation(initialConversation)
  }

  const handleSendMessage = (content: string) => {
    sendMessage(content)
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
    }}>
      <ConversationSidebar />
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.25rem',
          }}>
            AI Assistant Demo
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(128, 128, 128, 0.7)',
          }}>
            Powered by TanStack Query with optimistic updates and caching
          </p>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
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
