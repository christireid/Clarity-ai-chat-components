import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { LiveDemo } from '@/components/Demo/LiveDemo'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Conversation Timeline - Clarity Chat Components',
  description: 'Visual timeline showing conversation flow with user messages, AI responses, tool calls, and system events.',
}

export default function ConversationTimelinePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Conversation Timeline</h1>
        <p className="docs-lead">
          A visual timeline that shows how your conversation evolved - user messages, AI responses, tool calls, and system events all in chronological order.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Think of this like a "behind the scenes" view of your AI chat. Instead of just seeing the chat bubbles, you see EVERYTHING that happened: when you asked a question, when the AI thought about it, when it called external tools, and when it responded.
        </p>
        
        <Callout type="info" title="Why Use This?">
          Perfect for debugging, understanding AI behavior, showing transparency to users,
          or building admin dashboards that need to audit conversations.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Simple Timeline"
          code={`import { ConversationTimeline } from '@clarity-chat/react'

function SimpleTimeline() {
  const events = [
    {
      id: '1',
      type: 'user',
      title: 'User asked a question',
      timestamp: new Date('2024-11-03T10:00:00'),
      summary: 'What are our Q4 sales targets?',
      status: 'complete'
    },
    {
      id: '2',
      type: 'tool',
      title: 'Searched company database',
      timestamp: new Date('2024-11-03T10:00:02'),
      summary: 'Retrieved sales data from fiscal year database',
      durationMs: 1200,
      status: 'complete'
    },
    {
      id: '3',
      type: 'assistant',
      title: 'AI responded',
      timestamp: new Date('2024-11-03T10:00:05'),
      summary: 'Based on the data, Q4 targets are $2.5M...',
      durationMs: 3000,
      status: 'complete'
    }
  ]

  return (
    <ConversationTimeline events={events} />
  )
}

export default SimpleTimeline`}
          height="400px"
        />
      </section>

      <section className="docs-section">
        <h2>Event Types</h2>
        <p>
          Different event types are color-coded to make it easy to scan the timeline.
        </p>
        <LiveDemo
          title="All Event Types"
          code={`import { ConversationTimeline } from '@clarity-chat/react'

function EventTypes() {
  const events = [
    {
      id: '1',
      type: 'user',
      title: 'User message',
      timestamp: new Date('2024-11-03T10:00:00'),
      summary: 'The user typed their question',
      status: 'complete'
    },
    {
      id: '2',
      type: 'assistant',
      title: 'AI response',
      timestamp: new Date('2024-11-03T10:00:01'),
      summary: 'The AI generated an answer',
      status: 'complete'
    },
    {
      id: '3',
      type: 'tool',
      title: 'Tool execution',
      timestamp: new Date('2024-11-03T10:00:02'),
      summary: 'Called external API or function',
      tool: 'search_database',
      status: 'complete'
    },
    {
      id: '4',
      type: 'system',
      title: 'System event',
      timestamp: new Date('2024-11-03T10:00:03'),
      summary: 'Rate limit check passed',
      status: 'complete'
    },
    {
      id: '5',
      type: 'note',
      title: 'Developer note',
      timestamp: new Date('2024-11-03T10:00:04'),
      summary: 'Added manual annotation',
      status: 'complete'
    }
  ]

  return (
    <ConversationTimeline 
      events={events}
      title="Event Type Examples"
      subtitle="Each type has its own color and icon"
    />
  )
}

export default EventTypes`}
          height="500px"
        />
      </section>

      <section className="docs-section">
        <h2>With Metadata</h2>
        <p>
          Add extra details like tokens used, model name, or any custom data.
        </p>
        <LiveDemo
          title="Timeline with Metadata"
          code={`import { ConversationTimeline } from '@clarity-chat/react'

function MetadataTimeline() {
  const events = [
    {
      id: '1',
      type: 'assistant',
      title: 'Generated response',
      timestamp: new Date(),
      summary: 'AI analyzed the question and generated an answer',
      durationMs: 2500,
      status: 'complete',
      metadata: [
        { label: 'Model', value: 'gpt-4-turbo' },
        { label: 'Tokens', value: '1,247' },
        { label: 'Temperature', value: '0.7' }
      ]
    },
    {
      id: '2',
      type: 'tool',
      title: 'Database query',
      timestamp: new Date(),
      summary: 'Searched for relevant customer data',
      tool: 'postgres_query',
      durationMs: 850,
      status: 'complete',
      metadata: [
        { label: 'Rows', value: '142' },
        { label: 'Query time', value: '850ms' }
      ]
    }
  ]

  return (
    <ConversationTimeline events={events} />
  )
}

export default MetadataTimeline`}
          height="400px"
        />
      </section>

      <section className="docs-section">
        <h2>Interactive Timeline</h2>
        <p>
          Click events to jump to that point in the conversation, or retry failed steps.
        </p>
        <LiveDemo
          title="Interactive Timeline Example"
          code={`import { ConversationTimeline } from '@clarity-chat/react'
import { useState } from 'react'

function InteractiveTimeline() {
  const [events, setEvents] = useState([
    {
      id: '1',
      type: 'user',
      title: 'User: Check inventory',
      timestamp: new Date('2024-11-03T10:00:00'),
      summary: 'How many units of Product X do we have?',
      status: 'complete'
    },
    {
      id: '2',
      type: 'tool',
      title: 'Inventory API call',
      timestamp: new Date('2024-11-03T10:00:01'),
      summary: 'Querying inventory database...',
      tool: 'inventory_check',
      durationMs: 1500,
      status: 'failed'
    },
    {
      id: '3',
      type: 'assistant',
      title: 'AI: Error response',
      timestamp: new Date('2024-11-03T10:00:03'),
      summary: "I couldn't access the inventory. Please try again.",
      status: 'complete'
    }
  ])

  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleJumpTo = (event) => {
    setSelectedEvent(event.id)
    console.log('Jumped to event:', event.title)
    // In real app: scroll to message, highlight it, etc.
  }

  const handleRetry = (step) => {
    console.log('Retrying step:', step.title)
    // In real app: re-run the failed tool call
    setEvents(prev => prev.map(e =>
      e.id === step.id
        ? { ...e, status: 'complete', summary: 'Retry successful! Found 42 units.' }
        : e
    ))
  }

  const handleViewLogs = (step) => {
    alert(\`Logs for: \${step.title}\\n\\nTimestamp: \${step.timestamp}\\nDuration: \${step.durationMs}ms\`)
  }

  return (
    <div className="space-y-4">
      {selectedEvent && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm">
          Currently viewing event: <strong>{selectedEvent}</strong>
        </div>
      )}
      
      <ConversationTimeline
        events={events}
        onJumpToEvent={handleJumpTo}
        onRetry={handleRetry}
        onOpenLogs={handleViewLogs}
        showStatusIndicators={true}
      />
    </div>
  )
}

export default InteractiveTimeline`}
          height="550px"
        />
      </section>

      <section className="docs-section">
        <h2>Real-World Example: Agent Debugging Dashboard</h2>
        <p>
          Build a debugging interface to see exactly what your AI agent did.
        </p>
        <LiveDemo
          title="Agent Debug Dashboard"
          code={`import { ConversationTimeline } from '@clarity-chat/react'
import { useState } from 'react'

function AgentDebugDashboard() {
  // Simulate a complex agent workflow
  const [events] = useState([
    {
      id: '1',
      type: 'user',
      title: 'User: Analyze sales trend',
      timestamp: new Date('2024-11-03T14:23:10'),
      summary: 'Show me the sales trend for Product X over the last 6 months',
      status: 'complete'
    },
    {
      id: '2',
      type: 'system',
      title: 'System: Planning agent actions',
      timestamp: new Date('2024-11-03T14:23:11'),
      summary: 'Determined need for database query + chart generation',
      durationMs: 150,
      status: 'complete',
      metadata: [
        { label: 'Plan', value: 'Multi-step' },
        { label: 'Tools needed', value: '2' }
      ]
    },
    {
      id: '3',
      type: 'tool',
      title: 'Tool: Sales database query',
      timestamp: new Date('2024-11-03T14:23:12'),
      summary: 'SELECT * FROM sales WHERE product_id=X AND date > 6_months_ago',
      tool: 'sql_query',
      durationMs: 2340,
      status: 'complete',
      outputPreview: 'Retrieved 1,247 records',
      metadata: [
        { label: 'Rows', value: '1,247' },
        { label: 'Columns', value: '8' }
      ]
    },
    {
      id: '4',
      type: 'tool',
      title: 'Tool: Generate chart',
      timestamp: new Date('2024-11-03T14:23:15'),
      summary: 'Creating line chart visualization...',
      tool: 'chart_generator',
      durationMs: 890,
      status: 'complete',
      metadata: [
        { label: 'Chart type', value: 'Line' },
        { label: 'Data points', value: '6' }
      ]
    },
    {
      id: '5',
      type: 'assistant',
      title: 'AI: Final response',
      timestamp: new Date('2024-11-03T14:23:17'),
      summary: 'Generated comprehensive answer with chart and analysis',
      durationMs: 1800,
      status: 'complete',
      metadata: [
        { label: 'Model', value: 'gpt-4' },
        { label: 'Tokens', value: '842' }
      ]
    }
  ])

  const totalDuration = events.reduce((sum, e) => sum + (e.durationMs || 0), 0)
  const toolCalls = events.filter(e => e.type === 'tool').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground">Total Time</div>
          <div className="text-lg font-semibold">{(totalDuration / 1000).toFixed(1)}s</div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground">Events</div>
          <div className="text-lg font-semibold">{events.length}</div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground">Tool Calls</div>
          <div className="text-lg font-semibold">{toolCalls}</div>
        </div>
      </div>

      <ConversationTimeline
        events={events}
        title="Agent Execution Trace"
        subtitle="See every step the AI agent took"
        showStatusIndicators={true}
        onJumpToEvent={(e) => console.log('Jump to:', e.title)}
      />
    </div>
  )
}

export default AgentDebugDashboard`}
          height="700px"
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="ConversationTimeline Props"
          data={timelineProps}
        />
      </section>

      <section className="docs-section">
        <h2>Event Types</h2>
        <p>Each event type has its own visual style:</p>
        <ul>
          <li><strong>user</strong> 👤 - User messages (blue)</li>
          <li><strong>assistant</strong> 🤖 - AI responses (sky blue)</li>
          <li><strong>tool</strong> ✨ - Tool/function calls (amber)</li>
          <li><strong>system</strong> 🔍 - System events (emerald)</li>
          <li><strong>note</strong> 📄 - Developer notes (purple)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        
        <h3>When to Use</h3>
        <ul>
          <li>✅ Debugging AI agent behavior</li>
          <li>✅ Admin dashboards for conversation auditing</li>
          <li>✅ Showing users "how the AI thought"</li>
          <li>✅ Developer tools and analytics</li>
        </ul>

        <h3>Guidelines</h3>
        <ul>
          <li>Use clear, descriptive titles for each event</li>
          <li>Add duration for performance-sensitive operations</li>
          <li>Include relevant metadata for debugging</li>
          <li>Show status indicators for long-running operations</li>
          <li>Provide retry functionality for failed steps</li>
        </ul>

        <Callout type="warning" title="Not for Regular Chat UI">
          This is a technical/debugging component. For regular chat interfaces,
          use <code>MessageList</code> instead.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre><code>{`import { 
  ConversationTimeline, 
  type ConversationTimelineProps,
  type ConversationTimelineEvent 
} from '@clarity-chat/react'

// Event structure
interface ConversationTimelineEvent {
  id: string
  type: 'user' | 'assistant' | 'tool' | 'system' | 'note'
  title: string
  timestamp: Date
  summary?: string
  metadata?: Array<{ label: string; value: string }>
  durationMs?: number
  status?: 'pending' | 'complete' | 'error'
  icon?: React.ReactNode
}

// Usage
const events: ConversationTimelineEvent[] = [
  {
    id: '1',
    type: 'tool',
    title: 'Database Query',
    timestamp: new Date(),
    tool: 'sql_query',
    durationMs: 1200,
    status: 'complete'
  }
]`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/message-list" className="docs-card">
            <h3>Message List</h3>
            <p>Standard chat message display</p>
          </a>
          <a href="/reference/components/agent-run-feed" className="docs-card">
            <h3>Agent Run Feed</h3>
            <p>Agent execution steps</p>
          </a>
          <a href="/reference/components/tool-invocation-card" className="docs-card">
            <h3>Tool Invocation Card</h3>
            <p>Individual tool call details</p>
          </a>
          <a href="/reference/hooks/use-chat" className="docs-card">
            <h3>useChat</h3>
            <p>Chat state management</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const timelineProps = [
  {
    name: 'events',
    type: 'ConversationTimelineEvent[]',
    required: true,
    description: 'Array of timeline events in chronological order'
  },
  {
    name: 'onJumpToEvent',
    type: '(event: ConversationTimelineEvent) => void',
    required: false,
    description: 'Callback when user clicks an event to jump to it'
  },
  {
    name: 'showStatusIndicators',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Show status badges for each event'
  },
  {
    name: 'title',
    type: 'string',
    required: false,
    default: "'Conversation timeline'",
    description: 'Timeline header title'
  },
  {
    name: 'subtitle',
    type: 'string',
    required: false,
    description: 'Timeline header subtitle/description'
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes'
  }
]

