'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type {
  Message as MessageType,
  ThinkingStep,
  ToolCall,
  Citation,
  Attachment,
} from './types/ai-types'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  Edit2,
  RefreshCw,
  MoreHorizontal,
  GitBranch,
  Share2,
  Trash2,
  User,
  Bot,
  Check,
  Loader2,
  ExternalLink,
  Paperclip,
  FileText,
  ImageIcon,
  Film,
  Music,
  Code,
} from 'lucide-react'
import { MarkdownRenderer } from './markdown-renderer'
import { ThinkingIndicator } from './thinking-indicator'
import { ToolCallDisplay } from './tool-call'
import { CitationChip } from './citation-chip'
import { Message } from './types/ai-types' // Import Message type

interface MessageProps {
  message: Message
  onCopy?: () => void
  onEdit?: () => void
  onRegenerate?: () => void
  onBranch?: () => void
  onFeedback?: (type: 'positive' | 'negative') => void
  onDelete?: () => void
  showActions?: boolean
  isEditing?: boolean
  editContent?: string
  onEditChange?: (content: string) => void
  onEditSubmit?: () => void
  onEditCancel?: () => void
  className?: string
}

export function MessageBubble({
  message,
  onCopy,
  onEdit,
  onRegenerate,
  onBranch,
  onFeedback,
  onDelete,
  showActions = true,
  isEditing = false,
  editContent,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  className,
}: MessageProps) {
  const [copied, setCopied] = React.useState(false)
  const [feedback, setFeedback] = React.useState<
    'positive' | 'negative' | null
  >(null)
  const isUser = message.role === 'user'
  const isStreaming = message.status === 'streaming'
  const hasThinking = message.thinkingSteps && message.thinkingSteps.length > 0
  const hasToolCalls = message.toolCalls && message.toolCalls.length > 0
  const hasCitations = message.citations && message.citations.length > 0
  const hasAttachments = message.attachments && message.attachments.length > 0

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type)
    onFeedback?.(type)
  }

  return (
    <div
      className={cn(
        'group relative flex gap-4 py-6 px-4 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {/* Avatar */}
      <Avatar
        className={cn(
          'h-8 w-8 shrink-0',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? (
          <>
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className="bg-muted text-foreground">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      {/* Content */}
      <div
        className={cn(
          'flex flex-col gap-2 max-w-[85%] md:max-w-[75%]',
          isUser && 'items-end'
        )}
      >
        {/* Role label */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{isUser ? 'You' : 'Assistant'}</span>
          {message.model && !isUser && (
            <span className="text-muted-foreground/60">· {message.model}</span>
          )}
          {(message.createdAt || message.timestamp) && (
            <span className="text-muted-foreground/60" suppressHydrationWarning>
              ·{' '}
              {new Date(
                message.createdAt || message.timestamp!
              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Attachments */}
        {hasAttachments && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments!.map((attachment) => (
              <AttachmentPreview key={attachment.id} attachment={attachment} />
            ))}
          </div>
        )}

        {/* Thinking Steps */}
        {hasThinking && !isUser && (
          <ThinkingIndicator
            steps={message.thinkingSteps!}
            isActive={isStreaming}
          />
        )}

        {/* Tool Calls */}
        {hasToolCalls && !isUser && (
          <div className="space-y-2">
            {message.toolCalls!.map((toolCall) => (
              <ToolCallDisplay key={toolCall.id} toolCall={toolCall} />
            ))}
          </div>
        )}

        {/* Message Content */}
        {isEditing ? (
          <div className="w-full space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => onEditChange?.(e.target.value)}
              className="w-full min-h-[100px] p-3 rounded-lg bg-secondary border border-border resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={onEditCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={onEditSubmit}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'rounded-2xl px-4 py-3',
              isUser
                ? 'bg-primary text-primary-foreground' // Use bg-primary for user messages
                : 'bg-muted text-foreground', // Use bg-muted for assistant messages
              isStreaming && 'animate-pulse-subtle'
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose-ai">
                <MarkdownRenderer content={message.content} />
                {isStreaming && <StreamingCursor />}
              </div>
            )}
          </div>
        )}

        {/* Citations */}
        {hasCitations && !isUser && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.citations!.map((citation, idx) => (
              <CitationChip
                key={citation.id}
                citation={citation}
                index={idx + 1}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        {showActions && !isEditing && (
          <MessageActions
            isUser={isUser}
            copied={copied}
            feedback={feedback}
            onCopy={handleCopy}
            onEdit={onEdit}
            onRegenerate={onRegenerate}
            onBranch={onBranch}
            onFeedback={handleFeedback}
            onDelete={onDelete}
          />
        )}

        {/* Token Count */}
        {message.tokenCount && !isUser && (
          <div className="text-xs text-muted-foreground/60">
            {message.tokenCount.total.toLocaleString()} tokens
          </div>
        )}
      </div>
    </div>
  )
}

function StreamingCursor() {
  return (
    <span className="inline-flex ml-1">
      <span className="w-2 h-4 bg-foreground/80 animate-pulse" />
    </span>
  )
}

interface MessageActionsProps {
  isUser: boolean
  copied: boolean
  feedback: 'positive' | 'negative' | null
  onCopy: () => void
  onEdit?: () => void
  onRegenerate?: () => void
  onBranch?: () => void
  onFeedback: (type: 'positive' | 'negative') => void
  onDelete?: () => void
}

function MessageActions({
  isUser,
  copied,
  feedback,
  onCopy,
  onEdit,
  onRegenerate,
  onBranch,
  onFeedback,
  onDelete,
}: MessageActionsProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
          isUser ? 'justify-end' : 'justify-start'
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-ai-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? 'Copied!' : 'Copy'}</TooltipContent>
        </Tooltip>

        {!isUser && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onFeedback('positive')}
                >
                  <ThumbsUp
                    className={cn(
                      'h-4 w-4',
                      feedback === 'positive' && 'fill-current text-ai-success'
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Good response</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onFeedback('negative')}
                >
                  <ThumbsDown
                    className={cn(
                      'h-4 w-4',
                      feedback === 'negative' && 'fill-current text-destructive'
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bad response</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onRegenerate}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Regenerate</TooltipContent>
            </Tooltip>
          </>
        )}

        {isUser && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onEdit}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isUser ? 'end' : 'start'}>
            <DropdownMenuItem onClick={onBranch}>
              <GitBranch className="h-4 w-4 mr-2" />
              Branch from here
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  )
}

function AttachmentPreview({ attachment }: { attachment: Attachment }) {
  const iconMap = {
    image: ImageIcon,
    file: FileText,
    video: Film,
    audio: Music,
    code: Code,
  }
  const Icon = iconMap[attachment.type] || Paperclip

  if (attachment.type === 'image' && attachment.url) {
    return (
      <div className="relative group/attachment">
        <img
          src={attachment.url || '/placeholder.svg'}
          alt={attachment.name}
          className="h-20 w-20 object-cover rounded-lg border border-border"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/attachment:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <ExternalLink className="h-4 w-4 text-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm truncate max-w-[150px]">{attachment.name}</span>
      {attachment.size && (
        <span className="text-xs text-muted-foreground">
          {(attachment.size / 1024).toFixed(1)}KB
        </span>
      )}
    </div>
  )
}

// Loading skeleton for messages
export function MessageSkeleton({
  role = 'assistant',
}: {
  role?: 'user' | 'assistant'
}) {
  const isUser = role === 'user'

  return (
    <div
      className={cn(
        'flex gap-4 py-6 px-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      <div
        className={cn('flex flex-col gap-2 max-w-[75%]', isUser && 'items-end')}
      >
        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser ? 'bg-muted' : 'bg-secondary'
          )}
        >
          <div className="space-y-2">
            <div className="h-4 w-64 bg-muted rounded animate-shimmer" />
            <div className="h-4 w-48 bg-muted rounded animate-shimmer" />
            {!isUser && (
              <div className="h-4 w-56 bg-muted rounded animate-shimmer" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Streaming text with shimmer effect
export function StreamingText({
  text,
  isComplete = false,
}: {
  text: string
  isComplete?: boolean
}) {
  return (
    <span className={cn(!isComplete && 'animate-pulse-subtle')}>
      {text}
      {!isComplete && (
        <span className="inline-block w-2 h-4 ml-1 bg-foreground animate-pulse" />
      )}
    </span>
  )
}
