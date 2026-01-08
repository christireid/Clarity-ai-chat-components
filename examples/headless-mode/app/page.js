'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Headless Mode Example
 *
 * This example demonstrates building a custom chat UI WITHOUT
 * any pre-built components - just React state and fetch calls.
 *
 * Key benefits:
 * - Full control over your UI/UX
 * - Use with any design system (Tailwind, MUI, Chakra, etc.)
 * - Zero library styling lock-in
 * - Smaller bundle - only import what you need
 *
 * This page uses hooks from the ./hooks directory that you can
 * copy directly into your own project.
 */
import React from 'react';
// Import copy-paste hooks from the hooks directory
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useTokenTracker, estimateTokens } from '../hooks/useTokenTracker';
import { useStreamingChat } from '../hooks/useStreamingChat';
export default function HeadlessModePage() {
    // Use our copy-paste hooks
    const { estimatedCost, trackTokens, total } = useTokenTracker('gpt-4-turbo');
    const { messages, sendMessage, isLoading, error } = useStreamingChat({
        api: '/api/chat',
        onFinish: (content) => {
            // Track output tokens when response completes
            const outputTokens = estimateTokens(content);
            trackTokens(outputTokens, 'output');
        },
    });
    const { scrollRef, scrollToBottom, isNearBottom, handleScroll } = useAutoScroll(messages.length);
    const handleSend = async (input) => {
        // Track input tokens
        const inputTokens = estimateTokens(input);
        trackTokens(inputTokens, 'input');
        // Send the message
        await sendMessage(input);
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx("header", { className: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-4", children: _jsxs("div", { className: "max-w-4xl mx-auto flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Headless Mode" }), _jsx("p", { className: "text-violet-200 text-sm", children: "Pure React + fetch = unlimited flexibility" })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsxs("div", { className: "bg-white/20 rounded-lg px-3 py-1", children: ["Tokens: ", total.toLocaleString()] }), _jsxs("div", { className: "bg-white/20 rounded-lg px-3 py-1", children: ["Cost: $", estimatedCost.toFixed(4)] })] })] }) }), _jsx("div", { className: "bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-800 px-6 py-3", children: _jsxs("div", { className: "max-w-4xl mx-auto text-sm text-violet-800 dark:text-violet-200", children: [_jsx("strong", { children: "This UI is 100% custom." }), " No Clarity Chat components - just React state, fetch, and SSE parsing. Your design system, your rules."] }) }), _jsx("main", { ref: scrollRef, onScroll: handleScroll, className: "flex-1 overflow-y-auto", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8 space-y-6", children: [messages.length === 0 && (_jsxs("div", { className: "text-center py-16", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900 mb-4", children: _jsx("svg", { className: "w-8 h-8 text-violet-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: "Headless Mode Demo" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 max-w-md mx-auto", children: "This chat is built with pure React - no Clarity Chat UI components. Try sending a message!" })] })), messages.map((message) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[75%] rounded-2xl px-5 py-3 ${message.role === 'user'
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'}`, children: [message.role === 'assistant' &&
                                        !message.content &&
                                        isLoading && (_jsxs("div", { className: "flex gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-violet-400 rounded-full animate-bounce" }), _jsx("span", { className: "w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.1s]" }), _jsx("span", { className: "w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" })] })), _jsx("div", { className: "whitespace-pre-wrap", children: message.content })] }) }, message.id))), error && (_jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300", children: ["Error: ", error.message] }))] }) }), !isNearBottom && messages.length > 0 && (_jsx("button", { onClick: scrollToBottom, className: "fixed bottom-24 right-8 bg-violet-600 text-white p-3 rounded-full shadow-lg hover:bg-violet-700 transition-colors", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) }) })), _jsx(ChatInput, { onSend: handleSend, isLoading: isLoading })] }));
}
/**
 * Custom chat input component - demonstrates your own UI design
 */
function ChatInput({ onSend, isLoading, }) {
    const [input, setInput] = React.useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading)
            return;
        onSend(input.trim());
        setInput('');
    };
    return (_jsx("footer", { className: "border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("form", { onSubmit: handleSubmit, className: "flex gap-3", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type a message... (this is your custom input)", className: "flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent", disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2", children: isLoading ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "w-4 h-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] }), "Sending"] })) : ('Send') })] }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2 text-center", children: "This input, the message bubbles, the header - all custom. Zero library components." })] }) }));
}
//# sourceMappingURL=page.js.map