'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, Badge, Button, cn } from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'
import { ANIMATION_PRESETS } from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

/**
 * User presence status
 */
export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline'

/**
 * Collaborative user
 */
export interface CollaborativeUser {
  id: string
  name: string
  avatar?: string
  color: string
  status: PresenceStatus
  lastSeen: number
  currentMessageId?: string
  cursorPosition?: number
}

/**
 * Cursor position
 */
export interface CursorPosition {
  userId: string
  messageId: string
  position: number
  selection?: {
    start: number
    end: number
  }
}

/**
 * Edit operation
 */
export interface EditOperation {
  id: string
  userId: string
  messageId: string
  type: 'insert' | 'delete' | 'replace'
  position: number
  content: string
  timestamp: number
  previousContent?: string
}

/**
 * Conflict resolution strategy
 */
export type ConflictStrategy =
  | 'last-write-wins'
  | 'operational-transform'
  | 'manual'

/**
 * Message lock
 */
export interface MessageLock {
  messageId: string
  userId: string
  acquiredAt: number
  expiresAt: number
}

/**
 * Collaborative session
 */
export interface CollaborativeSession {
  id: string
  conversationId: string
  users: Map<string, CollaborativeUser>
  locks: Map<string, MessageLock>
  operations: EditOperation[]
  cursors: Map<string, CursorPosition>
}

/**
 * Props for CollaborativeEditor
 */
export interface CollaborativeEditorProps {
  /** Message being edited */
  message: Message
  /** Current user */
  currentUser: CollaborativeUser
  /** Other active users */
  activeUsers: CollaborativeUser[]
  /** Lock timeout (ms) */
  lockTimeout?: number
  /** Conflict resolution strategy */
  conflictStrategy?: ConflictStrategy
  /** Show cursor positions */
  showCursors?: boolean
  /** Show presence indicators */
  showPresence?: boolean
  /** Callback when content changes */
  onChange?: (content: string, operation: EditOperation) => void
  /** Callback when user requests lock */
  onRequestLock?: (messageId: string) => Promise<boolean>
  /** Callback when user releases lock */
  onReleaseLock?: (messageId: string) => void
  /** Callback when cursor moves */
  onCursorMove?: (position: CursorPosition) => void
  /** Custom className */
  className?: string
}

/**
 * Generate user color
 */
function generateUserColor(userId: string): string {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ]

  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

/**
 * Apply operation to content
 */
function applyOperation(content: string, operation: EditOperation): string {
  switch (operation.type) {
    case 'insert':
      return (
        content.slice(0, operation.position) +
        operation.content +
        content.slice(operation.position)
      )
    case 'delete':
      return (
        content.slice(0, operation.position) +
        content.slice(operation.position + operation.content.length)
      )
    case 'replace':
      const end = operation.position + (operation.previousContent?.length || 0)
      return (
        content.slice(0, operation.position) +
        operation.content +
        content.slice(end)
      )
    default:
      return content
  }
}

/**
 * Operational Transform for conflict resolution
 */
function transformOperation(
  op1: EditOperation,
  op2: EditOperation
): EditOperation {
  // Simple operational transform
  // In production, use a library like ot.js or Automerge

  if (op1.position < op2.position) {
    return op2
  }

  if (op1.type === 'insert') {
    return {
      ...op2,
      position: op2.position + op1.content.length,
    }
  }

  if (op1.type === 'delete') {
    return {
      ...op2,
      position: Math.max(0, op2.position - op1.content.length),
    }
  }

  return op2
}

/**
 * CollaborativeEditor Component
 *
 * Real-time collaborative editing with:
 * - Cursor tracking
 * - Presence indicators
 * - Message locking
 * - Conflict resolution
 * - Change history
 */
export function CollaborativeEditor({
  message,
  currentUser,
  activeUsers,
  lockTimeout = 30000, // 30 seconds
  conflictStrategy = 'operational-transform',
  showCursors = true,
  showPresence = true,
  onChange,
  onRequestLock,
  onReleaseLock,
  onCursorMove,
  className,
}: CollaborativeEditorProps) {
  const prefersReducedMotion = useReducedMotion()
  const [content, setContent] = React.useState(message.content)
  const [isEditing, setIsEditing] = React.useState(false)
  const [hasLock, setHasLock] = React.useState(false)
  const [cursorPosition, setCursorPosition] = React.useState(0)
  const [operations, setOperations] = React.useState<EditOperation[]>([])

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const lockTimerRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  // Get active editors for this message
  const activeEditors = React.useMemo(() => {
    return activeUsers.filter(
      (u) =>
        u.currentMessageId === message.id &&
        u.id !== currentUser.id &&
        u.status === 'online'
    )
  }, [activeUsers, message.id, currentUser.id])

  // Request edit lock
  const requestLock = async () => {
    if (onRequestLock) {
      const granted = await onRequestLock(message.id)
      setHasLock(granted)

      if (granted) {
        // Set auto-release timer
        lockTimerRef.current = setTimeout(() => {
          releaseLock()
        }, lockTimeout)
      }

      return granted
    }

    setHasLock(true)
    return true
  }

  // Release lock
  const releaseLock = () => {
    setHasLock(false)
    setIsEditing(false)
    onReleaseLock?.(message.id)

    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current)
    }
  }

  // Handle content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    const position = e.target.selectionStart || 0

    // Create operation
    const operation: EditOperation = {
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      messageId: message.id,
      type: newContent.length > content.length ? 'insert' : 'delete',
      position,
      content:
        newContent.length > content.length
          ? newContent.slice(
              position - (newContent.length - content.length),
              position
            )
          : content.slice(
              position,
              position + (content.length - newContent.length)
            ),
      timestamp: Date.now(),
      previousContent: content,
    }

    setContent(newContent)
    setOperations((prev) => [...prev, operation])
    onChange?.(newContent, operation)
  }

  // Handle cursor movement
  const handleCursorMove = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    const position = target.selectionStart || 0

    setCursorPosition(position)

    onCursorMove?.({
      userId: currentUser.id,
      messageId: message.id,
      position,
      selection:
        target.selectionStart !== target.selectionEnd
          ? {
              start: target.selectionStart || 0,
              end: target.selectionEnd || 0,
            }
          : undefined,
    })
  }

  // Start editing
  const startEditing = async () => {
    const granted = await requestLock()
    if (granted) {
      setIsEditing(true)
      setTimeout(() => textareaRef.current?.focus(), 0)
    }
  }

  // Stop editing
  const stopEditing = () => {
    releaseLock()
  }

  // Save changes
  const saveChanges = () => {
    // In production, save to backend
    stopEditing()
  }

  // Discard changes
  const discardChanges = () => {
    setContent(message.content)
    setOperations([])
    stopEditing()
  }

  // Undo last operation
  const undo = () => {
    if (operations.length === 0) return

    const lastOp = operations[operations.length - 1]
    if (lastOp.previousContent) {
      setContent(lastOp.previousContent)
      setOperations((prev) => prev.slice(0, -1))
    }
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current)
      }
    }
  }, [])

  const getStatusColor = (status: PresenceStatus) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Card>
        <CardContent className="p-4">
          {/* Header with presence */}
          {showPresence && activeEditors.length > 0 && (
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Also editing:
              </span>
              {activeEditors.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1.5"
                  title={user.name}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name[0].toUpperCase()}
                  </div>
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      getStatusColor(user.status)
                    )}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Editor */}
          <div className="relative">
            {!isEditing ? (
              /* Display mode */
              <div
                className="p-3 border rounded-lg cursor-text hover:bg-accent/50 transition-colors"
                onClick={startEditing}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {content || 'Click to edit...'}
                </div>

                {activeEditors.length > 0 && (
                  <Badge variant="secondary" className="mt-2">
                    {activeEditors.length} editing
                  </Badge>
                )}
              </div>
            ) : (
              /* Edit mode */
              <div className="space-y-2">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleChange}
                    onSelect={handleCursorMove}
                    onMouseUp={handleCursorMove}
                    onKeyUp={handleCursorMove}
                    className="w-full min-h-[120px] p-3 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{
                      borderColor: currentUser.color,
                    }}
                  />

                  {/* Cursor indicators */}
                  {showCursors &&
                    activeEditors.map((user) => {
                      if (!user.cursorPosition) return null

                      const CursorWrapper = prefersReducedMotion
                        ? 'div'
                        : motion.div

                      return (
                        <CursorWrapper
                          key={user.id}
                          {...(!prefersReducedMotion &&
                            ANIMATION_PRESETS.fadeIn)}
                          className="absolute pointer-events-none"
                          style={{
                            borderLeft: `2px solid ${user.color}`,
                            height: '1.2em',
                            top: '0.5em',
                            left: `${user.cursorPosition}ch`,
                          }}
                        >
                          <div
                            className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-xs text-white whitespace-nowrap"
                            style={{ backgroundColor: user.color }}
                          >
                            {user.name}
                          </div>
                        </CursorWrapper>
                      )
                    })}
                </div>

                {/* Edit controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={saveChanges}>
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={discardChanges}>
                      Cancel
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={undo}
                      disabled={operations.length === 0}
                    >
                      Undo
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{content.length} characters</span>
                    {operations.length > 0 && (
                      <Badge variant="outline">
                        {operations.length} changes
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Lock indicator */}
                {hasLock && (
                  <div className="text-xs text-muted-foreground">
                    🔒 You have the edit lock
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Hook for managing collaborative sessions
 */
export function useCollaborativeSession(
  conversationId: string,
  currentUser: CollaborativeUser
) {
  const [session, setSession] = React.useState<CollaborativeSession>({
    id: `session-${Date.now()}`,
    conversationId,
    users: new Map([[currentUser.id, currentUser]]),
    locks: new Map(),
    operations: [],
    cursors: new Map(),
  })

  // Add user to session
  const addUser = React.useCallback((user: CollaborativeUser) => {
    setSession((prev) => ({
      ...prev,
      users: new Map(prev.users).set(user.id, user),
    }))
  }, [])

  // Remove user from session
  const removeUser = React.useCallback((userId: string) => {
    setSession((prev) => {
      const newUsers = new Map(prev.users)
      newUsers.delete(userId)

      // Release any locks held by this user
      const newLocks = new Map(prev.locks)
      for (const [messageId, lock] of newLocks.entries()) {
        if (lock.userId === userId) {
          newLocks.delete(messageId)
        }
      }

      return {
        ...prev,
        users: newUsers,
        locks: newLocks,
      }
    })
  }, [])

  // Update user status
  const updateUserStatus = React.useCallback(
    (userId: string, status: PresenceStatus) => {
      setSession((prev) => {
        const newUsers = new Map(prev.users)
        const user = newUsers.get(userId)

        if (user) {
          newUsers.set(userId, { ...user, status, lastSeen: Date.now() })
        }

        return { ...prev, users: newUsers }
      })
    },
    []
  )

  // Request message lock
  const requestLock = React.useCallback(
    (messageId: string, userId: string): boolean => {
      const existing = session.locks.get(messageId)

      // Check if lock exists and is not expired
      if (existing && existing.expiresAt > Date.now()) {
        return false
      }

      const lock: MessageLock = {
        messageId,
        userId,
        acquiredAt: Date.now(),
        expiresAt: Date.now() + 30000, // 30 seconds
      }

      setSession((prev) => ({
        ...prev,
        locks: new Map(prev.locks).set(messageId, lock),
      }))

      return true
    },
    [session.locks]
  )

  // Release message lock
  const releaseLock = React.useCallback((messageId: string) => {
    setSession((prev) => {
      const newLocks = new Map(prev.locks)
      newLocks.delete(messageId)
      return { ...prev, locks: newLocks }
    })
  }, [])

  // Add operation
  const addOperation = React.useCallback((operation: EditOperation) => {
    setSession((prev) => ({
      ...prev,
      operations: [...prev.operations, operation],
    }))
  }, [])

  // Update cursor position
  const updateCursor = React.useCallback((cursor: CursorPosition) => {
    setSession((prev) => ({
      ...prev,
      cursors: new Map(prev.cursors).set(cursor.userId, cursor),
    }))

    // Update user's current message
    setSession((prev) => {
      const newUsers = new Map(prev.users)
      const user = newUsers.get(cursor.userId)

      if (user) {
        newUsers.set(cursor.userId, {
          ...user,
          currentMessageId: cursor.messageId,
          cursorPosition: cursor.position,
        })
      }

      return { ...prev, users: newUsers }
    })
  }, [])

  // Get active users
  const getActiveUsers = React.useCallback((): CollaborativeUser[] => {
    return Array.from(session.users.values()).filter(
      (u) => u.status === 'online'
    )
  }, [session.users])

  // Get message lock
  const getMessageLock = React.useCallback(
    (messageId: string): MessageLock | undefined => {
      return session.locks.get(messageId)
    },
    [session.locks]
  )

  // Cleanup expired locks
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSession((prev) => {
        const newLocks = new Map(prev.locks)
        const now = Date.now()

        for (const [messageId, lock] of newLocks.entries()) {
          if (lock.expiresAt < now) {
            newLocks.delete(messageId)
          }
        }

        return { ...prev, locks: newLocks }
      })
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return {
    session,
    addUser,
    removeUser,
    updateUserStatus,
    requestLock,
    releaseLock,
    addOperation,
    updateCursor,
    getActiveUsers,
    getMessageLock,
  }
}

/**
 * Props for PresenceIndicator
 */
export interface PresenceIndicatorProps {
  /** Users to display */
  users: CollaborativeUser[]
  /** Maximum users to show */
  maxDisplay?: number
  /** Show status */
  showStatus?: boolean
  /** Custom className */
  className?: string
}

/**
 * PresenceIndicator Component
 *
 * Display active users in the collaborative session
 */
export function PresenceIndicator({
  users,
  maxDisplay = 5,
  showStatus = true,
  className,
}: PresenceIndicatorProps) {
  const prefersReducedMotion = useReducedMotion()
  const activeUsers = users.filter((u) => u.status === 'online')
  const displayUsers = activeUsers.slice(0, maxDisplay)
  const remaining = Math.max(0, activeUsers.length - maxDisplay)

  const getStatusColor = (status: PresenceStatus) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {prefersReducedMotion ? (
        displayUsers.map((user, index) => (
          <div
            key={user.id}
            className="relative"
            title={`${user.name} (${user.status})`}
            style={{ zIndex: displayUsers.length - index }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-background"
              style={{ backgroundColor: user.color }}
            >
              {user.name[0].toUpperCase()}
            </div>

            {showStatus && (
              <div
                className={cn(
                  'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background',
                  getStatusColor(user.status)
                )}
              />
            )}
          </div>
        ))
      ) : (
        <AnimatePresence mode="popLayout">
          {displayUsers.map((user, index) => (
            <motion.div
              key={user.id}
              {...ANIMATION_PRESETS.pop}
              transition={{ delay: index * 0.05 }}
              className="relative"
              title={`${user.name} (${user.status})`}
              style={{ zIndex: displayUsers.length - index }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-background"
                style={{ backgroundColor: user.color }}
              >
                {user.name[0].toUpperCase()}
              </div>

              {showStatus && (
                <div
                  className={cn(
                    'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background',
                    getStatusColor(user.status)
                  )}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-muted border-2 border-background">
          +{remaining}
        </div>
      )}
    </div>
  )
}

/**
 * Props for CollaborativeMessageList
 */
export interface CollaborativeMessageListProps {
  /** Messages */
  messages: Message[]
  /** Current user */
  currentUser: CollaborativeUser
  /** Active users */
  activeUsers: CollaborativeUser[]
  /** Session */
  session: CollaborativeSession
  /** Callback when message edited */
  onMessageEdit?: (messageId: string, content: string) => void
  /** Callback when lock requested */
  onRequestLock?: (messageId: string) => Promise<boolean>
  /** Callback when lock released */
  onReleaseLock?: (messageId: string) => void
  /** Custom className */
  className?: string
}

/**
 * CollaborativeMessageList Component
 *
 * Message list with collaborative editing capabilities
 */
export function CollaborativeMessageList({
  messages,
  currentUser,
  activeUsers,
  session,
  onMessageEdit,
  onRequestLock,
  onReleaseLock,
  className,
}: CollaborativeMessageListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Presence indicator */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {activeUsers.length} active{' '}
          {activeUsers.length === 1 ? 'user' : 'users'}
        </span>
        <PresenceIndicator users={activeUsers} />
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {messages.map((message) => (
          <CollaborativeEditor
            key={message.id}
            message={message}
            currentUser={currentUser}
            activeUsers={activeUsers}
            onChange={(content, operation) => {
              onMessageEdit?.(message.id, content)
            }}
            onRequestLock={onRequestLock}
            onReleaseLock={onReleaseLock}
          />
        ))}
      </div>
    </div>
  )
}
