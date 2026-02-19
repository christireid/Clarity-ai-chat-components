import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useClarityChat, MemoryProvider, convertCoreMessagesToMessages } from '@clarity-chat/react';
import { Button, Card, Badge } from '@clarity-chat/primitives';
import { useState, useMemo } from 'react';
/**
 * **useClarityChat Hook (Flagship API)**
 *
 * Clarity's flagship chat hook that extends useChatEnhanced with:
 * - Memory integration (sliding-window, semantic-chunks, vector-store)
 * - Transport selection (SSE/WebSocket)
 * - Context enrichment
 * - Auto memory capture
 *
 * **Key Features:**
 * - Full Vercel AI SDK compatibility
 * - Memory-aware conversations
 * - Configurable memory strategies
 * - Transport protocol selection
 * - Context summary generation
 * - Auto memory capture
 *
 * **Use Cases:**
 * - Production AI chat applications
 * - Long-context conversations
 * - Memory-enabled assistants
 * - Enterprise chat solutions
 * - Multi-turn conversations with context
 */
const meta = {
    title: 'Hooks/Chat/UseClarityChat',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useClarityChat\` hook is Clarity's flagship API for building robust
AI chat applications with memory integration and advanced features.

## Features

- ✅ Full Vercel AI SDK compatibility
- ✅ Memory integration with multiple strategies
- ✅ Transport protocol selection (SSE/WebSocket)
- ✅ Context enrichment
- ✅ Auto memory capture
- ✅ Context summary generation
- ✅ Memory status tracking

## Memory Strategies

- **sliding-window**: Fast, recent context only (best for short conversations)
- **semantic-chunks**: Context-aware retrieval (best for medium conversations)
- **vector-store**: Long-term memory (best for enterprise applications)

## Basic Usage

\`\`\`tsx
import { useClarityChat, ChatWindow, MemoryProvider } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading, memoryEnabled, contextSummary } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
    transport: 'sse',
  })

  return <ChatWindow messages={messages} onSendMessage={(content) => append({ role: 'user', content })} />
}
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
// Mock API function
const mockApiCall = async (messages) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const lastMessage = messages[messages.length - 1];
    const response = `Response to: "${lastMessage.content}"`;
    return new Response(new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            const chunks = response.split(' ');
            chunks.forEach((chunk, index) => {
                setTimeout(() => {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk + ' ' })}\n\n`));
                    if (index === chunks.length - 1) {
                        controller.close();
                    }
                }, index * 50);
            });
        },
    }));
};
// Mock fetch
global.fetch = async (url, init) => {
    if (typeof url === 'string' && url.includes('/api/chat')) {
        const body = JSON.parse(init?.body);
        return mockApiCall(body.messages || []);
    }
    throw new Error('Unknown endpoint');
};
function BasicDemo() {
    const { messages: coreMessages, append, isLoading, error, memoryEnabled, contextSummary, } = useClarityChat({
        api: '/api/chat',
    });
    const messages = useMemo(() => convertCoreMessagesToMessages(coreMessages), [coreMessages]);
    const [input, setInput] = useState('');
    const handleSend = async () => {
        if (!input.trim())
            return;
        await append({
            role: 'user',
            content: input,
        });
        setInput('');
    };
    return (_jsx("div", { className: "space-y-4 w-full max-w-4xl", children: _jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Basic useClarityChat" }), memoryEnabled && (_jsx(Badge, { variant: "success", children: "Memory Enabled" }))] }), contextSummary && (_jsxs("div", { className: "mb-4 p-3 bg-muted rounded-lg", children: [_jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Memory Context:" }), _jsx("p", { className: "text-xs text-foreground/80", children: contextSummary })] })), _jsx("div", { className: "border rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-4", children: messages.length === 0 ? (_jsx("div", { className: "text-center text-muted-foreground py-8", children: "No messages yet. Start a conversation!" })) : (_jsxs("div", { className: "space-y-4", children: [messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-blue-50 ml-12'
                                    : 'bg-gray-50 mr-12'}`, children: [_jsx("div", { className: "text-sm font-semibold mb-1", children: msg.role }), _jsx("div", { className: "text-sm", children: msg.content })] }, msg.id))), isLoading && (_jsx("div", { className: "text-muted-foreground text-sm", children: "Thinking..." }))] })) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && !e.shiftKey && handleSend(), placeholder: "Type a message...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { onClick: handleSend, disabled: isLoading || !input.trim(), children: "Send" })] }), error && (_jsxs("div", { className: "mt-2 text-red-600 text-sm", children: ["Error: ", error.message] }))] }) }));
}
function MemoryStrategiesDemo() {
    const [strategy, setStrategy] = useState('sliding-window');
    const { messages: coreMessages, append, isLoading, memoryEnabled, contextSummary, } = useClarityChat({
        api: '/api/chat',
        memory: {
            enabled: true,
            strategy,
            maxTokens: 4000,
            autoCapture: true,
        },
    });
    const messages = useMemo(() => convertCoreMessagesToMessages(coreMessages), [coreMessages]);
    const [input, setInput] = useState('');
    const handleSend = async () => {
        if (!input.trim())
            return;
        await append({
            role: 'user',
            content: input,
        });
        setInput('');
    };
    return (_jsx("div", { className: "space-y-4 w-full max-w-4xl", children: _jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Memory Strategies" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Strategy:" }), _jsxs("select", { value: strategy, onChange: (e) => setStrategy(e.target.value), className: "border rounded p-1 text-sm bg-background", children: [_jsx("option", { value: "sliding-window", children: "Sliding Window" }), _jsx("option", { value: "semantic-chunks", children: "Semantic Chunks" }), _jsx("option", { value: "vector-store", children: "Vector Store" })] })] })] }), memoryEnabled && (_jsxs(Badge, { variant: "success", className: "mb-4", children: ["Memory Active: ", strategy] })), contextSummary && (_jsxs("div", { className: "mb-4 p-3 bg-muted rounded-lg", children: [_jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Context Summary:" }), _jsx("p", { className: "text-xs text-foreground/80", children: contextSummary })] })), _jsx("div", { className: "border rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-4", children: messages.length === 0 ? (_jsx("div", { className: "text-center text-muted-foreground py-8", children: "No messages yet. Try different strategies to see how memory works!" })) : (_jsxs("div", { className: "space-y-4", children: [messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-blue-50 ml-12'
                                    : 'bg-gray-50 mr-12'}`, children: [_jsx("div", { className: "text-sm font-semibold mb-1", children: msg.role }), _jsx("div", { className: "text-sm", children: msg.content })] }, msg.id))), isLoading && (_jsx("div", { className: "text-muted-foreground text-sm", children: "Thinking..." }))] })) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && !e.shiftKey && handleSend(), placeholder: "Type a message...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { onClick: handleSend, disabled: isLoading || !input.trim(), children: "Send" })] })] }) }));
}
function TransportDemo() {
    const [transport, setTransport] = useState('sse');
    const { messages: coreMessages, append, isLoading, } = useClarityChat({
        api: '/api/chat',
        transport,
    });
    const messages = useMemo(() => convertCoreMessagesToMessages(coreMessages), [coreMessages]);
    const [input, setInput] = useState('');
    const handleSend = async () => {
        if (!input.trim())
            return;
        await append({
            role: 'user',
            content: input,
        });
        setInput('');
    };
    return (_jsx("div", { className: "space-y-4 w-full max-w-4xl", children: _jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Transport Selection" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Transport:" }), _jsxs("select", { value: transport, onChange: (e) => setTransport(e.target.value), className: "border rounded p-1 text-sm bg-background", children: [_jsx("option", { value: "sse", children: "SSE (Server-Sent Events)" }), _jsx("option", { value: "websocket", children: "WebSocket" })] })] })] }), _jsxs(Badge, { variant: "info", className: "mb-4", children: ["Using: ", transport.toUpperCase()] }), _jsx("div", { className: "border rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-4", children: messages.length === 0 ? (_jsx("div", { className: "text-center text-muted-foreground py-8", children: "No messages yet. Switch transports to see the difference!" })) : (_jsxs("div", { className: "space-y-4", children: [messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-blue-50 ml-12'
                                    : 'bg-gray-50 mr-12'}`, children: [_jsx("div", { className: "text-sm font-semibold mb-1", children: msg.role }), _jsx("div", { className: "text-sm", children: msg.content })] }, msg.id))), isLoading && (_jsx("div", { className: "text-muted-foreground text-sm", children: "Thinking..." }))] })) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && !e.shiftKey && handleSend(), placeholder: "Type a message...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { onClick: handleSend, disabled: isLoading || !input.trim(), children: "Send" })] })] }) }));
}
function FullFeaturedDemo() {
    const [memoryStrategy, setMemoryStrategy] = useState('sliding-window');
    const [transport, setTransport] = useState('sse');
    const [memoryEnabled, setMemoryEnabled] = useState(false);
    const { messages: coreMessages, append, isLoading, error, memoryEnabled: hookMemoryEnabled, contextSummary, } = useClarityChat({
        api: '/api/chat',
        memory: memoryEnabled
            ? {
                enabled: true,
                strategy: memoryStrategy,
                maxTokens: 4000,
                autoCapture: true,
            }
            : undefined,
        transport,
    });
    const messages = useMemo(() => convertCoreMessagesToMessages(coreMessages), [coreMessages]);
    const [input, setInput] = useState('');
    const handleSend = async () => {
        if (!input.trim())
            return;
        await append({
            role: 'user',
            content: input,
        });
        setInput('');
    };
    return (_jsx("div", { className: "space-y-4 w-full max-w-4xl", children: _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Full-Featured Configuration" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "enable-memory", checked: memoryEnabled, onChange: (e) => setMemoryEnabled(e.target.checked), className: "rounded" }), _jsx("label", { htmlFor: "enable-memory", className: "text-sm font-medium", children: "Enable Memory" })] }), memoryEnabled && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Strategy:" }), _jsxs("select", { value: memoryStrategy, onChange: (e) => setMemoryStrategy(e.target.value), className: "border rounded p-1 text-sm bg-background", children: [_jsx("option", { value: "sliding-window", children: "Sliding Window" }), _jsx("option", { value: "semantic-chunks", children: "Semantic Chunks" }), _jsx("option", { value: "vector-store", children: "Vector Store" })] })] })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Transport:" }), _jsxs("select", { value: transport, onChange: (e) => setTransport(e.target.value), className: "border rounded p-1 text-sm bg-background", children: [_jsx("option", { value: "sse", children: "SSE" }), _jsx("option", { value: "websocket", children: "WebSocket" })] })] })] }), hookMemoryEnabled && (_jsxs(Badge, { variant: "success", className: "mb-4", children: ["Memory Active: ", memoryStrategy] })), contextSummary && (_jsxs("div", { className: "mb-4 p-3 bg-muted rounded-lg", children: [_jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Memory Context:" }), _jsx("p", { className: "text-xs text-foreground/80 line-clamp-2", children: contextSummary })] })), _jsx("div", { className: "border rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-4", children: messages.length === 0 ? (_jsx("div", { className: "text-center text-muted-foreground py-8", children: "Configure memory and transport, then start chatting!" })) : (_jsxs("div", { className: "space-y-4", children: [messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-blue-50 ml-12'
                                    : 'bg-gray-50 mr-12'}`, children: [_jsx("div", { className: "text-sm font-semibold mb-1", children: msg.role }), _jsx("div", { className: "text-sm", children: msg.content })] }, msg.id))), isLoading && (_jsx("div", { className: "text-muted-foreground text-sm", children: "Thinking..." }))] })) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && !e.shiftKey && handleSend(), placeholder: "Type a message...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { onClick: handleSend, disabled: isLoading || !input.trim(), children: "Send" })] }), error && (_jsxs("div", { className: "mt-2 text-red-600 text-sm", children: ["Error: ", error.message] }))] }) }));
}
export const Basic = {
    render: () => (_jsx(MemoryProvider, { config: { maxTokens: 10000 }, children: _jsx(BasicDemo, {}) })),
};
export const MemoryStrategies = {
    render: () => (_jsx(MemoryProvider, { config: { maxTokens: 10000 }, children: _jsx(MemoryStrategiesDemo, {}) })),
};
export const TransportSelection = {
    render: () => (_jsx(MemoryProvider, { config: { maxTokens: 10000 }, children: _jsx(TransportDemo, {}) })),
};
export const FullFeatured = {
    render: () => (_jsx(MemoryProvider, { config: { maxTokens: 10000 }, children: _jsx(FullFeaturedDemo, {}) })),
};
//# sourceMappingURL=UseClarityChat.stories.js.map