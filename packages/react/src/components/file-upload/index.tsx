'use client'

/**
 * FileUpload Component
 *
 * A fully-featured file upload component with drag-and-drop, previews,
 * progress tracking, and comprehensive accessibility support.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   onUpload={async (files) => {
 *     // Upload logic
 *     return files.map(f => ({ type: 'file', name: f.name }))
 *   }}
 *   maxFiles={5}
 *   maxFileSize={10 * 1024 * 1024}
 *   acceptedFileTypes={['image/*', 'application/pdf']}
 *   showPreviews
 * />
 * ```
 *
 * @example Headless mode using the hook
 * ```tsx
 * function CustomUploader() {
 *   const { files, addFiles, upload, getDropzoneProps } = useFileUpload({
 *     onUpload: async (files) => {
 *       // Your upload logic
 *       return []
 *     },
 *   })
 *
 *   return (
 *     <div {...getDropzoneProps()}>
 *       {files.map(f => <span key={f.name}>{f.name}</span>)}
 *     </div>
 *   )
 * }
 * ```
 */

import * as React from 'react'
import { AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'

import type { FileUploadProps, UploadProgressInfo } from './types'
import { useFileUpload } from './hooks/use-file-upload'
import { useFilePreviews } from './hooks/use-file-previews'
import { useReducedMotion } from '../../hooks/use-reduced-motion'
import { getFileKey } from './utils'

import { Dropzone } from './components/Dropzone'
import { FileList } from './components/FileList'
import { ErrorDisplay } from './components/ErrorDisplay'

// Default config
const DEFAULT_ACCEPTED_TYPES = [
  'image/*',
  'application/pdf',
  '.txt',
  '.doc',
  '.docx',
  'video/*',
]

export function FileUpload({
  onUpload,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024,
  minFileSize = 0,
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
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

  // Use the core file upload hook
  const {
    files,
    errors,
    isUploading,
    uploadComplete,
    progress,
    isDragging,
    dragAccept,
    dragReject,
    addFiles,
    removeFile,
    clearFiles,
    upload,
    cancel,
    retryFile,
    retryAll,
    clearErrors,
    getDropzoneProps,
    inputRef,
    dropzoneRef,
  } = useFileUpload({
    onUpload,
    maxFiles,
    maxFileSize,
    minFileSize,
    acceptedFileTypes,
    onProgress,
    onError,
    onFilesSelected,
    disabled,
    autoUpload,
    label,
  })

  // Use the file previews hook
  const { previews } = useFilePreviews({
    files,
    enabled: showPreviews,
  })

  // Convert progress array to record for FileList
  const uploadProgress = React.useMemo(() => {
    const record: Record<string, UploadProgressInfo> = {}
    progress.forEach((p) => {
      record[p.fileKey] = p
    })
    return record
  }, [progress])

  // Handle input change
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      addFiles(selectedFiles)
      if (inputRef.current) inputRef.current.value = ''
      dropzoneRef.current?.focus()
    },
    [addFiles, inputRef, dropzoneRef]
  )

  // Handle error dismiss
  const handleDismissError = React.useCallback(
    (index: number) => {
      // For now, clear all errors - could be enhanced to dismiss individual
      clearErrors()
    },
    [clearErrors]
  )

  return (
    <div
      className={cn('space-y-4', className)}
      role="region"
      aria-label="File upload"
    >
      {/* Screen reader announcements */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isUploading &&
          `Uploading ${files.length} file${files.length > 1 ? 's' : ''}`}
        {uploadComplete && 'Upload complete'}
        {errors.length > 0 &&
          `${errors.length} error${errors.length > 1 ? 's' : ''} occurred`}
      </div>

      {/* Error display */}
      <ErrorDisplay
        errors={errors}
        uploading={isUploading}
        prefersReducedMotion={prefersReducedMotion}
        onDismiss={handleDismissError}
        onRetry={retryAll}
      />

      {/* Dropzone */}
      <Dropzone
        isDragging={isDragging}
        dragAccept={dragAccept}
        dragReject={dragReject}
        uploadComplete={uploadComplete}
        disabled={disabled}
        label={label}
        description={description}
        acceptedFileTypes={acceptedFileTypes}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        prefersReducedMotion={prefersReducedMotion}
        dropzoneRef={dropzoneRef}
        inputRef={inputRef}
        onInputChange={handleInputChange}
        getDropzoneProps={getDropzoneProps}
      />

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <FileList
            files={files}
            previews={previews}
            uploadProgress={uploadProgress}
            showPreviews={showPreviews}
            maxFiles={maxFiles}
            disabled={disabled}
            uploading={isUploading}
            autoUpload={autoUpload}
            prefersReducedMotion={prefersReducedMotion}
            onRemove={removeFile}
            onClearAll={clearFiles}
            onUpload={upload}
            onCancel={cancel}
            onRetryFile={retryFile}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

FileUpload.displayName = 'FileUpload'

// Re-export everything for module consumers
export { useFileUpload } from './hooks/use-file-upload'
export { useFilePreviews } from './hooks/use-file-previews'
export { Dropzone } from './components/Dropzone'
export { FileList } from './components/FileList'
export { FileItem } from './components/FileItem'
export { ErrorDisplay } from './components/ErrorDisplay'
export * from './types'
export * from './utils'
