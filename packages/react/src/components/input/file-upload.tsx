'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import { formatFileSize } from '../../internal/helpers'
import type { MessageAttachment } from '@clarity-chat/types'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
} from '../../animations/constants'

export interface FileUploadProps {
  onUpload: (files: File[]) => Promise<MessageAttachment[]>
  maxFiles?: number
  maxFileSize?: number // in bytes
  acceptedFileTypes?: string[]
  className?: string
}

/**
 * FileUpload component - Enhanced with React 19 features
 *
 * React 19 Enhancements:
 * - Removed React.memo() - compiler handles optimization
 * - Simplified event handlers - compiler optimizes
 */
export function FileUpload({
  onUpload,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedFileTypes = [
    'image/*',
    'application/pdf',
    '.txt',
    '.doc',
    '.docx',
    'video/*',
  ],
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Memoize validation function to prevent recreation
  const validateFile = React.useCallback(
    (file: File): string | null => {
      if (file.size > maxFileSize) {
        return `File ${file.name} exceeds maximum size of ${formatFileSize(maxFileSize)}`
      }
      return null
    },
    [maxFileSize]
  )

  // Memoize file handling to prevent recreation
  const handleFiles = React.useCallback(
    async (newFiles: File[]) => {
      setError(null)

      // Validate total count
      if (files.length + newFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      // Validate each file
      for (const file of newFiles) {
        const error = validateFile(file)
        if (error) {
          setError(error)
          return
        }
      }

      setFiles((prev) => [...prev, ...newFiles])
    },
    [files.length, maxFiles, validateFile]
  )

  // Memoize input handler
  const handleFileInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      handleFiles(selectedFiles)
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    [handleFiles]
  )

  // Memoize drag handlers
  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
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

      const droppedFiles = Array.from(e.dataTransfer.files)
      handleFiles(droppedFiles)
    },
    [handleFiles]
  )

  // Memoize remove handler
  const removeFile = React.useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // Memoize upload handler
  const handleUpload = React.useCallback(async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      await onUpload(files)
      setFiles([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [files, onUpload])

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

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ease-out cursor-pointer',
          isDragging
            ? [
                'border-primary bg-gradient-to-br from-primary/10 to-primary/5',
                'shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.25)]',
                'scale-[1.01]',
              ]
            : [
                'border-border/40',
                'bg-gradient-to-br from-card/50 to-muted/30',
                'hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent',
                'hover:shadow-md',
              ]
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        <motion.div
          className="space-y-3.5"
          animate={{
            scale: isDragging ? 1.05 : 1,
          }}
          transition={{
            // Framer Motion 12: Spring scale on drag
            type: 'spring',
            damping: 18,
            stiffness: 280,
          }}
        >
          <motion.div
            className="text-5xl"
            animate={{
              y: isDragging ? -4 : 0,
            }}
            transition={{
              // Framer Motion 12: Spring bounce on drag
              type: 'spring',
              damping: 15,
              stiffness: 250,
            }}
          >
            📁
          </motion.div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isDragging
                ? 'Drop files here'
                : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground/90 mt-1">
              Max {maxFiles} files, up to {formatFileSize(maxFileSize)} each
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {acceptedFileTypes.slice(0, 4).map((type, i) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: durations.normal }}
              >
                <Badge variant="outline" className="text-xs">
                  {type.replace('*', 'all')}
                </Badge>
              </motion.div>
            ))}
            {acceptedFileTypes.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{acceptedFileTypes.length - 4} more
              </Badge>
            )}
          </div>
        </motion.div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: durations.normal,
              ease: EASING_FRAMER.sharp,
            }}
            className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm shadow-sm"
          >
            <div className="flex items-start gap-2">
              <svg
                className="h-4 w-4 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Files to upload ({files.length}/{maxFiles})
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles([])}
                disabled={uploading}
              >
                Clear all
              </Button>
            </div>

            <div className="space-y-2.5">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{
                    delay: index * 0.05,
                    duration: durations.normal,
                    ease: EASING_FRAMER.sharp,
                  }}
                  className="flex items-center gap-3 p-3 bg-card border border-border/40 rounded-xl shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-200 ease-out"
                >
                  <motion.span
                    className="text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: index * 0.05 + 0.1,
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  >
                    {getFileIcon(file)}
                  </motion.span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground/90">
                      {formatFileSize(file.size)} •{' '}
                      {file.type || 'Unknown type'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                    className="flex-shrink-0 h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove file"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading}
              loading={uploading}
              className="w-full"
            >
              {uploading
                ? 'Uploading...'
                : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

FileUpload.displayName = 'FileUpload'
