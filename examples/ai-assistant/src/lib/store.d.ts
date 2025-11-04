import type { Message } from '@clarity-chat/types';
interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}
interface AppState {
    conversations: Conversation[];
    currentConversationId: string | null;
    addConversation: (conversation: Conversation) => void;
    updateConversation: (id: string, messages: Message[]) => void;
    deleteConversation: (id: string) => void;
    setCurrentConversation: (id: string) => void;
    getCurrentConversation: () => Conversation | null;
}
export declare const useAppStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AppState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AppState, AppState>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AppState) => void) => () => void;
        onFinishHydration: (fn: (state: AppState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AppState, AppState>>;
    };
}>;
export {};
//# sourceMappingURL=store.d.ts.map