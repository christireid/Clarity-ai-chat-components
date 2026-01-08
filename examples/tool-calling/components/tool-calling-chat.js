'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Tool Calling Chat Component
 *
 * Demonstrates AI function/tool calling with:
 * - Visual tool cards
 * - Execution status indicators
 * - Tool result rendering
 * - Weather, search, calculator, stock tools
 */
import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { TOOL_INFO } from '@/lib/tools';
// ============================================================================
// Tool Card Component
// ============================================================================
function ToolCard({ toolCall }) {
    const info = TOOL_INFO[toolCall.name] || {
        icon: '🔧',
        color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        description: 'Tool',
    };
    return (_jsxs("div", { className: `
        tool-result border rounded-xl p-4 my-2
        ${info.color}
        ${toolCall.status === 'executing' ? 'tool-executing' : ''}
      `, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-lg", children: info.icon }), _jsx("span", { className: "font-medium", children: info.description })] }), _jsx("span", { className: `
            text-xs px-2 py-0.5 rounded-full
            ${toolCall.status === 'executing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : toolCall.status === 'complete'
                                ? 'bg-green-100 text-green-700'
                                : toolCall.status === 'error'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'}
          `, children: toolCall.status })] }), _jsx("div", { className: "text-xs text-muted-foreground mb-2 font-mono bg-black/5 rounded p-2", children: Object.entries(toolCall.args).map(([key, value]) => (_jsxs("div", { children: [_jsxs("span", { className: "opacity-60", children: [key, ":"] }), " ", String(value)] }, key))) }), toolCall.result && (_jsx("div", { className: "mt-3 pt-3 border-t border-current/10", children: _jsx(ToolResult, { name: toolCall.name, result: toolCall.result }) }))] }));
}
// ============================================================================
// Tool Result Renderers
// ============================================================================
function ToolResult({ name, result }) {
    const data = result;
    switch (name) {
        case 'get_weather':
            return _jsx(WeatherResult, { data: data });
        case 'search_web':
            return _jsx(SearchResult, { data: data });
        case 'calculate':
            return _jsx(CalculatorResult, { data: data });
        case 'get_stock_price':
            return _jsx(StockResult, { data: data });
        default:
            return (_jsx("pre", { className: "text-xs overflow-auto", children: JSON.stringify(result, null, 2) }));
    }
}
function WeatherResult({ data }) {
    return (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "text-4xl", children: data.condition === 'Sunny'
                    ? '☀️'
                    : data.condition === 'Rainy'
                        ? '🌧️'
                        : data.condition === 'Snowy'
                            ? '❄️'
                            : '⛅' }), _jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-bold", children: [String(data.temperature), "\u00B0", String(data.unit)] }), _jsx("div", { className: "text-sm opacity-80", children: String(data.condition) }), _jsxs("div", { className: "text-xs opacity-60", children: [String(data.location), " \u2022 Humidity: ", String(data.humidity)] })] })] }));
}
function SearchResult({ data }) {
    const results = (data.results || []);
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-xs opacity-60", children: [data.totalResults?.toLocaleString(), " results for \"", String(data.query), "\""] }), results.slice(0, 3).map((r, i) => (_jsxs("div", { className: "p-2 bg-black/5 rounded", children: [_jsx("div", { className: "font-medium text-sm", children: r.title }), _jsx("div", { className: "text-xs opacity-60 truncate", children: r.url }), _jsx("div", { className: "text-xs mt-1", children: r.snippet })] }, i)))] }));
}
function CalculatorResult({ data }) {
    return (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm opacity-60 font-mono", children: String(data.expression) }), _jsxs("div", { className: "text-3xl font-bold mt-1", children: ["= ", String(data.result)] })] }));
}
function StockResult({ data }) {
    const isPositive = parseFloat(String(data.change)) >= 0;
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "text-lg font-bold", children: String(data.symbol) }), _jsxs("span", { className: "text-2xl font-bold", children: ["$", String(data.price)] })] }), _jsxs("div", { className: `text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`, children: [isPositive ? '+' : '', String(data.change), " (", String(data.changePercent), "%)"] }), _jsxs("div", { className: "text-xs opacity-60 mt-1", children: ["Vol: ", String(data.volume), " \u2022 MCap: ", String(data.marketCap)] })] }));
}
// ============================================================================
// Main Component
// ============================================================================
export function ToolCallingChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    // Send message
    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || isLoading)
            return;
        setError(null);
        // Add user message
        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        // Create assistant placeholder
        const assistantId = `assistant-${Date.now()}`;
        const assistantMessage = {
            id: assistantId,
            role: 'assistant',
            content: '',
            toolCalls: [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });
            if (!response.ok)
                throw new Error('Failed to send message');
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader)
                throw new Error('No response body');
            let fullContent = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                const chunk = decoder.decode(value);
                const lines = chunk
                    .split('\n')
                    .filter((line) => line.startsWith('data:'));
                for (const line of lines) {
                    const data = line.slice(5).trim();
                    if (data === '[DONE]')
                        continue;
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.type === 'text-delta') {
                            fullContent += parsed.content;
                            setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: fullContent } : m));
                        }
                        else if (parsed.type === 'tool_calls') {
                            // Initialize tool calls
                            const toolCalls = parsed.tool_calls.map((tc) => ({
                                id: tc.id,
                                name: tc.function.name,
                                args: JSON.parse(tc.function.arguments || '{}'),
                                status: 'pending',
                            }));
                            setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, toolCalls } : m));
                        }
                        else if (parsed.type === 'tool_execution_start') {
                            // Mark tool as executing
                            setMessages((prev) => prev.map((m) => {
                                if (m.id === assistantId && m.toolCalls) {
                                    return {
                                        ...m,
                                        toolCalls: m.toolCalls.map((tc) => tc.id === parsed.tool_call_id
                                            ? { ...tc, status: 'executing' }
                                            : tc),
                                    };
                                }
                                return m;
                            }));
                        }
                        else if (parsed.type === 'tool_execution_result') {
                            // Update tool with result
                            setMessages((prev) => prev.map((m) => {
                                if (m.id === assistantId && m.toolCalls) {
                                    return {
                                        ...m,
                                        toolCalls: m.toolCalls.map((tc) => tc.id === parsed.tool_call_id
                                            ? {
                                                ...tc,
                                                status: parsed.result.success
                                                    ? 'complete'
                                                    : 'error',
                                                result: parsed.result.data,
                                            }
                                            : tc),
                                    };
                                }
                                return m;
                            }));
                        }
                        else if (parsed.type === 'error') {
                            throw new Error(parsed.message);
                        }
                    }
                    catch {
                        // Skip invalid JSON
                    }
                }
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
            setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        }
        finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    }, [messages, isLoading]);
    // Form handlers
    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };
    // Example prompts
    const examples = [
        "What's the weather in San Francisco?",
        'Search for the latest AI news',
        'Calculate 15% of 287.50',
        "What's Apple's stock price?",
    ];
    return (_jsxs("div", { className: "flex flex-col h-screen max-w-3xl mx-auto", children: [_jsxs("header", { className: "p-4 border-b", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Tool Calling Chat" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "AI with weather, search, calculator & stock tools" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDEE0\uFE0F" }), _jsx("h2", { className: "text-lg font-medium mb-2", children: "Try Tool Calling" }), _jsx("p", { className: "text-sm text-muted-foreground mb-6 max-w-sm", children: "Ask questions that use tools. The AI will automatically call the right tool." }), _jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: examples.map((example, i) => (_jsx("button", { onClick: () => sendMessage(example), className: "px-3 py-1.5 bg-muted text-sm rounded-lg hover:bg-muted/80 transition-colors", children: example }, i))) })] })) : (messages.map((message) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[85%] ${message.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3'
                                : 'space-y-2'}`, children: message.role === 'assistant' ? (_jsxs(_Fragment, { children: [message.toolCalls && message.toolCalls.length > 0 && (_jsx("div", { className: "space-y-2", children: message.toolCalls.map((tc) => (_jsx(ToolCard, { toolCall: tc }, tc.id))) })), message.content && (_jsxs("div", { className: "bg-muted rounded-2xl rounded-bl-md px-4 py-3", children: [_jsx("p", { className: "whitespace-pre-wrap", children: message.content }), isLoading && !message.toolCalls?.length && (_jsx("span", { className: "inline-block w-2 h-4 ml-1 bg-current animate-blink" }))] })), isLoading &&
                                        !message.content &&
                                        !message.toolCalls?.length && (_jsx("div", { className: "bg-muted rounded-2xl rounded-bl-md px-4 py-3", children: _jsxs("span", { className: "inline-flex gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-current rounded-full animate-bounce" }), _jsx("span", { className: "w-2 h-2 bg-current rounded-full animate-bounce", style: { animationDelay: '150ms' } }), _jsx("span", { className: "w-2 h-2 bg-current rounded-full animate-bounce", style: { animationDelay: '300ms' } })] }) }))] })) : (_jsx("p", { className: "whitespace-pre-wrap", children: message.content })) }) }, message.id)))), _jsx("div", { ref: messagesEndRef })] }), error && (_jsx("div", { className: "mx-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm", children: error })), _jsx("form", { onSubmit: handleSubmit, className: "p-4 border-t", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("textarea", { ref: inputRef, value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: "Ask something that uses tools...", disabled: isLoading, rows: 1, className: "flex-1 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50" }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Send" })] }) })] }));
}
export default ToolCallingChat;
//# sourceMappingURL=tool-calling-chat.js.map