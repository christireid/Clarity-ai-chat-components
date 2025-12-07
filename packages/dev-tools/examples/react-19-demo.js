/**
 * React 19 Demo Example
 * Comprehensive example showing all React 19 enhanced dev tools
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { DevToolsDashboard, useAPIInspector, useProfiler, useEnvValidation, useTimeTravel, } from '../src/react';
/**
 * Example application demonstrating React 19 dev tools
 */
export function React19DevToolsDemo() {
    const { startCall, completeCall, setEnabled, logs, stats } = useAPIInspector();
    const { profile, summary } = useProfiler();
    const { validate, isValid, errors } = useEnvValidation();
    const { record, snapshots } = useTimeTravel();
    const [messages, setMessages] = React.useState([]);
    React.useEffect(() => {
        // Enable tools
        setEnabled(true);
    }, [setEnabled]);
    const handleSendMessage = React.useCallback(async () => {
        const userMessage = { role: 'user', content: 'Hello, AI!' };
        const newMessages = [...messages, userMessage];
        // Record state snapshot
        record(newMessages, { model: 'gpt-4-turbo' }, {}, 'Before API Call');
        // Start API call tracking
        const callId = startCall({
            provider: 'openai',
            model: 'gpt-4-turbo',
            endpoint: 'https://api.openai.com/v1/chat/completions',
            method: 'POST',
            headers: {},
            body: { messages: newMessages },
        });
        // Profile the API call
        const { result, metrics } = await profile('api-call', async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                choices: [{
                        message: { role: 'assistant', content: 'Hello! How can I help you?' },
                    }],
                usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
            };
        });
        // Complete API call
        completeCall(callId, {
            status: 200,
            statusText: 'OK',
            headers: {},
            body: result,
        });
        // Update messages
        const updatedMessages = [
            ...newMessages,
            { role: 'assistant', content: result.choices[0].message.content },
        ];
        setMessages(updatedMessages);
        // Record state snapshot
        record(updatedMessages, { model: 'gpt-4-turbo' }, {}, 'After API Call');
    }, [messages, startCall, completeCall, profile, record]);
    const handleValidateEnv = React.useCallback(async () => {
        await validate();
    }, [validate]);
    return (_jsxs("div", { className: "react-19-demo", children: [_jsxs("div", { className: "demo-header", children: [_jsx("h1", { children: "React 19 Dev Tools Demo" }), _jsx("p", { children: "Demonstrating React 19 features: useOptimistic, client-side form state, and more" })] }), _jsxs("div", { className: "demo-content", children: [_jsxs("div", { className: "demo-section", children: [_jsx("h2", { children: "Chat Interface" }), _jsx("div", { className: "chat-messages", children: messages.map((msg, i) => (_jsxs("div", { className: `message ${msg.role}`, children: [_jsxs("strong", { children: [msg.role, ":"] }), " ", msg.content] }, i))) }), _jsx("button", { onClick: handleSendMessage, children: "Send Message" })] }), _jsxs("div", { className: "demo-section", children: [_jsx("h2", { children: "Quick Stats" }), _jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "API Calls" }), _jsx("p", { children: stats.totalCalls })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "Completed" }), _jsx("p", { children: stats.completedCalls })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "Avg Response" }), _jsxs("p", { children: [stats.averageResponseTime.toFixed(2), "ms"] })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "Operations" }), _jsx("p", { children: summary.totalOperations })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "Snapshots" }), _jsx("p", { children: snapshots.length })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "Env Valid" }), _jsx("p", { children: isValid ? '✅' : '❌' })] })] })] }), _jsxs("div", { className: "demo-section", children: [_jsx("h2", { children: "Environment Validation" }), _jsx("button", { onClick: handleValidateEnv, children: "Validate Environment" }), errors.length > 0 && (_jsxs("div", { className: "errors", children: [_jsx("h4", { children: "Errors:" }), _jsx("ul", { children: errors.map((error, i) => (_jsxs("li", { children: [error.field, ": ", error.message] }, i))) })] }))] }), _jsxs("div", { className: "demo-section", children: [_jsx("h2", { children: "Full Dashboard" }), _jsx(DevToolsDashboard, { defaultTab: "inspector" })] })] })] }));
}
//# sourceMappingURL=react-19-demo.js.map