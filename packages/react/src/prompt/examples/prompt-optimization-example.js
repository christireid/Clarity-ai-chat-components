import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Prompt Optimization Example
 *
 * Demonstrates prompt optimization with token stats display
 */
import * as React from 'react';
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages, } from '../../index';
import { usePromptInspector } from '../hooks/hooks/use-prompt-inspector';
export function PromptOptimizationExample() {
    const [showInspector, setShowInspector] = React.useState(false);
    const chat = useClarityChat({
        api: '/api/chat',
        promptOptimization: {
            enabled: true,
            targetTokens: 4000,
            strategy: 'sliding-window',
            model: {
                model: 'gpt-4',
                maxTokens: 8000,
                inputPricePer1K: 0.03,
                outputPricePer1K: 0.06,
                tokenizer: 'openai',
            },
        },
    });
    const inspector = usePromptInspector({
        messages: chat.messages,
        model: {
            model: 'gpt-4',
            maxTokens: 8000,
            tokenizer: 'openai',
        },
        enabled: showInspector,
    });
    return (_jsxs("div", { className: "flex h-screen", children: [_jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "border-b p-4 bg-gray-50", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold", children: "Chat with Optimization" }), _jsxs("div", { className: "flex items-center gap-4", children: [chat.tokenStats && (_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium", children: "Tokens:" }), ' ', _jsx("span", { className: chat.tokenStats.wasOptimized
                                                            ? 'text-orange-600'
                                                            : 'text-green-600', children: chat.tokenStats.optimized }), chat.tokenStats.wasOptimized && (_jsxs(_Fragment, { children: [' ', _jsxs("span", { className: "text-gray-500", children: ["/ ", chat.tokenStats.original] }), ' ', _jsxs("span", { className: "text-green-600", children: ["(saved ", chat.tokenStats.saved, ")"] })] }))] })), _jsxs("button", { onClick: () => setShowInspector(!showInspector), className: "px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600", children: [showInspector ? 'Hide' : 'Show', " Inspector"] })] })] }), chat.tokenStats?.lastOptimizationReason && (_jsxs("div", { className: "mt-2 text-xs text-gray-600", children: ["Last optimization: ", chat.tokenStats.lastOptimizationReason] }))] }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsx(ChatWindow, { messages: convertCoreMessagesToMessages(chat.messages), onSendMessage: (message) => {
                                chat.append({
                                    role: 'user',
                                    content: message,
                                });
                            }, isLoading: chat.isLoading }) }), _jsx("div", { className: "border-t p-4", children: _jsxs("form", { onSubmit: (e) => {
                                e.preventDefault();
                                const input = e.currentTarget.querySelector('input');
                                if (input?.value) {
                                    chat.append({
                                        role: 'user',
                                        content: input.value,
                                    });
                                    input.value = '';
                                }
                            }, className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Type a message...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: chat.isLoading }), _jsx("button", { type: "submit", disabled: chat.isLoading, className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50", children: "Send" })] }) })] }), showInspector && (_jsxs("div", { className: "w-80 border-l bg-gray-50 p-4 overflow-auto", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Prompt Inspector" }), _jsxs("div", { className: "mb-6 p-3 bg-white rounded border", children: [_jsx("h3", { className: "font-medium mb-2", children: "Token Summary" }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Total:" }), _jsx("span", { className: "font-mono", children: inspector.totalTokens })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Budget:" }), _jsxs("span", { className: "font-mono", children: [inspector.budgetPercentage.toFixed(1), "%"] })] }), inspector.isOverBudget && (_jsx("div", { className: "text-red-600 font-medium", children: "\u26A0\uFE0F Over budget!" })), inspector.estimatedCost && (_jsxs("div", { className: "flex justify-between pt-2 border-t", children: [_jsx("span", { children: "Est. Cost:" }), _jsxs("span", { className: "font-mono", children: ["$", inspector.estimatedCost.toFixed(4)] })] }))] })] }), _jsxs("div", { className: "mb-6 p-3 bg-white rounded border", children: [_jsx("h3", { className: "font-medium mb-2", children: "Breakdown by Role" }), _jsx("div", { className: "space-y-1 text-sm", children: Object.entries(inspector.breakdown).map(([role, tokens]) => (_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { className: "capitalize", children: [role, ":"] }), _jsx("span", { className: "font-mono", children: tokens })] }, role))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-medium mb-2", children: "Messages" }), _jsx("div", { className: "space-y-2", children: inspector.messageInspections.map((inspection, i) => (_jsxs("div", { className: "p-2 bg-white rounded border text-xs", children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsx("span", { className: "font-medium capitalize", children: inspection.role }), _jsxs("span", { className: "font-mono text-gray-600", children: [inspection.tokens, " tokens"] })] }), _jsx("div", { className: "text-gray-600 truncate", children: inspection.contentPreview })] }, i))) })] }), chat.tokenStats && (_jsxs("div", { className: "p-3 bg-white rounded border", children: [_jsx("h3", { className: "font-medium mb-2", children: "Optimization" }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Was Optimized:" }), _jsx("span", { children: chat.tokenStats.wasOptimized ? '✅ Yes' : '❌ No' })] }), chat.tokenStats.wasOptimized && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Compression:" }), _jsxs("span", { className: "font-mono", children: [(chat.tokenStats.compressionRatio * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Saved:" }), _jsxs("span", { className: "font-mono text-green-600", children: [chat.tokenStats.saved, " tokens"] })] })] }))] })] }))] }))] }));
}
//# sourceMappingURL=prompt-optimization-example.js.map