'use client'

/**
 * FileList Component
 *
 * List of selected files with previews, progress, and batch actions.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@clarity-chat/primitives'
import type { UploadProgressInfo } from '../types'
import { getFileKey } from '../utils'
import { FileItem } from './FileItem'

export interface FileListProps {
  files: File[]
  previews: Record<string, string>
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

export function FileList({
  files,
  previews,
  uploadProgress,
  showPreviews,
  maxFiles,
  disabled,
  uploading,
  autoUpload,
  prefersReducedMotion,
  onRemove,
  onClearAll,
  onUpload,
  onCancel,
  onRetryFile,
}: FileListProps) {
  if (files.length === 0) return null

  return (
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
          onClick={onClearAll}
          disabled={uploading || disabled}
          aria-label="Clear all files"
        >
          Clear all
        </Button>
      </div>

      {/* File list with role for screen readers */}
      <ul className="space-y-2.5" role="list" aria-label="Selected files">
        <AnimatePresence>
          {files.map((file, index) => {
            const fileKey = getFileKey(file)
            const preview = previews[fileKey]
            const progress = uploadProgress[fileKey]

            return (
              <FileItem
                key={fileKey}
                file={file}
                index={index}
                fileKey={fileKey}
                preview={preview}
                progress={progress}
                showPreview={showPreviews}
                disabled={disabled}
                uploading={uploading}
                prefersReducedMotion={prefersReducedMotion}
                onRemove={() => onRemove(index)}
                onCancel={onCancel}
                onRetry={() => onRetryFile(fileKey)}
              />
            )
          })}
        </AnimatePresence>
      </ul>

      {/* Upload button */}
      {!autoUpload && (
        <div className="flex gap-2">
          <Button
            onClick={onUpload}
            disabled={uploading || disabled || files.length === 0}
            className="flex-1"
            aria-describedby={uploading ? 'upload-progress' : undefined}
          >
            {uploading ? (
              <>
                <svg
                  className="h-4 w-4 mr-2 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
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
              onClick={onCancel}
              aria-label="Cancel upload"
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}

FileList.displayName = 'FileList'
