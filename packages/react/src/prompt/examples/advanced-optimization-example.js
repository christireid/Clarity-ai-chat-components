import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Advanced Prompt Optimization Example
 *
 * Demonstrates the full optimization engine with visualization
 */
import * as React from 'react';
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages, } from '../../index';
import { usePromptOptimizer, useDynamicModelRouting, usePromptDebugger, } from '../hooks';
import { getModelProfile } from '../core/model-profiles';
export function AdvancedOptimizationExample() {
    const [showDebugger, setShowDebugger] = React.useState(false);
    const [targetTokens, setTargetTokens] = React.useState(4000);
    const [selectedModel, setSelectedModel] = React.useState(getModelProfile('gpt-4'));
    const chat = useClarityChat({
        api: '/api/chat',
    });
    // Advanced optimization
    const optimizer = usePromptOptimizer({
        messages: chat.messages,
        model: selectedModel,
        targetTokens,
        autoOptimize: true,
        options: {
            enableSemanticPrioritization: true,
            enableCompression: true,
        },
    });
    // Dynamic model routing
    const routing = useDynamicModelRouting({
        messages: chat.messages,
        currentModel: selectedModel,
        criteria: {
            tokenBudget: targetTokens,
            costBudget: 0.1, // $0.10 budget
            complexity: 0.5,
        },
        autoRoute: true,
    });
    // Debugger
    const promptDebugger = usePromptDebugger({
        messages: chat.messages,
        model: selectedModel,
        targetTokens,
        enabled: showDebugger,
    });
    // Trigger debug when enabled
    React.useEffect(() => {
        if (showDebugger && chat.messages.length > 0) {
            promptDebugger.debug();
        }
    }, [showDebugger, chat.messages.length]);
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "border-b bg-white p-4 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Advanced Optimization Demo" }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("button", { onClick: () => setShowDebugger(!showDebugger), className: `px-4 py-2 rounded-lg text-sm font-medium ${showDebugger
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700'}`, children: [showDebugger ? 'Hide' : 'Show', " Debugger"] }) })] }), _jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Target Tokens:" }), _jsx("input", { type: "number", value: targetTokens, onChange: (e) => setTargetTokens(Number(e.target.value)), className: "px-3 py-1 border rounded w-24", min: 1000, max: 100000 })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Model:" }), _jsxs("select", { value: selectedModel.model, onChange: (e) => {
                                                    const profile = getModelProfile(e.target.value);
                                                    if (profile)
                                                        setSelectedModel(profile);
                                                }, className: "px-3 py-1 border rounded", children: [_jsx("option", { value: "gpt-4", children: "GPT-4" }), _jsx("option", { value: "gpt-4-turbo", children: "GPT-4 Turbo" }), _jsx("option", { value: "gpt-4-mini", children: "GPT-4 Mini" }), _jsx("option", { value: "claude-3-opus", children: "Claude 3 Opus" }), _jsx("option", { value: "claude-3-sonnet", children: "Claude 3 Sonnet" }), _jsx("option", { value: "claude-3-haiku", children: "Claude 3 Haiku" })] })] }), optimizer.tokenStats && (_jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-600", children: "Tokens:" }), ' ', _jsx("span", { className: `font-mono font-bold ${optimizer.tokenStats.optimized > targetTokens
                                                            ? 'text-red-600'
                                                            : 'text-green-600'}`, children: optimizer.tokenStats.optimized }), optimizer.tokenStats.original !==
                                                        optimizer.tokenStats.optimized && (_jsxs(_Fragment, { children: [' ', _jsxs("span", { className: "text-gray-500", children: ["/ ", optimizer.tokenStats.original] }), ' ', _jsxs("span", { className: "text-green-600", children: ["(saved ", optimizer.tokenStats.saved, ")"] })] }))] }), optimizer.costEstimate && (_jsxs("div", { children: [_jsx("span", { className: "text-gray-600", children: "Est. Cost:" }), ' ', _jsxs("span", { className: "font-mono", children: ["$", optimizer.costEstimate.total.toFixed(4)] })] })), _jsxs("div", { children: [_jsx("span", { className: "text-gray-600", children: "Compression:" }), ' ', _jsxs("span", { className: "font-mono", children: [(optimizer.tokenStats.compressionRatio * 100).toFixed(1), "%"] })] })] })), routing.recommendedModel &&
                                        routing.recommendedModel.model !== selectedModel.model && (_jsxs("div", { className: "px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm", children: ["\uD83D\uDCA1 Consider switching to", ' ', _jsx("strong", { children: routing.recommendedModel.model })] }))] })] }), _jsx("div", { className: "flex-1 overflow-auto p-4", children: _jsx(ChatWindow, { messages: convertCoreMessagesToMessages(optimizer.optimizedMessages), onSendMessage: (message) => {
                                chat.append({
                                    role: 'user',
                                    content: message,
                                });
                            }, isLoading: chat.isLoading || optimizer.isOptimizing }) }), _jsx("div", { className: "border-t bg-white p-4", children: _jsxs("form", { onSubmit: (e) => {
                                e.preventDefault();
                                const input = e.currentTarget.querySelector('input');
                                if (input?.value) {
                                    chat.append({
                                        role: 'user',
                                        content: input.value,
                                    });
                                    input.value = '';
                                }
                            }, className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Type a message...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: chat.isLoading || optimizer.isOptimizing }), _jsx("button", { type: "submit", disabled: chat.isLoading || optimizer.isOptimizing, className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50", children: "Send" })] }) })] }), showDebugger && promptDebugger.debugInfo && (_jsxs("div", { className: "w-96 border-l bg-white p-4 overflow-auto", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Optimization Debugger" }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-medium mb-2", children: "Optimization History" }), _jsx("div", { className: "space-y-2", children: promptDebugger.debugInfo.history.map((entry, i) => (_jsxs("div", { className: "p-2 bg-gray-50 rounded text-xs border", children: [_jsx("div", { className: "font-medium", children: entry.stage }), _jsx("div", { className: "text-gray-600 mt-1", children: entry.action }), _jsxs("div", { className: "flex justify-between mt-1", children: [_jsxs("span", { children: [entry.tokensBefore, " \u2192 ", entry.tokensAfter, " tokens"] }), _jsxs("span", { className: "text-gray-500", children: [entry.details.duration, "ms"] })] })] }, i))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-medium mb-2", children: "Token Counts by Stage" }), _jsx("div", { className: "space-y-1", children: promptDebugger.debugInfo.tokenCounts.map((count, i) => (_jsxs("div", { className: "flex justify-between text-sm p-1 bg-gray-50 rounded", children: [_jsxs("span", { children: [count.stage, ":"] }), _jsx("span", { className: "font-mono", children: count.tokens })] }, i))) })] }), promptDebugger.debugInfo.compressionLogs.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-medium mb-2", children: "Compression Logs" }), _jsx("div", { className: "space-y-2", children: promptDebugger.debugInfo.compressionLogs.map((log, i) => (_jsxs("div", { className: "p-2 bg-blue-50 rounded text-xs", children: [_jsx("div", { className: "font-medium", children: log.strategy }), _jsxs("div", { className: "text-gray-600 mt-1", children: [log.inputMessages, " \u2192 ", log.outputMessages, " messages"] }), _jsxs("div", { className: "text-green-600 mt-1", children: ["Saved ", log.tokensSaved, " tokens"] })] }, i))) })] })), promptDebugger.debugInfo.routingDecisions &&
                        promptDebugger.debugInfo.routingDecisions.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-medium mb-2", children: "Routing Decisions" }), _jsx("div", { className: "space-y-2", children: promptDebugger.debugInfo.routingDecisions.map((decision, i) => (_jsxs("div", { className: "p-2 bg-purple-50 rounded text-xs", children: [_jsxs("div", { className: "font-medium", children: ["\u2192 ", decision.toModel] }), _jsx("div", { className: "text-gray-600 mt-1", children: decision.reason })] }, i))) })] }))] }))] }));
}
//# sourceMappingURL=advanced-optimization-example.js.map