'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  Badge,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { ClockIcon, CheckIcon, RefreshIcon, CloseIcon } from './icons'

/**
 * Custom hook to track mounted state
 */
function useIsMounted() {
  const isMounted = React.useRef(false)
  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])
  return isMounted
}

/**
 * Calendar event
 */
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  location?: string
  attendees?: EventAttendee[]
  isAllDay?: boolean
  isRecurring?: boolean
  recurrence?: RecurrenceRule
  status?: 'confirmed' | 'tentative' | 'cancelled'
  visibility?: 'public' | 'private'
  reminders?: EventReminder[]
  conferenceUrl?: string
  calendarId?: string
  color?: string
}

/**
 * Event attendee
 */
export interface EventAttendee {
  email: string
  name?: string
  status: 'accepted' | 'declined' | 'tentative' | 'needs-action'
  isOrganizer?: boolean
}

/**
 * Event reminder
 */
export interface EventReminder {
  method: 'email' | 'popup' | 'sms'
  minutes: number
}

/**
 * Recurrence rule
 */
export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  until?: Date
  count?: number
  byDay?: string[]
}

/**
 * Action item extracted from conversation
 */
export interface ActionItem {
  id: string
  title: string
  description?: string
  dueDate?: Date
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  status: 'pending' | 'in-progress' | 'completed'
  source: 'conversation' | 'manual'
  messageId?: string
}

/**
 * Availability slot
 */
export interface AvailabilitySlot {
  start: Date
  end: Date
  status: 'free' | 'busy' | 'tentative'
}

/**
 * Calendar integration state
 */
interface CalendarIntegrationState {
  events: CalendarEvent[]
  actionItems: ActionItem[]
  availability: AvailabilitySlot[]
  loading: boolean
  error: string | null
}

/**
 * Props for CalendarIntegration
 */
export interface CalendarIntegrationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Initial events */
  initialEvents?: CalendarEvent[]
  /** Action items from conversation */
  actionItems?: ActionItem[]
  /** Date range to display */
  dateRange?: { start: Date; end: Date }
  /** Show action items section */
  showActionItems?: boolean
  /** Show availability view */
  showAvailability?: boolean
  /** Callback when event created */
  onEventCreate?: (event: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent>
  /** Callback when event updated */
  onEventUpdate?: (event: CalendarEvent) => Promise<CalendarEvent>
  /** Callback when event deleted */
  onEventDelete?: (eventId: string) => Promise<void>
  /** Callback when action item converted to event */
  onActionToEvent?: (actionItem: ActionItem) => Promise<CalendarEvent>
  /** Fetch events function */
  fetchEvents?: (start: Date, end: Date) => Promise<CalendarEvent[]>
  /** Fetch availability function */
  fetchAvailability?: (start: Date, end: Date) => Promise<AvailabilitySlot[]>
}

/**
 * Format time
 */
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

/**
 * Format date
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Format duration
 */
function formatDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

/**
 * Get event color
 */
function getEventColor(event: CalendarEvent): string {
  if (event.color) return event.color

  switch (event.status) {
    case 'confirmed':
      return '#3b82f6'
    case 'tentative':
      return '#f59e0b'
    case 'cancelled':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}

/**
 * Get priority color
 */
function getPriorityColor(priority: ActionItem['priority']): string {
  switch (priority) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    case 'low':
      return 'secondary'
    default:
      return 'secondary'
  }
}

/**
 * CalendarIntegration Component
 *
 * Calendar integration for:
 * - Viewing and managing events
 * - Converting action items to events
 * - Checking availability
 * - Scheduling from conversation
 */
export const CalendarIntegration = React.forwardRef<HTMLDivElement, CalendarIntegrationProps>(
  function CalendarIntegration(
    {
      initialEvents = [],
      actionItems: initialActionItems = [],
      dateRange,
      showActionItems = true,
      showAvailability = false,
      onEventCreate,
      onEventUpdate,
      onEventDelete,
      onActionToEvent,
      fetchEvents,
      fetchAvailability,
      className,
      ...props
    },
    ref
  ) {
  const isMounted = useIsMounted()
  const [state, setState] = React.useState<CalendarIntegrationState>({
    events: initialEvents,
    actionItems: initialActionItems,
    availability: [],
    loading: false,
    error: null,
  })

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())

  // Clear error helper
  const clearError = React.useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Calculate date range
  const range = React.useMemo(() => {
    if (dateRange) return dateRange

    const start = new Date(selectedDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(selectedDate)
    end.setDate(end.getDate() + 7)
    end.setHours(23, 59, 59, 999)

    return { start, end }
  }, [dateRange, selectedDate])

  // Load events
  const loadEvents = React.useCallback(async () => {
    if (!fetchEvents) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const events = await fetchEvents(range.start, range.end)
      if (isMounted.current) {
        setState(prev => ({ ...prev, events, loading: false }))
      }
    } catch (error) {
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to load events',
          loading: false,
        }))
      }
    }
  }, [fetchEvents, range, isMounted])

  // Load availability
  const loadAvailability = React.useCallback(async () => {
    if (!fetchAvailability) return

    try {
      const availability = await fetchAvailability(range.start, range.end)
      if (isMounted.current) {
        setState(prev => ({ ...prev, availability }))
      }
    } catch (error) {
      // Silently fail for availability (non-critical)
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load availability:', error)
      }
    }
  }, [fetchAvailability, range, isMounted])

  // Create event from action item
  const convertActionToEvent = React.useCallback(async (actionItem: ActionItem) => {
    if (!onActionToEvent) return

    setState(prev => ({ ...prev, loading: true }))

    try {
      const event = await onActionToEvent(actionItem)
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          events: [...prev.events, event],
          actionItems: prev.actionItems.map(a =>
            a.id === actionItem.id ? { ...a, status: 'completed' as const } : a
          ),
          loading: false,
        }))
      }
    } catch (error) {
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to create event',
          loading: false,
        }))
      }
    }
  }, [onActionToEvent, isMounted])

  // Delete event
  const deleteEvent = React.useCallback(async (eventId: string) => {
    if (!onEventDelete) return

    setState(prev => ({ ...prev, loading: true }))

    try {
      await onEventDelete(eventId)
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          events: prev.events.filter(e => e.id !== eventId),
          loading: false,
        }))
      }
    } catch (error) {
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to delete event',
          loading: false,
        }))
      }
    }
  }, [onEventDelete, isMounted])

  // Group events by date
  const eventsByDate = React.useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>()

    state.events
      .filter(e => e.status !== 'cancelled')
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .forEach(event => {
        const dateKey = formatDate(event.start)
        const existing = grouped.get(dateKey) || []
        grouped.set(dateKey, [...existing, event])
      })

    return grouped
  }, [state.events])

  // Load data on mount
  React.useEffect(() => {
    loadEvents()
    if (showAvailability) {
      loadAvailability()
    }
  }, [loadEvents, loadAvailability, showAvailability])

  return (
    <div ref={ref} className={cn('space-y-4', className)} role="region" aria-label="Calendar integration" {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Calendar</h3>
        <div className="flex items-center gap-2">
          {fetchEvents && (
            <Button
              variant="ghost"
              size="sm"
              onClick={loadEvents}
              disabled={state.loading}
              aria-label="Refresh calendar"
            >
              <RefreshIcon className={cn('w-4 h-4', state.loading && 'animate-spin')} />
            </Button>
          )}
          {onEventCreate && (
            <Button
              size="sm"
              disabled={state.loading}
              aria-label="Create new event"
            >
              New Event
            </Button>
          )}
        </div>
      </div>

      {/* Error display */}
      {state.error && (
        <div
          className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center justify-between"
          role="alert"
        >
          <span>{state.error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            aria-label="Dismiss error"
            className="ml-2 h-6 w-6 p-0"
          >
            <CloseIcon className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Action items */}
      {showActionItems && state.actionItems.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Action Items</span>
              <Badge variant="secondary">{state.actionItems.filter(a => a.status !== 'completed').length}</Badge>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {state.actionItems
                  .filter(a => a.status !== 'completed')
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(item.priority) as 'default'}>
                          {item.priority}
                        </Badge>
                        <span className="text-sm">{item.title}</span>
                        {item.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            Due {formatDate(item.dueDate)}
                          </span>
                        )}
                      </div>
                      {onActionToEvent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => convertActionToEvent(item)}
                          disabled={state.loading}
                        >
                          Schedule
                        </Button>
                      )}
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events by date */}
      {!state.loading && eventsByDate.size > 0 && (
        <div className="space-y-4">
          {Array.from(eventsByDate.entries()).map(([dateKey, events]) => (
            <Card key={dateKey}>
              <CardContent className="p-4">
                <div className="text-sm font-medium mb-3">{dateKey}</div>
                <div className="space-y-2">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                      {/* Time indicator */}
                      <div
                        className="w-1 h-full rounded-full self-stretch min-h-[40px]"
                        style={{ backgroundColor: getEventColor(event) }}
                      />

                      {/* Event details */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <ClockIcon className="w-3 h-3" />
                          {event.isAllDay ? (
                            'All day'
                          ) : (
                            <>
                              {formatTime(event.start)} - {formatTime(event.end)}
                              <span>({formatDuration(event.start, event.end)})</span>
                            </>
                          )}
                        </div>
                        {event.location && (
                          <div className="text-xs text-muted-foreground truncate">
                            {event.location}
                          </div>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {event.attendees.slice(0, 3).map((attendee, i) => (
                              <div
                                key={attendee.email}
                                className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs"
                                title={attendee.name || attendee.email}
                              >
                                {(attendee.name || attendee.email)[0].toUpperCase()}
                              </div>
                            ))}
                            {event.attendees.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{event.attendees.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {onEventDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteEvent(event.id)}
                          aria-label="Delete event"
                        >
                          Delete
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Loading state */}
      {state.loading && (
        <div className="flex items-center justify-center p-8">
          <RefreshIcon className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty state */}
      {!state.loading && eventsByDate.size === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <ClockIcon className="w-12 h-12 text-muted-foreground mb-3" />
          <div className="text-muted-foreground">No events scheduled</div>
        </div>
      )}

      {/* Availability view */}
      {showAvailability && state.availability.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-3">Availability</div>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Available time slots">
              {state.availability
                .filter(slot => slot.status === 'free')
                .slice(0, 6)
                .map((slot, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    role="listitem"
                  >
                    {formatDate(slot.start)} {formatTime(slot.start)}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
})

// Display name for debugging
CalendarIntegration.displayName = 'CalendarIntegration'

/**
 * Hook for calendar integration
 */
export function useCalendarIntegration(options: {
  apiEndpoint?: string
  apiKey?: string
  calendarId?: string
}) {
  const [events, setEvents] = React.useState<CalendarEvent[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch events
  const fetchEvents = React.useCallback(async (start: Date, end: Date): Promise<CalendarEvent[]> => {
    if (!options.apiEndpoint) return []

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
        ...(options.calendarId && { calendarId: options.calendarId }),
      })

      const response = await fetch(`${options.apiEndpoint}/events?${params}`, {
        headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      const fetchedEvents = (data.events || []).map((e: Record<string, unknown>) => ({
        ...e,
        start: new Date(e.start as string),
        end: new Date(e.end as string),
      }))

      setEvents(fetchedEvents)
      return fetchedEvents
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [options.apiEndpoint, options.apiKey, options.calendarId])

  // Create event
  const createEvent = React.useCallback(async (
    event: Omit<CalendarEvent, 'id'>
  ): Promise<CalendarEvent> => {
    if (!options.apiEndpoint) {
      throw new Error('No API endpoint configured')
    }

    const response = await fetch(`${options.apiEndpoint}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      throw new Error(`Failed to create event: HTTP ${response.status}`)
    }

    const created = await response.json()
    setEvents(prev => [...prev, created])
    return created
  }, [options.apiEndpoint, options.apiKey])

  // Delete event
  const deleteEvent = React.useCallback(async (eventId: string): Promise<void> => {
    if (!options.apiEndpoint) {
      throw new Error('No API endpoint configured')
    }

    const response = await fetch(`${options.apiEndpoint}/events/${eventId}`, {
      method: 'DELETE',
      headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
    })

    if (!response.ok) {
      throw new Error(`Failed to delete event: HTTP ${response.status}`)
    }

    setEvents(prev => prev.filter(e => e.id !== eventId))
  }, [options.apiEndpoint, options.apiKey])

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    deleteEvent,
  }
}

/**
 * Hook for checking availability
 */
export function useAvailabilityCheck(options: {
  apiEndpoint?: string
  apiKey?: string
  attendees?: string[]
}) {
  const [availability, setAvailability] = React.useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Check availability
  const checkAvailability = React.useCallback(async (
    start: Date,
    end: Date,
    attendees?: string[]
  ): Promise<AvailabilitySlot[]> => {
    if (!options.apiEndpoint) return []

    const targetAttendees = attendees || options.attendees || []
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${options.apiEndpoint}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
        },
        body: JSON.stringify({
          start: start.toISOString(),
          end: end.toISOString(),
          attendees: targetAttendees,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      const slots = (data.slots || []).map((s: Record<string, unknown>) => ({
        ...s,
        start: new Date(s.start as string),
        end: new Date(s.end as string),
      }))

      setAvailability(slots)
      return slots
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check availability'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [options.apiEndpoint, options.apiKey, options.attendees])

  // Find next available slot
  const findNextAvailable = React.useCallback((
    duration: number = 60 // minutes
  ): AvailabilitySlot | null => {
    const durationMs = duration * 60 * 1000

    for (const slot of availability) {
      if (slot.status === 'free') {
        const slotDuration = slot.end.getTime() - slot.start.getTime()
        if (slotDuration >= durationMs) {
          return slot
        }
      }
    }

    return null
  }, [availability])

  // Get busy times
  const getBusyTimes = React.useCallback((): AvailabilitySlot[] => {
    return availability.filter(slot => slot.status === 'busy')
  }, [availability])

  // Get free times
  const getFreeTimes = React.useCallback((): AvailabilitySlot[] => {
    return availability.filter(slot => slot.status === 'free')
  }, [availability])

  return {
    availability,
    loading,
    error,
    checkAvailability,
    findNextAvailable,
    getBusyTimes,
    getFreeTimes,
  }
}
