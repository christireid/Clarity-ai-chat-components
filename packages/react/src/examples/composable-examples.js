import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Composable Hook Examples
 *
 * Demonstrates how to compose multiple features together
 */
import { useChatComposable, useChatWithFeatures, createChatHook, } from '../hooks/use-chat-composable';
import { ChatWindow } from '../components/chat-window';
import '@clarity-chat/react/styles.css';
/**
 * Example 1: Using useChatComposable with features object
 */
export function ComposableExample() {
    const chat = useChatComposable({
        api: '/api/chat',
        features: {
            memory: {
                enabled: true,
                strategy: 'vector-store',
                maxTokens: 8000,
            },
            persistence: {
                enabled: true,
                storageKey: 'my-chat-session',
            },
            analytics: {
                onMessageSent: (content) => {
                    console.log('Message sent:', content);
                },
                onMessageReceived: (messageId) => {
                    console.log('Message received:', messageId);
                },
            },
        },
    });
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: chat.sendMessage }) }));
}
/**
 * Example 2: Using useChatWithFeatures (simpler API)
 */
export function FeaturesExample() {
    const chat = useChatWithFeatures({
        api: '/api/chat',
        memory: {
            strategy: 'vector-store',
            maxTokens: 8000,
        },
        persistence: {
            storageKey: 'my-chat',
        },
    });
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: chat.sendMessage }) }));
}
/**
 * Example 3: Using builder pattern
 */
export function BuilderExample() {
    const chat = createChatHook('/api/chat')
        .withMemory('vector-store', 8000)
        .withPersistence('my-chat-session')
        .withAnalytics({
        onMessageSent: (content) => console.log('Sent:', content),
        onMessageReceived: (id) => console.log('Received:', id),
    })
        .withErrorRecovery(3)
        .build();
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: chat.sendMessage }) }));
}
/**
 * Example 4: Progressive enhancement
 */
export function ProgressiveExample() {
    // Start simple
    const basicChat = useChatComposable({
        api: '/api/chat',
    });
    // Add features as needed
    const enhancedChat = useChatComposable({
        api: '/api/chat',
        features: {
            memory: { enabled: true },
            persistence: { enabled: true },
        },
    });
    return (_jsxs("div", { children: [_jsx("h2", { children: "Basic Chat" }), _jsx("div", { style: { height: '300px' }, children: _jsx(ChatWindow, { messages: basicChat.messages, isLoading: basicChat.isLoading, onSendMessage: basicChat.sendMessage }) }), _jsx("h2", { children: "Enhanced Chat" }), _jsx("div", { style: { height: '300px' }, children: _jsx(ChatWindow, { messages: enhancedChat.messages, isLoading: enhancedChat.isLoading, onSendMessage: enhancedChat.sendMessage }) })] }));
}
//# sourceMappingURL=composable-examples.js.map