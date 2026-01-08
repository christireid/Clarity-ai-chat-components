import { jsx as _jsx } from "react/jsx-runtime";
/**
 * ClarityChat Presets Example
 *
 * Shows how to use pre-configured chat setups for common use cases.
 */
import { ClarityChatPresets } from '../components/chat/clarity-chat-presets';
import '@clarity-chat/react/styles.css';
/**
 * Simple chat - minimal configuration
 */
export function SimpleChatExample() {
    return _jsx(ClarityChatPresets.Simple, { api: "/api/chat" });
}
/**
 * Chat with memory - context-aware conversations
 */
export function MemoryChatExample() {
    return (_jsx(ClarityChatPresets.WithMemory, { api: "/api/chat", memoryStrategy: "sliding-window" }));
}
/**
 * Enterprise chat - full-featured with all options
 */
export function EnterpriseChatExample() {
    return (_jsx(ClarityChatPresets.Enterprise, { api: "/api/chat", sessionTitle: "Enterprise Assistant", showHeader: true }));
}
/**
 * Streaming chat - optimized for real-time updates
 */
export function StreamingChatExample() {
    return (_jsx(ClarityChatPresets.Streaming, { api: "/api/chat", useWebSocket: false }));
}
/**
 * Custom chat using helper utilities
 */
export function CustomChatExample() {
    const { createMemoryChatConfig } = require('../utils/clarity-chat-helpers');
    const { useClarityChat, ChatWindow } = require('../hooks/use-clarity-chat');
    const config = createMemoryChatConfig('/api/chat', 'semantic-chunks', 6000);
    const chat = useClarityChat(config);
    return (_jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: (content) => chat.append({ role: 'user', content }) }));
}
//# sourceMappingURL=clarity-chat-presets-example.js.map