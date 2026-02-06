'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Conversation, ChatMessage, HookMessage } from './types'
import { generateId, getTextContent, createConversation } from './types'

/** Options for syncing chat messages into the conversation store. */
interface SyncOptions {
  /** Optional function to compute timestamp for a message (e.g. from a ref cache). */
  getTimestamp?: (msgId: string) => Date | undefined
  /** Optional function to derive a conversation title from messages.
   *  Receives the current title and the messages array. */
  deriveTitle?: (currentTitle: string, messages: HookMessage[]) => string
  /** Extra properties to merge into the conversation on sync (e.g. artifactCount). */
  extraProps?: (conv: Conversation) => Partial<Conversation>
}

interface ChatHandle {
  messages: HookMessage[]
  setMessages: (msgs: unknown) => void
  stop: () => void
}

interface UseConversationManagerOptions {
  /** The title used when creating new conversations. */
  defaultTitle: string
  /** A reference to the chat instance (useClarityChat return). */
  chat: ChatHandle
  /** Options for message-to-conversation sync. */
  sync?: SyncOptions
}

interface UseConversationManagerReturn {
  conversations: Conversation[]
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  activeConvId: string
  setActiveConvId: React.Dispatch<React.SetStateAction<string>>
  handleSelectConversation: (id: string) => void
  handleNewConversation: () => void
  handleDeleteConversation: (id: string) => void
}

export function useConversationManager({
  defaultTitle,
  chat,
  sync,
}: UseConversationManagerOptions): UseConversationManagerReturn {
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    createConversation(defaultTitle),
  ])
  const [activeConvId, setActiveConvId] = useState(conversations[0].id)

  // Sync chat.messages → conversation store
  useEffect(() => {
    if (chat.messages.length > 0) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConvId) return c
          const mapped: ChatMessage[] = chat.messages.map((m: HookMessage) => ({
            id: m.id || generateId(),
            role: m.role as 'user' | 'assistant',
            content: getTextContent(m.content),
            timestamp: sync?.getTimestamp?.(m.id || '') || new Date(),
          }))
          const title = sync?.deriveTitle
            ? sync.deriveTitle(c.title, chat.messages)
            : c.title
          const extra = sync?.extraProps ? sync.extraProps(c) : {}
          return {
            ...c,
            ...extra,
            messages: mapped,
            updatedAt: new Date(),
            title,
          }
        })
      )
    }
  }, [chat.messages, activeConvId, sync])

  const handleSelectConversation = useCallback(
    (id: string) => {
      chat.stop()
      const targetConv = conversations.find((c) => c.id === id)
      if (targetConv) {
        chat.setMessages(
          targetConv.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          }))
        )
      }
      setActiveConvId(id)
    },
    [chat, conversations]
  )

  const handleNewConversation = useCallback(() => {
    chat.stop()
    chat.setMessages([])
    const c = createConversation(defaultTitle)
    setConversations((prev) => [c, ...prev])
    setActiveConvId(c.id)
  }, [chat, defaultTitle])

  const handleDeleteConversation = useCallback(
    (id: string) => {
      if (conversations.length <= 1) return
      if (id === activeConvId) {
        chat.stop()
        chat.setMessages([])
      }
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (id === activeConvId) {
        setActiveConvId(conversations.find((c) => c.id !== id)!.id)
      }
    },
    [chat, conversations, activeConvId]
  )

  return {
    conversations,
    setConversations,
    activeConvId,
    setActiveConvId,
    handleSelectConversation,
    handleNewConversation,
    handleDeleteConversation,
  }
}
