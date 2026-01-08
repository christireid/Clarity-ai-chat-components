import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Clarity Chat with WebSocket Example
 *
 * Example demonstrating useClarityChat with WebSocket transport.
 * Shows how to use WebSocket for bidirectional real-time chat.
 *
 * @example
 * ```tsx
 * import { ClarityChatWebSocketExample } from '@clarity-chat/react/examples'
 *
 * function App() {
 *   return <ClarityChatWebSocketExample />
 * }
 * ```
 */
import * as React from 'react';
import { useClarityChat } from '../hooks/use-clarity-chat';
import { ChatWindow } from '../components/chat/chat-window';
import { convertCoreMessagesToMessages } from '../utils/message/message-conversion';
import { Badge } from '@clarity-chat/primitives';
/**
 * Clarity Chat with WebSocket Example Component
 *
 * Demonstrates useClarityChat with WebSocket transport for real-time chat.
 * WebSocket provides bidirectional communication and lower latency.
 */
export function ClarityChatWebSocketExample() {
    const { messages: coreMessages, append, isLoading, memoryInfo, } = useClarityChat({
        api: '/api/chat/ws', // WebSocket endpoint
        transport: 'websocket',
        websocket: {
            autoReconnect: true,
            maxReconnectAttempts: 5,
            enableHeartbeat: true,
        },
        memory: {
            enabled: true,
            strategy: 'sliding-window',
        },
    });
    // Convert CoreMessage[] to Message[] for ChatWindow
    const messages = React.useMemo(() => convertCoreMessagesToMessages(coreMessages), [coreMessages]);
    const handleSendMessage = React.useCallback(async (content) => {
        await append({
            role: 'user',
            content,
        });
    }, [append]);
    return (_jsxs("div", { className: "flex h-screen w-full flex-col", children: [_jsx("div", { className: "border-b bg-card px-4 py-2", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold", children: "WebSocket Chat" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Real-time bidirectional communication" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", children: "WebSocket" }), memoryInfo.enabled && (_jsxs(Badge, { variant: "secondary", children: ["Memory: ", memoryInfo.memoryCount, " items"] }))] })] }) }), _jsx(ChatWindow, { messages: messages, onSendMessage: handleSendMessage, isLoading: isLoading, showHeader: false })] }));
}
//# sourceMappingURL=clarity-chat-websocket-example.js.map