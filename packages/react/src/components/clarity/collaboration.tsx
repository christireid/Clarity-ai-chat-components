'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import {
  Users,
  MessageSquare,
  Edit3,
  Check,
  X,
  Reply,
  MoreHorizontal,
  Trash2,
  Pin,
  Clock,
  Eye,
  MousePointer2,
  Share2,
  Link2,
  Copy,
  CheckCircle,
  Send,
  AtSign,
  Hash,
  Smile,
} from 'lucide-react'

// Types
export interface Collaborator {
  id: string
  name: string
  email?: string
  avatar?: string
  color: string
  status: 'online' | 'away' | 'offline'
  lastSeen?: Date
  cursorPosition?: { x: number; y: number }
  selection?: { start: number; end: number }
}

export interface Comment {
  id: string
  content: string
  author: Collaborator
  createdAt: Date
  updatedAt?: Date
  resolved?: boolean
  replies?: Comment[]
  position?: { line?: number; char?: number; elementId?: string }
  isPinned?: boolean
}

export interface Annotation {
  id: string
  type: 'highlight' | 'underline' | 'strikethrough' | 'comment'
  color: string
  start: number
  end: number
  text: string
  author: Collaborator
  comment?: string
}

export interface Version {
  id: string
  name: string
  description?: string
  author: Collaborator
  createdAt: Date
  changes: number
  isCurrent?: boolean
}

// Live Cursor
interface LiveCursorProps {
  collaborator: Collaborator
  className?: string
}

export function LiveCursor({ collaborator, className }: LiveCursorProps) {
  if (!collaborator.cursorPosition) return null

  return (
    <div
      className={cn(
        'absolute pointer-events-none z-50 transition-all duration-75',
        className
      )}
      style={{
        left: collaborator.cursorPosition.x,
        top: collaborator.cursorPosition.y,
      }}
    >
      <MousePointer2
        className="h-5 w-5 -rotate-12"
        style={{ color: collaborator.color }}
        fill={collaborator.color}
      />
      <span
        className="ml-2 px-2 py-0.5 text-xs text-white rounded whitespace-nowrap"
        style={{ backgroundColor: collaborator.color }}
      >
        {collaborator.name}
      </span>
    </div>
  )
}

// Collaborator Avatars
interface CollaboratorAvatarsProps {
  collaborators: Collaborator[]
  maxVisible?: number
  size?: 'sm' | 'md' | 'lg'
  showStatus?: boolean
  onCollaboratorClick?: (collaborator: Collaborator) => void
  className?: string
}

export function CollaboratorAvatars({
  collaborators,
  maxVisible = 5,
  size = 'md',
  showStatus = true,
  onCollaboratorClick,
  className,
}: CollaboratorAvatarsProps) {
  const visible = collaborators.slice(0, maxVisible)
  const remaining = collaborators.length - maxVisible

  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400',
  }

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visible.map((collaborator) => (
        <TooltipProvider key={collaborator.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar
                  className={cn(
                    sizes[size],
                    'border-2 border-background cursor-pointer hover:z-10 transition-transform hover:scale-110'
                  )}
                  style={{ borderColor: collaborator.color }}
                  onClick={() => onCollaboratorClick?.(collaborator)}
                >
                  <AvatarImage
                    src={collaborator.avatar || '/placeholder.svg'}
                  />
                  <AvatarFallback
                    style={{ backgroundColor: collaborator.color }}
                  >
                    {collaborator.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {showStatus && (
                  <span
                    className={cn(
                      'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background',
                      statusColors[collaborator.status]
                    )}
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{collaborator.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {collaborator.status}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            sizes[size],
            'rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

// Presence Indicator
interface PresenceIndicatorProps {
  collaborators: Collaborator[]
  currentUserId: string
  className?: string
}

export function PresenceIndicator({
  collaborators,
  currentUserId,
  className,
}: PresenceIndicatorProps) {
  const others = collaborators.filter((c) => c.id !== currentUserId)
  const online = others.filter((c) => c.status === 'online')

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CollaboratorAvatars collaborators={online} size="sm" />
      <span className="text-sm text-muted-foreground">
        {online.length} {online.length === 1 ? 'person' : 'people'} viewing
      </span>
    </div>
  )
}

// Comment Thread
interface CommentThreadProps {
  comment: Comment
  onReply?: (content: string) => void
  onResolve?: () => void
  onDelete?: () => void
  onPin?: () => void
  currentUserId?: string
  className?: string
}

export function CommentThread({
  comment,
  onReply,
  onResolve,
  onDelete,
  onPin,
  currentUserId,
  className,
}: CommentThreadProps) {
  const [isReplying, setIsReplying] = React.useState(false)
  const [replyContent, setReplyContent] = React.useState('')

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply?.(replyContent)
      setReplyContent('')
      setIsReplying(false)
    }
  }

  const isOwner = currentUserId === comment.author.id

  return (
    <div
      className={cn(
        'border rounded-lg p-3 space-y-3',
        comment.resolved && 'opacity-60',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={comment.author.avatar || '/placeholder.svg'} />
            <AvatarFallback style={{ backgroundColor: comment.author.color }}>
              {comment.author.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{comment.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {comment.createdAt.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {comment.isPinned && (
            <Pin className="h-3 w-3 text-muted-foreground" />
          )}
          {comment.resolved && (
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Resolved
            </Badge>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-1">
              {onResolve && !comment.resolved && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onResolve}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Resolve
                </Button>
              )}
              {onPin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={onPin}
                >
                  <Pin className="h-4 w-4 mr-2" />
                  {comment.isPinned ? 'Unpin' : 'Pin'}
                </Button>
              )}
              {isOwner && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <p className="text-sm">{comment.content}</p>

      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-4 border-l-2 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={reply.author.avatar || '/placeholder.svg'} />
                <AvatarFallback style={{ backgroundColor: reply.author.color }}>
                  {reply.author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium">{reply.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {reply.createdAt.toLocaleTimeString()}
                  </p>
                </div>
                <p className="text-sm">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!comment.resolved && (
        <>
          {isReplying ? (
            <div className="space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSubmitReply}>
                  Reply
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setIsReplying(true)}
            >
              <Reply className="h-4 w-4 mr-1" />
              Reply
            </Button>
          )}
        </>
      )}
    </div>
  )
}

// Comments Panel
interface CommentsPanelProps {
  comments: Comment[]
  onAddComment?: (content: string) => void
  onResolve?: (id: string) => void
  onDelete?: (id: string) => void
  onReply?: (id: string, content: string) => void
  currentUserId?: string
  className?: string
}

export function CommentsPanel({
  comments,
  onAddComment,
  onResolve,
  onDelete,
  onReply,
  currentUserId,
  className,
}: CommentsPanelProps) {
  const [newComment, setNewComment] = React.useState('')
  const [filter, setFilter] = React.useState<'all' | 'open' | 'resolved'>('all')

  const filteredComments = comments.filter((comment) => {
    if (filter === 'open') return !comment.resolved
    if (filter === 'resolved') return comment.resolved
    return true
  })

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment)
      setNewComment('')
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments
          </CardTitle>
          <div className="flex gap-1">
            {(['all', 'open', 'resolved'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'secondary' : 'ghost'}
                size="sm"
                className="text-xs"
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {onAddComment && (
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={!newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        )}

        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {filteredComments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                onResolve={() => onResolve?.(comment.id)}
                onDelete={() => onDelete?.(comment.id)}
                onReply={(content) => onReply?.(comment.id, content)}
                currentUserId={currentUserId}
              />
            ))}
            {filteredComments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No comments yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Annotation Highlight
interface AnnotationHighlightProps {
  annotation: Annotation
  onClick?: () => void
  className?: string
}

export function AnnotationHighlight({
  annotation,
  onClick,
  className,
}: AnnotationHighlightProps) {
  const styles = {
    highlight: `bg-[${annotation.color}]/30`,
    underline: `border-b-2 border-[${annotation.color}]`,
    strikethrough: 'line-through',
    comment: `bg-yellow-500/20 border-b border-dashed border-yellow-500`,
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(styles[annotation.type], 'cursor-pointer', className)}
            style={{
              backgroundColor:
                annotation.type === 'highlight'
                  ? `${annotation.color}30`
                  : undefined,
              borderColor:
                annotation.type === 'underline' ? annotation.color : undefined,
            }}
            onClick={onClick}
          >
            {annotation.text}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <Avatar className="h-4 w-4">
              <AvatarFallback
                style={{ backgroundColor: annotation.author.color }}
              >
                {annotation.author.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">{annotation.author.name}</span>
          </div>
          {annotation.comment && (
            <p className="text-xs mt-1">{annotation.comment}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Version History
interface VersionHistoryProps {
  versions: Version[]
  onVersionSelect?: (version: Version) => void
  onCompare?: (v1: Version, v2: Version) => void
  className?: string
}

export function VersionHistory({
  versions,
  onVersionSelect,
  onCompare,
  className,
}: VersionHistoryProps) {
  const [compareMode, setCompareMode] = React.useState(false)
  const [selected, setSelected] = React.useState<Version[]>([])

  const handleSelect = (version: Version) => {
    if (compareMode) {
      if (selected.find((v) => v.id === version.id)) {
        setSelected(selected.filter((v) => v.id !== version.id))
      } else if (selected.length < 2) {
        setSelected([...selected, version])
      }
    } else {
      onVersionSelect?.(version)
    }
  }

  const handleCompare = () => {
    if (selected.length === 2) {
      onCompare?.(selected[0], selected[1])
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Version History
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={compareMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCompareMode(!compareMode)
                setSelected([])
              }}
            >
              Compare
            </Button>
            {compareMode && selected.length === 2 && (
              <Button size="sm" onClick={handleCompare}>
                View Diff
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {versions.map((version) => {
              const isSelected = selected.find((v) => v.id === version.id)

              return (
                <div
                  key={version.id}
                  className={cn(
                    'p-3 border rounded-lg cursor-pointer hover:bg-muted/50',
                    version.isCurrent && 'border-primary',
                    isSelected && 'bg-muted border-primary'
                  )}
                  onClick={() => handleSelect(version)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {compareMode && (
                        <div
                          className={cn(
                            'w-4 h-4 rounded border-2',
                            isSelected
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground'
                          )}
                        />
                      )}
                      <span className="font-medium">{version.name}</span>
                      {version.isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {version.changes} changes
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback
                        style={{ backgroundColor: version.author.color }}
                      >
                        {version.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>{version.author.name}</span>
                    <span>·</span>
                    <span>{version.createdAt.toLocaleDateString()}</span>
                  </div>
                  {version.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {version.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Share Dialog Content
interface ShareDialogProps {
  title?: string
  url?: string
  collaborators: Collaborator[]
  onInvite?: (email: string, role: string) => void
  onCopyLink?: () => void
  className?: string
}

export function ShareDialog({
  title = 'Share',
  url = typeof window !== 'undefined' ? window.location.href : '',
  collaborators,
  onInvite,
  onCopyLink,
  className,
}: ShareDialogProps) {
  const [email, setEmail] = React.useState('')
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopyLink?.()
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="Add people by email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md bg-background"
          />
        </div>
        <Button onClick={() => onInvite?.(email, 'editor')} disabled={!email}>
          Invite
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">People with access</p>
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.id}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={collaborator.avatar || '/placeholder.svg'} />
                <AvatarFallback style={{ backgroundColor: collaborator.color }}>
                  {collaborator.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{collaborator.name}</p>
                <p className="text-xs text-muted-foreground">
                  {collaborator.email}
                </p>
              </div>
            </div>
            <Badge variant="secondary">Editor</Badge>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="flex-1 p-2 bg-muted rounded-md text-sm truncate">
            {url}
          </div>
          <Button variant="outline" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Typing Indicator
interface TypingIndicatorProps {
  collaborators: Collaborator[]
  className?: string
}

export function TypingIndicator({
  collaborators,
  className,
}: TypingIndicatorProps) {
  if (collaborators.length === 0) return null

  const names =
    collaborators.length === 1
      ? collaborators[0].name
      : collaborators.length === 2
        ? `${collaborators[0].name} and ${collaborators[1].name}`
        : `${collaborators[0].name} and ${collaborators.length - 1} others`

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        className
      )}
    >
      <div className="flex -space-x-1">
        {collaborators.slice(0, 3).map((c) => (
          <Avatar key={c.id} className="h-5 w-5 border-2 border-background">
            <AvatarFallback style={{ backgroundColor: c.color }}>
              {c.name[0]}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span>
        {names} {collaborators.length === 1 ? 'is' : 'are'} typing
      </span>
      <span className="flex gap-0.5">
        <span
          className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </span>
    </div>
  )
}
