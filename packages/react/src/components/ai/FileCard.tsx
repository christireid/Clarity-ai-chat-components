'use client'

/**
 * FileCard Component
 *
 * A file display component with preview, actions, and upload progress.
 * Inspired by Ant Design X's FileCard component for AI chat interfaces.
 *
 * Features:
 * - File type detection and icons
 * - Image preview
 * - Upload progress
 * - File actions (download, delete, preview)
 * - Multiple display variants
 * - Drag and drop support
 *
 * @example
 * ```tsx
 * <FileCard
 *   file={{
 *     name: 'document.pdf',
 *     size: 1024000,
 *     type: 'application/pdf',
 *     url: '/files/document.pdf',
 *   }}
 *   onDownload={(file) => console.log('Download', file)}
 *   onRemove={(file) => console.log('Remove', file)}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION_SECONDS, EASING_FRAMER } from './animation-constants'

// ============================================================================
// Types
// ============================================================================

/** File data */
export interface FileData {
  /** Unique ID */
  id?: string
  /** File name */
  name: string
  /** File size in bytes */
  size?: number
  /** MIME type */
  type?: string
  /** File URL for download/preview */
  url?: string
  /** Preview URL (for images) */
  previewUrl?: string
  /** Upload progress (0-100) */
  progress?: number
  /** Upload status */
  status?: 'pending' | 'uploading' | 'success' | 'error'
  /** Error message */
  error?: string
  /** Custom metadata */
  metadata?: Record<string, unknown>
}

/** Display variant */
export type FileCardVariant = 'default' | 'compact' | 'minimal' | 'preview'

/** Size variant */
export type FileCardSize = 'sm' | 'md' | 'lg'

/** Props for FileCard component */
export interface FileCardProps {
  /** File data */
  file: FileData
  /** Display variant */
  variant?: FileCardVariant
  /** Size variant */
  size?: FileCardSize
  /** Whether to show preview for images */
  showPreview?: boolean
  /** Whether to show file size */
  showSize?: boolean
  /** Whether to show file type */
  showType?: boolean
  /** Whether to show actions */
  showActions?: boolean
  /** Whether file is selected */
  isSelected?: boolean
  /** Whether file is disabled */
  disabled?: boolean
  /** Custom icon */
  icon?: React.ReactNode
  /** Custom actions */
  actions?: React.ReactNode
  /** Custom class name */
  className?: string
  /** Callback when clicked */
  onClick?: (file: FileData) => void
  /** Callback when download requested */
  onDownload?: (file: FileData) => void
  /** Callback when preview requested */
  onPreview?: (file: FileData) => void
  /** Callback when remove requested */
  onRemove?: (file: FileData) => void
  /** Callback when retry requested */
  onRetry?: (file: FileData) => void
}

/** Props for FileCardList component */
export interface FileCardListProps {
  /** Files to display */
  files: FileData[]
  /** Display variant */
  variant?: FileCardVariant
  /** Size variant */
  size?: FileCardSize
  /** Layout direction */
  direction?: 'horizontal' | 'vertical' | 'grid'
  /** Maximum files to show */
  maxFiles?: number
  /** Whether to show "more" indicator */
  showMore?: boolean
  /** Empty state content */
  emptyContent?: React.ReactNode
  /** Custom class name */
  className?: string
  /** Callback when file clicked */
  onFileClick?: (file: FileData) => void
  /** Callback when file download requested */
  onFileDownload?: (file: FileData) => void
  /** Callback when file preview requested */
  onFilePreview?: (file: FileData) => void
  /** Callback when file remove requested */
  onFileRemove?: (file: FileData) => void
  /** Callback when "more" clicked */
  onMoreClick?: () => void
}

/** Hook options */
export interface UseFileCardOptions {
  /** Initial files */
  files?: FileData[]
  /** Maximum files */
  maxFiles?: number
  /** Accepted file types */
  acceptedTypes?: string[]
  /** Maximum file size in bytes */
  maxSize?: number
  /** Callback when file added */
  onFileAdd?: (file: FileData) => void
  /** Callback when file removed */
  onFileRemove?: (file: FileData) => void
  /** Callback when upload progress */
  onUploadProgress?: (file: FileData, progress: number) => void
}

/** Hook return type */
export interface UseFileCardReturn {
  /** Current files */
  files: FileData[]
  /** Add file */
  addFile: (file: FileData) => void
  /** Remove file */
  removeFile: (id: string) => void
  /** Update file */
  updateFile: (id: string, updates: Partial<FileData>) => void
  /** Clear all files */
  clearFiles: () => void
  /** Get file by ID */
  getFile: (id: string) => FileData | undefined
  /** Check if file type is valid */
  isValidType: (type: string) => boolean
  /** Check if file size is valid */
  isValidSize: (size: number) => boolean
  /** Total size of all files */
  totalSize: number
  /** Whether max files reached */
  isMaxReached: boolean
}

// ============================================================================
// Utilities
// ============================================================================

/** Format file size for display */
export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null) return ''
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)

  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/** Get file extension from name */
export function getFileExtension(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : ''
}

/** Get file category from MIME type or extension */
export function getFileCategory(
  type?: string,
  name?: string
): 'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'other' {
  const extension = name ? getFileExtension(name) : ''

  // Check MIME type first
  if (type) {
    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    if (type.startsWith('audio/')) return 'audio'
    if (type.includes('pdf') || type.includes('document') || type.includes('word') || type.includes('excel') || type.includes('powerpoint'))
      return 'document'
    if (type.includes('zip') || type.includes('rar') || type.includes('tar') || type.includes('gzip'))
      return 'archive'
    if (type.includes('javascript') || type.includes('typescript') || type.includes('json') || type.includes('html') || type.includes('css'))
      return 'code'
  }

  // Fall back to extension
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
  const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv']
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a']
  const docExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt']
  const archiveExts = ['zip', 'rar', 'tar', 'gz', '7z', 'bz2']
  const codeExts = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'go', 'rs', 'rb', 'php', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'md']

  if (imageExts.includes(extension)) return 'image'
  if (videoExts.includes(extension)) return 'video'
  if (audioExts.includes(extension)) return 'audio'
  if (docExts.includes(extension)) return 'document'
  if (archiveExts.includes(extension)) return 'archive'
  if (codeExts.includes(extension)) return 'code'

  return 'other'
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for managing files
 */
export function useFileCard(options: UseFileCardOptions = {}): UseFileCardReturn {
  const {
    files: initialFiles = [],
    maxFiles = Infinity,
    acceptedTypes = [],
    maxSize = Infinity,
    onFileAdd,
    onFileRemove,
  } = options

  const [files, setFiles] = React.useState<FileData[]>(initialFiles)

  const addFile = React.useCallback(
    (file: FileData) => {
      const fileWithId = {
        ...file,
        id: file.id || `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      }

      setFiles((prev) => {
        if (prev.length >= maxFiles) return prev
        return [...prev, fileWithId]
      })

      onFileAdd?.(fileWithId)
    },
    [maxFiles, onFileAdd]
  )

  const removeFile = React.useCallback(
    (id: string) => {
      setFiles((prev) => {
        const file = prev.find((f) => f.id === id)
        if (file) onFileRemove?.(file)
        return prev.filter((f) => f.id !== id)
      })
    },
    [onFileRemove]
  )

  const updateFile = React.useCallback((id: string, updates: Partial<FileData>) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, ...updates } : file))
    )
  }, [])

  const clearFiles = React.useCallback(() => {
    setFiles([])
  }, [])

  const getFile = React.useCallback(
    (id: string) => files.find((f) => f.id === id),
    [files]
  )

  const isValidType = React.useCallback(
    (type: string) => {
      if (acceptedTypes.length === 0) return true
      return acceptedTypes.some((accepted) => {
        if (accepted.endsWith('/*')) {
          const category = accepted.replace('/*', '')
          return type.startsWith(category)
        }
        return type === accepted
      })
    },
    [acceptedTypes]
  )

  const isValidSize = React.useCallback(
    (size: number) => size <= maxSize,
    [maxSize]
  )

  const totalSize = React.useMemo(
    () => files.reduce((sum, file) => sum + (file.size || 0), 0),
    [files]
  )

  const isMaxReached = files.length >= maxFiles

  return {
    files,
    addFile,
    removeFile,
    updateFile,
    clearFiles,
    getFile,
    isValidType,
    isValidSize,
    totalSize,
    isMaxReached,
  }
}

// ============================================================================
// File Icon Component
// ============================================================================

interface FileIconProps {
  category: ReturnType<typeof getFileCategory>
  className?: string
}

function FileIcon({ category, className = '' }: FileIconProps) {
  const iconPaths: Record<string, React.ReactNode> = {
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </>
    ),
    video: (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    ),
    audio: (
      <>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </>
    ),
    document: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    ),
    archive: (
      <>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </>
    ),
    code: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
    other: (
      <>
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </>
    ),
  }

  return (
    <svg
      className={`file-card-icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[category]}
    </svg>
  )
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * FileCard component for file display
 */
export function FileCard({
  file,
  variant = 'default',
  size = 'md',
  showPreview = true,
  showSize = true,
  showType = false,
  showActions = true,
  isSelected = false,
  disabled = false,
  icon,
  actions,
  className = '',
  onClick,
  onDownload,
  onPreview,
  onRemove,
  onRetry,
}: FileCardProps) {
  const category = getFileCategory(file.type, file.name)
  const extension = getFileExtension(file.name)
  const isImage = category === 'image'
  const hasPreview = isImage && (file.previewUrl || file.url) && showPreview
  const isUploading = file.status === 'uploading'
  const hasError = file.status === 'error'
  const progress = file.progress || 0

  const sizeClasses = {
    sm: 'file-card-sm',
    md: 'file-card-md',
    lg: 'file-card-lg',
  }

  const variantClasses = {
    default: 'file-card-default',
    compact: 'file-card-compact',
    minimal: 'file-card-minimal',
    preview: 'file-card-preview',
  }

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(file)
    }
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload?.(file)
  }

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPreview?.(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.(file)
  }

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRetry?.(file)
  }

  return (
    <motion.div
      className={`file-card ${variantClasses[variant]} ${sizeClasses[size]} ${
        isSelected ? 'file-card-selected' : ''
      } ${disabled ? 'file-card-disabled' : ''} ${
        hasError ? 'file-card-error' : ''
      } ${isUploading ? 'file-card-uploading' : ''} ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: DURATION_SECONDS.fast, ease: EASING_FRAMER }}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      {/* Preview/Icon */}
      {variant === 'preview' && hasPreview ? (
        <div className="file-card-preview-image">
          <img
            src={file.previewUrl || file.url}
            alt={file.name}
            loading="lazy"
          />
        </div>
      ) : (
        <div className={`file-card-icon-wrapper file-card-icon-${category}`}>
          {icon || <FileIcon category={category} />}
          {extension && variant !== 'minimal' && (
            <span className="file-card-extension">.{extension}</span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="file-card-content">
        <span className="file-card-name" title={file.name}>
          {file.name}
        </span>

        {variant !== 'minimal' && (
          <div className="file-card-meta">
            {showSize && file.size !== undefined && (
              <span className="file-card-size">{formatFileSize(file.size)}</span>
            )}
            {showType && file.type && (
              <span className="file-card-type">{file.type}</span>
            )}
          </div>
        )}

        {hasError && file.error && (
          <span className="file-card-error-message">{file.error}</span>
        )}
      </div>

      {/* Progress */}
      {isUploading && (
        <div className="file-card-progress">
          <div
            className="file-card-progress-bar"
            style={{ width: `${progress}%` }}
          />
          <span className="file-card-progress-text">{Math.round(progress)}%</span>
        </div>
      )}

      {/* Actions */}
      {showActions && !isUploading && (
        <div className="file-card-actions">
          {actions || (
            <>
              {hasError && onRetry && (
                <button
                  type="button"
                  className="file-card-action file-card-action-retry"
                  onClick={handleRetry}
                  aria-label="Retry upload"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                </button>
              )}
              {hasPreview && onPreview && (
                <button
                  type="button"
                  className="file-card-action file-card-action-preview"
                  onClick={handlePreview}
                  aria-label="Preview file"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              )}
              {file.url && onDownload && (
                <button
                  type="button"
                  className="file-card-action file-card-action-download"
                  onClick={handleDownload}
                  aria-label="Download file"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              )}
              {onRemove && (
                <button
                  type="button"
                  className="file-card-action file-card-action-remove"
                  onClick={handleRemove}
                  aria-label="Remove file"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// FileCardList Component
// ============================================================================

/**
 * FileCardList component for displaying multiple files
 */
export function FileCardList({
  files,
  variant = 'default',
  size = 'md',
  direction = 'vertical',
  maxFiles,
  showMore = true,
  emptyContent,
  className = '',
  onFileClick,
  onFileDownload,
  onFilePreview,
  onFileRemove,
  onMoreClick,
}: FileCardListProps) {
  const displayedFiles = maxFiles ? files.slice(0, maxFiles) : files
  const hiddenCount = maxFiles ? Math.max(0, files.length - maxFiles) : 0

  const directionClasses = {
    horizontal: 'file-card-list-horizontal',
    vertical: 'file-card-list-vertical',
    grid: 'file-card-list-grid',
  }

  if (files.length === 0) {
    return (
      <div className={`file-card-list-empty ${className}`}>
        {emptyContent || (
          <>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
            <p>No files</p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={`file-card-list ${directionClasses[direction]} ${className}`}>
      <AnimatePresence mode="popLayout">
        {displayedFiles.map((file) => (
          <FileCard
            key={file.id || file.name}
            file={file}
            variant={variant}
            size={size}
            onClick={onFileClick}
            onDownload={onFileDownload}
            onPreview={onFilePreview}
            onRemove={onFileRemove}
          />
        ))}
      </AnimatePresence>

      {showMore && hiddenCount > 0 && (
        <button
          type="button"
          className="file-card-list-more"
          onClick={onMoreClick}
        >
          +{hiddenCount} more
        </button>
      )}
    </div>
  )
}

export default FileCard
