import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * useClarityChat Showcase Example
 *
 * Comprehensive example demonstrating all features of useClarityChat:
 * - Basic chat functionality
 * - Memory integration with different strategies
 * - Transport selection (SSE/WebSocket)
 * - Error handling
 * - Memory context visualization
 */
import * as React from 'react';
import { useClarityChat } from '@clarity-chat/react';
import { ChatWindow } from '@clarity-chat/react';
import { MemoryProvider } from '@clarity-chat/react/memory';
import { convertCoreMessagesToMessages } from '@clarity-chat/react';
import { Button, Card, Badge, Select } from '@clarity-chat/primitives';
const memoryConfig = {
    maxTokens: 10000,
    compressionRatio: 0.5,
    enableAutoCleanup: true,
    enableAutoSummarization: false,
};
function ChatShowcase() {
    const [memoryStrategy, setMemoryStrategy] = React.useState('sliding-window');
    const [transport, setTransport] = React.useState('sse');
    const [memoryEnabled, setMemoryEnabled] = React.useState(false);
    const { messages: coreMessages, append, isLoading, error, memoryEnabled: hookMemoryEnabled, contextSummary, input, setInput, handleSubmit, } = useClarityChat({
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
        onError: (err) => {
            console.error('Chat error:', err);
        },
    });
    const messages = React.useMemo(() => convertCoreMessagesToMessages(coreMessages), [coreMessages]);
    const handleSendMessage = React.useCallback(async (content) => {
        await append({
            role: 'user',
            content,
        });
    }, [append]);
    return (_jsxs("div", { className: "flex h-screen flex-col bg-background", children: [_jsxs(Card, { className: "border-b p-4 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "enable-memory", checked: memoryEnabled, onChange: (e) => setMemoryEnabled(e.target.checked), className: "rounded" }), _jsx("label", { htmlFor: "enable-memory", className: "text-sm font-medium", children: "Enable Memory" })] }), memoryEnabled && (_jsx(_Fragment, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Strategy:" }), _jsxs(Select, { value: memoryStrategy, onValueChange: (value) => setMemoryStrategy(value), children: [_jsx("option", { value: "sliding-window", children: "Sliding Window" }), _jsx("option", { value: "semantic-chunks", children: "Semantic Chunks" }), _jsx("option", { value: "vector-store", children: "Vector Store" })] })] }) })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Transport:" }), _jsxs(Select, { value: transport, onValueChange: (value) => setTransport(value), children: [_jsx("option", { value: "sse", children: "SSE" }), _jsx("option", { value: "websocket", children: "WebSocket" })] })] }), hookMemoryEnabled && (_jsxs(Badge, { variant: "success", className: "gap-1", children: [_jsx("span", { className: "h-2 w-2 rounded-full bg-green-500 animate-pulse" }), "Memory Active"] }))] }), contextSummary && (_jsxs("div", { className: "mt-3 rounded-lg border bg-muted/50 p-3", children: [_jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Memory Context:" }), _jsx("p", { className: "text-xs text-foreground/80 line-clamp-2", children: contextSummary })] }))] }), _jsx("div", { className: "flex-1 min-h-0", children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSendMessage, showHeader: true, sessionTitle: "useClarityChat Showcase", sessionSubtitle: memoryEnabled
                        ? `Memory: ${memoryStrategy} | Transport: ${transport.toUpperCase()}`
                        : `Transport: ${transport.toUpperCase()}` }) }), error && (_jsx(Card, { className: "border-t border-red-200 bg-red-50 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-800", children: "Error" }), _jsx("p", { className: "text-xs text-red-600", children: error.message })] }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => window.location.reload(), children: "Reload" })] }) }))] }));
}
export default function App() {
    return (_jsx(MemoryProvider, { config: memoryConfig, children: _jsx(ChatShowcase, {}) }));
}
//# sourceMappingURL=App.js.map