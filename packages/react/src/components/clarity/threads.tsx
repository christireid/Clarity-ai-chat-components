'use client'

// @ts-nocheck
// TODO: Fix type errors from peer dependencies (framer-motion, vaul, class-variance-authority)

import * as React from 'react'
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  Pin,
  PinOff,
  Archive,
  MoreHorizontal,
  Search,
  FolderOpen,
  Clock,
  Star,
  Check,
  X,
  ChevronRight,
  Hash,
  Bot,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Types
export interface Thread {
  id: string
  title: string
  preview?: string
  createdAt: Date
  updatedAt: Date
  messageCount?: number
  model?: string
  pinned?: boolean
  archived?: boolean
  starred?: boolean
  projectId?: string
  tags?: string[]
}

export interface ThreadGroup {
  id: string
  label: string
  threads: Thread[]
}

// Thread Item Component
export interface ThreadItemProps {
  thread: Thread
  isActive?: boolean
  onClick?: () => void
  onRename?: (id: string, newTitle: string) => void
  onDelete?: (id: string) => void
  onPin?: (id: string) => void
  onStar?: (id: string) => void
  onArchive?: (id: string) => void
  compact?: boolean
  className?: string
}

export function ThreadItem({
  thread,
  isActive,
  onClick,
  onRename,
  onDelete,
  onPin,
  onStar,
  onArchive,
  compact = false,
  className,
}: ThreadItemProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editTitle, setEditTitle] = React.useState(thread.title)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== thread.title) {
      onRename?.(thread.id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setEditTitle(thread.title)
      setIsEditing(false)
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
            isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
            thread.archived && 'opacity-60',
            className
          )}
          onClick={onClick}
        >
          <MessageSquare className="h-4 w-4 flex-shrink-0" />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                ref={inputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                className="h-6 px-1 text-sm"
              />
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium truncate">
                    {thread.title}
                  </span>
                  {thread.pinned && <Pin className="h-3 w-3 flex-shrink-0" />}
                  {thread.starred && (
                    <Star className="h-3 w-3 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                {!compact && thread.preview && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {thread.preview}
                  </p>
                )}
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-muted-foreground">
                {formatDate(thread.updatedAt)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onRename && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                  )}
                  {onPin && (
                    <DropdownMenuItem onClick={() => onPin(thread.id)}>
                      {thread.pinned ? (
                        <>
                          <PinOff className="h-4 w-4 mr-2" />
                          Unpin
                        </>
                      ) : (
                        <>
                          <Pin className="h-4 w-4 mr-2" />
                          Pin
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                  {onStar && (
                    <DropdownMenuItem onClick={() => onStar(thread.id)}>
                      <Star
                        className={cn(
                          'h-4 w-4 mr-2',
                          thread.starred && 'fill-current'
                        )}
                      />
                      {thread.starred ? 'Unstar' : 'Star'}
                    </DropdownMenuItem>
                  )}
                  {onArchive && (
                    <DropdownMenuItem onClick={() => onArchive(thread.id)}>
                      <Archive className="h-4 w-4 mr-2" />
                      {thread.archived ? 'Unarchive' : 'Archive'}
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(thread.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {onRename && (
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>
        )}
        {onPin && (
          <ContextMenuItem onClick={() => onPin(thread.id)}>
            {thread.pinned ? (
              <PinOff className="h-4 w-4 mr-2" />
            ) : (
              <Pin className="h-4 w-4 mr-2" />
            )}
            {thread.pinned ? 'Unpin' : 'Pin'}
          </ContextMenuItem>
        )}
        {onStar && (
          <ContextMenuItem onClick={() => onStar(thread.id)}>
            <Star className="h-4 w-4 mr-2" />
            {thread.starred ? 'Unstar' : 'Star'}
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        {onDelete && (
          <ContextMenuItem
            className="text-destructive"
            onClick={() => onDelete(thread.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

// Thread List Component
export interface ThreadListProps {
  threads: Thread[]
  activeThreadId?: string
  onThreadSelect?: (id: string) => void
  onNewThread?: () => void
  onRename?: (id: string, newTitle: string) => void
  onDelete?: (id: string) => void
  onPin?: (id: string) => void
  onStar?: (id: string) => void
  onArchive?: (id: string) => void
  showSearch?: boolean
  showFilters?: boolean
  groupByDate?: boolean
  className?: string
}

export function ThreadList({
  threads,
  activeThreadId,
  onThreadSelect,
  onNewThread,
  onRename,
  onDelete,
  onPin,
  onStar,
  onArchive,
  showSearch = true,
  showFilters = false,
  groupByDate = true,
  className,
}: ThreadListProps) {
  const [search, setSearch] = React.useState('')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  const [filterPinned, setFilterPinned] = React.useState(false)
  const [filterStarred, setFilterStarred] = React.useState(false)

  const filteredThreads = React.useMemo(() => {
    let result = threads.filter((t) => !t.archived)

    if (search) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.preview?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filterPinned) {
      result = result.filter((t) => t.pinned)
    }

    if (filterStarred) {
      result = result.filter((t) => t.starred)
    }

    result.sort((a, b) => {
      const aTime = a.updatedAt.getTime()
      const bTime = b.updatedAt.getTime()
      return sortOrder === 'desc' ? bTime - aTime : aTime - bTime
    })

    return result
  }, [threads, search, sortOrder, filterPinned, filterStarred])

  const groupedThreads = React.useMemo(() => {
    if (!groupByDate) return { all: filteredThreads }

    const pinned = filteredThreads.filter((t) => t.pinned)
    const unpinned = filteredThreads.filter((t) => !t.pinned)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const groups: Record<string, Thread[]> = {}

    if (pinned.length > 0) {
      groups.pinned = pinned
    }

    unpinned.forEach((thread) => {
      const date = new Date(thread.updatedAt)
      date.setHours(0, 0, 0, 0)

      let key: string
      if (date.getTime() >= today.getTime()) {
        key = 'today'
      } else if (date.getTime() >= yesterday.getTime()) {
        key = 'yesterday'
      } else if (date.getTime() >= weekAgo.getTime()) {
        key = 'thisWeek'
      } else {
        key = 'older'
      }

      if (!groups[key]) groups[key] = []
      groups[key].push(thread)
    })

    return groups
  }, [filteredThreads, groupByDate])

  const groupLabels: Record<string, string> = {
    pinned: 'Pinned',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    older: 'Older',
    all: 'All Threads',
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-3 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Threads</h2>
          {onNewThread && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onNewThread}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New thread</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {showSearch && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search threads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        )}

        {showFilters && (
          <div className="flex items-center gap-2">
            <Button
              variant={filterPinned ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setFilterPinned(!filterPinned)}
            >
              <Pin className="h-3 w-3 mr-1" />
              Pinned
            </Button>
            <Button
              variant={filterStarred ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setFilterStarred(!filterStarred)}
            >
              <Star className="h-3 w-3 mr-1" />
              Starred
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 ml-auto"
              onClick={() =>
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
              }
            >
              {sortOrder === 'desc' ? (
                <SortDesc className="h-3.5 w-3.5" />
              ) : (
                <SortAsc className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Thread List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {Object.entries(groupedThreads).map(([group, groupThreads]) => (
            <div key={group}>
              {groupByDate && groupThreads.length > 0 && (
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  {groupLabels[group] || group}
                </div>
              )}
              <div className="space-y-1">
                {groupThreads.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === activeThreadId}
                    onClick={() => onThreadSelect?.(thread.id)}
                    onRename={onRename}
                    onDelete={onDelete}
                    onPin={onPin}
                    onStar={onStar}
                    onArchive={onArchive}
                    compact
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredThreads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {search ? 'No threads found' : 'No threads yet'}
              </p>
              {onNewThread && !search && (
                <Button variant="link" size="sm" onClick={onNewThread}>
                  Start a new thread
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// Delete Confirmation Dialog
export interface DeleteThreadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  threadTitle?: string
  onConfirm: () => void
}

export function DeleteThreadDialog({
  open,
  onOpenChange,
  threadTitle,
  onConfirm,
}: DeleteThreadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Thread</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            {threadTitle ? `"${threadTitle}"` : 'this thread'}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Thread Header (for active thread display)
export interface ThreadHeaderProps {
  thread: Thread
  onRename?: (newTitle: string) => void
  onSettings?: () => void
  className?: string
}

export function ThreadHeader({
  thread,
  onRename,
  onSettings,
  className,
}: ThreadHeaderProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editTitle, setEditTitle] = React.useState(thread.title)

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== thread.title) {
      onRename?.(editTitle.trim())
    }
    setIsEditing(false)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 border-b border-border',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename()
                if (e.key === 'Escape') {
                  setEditTitle(thread.title)
                  setIsEditing(false)
                }
              }}
              className="h-8"
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleRename}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => {
                setEditTitle(thread.title)
                setIsEditing(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="font-semibold truncate">{thread.title}</h1>
            {thread.pinned && <Pin className="h-4 w-4 text-muted-foreground" />}
            {onRename && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 hover:opacity-100"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {thread.model && (
            <Badge variant="outline" className="text-xs h-5">
              <Bot className="h-3 w-3 mr-1" />
              {thread.model}
            </Badge>
          )}
          {thread.messageCount !== undefined && (
            <span>{thread.messageCount} messages</span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {thread.updatedAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}
