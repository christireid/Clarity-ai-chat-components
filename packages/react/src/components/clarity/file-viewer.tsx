'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  File,
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FileJson,
  FileCog,
  Download,
  ExternalLink,
  Copy,
  Check,
  X,
  Eye,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'

// File type detection
const getFileType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const typeMap: Record<string, string> = {
    // Code
    js: 'code',
    jsx: 'code',
    ts: 'code',
    tsx: 'code',
    py: 'code',
    rb: 'code',
    go: 'code',
    rs: 'code',
    java: 'code',
    cpp: 'code',
    c: 'code',
    h: 'code',
    css: 'code',
    scss: 'code',
    less: 'code',
    html: 'code',
    xml: 'code',
    svg: 'code',
    php: 'code',
    swift: 'code',
    kt: 'code',
    // Data
    json: 'json',
    yaml: 'json',
    yml: 'json',
    toml: 'json',
    // Text
    md: 'text',
    txt: 'text',
    rtf: 'text',
    doc: 'text',
    docx: 'text',
    // Spreadsheet
    csv: 'spreadsheet',
    xls: 'spreadsheet',
    xlsx: 'spreadsheet',
    // Image
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    webp: 'image',
    bmp: 'image',
    ico: 'image',
    // Video
    mp4: 'video',
    webm: 'video',
    mov: 'video',
    avi: 'video',
    // Audio
    mp3: 'audio',
    wav: 'audio',
    ogg: 'audio',
    flac: 'audio',
    // Archive
    zip: 'archive',
    tar: 'archive',
    gz: 'archive',
    rar: 'archive',
    '7z': 'archive',
    // Config
    env: 'config',
    gitignore: 'config',
    dockerignore: 'config',
    dockerfile: 'config',
    makefile: 'config',
  }
  return typeMap[ext] || 'file'
}

// File icon component
interface FileIconProps {
  filename: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function FileIcon({ filename, size = 'md', className }: FileIconProps) {
  const type = getFileType(filename)
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
  }

  const icons: Record<string, React.ElementType> = {
    code: FileCode,
    json: FileJson,
    text: FileText,
    spreadsheet: FileSpreadsheet,
    image: FileImage,
    video: FileVideo,
    audio: FileAudio,
    archive: FileArchive,
    config: FileCog,
    file: File,
  }

  const colors: Record<string, string> = {
    code: 'text-blue-500',
    json: 'text-yellow-500',
    text: 'text-gray-500',
    spreadsheet: 'text-green-500',
    image: 'text-purple-500',
    video: 'text-red-500',
    audio: 'text-pink-500',
    archive: 'text-orange-500',
    config: 'text-gray-400',
    file: 'text-gray-400',
  }

  const Icon = icons[type]

  return <Icon className={cn(sizeClasses[size], colors[type], className)} />
}

// File attachment card
interface FileAttachment {
  id: string
  name: string
  size: number
  type?: string
  url?: string
  preview?: string
}

interface FileAttachmentCardProps {
  file: FileAttachment
  onRemove?: () => void
  onDownload?: () => void
  onPreview?: () => void
  removable?: boolean
  className?: string
}

export function FileAttachmentCard({
  file,
  onRemove,
  onDownload,
  onPreview,
  removable = false,
  className,
}: FileAttachmentCardProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const fileType = getFileType(file.name)
  const isImage = fileType === 'image'

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors',
        className
      )}
    >
      {isImage && file.preview ? (
        <div className="h-10 w-10 rounded overflow-hidden bg-muted">
          <img
            src={file.preview || '/placeholder.svg'}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <FileIcon filename={file.name} size="lg" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onPreview && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onPreview}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onDownload && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        {removable && onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// File preview dialog
interface FilePreviewProps {
  file: FileAttachment
  open: boolean
  onOpenChange: (open: boolean) => void
  content?: string
}

export function FilePreview({
  file,
  open,
  onOpenChange,
  content,
}: FilePreviewProps) {
  const [zoom, setZoom] = React.useState(100)
  const [rotation, setRotation] = React.useState(0)
  const [copied, setCopied] = React.useState(false)

  const fileType = getFileType(file.name)
  const isImage = fileType === 'image'
  const isCode =
    fileType === 'code' || fileType === 'json' || fileType === 'config'

  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileIcon filename={file.name} />
            {file.name}
          </DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
          <div className="flex items-center gap-2">
            {isImage && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setZoom((z) => Math.max(25, z - 25))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-12 text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setZoom((z) => Math.min(200, z + 25))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isCode && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                Copy
              </Button>
            )}
            {file.url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={file.url} download={file.name}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[60vh]">
          {isImage && file.preview && (
            <div className="flex items-center justify-center p-4">
              <img
                src={file.preview || '/placeholder.svg'}
                alt={file.name}
                className="max-w-full transition-transform"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                }}
              />
            </div>
          )}
          {isCode && content && (
            <pre className="p-4 bg-code-bg rounded-lg overflow-x-auto">
              <code className="text-sm font-mono">{content}</code>
            </pre>
          )}
          {fileType === 'text' && content && (
            <div className="p-4 prose prose-sm max-w-none dark:prose-invert">
              {content}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// File list with selection
interface FileListProps {
  files: FileAttachment[]
  selected?: string[]
  onSelect?: (ids: string[]) => void
  onPreview?: (file: FileAttachment) => void
  onDownload?: (file: FileAttachment) => void
  onRemove?: (file: FileAttachment) => void
  selectable?: boolean
  removable?: boolean
  className?: string
}

export function FileList({
  files,
  selected = [],
  onSelect,
  onPreview,
  onDownload,
  onRemove,
  selectable = false,
  removable = false,
  className,
}: FileListProps) {
  const toggleSelect = (id: string) => {
    if (!selectable || !onSelect) return
    if (selected.includes(id)) {
      onSelect(selected.filter((s) => s !== id))
    } else {
      onSelect([...selected, id])
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {files.map((file) => (
        <div
          key={file.id}
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-pointer',
            selected.includes(file.id)
              ? 'border-accent bg-accent/10'
              : 'border-border hover:bg-secondary/50'
          )}
          onClick={() => toggleSelect(file.id)}
        >
          {selectable && (
            <div
              className={cn(
                'h-4 w-4 rounded border flex items-center justify-center',
                selected.includes(file.id)
                  ? 'bg-accent border-accent'
                  : 'border-muted-foreground'
              )}
            >
              {selected.includes(file.id) && (
                <Check className="h-3 w-3 text-accent-foreground" />
              )}
            </div>
          )}

          <FileIcon filename={file.name} />

          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{file.name}</p>
          </div>

          <div className="flex items-center gap-1">
            {onPreview && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  onPreview(file)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onDownload && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload(file)
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {removable && onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(file)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Image gallery with lightbox
interface ImageGalleryViewerProps {
  images: { id: string; url: string; alt?: string; caption?: string }[]
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageGalleryViewer({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}: ImageGalleryViewerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
  const [zoom, setZoom] = React.useState(100)

  const currentImage = images[currentIndex]

  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % images.length)
    setZoom(100)
  }

  const goPrev = () => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length)
    setZoom(100)
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <div className="relative flex flex-col h-full">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom((z) => Math.max(50, z - 25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-12 text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom((z) => Math.min(200, z + 25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <img
              src={currentImage.url || '/placeholder.svg'}
              alt={currentImage.alt ?? ''}
              className="max-w-full max-h-full object-contain transition-transform"
              style={{ transform: `scale(${zoom / 100})` }}
            />
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80"
                onClick={goPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80"
                onClick={goNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Caption */}
          {currentImage.caption && (
            <div className="p-3 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                {currentImage.caption}
              </p>
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="p-3 border-t border-border">
              <div className="flex items-center justify-center gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    className={cn(
                      'h-12 w-12 rounded overflow-hidden border-2 transition-colors',
                      i === currentIndex
                        ? 'border-accent'
                        : 'border-transparent hover:border-border'
                    )}
                    onClick={() => setCurrentIndex(i)}
                  >
                    <img
                      src={img.url || '/placeholder.svg'}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
