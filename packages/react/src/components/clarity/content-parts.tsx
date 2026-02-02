'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  ImageIcon,
  FileText,
  Code,
  Table,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  X,
  File,
  Music,
  Video,
  FileSpreadsheet,
  Presentation,
  Archive,
} from 'lucide-react'

// =============================================================================
// CONTENT PART TYPES - Assistant-UI inspired but enhanced
// =============================================================================

export type ContentPartType =
  | 'text'
  | 'image'
  | 'file'
  | 'code'
  | 'table'
  | 'audio'
  | 'video'
  | 'embed'
  | 'chart'
  | 'tool-call'
  | 'ui'

interface BaseContentPart {
  id: string
  type: ContentPartType
}

export interface TextContentPart extends BaseContentPart {
  type: 'text'
  text: string
}

export interface ImageContentPart extends BaseContentPart {
  type: 'image'
  url: string
  alt?: string
  width?: number
  height?: number
  caption?: string
}

export interface FileContentPart extends BaseContentPart {
  type: 'file'
  name: string
  url: string
  mimeType?: string
  size?: number
}

export interface CodeContentPart extends BaseContentPart {
  type: 'code'
  code: string
  language?: string
  filename?: string
}

export interface TableContentPart extends BaseContentPart {
  type: 'table'
  headers: string[]
  rows: string[][]
  caption?: string
}

export interface AudioContentPart extends BaseContentPart {
  type: 'audio'
  url: string
  title?: string
  duration?: number
}

export interface VideoContentPart extends BaseContentPart {
  type: 'video'
  url: string
  poster?: string
  title?: string
}

export interface EmbedContentPart extends BaseContentPart {
  type: 'embed'
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
}

export interface ToolCallContentPart extends BaseContentPart {
  type: 'tool-call'
  toolName: string
  args: Record<string, unknown>
  result?: unknown
  status: 'pending' | 'running' | 'complete' | 'error'
}

export interface UIContentPart extends BaseContentPart {
  type: 'ui'
  component: React.ReactNode
}

export type ContentPart =
  | TextContentPart
  | ImageContentPart
  | FileContentPart
  | CodeContentPart
  | TableContentPart
  | AudioContentPart
  | VideoContentPart
  | EmbedContentPart
  | ToolCallContentPart
  | UIContentPart

// =============================================================================
// CONTENT PART RENDERER - Main component
// =============================================================================

interface ContentPartRendererProps {
  part: ContentPart
  className?: string
}

export function ContentPartRenderer({
  part,
  className,
}: ContentPartRendererProps) {
  switch (part.type) {
    case 'text':
      return <TextPart part={part} className={className} />
    case 'image':
      return <ImagePart part={part} className={className} />
    case 'file':
      return <FilePart part={part} className={className} />
    case 'code':
      return <CodePart part={part} className={className} />
    case 'table':
      return <TablePart part={part} className={className} />
    case 'audio':
      return <AudioPart part={part} className={className} />
    case 'video':
      return <VideoPart part={part} className={className} />
    case 'embed':
      return <EmbedPart part={part} className={className} />
    case 'tool-call':
      return <ToolCallPart part={part} className={className} />
    case 'ui':
      return <UIPart part={part} className={className} />
    default:
      return null
  }
}

// =============================================================================
// TEXT PART
// =============================================================================

function TextPart({
  part,
  className,
}: {
  part: TextContentPart
  className?: string
}) {
  return (
    <div
      className={cn('prose prose-sm dark:prose-invert max-w-none', className)}
    >
      <p className="whitespace-pre-wrap">{part.text}</p>
    </div>
  )
}

// =============================================================================
// IMAGE PART - With lightbox
// =============================================================================

function ImagePart({
  part,
  className,
}: {
  part: ImageContentPart
  className?: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <figure className={cn('space-y-2', className)}>
        <div className="relative group rounded-lg overflow-hidden bg-muted">
          <ImageIcon
            src={part.url || '/placeholder.svg'}
            alt={part.alt || 'Image'}
            width={part.width}
            height={part.height}
            className="w-full h-auto max-h-[400px] object-contain cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsOpen(true)}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10"
              asChild
            >
              <a href={part.url} download>
                <Download className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        {part.caption && (
          <figcaption className="text-sm text-center text-muted-foreground">
            {part.caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <ImageIcon
            src={part.url || '/placeholder.svg'}
            alt={part.alt || 'Image'}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

// =============================================================================
// FILE PART - With type icons
// =============================================================================

function FilePart({
  part,
  className,
}: {
  part: FileContentPart
  className?: string
}) {
  const getFileIcon = (mimeType?: string, name?: string) => {
    if (mimeType?.startsWith('image/')) return <ImageIcon className="h-5 w-5" />
    if (mimeType?.startsWith('audio/')) return <Music className="h-5 w-5" />
    if (mimeType?.startsWith('video/')) return <Video className="h-5 w-5" />
    if (mimeType?.includes('spreadsheet') || name?.match(/\.(xlsx?|csv)$/i))
      return <FileSpreadsheet className="h-5 w-5" />
    if (mimeType?.includes('presentation') || name?.match(/\.(pptx?|key)$/i))
      return <Presentation className="h-5 w-5" />
    if (mimeType?.includes('zip') || name?.match(/\.(zip|rar|7z|tar|gz)$/i))
      return <Archive className="h-5 w-5" />
    if (mimeType?.includes('pdf') || mimeType?.includes('document'))
      return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return ''
    const units = ['B', 'KB', 'MB', 'GB']
    let i = 0
    let size = bytes
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024
      i++
    }
    return `${size.toFixed(1)} ${units[i]}`
  }

  return (
    <a
      href={part.url}
      download={part.name}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors group',
        className
      )}
    >
      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        {getFileIcon(part.mimeType, part.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{part.name}</p>
        {part.size && (
          <p className="text-xs text-muted-foreground">
            {formatSize(part.size)}
          </p>
        )}
      </div>
      <Download className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  )
}

// =============================================================================
// CODE PART - With syntax highlighting placeholder
// =============================================================================

function CodePart({
  part,
  className,
}: {
  part: CodeContentPart
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(part.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-border',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {part.filename || part.language || 'Code'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      {/* Code */}
      <pre className="p-4 overflow-x-auto bg-card">
        <code className="text-sm font-mono">{part.code}</code>
      </pre>
    </div>
  )
}

// =============================================================================
// TABLE PART
// =============================================================================

function TablePart({
  part,
  className,
}: {
  part: TableContentPart
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-border',
        className
      )}
    >
      {part.caption && (
        <div className="px-4 py-2 bg-muted border-b border-border">
          <span className="text-sm font-medium">{part.caption}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {part.headers.map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-2 text-left font-medium border-b border-border"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {part.rows.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// =============================================================================
// AUDIO PART
// =============================================================================

function AudioPart({
  part,
  className,
}: {
  part: AudioContentPart
  className?: string
}) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(p)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-border bg-card',
        className
      )}
    >
      <audio
        ref={audioRef}
        src={part.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 flex-shrink-0 bg-transparent"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <div className="flex-1 min-w-0">
        {part.title && (
          <p className="text-sm font-medium truncate">{part.title}</p>
        )}
        <div className="h-1.5 mt-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        onClick={toggleMute}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

// =============================================================================
// VIDEO PART
// =============================================================================

function VideoPart({
  part,
  className,
}: {
  part: VideoContentPart
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-border bg-black',
        className
      )}
    >
      <video
        src={part.url}
        poster={part.poster}
        controls
        className="w-full max-h-[400px]"
      />
      {part.title && (
        <div className="px-4 py-2 bg-card border-t border-border">
          <p className="text-sm font-medium">{part.title}</p>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// EMBED PART - Link preview
// =============================================================================

function EmbedPart({
  part,
  className,
}: {
  part: EmbedContentPart
  className?: string
}) {
  return (
    <a
      href={part.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors group',
        className
      )}
    >
      {part.image && (
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
          <ImageIcon
            src={part.image || '/placeholder.svg'}
            alt={part.title || 'Preview'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        {part.siteName && (
          <p className="text-xs text-muted-foreground">{part.siteName}</p>
        )}
        <p className="text-sm font-medium line-clamp-1">
          {part.title || part.url}
        </p>
        {part.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {part.description}
          </p>
        )}
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </a>
  )
}

// =============================================================================
// TOOL CALL PART
// =============================================================================

function ToolCallPart({
  part,
  className,
}: {
  part: ToolCallContentPart
  className?: string
}) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const statusColors = {
    pending: 'bg-muted text-muted-foreground',
    running: 'bg-blue-500/10 text-blue-500',
    complete: 'bg-green-500/10 text-green-500',
    error: 'bg-destructive/10 text-destructive',
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted transition-colors"
      >
        <div
          className={cn('h-2 w-2 rounded-full', statusColors[part.status])}
        />
        <Code className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-sm font-medium">{part.toolName}</span>
        <span className="text-xs text-muted-foreground capitalize">
          {part.status}
        </span>
      </button>
      {isExpanded && (
        <div className="border-t border-border p-3 bg-muted/50 space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Arguments
            </p>
            <pre className="text-xs font-mono bg-card p-2 rounded overflow-x-auto">
              {JSON.stringify(part.args, null, 2)}
            </pre>
          </div>
          {part.result !== undefined && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Result
              </p>
              <pre className="text-xs font-mono bg-card p-2 rounded overflow-x-auto">
                {JSON.stringify(part.result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// UI PART - Custom component
// =============================================================================

function UIPart({
  part,
  className,
}: {
  part: UIContentPart
  className?: string
}) {
  return <div className={className}>{part.component}</div>
}

// =============================================================================
// CONTENT PARTS LIST - Render multiple parts
// =============================================================================

interface ContentPartsListProps {
  parts: ContentPart[]
  className?: string
  gap?: 'sm' | 'md' | 'lg'
}

export function ContentPartsList({
  parts,
  className,
  gap = 'md',
}: ContentPartsListProps) {
  const gapClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  }

  return (
    <div className={cn(gapClasses[gap], className)}>
      {parts.map((part) => (
        <ContentPartRenderer key={part.id} part={part} />
      ))}
    </div>
  )
}

// =============================================================================
// IMAGE GALLERY - Multiple images
// =============================================================================

interface ImageGalleryProps {
  images: ImageContentPart[]
  columns?: 2 | 3 | 4
  className?: string
}

export function ImageGallery({
  images,
  columns = 3,
  className,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)

  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  }

  return (
    <>
      <div className={cn('grid gap-2', columnClasses[columns], className)}>
        {images.map((image, i) => (
          <button
            key={image.id}
            onClick={() => setSelectedIndex(i)}
            className="aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity"
          >
            <ImageIcon
              src={image.url || '/placeholder.svg'}
              alt={image.alt || `Image ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          <ImageIcon
            src={images[selectedIndex].url || '/placeholder.svg'}
            alt={images[selectedIndex].alt || 'Image'}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex(i)
                  }}
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors',
                    i === selectedIndex
                      ? 'bg-white'
                      : 'bg-white/50 hover:bg-white/75'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
