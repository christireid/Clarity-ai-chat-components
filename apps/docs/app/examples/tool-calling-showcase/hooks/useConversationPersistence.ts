import { logger } from '@clarity-chat/utils/logger';
'use client'

/**
 * useConversationPersistence Hook
 *
 * Persists conversation state to localStorage with automatic save/restore.
 * Supports multiple conversation sessions and export/import.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Message, DebugEvent } from '../lib/types'

interface ConversationSession {
  id: string
  name: string
  messages: Message[]
  debugEvents: DebugEvent[]
  createdAt: string
  updatedAt: string
}

interface UseConversationPersistenceOptions {
  storageKey?: string
  maxSessions?: number
  autoSaveDebounce?: number
}

interface UseConversationPersistenceReturn {
  sessions: ConversationSession[]
  currentSessionId: string | null
  currentSession: ConversationSession | null
  saveSession: (messages: Message[], debugEvents: DebugEvent[], name?: string) => string
  loadSession: (sessionId: string) => ConversationSession | null
  deleteSession: (sessionId: string) => void
  renameSession: (sessionId: string, name: string) => void
  createNewSession: (name?: string) => string
  exportSession: (sessionId: string) => string
  exportAllSessions: () => string
  importSessions: (json: string) => number
  clearAllSessions: () => void
  setCurrentSessionId: (sessionId: string | null) => void
}

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function serializeMessages(messages: Message[]): Message[] {
  return messages.map((m) => ({
    ...m,
    timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
  })) as unknown as Message[]
}

function deserializeMessages(messages: Message[]): Message[] {
  return messages.map((m) => ({
    ...m,
    timestamp: new Date(m.timestamp as unknown as string),
  }))
}

function serializeEvents(events: DebugEvent[]): DebugEvent[] {
  return events.map((e) => ({
    ...e,
    timestamp: e.timestamp instanceof Date ? e.timestamp.toISOString() : e.timestamp,
  })) as unknown as DebugEvent[]
}

function deserializeEvents(events: DebugEvent[]): DebugEvent[] {
  return events.map((e) => ({
    ...e,
    timestamp: new Date(e.timestamp as unknown as string),
  }))
}

export function useConversationPersistence(
  options: UseConversationPersistenceOptions = {}
): UseConversationPersistenceReturn {
  const {
    storageKey = 'tool-showcase-conversations',
    maxSessions = 20,
  } = options

  const [sessions, setSessions] = useState<ConversationSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load sessions from storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as ConversationSession[]
        const deserialized = parsed.map((session) => ({
          ...session,
          messages: deserializeMessages(session.messages),
          debugEvents: deserializeEvents(session.debugEvents),
        }))
        setSessions(deserialized)

        // Set current session to the most recent
        if (deserialized.length > 0) {
          const sorted = [...deserialized].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          setCurrentSessionId(sorted[0].id)
        }
      }
    } catch (error) {
      logger.logger.error('Failed to load conversations:', error)
    }
    setIsLoaded(true)
  }, [storageKey])

  // Persist sessions to storage
  const persistSessions = useCallback(
    (updatedSessions: ConversationSession[]) => {
      if (typeof window === 'undefined') return

      try {
        const serialized = updatedSessions.map((session) => ({
          ...session,
          messages: serializeMessages(session.messages),
          debugEvents: serializeEvents(session.debugEvents),
        }))
        localStorage.setItem(storageKey, JSON.stringify(serialized))
      } catch (error) {
        logger.logger.error('Failed to persist conversations:', error)
      }
    },
    [storageKey]
  )

  // Current session
  const currentSession = useMemo(() => {
    if (!currentSessionId) return null
    return sessions.find((s) => s.id === currentSessionId) || null
  }, [sessions, currentSessionId])

  // Save session
  const saveSession = useCallback(
    (messages: Message[], debugEvents: DebugEvent[], name?: string): string => {
      const now = new Date().toISOString()

      if (currentSessionId) {
        // Update existing session
        setSessions((prev) => {
          const updated = prev.map((s) =>
            s.id === currentSessionId
              ? { ...s, messages, debugEvents, updatedAt: now, name: name || s.name }
              : s
          )
          persistSessions(updated)
          return updated
        })
        return currentSessionId
      } else {
        // Create new session
        const newId = generateSessionId()
        const newSession: ConversationSession = {
          id: newId,
          name: name || `Conversation ${sessions.length + 1}`,
          messages,
          debugEvents,
          createdAt: now,
          updatedAt: now,
        }

        setSessions((prev) => {
          // Enforce max sessions limit
          const updated = [newSession, ...prev].slice(0, maxSessions)
          persistSessions(updated)
          return updated
        })
        setCurrentSessionId(newId)
        return newId
      }
    },
    [currentSessionId, sessions.length, maxSessions, persistSessions]
  )

  // Load session
  const loadSession = useCallback(
    (sessionId: string): ConversationSession | null => {
      const session = sessions.find((s) => s.id === sessionId)
      if (session) {
        setCurrentSessionId(sessionId)
      }
      return session || null
    },
    [sessions]
  )

  // Delete session
  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== sessionId)
        persistSessions(updated)
        return updated
      })

      if (currentSessionId === sessionId) {
        setCurrentSessionId(null)
      }
    },
    [currentSessionId, persistSessions]
  )

  // Rename session
  const renameSession = useCallback(
    (sessionId: string, name: string) => {
      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === sessionId ? { ...s, name, updatedAt: new Date().toISOString() } : s
        )
        persistSessions(updated)
        return updated
      })
    },
    [persistSessions]
  )

  // Create new session
  const createNewSession = useCallback(
    (name?: string): string => {
      const newId = generateSessionId()
      const now = new Date().toISOString()
      const newSession: ConversationSession = {
        id: newId,
        name: name || `Conversation ${sessions.length + 1}`,
        messages: [],
        debugEvents: [],
        createdAt: now,
        updatedAt: now,
      }

      setSessions((prev) => {
        const updated = [newSession, ...prev].slice(0, maxSessions)
        persistSessions(updated)
        return updated
      })
      setCurrentSessionId(newId)
      return newId
    },
    [sessions.length, maxSessions, persistSessions]
  )

  // Export single session
  const exportSession = useCallback(
    (sessionId: string): string => {
      const session = sessions.find((s) => s.id === sessionId)
      if (!session) return ''

      return JSON.stringify(
        {
          ...session,
          messages: serializeMessages(session.messages),
          debugEvents: serializeEvents(session.debugEvents),
        },
        null,
        2
      )
    },
    [sessions]
  )

  // Export all sessions
  const exportAllSessions = useCallback((): string => {
    return JSON.stringify(
      sessions.map((session) => ({
        ...session,
        messages: serializeMessages(session.messages),
        debugEvents: serializeEvents(session.debugEvents),
      })),
      null,
      2
    )
  }, [sessions])

  // Import sessions
  const importSessions = useCallback(
    (json: string): number => {
      try {
        const imported = JSON.parse(json)
        const sessionsToImport = Array.isArray(imported) ? imported : [imported]

        const deserialized = sessionsToImport.map((session: ConversationSession) => ({
          ...session,
          id: generateSessionId(), // Generate new IDs to avoid conflicts
          messages: deserializeMessages(session.messages),
          debugEvents: deserializeEvents(session.debugEvents),
          createdAt: session.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))

        setSessions((prev) => {
          const updated = [...deserialized, ...prev].slice(0, maxSessions)
          persistSessions(updated)
          return updated
        })

        return deserialized.length
      } catch (error) {
        logger.logger.error('Failed to import sessions:', error)
        return 0
      }
    },
    [maxSessions, persistSessions]
  )

  // Clear all sessions
  const clearAllSessions = useCallback(() => {
    setSessions([])
    setCurrentSessionId(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey)
    }
  }, [storageKey])

  return {
    sessions,
    currentSessionId,
    currentSession,
    saveSession,
    loadSession,
    deleteSession,
    renameSession,
    createNewSession,
    exportSession,
    exportAllSessions,
    importSessions,
    clearAllSessions,
    setCurrentSessionId,
  }
}
