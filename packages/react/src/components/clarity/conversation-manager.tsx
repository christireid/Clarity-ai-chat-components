'use client'

import * as React from 'react'
import {
  Plus,
  Search,
  Trash2,
  Archive,
  Star,
  StarOff,
  Download,
  Upload,
  MoreHorizontal,
  MessageSquare,
  FolderOpen,
  Clock,
  GitBranch,
  Tag,
  Filter,
  ChevronRight,
  Edit3,
  Copy,
  Share2,
  Bookmark,
  Pin,
  PinOff,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
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
import { Label } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

export interface Conversation {
  id: string
  title: string
  preview?: string
  model?: string
  messageCount?: number
  tokenCount?: number
  createdAt: Date
  updatedAt: Date
  isPinned?: boolean
  isFavorite?: boolean
  isArchived?: boolean
  tags?: string[]
  projectId?: string
  branchCount?: number
  checkpoints?: number
}

export interface Project {
  id: string
  name: string
  description?: string
  conversationIds: string[]
  sharedContext?: string
  createdAt: Date
  updatedAt: Date
}

interface ConversationManagerProps {
  conversations: Conversation[]
  projects?: Project[]
  activeConversationId?: string
  onSelect?: (id: string) => void
  onCreate?: () => void
  onDelete?: (id: string) => void
  onArchive?: (id: string) => void
  onRename?: (id: string, name: string) => void
  onToggleFavorite?: (id: string) => void
  onTogglePin?: (id: string) => void
  onDuplicate?: (id: string) => void
  onExport?: (id: string) => void
  onImport?: () => void
  onProjectCreate?: (name: string) => void
  onAddToProject?: (conversationId: string, projectId: string) => void
  className?: string
}

export function ConversationManager({
  conversations,
  projects = [],
  activeConversationId,
  onSelect,
  onCreate,
  onDelete,
  onArchive,
  onRename,
  onToggleFavorite,
  onTogglePin,
  onDuplicate,
  onExport,
  onImport,
  onProjectCreate,
  onAddToProject,
  className,
}: ConversationManagerProps) {
  const [search, setSearch] = React.useState('')
  const [selectedProject, setSelectedProject] = React.useState<string | null>(
    null
  )
  const [showArchived, setShowArchived] = React.useState(false)
  const [renameDialog, setRenameDialog] = React.useState<{
    id: string
    name: string
  } | null>(null)
  const [newProjectDialog, setNewProjectDialog] = React.useState(false)
  const [newProjectName, setNewProjectName] = React.useState('')

  const filteredConversations = React.useMemo(() => {
    let result = [...conversations]

    // Filter by search
    if (search) {
      const lowerSearch = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(lowerSearch) ||
          c.preview?.toLowerCase().includes(lowerSearch) ||
          c.tags?.some((t) => t.toLowerCase().includes(lowerSearch))
      )
    }

    // Filter by project
    if (selectedProject) {
      const project = projects.find((p) => p.id === selectedProject)
      if (project) {
        result = result.filter((c) => project.conversationIds.includes(c.id))
      }
    }

    // Filter archived
    if (!showArchived) {
      result = result.filter((c) => !c.isArchived)
    }

    // Sort: pinned first, then by date
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })

    return result
  }, [conversations, search, selectedProject, showArchived, projects])

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned)
  const regularConversations = filteredConversations.filter((c) => !c.isPinned)

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onProjectCreate?.(newProjectName.trim())
      setNewProjectName('')
      setNewProjectDialog(false)
    }
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onImport}>
            <Upload className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderOpen className="mr-2 h-4 w-4" />
                {selectedProject
                  ? projects.find((p) => p.id === selectedProject)?.name
                  : 'All Projects'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedProject(null)}>
                All Conversations
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {project.name}
                  <Badge variant="secondary" className="ml-auto">
                    {project.conversationIds.length}
                  </Badge>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setNewProjectDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={showArchived ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archived
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        {pinnedConversations.length > 0 && (
          <div className="border-b border-border">
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase">
              Pinned
            </div>
            {pinnedConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                projects={projects}
                onSelect={() => onSelect?.(conversation.id)}
                onRename={() =>
                  setRenameDialog({
                    id: conversation.id,
                    name: conversation.title,
                  })
                }
                onDelete={() => onDelete?.(conversation.id)}
                onArchive={() => onArchive?.(conversation.id)}
                onToggleFavorite={() => onToggleFavorite?.(conversation.id)}
                onTogglePin={() => onTogglePin?.(conversation.id)}
                onDuplicate={() => onDuplicate?.(conversation.id)}
                onExport={() => onExport?.(conversation.id)}
                onAddToProject={(projectId) =>
                  onAddToProject?.(conversation.id, projectId)
                }
              />
            ))}
          </div>
        )}

        <div className="divide-y divide-border">
          {regularConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              projects={projects}
              onSelect={() => onSelect?.(conversation.id)}
              onRename={() =>
                setRenameDialog({
                  id: conversation.id,
                  name: conversation.title,
                })
              }
              onDelete={() => onDelete?.(conversation.id)}
              onArchive={() => onArchive?.(conversation.id)}
              onToggleFavorite={() => onToggleFavorite?.(conversation.id)}
              onTogglePin={() => onTogglePin?.(conversation.id)}
              onDuplicate={() => onDuplicate?.(conversation.id)}
              onExport={() => onExport?.(conversation.id)}
              onAddToProject={(projectId) =>
                onAddToProject?.(conversation.id, projectId)
              }
            />
          ))}
          {filteredConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MessageSquare className="mb-4 h-12 w-12" />
              <p>No conversations found</p>
              <Button variant="link" onClick={onCreate}>
                Start a new conversation
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Rename Dialog */}
      <Dialog open={!!renameDialog} onOpenChange={() => setRenameDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
            <DialogDescription>
              Enter a new name for this conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Name</Label>
            <Input
              value={renameDialog?.name || ''}
              onChange={(e) =>
                setRenameDialog((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              placeholder="Conversation name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (renameDialog) {
                  onRename?.(renameDialog.id, renameDialog.name)
                  setRenameDialog(null)
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={newProjectDialog} onOpenChange={setNewProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>
              Create a new project to organize related conversations.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Project Name</Label>
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="My Project"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewProjectDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  isActive?: boolean
  projects: Project[]
  onSelect?: () => void
  onRename?: () => void
  onDelete?: () => void
  onArchive?: () => void
  onToggleFavorite?: () => void
  onTogglePin?: () => void
  onDuplicate?: () => void
  onExport?: () => void
  onAddToProject?: (projectId: string) => void
}

function ConversationItem({
  conversation,
  isActive,
  projects,
  onSelect,
  onRename,
  onDelete,
  onArchive,
  onToggleFavorite,
  onTogglePin,
  onDuplicate,
  onExport,
  onAddToProject,
}: ConversationItemProps) {
  return (
    <div
      className={cn(
        'group flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/50',
        isActive && 'bg-accent/10 border-l-2 border-accent'
      )}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">{conversation.title}</h3>
          {conversation.isPinned && <Pin className="h-3 w-3 text-accent" />}
          {conversation.isFavorite && (
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          )}
          {conversation.isArchived && (
            <Archive className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
        {conversation.preview && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {conversation.preview}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {conversation.model && (
            <Badge variant="secondary" className="text-xs">
              {conversation.model}
            </Badge>
          )}
          {conversation.messageCount !== undefined && (
            <span className="text-xs text-muted-foreground">
              {conversation.messageCount} messages
            </span>
          )}
          {conversation.branchCount !== undefined &&
            conversation.branchCount > 1 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GitBranch className="h-3 w-3" />
                {conversation.branchCount} branches
              </span>
            )}
          {conversation.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {conversation.updatedAt.toLocaleDateString()}
        </div>
      </div>

      <div
        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRename}>
              <Edit3 className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onTogglePin}>
              {conversation.isPinned ? (
                <>
                  <PinOff className="mr-2 h-4 w-4" />
                  Unpin
                </>
              ) : (
                <>
                  <Pin className="mr-2 h-4 w-4" />
                  Pin
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleFavorite}>
              {conversation.isFavorite ? (
                <>
                  <StarOff className="mr-2 h-4 w-4" />
                  Remove from favorites
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  Add to favorites
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
            {projects.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled
                  className="text-xs text-muted-foreground"
                >
                  Add to project
                </DropdownMenuItem>
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => onAddToProject?.(project.id)}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    {project.name}
                  </DropdownMenuItem>
                ))}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onArchive}>
              <Archive className="mr-2 h-4 w-4" />
              {conversation.isArchived ? 'Unarchive' : 'Archive'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

// Conversation Branching Component
export interface ConversationBranch {
  id: string
  name: string
  messageId: string
  createdAt: Date
  isActive?: boolean
}

interface BranchingViewProps {
  branches: ConversationBranch[]
  onSelect?: (id: string) => void
  onCreate?: (messageId: string) => void
  onDelete?: (id: string) => void
  onRename?: (id: string, name: string) => void
  className?: string
}

export function BranchingView({
  branches,
  onSelect,
  onDelete,
  onRename,
  className,
}: BranchingViewProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          <h3 className="font-semibold">Conversation Branches</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {branches.length} branches in this conversation
        </p>
      </div>

      <ScrollArea className="max-h-[300px]">
        <div className="divide-y divide-border">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className={cn(
                'flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors',
                branch.isActive && 'bg-accent/10'
              )}
              onClick={() => onSelect?.(branch.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-3 w-3 rounded-full',
                    branch.isActive ? 'bg-accent' : 'bg-muted-foreground'
                  )}
                />
                <div>
                  <p className="font-medium text-sm">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {branch.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onRename?.(branch.id, branch.name)}
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete?.(branch.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// Checkpoint Component
export interface Checkpoint {
  id: string
  name: string
  messageId: string
  createdAt: Date
  description?: string
}

interface CheckpointViewProps {
  checkpoints: Checkpoint[]
  onRestore?: (id: string) => void
  onCreate?: (name: string, messageId: string) => void
  onDelete?: (id: string) => void
  className?: string
}

export function CheckpointView({
  checkpoints,
  onRestore,
  onDelete,
  className,
}: CheckpointViewProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          <h3 className="font-semibold">Checkpoints</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Save and restore conversation states
        </p>
      </div>

      <ScrollArea className="max-h-[300px]">
        <div className="divide-y divide-border">
          {checkpoints.map((checkpoint) => (
            <div
              key={checkpoint.id}
              className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{checkpoint.name}</p>
                {checkpoint.description && (
                  <p className="text-xs text-muted-foreground">
                    {checkpoint.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {checkpoint.createdAt.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestore?.(checkpoint.id)}
                >
                  Restore
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete?.(checkpoint.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {checkpoints.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bookmark className="mb-2 h-8 w-8" />
              <p className="text-sm">No checkpoints saved</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
