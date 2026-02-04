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
  Code,
  Copy,
  Check,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Star,
  StarOff,
  Tag,
  Clock,
  FileCode,
  FolderOpen,
  Download,
  Upload,
} from 'lucide-react'

// Types
export interface Snippet {
  id: string
  title: string
  description?: string
  code: string
  language: string
  tags: string[]
  favorite?: boolean
  createdAt: Date
  updatedAt: Date
  usageCount?: number
}

export interface SnippetManagerProps {
  snippets: Snippet[]
  onAdd?: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => void
  onEdit?: (id: string, snippet: Partial<Snippet>) => void
  onDelete?: (id: string) => void
  onUse?: (snippet: Snippet) => void
  onToggleFavorite?: (id: string) => void
  onExport?: () => void
  onImport?: (snippets: Snippet[]) => void
  className?: string
}

// Snippet Card
function SnippetCard({
  snippet,
  onCopy,
  onEdit,
  onDelete,
  onUse,
  onToggleFavorite,
}: {
  snippet: Snippet
  onCopy: () => void
  onEdit?: () => void
  onDelete?: () => void
  onUse?: () => void
  onToggleFavorite?: () => void
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-border bg-card hover:border-accent/50 transition-colors">
      <div className="p-3 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm truncate">{snippet.title}</h4>
              {snippet.favorite && (
                <Star className="h-3 w-3 text-amber-500 fill-amber-500 flex-shrink-0" />
              )}
            </div>
            {snippet.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {snippet.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 flex-shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onUse}>
                <FileCode className="h-4 w-4 mr-2" />
                Insert
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleFavorite}>
                {snippet.favorite ? (
                  <>
                    <StarOff className="h-4 w-4 mr-2" />
                    Unfavorite
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Favorite
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {snippet.language}
          </Badge>
          {snippet.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {snippet.tags.length > 2 && (
            <span className="text-xs text-muted-foreground">
              +{snippet.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      <div className="p-2 bg-code-bg rounded-b-lg">
        <pre className="text-xs font-mono text-muted-foreground overflow-hidden max-h-20">
          <code>
            {snippet.code.slice(0, 200)}
            {snippet.code.length > 200 && '...'}
          </code>
        </pre>
      </div>
    </div>
  )
}

// Add/Edit Snippet Dialog
function SnippetDialog({
  snippet,
  open,
  onOpenChange,
  onSave,
}: {
  snippet?: Snippet
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => void
}) {
  const [title, setTitle] = React.useState(snippet?.title || '')
  const [description, setDescription] = React.useState(
    snippet?.description || ''
  )
  const [code, setCode] = React.useState(snippet?.code || '')
  const [language, setLanguage] = React.useState(
    snippet?.language || 'javascript'
  )
  const [tags, setTags] = React.useState(snippet?.tags.join(', ') || '')

  const handleSave = () => {
    onSave({
      title,
      description,
      code,
      language,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{snippet ? 'Edit Snippet' : 'Add Snippet'}</DialogTitle>
          <DialogDescription>
            {snippet
              ? 'Update your code snippet'
              : 'Create a new reusable code snippet'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Snippet title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="javascript"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, hooks, utility"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-40 p-3 rounded-md border border-input bg-code-bg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="// Your code here..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title || !code}>
            {snippet ? 'Save Changes' : 'Add Snippet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main Snippet Manager
export function SnippetManager({
  snippets,
  onAdd,
  onEdit,
  onDelete,
  onUse,
  onToggleFavorite,
  onExport,
  onImport,
  className,
}: SnippetManagerProps) {
  const [search, setSearch] = React.useState('')
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null)
  const [showFavorites, setShowFavorites] = React.useState(false)
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [editingSnippet, setEditingSnippet] = React.useState<Snippet | null>(
    null
  )

  // Get all unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>()
    snippets.forEach((s) => s.tags.forEach((t) => tags.add(t)))
    return Array.from(tags).sort()
  }, [snippets])

  // Filter snippets
  const filteredSnippets = React.useMemo(() => {
    return snippets.filter((snippet) => {
      const matchesSearch =
        !search ||
        snippet.title.toLowerCase().includes(search.toLowerCase()) ||
        snippet.description?.toLowerCase().includes(search.toLowerCase()) ||
        snippet.code.toLowerCase().includes(search.toLowerCase())

      const matchesTag = !selectedTag || snippet.tags.includes(selectedTag)
      const matchesFavorites = !showFavorites || snippet.favorite

      return matchesSearch && matchesTag && matchesFavorites
    })
  }, [snippets, search, selectedTag, showFavorites])

  const handleCopy = async (snippet: Snippet) => {
    await navigator.clipboard.writeText(snippet.code)
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Snippets</h3>
            <Badge variant="secondary">{snippets.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {onExport && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onExport}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {onImport && (
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Upload className="h-4 w-4" />
              </Button>
            )}
            {onAdd && (
              <Button size="sm" onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search snippets..."
              className="pl-9"
            />
          </div>
          <Button
            variant={showFavorites ? 'default' : 'outline'}
            size="icon"
            className="h-9 w-9"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Star className={cn('h-4 w-4', showFavorites && 'fill-current')} />
          </Button>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Snippets list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No snippets found</p>
            </div>
          ) : (
            filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onCopy={() => handleCopy(snippet)}
                onEdit={onEdit ? () => setEditingSnippet(snippet) : undefined}
                onDelete={onDelete ? () => onDelete(snippet.id) : undefined}
                onUse={onUse ? () => onUse(snippet) : undefined}
                onToggleFavorite={
                  onToggleFavorite
                    ? () => onToggleFavorite(snippet.id)
                    : undefined
                }
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Add Dialog */}
      {onAdd && (
        <SnippetDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSave={onAdd}
        />
      )}

      {/* Edit Dialog */}
      {onEdit && editingSnippet && (
        <SnippetDialog
          snippet={editingSnippet}
          open={!!editingSnippet}
          onOpenChange={(open) => !open && setEditingSnippet(null)}
          onSave={(data) => onEdit(editingSnippet.id, data)}
        />
      )}
    </div>
  )
}

// Quick Snippet (inline snippet display)
export interface QuickSnippetProps {
  code: string
  language?: string
  label?: string
  className?: string
}

export function QuickSnippet({
  code,
  language,
  label,
  className,
}: QuickSnippetProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-md border border-border bg-code-bg px-2 py-1',
        className
      )}
    >
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <code className="font-mono text-sm">{code}</code>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}
