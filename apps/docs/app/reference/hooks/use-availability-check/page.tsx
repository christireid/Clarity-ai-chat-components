import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useAvailabilityCheck - Clarity Chat Components',
  description:
    'Hook for checking calendar availability and finding free time slots.',
}

const optionsProps: Prop[] = [
  {
    name: 'apiEndpoint',
    type: 'string',
    description: 'API endpoint for availability checks',
  },
  {
    name: 'apiKey',
    type: 'string',
    description: 'API key for authentication',
  },
  {
    name: 'defaultDuration',
    type: 'number',
    description: 'Default meeting duration in minutes (default: 30)',
  },
]

export default function UseAvailabilityCheckPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useAvailabilityCheck</h1>
        <p className="docs-lead">
          Hook for checking calendar availability, finding free time slots, and
          suggesting meeting times.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Check availability for date ranges',
          'Find free time slots',
          'Suggest meeting times',
          'Check multiple calendars',
          'Handle busy/tentative slots',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Check availability:</p>
        <CodePlayground
          initialCode={`import { useAvailabilityCheck } from '@clarity-chat/react/internal'

function AvailabilityView() {
  const {
    availability,
    loading,
    checkAvailability,
    findFreeSlots,
  } = useAvailabilityCheck()

  const handleCheck = async () => {
    const start = new Date('2025-01-20T09:00:00')
    const end = new Date('2025-01-20T17:00:00')
    
    const slots = await checkAvailability(start, end)
    logger.debug('Availability:', slots)
  }

  return (
    <div>
      <button onClick={handleCheck}>Check Availability</button>
      {loading && <div>Checking...</div>}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Find Free Slots</h2>
        <p>Find free time slots for meetings:</p>
        <CodePlayground
          initialCode={`import { useAvailabilityCheck } from '@clarity-chat/react/internal'

function FreeSlotFinder() {
  const { findFreeSlots } = useAvailabilityCheck({
    defaultDuration: 60, // 1 hour
  })

  const findSlots = async () => {
    const start = new Date('2025-01-20T09:00:00')
    const end = new Date('2025-01-20T17:00:00')
    const duration = 60 // minutes
    
    const freeSlots = await findFreeSlots(start, end, duration)
    
    if (freeSlots.length > 0) {
      logger.debug('Available slots:', freeSlots)
    } else {
      logger.debug('No free slots found')
    }
  }

  return <button onClick={findSlots}>Find Free Slots</button>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Suggest Meeting Times</h2>
        <p>Suggest optimal meeting times:</p>
        <CodePlayground
          initialCode={`import { useAvailabilityCheck } from '@clarity-chat/react/internal'

function MeetingTimeSuggestions() {
  const { suggestMeetingTime } = useAvailabilityCheck()

  const getSuggestions = async () => {
    const start = new Date('2025-01-20T09:00:00')
    const end = new Date('2025-01-20T17:00:00')
    const duration = 30 // minutes
    const attendees = ['alice@example.com', 'bob@example.com']
    
    const suggestions = await suggestMeetingTime(start, end, duration, attendees)
    
    logger.debug('Suggested times:', suggestions)
  }

  return <button onClick={getSuggestions}>Get Suggestions</button>
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
            <code>availability</code>: Array of availability slots
          </li>
          <li>
            <code>loading</code>: Whether operation is in progress
          </li>
          <li>
            <code>checkAvailability</code>: Function to check availability for
            date range
          </li>
          <li>
            <code>findFreeSlots</code>: Function to find free time slots
          </li>
          <li>
            <code>suggestMeetingTime</code>: Function to suggest meeting times
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Availability Slot Status</h2>
        <ul>
          <li>
            <strong>free</strong>: Time slot is available
          </li>
          <li>
            <strong>busy</strong>: Time slot is busy
          </li>
          <li>
            <strong>tentative</strong>: Time slot is tentatively busy
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Check availability before scheduling meetings</li>
          <li>
            Use <code>findFreeSlots</code> to find available time slots
          </li>
          <li>
            Use <code>suggestMeetingTime</code> for optimal scheduling
          </li>
          <li>Consider multiple calendars when checking availability</li>
          <li>Handle busy/tentative slots appropriately</li>
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
            <a href="/reference/hooks/use-calendar-integration">
              useCalendarIntegration
            </a>{' '}
            - Calendar integration hook
          </li>
        </ul>
      </section>
    </div>
  )
}
