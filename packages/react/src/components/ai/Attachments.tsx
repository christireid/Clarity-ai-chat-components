'use client'

/**
 * Attachments Component
 *
 * A component for displaying file attachments in chat messages.
 * Supports images, documents, code files, and other file types.
 *
 * Features:
 * - Multiple layout variants (grid, list, compact, chips)
 * - File type detection with icons
 * - Image preview thumbnails
 * - File size and type display
 * - Remove/download actions
 * - Drag and drop reordering
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <Attachments
 *   files={[
 *     { id: '1', name: 'photo.jpg', type: 'image/jpeg', size: 1024000, url: '/uploads/photo.jpg' },
 *     { id: '2', name: 'document.pdf', type: 'application/pdf', size: 512000 },
 *   ]}
 *   onRemove={(id) => handleRemove(id)}
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

export type AttachmentsVariant = 'grid' | 'list' | 'compact' | 'chips'
export type AttachmentsSize = 'sm' | 'md' | 'lg'

export interface AttachmentFile {
  /** Unique identifier */
  id: string
  /** File name */
  name: string
  /** MIME type */
  type: string
  /** File size in bytes */
  size: number
  /** Preview URL (for images) */
  url?: string
  /** Thumbnail URL */
  thumbnail?: string
  /** Upload progress (0-100) */
  progress?: number
  /** Error message */
  error?: string
  /** Whether file is uploading */
  isUploading?: boolean
}

export interface AttachmentsProps {
  /** Array of files */
  files: AttachmentFile[]
  /** Visual variant */
  variant?: AttachmentsVariant
  /** Size preset */
  size?: AttachmentsSize
  /** Max files to show before collapsing */
  maxVisible?: number
  /** Allow removal */
  removable?: boolean
  /** Allow download */
  downloadable?: boolean
  /** Show file size */
  showSize?: boolean
  /** Show file type */
  showType?: boolean
  /** Remove handler */
  onRemove?: (id: string) => void
  /** Download handler */
  onDownload?: (file: AttachmentFile) => void
  /** Click handler */
  onClick?: (file: AttachmentFile) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getFileCategory(type: string): 'image' | 'video' | 'audio' | 'document' | 'code' | 'archive' | 'other' {
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  if (type.includes('pdf') || type.includes('document') || type.includes('word') || type.includes('sheet') || type.includes('presentation')) return 'document'
  if (type.includes('javascript') || type.includes('typescript') || type.includes('python') || type.includes('json') || type.includes('xml') || type.includes('html') || type.includes('css') || type.includes('text/')) return 'code'
  if (type.includes('zip') || type.includes('tar') || type.includes('rar') || type.includes('7z')) return 'archive'
  return 'other'
}

function getFileIcon(type: string): React.ReactNode {
  const category = getFileCategory(type)

  switch (category) {
    case 'image':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      )
    case 'video':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <polygon points="10 9 15 12 10 15" fill="currentColor" />
        </svg>
      )
    case 'audio':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
    case 'document':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    case 'code':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    case 'archive':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 8v13H3V8" />
          <path d="M1 3h22v5H1z" />
          <path d="M10 12h4" />
        </svg>
      )
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )
  }
}

function getFileExtension(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : ''
}

// ============================================================================
// AttachmentItem Component
// ============================================================================

interface AttachmentItemProps {
  file: AttachmentFile
  variant: AttachmentsVariant
  size: AttachmentsSize
  removable: boolean
  downloadable: boolean
  showSize: boolean
  showType: boolean
  onRemove?: () => void
  onDownload?: () => void
  onClick?: () => void
}

function AttachmentItem({
  file,
  variant,
  size,
  removable,
  downloadable,
  showSize,
  showType,
  onRemove,
  onDownload,
  onClick,
}: AttachmentItemProps) {
  const prefersReducedMotion = useReducedMotion()
  const category = getFileCategory(file.type)
  const isImage = category === 'image' && (file.url || file.thumbnail)
  const extension = getFileExtension(file.name)

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.()
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload?.()
  }

  // Chip variant
  if (variant === 'chips') {
    return (
      <motion.div
        className={cn(
          'attachment-chip',
          `attachment-chip-${size}`,
          file.error && 'attachment-chip-error',
          file.isUploading && 'attachment-chip-uploading'
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        transition={{ duration: DURATION_SECONDS.fast }}
      >
        <span className="attachment-chip-icon">{getFileIcon(file.type)}</span>
        <span className="attachment-chip-name">{file.name}</span>
        {removable && (
          <button
            type="button"
            className="attachment-chip-remove"
            onClick={handleRemove}
            aria-label={`Remove ${file.name}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        {file.isUploading && file.progress !== undefined && (
          <div className="attachment-chip-progress" style={{ width: `${file.progress}%` }} />
        )}
      </motion.div>
    )
  }

  // Grid/List/Compact variants
  return (
    <motion.div
      className={cn(
        'attachment-item',
        `attachment-item-${variant}`,
        `attachment-item-${size}`,
        file.error && 'attachment-item-error',
        file.isUploading && 'attachment-item-uploading'
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
      transition={{ duration: DURATION_SECONDS.fast }}
      whileHover={onClick ? { scale: 1.02 } : {}}
    >
      {/* Thumbnail/Icon */}
      <div className={cn('attachment-preview', `attachment-preview-${category}`)}>
        {isImage ? (
          <img
            src={file.thumbnail || file.url}
            alt={file.name}
            className="attachment-thumbnail"
          />
        ) : (
          <div className="attachment-icon">
            {getFileIcon(file.type)}
            {extension && <span className="attachment-extension">{extension}</span>}
          </div>
        )}

        {/* Upload progress overlay */}
        {file.isUploading && (
          <div className="attachment-progress-overlay">
            <div
              className="attachment-progress-bar"
              style={{ width: `${file.progress || 0}%` }}
            />
            <span className="attachment-progress-text">{file.progress || 0}%</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="attachment-info">
        <span className="attachment-name" title={file.name}>
          {file.name}
        </span>
        <div className="attachment-meta">
          {showType && <span className="attachment-type">{extension || file.type}</span>}
          {showSize && <span className="attachment-size">{formatFileSize(file.size)}</span>}
        </div>
        {file.error && (
          <span className="attachment-error">{file.error}</span>
        )}
      </div>

      {/* Actions */}
      <div className="attachment-actions">
        {downloadable && !file.isUploading && (
          <button
            type="button"
            className="attachment-action"
            onClick={handleDownload}
            aria-label={`Download ${file.name}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        )}
        {removable && (
          <button
            type="button"
            className="attachment-action attachment-action-remove"
            onClick={handleRemove}
            aria-label={`Remove ${file.name}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// Attachments Component
// ============================================================================

export function Attachments({
  files,
  variant = 'grid',
  size = 'md',
  maxVisible,
  removable = false,
  downloadable = false,
  showSize = true,
  showType = true,
  onRemove,
  onDownload,
  onClick,
  className,
}: AttachmentsProps) {
  const prefersReducedMotion = useReducedMotion()
  const [showAll, setShowAll] = React.useState(false)

  const visibleFiles = maxVisible && !showAll ? files.slice(0, maxVisible) : files
  const hiddenCount = maxVisible && !showAll ? Math.max(0, files.length - maxVisible) : 0

  if (files.length === 0) return null

  return (
    <motion.div
      className={cn(
        'attachments',
        `attachments-${variant}`,
        `attachments-${size}`,
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_SECONDS.normal }}
      role="list"
      aria-label={`${files.length} attachment${files.length > 1 ? 's' : ''}`}
    >
      <AnimatePresence mode="popLayout">
        {visibleFiles.map((file, index) => (
          <AttachmentItem
            key={file.id}
            file={file}
            variant={variant}
            size={size}
            removable={removable}
            downloadable={downloadable}
            showSize={showSize}
            showType={showType}
            onRemove={onRemove ? () => onRemove(file.id) : undefined}
            onDownload={onDownload ? () => onDownload(file) : undefined}
            onClick={onClick ? () => onClick(file) : undefined}
          />
        ))}
      </AnimatePresence>

      {hiddenCount > 0 && (
        <button
          type="button"
          className="attachments-more"
          onClick={() => setShowAll(true)}
        >
          +{hiddenCount} more
        </button>
      )}
    </motion.div>
  )
}

// ============================================================================
// useAttachments Hook
// ============================================================================

export interface UseAttachmentsOptions {
  /** Initial files */
  initialFiles?: AttachmentFile[]
  /** Max file size (bytes) */
  maxFileSize?: number
  /** Allowed file types (MIME) */
  allowedTypes?: string[]
  /** Max number of files */
  maxFiles?: number
}

export interface UseAttachmentsReturn {
  /** Current files */
  files: AttachmentFile[]
  /** Add files */
  addFiles: (newFiles: File[]) => void
  /** Remove file */
  removeFile: (id: string) => void
  /** Update file progress */
  updateProgress: (id: string, progress: number) => void
  /** Set file error */
  setError: (id: string, error: string) => void
  /** Clear all files */
  clear: () => void
  /** Total size of all files */
  totalSize: number
  /** Number of uploading files */
  uploadingCount: number
  /** Validation errors */
  validationErrors: string[]
}

export function useAttachments(options: UseAttachmentsOptions = {}): UseAttachmentsReturn {
  const { initialFiles = [], maxFileSize, allowedTypes, maxFiles } = options
  const [files, setFiles] = React.useState<AttachmentFile[]>(initialFiles)
  const [validationErrors, setValidationErrors] = React.useState<string[]>([])

  const addFiles = React.useCallback(
    (newFiles: File[]) => {
      const errors: string[] = []
      const validFiles: AttachmentFile[] = []

      for (const file of newFiles) {
        // Check max files
        if (maxFiles && files.length + validFiles.length >= maxFiles) {
          errors.push(`Maximum ${maxFiles} files allowed`)
          break
        }

        // Check file size
        if (maxFileSize && file.size > maxFileSize) {
          errors.push(`${file.name} exceeds max size`)
          continue
        }

        // Check file type
        if (allowedTypes && !allowedTypes.some((t) => file.type.match(t))) {
          errors.push(`${file.name} type not allowed`)
          continue
        }

        validFiles.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          isUploading: true,
          progress: 0,
        })
      }

      setValidationErrors(errors)
      setFiles((prev) => [...prev, ...validFiles])
    },
    [files.length, maxFileSize, allowedTypes, maxFiles]
  )

  const removeFile = React.useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file?.url) {
        URL.revokeObjectURL(file.url)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const updateProgress = React.useCallback((id: string, progress: number) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, progress, isUploading: progress < 100 }
          : f
      )
    )
  }, [])

  const setError = React.useCallback((id: string, error: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, error, isUploading: false }
          : f
      )
    )
  }, [])

  const clear = React.useCallback(() => {
    files.forEach((f) => f.url && URL.revokeObjectURL(f.url))
    setFiles([])
    setValidationErrors([])
  }, [files])

  const totalSize = React.useMemo(
    () => files.reduce((sum, f) => sum + f.size, 0),
    [files]
  )

  const uploadingCount = React.useMemo(
    () => files.filter((f) => f.isUploading).length,
    [files]
  )

  return {
    files,
    addFiles,
    removeFile,
    updateProgress,
    setError,
    clear,
    totalSize,
    uploadingCount,
    validationErrors,
  }
}

export default Attachments
