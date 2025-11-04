import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useStreamingSSE } from '../hooks/use-streaming-sse';
import { useStreamingWebSocket } from '../hooks/use-streaming-websocket';
import { StreamCancellation } from '../components/stream-cancellation';
import { Button } from '@clarity-chat/primitives';
import { cn } from '@clarity-chat/primitives';
/**
 * Example: SSE Streaming Chat
 *
 * Demonstrates real-world usage of useStreamingSSE hook
 * for OpenAI/Anthropic-style streaming chat responses.
 */
export const SSEStreamingChatExample = () => {
    const [input, setInput] = React.useState('');
    const [conversationId] = React.useState(() => crypto.randomUUID());
    const { status, data, error, connect, disconnect, reconnectAttempt, isReconnecting, } = useStreamingSSE({
        url: '/api/chat/stream',
        method: 'POST',
        body: { message: input, conversationId },
        authToken: 'your-auth-token', // Replace with actual token
        autoReconnect: true,
        maxReconnectAttempts: 3,
        onMessage: (event) => {
            // Handle special event types
            if (event.type === 'done') {
                console.log('Stream completed');
                disconnect();
            }
            else if (event.type === 'error') {
                console.error('Server error:', event.data);
            }
        },
        onError: (error) => {
            console.error('SSE Error:', error);
        },
        onReconnecting: (attempt, delay) => {
            console.log(`Reconnecting... Attempt ${attempt}, delay ${delay}ms`);
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim())
            return;
        connect();
    };
    return (_jsxs("div", { className: "mx-auto max-w-2xl space-y-4 p-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "SSE Streaming Chat" }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("div", { className: cn('h-2 w-2 rounded-full', {
                            'bg-gray-400': status === 'idle',
                            'bg-yellow-500 animate-pulse': status === 'connecting',
                            'bg-green-500': status === 'connected' || status === 'streaming',
                            'bg-red-500': status === 'error',
                        }) }), _jsx("span", { className: "capitalize", children: status }), isReconnecting && (_jsxs("span", { className: "text-muted-foreground", children: ["(Reconnecting... Attempt ", reconnectAttempt, ")"] }))] }), error && (_jsxs("div", { className: "rounded-lg border border-red-200 bg-red-50 p-4", children: [_jsxs("p", { className: "text-sm text-red-800", children: [_jsx("strong", { children: "Error:" }), " ", error.message] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => connect(), className: "mt-2", children: "Retry" })] })), _jsx("div", { className: "min-h-[200px] rounded-lg border bg-white p-4", children: data ? (_jsx("div", { className: "prose prose-sm", children: _jsx("p", { className: "whitespace-pre-wrap", children: data }) })) : (_jsx("p", { className: "text-muted-foreground", children: "Enter a message and click \"Send\" to start streaming..." })) }), _jsx(StreamCancellation, { isStreaming: status === 'streaming', onCancel: disconnect }), _jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type your message...", className: "flex-1 rounded-lg border px-4 py-2", disabled: status === 'streaming' }), _jsx(Button, { type: "submit", disabled: !input.trim() || status === 'streaming', children: "Send" })] })] }));
};
/**
 * Example: WebSocket Chat
 *
 * Demonstrates real-world usage of useStreamingWebSocket hook
 * for bidirectional real-time chat.
 */
export const WebSocketChatExample = () => {
    const [input, setInput] = React.useState('');
    const [displayMessages, setDisplayMessages] = React.useState([]);
    const { status, messages, send, connect, disconnect, reconnectAttempt, isReconnecting, } = useStreamingWebSocket({
        url: 'wss://api.example.com/chat',
        autoReconnect: true,
        enableHeartbeat: true,
        connectOnMount: false,
        onMessage: (message) => {
            // Handle incoming message
            const data = message.data;
            if (data.type === 'chat') {
                setDisplayMessages((prev) => [...prev, `${data.user}: ${data.message}`]);
            }
        },
        onError: (error) => {
            console.error('WebSocket Error:', error);
        },
        onReconnecting: (attempt, delay) => {
            console.log(`Reconnecting... Attempt ${attempt}, delay ${delay}ms`);
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || status !== 'connected')
            return;
        // Send message
        const success = send({
            type: 'chat',
            message: input,
            timestamp: Date.now(),
        });
        if (success) {
            // Optimistically add to UI
            setDisplayMessages((prev) => [...prev, `You: ${input}`]);
            setInput('');
        }
    };
    return (_jsxs("div", { className: "mx-auto max-w-2xl space-y-4 p-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "WebSocket Chat" }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("div", { className: cn('h-2 w-2 rounded-full', {
                            'bg-gray-400': status === 'idle' || status === 'closed',
                            'bg-yellow-500 animate-pulse': status === 'connecting' || status === 'reconnecting',
                            'bg-green-500': status === 'connected',
                            'bg-red-500': status === 'error',
                        }) }), _jsx("span", { className: "capitalize", children: status }), isReconnecting && (_jsxs("span", { className: "text-muted-foreground", children: ["(Reconnecting... Attempt ", reconnectAttempt, ")"] }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: connect, disabled: status === 'connected' || status === 'connecting', variant: "outline", children: "Connect" }), _jsx(Button, { onClick: () => disconnect(), disabled: status === 'idle' || status === 'closed', variant: "outline", children: "Disconnect" })] }), _jsx("div", { className: "min-h-[300px] space-y-2 rounded-lg border bg-white p-4", children: displayMessages.length > 0 ? (displayMessages.map((msg, i) => (_jsx("div", { className: cn('rounded-lg p-3', {
                        'bg-blue-50 text-right': msg.startsWith('You:'),
                        'bg-gray-50': !msg.startsWith('You:'),
                    }), children: _jsx("p", { className: "text-sm", children: msg }) }, i)))) : (_jsx("p", { className: "text-muted-foreground", children: "Connect and send a message to start chatting..." })) }), _jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type your message...", className: "flex-1 rounded-lg border px-4 py-2", disabled: status !== 'connected' }), _jsx(Button, { type: "submit", disabled: !input.trim() || status !== 'connected', children: "Send" })] }), _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Total messages received: ", messages.length] })] }));
};
/**
 * Example: Combined SSE + WebSocket Demo
 *
 * Shows how to choose between SSE and WebSocket based on use case.
 */
export const CombinedStreamingExample = () => {
    const [mode, setMode] = React.useState('sse');
    return (_jsxs("div", { className: "mx-auto max-w-4xl space-y-6 p-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Streaming Examples" }), _jsx("p", { className: "text-muted-foreground", children: "Compare SSE and WebSocket streaming implementations" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: mode === 'sse' ? 'default' : 'outline', onClick: () => setMode('sse'), children: "SSE (Server-Sent Events)" }), _jsx(Button, { variant: mode === 'websocket' ? 'default' : 'outline', onClick: () => setMode('websocket'), children: "WebSocket" })] }), _jsxs("div", { className: "rounded-lg border bg-white p-4", children: [_jsx("h3", { className: "mb-2 font-semibold", children: "When to Use Each:" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "mb-1 font-medium text-green-600", children: "SSE (Server-Sent Events)" }), _jsxs("ul", { className: "space-y-1 text-sm text-muted-foreground", children: [_jsx("li", { children: "\u2713 Unidirectional (server \u2192 client)" }), _jsx("li", { children: "\u2713 OpenAI/Anthropic-style streaming" }), _jsx("li", { children: "\u2713 HTTP-based (easier through firewalls)" }), _jsx("li", { children: "\u2713 Automatic reconnection" }), _jsx("li", { children: "\u2713 Event ID for resumption" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "mb-1 font-medium text-blue-600", children: "WebSocket" }), _jsxs("ul", { className: "space-y-1 text-sm text-muted-foreground", children: [_jsx("li", { children: "\u2713 Bidirectional (client \u2194 server)" }), _jsx("li", { children: "\u2713 Real-time chat" }), _jsx("li", { children: "\u2713 Live collaboration" }), _jsx("li", { children: "\u2713 Gaming/interactive apps" }), _jsx("li", { children: "\u2713 Lower latency" })] })] })] })] }), mode === 'sse' ? _jsx(SSEStreamingChatExample, {}) : _jsx(WebSocketChatExample, {})] }));
};
//# sourceMappingURL=streaming-chat-example.js.map