# AI Assistant Demo

Advanced chat application showcasing TanStack Query integration, optimistic updates, conversation management, and state persistence.

## Features

✅ **TanStack Query** - Optimistic updates, caching, and query invalidation  
✅ **State Management** - Zustand with persistence middleware  
✅ **Multiple Conversations** - Create, switch, and delete conversations  
✅ **Auto-Scroll** - Messages automatically scroll into view  
✅ **Token Tracking** - Real-time token usage monitoring  
✅ **Network Status** - Connection indicator  
✅ **Error Boundary** - Graceful error handling  
✅ **Persisted State** - Conversations saved to localStorage  
✅ **TypeScript** - Zero type errors, fully typed  
✅ **React Query Devtools** - Debug queries and mutations  

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Architecture

### Tech Stack
- **React** - UI framework
- **TypeScript** - Type safety
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Vite** - Build tool
- **Clarity Chat Components** - UI components and hooks

### File Structure

```
ai-assistant/
├── src/
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Entry point
│   ├── api/
│   │   └── chat.ts                  # API client (simulated)
│   ├── components/
│   │   └── ConversationSidebar.tsx  # Conversation list
│   ├── hooks/
│   │   └── useChat.ts               # Chat mutation hook
│   └── lib/
│       ├── queryClient.ts           # TanStack Query config
│       └── store.ts                 # Zustand store
├── package.json
└── README.md
```

## Key Concepts

### 1. TanStack Query Integration

Uses `useMutation` for sending messages with optimistic updates:

```typescript
const sendMessage = useMutation({
  mutationFn: async (content: string) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: conversation.id,
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    // Optimistically update UI
    updateConversation(conversation.id, [...conversation.messages, userMessage])
    
    // Send to API
    const response = await sendChatMessage(messages)
    
    return { userMessage, aiMessage: response.message }
  },
  onSuccess: ({ aiMessage, conversationId }) => {
    // Update with real response
    updateConversation(conversationId, [...conversation.messages, aiMessage])
    
    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
  }
})
```

### 2. State Management with Zustand

Persisted conversation state:

```typescript
interface AppState {
  conversations: Conversation[]
  currentConversationId: string | null
  addConversation: (conversation: Conversation) => void
  updateConversation: (id: string, messages: Message[]) => void
  deleteConversation: (id: string) => void
  setCurrentConversation: (id: string) => void
  getCurrentConversation: () => Conversation | null
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      // ... implementation
    }),
    {
      name: 'ai-assistant-storage', // localStorage key
    }
  )
)
```

### 3. Optimistic Updates

Messages appear instantly in UI, then sync with server:

1. User sends message
2. Message immediately added to UI (optimistic)
3. API call happens in background
4. AI response updates UI
5. Query cache invalidated

### 4. Conversation Management

- Create new conversations
- Switch between conversations
- Delete conversations
- Persist all conversations to localStorage
- Each conversation has its own message history

### 5. Auto-Scroll Behavior

Uses `useAutoScroll` hook to automatically scroll to new messages:

```typescript
const { scrollRef } = useAutoScroll({
  dependencies: [conversation?.messages || []],
})

<div ref={scrollRef as any} className="flex-1 overflow-auto">
  <ChatWindow messages={messages} />
</div>
```

### 6. Token Tracking

Monitors token usage across all conversations:

```typescript
const { tokens: totalTokens } = useTokenTracker({
  modelName: 'gpt-3.5-turbo'
})

<TokenCounter 
  currentTokens={totalTokens}
  maxTokens={16000}
  size="sm"
/>
```

## Component Breakdown

### App.tsx
Main application with:
- Query client provider
- Error boundary
- Layout with sidebar and chat
- Auto-scroll and token tracking
- React Query Devtools

### ConversationSidebar.tsx
Sidebar component with:
- New conversation button
- List of conversations
- Active conversation highlighting
- Delete conversation buttons
- Empty state

### useChat.ts Hook
Custom hook that:
- Wraps TanStack Query mutation
- Handles optimistic updates
- Updates Zustand store
- Manages error states
- Returns mutation state

### store.ts (Zustand)
Global state management:
- Conversation list
- Current conversation ID
- CRUD operations
- Persistence to localStorage

### chat.ts API
Simulated API client (replace with real API):
- `sendChatMessage()` - Send message and get response
- `streamChatMessage()` - Streaming response generator
- Keyword-based responses for demo

## Usage Patterns

### Creating a New Conversation

```typescript
const handleNewConversation = () => {
  const conversationId = Date.now().toString()
  const newConversation = {
    id: conversationId,
    title: 'New Conversation',
    messages: [{
      id: '1',
      chatId: conversationId,
      role: 'assistant',
      content: 'Hello! How can I help?',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  addConversation(newConversation)
}
```

### Sending a Message

```typescript
const handleSendMessage = (content: string) => {
  sendMessage(content) // Mutation from useChat hook
}
```

### Switching Conversations

```typescript
<div onClick={() => setCurrentConversation(conv.id)}>
  {conv.title}
</div>
```

## Customization

### Replace Simulated API

Update `src/api/chat.ts` with your actual API:

```typescript
export async function sendChatMessage(
  messages: Message[],
  signal?: AbortSignal
): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })
  
  if (!response.ok) {
    throw new Error('Failed to send message')
  }
  
  return response.json()
}
```

### Add Streaming Support

Implement real streaming in `streamChatMessage()`:

```typescript
export async function* streamChatMessage(
  messages: Message[],
  signal?: AbortSignal
): AsyncGenerator<StreamChunk> {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })
  
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  
  while (true) {
    const { done, value } = await reader!.read()
    if (done) break
    
    const chunk = decoder.decode(value)
    yield { content: chunk, done: false }
  }
  
  yield { content: '', done: true }
}
```

### Customize Query Client

Modify `src/lib/queryClient.ts`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

### Add Authentication

Wrap with auth provider:

```typescript
import { AuthProvider } from '@/lib/auth'

<AuthProvider>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
</AuthProvider>
```

## Best Practices Demonstrated

1. **Optimistic Updates** - Instant UI feedback
2. **Error Recovery** - Graceful degradation
3. **State Persistence** - Don't lose data on refresh
4. **Type Safety** - Full TypeScript coverage
5. **Query Invalidation** - Keep data fresh
6. **Memoization** - Prevent unnecessary re-renders
7. **Clean Architecture** - Separation of concerns
8. **User Feedback** - Loading states, network status

## Advanced Features

### Conversation Persistence
All conversations automatically saved to localStorage and restored on page load.

### Optimistic UI
Messages appear instantly even before server confirms, providing snappy UX.

### Query Devtools
Press React Query Devtools toggle to inspect:
- Active queries
- Mutation state
- Cache contents
- Query lifecycle

### Error Handling
Errors caught by:
- Mutation error handlers
- Error boundary (app-level)
- User-friendly error messages

## Troubleshooting

### Conversations not persisting
Check browser localStorage quota - clear old data if needed.

### Type errors on Message
Ensure all required fields present:
```typescript
{
  id: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  updatedAt: Date
  status: 'sending' | 'sent' | 'error'
}
```

### Optimistic updates not working
Verify mutation `onSuccess` handler updates Zustand store correctly.

### Auto-scroll not working
Ensure scrollRef attached to scrollable container with `overflow-auto`.

## Next Steps

To learn more:
- Try [Streaming Chat](../streaming-chat) for real-time streaming
- Check [Enterprise Knowledge Hub](../enterprise-knowledge-hub) for RAG
- Explore [Complete Features Demo](../complete-features-demo) for all features

## License

MIT - see repository root for details
