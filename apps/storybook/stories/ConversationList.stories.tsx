import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  ConversationList,
  type Conversation,
} from '../../../packages/react/src/components/conversation-list'

const meta: Meta<typeof ConversationList> = {
  title: 'Components/ConversationList',
  component: ConversationList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Animated conversation list with hover lift, staggered entry, search, filters, and delete animations. Features smooth height transitions and interactive elements.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ConversationList>

// ============================================================================
// Mock Data
// ============================================================================

const createMockConversations = (count: number): Conversation[] => {
  const now = Date.now()
  const titles = [
    'Project Planning Discussion',
    'Code Review Notes',
    'Feature Requirements',
    'Bug Fixes and Updates',
    'Design System Feedback',
    'API Documentation',
    'Sprint Retrospective',
    'Team Standup Notes',
    'Customer Support Tickets',
    'Marketing Campaign Ideas',
  ]

  const previews = [
    'Let\'s discuss the timeline for the upcoming release...',
    'Found a few issues in the latest PR that need addressing...',
    'The new feature should include authentication and...',
    'Fixed the rendering bug in the chat component...',
    'The color palette looks great, but we should consider...',
    'Updated the REST API endpoints documentation...',
    'What went well this sprint and what can we improve?',
    'Quick sync on today\'s priorities and blockers...',
    'Customer reported an issue with file uploads...',
    'Brainstorming ideas for the Q4 campaign launch...',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `conv-${i}`,
    title: titles[i % titles.length],
    preview: previews[i % previews.length],
    timestamp: now - i * 3600000, // 1 hour apart
    messageCount: Math.floor(Math.random() * 50) + 1,
    unreadCount: i < 3 ? Math.floor(Math.random() * 5) : 0,
    tags: i % 3 === 0 ? ['work', 'important'] : i % 3 === 1 ? ['personal'] : [],
    isPinned: i < 2,
    isFavorite: i === 1 || i === 4,
  }))
}

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => {
    const [activeId, setActiveId] = React.useState('conv-0')
    const conversations = createMockConversations(10)

    return (
      <div className="h-[600px] w-[400px] border rounded-lg">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onCreate={() => alert('Create new conversation')}
        />
      </div>
    )
  },
}

export const WithSearch: Story = {
  render: () => {
    const [activeId, setActiveId] = React.useState('conv-0')
    const conversations = createMockConversations(20)

    return (
      <div className="h-[600px] w-[400px] border rounded-lg">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          showSearch={true}
        />
      </div>
    )
  },
}

export const WithFiltersAndSort: Story = {
  render: () => {
    const [activeId, setActiveId] = React.useState('conv-0')
    const conversations = createMockConversations(15)

    return (
      <div className="h-[600px] w-[400px] border rounded-lg">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          showSearch={true}
          showFilters={true}
          showSort={true}
        />
      </div>
    )
  },
}

// ============================================================================
// Interactive Features
// ============================================================================

export const WithPinAndFavorite: Story = {
  render: () => {
    const [conversations, setConversations] = React.useState(createMockConversations(10))
    const [activeId, setActiveId] = React.useState('conv-0')

    const handleTogglePin = (id: string) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
      )
    }

    const handleToggleFavorite = (id: string) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
      )
    }

    return (
      <div className="h-[600px] w-[400px] border rounded-lg">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onTogglePin={handleTogglePin}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    )
  },
}

export const WithDelete: Story = {
  render: () => {
    const [conversations, setConversations] = React.useState(createMockConversations(10))
    const [activeId, setActiveId] = React.useState('conv-0')

    const handleDelete = (id: string) => {
      if (confirm('Delete this conversation?')) {
        setConversations((prev) => prev.filter((c) => c.id !== id))
        if (activeId === id) {
          const remaining = conversations.filter((c) => c.id !== id)
          setActiveId(remaining[0]?.id || '')
        }
      }
    }

    return (
      <div className="h-[600px] w-[400px] border rounded-lg">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onDelete={handleDelete}
        />
      </div>
    )
  },
}

export const MultiSelect: Story = {
  render: () => {
    const conversations = createMockConversations(10)
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])

    const handleBulkDelete = () => {
      if (selectedIds.length > 0) {
        alert(`Delete ${selectedIds.length} conversations`)
        setSelectedIds([])
      }
    }

    return (
      <div className="space-y-4">
        <div className="h-[600px] w-[400px] border rounded-lg">
          <ConversationList
            conversations={conversations}
            multiSelect={true}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onSelect={() => {}}
          />
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete {selectedIds.length} selected
          </button>
        )}
      </div>
    )
  },
}

// ============================================================================
// Animation Showcase
// ============================================================================

export const StaggeredEntry: Story = {
  render: () => {
    const [conversations, setConversations] = React.useState<Conversation[]>([])
    const [activeId, setActiveId] = React.useState('')

    const loadConversations = () => {
      setConversations(createMockConversations(10))
    }

    const clearConversations = () => {
      setConversations([])
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={loadConversations}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Load Conversations (Watch Stagger)
          </button>
          <button
            onClick={clearConversations}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
        <div className="h-[600px] w-[400px] border rounded-lg">
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </div>
      </div>
    )
  },
}

export const DeleteAnimation: Story = {
  render: () => {
    const [conversations, setConversations] = React.useState(createMockConversations(5))
    const [activeId, setActiveId] = React.useState('conv-0')

    const handleDelete = (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeId === id) {
        const remaining = conversations.filter((c) => c.id !== id)
        setActiveId(remaining[0]?.id || '')
      }
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Click delete buttons to see slide-out animation (50ms stagger between remaining items)
        </p>
        <div className="h-[600px] w-[400px] border rounded-lg">
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={setActiveId}
            onDelete={handleDelete}
          />
        </div>
      </div>
    )
  },
}

// ============================================================================
// States
// ============================================================================

export const EmptyState: Story = {
  render: () => {
    return (
      <div className="h-[600px] w-[400px] border rounded-lg">
        <ConversationList
          conversations={[]}
          onSelect={() => {}}
          onCreate={() => alert('Create new conversation')}
        />
      </div>
    )
  },
}

export const EmptySearchResults: Story = {
  render: () => {
    const conversations = createMockConversations(10)

    return (
      <div className="h-[600px] w-[400px] border rounded-lg">
        <ConversationList
          conversations={conversations}
          onSelect={() => {}}
          showSearch={true}
        />
        <p className="p-4 text-sm text-muted-foreground">
          Try searching for "xyz" to see empty state
        </p>
      </div>
    )
  },
}

// ============================================================================
// Real-World Example
// ============================================================================

export const FullFeatured: Story = {
  render: () => {
    const [conversations, setConversations] = React.useState(createMockConversations(20))
    const [activeId, setActiveId] = React.useState('conv-0')
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])
    const [multiSelect, setMultiSelect] = React.useState(false)

    const handleTogglePin = (id: string) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
      )
    }

    const handleToggleFavorite = (id: string) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
      )
    }

    const handleDelete = (id: string) => {
      if (confirm('Delete this conversation?')) {
        setConversations((prev) => prev.filter((c) => c.id !== id))
        if (activeId === id) {
          const remaining = conversations.filter((c) => c.id !== id)
          setActiveId(remaining[0]?.id || '')
        }
      }
    }

    const handleBulkDelete = () => {
      if (selectedIds.length > 0 && confirm(`Delete ${selectedIds.length} conversations?`)) {
        setConversations((prev) => prev.filter((c) => !selectedIds.includes(c.id)))
        setSelectedIds([])
      }
    }

    const handleCreate = () => {
      const newId = `conv-${Date.now()}`
      setConversations((prev) => [
        {
          id: newId,
          title: 'New Conversation',
          preview: 'Start chatting...',
          timestamp: Date.now(),
          messageCount: 0,
          isPinned: false,
          isFavorite: false,
        },
        ...prev,
      ])
      setActiveId(newId)
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMultiSelect(!multiSelect)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              multiSelect
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {multiSelect ? 'Exit Multi-Select' : 'Multi-Select Mode'}
          </button>
          {multiSelect && selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete {selectedIds.length} selected
            </button>
          )}
        </div>
        <div className="h-[600px] w-[400px] border rounded-lg">
          <ConversationList
            conversations={conversations}
            activeId={!multiSelect ? activeId : undefined}
            onSelect={setActiveId}
            onTogglePin={handleTogglePin}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            onCreate={handleCreate}
            showSearch={true}
            showFilters={true}
            showSort={true}
            multiSelect={multiSelect}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </div>
      </div>
    )
  },
}
