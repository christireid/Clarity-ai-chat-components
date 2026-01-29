/**
 * AttachmentManager
 *
 * Inline file attachment manager for PromptComposer.
 * Adapts FileUpload's drag-drop logic for compact inline use.
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { formatFileSize } from '../../internal/helpers'
import type { Attachment } from '../../hooks/prompt-composer/types'

export interface AttachmentManagerProps {
  /** Current attachments */
  attachments: Attachment[]
  /** Callback when attachments change */
  onChange: (attachments: Attachment[]) => void
  /** Maximum number of files */
  maxFiles?: number
  /** Maximum file size in bytes */
  maxFileSize?: number
  /** Accepted file types */
  acceptedTypes?: string[]
  /** Upload handler */
  onUpload?: (file: File) => Promise<Attachment>
  /** Error handler */
  onError?: (error: string) => void
  /** Compact mode (smaller previews) */
  compact?: boolean
  className?: string
}

/**
 * Get file icon based on type
 */
function getFileIcon(attachment: Attachment): string {
  switch (attachment.type) {
    case 'image':
      return '🖼️'
    case 'document':
      return '📄'
    case 'code':
      return '📝'
    case 'url':
      return '🔗'
    default:
      return '📎'
  }
}

/**
 * AttachmentManager Component
 *
 * Inline attachment manager for PromptComposer.
 * Supports drag-drop, file validation, and compact preview.
 *
 * @example
 * ```tsx
 * <AttachmentManager
 *   attachments={attachments}
 *   onChange={setAttachments}
 *   maxFiles={5}
 *   maxFileSize={10 * 1024 * 1024}
 *   onUpload={async (file) => ({
 *     id: Date.now().toString(),
 *     type: 'document',
 *     name: file.name,
 *     size: file.size,
 *     url: URL.createObjectURL(file),
 *   })}
 * />
 * ```
 */
export function AttachmentManager({
  attachments,
  onChange,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/*', 'application/pdf', '.txt', '.doc', '.docx'],
  onUpload,
  onError,
  compact = false,
  className,
}: AttachmentManagerProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const dropZoneRef = React.useRef<HTMLDivElement>(null)

  /**
   * Validate file
   */
  const validateFile = React.useCallback(
    (file: File): string | null => {
      // Check count
      if (attachments.length >= maxFiles) {
        return `Maximum ${maxFiles} files allowed`
      }

      // Check size
      if (file.size > maxFileSize) {
        return `File exceeds maximum size of ${formatFileSize(maxFileSize)}`
      }

      // Check type
      if (acceptedTypes.length > 0) {
        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith('.')) {
            return file.name.endsWith(type)
          }
          if (type.endsWith('/*')) {
            const category = type.split('/')[0]
            return file.type.startsWith(category + '/')
          }
          return file.type === type
        })

        if (!isAccepted) {
          return `File type not accepted. Allowed: ${acceptedTypes.join(', ')}`
        }
      }

      return null
    },
    [attachments.length, maxFiles, maxFileSize, acceptedTypes]
  )

  /**
   * Handle file selection
   */
  const handleFiles = React.useCallback(
    async (files: File[]) => {
      for (const file of files) {
        // Validate
        const error = validateFile(file)
        if (error) {
          onError?.(error)
          continue
        }

        // Upload if handler provided
        if (onUpload) {
          setIsUploading(true)
          try {
            const attachment = await onUpload(file)
            onChange([...attachments, attachment])
          } catch (err) {
            onError?.(err instanceof Error ? err.message : 'Upload failed')
          } finally {
            setIsUploading(false)
          }
        } else {
          // Create basic attachment without upload
          const attachment: Attachment = {
            id: `${Date.now()}-${file.name}`,
            type: file.type.startsWith('image/') ? 'image' : 'document',
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
          }
          onChange([...attachments, attachment])
        }
      }
    },
    [attachments, onChange, onUpload, onError, validateFile]
  )

  /**
   * Handle file input change
   */
  const handleFileInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      handleFiles(files)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [handleFiles]
  )

  /**
   * Handle drag and drop
   */
  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set to false if leaving the dropzone completely
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
    },
    [handleFiles]
  )

  /**
   * Remove attachment
   */
  const removeAttachment = React.useCallback(
    (id: string) => {
      onChange(attachments.filter((a) => a.id !== id))
    },
    [attachments, onChange]
  )

  if (attachments.length === 0 && !isDragging) {
    return (
      <div className={cn('relative', className)}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || attachments.length >= maxFiles}
          className={cn(
            'p-2 text-gray-600 dark:text-gray-400',
            'hover:text-gray-900 dark:hover:text-gray-200',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'rounded transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Add attachment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative',
        isDragging && 'ring-2 ring-blue-500 ring-offset-2 rounded-lg',
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg z-10 flex items-center justify-center">
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Drop files here
          </div>
        </div>
      )}

      {/* Attachments list */}
      <div className={cn('space-y-2', compact && 'space-y-1')}>
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className={cn(
              'flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg',
              'border border-gray-200 dark:border-gray-800',
              'group hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors',
              compact && 'p-1.5'
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                'shrink-0 text-xl',
                compact && 'text-base'
              )}
            >
              {getFileIcon(attachment)}
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  'font-medium text-sm text-gray-900 dark:text-gray-100 truncate',
                  compact && 'text-xs'
                )}
              >
                {attachment.name}
              </div>
              <div
                className={cn(
                  'text-xs text-gray-500 dark:text-gray-500',
                  compact && 'text-[10px]'
                )}
              >
                {formatFileSize(attachment.size)}
              </div>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeAttachment(attachment.id)}
              className={cn(
                'shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                compact && 'p-0.5'
              )}
              aria-label="Remove attachment"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={cn('w-4 h-4', compact && 'w-3 h-3')}
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add more button */}
      {attachments.length < maxFiles && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            'mt-2 w-full py-1.5 text-xs font-medium',
            'text-gray-600 dark:text-gray-400',
            'hover:text-gray-900 dark:hover:text-gray-200',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'border border-dashed border-gray-300 dark:border-gray-700',
            'rounded transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            compact && 'py-1 text-[10px]'
          )}
        >
          {isUploading ? 'Uploading...' : `+ Add file (${attachments.length}/${maxFiles})`}
        </button>
      )}
    </div>
  )
}

AttachmentManager.displayName = 'AttachmentManager'
