import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useChatEnhanced as useChat } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
import { useState } from 'react';
/**
 * **useChat Hook (Enhanced)**
 *
 * Enhanced useChat hook with full Vercel AI SDK compatibility.
 * Provides complete chat interface with streaming support, message management,
 * tool calling, and multi-modal content.
 *
 * **Key Features:**
 * - Vercel AI SDK compatible API
 * - Streaming support (SSE and data protocols)
 * - Multi-modal messages (text, images, tool calls)
 * - Tool invocation support
 * - Message management
 * - Error handling and recovery
 * - Request cancellation
 * - Form handling
 *
 * **Use Cases:**
 * - AI chat interfaces
 * - Multi-turn conversations
 * - Tool-using assistants
 * - Multi-modal chat applications
 * - Enterprise chat solutions
 */
const meta = {
    title: 'Hooks/Chat/UseChatEnhanced',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The enhanced \`useChat\` hook provides full Vercel AI SDK compatibility
with streaming support, message management, and tool calling capabilities.

## Features

- ✅ Vercel AI SDK compatible API
- ✅ Streaming support (SSE and data protocols)
- ✅ Multi-modal messages (text, images, tool calls)
- ✅ Tool invocation support
- ✅ Message management
- ✅ Error handling and recovery
- ✅ Request cancellation
- ✅ Form handling
- ✅ Loading and error states

## Basic Usage

\`\`\`tsx
const { messages, append, isLoading, handleSubmit, input, setInput } = useChat({
  api: '/api/chat',
  initialMessages: [],
  onFinish: (message) => console.log('Finished:', message),
  onError: (error) => console.error('Error:', error),
})

// Handle form submission
<form onSubmit={handleSubmit}>
  <input value={input} onChange={(e) => setInput(e.target.value)} />
  <button type="submit" disabled={isLoading}>Send</button>
</form>
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
function BasicChatDemo() {
    const { messages, append, isLoading, handleSubmit, input, setInput, error, stop } = useChat({
        initialMessages: [],
        onFinish: (message) => {
            console.log('Message finished:', message);
        },
        onError: (error) => {
            console.error('Chat error:', error);
        },
    });
    return (_jsxs("div", { className: "flex flex-col h-[500px] border rounded-lg max-w-2xl", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.length === 0 && (_jsx("div", { className: "text-center text-gray-500 py-8", children: "Start a conversation by sending a message" })), messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: typeof msg.content === 'string' ? (_jsx("div", { className: "whitespace-pre-wrap", children: msg.content })) : (_jsx("div", { className: "text-sm", children: "Multi-modal content" })) }) }, msg.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500", children: "Thinking..." }) }))] }), _jsxs("form", { onSubmit: handleSubmit, className: "border-t p-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type a message...", className: "flex-1 p-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { type: "submit", disabled: isLoading || !input.trim(), children: isLoading ? 'Sending...' : 'Send' }), isLoading && (_jsx(Button, { type: "button", onClick: stop, variant: "outline", children: "Stop" }))] }), error && (_jsxs("div", { className: "mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200", children: ["Error: ", error.message] }))] })] }));
}
export const BasicUsage = {
    render: () => _jsx(BasicChatDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Basic chat interface using enhanced useChat hook with form handling and message display.',
            },
        },
    },
};
function WithInitialMessagesDemo() {
    const { messages, append, isLoading, handleSubmit, input, setInput } = useChat({
        initialMessages: [
            {
                id: '1',
                role: 'assistant',
                content: 'Hello! How can I help you today?',
            },
            {
                id: '2',
                role: 'user',
                content: 'Tell me about React hooks',
            },
            {
                id: '3',
                role: 'assistant',
                content: 'React hooks are functions that let you use state and other React features in functional components.',
            },
        ],
    });
    return (_jsxs("div", { className: "flex flex-col h-[500px] border rounded-lg max-w-2xl", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: typeof msg.content === 'string' ? (_jsx("div", { className: "whitespace-pre-wrap", children: msg.content })) : (_jsx("div", { className: "text-sm", children: "Multi-modal content" })) }) }, msg.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500", children: "Thinking..." }) }))] }), _jsx("form", { onSubmit: handleSubmit, className: "border-t p-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), placeholder: "Continue the conversation...", className: "flex-1 p-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { type: "submit", disabled: isLoading || !input.trim(), children: "Send" })] }) })] }));
}
export const WithInitialMessages = {
    render: () => _jsx(WithInitialMessagesDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Chat with pre-populated initial messages to continue an existing conversation.',
            },
        },
    },
};
function AppendMessageDemo() {
    const { messages, append, isLoading, stop } = useChat({
        initialMessages: [],
    });
    const [customMessage, setCustomMessage] = useState('');
    const handleAppend = async () => {
        if (!customMessage.trim())
            return;
        // Append user message
        await append({
            role: 'user',
            content: customMessage,
        });
        setCustomMessage('');
        // Simulate assistant response
        setTimeout(async () => {
            await append({
                role: 'assistant',
                content: `You said: "${customMessage}". This is a simulated response.`,
            });
        }, 1000);
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsx("div", { className: "flex flex-col h-[400px] border rounded-lg", children: _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.length === 0 && (_jsx("div", { className: "text-center text-gray-500 py-8", children: "No messages yet. Use append() to add messages programmatically." })), messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: typeof msg.content === 'string' ? (_jsx("div", { className: "whitespace-pre-wrap", children: msg.content })) : (_jsx("div", { className: "text-sm", children: "Multi-modal content" })) }) }, msg.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500", children: "Processing..." }) }))] }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Custom message:" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: customMessage, onChange: (e) => setCustomMessage(e.target.value), placeholder: "Enter a message to append", className: "flex-1 p-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { onClick: handleAppend, disabled: isLoading || !customMessage.trim(), children: "Append Message" }), isLoading && (_jsx(Button, { onClick: stop, variant: "outline", children: "Stop" }))] }), _jsx("p", { className: "text-xs text-gray-500", children: "Using append() to programmatically add messages instead of form submission." })] })] }));
}
export const AppendMessage = {
    render: () => _jsx(AppendMessageDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using append() to programmatically add messages to the chat.',
            },
        },
    },
};
function ReloadDemo() {
    const { messages, reload, isLoading, stop } = useChat({
        initialMessages: [
            {
                id: '1',
                role: 'user',
                content: 'Tell me a joke',
            },
            {
                id: '2',
                role: 'assistant',
                content: 'Why did the chicken cross the road?',
            },
        ],
    });
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsx("div", { className: "flex flex-col h-[400px] border rounded-lg", children: _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: typeof msg.content === 'string' ? (_jsx("div", { className: "whitespace-pre-wrap", children: msg.content })) : (_jsx("div", { className: "text-sm", children: "Multi-modal content" })) }) }, msg.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500", children: "Regenerating response..." }) }))] }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => reload(), disabled: isLoading, children: isLoading ? 'Reloading...' : 'Reload Last Response' }), isLoading && (_jsx(Button, { onClick: stop, variant: "outline", children: "Stop" }))] }), _jsx("p", { className: "text-xs text-gray-500", children: "Use reload() to regenerate the last assistant message. This is useful for retrying failed requests or getting alternative responses." })] }));
}
export const Reload = {
    render: () => _jsx(ReloadDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using reload() to regenerate the last assistant message.',
            },
        },
    },
};
function ErrorHandlingDemo() {
    const { messages, append, isLoading, error, stop } = useChat({
        initialMessages: [],
        onError: (error) => {
            console.error('Chat error:', error);
        },
        keepLastMessageOnError: true,
    });
    const [message, setMessage] = useState('');
    const handleAppend = async () => {
        if (!message.trim())
            return;
        try {
            // Simulate an error for demo
            if (message.toLowerCase().includes('error')) {
                throw new Error('Simulated API error');
            }
            await append({
                role: 'user',
                content: message,
            });
            // Simulate assistant response
            setTimeout(async () => {
                await append({
                    role: 'assistant',
                    content: `Response to: "${message}"`,
                });
            }, 1000);
            setMessage('');
        }
        catch (err) {
            console.error('Failed to append:', err);
        }
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsx("div", { className: "flex flex-col h-[400px] border rounded-lg", children: _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[70%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`, children: typeof msg.content === 'string' ? (_jsx("div", { className: "whitespace-pre-wrap", children: msg.content })) : (_jsx("div", { className: "text-sm", children: "Multi-modal content" })) }) }, msg.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500", children: "Processing..." }) }))] }) }), error && (_jsxs("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: [_jsx("div", { className: "font-medium text-red-800 dark:text-red-200", children: "Error:" }), _jsx("div", { className: "text-sm text-red-700 dark:text-red-300 mt-1", children: error.message })] })), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Message (try \"error\" to trigger error):" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Enter a message", className: "flex-1 p-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { onClick: handleAppend, disabled: isLoading || !message.trim(), children: "Send" }), isLoading && (_jsx(Button, { onClick: stop, variant: "outline", children: "Stop" }))] })] })] }));
}
export const ErrorHandling = {
    render: () => _jsx(ErrorHandlingDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Error handling with keepLastMessageOnError option to preserve messages on error.',
            },
        },
    },
};
//# sourceMappingURL=UseChatEnhanced.stories.js.map