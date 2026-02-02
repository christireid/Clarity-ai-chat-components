'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Bookmark,
  BookmarkPlus,
  Folder,
  FolderPlus,
  Search,
  MoreVertical,
  Trash2,
  Pencil,
  ExternalLink,
  Star,
  Clock,
  Tag,
  Filter,
  Check,
  Copy,
  MessageSquare,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface BookmarkItem {
  id: string
  title: string
  content: string
  messageId?: string
  conversationId?: string
  folderId?: string
  tags?: string[]
  note?: string
  isStarred?: boolean
  createdAt: Date
}

export interface BookmarkFolder {
  id: string
  name: string
  color?: string
  icon?: React.ReactNode
  count?: number
}

export interface BookmarkButtonProps {
  isBookmarked?: boolean
  onClick: () => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export interface BookmarksListProps {
  bookmarks: BookmarkItem[]
  folders?: BookmarkFolder[]
  selectedFolderId?: string
  onSelect?: (bookmark: BookmarkItem) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string, data: Partial<BookmarkItem>) => void
  onStar?: (id: string) => void
  onCopy?: (content: string) => void
  onFolderChange?: (folderId: string) => void
  searchable?: boolean
  className?: string
}

export interface BookmarkDialogProps {
  bookmark?: Partial<BookmarkItem>
  folders?: BookmarkFolder[]
  onSave: (bookmark: Omit<BookmarkItem, 'id' | 'createdAt'>) => void
  onCancel?: () => void
  trigger?: React.ReactNode
}

export interface BookmarkManagerProps {
  bookmarks: BookmarkItem[]
  folders: BookmarkFolder[]
  onAddBookmark: (bookmark: Omit<BookmarkItem, 'id' | 'createdAt'>) => void
  onDeleteBookmark: (id: string) => void
  onEditBookmark: (id: string, data: Partial<BookmarkItem>) => void
  onAddFolder: (folder: Omit<BookmarkFolder, 'id'>) => void
  onDeleteFolder: (id: string) => void
  onSelectBookmark?: (bookmark: BookmarkItem) => void
  className?: string
}

// ============================================================================
// BOOKMARK BUTTON
// ============================================================================

export function BookmarkButton({
  isBookmarked = false,
  onClick,
  variant = 'ghost',
  size = 'md',
  showLabel = false,
  className,
}: BookmarkButtonProps) {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-9 w-9',
  }

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  if (showLabel) {
    return (
      <Button
        variant={variant}
        size={size === 'lg' ? 'default' : 'sm'}
        onClick={onClick}
        className={className}
      >
        <Bookmark
          className={cn(
            iconSizes[size],
            'mr-2',
            isBookmarked && 'fill-current text-yellow-500'
          )}
        />
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={onClick}
      className={cn(sizeClasses[size], className)}
    >
      <Bookmark
        className={cn(
          iconSizes[size],
          isBookmarked && 'fill-current text-yellow-500'
        )}
      />
    </Button>
  )
}

// ============================================================================
// BOOKMARK CARD
// ============================================================================

interface BookmarkCardProps {
  bookmark: BookmarkItem
  onSelect?: () => void
  onDelete?: () => void
  onEdit?: () => void
  onStar?: () => void
  onCopy?: () => void
}

function BookmarkCard({
  bookmark,
  onSelect,
  onDelete,
  onEdit,
  onStar,
  onCopy,
}: BookmarkCardProps) {
  return (
    <div
      className={cn(
        'group relative p-3 rounded-lg border border-border bg-background',
        'hover:bg-accent/50 hover:border-primary/30 transition-colors',
        onSelect && 'cursor-pointer'
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Bookmark
            className={cn(
              'h-4 w-4',
              bookmark.isStarred
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{bookmark.title}</h4>
            {bookmark.isStarred && (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {bookmark.content}
          </p>
          {bookmark.note && (
            <p className="text-xs text-muted-foreground/70 italic mt-1 line-clamp-1">
              Note: {bookmark.note}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {bookmark.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
              >
                {tag}
              </Badge>
            ))}
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {new Date(bookmark.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onStar && (
              <DropdownMenuItem onClick={onStar}>
                <Star
                  className={cn(
                    'h-4 w-4 mr-2',
                    bookmark.isStarred && 'fill-yellow-400 text-yellow-400'
                  )}
                />
                {bookmark.isStarred ? 'Unstar' : 'Star'}
              </DropdownMenuItem>
            )}
            {onCopy && (
              <DropdownMenuItem onClick={onCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy content
              </DropdownMenuItem>
            )}
            {bookmark.conversationId && (
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to conversation
              </DropdownMenuItem>
            )}
            {onEdit && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              </>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// ============================================================================
// BOOKMARKS LIST
// ============================================================================

export function BookmarksList({
  bookmarks,
  folders,
  selectedFolderId,
  onSelect,
  onDelete,
  onEdit,
  onStar,
  onCopy,
  onFolderChange,
  searchable = true,
  className,
}: BookmarksListProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterTag, setFilterTag] = React.useState<string | null>(null)

  // Get all unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>()
    bookmarks.forEach((b) => b.tags?.forEach((t) => tags.add(t)))
    return Array.from(tags)
  }, [bookmarks])

  // Filter bookmarks
  const filteredBookmarks = React.useMemo(() => {
    let filtered = bookmarks

    if (selectedFolderId) {
      filtered = filtered.filter((b) => b.folderId === selectedFolderId)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.content.toLowerCase().includes(query) ||
          b.note?.toLowerCase().includes(query) ||
          b.tags?.some((t) => t.toLowerCase().includes(query))
      )
    }

    if (filterTag) {
      filtered = filtered.filter((b) => b.tags?.includes(filterTag))
    }

    return filtered
  }, [bookmarks, selectedFolderId, searchQuery, filterTag])

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search and Filters */}
      {searchable && (
        <div className="p-3 border-b border-border space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookmarks..."
              className="pl-9 h-9"
            />
          </div>
          {allTags.length > 0 && (
            <ScrollArea className="w-full">
              <div className="flex gap-1.5 pb-1">
                <Button
                  variant={filterTag === null ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setFilterTag(null)}
                >
                  All
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={filterTag === tag ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setFilterTag(tag)}
                  >
                    <Tag className="h-2.5 w-2.5 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}

      {/* Folders */}
      {folders && folders.length > 0 && (
        <div className="p-2 border-b border-border">
          <ScrollArea className="w-full">
            <div className="flex gap-1">
              <Button
                variant={!selectedFolderId ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => onFolderChange?.('')}
              >
                <Bookmark className="h-3 w-3 mr-1.5" />
                All ({bookmarks.length})
              </Button>
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={
                    selectedFolderId === folder.id ? 'secondary' : 'ghost'
                  }
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => onFolderChange?.(folder.id)}
                >
                  <Folder
                    className="h-3 w-3 mr-1.5"
                    style={{ color: folder.color }}
                  />
                  {folder.name}
                  {folder.count !== undefined && (
                    <span className="ml-1 text-muted-foreground">
                      ({folder.count})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Bookmarks */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bookmark className="h-12 w-12 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">
                No bookmarks found
              </p>
              {searchQuery && (
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Try a different search term
                </p>
              )}
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onSelect={onSelect ? () => onSelect(bookmark) : undefined}
                onDelete={onDelete ? () => onDelete(bookmark.id) : undefined}
                onEdit={onEdit ? () => onEdit(bookmark.id, {}) : undefined}
                onStar={onStar ? () => onStar(bookmark.id) : undefined}
                onCopy={onCopy ? () => onCopy(bookmark.content) : undefined}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// ============================================================================
// BOOKMARK DIALOG
// ============================================================================

export function BookmarkDialog({
  bookmark,
  folders,
  onSave,
  onCancel,
  trigger,
}: BookmarkDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [title, setTitle] = React.useState(bookmark?.title || '')
  const [content, setContent] = React.useState(bookmark?.content || '')
  const [note, setNote] = React.useState(bookmark?.note || '')
  const [folderId, setFolderId] = React.useState(bookmark?.folderId || '')
  const [tagInput, setTagInput] = React.useState('')
  const [tags, setTags] = React.useState<string[]>(bookmark?.tags || [])

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = () => {
    onSave({
      title,
      content,
      note,
      folderId: folderId || undefined,
      tags: tags.length > 0 ? tags : undefined,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Add Bookmark
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {bookmark?.id ? 'Edit Bookmark' : 'Add Bookmark'}
          </DialogTitle>
          <DialogDescription>
            Save this content for quick access later
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bookmark title"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content to bookmark"
              className="mt-1 w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Note (optional)</label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="mt-1"
            />
          </div>

          {folders && folders.length > 0 && (
            <div>
              <label className="text-sm font-medium">Folder</label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">No folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2 mt-1">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                }
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {onCancel && (
            <Button
              variant="outline"
              onClick={() => {
                onCancel()
                setIsOpen(false)
              }}
            >
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={!title || !content}>
            <Bookmark className="h-4 w-4 mr-2" />
            Save Bookmark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// SHAREABLE LINK
// ============================================================================

export interface ShareableLinkProps {
  conversationId: string
  onGenerateLink: (id: string) => Promise<string>
  onCopyLink?: (link: string) => void
  className?: string
}

export function ShareableLink({
  conversationId,
  onGenerateLink,
  onCopyLink,
  className,
}: ShareableLinkProps) {
  const [link, setLink] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const generatedLink = await onGenerateLink(conversationId)
      setLink(generatedLink)
    } catch (error) {
      console.error('Failed to generate link:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (link) {
      navigator.clipboard.writeText(link)
      onCopyLink?.(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {!link ? (
        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-transparent"
        >
          {isLoading ? (
            <>Generating...</>
          ) : (
            <>
              <ExternalLink className="h-4 w-4 mr-2" />
              Generate Shareable Link
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input value={link} readOnly className="flex-1 font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Anyone with this link can view this conversation
          </p>
        </div>
      )}
    </div>
  )
}
