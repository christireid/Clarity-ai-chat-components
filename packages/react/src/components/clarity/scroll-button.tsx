'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { ChevronDown, ChevronUp, ArrowDown, ChevronsDown } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface ScrollButtonProps {
  /** Reference to the scrollable container */
  containerRef?: React.RefObject<HTMLElement>
  /** Custom scroll target element */
  targetRef?: React.RefObject<HTMLElement>
  /** Direction to scroll */
  direction?: 'up' | 'down'
  /** Show button only when scrolled away */
  autoHide?: boolean
  /** Threshold in pixels to show/hide button */
  threshold?: number
  /** Number of unread items (shows badge) */
  unreadCount?: number
  /** Custom onClick handler */
  onClick?: () => void
  /** Scroll behavior */
  behavior?: ScrollBehavior
  /** Visual variant */
  variant?: 'default' | 'pill' | 'minimal' | 'floating'
  /** Size */
  size?: 'sm' | 'md' | 'lg'
  /** Position when used as floating */
  position?: 'left' | 'center' | 'right'
  /** Offset from bottom/top edge */
  offset?: number
  /** Custom icon */
  icon?: React.ReactNode
  /** Custom label */
  label?: string
  /** Show label */
  showLabel?: boolean
  /** Additional class name */
  className?: string
}

// ============================================================================
// SCROLL BUTTON
// ============================================================================

export function ScrollButton({
  containerRef,
  targetRef,
  direction = 'down',
  autoHide = true,
  threshold = 100,
  unreadCount,
  onClick,
  behavior = 'smooth',
  variant = 'default',
  size = 'md',
  position = 'center',
  offset = 16,
  icon,
  label,
  showLabel = false,
  className,
}: ScrollButtonProps) {
  const [isVisible, setIsVisible] = React.useState(!autoHide)
  const [isAtEnd, setIsAtEnd] = React.useState(false)

  // Check scroll position
  React.useEffect(() => {
    if (!autoHide) return

    const container = containerRef?.current || document.documentElement

    const handleScroll = () => {
      if (direction === 'down') {
        const scrollBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight
        setIsAtEnd(scrollBottom < 10)
        setIsVisible(scrollBottom > threshold)
      } else {
        const scrollTop = container.scrollTop
        setIsAtEnd(scrollTop < 10)
        setIsVisible(scrollTop > threshold)
      }
    }

    const scrollTarget = containerRef?.current || window
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => scrollTarget.removeEventListener('scroll', handleScroll)
  }, [autoHide, threshold, direction, containerRef])

  const handleClick = () => {
    if (onClick) {
      onClick()
      return
    }

    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior })
      return
    }

    const container = containerRef?.current || document.documentElement
    if (direction === 'down') {
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      })
    } else {
      container.scrollTo({
        top: 0,
        behavior,
      })
    }
  }

  // Don't render if at end or not visible
  if (autoHide && (!isVisible || isAtEnd)) {
    return null
  }

  const sizeClasses = {
    sm: 'h-7 px-2 text-xs',
    md: 'h-9 px-3 text-sm',
    lg: 'h-11 px-4 text-base',
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const positionClasses = {
    left: 'left-4',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-4',
  }

  const defaultIcon =
    direction === 'down' ? (
      variant === 'minimal' ? (
        <ChevronsDown className={iconSizes[size]} />
      ) : (
        <ChevronDown className={iconSizes[size]} />
      )
    ) : (
      <ChevronUp className={iconSizes[size]} />
    )

  const buttonContent = (
    <>
      {icon || defaultIcon}
      {showLabel && label && <span className="ml-1">{label}</span>}
      {unreadCount && unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="ml-1.5 h-5 min-w-5 px-1.5 text-xs"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </>
  )

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-1 transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    sizeClasses[size]
  )

  if (variant === 'floating') {
    return (
      <div
        className={cn(
          'absolute z-10',
          positionClasses[position],
          direction === 'down' ? `bottom-${offset}` : `top-${offset}`,
          className
        )}
        style={{
          [direction === 'down' ? 'bottom' : 'top']: `${offset}px`,
        }}
      >
        <Button
          onClick={handleClick}
          variant="secondary"
          className={cn(
            baseClasses,
            'rounded-full shadow-lg hover:shadow-xl',
            'bg-background/95 backdrop-blur-sm border border-border'
          )}
        >
          {buttonContent}
        </Button>
      </div>
    )
  }

  if (variant === 'pill') {
    return (
      <Button
        onClick={handleClick}
        variant="secondary"
        className={cn(baseClasses, 'rounded-full', className)}
      >
        {buttonContent}
      </Button>
    )
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center',
          'text-muted-foreground hover:text-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded',
          className
        )}
      >
        {buttonContent}
      </button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
      className={cn(baseClasses, className)}
    >
      {buttonContent}
    </Button>
  )
}

// ============================================================================
// SCROLL TO BOTTOM - Specialized variant for chat
// ============================================================================

export interface ScrollToBottomProps {
  containerRef?: React.RefObject<HTMLElement>
  unreadCount?: number
  onClick?: () => void
  className?: string
  alwaysShow?: boolean
}

export function ScrollToBottom({
  containerRef,
  unreadCount,
  onClick,
  className,
  alwaysShow = false,
}: ScrollToBottomProps) {
  return (
    <ScrollButton
      containerRef={containerRef}
      direction="down"
      autoHide={!alwaysShow}
      unreadCount={unreadCount}
      onClick={onClick}
      variant="floating"
      position="center"
      icon={<ArrowDown className="w-4 h-4" />}
      className={className}
    />
  )
}

// ============================================================================
// NEW MESSAGES INDICATOR
// ============================================================================

export interface NewMessagesIndicatorProps {
  count: number
  onClick?: () => void
  className?: string
}

export function NewMessagesIndicator({
  count,
  onClick,
  className,
}: NewMessagesIndicatorProps) {
  if (count <= 0) return null

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'bg-primary text-primary-foreground text-sm font-medium',
        'shadow-lg hover:bg-primary/90 transition-colors',
        'animate-in fade-in slide-in-from-bottom-2 duration-200',
        className
      )}
    >
      <ArrowDown className="w-3.5 h-3.5" />
      {count} new message{count > 1 ? 's' : ''}
    </button>
  )
}

// ============================================================================
// SCROLL PROGRESS INDICATOR
// ============================================================================

export interface ScrollProgressProps {
  containerRef?: React.RefObject<HTMLElement>
  position?: 'top' | 'bottom'
  height?: number
  color?: string
  className?: string
}

export function ScrollProgress({
  containerRef,
  position = 'top',
  height = 3,
  color,
  className,
}: ScrollProgressProps) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const container = containerRef?.current || document.documentElement

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight - container.clientHeight
      const newProgress =
        scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      setProgress(newProgress)
    }

    const scrollTarget = containerRef?.current || window
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => scrollTarget.removeEventListener('scroll', handleScroll)
  }, [containerRef])

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-50',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height }}
    >
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: color || 'hsl(var(--primary))',
        }}
      />
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ScrollButton
