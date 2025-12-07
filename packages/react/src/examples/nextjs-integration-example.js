/**
 * Next.js Integration Example
 *
 * Example demonstrating useClarityChat integration with Next.js App Router,
 * including API route setup, server actions, and client components.
 *
 * @example
 * ```tsx
 * // app/chat/page.tsx
 * import { ChatPage } from '@clarity-chat/react/examples/nextjs-integration-example'
 *
 * export default function Page() {
 *   return <ChatPage />
 * }
 * ```
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages, MemoryProvider, } from '@clarity-chat/react';
/**
 * Next.js Chat Page Component
 *
 * Demonstrates useClarityChat in a Next.js App Router client component.
 */
export function ChatPage() {
    const { messages, append, isLoading, memoryInfo } = useClarityChat({
        // Use Next.js API route
        api: '/api/chat',
        // Optional: Add headers for authentication
        headers: {
        // Next.js automatically includes cookies
        },
        // Optional: Enable memory
        memory: {
            enabled: true,
            strategy: 'vector-store',
        },
    });
    const chatMessages = React.useMemo(() => convertCoreMessagesToMessages(messages), [messages]);
    return (_jsx("div", { className: "container mx-auto h-screen flex flex-col", children: _jsx(ChatWindow, { messages: chatMessages, onSendMessage: (content) => append({ role: 'user', content }), isLoading: isLoading, showHeader: true, sessionTitle: "Next.js Chat", sessionSubtitle: `Memory: ${memoryInfo.memoryCount} items` }) }));
}
/**
 * Next.js Chat Page with Memory Provider
 *
 * Wraps the chat page with MemoryProvider for memory features.
 */
export function ChatPageWithMemory() {
    return (_jsx(MemoryProvider, { config: {
            maxMemories: 1000,
            enableVectorSearch: true,
        }, children: _jsx(ChatPage, {}) }));
}
//# sourceMappingURL=nextjs-integration-example.js.map