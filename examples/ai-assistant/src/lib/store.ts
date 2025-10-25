import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message } from '@clarity-chat/types'

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

interface AppState {
  conversations: Conversation[]
  currentConversationId: string | null
  addConversation: (conversation: Conversation) => void
  updateConversation: (id: string, messages: Message[]) => void
  deleteConversation: (id: string) => void
  setCurrentConversation: (id: string) => void
  getCurrentConversation: () => Conversation | null
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,

      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversationId: conversation.id,
        })),

      updateConversation: (id, messages) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id
              ? { ...conv, messages, updatedAt: Date.now() }
              : conv
          ),
        })),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversationId:
            state.currentConversationId === id ? null : state.currentConversationId,
        })),

      setCurrentConversation: (id) =>
        set({ currentConversationId: id }),

      getCurrentConversation: () => {
        const state = get()
        return (
          state.conversations.find(
            (conv) => conv.id === state.currentConversationId
          ) || null
        )
      },
    }),
    {
      name: 'ai-assistant-storage',
    }
  )
)
