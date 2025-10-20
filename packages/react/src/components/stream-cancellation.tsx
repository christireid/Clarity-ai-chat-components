import * as React from 'react'
import { Button } from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

/**
 * Props for StreamCancellation component
 */
export interface StreamCancellationProps {
  /** Whether stream is currently active */
  isStreaming: boolean

  /** Callback when cancel is clicked */
  onCancel: () => void

  /** Custom label for cancel button (default: "Cancel") */
  cancelLabel?: string

  /** Show as icon-only button (default: false) */
  iconOnly?: boolean

  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon'

  /** Custom className */
  className?: string

  /** Show progress indicator (default: true) */
  showProgress?: boolean

  /** Progress message (e.g., "Streaming...") */
  progressMessage?: string
}

/**
 * StreamCancellation component provides a UI for canceling active streams.
 * Displays a cancel button with optional progress indicator during streaming.
 *
 * **Features:**
 * - Accessible cancel button with keyboard support
 * - Optional progress indicator with animation
 * - Customizable appearance (icon-only, size, label)
 * - Auto-hide when not streaming
 *
 * **Use Cases:**
 * - Cancel SSE streaming responses
 * - Abort WebSocket message streams
 * - Stop long-running AI generations
 *
 * @example
 * ```tsx
 * const Chat = () => {
 *   const { status, disconnect } = useStreamingSSE({
 *     url: '/api/chat/stream',
 *     // ... other options
 *   })
 *
 *   return (
 *     <div>
 *       <StreamCancellation
 *         isStreaming={status === 'streaming'}
 *         onCancel={disconnect}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
export const StreamCancellation: React.FC<StreamCancellationProps> = ({
  isStreaming,
  onCancel,
  cancelLabel = 'Cancel',
  iconOnly = false,
  size = 'default',
  className,
  showProgress = true,
  progressMessage = 'Streaming...',
}) => {
  if (!isStreaming) return null

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {showProgress && (
        <div className="flex items-center gap-2">
          {/* Animated progress indicator */}
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
          </div>
          
          {!iconOnly && (
            <span className="text-sm text-muted-foreground">{progressMessage}</span>
          )}
        </div>
      )}

      <Button
        variant="outline"
        size={size}
        onClick={onCancel}
        className="gap-2"
        aria-label="Cancel stream"
      >
        {/* Stop icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="10" height="10" rx="2" />
        </svg>
        
        {!iconOnly && <span>{cancelLabel}</span>}
      </Button>
    </div>
  )
}

StreamCancellation.displayName = 'StreamCancellation'
