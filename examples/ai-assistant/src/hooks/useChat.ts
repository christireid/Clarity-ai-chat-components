import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Message } from '@clarity-chat/types'
import { sendChatMessage } from '@/api/chat'
import { useAppStore } from '@/lib/store'

export function useChat() {
  const queryClient = useQueryClient()
  const { getCurrentConversation, updateConversation } = useAppStore()

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const conversation = getCurrentConversation()
      if (!conversation) {
        throw new Error('No active conversation')
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
      }

      const messages = [...conversation.messages, userMessage]
      
      // Optimistically update the conversation
      updateConversation(conversation.id, messages)

      // Send to API
      const response = await sendChatMessage(messages)

      return { userMessage, aiMessage: response.message, conversationId: conversation.id }
    },
    onSuccess: ({ userMessage, aiMessage, conversationId }) => {
      const conversation = getCurrentConversation()
      if (conversation && conversation.id === conversationId) {
        updateConversation(conversationId, [...conversation.messages, aiMessage])
      }
      
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: (error, content) => {
      console.error('Failed to send message:', error)
      // Optionally remove the optimistically added message
    },
  })

  return {
    sendMessage: sendMessage.mutate,
    isLoading: sendMessage.isPending,
    error: sendMessage.error,
  }
}
