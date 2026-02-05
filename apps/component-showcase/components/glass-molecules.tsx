import React from 'react'
import { cn } from '@clarity-chat/primitives'
import { LucideIcon } from 'lucide-react'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface GlassMessageBubbleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'user' | 'assistant' | 'system'
  avatar?: React.ReactNode
  actions?: React.ReactNode
  timestamp?: React.ReactNode
  status?: React.ReactNode
}

export interface GlassToolCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  status?: 'idle' | 'running' | 'completed' | 'error'
  duration?: string
  badge?: React.ReactNode
}

export interface GlassStatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  icon?: LucideIcon
}

export interface GlassActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'subtle' | 'strong' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  glow?: boolean
}

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'strong'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  glow?: boolean
  gradient?: boolean
}

export interface GlassInputContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'strong'
  focused?: boolean
  error?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  actions?: React.ReactNode
}

// ============================================================================
// GLASS MESSAGE BUBBLE
// Message container with glass effect for chat messages
// ============================================================================

export const GlassMessageBubble = React.forwardRef<
  HTMLDivElement,
  GlassMessageBubbleProps
>(
  (
    {
      variant = 'assistant',
      avatar,
      actions,
      timestamp,
      status,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isUser = variant === 'user'

    return (
      <div
        ref={ref}
        className={cn('flex gap-3', isUser && 'flex-row-reverse', className)}
        {...props}
      >
        {avatar && <div className="shrink-0">{avatar}</div>}
        <div
          className={cn(
            'flex-1 space-y-2',
            isUser && 'flex flex-col items-end'
          )}
        >
          <div
            className={cn(
              'rounded-2xl px-4 py-3 max-w-[85%]',
              'transition-all duration-200',
              variant === 'assistant' &&
                'glass-subtle hover:glass shadow-sm hover:shadow-md',
              variant === 'user' &&
                'bg-primary/90 text-primary-foreground backdrop-blur-xl',
              variant === 'system' &&
                'glass-panel border-dashed text-muted-foreground'
            )}
          >
            {children}
          </div>

          {(timestamp || status || actions) && (
            <div
              className={cn(
                'flex items-center gap-2 text-xs',
                isUser && 'flex-row-reverse'
              )}
            >
              {timestamp}
              {status}
            </div>
          )}

          {actions && (
            <div
              className={cn('flex items-center gap-1', isUser && 'justify-end')}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    )
  }
)

GlassMessageBubble.displayName = 'GlassMessageBubble'

// ============================================================================
// GLASS TOOL CARD
// Tool display card with status indicators
// ============================================================================

export const GlassToolCard = React.forwardRef<
  HTMLDivElement,
  GlassToolCardProps
>(
  (
    {
      icon: Icon,
      title,
      description,
      status = 'idle',
      duration,
      badge,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg',
          'glass-panel hover:glass transition-all duration-200',
          'border group cursor-pointer',
          status === 'running' &&
            'border-yellow-500/30 bg-yellow-500/5 animate-pulse-subtle',
          status === 'completed' &&
            'border-green-500/30 bg-green-500/5 hover:border-green-500/50',
          status === 'error' &&
            'border-red-500/30 bg-red-500/5 hover:border-red-500/50',
          className
        )}
        {...props}
      >
        {Icon && (
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
              'backdrop-blur-sm transition-all duration-200',
              status === 'idle' && 'bg-primary/10 text-primary',
              status === 'running' && 'bg-yellow-500/20 text-yellow-600',
              status === 'completed' && 'bg-green-500/20 text-green-600',
              status === 'error' && 'bg-red-500/20 text-red-600',
              'group-hover:scale-110'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm font-mono truncate">{title}</p>
            {badge}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>

        {duration && (
          <span className="text-xs text-muted-foreground font-mono shrink-0">
            {duration}
          </span>
        )}
      </div>
    )
  }
)

GlassToolCard.displayName = 'GlassToolCard'

// ============================================================================
// GLASS STATUS BADGE
// Status indicators with glass effect
// ============================================================================

export const GlassStatusBadge = React.forwardRef<
  HTMLDivElement,
  GlassStatusBadgeProps
>(
  (
    {
      variant = 'default',
      size = 'md',
      pulse = false,
      icon: Icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          'backdrop-blur-sm border transition-all duration-200',
          // Sizes
          size === 'sm' && 'px-2 py-0.5 text-xs',
          size === 'md' && 'px-3 py-1 text-sm',
          size === 'lg' && 'px-4 py-1.5 text-base',
          // Variants
          variant === 'default' &&
            'bg-white/10 border-white/20 text-foreground',
          variant === 'success' &&
            'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400',
          variant === 'warning' &&
            'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400',
          variant === 'error' &&
            'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400',
          variant === 'info' &&
            'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
          // Pulse animation
          pulse && 'animate-pulse-subtle',
          className
        )}
        {...props}
      >
        {Icon && (
          <Icon
            className={cn(
              size === 'sm' && 'h-3 w-3',
              size === 'md' && 'h-3.5 w-3.5',
              size === 'lg' && 'h-4 w-4'
            )}
          />
        )}
        {children}
      </div>
    )
  }
)

GlassStatusBadge.displayName = 'GlassStatusBadge'

// ============================================================================
// GLASS ACTION BUTTON
// Interactive buttons with glass effect
// ============================================================================

export const GlassActionButton = React.forwardRef<
  HTMLButtonElement,
  GlassActionButtonProps
>(
  (
    {
      variant = 'default',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      glow = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          // Sizes
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'md' && 'px-4 py-2 text-sm',
          size === 'lg' && 'px-6 py-3 text-base',
          // Variants
          variant === 'default' &&
            'glass hover:glass-strong border active:scale-95',
          variant === 'subtle' &&
            'glass-subtle hover:glass border active:scale-95',
          variant === 'strong' &&
            'glass-strong hover:bg-white/90 dark:hover:bg-white/15 border active:scale-95',
          variant === 'ghost' &&
            'hover:glass-subtle active:scale-95',
          // Glow effect
          glow && 'glow-sm hover:glow',
          className
        )}
        {...props}
      >
        {Icon && iconPosition === 'left' && (
          <Icon
            className={cn(
              size === 'sm' && 'h-3.5 w-3.5',
              size === 'md' && 'h-4 w-4',
              size === 'lg' && 'h-5 w-5'
            )}
          />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon
            className={cn(
              size === 'sm' && 'h-3.5 w-3.5',
              size === 'md' && 'h-4 w-4',
              size === 'lg' && 'h-5 w-5'
            )}
          />
        )}
      </button>
    )
  }
)

GlassActionButton.displayName = 'GlassActionButton'

// ============================================================================
// GLASS PANEL
// Content sections with glass effect
// ============================================================================

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      border = true,
      shadow = 'md',
      glow = false,
      gradient = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-200',
          // Variants
          variant === 'default' && 'glass',
          variant === 'subtle' && 'glass-subtle',
          variant === 'strong' && 'glass-strong',
          // Padding
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-3',
          padding === 'md' && 'p-4',
          padding === 'lg' && 'p-6',
          // Border
          border && 'border',
          // Shadow
          shadow === 'none' && 'shadow-none',
          shadow === 'sm' && 'shadow-sm shadow-black/5',
          shadow === 'md' && 'shadow-md shadow-black/5 dark:shadow-black/20',
          shadow === 'lg' && 'shadow-lg shadow-black/10 dark:shadow-black/30',
          // Effects
          glow && 'glow',
          gradient && 'gradient-subtle',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'

// ============================================================================
// GLASS INPUT CONTAINER
// Input wrappers with glass effect
// ============================================================================

export const GlassInputContainer = React.forwardRef<
  HTMLDivElement,
  GlassInputContainerProps
>(
  (
    {
      variant = 'default',
      focused = false,
      error = false,
      icon,
      iconPosition = 'left',
      actions,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 rounded-xl transition-all duration-200',
          'border backdrop-blur-xl',
          // Variants
          variant === 'default' && 'glass',
          variant === 'subtle' && 'glass-subtle',
          variant === 'strong' && 'glass-strong',
          // States
          focused && 'ring-2 ring-primary ring-offset-2',
          error && 'border-red-500/50 ring-2 ring-red-500/20',
          !focused && !error && 'hover:border-primary/30',
          className
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <div className="pl-3 shrink-0 text-muted-foreground">{icon}</div>
        )}

        <div className="flex-1 min-w-0">{children}</div>

        {icon && iconPosition === 'right' && (
          <div className="pr-3 shrink-0 text-muted-foreground">{icon}</div>
        )}

        {actions && <div className="pr-2 shrink-0 flex gap-1">{actions}</div>}
      </div>
    )
  }
)

GlassInputContainer.displayName = 'GlassInputContainer'

// ============================================================================
// COMPOSITE COMPONENTS (Convenience wrappers)
// ============================================================================

interface GlassCardProps extends GlassPanelProps {
  header?: React.ReactNode
  footer?: React.ReactNode
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ header, footer, children, className, ...props }, ref) => {
    return (
      <GlassPanel
        ref={ref}
        padding="none"
        className={cn('overflow-hidden', className)}
        {...props}
      >
        {header && (
          <div className="px-6 py-4 border-b border-white/10">{header}</div>
        )}
        <div className="p-6">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-white/10 bg-white/5">
            {footer}
          </div>
        )}
      </GlassPanel>
    )
  }
)

GlassCard.displayName = 'GlassCard'

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

interface GlassDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'gradient'
}

export const GlassDivider = React.forwardRef<
  HTMLDivElement,
  GlassDividerProps
>(({ orientation = 'horizontal', variant = 'solid', className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        orientation === 'horizontal' && 'h-px w-full',
        orientation === 'vertical' && 'w-px h-full',
        variant === 'solid' && 'bg-white/10',
        variant === 'gradient' && 'section-divider',
        className
      )}
    />
  )
})

GlassDivider.displayName = 'GlassDivider'

interface GlassIconContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
}

export const GlassIconContainer = React.forwardRef<
  HTMLDivElement,
  GlassIconContainerProps
>(({ icon: Icon, size = 'md', variant = 'primary', className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl flex items-center justify-center backdrop-blur-sm',
        'transition-all duration-200',
        // Sizes
        size === 'sm' && 'w-8 h-8',
        size === 'md' && 'w-10 h-10',
        size === 'lg' && 'w-12 h-12',
        // Variants
        variant === 'primary' &&
          'bg-primary/10 text-primary border border-primary/20',
        variant === 'success' &&
          'bg-green-500/10 text-green-600 border border-green-500/20',
        variant === 'warning' &&
          'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
        variant === 'error' &&
          'bg-red-500/10 text-red-600 border border-red-500/20',
        variant === 'info' &&
          'bg-blue-500/10 text-blue-600 border border-blue-500/20',
        className
      )}
    >
      <Icon
        className={cn(
          size === 'sm' && 'h-4 w-4',
          size === 'md' && 'h-5 w-5',
          size === 'lg' && 'h-6 w-6'
        )}
      />
    </div>
  )
})

GlassIconContainer.displayName = 'GlassIconContainer'

// ============================================================================
// MESSAGE COMPONENT MOLECULES
// Reusable components for building message UI
// ============================================================================

// Type Definitions for Message Components
export interface GlassMessageContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'user' | 'assistant' | 'system'
  isGrouped?: boolean
  isFirst?: boolean
  isLast?: boolean
}

export interface GlassMessageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  avatar?: React.ReactNode
  timestamp?: string | React.ReactNode
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
  variant?: 'user' | 'assistant' | 'system'
}

export interface GlassMessageContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'code' | 'rich'
  markdown?: boolean
  streaming?: boolean
}

export interface GlassMessageFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  reactions?: Array<{ emoji: string; count: number; active?: boolean }>
  readReceipts?: Array<{ name: string; avatar?: string }>
  onReactionClick?: (emoji: string) => void
}

export interface GlassMessageActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  actions?: Array<{
    icon: LucideIcon
    label: string
    onClick?: () => void
    variant?: 'default' | 'success' | 'warning' | 'danger'
  }>
  visible?: boolean
  position?: 'top' | 'bottom'
}

export interface GlassThreadIndicatorProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  count: number
  lastReplyTime?: string
  onClick?: () => void
  variant?: 'compact' | 'expanded'
}

export interface GlassTypingDotsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'dots' | 'pulse' | 'wave'
  size?: 'sm' | 'md' | 'lg'
  userName?: string
  showAvatar?: boolean
  avatar?: React.ReactNode
}

// ----------------------------------------------------------------------------
// GLASS MESSAGE CONTAINER
// Wrapper with proper spacing for message groups
// ----------------------------------------------------------------------------

export const GlassMessageContainer = React.forwardRef<
  HTMLDivElement,
  GlassMessageContainerProps
>(
  (
    {
      variant = 'assistant',
      isGrouped = false,
      isFirst = false,
      isLast = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isUser = variant === 'user'

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-3 transition-all duration-200',
          isUser && 'flex-row-reverse',
          // Spacing for grouped messages
          isGrouped && !isFirst && 'mt-0.5',
          !isGrouped && 'mt-4 first:mt-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassMessageContainer.displayName = 'GlassMessageContainer'

// ----------------------------------------------------------------------------
// GLASS MESSAGE HEADER
// Name, timestamp, and status indicator
// ----------------------------------------------------------------------------

export const GlassMessageHeader = React.forwardRef<
  HTMLDivElement,
  GlassMessageHeaderProps
>(
  (
    {
      name,
      avatar,
      timestamp,
      status,
      variant = 'assistant',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isUser = variant === 'user'

    const statusIcon = {
      sending: 'opacity-50',
      sent: '✓',
      delivered: '✓✓',
      read: '✓✓',
      error: '✕',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 mb-1',
          isUser && 'flex-row-reverse',
          className
        )}
        {...props}
      >
        {avatar && <div className="shrink-0">{avatar}</div>}

        {name && (
          <span className="text-sm font-medium text-foreground">{name}</span>
        )}

        {timestamp && (
          <span className="text-xs text-muted-foreground">
            {typeof timestamp === 'string' ? timestamp : timestamp}
          </span>
        )}

        {status && (
          <span
            className={cn(
              'text-xs',
              status === 'read' && 'text-blue-500',
              status === 'delivered' && 'text-muted-foreground',
              status === 'sent' && 'text-muted-foreground',
              status === 'sending' && 'text-muted-foreground animate-pulse',
              status === 'error' && 'text-red-500'
            )}
          >
            {statusIcon[status]}
          </span>
        )}

        {children}
      </div>
    )
  }
)

GlassMessageHeader.displayName = 'GlassMessageHeader'

// ----------------------------------------------------------------------------
// GLASS MESSAGE CONTENT
// Message body with optional markdown support
// ----------------------------------------------------------------------------

export const GlassMessageContent = React.forwardRef<
  HTMLDivElement,
  GlassMessageContentProps
>(
  (
    {
      variant = 'default',
      markdown = false,
      streaming = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl px-4 py-3 transition-all duration-200',
          'text-sm leading-relaxed',
          // Variants
          variant === 'default' && 'glass-subtle hover:glass',
          variant === 'code' &&
            'glass-panel border font-mono text-xs overflow-x-auto',
          variant === 'rich' && 'glass space-y-3',
          // Streaming state
          streaming && 'animate-pulse-subtle',
          className
        )}
        {...props}
      >
        {children}
        {streaming && (
          <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse" />
        )}
      </div>
    )
  }
)

GlassMessageContent.displayName = 'GlassMessageContent'

// ----------------------------------------------------------------------------
// GLASS MESSAGE FOOTER
// Reactions and read receipts
// ----------------------------------------------------------------------------

export const GlassMessageFooter = React.forwardRef<
  HTMLDivElement,
  GlassMessageFooterProps
>(
  (
    { reactions, readReceipts, onReactionClick, className, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 mt-1 flex-wrap',
          className
        )}
        {...props}
      >
        {/* Reactions */}
        {reactions && reactions.length > 0 && (
          <div className="flex items-center gap-1">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => onReactionClick?.(reaction.emoji)}
                className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
                  'glass-subtle hover:glass transition-all duration-200',
                  'border hover:scale-105 active:scale-95',
                  reaction.active && 'border-primary bg-primary/10'
                )}
              >
                <span>{reaction.emoji}</span>
                {reaction.count > 1 && (
                  <span className="text-muted-foreground font-medium">
                    {reaction.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Read Receipts */}
        {readReceipts && readReceipts.length > 0 && (
          <div className="flex items-center -space-x-2">
            {readReceipts.slice(0, 3).map((receipt, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full glass border-2 border-background flex items-center justify-center text-[10px] font-medium"
                title={receipt.name}
              >
                {receipt.avatar || receipt.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {readReceipts.length > 3 && (
              <div className="w-5 h-5 rounded-full glass border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                +{readReceipts.length - 3}
              </div>
            )}
          </div>
        )}

        {children}
      </div>
    )
  }
)

GlassMessageFooter.displayName = 'GlassMessageFooter'

// ----------------------------------------------------------------------------
// GLASS MESSAGE ACTIONS
// Hover actions bar
// ----------------------------------------------------------------------------

export const GlassMessageActions = React.forwardRef<
  HTMLDivElement,
  GlassMessageActionsProps
>(
  (
    {
      actions,
      visible = true,
      position = 'top',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute flex items-center gap-1 p-1 rounded-lg',
          'glass border shadow-lg',
          'transition-all duration-200',
          // Position
          position === 'top' && 'top-0 right-0 -translate-y-1/2',
          position === 'bottom' && 'bottom-0 right-0 translate-y-1/2',
          // Visibility
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
          className
        )}
        {...props}
      >
        {actions?.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              onClick={action.onClick}
              title={action.label}
              className={cn(
                'p-1.5 rounded-md transition-all duration-200',
                'hover:glass-strong active:scale-95',
                action.variant === 'success' && 'hover:text-green-600',
                action.variant === 'warning' && 'hover:text-yellow-600',
                action.variant === 'danger' && 'hover:text-red-600'
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
        {children}
      </div>
    )
  }
)

GlassMessageActions.displayName = 'GlassMessageActions'

// ----------------------------------------------------------------------------
// GLASS THREAD INDICATOR
// Reply count badge
// ----------------------------------------------------------------------------

export const GlassThreadIndicator = React.forwardRef<
  HTMLButtonElement,
  GlassThreadIndicatorProps
>(
  (
    {
      count,
      lastReplyTime,
      onClick,
      variant = 'compact',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          'flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg',
          'glass-subtle hover:glass border transition-all duration-200',
          'hover:scale-102 active:scale-98 group',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-1.5 text-primary">
          <div className="w-0.5 h-4 rounded-full bg-primary" />
          <span className="text-xs font-medium">
            {count} {count === 1 ? 'reply' : 'replies'}
          </span>
        </div>

        {variant === 'expanded' && lastReplyTime && (
          <span className="text-xs text-muted-foreground">
            Last reply {lastReplyTime}
          </span>
        )}

        {children}
      </button>
    )
  }
)

GlassThreadIndicator.displayName = 'GlassThreadIndicator'

// ----------------------------------------------------------------------------
// GLASS TYPING DOTS
// Animated typing indicator
// ----------------------------------------------------------------------------

export const GlassTypingDots = React.forwardRef<
  HTMLDivElement,
  GlassTypingDotsProps
>(
  (
    {
      variant = 'dots',
      size = 'md',
      userName,
      showAvatar = false,
      avatar,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const dotSizes = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    }

    const containerPadding = {
      sm: 'px-2.5 py-1.5',
      md: 'px-3 py-2',
      lg: 'px-3.5 py-2.5',
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-3', className)}
        {...props}
      >
        {showAvatar && avatar && <div className="shrink-0">{avatar}</div>}

        <div
          className={cn(
            'glass-subtle rounded-lg rounded-tl-none',
            containerPadding[size]
          )}
        >
          {userName && (
            <span className="text-xs text-muted-foreground mb-1 block">
              {userName} is typing
            </span>
          )}

          {variant === 'dots' && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  dotSizes[size],
                  'bg-muted-foreground rounded-full animate-bounce'
                )}
                style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
              />
              <span
                className={cn(
                  dotSizes[size],
                  'bg-muted-foreground rounded-full animate-bounce'
                )}
                style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
              />
              <span
                className={cn(
                  dotSizes[size],
                  'bg-muted-foreground rounded-full animate-bounce'
                )}
                style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
              />
            </div>
          )}

          {variant === 'pulse' && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  dotSizes[size],
                  'bg-primary rounded-full animate-pulse'
                )}
              />
              <span
                className={cn(
                  dotSizes[size],
                  'bg-primary/60 rounded-full animate-pulse'
                )}
                style={{ animationDelay: '150ms' }}
              />
              <span
                className={cn(
                  dotSizes[size],
                  'bg-primary/30 rounded-full animate-pulse'
                )}
                style={{ animationDelay: '300ms' }}
              />
            </div>
          )}

          {variant === 'wave' && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'w-0.5 rounded-full bg-primary transition-all',
                  size === 'sm' && 'h-2',
                  size === 'md' && 'h-3',
                  size === 'lg' && 'h-4'
                )}
                style={{
                  animation: 'wave 1.2s ease-in-out infinite',
                  animationDelay: '0ms',
                }}
              />
              <span
                className={cn(
                  'w-0.5 rounded-full bg-primary transition-all',
                  size === 'sm' && 'h-2',
                  size === 'md' && 'h-3',
                  size === 'lg' && 'h-4'
                )}
                style={{
                  animation: 'wave 1.2s ease-in-out infinite',
                  animationDelay: '150ms',
                }}
              />
              <span
                className={cn(
                  'w-0.5 rounded-full bg-primary transition-all',
                  size === 'sm' && 'h-2',
                  size === 'md' && 'h-3',
                  size === 'lg' && 'h-4'
                )}
                style={{
                  animation: 'wave 1.2s ease-in-out infinite',
                  animationDelay: '300ms',
                }}
              />
            </div>
          )}

          {children}
        </div>
      </div>
    )
  }
)

GlassTypingDots.displayName = 'GlassTypingDots'
