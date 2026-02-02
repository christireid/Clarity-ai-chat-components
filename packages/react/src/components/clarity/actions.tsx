'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Share,
  Bookmark,
  Flag,
  Edit,
  Trash2,
  Volume2,
  Download,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'

// ============================================================================
// MESSAGE ACTIONS - Superior to Ant Design X Actions
// ============================================================================

interface ActionItem {
  key: string
  icon?: React.ReactNode
  label?: string
  tooltip?: string
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
  hidden?: boolean
}

interface ActionsProps {
  items?: ActionItem[]
  direction?: 'horizontal' | 'vertical'
  variant?: 'default' | 'ghost' | 'compact' | 'floating'
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
  className?: string
}

export function Actions({
  items = [],
  direction = 'horizontal',
  variant = 'default',
  size = 'sm',
  showLabels = false,
  className,
}: ActionsProps) {
  const visibleItems = items.filter((item) => !item.hidden)

  return (
    <div
      className={cn(
        'flex',
        direction === 'horizontal'
          ? 'flex-row items-center gap-1'
          : 'flex-col gap-1',
        variant === 'floating' &&
          'p-1 rounded-lg bg-background/95 backdrop-blur-sm shadow-lg border border-border',
        className
      )}
    >
      {visibleItems.map((item) => (
        <ActionButton
          key={item.key}
          item={item}
          variant={variant}
          size={size}
          showLabel={showLabels}
        />
      ))}
    </div>
  )
}

interface ActionButtonProps {
  item: ActionItem
  variant: 'default' | 'ghost' | 'compact' | 'floating'
  size: 'sm' | 'md' | 'lg'
  showLabel: boolean
}

function ActionButton({ item, variant, size, showLabel }: ActionButtonProps) {
  const sizeClasses = {
    sm: 'h-7 px-2 text-xs',
    md: 'h-8 px-2.5 text-sm',
    lg: 'h-9 px-3 text-sm',
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  }

  const button = (
    <Button
      variant={
        variant === 'ghost' || variant === 'compact' ? 'ghost' : 'outline'
      }
      size="sm"
      onClick={item.onClick}
      disabled={item.disabled}
      className={cn(
        sizeClasses[size],
        variant === 'compact' && 'h-6 w-6 p-0',
        item.danger &&
          'text-destructive hover:text-destructive hover:bg-destructive/10'
      )}
    >
      {item.icon && (
        <span
          className={cn(iconSizes[size], showLabel && item.label && 'mr-1.5')}
        >
          {item.icon}
        </span>
      )}
      {showLabel && item.label && <span>{item.label}</span>}
    </Button>
  )

  if (item.tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {item.tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}

// ============================================================================
// COPY BUTTON - Enhanced copy to clipboard
// ============================================================================

interface CopyButtonProps {
  text: string
  onCopy?: () => void
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showLabel?: boolean
  className?: string
}

export function CopyButton({
  text,
  onCopy,
  variant = 'ghost',
  size = 'sm',
  label = 'Copy',
  showLabel = false,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const sizeClasses = {
    sm: 'h-7 px-2 text-xs',
    md: 'h-8 px-2.5 text-sm',
    lg: 'h-9 px-3 text-sm',
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="sm"
            onClick={handleCopy}
            className={cn(sizeClasses[size], className)}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {showLabel && (
              <span className="ml-1.5">{copied ? 'Copied!' : label}</span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {copied ? 'Copied!' : label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ============================================================================
// FEEDBACK BUTTONS - Like/Dislike with animation
// ============================================================================

type FeedbackValue = 'positive' | 'negative' | null

interface FeedbackButtonsProps {
  value?: FeedbackValue
  onChange?: (value: FeedbackValue) => void
  onFeedback?: (type: 'positive' | 'negative', value: boolean) => void
  variant?: 'default' | 'compact' | 'expanded'
  showLabels?: boolean
  allowToggle?: boolean
  className?: string
}

export function FeedbackButtons({
  value,
  onChange,
  onFeedback,
  variant = 'default',
  showLabels = false,
  allowToggle = true,
  className,
}: FeedbackButtonsProps) {
  const [localValue, setLocalValue] = React.useState<FeedbackValue>(
    value || null
  )
  const currentValue = onChange ? value : localValue

  const handleClick = (type: 'positive' | 'negative') => {
    const newValue = currentValue === type && allowToggle ? null : type

    if (onChange) {
      onChange(newValue)
    } else {
      setLocalValue(newValue)
    }

    onFeedback?.(type, newValue === type)
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-0.5', className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleClick('positive')}
          className={cn(
            'h-6 w-6 p-0',
            currentValue === 'positive' && 'text-green-500 bg-green-500/10'
          )}
        >
          <ThumbsUp className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleClick('negative')}
          className={cn(
            'h-6 w-6 p-0',
            currentValue === 'negative' && 'text-red-500 bg-red-500/10'
          )}
        >
          <ThumbsDown className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  if (variant === 'expanded') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant={currentValue === 'positive' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleClick('positive')}
          className={cn(
            'gap-1.5',
            currentValue === 'positive' &&
              'bg-green-500 hover:bg-green-600 text-white'
          )}
        >
          <ThumbsUp className="w-4 h-4" />
          {showLabels && 'Helpful'}
        </Button>
        <Button
          variant={currentValue === 'negative' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleClick('negative')}
          className={cn(
            'gap-1.5',
            currentValue === 'negative' &&
              'bg-red-500 hover:bg-red-600 text-white'
          )}
        >
          <ThumbsDown className="w-4 h-4" />
          {showLabels && 'Not helpful'}
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleClick('positive')}
              className={cn(
                'h-7 px-2',
                currentValue === 'positive' &&
                  'text-green-500 bg-green-500/10 hover:bg-green-500/20'
              )}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              {showLabels && <span className="ml-1.5 text-xs">Helpful</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mark as helpful</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleClick('negative')}
              className={cn(
                'h-7 px-2',
                currentValue === 'negative' &&
                  'text-red-500 bg-red-500/10 hover:bg-red-500/20'
              )}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              {showLabels && (
                <span className="ml-1.5 text-xs">Not helpful</span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mark as not helpful</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

// ============================================================================
// MESSAGE ACTION BAR - Complete action bar for messages
// ============================================================================

interface MessageActionBarProps {
  content?: string
  onCopy?: () => void
  onRegenerate?: () => void
  onFeedback?: (type: 'positive' | 'negative', value: boolean) => void
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  onBookmark?: () => void
  onReport?: () => void
  onSpeak?: () => void
  feedback?: FeedbackValue
  showCopy?: boolean
  showRegenerate?: boolean
  showFeedback?: boolean
  showMore?: boolean
  moreActions?: ActionItem[]
  variant?: 'default' | 'floating' | 'inline'
  className?: string
}

export function MessageActionBar({
  content = '',
  onCopy,
  onRegenerate,
  onFeedback,
  onEdit,
  onDelete,
  onShare,
  onBookmark,
  onReport,
  onSpeak,
  feedback,
  showCopy = true,
  showRegenerate = true,
  showFeedback = true,
  showMore = true,
  moreActions,
  variant = 'default',
  className,
}: MessageActionBarProps) {
  const [feedbackValue, setFeedbackValue] = React.useState<FeedbackValue>(
    feedback || null
  )

  const handleFeedbackChange = (value: FeedbackValue) => {
    setFeedbackValue(value)
    if (value) {
      onFeedback?.(value, true)
    }
  }

  const defaultMoreActions: ActionItem[] = [
    ...(onEdit
      ? [
          {
            key: 'edit',
            icon: <Edit className="w-4 h-4" />,
            label: 'Edit',
            onClick: onEdit,
          },
        ]
      : []),
    ...(onShare
      ? [
          {
            key: 'share',
            icon: <Share className="w-4 h-4" />,
            label: 'Share',
            onClick: onShare,
          },
        ]
      : []),
    ...(onBookmark
      ? [
          {
            key: 'bookmark',
            icon: <Bookmark className="w-4 h-4" />,
            label: 'Bookmark',
            onClick: onBookmark,
          },
        ]
      : []),
    ...(onSpeak
      ? [
          {
            key: 'speak',
            icon: <Volume2 className="w-4 h-4" />,
            label: 'Read aloud',
            onClick: onSpeak,
          },
        ]
      : []),
    ...(onReport
      ? [
          {
            key: 'report',
            icon: <Flag className="w-4 h-4" />,
            label: 'Report',
            onClick: onReport,
            danger: true,
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            key: 'delete',
            icon: <Trash2 className="w-4 h-4" />,
            label: 'Delete',
            onClick: onDelete,
            danger: true,
          },
        ]
      : []),
  ]

  const allMoreActions = moreActions || defaultMoreActions

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        variant === 'floating' &&
          'p-1 rounded-lg bg-background/95 backdrop-blur-sm shadow-lg border border-border',
        variant === 'inline' &&
          'opacity-0 group-hover:opacity-100 transition-opacity',
        className
      )}
    >
      {showCopy && content && <CopyButton text={content} onCopy={onCopy} />}

      {showRegenerate && onRegenerate && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-7 px-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Regenerate response</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {showFeedback && (
        <FeedbackButtons
          value={feedbackValue}
          onChange={handleFeedbackChange}
          variant="compact"
        />
      )}

      {showMore && allMoreActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {allMoreActions.map((action, index) => (
              <React.Fragment key={action.key}>
                {index > 0 &&
                  action.danger &&
                  allMoreActions[index - 1] &&
                  !allMoreActions[index - 1].danger && (
                    <DropdownMenuSeparator />
                  )}
                <DropdownMenuItem
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={cn(
                    action.danger && 'text-destructive focus:text-destructive'
                  )}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

// ============================================================================
// FEEDBACK BAR - Extended feedback component (Prompt-Kit style)
// ============================================================================

interface FeedbackBarProps {
  onFeedback?: (rating: number, feedback?: string) => void
  variant?: 'simple' | 'detailed' | 'inline'
  maxRating?: number
  showTextInput?: boolean
  placeholder?: string
  submitLabel?: string
  className?: string
}

export function FeedbackBar({
  onFeedback,
  variant = 'simple',
  maxRating = 5,
  showTextInput = false,
  placeholder = 'Tell us more about your experience...',
  submitLabel = 'Submit',
  className,
}: FeedbackBarProps) {
  const [rating, setRating] = React.useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null)
  const [feedback, setFeedback] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = () => {
    if (rating) {
      onFeedback?.(rating, feedback || undefined)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-muted-foreground',
          className
        )}
      >
        <Check className="w-4 h-4 text-green-500" />
        Thank you for your feedback!
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-sm text-muted-foreground">Was this helpful?</span>
        <FeedbackButtons
          onFeedback={(type, value) => {
            if (value) {
              onFeedback?.(type === 'positive' ? 5 : 1)
              setSubmitted(true)
            }
          }}
          variant="compact"
        />
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {variant === 'detailed' && (
        <p className="text-sm text-muted-foreground">
          How would you rate this response?
        </p>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
            className="p-1 transition-transform hover:scale-110"
          >
            <svg
              className={cn(
                'w-6 h-6 transition-colors',
                (hoveredRating ?? rating ?? 0) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-muted-foreground/40'
              )}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>

      {showTextInput && rating && (
        <div className="space-y-2">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[80px] p-3 text-sm rounded-lg border border-border bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button size="sm" onClick={handleSubmit}>
            {submitLabel}
          </Button>
        </div>
      )}

      {!showTextInput && rating && (
        <Button size="sm" onClick={handleSubmit}>
          {submitLabel}
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// QUICK ACTIONS - Floating action buttons
// ============================================================================

interface QuickActionsProps {
  actions: ActionItem[]
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export function QuickActions({
  actions,
  position = 'bottom-right',
  direction = 'vertical',
  className,
}: QuickActionsProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      <Actions
        items={actions}
        direction={direction}
        variant="floating"
        size="md"
      />
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  ActionsProps,
  ActionItem,
  CopyButtonProps,
  FeedbackButtonsProps,
  FeedbackValue,
  MessageActionBarProps,
  FeedbackBarProps,
  QuickActionsProps,
}
