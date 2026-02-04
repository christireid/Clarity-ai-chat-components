'use client'
// @ts-nocheck
// TODO: Fix DateTimeFormatOptions type

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Clock, Calendar, Timer, RefreshCw } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'

// Utility functions
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 5) return 'just now'
  if (diffSec < 60) return `${diffSec}s ago`
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  if (diffWeek < 4) return `${diffWeek}w ago`
  if (diffMonth < 12) return `${diffMonth}mo ago`
  return `${diffYear}y ago`
}

function formatAbsoluteTime(
  date: Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric' },
    medium: {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
    long: {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
  }[format]

  return date.toLocaleDateString('en-US', options)
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return sec > 0 ? `${min}m ${sec}s` : `${min}m`
  }
  const hours = Math.floor(seconds / 3600)
  const min = Math.floor((seconds % 3600) / 60)
  return min > 0 ? `${hours}h ${min}m` : `${hours}h`
}

// Timestamp Component
export interface TimestampProps {
  date: Date | string | number
  format?: 'relative' | 'absolute' | 'auto'
  absoluteFormat?: 'short' | 'medium' | 'long'
  showIcon?: boolean
  showTooltip?: boolean
  live?: boolean
  liveInterval?: number
  className?: string
}

export function Timestamp({
  date,
  format = 'auto',
  absoluteFormat = 'medium',
  showIcon = false,
  showTooltip = true,
  live = false,
  liveInterval = 60000,
  className,
}: TimestampProps) {
  const dateObj = React.useMemo(
    () => (date instanceof Date ? date : new Date(date)),
    [date]
  )

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    if (!live) return
    const interval = setInterval(forceUpdate, liveInterval)
    return () => clearInterval(interval)
  }, [live, liveInterval])

  const displayText = React.useMemo(() => {
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (format === 'relative') {
      return formatRelativeTime(dateObj)
    }
    if (format === 'absolute') {
      return formatAbsoluteTime(dateObj, absoluteFormat)
    }
    // Auto: relative for recent, absolute for older
    return diffHours < 24
      ? formatRelativeTime(dateObj)
      : formatAbsoluteTime(dateObj, absoluteFormat)
  }, [dateObj, format, absoluteFormat])

  const tooltipText = formatAbsoluteTime(dateObj, 'long')

  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-muted-foreground',
        className
      )}
    >
      {showIcon && <Clock className="h-3.5 w-3.5" />}
      <time dateTime={dateObj.toISOString()}>{displayText}</time>
    </span>
  )

  if (!showTooltip) return content

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Duration Display
export interface DurationDisplayProps {
  seconds: number
  showIcon?: boolean
  variant?: 'default' | 'compact' | 'verbose'
  className?: string
}

export function DurationDisplay({
  seconds,
  showIcon = false,
  variant = 'default',
  className,
}: DurationDisplayProps) {
  const display = React.useMemo(() => {
    if (variant === 'compact') {
      if (seconds < 60) return `${seconds}s`
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
      return `${Math.floor(seconds / 3600)}h`
    }
    if (variant === 'verbose') {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      const parts = []
      if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
      if (minutes > 0)
        parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
      if (secs > 0 || parts.length === 0)
        parts.push(`${secs} second${secs !== 1 ? 's' : ''}`)
      return parts.join(', ')
    }
    return formatDuration(seconds)
  }, [seconds, variant])

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {showIcon && <Timer className="h-3.5 w-3.5" />}
      <span>{display}</span>
    </span>
  )
}

// Live Timer
export interface LiveTimerProps {
  startTime?: Date
  endTime?: Date
  direction?: 'up' | 'down'
  onComplete?: () => void
  className?: string
}

export function LiveTimer({
  startTime,
  endTime,
  direction = 'up',
  onComplete,
  className,
}: LiveTimerProps) {
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    const start = startTime || new Date()

    const updateTimer = () => {
      const now = new Date()
      if (direction === 'up') {
        setElapsed(Math.floor((now.getTime() - start.getTime()) / 1000))
      } else if (endTime) {
        const remaining = Math.max(
          0,
          Math.floor((endTime.getTime() - now.getTime()) / 1000)
        )
        setElapsed(remaining)
        if (remaining === 0) {
          onComplete?.()
        }
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [startTime, endTime, direction, onComplete])

  const hours = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60

  return (
    <span className={cn('font-mono tabular-nums', className)}>
      {hours > 0 && <span>{String(hours).padStart(2, '0')}:</span>}
      <span>{String(minutes).padStart(2, '0')}</span>
      <span>:</span>
      <span>{String(seconds).padStart(2, '0')}</span>
    </span>
  )
}

// Date Range Display
export interface DateRangeDisplayProps {
  start: Date | string | number
  end: Date | string | number
  showIcon?: boolean
  className?: string
}

export function DateRangeDisplay({
  start,
  end,
  showIcon = false,
  className,
}: DateRangeDisplayProps) {
  const startDate = start instanceof Date ? start : new Date(start)
  const endDate = end instanceof Date ? end : new Date(end)

  const sameYear = startDate.getFullYear() === endDate.getFullYear()
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth()
  const sameDay = sameMonth && startDate.getDate() === endDate.getDate()

  let display: string
  if (sameDay) {
    display = formatAbsoluteTime(startDate, 'medium')
  } else if (sameMonth) {
    display = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.getDate()}`
  } else if (sameYear) {
    display = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  } else {
    display = `${formatAbsoluteTime(startDate, 'short')} - ${formatAbsoluteTime(endDate, 'short')}`
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {showIcon && <Calendar className="h-3.5 w-3.5" />}
      <span>{display}</span>
    </span>
  )
}

// Last Updated Display
export interface LastUpdatedProps {
  date: Date | string | number
  label?: string
  onRefresh?: () => void
  isRefreshing?: boolean
  className?: string
}

export function LastUpdated({
  date,
  label = 'Last updated',
  onRefresh,
  isRefreshing = false,
  className,
}: LastUpdatedProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        className
      )}
    >
      <span>{label}</span>
      <Timestamp date={date} format="relative" live />
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')}
          />
        </button>
      )}
    </div>
  )
}

// Message Timestamp (chat-specific)
export interface MessageTimestampProps {
  date: Date | string | number
  edited?: boolean
  className?: string
}

export function MessageTimestamp({
  date,
  edited = false,
  className,
}: MessageTimestampProps) {
  const dateObj = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const isToday = dateObj.toDateString() === now.toDateString()

  const timeStr = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const display = isToday
    ? timeStr
    : `${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${timeStr}`

  return (
    <span className={cn('text-xs text-muted-foreground', className)}>
      {display}
      {edited && <span className="ml-1">(edited)</span>}
    </span>
  )
}
