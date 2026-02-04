import * as React from 'react'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { ImageIcon, MicIcon, FileIcon, LinkIcon, PlayIcon } from '../ui/icons'
import { ProgressiveImage } from '../ui/progressive-image'

export type AttachmentType = 'image' | 'audio' | 'video' | 'file' | 'link'

export interface AttachmentPreview {
  id: string
  type: AttachmentType
  title: string
  description?: string
  thumbnailUrl?: string
  status?: 'processing' | 'ready' | 'failed'
  durationMs?: number
  sizeLabel?: string
  metadata?: Array<{ label: string; value: string }>
}

export interface MultiModalPreviewProps {
  attachments: AttachmentPreview[]
  onOpen?: (attachment: AttachmentPreview) => void
  onRetry?: (attachment: AttachmentPreview) => void
  onRemove?: (attachment: AttachmentPreview) => void
  className?: string
  title?: string
  subtitle?: string
}

const typeIcon: Record<AttachmentType, React.ReactNode> = {
  image: <ImageIcon size={18} className="text-sky-500" />,
  audio: <MicIcon size={18} className="text-emerald-500" />,
  video: <PlayIcon size={18} className="text-purple-500" />,
  file: <FileIcon size={18} className="text-amber-500" />,
  link: <LinkIcon size={18} className="text-primary" />,
}

const statusBadge: Record<
  NonNullable<AttachmentPreview['status']>,
  'warning' | 'success' | 'destructive'
> = {
  processing: 'warning',
  ready: 'success',
  failed: 'destructive',
}

const statusLabel: Record<NonNullable<AttachmentPreview['status']>, string> = {
  processing: 'Processing',
  ready: 'Ready',
  failed: 'Failed',
}

const defaultTitle = 'Multimodal context'
const defaultSubtitle =
  'Surface the supporting images, audio, and documents that shaped this response.'

export const MultiModalPreview: React.FC<MultiModalPreviewProps> = ({
  attachments,
  onOpen,
  onRetry,
  onRemove,
  className,
  title = defaultTitle,
  subtitle = defaultSubtitle,
}) => {
  const renderStatus = (attachment: AttachmentPreview) => {
    if (!attachment.status) return null
    return (
      <Badge variant={statusBadge[attachment.status]} className="text-[11px]">
        {statusLabel[attachment.status]}
      </Badge>
    )
  }

  const renderThumbnail = (attachment: AttachmentPreview) => {
    if (attachment.thumbnailUrl) {
      return (
        <ProgressiveImage
          src={attachment.thumbnailUrl}
          alt={attachment.title}
          className="h-16 w-16 rounded-lg object-cover"
          placeholderClassName="rounded-lg"
        />
      )
    }

    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {typeIcon[attachment.type]}
      </div>
    )
  }

  const formatDuration = (durationMs?: number) => {
    if (!durationMs) return undefined
    const seconds = Math.round(durationMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainder = seconds % 60
    return `${minutes}:${remainder.toString().padStart(2, '0')}`
  }

  return (
    <Card
      className={cn(
        'border-border/50 bg-background shadow-md',
        className
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-semibold text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">
            {subtitle}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {attachments.length === 0 && (
          <div className="rounded-lg border border-dashed border-border/50 bg-muted p-6 text-center text-sm text-muted-foreground">
            No attachments were provided for this exchange.
          </div>
        )}

        <ul className="space-y-4">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex flex-col gap-3 rounded-lg border border-border/50 bg-muted p-4 shadow-md"
            >
              <div className="flex flex-wrap items-start gap-4">
                {renderThumbnail(attachment)}
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      {typeIcon[attachment.type]}
                      {attachment.title}
                    </div>
                    {renderStatus(attachment)}
                    {attachment.sizeLabel && (
                      <Badge variant="outline" className="text-[11px]">
                        {attachment.sizeLabel}
                      </Badge>
                    )}
                    {attachment.durationMs && (
                      <Badge variant="subtle" className="text-[11px]">
                        {formatDuration(attachment.durationMs)}
                      </Badge>
                    )}
                  </div>
                  {attachment.description && (
                    <p className="text-sm text-muted-foreground/85">
                      {attachment.description}
                    </p>
                  )}
                  {attachment.metadata && attachment.metadata.length > 0 && (
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground/70">
                      {attachment.metadata.map(({ label, value }) => (
                        <div
                          key={`${attachment.id}-${label}`}
                          className="flex items-center gap-1"
                        >
                          <span className="font-medium text-muted-foreground/90">
                            {label}:
                          </span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {onOpen && (
                  <Button
                    variant="surface"
                    size="sm"
                    onClick={() => onOpen(attachment)}
                  >
                    Open
                  </Button>
                )}
                {attachment.status === 'failed' && onRetry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRetry(attachment)}
                    className="text-warning-foreground hover:text-warning-foreground"
                  >
                    Retry processing
                  </Button>
                )}
                {onRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(attachment)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

MultiModalPreview.displayName = 'MultiModalPreview'
