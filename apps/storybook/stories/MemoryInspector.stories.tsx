import type { Meta, StoryObj } from '@storybook/react'
import { MemoryInspector } from '@clarity-chat/react'
import type { MemoryItem } from '@clarity-chat/react'

const meta: Meta<typeof MemoryInspector> = {
  title: 'Components/MemoryInspector',
  component: MemoryInspector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Inspect what the assistant has stored in memory. View, prune, promote, or debug contextual memory across session, thread, and global scopes.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof MemoryInspector>

const mockMemories: MemoryItem[] = [
  {
    id: '1',
    label: 'User preference',
    value: 'Prefers dark mode',
    scope: 'session',
    confidence: 0.95,
    lastUpdated: new Date(Date.now() - 300000),
    tokens: 5,
  },
  {
    id: '2',
    label: 'Project context',
    value: 'Working on React chat application',
    scope: 'thread',
    confidence: 0.88,
    source: 'conversation',
    lastUpdated: new Date(Date.now() - 600000),
    tokens: 8,
  },
  {
    id: '3',
    label: 'User name',
    value: 'John Doe',
    scope: 'global',
    confidence: 1.0,
    source: 'profile',
    lastUpdated: new Date(Date.now() - 86400000),
    tokens: 2,
  },
]

export const Default: Story = {
  args: {
    memories: mockMemories,
  },
}

export const WithActions: Story = {
  args: {
    memories: mockMemories,
    onRemove: (memory) => {
      console.log('Removing memory:', memory.id)
      alert(`Removed: ${memory.label}`)
    },
    onPromote: (memory) => {
      console.log('Promoting memory:', memory.id)
      alert(`Promoted: ${memory.label}`)
    },
    onRefresh: () => {
      console.log('Refreshing memories')
      alert('Refreshing...')
    },
  },
}

export const Loading: Story = {
  args: {
    memories: [],
    isLoading: true,
  },
}

export const Empty: Story = {
  args: {
    memories: [],
    isLoading: false,
  },
}

export const ManyMemories: Story = {
  args: {
    memories: Array.from({ length: 20 }, (_, i) => ({
      id: `memory-${i}`,
      label: `Memory ${i + 1}`,
      value: `Value for memory ${i + 1}`,
      scope: (['session', 'thread', 'global'] as const)[i % 3],
      confidence: 0.9 - (i % 10) * 0.05,
      lastUpdated: new Date(Date.now() - i * 60000),
      tokens: 5 + i,
    })),
  },
}

export const CustomTitle: Story = {
  args: {
    memories: mockMemories,
    title: 'Custom Memory Inspector',
    subtitle: 'Inspect and manage conversation memory',
  },
}
