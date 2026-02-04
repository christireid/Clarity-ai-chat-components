'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, Badge, cn, glassVariants } from '@clarity-chat/primitives'
import { DURATION_SECONDS as durations } from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

/**
 * Mentionable user or agent
 */
export interface MentionableUser {
  id: string
  name: string
  username: string
  role?: string
  avatar?: string
  isOnline?: boolean
  type?: 'user' | 'agent' | 'bot'
  capabilities?: string[]
}

/**
 * Slash command definition
 */
export interface SlashCommand {
  id: string
  command: string
  description: string
  category?: 'general' | 'ai' | 'search' | 'utility'
  icon?: React.ReactNode
  action?: () => void
  parameters?: CommandParameter[]
}

/**
 * Command parameter definition
 */
export interface CommandParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select'
  required: boolean
  description?: string
  options?: string[]
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
  /** Available users/agents to mention */
  users: MentionableUser[]
  /** Available slash commands */
  commands?: SlashCommand[]
  /** Current input value */
  value: string
  /** Callback when value changes */
  onChange: (value: string, mentions: Mention[]) => void
  /** Callback when command is executed */
  onCommandExecute?: (command: SlashCommand) => void
  /** Callback when Enter is pressed */
  onSubmit?: () => void
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Mention trigger character */
  mentionTrigger?: string
  /** Command trigger character */
  commandTrigger?: string
  /** Enable fuzzy search */
  enableFuzzySearch?: boolean
  /** Max suggestions to show */
  maxSuggestions?: number
  /** Context-aware filtering */
  enableContextFiltering?: boolean
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
 * Fuzzy search for users and commands
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
 * Get role badge color based on type
 */
function getRoleBadgeColor(type?: string): string {
  switch (type) {
    case 'agent':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    case 'bot':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    case 'user':
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
  }
}

/**
 * Get command category badge color
 */
function getCategoryColor(category?: string): string {
  switch (category) {
    case 'ai':
      return 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-300'
    case 'search':
      return 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-blue-300'
    case 'utility':
      return 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-300'
    case 'general':
    default:
      return 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 text-gray-700 dark:text-gray-300'
  }
}

/**
 * MentionInput Component
 *
 * Enhanced input field with @mention and /command autocomplete support.
 *
 * Features:
 * - @mention user/agent autocomplete
 * - /command slash command support
 * - Fuzzy search for users and commands
 * - Keyboard navigation (↑↓ Tab Enter Escape)
 * - Glassmorphism styled dropdown
 * - Context-aware suggestions
 * - Visual mention highlighting
 * - Mention extraction
 *
 * @example
 * ```tsx
 * <MentionInput
 *   users={users}
 *   commands={commands}
 *   value={message}
 *   onChange={(value, mentions) => {
 *     setMessage(value)
 *     setMentions(mentions)
 *   }}
 *   onCommandExecute={(cmd) => executeCommand(cmd)}
 *   onSubmit={() => sendMessage()}
 *   placeholder="Type @ to mention or / for commands"
 * />
 * ```
 */
export function MentionInput({
  users,
  commands = [],
  value,
  onChange,
  onCommandExecute,
  onSubmit,
  placeholder = 'Type @ to mention or / for commands...',
  disabled = false,
  mentionTrigger = '@',
  commandTrigger = '/',
  enableFuzzySearch = true,
  maxSuggestions = 10,
  enableContextFiltering = true,
  className,
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [suggestionType, setSuggestionType] = React.useState<'mention' | 'command'>('mention')
  const [userSuggestions, setUserSuggestions] = React.useState<MentionableUser[]>([])
  const [commandSuggestions, setCommandSuggestions] = React.useState<SlashCommand[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [triggerStartPos, setTriggerStartPos] = React.useState(-1)
  const [cursorPosition, setCursorPosition] = React.useState(0)

  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

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
   * Handle input change - detects both @ mentions and / commands
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart || 0

    setCursorPosition(cursorPos)

    const textBeforeCursor = newValue.slice(0, cursorPos)
    const lastMentionIndex = textBeforeCursor.lastIndexOf(mentionTrigger)
    const lastCommandIndex = textBeforeCursor.lastIndexOf(commandTrigger)

    // Determine which trigger is most recent
    const usingMention = lastMentionIndex > lastCommandIndex
    const usingCommand = lastCommandIndex > lastMentionIndex
    const triggerIndex = usingMention ? lastMentionIndex : lastCommandIndex

    // Check if we should show suggestions
    if ((usingMention || usingCommand) && triggerIndex !== -1) {
      const textAfterTrigger = textBeforeCursor.slice(triggerIndex + 1)

      // Only show if no whitespace after trigger
      if (!/\s/.test(textAfterTrigger)) {
        setTriggerStartPos(triggerIndex)
        const query = textAfterTrigger.toLowerCase()

        if (usingMention) {
          // Filter users
          const filtered = users.filter((user) => {
            if (enableFuzzySearch) {
              return (
                fuzzySearch(query, user.name) ||
                fuzzySearch(query, user.username) ||
                (user.role && fuzzySearch(query, user.role))
              )
            }
            return (
              user.name.toLowerCase().includes(query) ||
              user.username.toLowerCase().includes(query) ||
              (user.role && user.role.toLowerCase().includes(query))
            )
          })

          // Context-aware filtering: prioritize online users and agents
          const sortedFiltered = enableContextFiltering
            ? filtered.sort((a, b) => {
                // Prioritize agents
                if (a.type === 'agent' && b.type !== 'agent') return -1
                if (b.type === 'agent' && a.type !== 'agent') return 1
                // Prioritize online users
                if (a.isOnline && !b.isOnline) return -1
                if (b.isOnline && !a.isOnline) return 1
                return 0
              })
            : filtered

          setUserSuggestions(sortedFiltered.slice(0, maxSuggestions))
          setSuggestionType('mention')
          setShowSuggestions(sortedFiltered.length > 0)
          setSelectedIndex(0)
        } else if (usingCommand) {
          // Filter commands
          const filtered = commands.filter((cmd) => {
            if (enableFuzzySearch) {
              return (
                fuzzySearch(query, cmd.command) ||
                fuzzySearch(query, cmd.description)
              )
            }
            return (
              cmd.command.toLowerCase().includes(query) ||
              cmd.description.toLowerCase().includes(query)
            )
          })

          setCommandSuggestions(filtered.slice(0, maxSuggestions))
          setSuggestionType('command')
          setShowSuggestions(filtered.length > 0)
          setSelectedIndex(0)
        }
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
      if (triggerStartPos === -1) return

      const before = value.slice(0, triggerStartPos)
      const after = value.slice(cursorPosition)
      const mention = `${mentionTrigger}${user.username} `
      const newValue = before + mention + after

      const mentions = extractMentions(newValue)
      onChange(newValue, mentions)

      setShowSuggestions(false)
      setTriggerStartPos(-1)

      // Focus input and set cursor position
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = triggerStartPos + mention.length
          inputRef.current.focus()
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    },
    [
      value,
      triggerStartPos,
      cursorPosition,
      mentionTrigger,
      extractMentions,
      onChange,
    ]
  )

  /**
   * Insert command at cursor
   */
  const insertCommand = React.useCallback(
    (command: SlashCommand) => {
      if (triggerStartPos === -1) return

      const before = value.slice(0, triggerStartPos)
      const after = value.slice(cursorPosition)
      const commandText = `${commandTrigger}${command.command} `
      const newValue = before + commandText + after

      const mentions = extractMentions(newValue)
      onChange(newValue, mentions)

      setShowSuggestions(false)
      setTriggerStartPos(-1)

      // Execute command callback
      onCommandExecute?.(command)

      // Focus input and set cursor position
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = triggerStartPos + commandText.length
          inputRef.current.focus()
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    },
    [
      value,
      triggerStartPos,
      cursorPosition,
      commandTrigger,
      extractMentions,
      onChange,
      onCommandExecute,
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

    const currentSuggestions =
      suggestionType === 'mention' ? userSuggestions : commandSuggestions

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          Math.min(prev + 1, currentSuggestions.length - 1)
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
      case 'Tab':
        e.preventDefault()
        if (suggestionType === 'mention' && userSuggestions[selectedIndex]) {
          insertMention(userSuggestions[selectedIndex])
        } else if (
          suggestionType === 'command' &&
          commandSuggestions[selectedIndex]
        ) {
          insertCommand(commandSuggestions[selectedIndex])
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
        className={cn(
          'w-full min-h-[80px] px-4 py-3 rounded-lg resize-none',
          'border border-glass-light dark:border-glass-dark-light',
          'bg-white/60 dark:bg-background/60',
          'backdrop-blur-md backdrop-saturate-150',
          'focus:ring-2 focus:ring-primary/30 focus:border-primary/50',
          'transition-all duration-200',
          'placeholder:text-muted-foreground/60',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        rows={3}
        aria-label={placeholder}
        aria-expanded={showSuggestions}
        aria-autocomplete="list"
        aria-controls={showSuggestions ? 'mention-suggestions' : undefined}
      />

      {/* Mention/Command suggestions dropdown with glassmorphism */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            id="mention-suggestions"
            ref={suggestionsRef}
            role="listbox"
            aria-label={
              suggestionType === 'mention'
                ? 'User suggestions'
                : 'Command suggestions'
            }
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -10, scale: 0.95 }
            }
            animate={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -10, scale: 0.95 }
            }
            transition={{ duration: durations.fast }}
            className={cn(
              glassVariants({
                intensity: 'strong',
                gradient: 'none',
                border: 'light',
                animated: 'none',
              }),
              'absolute bottom-full mb-2 left-0 right-0',
              'max-h-80 overflow-y-auto overflow-x-hidden',
              'rounded-xl shadow-xl z-50',
              'scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent'
            )}
          >
            {/* Render mentions */}
            {suggestionType === 'mention' &&
              userSuggestions.map((user, index) => (
                <button
                  key={user.id}
                  role="option"
                  aria-selected={index === selectedIndex}
                  onClick={() => insertMention(user)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3',
                    'hover:bg-white/40 dark:hover:bg-background/40',
                    'transition-all duration-200',
                    'text-left border-b border-glass-light/50 dark:border-glass-dark-light/50',
                    'last:border-b-0',
                    index === selectedIndex &&
                      'bg-primary/10 dark:bg-primary/20 border-primary/20'
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      'text-sm font-semibold shrink-0',
                      'bg-gradient-to-br',
                      user.type === 'agent'
                        ? 'from-purple-400/20 to-pink-400/20 text-purple-700 dark:text-purple-300'
                        : user.type === 'bot'
                          ? 'from-blue-400/20 to-cyan-400/20 text-blue-700 dark:text-blue-300'
                          : 'from-primary/20 to-accent/20 text-primary dark:text-primary-foreground'
                    )}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      user.name[0].toUpperCase()
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm truncate">
                        {user.name}
                      </span>
                      {user.isOnline && (
                        <span
                          className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                          title="Online"
                          aria-label="Online"
                        />
                      )}
                      {user.type && user.type !== 'user' && (
                        <Badge
                          variant="secondary"
                          className={cn('text-[10px] px-1.5 py-0', getRoleBadgeColor(user.type))}
                        >
                          {user.type}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="font-mono">
                        {mentionTrigger}
                        {user.username}
                      </span>
                      {user.role && (
                        <>
                          <span className="text-muted-foreground/50">•</span>
                          <span>{user.role}</span>
                        </>
                      )}
                    </div>
                    {user.capabilities && user.capabilities.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {user.capabilities.slice(0, 3).map((cap) => (
                          <Badge
                            key={cap}
                            variant="outline"
                            className="text-[9px] px-1 py-0 opacity-70"
                          >
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Keyboard hint */}
                  {index === selectedIndex && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary shrink-0"
                    >
                      ↵
                    </Badge>
                  )}
                </button>
              ))}

            {/* Render commands */}
            {suggestionType === 'command' &&
              commandSuggestions.map((command, index) => (
                <button
                  key={command.id}
                  role="option"
                  aria-selected={index === selectedIndex}
                  onClick={() => insertCommand(command)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3',
                    'hover:bg-white/40 dark:hover:bg-background/40',
                    'transition-all duration-200',
                    'text-left border-b border-glass-light/50 dark:border-glass-dark-light/50',
                    'last:border-b-0',
                    index === selectedIndex &&
                      'bg-primary/10 dark:bg-primary/20 border-primary/20'
                  )}
                >
                  {/* Command icon */}
                  {command.icon ? (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-primary/10 to-accent/10">
                      {command.icon}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold shrink-0 bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
                      {commandTrigger}
                    </div>
                  )}

                  {/* Command info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono font-semibold text-sm">
                        {commandTrigger}
                        {command.command}
                      </span>
                      {command.category && (
                        <Badge
                          variant="secondary"
                          className={cn('text-[10px] px-1.5 py-0', getCategoryColor(command.category))}
                        >
                          {command.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {command.description}
                    </p>
                    {command.parameters && command.parameters.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {command.parameters.slice(0, 3).map((param) => (
                          <Badge
                            key={param.name}
                            variant="outline"
                            className="text-[9px] px-1 py-0 opacity-70"
                          >
                            {param.required ? param.name : `[${param.name}]`}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Keyboard hint */}
                  {index === selectedIndex && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary shrink-0"
                    >
                      ↵
                    </Badge>
                  )}
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
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
        <AnimatePresence mode="popLayout">
          {userMentions.map((mention, index) => {
            const message = messages.get(mention.messageId)
            const mentioner = users.get(mention.userId)

            if (!message || !mentioner) return null

            return (
              <motion.div
                key={mention.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    !mention.isRead &&
                      'border-l-4 border-l-primary bg-accent/20'
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
        </AnimatePresence>

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
