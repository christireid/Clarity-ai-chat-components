'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Badge, cn, formatFileSize } from '@clarity-chat/primitives'
import type { MessageAttachment } from '@clarity-chat/types'
import { useReducedMotion } from '../hooks/use-reduced-motion'

/**
 * File upload error types with detailed information
 */
export type FileUploadErrorCode =
  | 'file-too-large'
  | 'file-too-small'
  | 'file-invalid-type'
  | 'too-many-files'
  | 'network-error'
  | 'server-error'
  | 'timeout'
  | 'cancelled'

export interface FileUploadError {
  code: FileUploadErrorCode
  file?: File
  message: string
  suggestion?: string
  details?: {
    maxSize?: number
    minSize?: number
    acceptedTypes?: string[]
    maxFiles?: number
  }
}

/**
 * Upload progress information for a single file
 */
export interface UploadProgressInfo {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  uploadedBytes: number
  totalBytes: number
  speed?: number
  error?: FileUploadError
  abortController?: AbortController
}

export interface FileUploadProps {
  /** Handler called when files are ready to upload */
  onUpload: (files: File[], abortController?: AbortController) => Promise<MessageAttachment[]>
  /** Maximum number of files allowed */
  maxFiles?: number
  /** Maximum file size in bytes */
  maxFileSize?: number
  /** Minimum file size in bytes */
  minFileSize?: number
  /** Accepted file types (MIME types or extensions) */
  acceptedFileTypes?: string[]
  /** Callback for upload progress */
  onProgress?: (progress: UploadProgressInfo[]) => void
  /** Callback for errors */
  onError?: (error: FileUploadError) => void
  /** Callback when files are selected (before upload) */
  onFilesSelected?: (files: File[]) => void
  /** Whether the component is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Custom label for the dropzone */
  label?: string
  /** Custom description text */
  description?: string
  /** Show file previews */
  showPreviews?: boolean
  /** Auto-upload files immediately after selection */
  autoUpload?: boolean
}

/**
 * Get human-readable error message with suggestion
 */
function getErrorMessage(code: FileUploadErrorCode, details?: FileUploadError['details']): { message: string; suggestion: string } {
  switch (code) {
    case 'file-too-large':
      return {
        message: `File exceeds maximum size of ${formatFileSize(details?.maxSize || 0)}`,
        suggestion: 'Try compressing the file or choosing a smaller one',
      }
    case 'file-too-small':
      return {
        message: `File is smaller than minimum size of ${formatFileSize(details?.minSize || 0)}`,
        suggestion: 'Please select a larger file',
      }
    case 'file-invalid-type':
      return {
        message: `File type not accepted`,
        suggestion: `Accepted formats: ${details?.acceptedTypes?.join(', ') || 'unknown'}`,
      }
    case 'too-many-files':
      return {
        message: `Maximum ${details?.maxFiles || 0} files allowed`,
        suggestion: 'Remove some files and try again',
      }
    case 'network-error':
      return {
        message: 'Connection failed',
        suggestion: 'Check your internet connection and try again',
      }
    case 'server-error':
      return {
        message: 'Server error occurred',
        suggestion: 'Please try again in a moment',
      }
    case 'timeout':
      return {
        message: 'Upload timed out',
        suggestion: 'Try uploading a smaller file or check your connection',
      }
    case 'cancelled':
      return {
        message: 'Upload was cancelled',
        suggestion: 'Click upload to try again',
      }
  }
}

/**
 * Check if a file type matches the accepted types
 */
function isFileTypeAccepted(file: File, acceptedTypes: string[]): boolean {
  if (acceptedTypes.length === 0) return true

  return acceptedTypes.some(type => {
    // Handle wildcard types like "image/*"
    if (type.endsWith('/*')) {
      const category = type.slice(0, -2)
      return file.type.startsWith(category + '/')
    }
    // Handle extensions like ".pdf"
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }
    // Direct MIME type match
    return file.type === type
  })
}

/**
 * FileUpload component - Enhanced with accessibility and UX improvements
 *
 * Features:
 * - Full keyboard accessibility (Enter/Space to open file dialog)
 * - Screen reader announcements via aria-live
 * - Drag accept/reject visual states
 * - Upload progress tracking with cancel support
 * - Image preview thumbnails
 * - Retry failed uploads
 * - Reduced motion support
 */
export function FileUpload({
  onUpload,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  minFileSize = 0,
  acceptedFileTypes = [
    'image/*',
    'application/pdf',
    '.txt',
    '.doc',
    '.docx',
    'video/*',
  ],
  onProgress,
  onError,
  onFilesSelected,
  disabled = false,
  className,
  label,
  description,
  showPreviews = true,
  autoUpload = false,
}: FileUploadProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragAccept, setDragAccept] = React.useState(false)
  const [dragReject, setDragReject] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const [filePreviews, setFilePreviews] = React.useState<Record<string, string>>({})
  const [uploading, setUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, UploadProgressInfo>>({})
  const [errors, setErrors] = React.useState<FileUploadError[]>([])
  const [uploadComplete, setUploadComplete] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState('')

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const dropzoneRef = React.useRef<HTMLDivElement>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)

  // Announce to screen readers
  const announce = React.useCallback((message: string) => {
    setAnnouncement('')
    // Small delay to ensure re-announcement
    requestAnimationFrame(() => setAnnouncement(message))
  }, [])

  // Generate preview for image files
  React.useEffect(() => {
    const newPreviews: Record<string, string> = {}
    files.forEach(file => {
      if (file.type.startsWith('image/') && showPreviews) {
        const key = `${file.name}-${file.size}`
        if (!filePreviews[key]) {
          newPreviews[key] = URL.createObjectURL(file)
        }
      }
    })
    if (Object.keys(newPreviews).length > 0) {
      setFilePreviews(prev => ({ ...prev, ...newPreviews }))
    }

    // Cleanup URLs on unmount
    return () => {
      Object.values(filePreviews).forEach(url => URL.revokeObjectURL(url))
    }
  }, [files, showPreviews])

  // Reset upload complete state after delay
  React.useEffect(() => {
    if (uploadComplete) {
      const timer = setTimeout(() => setUploadComplete(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [uploadComplete])

  // Memoize validation function with comprehensive checks
  const validateFile = React.useCallback(
    (file: File): FileUploadError | null => {
      // Check file type
      if (!isFileTypeAccepted(file, acceptedFileTypes)) {
        const error: FileUploadError = {
          code: 'file-invalid-type',
          file,
          ...getErrorMessage('file-invalid-type', { acceptedTypes: acceptedFileTypes }),
          details: { acceptedTypes: acceptedFileTypes },
        }
        onError?.(error)
        return error
      }

      // Check max size
      if (file.size > maxFileSize) {
        const error: FileUploadError = {
          code: 'file-too-large',
          file,
          ...getErrorMessage('file-too-large', { maxSize: maxFileSize }),
          details: { maxSize: maxFileSize },
        }
        onError?.(error)
        return error
      }

      // Check min size
      if (file.size < minFileSize) {
        const error: FileUploadError = {
          code: 'file-too-small',
          file,
          ...getErrorMessage('file-too-small', { minSize: minFileSize }),
          details: { minSize: minFileSize },
        }
        onError?.(error)
        return error
      }

      return null
    },
    [maxFileSize, minFileSize, acceptedFileTypes, onError]
  )

  // Memoize file handling to prevent recreation
  const handleFiles = React.useCallback(async (newFiles: File[]) => {
    if (disabled) return

    setErrors([])

    // Validate total count
    if (files.length + newFiles.length > maxFiles) {
      const error: FileUploadError = {
        code: 'too-many-files',
        ...getErrorMessage('too-many-files', { maxFiles }),
        details: { maxFiles },
      }
      setErrors([error])
      onError?.(error)
      announce(`Error: Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles: File[] = []
    const newErrors: FileUploadError[] = []

    // Validate each file
    for (const file of newFiles) {
      const error = validateFile(file)
      if (error) {
        newErrors.push(error)
      } else {
        validFiles.push(file)
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      announce(`${newErrors.length} file${newErrors.length > 1 ? 's' : ''} rejected`)
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles])
      onFilesSelected?.(validFiles)
      announce(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} selected`)

      // Auto-upload if enabled
      if (autoUpload) {
        handleUpload(validFiles)
      }
    }
  }, [disabled, files.length, maxFiles, validateFile, onFilesSelected, autoUpload, announce, onError])

  // Memoize input handler
  const handleFileInput = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
    if (fileInputRef.current) fileInputRef.current.value = ''
    // Return focus to dropzone after file dialog closes
    dropzoneRef.current?.focus()
  }, [handleFiles])

  // Check if dragged files are valid
  const checkDraggedFilesValidity = React.useCallback((e: React.DragEvent): boolean => {
    const items = Array.from(e.dataTransfer.items)
    return items.every(item => {
      if (item.kind !== 'file') return false
      const type = item.type
      return isFileTypeAccepted({ type, name: '' } as File, acceptedFileTypes)
    })
  }, [acceptedFileTypes])

  // Memoize drag handlers with accept/reject detection
  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return

    setIsDragging(true)

    // Check if dragged files are valid
    const isValid = checkDraggedFilesValidity(e)
    setDragAccept(isValid)
    setDragReject(!isValid)
  }, [disabled, checkDraggedFilesValidity])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only trigger if leaving the dropzone entirely
    const rect = dropzoneRef.current?.getBoundingClientRect()
    if (rect) {
      const { clientX, clientY } = e
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsDragging(false)
        setDragAccept(false)
        setDragReject(false)
      }
    }
  }, [])

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragAccept(false)
    setDragReject(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [disabled, handleFiles])

  // Keyboard handler for accessibility
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }, [disabled])

  // Memoize remove handler
  const removeFile = React.useCallback((index: number) => {
    const fileToRemove = files[index]
    setFiles((prev) => prev.filter((_, i) => i !== index))

    // Clean up preview URL
    if (fileToRemove) {
      const key = `${fileToRemove.name}-${fileToRemove.size}`
      if (filePreviews[key]) {
        URL.revokeObjectURL(filePreviews[key])
        setFilePreviews(prev => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      }
    }

    // Clear related errors
    setErrors(prev => prev.filter(e => e.file !== fileToRemove))
    announce(`File removed`)
  }, [files, filePreviews, announce])

  // Cancel ongoing upload
  const cancelUpload = React.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setUploading(false)
      announce('Upload cancelled')
    }
  }, [announce])

  // Memoize upload handler with progress tracking
  const handleUpload = React.useCallback(async (filesToUpload?: File[]) => {
    const uploadFiles = filesToUpload || files
    if (uploadFiles.length === 0) return

    setUploading(true)
    setErrors([])
    setUploadComplete(false)

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController()

    // Initialize progress for all files
    const initialProgress: Record<string, UploadProgressInfo> = {}
    uploadFiles.forEach(file => {
      const key = `${file.name}-${file.size}`
      initialProgress[key] = {
        file,
        status: 'pending',
        progress: 0,
        uploadedBytes: 0,
        totalBytes: file.size,
        abortController: abortControllerRef.current!,
      }
    })
    setUploadProgress(initialProgress)
    announce(`Uploading ${uploadFiles.length} file${uploadFiles.length > 1 ? 's' : ''}`)

    try {
      // Update status to uploading
      setUploadProgress(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(key => {
          next[key] = { ...next[key], status: 'uploading' }
        })
        return next
      })

      await onUpload(uploadFiles, abortControllerRef.current)

      // Mark all as success
      setUploadProgress(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(key => {
          next[key] = { ...next[key], status: 'success', progress: 100 }
        })
        return next
      })

      setUploadComplete(true)
      setFiles([])
      announce(`${uploadFiles.length} file${uploadFiles.length > 1 ? 's' : ''} uploaded successfully`)

      // Clear progress after delay
      setTimeout(() => setUploadProgress({}), 2000)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        const cancelError: FileUploadError = {
          code: 'cancelled',
          ...getErrorMessage('cancelled'),
        }
        setErrors([cancelError])
      } else {
        const uploadError: FileUploadError = {
          code: 'network-error',
          message: err instanceof Error ? err.message : 'Upload failed',
          suggestion: 'Please check your connection and try again',
        }
        setErrors([uploadError])
        onError?.(uploadError)
        announce('Upload failed')
      }

      // Mark all as error
      setUploadProgress(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(key => {
          next[key] = { ...next[key], status: 'error' }
        })
        return next
      })
    } finally {
      setUploading(false)
      abortControllerRef.current = null
    }
  }, [files, onUpload, onError, announce])

  // Retry failed upload
  const retryUpload = React.useCallback(() => {
    setErrors([])
    handleUpload()
  }, [handleUpload])

  // Memoize icon getter
  const getFileIcon = React.useCallback((file: File): string => {
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type.startsWith('video/')) return '🎥'
    if (file.type.startsWith('audio/')) return '🎵'
    if (file.type.includes('pdf')) return '📄'
    if (
      file.type.includes('word') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx')
    )
      return '📝'
    if (file.type.includes('sheet') || file.name.endsWith('.xlsx')) return '📊'
    return '📎'
  }, [])

  // Format accepted types for display
  const formattedAcceptedTypes = React.useMemo(() => {
    return acceptedFileTypes.map(type => {
      if (type.endsWith('/*')) return type.replace('/*', '')
      if (type.startsWith('.')) return type
      if (type.startsWith('application/')) return type.split('/')[1]
      return type
    })
  }, [acceptedFileTypes])

  // Animation variants
  const dropzoneVariants = {
    default: { scale: 1 },
    dragOver: { scale: prefersReducedMotion ? 1 : 1.02 },
  }

  const successIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { type: 'spring', stiffness: 500, damping: 25 }
    },
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Drop Zone */}
      <motion.div
        ref={dropzoneRef}
        variants={dropzoneVariants}
        animate={isDragging ? 'dragOver' : 'default'}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label={`File upload dropzone. ${label || 'Click or press Enter to select files, or drag and drop files here'}. Accepts ${formattedAcceptedTypes.join(', ')}. Maximum ${maxFiles} files, ${formatFileSize(maxFileSize)} each.`}
        aria-describedby="dropzone-description"
        aria-disabled={disabled}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          disabled
            ? 'opacity-50 cursor-not-allowed bg-muted/30'
            : 'cursor-pointer',
          // Default state
          !isDragging && !disabled && 'border-border/40 hover:border-primary/50 hover:bg-accent/50 hover:shadow-md',
          // Drag active - accept
          isDragging && dragAccept && 'border-green-500 bg-green-500/10 shadow-lg',
          // Drag active - reject
          isDragging && dragReject && 'border-destructive bg-destructive/10 shadow-lg',
          // Drag active - unknown
          isDragging && !dragAccept && !dragReject && 'border-primary bg-primary/10 shadow-lg'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
          aria-hidden="true"
        />

        <motion.div
          className="space-y-3.5"
          animate={{
            scale: isDragging && !prefersReducedMotion ? 1.05 : 1,
          }}
          transition={{
            type: 'spring',
            damping: 18,
            stiffness: 280,
          }}
        >
          {/* Icon */}
          <motion.div
            className="text-5xl"
            animate={{
              y: isDragging && !prefersReducedMotion ? -4 : 0,
            }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 250,
            }}
          >
            {dragReject ? (
              <span className="text-destructive" aria-hidden="true">❌</span>
            ) : dragAccept ? (
              <span className="text-green-500" aria-hidden="true">✅</span>
            ) : uploadComplete ? (
              <motion.span
                variants={successIconVariants}
                initial="hidden"
                animate="visible"
                className="text-green-500"
                aria-hidden="true"
              >
                🎉
              </motion.span>
            ) : (
              <span aria-hidden="true">📁</span>
            )}
          </motion.div>

          {/* Text */}
          <div id="dropzone-description">
            <p className="text-sm font-semibold text-foreground">
              {dragReject
                ? 'Invalid file type'
                : dragAccept
                ? 'Drop to upload'
                : isDragging
                ? 'Drop files here'
                : uploadComplete
                ? 'Upload complete!'
                : label || 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground/90 mt-1">
              {dragReject
                ? `Accepted formats: ${formattedAcceptedTypes.join(', ')}`
                : description || `Max ${maxFiles} files, up to ${formatFileSize(maxFileSize)} each`}
            </p>
            {!isDragging && !disabled && (
              <p className="text-xs text-muted-foreground/70 mt-2">
                Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd> or{' '}
                <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">Space</kbd> to browse
              </p>
            )}
          </div>

          {/* File type badges */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {formattedAcceptedTypes.slice(0, 4).map((type, i) => (
              <motion.div
                key={type}
                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <Badge variant="outline" className="text-xs">
                  {type}
                </Badge>
              </motion.div>
            ))}
            {formattedAcceptedTypes.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{formattedAcceptedTypes.length - 4} more
              </Badge>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-2"
          >
            {errors.map((error, index) => (
              <div
                key={`${error.code}-${index}`}
                role="alert"
                aria-live="assertive"
                className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{error.file?.name ? `${error.file.name}: ` : ''}{error.message}</p>
                    {error.suggestion && (
                      <p className="text-xs text-destructive/80 mt-0.5">{error.suggestion}</p>
                    )}
                  </div>
                  {(error.code === 'network-error' || error.code === 'server-error' || error.code === 'timeout') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retryUpload}
                      disabled={uploading}
                      className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Retry
                    </Button>
                  )}
                  <button
                    onClick={() => setErrors(prev => prev.filter((_, i) => i !== index))}
                    className="shrink-0 text-destructive/60 hover:text-destructive"
                    aria-label="Dismiss error"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
            className="space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" aria-live="polite">
                Files to upload ({files.length}/{maxFiles})
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFiles([])
                  announce('All files cleared')
                }}
                disabled={uploading || disabled}
                aria-label="Clear all files"
              >
                Clear all
              </Button>
            </div>

            {/* File list with role for screen readers */}
            <ul className="space-y-2.5" role="list" aria-label="Selected files">
              {files.map((file, index) => {
                const fileKey = `${file.name}-${file.size}`
                const preview = filePreviews[fileKey]
                const progress = uploadProgress[fileKey]

                return (
                  <motion.li
                    key={fileKey}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className={cn(
                      'flex items-center gap-3 p-3 bg-card border rounded-xl shadow-sm transition-all duration-200 ease-out',
                      progress?.status === 'success'
                        ? 'border-green-500/40 bg-green-500/5'
                        : progress?.status === 'error'
                        ? 'border-destructive/40 bg-destructive/5'
                        : 'border-border/40 hover:shadow-md hover:border-border/60'
                    )}
                  >
                    {/* File preview/icon */}
                    {preview && showPreviews ? (
                      <motion.img
                        src={preview}
                        alt={`Preview of ${file.name}`}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.1, type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    ) : (
                      <motion.span
                        className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center"
                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.1, type: 'spring', stiffness: 500, damping: 30 }}
                        aria-hidden="true"
                      >
                        {progress?.status === 'success' ? '✅' : progress?.status === 'error' ? '❌' : getFileIcon(file)}
                      </motion.span>
                    )}

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground/90">
                        {formatFileSize(file.size)}
                        {file.type && ` • ${file.type.split('/')[1] || file.type}`}
                      </p>

                      {/* Progress bar */}
                      {progress && progress.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress.progress}%` }}
                              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {progress.progress}% complete
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {progress?.status === 'uploading' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelUpload}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Cancel upload of ${file.name}`}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      ) : progress?.status === 'success' ? (
                        <motion.span
                          initial={prefersReducedMotion ? {} : { scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-500"
                          aria-label="Upload successful"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </motion.span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={uploading || disabled}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Remove ${file.name}`}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </motion.li>
                )
              })}
            </ul>

            {/* Upload button */}
            {!autoUpload && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUpload()}
                  disabled={uploading || disabled || files.length === 0}
                  className="flex-1"
                  aria-describedby={uploading ? 'upload-progress' : undefined}
                >
                  {uploading ? (
                    <>
                      <svg className="h-4 w-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    `Upload ${files.length} file${files.length > 1 ? 's' : ''}`
                  )}
                </Button>
                {uploading && (
                  <Button
                    variant="outline"
                    onClick={cancelUpload}
                    aria-label="Cancel upload"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success celebration */}
      <AnimatePresence>
        {uploadComplete && files.length === 0 && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            className="flex items-center justify-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600"
            role="status"
            aria-live="polite"
          >
            <motion.span
              initial={prefersReducedMotion ? {} : { rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
              aria-hidden="true"
            >
              ✅
            </motion.span>
            <span className="font-medium">Upload complete!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

FileUpload.displayName = 'FileUpload'

// Export types
export type { FileUploadProps, UploadProgressInfo, FileUploadError, FileUploadErrorCode }
