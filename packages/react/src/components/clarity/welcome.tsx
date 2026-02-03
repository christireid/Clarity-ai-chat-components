// @ts-nocheck
// TODO: Fix lucide-react icon imports
'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Sparkles,
  Zap,
  Brain,
  MessageSquare,
  Code,
  ImageIcon,
  FileText,
  Globe,
} from 'lucide-react'

// ============================================================================
// WELCOME COMPONENT - Superior to Ant Design X Welcome
// ============================================================================

interface WelcomeProps {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  variant?: 'default' | 'centered' | 'minimal' | 'branded' | 'gradient'
  extra?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function Welcome({
  title = 'Welcome',
  description,
  icon,
  variant = 'default',
  extra,
  className,
  children,
}: WelcomeProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        variant === 'centered' && 'items-center text-center',
        variant === 'minimal' && 'gap-2',
        variant === 'branded' && 'gap-4',
        variant === 'gradient' &&
          'items-center text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5',
        variant === 'default' && 'gap-4',
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center',
            variant === 'gradient' && 'w-16 h-16 rounded-2xl bg-primary/10 mb-2'
          )}
        >
          {icon}
        </div>
      )}

      <div className={cn('space-y-2', variant === 'minimal' && 'space-y-1')}>
        <h2
          className={cn(
            'font-semibold tracking-tight text-foreground',
            variant === 'minimal' && 'text-lg',
            variant === 'centered' && 'text-2xl',
            variant === 'branded' && 'text-3xl',
            variant === 'gradient' &&
              'text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text',
            variant === 'default' && 'text-xl'
          )}
        >
          {title}
        </h2>

        {description && (
          <p
            className={cn(
              'text-muted-foreground',
              variant === 'minimal' && 'text-sm',
              variant === 'centered' && 'text-base max-w-md',
              variant === 'branded' && 'text-lg max-w-lg',
              variant === 'gradient' && 'text-base max-w-md',
              variant === 'default' && 'text-sm'
            )}
          >
            {description}
          </p>
        )}
      </div>

      {extra && <div className="mt-2">{extra}</div>}

      {children && <div className="mt-4 w-full">{children}</div>}
    </div>
  )
}

// ============================================================================
// PROMPTS COMPONENT - Prompt suggestions grid
// ============================================================================

interface PromptItem {
  key: string
  icon?: React.ReactNode
  label: string
  description?: string
  disabled?: boolean
}

interface PromptsProps {
  items: PromptItem[]
  title?: string
  wrap?: boolean
  vertical?: boolean
  onItemClick?: (item: PromptItem) => void
  variant?: 'default' | 'bordered' | 'filled' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function Prompts({
  items,
  title,
  wrap = false,
  vertical = false,
  onItemClick,
  variant = 'default',
  size = 'md',
  columns = 2,
  className,
}: PromptsProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('space-y-3', className)}>
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      )}

      <div
        className={cn(
          wrap
            ? 'flex flex-wrap gap-2'
            : vertical
              ? 'flex flex-col gap-2'
              : `grid gap-3 ${gridCols[columns]}`
        )}
      >
        {items.map((item) => (
          <PromptCard
            key={item.key}
            item={item}
            variant={variant}
            size={size}
            wrap={wrap}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    </div>
  )
}

interface PromptCardProps {
  item: PromptItem
  variant: 'default' | 'bordered' | 'filled' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  wrap: boolean
  onClick: () => void
}

function PromptCard({ item, variant, size, wrap, onClick }: PromptCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={item.disabled}
      className={cn(
        'group flex items-start gap-3 text-left transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',

        // Variants
        variant === 'default' &&
          'p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50',
        variant === 'bordered' &&
          'p-3 rounded-xl border-2 border-border hover:border-primary',
        variant === 'filled' && 'p-3 rounded-xl bg-muted hover:bg-muted/80',
        variant === 'ghost' && 'p-2 rounded-lg hover:bg-muted/50',

        // Sizes
        size === 'sm' && 'p-2 gap-2',
        size === 'lg' && 'p-4 gap-4',

        // Wrap mode
        wrap && 'flex-shrink-0',

        // Disabled
        item.disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {item.icon && (
        <div
          className={cn(
            'flex items-center justify-center shrink-0 rounded-lg transition-colors',
            variant === 'default' &&
              'w-10 h-10 bg-primary/10 text-primary group-hover:bg-primary/20',
            variant === 'bordered' && 'w-10 h-10 bg-muted text-foreground',
            variant === 'filled' && 'w-10 h-10 bg-background text-primary',
            variant === 'ghost' &&
              'w-8 h-8 text-muted-foreground group-hover:text-foreground',
            size === 'sm' && 'w-8 h-8',
            size === 'lg' && 'w-12 h-12'
          )}
        >
          {item.icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-medium text-foreground truncate',
            size === 'sm' && 'text-sm',
            size === 'lg' && 'text-base'
          )}
        >
          {item.label}
        </p>

        {item.description && (
          <p
            className={cn(
              'text-muted-foreground line-clamp-2 mt-0.5',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-sm'
            )}
          >
            {item.description}
          </p>
        )}
      </div>
    </button>
  )
}

// ============================================================================
// SUGGESTIONS COMPONENT - Inline suggestions for autocomplete
// ============================================================================

interface SuggestionItem {
  key: string
  label: string
  icon?: React.ReactNode
  description?: string
  category?: string
}

interface SuggestionsProps {
  items: SuggestionItem[]
  onSelect?: (item: SuggestionItem) => void
  variant?: 'default' | 'pills' | 'list' | 'compact'
  showCategories?: boolean
  maxVisible?: number
  className?: string
}

export function Suggestions({
  items,
  onSelect,
  variant = 'default',
  showCategories = false,
  maxVisible,
  className,
}: SuggestionsProps) {
  const visibleItems = maxVisible ? items.slice(0, maxVisible) : items
  const remainingCount = maxVisible ? Math.max(0, items.length - maxVisible) : 0

  // Group by category if needed
  const groupedItems = React.useMemo(() => {
    if (!showCategories) return { '': visibleItems }

    return visibleItems.reduce(
      (acc, item) => {
        const category = item.category || ''
        if (!acc[category]) acc[category] = []
        acc[category].push(item)
        return acc
      },
      {} as Record<string, SuggestionItem[]>
    )
  }, [visibleItems, showCategories])

  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {visibleItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect?.(item)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-border bg-background hover:bg-muted hover:border-primary/50 transition-colors"
          >
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
            {item.label}
          </button>
        ))}
        {remainingCount > 0 && (
          <span className="inline-flex items-center px-3 py-1.5 text-sm text-muted-foreground">
            +{remainingCount} more
          </span>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1 text-sm', className)}>
        <span className="text-muted-foreground">Try:</span>
        {visibleItems.map((item, index) => (
          <React.Fragment key={item.key}>
            <button
              onClick={() => onSelect?.(item)}
              className="text-primary hover:underline"
            >
              {item.label}
            </button>
            {index < visibleItems.length - 1 && (
              <span className="text-muted-foreground">,</span>
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-1', className)}>
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            {category && (
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {category}
              </p>
            )}
            {categoryItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onSelect?.(item)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors"
              >
                {item.icon && (
                  <span className="w-5 h-5 text-muted-foreground">
                    {item.icon}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.label}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    )
  }

  // Default variant - grid of cards
  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {visibleItems.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelect?.(item)}
          className="flex items-center gap-2 p-3 text-left rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
        >
          {item.icon && (
            <span className="w-5 h-5 text-primary">{item.icon}</span>
          )}
          <span className="text-sm font-medium truncate">{item.label}</span>
        </button>
      ))}
      {remainingCount > 0 && (
        <div className="flex items-center justify-center p-3 text-sm text-muted-foreground">
          +{remainingCount} more
        </div>
      )}
    </div>
  )
}

// ============================================================================
// QUICK PROMPTS - Pre-built prompt suggestions
// ============================================================================

interface QuickPromptsProps {
  onSelect?: (prompt: string) => void
  variant?: 'default' | 'minimal' | 'featured'
  prompts?: Array<{ icon?: React.ReactNode; label: string; prompt: string }>
  className?: string
}

const defaultQuickPrompts = [
  {
    icon: <MessageSquare className="w-4 h-4" />,
    label: 'Explain a concept',
    prompt: 'Explain ',
  },
  {
    icon: <Code className="w-4 h-4" />,
    label: 'Write code',
    prompt: 'Write code to ',
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: 'Summarize text',
    prompt: 'Summarize the following: ',
  },
  {
    icon: <Brain className="w-4 h-4" />,
    label: 'Brainstorm ideas',
    prompt: 'Help me brainstorm ideas for ',
  },
  {
    icon: <ImageIcon className="w-4 h-4" />,
    label: 'Describe an image',
    prompt: 'Describe what you see in this image: ',
  },
  {
    icon: <Globe className="w-4 h-4" />,
    label: 'Translate text',
    prompt: 'Translate to English: ',
  },
]

export function QuickPrompts({
  onSelect,
  variant = 'default',
  prompts = defaultQuickPrompts,
  className,
}: QuickPromptsProps) {
  if (variant === 'minimal') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {prompts.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect?.(item.prompt)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-full border border-border/50 hover:border-border bg-transparent hover:bg-muted/50 transition-all"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div className={cn('grid grid-cols-2 lg:grid-cols-3 gap-3', className)}>
        {prompts.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect?.(item.prompt)}
            className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 bg-gradient-to-b from-muted/50 to-transparent hover:from-primary/5 transition-all"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              {item.icon}
            </div>
            <span className="text-sm font-medium text-center">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {prompts.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect?.(item.prompt)}
          className="flex items-center gap-2 p-3 text-left rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
        >
          <span className="w-5 h-5 text-primary shrink-0">{item.icon}</span>
          <span className="text-sm font-medium truncate">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// WELCOME SCREEN - Complete onboarding component
// ============================================================================

interface WelcomeScreenProps {
  title?: string
  description?: string
  logo?: React.ReactNode
  prompts?: PromptItem[]
  onPromptSelect?: (item: PromptItem) => void
  features?: Array<{
    icon: React.ReactNode
    title: string
    description: string
  }>
  footer?: React.ReactNode
  className?: string
}

export function WelcomeScreen({
  title = 'How can I help you today?',
  description = 'I can help you with a wide range of tasks. Choose a suggestion below or type your own question.',
  logo,
  prompts,
  onPromptSelect,
  features,
  footer,
  className,
}: WelcomeScreenProps) {
  const defaultPrompts: PromptItem[] = [
    {
      key: '1',
      icon: <Sparkles className="w-5 h-5" />,
      label: 'Generate creative content',
      description: 'Write stories, poems, or marketing copy',
    },
    {
      key: '2',
      icon: <Code className="w-5 h-5" />,
      label: 'Help with code',
      description: 'Debug, explain, or write code',
    },
    {
      key: '3',
      icon: <Brain className="w-5 h-5" />,
      label: 'Analyze and explain',
      description: 'Break down complex topics',
    },
    {
      key: '4',
      icon: <Zap className="w-5 h-5" />,
      label: 'Quick tasks',
      description: 'Summarize, translate, or format',
    },
  ]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[400px] p-6',
        className
      )}
    >
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          {logo && <div className="flex justify-center mb-4">{logo}</div>}
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        </div>

        {/* Prompts */}
        <Prompts
          items={prompts || defaultPrompts}
          onItemClick={onPromptSelect}
          variant="default"
          columns={2}
        />

        {/* Features */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-muted text-muted-foreground">
                  {feature.icon}
                </div>
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="text-center text-sm text-muted-foreground pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  WelcomeProps,
  PromptsProps,
  PromptItem,
  SuggestionsProps,
  SuggestionItem,
  QuickPromptsProps,
  WelcomeScreenProps,
}
