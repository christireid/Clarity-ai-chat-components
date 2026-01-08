import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChatPrimitive } from '@clarity-chat/react';
import { useState } from 'react';
/**
 * Chat Primitives provide unstyled, accessible building blocks for custom chat UIs.
 * They follow the Radix UI pattern - headless components that you style yourself.
 *
 * Use primitives when you need:
 * - Complete control over styling
 * - Custom message layouts
 * - Integration with your design system
 */
const meta = {
    title: 'Primitives/ChatPrimitive',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
Chat Primitives are low-level, composable building blocks for custom chat UIs.
Each primitive handles accessibility and behavior while you control the styling.

## Usage Pattern

\`\`\`tsx
import { ChatPrimitive, useClarityChat } from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <ChatPrimitive.Root messages={chat.messages} isLoading={chat.isLoading}>
      <ChatPrimitive.EmptyState>
        <p>Start a conversation</p>
      </ChatPrimitive.EmptyState>

      <ChatPrimitive.Messages>
        {chat.messages.map((msg) => (
          <ChatPrimitive.Message key={msg.id} message={msg}>
            <ChatPrimitive.MessageContent />
            <ChatPrimitive.MessageActions>
              <ChatPrimitive.CopyButton>Copy</ChatPrimitive.CopyButton>
            </ChatPrimitive.MessageActions>
          </ChatPrimitive.Message>
        ))}
      </ChatPrimitive.Messages>

      <ChatPrimitive.LoadingIndicator>
        <span>Thinking...</span>
      </ChatPrimitive.LoadingIndicator>

      <ChatPrimitive.Input onSubmit={(content) => chat.append({ role: 'user', content })} />
    </ChatPrimitive.Root>
  )
}
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
// Sample messages for stories
const sampleMessages = [
    { id: '1', role: 'user', content: 'Hello, can you help me with React?' },
    {
        id: '2',
        role: 'assistant',
        content: "Of course! I'd be happy to help you with React. What would you like to know?",
    },
    { id: '3', role: 'user', content: 'How do I use useEffect correctly?' },
    {
        id: '4',
        role: 'assistant',
        content: 'useEffect is a React hook for handling side effects. Here are the key patterns:\n\n1. **Run once on mount**: `useEffect(() => { ... }, [])`\n2. **Run when dependencies change**: `useEffect(() => { ... }, [dep1, dep2])`\n3. **Cleanup**: Return a function from useEffect to clean up.\n\nWould you like me to show you a specific example?',
    },
];
// ============================================================================
// BASIC PRIMITIVES STORY
// ============================================================================
function BasicPrimitivesDemo() {
    const [messages, setMessages] = useState(sampleMessages);
    const [isLoading, setIsLoading] = useState(false);
    const handleSend = async (content) => {
        const userMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        // Simulate API response
        setTimeout(() => {
            const assistantMessage = {
                id: `msg-${Date.now() + 1}`,
                role: 'assistant',
                content: `You said: "${content}". This is a simulated response.`,
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1000);
    };
    return (_jsxs(ChatPrimitive.Root, { messages: messages, isLoading: isLoading, onSend: handleSend, className: "flex flex-col h-[500px] border rounded-lg overflow-hidden", children: [_jsx(ChatPrimitive.EmptyState, { className: "flex-1 flex items-center justify-center text-gray-500", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-lg font-medium", children: "No messages yet" }), _jsx("p", { className: "text-sm", children: "Start a conversation below" })] }) }), _jsx(ChatPrimitive.Messages, { className: "flex-1 overflow-y-auto p-4 space-y-4", children: messages.map((msg) => (_jsx(ChatPrimitive.Message, { message: msg, className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'}`, children: [_jsx(ChatPrimitive.MessageContent, { className: "whitespace-pre-wrap" }), _jsx(ChatPrimitive.MessageActions, { className: "mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx(ChatPrimitive.CopyButton, { className: "text-xs underline", children: "Copy" }) })] }) }, msg.id))) }), _jsx(ChatPrimitive.LoadingIndicator, { className: "px-4 py-2 text-gray-500", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "animate-pulse", children: "\u25CF" }), _jsx("span", { children: "Thinking..." })] }) }), _jsx("div", { className: "border-t p-4", children: _jsx(ChatPrimitive.Input, { className: "w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Type a message..." }) })] }));
}
export const Basic = {
    render: () => _jsx(BasicPrimitivesDemo, {}),
    name: 'Basic Usage',
};
// ============================================================================
// CUSTOM STYLING STORY
// ============================================================================
function CustomStyledDemo() {
    const [messages, setMessages] = useState(sampleMessages);
    return (_jsxs(ChatPrimitive.Root, { messages: messages, className: "flex flex-col h-[500px] bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg overflow-hidden", children: [_jsx(ChatPrimitive.Messages, { className: "flex-1 overflow-y-auto p-6 space-y-6", children: messages.map((msg) => (_jsx(ChatPrimitive.Message, { message: msg, className: "group", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${msg.role === 'user'
                                    ? 'bg-purple-500'
                                    : 'bg-gradient-to-br from-pink-500 to-purple-500'}`, children: msg.role === 'user' ? 'U' : 'AI' }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: `inline-block p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                            ? 'bg-purple-500 text-white rounded-tl-none'
                                            : 'bg-white text-gray-800 rounded-tl-none'}`, children: _jsx(ChatPrimitive.MessageContent, { className: "whitespace-pre-wrap" }) }), _jsx(ChatPrimitive.MessageActions, { className: "mt-1 flex gap-2 opacity-0 group-hover:opacity-100 transition-all", children: _jsx(ChatPrimitive.CopyButton, { className: "text-xs text-purple-600 hover:text-purple-800", children: "Copy" }) })] })] }) }, msg.id))) }), _jsx("div", { className: "border-t border-purple-100 bg-white/50 backdrop-blur p-4", children: _jsx(ChatPrimitive.Input, { className: "w-full p-4 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors", placeholder: "Ask anything..." }) })] }));
}
export const CustomStyling = {
    render: () => _jsx(CustomStyledDemo, {}),
    name: 'Custom Styling',
    parameters: {
        docs: {
            description: {
                story: 'Primitives are completely unstyled - apply any design you want.',
            },
        },
    },
};
// ============================================================================
// INDIVIDUAL PRIMITIVES
// ============================================================================
export const EmptyState = {
    render: () => (_jsx(ChatPrimitive.Root, { messages: [], className: "h-[300px] border rounded-lg", children: _jsxs(ChatPrimitive.EmptyState, { className: "h-full flex flex-col items-center justify-center text-gray-500", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCAC" }), _jsx("p", { className: "text-lg font-medium", children: "No messages yet" }), _jsx("p", { className: "text-sm", children: "Send a message to start the conversation" })] }) })),
    name: 'Empty State',
    parameters: {
        docs: {
            description: {
                story: 'EmptyState only renders when there are no messages.',
            },
        },
    },
};
export const LoadingState = {
    render: () => (_jsxs(ChatPrimitive.Root, { messages: sampleMessages.slice(0, 2), isLoading: true, className: "h-[300px] border rounded-lg", children: [_jsx(ChatPrimitive.Messages, { className: "flex-1 overflow-y-auto p-4 space-y-4", children: sampleMessages.slice(0, 2).map((msg) => (_jsx(ChatPrimitive.Message, { message: msg, children: _jsx("div", { className: `p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-100'} max-w-[80%]`, children: _jsx(ChatPrimitive.MessageContent, {}) }) }, msg.id))) }), _jsx(ChatPrimitive.LoadingIndicator, { className: "p-4 border-t", children: _jsxs("div", { className: "flex items-center gap-2 text-gray-500", children: [_jsxs("div", { className: "flex gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: '0ms' } }), _jsx("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: '150ms' } }), _jsx("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: '300ms' } })] }), _jsx("span", { children: "AI is thinking..." })] }) })] })),
    name: 'Loading State',
    parameters: {
        docs: {
            description: {
                story: 'LoadingIndicator only renders when isLoading is true.',
            },
        },
    },
};
//# sourceMappingURL=ChatPrimitives.stories.js.map