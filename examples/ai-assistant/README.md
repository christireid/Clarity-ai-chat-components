# AI Assistant Demo

Advanced AI assistant with TanStack Query, persistent conversations, and optimistic updates.

## Features

- ✅ **TanStack Query integration**: Powerful async state management
- ✅ **Persistent conversations**: LocalStorage persistence with Zustand
- ✅ **Multiple conversations**: Create and switch between chats
- ✅ **Optimistic updates**: Instant UI feedback before server response
- ✅ **Automatic caching**: Smart cache invalidation and refetching
- ✅ **Request cancellation**: Cancel in-flight requests
- ✅ **React Query DevTools**: Debug queries and mutations
- ✅ **Type-safe**: Full TypeScript support

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   ```
   http://localhost:5173
   ```

## Architecture

### State Management

```
┌─────────────────────────────────────────┐
│ Zustand (Persisted LocalStorage)        │
│ - Conversations                          │
│ - Current conversation ID                │
└─────────────────────────────────────────┘
           ↕
┌─────────────────────────────────────────┐
│ TanStack Query                           │
│ - API calls                              │
│ - Caching                                │
│ - Optimistic updates                     │
└─────────────────────────────────────────┘
           ↕
┌─────────────────────────────────────────┐
│ API Layer (src/api/chat.ts)            │
│ - sendChatMessage()                      │
│ - streamChatMessage()                    │
└─────────────────────────────────────────┘
```

### Data Flow

1. **User sends message** → Zustand adds message optimistically
2. **Mutation triggers** → TanStack Query calls API
3. **API responds** → Zustand updates with AI response
4. **Cache invalidates** → UI refreshes automatically

## Key Components

### TanStack Query Setup

```typescript
// src/lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
      retry: 1,
    },
  },
})
```

### Custom Hook with Optimistic Updates

```typescript
// src/hooks/useChat.ts
export function useChat() {
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      // Optimistically update UI
      updateConversation(conversationId, [...messages, userMessage])
      
      // Call API
      const response = await sendChatMessage(messages)
      
      return { userMessage, aiMessage: response.message }
    },
    onSuccess: ({ aiMessage }) => {
      // Update with real response
      updateConversation(conversationId, [...messages, aiMessage])
    },
  })
  
  return { sendMessage: sendMessage.mutate, isLoading: sendMessage.isPending }
}
```

### Persistent Store with Zustand

```typescript
// src/lib/store.ts
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      addConversation: (conversation) => 
        set((state) => ({ 
          conversations: [conversation, ...state.conversations] 
        })),
    }),
    { name: 'ai-assistant-storage' }
  )
)
```

## TanStack Query Features

### 1. Automatic Caching

```typescript
// Queries are cached automatically
const { data } = useQuery({
  queryKey: ['conversation', id],
  queryFn: () => fetchConversation(id),
  staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
})
```

### 2. Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateMessage,
  onMutate: async (newMessage) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: ['messages'] })
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['messages'])
    
    // Optimistically update
    queryClient.setQueryData(['messages'], (old) => [...old, newMessage])
    
    return { previous }
  },
  onError: (err, newMessage, context) => {
    // Rollback on error
    queryClient.setQueryData(['messages'], context.previous)
  },
})
```

### 3. Request Cancellation

```typescript
const query = useQuery({
  queryKey: ['messages'],
  queryFn: async ({ signal }) => {
    const response = await fetch('/api/messages', { signal })
    return response.json()
  },
})

// Cancel manually
queryClient.cancelQueries({ queryKey: ['messages'] })
```

### 4. Parallel Queries

```typescript
const queries = useQueries({
  queries: [
    { queryKey: ['conversation', '1'], queryFn: () => fetchConversation('1') },
    { queryKey: ['conversation', '2'], queryFn: () => fetchConversation('2') },
  ],
})
```

### 5. Infinite Queries

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
} = useInfiniteQuery({
  queryKey: ['messages'],
  queryFn: ({ pageParam = 0 }) => fetchMessages(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})
```

## Production Enhancements

### 1. Real API Integration

```typescript
// Replace simulated API with real endpoints
export async function sendChatMessage(messages: Message[]): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to send message')
  }
  
  return response.json()
}
```

### 2. Error Boundaries

```typescript
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onReset={() => queryClient.resetQueries()}
>
  <ChatApp />
</ErrorBoundary>
```

### 3. Retry Logic

```typescript
const query = useQuery({
  queryKey: ['messages'],
  queryFn: fetchMessages,
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors
    if (error.status >= 400 && error.status < 500) {
      return false
    }
    return failureCount < 3
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
})
```

### 4. Prefetching

```typescript
// Prefetch next conversation
const prefetchConversation = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ['conversation', id],
    queryFn: () => fetchConversation(id),
  })
}

// Use in hover or route changes
<div onMouseEnter={() => prefetchConversation(conv.id)}>
```

### 5. Pagination

```typescript
const [page, setPage] = useState(0)

const { data } = useQuery({
  queryKey: ['messages', page],
  queryFn: () => fetchMessages(page),
  keepPreviousData: true, // Keep old data while fetching new
})
```

## Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

```bash
vercel
```

### Deploy to Netlify

```bash
netlify deploy --prod
```

## Project Structure

```
ai-assistant/
├── src/
│   ├── api/
│   │   └── chat.ts            # API functions
│   ├── components/
│   │   └── ConversationSidebar.tsx
│   ├── hooks/
│   │   └── useChat.ts         # Custom TanStack Query hook
│   ├── lib/
│   │   ├── queryClient.ts     # TanStack Query config
│   │   └── store.ts           # Zustand store
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── index.html                 # HTML entry point
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

## Learn More

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Vite Documentation](https://vitejs.dev/)

## License

MIT
