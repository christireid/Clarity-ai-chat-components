import * as React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Badge, Button, cn, formatFileSize, truncate } from '@clarity-chat/primitives'
import type { Context } from '@clarity-chat/types'

export interface ContextCardProps {
  context: Context
  onRemove?: (id: string) => void
  onToggle?: (id: string) => void
  onPreview?: (context: Context) => void
  showActions?: boolean
  className?: string
}

export const ContextCard: React.FC<ContextCardProps> = ({
  context,
  onRemove,
  onToggle,
  onPreview,
  showActions = true,
  className,
}) => {
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
        return 'bg-blue-500/10 text-blue-500'
      case 'image':
        return 'bg-purple-500/10 text-purple-500'
      case 'video':
        return 'bg-red-500/10 text-red-500'
      case 'audio':
        return 'bg-green-500/10 text-green-500'
      case 'link':
        return 'bg-cyan-500/10 text-cyan-500'
      case 'text':
        return 'bg-yellow-500/10 text-yellow-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
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
          'group relative transition-all hover:shadow-md cursor-pointer',
          !context.isActive && 'opacity-50',
          className
        )}
        onClick={() => onPreview?.(context)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon/Thumbnail */}
            <div className={cn('flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl', getTypeColor())}>
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
                  <h4 className="font-medium text-sm truncate">{context.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {context.metadata.extractedText
                      ? truncate(context.metadata.extractedText, 80)
                      : context.type}
                  </p>
                </div>

                {/* Status Badge */}
                <Badge
                  variant={context.isActive ? 'default' : 'outline'}
                  className="flex-shrink-0 text-xs"
                  dot={context.isActive}
                >
                  {context.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs capitalize">
                  {context.type}
                </Badge>
                {context.metadata.fileSize && (
                  <span>{formatFileSize(context.metadata.fileSize)}</span>
                )}
                {context.metadata.pageCount && (
                  <span>{context.metadata.pageCount} pages</span>
                )}
                {context.metadata.duration && (
                  <span>{Math.round(context.metadata.duration / 60)} min</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
              {onToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggle(context.id)
                  }}
                >
                  {context.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                </Button>
              )}
              {onPreview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPreview(context)
                  }}
                >
                  👁️ Preview
                </Button>
              )}
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(context.id)
                  }}
                  className="ml-auto text-destructive hover:text-destructive"
                >
                  🗑️ Remove
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
