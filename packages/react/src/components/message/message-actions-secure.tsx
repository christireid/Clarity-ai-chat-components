/**
 * Secure Message Actions Component
 *
 * Enhanced message actions with security indicators and features:
 * - Security validation status badge
 * - PII detection indicator
 * - Report/flag unsafe content
 * - Security details tooltip
 * - All original actions (copy, feedback, edit, etc.)
 *
 * @example
 * ```tsx
 * <MessageActionsSecure
 *   messageContent={content}
 *   messageId={id}
 *   role="assistant"
 *   securityInfo={{
 *     validated: true,
 *     piiDetected: false,
 *     threats: [],
 *     sanitized: false
 *   }}
 *   onReport={(reason) => console.log('Reported:', reason)}
 * />
 * ```
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button, cn } from '@clarity-chat/primitives'
import { CopyButton } from './copy-button'
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  RefreshIcon,
  EditIcon,
  TrashIcon,
  ShieldIcon,
  AlertTriangleIcon,
  FlagIcon,
  InfoIcon,
} from '../ui/icons'
import {
  ANIMATION_DURATION,
  EASING_FRAMER,
  INTERACTION_VARIANTS,
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { ConfettiAnimation } from './confetti-animation'
import { useToast } from '../ui/toast'
import { useReducedMotion } from '@/hooks/ui/use-reduced-motion'

// Animation constants for feedback interactions
const THUMBS_UP_CELEBRATION = {
  scale: [1, 1.2, 1],
  rotate: [0, -15, 15, -15, 0],
}

const THUMBS_DOWN_SHAKE = {
  scale: [1, 1.1, 1],
  rotate: [0, 15, -15, 15, 0],
}

const DELETE_SHAKE = {
  rotate: [0, 10, -10, 10, 0],
  scale: [1, 0.9, 0.9, 0.9, 0.8],
}

export interface SecurityInfo {
  /** Whether message passed security validation */
  validated: boolean
  /** PII was detected and redacted */
  piiDetected?: boolean
  /** Number of PII entities found */
  piiCount?: number
  /** Security threats detected */
  threats?: string[]
  /** Message was sanitized/modified */
  sanitized?: boolean
  /** Confidence score of validation (0-1) */
  confidence?: number
  /** Security check method used */
  method?: string
}

export interface MessageActionsSecureProps {
  messageContent: string
  messageId: string
  role: 'user' | 'assistant' | 'system'
  feedbackGiven: 'up' | 'down' | null
  showConfetti: boolean
  hasError: boolean
  onFeedback: (type: 'up' | 'down') => void
  onRetry?: () => void
  onEdit?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  show: boolean

  /** Security information for this message */
  securityInfo?: SecurityInfo
  /** Callback when message is reported as unsafe */
  onReport?: (reason: string) => void
  /** Show security indicators */
  showSecurityIndicators?: boolean
}

/**
 * Secure Message Actions Component
 *
 * Enhanced with security features and indicators
 */
export const MessageActionsSecure = React.memo<MessageActionsSecureProps>(
  ({
    messageContent,
    messageId,
    role,
    feedbackGiven,
    showConfetti,
    hasError,
    onFeedback,
    onRetry,
    onEdit,
    onRegenerate,
    onDelete,
    show,
    securityInfo,
    onReport,
    showSecurityIndicators = true,
  }) => {
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [showSecurityDetails, setShowSecurityDetails] = React.useState(false)
    const [showReportMenu, setShowReportMenu] = React.useState(false)
    const toast = useToast()
    const prefersReducedMotion = useReducedMotion()

    if (!show) return null

    const isUserMessage = role === 'user'
    const isAssistantMessage = role === 'assistant'

    const handleDelete = React.useCallback(() => {
      setIsDeleting(true)
      toast?.info('Message deleted')
      setTimeout(() => {
        onDelete?.(messageId)
      }, 300)
    }, [messageId, onDelete, toast])

    const handleReport = React.useCallback(
      (reason: string) => {
        onReport?.(reason)
        toast?.success(`Message reported: ${reason}`)
        setShowReportMenu(false)
      },
      [onReport, toast]
    )

    const hasSecurityWarnings =
      securityInfo &&
      (!securityInfo.validated ||
        (securityInfo.threats && securityInfo.threats.length > 0))

    const hasPiiDetected = securityInfo?.piiDetected

    return (
      <motion.div
        {...ANIMATION_PRESETS.slideUp}
        transition={{
          duration: prefersReducedMotion ? 0 : ANIMATION_DURATION.fast / 1000,
          ease: EASING_FRAMER.out,
        }}
        viewport={{ once: true }}
        className="flex items-center gap-1 overflow-hidden"
      >
          {/* Security Status Indicator */}
          {showSecurityIndicators && securityInfo && (
            <motion.div
              {...ANIMATION_PRESETS.scale}
              transition={{ delay: prefersReducedMotion ? 0 : 0, duration: prefersReducedMotion ? 0 : durations.normal }}
              viewport={{ once: true }}
              className="relative"
              onMouseEnter={() => setShowSecurityDetails(true)}
              onMouseLeave={() => setShowSecurityDetails(false)}
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-7 w-7 rounded-md',
                  hasSecurityWarnings &&
                    'text-orange-500 hover:text-orange-600',
                  !hasSecurityWarnings && 'text-green-500 hover:text-green-600'
                )}
                aria-label="Security status"
              >
                {hasSecurityWarnings ? (
                  <AlertTriangleIcon size={14} />
                ) : (
                  <ShieldIcon size={14} />
                )}
              </Button>

              {/* Security Details Tooltip */}
              {showSecurityDetails && (
                <motion.div
                  {...ANIMATION_PRESETS.slideDown}
                  viewport={{ once: true }}
                  className="absolute bottom-full left-0 mb-2 z-50"
                >
                  <div className="bg-popover text-popover-foreground border rounded-lg shadow-lg p-3 text-xs w-64">
                    <div className="font-semibold mb-2 flex items-center gap-2">
                      {hasSecurityWarnings ? (
                        <>
                          <AlertTriangleIcon
                            size={12}
                            className="text-orange-500"
                          />
                          Security Warnings
                        </>
                      ) : (
                        <>
                          <ShieldIcon size={12} className="text-green-500" />
                          Secure Message
                        </>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Validated:
                        </span>
                        <span
                          className={
                            securityInfo.validated
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {securityInfo.validated ? 'Yes' : 'No'}
                        </span>
                      </div>

                      {hasPiiDetected && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            PII Detected:
                          </span>
                          <span className="text-orange-600">
                            {securityInfo.piiCount || 1} item(s)
                          </span>
                        </div>
                      )}

                      {securityInfo.threats &&
                        securityInfo.threats.length > 0 && (
                          <div>
                            <span className="text-muted-foreground">
                              Threats:
                            </span>
                            <ul className="list-disc list-inside mt-1">
                              {securityInfo.threats
                                .slice(0, 3)
                                .map((threat, i) => (
                                  <li
                                    key={i}
                                    className="text-orange-600 text-xs"
                                  >
                                    {threat}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                      {securityInfo.sanitized && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Sanitized:
                          </span>
                          <span className="text-blue-600">Yes</span>
                        </div>
                      )}

                      {securityInfo.confidence !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Confidence:
                          </span>
                          <span>
                            {(securityInfo.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}

                      {securityInfo.method && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Method:</span>
                          <span className="capitalize">
                            {securityInfo.method}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PII Indicator */}
          {showSecurityIndicators && hasPiiDetected && (
            <motion.div
              {...ANIMATION_PRESETS.scale}
              transition={{ delay: prefersReducedMotion ? 0 : 0.05, duration: prefersReducedMotion ? 0 : durations.normal }}
              viewport={{ once: true }}
              title={`${securityInfo.piiCount || 1} PII item(s) redacted`}
            >
              <div className="h-7 px-2 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
                <InfoIcon size={12} />
                <span className="text-xs font-medium">PII</span>
              </div>
            </motion.div>
          )}

          {/* Copy button */}
          <motion.div
            {...ANIMATION_PRESETS.scale}
            transition={{ delay: prefersReducedMotion ? 0 : 0.1, duration: prefersReducedMotion ? 0 : durations.normal }}
            viewport={{ once: true }}
          >
            <CopyButton
              text={messageContent}
              size="icon"
              iconOnly
              className="h-7 w-7 rounded-md"
            />
          </motion.div>

          {/* Thumbs Up with Confetti */}
          <motion.div
            className="relative"
            {...ANIMATION_PRESETS.scale}
            transition={{ delay: prefersReducedMotion ? 0 : 0.15, duration: prefersReducedMotion ? 0 : durations.normal }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={prefersReducedMotion ? undefined : {
                scale: 1.15,
                rotate: feedbackGiven === 'up' ? 0 : -12,
              }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.85 }}
              {...(feedbackGiven === 'up' && !prefersReducedMotion ? ANIMATION_PRESETS.scaleRotate : {})}
              animate={
                feedbackGiven === 'up' && !prefersReducedMotion
                  ? {
                      ...ANIMATION_PRESETS.scaleRotate.animate,
                      ...THUMBS_UP_CELEBRATION,
                    }
                  : ANIMATION_PRESETS.scaleRotate.animate
              }
              transition={{ duration: prefersReducedMotion ? 0 : durations.slow }}
              viewport={{ once: true }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFeedback('up')}
                className={cn(
                  'h-7 w-7 rounded-md transition-all',
                  feedbackGiven === 'up' && 'text-success bg-success/10'
                )}
                aria-label="Good response"
              >
                <ThumbsUpIcon size={14} />
              </Button>
            </motion.div>

            <ConfettiAnimation show={showConfetti} />
          </motion.div>

          {/* Thumbs Down */}
          <motion.div
            {...ANIMATION_PRESETS.scale}
            transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0 : durations.normal }}
            whileHover={prefersReducedMotion ? undefined : {
              scale: 1.15,
              rotate: feedbackGiven === 'down' ? 0 : 12,
            }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.85 }}
            viewport={{ once: true }}
          >
            <motion.div
              {...(feedbackGiven === 'down' && !prefersReducedMotion ? ANIMATION_PRESETS.scaleRotate : {})}
              animate={
                feedbackGiven === 'down' && !prefersReducedMotion
                  ? {
                      ...ANIMATION_PRESETS.scaleRotate.animate,
                      ...THUMBS_DOWN_SHAKE,
                    }
                  : ANIMATION_PRESETS.scaleRotate.animate
              }
              transition={{ duration: prefersReducedMotion ? 0 : durations.slow }}
              viewport={{ once: true }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFeedback('down')}
                className={cn(
                  'h-7 w-7 rounded-md transition-all',
                  feedbackGiven === 'down' &&
                    'text-destructive bg-destructive/10'
                )}
                aria-label="Poor response"
              >
                <ThumbsDownIcon size={14} />
              </Button>
            </motion.div>
          </motion.div>

          {/* Report Button */}
          {onReport && (
            <motion.div
              {...ANIMATION_PRESETS.scale}
              transition={{ delay: prefersReducedMotion ? 0 : 0.25, duration: prefersReducedMotion ? 0 : durations.normal }}
              viewport={{ once: true }}
              className="relative"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReportMenu(!showReportMenu)}
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-orange-600"
                aria-label="Report message"
              >
                <FlagIcon size={14} />
              </Button>

              {/* Report Menu */}
              {showReportMenu && (
                <motion.div
                  {...ANIMATION_PRESETS.slideDown}
                  viewport={{ once: true }}
                  className="absolute bottom-full left-0 mb-2 z-50"
                >
                  <div className="bg-popover text-popover-foreground border rounded-lg shadow-lg p-2 text-xs w-48">
                    <div className="font-semibold mb-2 px-2">
                      Report Message
                    </div>
                    <button
                      onClick={() => handleReport('harmful')}
                      className="w-full text-left px-2 py-1.5 hover:bg-accent rounded"
                    >
                      Harmful content
                    </button>
                    <button
                      onClick={() => handleReport('inappropriate')}
                      className="w-full text-left px-2 py-1.5 hover:bg-accent rounded"
                    >
                      Inappropriate
                    </button>
                    <button
                      onClick={() => handleReport('spam')}
                      className="w-full text-left px-2 py-1.5 hover:bg-accent rounded"
                    >
                      Spam
                    </button>
                    <button
                      onClick={() => handleReport('incorrect')}
                      className="w-full text-left px-2 py-1.5 hover:bg-accent rounded"
                    >
                      Incorrect information
                    </button>
                    <button
                      onClick={() => handleReport('other')}
                      className="w-full text-left px-2 py-1.5 hover:bg-accent rounded"
                    >
                      Other
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Retry button */}
          {hasError && onRetry && (
            <motion.div
              {...ANIMATION_PRESETS.scale}
              transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0 : durations.normal }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              viewport={{ once: true }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onRetry}
                className="h-7 w-7 rounded-md"
                aria-label="Retry"
              >
                <RefreshIcon size={14} />
              </Button>
            </motion.div>
          )}

          {/* Edit button for user messages */}
          {isUserMessage && onEdit && (
            <motion.div
              {...ANIMATION_PRESETS.scale}
              transition={{ delay: prefersReducedMotion ? 0 : 0.35, duration: prefersReducedMotion ? 0 : durations.normal }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              viewport={{ once: true }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(messageId)}
                className="h-7 w-7 rounded-md"
                aria-label="Edit message"
              >
                <EditIcon size={14} />
              </Button>
            </motion.div>
          )}

          {/* Regenerate button for assistant messages */}
          {isAssistantMessage && onRegenerate && !hasError && (
            <motion.div
              {...ANIMATION_PRESETS.scale}
              transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: prefersReducedMotion ? 0 : durations.normal }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              viewport={{ once: true }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRegenerate(messageId)}
                className="h-7 w-7 rounded-md"
                aria-label="Regenerate response"
              >
                <RefreshIcon size={14} />
              </Button>
            </motion.div>
          )}

          {/* Delete button */}
          {onDelete && (
            <motion.div
              {...ANIMATION_PRESETS.scale}
              transition={{ delay: prefersReducedMotion ? 0 : 0.45, duration: prefersReducedMotion ? 0 : durations.normal }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              viewport={{ once: true }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className={cn(
                  'h-7 w-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors',
                  isDeleting && 'opacity-50 cursor-not-allowed'
                )}
                aria-label="Delete message"
              >
                <motion.div
                  {...(isDeleting && !prefersReducedMotion ? ANIMATION_PRESETS.scaleRotate : {})}
                  animate={
                    isDeleting && !prefersReducedMotion
                      ? {
                          ...ANIMATION_PRESETS.scaleRotate.animate,
                          ...DELETE_SHAKE,
                        }
                      : ANIMATION_PRESETS.scaleRotate.animate
                  }
                  transition={{ duration: prefersReducedMotion ? 0 : durations.moderate }}
                  viewport={{ once: true }}
                >
                  <TrashIcon size={14} />
                </motion.div>
              </Button>
            </motion.div>
          )}
        </motion.div>
    )
  }
)

MessageActionsSecure.displayName = 'MessageActionsSecure'
