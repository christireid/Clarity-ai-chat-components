import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Advanced Example: Multi-modal chat with tool calling
 *
 * Demonstrates advanced features:
 * - Multi-modal content (text + images)
 * - Tool calling
 * - Message transformation
 * - Token management
 */
import * as React from 'react';
import { useChat, useAssistant } from '@clarity-chat/react';
import { messageToText, extractToolCalls, truncateMessagesToTokenLimit, } from '@clarity-chat/react';
function MultiModalChatExample() {
    const { messages, append, isLoading, setMessages } = useChat({
        api: '/api/chat',
        transform: (messages) => {
            // Limit to last 10 messages or 4000 tokens
            return truncateMessagesToTokenLimit(messages, 4000).slice(-10);
        },
        onFinish: (message) => {
            console.log('Message finished:', message);
            // Check for tool calls
            const toolCalls = extractToolCalls(message);
            if (toolCalls.length > 0) {
                console.log('Tool calls detected:', toolCalls);
            }
        },
    });
    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target?.result;
            if (imageData) {
                append({
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'What do you see in this image?',
                        },
                        {
                            type: 'image',
                            image: imageData,
                        },
                    ],
                });
            }
        };
        reader.readAsArrayBuffer(file);
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Multi-Modal Chat" }), _jsx("div", { className: "mb-4", children: _jsx("input", { type: "file", accept: "image/*", onChange: (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleImageUpload(file);
                        }
                    }, className: "mb-2" }) }), _jsx("div", { className: "space-y-2 mb-4 max-h-96 overflow-y-auto", children: messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'}`, children: [_jsx("div", { className: "text-sm font-semibold mb-1", children: msg.role }), _jsx("div", { children: messageToText(msg) }), Array.isArray(msg.content) && msg.content.some((p) => p.type === 'image') && (_jsx("div", { className: "mt-2 text-sm text-gray-600", children: "[Image attached]" }))] }, msg.id))) }), isLoading && _jsx("div", { className: "text-gray-500", children: "Thinking..." })] }));
}
function ToolCallingExample() {
    const { status, messages, submitMessage, input, setInput, isLoading, toolInvocations, } = useAssistant({
        api: '/api/assistant',
        assistantId: 'tool-assistant',
        onToolCall: (toolCall) => {
            console.log('Tool called:', toolCall);
            // Simulate tool execution
            if (toolCall.toolName === 'get_weather') {
                // In real app, this would call an actual API
                console.log('Getting weather for:', toolCall.args);
            }
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            submitMessage(input.trim());
            setInput('');
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Tool Calling Assistant" }), _jsxs("div", { className: "mb-4 flex items-center gap-4", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-sm ${status === 'idle' ? 'bg-green-100 text-green-800' :
                            status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'}`, children: status }), toolInvocations.length > 0 && (_jsxs("span", { className: "text-sm text-gray-600", children: [toolInvocations.length, " tool", toolInvocations.length > 1 ? 's' : '', " invoked"] }))] }), _jsx("div", { className: "space-y-2 mb-4 max-h-96 overflow-y-auto", children: messages.map((msg) => {
                    const toolCalls = extractToolCalls(msg);
                    return (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'}`, children: [_jsx("div", { className: "text-sm font-semibold mb-1", children: msg.role }), _jsx("div", { children: messageToText(msg) }), toolCalls.length > 0 && (_jsxs("div", { className: "mt-2 pt-2 border-t", children: [_jsx("div", { className: "text-xs font-semibold text-gray-600 mb-1", children: "Tool Calls:" }), toolCalls.map((tc, idx) => (_jsxs("div", { className: "text-xs text-gray-500", children: ["\u2022 ", tc.toolName, "(", JSON.stringify(tc.args), ")"] }, idx)))] }))] }, msg.id));
                }) }), toolInvocations.length > 0 && (_jsxs("div", { className: "mb-4 p-4 bg-yellow-50 rounded-lg", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Active Tool Invocations:" }), toolInvocations.map((inv, idx) => (_jsxs("div", { className: "text-sm mb-1", children: [_jsx("strong", { children: inv.toolName }), " (", inv.state, ")", inv.args && (_jsxs("div", { className: "text-xs text-gray-600 ml-4", children: ["Args: ", JSON.stringify(inv.args)] }))] }, idx)))] })), _jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), placeholder: "Ask to use a tool (e.g., 'What's the weather in San Francisco?')", className: "flex-1 px-4 py-2 border rounded-lg", disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50", children: "Send" })] })] }));
}
function MessageManagementExample() {
    const { messages, append, setMessages, reload } = useChat({
        api: '/api/chat',
    });
    const handleClear = () => {
        setMessages([]);
    };
    const handleExport = () => {
        const exportData = {
            messages: messages.map((msg) => ({
                role: msg.role,
                content: messageToText(msg),
                timestamp: new Date().toISOString(),
            })),
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Message Management" }), _jsxs("div", { className: "mb-4 flex gap-2", children: [_jsx("button", { onClick: handleClear, className: "px-4 py-2 bg-red-600 text-white rounded-lg", children: "Clear Chat" }), _jsx("button", { onClick: handleExport, className: "px-4 py-2 bg-green-600 text-white rounded-lg", disabled: messages.length === 0, children: "Export Chat" }), _jsx("button", { onClick: () => reload(), className: "px-4 py-2 bg-blue-600 text-white rounded-lg", disabled: messages.length === 0, children: "Reload Last Response" })] }), _jsx("div", { className: "space-y-2 mb-4 max-h-96 overflow-y-auto", children: messages.length === 0 ? (_jsx("div", { className: "text-center text-gray-500 py-8", children: "No messages yet. Start a conversation!" })) : (messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'}`, children: [_jsx("div", { className: "text-sm font-semibold mb-1", children: msg.role }), _jsx("div", { children: messageToText(msg) })] }, msg.id)))) })] }));
}
export default function AdvancedExamples() {
    const [activeExample, setActiveExample] = React.useState('multimodal');
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white border-b shadow-sm", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4", children: [_jsx("h1", { className: "text-3xl font-bold mb-4", children: "Advanced Examples" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setActiveExample('multimodal'), className: `px-4 py-2 rounded-lg ${activeExample === 'multimodal'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200'}`, children: "Multi-Modal" }), _jsx("button", { onClick: () => setActiveExample('tools'), className: `px-4 py-2 rounded-lg ${activeExample === 'tools'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200'}`, children: "Tool Calling" }), _jsx("button", { onClick: () => setActiveExample('management'), className: `px-4 py-2 rounded-lg ${activeExample === 'management'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200'}`, children: "Message Management" })] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto py-6", children: [activeExample === 'multimodal' && _jsx(MultiModalChatExample, {}), activeExample === 'tools' && _jsx(ToolCallingExample, {}), activeExample === 'management' && _jsx(MessageManagementExample, {})] })] }));
}
//# sourceMappingURL=AdvancedExample.js.map