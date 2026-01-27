/**
 * Type definitions for StreamingProgress component
 */

/**
 * Token information for display
 */
export interface StreamStatusTokens {
  /** Tokens received so far */
  received: number
  /** Estimated total tokens (optional) */
  estimated?: number
  /** Tokens per second throughput (optional) */
  tokensPerSecond?: number
}

/**
 * Visual variant of the progress component
 */
export type StreamStatusProgressVariant =
  | 'bar'
  | 'circular'
  | 'text'
  | 'minimal'

/**
 * Size variant
 */
export type StreamStatusProgressSize = 'sm' | 'md' | 'lg'

/**
 * Color variant based on status
 */
export type StreamStatusProgressColor =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'auto'

/**
 * Props for StreamStatusProgress component
 */
export interface StreamStatusProgressProps {
  /** Progress percentage (0-100) */
  progress: number
  /** Token information */
  tokens?: StreamStatusTokens
  /** Visual variant */
  variant?: StreamStatusProgressVariant
  /** Size variant */
  size?: StreamStatusProgressSize
  /** Color variant */
  color?: StreamStatusProgressColor
  /** Whether streaming is active */
  isStreaming?: boolean
  /** Whether streaming is complete */
  isComplete?: boolean
  /** Whether an error occurred */
  hasError?: boolean
  /** Show percentage text */
  showPercentage?: boolean
  /** Show token count */
  showTokenCount?: boolean
  /** Show throughput (tokens/second) */
  showThroughput?: boolean
  /** Show time remaining */
  showTimeRemaining?: boolean
  /** Time remaining in milliseconds */
  timeRemaining?: number
  /** Time elapsed in milliseconds */
  timeElapsed?: number
  /** Show time to first token */
  showTimeToFirstToken?: boolean
  /** Time to first token in milliseconds */
  timeToFirstToken?: number
  /** Custom label */
  label?: string
  /** Thresholds for auto color */
  thresholds?: { warning: number; error: number }
  /** Disable animations */
  disableAnimations?: boolean
  /** Custom class name */
  className?: string
  /** Accessible label */
  'aria-label'?: string
  /** Callback when progress bar is clicked */
  onClick?: () => void
}

/**
 * Streaming progress with field status display
 */
export interface StreamStatusProgressWithFieldsProps
  extends StreamStatusProgressProps {
  /** Per-field status map */
  fieldStatus?: Map<
    string,
    {
      name: string
      status: 'pending' | 'streaming' | 'complete' | 'error'
      tokensReceived: number
      progress: number
      error?: string
    }
  >
  /** Show field progress bars */
  showFieldProgress?: boolean
}

/**
 * Color classes for progress components
 */
export interface ColorClasses {
  bg: string
  text: string
  fill: string
}

/**
 * Size configuration
 */
export interface SizeConfig {
  bar: string
  circular: number
  strokeWidth: number
  text: string
  gap: string
  padding: string
}

/**
 * Field status entry
 */
export interface FieldStatus {
  name: string
  status: 'pending' | 'streaming' | 'complete' | 'error'
  tokensReceived: number
  progress: number
  error?: string
}
