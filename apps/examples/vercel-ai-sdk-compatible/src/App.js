import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Vercel AI SDK Compatible Example
 *
 * Demonstrates the useChat, useCompletion, and useAssistant hooks
 * with full Vercel AI SDK API compatibility.
 */
import * as React from 'react';
import { useChat, useCompletion, useAssistant, useClarityChat } from '@clarity-chat/react';
import { ChatWindow } from '@clarity-chat/react';
import { MemoryProvider } from '@clarity-chat/react/memory';
import { ThemeProvider, themes } from '@clarity-chat/react';
import { convertCoreMessagesToMessages } from '@clarity-chat/react';
import AdvancedExamples from './AdvancedExample';
function ChatExample() {
    const { messages, append, isLoading, handleSubmit, input, setInput, error } = useChat({
        api: '/api/chat',
        initialMessages: [],
        onFinish: (message) => {
            console.log('Message finished:', message);
        },
        onError: (error) => {
            console.error('Chat error:', error);
        },
    });
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx(ChatWindow, { messages: messages.map((msg) => ({
                    id: msg.id || '',
                    chatId: 'default',
                    role: msg.role === 'user' ? 'user' : msg.role === 'assistant' ? 'assistant' : 'system',
                    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
                    status: isLoading && msg.role === 'assistant' ? 'streaming' : 'sent',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })), isLoading: isLoading, onSendMessage: (content) => {
                    append({
                        role: 'user',
                        content,
                    });
                } }), _jsxs("form", { onSubmit: handleSubmit, className: "p-4 border-t", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type a message...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50", children: "Send" })] }), error && (_jsxs("div", { className: "mt-2 text-red-600 text-sm", children: ["Error: ", error.message] }))] })] }));
}
function CompletionExample() {
    const { completion, complete, isLoading, stop } = useCompletion({
        api: '/api/completion',
        onFinish: (prompt, completion) => {
            console.log('Completion finished:', { prompt, completion });
        },
    });
    const [prompt, setPrompt] = React.useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim()) {
            complete(prompt);
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-2xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Text Completion" }), _jsx("form", { onSubmit: handleSubmit, className: "mb-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: "Enter a prompt...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading || !prompt.trim(), className: "px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50", children: "Complete" }), isLoading && (_jsx("button", { type: "button", onClick: stop, className: "px-6 py-2 bg-red-600 text-white rounded-lg", children: "Stop" }))] }) }), _jsx("div", { className: "p-4 bg-gray-50 rounded-lg min-h-[200px]", children: completion || 'Completion will appear here...' })] }));
}
function AssistantExample() {
    const { status, messages, submitMessage, input, setInput, isLoading, toolInvocations, } = useAssistant({
        api: '/api/assistant',
        assistantId: 'example-assistant',
        onToolCall: (toolCall) => {
            console.log('Tool called:', toolCall);
        },
        onFinish: (message) => {
            console.log('Assistant finished:', message);
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            submitMessage(input.trim());
            setInput('');
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsxs("div", { className: "mb-4 flex items-center gap-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "AI Assistant" }), _jsx("span", { className: `px-3 py-1 rounded-full text-sm ${status === 'idle' ? 'bg-green-100 text-green-800' :
                            status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'}`, children: status })] }), _jsx("div", { className: "mb-4 space-y-2", children: messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'}`, children: [_jsx("div", { className: "text-sm font-semibold mb-1", children: msg.role }), _jsx("div", { children: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) })] }, msg.id))) }), toolInvocations.length > 0 && (_jsxs("div", { className: "mb-4 p-4 bg-yellow-50 rounded-lg", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Tool Invocations:" }), toolInvocations.map((invocation, idx) => (_jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: invocation.toolName }), ": ", invocation.state] }, idx)))] })), _jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), placeholder: "Ask the assistant...", className: "flex-1 px-4 py-2 border rounded-lg", disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50", children: "Send" })] })] }));
}
import PerformanceExample from './PerformanceExample';
function ClarityChatExample() {
    const { messages: coreMessages, append, isLoading, error, memoryEnabled, contextSummary, } = useClarityChat({
        api: '/api/chat',
        memory: {
            enabled: true,
            strategy: 'sliding-window',
            maxTokens: 4000,
        },
        transport: 'sse',
    });
    const messages = React.useMemo(() => convertCoreMessagesToMessages(coreMessages), [coreMessages]);
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsxs("div", { className: "p-4 bg-blue-50 border-b", children: [_jsx("h2", { className: "text-xl font-bold mb-2", children: "useClarityChat (Flagship Hook)" }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Clarity's enhanced chat hook with memory integration and transport selection." }), memoryEnabled && (_jsxs("div", { className: "text-xs text-green-700", children: ["\u2713 Memory Enabled ", contextSummary && `- Context: ${contextSummary.substring(0, 50)}...`] }))] }), _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: (content) => {
                    append({
                        role: 'user',
                        content,
                    });
                }, showHeader: true, sessionTitle: "useClarityChat Example", sessionSubtitle: "Memory-enabled chat with SSE transport" }), error && (_jsxs("div", { className: "p-4 bg-red-50 border-t text-red-600 text-sm", children: ["Error: ", error.message] }))] }));
}
export default function App() {
    const [activeTab, setActiveTab] = React.useState('chat');
    return (_jsx(MemoryProvider, { config: { maxTokens: 10000 }, children: _jsx(ThemeProvider, { theme: themes.ocean, children: _jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white border-b shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4", children: [_jsx("h1", { className: "text-3xl font-bold mb-4", children: "Vercel AI SDK Compatible Examples" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setActiveTab('chat'), className: `px-4 py-2 rounded-lg ${activeTab === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`, children: "useChat" }), _jsx("button", { onClick: () => setActiveTab('completion'), className: `px-4 py-2 rounded-lg ${activeTab === 'completion' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`, children: "useCompletion" }), _jsx("button", { onClick: () => setActiveTab('assistant'), className: `px-4 py-2 rounded-lg ${activeTab === 'assistant' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`, children: "useAssistant" }), _jsx("button", { onClick: () => setActiveTab('clarity'), className: `px-4 py-2 rounded-lg ${activeTab === 'clarity' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`, children: "useClarityChat \u2B50" }), _jsx("button", { onClick: () => setActiveTab('advanced'), className: `px-4 py-2 rounded-lg ${activeTab === 'advanced' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`, children: "Advanced" }), _jsx("button", { onClick: () => setActiveTab('performance'), className: `px-4 py-2 rounded-lg ${activeTab === 'performance' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`, children: "Performance" })] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto py-6", children: [activeTab === 'chat' && _jsx(ChatExample, {}), activeTab === 'completion' && _jsx(CompletionExample, {}), activeTab === 'assistant' && _jsx(AssistantExample, {}), activeTab === 'clarity' && _jsx(ClarityChatExample, {}), activeTab === 'advanced' && _jsx(AdvancedExamples, {}), activeTab === 'performance' && _jsx(PerformanceExample, {})] })] }) }) }));
}
//# sourceMappingURL=App.js.map