'use client'

import { useState, useCallback } from 'react'
import type { HookMessage } from './types'
import { getTextContent } from './types'

interface ChatHandle {
  messages: HookMessage[]
  setMessages: (msgs: unknown) => void
  append: (msg: { role: string; content: string }) => unknown
}

interface UseMessageEditingOptions {
  /** The chat instance returned by useClarityChat. */
  chat: ChatHandle
  /** The messages array to search (defaults to chat.messages). */
  messages?: HookMessage[]
  /** Called to resend a message after editing. Defaults to chat.append. */
  onResend?: (text: string) => void
}

interface UseMessageEditingReturn {
  editingMessageId: string | null
  editingText: string
  setEditingText: React.Dispatch<React.SetStateAction<string>>
  handleEditStart: (msgId: string) => void
  handleEditSave: (msgId: string) => void
  handleEditCancel: () => void
}

export function useMessageEditing({
  chat,
  messages,
  onResend,
}: UseMessageEditingOptions): UseMessageEditingReturn {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const msgs = messages ?? chat.messages

  const handleEditStart = useCallback(
    (msgId: string) => {
      const msg = msgs.find((m) => m.id === msgId)
      if (msg) {
        setEditingMessageId(msgId)
        setEditingText(getTextContent(msg.content))
      }
    },
    [msgs]
  )

  const handleEditSave = useCallback(
    (msgId: string) => {
      const idx = msgs.findIndex((m) => m.id === msgId)
      if (idx === -1) return
      const newText = editingText
      chat.setMessages(msgs.slice(0, idx))
      setEditingMessageId(null)
      setEditingText('')
      setTimeout(() => {
        if (onResend) {
          onResend(newText)
        } else {
          chat.append({ role: 'user', content: newText })
        }
      }, 100)
    },
    [msgs, editingText, chat, onResend]
  )

  const handleEditCancel = useCallback(() => {
    setEditingMessageId(null)
    setEditingText('')
  }, [])

  return {
    editingMessageId,
    editingText,
    setEditingText,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
  }
}
