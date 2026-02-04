'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Check,
  Circle,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'

// ============================================================================
// STEPS COMPONENT - Superior to Prompt-Kit Steps
// ============================================================================

type StepStatus = 'pending' | 'active' | 'complete' | 'error' | 'skipped'

interface Step {
  key: string
  title: string
  description?: string
  content?: React.ReactNode
  status?: StepStatus
  icon?: React.ReactNode
}

interface StepsProps {
  items: Step[]
  current?: number
  direction?: 'vertical' | 'horizontal'
  variant?: 'default' | 'compact' | 'numbered' | 'simple'
  size?: 'sm' | 'md' | 'lg'
  clickable?: boolean
  onChange?: (index: number) => void
  className?: string
}

export function Steps({
  items,
  current = 0,
  direction = 'vertical',
  variant = 'default',
  size = 'md',
  clickable = false,
  onChange,
  className,
}: StepsProps) {
  const getStepStatus = (index: number, step: Step): StepStatus => {
    if (step.status) return step.status
    if (index < current) return 'complete'
    if (index === current) return 'active'
    return 'pending'
  }

  if (direction === 'horizontal') {
    return (
      <div className={cn('flex items-start', className)}>
        {items.map((step, index) => {
          const status = getStepStatus(index, step)
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={step.key}>
              <StepItem
                step={step}
                index={index}
                status={status}
                variant={variant}
                size={size}
                clickable={clickable}
                onClick={() => clickable && onChange?.(index)}
                horizontal
              />
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 mx-2 mt-4',
                    size === 'sm' && 'mt-3',
                    size === 'lg' && 'mt-5'
                  )}
                >
                  <div
                    className={cn(
                      'h-px',
                      status === 'complete' ||
                        getStepStatus(index + 1, items[index + 1]) !== 'pending'
                        ? 'bg-primary'
                        : 'bg-border'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn('space-y-0', className)}>
      {items.map((step, index) => {
        const status = getStepStatus(index, step)
        const isLast = index === items.length - 1

        return (
          <StepItem
            key={step.key}
            step={step}
            index={index}
            status={status}
            variant={variant}
            size={size}
            clickable={clickable}
            onClick={() => clickable && onChange?.(index)}
            showConnector={!isLast}
          />
        )
      })}
    </div>
  )
}

// ============================================================================
// STEP ITEM
// ============================================================================

interface StepItemProps {
  step: Step
  index: number
  status: StepStatus
  variant: 'default' | 'compact' | 'numbered' | 'simple'
  size: 'sm' | 'md' | 'lg'
  clickable: boolean
  onClick: () => void
  horizontal?: boolean
  showConnector?: boolean
}

function StepItem({
  step,
  index,
  status,
  variant,
  size,
  clickable,
  onClick,
  horizontal = false,
  showConnector = false,
}: StepItemProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const connectorHeights = {
    sm: 'min-h-[24px]',
    md: 'min-h-[32px]',
    lg: 'min-h-[40px]',
  }

  const renderIcon = () => {
    if (step.icon) return step.icon

    if (status === 'complete') {
      return <Check className="w-4 h-4" />
    }
    if (status === 'active') {
      return <Loader2 className="w-4 h-4 animate-spin" />
    }
    if (status === 'error') {
      return <AlertCircle className="w-4 h-4" />
    }
    if (variant === 'numbered') {
      return <span className="text-sm font-medium">{index + 1}</span>
    }
    return <Circle className="w-3 h-3" />
  }

  const getIconClasses = () => {
    const base = cn(
      'flex items-center justify-center rounded-full shrink-0 transition-colors',
      iconSizes[size]
    )

    switch (status) {
      case 'complete':
        return cn(base, 'bg-primary text-primary-foreground')
      case 'active':
        return cn(base, 'bg-primary/10 text-primary border-2 border-primary')
      case 'error':
        return cn(
          base,
          'bg-destructive/10 text-destructive border-2 border-destructive'
        )
      case 'skipped':
        return cn(base, 'bg-muted text-muted-foreground line-through')
      default:
        return cn(base, 'bg-muted text-muted-foreground')
    }
  }

  if (variant === 'simple') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 py-2',
          clickable && 'cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2',
          horizontal && 'flex-col text-center'
        )}
        onClick={onClick}
      >
        <div className={getIconClasses()}>{renderIcon()}</div>
        <span
          className={cn(
            textSizes[size],
            status === 'active' && 'font-medium text-foreground',
            status === 'complete' && 'text-muted-foreground',
            status === 'pending' && 'text-muted-foreground',
            status === 'error' && 'text-destructive'
          )}
        >
          {step.title}
        </span>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="flex">
        <div className="flex flex-col items-center">
          <div className={getIconClasses()}>{renderIcon()}</div>
          {showConnector && (
            <div
              className={cn(
                'w-px flex-1 my-1',
                status === 'complete' ? 'bg-primary' : 'bg-border'
              )}
            />
          )}
        </div>
        <div
          className={cn('ml-3 pb-4', clickable && 'cursor-pointer')}
          onClick={onClick}
        >
          <p
            className={cn(
              'font-medium',
              textSizes[size],
              status === 'pending' && 'text-muted-foreground'
            )}
          >
            {step.title}
          </p>
        </div>
      </div>
    )
  }

  // Default variant with content support
  return (
    <div className="flex">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            getIconClasses(),
            clickable && 'cursor-pointer hover:ring-2 hover:ring-primary/20'
          )}
          onClick={onClick}
        >
          {renderIcon()}
        </div>
        {showConnector && (
          <div
            className={cn(
              'w-px flex-1 my-2',
              connectorHeights[size],
              status === 'complete' ? 'bg-primary' : 'bg-border'
            )}
          />
        )}
      </div>
      <div className={cn('ml-4 pb-6 flex-1', showConnector && 'min-h-[60px]')}>
        <div className={cn(clickable && 'cursor-pointer')} onClick={onClick}>
          <p
            className={cn(
              'font-medium',
              textSizes[size],
              status === 'pending' && 'text-muted-foreground'
            )}
          >
            {step.title}
          </p>
          {step.description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {step.description}
            </p>
          )}
        </div>
        {step.content && status === 'active' && (
          <div className="mt-3">{step.content}</div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// REASONING STEPS - Collapsible reasoning chain (like Prompt-Kit)
// ============================================================================

interface ReasoningStep {
  key: string
  title: string
  content?: React.ReactNode
  duration?: number
  status?: StepStatus
}

interface ReasoningStepsProps {
  steps: ReasoningStep[]
  title?: string
  defaultExpanded?: boolean
  showDuration?: boolean
  variant?: 'default' | 'minimal' | 'detailed'
  className?: string
}

export function ReasoningSteps({
  steps,
  title = 'Reasoning',
  defaultExpanded = false,
  showDuration = true,
  variant = 'default',
  className,
}: ReasoningStepsProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const completedSteps = steps.filter(
    (s) => s.status === 'complete' || !s.status
  ).length
  const totalDuration = steps.reduce((acc, s) => acc + (s.duration || 0), 0)

  if (variant === 'minimal') {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors',
              className
            )}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span>{title}</span>
            <span className="text-xs">
              ({completedSteps}/{steps.length} steps)
            </span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="pl-6 space-y-2">
            {steps.map((step) => (
              <div key={step.key} className="flex items-start gap-2 text-sm">
                <div className="mt-1">
                  {step.status === 'complete' || !step.status ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : step.status === 'active' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  ) : (
                    <Circle className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    step.status === 'pending' && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            'w-full flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors',
            className
          )}
        >
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span className="font-medium">{title}</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps}/{steps.length} steps
            </span>
          </div>
          {showDuration && totalDuration > 0 && (
            <span className="text-sm text-muted-foreground">
              {totalDuration < 1000
                ? `${totalDuration}ms`
                : `${(totalDuration / 1000).toFixed(1)}s`}
            </span>
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="rounded-lg border border-border bg-background p-4">
          <Steps
            items={steps.map((s) => ({
              key: s.key,
              title: s.title,
              content: s.content,
              status: s.status,
            }))}
            variant="compact"
            size="sm"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ============================================================================
// THOUGHT CHAIN - Like Ant Design X ThoughtChain
// ============================================================================

interface ThoughtItem {
  key: string
  title: string
  description?: string
  content?: React.ReactNode
  status?: 'thinking' | 'complete' | 'error'
  icon?: React.ReactNode
}

interface ThoughtChainProps {
  items: ThoughtItem[]
  title?: string
  collapsible?: boolean
  defaultExpanded?: boolean
  variant?: 'default' | 'timeline' | 'cards'
  className?: string
}

export function ThoughtChain({
  items,
  title,
  collapsible = true,
  defaultExpanded = true,
  variant = 'default',
  className,
}: ThoughtChainProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const content = (
    <div
      className={cn(
        variant === 'cards' && 'space-y-2',
        variant === 'timeline' && 'relative pl-6',
        variant === 'default' && 'space-y-3'
      )}
    >
      {/* Timeline line */}
      {variant === 'timeline' && (
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
      )}

      {items.map((item, index) => (
        <div
          key={item.key}
          className={cn(
            variant === 'cards' &&
              'p-3 rounded-lg border border-border bg-muted/30',
            variant === 'timeline' && 'relative pb-4',
            variant === 'default' && 'flex gap-3'
          )}
        >
          {/* Icon */}
          {variant === 'timeline' && (
            <div
              className={cn(
                'absolute -left-6 w-3.5 h-3.5 rounded-full border-2 bg-background',
                item.status === 'complete' && 'border-primary bg-primary',
                item.status === 'thinking' && 'border-primary',
                item.status === 'error' && 'border-destructive',
                !item.status && 'border-border'
              )}
            >
              {item.status === 'thinking' && (
                <Loader2 className="w-2 h-2 animate-spin text-primary absolute top-0.5 left-0.5" />
              )}
            </div>
          )}

          {variant === 'default' && (
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                item.status === 'complete' && 'bg-primary/10 text-primary',
                item.status === 'thinking' && 'bg-primary/10 text-primary',
                item.status === 'error' && 'bg-destructive/10 text-destructive',
                !item.status && 'bg-muted text-muted-foreground'
              )}
            >
              {item.icon ||
                (item.status === 'thinking' ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : item.status === 'complete' ? (
                  <Check className="w-3 h-3" />
                ) : item.status === 'error' ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                ))}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'font-medium text-sm',
                item.status === 'thinking' && 'text-primary'
              )}
            >
              {item.title}
            </p>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {item.description}
              </p>
            )}
            {item.content && <div className="mt-2">{item.content}</div>}
          </div>
        </div>
      ))}
    </div>
  )

  if (!collapsible) {
    return (
      <div className={className}>
        {title && <h4 className="font-medium mb-3">{title}</h4>}
        {content}
      </div>
    )
  }

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className={className}
    >
      <CollapsibleTrigger asChild>
        <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          {title || 'Thought Process'}
          <span className="text-muted-foreground font-normal">
            ({items.length} steps)
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">{content}</CollapsibleContent>
    </Collapsible>
  )
}

// ============================================================================
// TEXT SHIMMER - Loading text effect (like Prompt-Kit)
// ============================================================================

interface TextShimmerProps {
  children: React.ReactNode
  duration?: number
  className?: string
}

export function TextShimmer({
  children,
  duration = 2,
  className,
}: TextShimmerProps) {
  return (
    <span
      className={cn(
        'inline-block bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent',
        'animate-shimmer bg-[length:200%_100%]',
        className
      )}
      style={{
        animationDuration: `${duration}s`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer linear infinite;
        }
      `}</style>
    </span>
  )
}

// ============================================================================
// LOADER - Animated loading indicator (like Prompt-Kit)
// ============================================================================

interface LoaderProps {
  variant?: 'dots' | 'spinner' | 'pulse' | 'bars'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Loader({
  variant = 'dots',
  size = 'md',
  className,
}: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
  }

  if (variant === 'spinner') {
    return (
      <Loader2
        className={cn(
          'animate-spin text-primary',
          size === 'sm' && 'w-4 h-4',
          size === 'md' && 'w-6 h-6',
          size === 'lg' && 'w-8 h-8',
          className
        )}
      />
    )
  }

  if (variant === 'pulse') {
    return (
      <div
        className={cn(
          'rounded-full bg-primary animate-pulse',
          size === 'sm' && 'w-2 h-2',
          size === 'md' && 'w-3 h-3',
          size === 'lg' && 'w-4 h-4',
          className
        )}
      />
    )
  }

  if (variant === 'bars') {
    const barSizes = {
      sm: 'w-0.5 h-3',
      md: 'w-1 h-5',
      lg: 'w-1.5 h-7',
    }

    return (
      <div
        className={cn('flex items-center gap-1', sizeClasses[size], className)}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              'bg-primary rounded-full animate-bounce',
              barSizes[size]
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    )
  }

  // Default: dots
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }

  return (
    <div
      className={cn('flex items-center gap-1', sizeClasses[size], className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            'rounded-full bg-current animate-bounce',
            dotSizes[size]
          )}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  Step,
  StepsProps,
  StepStatus,
  ReasoningStep,
  ReasoningStepsProps,
  ThoughtItem,
  ThoughtChainProps,
  TextShimmerProps,
  LoaderProps,
}
