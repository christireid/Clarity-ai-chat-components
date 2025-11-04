import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAppStore = create()(persist((set, get) => ({
    conversations: [],
    currentConversationId: null,
    addConversation: (conversation) => set((state) => ({
        conversations: [conversation, ...state.conversations],
        currentConversationId: conversation.id,
    })),
    updateConversation: (id, messages) => set((state) => ({
        conversations: state.conversations.map((conv) => conv.id === id
            ? { ...conv, messages, updatedAt: Date.now() }
            : conv),
    })),
    deleteConversation: (id) => set((state) => ({
        conversations: state.conversations.filter((conv) => conv.id !== id),
        currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
    })),
    setCurrentConversation: (id) => set({ currentConversationId: id }),
    getCurrentConversation: () => {
        const state = get();
        return (state.conversations.find((conv) => conv.id === state.currentConversationId) || null);
    },
}), {
    name: 'ai-assistant-storage',
}));
//# sourceMappingURL=store.js.map