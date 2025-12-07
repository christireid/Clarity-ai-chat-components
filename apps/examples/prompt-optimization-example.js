import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Prompt Optimization Example
 *
 * Demonstrates how to use the prompt & token optimization layer
 * with useClarityChat and standalone hooks.
 */
import * as React from 'react';
import { useClarityChat } from '@clarity-chat/react';
import { usePromptInspector, useTokenBudget, usePromptRecipe, createPromptRecipe, } from '@clarity-chat/react/prompt';
/**
 * Example 1: Basic useClarityChat with prompt optimization
 */
export function BasicOptimizedChat() {
    const chat = useClarityChat({
        api: '/api/chat',
        promptOptimization: {
            enabled: true,
            targetTokens: 4000,
            strategy: 'hybrid',
            model: 'gpt-4',
        },
    });
    return (_jsxs("div", { className: "chat-container", children: [_jsx("div", { className: "messages", children: chat.messages.map((msg) => (_jsx("div", { className: `message message-${msg.role}`, children: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) }, msg.id))) }), chat.tokenStats && (_jsxs("div", { className: "token-stats", children: [_jsxs("div", { children: ["Tokens: ", chat.tokenStats.inputTokens, " /", ' ', chat.tokenStats.remainingBudget + chat.tokenStats.inputTokens] }), _jsxs("div", { children: ["Utilization: ", (chat.tokenStats.utilization * 100).toFixed(1), "%"] }), chat.tokenStats.wasOptimized && (_jsxs("div", { className: "optimization-info", children: ["Optimized: ", chat.tokenStats.lastOptimizationReason] }))] })), _jsxs("form", { onSubmit: (e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('input');
                    chat.append({ role: 'user', content: input.value });
                    input.value = '';
                }, children: [_jsx("input", { name: "input", placeholder: "Type a message..." }), _jsx("button", { type: "submit", disabled: chat.isLoading, children: "Send" })] })] }));
}
/**
 * Example 2: Using prompt recipes with toon DSL
 */
export function RecipeBasedChat() {
    const [userName, setUserName] = React.useState('');
    const [userInput, setUserInput] = React.useState('');
    // Create a custom recipe
    const recipe = React.useMemo(() => createPromptRecipe('greeting-chatbot', 'Greeting Chatbot', {
        systemPrompt: (b) => b.text('You are a friendly assistant.')
            .conditional('userName', (b) => b.text(' You are talking to {{userName}}.').build())
            .build(),
        userMessage: (b) => b.variable('userInput', { required: true }).build(),
    }), []);
    const { buildPrompt, estimateTokens } = usePromptRecipe({
        recipe,
        variables: { userName, userInput },
    });
    const messages = React.useMemo(() => buildPrompt(), [buildPrompt]);
    const tokens = React.useMemo(() => estimateTokens(), [estimateTokens]);
    return (_jsxs("div", { children: [_jsx("div", { children: _jsxs("label", { children: ["Your name:", _jsx("input", { value: userName, onChange: (e) => setUserName(e.target.value) })] }) }), _jsx("div", { children: _jsxs("label", { children: ["Message:", _jsx("input", { value: userInput, onChange: (e) => setUserInput(e.target.value) })] }) }), _jsxs("div", { children: [_jsx("strong", { children: "Estimated tokens:" }), " ", tokens] }), _jsxs("div", { children: [_jsx("strong", { children: "Messages:" }), _jsx("pre", { children: JSON.stringify(messages, null, 2) })] })] }));
}
/**
 * Example 3: Token budget management
 */
export function TokenBudgetExample() {
    const [messages, setMessages] = React.useState([
        { id: '1', role: 'user', content: 'Hello' },
        { id: '2', role: 'assistant', content: 'Hi there!' },
        { id: '3', role: 'user', content: 'How are you?' },
    ]);
    const budget = useTokenBudget({
        messages,
        modelMetadata: 'gpt-4',
        targetBudget: 100, // Small budget for demo
    });
    const handleOptimize = React.useCallback(async () => {
        const result = await budget.optimize('hybrid');
        setMessages(result.optimizedMessages);
        console.log('Optimization diagnostics:', result.diagnostics);
    }, [budget]);
    return (_jsxs("div", { children: [_jsxs("div", { children: [_jsx("strong", { children: "Current tokens:" }), " ", budget.currentTokens] }), _jsxs("div", { children: [_jsx("strong", { children: "Remaining budget:" }), " ", budget.remainingBudget] }), _jsxs("div", { children: [_jsx("strong", { children: "Utilization:" }), " ", (budget.utilization * 100).toFixed(1), "%"] }), budget.isExceeded && (_jsx("div", { className: "warning", children: "Budget exceeded! Consider optimizing." })), budget.estimatedCost && (_jsxs("div", { children: [_jsx("strong", { children: "Estimated cost:" }), " $", budget.estimatedCost.totalCost.toFixed(4)] })), _jsx("button", { onClick: handleOptimize, disabled: !budget.isExceeded, children: "Optimize Messages" })] }));
}
/**
 * Example 4: Prompt inspector (dev tool)
 */
export function PromptInspectorExample() {
    const chat = useClarityChat({ api: '/api/chat' });
    const inspector = usePromptInspector({
        messages: chat.messages,
        modelMetadata: 'gpt-4',
        detailed: true,
    });
    return (_jsxs("div", { className: "inspector-panel", children: [_jsx("h3", { children: "Prompt Inspector" }), _jsx("div", { className: "summary", children: inspector.formattedView.summary }), _jsx("div", { className: "details", children: inspector.formattedView.details.map((detail, i) => (_jsx("div", { children: detail }, i))) }), _jsxs("div", { className: "breakdown", children: [_jsx("h4", { children: "Breakdown by Role" }), Object.entries(inspector.byRole).map(([role, stats]) => (_jsxs("div", { children: [role, ": ", stats.tokens, " tokens (", stats.count, " messages, ", stats.percentage.toFixed(1), "%)"] }, role)))] })] }));
}
/**
 * Example 5: Complete chat with optimization and inspector
 */
export function CompleteOptimizedChat() {
    const chat = useClarityChat({
        api: '/api/chat',
        promptOptimization: {
            enabled: true,
            targetTokens: 4000,
            strategy: 'hybrid',
            model: 'gpt-4',
            keepRecent: 3,
        },
    });
    const inspector = usePromptInspector({
        messages: chat.messages,
        modelMetadata: 'gpt-4',
        detailed: false,
    });
    return (_jsxs("div", { className: "complete-chat", children: [_jsxs("div", { className: "chat-main", children: [_jsx("div", { className: "messages", children: chat.messages.map((msg) => (_jsx("div", { className: `message message-${msg.role}`, children: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) }, msg.id))) }), _jsxs("form", { onSubmit: (e) => {
                            e.preventDefault();
                            const input = e.currentTarget.elements.namedItem('input');
                            chat.append({ role: 'user', content: input.value });
                            input.value = '';
                        }, children: [_jsx("input", { name: "input", placeholder: "Type a message..." }), _jsx("button", { type: "submit", disabled: chat.isLoading, children: "Send" })] })] }), _jsxs("div", { className: "sidebar", children: [chat.tokenStats && (_jsxs("div", { className: "token-stats-panel", children: [_jsx("h3", { children: "Token Stats" }), _jsxs("div", { children: ["Input: ", chat.tokenStats.inputTokens, " tokens"] }), _jsxs("div", { children: ["Remaining: ", chat.tokenStats.remainingBudget, " tokens"] }), _jsxs("div", { children: ["Utilization: ", (chat.tokenStats.utilization * 100).toFixed(1), "%"] }), chat.tokenStats.wasOptimized && (_jsxs("div", { className: "optimization-note", children: ["\u2713 Optimized: ", chat.tokenStats.lastOptimizationReason] }))] })), _jsxs("div", { className: "inspector-panel", children: [_jsx("h3", { children: "Inspector" }), _jsx("div", { children: inspector.formattedView.summary }), _jsx("div", { className: "role-breakdown", children: Object.entries(inspector.byRole).map(([role, stats]) => (_jsxs("div", { className: "role-stat", children: [_jsx("span", { className: "role-name", children: role }), _jsxs("span", { className: "role-tokens", children: [stats.tokens, " tokens"] }), _jsxs("span", { className: "role-percentage", children: [stats.percentage.toFixed(1), "%"] })] }, role))) })] })] })] }));
}
//# sourceMappingURL=prompt-optimization-example.js.map