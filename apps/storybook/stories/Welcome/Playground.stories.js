import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChatWindow } from '@clarity-chat/react';
import { StatusBadge } from '../../.storybook/blocks';
import { useState } from 'react';
const meta = {
    title: 'Welcome/Playground',
    parameters: {
        docs: {
            description: {
                component: `
# Interactive Playground

Try out Clarity Chat components in this interactive playground. Experiment with different configurations, themes, and features to see how they work together.

## What You Can Do

- **Test Components** - Try different component combinations
- **Explore Themes** - Switch between 11+ built-in themes
- **Customize Props** - Adjust component properties in real-time
- **Copy Code** - Copy working examples to your project

## Getting Started

Use the controls below to configure the components and see live updates. All examples are production-ready and can be copied directly into your application.
        `,
            },
        },
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;
export const InteractiveChat = {
    render: () => {
        const [messages, setMessages] = useState([
            {
                id: '1',
                role: 'assistant',
                content: 'Welcome to the Clarity Chat Playground! Try sending a message below.',
                timestamp: new Date(Date.now() - 60000),
            },
        ]);
        const handleSubmit = (content) => {
            if (!content.trim())
                return;
            const userMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: content,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);
            // Simulate AI response
            setTimeout(() => {
                const aiMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `You said: "${content}". This is a demo playground - messages don't actually get sent to an AI. Try exploring other stories to see real examples!`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMessage]);
            }, 500);
        };
        return (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Interactive Playground" }), _jsx(StatusBadge, { status: "experimental" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Test drive Clarity Chat components in this live playground. Try sending messages, switching themes, and exploring different configurations." })] }), _jsx("div", { className: "bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden", children: _jsx(ChatWindow, { className: "h-[600px]", messages: messages, onSendMessage: handleSubmit, isLoading: false }) }), _jsxs("div", { className: "mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800", children: [_jsxs("h3", { className: "text-lg font-semibold mb-3 flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: "\uD83D\uDCA1" }), " Try These Next"] }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsxs("li", { children: [_jsx("strong", { children: "Components:" }), " Explore individual components in the Components section"] }), _jsxs("li", { children: [_jsx("strong", { children: "Themes:" }), " Check out the Foundation/Colors & Themes story to see all available themes"] }), _jsxs("li", { children: [_jsx("strong", { children: "Hooks:" }), " Learn how to use hooks like useChat and useClarityChat"] }), _jsxs("li", { children: [_jsx("strong", { children: "Examples:" }), " See complete examples of real-world use cases"] })] })] })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive playground for experimenting with Clarity Chat components.',
            },
        },
    },
};
//# sourceMappingURL=Playground.stories.js.map