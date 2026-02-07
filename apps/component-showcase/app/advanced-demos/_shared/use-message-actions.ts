'use client'

import { useState, useCallback } from 'react'
import type { HookMessage } from './types'
import { getTextContent } from './types'

interface ChatHandle {
  messages: HookMessage[]
  setMessages: (msgs: HookMessage[]) => void
  append: (msg: { role: string; content: string }) => unknown
  reload: () => unknown
}

interface UseMessageActionsOptions {
  /** The chat instance. */
  chat: ChatHandle
  /** Override messages array (e.g. a mapped/filtered subset). */
  messages?: HookMessage[]
  /** Called to resend after regenerating. Defaults to chat.append. */
  onResend?: (text: string) => void
  /** Extra cleanup when a message is deleted (e.g. clear citations map). */
  onDeleteCleanup?: (msgId: string) => void
}

interface UseMessageActionsReturn {
  feedback: Record<string, 'up' | 'down'>
  handleFeedback: (msgId: string, fb: 'up' | 'down') => void
  handleDeleteMessage: (msgId: string) => void
  handleRegenerate: (msgId: string) => void
}

export function useMessageActions({
  chat,
  messages,
  onResend,
  onDeleteCleanup,
}: UseMessageActionsOptions): UseMessageActionsReturn {
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({})

  const handleFeedback = useCallback((msgId: string, fb: 'up' | 'down') => {
    setFeedback((prev) => ({ ...prev, [msgId]: fb }))
  }, [])

  const handleDeleteMessage = useCallback(
    (msgId: string) => {
      const currentMsgs = messages ?? chat.messages
      chat.setMessages(currentMsgs.filter((m: HookMessage) => m.id !== msgId))
      setFeedback((prev) => {
        const next = { ...prev }
        delete next[msgId]
        return next
      })
      onDeleteCleanup?.(msgId)
    },
    [chat, messages, onDeleteCleanup]
  )

  const handleRegenerate = useCallback(
    (msgId: string) => {
      const currentMsgs = messages ?? chat.messages
      const idx = currentMsgs.findIndex((m: HookMessage) => m.id === msgId)
      if (idx < 0) return
      // If it's the last message, just reload
      if (idx === currentMsgs.length - 1) {
        chat.reload()
        return
      }
      // Otherwise find the preceding user message and resend
      if (idx > 0 && currentMsgs[idx - 1]?.role === 'user') {
        const userContent = getTextContent(currentMsgs[idx - 1].content)
        chat.setMessages(currentMsgs.slice(0, idx - 1))
        setTimeout(() => {
          if (onResend) {
            onResend(userContent)
          } else {
            chat.append({ role: 'user', content: userContent })
          }
        }, 100)
      }
    },
    [chat, messages, onResend]
  )

  return {
    feedback,
    handleFeedback,
    handleDeleteMessage,
    handleRegenerate,
  }
}
