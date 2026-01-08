import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Complex Examples - Full Workflow Compositions
 *
 * These examples demonstrate complex, real-world use cases combining
 * multiple APIs and domains. Each example is 80-150 lines of code.
 */
import * as React from 'react';
import '@clarity-chat/react/styles.css';
import { useClarityChat } from '../hooks/use-clarity-chat';
import { useChatHandlers } from '../hooks/use-chat-handlers';
import { ChatWindow } from '../components/chat-window';
import { MemoryProvider, useMemoryContext } from '../memory/memory-provider';
import { useClarityChatWithTools, createToolUIRegistry } from '../hooks/use-clarity-chat-with-tools';
import { createAgent } from '../agents';
import { useStreaming } from '../hooks/use-streaming';
// ============================================================================
// Example 1: Enterprise Chat with Memory and Advanced Features (100 lines)
// ============================================================================
/**
 * Full-featured enterprise chat with memory and advanced configuration
 * Shows how to compose multiple providers and hooks
 */
export function EnterpriseChatWithInfrastructure() {
    return (_jsx(MemoryProvider, { config: { maxTokens: 10000 }, children: _jsx(EnterpriseChatInner, {}) }));
}
function EnterpriseChatInner() {
    const memory = useMemoryContext();
    const chat = useClarityChat({
        api: '/api/chat',
        memory: {
            enabled: true,
            strategy: 'vector-store',
            maxTokens: 10000,
        },
        promptOptimization: {
            enabled: true,
            strategy: 'hybrid',
        },
    });
    const handlers = useChatHandlers({
        chat,
        onMessageSent: async (content) => {
            // Add to memory
            if (memory?.addMemory) {
                await memory.addMemory(content, 'conversation', 'session');
            }
        },
        onMessageError: (error) => {
            logger.logger.error('Message error:', error);
        },
    });
    return (_jsxs("div", { className: "enterprise-chat", children: [_jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: handlers.onSendMessage, showHeader: true, sessionTitle: "Enterprise Assistant", showMessageCount: true }), _jsx("div", { className: "enterprise-stats", children: _jsxs("p", { children: ["Memory: ", memory?.stats?.totalItems || 0, " items"] }) })] }));
}
function SearchToolResult({ result }) {
    return (_jsxs("div", { className: "search-result", children: [_jsx("h4", { children: result.title }), _jsx("p", { children: result.snippet }), _jsx("a", { href: result.url, target: "_blank", rel: "noopener noreferrer", children: result.url })] }));
}
export function AgentPoweredChat() {
    const toolRegistry = React.useMemo(() => createToolUIRegistry({
        web_search: SearchToolResult,
    }), []);
    const { messages, toolResults, isLoading, append } = useClarityChatWithTools({
        api: '/api/chat',
        toolRegistry,
    });
    const handlers = useChatHandlers({
        chat: { messages, append, isLoading, setMessages: () => { } },
    });
    // Create agent for complex workflows
    const agent = React.useMemo(() => createAgent({
        name: 'ResearchAgent',
        description: 'An agent that can research topics using web search',
        tools: [
            {
                name: 'web_search',
                description: 'Search the web for information',
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Search query' },
                    },
                    required: ['query'],
                },
                execute: async (args) => {
                    // In production, this would call your search API
                    return { results: [] };
                },
            },
        ],
        maxIterations: 10,
    }), []);
    const handleComplexQuery = React.useCallback(async (query) => {
        // Use agent for complex multi-step queries
        const execution = await agent.execute(query);
        // Agent results can be integrated into chat
        logger.debug('Agent execution:', execution);
    }, [agent]);
    return (_jsxs("div", { children: [_jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handlers.onSendMessage }), _jsx("div", { className: "tool-results", children: toolResults.map((result, idx) => {
                    const Component = toolRegistry.get(result.toolCall.function.name);
                    return Component ? (_jsx(Component, { result: result.result }, idx)) : null;
                }) })] }));
}
// ============================================================================
// Example 3: Multi-Chat Dashboard (150 lines)
// ============================================================================
/**
 * Dashboard with multiple chat instances
 * Shows how to manage multiple chat sessions
 */
export function MultiChatDashboard() {
    const [activeChat, setActiveChat] = React.useState('chat-1');
    const [chats, setChats] = React.useState({
        'chat-1': { id: 'chat-1', title: 'General Chat' },
        'chat-2': { id: 'chat-2', title: 'Technical Support' },
        'chat-3': { id: 'chat-3', title: 'Sales Inquiry' },
    });
    return (_jsx(MemoryProvider, { config: { maxTokens: 10000 }, children: _jsxs("div", { className: "multi-chat-dashboard", children: [_jsxs("div", { className: "chat-sidebar", children: [_jsx("h2", { children: "Chats" }), Object.values(chats).map((chat) => (_jsx("button", { onClick: () => setActiveChat(chat.id), className: activeChat === chat.id ? 'active' : '', children: chat.title }, chat.id)))] }), _jsx("div", { className: "chat-main", children: activeChat && _jsx(ChatInstance, { chatId: activeChat }, activeChat) })] }) }));
}
function ChatInstance({ chatId }) {
    const chat = useClarityChat({
        api: '/api/chat',
        memory: {
            enabled: true,
            strategy: 'sliding-window',
        },
    });
    const handlers = useChatHandlers({ chat });
    return (_jsx(ChatWindow, { messages: chat.messages, isLoading: chat.isLoading, onSendMessage: handlers.onSendMessage, showHeader: true, sessionTitle: `Chat ${chatId}` }));
}
// ============================================================================
// Example 4: Custom Streaming Implementation (90 lines)
// ============================================================================
/**
 * Custom streaming implementation using low-level primitives
 * Shows how to build custom streaming logic
 */
export function CustomStreamingChat() {
    const [messages, setMessages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const { content: streamContent, startStreaming, reset } = useStreaming({
        onChunk: (chunk) => {
            // Update UI incrementally
            setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'assistant') {
                    return [
                        ...prev.slice(0, -1),
                        { ...last, content: streamContent },
                    ];
                }
                return prev;
            });
        },
        onComplete: (fullContent) => {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: fullContent },
            ]);
            setIsLoading(false);
            reset();
        },
        onError: (error) => {
            logger.logger.error('Streaming error:', error);
            setIsLoading(false);
        },
    });
    const handleSend = React.useCallback(async (content) => {
        setIsLoading(true);
        setMessages((prev) => [...prev, { role: 'user', content }]);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content }),
            });
            if (!response.body) {
                throw new Error('No response body');
            }
            await startStreaming(response.body);
        }
        catch (error) {
            logger.logger.error('Streaming error:', error);
            setIsLoading(false);
        }
    }, [startStreaming]);
    return (_jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSend }));
}
//# sourceMappingURL=complex-examples.js.map