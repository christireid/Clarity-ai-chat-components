'use client'

/**
 * FileItem Component
 *
 * Individual file item in the upload list with preview, progress, and actions.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button, cn, formatFileSize } from '@clarity-chat/primitives'
import type { UploadProgressInfo } from '../types'
import { getFileIcon } from '../utils'

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

export function FileItem({
  file,
  index,
  fileKey,
  preview,
  progress,
  showPreview,
  disabled,
  uploading,
  prefersReducedMotion,
  onRemove,
  onCancel,
  onRetry,
}: FileItemProps) {
  const status = progress?.status

  return (
    <motion.li
      key={fileKey}
      initial={prefersReducedMotion ? {} : { opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, x: 20, scale: 0.95 }}
      transition={{
        delay: index * 0.05,
        duration: durations.normal,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'flex items-center gap-3 p-3 bg-card border rounded-xl shadow-sm transition-all duration-200 ease-out',
        status === 'success'
          ? 'border-green-500/40 bg-green-500/5'
          : status === 'error'
            ? 'border-destructive/40 bg-destructive/5'
            : 'border-border/40 hover:shadow-md hover:border-border/60'
      )}
    >
      {/* File preview/icon */}
      {preview && showPreview ? (
        <motion.img
          src={preview}
          alt={`Preview of ${file.name}`}
          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
          initial={prefersReducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: index * 0.05 + 0.1,
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      ) : (
        <motion.span
          className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center"
          initial={prefersReducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: index * 0.05 + 0.1,
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          aria-hidden="true"
        >
          {status === 'success'
            ? '✅'
            : status === 'error'
              ? '❌'
              : getFileIcon(file)}
        </motion.span>
      )}

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground/90">
          {formatFileSize(file.size)}
          {file.type && ` • ${file.type.split('/')[1] || file.type}`}
        </p>

        {/* Progress bar */}
        {progress && status === 'uploading' && (
          <div className="mt-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress.progress}%` }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: durations.moderate, ease: 'easeOut' }
                }
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {progress.progress}% complete
              {progress.uploadedBytes > 0 && progress.totalBytes > 0 && (
                <span className="ml-1">
                  ({formatFileSize(progress.uploadedBytes)} /{' '}
                  {formatFileSize(progress.totalBytes)})
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {status === 'uploading' ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Cancel upload of ${file.name}`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        ) : status === 'success' ? (
          <motion.span
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-500"
            aria-label="Upload successful"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </motion.span>
        ) : status === 'error' ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            disabled={uploading}
            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
            aria-label={`Retry upload of ${file.name}`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={uploading || disabled}
            className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Remove ${file.name}`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        )}
      </div>
    </motion.li>
  )
}

FileItem.displayName = 'FileItem'
