'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Download,
  FileDown,
  Check,
  X,
  Pause,
  Play,
  Folder,
  File,
  FileText,
  FileCode,
  FileImage,
  FileArchive,
  Loader2,
  ExternalLink,
  Copy,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'

// Types
export interface DownloadItem {
  id: string
  name: string
  size: number
  type: string
  url: string
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'error'
  progress?: number
  error?: string
}

// Download Button
export interface DownloadButtonProps {
  url: string
  filename?: string
  label?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  onDownload?: () => void
  className?: string
}

export function DownloadButton({
  url,
  filename,
  label = 'Download',
  variant = 'default',
  size = 'default',
  onDownload,
  className,
}: DownloadButtonProps) {
  const [downloading, setDownloading] = React.useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    onDownload?.()

    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename || url.split('/').pop() || 'download'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={downloading}
      className={className}
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {size !== 'icon' && <span className="ml-2">{label}</span>}
    </Button>
  )
}

// Download Card
export interface DownloadCardProps {
  item: DownloadItem
  onPause?: () => void
  onResume?: () => void
  onCancel?: () => void
  onRetry?: () => void
  onOpen?: () => void
  className?: string
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return FileImage
  if (type.includes('zip') || type.includes('archive')) return FileArchive
  if (
    type.includes('code') ||
    type.includes('javascript') ||
    type.includes('typescript')
  )
    return FileCode
  if (type.includes('text') || type.includes('pdf')) return FileText
  return File
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function DownloadCard({
  item,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onOpen,
  className,
}: DownloadCardProps) {
  const FileIcon = getFileIcon(item.type)

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 bg-card border border-border rounded-lg',
        className
      )}
    >
      <div
        className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center',
          item.status === 'completed' && 'bg-green-500/10 text-green-500',
          item.status === 'error' && 'bg-destructive/10 text-destructive',
          item.status === 'downloading' && 'bg-accent/10 text-accent',
          (item.status === 'pending' || item.status === 'paused') &&
            'bg-muted text-muted-foreground'
        )}
      >
        <FileIcon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium truncate">{item.name}</span>
          <span className="text-xs text-muted-foreground ml-2">
            {formatSize(item.size)}
          </span>
        </div>

        {item.status === 'downloading' && (
          <div className="space-y-1">
            <Progress value={item.progress || 0} className="h-1.5" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.progress}%</span>
              <span>Downloading...</span>
            </div>
          </div>
        )}

        {item.status === 'completed' && (
          <span className="text-xs text-green-500">Download complete</span>
        )}

        {item.status === 'error' && (
          <span className="text-xs text-destructive">
            {item.error || 'Download failed'}
          </span>
        )}

        {item.status === 'paused' && (
          <span className="text-xs text-muted-foreground">Paused</span>
        )}

        {item.status === 'pending' && (
          <span className="text-xs text-muted-foreground">Waiting...</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {item.status === 'downloading' && onPause && (
          <Button variant="ghost" size="icon" onClick={onPause}>
            <Pause className="h-4 w-4" />
          </Button>
        )}

        {item.status === 'paused' && onResume && (
          <Button variant="ghost" size="icon" onClick={onResume}>
            <Play className="h-4 w-4" />
          </Button>
        )}

        {item.status === 'completed' && onOpen && (
          <Button variant="ghost" size="icon" onClick={onOpen}>
            <Folder className="h-4 w-4" />
          </Button>
        )}

        {item.status === 'error' && onRetry && (
          <Button variant="ghost" size="icon" onClick={onRetry}>
            <Download className="h-4 w-4" />
          </Button>
        )}

        {(item.status === 'downloading' || item.status === 'paused') &&
          onCancel && (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
      </div>
    </div>
  )
}

// Download Manager
export interface DownloadManagerProps {
  downloads: DownloadItem[]
  onPause?: (id: string) => void
  onResume?: (id: string) => void
  onCancel?: (id: string) => void
  onRetry?: (id: string) => void
  onClearCompleted?: () => void
  className?: string
}

export function DownloadManager({
  downloads,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onClearCompleted,
  className,
}: DownloadManagerProps) {
  const activeDownloads = downloads.filter(
    (d) => d.status === 'downloading' || d.status === 'paused'
  )
  const completedDownloads = downloads.filter((d) => d.status === 'completed')
  const failedDownloads = downloads.filter((d) => d.status === 'error')

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Downloads</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{activeDownloads.length} active</span>
          <span>|</span>
          <span>{completedDownloads.length} completed</span>
        </div>
      </div>

      {downloads.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileDown className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No downloads</p>
        </div>
      ) : (
        <div className="space-y-3">
          {downloads.map((item) => (
            <DownloadCard
              key={item.id}
              item={item}
              onPause={onPause ? () => onPause(item.id) : undefined}
              onResume={onResume ? () => onResume(item.id) : undefined}
              onCancel={onCancel ? () => onCancel(item.id) : undefined}
              onRetry={onRetry ? () => onRetry(item.id) : undefined}
            />
          ))}
        </div>
      )}

      {completedDownloads.length > 0 && onClearCompleted && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearCompleted}
          className="mt-4"
        >
          Clear completed
        </Button>
      )}
    </div>
  )
}

// Export Options Component
export interface ExportOption {
  id: string
  label: string
  description?: string
  format: string
  icon?: React.ReactNode
}

export interface ExportOptionsProps {
  options: ExportOption[]
  onExport: (format: string) => void
  title?: string
  className?: string
}

export function ExportOptions({
  options,
  onExport,
  title = 'Export',
  className,
}: ExportOptionsProps) {
  return (
    <div className={cn('w-full', className)}>
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onExport(option.format)}
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border border-border',
              'hover:bg-muted/50 hover:border-accent/50 transition-colors text-left'
            )}
          >
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              {option.icon || <FileDown className="h-5 w-5" />}
            </div>
            <div>
              <div className="font-medium">{option.label}</div>
              {option.description && (
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Share/Copy Link
export interface ShareLinkProps {
  url: string
  title?: string
  className?: string
}

export function ShareLink({ url, title = 'Share', className }: ShareLinkProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm truncate font-mono">
        {url}
      </div>
      <Button variant="outline" size="icon" onClick={handleCopy}>
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(url, '_blank')}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  )
}
