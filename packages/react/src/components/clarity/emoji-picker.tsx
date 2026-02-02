'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Smile,
  Search,
  Clock,
  Heart,
  Smile as SmileIcon,
  Coffee,
  Flag,
  Car,
  Lightbulb,
  Music,
} from 'lucide-react'

const emojiCategories = [
  {
    id: 'recent',
    icon: Clock,
    label: 'Recent',
    emojis: [] as string[],
  },
  {
    id: 'smileys',
    icon: SmileIcon,
    label: 'Smileys',
    emojis: [
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
      '🙃',
      '😉',
      '😌',
      '😍',
      '🥰',
      '😘',
      '😗',
      '😙',
      '😚',
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
      '😷',
      '🤒',
      '🤕',
      '🤢',
      '🤮',
      '🤧',
      '🥵',
      '🥶',
      '🥴',
      '😵',
      '🤯',
      '🤠',
      '🥳',
      '🥸',
      '😎',
      '🤓',
      '🧐',
    ],
  },
  {
    id: 'people',
    icon: Heart,
    label: 'People',
    emojis: [
      '👋',
      '🤚',
      '🖐️',
      '✋',
      '🖖',
      '👌',
      '🤌',
      '🤏',
      '✌️',
      '🤞',
      '🤟',
      '🤘',
      '🤙',
      '👈',
      '👉',
      '👆',
      '🖕',
      '👇',
      '☝️',
      '👍',
      '👎',
      '✊',
      '👊',
      '🤛',
      '🤜',
      '👏',
      '🙌',
      '👐',
      '🤲',
      '🤝',
      '🙏',
      '✍️',
      '💪',
      '🦾',
      '🦿',
      '🦵',
      '🦶',
      '👂',
      '🦻',
      '👃',
      '🧠',
      '🫀',
      '🫁',
      '🦷',
      '🦴',
      '👀',
      '👁️',
      '👅',
      '👄',
    ],
  },
  {
    id: 'nature',
    icon: Coffee,
    label: 'Nature',
    emojis: [
      '🐶',
      '🐱',
      '🐭',
      '🐹',
      '🐰',
      '🦊',
      '🐻',
      '🐼',
      '🐨',
      '🐯',
      '🦁',
      '🐮',
      '🐷',
      '🐸',
      '🐵',
      '🙈',
      '🙉',
      '🙊',
      '🐒',
      '🐔',
      '🐧',
      '🐦',
      '🐤',
      '🐣',
      '🐥',
      '🦆',
      '🦅',
      '🦉',
      '🦇',
      '🐺',
      '🐗',
      '🐴',
      '🦄',
      '🐝',
      '🪱',
      '🐛',
      '🦋',
      '🐌',
      '🐞',
      '🐜',
      '🪰',
      '🪲',
      '🪳',
      '🦟',
      '🦗',
      '🕷️',
      '🦂',
      '🐢',
      '🐍',
      '🦎',
    ],
  },
  {
    id: 'food',
    icon: Coffee,
    label: 'Food',
    emojis: [
      '🍎',
      '🍐',
      '🍊',
      '🍋',
      '🍌',
      '🍉',
      '🍇',
      '🍓',
      '🫐',
      '🍈',
      '🍒',
      '🍑',
      '🥭',
      '🍍',
      '🥥',
      '🥝',
      '🍅',
      '🍆',
      '🥑',
      '🥦',
      '🥬',
      '🥒',
      '🌶️',
      '🫑',
      '🌽',
      '🥕',
      '🧄',
      '🧅',
      '🥔',
      '🍠',
      '🥐',
      '🥯',
      '🍞',
      '🥖',
      '🥨',
      '🧀',
      '🥚',
      '🍳',
      '🧈',
      '🥞',
      '🧇',
      '🥓',
      '🥩',
      '🍗',
      '🍖',
      '🦴',
      '🌭',
      '🍔',
      '🍟',
      '🍕',
    ],
  },
  {
    id: 'activities',
    icon: Music,
    label: 'Activities',
    emojis: [
      '⚽',
      '🏀',
      '🏈',
      '⚾',
      '🥎',
      '🎾',
      '🏐',
      '🏉',
      '🥏',
      '🎱',
      '🪀',
      '🏓',
      '🏸',
      '🏒',
      '🏑',
      '🥍',
      '🏏',
      '🪃',
      '🥅',
      '⛳',
      '🪁',
      '🏹',
      '🎣',
      '🤿',
      '🥊',
      '🥋',
      '🎽',
      '🛹',
      '🛼',
      '🛷',
      '⛸️',
      '🥌',
      '🎿',
      '⛷️',
      '🏂',
      '🪂',
      '🏋️',
      '🤼',
      '🤸',
      '🤺',
      '⛹️',
      '🤾',
      '🏌️',
      '🏇',
      '🧘',
      '🏄',
      '🏊',
      '🤽',
      '🚣',
      '🧗',
    ],
  },
  {
    id: 'travel',
    icon: Car,
    label: 'Travel',
    emojis: [
      '🚗',
      '🚕',
      '🚙',
      '🚌',
      '🚎',
      '🏎️',
      '🚓',
      '🚑',
      '🚒',
      '🚐',
      '🛻',
      '🚚',
      '🚛',
      '🚜',
      '🦯',
      '🦽',
      '🦼',
      '🛴',
      '🚲',
      '🛵',
      '🏍️',
      '🛺',
      '🚨',
      '🚔',
      '🚍',
      '🚘',
      '🚖',
      '🚡',
      '🚠',
      '🚟',
      '🚃',
      '🚋',
      '🚞',
      '🚝',
      '🚄',
      '🚅',
      '🚈',
      '🚂',
      '🚆',
      '🚇',
      '🚊',
      '🚉',
      '✈️',
      '🛫',
      '🛬',
      '🛩️',
      '💺',
      '🛰️',
      '🚀',
      '🛸',
    ],
  },
  {
    id: 'objects',
    icon: Lightbulb,
    label: 'Objects',
    emojis: [
      '⌚',
      '📱',
      '📲',
      '💻',
      '⌨️',
      '🖥️',
      '🖨️',
      '🖱️',
      '🖲️',
      '🕹️',
      '🗜️',
      '💽',
      '💾',
      '💿',
      '📀',
      '📼',
      '📷',
      '📸',
      '📹',
      '🎥',
      '📽️',
      '🎞️',
      '📞',
      '☎️',
      '📟',
      '📠',
      '📺',
      '📻',
      '🎙️',
      '🎚️',
      '🎛️',
      '🧭',
      '⏱️',
      '⏲️',
      '⏰',
      '🕰️',
      '⌛',
      '⏳',
      '📡',
      '🔋',
      '🔌',
      '💡',
      '🔦',
      '🕯️',
      '🪔',
      '🧯',
      '🛢️',
      '💸',
      '💵',
      '💴',
    ],
  },
  {
    id: 'symbols',
    icon: Flag,
    label: 'Symbols',
    emojis: [
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
      '💟',
      '☮️',
      '✝️',
      '☪️',
      '🕉️',
      '☸️',
      '✡️',
      '🔯',
      '🕎',
      '☯️',
      '☦️',
      '🛐',
      '⛎',
      '♈',
      '♉',
      '♊',
      '♋',
      '♌',
      '♍',
      '♎',
      '♏',
      '♐',
      '♑',
      '♒',
      '♓',
      '🆔',
      '⚛️',
      '🉑',
      '☢️',
      '☣️',
      '📴',
    ],
  },
]

interface EmojiPickerProps {
  onSelect?: (emoji: string) => void
  trigger?: React.ReactNode
  className?: string
}

export function EmojiPicker({
  onSelect,
  trigger,
  className,
}: EmojiPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState('smileys')
  const [recentEmojis, setRecentEmojis] = React.useState<string[]>([])

  React.useEffect(() => {
    const stored = localStorage.getItem('recentEmojis')
    if (stored) {
      setRecentEmojis(JSON.parse(stored))
    }
  }, [])

  const handleSelect = (emoji: string) => {
    onSelect?.(emoji)

    // Update recent emojis
    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(
      0,
      20
    )
    setRecentEmojis(updated)
    localStorage.setItem('recentEmojis', JSON.stringify(updated))

    setOpen(false)
  }

  const filteredCategories = React.useMemo(() => {
    if (!search) {
      return emojiCategories.map((cat) => ({
        ...cat,
        emojis: cat.id === 'recent' ? recentEmojis : cat.emojis,
      }))
    }

    // Search across all categories
    const allEmojis = emojiCategories.flatMap((cat) => cat.emojis)
    return [
      {
        id: 'search',
        icon: Search,
        label: 'Search Results',
        emojis: allEmojis.filter((emoji) => emoji.includes(search)),
      },
    ]
  }, [search, recentEmojis])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" className={className}>
            <Smile className="h-5 w-5" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {/* Search */}
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emojis..."
              className="pl-9 h-8"
            />
          </div>
        </div>

        {/* Category Tabs */}
        {!search && (
          <div className="flex items-center gap-0.5 p-1 border-b border-border overflow-x-auto">
            {emojiCategories.map((cat) => (
              <Button
                key={cat.id}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 shrink-0',
                  activeCategory === cat.id && 'bg-secondary'
                )}
                onClick={() => setActiveCategory(cat.id)}
              >
                <cat.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        )}

        {/* Emoji Grid */}
        <ScrollArea className="h-64">
          <div className="p-2 space-y-4">
            {filteredCategories.map((category) => {
              if (category.emojis.length === 0) return null

              return (
                <div key={category.id}>
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    {category.label}
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {category.emojis.map((emoji, i) => (
                      <Button
                        key={`${emoji}-${i}`}
                        variant="ghost"
                        className="h-8 w-8 p-0 text-lg hover:bg-secondary"
                        onClick={() => handleSelect(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-2 border-t border-border text-center text-xs text-muted-foreground">
          Click to insert emoji
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Emoji reaction button
interface EmojiReactionProps {
  reactions: { emoji: string; count: number; reacted: boolean }[]
  onReact?: (emoji: string) => void
  onAddReaction?: () => void
  className?: string
}

export function EmojiReaction({
  reactions,
  onReact,
  onAddReaction,
  className,
}: EmojiReactionProps) {
  return (
    <div className={cn('flex items-center gap-1 flex-wrap', className)}>
      {reactions.map((reaction) => (
        <Button
          key={reaction.emoji}
          variant="ghost"
          size="sm"
          className={cn(
            'h-7 px-2 gap-1 text-xs',
            reaction.reacted && 'bg-accent/20 border border-accent'
          )}
          onClick={() => onReact?.(reaction.emoji)}
        >
          <span>{reaction.emoji}</span>
          <span className="text-muted-foreground">{reaction.count}</span>
        </Button>
      ))}
      <EmojiPicker
        onSelect={(emoji) => onReact?.(emoji)}
        trigger={
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Smile className="h-4 w-4" />
          </Button>
        }
      />
    </div>
  )
}

// Emoji input for text fields
interface EmojiInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function EmojiInput({
  value,
  onChange,
  placeholder,
  className,
}: EmojiInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current
    if (input) {
      const start = input.selectionStart ?? value.length
      const end = input.selectionEnd ?? value.length
      const newValue = value.slice(0, start) + emoji + value.slice(end)
      onChange(newValue)

      // Reset cursor position
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + emoji.length
        input.focus()
      }, 0)
    } else {
      onChange(value + emoji)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      <div className="absolute right-1 top-1/2 -translate-y-1/2">
        <EmojiPicker onSelect={handleEmojiSelect} />
      </div>
    </div>
  )
}
