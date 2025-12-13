import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useCalendarIntegration - Clarity Chat Components',
  description:
    'Hook for integrating with calendar systems to manage events, check availability, and convert action items.',
}

const optionsProps: Prop[] = [
  {
    name: 'apiEndpoint',
    type: 'string',
    description: 'API endpoint for calendar operations',
  },
  {
    name: 'apiKey',
    type: 'string',
    description: 'API key for authentication',
  },
]

export default function UseCalendarIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useCalendarIntegration</h1>
        <p className="docs-lead">
          Hook for integrating with calendar systems to create events, check
          availability, convert action items to events, and manage calendar
          data.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Fetch calendar events',
          'Create and manage events',
          'Check availability',
          'Convert action items to events',
          'Sync with calendar providers',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Integrate with calendar systems:</p>
        <CodePlayground
          initialCode={`import { useCalendarIntegration } from '@clarity-chat/react'

function CalendarManager() {
  const {
    events,
    actionItems,
    availability,
    loading,
    fetchEvents,
    createEvent,
    checkAvailability,
  } = useCalendarIntegration({
    apiEndpoint: '/api/calendar',
  })

  React.useEffect(() => {
    const start = new Date()
    const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    fetchEvents(start, end)
  }, [])

  return (
    <div>
      {loading && <div>Loading...</div>}
      {events.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Create Events</h2>
        <p>Create calendar events:</p>
        <CodePlayground
          initialCode={`import { useCalendarIntegration } from '@clarity-chat/react'

function EventCreator() {
  const { createEvent } = useCalendarIntegration()

  const handleCreate = async () => {
    const event = await createEvent({
      title: 'Team Meeting',
      description: 'Weekly team sync',
      start: new Date('2025-01-20T10:00:00'),
      end: new Date('2025-01-20T11:00:00'),
      location: 'Conference Room A',
      attendees: [
        { email: 'alice@example.com', name: 'Alice' },
        { email: 'bob@example.com', name: 'Bob' },
      ],
    })
    console.log('Event created:', event.id)
  }

  return <button onClick={handleCreate}>Create Event</button>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Check Availability</h2>
        <p>Check availability for scheduling:</p>
        <CodePlayground
          initialCode={`import { useCalendarIntegration } from '@clarity-chat/react'

function AvailabilityChecker() {
  const { checkAvailability } = useCalendarIntegration()

  const findAvailableSlot = async () => {
    const start = new Date('2025-01-20T09:00:00')
    const end = new Date('2025-01-20T17:00:00')
    
    const slots = await checkAvailability(start, end)
    
    const freeSlots = slots.filter(slot => slot.status === 'free')
    if (freeSlots.length > 0) {
      console.log('Available slots:', freeSlots)
    }
  }

  return <button onClick={findAvailableSlot}>Check Availability</button>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Convert Action Items to Events</h2>
        <p>Convert action items from conversations to calendar events:</p>
        <CodePlayground
          initialCode={`import { useCalendarIntegration } from '@clarity-chat/react'

function ActionItemConverter({ actionItems }: { actionItems: ActionItem[] }) {
  const { convertActionToEvent } = useCalendarIntegration()

  const handleConvert = async (actionItem: ActionItem) => {
    const event = await convertActionToEvent(actionItem)
    console.log('Event created from action item:', event.id)
  }

  return (
    <div>
      {actionItems.map(item => (
        <div key={item.id}>
          {item.title}
          <button onClick={() => handleConvert(item)}>Add to Calendar</button>
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Options</h2>
        <PropsTable props={optionsProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li>
            <code>events</code>: Array of calendar events
          </li>
          <li>
            <code>actionItems</code>: Array of action items
          </li>
          <li>
            <code>availability</code>: Array of availability slots
          </li>
          <li>
            <code>loading</code>: Whether operation is in progress
          </li>
          <li>
            <code>fetchEvents</code>: Function to fetch events for date range
          </li>
          <li>
            <code>createEvent</code>: Function to create event
          </li>
          <li>
            <code>updateEvent</code>: Function to update event
          </li>
          <li>
            <code>deleteEvent</code>: Function to delete event
          </li>
          <li>
            <code>checkAvailability</code>: Function to check availability
          </li>
          <li>
            <code>convertActionToEvent</code>: Function to convert action item
            to event
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Fetch events for specific date ranges to improve performance</li>
          <li>Check availability before creating events</li>
          <li>Convert action items to events for better organization</li>
          <li>
            Handle event creation/update/delete with proper error handling
          </li>
          <li>Sync with calendar providers for real-time updates</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/calendar-integration">
              CalendarIntegration
            </a>{' '}
            - Calendar integration component
          </li>
          <li>
            <a href="/reference/hooks/use-availability-check">
              useAvailabilityCheck
            </a>{' '}
            - Availability checking hook
          </li>
          <li>
            <a href="/reference/components/conversation-summarizer">
              ConversationSummarizer
            </a>{' '}
            - Extract action items
          </li>
        </ul>
      </section>
    </div>
  )
}
