/**
 * Confirmation Dialog Component
 * Accessible modal dialog for confirming destructive actions
 */

'use client'

import * as React from 'react'
import { AlertTriangleIcon, CloseIcon } from './icons'
import { LoadingButton } from './loading-state'

export interface ConfirmationDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Called when the dialog should close */
  onClose: () => void
  /** Called when the user confirms */
  onConfirm: () => void | Promise<void>
  /** Dialog title */
  title: string
  /** Dialog message/description */
  message: string
  /** Text for the confirm button */
  confirmText?: string
  /** Text for the cancel button */
  cancelText?: string
  /** Variant affects styling (danger for destructive actions) */
  variant?: 'default' | 'danger'
  /** Additional CSS class */
  className?: string
  /** Whether the confirm action is loading */
  isLoading?: boolean
  /** Icon to show (defaults to warning for danger variant) */
  icon?: React.ReactNode
}

/**
 * Confirmation Dialog Component
 * Modal dialog for confirming actions with accessibility support
 */
export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  className,
  isLoading = false,
  icon,
}: ConfirmationDialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const previousActiveElement = React.useRef<HTMLElement | null>(null)

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, isLoading])

  // Focus management
  React.useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      // Focus the dialog after a brief delay for animation
      setTimeout(() => {
        dialogRef.current?.focus()
      }, 50)
    } else {
      // Restore focus when closing
      previousActiveElement.current?.focus()
    }
  }, [isOpen])

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
    return undefined
  }, [isOpen])

  // Handle confirm
  const handleConfirm = async () => {
    await onConfirm()
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  if (!isOpen) return null

  const defaultIcon =
    variant === 'danger' ? <AlertTriangleIcon size="lg" /> : null

  return (
    <div
      className={`confirmation-dialog-overlay ${className || ''}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={`confirmation-dialog confirmation-dialog-${variant}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        tabIndex={-1}
      >
        <header className="confirmation-dialog-header">
          {(icon || defaultIcon) && (
            <div
              className={`confirmation-dialog-icon confirmation-dialog-icon-${variant}`}
            >
              {icon || defaultIcon}
            </div>
          )}
          <h2
            id="confirmation-dialog-title"
            className="confirmation-dialog-title"
          >
            {title}
          </h2>
          <button
            className="dt-btn dt-btn-ghost dt-btn-icon confirmation-dialog-close"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isLoading}
          >
            <CloseIcon size={20} />
          </button>
        </header>

        <div
          id="confirmation-dialog-description"
          className="confirmation-dialog-body"
        >
          <p>{message}</p>
        </div>

        <footer className="confirmation-dialog-footer">
          <button
            className="dt-btn dt-btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <LoadingButton
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            isLoading={isLoading}
            loadingText={confirmText}
          >
            {confirmText}
          </LoadingButton>
        </footer>
      </div>
    </div>
  )
}

/**
 * Hook for managing confirmation dialog state
 */
export interface UseConfirmationDialogOptions {
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

export function useConfirmationDialog(options: UseConfirmationDialogOptions) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const open = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => {
    if (!isLoading) {
      setIsOpen(false)
      options.onCancel?.()
    }
  }, [isLoading, options])

  const confirm = React.useCallback(async () => {
    setIsLoading(true)
    try {
      await options.onConfirm()
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [options])

  return {
    isOpen,
    isLoading,
    open,
    close,
    confirm,
    dialogProps: {
      isOpen,
      isLoading,
      onClose: close,
      onConfirm: confirm,
    },
  }
}

export default ConfirmationDialog
