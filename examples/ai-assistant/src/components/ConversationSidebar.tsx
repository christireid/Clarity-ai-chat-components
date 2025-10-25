import { useAppStore } from '@/lib/store'

export function ConversationSidebar() {
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversation, 
    deleteConversation,
    addConversation,
  } = useAppStore()

  const handleNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [
        {
          id: '1',
          role: 'assistant' as const,
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    addConversation(newConversation)
  }

  return (
    <div style={{
      width: '280px',
      borderRight: '1px solid rgba(128, 128, 128, 0.2)',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <button
        onClick={handleNewConversation}
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        <span>+</span> New Chat
      </button>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {conversations.length === 0 ? (
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(128, 128, 128, 0.7)',
            textAlign: 'center',
            marginTop: '2rem',
          }}>
            No conversations yet
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                backgroundColor: conv.id === currentConversationId
                  ? 'rgba(37, 99, 235, 0.1)'
                  : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onClick={() => setCurrentConversation(conv.id)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {conv.title}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(128, 128, 128, 0.7)',
                  marginTop: '0.25rem',
                }}>
                  {conv.messages.length} messages
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Delete this conversation?')) {
                    deleteConversation(conv.id)
                  }
                }}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.125rem',
                  color: 'rgba(255, 0, 0, 0.6)',
                }}
                title="Delete conversation"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
