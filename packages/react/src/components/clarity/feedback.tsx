'use client'

import * as React from 'react'
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageSquare,
  Star,
  Heart,
  Frown,
  Meh,
  Smile,
  Check,
  X,
  Send,
  AlertTriangle,
  Bug,
  Lightbulb,
  HelpCircle,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@clarity-chat/primitives'
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
import { RadioGroup, RadioGroupItem } from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Types
export type FeedbackType = 'positive' | 'negative' | 'neutral'
export type FeedbackReason =
  | 'helpful'
  | 'accurate'
  | 'creative'
  | 'clear'
  | 'fast'
  | 'unhelpful'
  | 'inaccurate'
  | 'confusing'
  | 'incomplete'
  | 'slow'
  | 'offensive'
  | 'other'

export interface FeedbackData {
  type: FeedbackType
  reason?: FeedbackReason
  comment?: string
  rating?: number
  messageId?: string
  timestamp: Date
}

// Simple Thumbs Feedback
export interface ThumbsFeedbackProps {
  value?: FeedbackType
  onChange?: (type: FeedbackType) => void
  onFeedback?: (data: FeedbackData) => void
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export function ThumbsFeedback({
  value,
  onChange,
  onFeedback,
  showLabels = false,
  size = 'md',
  disabled = false,
  className,
}: ThumbsFeedbackProps) {
  const [selected, setSelected] = React.useState<FeedbackType | undefined>(
    value
  )

  const handleClick = (type: FeedbackType) => {
    if (disabled) return
    const newValue = selected === type ? undefined : type
    setSelected(newValue as FeedbackType)
    if (newValue) {
      onChange?.(newValue)
      onFeedback?.({ type: newValue, timestamp: new Date() })
    }
  }

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={selected === 'positive' ? 'default' : 'ghost'}
              size="icon"
              className={cn(
                sizeClasses[size],
                selected === 'positive' &&
                  'bg-green-500 hover:bg-green-600 text-white'
              )}
              onClick={() => handleClick('positive')}
              disabled={disabled}
            >
              <ThumbsUp className={iconSizes[size]} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Good response</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showLabels && selected === 'positive' && (
        <span className="text-xs text-green-500">Helpful</span>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={selected === 'negative' ? 'default' : 'ghost'}
              size="icon"
              className={cn(
                sizeClasses[size],
                selected === 'negative' &&
                  'bg-red-500 hover:bg-red-600 text-white'
              )}
              onClick={() => handleClick('negative')}
              disabled={disabled}
            >
              <ThumbsDown className={iconSizes[size]} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Poor response</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showLabels && selected === 'negative' && (
        <span className="text-xs text-red-500">Not helpful</span>
      )}
    </div>
  )
}

// Star Rating Feedback
export interface StarRatingProps {
  value?: number
  onChange?: (rating: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  showValue?: boolean
  className?: string
}

export function StarRating({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  disabled = false,
  showValue = false,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const [selected, setSelected] = React.useState(value)

  const handleClick = (rating: number) => {
    if (disabled) return
    setSelected(rating)
    onChange?.(rating)
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const rating = i + 1
        const isFilled = rating <= (hovered ?? selected)

        return (
          <button
            key={i}
            type="button"
            className={cn(
              'transition-colors focus:outline-none',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            )}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => !disabled && setHovered(rating)}
            onMouseLeave={() => setHovered(null)}
            disabled={disabled}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              )}
            />
          </button>
        )
      })}
      {showValue && (
        <span className="ml-2 text-sm text-muted-foreground">
          {selected}/{max}
        </span>
      )}
    </div>
  )
}

// Emoji Feedback
export interface EmojiFeedbackProps {
  value?: number
  onChange?: (rating: number) => void
  onFeedback?: (data: FeedbackData) => void
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export function EmojiFeedback({
  value,
  onChange,
  onFeedback,
  size = 'md',
  disabled = false,
  className,
}: EmojiFeedbackProps) {
  const [selected, setSelected] = React.useState<number | undefined>(value)

  const emojis = [
    { icon: Frown, label: 'Very unsatisfied', value: 1, color: 'text-red-500' },
    { icon: Meh, label: 'Unsatisfied', value: 2, color: 'text-orange-500' },
    { icon: Smile, label: 'Neutral', value: 3, color: 'text-yellow-500' },
    { icon: Heart, label: 'Satisfied', value: 4, color: 'text-green-500' },
    { icon: Star, label: 'Very satisfied', value: 5, color: 'text-blue-500' },
  ]

  const handleClick = (rating: number) => {
    if (disabled) return
    setSelected(rating)
    onChange?.(rating)
    onFeedback?.({
      type: rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral',
      rating,
      timestamp: new Date(),
    })
  }

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {emojis.map((emoji) => {
        const Icon = emoji.icon
        const isSelected = selected === emoji.value

        return (
          <TooltipProvider key={emoji.value}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'rounded-full p-1.5 transition-all',
                    sizeClasses[size],
                    isSelected
                      ? `${emoji.color} bg-current/10 scale-110`
                      : 'text-muted-foreground hover:text-foreground',
                    disabled && 'cursor-not-allowed opacity-50'
                  )}
                  onClick={() => handleClick(emoji.value)}
                  disabled={disabled}
                >
                  <Icon
                    className={cn(iconSizes[size], isSelected && emoji.color)}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>{emoji.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  )
}

// Detailed Feedback Form
export interface DetailedFeedbackProps {
  onSubmit?: (data: FeedbackData) => void
  messageId?: string
  trigger?: React.ReactNode
  className?: string
}

export function DetailedFeedback({
  onSubmit,
  messageId,
  trigger,
  className,
}: DetailedFeedbackProps) {
  const [open, setOpen] = React.useState(false)
  const [feedbackType, setFeedbackType] =
    React.useState<FeedbackType>('positive')
  const [reason, setReason] = React.useState<FeedbackReason | undefined>()
  const [comment, setComment] = React.useState('')

  const positiveReasons: { value: FeedbackReason; label: string }[] = [
    { value: 'helpful', label: 'Very helpful' },
    { value: 'accurate', label: 'Accurate information' },
    { value: 'creative', label: 'Creative response' },
    { value: 'clear', label: 'Clear and easy to understand' },
    { value: 'fast', label: 'Quick response' },
  ]

  const negativeReasons: { value: FeedbackReason; label: string }[] = [
    { value: 'unhelpful', label: 'Not helpful' },
    { value: 'inaccurate', label: 'Incorrect information' },
    { value: 'confusing', label: 'Confusing or unclear' },
    { value: 'incomplete', label: 'Incomplete response' },
    { value: 'offensive', label: 'Inappropriate content' },
  ]

  const reasons =
    feedbackType === 'positive' ? positiveReasons : negativeReasons

  const handleSubmit = () => {
    onSubmit?.({
      type: feedbackType,
      reason,
      comment: comment || undefined,
      messageId,
      timestamp: new Date(),
    })
    setOpen(false)
    setReason(undefined)
    setComment('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className={className}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Type Selection */}
          <div className="flex justify-center gap-4">
            <Button
              variant={feedbackType === 'positive' ? 'default' : 'outline'}
              className={cn(
                'flex-1',
                feedbackType === 'positive' && 'bg-green-500 hover:bg-green-600'
              )}
              onClick={() => setFeedbackType('positive')}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Good
            </Button>
            <Button
              variant={feedbackType === 'negative' ? 'default' : 'outline'}
              className={cn(
                'flex-1',
                feedbackType === 'negative' && 'bg-red-500 hover:bg-red-600'
              )}
              onClick={() => setFeedbackType('negative')}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Poor
            </Button>
          </div>

          {/* Reason Selection */}
          <div className="space-y-3">
            <Label>What was the main reason?</Label>
            <RadioGroup
              value={reason}
              onValueChange={(v) => setReason(v as FeedbackReason)}
            >
              <div className="grid grid-cols-1 gap-2">
                {reasons.map((r) => (
                  <div key={r.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={r.value} id={r.value} />
                    <Label
                      htmlFor={r.value}
                      className="font-normal cursor-pointer"
                    >
                      {r.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label>Additional comments (optional)</Label>
            <Textarea
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Quick Feedback Popover
export interface QuickFeedbackProps {
  onFeedback?: (data: FeedbackData) => void
  messageId?: string
  trigger?: React.ReactNode
  className?: string
}

export function QuickFeedback({
  onFeedback,
  messageId,
  trigger,
  className,
}: QuickFeedbackProps) {
  const [open, setOpen] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const quickOptions = [
    {
      icon: ThumbsUp,
      label: 'Helpful',
      type: 'positive' as FeedbackType,
      reason: 'helpful' as FeedbackReason,
    },
    {
      icon: ThumbsDown,
      label: 'Not helpful',
      type: 'negative' as FeedbackType,
      reason: 'unhelpful' as FeedbackReason,
    },
    {
      icon: AlertTriangle,
      label: 'Inaccurate',
      type: 'negative' as FeedbackType,
      reason: 'inaccurate' as FeedbackReason,
    },
    {
      icon: Bug,
      label: 'Bug/Error',
      type: 'negative' as FeedbackType,
      reason: 'other' as FeedbackReason,
    },
  ]

  const handleSelect = (option: (typeof quickOptions)[0]) => {
    onFeedback?.({
      type: option.type,
      reason: option.reason,
      messageId,
      timestamp: new Date(),
    })
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setSubmitted(false)
    }, 1000)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', className)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        {submitted ? (
          <div className="flex items-center justify-center py-3 text-sm text-green-500">
            <Check className="h-4 w-4 mr-1" />
            Thanks for feedback!
          </div>
        ) : (
          <div className="space-y-0.5">
            {quickOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.label}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors text-left"
                  onClick={() => handleSelect(option)}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// Report Issue Component
export interface ReportIssueProps {
  onSubmit?: (data: {
    type: string
    description: string
    messageId?: string
  }) => void
  messageId?: string
  trigger?: React.ReactNode
  className?: string
}

export function ReportIssue({
  onSubmit,
  messageId,
  trigger,
  className,
}: ReportIssueProps) {
  const [open, setOpen] = React.useState(false)
  const [issueType, setIssueType] = React.useState<string>('')
  const [description, setDescription] = React.useState('')

  const issueTypes = [
    { value: 'incorrect', label: 'Incorrect information', icon: AlertTriangle },
    { value: 'harmful', label: 'Harmful or unsafe', icon: Flag },
    { value: 'offensive', label: 'Offensive content', icon: Flag },
    { value: 'bug', label: 'Technical issue', icon: Bug },
    { value: 'other', label: 'Other', icon: HelpCircle },
  ]

  const handleSubmit = () => {
    if (!issueType) return
    onSubmit?.({
      type: issueType,
      description,
      messageId,
    })
    setOpen(false)
    setIssueType('')
    setDescription('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="sm"
            className={cn('text-destructive', className)}
          >
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Help us identify and fix problems with AI responses.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>What type of issue is this?</Label>
            <div className="grid grid-cols-1 gap-2">
              {issueTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border text-left transition-colors',
                      issueType === type.value
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:bg-muted'
                    )}
                    onClick={() => setIssueType(type.value)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Please describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!issueType}>
            <Send className="h-4 w-4 mr-2" />
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Feedback Actions (Combined component for message actions)
export interface FeedbackActionsProps {
  messageId?: string
  onFeedback?: (data: FeedbackData) => void
  onReport?: (data: {
    type: string
    description: string
    messageId?: string
  }) => void
  value?: FeedbackType
  showDetailed?: boolean
  className?: string
}

export function FeedbackActions({
  messageId,
  onFeedback,
  onReport,
  value,
  showDetailed = false,
  className,
}: FeedbackActionsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <ThumbsFeedback value={value} onFeedback={onFeedback} size="sm" />

      {showDetailed && (
        <DetailedFeedback
          messageId={messageId}
          onSubmit={onFeedback}
          trigger={
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MessageSquare className="h-3.5 w-3.5" />
            </Button>
          }
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Lightbulb className="h-4 w-4 mr-2" />
            Suggest improvement
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <Flag className="h-4 w-4 mr-2" />
            Report issue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
