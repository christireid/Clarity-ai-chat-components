import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Hello World Examples - Simplest Possible Usage
 *
 * These examples demonstrate the absolute simplest way to use each major API.
 * Each example is 10-20 lines of code and requires minimal configuration.
 */
import * as React from 'react';
import '@clarity-chat/react/styles.css';
import { ClarityChat, ClarityChatPresets } from '../components/clarity-chat';
import { useClarityChat } from '../hooks/use-clarity-chat';
import { useClarityObject } from '../hooks/use-clarity-object';
import { useChatHandlers } from '../hooks/use-chat-handlers';
import { ChatWindow } from '../components/chat/chat-window';
import { MemoryProvider } from '../memory/memory-provider';
// ============================================================================
// Example 1: Basic Chat (Simplest - 5 lines)
// ============================================================================
/**
 * The simplest possible chat implementation.
 * Zero configuration, works out of the box.
 */
export function HelloWorldChat() {
    return _jsx(ClarityChat, { api: "/api/chat" });
}
// ============================================================================
// Example 2: Chat with Memory (10 lines)
// ============================================================================
/**
 * Chat with memory enabled - just wrap with MemoryProvider.
 */
export function HelloWorldChatWithMemory() {
    return (_jsx(MemoryProvider, { config: { maxTokens: 4000 }, children: _jsx(ClarityChat, { api: "/api/chat" }) }));
}
export function HelloWorldStructuredOutput() {
    const { object, run, isLoading } = useClarityObject({
        api: '/api/generate-products',
    });
    return (_jsxs("div", { children: [_jsx("button", { onClick: () => run({ query: 'laptops' }), disabled: isLoading, children: "Generate Products" }), object && _jsx("pre", { children: JSON.stringify(object, null, 2) })] }));
}
// ============================================================================
// Example 4: Chat with Hook (20 lines)
// ============================================================================
/**
 * Using the hook directly for more control.
 */
export function HelloWorldChatWithHook() {
    const chat = useClarityChat({ api: '/api/chat' });
    const handlers = useChatHandlers({ chat });
    return (_jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: handlers.onSendMessage }));
}
// ============================================================================
// Example 5: Using Presets (10 lines)
// ============================================================================
/**
 * Using pre-configured presets for common scenarios.
 */
export function HelloWorldPresets() {
    return (_jsxs("div", { children: [_jsx(ClarityChatPresets.Simple, { api: "/api/chat" }), _jsx(ClarityChatPresets.WithMemory, { api: "/api/chat" })] }));
}
//# sourceMappingURL=hello-world-examples.js.map