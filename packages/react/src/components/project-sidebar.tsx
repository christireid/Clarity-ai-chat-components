import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input, ScrollArea, cn, formatRelativeTime } from '@clarity-chat/primitives'
import type { Project } from '@clarity-chat/types'

export interface ProjectSidebarProps {
  projects: Project[]
  selectedProjectId?: string
  selectedChatId?: string
  onProjectSelect: (projectId: string) => void
  onProjectCreate: () => void
  onProjectEdit?: (projectId: string) => void
  onProjectDelete?: (projectId: string) => void
  onChatSelect: (chatId: string) => void
  onChatCreate: () => void
  onChatEdit?: (chatId: string) => void
  onChatDelete?: (chatId: string) => void
  className?: string
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  selectedProjectId,
  selectedChatId,
  onProjectSelect,
  onProjectCreate,
  onProjectEdit,
  onProjectDelete,
  onChatSelect,
  onChatCreate,
  onChatEdit,
  onChatDelete,
  className,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [expandedProjects, setExpandedProjects] = React.useState<Set<string>>(
    new Set(selectedProjectId ? [selectedProjectId] : [])
  )

  const filteredProjects = React.useMemo(() => {
    if (!searchQuery) return projects
    const query = searchQuery.toLowerCase()
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.chats.some((c) => c.name.toLowerCase().includes(query))
    )
  }, [projects, searchQuery])

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(projectId)) {
        next.delete(projectId)
      } else {
        next.add(projectId)
      }
      return next
    })
  }

  const handleProjectClick = (project: Project) => {
    onProjectSelect(project.id)
    // Auto-expand when selected
    setExpandedProjects((prev) => new Set(prev).add(project.id))
    
    // Auto-select first chat if none selected
    if (!selectedChatId && project.chats.length > 0) {
      onChatSelect(project.chats[0].id)
    }
  }

  return (
    <div className={cn('flex flex-col h-full bg-muted/30 border-r', className)}>
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Projects</h2>
          <Button onClick={onProjectCreate} size="icon" variant="ghost" title="New Project">
            ➕
          </Button>
        </div>

        {/* Search */}
        <Input
          placeholder="Search projects & chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<span>🔍</span>}
          iconPosition="left"
        />
      </div>

      {/* Projects List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <AnimatePresence>
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center px-4"
              >
                <div className="text-4xl mb-2">📁</div>
                <p className="text-sm font-medium">No projects yet</p>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Create a project to organize your chats
                </p>
                <Button onClick={onProjectCreate} size="sm">
                  Create First Project
                </Button>
              </motion.div>
            ) : (
              filteredProjects.map((project) => {
                const isExpanded = expandedProjects.has(project.id)
                const isSelected = project.id === selectedProjectId

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Project Item */}
                    <div
                      className={cn(
                        'group rounded-lg transition-colors cursor-pointer',
                        isSelected ? 'bg-accent' : 'hover:bg-accent/50'
                      )}
                    >
                      <div
                        className="flex items-center gap-2 p-2"
                        onClick={() => handleProjectClick(project)}
                      >
                        {/* Expand/Collapse */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleProject(project.id)
                          }}
                          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-transform"
                          style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        >
                          ▶
                        </button>

                        {/* Project Icon */}
                        <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-lg" style={{ backgroundColor: project.color || '#6366f1' }}>
                          {project.icon || '📁'}
                        </div>

                        {/* Project Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm truncate">{project.name}</h3>
                            {project.isPinned && <span className="text-xs">📌</span>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {project.chats.length} chat{project.chats.length !== 1 ? 's' : ''} • {project.context.length} context
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          {onProjectEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                onProjectEdit(project.id)
                              }}
                              className="h-6 w-6"
                            >
                              ✏️
                            </Button>
                          )}
                          {onProjectDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (confirm(`Delete project "${project.name}"?`)) {
                                  onProjectDelete(project.id)
                                }
                              }}
                              className="h-6 w-6 text-destructive"
                            >
                              🗑️
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Chats List */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-7 mr-2 mb-1 space-y-1"
                          >
                            {/* New Chat Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onChatCreate}
                              className="w-full justify-start text-xs"
                            >
                              ➕ New Chat
                            </Button>

                            {/* Chat Items */}
                            {project.chats.length === 0 ? (
                              <p className="text-xs text-muted-foreground py-2 px-3">
                                No chats yet
                              </p>
                            ) : (
                              project.chats.map((chat) => {
                                const isChatSelected = chat.id === selectedChatId

                                return (
                                  <div
                                    key={chat.id}
                                    className={cn(
                                      'group/chat flex items-center gap-2 p-2 rounded text-sm transition-colors cursor-pointer',
                                      isChatSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent'
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onChatSelect(chat.id)
                                    }}
                                  >
                                    <span className="flex-shrink-0">💬</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1">
                                        <p className="font-medium text-xs truncate">
                                          {chat.name}
                                        </p>
                                        {chat.isPinned && <span className="text-xs">📌</span>}
                                        {chat.isFavorite && <span className="text-xs">⭐</span>}
                                      </div>
                                      {chat.lastMessageAt && (
                                        <p className="text-xs opacity-70">
                                          {formatRelativeTime(chat.lastMessageAt)}
                                        </p>
                                      )}
                                    </div>

                                    {/* Chat Actions */}
                                    <div className="flex-shrink-0 opacity-0 group-hover/chat:opacity-100 transition-opacity flex gap-1">
                                      {onChatEdit && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            onChatEdit(chat.id)
                                          }}
                                          className="h-5 w-5"
                                        >
                                          ✏️
                                        </Button>
                                      )}
                                      {onChatDelete && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            if (confirm(`Delete chat "${chat.name}"?`)) {
                                              onChatDelete(chat.id)
                                            }
                                          }}
                                          className="h-5 w-5 text-destructive"
                                        >
                                          🗑️
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )
                              })
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      {projects.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{projects.length} projects</span>
            <span>
              {projects.reduce((sum, p) => sum + p.chats.length, 0)} total chats
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
