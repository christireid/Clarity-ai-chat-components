'use client'

/**
 * Dropzone Component
 *
 * The drag-and-drop area for file uploads with visual feedback states.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { Badge, cn, formatFileSize } from '@clarity-chat/primitives'
import { formatAcceptedTypes } from '../utils'

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
  dropzoneRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  getDropzoneProps: () => Record<string, unknown>
}

export function Dropzone({
  isDragging,
  dragAccept,
  dragReject,
  uploadComplete,
  disabled,
  label,
  description,
  acceptedFileTypes,
  maxFiles,
  maxFileSize,
  prefersReducedMotion,
  dropzoneRef,
  inputRef,
  onInputChange,
  getDropzoneProps,
}: DropzoneProps) {
  const formattedTypes = React.useMemo(
    () => formatAcceptedTypes(acceptedFileTypes),
    [acceptedFileTypes]
  )

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
        : { type: 'spring', stiffness: 500, damping: 25 },
    },
  }

  return (
    <motion.div
      ref={dropzoneRef}
      variants={dropzoneVariants}
      animate={isDragging ? 'dragOver' : 'default'}
      {...getDropzoneProps()}
      aria-describedby="dropzone-description"
      className={cn(
        'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        disabled
          ? 'opacity-50 cursor-not-allowed bg-muted/30'
          : 'cursor-pointer',
        // Default state
        !isDragging &&
          !disabled &&
          'border-border/40 hover:border-primary/50 hover:bg-accent/50 hover:shadow-md',
        // Drag active - accept
        isDragging &&
          dragAccept &&
          'border-green-500 bg-green-500/10 shadow-lg',
        // Drag active - reject
        isDragging &&
          dragReject &&
          'border-destructive bg-destructive/10 shadow-lg',
        // Drag active - unknown
        isDragging &&
          !dragAccept &&
          !dragReject &&
          'border-primary bg-primary/10 shadow-lg'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={acceptedFileTypes.join(',')}
        onChange={onInputChange}
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
            <span className="text-destructive" aria-hidden="true">
              ❌
            </span>
          ) : dragAccept ? (
            <span className="text-green-500" aria-hidden="true">
              ✅
            </span>
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
              ? `Accepted formats: ${formattedTypes.join(', ')}`
              : description ||
                `Max ${maxFiles} files, up to ${formatFileSize(maxFileSize)} each`}
          </p>
          {!isDragging && !disabled && (
            <p className="text-xs text-muted-foreground/70 mt-2">
              Press{' '}
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">
                Enter
              </kbd>{' '}
              or{' '}
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">
                Space
              </kbd>{' '}
              to browse
              {' • '}
              <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">
                Ctrl+V
              </kbd>{' '}
              to paste
            </p>
          )}
        </div>

        {/* File type badges */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {formattedTypes.slice(0, 4).map((type, i) => (
            <motion.div
              key={type}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: durations.normal }}
            >
              <Badge variant="outline" className="text-xs">
                {type}
              </Badge>
            </motion.div>
          ))}
          {formattedTypes.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{formattedTypes.length - 4} more
            </Badge>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

Dropzone.displayName = 'Dropzone'
