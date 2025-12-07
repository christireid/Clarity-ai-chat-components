import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useChat } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
import { useState } from 'react';
/**
 * **useChat Hook**
 *
 * The core hook for managing chat state, messages, and async operations.
 *
 * **Key Features:**
 * - Message state management
 * - Async message sending with AbortController support
 * - Error handling and retry logic
 * - Loading states
 * - Message history
 *
 * **Use Cases:**
 * - Chat applications
 * - Messaging interfaces
 * - AI assistants
 * - Customer support
 */
const meta = {
    title: 'Hooks/Chat/UseChat',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useChat\` hook provides complete chat state management with message handling,
async operations, error recovery, and loading states.

## Features

- ✅ Message state management
- ✅ Async message sending with cancellation support
- ✅ Error handling and retry logic
- ✅ Loading states
- ✅ Message history management
- ✅ AbortController integration

## Basic Usage

\`\`\`tsx
const { messages, sendMessage, isLoading, error, retry, clear } = useChat({
  initialMessages: [],
  onSendMessage: async (message, { signal }) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(message),
      signal
    })
    return response.json()
  }
})
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
// Mock API function
const mockSendMessage = async (message) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Echo: ${message.content}`,
        createdAt: Date.now(),
        status: 'sent',
    };
};
function ChatDemo() {
    const { messages, sendMessage, isLoading, error, retry, clear } = useChat({
        initialMessages: [],
        onSendMessage: async (message) => {
            return mockSendMessage(message);
        },
    });
    const [input, setInput] = useState('');
    const handleSend = async () => {
        if (!input.trim())
            return;
        await sendMessage(input);
        setInput('');
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsxs("div", { className: "border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto", children: [messages.length === 0 ? (_jsx("div", { className: "text-center text-muted-foreground py-8", children: "No messages yet. Start a conversation!" })) : (messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                            : 'bg-muted mr-auto max-w-[80%]'}`, children: [_jsx("div", { className: "text-sm font-medium mb-1", children: msg.role === 'user' ? 'You' : 'Assistant' }), _jsx("div", { className: "text-sm", children: msg.content }), msg.status === 'error' && (_jsx(Button, { size: "sm", variant: "outline", onClick: () => retry(msg.id), className: "mt-2", children: "Retry" }))] }, msg.id)))), isLoading && (_jsx("div", { className: "text-muted-foreground text-sm", children: "Thinking..." }))] }), error && (_jsxs("div", { className: "p-3 bg-destructive/10 text-destructive rounded-lg text-sm", children: ["Error: ", error.message] })), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSend(), placeholder: "Type a message...", className: "flex-1 px-3 py-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { onClick: handleSend, disabled: isLoading || !input.trim(), children: "Send" }), messages.length > 0 && (_jsx(Button, { variant: "outline", onClick: clear, children: "Clear" }))] }), _jsxs("div", { className: "p-3 bg-muted rounded-lg text-xs space-y-1", children: [_jsxs("div", { children: [_jsx("strong", { children: "Messages:" }), " ", messages.length] }), _jsxs("div", { children: [_jsx("strong", { children: "Loading:" }), " ", isLoading ? 'Yes' : 'No'] }), _jsxs("div", { children: [_jsx("strong", { children: "Error:" }), " ", error ? error.message : 'None'] })] })] }));
}
export const BasicUsage = {
    render: () => _jsx(ChatDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Basic chat interface using useChat hook with message sending and display.',
            },
        },
    },
};
function ChatWithInitialMessages() {
    const { messages, sendMessage, isLoading } = useChat({
        initialMessages: [
            {
                id: '1',
                role: 'user',
                content: 'Hello!',
                createdAt: Date.now() - 60000,
                status: 'sent',
            },
            {
                id: '2',
                role: 'assistant',
                content: 'Hi there! How can I help you today?',
                createdAt: Date.now() - 30000,
                status: 'sent',
            },
        ],
        onSendMessage: async (message) => {
            await new Promise((resolve) => setTimeout(resolve, 800));
            return {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: `You said: "${message.content}". How can I assist?`,
                createdAt: Date.now(),
                status: 'sent',
            };
        },
    });
    const [input, setInput] = useState('');
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsxs("div", { className: "border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto", children: [messages.map((msg) => (_jsx("div", { className: `p-3 rounded-lg ${msg.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                            : 'bg-muted mr-auto max-w-[80%]'}`, children: _jsx("div", { className: "text-sm", children: msg.content }) }, msg.id))), isLoading && _jsx("div", { className: "text-muted-foreground", children: "Typing..." })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
                            if (e.key === 'Enter' && !isLoading && input.trim()) {
                                sendMessage(input);
                                setInput('');
                            }
                        }, placeholder: "Type a message...", className: "flex-1 px-3 py-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { onClick: () => {
                            sendMessage(input);
                            setInput('');
                        }, disabled: isLoading || !input.trim(), children: "Send" })] })] }));
}
export const WithInitialMessages = {
    render: () => _jsx(ChatWithInitialMessages, {}),
    parameters: {
        docs: {
            description: {
                story: 'Chat with pre-populated initial messages.',
            },
        },
    },
};
function ChatWithErrorHandling() {
    const { messages, sendMessage, isLoading, error, retry } = useChat({
        onSendMessage: async (message) => {
            // Simulate random errors
            if (Math.random() > 0.7) {
                throw new Error('Failed to send message. Please try again.');
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: `Received: ${message.content}`,
                createdAt: Date.now(),
                status: 'sent',
            };
        },
    });
    const [input, setInput] = useState('');
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsxs("div", { className: "border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto", children: [messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg ${msg.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                            : 'bg-muted mr-auto max-w-[80%]'} ${msg.status === 'error' ? 'border-2 border-destructive' : ''}`, children: [_jsx("div", { className: "text-sm", children: msg.content }), msg.status === 'error' && (_jsx(Button, { size: "sm", variant: "outline", onClick: () => retry(msg.id), className: "mt-2", children: "Retry Message" }))] }, msg.id))), isLoading && _jsx("div", { className: "text-muted-foreground", children: "Sending..." })] }), error && (_jsxs("div", { className: "p-3 bg-destructive/10 text-destructive rounded-lg text-sm", children: [_jsx("strong", { children: "Error:" }), " ", error.message] })), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
                            if (e.key === 'Enter' && !isLoading && input.trim()) {
                                sendMessage(input);
                                setInput('');
                            }
                        }, placeholder: "Type a message (may randomly fail)...", className: "flex-1 px-3 py-2 border rounded-lg", disabled: isLoading }), _jsx(Button, { onClick: () => {
                            sendMessage(input);
                            setInput('');
                        }, disabled: isLoading || !input.trim(), children: "Send" })] }), _jsxs("div", { className: "p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs", children: [_jsx("strong", { children: "Note:" }), " This demo randomly fails ~30% of messages to demonstrate error handling. Click \"Retry Message\" on failed messages to resend them."] })] }));
}
export const ErrorHandling = {
    render: () => _jsx(ChatWithErrorHandling, {}),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates error handling and retry functionality when messages fail to send.',
            },
        },
    },
};
function ChatWithCancellation() {
    const { messages, sendMessage, isLoading } = useChat({
        onSendMessage: async (message, { signal }) => {
            // Simulate a long-running request
            for (let i = 0; i < 10; i++) {
                // Check if cancelled
                if (signal?.aborted) {
                    throw new Error('Request cancelled');
                }
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
            return {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: `Processed: ${message.content}`,
                createdAt: Date.now(),
                status: 'sent',
            };
        },
    });
    const [input, setInput] = useState('');
    const [abortController, setAbortController] = useState(null);
    const handleSend = async () => {
        const controller = new AbortController();
        setAbortController(controller);
        try {
            await sendMessage(input, { signal: controller.signal });
            setInput('');
        }
        catch (error) {
            if (error.message !== 'Request cancelled') {
                console.error('Send error:', error);
            }
        }
        finally {
            setAbortController(null);
        }
    };
    const handleCancel = () => {
        abortController?.abort();
        setAbortController(null);
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsxs("div", { className: "border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto", children: [messages.map((msg) => (_jsx("div", { className: `p-3 rounded-lg ${msg.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                            : 'bg-muted mr-auto max-w-[80%]'}`, children: _jsx("div", { className: "text-sm", children: msg.content }) }, msg.id))), isLoading && (_jsx("div", { className: "text-muted-foreground", children: "Processing... (takes ~5 seconds, try cancelling!)" }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
                            if (e.key === 'Enter' && !isLoading && input.trim()) {
                                handleSend();
                            }
                        }, placeholder: "Type a message...", className: "flex-1 px-3 py-2 border rounded-lg", disabled: isLoading }), isLoading && abortController ? (_jsx(Button, { variant: "destructive", onClick: handleCancel, children: "Cancel" })) : (_jsx(Button, { onClick: handleSend, disabled: isLoading || !input.trim(), children: "Send" }))] }), _jsxs("div", { className: "p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs", children: [_jsx("strong", { children: "AbortController Support:" }), " Long-running requests can be cancelled mid-flight. Click \"Cancel\" while a message is processing to abort it."] })] }));
}
export const Cancellation = {
    render: () => _jsx(ChatWithCancellation, {}),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates AbortController support for cancelling in-flight requests.',
            },
        },
    },
};
//# sourceMappingURL=UseChat.stories.js.map