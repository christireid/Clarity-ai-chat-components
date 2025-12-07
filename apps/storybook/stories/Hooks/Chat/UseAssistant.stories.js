import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useAssistant } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
import { useState } from 'react';
/**
 * **useAssistant Hook**
 *
 * Hook for managing AI assistant interactions with tool calling support,
 * multi-step workflows, and thread/run management.
 *
 * **Key Features:**
 * - Assistant thread management
 * - Tool calling support
 * - Multi-step workflows
 * - Status tracking (idle, in_progress, awaiting_message)
 * - Streaming responses
 * - Error handling
 * - Request cancellation
 *
 * **Use Cases:**
 * - AI assistants with tools
 * - Multi-step agent workflows
 * - Thread-based conversations
 * - Tool-using agents
 * - Enterprise assistant applications
 */
const meta = {
    title: 'Hooks/Chat/UseAssistant',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useAssistant\` hook provides a way to manage AI assistant interactions
with tool calling support and multi-step workflows.

## Features

- ✅ Assistant thread management
- ✅ Tool calling support
- ✅ Multi-step workflows
- ✅ Status tracking (idle, in_progress, awaiting_message)
- ✅ Streaming responses
- ✅ Error handling
- ✅ Request cancellation
- ✅ Form handling

## Basic Usage

\`\`\`tsx
const { status, messages, submitMessage, handleSubmit, input, setInput } = useAssistant({
  api: '/api/assistant',
  assistantId: 'asst_123',
  threadId: 'thread_456',
  onToolCall: (toolCall) => {
    console.log('Tool called:', toolCall)
  },
})

// Handle form submission
<form onSubmit={handleSubmit}>
  <input value={input} onChange={(e) => setInput(e.target.value)} />
  <button type="submit" disabled={status !== 'idle'}>Send</button>
</form>
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
function BasicAssistantDemo() {
    const { status, messages, submitMessage, handleSubmit, input, setInput, error, stop } = useAssistant({
        assistantId: 'demo-assistant',
        onToolCall: (toolCall) => {
            console.log('Tool called:', toolCall);
        },
        onFinish: (message) => {
            console.log('Assistant finished:', message);
        },
        onError: (error) => {
            console.error('Assistant error:', error);
        },
    });
    return (_jsxs("div", { className: "flex flex-col h-[500px] border rounded-lg max-w-2xl", children: [_jsx("div", { className: "border-b p-2 bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm font-medium", children: ["Assistant Status: ", status] }), status === 'in_progress' && (_jsx(Button, { onClick: stop, size: "sm", variant: "outline", children: "Stop" }))] }) }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.length === 0 && (_jsx("div", { className: "text-center text-gray-500 py-8", children: "Start a conversation with the assistant" })), messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: typeof msg.content === 'string' ? (_jsx("div", { className: "whitespace-pre-wrap", children: msg.content })) : (_jsx("div", { className: "text-sm", children: "Multi-modal content" })) }) }, msg.id))), status === 'in_progress' && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500", children: "Assistant is thinking..." }) })), status === 'awaiting_message' && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-2 text-yellow-800 dark:text-yellow-200", children: "Assistant is awaiting your message..." }) }))] }), _jsxs("form", { onSubmit: handleSubmit, className: "border-t p-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type a message...", className: "flex-1 p-2 border rounded-lg", disabled: status !== 'idle' }), _jsx(Button, { type: "submit", disabled: status !== 'idle' || !input.trim(), children: status === 'in_progress' ? 'Processing...' : 'Send' })] }), error && (_jsxs("div", { className: "mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200", children: ["Error: ", error.message] }))] })] }));
}
export const BasicUsage = {
    render: () => _jsx(BasicAssistantDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Basic assistant interface with status tracking and form handling.',
            },
        },
    },
};
function StatusTrackingDemo() {
    const { status, messages, submitMessage, isLoading, error } = useAssistant({
        assistantId: 'demo-assistant',
    });
    const [message, setMessage] = useState('');
    const handleSubmit = async () => {
        if (!message.trim())
            return;
        await submitMessage(message);
        setMessage('');
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "p-4 border rounded-lg bg-gray-50 dark:bg-gray-900", children: [_jsx("h3", { className: "font-medium mb-2", children: "Status Tracking" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Current Status:" }), ' ', _jsx("span", { className: `px-2 py-1 rounded ${status === 'idle'
                                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                                            : status === 'in_progress'
                                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                                                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'}`, children: status })] }), _jsxs("div", { children: [_jsx("strong", { children: "Is Loading:" }), " ", isLoading ? 'Yes' : 'No'] }), _jsxs("div", { children: [_jsx("strong", { children: "Messages Count:" }), " ", messages.length] }), error && (_jsxs("div", { children: [_jsx("strong", { children: "Error:" }), " ", _jsx("span", { className: "text-red-600 dark:text-red-400", children: error.message })] }))] })] }), _jsx("div", { className: "flex flex-col h-[300px] border rounded-lg", children: _jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: typeof msg.content === 'string' ? (_jsx("div", { className: "whitespace-pre-wrap", children: msg.content })) : (_jsx("div", { className: "text-sm", children: "Multi-modal content" })) }) }, msg.id))) }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Enter a message", className: "flex-1 p-2 border rounded-lg", disabled: status !== 'idle' }), _jsx(Button, { onClick: handleSubmit, disabled: status !== 'idle' || !message.trim(), children: "Submit" })] })] }));
}
export const StatusTracking = {
    render: () => _jsx(StatusTrackingDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Tracking assistant status (idle, in_progress, awaiting_message) and related state.',
            },
        },
    },
};
function ToolCallingDemo() {
    const { status, messages, submitMessage, isLoading } = useAssistant({
        assistantId: 'demo-assistant',
        onToolCall: (toolCall) => {
            console.log('Tool invocation:', toolCall);
            // In a real app, you would handle the tool call here
            // For example, call an API, update database, etc.
        },
    });
    const [message, setMessage] = useState('');
    const handleSubmit = async () => {
        if (!message.trim())
            return;
        await submitMessage(message);
        setMessage('');
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20", children: [_jsx("h3", { className: "font-medium mb-2", children: "Tool Calling Support" }), _jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: "The assistant can call tools during the conversation. Check the browser console to see tool invocation events when they occur." })] }), _jsx("div", { className: "flex flex-col h-[300px] border rounded-lg", children: _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : msg.role === 'tool'
                                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: typeof msg.content === 'string' ? (_jsx("div", { className: "whitespace-pre-wrap", children: msg.content })) : (_jsx("div", { className: "text-sm", children: msg.toolInvocations && msg.toolInvocations.length > 0
                                        ? `Tool invocations: ${msg.toolInvocations.length}`
                                        : 'Multi-modal content' })) }) }, msg.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500", children: "Assistant is processing..." }) }))] }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Enter a message that might trigger tool calls", className: "flex-1 p-2 border rounded-lg", disabled: status !== 'idle' }), _jsx(Button, { onClick: handleSubmit, disabled: status !== 'idle' || !message.trim(), children: "Submit" })] })] }));
}
export const ToolCalling = {
    render: () => _jsx(ToolCallingDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Assistant with tool calling support. Tool invocations are logged to the console.',
            },
        },
    },
};
function ThreadManagementDemo() {
    const [threadId, setThreadId] = useState(undefined);
    const { status, messages, submitMessage, isLoading } = useAssistant({
        assistantId: 'demo-assistant',
        threadId,
    });
    const [message, setMessage] = useState('');
    const handleSubmit = async () => {
        if (!message.trim())
            return;
        await submitMessage(message);
        setMessage('');
    };
    const createNewThread = () => {
        setThreadId(`thread-${Date.now()}`);
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "p-4 border rounded-lg bg-gray-50 dark:bg-gray-900", children: [_jsx("h3", { className: "font-medium mb-2", children: "Thread Management" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Current Thread ID:" }), ' ', threadId ? (_jsx("code", { className: "px-2 py-1 bg-white dark:bg-gray-800 rounded", children: threadId })) : (_jsx("span", { className: "text-gray-500", children: "None (create a new thread)" }))] }), _jsx(Button, { onClick: createNewThread, size: "sm", variant: "outline", children: "Create New Thread" })] })] }), _jsx("div", { className: "flex flex-col h-[300px] border rounded-lg", children: _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.length === 0 && (_jsx("div", { className: "text-center text-gray-500 py-8", children: threadId ? 'Start a conversation in this thread' : 'Create a thread to start' })), messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: typeof msg.content === 'string' ? (_jsx("div", { className: "whitespace-pre-wrap", children: msg.content })) : (_jsx("div", { className: "text-sm", children: "Multi-modal content" })) }) }, msg.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500", children: "Processing..." }) }))] }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Enter a message", className: "flex-1 p-2 border rounded-lg", disabled: status !== 'idle' || !threadId }), _jsx(Button, { onClick: handleSubmit, disabled: status !== 'idle' || !message.trim() || !threadId, children: "Submit" })] }), !threadId && (_jsx("p", { className: "text-xs text-gray-500", children: "Create a thread first to enable message submission." }))] }));
}
export const ThreadManagement = {
    render: () => _jsx(ThreadManagementDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Managing assistant threads for multi-turn conversations.',
            },
        },
    },
};
//# sourceMappingURL=UseAssistant.stories.js.map