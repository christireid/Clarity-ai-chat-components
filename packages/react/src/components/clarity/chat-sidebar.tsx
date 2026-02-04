'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  MessageSquare,
  Plus,
  Search,
  Settings,
  FolderOpen,
  Trash2,
  Edit2,
  Pin,
  Archive,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Users,
  Bot,
  X,
  Menu,
  Home,
  Sparkles,
  FileText,
  ImageIcon,
  Code,
  GraduationCap,
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

interface Conversation {
  id: string
  title: string
  preview?: string
  createdAt: Date
  updatedAt: Date
  pinned?: boolean
  archived?: boolean
  projectId?: string
  tags?: string[]
}

interface Project {
  id: string
  name: string
  color?: string
  conversationCount: number
}

interface ChatSidebarProps {
  conversations: Conversation[]
  projects?: Project[]
  activeConversationId?: string
  onConversationSelect: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation?: (id: string) => void
  onRenameConversation?: (id: string, name: string) => void
  onPinConversation?: (id: string) => void
  onArchiveConversation?: (id: string) => void
  onProjectSelect?: (id: string) => void
  onSettingsOpen?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export function ChatSidebar({
  conversations,
  projects = [],
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onPinConversation,
  onArchiveConversation,
  onProjectSelect,
  onSettingsOpen,
  collapsed = false,
  onToggleCollapse,
  className,
}: ChatSidebarProps) {
  const [search, setSearch] = React.useState('')
  const [expandedProjects, setExpandedProjects] = React.useState<string[]>([])
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editValue, setEditValue] = React.useState('')

  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.preview?.toLowerCase().includes(search.toLowerCase())
  )

  const pinnedConversations = filteredConversations.filter(
    (c) => c.pinned && !c.archived
  )
  const recentConversations = filteredConversations.filter(
    (c) => !c.pinned && !c.archived
  )

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const startEdit = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setEditValue(conversation.title)
  }

  const submitEdit = () => {
    if (editingId && editValue.trim()) {
      onRenameConversation?.(editingId, editValue.trim())
    }
    setEditingId(null)
    setEditValue('')
  }

  if (collapsed) {
    return (
      <div
        className={cn(
          'flex flex-col items-center py-4 w-16 border-r border-border bg-sidebar',
          className
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={onToggleCollapse}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Button size="icon" className="mb-4" onClick={onNewConversation}>
          <Plus className="w-5 h-5" />
        </Button>

        <div className="flex-1 flex flex-col items-center gap-2 overflow-y-auto">
          {conversations.slice(0, 10).map((conversation) => (
            <Button
              key={conversation.id}
              variant={
                activeConversationId === conversation.id ? 'secondary' : 'ghost'
              }
              size="icon"
              onClick={() => onConversationSelect(conversation.id)}
              title={conversation.title}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="mt-auto"
          onClick={onSettingsOpen}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col w-72 border-r border-border bg-sidebar',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-semibold">AI Chat</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Button className="w-full" onClick={onNewConversation}>
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Quick Actions */}
        <div className="px-3 mb-2">
          <div className="flex items-center gap-1">
            {[
              { icon: Home, label: 'Home' },
              { icon: Star, label: 'Starred' },
              { icon: Clock, label: 'Recent' },
              { icon: Archive, label: 'Archived' },
            ].map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                className="flex-1 h-8"
                title={item.label}
              >
                <item.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div className="px-3 mb-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Projects
            </h4>
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => toggleProject(project.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors text-sm"
                >
                  {expandedProjects.includes(project.id) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: project.color || '#888' }}
                  />
                  <span className="flex-1 text-left truncate">
                    {project.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {project.conversationCount}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pinned Conversations */}
        {pinnedConversations.length > 0 && (
          <div className="px-3 mb-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Pinned
            </h4>
            <div className="space-y-1">
              {pinnedConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversationId === conversation.id}
                  isEditing={editingId === conversation.id}
                  editValue={editValue}
                  onEditValueChange={setEditValue}
                  onSelect={() => onConversationSelect(conversation.id)}
                  onStartEdit={() => startEdit(conversation)}
                  onSubmitEdit={submitEdit}
                  onCancelEdit={() => setEditingId(null)}
                  onDelete={() => onDeleteConversation?.(conversation.id)}
                  onPin={() => onPinConversation?.(conversation.id)}
                  onArchive={() => onArchiveConversation?.(conversation.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Conversations */}
        <div className="px-3 mb-4">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Recent
          </h4>
          <div className="space-y-1">
            {recentConversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No conversations yet
              </p>
            ) : (
              recentConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversationId === conversation.id}
                  isEditing={editingId === conversation.id}
                  editValue={editValue}
                  onEditValueChange={setEditValue}
                  onSelect={() => onConversationSelect(conversation.id)}
                  onStartEdit={() => startEdit(conversation)}
                  onSubmitEdit={submitEdit}
                  onCancelEdit={() => setEditingId(null)}
                  onDelete={() => onDeleteConversation?.(conversation.id)}
                  onPin={() => onPinConversation?.(conversation.id)}
                  onArchive={() => onArchiveConversation?.(conversation.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onSettingsOpen}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  )
}

// Conversation Item Component
interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  isEditing: boolean
  editValue: string
  onEditValueChange: (value: string) => void
  onSelect: () => void
  onStartEdit: () => void
  onSubmitEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
  onPin: () => void
  onArchive: () => void
}

function ConversationItem({
  conversation,
  isActive,
  isEditing,
  editValue,
  onEditValueChange,
  onSelect,
  onStartEdit,
  onSubmitEdit,
  onCancelEdit,
  onDelete,
  onPin,
  onArchive,
}: ConversationItemProps) {
  const getConversationIcon = () => {
    // Could be based on conversation type/content
    return MessageSquare
  }

  const Icon = getConversationIcon()

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-2 py-2 rounded-md transition-colors cursor-pointer',
        isActive ? 'bg-muted' : 'hover:bg-muted/50'
      )}
      onClick={onSelect}
    >
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />

      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          onBlur={onSubmitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmitEdit()
            if (e.key === 'Escape') onCancelEdit()
          }}
          className="flex-1 bg-transparent border-none outline-none text-sm"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{conversation.title}</p>
          {conversation.preview && (
            <p className="text-xs text-muted-foreground truncate">
              {conversation.preview}
            </p>
          )}
        </div>
      )}

      {conversation.pinned && <Pin className="w-3 h-3 text-accent shrink-0" />}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onStartEdit}>
            <Edit2 className="w-4 h-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPin}>
            <Pin className="w-4 h-4 mr-2" />
            {conversation.pinned ? 'Unpin' : 'Pin'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onArchive}>
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Mobile Sidebar Toggle
interface MobileSidebarToggleProps {
  onClick: () => void
  className?: string
}

export function MobileSidebarToggle({
  onClick,
  className,
}: MobileSidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('lg:hidden', className)}
      onClick={onClick}
    >
      <Menu className="w-5 h-5" />
    </Button>
  )
}
