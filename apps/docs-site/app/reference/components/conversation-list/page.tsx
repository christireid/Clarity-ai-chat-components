import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conversation List - Clarity Chat',
  description: 'Organize and navigate multiple AI conversations with search, filters, sorting, pinning, and multi-select capabilities.',
}

# Conversation List

A comprehensive sidebar component for managing multiple AI conversations with search, filtering, sorting, pinning, favorites, and bulk operations.

## Overview

The Conversation List provides complete conversation management:

- **Search conversations** - Find conversations by title or content
- **Filter options** - Filter by pinned, favorites, and tags
- **Sort options** - Sort by date, title, or message count
- **Pin conversations** - Keep important conversations at the top
- **Favorite marking** - Star conversations for quick access
- **Unread badges** - Display unread message counts
- **Multi-select mode** - Bulk operations on multiple conversations
- **Smooth animations** - Framer Motion transitions and hover effects

## Installation

The Conversation List is included in the Clarity Chat React package:

\`\`\`bash
npm install @clarity-chat/react
\`\`\`

## Basic Usage

\`\`\`tsx
import { ConversationList } from '@clarity-chat/react'
import type { Conversation } from '@clarity-chat/types'

function ChatSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Product Strategy Discussion',
      preview: 'Can you help me outline...',
      timestamp: Date.now() - 3600000,
      messageCount: 15,
      unreadCount: 2,
      isPinned: true,
    },
    {
      id: '2',
      title: 'Code Review Questions',
      preview: 'I need help understanding...',
      timestamp: Date.now() - 86400000,
      messageCount: 8,
    },
  ])

  const [activeId, setActiveId] = useState('1')

  return (
    <ConversationList
      conversations={conversations}
      activeId={activeId}
      onSelect={setActiveId}
      onCreate={() => {
        // Create new conversation
      }}
    />
  )
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`conversations\` | \`Conversation[]\` | **Required** | Array of conversation objects |
| \`activeId\` | \`string\` | \`undefined\` | Currently active conversation ID |
| \`onSelect\` | \`(conversationId: string) => void\` | **Required** | Callback when conversation is selected |
| \`onDelete\` | \`(conversationId: string) => void\` | \`undefined\` | Callback when conversation is deleted |
| \`onTogglePin\` | \`(conversationId: string) => void\` | \`undefined\` | Callback when conversation is pinned/unpinned |
| \`onToggleFavorite\` | \`(conversationId: string) => void\` | \`undefined\` | Callback when conversation is favorited/unfavorited |
| \`onCreate\` | \`() => void\` | \`undefined\` | Callback when new conversation button clicked |
| \`showSearch\` | \`boolean\` | \`true\` | Show search bar |
| \`showFilters\` | \`boolean\` | \`false\` | Show filter buttons (pinned, favorites) |
| \`showSort\` | \`boolean\` | \`false\` | Show sort dropdown |
| \`multiSelect\` | \`boolean\` | \`false\` | Enable multi-select mode with checkboxes |
| \`selectedIds\` | \`string[]\` | \`[]\` | Selected conversation IDs (for multi-select) |
| \`onSelectionChange\` | \`(selectedIds: string[]) => void\` | \`undefined\` | Callback when selection changes |
| \`className\` | \`string\` | \`undefined\` | Additional CSS classes |

## Features

### Search Conversations

Real-time search through conversation titles and previews:

\`\`\`tsx
<ConversationList
  conversations={conversations}
  activeId={activeId}
  onSelect={setActiveId}
  showSearch={true} // Default: true
/>
\`\`\`

**Search features:**
- Case-insensitive search
- Searches both title and preview text
- Real-time filtering as you type
- Clear visual feedback for no results
- Automatically clears on empty input

### Filter and Sort

Organize conversations with multiple filter and sort options:

\`\`\`tsx
<ConversationList
  conversations={conversations}
  activeId={activeId}
  onSelect={setActiveId}
  showSearch={true}
  showFilters={true}
  showSort={true}
/>
\`\`\`

**Sort options:**
- **Most Recent**: Sort by timestamp (newest first) - default
- **Oldest**: Sort by timestamp (oldest first)
- **Title A-Z**: Alphabetical sorting
- **Message Count**: Sort by number of messages

**Filter options:**
- **Pinned**: Show only pinned conversations
- **Favorites**: Show only favorited conversations
- **Tags**: Filter by conversation tags (future feature)

**Priority**: Pinned conversations always appear first, regardless of sort order

### Pin and Favorite

Mark important conversations for quick access:

\`\`\`tsx
import { ConversationList } from '@clarity-chat/react'

function ManagedConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])

  const handleTogglePin = (id: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      )
    )
  }

  const handleToggleFavorite = (id: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      )
    )
  }

  return (
    <ConversationList
      conversations={conversations}
      activeId={activeId}
      onSelect={setActiveId}
      onTogglePin={handleTogglePin}
      onToggleFavorite={handleToggleFavorite}
    />
  )
}
\`\`\`

**Pin features:**
- 📌 Visual indicator for pinned conversations
- Always displayed at the top
- Animated pin/unpin transitions
- Separate count in statistics

**Favorite features:**
- ⭐ Visual indicator for favorited conversations
- Filter to show only favorites
- Animated favorite/unfavorite transitions
- Can be combined with pinning

### Multi-Select Mode

Enable bulk operations on multiple conversations:

\`\`\`tsx
import { ConversationList } from '@clarity-chat/react'
import { useState } from 'react'

function BulkOperations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleBulkDelete = () => {
    setConversations(prev =>
      prev.filter(c => !selectedIds.includes(c.id))
    )
    setSelectedIds([])
  }

  const handleBulkExport = () => {
    const selectedConvos = conversations.filter(c =>
      selectedIds.includes(c.id)
    )
    // Export logic
  }

  return (
    <div>
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        multiSelect={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {selectedIds.length > 0 && (
        <div className="p-4 border-t flex gap-2">
          <button onClick={handleBulkDelete}>
            Delete {selectedIds.length}
          </button>
          <button onClick={handleBulkExport}>
            Export {selectedIds.length}
          </button>
        </div>
      )}
    </div>
  )
}
\`\`\`

### Unread Badges

Display unread message counts for each conversation:

\`\`\`tsx
const conversations: Conversation[] = [
  {
    id: '1',
    title: 'Customer Support',
    preview: 'How can I help...',
    timestamp: Date.now(),
    messageCount: 25,
    unreadCount: 3, // Shows blue badge with "3"
  },
]

<ConversationList
  conversations={conversations}
  activeId={activeId}
  onSelect={setActiveId}
/>
\`\`\`

### Create New Conversation

Add a button to create new conversations:

\`\`\`tsx
<ConversationList
  conversations={conversations}
  activeId={activeId}
  onSelect={setActiveId}
  onCreate={() => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      preview: '',
      timestamp: Date.now(),
      messageCount: 0,
    }
    
    setConversations(prev => [newConversation, ...prev])
    setActiveId(newConversation.id)
  }}
/>
\`\`\`

## Complete Example: Full Conversation Management

\`\`\`tsx
import { useState, useCallback } from 'react'
import { ConversationList } from '@clarity-chat/react'
import type { Conversation } from '@clarity-chat/types'

function CompleteConversationManager() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Product Strategy 2024',
      preview: 'Let\\'s discuss our Q1 roadmap...',
      timestamp: Date.now() - 3600000,
      messageCount: 42,
      unreadCount: 5,
      isPinned: true,
      isFavorite: true,
      tags: ['strategy', 'planning'],
    },
    {
      id: '2',
      title: 'Code Architecture Review',
      preview: 'We need to refactor the auth module...',
      timestamp: Date.now() - 7200000,
      messageCount: 28,
      unreadCount: 0,
      isPinned: false,
      isFavorite: false,
      tags: ['engineering', 'architecture'],
    },
    {
      id: '3',
      title: 'Marketing Campaign Ideas',
      preview: 'Brainstorming for the summer launch...',
      timestamp: Date.now() - 86400000,
      messageCount: 15,
      unreadCount: 2,
      isPinned: false,
      isFavorite: true,
      tags: ['marketing', 'creative'],
    },
  ])

  const [activeId, setActiveId] = useState('1')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleSelect = useCallback((id: string) => {
    setActiveId(id)
    
    // Mark as read
    setConversations(prev =>
      prev.map(c =>
        c.id === id ? { ...c, unreadCount: 0 } : c
      )
    )
  }, [])

  const handleCreate = useCallback(() => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      preview: 'Start typing to begin...',
      timestamp: Date.now(),
      messageCount: 0,
      unreadCount: 0,
      isPinned: false,
      isFavorite: false,
      tags: [],
    }

    setConversations(prev => [newConversation, ...prev])
    setActiveId(newConversation.id)
  }, [])

  const handleDelete = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      setConversations(prev => prev.filter(c => c.id !== id))
      
      // If deleting active conversation, select another
      if (activeId === id) {
        const remaining = conversations.filter(c => c.id !== id)
        setActiveId(remaining[0]?.id || '')
      }
    }
  }, [activeId, conversations])

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
    if (confirm(\`Delete \${selectedIds.length} conversations?\`)) {
      setConversations(prev =>
        prev.filter(c => !selectedIds.includes(c.id))
      )
      setSelectedIds([])
    }
  }, [selectedIds])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
          onToggleFavorite={handleToggleFavorite}
          showSearch={true}
          showFilters={true}
          showSort={true}
          multiSelect={false}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 p-4">
        {activeId ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {conversations.find(c => c.id === activeId)?.title}
            </h2>
            {/* Chat interface here */}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              Select a conversation to start
            </p>
          </div>
        )}
      </div>

      {/* Bulk operations toolbar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex gap-3">
          <span className="text-sm font-medium">
            {selectedIds.length} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
\`\`\`

## Animation Details

The Conversation List uses Framer Motion for smooth transitions:

### List Item Animation
\`\`\`tsx
// Stagger animation for conversation items
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, x: -100, height: 0 }}
  transition={{
    duration: 0.2,
    delay: index * 0.05, // 50ms stagger
    ease: [0.4, 0, 0.2, 1],
  }}
/>
\`\`\`

### Hover Effects
\`\`\`tsx
// Subtle lift on hover
whileHover={{
  y: -2,
  transition: { duration: 0.15 },
}}
\`\`\`

### Pin/Favorite Buttons
\`\`\`tsx
// Interactive button animations
<motion.button
  whileHover={{ scale: 1.2, rotate: 15 }}
  whileTap={{ scale: 0.9 }}
/>
\`\`\`

### Pin Animation
\`\`\`tsx
// Wiggle effect when pinned
<motion.span
  animate={isPinned ? { rotate: [0, -10, 10, -10, 0] } : {}}
  transition={{ duration: 0.5 }}
/>
\`\`\`

## TypeScript Interfaces

### Conversation Interface
\`\`\`typescript
interface Conversation {
  id: string
  title: string
  preview: string
  timestamp: number          // Unix timestamp in milliseconds
  messageCount: number
  unreadCount?: number
  tags?: string[]
  isPinned?: boolean
  isFavorite?: boolean
}
\`\`\`

### ConversationListProps Interface
\`\`\`typescript
interface ConversationListProps {
  conversations: Conversation[]
  activeId?: string
  onSelect: (conversationId: string) => void
  onDelete?: (conversationId: string) => void
  onTogglePin?: (conversationId: string) => void
  onToggleFavorite?: (conversationId: string) => void
  onCreate?: () => void
  showSearch?: boolean
  showFilters?: boolean
  showSort?: boolean
  multiSelect?: boolean
  selectedIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  className?: string
}
\`\`\`

### SortOption Type
\`\`\`typescript
type SortOption = 'recent' | 'oldest' | 'title' | 'messages'
\`\`\`

### FilterOptions Interface
\`\`\`typescript
interface FilterOptions {
  search?: string
  tags?: string[]
  showPinned?: boolean
  showFavorites?: boolean
}
\`\`\`

## Accessibility

The Conversation List follows accessibility best practices:

- **Semantic HTML**: Proper button and list structure
- **ARIA labels**: Descriptive labels for all interactive elements
- **Keyboard navigation**: Full keyboard support with Tab/Enter/Space
- **Focus indicators**: Clear visual focus states
- **Screen reader support**: Proper announcements for state changes
- **Role attributes**: Correct ARIA roles for custom elements
- **Tab order**: Logical tab order through interface
- **Action feedback**: Clear feedback for user actions

### Keyboard Shortcuts
- **Tab**: Navigate between conversations
- **Enter/Space**: Select conversation
- **Delete**: Delete selected conversation (when focused)
- **Ctrl+F**: Focus search input

## Time Formatting

The component includes intelligent relative time formatting:

\`\`\`typescript
formatRelativeTime(timestamp: number): string

// Examples:
// < 1 minute: "Just now"
// < 1 hour: "5m ago", "45m ago"
// < 1 day: "2h ago", "12h ago"
// < 1 week: "3d ago"
// >= 1 week: "12/15/2023"
\`\`\`

## Related Components

- [Message List](/reference/components/message-list) - Display messages in active conversation
- [Message](/reference/components/message) - Individual message component
- [Advanced Chat Input](/reference/components/advanced-chat-input) - Input for sending messages
- [Project Sidebar](/reference/components/project-sidebar) - Alternative sidebar layout

## Best Practices

1. **Unique IDs**: Ensure all conversation IDs are unique and stable
2. **Timestamp format**: Use Unix timestamps in milliseconds
3. **Unread counts**: Update unread counts when conversation is selected
4. **Optimistic updates**: Update UI immediately, sync with server
5. **Pagination**: Load conversations in batches for large datasets
6. **Local storage**: Persist conversation state locally
7. **Confirmation**: Always confirm destructive actions (delete)
8. **Search debouncing**: Debounce search input for performance
9. **Empty states**: Provide helpful empty state messaging
10. **Loading states**: Show loading indicators during data fetch

## Performance Optimization

### Memoization
\`\`\`tsx
import { useMemo, useCallback } from 'react'

// Memoize filtered conversations
const filteredConversations = useMemo(() => {
  // Filter and sort logic
}, [conversations, searchQuery, sortBy, filters])

// Memoize callbacks
const handleSelect = useCallback((id: string) => {
  // Selection logic
}, [dependencies])
\`\`\`

### Virtual Scrolling
For very large conversation lists (100+):
\`\`\`tsx
import { VirtualizedList } from '@clarity-chat/react'

// Use virtualized rendering for 100+ conversations
{conversations.length > 100 ? (
  <VirtualizedList items={conversations} />
) : (
  <ConversationList conversations={conversations} />
)}
\`\`\`

## Troubleshooting

### Conversations not filtering
- Verify search query is being set correctly
- Check that conversation titles and previews contain searchable text
- Ensure filter state is properly managed

### Pinned conversations not staying at top
- The component automatically sorts pinned items first
- Verify \`isPinned\` property is set correctly on conversation objects

### Animations not smooth
- Check for expensive re-renders in parent component
- Memoize callbacks with \`useCallback\`
- Use \`React.memo\` for conversation items if needed

### Multi-select not working
- Ensure \`multiSelect={true}\` is set
- Provide \`selectedIds\` and \`onSelectionChange\` props
- Check that \`onSelectionChange\` updates state correctly
