import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { generateId } from '@clarity-chat/primitives'

export interface UseChatOptions {
  initialMessages?: Message[]
  onSendMessage?: (message: Message) => Promise<void>
}

export interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  retry: (messageId: string) => Promise<void>
  clear: () => void
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { initialMessages = [], onSendMessage } = options
  
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const sendMessage = React.useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: generateId(),
        chatId: 'default',
        role: 'user',
        content,
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        await onSendMessage?.(userMessage)
      } catch (err) {
        setError(err as Error)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg
          )
        )
      } finally {
        setIsLoading(false)
      }
    },
    [onSendMessage]
  )

  const retry = React.useCallback(
    async (messageId: string) => {
      const message = messages.find((msg) => msg.id === messageId)
      if (!message) return

      await sendMessage(message.content)
    },
    [messages, sendMessage]
  )

  const clear = React.useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    retry,
    clear,
  }
}
