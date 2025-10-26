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
import { createScaleVariant } from '../animations'

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
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}) => {
  const scaleVariant = createScaleVariant(0.95, 'normal', 'spring')

  return (
    <motion.div
      variants={scaleVariant}
      initial="initial"
      animate="animate"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 space-y-6',
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted"
        >
          {icon}
        </motion.div>
      )}

      {/* Content */}
      <div className="space-y-2 max-w-sm">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex gap-3">
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
        </div>
      )}
    </motion.div>
  )
}

/**
 * Empty Chat State
 */
export const EmptyChatState: React.FC<{
  onStartChat?: () => void
  className?: string
}> = ({ onStartChat, className }) => {
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

/**
 * No Search Results State
 */
export const NoSearchResultsState: React.FC<{
  searchQuery?: string
  onClearSearch?: () => void
  className?: string
}> = ({ searchQuery, onClearSearch, className }) => {
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

/**
 * No Conversations State
 */
export const NoConversationsState: React.FC<{
  onCreateConversation?: () => void
  className?: string
}> = ({ onCreateConversation, className }) => {
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

/**
 * No Files State
 */
export const NoFilesState: React.FC<{
  onUpload?: () => void
  className?: string
}> = ({ onUpload, className }) => {
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

/**
 * Error State
 */
export const ErrorState: React.FC<{
  title?: string
  description?: string
  onRetry?: () => void
  onGoBack?: () => void
  className?: string
}> = ({
  title = 'Something went wrong',
  description = 'An error occurred. Please try again.',
  onRetry,
  onGoBack,
  className,
}) => {
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

/**
 * Success State
 */
export const SuccessState: React.FC<{
  title: string
  description?: string
  onContinue?: () => void
  className?: string
}> = ({ title, description, onContinue, className }) => {
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

/**
 * Info State
 */
export const InfoState: React.FC<{
  title: string
  description?: string
  onAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}> = ({ title, description, onAction, className }) => {
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

/**
 * Loading State (with animated icon)
 */
export const LoadingState: React.FC<{
  title?: string
  description?: string
  className?: string
}> = ({
  title = 'Loading...',
  description = 'Please wait while we load your content',
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 space-y-6',
        className
      )}
    >
      {/* Animated Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
      />

      {/* Content */}
      <div className="space-y-2 max-w-sm">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Offline State
 */
export const OfflineState: React.FC<{
  onRetry?: () => void
  className?: string
}> = ({ onRetry, className }) => {
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
