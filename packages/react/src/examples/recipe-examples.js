import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Recipe Component Examples
 *
 * Demonstrates the pre-built recipe components for common patterns
 */
import { ChatWithMemory, ChatWithAnalytics, ChatWithPreset, ChatWithPersistence, ChatWithErrorHandling, ChatComplete, } from '../components/chat-recipes';
import '@clarity-chat/react/styles.css';
/**
 * Example 1: Chat with Memory
 */
export function MemoryChatExample() {
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ChatWithMemory, { api: "/api/chat", strategy: "vector-store", maxTokens: 8000 }) }));
}
/**
 * Example 2: Chat with Analytics
 */
export function AnalyticsChatExample() {
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ChatWithAnalytics, { api: "/api/chat", onMessageSent: (content) => {
                console.log('Message sent:', content);
                // Send to analytics service
            }, onMessageReceived: (messageId) => {
                console.log('Message received:', messageId);
                // Track in analytics
            }, onError: (error) => {
                console.error('Chat error:', error);
                // Send to error tracking
            } }) }));
}
/**
 * Example 3: Chat with Preset
 */
export function PresetChatExample() {
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ChatWithPreset, { preset: "enterprise", api: "/api/chat" }) }));
}
/**
 * Example 4: Chat with Persistence
 */
export function PersistentChatExample() {
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ChatWithPersistence, { api: "/api/chat", storageKey: "my-chat-session", persist: true }) }));
}
/**
 * Example 5: Chat with Error Handling
 */
export function ErrorHandlingChatExample() {
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ChatWithErrorHandling, { api: "/api/chat", onError: (error, errorInfo) => {
                console.error('Error caught:', error, errorInfo);
                // Send to error tracking service
            }, errorFallback: (error, reset) => (_jsxs("div", { style: { padding: '2rem', textAlign: 'center' }, children: [_jsx("h2", { children: "Something went wrong" }), _jsx("p", { children: error.message }), _jsx("button", { onClick: reset, children: "Try Again" })] })) }) }));
}
/**
 * Example 6: Complete Chat - Everything enabled
 */
export function CompleteChatExample() {
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ChatComplete, { api: "/api/chat", memoryStrategy: "vector-store", storageKey: "complete-chat", onMessageSent: (content) => {
                console.log('Sent:', content);
            }, onMessageReceived: (id) => {
                console.log('Received:', id);
            }, onError: (error) => {
                console.error('Error:', error);
            } }) }));
}
/**
 * Example 7: Using Presets Programmatically
 */
export function PresetUsageExample() {
    const { applyChatPreset } = require('../presets/chat-presets');
    // Apply preset to custom options
    const options = applyChatPreset('enterprise', {
        api: '/api/chat',
        sessionTitle: 'Custom Enterprise Chat',
    });
    return (_jsx("div", { style: { height: '600px' } }));
}
//# sourceMappingURL=recipe-examples.js.map