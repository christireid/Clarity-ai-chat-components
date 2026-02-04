'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Checkbox } from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@clarity-chat/primitives'
import {
  Forward,
  Search,
  Users,
  MessageSquare,
  Check,
  User,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface ForwardTarget {
  id: string
  type: 'user' | 'channel' | 'conversation'
  name: string
  avatar?: string
  description?: string
}

export interface ForwardableMessage {
  id: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  timestamp: Date
  attachments?: Array<{
    type: string
    name: string
    url: string
  }>
}

// ============================================================================
// FORWARD DIALOG
// ============================================================================

interface ForwardDialogProps {
  message: ForwardableMessage
  targets: ForwardTarget[]
  onForward: (targetIds: string[], note?: string) => void
  isOpen: boolean
  onClose: () => void
  allowMultiple?: boolean
  showNote?: boolean
}

export function ForwardDialog({
  message,
  targets,
  onForward,
  isOpen,
  onClose,
  allowMultiple = true,
  showNote = true,
}: ForwardDialogProps) {
  const [search, setSearch] = React.useState('')
  const [selectedTargets, setSelectedTargets] = React.useState<string[]>([])
  const [note, setNote] = React.useState('')

  const filteredTargets = targets.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleTarget = (targetId: string) => {
    if (allowMultiple) {
      setSelectedTargets((prev) =>
        prev.includes(targetId)
          ? prev.filter((id) => id !== targetId)
          : [...prev, targetId]
      )
    } else {
      setSelectedTargets([targetId])
    }
  }

  const handleForward = () => {
    if (selectedTargets.length > 0) {
      onForward(selectedTargets, note || undefined)
      onClose()
      setSelectedTargets([])
      setNote('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Forward Message</DialogTitle>
        </DialogHeader>

        {/* Message Preview */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
              {message.author.avatar ? (
                <img
                  src={message.author.avatar || '/placeholder.svg'}
                  alt={message.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs">{message.author.name.charAt(0)}</span>
              )}
            </div>
            <span className="text-sm font-medium">{message.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm line-clamp-3">{message.content}</p>
          {message.attachments && message.attachments.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              + {message.attachments.length} attachment(s)
            </p>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users or channels..."
            className="pl-9"
          />
        </div>

        {/* Targets */}
        <div className="max-h-[200px] overflow-y-auto space-y-1">
          {filteredTargets.map((target) => (
            <ForwardTargetItem
              key={target.id}
              target={target}
              selected={selectedTargets.includes(target.id)}
              onToggle={() => handleToggleTarget(target.id)}
            />
          ))}
          {filteredTargets.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No results found
            </p>
          )}
        </div>

        {/* Note */}
        {showNote && (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Add a note (optional)
            </label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a message..."
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {selectedTargets.length} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleForward}
              disabled={selectedTargets.length === 0}
            >
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// FORWARD TARGET ITEM
// ============================================================================

interface ForwardTargetItemProps {
  target: ForwardTarget
  selected: boolean
  onToggle: () => void
  className?: string
}

export function ForwardTargetItem({
  target,
  selected,
  onToggle,
  className,
}: ForwardTargetItemProps) {
  const Icon =
    target.type === 'channel'
      ? MessageSquare
      : target.type === 'conversation'
        ? Users
        : User

  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex items-center gap-3 w-full p-2 rounded-lg transition-colors',
        selected ? 'bg-primary/10' : 'hover:bg-muted',
        className
      )}
    >
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
        {target.avatar ? (
          <img
            src={target.avatar || '/placeholder.svg'}
            alt={target.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-medium truncate">{target.name}</p>
        {target.description && (
          <p className="text-xs text-muted-foreground truncate">
            {target.description}
          </p>
        )}
      </div>
      <div
        className={cn(
          'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
          selected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
        )}
      >
        {selected && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>
    </button>
  )
}

// ============================================================================
// FORWARD BUTTON
// ============================================================================

interface ForwardButtonProps {
  message: ForwardableMessage
  targets: ForwardTarget[]
  onForward: (targetIds: string[], note?: string) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline'
  className?: string
}

export function ForwardButton({
  message,
  targets,
  onForward,
  size = 'sm',
  variant = 'ghost',
  className,
}: ForwardButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-9 w-9',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <>
      <Button
        variant={variant}
        size="icon"
        className={cn(sizeClasses[size], className)}
        onClick={() => setIsOpen(true)}
      >
        <Forward className={iconSizes[size]} />
      </Button>
      <ForwardDialog
        message={message}
        targets={targets}
        onForward={onForward}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

// ============================================================================
// FORWARDED MESSAGE INDICATOR
// ============================================================================

interface ForwardedMessageIndicatorProps {
  originalAuthor: string
  originalTimestamp?: Date
  className?: string
}

export function ForwardedMessageIndicator({
  originalAuthor,
  originalTimestamp,
  className,
}: ForwardedMessageIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs text-muted-foreground mb-1',
        className
      )}
    >
      <Forward className="h-3 w-3" />
      <span>
        Forwarded from <span className="font-medium">{originalAuthor}</span>
        {originalTimestamp && <> on {originalTimestamp.toLocaleDateString()}</>}
      </span>
    </div>
  )
}

// ============================================================================
// FORWARDED MESSAGE CARD
// ============================================================================

interface ForwardedMessageCardProps {
  message: ForwardableMessage
  note?: string
  forwardedBy?: string
  forwardedAt?: Date
  onClick?: () => void
  className?: string
}

export function ForwardedMessageCard({
  message,
  note,
  forwardedBy,
  forwardedAt,
  onClick,
  className,
}: ForwardedMessageCardProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {note && <p className="text-sm">{note}</p>}
      <div
        onClick={onClick}
        className={cn(
          'p-3 rounded-lg border border-border bg-muted/30',
          onClick && 'cursor-pointer hover:bg-muted/50 transition-colors'
        )}
      >
        <ForwardedMessageIndicator
          originalAuthor={message.author.name}
          originalTimestamp={message.timestamp}
        />
        <p className="text-sm">{message.content}</p>
        {message.attachments && message.attachments.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {message.attachments.length} attachment(s)
          </p>
        )}
      </div>
      {forwardedBy && (
        <p className="text-xs text-muted-foreground">
          Forwarded by {forwardedBy}
          {forwardedAt && <> at {forwardedAt.toLocaleTimeString()}</>}
        </p>
      )}
    </div>
  )
}
