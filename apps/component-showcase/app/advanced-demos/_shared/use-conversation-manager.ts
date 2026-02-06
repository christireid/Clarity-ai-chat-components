'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { Conversation, ChatMessage, HookMessage } from './types'
import { generateId, getTextContent, createConversation } from './types'

/** Options for syncing chat messages into the conversation store. */
export interface SyncOptions {
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
  setMessages: (msgs: HookMessage[]) => void
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

  // Stabilize sync callbacks via refs to avoid infinite re-render loops
  // when consumers forget to memoize the sync object.
  const syncRef = useRef(sync)
  syncRef.current = sync

  // Keep refs for use in stable callbacks (avoids stale closure bugs)
  const conversationsRef = useRef(conversations)
  conversationsRef.current = conversations
  const activeConvIdRef = useRef(activeConvId)
  activeConvIdRef.current = activeConvId

  // Sync chat.messages → conversation store
  useEffect(() => {
    if (chat.messages.length > 0) {
      const s = syncRef.current
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConvId) return c
          const mapped: ChatMessage[] = chat.messages.map((m: HookMessage) => ({
            id: m.id || generateId(),
            role: m.role as 'user' | 'assistant',
            content: getTextContent(m.content),
            timestamp: s?.getTimestamp?.(m.id || '') || new Date(),
          }))
          const title = s?.deriveTitle
            ? s.deriveTitle(c.title, chat.messages)
            : c.title
          const extra = s?.extraProps ? s.extraProps(c) : {}
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
  }, [chat.messages, activeConvId])

  const handleSelectConversation = useCallback(
    (id: string) => {
      chat.stop()
      const targetConv = conversationsRef.current.find((c) => c.id === id)
      if (targetConv) {
        chat.setMessages(
          targetConv.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          })) as HookMessage[]
        )
      }
      setActiveConvId(id)
    },
    [chat]
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
      const convs = conversationsRef.current
      if (convs.length <= 1) return
      const currentActive = activeConvIdRef.current
      if (id === currentActive) {
        chat.stop()
        chat.setMessages([])
        const next = convs.find((c) => c.id !== id)
        if (next) setActiveConvId(next.id)
      }
      setConversations((prev) => prev.filter((c) => c.id !== id))
    },
    [chat]
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
