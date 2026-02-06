'use client'

import { cn } from '@clarity-chat/primitives'
import { useClipboard } from '@clarity-chat/react/internal'
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Trash2,
  Edit3,
  Check,
} from 'lucide-react'

interface MessageActionsProps {
  role: 'user' | 'assistant'
  feedback?: 'up' | 'down' | null
  onFeedback?: (feedback: 'up' | 'down') => void
  copyText?: string
  onRegenerate?: () => void
  onDelete?: () => void
  onEdit?: () => void
  className?: string
}

export function MessageActions({
  role,
  feedback,
  onFeedback,
  copyText,
  onRegenerate,
  onDelete,
  onEdit,
  className,
}: MessageActionsProps) {
  const { copy, copied } = useClipboard({ timeout: 2000 })

  const handleCopy = () => {
    if (copyText) copy(copyText)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity',
        className
      )}
    >
      {role === 'assistant' && (
        <>
          <button
            onClick={() => onFeedback?.('up')}
            className={cn(
              'p-1.5 rounded-md hover:bg-muted transition-colors',
              feedback === 'up' && 'text-green-500 bg-green-500/10'
            )}
            title="Good response"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onFeedback?.('down')}
            className={cn(
              'p-1.5 rounded-md hover:bg-muted transition-colors',
              feedback === 'down' && 'text-red-500 bg-red-500/10'
            )}
            title="Bad response"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </>
      )}
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-muted transition-colors"
        title="Copy"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
      {role === 'assistant' && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          title="Regenerate"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      )}
      {role === 'user' && onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          title="Edit"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        onClick={onDelete}
        className="p-1.5 rounded-md hover:bg-muted hover:text-red-500 transition-colors"
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
