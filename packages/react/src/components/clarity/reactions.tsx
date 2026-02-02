'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import { SmilePlus, Plus } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface Reaction {
  emoji: string
  count: number
  users: string[]
  reacted: boolean
}

export interface ReactionUser {
  id: string
  name: string
  avatar?: string
}

// ============================================================================
// EMOJI DATA
// ============================================================================

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👀']

const EMOJI_CATEGORIES = {
  frequent: ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👀', '✅', '💯'],
  smileys: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😅',
    '😂',
    '🤣',
    '😊',
    '😇',
    '🙂',
    '😉',
    '😍',
    '🥰',
    '😘',
    '😋',
    '😜',
    '🤔',
    '🤗',
    '🤩',
    '😎',
  ],
  gestures: [
    '👍',
    '👎',
    '👏',
    '🙌',
    '🤝',
    '🙏',
    '💪',
    '✌️',
    '🤞',
    '👌',
    '🤙',
    '👋',
    '✋',
    '🖐️',
    '👆',
    '👇',
    '👈',
    '👉',
    '🖕',
    '✊',
  ],
  symbols: [
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '💔',
    '❣️',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
    '💝',
    '⭐',
    '✨',
    '💫',
  ],
  objects: [
    '🎉',
    '🎊',
    '🎁',
    '🏆',
    '🥇',
    '🎯',
    '💡',
    '📌',
    '🔥',
    '💥',
    '✅',
    '❌',
    '⚠️',
    '💯',
    '🔔',
    '📢',
    '💬',
    '💭',
    '🗨️',
    '📝',
  ],
}

// ============================================================================
// REACTION BADGE
// ============================================================================

interface ReactionBadgeProps {
  reaction: Reaction
  onToggle: (emoji: string) => void
  showUsers?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ReactionBadge({
  reaction,
  onToggle,
  showUsers = true,
  size = 'md',
  className,
}: ReactionBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 px-1.5 text-xs gap-1',
    md: 'h-7 px-2 text-sm gap-1.5',
    lg: 'h-8 px-2.5 text-base gap-2',
  }

  const badge = (
    <button
      onClick={() => onToggle(reaction.emoji)}
      className={cn(
        'inline-flex items-center rounded-full border transition-all',
        reaction.reacted
          ? 'bg-primary/10 border-primary/30 text-primary'
          : 'bg-muted/50 border-border hover:bg-muted',
        sizeClasses[size],
        className
      )}
    >
      <span>{reaction.emoji}</span>
      <span className="font-medium">{reaction.count}</span>
    </button>
  )

  if (!showUsers || reaction.users.length === 0) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <p className="text-xs">
            {reaction.users.slice(0, 10).join(', ')}
            {reaction.users.length > 10 &&
              ` and ${reaction.users.length - 10} others`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ============================================================================
// REACTION LIST
// ============================================================================

interface ReactionListProps {
  reactions: Reaction[]
  onToggle: (emoji: string) => void
  onAdd?: (emoji: string) => void
  showAddButton?: boolean
  maxVisible?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ReactionList({
  reactions,
  onToggle,
  onAdd,
  showAddButton = true,
  maxVisible = 8,
  size = 'md',
  className,
}: ReactionListProps) {
  const [showAll, setShowAll] = React.useState(false)
  const visibleReactions = showAll ? reactions : reactions.slice(0, maxVisible)
  const hiddenCount = reactions.length - maxVisible

  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      {visibleReactions.map((reaction) => (
        <ReactionBadge
          key={reaction.emoji}
          reaction={reaction}
          onToggle={onToggle}
          size={size}
        />
      ))}

      {!showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className={cn(
            'inline-flex items-center justify-center rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors',
            size === 'sm'
              ? 'h-6 px-2 text-xs'
              : size === 'md'
                ? 'h-7 px-2.5 text-sm'
                : 'h-8 px-3 text-base'
          )}
        >
          +{hiddenCount}
        </button>
      )}

      {showAddButton && onAdd && (
        <ReactionPicker onSelect={onAdd} size={size} />
      )}
    </div>
  )
}

// ============================================================================
// REACTION PICKER
// ============================================================================

interface ReactionPickerProps {
  onSelect: (emoji: string) => void
  size?: 'sm' | 'md' | 'lg'
  quickOnly?: boolean
  className?: string
}

export function ReactionPicker({
  onSelect,
  size = 'md',
  quickOnly = false,
  className,
}: ReactionPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [activeCategory, setActiveCategory] =
    React.useState<keyof typeof EMOJI_CATEGORIES>('frequent')

  const handleSelect = (emoji: string) => {
    onSelect(emoji)
    setOpen(false)
  }

  const buttonSize =
    size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-7 w-7' : 'h-8 w-8'
  const iconSize =
    size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center justify-center rounded-full border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-colors',
            buttonSize,
            className
          )}
        >
          <SmilePlus className={cn(iconSize, 'text-muted-foreground')} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-2', quickOnly ? 'w-auto' : 'w-80')}
        align="start"
        side="top"
      >
        {quickOnly ? (
          <div className="flex gap-1">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleSelect(emoji)}
                className="p-1.5 hover:bg-muted rounded transition-colors text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Quick reactions */}
            <div className="flex gap-1 pb-2 border-b border-border">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSelect(emoji)}
                  className="p-1.5 hover:bg-muted rounded transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)
                  }
                  className={cn(
                    'px-2 py-1 text-xs rounded capitalize whitespace-nowrap transition-colors',
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Emoji grid */}
            <div className="grid grid-cols-10 gap-0.5 max-h-40 overflow-y-auto">
              {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSelect(emoji)}
                  className="p-1.5 hover:bg-muted rounded transition-colors text-lg text-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// ============================================================================
// QUICK REACTION BAR
// ============================================================================

interface QuickReactionBarProps {
  onSelect: (emoji: string) => void
  emojis?: string[]
  className?: string
}

export function QuickReactionBar({
  onSelect,
  emojis = QUICK_REACTIONS.slice(0, 6),
  className,
}: QuickReactionBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 p-1 rounded-lg bg-popover border border-border shadow-lg',
        className
      )}
    >
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="p-1.5 hover:bg-muted rounded transition-colors text-lg hover:scale-125"
        >
          {emoji}
        </button>
      ))}
      <div className="w-px h-6 bg-border mx-1" />
      <ReactionPicker onSelect={onSelect} quickOnly />
    </div>
  )
}

// ============================================================================
// ANIMATED REACTION
// ============================================================================

interface AnimatedReactionProps {
  emoji: string
  onComplete?: () => void
  className?: string
}

export function AnimatedReaction({
  emoji,
  onComplete,
  className,
}: AnimatedReactionProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, 1000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={cn(
        'absolute pointer-events-none animate-bounce-up text-4xl',
        className
      )}
      style={{
        animation: 'bounce-up 1s ease-out forwards',
      }}
    >
      {emoji}
    </div>
  )
}

// ============================================================================
// REACTION SUMMARY
// ============================================================================

interface ReactionSummaryProps {
  reactions: Reaction[]
  maxEmojis?: number
  className?: string
}

export function ReactionSummary({
  reactions,
  maxEmojis = 3,
  className,
}: ReactionSummaryProps) {
  const sortedReactions = [...reactions].sort((a, b) => b.count - a.count)
  const topReactions = sortedReactions.slice(0, maxEmojis)
  const totalCount = reactions.reduce((sum, r) => sum + r.count, 0)

  if (totalCount === 0) return null

  return (
    <div
      className={cn('flex items-center gap-1 text-muted-foreground', className)}
    >
      <div className="flex -space-x-1">
        {topReactions.map((reaction, i) => (
          <span
            key={reaction.emoji}
            className="text-sm"
            style={{ zIndex: maxEmojis - i }}
          >
            {reaction.emoji}
          </span>
        ))}
      </div>
      <span className="text-xs">{totalCount}</span>
    </div>
  )
}

// ============================================================================
// MESSAGE WITH REACTIONS
// ============================================================================

interface MessageReactionsProps {
  messageId: string
  reactions: Reaction[]
  onAddReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
  position?: 'below' | 'inline' | 'floating'
  className?: string
}

export function MessageReactions({
  messageId,
  reactions,
  onAddReaction,
  onRemoveReaction,
  position = 'below',
  className,
}: MessageReactionsProps) {
  const handleToggle = (emoji: string) => {
    const existing = reactions.find((r) => r.emoji === emoji)
    if (existing?.reacted) {
      onRemoveReaction(messageId, emoji)
    } else {
      onAddReaction(messageId, emoji)
    }
  }

  const handleAdd = (emoji: string) => {
    onAddReaction(messageId, emoji)
  }

  if (reactions.length === 0 && position !== 'floating') {
    return null
  }

  const positionClasses = {
    below: 'mt-1',
    inline: 'ml-2',
    floating: 'absolute -bottom-3 left-4',
  }

  return (
    <div className={cn(positionClasses[position], className)}>
      <ReactionList
        reactions={reactions}
        onToggle={handleToggle}
        onAdd={handleAdd}
        size="sm"
      />
    </div>
  )
}

// ============================================================================
// REACTION ANALYTICS
// ============================================================================

interface ReactionAnalyticsProps {
  reactions: Reaction[]
  className?: string
}

export function ReactionAnalytics({
  reactions,
  className,
}: ReactionAnalyticsProps) {
  const sortedReactions = [...reactions].sort((a, b) => b.count - a.count)
  const totalCount = reactions.reduce((sum, r) => sum + r.count, 0)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total Reactions</span>
        <span className="font-medium">{totalCount}</span>
      </div>

      <div className="space-y-2">
        {sortedReactions.map((reaction) => {
          const percentage =
            totalCount > 0 ? (reaction.count / totalCount) * 100 : 0
          return (
            <div key={reaction.emoji} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{reaction.emoji}</span>
                <span className="text-muted-foreground">
                  {reaction.count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useReactions(initialReactions: Reaction[] = []) {
  const [reactions, setReactions] = React.useState<Reaction[]>(initialReactions)

  const addReaction = React.useCallback(
    (emoji: string, userName: string = 'You') => {
      setReactions((prev) => {
        const existing = prev.find((r) => r.emoji === emoji)
        if (existing) {
          if (existing.reacted) return prev
          return prev.map((r) =>
            r.emoji === emoji
              ? {
                  ...r,
                  count: r.count + 1,
                  users: [...r.users, userName],
                  reacted: true,
                }
              : r
          )
        }
        return [...prev, { emoji, count: 1, users: [userName], reacted: true }]
      })
    },
    []
  )

  const removeReaction = React.useCallback(
    (emoji: string, userName: string = 'You') => {
      setReactions((prev) => {
        const existing = prev.find((r) => r.emoji === emoji)
        if (!existing || !existing.reacted) return prev

        if (existing.count === 1) {
          return prev.filter((r) => r.emoji !== emoji)
        }

        return prev.map((r) =>
          r.emoji === emoji
            ? {
                ...r,
                count: r.count - 1,
                users: r.users.filter((u) => u !== userName),
                reacted: false,
              }
            : r
        )
      })
    },
    []
  )

  const toggleReaction = React.useCallback(
    (emoji: string, userName: string = 'You') => {
      const existing = reactions.find((r) => r.emoji === emoji)
      if (existing?.reacted) {
        removeReaction(emoji, userName)
      } else {
        addReaction(emoji, userName)
      }
    },
    [reactions, addReaction, removeReaction]
  )

  return {
    reactions,
    addReaction,
    removeReaction,
    toggleReaction,
    setReactions,
  }
}
