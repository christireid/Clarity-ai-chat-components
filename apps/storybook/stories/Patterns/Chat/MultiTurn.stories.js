import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChatWindow, ChatInput, Message, ThinkingIndicator } from '@clarity-chat/react';
import { StatusBadge } from '../../../.storybook/blocks';
import { useState } from 'react';
const meta = {
    title: 'Patterns/Chat/Multi-turn Conversations',
    parameters: {
        docs: {
            description: {
                component: `
# Multi-turn Conversation Pattern

Learn how to build chat interfaces that maintain context across multiple conversation turns.

## Problem

Users need to have coherent multi-turn conversations where the AI remembers previous messages and maintains context throughout the interaction.

## Solution

Implement a conversation state manager that:
1. Maintains message history
2. Tracks conversation context
3. Handles streaming responses
4. Manages loading states
5. Supports message operations (edit, retry, delete)

## Key Features

- **Context Persistence** - Maintains conversation history
- **Optimistic Updates** - Immediate UI feedback
- **Error Handling** - Graceful failure recovery
- **Streaming Support** - Progressive response rendering
- **Message Operations** - Edit and retry capabilities
        `,
            },
        },
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;
export const Basic = {
    render: () => {
        const [messages, setMessages] = useState([
            {
                id: '1',
                role: 'assistant',
                content: 'Hello! I can help you with questions about our product. What would you like to know?',
                timestamp: new Date(Date.now() - 120000),
            },
        ]);
        const [input, setInput] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const handleSubmit = async () => {
            if (!input.trim() || isLoading)
                return;
            // Add user message
            const userMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: input,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);
            setInput('');
            setIsLoading(true);
            // Simulate AI response with context
            setTimeout(() => {
                const aiMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: generateContextualResponse(messages, input),
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMessage]);
                setIsLoading(false);
            }, 1500);
        };
        return (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Basic Multi-turn Chat" }), _jsx(StatusBadge, { status: "stable\\" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "A simple multi-turn conversation that maintains context. Try asking follow-up questions to see context awareness." })] }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden", children: _jsx(ChatWindow, { className: "h-[600px]", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [messages.map((message) => (_jsx(Message, { message: message }, message.id))), isLoading && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium", children: "AI" }), _jsx(ThinkingIndicator, {})] }))] }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 p-4", children: _jsx(ChatInput, { value: input, onChange: (e) => setInput(e.target.value), onSubmit: handleSubmit, placeholder: "Ask a follow-up question...\\", disabled: isLoading }) })] }) }) }), _jsxs("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Context Management" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Message history is preserved" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Follow-up questions work naturally" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500 font-bold", children: "\u2713" }), _jsx("span", { children: "Context is passed to each new turn" })] })] })] }), _jsxs("div", { className: "p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Try These" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsx("li", { children: "\\\"What are your pricing plans?\\\"" }), _jsx("li", { children: "\\\"How does the Enterprise plan differ?\\\"" }), _jsx("li", { children: "\\\"Can I switch plans later?\\\"" }), _jsx("li", { children: "\\\"What about annual discounts?\\\"" })] })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Basic multi-turn conversation with context management and loading states.',
            },
        },
    },
};
export const WithMessageOperations = {
    render: () => {
        const [messages, setMessages] = useState([
            {
                id: '1',
                role: 'assistant',
                content: 'I can help you with code, explanations, or debugging. What would you like to work on?',
                timestamp: new Date(Date.now() - 180000),
            },
            {
                id: '2',
                role: 'user',
                content: 'Explain async/await in JavaScript',
                timestamp: new Date(Date.now() - 120000),
            },
            {
                id: '3',
                role: 'assistant',
                content: 'Async/await is syntactic sugar for working with Promises. It makes asynchronous code look and behave more like synchronous code, making it easier to read and maintain.',
                timestamp: new Date(Date.now() - 60000),
            },
        ]);
        const [input, setInput] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [editingMessageId, setEditingMessageId] = useState(null);
        const handleSubmit = async () => {
            if (!input.trim() || isLoading)
                return;
            const userMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: input,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);
            setInput('');
            setIsLoading(true);
            setTimeout(() => {
                const aiMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: generateContextualResponse(messages, input),
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMessage]);
                setIsLoading(false);
            }, 1500);
        };
        const handleRetry = (messageId) => {
            const messageIndex = messages.findIndex((m) => m.id === messageId);
            if (messageIndex === -1)
                return;
            // Remove the message and regenerate
            const newMessages = messages.slice(0, messageIndex);
            setMessages(newMessages);
            setIsLoading(true);
            setTimeout(() => {
                const aiMessage = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: 'Here\'s an alternative explanation...',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMessage]);
                setIsLoading(false);
            }, 1500);
        };
        const handleDelete = (messageId) => {
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
        };
        return (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "With Message Operations" }), _jsx(StatusBadge, { status: "stable\\" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Multi-turn chat with message operations: retry, edit, and delete. Hover over messages to see actions." })] }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden", children: _jsx(ChatWindow, { className: "h-[600px]", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [messages.map((message) => (_jsxs("div", { className: "group relative", children: [_jsx(Message, { message: message }), _jsxs("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2", children: [message.role === 'assistant' && (_jsx("button", { onClick: () => handleRetry(message.id), className: "px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700\\", children: "Retry" })), _jsx("button", { onClick: () => handleDelete(message.id), className: "px-3 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600\\", children: "Delete" })] })] }, message.id))), isLoading && (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-medium", children: "AI" }), _jsx(ThinkingIndicator, {})] }))] }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 p-4", children: _jsx(ChatInput, { value: input, onChange: (e) => setInput(e.target.value), onSubmit: handleSubmit, placeholder: "Type a message...\\", disabled: isLoading }) })] }) }) }), _jsxs("div", { className: "mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Available Operations" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { className: "block mb-1", children: "Retry" }), _jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Regenerate AI response (hover over assistant messages)" })] }), _jsxs("div", { children: [_jsx("strong", { className: "block mb-1", children: "Delete" }), _jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Remove any message from conversation" })] }), _jsxs("div", { children: [_jsx("strong", { className: "block mb-1", children: "Edit" }), _jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Modify user messages and regenerate (coming soon)" })] })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Advanced pattern with retry, edit, and delete operations on messages.',
            },
        },
    },
};
// Helper function to generate contextual responses
function generateContextualResponse(messages, userInput) {
    const lowerInput = userInput.toLowerCase();
    // Pricing questions
    if (lowerInput.includes('pricing') || lowerInput.includes('plan') || lowerInput.includes('cost')) {
        if (lowerInput.includes('enterprise')) {
            return 'Our Enterprise plan includes unlimited users, priority support, SSO, custom integrations, and a dedicated account manager. Pricing starts at $500/month with volume discounts available.';
        }
        if (lowerInput.includes('switch')) {
            return 'Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and downgrades at the end of your billing cycle with prorated refunds.';
        }
        if (lowerInput.includes('annual') || lowerInput.includes('discount')) {
            return 'Annual plans come with a 20% discount compared to monthly billing. Enterprise customers can get custom pricing with even better rates for longer commitments.';
        }
        return 'We offer three plans: Starter ($29/month), Professional ($99/month), and Enterprise (custom pricing). All plans include a 14-day free trial!';
    }
    // Default contextual response
    return `I understand you're asking about "${userInput}". Based on our conversation, I can provide more specific information. What particular aspect would you like to know more about?`;
}
//# sourceMappingURL=MultiTurn.stories.js.map