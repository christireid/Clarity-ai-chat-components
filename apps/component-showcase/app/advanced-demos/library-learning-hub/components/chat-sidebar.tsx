'use client'

import { useState } from 'react'
import { cn, Button, Badge, ScrollArea } from '@clarity-chat/primitives'
import {
  MessageSquarePlus,
  Trash2,
  BookmarkPlus,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  X,
} from 'lucide-react'
import type { Conversation, SavedPrompt } from '../../_shared'
import { generateId, formatTimestamp } from '../../_shared'

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversationId: string
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  savedPrompts: SavedPrompt[]
  onUsePrompt: (text: string) => void
  onSavePrompt: (text: string) => void
  onDeletePrompt: (id: string) => void
  collapsed: boolean
  onToggleCollapsed: () => void
  className?: string
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  savedPrompts,
  onUsePrompt,
  onSavePrompt,
  onDeletePrompt,
  collapsed,
  onToggleCollapsed,
  className,
}: ChatSidebarProps) {
  const [newPromptText, setNewPromptText] = useState('')
  const [showPromptInput, setShowPromptInput] = useState(false)

  const handleSavePrompt = () => {
    if (!newPromptText.trim()) return
    onSavePrompt(newPromptText.trim())
    setNewPromptText('')
    setShowPromptInput(false)
  }

  if (collapsed) {
    return (
      <div
        className={cn(
          'flex flex-col items-center py-3 gap-2 border-r bg-card/30 w-12',
          className
        )}
      >
        <button
          onClick={onToggleCollapsed}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={onNewConversation}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-primary"
          title="New conversation"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </button>
        <div className="w-6 h-px bg-border my-1" />
        {conversations.slice(0, 5).map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectConversation(c.id)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              c.id === activeConversationId
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted text-muted-foreground'
            )}
            title={c.title}
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col border-r bg-card/30 w-64', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b">
        <span className="text-sm font-semibold">Conversations</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onNewConversation}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-primary"
            title="New conversation"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleCollapsed}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No conversations yet
            </p>
          ) : (
            conversations.map((convo) => (
              <div
                key={convo.id}
                className={cn(
                  'group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors',
                  convo.id === activeConversationId
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted/50 text-foreground'
                )}
                onClick={() => onSelectConversation(convo.id)}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">
                    {convo.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {convo.messages.length} messages
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteConversation(convo.id)
                  }}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                  title="Delete conversation"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Saved Prompts Section */}
      <div className="border-t">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Saved Prompts
          </span>
          <button
            onClick={() => setShowPromptInput(!showPromptInput)}
            className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
            title="Save a new prompt"
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
          </button>
        </div>

        {showPromptInput && (
          <div className="px-2 pb-2">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newPromptText}
                onChange={(e) => setNewPromptText(e.target.value)}
                placeholder="Enter prompt text..."
                className="flex-1 text-xs px-2 py-1.5 rounded-md bg-muted border-0 focus:outline-none focus:ring-1 focus:ring-primary/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSavePrompt()
                  if (e.key === 'Escape') {
                    setShowPromptInput(false)
                    setNewPromptText('')
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleSavePrompt}
                className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <ScrollArea className="max-h-40">
          <div className="px-2 pb-2 space-y-0.5">
            {savedPrompts.length === 0 ? (
              <p className="text-[10px] text-muted-foreground text-center py-3">
                No saved prompts
              </p>
            ) : (
              savedPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onUsePrompt(prompt.text)}
                >
                  <Sparkles className="h-3 w-3 shrink-0 text-yellow-500" />
                  <span className="text-xs truncate flex-1">{prompt.text}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeletePrompt(prompt.id)
                    }}
                    className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                  >
                    <X className="h-2.5 w-2.5 text-muted-foreground" />
                  </button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
