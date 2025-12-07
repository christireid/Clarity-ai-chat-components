import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Minimal Examples - Top-Level APIs
 *
 * These examples demonstrate the simplest usage of each top-level API.
 * Each example is 10-20 lines of code and shows the "happy path".
 */
import * as React from 'react';
import '@clarity-chat/react/styles.css';
import { ClarityChat, ClarityChatPresets } from '../components/clarity-chat';
import { useClarityChat } from '../hooks/use-clarity-chat';
import { useClarityObject } from '../hooks/use-clarity-object';
import { useChatHandlers } from '../hooks/use-chat-handlers';
import { ChatWindow } from '../components/chat-window';
// ============================================================================
// Example 1: ClarityChat Component (3 lines)
// ============================================================================
/**
 * Simplest chat interface - just provide an API endpoint
 */
export function MinimalClarityChat() {
    return _jsx(ClarityChat, { api: "/api/chat" });
}
// ============================================================================
// Example 2: useClarityChat Hook (10 lines)
// ============================================================================
/**
 * Chat with hook - more control, still simple
 */
export function MinimalUseClarityChat() {
    const { messages, append, isLoading } = useClarityChat({
        api: '/api/chat',
    });
    return (_jsxs("div", { children: [messages.map((msg) => (_jsx("div", { children: String(msg.content) }, msg.id))), _jsx("button", { onClick: () => append({ role: 'user', content: 'Hello!' }), children: "Send" })] }));
}
// ============================================================================
// Example 3: ClarityChatPresets (5 lines)
// ============================================================================
/**
 * Chat with memory using presets
 */
export function MinimalChatWithMemory() {
    return (_jsx(ClarityChatPresets.WithMemory, { api: "/api/chat", memoryStrategy: "sliding-window" }));
}
export function MinimalStructuredOutput() {
    const { object, run, isLoading } = useClarityObject({
        api: '/api/generate-profile',
    });
    React.useEffect(() => {
        run({ prompt: 'Create a user profile' });
    }, []);
    return (_jsxs("div", { children: [isLoading && _jsx("p", { children: "Generating..." }), object && (_jsxs("div", { children: [_jsx("h3", { children: object.name }), _jsx("p", { children: object.email })] }))] }));
}
// ============================================================================
// Example 5: Chat with Handlers (12 lines)
// ============================================================================
/**
 * Chat with pre-configured handlers
 */
export function MinimalChatWithHandlers() {
    const chat = useClarityChat({ api: '/api/chat' });
    const handlers = useChatHandlers({ chat });
    return (_jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: handlers.onSendMessage }));
}
//# sourceMappingURL=minimal-examples.js.map