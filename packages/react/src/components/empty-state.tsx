/**
 * Empty State Components
 *
 * Comprehensive empty state components for various scenarios:
 * - No data
 * - No search results
 * - No conversations
 * - Error states
 * - Success states
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  BotIcon,
  SearchIcon,
  FileIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
} from './icons'
import { InteractiveButton } from './interactive-card'
// import { createScaleVariant } from '../animations' // Reserved for future use

export interface EmptyStateProps {
  /** Icon to display */
  icon?: React.ReactNode
  /** Title */
  title: string
  /** Description */
  description?: string
  /** Primary action */
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'primary' | 'success' | 'destructive'
  }
  /** Secondary action */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** Additional className */
  className?: string
}

/**
 * Base Empty State Component
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 space-y-6',
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-primary/20"
        >
          {icon}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        className="space-y-3 max-w-md"
      >
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-base text-muted-foreground/80 leading-relaxed">
            {description}
          </p>
        )}
      </motion.div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          className="flex gap-3"
        >
          {action && (
            <InteractiveButton
              variant={action.variant || 'primary'}
              onClick={action.onClick}
            >
              {action.label}
            </InteractiveButton>
          )}
          {secondaryAction && (
            <InteractiveButton
              variant="ghost"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </InteractiveButton>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

EmptyState.displayName = 'EmptyState'

/**
 * Empty Chat State
 */
export function EmptyChatState({
  onStartChat,
  className,
}: {
  onStartChat?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={<BotIcon size={32} className="text-primary" />}
      title="Start a conversation"
      description="Send a message to begin chatting with the AI assistant"
      action={
        onStartChat
          ? {
              label: 'Start Chat',
              onClick: onStartChat,
              variant: 'primary',
            }
          : undefined
      }
      className={className}
    />
  )
}

EmptyChatState.displayName = 'EmptyChatState'

/**
 * No Search Results State
 */
export function NoSearchResultsState({
  searchQuery,
  onClearSearch,
  className,
}: {
  searchQuery?: string
  onClearSearch?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={<SearchIcon size={32} className="text-muted-foreground" />}
      title="No results found"
      description={
        searchQuery
          ? `No results for "${searchQuery}". Try different keywords.`
          : 'No results match your search criteria.'
      }
      action={
        onClearSearch
          ? {
              label: 'Clear Search',
              onClick: onClearSearch,
            }
          : undefined
      }
      className={className}
    />
  )
}

NoSearchResultsState.displayName = 'NoSearchResultsState'

/**
 * No Conversations State
 */
export function NoConversationsState({
  onCreateConversation,
  className,
}: {
  onCreateConversation?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={<BotIcon size={32} className="text-muted-foreground" />}
      title="No conversations yet"
      description="Start your first conversation to see it here"
      action={
        onCreateConversation
          ? {
              label: 'New Conversation',
              onClick: onCreateConversation,
              variant: 'primary',
            }
          : undefined
      }
      className={className}
    />
  )
}

NoConversationsState.displayName = 'NoConversationsState'

/**
 * No Files State
 */
export function NoFilesState({
  onUpload,
  className,
}: {
  onUpload?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={<FileIcon size={32} className="text-muted-foreground" />}
      title="No files uploaded"
      description="Upload files to attach them to your messages"
      action={
        onUpload
          ? {
              label: 'Upload Files',
              onClick: onUpload,
              variant: 'primary',
            }
          : undefined
      }
      className={className}
    />
  )
}

NoFilesState.displayName = 'NoFilesState'

/**
 * Error State
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred. Please try again.',
  onRetry,
  onGoBack,
  className,
}: {
  title?: string
  description?: string
  onRetry?: () => void
  onGoBack?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={<AlertCircleIcon size={32} className="text-destructive" />}
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: 'Try Again',
              onClick: onRetry,
              variant: 'destructive',
            }
          : undefined
      }
      secondaryAction={
        onGoBack
          ? {
              label: 'Go Back',
              onClick: onGoBack,
            }
          : undefined
      }
      className={className}
    />
  )
}

ErrorState.displayName = 'ErrorState'

/**
 * Success State
 */
export function SuccessState({
  title,
  description,
  onContinue,
  className,
}: {
  title: string
  description?: string
  onContinue?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={<CheckCircleIcon size={32} className="text-success" />}
      title={title}
      description={description}
      action={
        onContinue
          ? {
              label: 'Continue',
              onClick: onContinue,
              variant: 'success',
            }
          : undefined
      }
      className={className}
    />
  )
}

SuccessState.displayName = 'SuccessState'

/**
 * Info State
 */
export function InfoState({
  title,
  description,
  onAction,
  className,
}: {
  title: string
  description?: string
  onAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}) {
  return (
    <EmptyState
      icon={<InfoIcon size={32} className="text-info" />}
      title={title}
      description={description}
      action={onAction}
      className={className}
    />
  )
}

InfoState.displayName = 'InfoState'

/**
 * Loading State (with animated icon)
 */
export function LoadingState({
  title = 'Loading...',
  description = 'Please wait while we load your content',
  className,
}: {
  title?: string
  description?: string
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 space-y-6',
        className
      )}
    >
      {/* Animated Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-primary/60 border-t-primary rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="space-y-2 max-w-sm"
      >
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground/80 leading-relaxed">{description}</p>
        )}
      </motion.div>
    </motion.div>
  )
}

LoadingState.displayName = 'LoadingState'

/**
 * Offline State
 */
export function OfflineState({
  onRetry,
  className,
}: {
  onRetry?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={<AlertCircleIcon size={32} className="text-warning" />}
      title="No internet connection"
      description="Please check your connection and try again"
      action={
        onRetry
          ? {
              label: 'Retry',
              onClick: onRetry,
              variant: 'primary',
            }
          : undefined
      }
      className={className}
    />
  )
}

OfflineState.displayName = 'OfflineState'
