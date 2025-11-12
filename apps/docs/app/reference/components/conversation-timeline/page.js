import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { LiveDemo } from '@/components/Demo/LiveDemo';
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'Conversation Timeline - Clarity Chat Components',
    description: 'Visual timeline showing conversation flow with user messages, AI responses, tool calls, and system events.',
};
export default function ConversationTimelinePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Conversation Timeline" }), _jsx("p", { className: "docs-lead", children: "A visual timeline that shows how your conversation evolved - user messages, AI responses, tool calls, and system events all in chronological order." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "Think of this like a \"behind the scenes\" view of your AI chat. Instead of just seeing the chat bubbles, you see EVERYTHING that happened: when you asked a question, when the AI thought about it, when it called external tools, and when it responded." }), _jsx(Callout, { type: "info", title: "Why Use This?", children: "Perfect for debugging, understanding AI behavior, showing transparency to users, or building admin dashboards that need to audit conversations." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(LiveDemo, { title: "Simple Timeline", code: `import { ConversationTimeline } from '@clarity-chat/react'

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

export default SimpleTimeline`, height: "400px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Event Types" }), _jsx("p", { children: "Different event types are color-coded to make it easy to scan the timeline." }), _jsx(LiveDemo, { title: "All Event Types", code: `import { ConversationTimeline } from '@clarity-chat/react'

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

export default EventTypes`, height: "500px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Metadata" }), _jsx("p", { children: "Add extra details like tokens used, model name, or any custom data." }), _jsx(LiveDemo, { title: "Timeline with Metadata", code: `import { ConversationTimeline } from '@clarity-chat/react'

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

export default MetadataTimeline`, height: "400px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Interactive Timeline" }), _jsx("p", { children: "Click events to jump to that point in the conversation, or retry failed steps." }), _jsx(LiveDemo, { title: "Interactive Timeline Example", code: `import { ConversationTimeline } from '@clarity-chat/react'
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

export default InteractiveTimeline`, height: "550px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Real-World Example: Agent Debugging Dashboard" }), _jsx("p", { children: "Build a debugging interface to see exactly what your AI agent did." }), _jsx(LiveDemo, { title: "Agent Debug Dashboard", code: `import { ConversationTimeline } from '@clarity-chat/react'
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

export default AgentDebugDashboard`, height: "700px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "ConversationTimeline Props", data: timelineProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Event Types" }), _jsx("p", { children: "Each event type has its own visual style:" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "user" }), " \uD83D\uDC64 - User messages (blue)"] }), _jsxs("li", { children: [_jsx("strong", { children: "assistant" }), " \uD83E\uDD16 - AI responses (sky blue)"] }), _jsxs("li", { children: [_jsx("strong", { children: "tool" }), " \u2728 - Tool/function calls (amber)"] }), _jsxs("li", { children: [_jsx("strong", { children: "system" }), " \uD83D\uDD0D - System events (emerald)"] }), _jsxs("li", { children: [_jsx("strong", { children: "note" }), " \uD83D\uDCC4 - Developer notes (purple)"] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx("h3", { children: "When to Use" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Debugging AI agent behavior" }), _jsx("li", { children: "\u2705 Admin dashboards for conversation auditing" }), _jsx("li", { children: "\u2705 Showing users \"how the AI thought\"" }), _jsx("li", { children: "\u2705 Developer tools and analytics" })] }), _jsx("h3", { children: "Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Use clear, descriptive titles for each event" }), _jsx("li", { children: "Add duration for performance-sensitive operations" }), _jsx("li", { children: "Include relevant metadata for debugging" }), _jsx("li", { children: "Show status indicators for long-running operations" }), _jsx("li", { children: "Provide retry functionality for failed steps" })] }), _jsxs(Callout, { type: "warning", title: "Not for Regular Chat UI", children: ["This is a technical/debugging component. For regular chat interfaces, use ", _jsx("code", { children: "MessageList" }), " instead."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("pre", { children: _jsx("code", { children: `import { 
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
]` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/message-list", className: "docs-card", children: [_jsx("h3", { children: "Message List" }), _jsx("p", { children: "Standard chat message display" })] }), _jsxs("a", { href: "/reference/components/agent-run-feed", className: "docs-card", children: [_jsx("h3", { children: "Agent Run Feed" }), _jsx("p", { children: "Agent execution steps" })] }), _jsxs("a", { href: "/reference/components/tool-invocation-card", className: "docs-card", children: [_jsx("h3", { children: "Tool Invocation Card" }), _jsx("p", { children: "Individual tool call details" })] }), _jsxs("a", { href: "/reference/hooks/use-chat", className: "docs-card", children: [_jsx("h3", { children: "useChat" }), _jsx("p", { children: "Chat state management" })] })] })] })] }));
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
];
//# sourceMappingURL=page.js.map