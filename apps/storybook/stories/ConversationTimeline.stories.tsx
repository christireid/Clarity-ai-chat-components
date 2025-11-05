import type { Meta, StoryObj } from '@storybook/react'
import { ConversationTimeline } from '@clarity-chat/react'
import type { ConversationTimelineEvent } from '@clarity-chat/react'

const meta: Meta<typeof ConversationTimeline> = {
  title: 'Components/ConversationTimeline',
  component: ConversationTimeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Visual timeline showing conversation events including user messages, assistant responses, tool calls, and system events.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ConversationTimeline>

const mockEvents: ConversationTimelineEvent[] = [
  {
    id: '1',
    type: 'user',
    title: 'User message',
    timestamp: new Date(Date.now() - 600000),
    summary: 'What is React?',
    durationMs: 500,
    status: 'complete',
  },
  {
    id: '2',
    type: 'assistant',
    title: 'Assistant response',
    timestamp: new Date(Date.now() - 550000),
    summary: 'React is a JavaScript library...',
    durationMs: 2000,
    status: 'complete',
  },
  {
    id: '3',
    type: 'tool',
    title: 'Tool invocation',
    timestamp: new Date(Date.now() - 400000),
    summary: 'web_search(query)',
    durationMs: 1500,
    status: 'complete',
  },
]

export const Default: Story = {
  args: {
    events: mockEvents,
  },
}

export const AllEventTypes: Story = {
  args: {
    events: [
      {
        id: '1',
        type: 'user',
        title: 'User input',
        timestamp: new Date(Date.now() - 300000),
        summary: 'Question about React hooks',
      },
      {
        id: '2',
        type: 'assistant',
        title: 'AI response',
        timestamp: new Date(Date.now() - 280000),
        summary: 'Explanation of React hooks',
      },
      {
        id: '3',
        type: 'tool',
        title: 'Code search',
        timestamp: new Date(Date.now() - 250000),
        summary: 'Searched codebase for examples',
      },
      {
        id: '4',
        type: 'system',
        title: 'Context updated',
        timestamp: new Date(Date.now() - 200000),
        summary: 'Added conversation to context',
      },
      {
        id: '5',
        type: 'note',
        title: 'Note added',
        timestamp: new Date(Date.now() - 150000),
        summary: 'User bookmarked this conversation',
      },
    ],
  },
}

export const WithStatusIndicators: Story = {
  args: {
    events: [
      {
        id: '1',
        type: 'user',
        title: 'Pending request',
        timestamp: new Date(),
        status: 'pending',
      },
      {
        id: '2',
        type: 'assistant',
        title: 'Completed response',
        timestamp: new Date(Date.now() - 10000),
        status: 'complete',
      },
      {
        id: '3',
        type: 'tool',
        title: 'Failed tool call',
        timestamp: new Date(Date.now() - 20000),
        status: 'error',
      },
    ],
    showStatusIndicators: true,
  },
}

export const WithJumpTo: Story = {
  args: {
    events: mockEvents,
    onJumpToEvent: (event) => {
      console.log('Jumping to event:', event.id)
      alert(`Jumping to: ${event.title}`)
    },
  },
}

export const LongTimeline: Story = {
  args: {
    events: Array.from({ length: 20 }, (_, i) => ({
      id: `event-${i}`,
      type: (['user', 'assistant', 'tool'] as const)[i % 3],
      title: `Event ${i + 1}`,
      timestamp: new Date(Date.now() - (20 - i) * 30000),
      summary: `Summary for event ${i + 1}`,
      durationMs: 1000 + i * 100,
      status: i === 0 ? 'pending' : 'complete',
    })),
  },
}
