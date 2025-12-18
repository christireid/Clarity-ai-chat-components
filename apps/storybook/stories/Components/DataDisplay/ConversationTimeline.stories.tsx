import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConversationTimeline } from '@clarity-chat/react'
import type { ConversationTimelineEvent } from '@clarity-chat/react'

/**
 * **ConversationTimeline Component**
 * 
 * Visual timeline showing conversation events including user messages,
 * assistant responses, tool calls, and system events.
 * 
 * **Key Features:**
 * - Multiple event types (user, assistant, tool, system)
 * - Timestamp display
 * - Duration tracking
 * - Status indicators
 * - Expandable details
 * - Accessible with keyboard navigation
 * 
 * **Use Cases:**
 * - Conversation history
 * - Debugging and monitoring
 * - Activity feeds
 * - Audit logs
 */
const meta: Meta<typeof ConversationTimeline> = {
  title: 'Components/DataDisplay/ConversationTimeline',
  component: ConversationTimeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Visual timeline showing conversation events including user messages,
assistant responses, tool calls, and system events.

## Features

- ✅ Multiple event types (user, assistant, tool, system)
- ✅ Timestamp display
- ✅ Duration tracking
- ✅ Status indicators
- ✅ Expandable details
- ✅ Accessible with keyboard navigation
- ✅ Visual timeline layout

## Basic Usage

\`\`\`tsx
<ConversationTimeline
  events={events}
  onEventClick={(event) => {
    SecureLogger.debug('Event clicked:', event)
  }}
/>
\`\`\`
        `,
      },
    },
    layout: 'padded',
  },
  argTypes: {
    events: {
      description: 'Array of timeline events',
      control: { type: 'object' },
    },
    onEventClick: {
      description: 'Callback when an event is clicked',
      action: 'event-clicked',
    },
    showTimestamps: {
      description: 'Show event timestamps',
      control: 'boolean',
    },
    showDuration: {
      description: 'Show event duration',
      control: 'boolean',
    },
    compact: {
      description: 'Use compact layout',
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof ConversationTimeline>

const mockEvents: ConversationTimelineEvent[] = [
  {
    id: '1',
    type: 'user',
    title: 'Components/DataDisplay/ConversationTimeline',
    timestamp: new Date(Date.now() - 600000),
    summary: 'What is React?',
    durationMs: 500,
    status: 'complete',
  },
  {
    id: '2',
    type: 'assistant',
    title: 'Components/DataDisplay/ConversationTimeline',
    timestamp: new Date(Date.now() - 550000),
    summary: 'React is a JavaScript library...',
    durationMs: 2000,
    status: 'complete',
  },
  {
    id: '3',
    type: 'tool',
    title: 'Components/DataDisplay/ConversationTimeline',
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
        title: 'Components/DataDisplay/ConversationTimeline',
        timestamp: new Date(Date.now() - 300000),
        summary: 'Question about React hooks',
      },
      {
        id: '2',
        type: 'assistant',
        title: 'Components/DataDisplay/ConversationTimeline',
        timestamp: new Date(Date.now() - 280000),
        summary: 'Explanation of React hooks',
      },
      {
        id: '3',
        type: 'tool',
        title: 'Components/DataDisplay/ConversationTimeline',
        timestamp: new Date(Date.now() - 250000),
        summary: 'Searched codebase for examples',
      },
      {
        id: '4',
        type: 'system',
        title: 'Components/DataDisplay/ConversationTimeline',
        timestamp: new Date(Date.now() - 200000),
        summary: 'Added conversation to context',
      },
      {
        id: '5',
        type: 'note',
        title: 'Components/DataDisplay/ConversationTimeline',
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
        title: 'Components/DataDisplay/ConversationTimeline',
        timestamp: new Date(),
        status: 'pending',
      },
      {
        id: '2',
        type: 'assistant',
        title: 'Components/DataDisplay/ConversationTimeline',
        timestamp: new Date(Date.now() - 10000),
        status: 'complete',
      },
      {
        id: '3',
        type: 'tool',
        title: 'Components/DataDisplay/ConversationTimeline',
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
      SecureLogger.debug('Jumping to event:', event.id)
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
