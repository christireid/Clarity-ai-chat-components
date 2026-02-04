'use client'

/**
 * Confirmation Component
 *
 * A confirmation dialog/card for AI actions that require user approval.
 * Used for tool execution confirmations, destructive actions, etc.
 *
 * Features:
 * - Multiple variants (card, inline, modal, toast)
 * - Customizable actions (confirm, cancel, custom)
 * - Countdown timer support
 * - Keyboard shortcuts
 * - Loading states
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <Confirmation
 *   title="Delete file?"
 *   description="This action cannot be undone."
 *   confirmLabel="Delete"
 *   confirmVariant="destructive"
 *   onConfirm={() => handleDelete()}
 *   onCancel={() => handleCancel()}
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

export type ConfirmationVariant = 'card' | 'inline' | 'banner' | 'compact'
export type ConfirmationIntent = 'default' | 'destructive' | 'warning' | 'info'

export interface ConfirmationAction {
  /** Action label */
  label: string
  /** Action key/identifier */
  key: string
  /** Action variant */
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  /** Whether action is loading */
  isLoading?: boolean
  /** Whether action is disabled */
  isDisabled?: boolean
  /** Keyboard shortcut */
  shortcut?: string
}

export interface ConfirmationProps {
  /** Title text */
  title: string
  /** Description text */
  description?: string
  /** Visual variant */
  variant?: ConfirmationVariant
  /** Intent/severity */
  intent?: ConfirmationIntent
  /** Icon to display */
  icon?: React.ReactNode
  /** Confirm button label */
  confirmLabel?: string
  /** Cancel button label */
  cancelLabel?: string
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'destructive'
  /** Custom actions (overrides confirm/cancel) */
  actions?: ConfirmationAction[]
  /** Whether confirm is loading */
  isConfirmLoading?: boolean
  /** Whether component is dismissible */
  dismissible?: boolean
  /** Auto-confirm countdown (seconds) */
  autoConfirmIn?: number
  /** Auto-dismiss countdown (seconds) */
  autoDismissIn?: number
  /** Show keyboard shortcuts */
  showShortcuts?: boolean
  /** Confirm handler */
  onConfirm?: () => void
  /** Cancel handler */
  onCancel?: () => void
  /** Custom action handler */
  onAction?: (key: string) => void
  /** Dismiss handler */
  onDismiss?: () => void
  /** Additional class names */
  className?: string
  /** Children (additional content) */
  children?: React.ReactNode
}

// ============================================================================
// Helper Components
// ============================================================================

function getIntentIcon(intent: ConfirmationIntent): React.ReactNode {
  switch (intent) {
    case 'destructive':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 'warning':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    case 'info':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

// ============================================================================
// Confirmation Component
// ============================================================================

export function Confirmation({
  title,
  description,
  variant = 'card',
  intent = 'default',
  icon,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  actions,
  isConfirmLoading = false,
  dismissible = true,
  autoConfirmIn,
  autoDismissIn,
  showShortcuts = false,
  onConfirm,
  onCancel,
  onAction,
  onDismiss,
  className,
  children,
}: ConfirmationProps) {
  const prefersReducedMotion = useReducedMotion()
  const [countdown, setCountdown] = React.useState(autoConfirmIn || autoDismissIn || 0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Countdown timer
  React.useEffect(() => {
    if (!autoConfirmIn && !autoDismissIn) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (autoConfirmIn) onConfirm?.()
          if (autoDismissIn) onDismiss?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [autoConfirmIn, autoDismissIn, onConfirm, onDismiss])

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) {
        onCancel?.()
        onDismiss?.()
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onConfirm?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dismissible, onCancel, onConfirm, onDismiss])

  // Focus trap
  React.useEffect(() => {
    containerRef.current?.focus()
  }, [])

  const displayIcon = icon || getIntentIcon(intent)

  const defaultActions: ConfirmationAction[] = actions || [
    {
      label: cancelLabel,
      key: 'cancel',
      variant: 'ghost',
      shortcut: 'Esc',
    },
    {
      label: confirmLabel,
      key: 'confirm',
      variant: confirmVariant === 'destructive' ? 'destructive' : 'primary',
      isLoading: isConfirmLoading,
      shortcut: '⌘↵',
    },
  ]

  const handleAction = (key: string) => {
    if (key === 'confirm') onConfirm?.()
    else if (key === 'cancel') onCancel?.()
    else onAction?.(key)
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'confirmation',
        `confirmation-${variant}`,
        `confirmation-${intent}`,
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -8, scale: 0.98 }}
      transition={{
        duration: DURATION_SECONDS.normal,
        ease: EASING_FRAMER.standard,
      }}
      role="alertdialog"
      aria-labelledby="confirmation-title"
      aria-describedby={description ? 'confirmation-description' : undefined}
      tabIndex={-1}
    >
      {/* Icon */}
      <div className={cn('confirmation-icon', `confirmation-icon-${intent}`)}>
        {displayIcon}
      </div>

      {/* Content */}
      <div className="confirmation-content">
        <h4 id="confirmation-title" className="confirmation-title">
          {title}
        </h4>
        {description && (
          <p id="confirmation-description" className="confirmation-description">
            {description}
          </p>
        )}
        {children}

        {/* Countdown */}
        {countdown > 0 && (autoConfirmIn || autoDismissIn) && (
          <div className="confirmation-countdown">
            {autoConfirmIn ? 'Auto-confirming' : 'Dismissing'} in {countdown}s
            <div className="confirmation-countdown-bar">
              <motion.div
                className="confirmation-countdown-fill"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{
                  duration: autoConfirmIn || autoDismissIn || 0,
                  ease: 'linear',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="confirmation-actions">
        {defaultActions.map((action) => (
          <button
            key={action.key}
            type="button"
            className={cn(
              'confirmation-action',
              `confirmation-action-${action.variant || 'secondary'}`,
              action.isLoading && 'confirmation-action-loading'
            )}
            onClick={() => handleAction(action.key)}
            disabled={action.isDisabled || action.isLoading}
          >
            {action.isLoading ? (
              <span className="confirmation-spinner" />
            ) : (
              action.label
            )}
            {showShortcuts && action.shortcut && (
              <kbd className="confirmation-shortcut">{action.shortcut}</kbd>
            )}
          </button>
        ))}
      </div>

      {/* Dismiss button */}
      {dismissible && variant !== 'inline' && (
        <button
          type="button"
          className="confirmation-dismiss"
          onClick={onDismiss || onCancel}
          aria-label="Dismiss"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </motion.div>
  )
}

// ============================================================================
// ConfirmationProvider Context
// ============================================================================

interface ConfirmationContextValue {
  confirm: (props: Omit<ConfirmationProps, 'onConfirm' | 'onCancel'>) => Promise<boolean>
  alert: (props: Omit<ConfirmationProps, 'onConfirm' | 'onCancel' | 'cancelLabel'>) => Promise<void>
}

const ConfirmationContext = React.createContext<ConfirmationContextValue | null>(null)

export function useConfirmation() {
  const context = React.useContext(ConfirmationContext)
  if (!context) {
    throw new Error('useConfirmation must be used within ConfirmationProvider')
  }
  return context
}

export interface ConfirmationProviderProps {
  children: React.ReactNode
}

export function ConfirmationProvider({ children }: ConfirmationProviderProps) {
  const [state, setState] = React.useState<{
    props: ConfirmationProps | null
    resolve: ((value: boolean) => void) | null
  }>({ props: null, resolve: null })

  const confirm = React.useCallback(
    (props: Omit<ConfirmationProps, 'onConfirm' | 'onCancel'>): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          props: {
            ...props,
            onConfirm: () => {
              setState({ props: null, resolve: null })
              resolve(true)
            },
            onCancel: () => {
              setState({ props: null, resolve: null })
              resolve(false)
            },
          },
          resolve,
        })
      })
    },
    []
  )

  const alert = React.useCallback(
    (props: Omit<ConfirmationProps, 'onConfirm' | 'onCancel' | 'cancelLabel'>): Promise<void> => {
      return new Promise((resolve) => {
        setState({
          props: {
            ...props,
            cancelLabel: undefined,
            onConfirm: () => {
              setState({ props: null, resolve: null })
              resolve()
            },
          },
          resolve: () => resolve(),
        })
      })
    },
    []
  )

  return (
    <ConfirmationContext.Provider value={{ confirm, alert }}>
      {children}
      <AnimatePresence>
        {state.props && (
          <div className="confirmation-overlay">
            <Confirmation {...state.props} />
          </div>
        )}
      </AnimatePresence>
    </ConfirmationContext.Provider>
  )
}

export default Confirmation
