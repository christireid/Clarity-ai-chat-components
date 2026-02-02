'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  FileTypeIcon,
  X,
  Download,
  Eye,
  MoreHorizontal,
  Upload,
  Paperclip,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'

// ============================================================================
// FILE TYPE UTILITIES
// ============================================================================

type FileType =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'code'
  | 'archive'
  | 'spreadsheet'
  | 'pdf'
  | 'unknown'

function getFileType(filename: string, mimeType?: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase() || ''

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
  const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv']
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a']
  const codeExts = [
    'js',
    'ts',
    'jsx',
    'tsx',
    'py',
    'rb',
    'go',
    'rs',
    'java',
    'cpp',
    'c',
    'h',
    'css',
    'html',
    'json',
    'xml',
    'yaml',
    'yml',
    'md',
    'sql',
  ]
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']
  const spreadsheetExts = ['xls', 'xlsx', 'csv', 'ods']
  const documentExts = ['doc', 'docx', 'txt', 'rtf', 'odt']

  if (ext === 'pdf') return 'pdf'
  if (imageExts.includes(ext) || mimeType?.startsWith('image/')) return 'image'
  if (videoExts.includes(ext) || mimeType?.startsWith('video/')) return 'video'
  if (audioExts.includes(ext) || mimeType?.startsWith('audio/')) return 'audio'
  if (codeExts.includes(ext)) return 'code'
  if (archiveExts.includes(ext)) return 'archive'
  if (spreadsheetExts.includes(ext)) return 'spreadsheet'
  if (documentExts.includes(ext)) return 'document'

  return 'unknown'
}

function getFileIcon(type: FileType) {
  const icons: Record<FileType, React.ReactNode> = {
    image: <FileImage className="w-5 h-5" />,
    video: <FileVideo className="w-5 h-5" />,
    audio: <FileAudio className="w-5 h-5" />,
    document: <FileText className="w-5 h-5" />,
    code: <FileCode className="w-5 h-5" />,
    archive: <FileArchive className="w-5 h-5" />,
    spreadsheet: <FileSpreadsheet className="w-5 h-5" />,
    pdf: <FileTypeIcon className="w-5 h-5" />,
    unknown: <File className="w-5 h-5" />,
  }
  return icons[type]
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// ============================================================================
// FILE CARD COMPONENT - Superior to Ant Design X FileCard
// ============================================================================

interface FileCardFile {
  id?: string
  name: string
  size?: number
  type?: string
  url?: string
  preview?: string
  status?: 'uploading' | 'success' | 'error' | 'pending'
  progress?: number
  error?: string
}

interface FileCardProps {
  file: FileCardFile
  onRemove?: () => void
  onDownload?: () => void
  onPreview?: () => void
  variant?: 'default' | 'compact' | 'minimal' | 'detailed'
  showActions?: boolean
  showProgress?: boolean
  removable?: boolean
  className?: string
}

export function FileCard({
  file,
  onRemove,
  onDownload,
  onPreview,
  variant = 'default',
  showActions = true,
  showProgress = true,
  removable = true,
  className,
}: FileCardProps) {
  const fileType = getFileType(file.name, file.type)
  const icon = getFileIcon(fileType)
  const isImage = fileType === 'image'
  const isUploading = file.status === 'uploading'
  const hasError = file.status === 'error'

  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-sm',
          hasError && 'border-destructive/50 bg-destructive/10',
          className
        )}
      >
        <span className="text-muted-foreground">{icon}</span>
        <span className="truncate max-w-[150px]">{file.name}</span>
        {removable && onRemove && (
          <button
            onClick={onRemove}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors',
          hasError && 'border-destructive/50',
          className
        )}
      >
        <div className="w-8 h-8 flex items-center justify-center rounded bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          {file.size && (
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          )}
        </div>
        {removable && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 p-3 rounded-xl border border-border bg-background',
          hasError && 'border-destructive/50',
          className
        )}
      >
        {/* Preview or icon */}
        <div className="relative w-16 h-16 flex items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
          {isImage && file.preview ? (
            <img
              src={file.preview || '/placeholder.svg'}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground">{icon}</span>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {file.size && <span>{formatFileSize(file.size)}</span>}
                {file.status === 'success' && (
                  <span className="flex items-center gap-1 text-green-500">
                    <CheckCircle className="w-3 h-3" />
                    Uploaded
                  </span>
                )}
                {hasError && (
                  <span className="flex items-center gap-1 text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    {file.error || 'Upload failed'}
                  </span>
                )}
              </div>
            </div>

            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onPreview && (
                    <DropdownMenuItem onClick={onPreview}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                  )}
                  {onDownload && (
                    <DropdownMenuItem onClick={onDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  )}
                  {removable && onRemove && (
                    <DropdownMenuItem
                      onClick={onRemove}
                      className="text-destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Progress bar */}
          {showProgress && isUploading && file.progress !== undefined && (
            <div className="mt-2">
              <Progress value={file.progress} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">
                {file.progress}%
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors',
        hasError && 'border-destructive/50',
        className
      )}
    >
      {/* Icon or preview */}
      <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
        {isImage && file.preview ? (
          <img
            src={file.preview || '/placeholder.svg'}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground">{icon}</span>
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {file.size ? formatFileSize(file.size) : 'Unknown size'}
          {file.status === 'success' && ' • Uploaded'}
          {hasError && ` • ${file.error || 'Failed'}`}
        </p>
      </div>

      {/* Status indicator */}
      {isUploading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
      {file.status === 'success' && (
        <CheckCircle className="w-4 h-4 text-green-500" />
      )}
      {hasError && <AlertCircle className="w-4 h-4 text-destructive" />}

      {/* Remove button */}
      {removable && onRemove && !isUploading && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      {/* Progress overlay */}
      {showProgress && isUploading && file.progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-xl overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${file.progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// ATTACHMENTS COMPONENT - File list with upload support
// ============================================================================

interface AttachmentsProps {
  files: FileCardFile[]
  onRemove?: (index: number) => void
  onDownload?: (file: FileCardFile, index: number) => void
  onPreview?: (file: FileCardFile, index: number) => void
  variant?: 'default' | 'compact' | 'minimal' | 'grid'
  maxVisible?: number
  showOverflow?: boolean
  className?: string
}

export function Attachments({
  files,
  onRemove,
  onDownload,
  onPreview,
  variant = 'default',
  maxVisible,
  showOverflow = true,
  className,
}: AttachmentsProps) {
  const visibleFiles = maxVisible ? files.slice(0, maxVisible) : files
  const overflowCount = maxVisible ? Math.max(0, files.length - maxVisible) : 0

  if (variant === 'minimal') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {visibleFiles.map((file, index) => (
          <FileCard
            key={file.id || index}
            file={file}
            variant="minimal"
            onRemove={onRemove ? () => onRemove(index) : undefined}
          />
        ))}
        {showOverflow && overflowCount > 0 && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
            +{overflowCount} more
          </span>
        )}
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 sm:grid-cols-3 gap-2', className)}>
        {visibleFiles.map((file, index) => (
          <FileCard
            key={file.id || index}
            file={file}
            variant="compact"
            onRemove={onRemove ? () => onRemove(index) : undefined}
            onDownload={onDownload ? () => onDownload(file, index) : undefined}
            onPreview={onPreview ? () => onPreview(file, index) : undefined}
          />
        ))}
        {showOverflow && overflowCount > 0 && (
          <div className="flex items-center justify-center p-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            +{overflowCount} more files
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {visibleFiles.map((file, index) => (
        <FileCard
          key={file.id || index}
          file={file}
          variant={variant === 'compact' ? 'compact' : 'default'}
          onRemove={onRemove ? () => onRemove(index) : undefined}
          onDownload={onDownload ? () => onDownload(file, index) : undefined}
          onPreview={onPreview ? () => onPreview(file, index) : undefined}
        />
      ))}
      {showOverflow && overflowCount > 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          +{overflowCount} more files
        </p>
      )}
    </div>
  )
}

// ============================================================================
// ATTACHMENT BUTTON - Button to trigger file upload
// ============================================================================

interface AttachmentButtonProps {
  onSelect?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  variant?: 'default' | 'icon' | 'dashed'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function AttachmentButton({
  onSelect,
  accept,
  multiple = true,
  disabled = false,
  variant = 'icon',
  size = 'md',
  className,
  children,
}: AttachmentButtonProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onSelect?.(files)
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const sizeClasses = {
    sm: 'h-7 px-2',
    md: 'h-9 px-3',
    lg: 'h-11 px-4',
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {variant === 'icon' ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClick}
          disabled={disabled}
          className={cn('h-8 w-8 p-0', className)}
        >
          <Paperclip className="w-4 h-4" />
        </Button>
      ) : variant === 'dashed' ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center gap-2 w-full p-4 rounded-xl border-2 border-dashed border-border',
            'text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/30',
            'transition-all duration-200',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <Plus className="w-5 h-5" />
          {children || 'Add files'}
        </button>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled}
          className={cn(sizeClasses[size], 'gap-2', className)}
        >
          <Upload className="w-4 h-4" />
          {children || 'Upload'}
        </Button>
      )}
    </>
  )
}

// ============================================================================
// DROP ZONE - Drag and drop file upload area
// ============================================================================

interface DropZoneProps {
  onDrop?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  variant?: 'default' | 'compact' | 'inline'
  children?: React.ReactNode
  className?: string
}

export function DropZone({
  onDrop,
  accept,
  multiple = true,
  disabled = false,
  variant = 'default',
  children,
  className,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onDrop?.(multiple ? files : [files[0]])
    }
  }

  const handleClick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onDrop?.(files)
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  if (variant === 'inline') {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative transition-colors duration-200',
          isDragging && 'bg-primary/5',
          className
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        {children}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 border-2 border-dashed border-primary rounded-xl">
            <p className="text-primary font-medium">Drop files here</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 cursor-pointer',
        'border-2 border-dashed rounded-xl transition-all duration-200',
        variant === 'compact' ? 'p-4' : 'p-8',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/30',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {children || (
        <>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-medium">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  FileCardFile,
  FileCardProps,
  AttachmentsProps,
  AttachmentButtonProps,
  DropZoneProps,
}
