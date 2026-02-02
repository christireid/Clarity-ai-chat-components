'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from '@clarity-chat/primitives'
import { AtSign, Hash, Bot } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface MentionUser {
  id: string
  name: string
  username: string
  avatar?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
}

export interface MentionChannel {
  id: string
  name: string
  description?: string
  isPrivate?: boolean
}

export interface MentionAgent {
  id: string
  name: string
  description?: string
  avatar?: string
}

export type MentionType = 'user' | 'channel' | 'agent'

export interface Mention {
  type: MentionType
  id: string
  name: string
  displayText: string
}

// ============================================================================
// MENTION INPUT
// ============================================================================

interface MentionInputProps {
  value: string
  onChange: (value: string, mentions: Mention[]) => void
  users?: MentionUser[]
  channels?: MentionChannel[]
  agents?: MentionAgent[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function MentionInput({
  value,
  onChange,
  users = [],
  channels = [],
  agents = [],
  placeholder = 'Type @ to mention someone...',
  disabled = false,
  className,
}: MentionInputProps) {
  const [open, setOpen] = React.useState(false)
  const [triggerChar, setTriggerChar] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [cursorPosition, setCursorPosition] = React.useState(0)
  const [mentions, setMentions] = React.useState<Mention[]>([])
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursor = e.target.selectionStart || 0
    setCursorPosition(cursor)

    // Check for trigger characters
    const charBeforeCursor = newValue[cursor - 1]
    const charTwoBeforeCursor = newValue[cursor - 2]

    if (
      (charBeforeCursor === '@' || charBeforeCursor === '#') &&
      (charTwoBeforeCursor === undefined ||
        charTwoBeforeCursor === ' ' ||
        charTwoBeforeCursor === '\n')
    ) {
      setTriggerChar(charBeforeCursor)
      setSearchQuery('')
      setOpen(true)
    } else if (
      triggerChar &&
      charBeforeCursor !== ' ' &&
      charBeforeCursor !== '\n'
    ) {
      // Continue building search query
      const triggerIndex = newValue.lastIndexOf(triggerChar, cursor - 1)
      if (triggerIndex !== -1) {
        setSearchQuery(newValue.slice(triggerIndex + 1, cursor))
      }
    } else {
      setOpen(false)
      setTriggerChar(null)
    }

    onChange(newValue, mentions)
  }

  const handleSelect = (
    item: MentionUser | MentionChannel | MentionAgent,
    type: MentionType
  ) => {
    const triggerIndex = value.lastIndexOf(
      triggerChar || '',
      cursorPosition - 1
    )
    const beforeTrigger = value.slice(0, triggerIndex)
    const afterCursor = value.slice(cursorPosition)

    const displayText =
      type === 'channel' ? `#${(item as MentionChannel).name}` : `@${item.name}`
    const newValue = `${beforeTrigger}${displayText} ${afterCursor}`

    const newMention: Mention = {
      type,
      id: item.id,
      name: item.name,
      displayText,
    }

    const updatedMentions = [...mentions, newMention]
    setMentions(updatedMentions)
    onChange(newValue, updatedMentions)
    setOpen(false)
    setTriggerChar(null)

    // Focus back on textarea
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAgents = agents.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
            className
          )}
        />
      </PopoverAnchor>
      <PopoverContent className="w-64 p-0" align="start" side="top">
        <Command>
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>

            {triggerChar === '@' && filteredUsers.length > 0 && (
              <CommandGroup heading="Users">
                {filteredUsers.slice(0, 5).map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelect(user, 'user')}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar || '/placeholder.svg'}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs">{user.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                      {user.status === 'online' && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {triggerChar === '@' && filteredAgents.length > 0 && (
              <CommandGroup heading="AI Agents">
                {filteredAgents.slice(0, 3).map((agent) => (
                  <CommandItem
                    key={agent.id}
                    onSelect={() => handleSelect(agent, 'agent')}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{agent.name}</p>
                        {agent.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {agent.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {triggerChar === '#' && filteredChannels.length > 0 && (
              <CommandGroup heading="Channels">
                {filteredChannels.slice(0, 5).map((channel) => (
                  <CommandItem
                    key={channel.id}
                    onSelect={() => handleSelect(channel, 'channel')}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{channel.name}</p>
                        {channel.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {channel.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ============================================================================
// MENTION CHIP
// ============================================================================

interface MentionChipProps {
  mention: Mention
  onClick?: () => void
  onRemove?: () => void
  size?: 'sm' | 'md'
  className?: string
}

export function MentionChip({
  mention,
  onClick,
  onRemove,
  size = 'md',
  className,
}: MentionChipProps) {
  const Icon =
    mention.type === 'channel' ? Hash : mention.type === 'agent' ? Bot : AtSign

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
  }

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded bg-primary/10 text-primary font-medium cursor-pointer hover:bg-primary/20 transition-colors',
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      {mention.name}
    </span>
  )
}

// ============================================================================
// MENTIONED TEXT
// ============================================================================

interface MentionedTextProps {
  text: string
  mentions: Mention[]
  onMentionClick?: (mention: Mention) => void
  className?: string
}

export function MentionedText({
  text,
  mentions,
  onMentionClick,
  className,
}: MentionedTextProps) {
  const parts = React.useMemo(() => {
    let result: Array<{
      type: 'text' | 'mention'
      content: string
      mention?: Mention
    }> = []
    let currentIndex = 0

    mentions.forEach((mention) => {
      const mentionIndex = text.indexOf(mention.displayText, currentIndex)
      if (mentionIndex !== -1) {
        if (mentionIndex > currentIndex) {
          result.push({
            type: 'text',
            content: text.slice(currentIndex, mentionIndex),
          })
        }
        result.push({ type: 'mention', content: mention.displayText, mention })
        currentIndex = mentionIndex + mention.displayText.length
      }
    })

    if (currentIndex < text.length) {
      result.push({ type: 'text', content: text.slice(currentIndex) })
    }

    return result
  }, [text, mentions])

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.type === 'mention' && part.mention ? (
          <MentionChip
            key={index}
            mention={part.mention}
            onClick={() => onMentionClick?.(part.mention!)}
            size="sm"
          />
        ) : (
          <span key={index}>{part.content}</span>
        )
      )}
    </span>
  )
}

// ============================================================================
// MENTION BADGE
// ============================================================================

interface MentionBadgeProps {
  count: number
  className?: string
}

export function MentionBadge({ count, className }: MentionBadgeProps) {
  if (count === 0) return null

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium',
        className
      )}
    >
      @{count > 99 ? '99+' : count}
    </span>
  )
}

// ============================================================================
// MENTION NOTIFICATION
// ============================================================================

interface MentionNotificationProps {
  author: {
    name: string
    avatar?: string
  }
  message: string
  timestamp: Date
  onClick?: () => void
  className?: string
}

export function MentionNotification({
  author,
  message,
  timestamp,
  onClick,
  className,
}: MentionNotificationProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 p-3 w-full text-left hover:bg-muted/50 transition-colors rounded-lg',
        className
      )}
    >
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        {author.avatar ? (
          <img
            src={author.avatar || '/placeholder.svg'}
            alt={author.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium">{author.name.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{author.name}</span>
          <span className="text-muted-foreground"> mentioned you</span>
        </p>
        <p className="text-sm text-muted-foreground truncate mt-0.5">
          {message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      <AtSign className="h-4 w-4 text-primary flex-shrink-0" />
    </button>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useMentions() {
  const [mentions, setMentions] = React.useState<Mention[]>([])

  const addMention = React.useCallback((mention: Mention) => {
    setMentions((prev) => [...prev, mention])
  }, [])

  const removeMention = React.useCallback((mentionId: string) => {
    setMentions((prev) => prev.filter((m) => m.id !== mentionId))
  }, [])

  const clearMentions = React.useCallback(() => {
    setMentions([])
  }, [])

  const extractMentions = React.useCallback((text: string): Mention[] => {
    const userMentions = text.match(/@\w+/g) || []
    const channelMentions = text.match(/#\w+/g) || []

    return [
      ...userMentions.map((m) => ({
        type: 'user' as MentionType,
        id: m.slice(1),
        name: m.slice(1),
        displayText: m,
      })),
      ...channelMentions.map((m) => ({
        type: 'channel' as MentionType,
        id: m.slice(1),
        name: m.slice(1),
        displayText: m,
      })),
    ]
  }, [])

  return {
    mentions,
    addMention,
    removeMention,
    clearMentions,
    extractMentions,
    setMentions,
  }
}
