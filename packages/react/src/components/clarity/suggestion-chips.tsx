'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { ScrollArea, ScrollBar } from '@clarity-chat/primitives'
import {
  Sparkles,
  ArrowRight,
  Lightbulb,
  HelpCircle,
  Zap,
  TrendingUp,
  Code,
  FileText,
  ImageIcon,
  Calculator,
  Globe,
  MessageSquare,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface Suggestion {
  id: string
  label: string
  prompt?: string
  icon?: React.ReactNode
  category?: string
  disabled?: boolean
}

export interface SuggestionChipsProps {
  suggestions: Suggestion[]
  onSelect: (suggestion: Suggestion) => void
  variant?: 'default' | 'outline' | 'ghost' | 'pill'
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical' | 'wrap' | 'grid'
  showIcon?: boolean
  showArrow?: boolean
  maxVisible?: number
  className?: string
}

export interface SuggestionGroupProps {
  title?: string
  icon?: React.ReactNode
  suggestions: Suggestion[]
  onSelect: (suggestion: Suggestion) => void
  collapsible?: boolean
  defaultCollapsed?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'pill'
  className?: string
}

export interface QuickActionsProps {
  actions: Suggestion[]
  onSelect: (suggestion: Suggestion) => void
  columns?: 1 | 2 | 3 | 4
  variant?: 'card' | 'button' | 'minimal'
  className?: string
}

// ============================================================================
// SUGGESTION CHIP
// ============================================================================

export interface SuggestionChipProps {
  suggestion: Suggestion
  onClick: () => void
  variant?: 'default' | 'outline' | 'ghost' | 'pill'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showArrow?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-7 px-2.5 text-xs gap-1',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-10 px-4 text-sm gap-2',
}

const iconSizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}

export function SuggestionChip({
  suggestion,
  onClick,
  variant = 'outline',
  size = 'md',
  showIcon = true,
  showArrow = false,
  className,
}: SuggestionChipProps) {
  const defaultIcon = <Sparkles className={iconSizeClasses[size]} />

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={suggestion.disabled}
        className={cn(
          'inline-flex items-center rounded-full border border-border bg-background',
          'hover:bg-accent hover:border-primary/50 transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          className
        )}
      >
        {showIcon && (
          <span className="text-muted-foreground">
            {suggestion.icon || defaultIcon}
          </span>
        )}
        <span>{suggestion.label}</span>
        {showArrow && (
          <ArrowRight
            className={cn(iconSizeClasses[size], 'text-muted-foreground')}
          />
        )}
      </button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size === 'lg' ? 'default' : 'sm'}
      onClick={onClick}
      disabled={suggestion.disabled}
      className={cn(
        'gap-1.5',
        variant === 'ghost' && 'hover:bg-accent',
        className
      )}
    >
      {showIcon && (
        <span className="text-muted-foreground">
          {suggestion.icon || defaultIcon}
        </span>
      )}
      {suggestion.label}
      {showArrow && (
        <ArrowRight
          className={cn(iconSizeClasses[size], 'text-muted-foreground ml-1')}
        />
      )}
    </Button>
  )
}

// ============================================================================
// SUGGESTION CHIPS - Collection
// ============================================================================

export function SuggestionChips({
  suggestions,
  onSelect,
  variant = 'outline',
  size = 'md',
  layout = 'horizontal',
  showIcon = true,
  showArrow = false,
  maxVisible,
  className,
}: SuggestionChipsProps) {
  const [showAll, setShowAll] = React.useState(false)
  const visibleSuggestions =
    maxVisible && !showAll ? suggestions.slice(0, maxVisible) : suggestions
  const hasMore = maxVisible && suggestions.length > maxVisible

  if (layout === 'horizontal') {
    return (
      <ScrollArea className={cn('w-full', className)}>
        <div className="flex gap-2 pb-2">
          {visibleSuggestions.map((suggestion) => (
            <SuggestionChip
              key={suggestion.id}
              suggestion={suggestion}
              onClick={() => onSelect(suggestion)}
              variant={variant}
              size={size}
              showIcon={showIcon}
              showArrow={showArrow}
            />
          ))}
          {hasMore && !showAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(true)}
              className="text-muted-foreground"
            >
              +{suggestions.length - maxVisible} more
            </Button>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )
  }

  if (layout === 'vertical') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {visibleSuggestions.map((suggestion) => (
          <SuggestionChip
            key={suggestion.id}
            suggestion={suggestion}
            onClick={() => onSelect(suggestion)}
            variant={variant}
            size={size}
            showIcon={showIcon}
            showArrow={showArrow}
            className="justify-start"
          />
        ))}
        {hasMore && !showAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(true)}
            className="text-muted-foreground justify-start"
          >
            Show {suggestions.length - maxVisible} more
          </Button>
        )}
      </div>
    )
  }

  if (layout === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 gap-2', className)}>
        {visibleSuggestions.map((suggestion) => (
          <SuggestionChip
            key={suggestion.id}
            suggestion={suggestion}
            onClick={() => onSelect(suggestion)}
            variant={variant}
            size={size}
            showIcon={showIcon}
            showArrow={showArrow}
            className="justify-start"
          />
        ))}
      </div>
    )
  }

  // Wrap layout
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {visibleSuggestions.map((suggestion) => (
        <SuggestionChip
          key={suggestion.id}
          suggestion={suggestion}
          onClick={() => onSelect(suggestion)}
          variant={variant}
          size={size}
          showIcon={showIcon}
          showArrow={showArrow}
        />
      ))}
      {hasMore && !showAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(true)}
          className="text-muted-foreground"
        >
          +{suggestions.length - maxVisible} more
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// SUGGESTION GROUP
// ============================================================================

export function SuggestionGroup({
  title,
  icon,
  suggestions,
  onSelect,
  collapsible = false,
  defaultCollapsed = false,
  variant = 'outline',
  className,
}: SuggestionGroupProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <button
          type="button"
          className={cn(
            'flex items-center gap-2 text-sm font-medium text-muted-foreground',
            collapsible &&
              'cursor-pointer hover:text-foreground transition-colors'
          )}
          onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
          disabled={!collapsible}
        >
          {icon}
          <span>{title}</span>
          {collapsible && (
            <ArrowRight
              className={cn(
                'h-3.5 w-3.5 transition-transform',
                !isCollapsed && 'rotate-90'
              )}
            />
          )}
        </button>
      )}
      {!isCollapsed && (
        <SuggestionChips
          suggestions={suggestions}
          onSelect={onSelect}
          variant={variant}
          layout="wrap"
        />
      )}
    </div>
  )
}

// ============================================================================
// QUICK ACTIONS - Card-based suggestions
// ============================================================================

export function QuickActions({
  actions,
  onSelect,
  columns = 2,
  variant = 'card',
  className,
}: QuickActionsProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelect(action)}
            disabled={action.disabled}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm',
              'text-muted-foreground hover:text-foreground hover:bg-accent',
              'transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'button') {
    return (
      <div className={cn('grid gap-2', gridCols[columns], className)}>
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="justify-start h-auto py-3 px-4 bg-transparent"
            onClick={() => onSelect(action)}
            disabled={action.disabled}
          >
            <div className="flex items-center gap-3">
              {action.icon && (
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {action.icon}
                </div>
              )}
              <div className="text-left">
                <p className="font-medium">{action.label}</p>
                {action.category && (
                  <p className="text-xs text-muted-foreground">
                    {action.category}
                  </p>
                )}
              </div>
            </div>
          </Button>
        ))}
      </div>
    )
  }

  // Card variant
  return (
    <div className={cn('grid gap-3', gridCols[columns], className)}>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => onSelect(action)}
          disabled={action.disabled}
          className={cn(
            'group relative flex flex-col items-start p-4 rounded-xl border border-border',
            'bg-background hover:bg-accent/50 hover:border-primary/50',
            'transition-all duration-200 text-left',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {action.icon && (
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/20 transition-colors">
              {action.icon}
            </div>
          )}
          <p className="font-medium">{action.label}</p>
          {action.category && (
            <p className="text-xs text-muted-foreground mt-1">
              {action.category}
            </p>
          )}
          <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// CONTEXTUAL SUGGESTIONS - Smart suggestions based on context
// ============================================================================

export interface ContextualSuggestionsProps {
  context?: string
  suggestions: Suggestion[]
  onSelect: (suggestion: Suggestion) => void
  isLoading?: boolean
  className?: string
}

export function ContextualSuggestions({
  context,
  suggestions,
  onSelect,
  isLoading,
  className,
}: ContextualSuggestionsProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-muted-foreground',
          className
        )}
      >
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>Getting suggestions...</span>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      {context && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Lightbulb className="h-3 w-3" />
          Based on your conversation
        </p>
      )}
      <SuggestionChips
        suggestions={suggestions}
        onSelect={onSelect}
        variant="pill"
        size="sm"
        layout="wrap"
        showIcon={false}
        showArrow
      />
    </div>
  )
}

// ============================================================================
// DEFAULT SUGGESTIONS
// ============================================================================

export const defaultSuggestions: Suggestion[] = [
  {
    id: 'help',
    label: 'Help me get started',
    icon: <HelpCircle className="h-3.5 w-3.5" />,
    prompt: 'Help me get started. What can you do?',
  },
  {
    id: 'explain',
    label: 'Explain this concept',
    icon: <Lightbulb className="h-3.5 w-3.5" />,
    prompt: 'Can you explain ',
  },
  {
    id: 'code',
    label: 'Write some code',
    icon: <Code className="h-3.5 w-3.5" />,
    prompt: 'Write code to ',
  },
  {
    id: 'summarize',
    label: 'Summarize text',
    icon: <FileText className="h-3.5 w-3.5" />,
    prompt: 'Summarize the following: ',
  },
  {
    id: 'image',
    label: 'Analyze an image',
    icon: <ImageIcon className="h-3.5 w-3.5" />,
    prompt: 'Analyze this image: ',
  },
  {
    id: 'calculate',
    label: 'Do calculations',
    icon: <Calculator className="h-3.5 w-3.5" />,
    prompt: 'Calculate ',
  },
  {
    id: 'search',
    label: 'Search the web',
    icon: <Globe className="h-3.5 w-3.5" />,
    prompt: 'Search for ',
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm ideas',
    icon: <Zap className="h-3.5 w-3.5" />,
    prompt: 'Help me brainstorm ideas for ',
  },
]

export const defaultQuickActions: Suggestion[] = [
  {
    id: 'new-chat',
    label: 'Start New Chat',
    icon: <MessageSquare className="h-4 w-4" />,
    category: 'Quick Action',
  },
  {
    id: 'trending',
    label: 'Trending Topics',
    icon: <TrendingUp className="h-4 w-4" />,
    category: 'Explore',
  },
  {
    id: 'coding-help',
    label: 'Coding Assistant',
    icon: <Code className="h-4 w-4" />,
    category: 'Specialized',
  },
  {
    id: 'writing-help',
    label: 'Writing Assistant',
    icon: <FileText className="h-4 w-4" />,
    category: 'Specialized',
  },
]
