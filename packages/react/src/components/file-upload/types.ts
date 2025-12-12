/**
 * FileUpload Types
 *
 * Centralized type definitions for the file upload module.
 */

import type { MessageAttachment } from '@clarity-chat/types'

/**
 * File upload error codes
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

/**
 * Structured error with detailed information and recovery suggestions
 */
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
  fileKey: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  uploadedBytes: number
  totalBytes: number
  speed?: number
  estimatedTimeRemaining?: number
  error?: FileUploadError
}

/**
 * File upload state
 */
export interface FileUploadState {
  files: File[]
  filePreviews: Record<string, string>
  uploadProgress: Record<string, UploadProgressInfo>
  errors: FileUploadError[]
  isDragging: boolean
  dragAccept: boolean
  dragReject: boolean
  isUploading: boolean
  uploadComplete: boolean
}

/**
 * File upload actions for state management
 */
export type FileUploadAction =
  | { type: 'ADD_FILES'; files: File[] }
  | { type: 'REMOVE_FILE'; index: number }
  | { type: 'CLEAR_FILES' }
  | { type: 'SET_PREVIEWS'; previews: Record<string, string> }
  | { type: 'REMOVE_PREVIEW'; key: string }
  | {
      type: 'SET_DRAG_STATE'
      isDragging: boolean
      dragAccept?: boolean
      dragReject?: boolean
    }
  | { type: 'SET_ERRORS'; errors: FileUploadError[] }
  | { type: 'ADD_ERROR'; error: FileUploadError }
  | { type: 'REMOVE_ERROR'; index: number }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'START_UPLOAD'; fileKeys: string[] }
  | {
      type: 'UPDATE_PROGRESS'
      fileKey: string
      progress: Partial<UploadProgressInfo>
    }
  | { type: 'UPLOAD_SUCCESS'; fileKeys: string[] }
  | { type: 'UPLOAD_ERROR'; fileKey: string; error: FileUploadError }
  | { type: 'UPLOAD_COMPLETE' }
  | { type: 'RESET_UPLOAD_STATE' }

/**
 * Configuration options for file upload
 */
export interface FileUploadConfig {
  maxFiles: number
  maxFileSize: number
  minFileSize: number
  acceptedFileTypes: string[]
  showPreviews: boolean
  autoUpload: boolean
}

/**
 * Props for the FileUpload component
 */
export interface FileUploadProps {
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
 * Return type for the useFileUpload hook (headless mode)
 */
export interface UseFileUploadReturn {
  // State
  files: File[]
  errors: FileUploadError[]
  isUploading: boolean
  uploadComplete: boolean
  progress: UploadProgressInfo[]
  isDragging: boolean
  dragAccept: boolean
  dragReject: boolean

  // Actions
  addFiles: (files: File[]) => void
  removeFile: (index: number) => void
  clearFiles: () => void
  upload: (filesToUpload?: File[]) => Promise<void>
  cancel: () => void
  retryFile: (fileKey: string) => void
  retryAll: () => void
  clearErrors: () => void

  // Bindings (spread onto elements)
  getDropzoneProps: () => DropzoneBindings
  getInputProps: () => InputBindings

  // Refs
  inputRef: React.RefObject<HTMLInputElement>
  dropzoneRef: React.RefObject<HTMLDivElement>
}

/**
 * Props to spread on the dropzone element
 */
export interface DropzoneBindings {
  onDragEnter: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onPaste: (e: React.ClipboardEvent) => void
  onClick: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  tabIndex: number
  role: string
  'aria-label': string
  'aria-disabled': boolean
}

/**
 * Props to spread on the file input element
 */
export interface InputBindings {
  type: 'file'
  ref: React.RefObject<HTMLInputElement>
  multiple: boolean
  accept: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
  className: string
  'aria-hidden': boolean
}

/**
 * Props for the Dropzone sub-component
 */
export interface DropzoneProps {
  isDragging: boolean
  dragAccept: boolean
  dragReject: boolean
  uploadComplete: boolean
  disabled: boolean
  label?: string
  description?: string
  acceptedFileTypes: string[]
  maxFiles: number
  maxFileSize: number
  prefersReducedMotion: boolean
  onDragEnter: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onPaste: (e: React.ClipboardEvent) => void
  onClick: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  dropzoneRef: React.RefObject<HTMLDivElement>
}

/**
 * Props for the FileList sub-component
 */
export interface FileListProps {
  files: File[]
  filePreviews: Record<string, string>
  uploadProgress: Record<string, UploadProgressInfo>
  showPreviews: boolean
  maxFiles: number
  disabled: boolean
  uploading: boolean
  autoUpload: boolean
  prefersReducedMotion: boolean
  onRemove: (index: number) => void
  onClearAll: () => void
  onUpload: () => void
  onCancel: () => void
  onRetryFile: (fileKey: string) => void
}

/**
 * Props for the FileItem sub-component
 */
export interface FileItemProps {
  file: File
  index: number
  fileKey: string
  preview?: string
  progress?: UploadProgressInfo
  showPreview: boolean
  disabled: boolean
  uploading: boolean
  prefersReducedMotion: boolean
  onRemove: () => void
  onCancel: () => void
  onRetry: () => void
}

/**
 * Props for the ErrorDisplay sub-component
 */
export interface ErrorDisplayProps {
  errors: FileUploadError[]
  uploading: boolean
  prefersReducedMotion: boolean
  onDismiss: (index: number) => void
  onRetry: () => void
}
