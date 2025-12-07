import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * Generative UI Tools Example
 *
 * Demonstrates end-to-end generative UI with:
 * - Tool definitions (weather, FAQ search)
 * - Tool UI registry
 * - useClarityChat integration
 * - ClarityToolResult rendering
 */
import * as React from 'react';
import { useClarityChat, convertCoreMessagesToMessages } from '../hooks/use-clarity-chat';
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
        // Mock weather API
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
        // Mock FAQ search
        const { query, limit = 3 } = args;
        await new Promise((resolve) => setTimeout(resolve, 300));
        const faqs = [
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
        ];
        return {
            query,
            results: faqs.slice(0, limit),
            totalResults: faqs.length,
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
export function GenerativeUIToolsExample() {
    const { messages: coreMessages, append, isLoading, error, } = useClarityChat({
        api: '/api/chat',
        // In a real implementation, you would configure tools here
        // For this example, we'll simulate tool calls from messages
    });
    const messages = React.useMemo(() => convertCoreMessagesToMessages(coreMessages), [coreMessages]);
    const handleSendMessage = React.useCallback(async (content) => {
        await append({
            role: 'user',
            content,
        });
    }, [append]);
    // Extract tool calls and results from messages
    const messagesWithToolResults = React.useMemo(() => {
        return messages.map((msg, idx) => {
            // Check if this message has tool calls (simulated)
            // In a real implementation, tool calls would come from the API response
            if (msg.role === 'assistant' && msg.content.includes('[TOOL:')) {
                // Parse simulated tool call format: [TOOL:toolName:args:result]
                const toolMatch = msg.content.match(/\[TOOL:([^:]+):([^:]+):([^\]]+)\]/);
                if (toolMatch) {
                    const [, toolName, argsStr, resultStr] = toolMatch;
                    try {
                        const args = JSON.parse(argsStr);
                        const result = JSON.parse(resultStr);
                        return {
                            ...msg,
                            toolCall: {
                                name: toolName,
                                args,
                                id: `tool-${idx}`,
                            },
                            toolResult: result,
                        };
                    }
                    catch {
                        // Invalid format, return original message
                    }
                }
            }
            return msg;
        });
    }, [messages]);
    // Simulate tool execution for demo purposes
    const handleToolExecution = React.useCallback(async (toolName, args) => {
        let result;
        if (toolName === 'get_weather') {
            result = await weatherTool.execute(args);
        }
        else if (toolName === 'search_faq') {
            result = await faqSearchTool.execute(args);
        }
        else {
            result = { error: 'Unknown tool' };
        }
        // Append assistant message with tool result
        await append({
            role: 'assistant',
            content: `I've executed the ${toolName} tool.`,
        });
    }, [append]);
    return (_jsxs("div", { className: "flex h-screen flex-col bg-background", children: [_jsxs("div", { className: "border-b p-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Generative UI Tools Example" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Chat with tools that render rich UI components" })] }), _jsx("div", { className: "flex-1 min-h-0", children: _jsx("div", { className: "h-full overflow-y-auto p-4", children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-4", children: [messagesWithToolResults.map((msg, idx) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[80%] rounded-lg p-4 ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'}`, children: [_jsx("div", { className: "text-sm font-medium mb-1", children: msg.role }), _jsx("div", { className: "text-sm", children: msg.content }), 'toolCall' in msg && msg.toolCall && 'toolResult' in msg && msg.toolResult && (_jsx(ClarityToolResult, { registry: toolRegistry, toolCall: msg.toolCall, result: msg.toolResult, messages: messages }))] }) }, msg.id || idx))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-muted rounded-lg p-4", children: _jsx("div", { className: "text-sm text-muted-foreground", children: "Thinking..." }) }) }))] }) }) }), _jsx("div", { className: "border-t p-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Ask about weather or search FAQs...", className: "flex-1 px-4 py-2 border rounded-lg", onKeyDown: async (e) => {
                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                            await handleSendMessage(e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }, disabled: isLoading }), _jsx(Button, { onClick: async () => {
                                        const input = document.querySelector('input');
                                        if (input?.value.trim()) {
                                            await handleSendMessage(input.value);
                                            input.value = '';
                                        }
                                    }, disabled: isLoading, children: "Send" })] }), _jsxs("div", { className: "mt-2 flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleToolExecution('get_weather', { location: 'San Francisco', units: 'celsius' }), children: "Get Weather Demo" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleToolExecution('search_faq', { query: 'password', limit: 3 }), children: "Search FAQ Demo" })] })] }) }), error && (_jsx("div", { className: "border-t border-red-200 bg-red-50 p-4", children: _jsxs("p", { className: "text-sm text-red-800", children: [_jsx("strong", { children: "Error:" }), " ", error.message] }) }))] }));
}
//# sourceMappingURL=generative-ui-tools.js.map