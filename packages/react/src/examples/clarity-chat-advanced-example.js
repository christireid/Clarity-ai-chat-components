import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Advanced Clarity Chat Example
 *
 * Demonstrates advanced features of useClarityChat including:
 * - Custom message handlers
 * - Performance monitoring
 * - Analytics integration
 * - Error recovery
 * - Memory optimization
 *
 * @example
 * ```tsx
 * import { ClarityChatAdvancedExample } from '@clarity-chat/react/examples'
 *
 * function App() {
 *   return <ClarityChatAdvancedExample />
 * }
 * ```
 */
import * as React from 'react';
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages, createUserMessage, extractTextContent, isUserMessage, } from '@clarity-chat/react';
import { MemoryProvider } from '../memory/memory-provider';
import { Badge, Card, Button } from '@clarity-chat/primitives';
/**
 * Performance Metrics Component
 */
function PerformanceMetrics({ metrics, }) {
    return (_jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "text-sm font-semibold mb-2", children: "Performance Metrics" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Avg Response:" }), _jsxs("span", { className: "ml-1 font-medium", children: [metrics.averageResponseTime, "ms"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Sent:" }), _jsx("span", { className: "ml-1 font-medium", children: metrics.messagesSent })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Received:" }), _jsx("span", { className: "ml-1 font-medium", children: metrics.messagesReceived })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Memory Ops:" }), _jsx("span", { className: "ml-1 font-medium", children: metrics.memoryOperations })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("span", { className: "text-muted-foreground", children: "Errors:" }), _jsx("span", { className: `ml-1 font-medium ${metrics.errorCount > 0 ? 'text-destructive' : ''}`, children: metrics.errorCount })] })] })] }));
}
/**
 * Advanced Clarity Chat Example Component
 */
export function ClarityChatAdvancedExample() {
    const [metrics, setMetrics] = React.useState({
        averageResponseTime: 0,
        messagesSent: 0,
        messagesReceived: 0,
        memoryOperations: 0,
        errorCount: 0,
    });
    const [responseTimes, setResponseTimes] = React.useState([]);
    const requestStartTimeRef = React.useRef(null);
    const { messages: coreMessages, append, isLoading, memoryInfo, memoryErrorInfo, } = useClarityChat({
        api: '/api/chat',
        memory: {
            enabled: true,
            strategy: 'vector-store',
            retryOnError: true,
            maxRetryAttempts: 3,
            onMemoryError: (error, operation) => {
                // Track memory errors
                setMetrics((prev) => ({
                    ...prev,
                    errorCount: prev.errorCount + 1,
                }));
                // Track memory operations
                setMetrics((prev) => ({
                    ...prev,
                    memoryOperations: prev.memoryOperations + 1,
                }));
                logger.logger.error(`Memory ${operation} error:`, error);
            },
        },
        onFinish: async (message) => {
            // Track message received
            setMetrics((prev) => ({
                ...prev,
                messagesReceived: prev.messagesReceived + 1,
            }));
            // Calculate response time
            if (requestStartTimeRef.current) {
                const responseTime = Date.now() - requestStartTimeRef.current;
                setResponseTimes((prev) => [...prev, responseTime]);
                const avgResponseTime = Math.round([...responseTimes, responseTime].reduce((a, b) => a + b, 0) /
                    (responseTimes.length + 1));
                setMetrics((prev) => ({
                    ...prev,
                    averageResponseTime: avgResponseTime,
                }));
                requestStartTimeRef.current = null;
            }
            // Track memory storage
            if (memoryInfo.enabled) {
                setMetrics((prev) => ({
                    ...prev,
                    memoryOperations: prev.memoryOperations + 1,
                }));
            }
        },
    });
    // Convert CoreMessage[] to Message[] for ChatWindow
    const messages = React.useMemo(() => convertCoreMessagesToMessages(coreMessages), [coreMessages]);
    const handleSendMessage = React.useCallback(async (content) => {
        // Track message sent
        setMetrics((prev) => ({
            ...prev,
            messagesSent: prev.messagesSent + 1,
        }));
        // Record request start time
        requestStartTimeRef.current = Date.now();
        // Track memory query
        if (memoryInfo.enabled) {
            setMetrics((prev) => ({
                ...prev,
                memoryOperations: prev.memoryOperations + 1,
            }));
        }
        await append(createUserMessage(content));
    }, [append, memoryInfo.enabled]);
    // Calculate user vs assistant message counts
    const userMessageCount = React.useMemo(() => coreMessages.filter(isUserMessage).length, [coreMessages]);
    const assistantMessageCount = coreMessages.length - userMessageCount;
    return (_jsxs("div", { className: "flex h-screen w-full flex-col", children: [_jsxs("div", { className: "border-b bg-card px-4 py-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold", children: "Advanced Chat" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Performance monitoring, analytics, and error recovery" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [memoryInfo.enabled && (_jsxs(Badge, { variant: "secondary", children: ["Memory: ", memoryInfo.memoryCount] })), _jsxs(Badge, { variant: "outline", children: [userMessageCount, " user / ", assistantMessageCount, " assistant"] }), memoryErrorInfo.memoryError && (_jsx(Badge, { variant: "destructive", children: "Error" }))] })] }), _jsx(PerformanceMetrics, { metrics: metrics })] }), _jsx("div", { className: "flex-1 overflow-hidden", children: _jsx(ChatWindow, { messages: messages, onSendMessage: handleSendMessage, isLoading: isLoading, showHeader: false }) }), memoryErrorInfo.memoryError && (_jsx("div", { className: "border-t bg-destructive/10 px-4 py-2", children: _jsxs("p", { className: "text-sm text-destructive", children: ["Memory ", memoryErrorInfo.memoryErrorOperation, " error:", memoryErrorInfo.memoryError.message] }) }))] }));
}
/**
 * Wrapper with MemoryProvider
 */
export function ClarityChatAdvancedExampleWrapped() {
    return (_jsx(MemoryProvider, { config: {
            maxMemories: 1000,
            enableVectorSearch: true,
        }, children: _jsx(ClarityChatAdvancedExample, {}) }));
}
//# sourceMappingURL=clarity-chat-advanced-example.js.map