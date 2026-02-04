'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  ScrollArea,
  Avatar,
  AvatarFallback,
  AvatarImage,
  cn,
} from '@clarity-chat/primitives'
import { Search, Check, Users, User, MessageCircle } from 'lucide-react'

export interface Conversation {
  id: string
  name: string
  type: 'user' | 'group' | 'channel'
  avatar?: string
  lastMessage?: string
  unreadCount?: number
  isOnline?: boolean
}

export interface ForwardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageId: string
  conversations: Conversation[]
  onForward: (messageId: string, conversationIds: string[]) => void
  multiSelect?: boolean
  title?: string
  description?: string
}

/**
 * ForwardDialog - Select conversations to forward a message to
 *
 * Features:
 * - Search conversations
 * - Filter by type (user/group/channel)
 * - Multi-select support
 * - Preview of selected conversations
 * - Keyboard navigation
 *
 * @example
 * ```tsx
 * <ForwardDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   messageId="msg-123"
 *   conversations={conversations}
 *   onForward={(msgId, convIds) => {
 *     console.log('Forward', msgId, 'to', convIds)
 *   }}
 *   multiSelect={true}
 * />
 * ```
 */
export function ForwardDialog({
  open,
  onOpenChange,
  messageId,
  conversations,
  onForward,
  multiSelect = true,
  title = 'Forward Message',
  description = 'Select conversations to forward this message to',
}: ForwardDialogProps) {
  const [search, setSearch] = React.useState('')
  const [selected, setSelected] = React.useState<string[]>([])
  const [filter, setFilter] = React.useState<'all' | 'user' | 'group' | 'channel'>('all')

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSearch('')
      setSelected([])
      setFilter('all')
    }
  }, [open])

  const handleToggle = (conversationId: string) => {
    if (multiSelect) {
      setSelected((prev) =>
        prev.includes(conversationId)
          ? prev.filter((id) => id !== conversationId)
          : [...prev, conversationId]
      )
    } else {
      setSelected([conversationId])
    }
  }

  const handleForward = () => {
    if (selected.length > 0) {
      onForward(messageId, selected)
      onOpenChange(false)
    }
  }

  // Filter and search conversations
  const filteredConversations = React.useMemo(() => {
    return conversations.filter((conv) => {
      const matchesSearch = conv.name
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesFilter = filter === 'all' || conv.type === filter
      return matchesSearch && matchesFilter
    })
  }, [conversations, search, filter])

  const getConversationIcon = (type: Conversation['type']) => {
    switch (type) {
      case 'user':
        return User
      case 'group':
        return Users
      case 'channel':
        return MessageCircle
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(['all', 'user', 'group', 'channel'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors',
                  filter === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Selected Count */}
          {multiSelect && selected.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selected.length} conversation{selected.length !== 1 ? 's' : ''}{' '}
              selected
            </div>
          )}

          {/* Conversation List */}
          <ScrollArea className="h-[300px] border rounded-md">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conversation) => {
                const isSelected = selected.includes(conversation.id)
                const Icon = getConversationIcon(conversation.type)

                return (
                  <button
                    key={conversation.id}
                    onClick={() => handleToggle(conversation.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors',
                      isSelected
                        ? 'bg-primary/10 border border-primary'
                        : 'hover:bg-muted border border-transparent'
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        {conversation.avatar ? (
                          <AvatarImage src={conversation.avatar} />
                        ) : (
                          <AvatarFallback>
                            <Icon className="h-5 w-5" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {conversation.name}
                        </span>
                        {conversation.unreadCount && (
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <div className="shrink-0">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}

              {filteredConversations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No conversations found
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleForward}
            disabled={selected.length === 0}
          >
            Forward to {selected.length || 0}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
