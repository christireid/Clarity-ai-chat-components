'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Info,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react'

// Simple tooltip
interface SimpleTooltipProps {
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  children: React.ReactNode
}

export function SimpleTooltip({
  content,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  children,
}: SimpleTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Info tooltip with icon
interface InfoTooltipProps {
  content: React.ReactNode
  variant?: 'info' | 'help' | 'warning' | 'success' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function InfoTooltip({
  content,
  variant = 'info',
  size = 'md',
  className,
}: InfoTooltipProps) {
  const icons = {
    info: Info,
    help: HelpCircle,
    warning: AlertCircle,
    success: CheckCircle,
    error: XCircle,
  }

  const colors = {
    info: 'text-blue-500',
    help: 'text-muted-foreground',
    warning: 'text-amber-500',
    success: 'text-emerald-500',
    error: 'text-red-500',
  }

  const sizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const Icon = icons[variant]

  return (
    <SimpleTooltip content={content}>
      <Icon
        className={cn(sizes[size], colors[variant], 'cursor-help', className)}
      />
    </SimpleTooltip>
  )
}

// Rich hover card with detailed content
interface RichTooltipProps {
  title: string
  description?: string
  metadata?: { label: string; value: string }[]
  actions?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline'
  }[]
  badge?: {
    label: string
    variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  }
  link?: { label: string; url: string }
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function RichTooltip({
  title,
  description,
  metadata,
  actions,
  badge,
  link,
  children,
  side = 'top',
  align = 'center',
  className,
}: RichTooltipProps) {
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        className={cn('w-72', className)}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm">{title}</h4>
            {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}

          {/* Metadata */}
          {metadata && metadata.length > 0 && (
            <div className="space-y-1.5 text-xs">
              {metadata.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Link */}
          {link && (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-accent hover:underline"
            >
              {link.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex gap-2 pt-1">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  className="h-7 text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

// Code tooltip with copy
interface CodeTooltipProps {
  code: string
  language?: string
  children: React.ReactNode
}

export function CodeTooltip({ code, language, children }: CodeTooltipProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-auto max-w-md p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5 bg-muted/50">
          {language && (
            <span className="text-xs text-muted-foreground">{language}</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
        <pre className="p-3 text-xs font-mono overflow-x-auto max-h-48">
          <code>{code}</code>
        </pre>
      </HoverCardContent>
    </HoverCard>
  )
}

// Keyboard shortcut tooltip
interface ShortcutTooltipProps {
  label: string
  shortcut: string[]
  children: React.ReactNode
}

export function ShortcutTooltip({
  label,
  shortcut,
  children,
}: ShortcutTooltipProps) {
  return (
    <SimpleTooltip
      content={
        <div className="flex items-center gap-2">
          <span>{label}</span>
          <div className="flex items-center gap-0.5">
            {shortcut.map((key, index) => (
              <kbd
                key={index}
                className="px-1.5 py-0.5 text-[10px] bg-muted border border-border rounded font-mono"
              >
                {key}
              </kbd>
            ))}
          </div>
        </div>
      }
    >
      {children}
    </SimpleTooltip>
  )
}

// Status tooltip
interface StatusTooltipProps {
  status: 'online' | 'offline' | 'busy' | 'away' | 'idle'
  lastSeen?: Date
  children: React.ReactNode
}

export function StatusTooltip({
  status,
  lastSeen,
  children,
}: StatusTooltipProps) {
  const statusInfo = {
    online: { label: 'Online', color: 'bg-emerald-500' },
    offline: { label: 'Offline', color: 'bg-muted-foreground' },
    busy: { label: 'Busy', color: 'bg-red-500' },
    away: { label: 'Away', color: 'bg-amber-500' },
    idle: { label: 'Idle', color: 'bg-amber-500' },
  }

  const info = statusInfo[status]

  return (
    <SimpleTooltip
      content={
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', info.color)} />
          <span>{info.label}</span>
          {lastSeen && status === 'offline' && (
            <span className="text-muted-foreground">
              - Last seen {formatRelativeTime(lastSeen)}
            </span>
          )}
        </div>
      }
    >
      {children}
    </SimpleTooltip>
  )
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// Progress tooltip
interface ProgressTooltipProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  children: React.ReactNode
}

export function ProgressTooltip({
  value,
  max = 100,
  label,
  showPercentage = true,
  children,
}: ProgressTooltipProps) {
  const percentage = Math.round((value / max) * 100)

  return (
    <SimpleTooltip
      content={
        <div className="space-y-1.5 min-w-[120px]">
          {label && <span className="text-xs font-medium">{label}</span>}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {showPercentage && (
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{value.toLocaleString()}</span>
              <span>{percentage}%</span>
            </div>
          )}
        </div>
      }
    >
      {children}
    </SimpleTooltip>
  )
}
