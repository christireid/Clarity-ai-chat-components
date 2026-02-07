'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatHandle, HookMessage } from './types'
import { getTextContent } from './types'

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

  // Cleanup pending setTimeout on unmount
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleEditStart = useCallback(
    (msgId: string) => {
      const currentMsgs = messages ?? chat.messages
      const msg = currentMsgs.find((m) => m.id === msgId)
      if (msg) {
        setEditingMessageId(msgId)
        setEditingText(getTextContent(msg.content))
      }
    },
    [chat, messages]
  )

  const handleEditSave = useCallback(
    (msgId: string) => {
      const currentMsgs = messages ?? chat.messages
      const idx = currentMsgs.findIndex((m) => m.id === msgId)
      if (idx === -1) return
      const newText = editingText
      chat.setMessages(currentMsgs.slice(0, idx))
      setEditingMessageId(null)
      setEditingText('')
      timerRef.current = setTimeout(() => {
        if (onResend) {
          onResend(newText)
        } else {
          chat.append({ role: 'user', content: newText })
        }
      }, 100)
    },
    [chat, messages, editingText, onResend]
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
