'use client'

import { useState, memo } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Plus,
  Trash2,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Blocks,
  X,
  Bookmark,
  FolderOpen,
  Layers,
} from 'lucide-react'
import type { Conversation, SavedPrompt } from '../../_shared/types'

interface ArtifactSidebarProps {
  conversations: Conversation[]
  activeConversationId: string
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  savedPrompts: SavedPrompt[]
  onUsePrompt: (text: string) => void
  onDeletePrompt: (id: string) => void
  onSavePrompt: (text: string) => void
  masterContext: string
  onMasterContextChange: (ctx: string) => void
  techStack: string[]
  onToggleTech: (tech: string) => void
  collapsed: boolean
  onToggleCollapsed: () => void
}

const techOptions = [
  'React',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'Node.js',
  'Python',
  'Vue',
  'Svelte',
]

export const ArtifactSidebar = memo(function ArtifactSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  savedPrompts,
  onUsePrompt,
  onDeletePrompt,
  onSavePrompt,
  masterContext,
  onMasterContextChange,
  techStack,
  onToggleTech,
  collapsed,
  onToggleCollapsed,
}: ArtifactSidebarProps) {
  const [promptsExpanded, setPromptsExpanded] = useState(true)
  const [contextExpanded, setContextExpanded] = useState(false)
  const [newPrompt, setNewPrompt] = useState('')

  if (collapsed) {
    return (
      <div className="w-12 border-r bg-card/50 flex flex-col items-center py-3 gap-2 shrink-0">
        <button
          onClick={onToggleCollapsed}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="Expand"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onNewConversation}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="New session"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-64 border-r bg-card/50 flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Blocks className="h-4 w-4 text-violet-500" />
          <span className="font-semibold text-sm">Projects</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onNewConversation}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onToggleCollapsed}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors group flex items-center justify-between',
              conv.id === activeConversationId
                ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                : 'hover:bg-muted text-muted-foreground'
            )}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <FolderOpen className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{conv.title}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {(conv.artifactCount || 0) > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-violet-500">
                  <Layers className="h-2.5 w-2.5" />
                  {conv.artifactCount}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteConversation(conv.id)
                }}
                className="p-0.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
              </button>
            </div>
          </button>
        ))}
      </div>

      {/* Project Context */}
      <div className="border-t">
        <button
          onClick={() => setContextExpanded(!contextExpanded)}
          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <span className="text-xs">Project Context</span>
          <ChevronDown
            className={cn(
              'h-3 w-3 transition-transform',
              contextExpanded && 'rotate-180'
            )}
          />
        </button>
        {contextExpanded && (
          <div className="px-3 pb-3 space-y-2">
            <textarea
              value={masterContext}
              onChange={(e) => onMasterContextChange(e.target.value)}
              placeholder="Describe your project..."
              rows={2}
              className="w-full text-xs px-2 py-1.5 rounded bg-muted/30 border-0 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none placeholder:text-muted-foreground/40"
            />
            <div className="flex flex-wrap gap-1">
              {techOptions.map((tech) => (
                <button
                  key={tech}
                  onClick={() => onToggleTech(tech)}
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full transition-colors',
                    techStack.includes(tech)
                      ? 'bg-violet-500/20 text-violet-500'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Saved Prompts */}
      <div className="border-t">
        <button
          onClick={() => setPromptsExpanded(!promptsExpanded)}
          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bookmark className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs">Prompts</span>
          </div>
          <ChevronDown
            className={cn(
              'h-3 w-3 transition-transform',
              promptsExpanded && 'rotate-180'
            )}
          />
        </button>
        {promptsExpanded && (
          <div className="px-2 pb-2 space-y-1">
            {savedPrompts.map((prompt) => (
              <div key={prompt.id} className="flex items-center gap-1 group">
                <button
                  onClick={() => onUsePrompt(prompt.text)}
                  className="flex-1 text-left px-2 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 truncate transition-colors"
                  title={prompt.text}
                >
                  {prompt.text}
                </button>
                <button
                  onClick={() => onDeletePrompt(prompt.id)}
                  className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-2.5 w-2.5 text-muted-foreground hover:text-red-500" />
                </button>
              </div>
            ))}
            <div className="flex gap-1 mt-1">
              <input
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newPrompt.trim()) {
                    onSavePrompt(newPrompt.trim())
                    setNewPrompt('')
                  }
                }}
                placeholder="Save a prompt..."
                className="flex-1 text-xs px-2 py-1 rounded bg-muted/50 border-0 focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/40"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
