'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Grid,
  List,
  Sparkles,
  MessageSquare,
  Wrench,
  Layout,
  Palette,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

type ComponentCategory =
  | 'all'
  | 'chat'
  | 'ai'
  | 'input'
  | 'display'
  | 'layout'
  | 'utility'

interface ComponentItem {
  /** Component name */
  name: string
  /** Short description */
  description: string
  /** Category for filtering */
  category: Exclude<ComponentCategory, 'all'>
  /** Documentation URL */
  href: string
  /** Preview image or component */
  preview?: React.ReactNode
  /** Whether it's new */
  isNew?: boolean
  /** Whether it's updated */
  isUpdated?: boolean
  /** Tags for search */
  tags?: string[]
}

interface ComponentGalleryProps {
  /** List of components to display */
  components: ComponentItem[]
  /** Custom className */
  className?: string
  /** Show search */
  showSearch?: boolean
  /** Show category filter */
  showFilter?: boolean
  /** Default view mode */
  defaultView?: 'grid' | 'list'
}

// ============================================================================
// Category Metadata
// ============================================================================

const categoryMeta: Record<
  ComponentCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  all: {
    label: 'All',
    icon: <Grid className="w-4 h-4" />,
    color: 'bg-gray-500',
  },
  chat: {
    label: 'Chat',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'bg-blue-500',
  },
  ai: {
    label: 'AI',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-purple-500',
  },
  input: {
    label: 'Input',
    icon: <Wrench className="w-4 h-4" />,
    color: 'bg-green-500',
  },
  display: {
    label: 'Display',
    icon: <Layout className="w-4 h-4" />,
    color: 'bg-orange-500',
  },
  layout: {
    label: 'Layout',
    icon: <Layout className="w-4 h-4" />,
    color: 'bg-cyan-500',
  },
  utility: {
    label: 'Utility',
    icon: <Palette className="w-4 h-4" />,
    color: 'bg-pink-500',
  },
}

// ============================================================================
// Component Card
// ============================================================================

interface ComponentCardProps {
  component: ComponentItem
  view: 'grid' | 'list'
}

function ComponentCard({ component, view }: ComponentCardProps) {
  const category = categoryMeta[component.category]

  if (view === 'list') {
    return (
      <Link
        href={component.href}
        className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all group"
      >
        {/* Preview */}
        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
          {component.preview || (
            <div
              className={cn(
                'w-10 h-10 rounded-lg',
                category.color,
                'flex items-center justify-center text-white'
              )}
            >
              {category.icon}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {component.name}
            </h3>
            {component.isNew && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                New
              </span>
            )}
            {component.isUpdated && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                Updated
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {component.description}
          </p>
        </div>

        {/* Category Badge */}
        <div
          className={cn(
            'flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium text-white',
            category.color
          )}
        >
          {category.label}
        </div>
      </Link>
    )
  }

  // Grid view
  return (
    <Link
      href={component.href}
      className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all group overflow-hidden"
    >
      {/* Preview Area */}
      <div className="relative h-40 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
        {component.preview || (
          <div
            className={cn(
              'w-16 h-16 rounded-xl',
              category.color,
              'flex items-center justify-center text-white'
            )}
          >
            {category.icon}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {component.isNew && (
            <span className="px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded-full">
              New
            </span>
          )}
          {component.isUpdated && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
              Updated
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {component.name}
          </h3>
          <div
            className={cn('w-2 h-2 rounded-full', category.color)}
            title={category.label}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {component.description}
        </p>
      </div>
    </Link>
  )
}

// ============================================================================
// Component Gallery
// ============================================================================

export function ComponentGallery({
  components,
  className,
  showSearch = true,
  showFilter = true,
  defaultView = 'grid',
}: ComponentGalleryProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ComponentCategory>('all')
  const [view, setView] = useState<'grid' | 'list'>(defaultView)

  // Filter components
  const filteredComponents = useMemo(() => {
    return components.filter((component) => {
      // Category filter
      if (category !== 'all' && component.category !== category) {
        return false
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesName = component.name.toLowerCase().includes(searchLower)
        const matchesDescription = component.description
          .toLowerCase()
          .includes(searchLower)
        const matchesTags = component.tags?.some((tag) =>
          tag.toLowerCase().includes(searchLower)
        )

        if (!matchesName && !matchesDescription && !matchesTags) {
          return false
        }
      }

      return true
    })
  }, [components, category, search])

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ComponentCategory, number> = {
      all: components.length,
      chat: 0,
      ai: 0,
      input: 0,
      display: 0,
      layout: 0,
      utility: 0,
    }

    components.forEach((component) => {
      counts[component.category]++
    })

    return counts
  }, [components])

  const categories: ComponentCategory[] = [
    'all',
    'chat',
    'ai',
    'input',
    'display',
    'layout',
    'utility',
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        )}

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-2 rounded-md transition-colors',
              view === 'grid'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-2 rounded-md transition-colors',
              view === 'list'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      {showFilter && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const meta = categoryMeta[cat]
            const count = categoryCounts[cat]
            const isActive = category === cat

            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {meta.icon}
                {meta.label}
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-xs rounded-full',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredComponents.length} of {components.length} components
      </div>

      {/* Component Grid/List */}
      {filteredComponents.length > 0 ? (
        <div
          className={cn(
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          )}
        >
          {filteredComponents.map((component) => (
            <ComponentCard
              key={component.name}
              component={component}
              view={view}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            No components found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Export sample data helper
// ============================================================================

export const sampleComponents: ComponentItem[] = [
  {
    name: 'ClarityChat',
    description:
      'Main chat interface component with streaming, memory, and tool support.',
    category: 'chat',
    href: '/reference/components/clarity-chat',
    tags: ['chat', 'streaming', 'main'],
  },
  {
    name: 'ChainOfThought',
    description:
      'AI reasoning visualization with auto-collapse and duration tracking.',
    category: 'ai',
    href: '/reference/components/chain-of-thought',
    isNew: true,
    tags: ['ai', 'reasoning', 'thinking'],
  },
  {
    name: 'MessageBranch',
    description: 'Navigate between AI response versions and regenerations.',
    category: 'ai',
    href: '/reference/components/message-branch',
    isNew: true,
    tags: ['ai', 'versioning', 'regenerate'],
  },
  {
    name: 'ToolApproval',
    description: 'Human-in-the-loop tool execution approval with risk levels.',
    category: 'ai',
    href: '/reference/components/tool-approval',
    isNew: true,
    tags: ['ai', 'tools', 'approval', 'human-in-the-loop'],
  },
  {
    name: 'GenerativeUI',
    description:
      'Dynamic UI rendering for AI tool results with status handling.',
    category: 'ai',
    href: '/reference/components/generative-ui',
    isNew: true,
    tags: ['ai', 'tools', 'ui', 'dynamic'],
  },
  {
    name: 'ModelSelector',
    description: 'Dropdown for selecting AI models with provider grouping.',
    category: 'input',
    href: '/reference/components/model-selector',
    isNew: true,
    tags: ['input', 'model', 'selector', 'dropdown'],
  },
  {
    name: 'PromptSuggestions',
    description: 'Display suggested prompts in grid, list, or chips layout.',
    category: 'display',
    href: '/reference/components/prompt-suggestions',
    isNew: true,
    tags: ['display', 'prompts', 'suggestions'],
  },
  {
    name: 'ChatInput',
    description: 'Rich input with voice, file upload, and mention support.',
    category: 'input',
    href: '/reference/components/chat-input',
    tags: ['input', 'voice', 'file', 'mentions'],
  },
  {
    name: 'MessageList',
    description: 'Virtualized message list with auto-scroll and grouping.',
    category: 'chat',
    href: '/reference/components/message-list',
    tags: ['chat', 'messages', 'virtualized'],
  },
  {
    name: 'StreamingMessage',
    description: 'Real-time streaming text display with cursor animation.',
    category: 'chat',
    href: '/reference/components/streaming-message',
    tags: ['chat', 'streaming', 'animation'],
  },
  {
    name: 'TypingIndicator',
    description: 'Animated typing indicator with customizable styles.',
    category: 'display',
    href: '/reference/components/typing-indicator',
    tags: ['display', 'typing', 'animation'],
  },
  {
    name: 'CodeBlock',
    description: 'Syntax highlighted code with copy and line numbers.',
    category: 'display',
    href: '/reference/components/code-block',
    tags: ['display', 'code', 'syntax'],
  },
]
