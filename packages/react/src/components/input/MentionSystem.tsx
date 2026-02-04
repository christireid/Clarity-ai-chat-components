'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, Badge, cn } from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

/**
 * Mentionable user
 */
export interface MentionableUser {
  id: string
  name: string
  username: string
  role?: string
  avatar?: string
  isOnline?: boolean
}

/**
 * Mention data
 */
export interface Mention {
  id: string
  userId: string
  messageId: string
  position: number
  length: number
  isRead: boolean
  timestamp: number
}

/**
 * Props for MentionInput
 */
export interface MentionInputProps {
  /** Available users to mention */
  users: MentionableUser[]
  /** Current input value */
  value: string
  /** Callback when value changes */
  onChange: (value: string, mentions: Mention[]) => void
  /** Callback when Enter is pressed */
  onSubmit?: () => void
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Mention trigger character */
  mentionTrigger?: string
  /** Enable fuzzy search */
  enableFuzzySearch?: boolean
  className?: string
}

/**
 * Props for MentionList
 */
export interface MentionListProps {
  /** All mentions */
  mentions: Mention[]
  /** Messages map for context */
  messages: Map<string, { content: string; timestamp: number }>
  /** Users map */
  users: Map<string, MentionableUser>
  /** Current user ID */
  currentUserId: string
  /** Callback when mention is clicked */
  onMentionClick?: (mention: Mention) => void
  /** Callback when mark as read */
  onMarkAsRead?: (mentionId: string) => void
  /** Show only unread */
  showOnlyUnread?: boolean
  className?: string
}

/**
 * Fuzzy search for users
 */
function fuzzySearch(query: string, text: string): boolean {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  let queryIndex = 0
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++
    }
  }

  return queryIndex === queryLower.length
}

/**
 * MentionInput Component
 *
 * Input field with @mention autocomplete support.
 *
 * Features:
 * - @mention user autocomplete
 * - Fuzzy search for users
 * - Keyboard navigation (↑↓ Enter Escape)
 * - Visual mention highlighting
 * - Mention extraction
 *
 * @example
 * ```tsx
 * <MentionInput
 *   users={users}
 *   value={message}
 *   onChange={(value, mentions) => {
 *     setMessage(value)
 *     setMentions(mentions)
 *   }}
 *   onSubmit={() => sendMessage()}
 *   placeholder="Type @ to mention someone"
 * />
 * ```
 */
export function MentionInput({
  users,
  value,
  onChange,
  onSubmit,
  placeholder = 'Type @ to mention...',
  disabled = false,
  mentionTrigger = '@',
  enableFuzzySearch = true,
  className,
}: MentionInputProps) {
  const prefersReducedMotion = useReducedMotion()
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<MentionableUser[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [mentionStartPos, setMentionStartPos] = React.useState(-1)
  const [cursorPosition, setCursorPosition] = React.useState(0)

  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)

  /**
   * Extract mentions from text
   */
  const extractMentions = React.useCallback(
    (text: string): Mention[] => {
      const mentions: Mention[] = []
      const regex = new RegExp(`${mentionTrigger}(\\w+)`, 'g')
      let match

      while ((match = regex.exec(text)) !== null) {
        const username = match[1]
        const user = users.find((u) => u.username === username)

        if (user) {
          mentions.push({
            id: `${user.id}-${match.index}`,
            userId: user.id,
            messageId: '', // Will be set when message is sent
            position: match.index,
            length: match[0].length,
            isRead: false,
            timestamp: Date.now(),
          })
        }
      }

      return mentions
    },
    [users, mentionTrigger]
  )

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart || 0

    setCursorPosition(cursorPos)

    // Check if we should show mention suggestions
    const textBeforeCursor = newValue.slice(0, cursorPos)
    const lastMentionIndex = textBeforeCursor.lastIndexOf(mentionTrigger)

    if (lastMentionIndex !== -1) {
      const textAfterMention = textBeforeCursor.slice(lastMentionIndex + 1)

      // Only show if no whitespace after @
      if (!/\s/.test(textAfterMention)) {
        setMentionStartPos(lastMentionIndex)

        // Filter users
        const query = textAfterMention.toLowerCase()
        const filtered = users.filter((user) => {
          if (enableFuzzySearch) {
            return (
              fuzzySearch(query, user.name) || fuzzySearch(query, user.username)
            )
          }
          return (
            user.name.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
          )
        })

        setSuggestions(filtered.slice(0, 10))
        setShowSuggestions(filtered.length > 0)
        setSelectedIndex(0)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }

    const mentions = extractMentions(newValue)
    onChange(newValue, mentions)
  }

  /**
   * Insert mention at cursor
   */
  const insertMention = React.useCallback(
    (user: MentionableUser) => {
      if (mentionStartPos === -1) return

      const before = value.slice(0, mentionStartPos)
      const after = value.slice(cursorPosition)
      const mention = `${mentionTrigger}${user.username} `
      const newValue = before + mention + after

      const mentions = extractMentions(newValue)
      onChange(newValue, mentions)

      setShowSuggestions(false)
      setMentionStartPos(-1)

      // Focus input and set cursor position
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = mentionStartPos + mention.length
          inputRef.current.focus()
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    },
    [
      value,
      mentionStartPos,
      cursorPosition,
      mentionTrigger,
      extractMentions,
      onChange,
    ]
  )

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit?.()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
      case 'Tab':
        e.preventDefault()
        if (suggestions[selectedIndex]) {
          insertMention(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        break
    }
  }

  // Scroll selected suggestion into view
  React.useEffect(() => {
    if (suggestionsRef.current) {
      const selected = suggestionsRef.current.children[
        selectedIndex
      ] as HTMLElement
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  return (
    <div className={cn('relative', className)}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-h-[80px] px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
        rows={3}
      />

      {/* Mention suggestions dropdown */}
      {showSuggestions &&
        (prefersReducedMotion ? (
          <div
            ref={suggestionsRef}
            className="absolute bottom-full mb-2 left-0 right-0 max-h-64 overflow-y-auto scrollbar-hide bg-background border rounded-lg shadow-lg z-50"
          >
            {suggestions.map((user, index) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-left',
                  index === selectedIndex && 'bg-accent'
                )}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0">
                  {user.name[0].toUpperCase()}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{user.name}</span>
                    {user.isOnline && (
                      <span
                        className="w-2 h-2 rounded-full bg-green-500"
                        title="Online"
                      />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {mentionTrigger}
                    {user.username}
                    {user.role && ` • ${user.role}`}
                  </div>
                </div>

                {/* Keyboard hint */}
                {index === selectedIndex && (
                  <Badge variant="secondary" className="text-xs">
                    Enter
                  </Badge>
                )}
              </button>
            ))}
          </div>
        ) : (
          <motion.div
            ref={suggestionsRef}
            {...ANIMATION_PRESETS.slideDown}
            transition={{ duration: durations.fast }}
            viewport={{ once: true }}
            className="absolute bottom-full mb-2 left-0 right-0 max-h-64 overflow-y-auto scrollbar-hide bg-background border rounded-lg shadow-lg z-50"
          >
            {suggestions.map((user, index) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-left',
                  index === selectedIndex && 'bg-accent'
                )}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0">
                  {user.name[0].toUpperCase()}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{user.name}</span>
                    {user.isOnline && (
                      <span
                        className="w-2 h-2 rounded-full bg-green-500"
                        title="Online"
                      />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {mentionTrigger}
                    {user.username}
                    {user.role && ` • ${user.role}`}
                  </div>
                </div>

                {/* Keyboard hint */}
                {index === selectedIndex && (
                  <Badge variant="secondary" className="text-xs">
                    Enter
                  </Badge>
                )}
              </button>
            ))}
          </motion.div>
        ))}
    </div>
  )
}

MentionInput.displayName = 'MentionInput'

/**
 * MentionList Component
 *
 * Displays list of mentions for a user with filtering and navigation.
 *
 * @example
 * ```tsx
 * <MentionList
 *   mentions={mentions}
 *   messages={messagesMap}
 *   users={usersMap}
 *   currentUserId="user-123"
 *   onMentionClick={(mention) => {
 *     jumpToMessage(mention.messageId)
 *   }}
 *   onMarkAsRead={(mentionId) => {
 *     markMentionAsRead(mentionId)
 *   }}
 *   showOnlyUnread
 * />
 * ```
 */
export function MentionList({
  mentions,
  messages,
  users,
  currentUserId,
  onMentionClick,
  onMarkAsRead,
  showOnlyUnread = false,
  className,
}: MentionListProps) {
  const prefersReducedMotion = useReducedMotion()
  const [filter, setFilter] = React.useState<'all' | 'unread'>('unread')

  // Filter mentions for current user
  const userMentions = React.useMemo(() => {
    let filtered = mentions.filter((m) => {
      // Check if mention is for current user
      return m.userId === currentUserId
    })

    if (filter === 'unread' || showOnlyUnread) {
      filtered = filtered.filter((m) => !m.isRead)
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => b.timestamp - a.timestamp)
  }, [mentions, currentUserId, filter, showOnlyUnread])

  const unreadCount = mentions.filter(
    (m) => m.userId === currentUserId && !m.isRead
  ).length

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm">Mentions</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {unreadCount} unread{' '}
                  {unreadCount === 1 ? 'mention' : 'mentions'}
                </p>
              )}
            </div>
            {!showOnlyUnread && (
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('unread')}
                  className={cn(
                    'px-3 py-1 text-xs rounded-lg transition-colors',
                    filter === 'unread'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  )}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    'px-3 py-1 text-xs rounded-lg transition-colors',
                    filter === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  )}
                >
                  All
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mention list */}
      <div className="space-y-2">
        {userMentions.map((mention, index) => {
          const message = messages.get(mention.messageId)
          const mentioner = users.get(mention.userId)

          if (!message || !mentioner) return null

          return prefersReducedMotion ? (
            <div key={mention.id}>
              <Card
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  !mention.isRead && 'border-l-4 border-l-primary bg-accent/20'
                )}
                onClick={() => onMentionClick?.(mention)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0">
                      {mentioner.name[0].toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {mentioner.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          mentioned you
                        </span>
                        {!mention.isRead && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.content}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>

                        {!mention.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onMarkAsRead?.(mention.id)
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <motion.div
              key={mention.id}
              {...ANIMATION_PRESETS.slideRight}
              transition={{ delay: index * 0.03 }}
              viewport={{ once: true }}
            >
              <Card
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  !mention.isRead && 'border-l-4 border-l-primary bg-accent/20'
                )}
                onClick={() => onMentionClick?.(mention)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0">
                      {mentioner.name[0].toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {mentioner.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          mentioned you
                        </span>
                        {!mention.isRead && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.content}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>

                        {!mention.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onMarkAsRead?.(mention.id)
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}

        {userMentions.length === 0 && (
          <Card className="shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              {filter === 'unread' || showOnlyUnread
                ? 'No unread mentions'
                : 'No mentions yet'}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

MentionList.displayName = 'MentionList'

/**
 * Hook to manage mentions
 */
export function useMentions() {
  const [mentions, setMentions] = React.useState<Mention[]>([])

  const addMention = React.useCallback((mention: Mention) => {
    setMentions((prev) => [...prev, mention])
  }, [])

  const markAsRead = React.useCallback((mentionId: string) => {
    setMentions((prev) =>
      prev.map((m) => (m.id === mentionId ? { ...m, isRead: true } : m))
    )
  }, [])

  const getUnreadCount = React.useCallback(
    (userId: string) => {
      return mentions.filter((m) => m.userId === userId && !m.isRead).length
    },
    [mentions]
  )

  const getMentionsForUser = React.useCallback(
    (userId: string) => {
      return mentions.filter((m) => m.userId === userId)
    },
    [mentions]
  )

  return {
    mentions,
    addMention,
    markAsRead,
    getUnreadCount,
    getMentionsForUser,
  }
}
