'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Upload,
  X,
  FileText,
  ImageIcon,
  Film,
  Music,
  Code,
  FileArchive,
  File as FileIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderOpen,
  Paperclip,
} from 'lucide-react'
import type { Attachment } from './types/ai-types'

interface FileUploadProps {
  files?: FileUploadItem[]
  onFilesChange?: (files: FileUploadItem[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: string
  multiple?: boolean
  disabled?: boolean
  className?: string
}

export interface FileUploadItem {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'complete' | 'error'
  progress: number
  error?: string
  url?: string
}

const fileTypeIcons: Record<string, React.ElementType> = {
  image: ImageIcon,
  video: Film,
  audio: Music,
  text: FileText,
  application: FileIcon,
  code: Code,
}

const codeExtensions = [
  '.js',
  '.ts',
  '.tsx',
  '.jsx',
  '.py',
  '.rb',
  '.go',
  '.rs',
  '.java',
  '.cpp',
  '.c',
  '.h',
  '.css',
  '.html',
  '.json',
  '.yaml',
  '.yml',
  '.md',
  '.sql',
]

export function FileUpload({
  files = [],
  onFilesChange,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept,
  multiple = true,
  disabled = false,
  className,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
      e.target.value = ''
    }
  }

  const addFiles = (newFiles: File[]) => {
    const validFiles: FileUploadItem[] = []

    for (const file of newFiles) {
      if (files.length + validFiles.length >= maxFiles) {
        break
      }

      if (file.size > maxSize) {
        validFiles.push({
          id: crypto.randomUUID(),
          file,
          status: 'error',
          progress: 0,
          error: `File too large (max ${formatFileSize(maxSize)})`,
        })
        continue
      }

      validFiles.push({
        id: crypto.randomUUID(),
        file,
        status: 'pending',
        progress: 0,
      })
    }

    onFilesChange?.([...files, ...validFiles])
  }

  const removeFile = (id: string) => {
    onFilesChange?.(files.filter((f) => f.id !== id))
  }

  const getFileIcon = (file: File) => {
    const type = file.type.split('/')[0]
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (codeExtensions.includes(extension)) {
      return Code
    }

    return fileTypeIcons[type] || FileIcon
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          isDragging
            ? 'border-ai-user bg-ai-user/5'
            : 'border-border hover:border-muted-foreground/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'p-4 rounded-full transition-colors',
              isDragging ? 'bg-ai-user/10' : 'bg-secondary'
            )}
          >
            <Upload
              className={cn(
                'h-8 w-8',
                isDragging ? 'text-ai-user' : 'text-muted-foreground'
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse · Max {formatFileSize(maxSize)} per file
            </p>
          </div>
          {accept && (
            <p className="text-xs text-muted-foreground">Accepted: {accept}</p>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item) => (
            <FileItem
              key={item.id}
              item={item}
              onRemove={() => removeFile(item.id)}
              getFileIcon={getFileIcon}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FileItem({
  item,
  onRemove,
  getFileIcon,
}: {
  item: FileUploadItem
  onRemove: () => void
  getFileIcon: (file: File) => React.ElementType
}) {
  const Icon = getFileIcon(item.file)

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border group">
      <div
        className={cn(
          'p-2 rounded-lg',
          item.status === 'error' ? 'bg-destructive/10' : 'bg-secondary'
        )}
      >
        <Icon
          className={cn(
            'h-5 w-5',
            item.status === 'error'
              ? 'text-destructive'
              : 'text-muted-foreground'
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.file.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(item.file.size)}</span>
          {item.status === 'uploading' && (
            <>
              <span>·</span>
              <span>{item.progress}%</span>
            </>
          )}
          {item.status === 'error' && item.error && (
            <>
              <span>·</span>
              <span className="text-destructive">{item.error}</span>
            </>
          )}
        </div>
        {item.status === 'uploading' && (
          <Progress value={item.progress} className="h-1 mt-2" />
        )}
      </div>

      <div className="flex items-center gap-2">
        {item.status === 'complete' && (
          <CheckCircle2 className="h-5 w-5 text-ai-success" />
        )}
        {item.status === 'uploading' && (
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        )}
        {item.status === 'error' && (
          <AlertCircle className="h-5 w-5 text-destructive" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Compact file upload button
export function FileUploadButton({
  onFilesSelect,
  accept,
  multiple = true,
  disabled = false,
  className,
}: {
  onFilesSelect: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  className?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelect(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={className}
      >
        <Paperclip className="h-4 w-4 mr-2" />
        Attach Files
      </Button>
    </>
  )
}

// Image upload with preview
export function ImageUpload({
  images = [],
  onImagesChange,
  maxImages = 4,
  className,
}: {
  images?: string[]
  onImagesChange?: (images: string[]) => void
  maxImages?: number
  className?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
        .slice(0, maxImages - images.length)
        .map((file) => URL.createObjectURL(file))
      onImagesChange?.([...images, ...newImages])
      e.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    onImagesChange?.(images.filter((_, i) => i !== index))
  }

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleSelect}
      />

      <div className="flex flex-wrap gap-3">
        {images.map((url, idx) => (
          <div key={idx} className="relative group">
            <img
              src={url || '/placeholder.svg'}
              alt={`Upload ${idx + 1}`}
              className="h-20 w-20 rounded-lg object-cover border border-border"
            />
            <button
              onClick={() => removeImage(idx)}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            onClick={() => inputRef.current?.click()}
            className="h-20 w-20 rounded-lg border-2 border-dashed border-border hover:border-muted-foreground/50 flex items-center justify-center transition-colors"
          >
            <Plus className="h-6 w-6 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
