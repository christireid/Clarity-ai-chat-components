import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo } from 'react';
import { useClarityChat, coreMessagesToMessages } from './use-clarity-chat';
import { ChatWindow } from '../../components/chat/chat-window';
import { Card, CardContent, CardHeader, Badge, Button, } from '@clarity-chat/primitives';
import { MemoryProvider } from '../../memory/memory-provider';
const meta = {
    title: 'Hooks/useClarityChat',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
Flagship chat hook that wraps useChatEnhanced with Clarity-specific enhancements.

## Features
- Full Vercel AI SDK compatibility
- Memory integration (3 strategies)
- Transport selection (SSE/WebSocket)
- Context enrichment
- Auto memory capture
- Enhanced error handling

## Usage

\`\`\`tsx
import { useClarityChat, ChatWindow, coreMessagesToMessages } from '@clarity-chat/react'

const chat = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window'
  }
})

const messages = useMemo(
  () => coreMessagesToMessages(chat.messages),
  [chat.messages]
)

<ChatWindow
  messages={messages}
  isLoading={chat.isLoading}
  onSendMessage={async (content) => {
    await chat.append({ role: 'user', content })
  }}
/>
\`\`\`
        `,
            },
        },
    },
};
export default meta;
// Mock API handler for Storybook
const mockChatAPI = async (messages) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const lastMessage = messages[messages.length - 1];
    const response = `This is a mock response to: "${lastMessage.content}". In a real implementation, this would call your AI API.`;
    return new Response(JSON.stringify({
        choices: [
            {
                delta: { content: response },
                finish_reason: 'stop',
            },
        ],
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
export const BasicChat = {
    render: () => {
        const chat = useClarityChat({
            api: '/api/chat',
            fetch: async (url, options) => {
                const body = JSON.parse(options?.body || '{}');
                return mockChatAPI(body.messages || []);
            },
        });
        const messages = useMemo(() => coreMessagesToMessages(chat.messages), [chat.messages]);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Basic Chat" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Simple chat interface using useClarityChat" })] }), _jsx("div", { className: "border rounded-lg", style: { height: '500px' }, children: _jsx(ChatWindow, { messages: messages, isLoading: chat.isLoading, onSendMessage: async (content) => {
                            await chat.append({ role: 'user', content });
                        } }) }), chat.error && (_jsx(Card, { className: "border-destructive", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-destructive", children: ["Error: ", chat.error.message] }) }) }))] }));
    },
};
export const WithMemory = {
    render: () => {
        const chat = useClarityChat({
            api: '/api/chat',
            memory: {
                enabled: true,
                strategy: 'sliding-window',
                maxTokens: 1000,
            },
            fetch: async (url, options) => {
                const body = JSON.parse(options?.body || '{}');
                return mockChatAPI(body.messages || []);
            },
        });
        const messages = useMemo(() => coreMessagesToMessages(chat.messages), [chat.messages]);
        return (_jsx(MemoryProvider, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Chat with Memory" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Chat with memory integration enabled (sliding-window strategy)" })] }), _jsxs("div", { className: "flex gap-2 mb-2", children: [_jsxs(Badge, { variant: chat.memoryInfo.enabled ? 'default' : 'secondary', children: ["Memory: ", chat.memoryInfo.enabled ? 'Enabled' : 'Disabled'] }), chat.memoryInfo.lastContextSummary && (_jsxs(Badge, { variant: "outline", children: ["Context: ", chat.memoryInfo.lastContextSummary.substring(0, 50), "..."] }))] }), _jsx("div", { className: "border rounded-lg", style: { height: '500px' }, children: _jsx(ChatWindow, { messages: messages, isLoading: chat.isLoading, onSendMessage: async (content) => {
                                await chat.append({ role: 'user', content });
                            } }) }), chat.memoryErrorInfo.hasError && (_jsx(Card, { className: "border-yellow-500", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-yellow-700", children: ["Memory Warning: ", chat.memoryErrorInfo.lastError?.message] }) }) }))] }) }));
    },
};
export const WithTransport = {
    render: () => {
        const [transport, setTransport] = React.useState('sse');
        const chat = useClarityChat({
            api: '/api/chat',
            transport,
            fetch: async (url, options) => {
                const body = JSON.parse(options?.body || '{}');
                return mockChatAPI(body.messages || []);
            },
        });
        const messages = useMemo(() => coreMessagesToMessages(chat.messages), [chat.messages]);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Chat with Transport Selection" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Choose between SSE and WebSocket transport protocols" })] }), _jsxs("div", { className: "flex gap-2 mb-2", children: [_jsx(Button, { variant: transport === 'sse' ? 'default' : 'outline', onClick: () => setTransport('sse'), size: "sm", children: "SSE" }), _jsx(Button, { variant: transport === 'websocket' ? 'default' : 'outline', onClick: () => setTransport('websocket'), size: "sm", children: "WebSocket" }), _jsxs(Badge, { variant: "outline", children: ["Current: ", transport.toUpperCase()] })] }), _jsx("div", { className: "border rounded-lg", style: { height: '500px' }, children: _jsx(ChatWindow, { messages: messages, isLoading: chat.isLoading, onSendMessage: async (content) => {
                            await chat.append({ role: 'user', content });
                        } }) })] }));
    },
};
export const AdvancedFeatures = {
    render: () => {
        const chat = useClarityChat({
            api: '/api/chat',
            memory: {
                enabled: true,
                strategy: 'semantic-chunks',
                maxTokens: 2000,
            },
            transport: 'sse',
            userId: 'user-123',
            threadId: 'thread-456',
            onFinish: (message) => {
                console.log('Message finished:', message);
            },
            fetch: async (url, options) => {
                const body = JSON.parse(options?.body || '{}');
                return mockChatAPI(body.messages || []);
            },
        });
        const messages = useMemo(() => coreMessagesToMessages(chat.messages), [chat.messages]);
        return (_jsx(MemoryProvider, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Advanced Features" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Chat with memory, user/thread IDs, and callbacks" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h4", { className: "font-semibold", children: "Configuration" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Memory:" }), ' ', chat.memoryInfo.enabled ? 'Enabled' : 'Disabled', "(", chat.memoryInfo.strategy || 'none', ")"] }), _jsxs("div", { children: [_jsx("strong", { children: "Transport:" }), " SSE"] }), _jsxs("div", { children: [_jsx("strong", { children: "User ID:" }), " user-123"] }), _jsxs("div", { children: [_jsx("strong", { children: "Thread ID:" }), " thread-456"] }), _jsxs("div", { children: [_jsx("strong", { children: "Messages:" }), " ", messages.length] })] }) })] }), _jsx("div", { className: "border rounded-lg", style: { height: '500px' }, children: _jsx(ChatWindow, { messages: messages, isLoading: chat.isLoading, onSendMessage: async (content) => {
                                await chat.append({ role: 'user', content });
                            } }) }), chat.error && (_jsx(Card, { className: "border-destructive", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-destructive", children: ["Error: ", chat.error.message] }) }) }))] }) }));
    },
};
//# sourceMappingURL=use-clarity-chat.stories.js.map