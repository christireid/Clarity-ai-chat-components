'use client'

import React, { useState } from 'react'
import {
  ConversationTimeline,
  type ConversationTimelineEvent,
} from '@clarity-chat/react/extended'
import { Badge } from '@clarity-chat/primitives'

export default function ConversationTimelinePage() {
  const [events, setEvents] = useState<ConversationTimelineEvent[]>([
    {
      id: '1',
      type: 'user',
      title: 'User Message',
      timestamp: new Date(Date.now() - 600000),
      summary: 'Can you help me understand React hooks?',
      durationMs: 500,
      status: 'complete',
      metadata: [
        { label: 'Tokens', value: '12' },
        { label: 'Model', value: 'gpt-4' },
      ],
    },
    {
      id: '2',
      type: 'assistant',
      title: 'AI Response',
      timestamp: new Date(Date.now() - 590000),
      summary:
        'React hooks are functions that let you use state and other React features...',
      durationMs: 2300,
      status: 'complete',
      metadata: [
        { label: 'Tokens', value: '245' },
        { label: 'Model', value: 'gpt-4' },
      ],
    },
    {
      id: '3',
      type: 'tool',
      title: 'Code Search',
      timestamp: new Date(Date.now() - 580000),
      summary: 'Searched codebase for React hooks examples',
      durationMs: 1500,
      status: 'complete',
      metadata: [
        { label: 'Results', value: '15' },
        { label: 'Tool', value: 'code_search' },
      ],
    },
    {
      id: '4',
      type: 'system',
      title: 'Context Update',
      timestamp: new Date(Date.now() - 570000),
      summary: 'Added conversation to long-term memory',
      durationMs: 300,
      status: 'complete',
    },
    {
      id: '5',
      type: 'user',
      title: 'Follow-up Question',
      timestamp: new Date(Date.now() - 120000),
      summary: 'What about useEffect cleanup functions?',
      durationMs: 400,
      status: 'complete',
    },
    {
      id: '6',
      type: 'assistant',
      title: 'AI Response',
      timestamp: new Date(Date.now() - 110000),
      summary: 'Cleanup functions in useEffect are used to...',
      durationMs: 1800,
      status: 'pending',
      metadata: [{ label: 'Tokens', value: '189' }],
    },
  ])

  const [filteredType, setFilteredType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEvents = events.filter((event) => {
    const matchesType = filteredType === 'all' || event.type === filteredType
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.summary?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleJumpToEvent = (event: ConversationTimelineEvent) => {
    alert(`Jumping to event: ${event.title}\nID: ${event.id}`)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Reference</span>
          <span>/</span>
          <span>Components</span>
          <span>/</span>
          <span className="text-foreground">ConversationTimeline</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold">ConversationTimeline</h1>
          <Badge variant="warning">Beta</Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          Visual timeline showing conversation events including user messages, assistant
          responses, tool calls, and system events with chronological tracking.
        </p>
      </div>

      {/* Live Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Live Demo</h2>

        {/* Filtering Controls */}
        <div className="mb-4 p-4 border rounded-lg bg-card space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Filter by type:
            </span>
            <button
              onClick={() => setFilteredType('all')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filteredType === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilteredType('user')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filteredType === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              User
            </button>
            <button
              onClick={() => setFilteredType('assistant')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filteredType === 'assistant'
                  ? 'bg-sky-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Assistant
            </button>
            <button
              onClick={() => setFilteredType('tool')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filteredType === 'tool'
                  ? 'bg-amber-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Tool
            </button>
            <button
              onClick={() => setFilteredType('system')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filteredType === 'system'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              System
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-2 text-sm border rounded-md hover:bg-muted"
              >
                Clear
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <ConversationTimeline
            events={filteredEvents}
            onJumpToEvent={handleJumpToEvent}
            showStatusIndicators={true}
          />
        </div>
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">CLI Installation</h3>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
              <code>npx clarity-chat add conversation-timeline</code>
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Manual Installation</h3>
            <p className="text-muted-foreground mb-2">
              Copy the component to your project:
            </p>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
              <code>{`// components/conversation/ConversationTimeline.tsx
import { ConversationTimeline } from '@clarity-chat/react/extended';

// Or copy from the source below`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Basic Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`import {
  ConversationTimeline,
  type ConversationTimelineEvent,
} from '@clarity-chat/react/extended';

function ConversationHistory() {
  const events: ConversationTimelineEvent[] = [
    {
      id: '1',
      type: 'user',
      title: 'User Message',
      timestamp: new Date(),
      summary: 'How does React work?',
      status: 'complete',
    },
    {
      id: '2',
      type: 'assistant',
      title: 'AI Response',
      timestamp: new Date(),
      summary: 'React is a JavaScript library...',
      durationMs: 2000,
      status: 'complete',
      metadata: [
        { label: 'Tokens', value: '245' },
        { label: 'Model', value: 'gpt-4' },
      ],
    },
  ];

  return (
    <ConversationTimeline
      events={events}
      onJumpToEvent={(event) => console.log('Jump to:', event.id)}
      showStatusIndicators={true}
    />
  );
}`}</code>
        </pre>
      </section>

      {/* Props Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Prop</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Default</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>events</code>
                </td>
                <td className="py-3 px-4">
                  <code>ConversationTimelineEvent[]</code>
                </td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4">
                  Array of timeline events to display
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onJumpToEvent</code>
                </td>
                <td className="py-3 px-4">
                  <code>(event) =&gt; void</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">
                  Callback when user clicks "Jump to moment"
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>showStatusIndicators</code>
                </td>
                <td className="py-3 px-4">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4">
                  <code>true</code>
                </td>
                <td className="py-3 px-4">Display status badges on events</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>className</code>
                </td>
                <td className="py-3 px-4">
                  <code>string</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Additional CSS classes</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>title</code>
                </td>
                <td className="py-3 px-4">
                  <code>string</code>
                </td>
                <td className="py-3 px-4">
                  <code>"Conversation timeline"</code>
                </td>
                <td className="py-3 px-4">Custom title for the timeline</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>subtitle</code>
                </td>
                <td className="py-3 px-4">
                  <code>string</code>
                </td>
                <td className="py-3 px-4">Default description</td>
                <td className="py-3 px-4">Custom subtitle for the timeline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Event Types */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          ConversationTimelineEvent Interface
        </h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`interface ConversationTimelineEvent {
  id: string;                    // Unique identifier
  type: TimelineEventType;       // Event type
  title: string;                 // Event title
  timestamp: Date;               // When the event occurred
  summary?: string;              // Brief description
  metadata?: Array<{             // Additional key-value pairs
    label: string;
    value: string;
  }>;
  durationMs?: number;           // Duration in milliseconds
  status?: 'pending' | 'complete' | 'error';  // Event status
  icon?: React.ReactNode;        // Custom icon override
}

type TimelineEventType =
  | 'user'        // User messages
  | 'assistant'   // AI responses
  | 'tool'        // Tool calls
  | 'system'      // System events
  | 'note';       // Notes/annotations`}</code>
        </pre>
      </section>

      {/* Event Types Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Event Types</h2>
        <div className="p-6 border rounded-lg bg-card">
          <ConversationTimeline
            events={[
              {
                id: 'demo-1',
                type: 'user',
                title: 'User Event',
                timestamp: new Date(Date.now() - 300000),
                summary: 'Primary color with gradient background',
              },
              {
                id: 'demo-2',
                type: 'assistant',
                title: 'Assistant Event',
                timestamp: new Date(Date.now() - 250000),
                summary: 'Sky blue color for AI responses',
              },
              {
                id: 'demo-3',
                type: 'tool',
                title: 'Tool Event',
                timestamp: new Date(Date.now() - 200000),
                summary: 'Amber color for tool executions',
              },
              {
                id: 'demo-4',
                type: 'system',
                title: 'System Event',
                timestamp: new Date(Date.now() - 150000),
                summary: 'Emerald color for system notifications',
              },
              {
                id: 'demo-5',
                type: 'note',
                title: 'Note Event',
                timestamp: new Date(Date.now() - 100000),
                summary: 'Purple color for user annotations',
              },
            ]}
            showStatusIndicators={false}
          />
        </div>
      </section>

      {/* Status Indicators */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Status Indicators</h2>
        <div className="p-6 border rounded-lg bg-card">
          <ConversationTimeline
            events={[
              {
                id: 'status-1',
                type: 'assistant',
                title: 'Pending Response',
                timestamp: new Date(Date.now() - 10000),
                summary: 'Currently processing...',
                status: 'pending',
              },
              {
                id: 'status-2',
                type: 'tool',
                title: 'Completed Search',
                timestamp: new Date(Date.now() - 30000),
                summary: 'Successfully retrieved 15 results',
                status: 'complete',
                durationMs: 1200,
              },
              {
                id: 'status-3',
                type: 'system',
                title: 'Failed Update',
                timestamp: new Date(Date.now() - 50000),
                summary: 'Unable to save conversation',
                status: 'error',
              },
            ]}
            showStatusIndicators={true}
          />
        </div>
      </section>

      {/* Advanced Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Advanced Usage</h2>
        <h3 className="text-lg font-medium mb-3">
          With Filtering and Navigation
        </h3>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`function ConversationViewer() {
  const [events, setEvents] = useState<ConversationTimelineEvent[]>([]);
  const [filter, setFilter] = useState<TimelineEventType | 'all'>('all');

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.type === filter);

  const handleJumpToEvent = (event: ConversationTimelineEvent) => {
    // Scroll to message in conversation
    document.getElementById(\`message-\${event.id}\`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All Events</option>
        <option value="user">User Messages</option>
        <option value="assistant">AI Responses</option>
        <option value="tool">Tool Calls</option>
        <option value="system">System Events</option>
      </select>

      <ConversationTimeline
        events={filteredEvents}
        onJumpToEvent={handleJumpToEvent}
      />
    </div>
  );
}`}</code>
        </pre>
      </section>

      {/* Accessibility */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>

        <h3 className="text-lg font-medium mb-3">WCAG Compliance</h3>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Standard</th>
              <th className="text-left py-2 px-4">Level</th>
              <th className="text-left py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">WCAG 2.2</td>
              <td className="py-2 px-4">AA</td>
              <td className="py-2 px-4">✅ Compliant</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Section 508</td>
              <td className="py-2 px-4">-</td>
              <td className="py-2 px-4">✅ Compliant</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-lg font-medium mb-3">Features</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✅ Semantic HTML with proper heading hierarchy</li>
          <li>✅ ARIA landmarks for screen readers</li>
          <li>✅ Keyboard navigation support</li>
          <li>✅ Focus indicators on interactive elements</li>
          <li>✅ Color contrast meets WCAG AA standards</li>
          <li>✅ Reduced motion support</li>
          <li>✅ Screen reader announcements for status changes</li>
        </ul>

        <h3 className="text-lg font-medium mt-6 mb-3">Keyboard Navigation</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Key</th>
              <th className="text-left py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">
                <kbd>Tab</kbd>
              </td>
              <td className="py-2 px-4">Navigate to next interactive element</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">
                <kbd>Shift + Tab</kbd>
              </td>
              <td className="py-2 px-4">
                Navigate to previous interactive element
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">
                <kbd>Enter</kbd> / <kbd>Space</kbd>
              </td>
              <td className="py-2 px-4">Activate "Jump to moment" button</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Performance */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Performance</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Optimizations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Memoized event sorting</li>
              <li>✅ Conditional animations based on reduced motion preference</li>
              <li>✅ Efficient re-renders with React keys</li>
              <li>✅ Lazy loading of animations with AnimatePresence</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Best Practices</h3>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
              <code>{`// For large event lists, consider virtual scrolling
import { useVirtualizer } from '@tanstack/react-virtual';

function LargeTimeline({ events }: { events: ConversationTimelineEvent[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <ConversationTimeline events={events} />
    </div>
  );
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Related</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="/reference/components/conversation-list"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">ConversationList</h3>
            <p className="text-sm text-muted-foreground">
              Display and manage multiple conversations with sorting and filtering.
            </p>
          </a>
          <a
            href="/reference/components/message-thread-view"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">MessageThreadView</h3>
            <p className="text-sm text-muted-foreground">
              View threaded message conversations with branching support.
            </p>
          </a>
          <a
            href="/reference/components/conversation-branch-visualizer"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">ConversationBranchVisualizer</h3>
            <p className="text-sm text-muted-foreground">
              Visualize conversation branches and alternative paths.
            </p>
          </a>
          <a
            href="/reference/hooks/use-clarity-chat"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">useClarityChat</h3>
            <p className="text-sm text-muted-foreground">
              Main hook for managing chat state and conversation history.
            </p>
          </a>
        </div>
      </section>
    </main>
  )
}
