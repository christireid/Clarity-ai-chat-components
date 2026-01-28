'use client'

/**
 * Sender Component
 *
 * A comprehensive message input component for AI chat interfaces.
 * Inspired by Ant Design X's Sender component.
 *
 * Features:
 * - Auto-resize textarea
 * - File attachments support
 * - Voice input (speech-to-text)
 * - Emoji picker integration
 * - Mention suggestions
 * - Send on Enter (configurable)
 * - Loading/disabled states
 * - Character count limit
 * - Action buttons (customizable)
 * - Keyboard shortcuts
 *
 * @example
 * ```tsx
 * <Sender
 *   value={message}
 *   onChange={setMessage}
 *   onSend={handleSend}
 *   placeholder="Type a message..."
 *   allowAttachments
 *   allowVoice
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

export type SenderVariant = 'default' | 'bordered' | 'filled' | 'minimal'
export type SenderSize = 'sm' | 'md' | 'lg'

export interface SenderAttachment {
  /** Unique ID */
  id: string
  /** File name */
  name: string
  /** File type */
  type: string
  /** File size in bytes */
  size: number
  /** Preview URL (for images) */
  preview?: string
  /** Upload progress (0-100) */
  progress?: number
  /** Upload status */
  status?: 'pending' | 'uploading' | 'complete' | 'error'
  /** Error message */
  error?: string
  /** Original file reference */
  file?: File
}

export interface SenderAction {
  /** Unique key */
  key: string
  /** Icon or label */
  icon: React.ReactNode
  /** Tooltip text */
  tooltip?: string
  /** Click handler */
  onClick?: () => void
  /** Whether action is disabled */
  disabled?: boolean
  /** Whether action is active/toggled */
  active?: boolean
}

export interface SenderProps {
  /** Current value */
  value?: string
  /** Default value */
  defaultValue?: string
  /** Placeholder text */
  placeholder?: string
  /** Variant style */
  variant?: SenderVariant
  /** Size preset */
  size?: SenderSize
  /** Whether to auto-resize */
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  /** Maximum character count */
  maxLength?: number
  /** Whether to show character count */
  showCount?: boolean
  /** Whether input is disabled */
  disabled?: boolean
  /** Whether input is loading */
  isLoading?: boolean
  /** Loading text */
  loadingText?: string
  /** Whether to allow attachments */
  allowAttachments?: boolean
  /** Accepted file types */
  acceptedFileTypes?: string
  /** Maximum file size (bytes) */
  maxFileSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Current attachments */
  attachments?: SenderAttachment[]
  /** Whether to allow voice input */
  allowVoice?: boolean
  /** Whether currently recording voice */
  isRecording?: boolean
  /** Submit on Enter key */
  submitOnEnter?: boolean
  /** Require Shift+Enter for newline */
  shiftEnterForNewline?: boolean
  /** Custom actions */
  actions?: SenderAction[]
  /** Prefix content */
  prefix?: React.ReactNode
  /** Suffix content */
  suffix?: React.ReactNode
  /** Send button label */
  sendLabel?: React.ReactNode
  /** Whether to show send button */
  showSendButton?: boolean
  /** Value change handler */
  onChange?: (value: string) => void
  /** Send/submit handler */
  onSend?: (value: string, attachments?: SenderAttachment[]) => void
  /** Attachment added handler */
  onAttachmentAdd?: (files: File[]) => void
  /** Attachment removed handler */
  onAttachmentRemove?: (attachment: SenderAttachment) => void
  /** Voice recording start handler */
  onVoiceStart?: () => void
  /** Voice recording stop handler */
  onVoiceStop?: () => void
  /** Focus handler */
  onFocus?: () => void
  /** Blur handler */
  onBlur?: () => void
  /** Keydown handler */
  onKeyDown?: (e: React.KeyboardEvent) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Components
// ============================================================================

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const AttachIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

const StopIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
)

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const LoadingSpinner = () => (
  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
)

// ============================================================================
// Attachment Preview Component
// ============================================================================

interface AttachmentPreviewProps {
  attachment: SenderAttachment
  onRemove: () => void
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
  onRemove,
}) => {
  const prefersReducedMotion = useReducedMotion()
  const isImage = attachment.type.startsWith('image/')

  return (
    <motion.div
      className={cn(
        'sender-attachment',
        attachment.status === 'error' && 'sender-attachment-error'
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
      transition={{ duration: DURATION_SECONDS.fast }}
    >
      {isImage && attachment.preview ? (
        <img
          src={attachment.preview}
          alt={attachment.name}
          className="sender-attachment-preview"
        />
      ) : (
        <div className="sender-attachment-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
      )}

      <div className="sender-attachment-info">
        <span className="sender-attachment-name">{attachment.name}</span>
        <span className="sender-attachment-size">
          {formatFileSize(attachment.size)}
        </span>
      </div>

      {/* Progress bar */}
      {attachment.status === 'uploading' && attachment.progress !== undefined && (
        <div className="sender-attachment-progress">
          <div
            className="sender-attachment-progress-bar"
            style={{ width: `${attachment.progress}%` }}
          />
        </div>
      )}

      {/* Remove button */}
      <button
        type="button"
        className="sender-attachment-remove"
        onClick={onRemove}
        aria-label={`Remove ${attachment.name}`}
      >
        <CloseIcon />
      </button>

      {/* Error indicator */}
      {attachment.status === 'error' && (
        <span className="sender-attachment-error-text">
          {attachment.error || 'Upload failed'}
        </span>
      )}
    </motion.div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ============================================================================
// Sender Component
// ============================================================================

export function Sender({
  value: controlledValue,
  defaultValue = '',
  placeholder = 'Type a message...',
  variant = 'default',
  size = 'md',
  autoSize = { minRows: 1, maxRows: 5 },
  maxLength,
  showCount = false,
  disabled = false,
  isLoading = false,
  loadingText = 'Sending...',
  allowAttachments = false,
  acceptedFileTypes,
  maxFileSize,
  maxFiles = 10,
  attachments = [],
  allowVoice = false,
  isRecording = false,
  submitOnEnter = true,
  shiftEnterForNewline = true,
  actions = [],
  prefix,
  suffix,
  sendLabel,
  showSendButton = true,
  onChange,
  onSend,
  onAttachmentAdd,
  onAttachmentRemove,
  onVoiceStart,
  onVoiceStop,
  onFocus,
  onBlur,
  onKeyDown,
  className,
}: SenderProps) {
  const prefersReducedMotion = useReducedMotion()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [isFocused, setIsFocused] = React.useState(false)

  const value = controlledValue ?? internalValue

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea || !autoSize) return

    textarea.style.height = 'auto'
    const computed = window.getComputedStyle(textarea)
    const lineHeight = parseInt(computed.lineHeight)
    const paddingY = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom)

    const minRows = typeof autoSize === 'object' ? autoSize.minRows || 1 : 1
    const maxRows = typeof autoSize === 'object' ? autoSize.maxRows || 5 : 5

    const minHeight = lineHeight * minRows + paddingY
    const maxHeight = lineHeight * maxRows + paddingY

    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
    textarea.style.height = `${newHeight}px`
  }, [value, autoSize])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) return

    setInternalValue(newValue)
    onChange?.(newValue)
  }

  const handleSend = () => {
    if (!value.trim() && attachments.length === 0) return
    if (disabled || isLoading) return

    onSend?.(value, attachments)
    setInternalValue('')
    onChange?.('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e)

    if (e.key === 'Enter') {
      if (submitOnEnter && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      } else if (shiftEnterForNewline && e.shiftKey) {
        // Allow newline
      }
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file count
    if (attachments.length + files.length > maxFiles) {
      console.warn(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate file size
    if (maxFileSize) {
      const oversized = files.filter((f) => f.size > maxFileSize)
      if (oversized.length > 0) {
        console.warn(`Some files exceed the maximum size of ${formatFileSize(maxFileSize)}`)
      }
    }

    onAttachmentAdd?.(files)
    e.target.value = '' // Reset input
  }

  const handleVoiceToggle = () => {
    if (isRecording) {
      onVoiceStop?.()
    } else {
      onVoiceStart?.()
    }
  }

  const canSend = (value.trim().length > 0 || attachments.length > 0) && !disabled && !isLoading

  return (
    <div
      className={cn(
        'sender',
        `sender-${variant}`,
        `sender-${size}`,
        isFocused && 'sender-focused',
        disabled && 'sender-disabled',
        isLoading && 'sender-loading',
        className
      )}
    >
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="sender-attachments">
          <AnimatePresence>
            {attachments.map((attachment) => (
              <AttachmentPreview
                key={attachment.id}
                attachment={attachment}
                onRemove={() => onAttachmentRemove?.(attachment)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Main input area */}
      <div className="sender-input-wrapper">
        {/* Prefix */}
        {prefix && <div className="sender-prefix">{prefix}</div>}

        {/* Left actions */}
        <div className="sender-actions-left">
          {allowAttachments && (
            <>
              <button
                type="button"
                className="sender-action-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || attachments.length >= maxFiles}
                aria-label="Attach files"
                title="Attach files"
              >
                <AttachIcon />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="sender-file-input"
                accept={acceptedFileTypes}
                multiple
                onChange={handleFileSelect}
              />
            </>
          )}

          {allowVoice && (
            <button
              type="button"
              className={cn(
                'sender-action-btn',
                isRecording && 'sender-action-btn-active'
              )}
              onClick={handleVoiceToggle}
              disabled={disabled}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
              title={isRecording ? 'Stop recording' : 'Voice input'}
            >
              {isRecording ? <StopIcon /> : <MicIcon />}
            </button>
          )}

          {/* Custom actions */}
          {actions.map((action) => (
            <button
              key={action.key}
              type="button"
              className={cn(
                'sender-action-btn',
                action.active && 'sender-action-btn-active'
              )}
              onClick={action.onClick}
              disabled={disabled || action.disabled}
              aria-label={action.tooltip}
              title={action.tooltip}
            >
              {action.icon}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="sender-textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          maxLength={maxLength}
          rows={1}
          aria-label="Message input"
        />

        {/* Suffix */}
        {suffix && <div className="sender-suffix">{suffix}</div>}

        {/* Right actions / Send button */}
        <div className="sender-actions-right">
          {showCount && maxLength && (
            <span className="sender-char-count">
              {value.length}/{maxLength}
            </span>
          )}

          {showSendButton && (
            <motion.button
              type="button"
              className={cn(
                'sender-send-btn',
                canSend && 'sender-send-btn-active'
              )}
              onClick={handleSend}
              disabled={!canSend}
              whileHover={!prefersReducedMotion && canSend ? { scale: 1.05 } : {}}
              whileTap={!prefersReducedMotion && canSend ? { scale: 0.95 } : {}}
              aria-label="Send message"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  {loadingText && (
                    <span className="sender-send-text">{loadingText}</span>
                  )}
                </>
              ) : (
                <>
                  {sendLabel || <SendIcon />}
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// useSender Hook
// ============================================================================

export interface UseSenderOptions {
  /** Initial value */
  initialValue?: string
  /** Max length */
  maxLength?: number
  /** On send callback */
  onSend?: (value: string, attachments?: SenderAttachment[]) => void
}

export interface UseSenderReturn {
  /** Current value */
  value: string
  /** Set value */
  setValue: React.Dispatch<React.SetStateAction<string>>
  /** Attachments */
  attachments: SenderAttachment[]
  /** Add attachments */
  addAttachments: (files: File[]) => void
  /** Remove attachment */
  removeAttachment: (id: string) => void
  /** Clear attachments */
  clearAttachments: () => void
  /** Send message */
  send: () => void
  /** Clear all */
  clear: () => void
  /** Is loading */
  isLoading: boolean
  /** Set loading */
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export function useSender(options: UseSenderOptions = {}): UseSenderReturn {
  const { initialValue = '', onSend } = options

  const [value, setValue] = React.useState(initialValue)
  const [attachments, setAttachments] = React.useState<SenderAttachment[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const addAttachments = React.useCallback((files: File[]) => {
    const newAttachments: SenderAttachment[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined,
      status: 'complete',
      file,
    }))
    setAttachments((prev) => [...prev, ...newAttachments])
  }, [])

  const removeAttachment = React.useCallback((id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id)
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview)
      }
      return prev.filter((a) => a.id !== id)
    })
  }, [])

  const clearAttachments = React.useCallback(() => {
    attachments.forEach((a) => {
      if (a.preview) URL.revokeObjectURL(a.preview)
    })
    setAttachments([])
  }, [attachments])

  const send = React.useCallback(() => {
    if (!value.trim() && attachments.length === 0) return
    onSend?.(value, attachments)
    setValue('')
    clearAttachments()
  }, [value, attachments, onSend, clearAttachments])

  const clear = React.useCallback(() => {
    setValue('')
    clearAttachments()
  }, [clearAttachments])

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.preview) URL.revokeObjectURL(a.preview)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    value,
    setValue,
    attachments,
    addAttachments,
    removeAttachment,
    clearAttachments,
    send,
    clear,
    isLoading,
    setIsLoading,
  }
}

export default Sender
