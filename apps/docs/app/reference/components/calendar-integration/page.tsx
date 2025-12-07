import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CalendarIntegration - Clarity Chat Components',
  description: 'Integrate with calendar systems to create events, check availability, and convert action items to calendar events.',
}

const props: Prop[] = [
  {
    name: 'initialEvents',
    type: 'CalendarEvent[]',
    description: 'Initial events',
  },
  {
    name: 'actionItems',
    type: 'ActionItem[]',
    description: 'Action items from conversation',
  },
  {
    name: 'dateRange',
    type: '{ start: Date; end: Date }',
    description: 'Date range to display',
  },
  {
    name: 'showActionItems',
    type: 'boolean',
    description: 'Show action items section',
  },
  {
    name: 'showAvailability',
    type: 'boolean',
    description: 'Show availability view',
  },
  {
    name: 'onEventCreate',
    type: '(event: Omit<CalendarEvent, "id">) => Promise<CalendarEvent>',
    description: 'Callback when event created',
  },
  {
    name: 'onEventUpdate',
    type: '(event: CalendarEvent) => Promise<CalendarEvent>',
    description: 'Callback when event updated',
  },
  {
    name: 'onEventDelete',
    type: '(eventId: string) => Promise<void>',
    description: 'Callback when event deleted',
  },
  {
    name: 'onActionToEvent',
    type: '(actionItem: ActionItem) => Promise<CalendarEvent>',
    description: 'Callback when action item converted to event',
  },
  {
    name: 'fetchEvents',
    type: '(start: Date, end: Date) => Promise<CalendarEvent[]>',
    description: 'Fetch events function',
  },
  {
    name: 'fetchAvailability',
    type: '(start: Date, end: Date) => Promise<AvailabilitySlot[]>',
    description: 'Fetch availability function',
  },
]

export default function CalendarIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>CalendarIntegration</h1>
        <p className="docs-lead">
          Integrate with calendar systems to create events, check availability, convert action items to events, and manage calendar data.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Display calendar events',
          'Create and manage events',
          'Check availability',
          'Convert action items to events',
          'Sync with calendar providers',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Display calendar events:
        </p>
        <CodePlayground
          initialCode={`import { CalendarIntegration } from '@clarity-chat/react'

function CalendarView() {
  return (
    <CalendarIntegration
      dateRange={{
        start: new Date(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
      }}
      fetchEvents={async (start, end) => {
        const response = await fetch(\`/api/calendar/events?start=\${start}&end=\${end}\`)
        return response.json()
      }}
      onEventCreate={async (event) => {
        const response = await fetch('/api/calendar/events', {
          method: 'POST',
          body: JSON.stringify(event),
        })
        return response.json()
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Action Items to Events</h2>
        <p>
          Convert action items from conversations to calendar events:
        </p>
        <CodePlayground
          initialCode={`import { CalendarIntegration } from '@clarity-chat/react'

function ActionItemsToEvents({ actionItems }: { actionItems: ActionItem[] }) {
  return (
    <CalendarIntegration
      actionItems={actionItems}
      showActionItems={true}
      onActionToEvent={async (actionItem) => {
        const event = {
          title: actionItem.title,
          description: actionItem.description,
          start: actionItem.dueDate || new Date(),
          end: new Date((actionItem.dueDate || new Date()).getTime() + 60 * 60 * 1000), // 1 hour
        }
        const response = await fetch('/api/calendar/events', {
          method: 'POST',
          body: JSON.stringify(event),
        })
        return response.json()
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Availability Check</h2>
        <p>
          Check availability for scheduling:
        </p>
        <CodePlayground
          initialCode={`import { CalendarIntegration } from '@clarity-chat/react'

function AvailabilityView() {
  return (
    <CalendarIntegration
      showAvailability={true}
      fetchAvailability={async (start, end) => {
        const response = await fetch(\`/api/calendar/availability?start=\${start}&end=\${end}\`)
        return response.json()
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Event Management</h2>
        <p>
          Create, update, and delete events:
        </p>
        <CodePlayground
          initialCode={`import { CalendarIntegration } from '@clarity-chat/react'

function EventManagement() {
  return (
    <CalendarIntegration
      onEventCreate={async (event) => {
        // Create event
        const response = await fetch('/api/calendar/events', {
          method: 'POST',
          body: JSON.stringify(event),
        })
        return response.json()
      }}
      onEventUpdate={async (event) => {
        // Update event
        const response = await fetch(\`/api/calendar/events/\${event.id}\`, {
          method: 'PUT',
          body: JSON.stringify(event),
        })
        return response.json()
      }}
      onEventDelete={async (eventId) => {
        // Delete event
        await fetch(\`/api/calendar/events/\${eventId}\`, {
          method: 'DELETE',
        })
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Event Properties</h2>
        <ul>
          <li><code>title</code>: Event title</li>
          <li><code>description</code>: Event description</li>
          <li><code>start</code>: Start date/time</li>
          <li><code>end</code>: End date/time</li>
          <li><code>location</code>: Event location</li>
          <li><code>attendees</code>: Event attendees</li>
          <li><code>isAllDay</code>: Whether event is all-day</li>
          <li><code>isRecurring</code>: Whether event recurs</li>
          <li><code>status</code>: Event status (confirmed, tentative, cancelled)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use <code>fetchEvents</code> to load events for date range</li>
          <li>Convert action items to events for better organization</li>
          <li>Check availability before scheduling meetings</li>
          <li>Handle event creation/update/delete with proper error handling</li>
          <li>Sync with calendar providers for real-time updates</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/hooks/use-calendar-integration">useCalendarIntegration</a> - Calendar integration hook</li>
          <li><a href="/reference/hooks/use-availability-check">useAvailabilityCheck</a> - Availability checking hook</li>
          <li><a href="/reference/components/conversation-summarizer">ConversationSummarizer</a> - Extract action items</li>
        </ul>
      </section>
    </div>
  )
}
