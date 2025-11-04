import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ChatWindow } from '@clarity-chat/react';
import { queryClient } from '@/lib/queryClient';
import { useAppStore } from '@/lib/store';
import { useChat } from '@/hooks/useChat';
import { ConversationSidebar } from '@/components/ConversationSidebar';
function ChatApp() {
    const { getCurrentConversation, addConversation } = useAppStore();
    const { sendMessage, isLoading } = useChat();
    const conversation = getCurrentConversation();
    // Create initial conversation if none exists
    if (!conversation) {
        const initialConversation = {
            id: Date.now().toString(),
            title: 'New Conversation',
            messages: [
                {
                    id: '1',
                    role: 'assistant',
                    content: 'Hello! I\'m your AI assistant powered by TanStack Query. How can I help you today?',
                    timestamp: Date.now(),
                },
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        addConversation(initialConversation);
    }
    const handleSendMessage = (content) => {
        sendMessage(content);
    };
    return (_jsxs("div", { style: {
            display: 'flex',
            height: '100vh',
        }, children: [_jsx(ConversationSidebar, {}), _jsxs("div", { style: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }, children: [_jsxs("div", { style: {
                            padding: '1rem 2rem',
                            borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
                        }, children: [_jsx("h1", { style: {
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    marginBottom: '0.25rem',
                                }, children: "AI Assistant Demo" }), _jsx("p", { style: {
                                    fontSize: '0.875rem',
                                    color: 'rgba(128, 128, 128, 0.7)',
                                }, children: "Powered by TanStack Query with optimistic updates and caching" })] }), _jsx("div", { style: { flex: 1, minHeight: 0 }, children: conversation && (_jsx(ChatWindow, { messages: conversation.messages, isLoading: isLoading, onSendMessage: handleSendMessage })) })] })] }));
}
export default function App() {
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(ChatApp, {}), _jsx(ReactQueryDevtools, { initialIsOpen: false })] }));
}
//# sourceMappingURL=App.js.map