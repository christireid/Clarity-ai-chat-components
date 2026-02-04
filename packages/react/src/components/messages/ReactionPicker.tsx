'use client'

import * as React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import { Search, Smile } from 'lucide-react'

// Emoji categories with their emojis
const EMOJI_CATEGORIES = {
  'Frequently Used': ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '✨'],
  Smileys: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '🥰',
    '😍',
    '🤩',
    '😘',
    '😗',
    '😚',
    '😙',
    '😋',
    '😛',
    '😜',
    '🤪',
    '😝',
    '🤑',
    '🤗',
    '🤭',
    '🤫',
    '🤔',
    '🤐',
    '🤨',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '🤥',
    '😌',
    '😔',
    '😪',
    '🤤',
    '😴',
  ],
  Gestures: [
    '👍',
    '👎',
    '👌',
    '✌️',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👈',
    '👉',
    '👆',
    '👇',
    '☝️',
    '✋',
    '🤚',
    '🖐️',
    '🖖',
    '👋',
    '🤙',
    '💪',
    '🖕',
    '✍️',
    '🙏',
    '🤝',
    '👏',
    '🙌',
  ],
  Hearts: [
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '🤎',
    '💔',
    '❣️',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
    '💝',
  ],
  Celebration: [
    '🎉',
    '🎊',
    '🎈',
    '🎁',
    '🎀',
    '🎂',
    '🍰',
    '🧁',
    '🥳',
    '🎆',
    '🎇',
    '✨',
    '🎯',
    '🏆',
    '🥇',
    '🥈',
    '🥉',
    '🏅',
  ],
  Objects: [
    '💡',
    '🔥',
    '💯',
    '⚡',
    '💫',
    '⭐',
    '🌟',
    '✅',
    '❌',
    '⚠️',
    '🚀',
    '🎯',
    '📌',
    '📍',
    '🔔',
    '💬',
    '💭',
    '🗨️',
  ],
}

export interface ReactionPickerProps {
  onSelect: (emoji: string) => void
  trigger?: React.ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
}

/**
 * ReactionPicker - Emoji grid picker with search functionality
 *
 * A comprehensive emoji picker with:
 * - Categorized emoji grid
 * - Search functionality
 * - Frequently used section
 * - Keyboard navigation
 * - Quick access to common reactions
 *
 * @example
 * ```tsx
 * <ReactionPicker
 *   onSelect={(emoji) => console.log('Selected:', emoji)}
 *   trigger={<Button size="sm"><Smile /></Button>}
 * />
 * ```
 */
export function ReactionPicker({
  onSelect,
  trigger,
  align = 'center',
  side = 'top',
}: ReactionPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string>(
    'Frequently Used'
  )

  const handleSelect = (emoji: string) => {
    onSelect(emoji)
    setOpen(false)
    setSearch('')
  }

  // Filter emojis based on search
  const filteredCategories = React.useMemo(() => {
    if (!search) return EMOJI_CATEGORIES

    const filtered: Record<string, string[]> = {}
    Object.entries(EMOJI_CATEGORIES).forEach(([category, emojis]) => {
      const matching = emojis.filter((emoji) =>
        emoji.toLowerCase().includes(search.toLowerCase())
      )
      if (matching.length > 0) {
        filtered[category] = matching
      }
    })
    return filtered
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Smile className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align={align}
        side={side}
        sideOffset={8}
      >
        <div className="flex flex-col h-[400px]">
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search emojis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 px-3 py-2 border-b overflow-x-auto">
            {Object.keys(filteredCategories).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors',
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              {Object.entries(filteredCategories).map(
                ([category, emojis]) =>
                  (!activeCategory || activeCategory === category) && (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                        {category}
                      </h4>
                      <div className="grid grid-cols-8 gap-1">
                        {emojis.map((emoji, index) => (
                          <button
                            key={`${emoji}-${index}`}
                            onClick={() => handleSelect(emoji)}
                            className="w-9 h-9 flex items-center justify-center text-2xl rounded-md hover:bg-muted transition-colors"
                            title={emoji}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>

            {Object.keys(filteredCategories).length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Smile className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No emojis found
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * QuickReactionBar - Quick access to common reactions
 *
 * @example
 * ```tsx
 * <QuickReactionBar
 *   onReact={(emoji) => console.log('Reacted:', emoji)}
 * />
 * ```
 */
export interface QuickReactionBarProps {
  onReact: (emoji: string) => void
  reactions?: string[]
  showPicker?: boolean
  className?: string
}

export function QuickReactionBar({
  onReact,
  reactions = ['👍', '❤️', '😂', '😮', '😢', '🎉'],
  showPicker = true,
  className,
}: QuickReactionBarProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {reactions.map((emoji) => (
        <Button
          key={emoji}
          variant="ghost"
          size="sm"
          onClick={() => onReact(emoji)}
          className="h-8 w-8 p-0 text-lg hover:scale-110 transition-transform"
        >
          {emoji}
        </Button>
      ))}
      {showPicker && (
        <ReactionPicker
          onSelect={onReact}
          trigger={
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Smile className="h-4 w-4" />
            </Button>
          }
        />
      )}
    </div>
  )
}
