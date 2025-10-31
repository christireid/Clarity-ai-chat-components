import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conversation List - Clarity Chat',
  description: 'A full-featured sidebar component for managing and navigating between multiple AI conversations with search, filters, and bulk operations.',
}

# Conversation List

A complete conversation management sidebar with search, filtering, sorting, pinning, favorites, and multi-select capabilities for organizing multiple AI chat conversations.

## Overview

The Conversation List provides comprehensive conversation management:

- **Search** - Find conversations by title or content preview
- **Filtering** - Filter by pinned, favorites, or tags
- **Sorting** - Sort by date, title, or message count
- **Pin conversations** - Keep important conversations at the top
- **Favorite conversations** - Mark conversations for quick access
- **Multi-select** - Bulk operations on multiple conversations
- **Unread badges** - Track unread message counts
- **Empty states** - Helpful states when no conversations exist
- **Smooth animations** - Framer Motion transitions and hover effects

## Installation

The Conversation List component is included in the Clarity Chat React package:

```bash
npm install @clarity-chat/react
```

## Basic Usage

```tsx
import { ConversationList, Conversation } from '@clarity-chat/react'

function ChatSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Project Planning',
      preview: 'Let\'s discuss the Q4 roadmap...',
      timestamp: Date.now() - 3600000,
      messageCount: 24,
      unreadCount: 3,
      isPinned: true,
    },
    {
      id: '2',
      title: 'Code Review',
      preview: 'Can you help review this PR?',
      timestamp: Date.now() - 86400000,
      messageCount: 12,
    },
  ])

  const [activeId, setActiveId] = useState('1')

  return (
    <ConversationList
      conversations={conversations}
      activeId={activeId}
      onSelect={setActiveId}
      onCreate={() => createNewConversation()}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `conversations` | `Conversation[]` | **Required** | Array of conversation objects |
| `activeId` | `string` | `undefined` | Currently active conversation ID |
| `onSelect` | `(id: string) => void` | **Required** | Callback when conversation is selected |
| `onDelete` | `(id: string) => void` | `undefined` | Callback when conversation is deleted |
| `onTogglePin` | `(id: string) => void` | `undefined` | Callback when pin status changes |
| `onToggleFavorite` | `(id: string) => void` | `undefined` | Callback when favorite status changes |
| `onCreate` | `() => void` | `undefined` | Callback to create new conversation |
| `showSearch` | `boolean` | `true` | Show search bar |
| `showFilters` | `boolean` | `false` | Show filter buttons |
| `showSort` | `boolean` | `false` | Show sort dropdown |
| `multiSelect` | `boolean` | `false` | Enable multi-select mode |
| `selectedIds` | `string[]` | `[]` | Selected conversation IDs (multi-select) |
| `onSelectionChange` | `(ids: string[]) => void` | `undefined` | Callback when selection changes |
| `className` | `string` | `undefined` | Additional CSS classes |

## Type Definitions

### Conversation Interface

```typescript
interface Conversation {
  id: string
  title: string
  preview: string                // Last message preview
  timestamp: number              // Unix timestamp in milliseconds
  messageCount: number
  unreadCount?: number           // Number of unread messages
  tags?: string[]                // Conversation tags
  isPinned?: boolean             // Pinned to top
  isFavorite?: boolean           // Marked as favorite
}
```

### Sort Options

```typescript
type SortOption = 'recent' | 'oldest' | 'title' | 'messages'
```

## Features

### Search Conversations

Built-in search filters by title and preview text:

```tsx
<ConversationList
  conversations={conversations}
  activeId={activeId}
  onSelect={setActiveId}
  showSearch={true} // Default: true
/>
```

**Search behavior:**
- Case-insensitive matching
- Searches both title and preview text
- Real-time filtering as you type
- Clear visual feedback for no results

### Filtering

Filter conversations by pinned status, favorites, or tags:

```tsx
<ConversationList
  conversations={conversations}
  activeId={activeId}
  onSelect={setActiveId}
  showFilters={true}
  showSearch={true}
/>
```

**Available filters:**
- **Pinned**: Show only pinned conversations
- **Favorites**: Show only favorite conversations
- **Tags**: Filter by conversation tags (UI shows all unique tags)

### Sorting

Sort conversations by different criteria:

```tsx
<ConversationList
  conversations={conversations}
  activeId={activeId}
  onSelect={setActiveId}
  showSort={true}
/>
```

**Sort options:**
- **Most Recent** (default): Newest conversations first
- **Oldest**: Oldest conversations first
- **Title A-Z**: Alphabetical by title
- **Message Count**: Most messages first

**Note**: Pinned conversations always appear first, regardless of sort order.

### Pin Conversations

Pin important conversations to keep them at the top:

```tsx
function ManagedConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])

  const handleTogglePin = (id: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id
          ? { ...conv, isPinned: !conv.isPinned }
          : conv
      )
    )
  }

  return (
    <ConversationList
      conversations={conversations}
      activeId={activeId}
      onSelect={setActiveId}
      onTogglePin={handleTogglePin}
    />
  )
}
```

**Pin features:**
- Pinned conversations always appear first
- Visual indicator (📌 icon)
- Toggle animation on pin/unpin
- Persistent across sessions (when saved to backend)

### Favorite Conversations

Mark conversations as favorites for quick access:

```tsx
function FavoriteConversations() {
  const handleToggleFavorite = (id: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id
          ? { ...conv, isFavorite: !conv.isFavorite }
          : conv
      )
    )
  }

  return (
    <ConversationList
      conversations={conversations}
      activeId={activeId}
      onSelect={setActiveId}
      onToggleFavorite={handleToggleFavorite}
      showFilters={true} // Show favorite filter button
    />
  )
}
```

**Favorite features:**
- Visual indicator (⭐ icon)
- Filter to show only favorites
- Scale animation on toggle
- Can be combined with pinning

### Multi-Select Mode

Enable bulk operations on multiple conversations:

```tsx
function BulkOperations() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleBulkDelete = () => {
    // Delete all selected conversations
    setConversations(prev =>
      prev.filter(conv => !selectedIds.includes(conv.id))
    )
    setSelectedIds([])
  }

  const handleBulkExport = () => {
    // Export selected conversations
    const selected = conversations.filter(c => selectedIds.includes(c.id))
    exportConversations(selected)
  }

  return (
    <>
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        multiSelect={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      
      {selectedIds.length > 0 && (
        <div className="flex gap-2 p-4 border-t">
          <button onClick={handleBulkDelete}>
            Delete {selectedIds.length}
          </button>
          <button onClick={handleBulkExport}>
            Export {selectedIds.length}
          </button>
        </div>
      )}
    </>
  )
}
```

**Multi-select features:**
- Checkboxes for each conversation
- Visual selection state
- Selection counter in footer
- Click toggles selection
- Prevent navigation when in multi-select mode

### Unread Badges

Display unread message counts:

```tsx
const conversations: Conversation[] = [
  {
    id: '1',
    title: 'Active Discussion',
    preview: 'New message arrived...',
    timestamp: Date.now(),
    messageCount: 45,
    unreadCount: 5, // Shows badge with "5"
  },
]

<ConversationList
  conversations={conversations}
  activeId={activeId}
  onSelect={setActiveId}
/>
```

**Badge features:**
- Blue badge with white text
- Shows count number
- Only displays when > 0
- Updates automatically
- Typically cleared on conversation select

### Tags

Organize conversations with tags:

```tsx
const conversations: Conversation[] = [
  {
    id: '1',
    title: 'Q4 Planning',
    preview: 'Discussion about roadmap...',
    timestamp: Date.now(),
    messageCount: 15,
    tags: ['work', 'planning', 'important'],
  },
]

<ConversationList
  conversations={conversations}
  activeId={activeId}
  onSelect={setActiveId}
  showFilters={true} // Enable tag filtering
/>
```

**Tag features:**
- Multiple tags per conversation
- Gray badge styling
- Tag filtering (when showFilters=true)
- Truncation for long tag lists

## Advanced Examples

### Complete Conversation Manager

Full-featured example with all capabilities:

```tsx
import { useState, useCallback } from 'react'
import { ConversationList, Conversation } from '@clarity-chat/react'

function ConversationManager() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string>()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [multiSelectMode, setMultiSelectMode] = useState(false)

  const handleCreate = useCallback(async () => {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      preview: 'No messages yet',
      timestamp: Date.now(),
      messageCount: 0,
    }
    
    setConversations(prev => [newConv, ...prev])
    setActiveId(newConv.id)
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Delete this conversation?')) {
      setConversations(prev => prev.filter(c => c.id !== id))
      if (activeId === id) {
        setActiveId(undefined)
      }
    }
  }, [activeId])

  const handleTogglePin = useCallback((id: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      )
    )
  }, [])

  const handleToggleFavorite = useCallback((id: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      )
    )
  }, [])

  const handleBulkDelete = useCallback(() => {
    if (confirm(`Delete ${selectedIds.length} conversations?`)) {
      setConversations(prev =>
        prev.filter(c => !selectedIds.includes(c.id))
      )
      setSelectedIds([])
      setMultiSelectMode(false)
    }
  }, [selectedIds])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r">
        {/* Toolbar */}
        <div className="p-2 border-b flex gap-2">
          <button
            onClick={() => setMultiSelectMode(!multiSelectMode)}
            className={`px-3 py-1 text-sm rounded ${
              multiSelectMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {multiSelectMode ? 'Done' : 'Select'}
          </button>
          
          {multiSelectMode && selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            >
              Delete {selectedIds.length}
            </button>
          )}
        </div>

        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
          onToggleFavorite={handleToggleFavorite}
          onCreate={handleCreate}
          showSearch={true}
          showFilters={true}
          showSort={true}
          multiSelect={multiSelectMode}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeId ? (
          <div>Active conversation: {activeId}</div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

### With Backend Persistence

Example with API integration:

```tsx
function PersistedConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load conversations
  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/conversations')
      const data = await response.json()
      setConversations(data.conversations)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePin = async (id: string) => {
    // Optimistic update
    setConversations(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      )
    )

    // Persist to backend
    try {
      await fetch(`/api/conversations/${id}/pin`, {
        method: 'PATCH',
      })
    } catch (error) {
      // Revert on error
      loadConversations()
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <ConversationList
      conversations={conversations}
      activeId={activeId}
      onSelect={setActiveId}
      onTogglePin={handleTogglePin}
    />
  )
}
```

### With Real-time Updates

Example with WebSocket updates:

```tsx
function RealtimeConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/conversations')

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data)

      switch (update.type) {
        case 'new_message':
          setConversations(prev =>
            prev.map(c =>
              c.id === update.conversationId
                ? {
                    ...c,
                    preview: update.message.content,
                    timestamp: update.message.timestamp,
                    messageCount: c.messageCount + 1,
                    unreadCount: (c.unreadCount || 0) + 1,
                  }
                : c
            )
          )
          break

        case 'conversation_created':
          setConversations(prev => [update.conversation, ...prev])
          break

        case 'conversation_deleted':
          setConversations(prev =>
            prev.filter(c => c.id !== update.conversationId)
          )
          break
      }
    }

    return () => ws.close()
  }, [])

  return (
    <ConversationList
      conversations={conversations}
      activeId={activeId}
      onSelect={setActiveId}
    />
  )
}
```

## Animations

The Conversation List uses Framer Motion for smooth animations:

### Entry Animation
```tsx
// Each conversation item
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{
  duration: 0.2,
  delay: index * 0.05, // 50ms stagger
  ease: [0.4, 0, 0.2, 1],
}}
```

### Hover Effect
```tsx
whileHover={{
  y: -2, // Lift up slightly
  transition: { duration: 0.15 },
}}
```

### Exit Animation
```tsx
exit={{ opacity: 0, x: -100, height: 0 }}
```

### Action Button Animations
```tsx
// Pin button
whileHover={{ scale: 1.2, rotate: isPinned ? 0 : 15 }}
whileTap={{ scale: 0.9 }}

// Favorite button
whileHover={{ scale: 1.2 }}
animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
```

## Accessibility

The Conversation List follows accessibility best practices:

- **Keyboard navigation**: Full keyboard support with Tab/Enter
- **ARIA labels**: Descriptive labels for all interactive elements
- **Role attributes**: Proper button roles
- **Focus management**: Visible focus indicators
- **Screen reader support**: Announced updates and state changes
- **Semantic HTML**: Proper heading hierarchy
- **Color contrast**: WCAG AA compliant colors

## Styling

The component uses Tailwind CSS and supports dark mode:

```tsx
// Light mode
<ConversationList
  conversations={conversations}
  className="bg-white border-gray-200"
/>

// Dark mode (automatic with dark: variants)
<ConversationList
  conversations={conversations}
  className="dark:bg-gray-800 dark:border-gray-700"
/>
```

**Visual states:**
- **Active**: Blue background with left border
- **Selected**: Light blue background (multi-select)
- **Hover**: Slight background change + lift animation
- **Pinned**: 📌 icon indicator
- **Favorite**: ⭐ icon indicator
- **Unread**: Blue badge with count

## Best Practices

1. **Load conversations efficiently**: Paginate or limit initial load
2. **Update timestamps**: Keep relative times current with interval updates
3. **Persist state**: Save pinned/favorite status to backend
4. **Clear unread counts**: Mark as read when conversation is opened
5. **Optimistic updates**: Update UI immediately, sync with backend
6. **Error handling**: Revert changes on API failures
7. **Search performance**: Debounce search input for large lists
8. **Keyboard shortcuts**: Add shortcuts for common actions (Cmd+N for new)

## Related Components

- [Message List](/reference/components/message-list) - Display messages within a conversation
- [Advanced Chat Input](/reference/components/advanced-chat-input) - Input for sending messages
- [Empty State](/reference/components/empty-state) - No content placeholder
- [Project Sidebar](/reference/components/project-sidebar) - Project organization sidebar

## Common Patterns

### Clear Unread on Select

```tsx
const handleSelect = (id: string) => {
  // Clear unread count
  setConversations(prev =>
    prev.map(c =>
      c.id === id ? { ...c, unreadCount: 0 } : c
    )
  )
  setActiveId(id)
}
```

### Update Last Message

```tsx
const handleNewMessage = (conversationId: string, message: Message) => {
  setConversations(prev =>
    prev.map(c =>
      c.id === conversationId
        ? {
            ...c,
            preview: message.content,
            timestamp: message.timestamp,
            messageCount: c.messageCount + 1,
            unreadCount: activeId === c.id ? 0 : (c.unreadCount || 0) + 1,
          }
        : c
    )
  )
}
```

### Debounced Search

```tsx
import { useDeferredValue } from 'react'

function DebouncedSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const deferredQuery = useDeferredValue(searchQuery)

  return (
    <ConversationList
      conversations={conversations}
      // Use deferred value for filtering
      // Component handles search internally, but you can also
      // pre-filter conversations before passing to component
    />
  )
}
```
