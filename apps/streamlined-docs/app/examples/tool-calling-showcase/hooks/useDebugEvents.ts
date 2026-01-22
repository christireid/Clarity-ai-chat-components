'use client'

/**
 * useDebugEvents Hook
 *
 * Manages the debug event stream for the Glass Box panel.
 * Provides methods for adding, filtering, and clearing events.
 */

import { useState, useCallback, useMemo } from 'react'
import type { DebugEvent, DebugEventType } from '../lib/types'

interface UseDebugEventsOptions {
  maxEvents?: number
  persistToStorage?: boolean
  storageKey?: string
}

interface UseDebugEventsReturn {
  events: DebugEvent[]
  filteredEvents: DebugEvent[]
  activeFilters: Set<DebugEventType>
  addEvent: (type: DebugEventType, payload: unknown, toolName?: string, duration?: number) => void
  clearEvents: () => void
  setFilters: (filters: Set<DebugEventType>) => void
  toggleFilter: (type: DebugEventType) => void
  clearFilters: () => void
  getEventsByType: (type: DebugEventType) => DebugEvent[]
  getEventsByTool: (toolName: string) => DebugEvent[]
  getTotalDuration: () => number
  exportEvents: () => string
}

function generateEventId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function useDebugEvents(options: UseDebugEventsOptions = {}): UseDebugEventsReturn {
  const { maxEvents = 100, persistToStorage = false, storageKey = 'debug-events' } = options

  const [events, setEvents] = useState<DebugEvent[]>(() => {
    if (persistToStorage && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          return parsed.map((e: DebugEvent) => ({
            ...e,
            timestamp: new Date(e.timestamp),
          }))
        }
      } catch {
        // Ignore storage errors
      }
    }
    return []
  })

  const [activeFilters, setActiveFilters] = useState<Set<DebugEventType>>(new Set())

  // Add a new event
  const addEvent = useCallback(
    (type: DebugEventType, payload: unknown, toolName?: string, duration?: number) => {
      const event: DebugEvent = {
        id: generateEventId(),
        timestamp: new Date(),
        type,
        payload,
        toolName,
        duration,
      }

      setEvents((prev) => {
        const newEvents = [...prev, event].slice(-maxEvents)

        if (persistToStorage && typeof window !== 'undefined') {
          try {
            localStorage.setItem(storageKey, JSON.stringify(newEvents))
          } catch {
            // Ignore storage errors (quota exceeded, etc.)
          }
        }

        return newEvents
      })
    },
    [maxEvents, persistToStorage, storageKey]
  )

  // Clear all events
  const clearEvents = useCallback(() => {
    setEvents([])
    if (persistToStorage && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey)
      } catch {
        // Ignore
      }
    }
  }, [persistToStorage, storageKey])

  // Set filters
  const setFilters = useCallback((filters: Set<DebugEventType>) => {
    setActiveFilters(new Set(filters))
  }, [])

  // Toggle a single filter
  const toggleFilter = useCallback((type: DebugEventType) => {
    setActiveFilters((prev) => {
      const newFilters = new Set(prev)
      if (newFilters.has(type)) {
        newFilters.delete(type)
      } else {
        newFilters.add(type)
      }
      return newFilters
    })
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters(new Set())
  }, [])

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (activeFilters.size === 0) {
      return events
    }
    return events.filter((e) => activeFilters.has(e.type))
  }, [events, activeFilters])

  // Get events by type
  const getEventsByType = useCallback(
    (type: DebugEventType) => {
      return events.filter((e) => e.type === type)
    },
    [events]
  )

  // Get events by tool
  const getEventsByTool = useCallback(
    (toolName: string) => {
      return events.filter((e) => e.toolName === toolName)
    },
    [events]
  )

  // Get total duration of all tool executions
  const getTotalDuration = useCallback(() => {
    return events.reduce((total, e) => total + (e.duration || 0), 0)
  }, [events])

  // Export events as JSON
  const exportEvents = useCallback(() => {
    return JSON.stringify(events, null, 2)
  }, [events])

  return {
    events,
    filteredEvents,
    activeFilters,
    addEvent,
    clearEvents,
    setFilters,
    toggleFilter,
    clearFilters,
    getEventsByType,
    getEventsByTool,
    getTotalDuration,
    exportEvents,
  }
}
