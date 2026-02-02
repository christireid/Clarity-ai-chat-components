'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Sparkles,
  Loader2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Edit2,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Checkbox } from '@clarity-chat/primitives'
import { RadioGroup, RadioGroupItem } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import { Skeleton } from '@clarity-chat/primitives'

// Streaming text component
interface StreamingTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function StreamingText({
  text,
  speed = 20,
  className,
  onComplete,
}: StreamingTextProps) {
  const [displayedText, setDisplayedText] = React.useState('')
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1))
      }, speed)
      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [displayedText, text, speed, isComplete, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5" />
      )}
    </span>
  )
}

// AI-generated suggestion chips
interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  loading?: boolean
  className?: string
}

export function SuggestionChips({
  suggestions,
  onSelect,
  loading = false,
  className,
}: SuggestionChipsProps) {
  if (loading) {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="rounded-full h-8 text-sm hover:bg-accent hover:text-accent-foreground bg-transparent"
          onClick={() => onSelect(suggestion)}
        >
          <Sparkles className="h-3 w-3 mr-1.5" />
          {suggestion}
        </Button>
      ))}
    </div>
  )
}

// Dynamic form generated from AI
interface GeneratedFormField {
  id: string
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
  label: string
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
  defaultValue?: string
}

interface GeneratedFormProps {
  title?: string
  description?: string
  fields: GeneratedFormField[]
  onSubmit: (data: Record<string, any>) => void
  onCancel?: () => void
  submitLabel?: string
  loading?: boolean
  className?: string
}

export function GeneratedForm({
  title,
  description,
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  loading = false,
  className,
}: GeneratedFormProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && (
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              {title}
            </CardTitle>
          )}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>

              {field.type === 'text' ||
              field.type === 'email' ||
              field.type === 'number' ? (
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                />
              ) : field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => updateField(field.id, e.target.value)}
                />
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={formData[field.id] || false}
                    onCheckedChange={(checked) =>
                      updateField(field.id, checked)
                    }
                  />
                  <label
                    htmlFor={field.id}
                    className="text-sm text-muted-foreground"
                  >
                    {field.placeholder}
                  </label>
                </div>
              ) : field.type === 'radio' && field.options ? (
                <RadioGroup
                  value={formData[field.id] || ''}
                  onValueChange={(value) => updateField(field.id, value)}
                >
                  {field.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`${field.id}-${option.value}`}
                      />
                      <Label htmlFor={`${field.id}-${option.value}`}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : null}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

// Step-by-step process indicator
interface ProcessStep {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed' | 'error'
  result?: React.ReactNode
}

interface ProcessStepsProps {
  steps: ProcessStep[]
  className?: string
}

export function ProcessSteps({ steps, className }: ProcessStepsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            'flex gap-3 p-3 rounded-lg border transition-colors',
            step.status === 'in-progress' && 'border-accent bg-accent/5',
            step.status === 'completed' &&
              'border-emerald-500/50 bg-emerald-500/5',
            step.status === 'error' && 'border-destructive/50 bg-destructive/5',
            step.status === 'pending' && 'border-border opacity-60'
          )}
        >
          {/* Status icon */}
          <div className="shrink-0 mt-0.5">
            {step.status === 'pending' && (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
            )}
            {step.status === 'in-progress' && (
              <Loader2 className="h-5 w-5 text-accent animate-spin" />
            )}
            {step.status === 'completed' && (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            )}
            {step.status === 'error' && (
              <AlertCircle className="h-5 w-5 text-destructive" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Step {index + 1}
              </span>
              <h4 className="font-medium text-sm">{step.title}</h4>
            </div>
            {step.description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {step.description}
              </p>
            )}
            {step.result && <div className="mt-2 text-sm">{step.result}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

// Predictive action card
interface PredictiveActionProps {
  title: string
  description: string
  confidence?: number
  onAccept: () => void
  onReject: () => void
  onModify?: () => void
  loading?: boolean
  className?: string
}

export function PredictiveAction({
  title,
  description,
  confidence,
  onAccept,
  onReject,
  onModify,
  loading = false,
  className,
}: PredictiveActionProps) {
  return (
    <Card className={cn('border-accent/50 bg-accent/5', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          {confidence !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {Math.round(confidence * 100)}% confident
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          className="h-7 bg-transparent"
          onClick={onReject}
          disabled={loading}
        >
          <X className="h-3 w-3 mr-1" />
          Reject
        </Button>
        {onModify && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 bg-transparent"
            onClick={onModify}
            disabled={loading}
          >
            <Edit2 className="h-3 w-3 mr-1" />
            Modify
          </Button>
        )}
        <Button
          size="sm"
          className="h-7 ml-auto"
          onClick={onAccept}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Check className="h-3 w-3 mr-1" />
          )}
          Accept
        </Button>
      </CardFooter>
    </Card>
  )
}

// Human in the loop approval
interface ApprovalRequestProps {
  title: string
  description: string
  details?: { label: string; value: string }[]
  preview?: React.ReactNode
  onApprove: () => void
  onDeny: () => void
  onRequestChanges?: (feedback: string) => void
  loading?: boolean
  className?: string
}

export function ApprovalRequest({
  title,
  description,
  details,
  preview,
  onApprove,
  onDeny,
  onRequestChanges,
  loading = false,
  className,
}: ApprovalRequestProps) {
  const [showFeedback, setShowFeedback] = React.useState(false)
  const [feedback, setFeedback] = React.useState('')

  const handleRequestChanges = () => {
    if (feedback.trim()) {
      onRequestChanges?.(feedback)
      setFeedback('')
      setShowFeedback(false)
    }
  }

  return (
    <Card className={cn('border-amber-500/50 bg-amber-500/5', className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-500" />
          <CardTitle className="text-sm">Approval Required</CardTitle>
        </div>
        <CardTitle className="text-base mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {details && details.length > 0 && (
          <div className="space-y-2 text-sm">
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className="font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        {preview && (
          <div className="p-3 rounded-lg border border-border bg-muted/30">
            {preview}
          </div>
        )}

        {showFeedback && onRequestChanges && (
          <div className="space-y-2">
            <Textarea
              placeholder="Describe the changes you'd like..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFeedback(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleRequestChanges}
                disabled={!feedback.trim()}
              >
                Send Feedback
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      {!showFeedback && (
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive bg-transparent"
            onClick={onDeny}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-1" />
            Deny
          </Button>
          {onRequestChanges && (
            <Button
              variant="outline"
              onClick={() => setShowFeedback(true)}
              disabled={loading}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Request Changes
            </Button>
          )}
          <Button className="ml-auto" onClick={onApprove} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-1" />
            )}
            Approve
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// Collapsible AI output
interface CollapsibleOutputProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  badge?: string
  className?: string
}

export function CollapsibleOutput({
  title,
  children,
  defaultExpanded = false,
  badge,
  className,
}: CollapsibleOutputProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        className
      )}
    >
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">{title}</span>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {expanded && <div className="p-4 animate-expand">{children}</div>}
    </div>
  )
}

// Quick action buttons
interface QuickAction {
  id: string
  label: string
  icon?: React.ReactNode
  description?: string
}

interface QuickActionsProps {
  actions: QuickAction[]
  onSelect: (action: QuickAction) => void
  variant?: 'buttons' | 'cards'
  className?: string
}

export function QuickActions({
  actions,
  onSelect,
  variant = 'buttons',
  className,
}: QuickActionsProps) {
  if (variant === 'cards') {
    return (
      <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-accent/50 hover:bg-accent/5 transition-colors text-left"
            onClick={() => onSelect(action)}
          >
            {action.icon && (
              <div className="shrink-0 p-2 rounded-md bg-accent/10 text-accent">
                {action.icon}
              </div>
            )}
            <div>
              <h4 className="font-medium text-sm">{action.label}</h4>
              {action.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {action.description}
                </p>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto shrink-0 mt-1" />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          size="sm"
          className="h-9 bg-transparent"
          onClick={() => onSelect(action)}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  )
}
