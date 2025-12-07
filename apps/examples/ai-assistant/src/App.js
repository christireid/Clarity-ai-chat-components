import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ChatWindow, useAutoScroll, useTokenTracker, ErrorBoundary, TokenCounter, NetworkStatus, } from '@clarity-chat/react';
import { queryClient } from '@/lib/queryClient';
import { useAppStore } from '@/lib/store';
import { useChat } from '@/hooks/useChat';
import { ConversationSidebar } from '@/components/ConversationSidebar';
function ChatApp() {
    const { getCurrentConversation, addConversation } = useAppStore();
    const { sendMessage, isLoading } = useChat();
    const conversation = getCurrentConversation();
    // Memoize initial conversation object to prevent recreation
    const initialConversation = useMemo(() => ({
        id: Date.now().toString(),
        title: 'New Conversation',
        messages: [
            {
                id: '1',
                chatId: Date.now().toString(),
                role: 'assistant',
                content: 'Hello! I\'m your AI assistant powered by TanStack Query. How can I help you today?',
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'sent',
            },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }), []);
    // Create initial conversation if none exists - moved to useEffect
    useEffect(() => {
        if (!conversation) {
            addConversation(initialConversation);
        }
    }, [conversation, addConversation, initialConversation]);
    // Auto-scroll
    const { scrollRef } = useAutoScroll({
        dependencies: [conversation?.messages || []],
    });
    // Token tracking
    const { tokens: totalTokens } = useTokenTracker({
        modelName: 'gpt-3.5-turbo'
    });
    // Wrapped in useCallback to prevent ChatWindow re-renders
    const handleSendMessage = useCallback((content) => {
        sendMessage(content);
    }, [sendMessage]);
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(ConversationSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("div", { className: "p-4 sm:p-8 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-1", children: "AI Assistant Demo" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Powered by TanStack Query with optimistic updates and caching" })] }), _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(TokenCounter, { currentTokens: totalTokens, maxTokens: 16000, size: "sm" }), _jsx(NetworkStatus, {})] })] }) }), _jsx("div", { ref: scrollRef, className: "flex-1 min-h-0 overflow-auto", children: conversation && (_jsx(ChatWindow, { messages: conversation.messages, isLoading: isLoading, onSendMessage: handleSendMessage })) })] })] }));
}
export default function App() {
    return (_jsx(ErrorBoundary, { fallback: (error) => (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "p-8 max-w-md text-center", children: [_jsx("h1", { className: "text-xl font-semibold text-red-600 mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: error.message }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-blue-600 text-white rounded-md", children: "Reload Page" })] }) })), children: _jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(ChatApp, {}), _jsx(ReactQueryDevtools, { initialIsOpen: false })] }) }));
}
//# sourceMappingURL=App.js.map