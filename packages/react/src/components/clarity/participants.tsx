'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Users,
  Crown,
  Shield,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Mail,
  AtSign,
  Circle,
  MessageSquare,
  Video,
  Phone,
} from 'lucide-react'

interface Participant {
  id: string
  name: string
  avatar?: string
  email?: string
  role?: 'owner' | 'admin' | 'member' | 'viewer'
  status?: 'online' | 'away' | 'busy' | 'offline'
  isTyping?: boolean
  lastSeen?: Date
}

// Participant avatar with status
interface ParticipantAvatarProps {
  participant: Participant
  size?: 'sm' | 'md' | 'lg'
  showStatus?: boolean
  showTooltip?: boolean
  className?: string
}

export function ParticipantAvatar({
  participant,
  size = 'md',
  showStatus = true,
  showTooltip = true,
  className,
}: ParticipantAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const statusColors: Record<string, string> = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400',
  }

  const statusSizes = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  }

  const content = (
    <div className={cn('relative', className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage
          src={participant.avatar || '/placeholder.svg'}
          alt={participant.name}
        />
        <AvatarFallback className="text-xs">
          {participant.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      {showStatus && participant.status && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background',
            statusSizes[size],
            statusColors[participant.status]
          )}
        />
      )}
    </div>
  )

  if (!showTooltip) return content

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{participant.name}</p>
            {participant.status && (
              <p className="text-xs text-muted-foreground capitalize">
                {participant.status}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Participants stack (overlapping avatars)
interface ParticipantsStackProps {
  participants: Participant[]
  max?: number
  size?: 'sm' | 'md' | 'lg'
  onShowAll?: () => void
  className?: string
}

export function ParticipantsStack({
  participants,
  max = 4,
  size = 'md',
  onShowAll,
  className,
}: ParticipantsStackProps) {
  const displayed = participants.slice(0, max)
  const remaining = participants.length - max

  const sizeClasses = {
    sm: 'h-6 w-6 -ml-2 first:ml-0',
    md: 'h-8 w-8 -ml-3 first:ml-0',
    lg: 'h-10 w-10 -ml-4 first:ml-0',
  }

  return (
    <div className={cn('flex items-center', className)}>
      {displayed.map((participant) => (
        <ParticipantAvatar
          key={participant.id}
          participant={participant}
          size={size}
          className={sizeClasses[size]}
          showStatus={false}
        />
      ))}
      {remaining > 0 && (
        <button
          className={cn(
            'flex items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-medium border-2 border-background',
            sizeClasses[size]
          )}
          onClick={onShowAll}
        >
          +{remaining}
        </button>
      )}
    </div>
  )
}

// Participants list
interface ParticipantsListProps {
  participants: Participant[]
  currentUserId?: string
  onInvite?: () => void
  onRemove?: (participant: Participant) => void
  onMessage?: (participant: Participant) => void
  onCall?: (participant: Participant) => void
  className?: string
}

export function ParticipantsList({
  participants,
  currentUserId,
  onInvite,
  onRemove,
  onMessage,
  onCall,
  className,
}: ParticipantsListProps) {
  const roleIcons: Record<string, React.ReactNode> = {
    owner: <Crown className="h-3 w-3 text-yellow-500" />,
    admin: <Shield className="h-3 w-3 text-blue-500" />,
  }

  const sortedParticipants = [...participants].sort((a, b) => {
    const roleOrder = { owner: 0, admin: 1, member: 2, viewer: 3 }
    return (
      (roleOrder[a.role ?? 'member'] ?? 2) -
      (roleOrder[b.role ?? 'member'] ?? 2)
    )
  })

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Participants ({participants.length})
          </span>
        </div>
        {onInvite && (
          <Button variant="ghost" size="sm" onClick={onInvite}>
            <UserPlus className="h-4 w-4 mr-1" />
            Invite
          </Button>
        )}
      </div>

      <ScrollArea className="h-64">
        <div className="space-y-1">
          {sortedParticipants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50"
            >
              <ParticipantAvatar
                participant={participant}
                showTooltip={false}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium truncate">
                    {participant.name}
                  </span>
                  {participant.id === currentUserId && (
                    <Badge variant="outline" className="text-xs">
                      You
                    </Badge>
                  )}
                  {participant.role && roleIcons[participant.role]}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {participant.isTyping ? (
                    <span className="text-accent">typing...</span>
                  ) : participant.status ? (
                    <>
                      <Circle
                        className={cn(
                          'h-2 w-2',
                          participant.status === 'online' &&
                            'fill-green-500 text-green-500',
                          participant.status === 'away' &&
                            'fill-yellow-500 text-yellow-500',
                          participant.status === 'busy' &&
                            'fill-red-500 text-red-500',
                          participant.status === 'offline' &&
                            'fill-gray-400 text-gray-400'
                        )}
                      />
                      <span className="capitalize">{participant.status}</span>
                    </>
                  ) : null}
                </div>
              </div>

              {participant.id !== currentUserId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onMessage && (
                      <DropdownMenuItem onClick={() => onMessage(participant)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </DropdownMenuItem>
                    )}
                    {onCall && (
                      <DropdownMenuItem onClick={() => onCall(participant)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </DropdownMenuItem>
                    )}
                    {participant.email && (
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        {participant.email}
                      </DropdownMenuItem>
                    )}
                    {onRemove && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onRemove(participant)}
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// Typing indicator for multiple participants
interface TypingIndicatorProps {
  participants: Participant[]
  className?: string
}

export function MultiTypingIndicator({
  participants,
  className,
}: TypingIndicatorProps) {
  if (participants.length === 0) return null

  const names = participants.map((p) => p.name)
  let text = ''

  if (names.length === 1) {
    text = `${names[0]} is typing`
  } else if (names.length === 2) {
    text = `${names[0]} and ${names[1]} are typing`
  } else {
    text = `${names[0]} and ${names.length - 1} others are typing`
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <span>{text}</span>
    </div>
  )
}

// Online presence indicator
interface PresenceIndicatorProps {
  online: number
  total: number
  className?: string
}

export function PresenceIndicator({
  online,
  total,
  className,
}: PresenceIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <span className="h-2 w-2 rounded-full bg-green-500" />
      <span className="text-muted-foreground">
        {online} of {total} online
      </span>
    </div>
  )
}

// Invite participants dialog content
interface InviteParticipantsProps {
  onInvite: (emails: string[]) => void
  className?: string
}

export function InviteParticipants({
  onInvite,
  className,
}: InviteParticipantsProps) {
  const [emails, setEmails] = React.useState<string[]>([])
  const [input, setInput] = React.useState('')

  const handleAddEmail = () => {
    if (input && !emails.includes(input)) {
      setEmails([...emails, input])
      setInput('')
    }
  }

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddEmail()
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email addresses</label>
        <div className="flex gap-2">
          <input
            type="email"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter email address"
            className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
          />
          <Button onClick={handleAddEmail} disabled={!input}>
            Add
          </Button>
        </div>
      </div>

      {emails.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Inviting</label>
          <div className="flex flex-wrap gap-2">
            {emails.map((email) => (
              <Badge key={email} variant="secondary" className="gap-1">
                <AtSign className="h-3 w-3" />
                {email}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => handleRemoveEmail(email)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button
        className="w-full"
        disabled={emails.length === 0}
        onClick={() => onInvite(emails)}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Send {emails.length} Invitation{emails.length !== 1 ? 's' : ''}
      </Button>
    </div>
  )
}
