import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Quick Start Example
 *
 * Simplest possible example - zero configuration needed
 */
import * as React from 'react';
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages, } from '../../index';
import { useQuickOptimize } from '../hooks/use-quick-optimize';
export function QuickStartExample() {
    const chat = useClarityChat({
        api: '/api/chat',
    });
    // That's it! Zero configuration needed
    const { optimizedMessages, wasOptimized, tokenStats } = useQuickOptimize({
        messages: chat.messages,
        model: 'gpt-4', // Default preset: 'balanced'
    });
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsxs("div", { className: "border-b p-4 bg-white", children: [_jsx("h1", { className: "text-xl font-bold", children: "Quick Start Example" }), wasOptimized && tokenStats.saved > 0 && (_jsxs("div", { className: "mt-2 text-sm text-green-600", children: ["\u2705 Optimized: Saved ", tokenStats.saved, " tokens (", tokenStats.original, " \u2192 ", tokenStats.optimized, ")"] }))] }), _jsx("div", { className: "flex-1 overflow-auto p-4", children: _jsx(ChatWindow, { messages: convertCoreMessagesToMessages(optimizedMessages), onSendMessage: (message) => {
                        chat.append({
                            role: 'user',
                            content: message,
                        });
                    }, isLoading: chat.isLoading }) }), _jsx("div", { className: "border-t p-4 bg-white", children: _jsxs("form", { onSubmit: (e) => {
                        e.preventDefault();
                        const input = e.currentTarget.querySelector('input');
                        if (input?.value) {
                            chat.append({
                                role: 'user',
                                content: input.value,
                            });
                            input.value = '';
                        }
                    }, className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Type a message...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: chat.isLoading }), _jsx("button", { type: "submit", disabled: chat.isLoading, className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50", children: "Send" })] }) })] }));
}
/**
 * Example with preset selection
 */
export function QuickStartWithPresetExample() {
    const [preset, setPreset] = React.useState('balanced');
    const chat = useClarityChat({
        api: '/api/chat',
    });
    const { optimizedMessages, tokenStats } = useQuickOptimize({
        messages: chat.messages,
        model: 'gpt-4',
        preset,
    });
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsxs("div", { className: "border-b p-4 bg-white", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold", children: "Quick Start with Preset" }), _jsxs("select", { value: preset, onChange: (e) => setPreset(e.target.value), className: "px-3 py-1 border rounded", children: [_jsx("option", { value: "conservative", children: "Conservative" }), _jsx("option", { value: "balanced", children: "Balanced" }), _jsx("option", { value: "aggressive", children: "Aggressive" })] })] }), tokenStats.saved > 0 && (_jsxs("div", { className: "mt-2 text-sm", children: ["Tokens: ", tokenStats.optimized, " / ", tokenStats.original, " (saved ", tokenStats.saved, ")"] }))] }), _jsx("div", { className: "flex-1 overflow-auto p-4", children: _jsx(ChatWindow, { messages: convertCoreMessagesToMessages(optimizedMessages), onSendMessage: (message) => {
                        chat.append({
                            role: 'user',
                            content: message,
                        });
                    }, isLoading: chat.isLoading }) }), _jsx("div", { className: "border-t p-4 bg-white", children: _jsxs("form", { onSubmit: (e) => {
                        e.preventDefault();
                        const input = e.currentTarget.querySelector('input');
                        if (input?.value) {
                            chat.append({
                                role: 'user',
                                content: input.value,
                            });
                            input.value = '';
                        }
                    }, className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Type a message...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: chat.isLoading }), _jsx("button", { type: "submit", disabled: chat.isLoading, className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50", children: "Send" })] }) })] }));
}
//# sourceMappingURL=quick-start-example.js.map