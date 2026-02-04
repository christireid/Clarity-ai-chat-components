'use client'

/**
 * EmojiPicker Component - API Reference Documentation
 *
 * Rich emoji picker with search, categories, skin tones, and recently used emojis
 * for expressive messaging in chat interfaces.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Smile,
  Copy,
  Check,
  ChevronRight,
  Search,
  Clock,
  Heart,
  Coffee,
  Lightbulb,
  Flag,
  Palette,
  Zap,
  Grid3x3,
  Star,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Category Data Table Component
// ============================================================================

interface CategoryDefinition {
  id: string
  name: string
  icon: string
  description: string
  emojiCount: number
}

function CategoryTable({ categories }: { categories: CategoryDefinition[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Category
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Icon
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Count
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr
              key={category.id}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-medium text-foreground">
                {category.name}
              </td>
              <td className="px-4 py-3 text-2xl">{category.icon}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {category.emojiCount}
              </td>
              <td className="px-4 py-3 text-muted-foreground text-sm">
                {category.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [selectedEmoji, setSelectedEmoji] = React.useState<string>('')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState('smileys')
  const [skinTone, setSkinTone] = React.useState<number>(0)
  const [showSkinTones, setShowSkinTones] = React.useState(true)
  const [recentEmojis, setRecentEmojis] = React.useState<string[]>([
    '😊',
    '👍',
    '❤️',
    '🎉',
    '🔥',
  ])

  // Sample emoji data
  const emojis: Record<string, string[]> = {
    smileys: ['😀', '😃', '😄', '😁', '😊', '😇', '🙂', '🙃', '😉', '😌'],
    people: ['👋', '🤚', '🖐', '✋', '👌', '👍', '👎', '✊', '👊', '🤝'],
    nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
    food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥝'],
    activity: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐'],
    objects: ['⌚', '📱', '💻', '⌨', '🖥', '🖨', '🖱', '🕹', '💾', '💿'],
    symbols: ['❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️'],
    flags: ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏴‍☠️', '🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪'],
  }

  const categories: CategoryDefinition[] = [
    {
      id: 'recent',
      name: 'Recently Used',
      icon: '🕐',
      description: 'Your recently used emojis',
      emojiCount: recentEmojis.length,
    },
    {
      id: 'smileys',
      name: 'Smileys & Emotion',
      icon: '😀',
      description: 'Faces, expressions, and emotions',
      emojiCount: 170,
    },
    {
      id: 'people',
      name: 'People & Body',
      icon: '👋',
      description: 'Hands, people, and body parts',
      emojiCount: 380,
    },
    {
      id: 'nature',
      name: 'Animals & Nature',
      icon: '🐶',
      description: 'Animals, plants, and nature',
      emojiCount: 145,
    },
    {
      id: 'food',
      name: 'Food & Drink',
      icon: '🍎',
      description: 'Food, drinks, and meals',
      emojiCount: 135,
    },
    {
      id: 'activity',
      name: 'Activities',
      icon: '⚽',
      description: 'Sports, games, and hobbies',
      emojiCount: 90,
    },
    {
      id: 'travel',
      name: 'Travel & Places',
      icon: '🚗',
      description: 'Transportation and locations',
      emojiCount: 220,
    },
    {
      id: 'objects',
      name: 'Objects',
      icon: '💻',
      description: 'Tools, technology, and items',
      emojiCount: 260,
    },
    {
      id: 'symbols',
      name: 'Symbols',
      icon: '❤️',
      description: 'Hearts, signs, and symbols',
      emojiCount: 220,
    },
    {
      id: 'flags',
      name: 'Flags',
      icon: '🏁',
      description: 'Country and regional flags',
      emojiCount: 270,
    },
  ]

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji)
    // Add to recent emojis
    setRecentEmojis((prev) => {
      const filtered = prev.filter((e) => e !== emoji)
      return [emoji, ...filtered].slice(0, 10)
    })
  }

  const displayEmojis =
    activeCategory === 'recent' ? recentEmojis : emojis[activeCategory] || []

  const filteredEmojis = searchQuery
    ? displayEmojis.filter((emoji) =>
        emoji.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayEmojis

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showSkinTones}
            onChange={(e) => setShowSkinTones(e.target.checked)}
            className="rounded"
          />
          Show Skin Tones
        </label>
        <button
          onClick={() => {
            setSelectedEmoji('')
            setSearchQuery('')
            setActiveCategory('smileys')
            setSkinTone(0)
          }}
          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50"
        >
          Reset
        </button>
        {selectedEmoji && (
          <div className="ml-auto text-sm">
            Selected: <span className="text-2xl ml-2">{selectedEmoji}</span>
          </div>
        )}
      </div>

      {/* Emoji Picker Demo */}
      <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Search Bar */}
        <div className="p-3 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emojis..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border/50 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 p-2 overflow-x-auto scrollbar-hide border-b border-border/50 bg-muted/20">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'flex-shrink-0 px-3 py-2 rounded-md text-xl transition-colors',
                activeCategory === category.id
                  ? 'bg-brand-500/10 ring-1 ring-brand-500/30'
                  : 'hover:bg-muted/50'
              )}
              title={category.name}
              aria-label={category.name}
            >
              {category.icon}
            </button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="h-[280px] overflow-y-auto p-3 bg-background/50">
          {filteredEmojis.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Search className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">
                {searchQuery ? 'No emojis found' : 'No emojis in this category'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-8 gap-1">
              {filteredEmojis.map((emoji, index) => (
                <motion.button
                  key={`${emoji}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: durations.fast, delay: index * 0.01 }}
                  onClick={() => handleEmojiSelect(emoji)}
                  className={cn(
                    'aspect-square flex items-center justify-center text-2xl rounded-md',
                    'hover:bg-brand-500/10 transition-colors',
                    selectedEmoji === emoji && 'bg-brand-500/20 ring-1 ring-brand-500/50'
                  )}
                  aria-label={`Select ${emoji}`}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Skin Tone Selector */}
        {showSkinTones && (
          <div className="p-3 border-t border-border/50 bg-muted/20">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Skin Tone:</span>
              <div className="flex gap-1">
                {[
                  { tone: 0, color: '🟡', label: 'Default' },
                  { tone: 1, color: '🏻', label: 'Light' },
                  { tone: 2, color: '🏼', label: 'Medium-Light' },
                  { tone: 3, color: '🏽', label: 'Medium' },
                  { tone: 4, color: '🏾', label: 'Medium-Dark' },
                  { tone: 5, color: '🏿', label: 'Dark' },
                ].map(({ tone, color, label }) => (
                  <button
                    key={tone}
                    onClick={() => setSkinTone(tone)}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm',
                      'hover:ring-2 hover:ring-brand-500/30 transition-all',
                      skinTone === tone && 'ring-2 ring-brand-500 scale-110'
                    )}
                    title={label}
                    aria-label={label}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'basic-usage', title: 'Basic Usage' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'selection-props', title: 'Selection' },
      { id: 'category-props', title: 'Categories' },
      { id: 'search-props', title: 'Search' },
      { id: 'skin-tone-props', title: 'Skin Tones' },
      { id: 'style-props', title: 'Styling' },
    ],
  },
  { id: 'categories', title: 'Emoji Categories' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-skin-tones', title: 'With Skin Tones' },
      { id: 'example-custom-categories', title: 'Custom Categories' },
      { id: 'example-inline', title: 'Inline Picker' },
    ],
  },
  { id: 'performance', title: 'Performance' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'onEmojiSelect',
    type: '(emoji: Emoji) => void',
    required: true,
    description: 'Callback fired when an emoji is selected.',
  },
  {
    name: 'open',
    type: 'boolean',
    default: 'false',
    description: 'Control picker visibility (for controlled components).',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Callback when picker visibility changes.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Initial open state for uncontrolled picker.',
  },
  {
    name: 'theme',
    type: "'light' | 'dark' | 'auto'",
    default: "'auto'",
    description: 'Color theme for the picker.',
  },
]

const selectionProps: PropDefinition[] = [
  {
    name: 'value',
    type: 'string',
    description: 'Currently selected emoji (controlled).',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Default selected emoji (uncontrolled).',
  },
  {
    name: 'multiple',
    type: 'boolean',
    default: 'false',
    description: 'Allow selecting multiple emojis.',
  },
  {
    name: 'maxSelections',
    type: 'number',
    description: 'Maximum number of emojis that can be selected (when multiple=true).',
  },
]

const categoryProps: PropDefinition[] = [
  {
    name: 'categories',
    type: 'EmojiCategory[]',
    description: 'Custom category configuration. Defaults to all 10 standard categories.',
  },
  {
    name: 'defaultCategory',
    type: 'string',
    default: "'smileys'",
    description: 'Default active category on open.',
  },
  {
    name: 'showCategoryTabs',
    type: 'boolean',
    default: 'true',
    description: 'Show category navigation tabs.',
  },
  {
    name: 'categoryTabPosition',
    type: "'top' | 'bottom'",
    default: "'top'",
    description: 'Position of category tabs.',
  },
]

const searchProps: PropDefinition[] = [
  {
    name: 'searchEnabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable fuzzy search functionality.',
  },
  {
    name: 'searchPlaceholder',
    type: 'string',
    default: "'Search emojis...'",
    description: 'Placeholder text for search input.',
  },
  {
    name: 'searchAutoFocus',
    type: 'boolean',
    default: 'false',
    description: 'Auto-focus search input when picker opens.',
  },
  {
    name: 'onSearchChange',
    type: '(query: string) => void',
    description: 'Callback when search query changes.',
  },
]

const skinToneProps: PropDefinition[] = [
  {
    name: 'skinTonesEnabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable skin tone selector.',
  },
  {
    name: 'defaultSkinTone',
    type: '0 | 1 | 2 | 3 | 4 | 5',
    default: '0',
    description: 'Default skin tone (0=default, 1-5=light to dark).',
  },
  {
    name: 'skinTone',
    type: '0 | 1 | 2 | 3 | 4 | 5',
    description: 'Controlled skin tone selection.',
  },
  {
    name: 'onSkinToneChange',
    type: '(tone: number) => void',
    description: 'Callback when skin tone changes.',
  },
  {
    name: 'persistSkinTone',
    type: 'boolean',
    default: 'true',
    description: 'Remember skin tone selection in localStorage.',
  },
]

const styleProps: PropDefinition[] = [
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the picker container.',
  },
  {
    name: 'width',
    type: 'number | string',
    default: '350',
    description: 'Picker width in pixels or CSS value.',
  },
  {
    name: 'height',
    type: 'number | string',
    default: '400',
    description: 'Picker height in pixels or CSS value.',
  },
  {
    name: 'emojiSize',
    type: 'number',
    default: '32',
    description: 'Size of emoji buttons in pixels.',
  },
  {
    name: 'emojiButtonRadius',
    type: 'number',
    default: '6',
    description: 'Border radius of emoji buttons in pixels.',
  },
]

// ============================================================================
// Category Data
// ============================================================================

const categoryData: CategoryDefinition[] = [
  {
    id: 'recent',
    name: 'Recently Used',
    icon: '🕐',
    description: 'User\'s most recently selected emojis (stored in localStorage)',
    emojiCount: 10,
  },
  {
    id: 'smileys',
    name: 'Smileys & Emotion',
    icon: '😀',
    description: 'Smiley faces, emotions, and facial expressions',
    emojiCount: 170,
  },
  {
    id: 'people',
    name: 'People & Body',
    icon: '👋',
    description: 'Hands, people, body parts, and gestures',
    emojiCount: 380,
  },
  {
    id: 'nature',
    name: 'Animals & Nature',
    icon: '🐶',
    description: 'Animals, plants, weather, and natural elements',
    emojiCount: 145,
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍎',
    description: 'Food items, fruits, vegetables, and beverages',
    emojiCount: 135,
  },
  {
    id: 'activity',
    name: 'Activities',
    icon: '⚽',
    description: 'Sports, games, hobbies, and recreational activities',
    emojiCount: 90,
  },
  {
    id: 'travel',
    name: 'Travel & Places',
    icon: '🚗',
    description: 'Transportation, buildings, maps, and locations',
    emojiCount: 220,
  },
  {
    id: 'objects',
    name: 'Objects',
    icon: '💻',
    description: 'Tools, technology, household items, and miscellaneous objects',
    emojiCount: 260,
  },
  {
    id: 'symbols',
    name: 'Symbols',
    icon: '❤️',
    description: 'Hearts, arrows, signs, zodiac, and symbolic characters',
    emojiCount: 220,
  },
  {
    id: 'flags',
    name: 'Flags',
    icon: '🏁',
    description: 'Country flags, regional flags, and flag symbols',
    emojiCount: 270,
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { EmojiPicker } from '@clarity-chat/react'
import type { EmojiPickerProps, Emoji } from '@clarity-chat/react'`

const basicUsageCode = `import { EmojiPicker } from '@clarity-chat/react'
import { useState } from 'react'

function MyEmojiPicker() {
  const [selectedEmoji, setSelectedEmoji] = useState<string>('')

  const handleEmojiSelect = (emoji: Emoji) => {
    console.log('Selected:', emoji)
    setSelectedEmoji(emoji.native) // The actual emoji character
    // emoji.id - Unique identifier
    // emoji.name - Emoji name
    // emoji.keywords - Search keywords
  }

  return (
    <div>
      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
      {selectedEmoji && <p>You selected: {selectedEmoji}</p>}
    </div>
  )
}`

const skinTonesCode = `import { EmojiPicker } from '@clarity-chat/react'
import { useState } from 'react'

function SkinTonePicker() {
  const [skinTone, setSkinTone] = useState<number>(0)

  return (
    <EmojiPicker
      onEmojiSelect={(emoji) => console.log(emoji)}
      skinTonesEnabled={true}
      skinTone={skinTone}
      onSkinToneChange={setSkinTone}
      persistSkinTone={true} // Remember in localStorage
    />
  )
}`

const customCategoriesCode = `import { EmojiPicker } from '@clarity-chat/react'

function CustomCategoryPicker() {
  // Define custom categories
  const customCategories = [
    { id: 'recent', name: 'Recent', icon: '🕐' },
    { id: 'smileys', name: 'Smileys', icon: '😀' },
    { id: 'people', name: 'People', icon: '👋' },
    { id: 'food', name: 'Food', icon: '🍎' },
    // Only show these 4 categories
  ]

  return (
    <EmojiPicker
      onEmojiSelect={(emoji) => console.log(emoji)}
      categories={customCategories}
      defaultCategory="smileys"
      showCategoryTabs={true}
    />
  )
}`

const inlinePickerCode = `import { EmojiPicker } from '@clarity-chat/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Smile } from 'lucide-react'
import { useState } from 'react'

function InlineEmojiPicker() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const handleEmojiSelect = (emoji: Emoji) => {
    setMessage((prev) => prev + emoji.native)
    setOpen(false) // Close picker after selection
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 rounded-lg border"
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="p-2 rounded-lg hover:bg-muted"
            aria-label="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto" align="end">
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            searchAutoFocus
            width={320}
            height={380}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}`

const typescriptCode = `// Emoji object type
interface Emoji {
  id: string                 // Unique identifier
  name: string              // Emoji name (e.g., "grinning face")
  native: string            // The actual emoji character (e.g., "😀")
  unified: string           // Unicode codepoint
  keywords: string[]        // Search keywords
  shortcodes: string[]      // Alternative names
  emoticons?: string[]      // Text emoticons (e.g., ":D")
  skin?: number             // Skin tone variant (1-5)
}

// Category configuration
interface EmojiCategory {
  id: string                // Category identifier
  name: string              // Display name
  icon: string              // Category icon emoji
  emojis?: string[]         // Custom emoji list (optional)
}

// Main props
interface EmojiPickerProps {
  // Selection
  onEmojiSelect: (emoji: Emoji) => void
  value?: string
  defaultValue?: string
  multiple?: boolean
  maxSelections?: number

  // Visibility
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean

  // Categories
  categories?: EmojiCategory[]
  defaultCategory?: string
  showCategoryTabs?: boolean
  categoryTabPosition?: 'top' | 'bottom'

  // Search
  searchEnabled?: boolean
  searchPlaceholder?: string
  searchAutoFocus?: boolean
  onSearchChange?: (query: string) => void

  // Skin tones
  skinTonesEnabled?: boolean
  skinTone?: 0 | 1 | 2 | 3 | 4 | 5
  defaultSkinTone?: 0 | 1 | 2 | 3 | 4 | 5
  onSkinToneChange?: (tone: number) => void
  persistSkinTone?: boolean

  // Styling
  className?: string
  width?: number | string
  height?: number | string
  emojiSize?: number
  emojiButtonRadius?: number
  theme?: 'light' | 'dark' | 'auto'
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function EmojiPickerPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Smile className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                EmojiPicker
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Rich emoji picker with search, categories, skin tones, and
                recently used emojis for expressive messaging. Complete Unicode
                15.0 support with 3,000+ emojis and fast fuzzy search.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: Grid3x3,
                  label: '3,000+ Emojis',
                  desc: 'Unicode 15.0',
                },
                {
                  icon: Search,
                  label: 'Search',
                  desc: 'Fast fuzzy search',
                },
                {
                  icon: Palette,
                  label: 'Skin Tones',
                  desc: 'Configurable',
                },
                {
                  icon: Clock,
                  label: 'Recently Used',
                  desc: 'Personalized',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>EmojiPicker</code> is a comprehensive emoji selection
                  component with support for search, categories, skin tone
                  variants, and recently used emojis. Built for modern chat
                  interfaces with performance optimizations for smooth scrolling
                  through large emoji sets.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>3,000+ Emojis:</strong> Complete Unicode 15.0
                    coverage with all standard categories
                  </li>
                  <li>
                    <strong>Fast Search:</strong> Fuzzy search by name and
                    keywords with instant results
                  </li>
                  <li>
                    <strong>Skin Tone Support:</strong> 6 skin tone variants
                    with persistence
                  </li>
                  <li>
                    <strong>Recently Used:</strong> Automatic tracking of
                    frequently selected emojis
                  </li>
                  <li>
                    <strong>10 Categories:</strong> Organized by type with
                    visual indicators
                  </li>
                  <li>
                    <strong>Virtual Scrolling:</strong> Efficient rendering for
                    smooth performance
                  </li>
                  <li>
                    <strong>Keyboard Navigation:</strong> Full arrow key and
                    search support
                  </li>
                  <li>
                    <strong>Theme Support:</strong> Light, dark, and auto modes
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <ul className="space-y-2">
                  <li>Chat applications and messaging interfaces</li>
                  <li>Social media comment systems</li>
                  <li>Rich text editors with emoji support</li>
                  <li>Reaction systems and emoji responses</li>
                  <li>Any interface requiring emoji input</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Best Practices
                </h4>
                <ul className="space-y-2">
                  <li>Enable search for better discoverability</li>
                  <li>Show recently used category for quick access</li>
                  <li>Enable skin tone persistence for personalization</li>
                  <li>Use proper ARIA labels for accessibility</li>
                  <li>Consider mobile viewport size when positioning</li>
                </ul>
              </div>
            </Section>

            {/* Installation Section */}
            <Section id="installation" title="Installation">
              <div className="space-y-4">
                <CodeBlock
                  code="npm install @clarity-chat/react"
                  language="bash"
                  filename="Terminal"
                  showDownloadButton={false}
                />

                <p className="text-muted-foreground">Import the component:</p>

                <CodeBlock
                  code={importCode}
                  language="tsx"
                  filename="App.tsx"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* Live Demo Section */}
            <Section id="demo" title="Live Demo">
              <p className="text-muted-foreground mb-6">
                Interact with the EmojiPicker component. Try searching, switching
                categories, and selecting different skin tones.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The simplest implementation requires only the{' '}
                  <code>onEmojiSelect</code> callback:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="EmojiPicker.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="selection-props" title="Selection Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Control emoji selection behavior:
                </p>
                <PropsTable props={selectionProps} />
              </SubSection>

              <SubSection id="category-props" title="Category Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Customize category display and navigation:
                </p>
                <PropsTable props={categoryProps} />
              </SubSection>

              <SubSection id="search-props" title="Search Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure search functionality:
                </p>
                <PropsTable props={searchProps} />
              </SubSection>

              <SubSection id="skin-tone-props" title="Skin Tone Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Control skin tone selection:
                </p>
                <PropsTable props={skinToneProps} />
              </SubSection>

              <SubSection id="style-props" title="Styling Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Customize appearance:
                </p>
                <PropsTable props={styleProps} />
              </SubSection>
            </Section>

            {/* Categories Section */}
            <Section id="categories" title="Emoji Categories">
              <p className="text-muted-foreground mb-4">
                The EmojiPicker includes 10 standard emoji categories based on
                Unicode 15.0 specifications. Each category contains hundreds of
                emojis organized by theme:
              </p>

              <CategoryTable categories={categoryData} />

              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> The "Recently Used" category is
                  populated dynamically based on user interactions and stored in
                  localStorage for persistence across sessions.
                </p>
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple emoji picker with default settings:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicPicker.tsx"
                />
              </SubSection>

              <SubSection id="example-skin-tones" title="With Skin Tones">
                <p className="text-muted-foreground mb-4">
                  Enable and persist skin tone selection:
                </p>
                <CodeBlock
                  code={skinTonesCode}
                  language="tsx"
                  filename="SkinTonePicker.tsx"
                />
              </SubSection>

              <SubSection
                id="example-custom-categories"
                title="Custom Categories"
              >
                <p className="text-muted-foreground mb-4">
                  Show only specific emoji categories:
                </p>
                <CodeBlock
                  code={customCategoriesCode}
                  language="tsx"
                  filename="CustomCategories.tsx"
                />
              </SubSection>

              <SubSection id="example-inline" title="Inline Picker">
                <p className="text-muted-foreground mb-4">
                  Integrate with an input field using a popover:
                </p>
                <CodeBlock
                  code={inlinePickerCode}
                  language="tsx"
                  filename="InlinePicker.tsx"
                />
              </SubSection>
            </Section>

            {/* Performance Section */}
            <Section id="performance" title="Performance">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Virtual Scrolling
                </h4>
                <p>
                  The EmojiPicker uses virtual scrolling to efficiently render
                  large emoji sets. Only visible emojis are rendered in the DOM,
                  with a small buffer for smooth scrolling:
                </p>
                <ul className="space-y-2">
                  <li>Renders ~100 emojis at a time instead of 3,000+</li>
                  <li>Smooth 60fps scrolling even on mobile devices</li>
                  <li>Minimal memory footprint</li>
                  <li>Fast category switching</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Search Performance
                </h4>
                <p>
                  Search is optimized for instant results:
                </p>
                <ul className="space-y-2">
                  <li>Fuzzy matching with keyword indexing</li>
                  <li>Debounced input for reduced re-renders</li>
                  <li>Results limited to 100 for fast display</li>
                  <li>Highlights matching keywords</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Bundle Size
                </h4>
                <p>
                  The component is optimized for minimal bundle impact:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>Core:</strong> 18 KB gzipped (component + logic)
                  </li>
                  <li>
                    <strong>Data:</strong> 45 KB gzipped (emoji data)
                  </li>
                  <li>
                    <strong>Total:</strong> 63 KB gzipped
                  </li>
                  <li>Emoji data can be code-split for lazy loading</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Performance Tips
                </h4>
                <ul className="space-y-2">
                  <li>Use lazy loading for emoji data if needed</li>
                  <li>Limit custom categories to reduce search space</li>
                  <li>Enable persistSkinTone to avoid re-renders</li>
                  <li>Memoize onEmojiSelect callback to prevent re-renders</li>
                </ul>
              </div>
            </Section>

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Tab
                    </kbd>{' '}
                    - Navigate between search, categories, and emoji grid
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Arrow Keys
                    </kbd>{' '}
                    - Navigate emoji grid
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Enter
                    </kbd>{' '}
                    - Select focused emoji
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Escape
                    </kbd>{' '}
                    - Close picker (when in popover)
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Home/End
                    </kbd>{' '}
                    - Jump to first/last emoji
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>All emojis have descriptive ARIA labels</li>
                  <li>
                    Category buttons announce "Category: [name]"
                  </li>
                  <li>
                    Search input has <code>aria-label</code> and{' '}
                    <code>role="searchbox"</code>
                  </li>
                  <li>
                    Emoji grid uses <code>role="grid"</code> with proper navigation
                  </li>
                  <li>
                    Selected emoji announced with <code>aria-live</code>
                  </li>
                  <li>
                    Skin tone selector has descriptive labels
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  WCAG 2.1 AA Compliance
                </h4>
                <ul className="space-y-2">
                  <li>All interactive elements have 44x44px touch targets</li>
                  <li>Focus indicators visible on all focusable elements</li>
                  <li>Color contrast meets AA standards (4.5:1 minimum)</li>
                  <li>No keyboard traps</li>
                  <li>Respects prefers-reduced-motion</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Reduced Motion
                </h4>
                <p>
                  When <code>prefers-reduced-motion</code> is enabled:
                </p>
                <ul className="space-y-2">
                  <li>No transition animations on emoji hover</li>
                  <li>Instant category switching (no slide effect)</li>
                  <li>Simple fade for search results</li>
                  <li>Disabled parallax scrolling effects</li>
                </ul>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Emojis not displaying correctly
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure the user's system supports emoji rendering
                        </li>
                        <li>
                          Check font-family includes emoji fallbacks (Segoe UI
                          Emoji, Apple Color Emoji)
                        </li>
                        <li>
                          Verify browser supports Unicode 15.0 (Chrome 109+,
                          Safari 16.4+)
                        </li>
                        <li>
                          Consider using emoji images for consistent rendering
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Slow scrolling performance
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Enable virtual scrolling (enabled by default)</li>
                        <li>Reduce emojiSize if using large emoji buttons</li>
                        <li>Limit custom categories to reduce search space</li>
                        <li>Check for expensive re-renders in parent components</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Skin tones not persisting
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>persistSkinTone</code> is set to true
                        </li>
                        <li>Check that localStorage is available and enabled</li>
                        <li>
                          Verify no browser extensions are blocking localStorage
                        </li>
                        <li>Check browser privacy settings</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Search not finding emojis
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>searchEnabled</code> is true (default)
                        </li>
                        <li>
                          Try searching by emoji name rather than description
                        </li>
                        <li>Check for typos in search query</li>
                        <li>
                          Some emojis may have limited keyword coverage
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'ChatInput',
                    type: 'component',
                    description:
                      'Text input component that can integrate emoji picker',
                    href: '/reference/components/chat-input',
                  },
                  {
                    name: 'AdvancedChatInput',
                    type: 'component',
                    description:
                      'Advanced input with built-in emoji picker support',
                    href: '/reference/components/advanced-chat-input',
                  },
                  {
                    name: 'useEmoji',
                    type: 'hook',
                    description:
                      'Hook for programmatic emoji search and selection',
                    href: '/reference/hooks/use-emoji',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/components/advanced-chat-input"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      AdvancedChatInput
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/voice-input"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      VoiceInput
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
