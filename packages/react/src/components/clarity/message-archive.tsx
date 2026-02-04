'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { Checkbox } from '@clarity-chat/primitives'
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
  Archive,
  Search,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  RotateCcw,
  Download,
  Filter,
  ChevronDown,
  User,
  Bot,
  Clock,
  Tag,
  FolderOpen,
  CheckSquare,
  Square,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

// Types
export interface ArchivedMessage {
  id: string
  conversationId: string
  conversationTitle: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  tags?: string[]
  metadata?: Record<string, unknown>
}

export interface ArchivedConversation {
  id: string
  title: string
  messageCount: number
  archivedAt: Date
  lastMessageAt: Date
  tags?: string[]
  preview?: string
}

// Message Archive Manager
export interface MessageArchiveProps {
  conversations: ArchivedConversation[]
  onRestore: (ids: string[]) => void
  onDelete: (ids: string[]) => void
  onExport: (ids: string[]) => void
  onView: (id: string) => void
  className?: string
}

export function MessageArchive({
  conversations,
  onRestore,
  onDelete,
  onExport,
  onView,
  className,
}: MessageArchiveProps) {
  const [search, setSearch] = React.useState('')
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = React.useState<'date' | 'name' | 'messages'>(
    'date'
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const filteredConversations = React.useMemo(() => {
    let filtered = [...conversations]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.preview?.toLowerCase().includes(searchLower) ||
          c.tags?.some((t) => t.toLowerCase().includes(searchLower))
      )
    }

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'messages':
        filtered.sort((a, b) => b.messageCount - a.messageCount)
        break
      case 'date':
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()
        )
    }

    return filtered
  }, [conversations, search, sortBy])

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const selectAll = () => {
    if (selectedIds.size === filteredConversations.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredConversations.map((c) => c.id)))
    }
  }

  const handleBulkAction = (action: 'restore' | 'delete' | 'export') => {
    const ids = Array.from(selectedIds)
    switch (action) {
      case 'restore':
        onRestore(ids)
        break
      case 'delete':
        setDeleteDialogOpen(true)
        return
      case 'export':
        onExport(ids)
        break
    }
    setSelectedIds(new Set())
  }

  const confirmDelete = () => {
    onDelete(Array.from(selectedIds))
    setSelectedIds(new Set())
    setDeleteDialogOpen(false)
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-accent" />
            <h2 className="font-semibold">Message Archive</h2>
            <Badge variant="secondary">{conversations.length}</Badge>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search archived conversations..."
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Sort
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                <Calendar className="h-4 w-4 mr-2" />
                Date Archived
                {sortBy === 'date' && <Badge className="ml-auto">Active</Badge>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Name
                {sortBy === 'name' && <Badge className="ml-auto">Active</Badge>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('messages')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Count
                {sortBy === 'messages' && (
                  <Badge className="ml-auto">Active</Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} selected
            </span>
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkAction('restore')}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Restore
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkAction('export')}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => handleBulkAction('delete')}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* Select All */}
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
            <Checkbox
              checked={
                selectedIds.size === filteredConversations.length &&
                filteredConversations.length > 0
              }
              onCheckedChange={selectAll}
            />
            <span>Select All</span>
          </div>

          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No archived conversations</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <ArchivedConversationCard
                key={conversation.id}
                conversation={conversation}
                selected={selectedIds.has(conversation.id)}
                onSelect={() => toggleSelect(conversation.id)}
                onView={() => onView(conversation.id)}
                onRestore={() => onRestore([conversation.id])}
                onDelete={() => {
                  setSelectedIds(new Set([conversation.id]))
                  setDeleteDialogOpen(true)
                }}
                onExport={() => onExport([conversation.id])}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Archived Conversations</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {selectedIds.size}{' '}
              archived conversation(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Archived Conversation Card
interface ArchivedConversationCardProps {
  conversation: ArchivedConversation
  selected: boolean
  onSelect: () => void
  onView: () => void
  onRestore: () => void
  onDelete: () => void
  onExport: () => void
}

function ArchivedConversationCard({
  conversation,
  selected,
  onSelect,
  onView,
  onRestore,
  onDelete,
  onExport,
}: ArchivedConversationCardProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer',
        selected
          ? 'border-accent bg-accent/5'
          : 'border-border hover:border-accent/50'
      )}
      onClick={onView}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={onSelect}
        onClick={(e) => e.stopPropagation()}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
          <Badge variant="secondary" className="text-xs">
            {conversation.messageCount} messages
          </Badge>
        </div>

        {conversation.preview && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {conversation.preview}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Archive className="h-3 w-3" />
            {format(new Date(conversation.archivedAt), 'MMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(conversation.lastMessageAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {conversation.tags && conversation.tags.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {conversation.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            View Messages
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onRestore()
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restore
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onExport()
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Archived Message Viewer
export interface ArchivedMessageViewerProps {
  messages: ArchivedMessage[]
  title?: string
  onClose?: () => void
  className?: string
}

export function ArchivedMessageViewer({
  messages,
  title,
  onClose,
  className,
}: ArchivedMessageViewerProps) {
  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold">{title || 'Archived Messages'}</h3>
          <p className="text-sm text-muted-foreground">
            {messages.length} messages
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  message.role === 'user' ? 'bg-accent' : 'bg-muted'
                )}
              >
                {message.role === 'user' ? (
                  <User className="h-4 w-4 text-accent-foreground" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium capitalize">
                    {message.role}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// Timestamp Component
export interface TimestampProps {
  date: Date | string
  format?: 'relative' | 'absolute' | 'datetime' | 'time'
  className?: string
}

export function Timestamp({
  date,
  format: formatType = 'relative',
  className,
}: TimestampProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  let formatted: string
  switch (formatType) {
    case 'relative':
      formatted = formatDistanceToNow(dateObj, { addSuffix: true })
      break
    case 'absolute':
      formatted = format(dateObj, 'MMM d, yyyy')
      break
    case 'datetime':
      formatted = format(dateObj, 'MMM d, yyyy h:mm a')
      break
    case 'time':
      formatted = format(dateObj, 'h:mm a')
      break
    default:
      formatted = formatDistanceToNow(dateObj, { addSuffix: true })
  }

  return (
    <time
      dateTime={dateObj.toISOString()}
      className={cn('text-xs text-muted-foreground', className)}
      title={format(dateObj, 'PPPP p')}
    >
      {formatted}
    </time>
  )
}
