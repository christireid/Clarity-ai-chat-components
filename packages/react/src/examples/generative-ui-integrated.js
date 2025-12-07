import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * Integrated Generative UI Example
 *
 * Complete example showing useClarityChat + useAssistant + tool registry
 * working together for a full generative UI experience.
 */
import * as React from 'react';
import { useClarityChat, convertCoreMessagesToMessages } from '../hooks/use-clarity-chat';
import { useAssistant } from '../hooks/use-assistant';
import { ChatWindow } from '../components/chat-window';
import { ClarityToolResult } from '../components/clarity-tool-result';
import { createToolUIRegistry } from '../agents/tool-ui-registry';
import { Card, CardContent, CardHeader, Badge, Button } from '@clarity-chat/primitives';
// ============================================================================
// Tool Definitions
// ============================================================================
const weatherTool = {
    name: 'get_weather',
    description: 'Get current weather for a location',
    parameters: {
        type: 'object',
        properties: {
            location: {
                type: 'string',
                description: 'City name or location',
            },
            units: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description: 'Temperature units',
            },
        },
        required: ['location'],
    },
    async execute(args) {
        const { location, units = 'celsius' } = args;
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
            location,
            temperature: units === 'celsius' ? 22 : 72,
            condition: 'Sunny',
            humidity: 65,
            windSpeed: 10,
            units,
        };
    },
};
const faqSearchTool = {
    name: 'search_faq',
    description: 'Search FAQ database for answers',
    parameters: {
        type: 'object',
        properties: {
            query: {
                type: 'string',
                description: 'Search query',
            },
            limit: {
                type: 'number',
                description: 'Maximum results (default: 3)',
            },
        },
        required: ['query'],
    },
    async execute(args) {
        const { query, limit = 3 } = args;
        await new Promise((resolve) => setTimeout(resolve, 300));
        return {
            query,
            results: [
                {
                    question: 'How do I reset my password?',
                    answer: 'Go to Settings > Security > Reset Password',
                    category: 'Account',
                },
                {
                    question: 'What is your refund policy?',
                    answer: 'We offer 30-day money-back guarantee',
                    category: 'Billing',
                },
                {
                    question: 'How do I contact support?',
                    answer: 'Email support@example.com or use the chat',
                    category: 'Support',
                },
            ].slice(0, limit),
            totalResults: 3,
        };
    },
};
function WeatherResult({ data }) {
    return (_jsxs(Card, { className: "mt-2", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["Weather in ", data.location] }), _jsx(Badge, { variant: "info", children: data.condition })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-3xl font-bold", children: [data.temperature, "\u00B0", data.units === 'celsius' ? 'C' : 'F'] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Humidity:" }), ' ', data.humidity, "%"] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Wind:" }), ' ', data.windSpeed, " km/h"] })] })] }) })] }));
}
function FAQSearchResults({ data }) {
    return (_jsxs(Card, { className: "mt-2", children: [_jsxs(CardHeader, { children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["FAQ Results for \"", data.query, "\""] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Found ", data.totalResults, " results"] })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: data.results.map((faq, idx) => (_jsxs("div", { className: "border-l-2 border-primary pl-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Badge, { variant: "secondary", className: "text-xs", children: faq.category }), _jsx("h4", { className: "font-medium", children: faq.question })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: faq.answer })] }, idx))) }) })] }));
}
// ============================================================================
// Tool Registry
// ============================================================================
const toolRegistry = createToolUIRegistry({
    get_weather: WeatherResult,
    search_faq: FAQSearchResults,
});
// ============================================================================
// Main Component
// ============================================================================
export function GenerativeUIIntegratedExample() {
    const [useAssistantMode, setUseAssistantMode] = React.useState(false);
    // useClarityChat for standard chat
    const chatHook = useClarityChat({
        api: '/api/chat',
    });
    // useAssistant for tool calling
    const assistantHook = useAssistant({
        api: '/api/assistant',
        assistantId: 'generative-ui-assistant',
        tools: [weatherTool, faqSearchTool],
    });
    const activeHook = useAssistantMode ? assistantHook : chatHook;
    const messages = React.useMemo(() => {
        if (useAssistantMode) {
            // Convert assistant messages
            return convertCoreMessagesToMessages(assistantHook.messages);
        }
        else {
            return convertCoreMessagesToMessages(chatHook.messages);
        }
    }, [useAssistantMode, chatHook.messages, assistantHook.messages]);
    const handleSendMessage = React.useCallback(async (content) => {
        if (useAssistantMode) {
            await assistantHook.submitMessage(content);
        }
        else {
            await chatHook.append({
                role: 'user',
                content,
            });
        }
    }, [useAssistantMode, chatHook, assistantHook]);
    // Extract tool invocations from assistant hook
    const toolInvocations = useAssistantMode ? assistantHook.toolInvocations : [];
    return (_jsxs("div", { className: "flex h-screen flex-col bg-background", children: [_jsx("div", { className: "border-b p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Integrated Generative UI" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "useClarityChat + useAssistant + Tool Registry" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: useAssistantMode ? 'info' : 'secondary', children: useAssistantMode ? 'Assistant Mode' : 'Chat Mode' }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => setUseAssistantMode(!useAssistantMode), children: ["Switch to ", useAssistantMode ? 'Chat' : 'Assistant'] })] })] }) }), _jsx("div", { className: "flex-1 min-h-0", children: _jsx(ChatWindow, { messages: messages, isLoading: activeHook.isLoading, onSendMessage: handleSendMessage, showHeader: true, sessionTitle: "Generative UI", sessionSubtitle: useAssistantMode
                        ? 'Assistant with tool calling'
                        : 'Standard chat' }) }), useAssistantMode && toolInvocations.length > 0 && (_jsxs("div", { className: "border-t p-4 bg-muted/50", children: [_jsx("h3", { className: "text-sm font-semibold mb-2", children: "Tool Invocations" }), _jsx("div", { className: "space-y-2", children: toolInvocations.map((invocation, idx) => {
                            // Convert ToolInvocation to ToolCall format
                            const toolCall = {
                                name: invocation.toolName,
                                args: invocation.args || {},
                                id: invocation.toolCallId || `tool-${idx}`,
                            };
                            return (_jsxs("div", { className: "border rounded-lg p-3 bg-background", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "text-xs font-medium", children: ["Tool: ", invocation.toolName] }), _jsx(Badge, { variant: invocation.state === 'result' ? 'success' :
                                                    invocation.state === 'error' ? 'destructive' :
                                                        'info', children: invocation.state })] }), invocation.state === 'result' && invocation.result && (_jsx(ClarityToolResult, { registry: toolRegistry, toolCall: toolCall, result: invocation.result, messages: messages })), (invocation.state === 'call' || invocation.state === 'partial-call') && (_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Executing tool with args: ", JSON.stringify(invocation.args)] })), invocation.state === 'error' && (_jsxs("div", { className: "text-sm text-red-600", children: ["Error: ", invocation.error || 'Unknown error'] }))] }, invocation.toolCallId || idx));
                        }) })] })), activeHook.error && (_jsx("div", { className: "border-t border-red-200 bg-red-50 p-4", children: _jsxs("p", { className: "text-sm text-red-800", children: [_jsx("strong", { children: "Error:" }), " ", activeHook.error.message] }) }))] }));
}
//# sourceMappingURL=generative-ui-integrated.js.map