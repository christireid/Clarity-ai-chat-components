'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  MessageSquare,
  Search,
  FileText,
  FolderOpen,
  Inbox,
  Zap,
  AlertCircle,
  RefreshCw,
  Plus,
  Sparkles,
  Bot,
  Code,
  ImageIcon,
  FileCode,
  Database,
  Settings,
  Users,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'

// Types
type EmptyStateVariant =
  | 'chat'
  | 'search'
  | 'files'
  | 'folder'
  | 'inbox'
  | 'error'
  | 'ai'
  | 'code'
  | 'media'
  | 'data'
  | 'settings'
  | 'users'
  | 'custom'

interface EmptyStateProps {
  variant?: EmptyStateVariant
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const variantIcons: Record<EmptyStateVariant, React.ReactNode> = {
  chat: <MessageSquare className="h-12 w-12" />,
  search: <Search className="h-12 w-12" />,
  files: <FileText className="h-12 w-12" />,
  folder: <FolderOpen className="h-12 w-12" />,
  inbox: <Inbox className="h-12 w-12" />,
  error: <AlertCircle className="h-12 w-12" />,
  ai: <Sparkles className="h-12 w-12" />,
  code: <FileCode className="h-12 w-12" />,
  media: <ImageIcon className="h-12 w-12" />,
  data: <Database className="h-12 w-12" />,
  settings: <Settings className="h-12 w-12" />,
  users: <Users className="h-12 w-12" />,
  custom: <Zap className="h-12 w-12" />,
}

export function EmptyState({
  variant = 'custom',
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
  }

  const iconSizeClasses = {
    sm: '[&>svg]:h-8 [&>svg]:w-8',
    md: '[&>svg]:h-12 [&>svg]:w-12',
    lg: '[&>svg]:h-16 [&>svg]:w-16',
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4',
        sizeClasses[size],
        className
      )}
    >
      <div
        className={cn('mb-4 text-muted-foreground/50', iconSizeClasses[size])}
      >
        {icon || variantIcons[variant]}
      </div>
      <h3
        className={cn(
          'font-semibold text-foreground',
          size === 'sm' && 'text-base',
          size === 'md' && 'text-lg',
          size === 'lg' && 'text-xl'
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            'mt-2 text-muted-foreground max-w-sm',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base'
          )}
        >
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 mt-4">
          {action && (
            <Button
              variant={action.variant || 'default'}
              size={size === 'sm' ? 'sm' : 'default'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              size={size === 'sm' ? 'sm' : 'default'}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Pre-built empty states
export function EmptyChatState({ onNewChat }: { onNewChat?: () => void }) {
  return (
    <EmptyState
      variant="ai"
      title="Start a new conversation"
      description="Ask me anything or start with one of the suggestions below"
      action={onNewChat ? { label: 'New Chat', onClick: onNewChat } : undefined}
    />
  )
}

export function EmptySearchState({
  query,
  onClear,
}: {
  query?: string
  onClear?: () => void
}) {
  return (
    <EmptyState
      variant="search"
      title={query ? `No results for "${query}"` : 'No results found'}
      description="Try adjusting your search or filters to find what you're looking for"
      action={
        onClear
          ? { label: 'Clear Search', onClick: onClear, variant: 'outline' }
          : undefined
      }
    />
  )
}

export function EmptyFilesState({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      variant="files"
      title="No files yet"
      description="Upload files to get started with your project"
      action={
        onUpload ? { label: 'Upload Files', onClick: onUpload } : undefined
      }
    />
  )
}

export function EmptyErrorState({
  message,
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <EmptyState
      variant="error"
      title="Something went wrong"
      description={message || 'An unexpected error occurred. Please try again.'}
      action={
        onRetry
          ? {
              label: 'Retry',
              onClick: onRetry,
              variant: 'outline',
            }
          : undefined
      }
    />
  )
}

// Suggested actions component
interface SuggestedAction {
  icon: React.ReactNode
  title: string
  description?: string
  onClick: () => void
}

interface SuggestedActionsProps {
  actions: SuggestedAction[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function SuggestedActions({
  actions,
  columns = 2,
  className,
}: SuggestedActionsProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-3', gridCols[columns], className)}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left"
        >
          <div className="shrink-0 text-muted-foreground">{action.icon}</div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm">{action.title}</p>
            {action.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {action.description}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

// AI Welcome screen
interface WelcomeScreenProps {
  title?: string
  subtitle?: string
  suggestions?: Array<{
    icon?: React.ReactNode
    text: string
    onClick: () => void
  }>
  className?: string
}

export function WelcomeScreen({
  title = 'How can I help you today?',
  subtitle,
  suggestions,
  className,
}: WelcomeScreenProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[400px] px-4',
        className
      )}
    >
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
          <Bot className="h-8 w-8 text-accent-foreground" />
        </div>
        <div className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground text-center mt-2 max-w-md">
          {subtitle}
        </p>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8 w-full max-w-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={suggestion.onClick}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left text-sm"
            >
              {suggestion.icon || (
                <Zap className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className="line-clamp-1">{suggestion.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
