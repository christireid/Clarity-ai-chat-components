import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  Badge,
  Button,
  cn,
  formatFileSize,
  truncate,
} from '@clarity-chat/primitives'
import type { Context } from '@clarity-chat/types'

export interface ContextCardProps {
  context: Context
  onRemove?: (id: string) => void
  onToggle?: (id: string) => void
  onPreview?: (context: Context) => void
  showActions?: boolean
  className?: string
}

export const ContextCard = React.memo(function ContextCard({
  context,
  onRemove,
  onToggle,
  onPreview,
  showActions = true,
  className,
}: ContextCardProps) {
  const getIcon = () => {
    switch (context.type) {
      case 'document':
        return '📄'
      case 'image':
        return '🖼️'
      case 'video':
        return '🎥'
      case 'audio':
        return '🎵'
      case 'link':
        return '🔗'
      case 'text':
        return '📝'
      default:
        return '📎'
    }
  }

  const getTypeColor = () => {
    switch (context.type) {
      case 'document':
        return 'bg-primary/10 text-primary ring-1 ring-primary/20'
      case 'image':
        return 'bg-secondary/10 text-secondary-foreground ring-1 ring-secondary/20'
      case 'video':
        return 'bg-destructive/10 text-destructive ring-1 ring-destructive/20'
      case 'audio':
        return 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] ring-1 ring-[hsl(var(--success))]/20'
      case 'link':
        return 'bg-[hsl(var(--info))]/10 text-[hsl(var(--info))] ring-1 ring-[hsl(var(--info))]/20'
      case 'text':
        return 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] ring-1 ring-[hsl(var(--warning))]/20'
      default:
        return 'bg-muted text-muted-foreground ring-1 ring-border'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'group relative transition-all duration-150 ease-out shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] hover:-translate-y-px cursor-pointer',
          !context.isActive && 'opacity-60',
          className
        )}
        onClick={() => onPreview?.(context)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon/Thumbnail */}
            <div
              className={cn(
                'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]',
                getTypeColor()
              )}
            >
              {context.metadata.thumbnail ? (
                <img
                  src={context.metadata.thumbnail}
                  alt={context.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                getIcon()
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {context.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {context.metadata.extractedText
                      ? truncate(context.metadata.extractedText, 80)
                      : context.type}
                  </p>
                </div>

                {/* Status Badge */}
                <Badge
                  variant={context.isActive ? 'success' : 'secondary'}
                  size="sm"
                  className="flex-shrink-0"
                  dot={context.isActive}
                  pulse={context.isActive}
                >
                  {context.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Badge variant="outline" size="sm" className="capitalize">
                  {context.type}
                </Badge>
                {context.metadata.fileSize && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    {formatFileSize(context.metadata.fileSize)}
                  </span>
                )}
                {context.metadata.pageCount && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {context.metadata.pageCount} pages
                  </span>
                )}
                {context.metadata.duration && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {Math.round(context.metadata.duration / 60)} min
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {onToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation()
                    onToggle(context.id)
                  }}
                  className="gap-1.5"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {context.isActive ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    )}
                  </svg>
                  {context.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              )}
              {onPreview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation()
                    onPreview(context)
                  }}
                  className="gap-1.5"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Preview
                </Button>
              )}
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation()
                    onRemove(context.id)
                  }}
                  className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
})

ContextCard.displayName = 'ContextCard'
