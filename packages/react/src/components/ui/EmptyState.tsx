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
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import {
  BotIcon,
  SearchIcon,
  FileIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  SparklesIcon,
  CodeIcon,
  MessageSquareIcon,
  LightbulbIcon,
} from './icons'
import { InteractiveButton } from './InteractiveCard'
import {
  PromptSuggestions,
  type PromptSuggestion,
} from '../prompt/PromptSuggestions'
import {
  getMotionSafeDuration,
  getMotionSafeValue,
} from '../../animations/motion-safe'
import { getSpring } from '../../animations/spring-presets'
import {
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'

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
 *
 * @enhanced Framer Motion 12: Spring physics for organic entrance
 * - Smooth spring for container
 * - Smooth spring with rotation for icon
 * - Gentle spring for content
 * - Respects prefers-reduced-motion
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      {...ANIMATION_PRESETS.slideUp}
      transition={getSpring('smooth', prefersReducedMotion)}
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-12 space-y-8',
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={getSpring('smooth', prefersReducedMotion, { delay: 0.1 })}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-lg ring-1 ring-primary/25"
        >
          {icon}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        {...ANIMATION_PRESETS.slideUp}
        transition={getSpring('gentle', prefersReducedMotion, { delay: 0.25 })}
        className="space-y-3.5 max-w-lg"
      >
        <h3 className="text-2xl font-bold text-foreground leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            {description}
          </p>
        )}
      </motion.div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          {...ANIMATION_PRESETS.slideUp}
          transition={getSpring('quick', prefersReducedMotion, { delay: 0.35 })}
          className="flex flex-wrap gap-3 justify-center"
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
 * Default starter prompts for empty chat state
 */
const DEFAULT_STARTER_PROMPTS: PromptSuggestion[] = [
  {
    id: 'starter-help',
    text: 'Help me write code',
    label: 'Write Code',
    icon: <CodeIcon size={16} />,
    description: 'Get help with coding tasks and debugging',
    type: 'starter',
    category: 'Development',
  },
  {
    id: 'starter-explain',
    text: 'Explain a concept to me',
    label: 'Explain Concept',
    icon: <LightbulbIcon size={16} />,
    description: 'Learn about complex topics in simple terms',
    type: 'starter',
    category: 'Learning',
  },
  {
    id: 'starter-brainstorm',
    text: 'Help me brainstorm ideas',
    label: 'Brainstorm',
    icon: <SparklesIcon size={16} />,
    description: 'Generate creative ideas and solutions',
    type: 'starter',
    category: 'Creativity',
  },
  {
    id: 'starter-chat',
    text: 'Just chat and answer questions',
    label: 'Chat',
    icon: <MessageSquareIcon size={16} />,
    description: 'Have a conversation and get answers',
    type: 'starter',
    category: 'General',
  },
]

/**
 * Empty Chat State with Suggested Prompts
 */
export function EmptyChatState({
  onStartChat,
  onSuggestionSelect,
  suggestions = DEFAULT_STARTER_PROMPTS,
  showSuggestions = true,
  className,
}: {
  /** Callback when "Start Chat" button is clicked */
  onStartChat?: () => void
  /** Callback when a suggestion is selected */
  onSuggestionSelect?: (suggestion: PromptSuggestion) => void
  /** Custom starter prompts (defaults to built-in suggestions) */
  suggestions?: PromptSuggestion[]
  /** Show suggested prompts */
  showSuggestions?: boolean
  /** Additional className */
  className?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      {...ANIMATION_PRESETS.slideUp}
      transition={{
        duration: getMotionSafeDuration(prefersReducedMotion, 0.5),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-12 space-y-8 max-w-3xl mx-auto',
        className
      )}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: getMotionSafeDuration(prefersReducedMotion, 0.6),
          ease: [0.25, 0.1, 0.25, 1],
          delay: getMotionSafeDuration(prefersReducedMotion, 0.1),
          type: 'spring',
          stiffness: 280,
          damping: 22,
        }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-lg ring-1 ring-primary/25"
      >
        <BotIcon size={40} className="text-primary" />
      </motion.div>

      {/* Content */}
      <motion.div
        {...ANIMATION_PRESETS.slideUp}
        transition={{
          duration: getMotionSafeDuration(prefersReducedMotion, 0.4),
          ease: [0.25, 0.1, 0.25, 1],
          delay: getMotionSafeDuration(prefersReducedMotion, 0.25),
        }}
        className="space-y-3.5"
      >
        <h3 className="text-2xl font-bold text-foreground leading-tight">
          Start a conversation
        </h3>
        <p className="text-sm text-muted-foreground/90 leading-relaxed max-w-md">
          {showSuggestions
            ? 'Choose a suggestion below or type your own message to begin chatting with the AI assistant.'
            : "Send a message to begin chatting with the AI assistant. I'm here to help with your questions and tasks."}
        </p>
      </motion.div>

      {/* Suggested Prompts */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          {...ANIMATION_PRESETS.slideUp}
          transition={{
            duration: getMotionSafeDuration(prefersReducedMotion, 0.4),
            ease: [0.25, 0.1, 0.25, 1],
            delay: getMotionSafeDuration(prefersReducedMotion, 0.35),
          }}
          className="w-full"
        >
          <PromptSuggestions
            suggestions={suggestions}
            onSelect={onSuggestionSelect || (() => {})}
            suggestionType="starter"
            layout="cards"
            maxSuggestions={6}
          />
        </motion.div>
      )}

      {/* Optional "Start Chat" button */}
      {onStartChat && !showSuggestions && (
        <motion.div
          {...ANIMATION_PRESETS.slideUp}
          transition={{
            duration: getMotionSafeDuration(prefersReducedMotion, 0.4),
            ease: [0.25, 0.1, 0.25, 1],
            delay: getMotionSafeDuration(prefersReducedMotion, 0.35),
          }}
        >
          <InteractiveButton variant="primary" onClick={onStartChat}>
            Start Chat
          </InteractiveButton>
        </motion.div>
      )}
    </motion.div>
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
 *
 * @enhanced Framer Motion 12: Spring entrance with continuous rotation
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
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      {...ANIMATION_PRESETS.scale}
      transition={getSpring('quick', prefersReducedMotion)}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 space-y-6',
        className
      )}
    >
      {/* Animated Spinner */}
      <motion.div
        animate={{ rotate: prefersReducedMotion ? 0 : 360 }}
        transition={{
          duration: durations.slower,
          repeat: prefersReducedMotion ? 0 : Infinity,
          ease: 'linear',
        }}
        className="w-12 h-12 border-4 border-primary/60 border-t-primary rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
      />

      {/* Content */}
      <motion.div
        {...ANIMATION_PRESETS.fadeIn}
        transition={getSpring('quick', prefersReducedMotion, { delay: 0.1 })}
        className="space-y-2 max-w-sm"
      >
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            {description}
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

LoadingState.displayName = 'LoadingState'

/**
 * Loading State with Timeout Fallback
 *
 * Automatically transitions to an error state if loading takes too long.
 * This prevents users from being stuck in an infinite loading state.
 *
 * @param timeout - Timeout duration in milliseconds (default: 30000ms / 30s)
 * @param onTimeout - Callback when timeout is reached
 *
 * @enhanced WCAG Accessibility: Prevents indefinite loading states
 */
export function LoadingStateWithTimeout({
  title = 'Loading...',
  description = 'Please wait while we load your content',
  timeout = 30000,
  onTimeout,
  className,
}: {
  title?: string
  description?: string
  timeout?: number
  onTimeout?: () => void
  className?: string
}) {
  const [hasTimedOut, setHasTimedOut] = React.useState(false)

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasTimedOut(true)
      onTimeout?.()
    }, timeout)

    return () => clearTimeout(timeoutId)
  }, [timeout, onTimeout])

  if (hasTimedOut) {
    return (
      <ErrorState
        title="Loading Timeout"
        description="The content is taking longer than expected to load. Please try again."
        onRetry={() => {
          setHasTimedOut(false)
          onTimeout?.()
        }}
        className={className}
      />
    )
  }

  return (
    <LoadingState
      title={title}
      description={description}
      className={className}
    />
  )
}

LoadingStateWithTimeout.displayName = 'LoadingStateWithTimeout'

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
