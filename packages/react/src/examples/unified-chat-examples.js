import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Unified Chat Hook Examples
 *
 * Demonstrates the simplified useChat hook API
 */
import { useChat, ChatWindow } from '@clarity-chat/react';
import '@clarity-chat/react/styles.css';
/**
 * Basic Example - Simplest usage
 */
export function BasicUseChatExample() {
    const { messages, sendMessage, isLoading } = useChat({
        api: '/api/chat',
    });
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: sendMessage }) }));
}
/**
 * With Persistence - Messages saved to localStorage
 */
export function PersistentChatExample() {
    const { messages, sendMessage, isLoading, clearMessages } = useChat({
        api: '/api/chat',
        persistMessages: true,
        storageKey: 'my-chat-session',
    });
    return (_jsxs("div", { style: { height: '600px' }, children: [_jsx("div", { style: { padding: '1rem', borderBottom: '1px solid #e5e7eb' }, children: _jsx("button", { onClick: clearMessages, children: "Clear Chat" }) }), _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: sendMessage })] }));
}
/**
 * With Memory - Enterprise features
 */
export function MemoryChatExample() {
    const { messages, sendMessage, isLoading, chat } = useChat({
        api: '/api/chat',
        memory: {
            enabled: true,
            strategy: 'vector-store',
        },
    });
    return (_jsxs("div", { style: { height: '600px' }, children: [chat.memoryInfo.enabled && (_jsxs("div", { style: { padding: '0.5rem', background: '#f3f4f6', fontSize: '0.875rem' }, children: ["Memory: ", chat.memoryInfo.memoryCount, " memories stored"] })), _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: sendMessage })] }));
}
/**
 * Full Control - Access to underlying chat object
 */
export function FullControlExample() {
    const { messages, sendMessage, isLoading, chat, error } = useChat({
        api: '/api/chat',
        autoScroll: true,
    });
    return (_jsxs("div", { style: { height: '600px' }, children: [error && (_jsxs("div", { style: { padding: '1rem', background: '#fef2f2', color: '#991b1b' }, children: ["Error: ", error.message] })), _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: sendMessage }), _jsxs("div", { style: { padding: '1rem', fontSize: '0.875rem' }, children: [_jsxs("div", { children: ["Input: ", chat.input] }), _jsxs("div", { children: ["Messages: ", chat.messages.length] })] })] }));
}
//# sourceMappingURL=unified-chat-examples.js.map