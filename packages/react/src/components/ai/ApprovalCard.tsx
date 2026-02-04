'use client'

/**
 * ApprovalCard Component
 *
 * A card component for displaying approval requests that require user action.
 * Used for tool confirmations, permission requests, sensitive operations.
 *
 * Features:
 * - Multiple variants (default, warning, danger)
 * - Approve/reject actions
 * - Custom action buttons
 * - Timer/countdown support
 * - Details expansion
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <ApprovalCard
 *   title="Execute shell command?"
 *   description="The AI wants to run: npm install"
 *   intent="warning"
 *   onApprove={() => executeCommand()}
 *   onReject={() => cancelCommand()}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type ApprovalCardIntent = 'default' | 'warning' | 'danger' | 'info'
export type ApprovalCardSize = 'sm' | 'md' | 'lg'

export interface ApprovalDetail {
  /** Detail label */
  label: string
  /** Detail value */
  value: string | React.ReactNode
  /** Whether value is code/monospace */
  isCode?: boolean
}

export interface ApprovalCardProps {
  /** Title */
  title: string
  /** Description */
  description?: string
  /** Intent/severity */
  intent?: ApprovalCardIntent
  /** Size preset */
  size?: ApprovalCardSize
  /** Icon */
  icon?: React.ReactNode
  /** Details list */
  details?: ApprovalDetail[]
  /** Whether details are expanded by default */
  defaultDetailsExpanded?: boolean
  /** Approve button label */
  approveLabel?: string
  /** Reject button label */
  rejectLabel?: string
  /** Auto-reject countdown (seconds) */
  autoRejectIn?: number
  /** Show "Always allow" option */
  showAlwaysAllow?: boolean
  /** Whether approving */
  isApproving?: boolean
  /** Whether rejecting */
  isRejecting?: boolean
  /** Approve handler */
  onApprove?: () => void
  /** Reject handler */
  onReject?: () => void
  /** Always allow handler */
  onAlwaysAllow?: () => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Components
// ============================================================================

function getIntentIcon(intent: ApprovalCardIntent): React.ReactNode {
  switch (intent) {
    case 'danger':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 'warning':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    case 'info':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

// ============================================================================
// ApprovalCard Component
// ============================================================================

export function ApprovalCard({
  title,
  description,
  intent = 'default',
  size = 'md',
  icon,
  details,
  defaultDetailsExpanded = false,
  approveLabel = 'Approve',
  rejectLabel = 'Reject',
  autoRejectIn,
  showAlwaysAllow = false,
  isApproving = false,
  isRejecting = false,
  onApprove,
  onReject,
  onAlwaysAllow,
  className,
}: ApprovalCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const [detailsExpanded, setDetailsExpanded] = React.useState(defaultDetailsExpanded)
  const [countdown, setCountdown] = React.useState(autoRejectIn || 0)

  // Countdown timer
  React.useEffect(() => {
    if (!autoRejectIn) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onReject?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [autoRejectIn, onReject])

  const displayIcon = icon || getIntentIcon(intent)
  const isDisabled = isApproving || isRejecting

  return (
    <motion.div
      className={cn(
        'approval-card',
        `approval-card-${intent}`,
        `approval-card-${size}`,
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: DURATION_SECONDS.normal,
        ease: EASING_FRAMER.standard,
      }}
      role="alertdialog"
      aria-labelledby="approval-title"
      aria-describedby={description ? 'approval-description' : undefined}
    >
      {/* Icon */}
      <div className={cn('approval-card-icon', `approval-card-icon-${intent}`)}>
        {displayIcon}
      </div>

      {/* Content */}
      <div className="approval-card-content">
        <h4 id="approval-title" className="approval-card-title">
          {title}
        </h4>

        {description && (
          <p id="approval-description" className="approval-card-description">
            {description}
          </p>
        )}

        {/* Details */}
        {details && details.length > 0 && (
          <div className="approval-card-details-wrapper">
            <button
              type="button"
              className="approval-card-details-toggle"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              aria-expanded={detailsExpanded}
            >
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                animate={{ rotate: detailsExpanded ? 90 : 0 }}
                transition={{ duration: DURATION_SECONDS.fast }}
              >
                <polyline points="9 18 15 12 9 6" />
              </motion.svg>
              <span>Details</span>
            </button>

            <AnimatePresence>
              {detailsExpanded && (
                <motion.div
                  className="approval-card-details"
                  initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                  transition={{ duration: DURATION_SECONDS.fast }}
                >
                  {details.map((detail, index) => (
                    <div key={index} className="approval-card-detail">
                      <span className="approval-card-detail-label">
                        {detail.label}
                      </span>
                      <span
                        className={cn(
                          'approval-card-detail-value',
                          detail.isCode && 'approval-card-detail-code'
                        )}
                      >
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Countdown */}
        {autoRejectIn && countdown > 0 && (
          <div className="approval-card-countdown">
            <span>Auto-rejecting in {countdown}s</span>
            <div className="approval-card-countdown-bar">
              <motion.div
                className="approval-card-countdown-fill"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{
                  duration: autoRejectIn,
                  ease: 'linear',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="approval-card-actions">
        {/* Always allow */}
        {showAlwaysAllow && onAlwaysAllow && (
          <button
            type="button"
            className="approval-card-action approval-card-action-always"
            onClick={onAlwaysAllow}
            disabled={isDisabled}
          >
            Always allow
          </button>
        )}

        {/* Reject */}
        <button
          type="button"
          className="approval-card-action approval-card-action-reject"
          onClick={onReject}
          disabled={isDisabled}
        >
          {isRejecting ? (
            <span className="approval-card-spinner" />
          ) : (
            rejectLabel
          )}
        </button>

        {/* Approve */}
        <button
          type="button"
          className={cn(
            'approval-card-action',
            'approval-card-action-approve',
            intent === 'danger' && 'approval-card-action-danger'
          )}
          onClick={onApprove}
          disabled={isDisabled}
        >
          {isApproving ? (
            <span className="approval-card-spinner" />
          ) : (
            approveLabel
          )}
        </button>
      </div>
    </motion.div>
  )
}

export default ApprovalCard
