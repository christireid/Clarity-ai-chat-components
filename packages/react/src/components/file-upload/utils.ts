/**
 * FileUpload Utilities
 *
 * Helper functions for file validation, error messages, and formatting.
 */

import { formatFileSize } from '@clarity-chat/primitives'
import type { FileUploadErrorCode, FileUploadError } from './types'

/**
 * Generate a unique key for a file based on name and size
 */
export function getFileKey(file: File): string {
  return `${file.name}-${file.size}`
}

/**
 * Get human-readable error message with suggestion
 */
export function getErrorMessage(
  code: FileUploadErrorCode,
  details?: FileUploadError['details']
): { message: string; suggestion: string } {
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
export function isFileTypeAccepted(
  file: File,
  acceptedTypes: string[]
): boolean {
  if (acceptedTypes.length === 0) return true

  return acceptedTypes.some((type) => {
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
 * Validate a file against the configured constraints
 */
export function validateFile(
  file: File,
  config: {
    maxFileSize: number
    minFileSize: number
    acceptedFileTypes: string[]
  }
): FileUploadError | null {
  const { maxFileSize, minFileSize, acceptedFileTypes } = config

  // Check file type
  if (!isFileTypeAccepted(file, acceptedFileTypes)) {
    return {
      code: 'file-invalid-type',
      file,
      ...getErrorMessage('file-invalid-type', {
        acceptedTypes: acceptedFileTypes,
      }),
      details: { acceptedTypes: acceptedFileTypes },
    }
  }

  // Check max size
  if (file.size > maxFileSize) {
    return {
      code: 'file-too-large',
      file,
      ...getErrorMessage('file-too-large', { maxSize: maxFileSize }),
      details: { maxSize: maxFileSize },
    }
  }

  // Check min size
  if (file.size < minFileSize) {
    return {
      code: 'file-too-small',
      file,
      ...getErrorMessage('file-too-small', { minSize: minFileSize }),
      details: { minSize: minFileSize },
    }
  }

  return null
}

/**
 * Format accepted types for display
 */
export function formatAcceptedTypes(acceptedFileTypes: string[]): string[] {
  return acceptedFileTypes.map((type) => {
    if (type.endsWith('/*')) return type.replace('/*', '')
    if (type.startsWith('.')) return type
    if (type.startsWith('application/')) return type.split('/')[1] || type
    return type
  })
}

/**
 * Get file icon emoji based on file type
 */
export function getFileIcon(file: File): string {
  if (file.type.startsWith('image/')) return '🖼️'
  if (file.type.startsWith('video/')) return '🎥'
  if (file.type.startsWith('audio/')) return '🎵'
  if (file.type.includes('pdf')) return '📄'
  if (
    file.type.includes('word') ||
    file.name.endsWith('.doc') ||
    file.name.endsWith('.docx')
  ) {
    return '📝'
  }
  if (file.type.includes('sheet') || file.name.endsWith('.xlsx')) return '📊'
  return '📎'
}

/**
 * Check if dragged items contain valid file types
 */
export function checkDraggedFilesValidity(
  e: React.DragEvent,
  acceptedFileTypes: string[]
): boolean {
  const items = Array.from(e.dataTransfer.items)
  return items.every((item) => {
    if (item.kind !== 'file') return false
    const type = item.type
    return isFileTypeAccepted({ type, name: '' } as File, acceptedFileTypes)
  })
}

/**
 * Extract files from clipboard event
 */
export function getFilesFromClipboard(e: React.ClipboardEvent): File[] {
  const items = Array.from(e.clipboardData.items)
  return items
    .filter((item) => item.kind === 'file')
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null)
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: FileUploadError): boolean {
  return ['network-error', 'server-error', 'timeout'].includes(error.code)
}
