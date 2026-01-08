import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Advanced Clarity Chat Example
 *
 * Demonstrates advanced features of useClarityChat including:
 * - Memory integration with different strategies
 * - Transport selection
 * - Custom error handling
 * - Memory context display
 *
 * @example
 * ```tsx
 * // With MemoryProvider
 * <MemoryProvider config={memoryConfig}>
 *   <AdvancedClarityChatExample />
 * </MemoryProvider>
 * ```
 */
import * as React from 'react';
import { useClarityChat } from '../hooks/use-clarity-chat';
import { ChatWindow } from '../components/chat/chat-window';
import { convertCoreMessagesToMessages } from '../utils/message/message-conversion';
import { Button, Badge, Card } from '@clarity-chat/primitives';
export function AdvancedClarityChatExample() {
    const [memoryStrategy, setMemoryStrategy] = React.useState('sliding-window');
    const [transport, setTransport] = React.useState('sse');
    const { messages: coreMessages, input, setInput, append, isLoading, error, memoryInfo, memoryErrorInfo, } = useClarityChat({
        api: '/api/chat',
        memory: {
            enabled: true,
            strategy: memoryStrategy,
            maxTokens: 4000,
        },
        transport,
        onError: (err) => {
            logger.error('Chat error:', err);
            // Custom error handling
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
    return (_jsxs("div", { className: "flex h-screen flex-col", children: [_jsxs(Card, { className: "border-b p-4", children: [_jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Memory Strategy:" }), _jsxs("select", { value: memoryStrategy, onChange: (e) => setMemoryStrategy(e.target.value), className: "rounded-lg border px-3 py-1 text-sm", children: [_jsx("option", { value: "sliding-window", children: "Sliding Window" }), _jsx("option", { value: "semantic-chunks", children: "Semantic Chunks" }), _jsx("option", { value: "vector-store", children: "Vector Store" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Transport:" }), _jsxs("select", { value: transport, onChange: (e) => setTransport(e.target.value), className: "rounded-lg border px-3 py-1 text-sm", children: [_jsx("option", { value: "sse", children: "SSE" }), _jsx("option", { value: "websocket", children: "WebSocket" })] })] }), memoryInfo.enabled && (_jsxs(Badge, { variant: "success", className: "gap-1", children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-green-500" }), "Memory Active (", memoryInfo.memoryCount, " memories)"] }))] }), memoryInfo.lastContextSummary && (_jsxs("div", { className: "mt-3 rounded-lg border bg-muted/50 p-3", children: [_jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Memory Context:" }), _jsx("p", { className: "text-xs text-foreground/80 line-clamp-2", children: memoryInfo.lastContextSummary })] })), memoryErrorInfo.memoryError && (_jsx("div", { className: "mt-2 rounded-lg border border-yellow-200 bg-yellow-50 p-2", children: _jsxs("p", { className: "text-xs text-yellow-800", children: ["Memory ", memoryErrorInfo.memoryErrorOperation, " error (", memoryErrorInfo.memoryErrorType, "):", ' ', memoryErrorInfo.memoryError.message] }) }))] }), _jsx("div", { className: "flex-1", children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSendMessage, showHeader: true, sessionTitle: "Advanced Clarity Chat", sessionSubtitle: `Memory: ${memoryStrategy} | Transport: ${transport.toUpperCase()}` }) }), error && (_jsx(Card, { className: "border-t border-red-200 bg-red-50 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-800", children: "Error" }), _jsx("p", { className: "text-xs text-red-600", children: error.message })] }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => window.location.reload(), children: "Reload" })] }) }))] }));
}
//# sourceMappingURL=advanced-clarity-chat-example.js.map