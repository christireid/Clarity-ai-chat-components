'use client'

import { useState, useCallback } from 'react'
import type { PromptSuggestion } from '@clarity-chat/react'
import type { TypedChatReturn } from './use-typed-chat'

/**
 * Shared chat input state and handlers.
 *
 * Encapsulates input value management, slash-menu triggering,
 * send logic (with stop-on-loading), and follow-up handling
 * that was duplicated across every demo page (~20 lines each).
 *
 * Pages that need extra behaviour (e.g. library-hub's RAG lookup
 * or mention menu) can wrap or extend the returned `handleSend`.
 */
export function useChatInputHandlers(chat: TypedChatReturn) {
  const [input, setInput] = useState('')
  const [showSlashMenu, setShowSlashMenu] = useState(false)

  const handleSend = useCallback(
    async (overrideText?: string) => {
      const text = overrideText || input.trim()
      if (!text || chat.isLoading) return
      setInput('')
      setShowSlashMenu(false)
      try {
        await chat.append({ role: 'user', content: text })
      } catch {
        // Error is captured by chat.error state
      }
    },
    [input, chat]
  )

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
    setShowSlashMenu(value.endsWith('/'))
  }, [])

  const handleInputSubmit = useCallback(
    async (value: string) => {
      if (chat.isLoading) {
        chat.stop()
      } else {
        await handleSend(value)
      }
    },
    [chat, handleSend]
  )

  const handleFollowUp = useCallback(
    (suggestion: PromptSuggestion) => {
      handleSend(suggestion.text)
    },
    [handleSend]
  )

  return {
    input,
    setInput,
    showSlashMenu,
    setShowSlashMenu,
    handleSend,
    handleInputChange,
    handleInputSubmit,
    handleFollowUp,
  }
}
