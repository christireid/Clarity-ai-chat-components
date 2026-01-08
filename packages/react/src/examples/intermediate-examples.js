import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Intermediate Examples - Real-World Usage Patterns
 *
 * These examples show slightly customized usage with basic real-world
 * features. Each example is 30-50 lines of code.
 */
import * as React from 'react';
import { ClarityChat, useChat, ChatWindow, ChatWithMemory, useAnalytics, AnalyticsProvider, } from '../index';
/**
 * Example 1: Custom Chat with Header (35 lines)
 *
 * Chat with custom header, session info, and message actions.
 *
 * LOC: 35
 */
export function Intermediate_CustomChat() {
    const { messages, sendMessage, isLoading, clearMessages } = useChat({
        api: '/api/chat',
    });
    return (_jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: sendMessage, showHeader: true, sessionTitle: "Customer Support", sessionSubtitle: "We're here to help", showMessageCount: true, onClear: clearMessages, onMessageCopy: (id, content) => {
            navigator.clipboard.writeText(content);
            logger.debug('Message copied:', id);
        }, onMessageFeedback: (id, type) => {
            logger.debug('Feedback:', { id, type });
        } }));
}
/**
 * Example 2: Chat with Analytics (40 lines)
 *
 * Chat with analytics tracking integrated.
 *
 * LOC: 40
 */
export function Intermediate_ChatWithAnalytics() {
    return (_jsx(AnalyticsProvider, { config: { endpoint: '/api/analytics' }, children: _jsx(ClarityChat, { api: "/api/chat", showHeader: true, sessionTitle: "Analytics Chat", onMessageFeedback: (id, type) => {
                // Analytics tracked automatically via provider
                logger.debug('Feedback tracked:', { id, type });
            } }) }));
}
/**
 * Example 3: Chat with Memory and Customization (45 lines)
 *
 * Chat with memory enabled and custom styling.
 *
 * LOC: 45
 */
export function Intermediate_ChatWithMemoryCustom() {
    return (_jsxs("div", { className: "h-screen flex flex-col", children: [_jsxs("div", { className: "border-b p-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "AI Assistant" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Powered by Clarity Chat with Memory" })] }), _jsx("div", { className: "flex-1", children: _jsx(ChatWithMemory, { api: "/api/chat", strategy: "vector-store", showHeader: false, className: "h-full" }) })] }));
}
/**
 * Example 4: Chat with Error Handling (50 lines)
 *
 * Chat with custom error handling and retry logic.
 *
 * LOC: 50
 */
export function Intermediate_ChatWithErrorHandling() {
    const { messages, sendMessage, isLoading, error, chat } = useChat({
        api: '/api/chat',
    });
    React.useEffect(() => {
        if (error) {
            logger.logger.error('Chat error:', error);
            // Could integrate with error tracking service
        }
    }, [error]);
    return (_jsxs("div", { className: "h-screen flex flex-col", children: [error && (_jsxs("div", { className: "bg-red-50 border border-red-200 p-4", children: [_jsxs("p", { className: "text-red-800", children: ["Error: ", error.message] }), _jsx("button", { onClick: () => chat.setMessages([]), className: "mt-2 text-sm text-red-600 underline", children: "Clear and retry" })] })), _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: sendMessage, onMessageRetry: (id) => {
                    // Custom retry logic
                    logger.debug('Retrying message:', id);
                } })] }));
}
//# sourceMappingURL=intermediate-examples.js.map