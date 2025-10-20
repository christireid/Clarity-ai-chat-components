import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Badge, cn, formatFileSize } from '@clarity-chat/primitives'
import type { MessageAttachment } from '@clarity-chat/types'

export interface FileUploadProps {
  onUpload: (files: File[]) => Promise<MessageAttachment[]>
  maxFiles?: number
  maxFileSize?: number // in bytes
  acceptedFileTypes?: string[]
  className?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedFileTypes = ['image/*', 'application/pdf', '.txt', '.doc', '.docx', 'video/*'],
  className,
}) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File ${file.name} exceeds maximum size of ${formatFileSize(maxFileSize)}`
    }
    return null
  }

  const handleFiles = async (newFiles: File[]) => {
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
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
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
  }

  const getFileIcon = (file: File): string => {
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type.startsWith('video/')) return '🎥'
    if (file.type.startsWith('audio/')) return '🎵'
    if (file.type.includes('pdf')) return '📄'
    if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return '📝'
    if (file.type.includes('sheet') || file.name.endsWith('.xlsx')) return '📊'
    return '📎'
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
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

        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-sm font-medium">
              {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max {maxFiles} files, up to {formatFileSize(maxFileSize)} each
            </p>
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {acceptedFileTypes.slice(0, 4).map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type.replace('*', 'all')}
              </Badge>
            ))}
            {acceptedFileTypes.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{acceptedFileTypes.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-lg text-sm"
          >
            {error}
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
            className="space-y-2"
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

            <div className="space-y-2">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <span className="text-2xl">{getFileIcon(file)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                    className="flex-shrink-0"
                  >
                    ✕
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
              {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
