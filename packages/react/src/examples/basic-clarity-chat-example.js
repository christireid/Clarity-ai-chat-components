import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Basic Clarity Chat Example
 *
 * Demonstrates the simplest possible end-to-end chat using:
 * - useClarityChat hook (flagship API)
 * - ChatWindow component (production-ready UI)
 *
 * This example shows the recommended way to use Clarity for most use cases.
 *
 * Note: ChatWindow now accepts CoreMessage[] directly - no conversion needed!
 */
import * as React from 'react';
import { useClarityChat } from '../hooks/use-clarity-chat';
import { ChatWindow } from '../components/chat/chat-window';
// Note: No conversion needed! ChatWindow accepts CoreMessage[] directly
/**
 * Basic Clarity Chat Example Component
 *
 * @example
 * ```tsx
 * import { BasicClarityChatExample } from '@clarity-chat/react/examples'
 *
 * function App() {
 *   return <BasicClarityChatExample />
 * }
 * ```
 */
export function BasicClarityChatExample() {
    const { messages, append, isLoading } = useClarityChat({
        api: '/api/chat',
        // Optional: Enable memory for context-aware conversations
        // memory: {
        //   enabled: true,
        //   strategy: 'semantic-chunks',
        //   autoCapture: true,
        // },
        // Optional: Use WebSocket instead of SSE
        // transport: 'websocket',
    });
    // No conversion needed! ChatWindow accepts CoreMessage[] directly ✨
    // Handle sending messages
    const handleSendMessage = React.useCallback(async (content) => {
        await append({
            role: 'user',
            content,
        });
    }, [append]);
    return (_jsx("div", { className: "flex h-screen flex-col", children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSendMessage, showHeader: true, sessionTitle: "Clarity Chat", sessionSubtitle: "Powered by useClarityChat", showMessageCount: true, onClear: () => {
                // Clear messages by resetting to empty array
                // Note: This would require exposing a clear method from useClarityChat
                // For now, users can reload the component
                window.location.reload();
            } }) }));
}
/**
 * Minimal Example - Even simpler version
 *
 * Shows the absolute minimum code needed for a working chat.
 */
export function MinimalClarityChatExample() {
    const chat = useClarityChat({
        api: '/api/chat',
    });
    // No conversion needed! ChatWindow accepts CoreMessage[] directly ✨
    return (_jsxs("div", { className: "h-screen", children: [_jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: async (content) => {
                    await chat.append({ role: 'user', content });
                } }), chat.error && (_jsx("div", { className: "fixed bottom-4 right-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-lg", children: _jsxs("p", { className: "text-sm text-red-800", children: [_jsx("strong", { children: "Error:" }), " ", chat.error.message] }) }))] }));
}
//# sourceMappingURL=basic-clarity-chat-example.js.map