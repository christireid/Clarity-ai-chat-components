'use client'

import { useState, memo } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Plus,
  MessageSquare,
  Trash2,
  BookOpen,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Search,
  X,
  Bookmark,
  Globe,
} from 'lucide-react'
import type { Conversation, SavedPrompt } from '../../_shared/types'

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversationId: string
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  savedPrompts: SavedPrompt[]
  onUsePrompt: (text: string) => void
  onDeletePrompt: (id: string) => void
  onSavePrompt: (text: string) => void
  collapsed: boolean
  onToggleCollapsed: () => void
}

export const ResearchSidebar = memo(function ResearchSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  savedPrompts,
  onUsePrompt,
  onDeletePrompt,
  onSavePrompt,
  collapsed,
  onToggleCollapsed,
}: ChatSidebarProps) {
  const [promptsExpanded, setPromptsExpanded] = useState(true)
  const [newPrompt, setNewPrompt] = useState('')

  if (collapsed) {
    return (
      <div className="w-12 border-r bg-card/50 flex flex-col items-center py-3 gap-2 shrink-0">
        <button
          onClick={onToggleCollapsed}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="Expand sidebar"
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
          <Globe className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-sm">Research Sessions</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onNewConversation}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="New session"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onToggleCollapsed}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Collapse"
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
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'hover:bg-muted text-muted-foreground'
            )}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{conv.title}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] text-muted-foreground">
                {conv.messages.length}
              </span>
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

      {/* Saved Prompts */}
      <div className="border-t">
        <button
          onClick={() => setPromptsExpanded(!promptsExpanded)}
          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bookmark className="h-3.5 w-3.5 text-amber-500" />
            <span>Saved Prompts</span>
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
