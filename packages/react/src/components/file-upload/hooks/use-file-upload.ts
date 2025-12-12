'use client'

/**
 * useFileUpload Hook
 *
 * Core hook for file upload functionality. Provides headless file upload
 * capabilities that can be used with any UI implementation.
 *
 * Features:
 * - File validation (type, size, count)
 * - Drag and drop support
 * - Clipboard paste support
 * - Upload progress tracking
 * - Cancel and retry support
 * - Keyboard accessibility
 */

import * as React from 'react'
import { formatFileSize } from '@clarity-chat/primitives'
import type { MessageAttachment } from '@clarity-chat/types'
import type {
  FileUploadError,
  UploadProgressInfo,
  UseFileUploadReturn,
  DropzoneBindings,
  InputBindings,
} from '../types'
import {
  getFileKey,
  getErrorMessage,
  validateFile,
  formatAcceptedTypes,
  checkDraggedFilesValidity,
  getFilesFromClipboard,
} from '../utils'

export interface UseFileUploadOptions {
  /** Handler called when files are ready to upload */
  onUpload: (
    files: File[],
    abortController?: AbortController
  ) => Promise<MessageAttachment[]>
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
  /** Auto-upload files immediately after selection */
  autoUpload?: boolean
  /** Custom label for accessibility */
  label?: string
}

const DEFAULT_ACCEPTED_TYPES = [
  'image/*',
  'application/pdf',
  '.txt',
  '.doc',
  '.docx',
  'video/*',
]

export function useFileUpload({
  onUpload,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024,
  minFileSize = 0,
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
  onProgress,
  onError,
  onFilesSelected,
  disabled = false,
  autoUpload = false,
  label,
}: UseFileUploadOptions): UseFileUploadReturn {
  // State
  const [files, setFiles] = React.useState<File[]>([])
  const [errors, setErrors] = React.useState<FileUploadError[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadComplete, setUploadComplete] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState<
    Record<string, UploadProgressInfo>
  >({})
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragAccept, setDragAccept] = React.useState(false)
  const [dragReject, setDragReject] = React.useState(false)

  // Refs
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropzoneRef = React.useRef<HTMLDivElement>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  // Use ref to track previews for proper cleanup (fixes stale closure)
  const previewUrlsRef = React.useRef<Set<string>>(new Set())

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      previewUrlsRef.current.clear()
    }
  }, [])

  // Reset upload complete state after delay
  React.useEffect(() => {
    if (uploadComplete) {
      const timer = setTimeout(() => setUploadComplete(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [uploadComplete])

  // Notify progress changes
  React.useEffect(() => {
    if (onProgress && Object.keys(uploadProgress).length > 0) {
      onProgress(Object.values(uploadProgress))
    }
  }, [uploadProgress, onProgress])

  // Validate and add files
  const addFiles = React.useCallback(
    (newFiles: File[]) => {
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
        return
      }

      const validFiles: File[] = []
      const newErrors: FileUploadError[] = []

      // Validate each file
      for (const file of newFiles) {
        const error = validateFile(file, {
          maxFileSize,
          minFileSize,
          acceptedFileTypes,
        })
        if (error) {
          newErrors.push(error)
          onError?.(error)
        } else {
          validFiles.push(file)
        }
      }

      if (newErrors.length > 0) {
        setErrors(newErrors)
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles])
        onFilesSelected?.(validFiles)

        // Auto-upload if enabled
        if (autoUpload) {
          // Use setTimeout to ensure state is updated first
          setTimeout(() => uploadFiles(validFiles), 0)
        }
      }
    },
    [
      disabled,
      files.length,
      maxFiles,
      maxFileSize,
      minFileSize,
      acceptedFileTypes,
      onError,
      onFilesSelected,
      autoUpload,
    ]
  )

  // Remove a file by index
  const removeFile = React.useCallback((index: number) => {
    setFiles((prev) => {
      const fileToRemove = prev[index]
      if (fileToRemove) {
        const key = getFileKey(fileToRemove)
        // Clean up any associated preview URL
        previewUrlsRef.current.forEach((url) => {
          if (url.includes(key)) {
            URL.revokeObjectURL(url)
            previewUrlsRef.current.delete(url)
          }
        })
      }
      return prev.filter((_, i) => i !== index)
    })
    // Clear related errors
    setErrors((prev) => prev.filter((e, i) => i !== index))
  }, [])

  // Clear all files
  const clearFiles = React.useCallback(() => {
    // Clean up all preview URLs
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrlsRef.current.clear()
    setFiles([])
    setErrors([])
  }, [])

  // Upload files
  const uploadFiles = React.useCallback(
    async (filesToUpload?: File[] | React.MouseEvent) => {
      // Handle being called as onClick handler (receives MouseEvent)
      const uploadFilesList = Array.isArray(filesToUpload)
        ? filesToUpload
        : files
      if (uploadFilesList.length === 0) return

      setIsUploading(true)
      setErrors([])
      setUploadComplete(false)

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController()

      // Initialize progress for all files
      const initialProgress: Record<string, UploadProgressInfo> = {}
      uploadFilesList.forEach((file) => {
        const key = getFileKey(file)
        initialProgress[key] = {
          file,
          fileKey: key,
          status: 'uploading',
          progress: 0,
          uploadedBytes: 0,
          totalBytes: file.size,
        }
      })
      setUploadProgress(initialProgress)

      try {
        await onUpload(uploadFilesList, abortControllerRef.current)

        // Mark all as success
        setUploadProgress((prev) => {
          const next = { ...prev }
          Object.keys(next).forEach((key) => {
            next[key] = {
              ...next[key],
              status: 'success',
              progress: 100,
              uploadedBytes: next[key].totalBytes,
            }
          })
          return next
        })

        setUploadComplete(true)
        setFiles([])

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
        }

        // Mark all as error
        setUploadProgress((prev) => {
          const next = { ...prev }
          Object.keys(next).forEach((key) => {
            next[key] = { ...next[key], status: 'error' }
          })
          return next
        })
      } finally {
        setIsUploading(false)
        abortControllerRef.current = null
      }
    },
    [files, onUpload, onError]
  )

  // Cancel upload
  const cancel = React.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsUploading(false)
    }
  }, [])

  // Retry a specific file
  const retryFile = React.useCallback(
    (fileKey: string) => {
      const fileToRetry = files.find((f) => getFileKey(f) === fileKey)
      if (fileToRetry) {
        setErrors([])
        uploadFiles([fileToRetry])
      }
    },
    [files, uploadFiles]
  )

  // Retry all failed uploads
  const retryAll = React.useCallback(() => {
    setErrors([])
    uploadFiles()
  }, [uploadFiles])

  // Clear errors
  const clearErrors = React.useCallback(() => {
    setErrors([])
  }, [])

  // Handle file input change
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      addFiles(selectedFiles)
      if (inputRef.current) inputRef.current.value = ''
      // Return focus to dropzone after file dialog closes
      dropzoneRef.current?.focus()
    },
    [addFiles]
  )

  // Drag handlers
  const handleDragEnter = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return

      setIsDragging(true)
      const isValid = checkDraggedFilesValidity(e, acceptedFileTypes)
      setDragAccept(isValid)
      setDragReject(!isValid)
    },
    [disabled, acceptedFileTypes]
  )

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

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

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      setDragAccept(false)
      setDragReject(false)

      if (disabled) return

      const droppedFiles = Array.from(e.dataTransfer.files)
      addFiles(droppedFiles)
    },
    [disabled, addFiles]
  )

  // Paste handler
  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent) => {
      if (disabled) return

      const pastedFiles = getFilesFromClipboard(e)
      if (pastedFiles.length > 0) {
        e.preventDefault()
        addFiles(pastedFiles)
      }
    },
    [disabled, addFiles]
  )

  // Click handler
  const handleClick = React.useCallback(() => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  // Keyboard handler
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        inputRef.current?.click()
      }
    },
    [disabled]
  )

  // Get dropzone props
  const getDropzoneProps = React.useCallback((): DropzoneBindings => {
    const formattedTypes = formatAcceptedTypes(acceptedFileTypes)
    return {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onPaste: handlePaste,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      tabIndex: disabled ? -1 : 0,
      role: 'button',
      'aria-label': `File upload dropzone. ${label || 'Click or press Enter to select files, or drag and drop files here'}. Accepts ${formattedTypes.join(', ')}. Maximum ${maxFiles} files, ${formatFileSize(maxFileSize)} each.`,
      'aria-disabled': disabled,
    }
  }, [
    acceptedFileTypes,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePaste,
    handleClick,
    handleKeyDown,
    disabled,
    label,
    maxFiles,
    maxFileSize,
  ])

  // Get input props
  const getInputProps = React.useCallback((): InputBindings => {
    return {
      type: 'file',
      ref: inputRef,
      multiple: maxFiles > 1,
      accept: acceptedFileTypes.join(','),
      onChange: handleInputChange,
      disabled,
      className: 'hidden',
      'aria-hidden': true,
    }
  }, [maxFiles, acceptedFileTypes, handleInputChange, disabled])

  // Compute progress array
  const progress = React.useMemo(
    () => Object.values(uploadProgress),
    [uploadProgress]
  )

  return {
    // State
    files,
    errors,
    isUploading,
    uploadComplete,
    progress,
    isDragging,
    dragAccept,
    dragReject,

    // Actions
    addFiles,
    removeFile,
    clearFiles,
    upload: uploadFiles,
    cancel,
    retryFile,
    retryAll,
    clearErrors,

    // Bindings
    getDropzoneProps,
    getInputProps,

    // Refs
    inputRef,
    dropzoneRef,
  }
}
