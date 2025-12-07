import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Basic Chat Integration Example
 *
 * Demonstrates a simple chat implementation using Clarity Chat components.
 * This example shows the minimum setup required to get started.
 *
 * Features:
 * - Message display
 * - Input handling
 * - Streaming responses
 * - Error handling
 */
import * as React from 'react';
import { ChatWindow, ThemeProvider, themes, useChat, useStreamingSSE, MessageList, ChatInput, ErrorBoundary, } from '@clarity-chat/react';
import '@clarity-chat/react/styles.css';
export function BasicChatIntegration() {
    const { messages, sendMessage, isLoading, error } = useChat({
        initialMessages: [],
    });
    const { connect, disconnect, isConnected } = useStreamingSSE({
        url: '/api/chat/stream',
        autoReconnect: true,
        onMessage: (event) => {
            // Handle streaming message chunks
            console.log('Stream event:', event);
        },
    });
    const handleSend = async (content) => {
        await sendMessage(content);
        // Connect to streaming endpoint
        connect();
    };
    return (_jsx(ErrorBoundary, { children: _jsx(ThemeProvider, { theme: themes.ocean, children: _jsx("div", { className: "flex flex-col h-screen", children: _jsxs(ChatWindow, { children: [_jsx(MessageList, { messages: messages }), _jsx(ChatInput, { onSendMessage: handleSend, disabled: isLoading, placeholder: "Type your message..." }), error && (_jsxs("div", { className: "p-4 bg-destructive/10 text-destructive rounded-lg", children: ["Error: ", error.message] }))] }) }) }) }));
}
export default BasicChatIntegration;
//# sourceMappingURL=basic-chat-integration.js.map