import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Mid-Level Examples - Composable Building Blocks
 *
 * These examples demonstrate using mid-level APIs for more control
 * while maintaining ergonomics. Each example is 40-60 lines of code.
 */
import * as React from 'react';
import '@clarity-chat/react/styles.css';
import { useClarityChat } from '../hooks/use-clarity-chat';
import { useChatHandlers } from '../hooks/use-chat-handlers';
import { ChatWindow } from '../components/chat-window';
import { ChatInput } from '../components/chat-input';
import { useChatEnhanced } from '../hooks/use-chat-enhanced';
import { useClarityChatWithTools } from '../hooks/use-clarity-chat-with-tools';
import { createToolUIRegistry } from '../agents/tool-ui-registry';
import { MemoryProvider, useMemoryContext } from '../memory/memory-provider';
// ============================================================================
// Example 1: Custom Chat with Handlers (45 lines)
// ============================================================================
/**
 * Custom chat interface using mid-level APIs
 * Shows how to compose ChatWindow with handlers for custom UI
 */
export function CustomChatWithHandlers() {
    const chat = useClarityChat({
        api: '/api/chat',
        memory: {
            enabled: true,
            strategy: 'sliding-window',
        },
    });
    const handlers = useChatHandlers({
        chat,
        onMessageSent: (content) => {
            console.log('Message sent:', content);
            // Analytics tracking, etc.
        },
        onMessageError: (error) => {
            console.error('Failed to send:', error);
            // Error reporting, etc.
        },
    });
    return (_jsx("div", { className: "custom-chat-container", children: _jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: handlers.onSendMessage, onClear: handlers.onClear, onMessageRetry: handlers.onRetry, showHeader: true, sessionTitle: "Custom Chat" }) }));
}
// ============================================================================
// Example 2: Vercel-Compatible Chat (50 lines)
// ============================================================================
/**
 * Chat using Vercel AI SDK compatible hook
 * Shows how to use useChatEnhanced for Vercel compatibility
 */
export function VercelCompatibleChat() {
    const chat = useChatEnhanced({
        api: '/api/chat',
        initialMessages: [
            { role: 'system', content: 'You are a helpful assistant.' },
        ],
        onFinish: (message) => {
            console.log('Message finished:', message);
        },
        onError: (error) => {
            console.error('Chat error:', error);
        },
    });
    const handlers = useChatHandlers({ chat });
    return (_jsxs("div", { children: [_jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: handlers.onSendMessage }), _jsx(ChatInput, { value: chat.input, onChange: chat.setInput, onSubmit: handlers.onSendMessage })] }));
}
function WeatherToolResult({ result }) {
    return (_jsxs("div", { className: "weather-result", children: [_jsxs("h4", { children: ["Weather in ", result.location] }), _jsxs("p", { children: [result.temperature, "\u00B0F - ", result.condition] })] }));
}
export function ChatWithTools() {
    const toolRegistry = React.useMemo(() => createToolUIRegistry({
        weather: WeatherToolResult,
    }), []);
    const { messages, toolResults, isLoading, append } = useClarityChatWithTools({
        api: '/api/chat',
        toolRegistry,
    });
    // Create a compatible chat object for handlers
    const chatForHandlers = React.useMemo(() => ({
        messages,
        append,
        isLoading,
        setMessages: () => { }, // Not used in this example
    }), [messages, append, isLoading]);
    const handlers = useChatHandlers({ chat: chatForHandlers });
    return (_jsxs("div", { children: [_jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handlers.onSendMessage }), _jsx("div", { className: "tool-results", children: toolResults.map((result, idx) => {
                    const Component = toolRegistry['get'](result.toolCall.function.name);
                    return Component ? (_jsx(Component, { result: result.result }, idx)) : null;
                }) })] }));
}
// ============================================================================
// Example 4: Memory-Aware Chat (60 lines)
// ============================================================================
/**
 * Chat with memory context integration
 * Shows how to use MemoryProvider and useMemoryContext
 */
export function MemoryAwareChat() {
    return (_jsx(MemoryProvider, { config: { maxTokens: 10000 }, children: _jsx(MemoryChatInner, {}) }));
}
function MemoryChatInner() {
    const memory = useMemoryContext();
    const chat = useClarityChat({
        api: '/api/chat',
        memory: {
            enabled: true,
            strategy: 'vector-store',
        },
    });
    const handlers = useChatHandlers({
        chat,
        onMessageSent: async (content) => {
            // Add to memory before sending
            if (memory?.addMemory) {
                await memory.addMemory(content, 'conversation', 'session', { timestamp: Date.now() });
            }
        },
    });
    return (_jsxs("div", { children: [_jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: handlers.onSendMessage }), memory && (_jsx("div", { className: "memory-info", children: _jsxs("p", { children: ["Memory: ", memory.stats?.totalItems || 0, " items"] }) }))] }));
}
//# sourceMappingURL=mid-level-examples.js.map