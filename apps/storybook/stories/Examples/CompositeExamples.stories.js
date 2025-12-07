import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChatWindow, ModelSelector, UsageDashboard, FollowUpSuggestions, KeyboardHint, } from '@clarity-chat/react';
import { useState } from 'react';
const meta = {
    title: 'Examples/CompositeExamples',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Composite examples showing multiple components working together in real-world scenarios.',
            },
        },
        layout: 'fullscreen',
    },
};
export default meta;
export const FullChatExperience = {
    render: () => {
        const [messages, setMessages] = useState([
            {
                id: '1',
                role: 'assistant',
                content: 'Hello! I can help you with React, TypeScript, and web development.',
                timestamp: Date.now(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
        ]);
        const [selectedModel, setSelectedModel] = useState('gpt-4-turbo');
        const [showShortcuts, setShowShortcuts] = useState(false);
        const handleSendMessage = (content) => {
            const userMessage = {
                id: Date.now().toString(),
                role: 'user',
                content,
                timestamp: Date.now(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            setMessages([...messages, userMessage]);
        };
        return (_jsxs("div", { className: "h-screen flex flex-col", children: [_jsxs("div", { className: "border-b p-4 flex items-center justify-between", children: [_jsx(ModelSelector, { models: [
                                { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
                                { id: 'claude-3', name: 'Claude 3', provider: 'anthropic' },
                            ], value: selectedModel, onChange: (model) => setSelectedModel(model) }), _jsx("button", { onClick: () => setShowShortcuts(!showShortcuts), className: "px-3 py-1 text-sm border rounded", children: "Shortcuts (?)" })] }), _jsxs("div", { className: "flex-1 relative", children: [_jsx(ChatWindow, { messages: messages, onSendMessage: handleSendMessage }), _jsx(KeyboardHint, { shortcuts: [
                                { keys: ['Ctrl', 'K'], description: 'Command palette', category: 'Navigation' },
                                { keys: ['Ctrl', 'Enter'], description: 'Send message', category: 'Actions' },
                                { keys: ['Esc'], description: 'Close', category: 'Navigation' },
                            ], visible: showShortcuts, onClose: () => setShowShortcuts(false), position: "center" })] })] }));
    },
};
export const ChatWithSuggestions = {
    render: () => {
        const [messages, setMessages] = useState([]);
        const [showSuggestions, setShowSuggestions] = useState(true);
        const handleSendMessage = (content) => {
            const userMessage = {
                id: Date.now().toString(),
                role: 'user',
                content,
                timestamp: Date.now(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            setMessages([...messages, userMessage]);
            setShowSuggestions(false);
        };
        const handleSuggestion = (suggestion) => {
            handleSendMessage(suggestion.title);
        };
        return (_jsxs("div", { className: "h-screen flex flex-col", children: [_jsx("div", { className: "flex-1", children: _jsx(ChatWindow, { messages: messages, onSendMessage: handleSendMessage }) }), showSuggestions && messages.length === 0 && (_jsx("div", { className: "border-t p-4 bg-muted/50", children: _jsx(FollowUpSuggestions, { suggestions: [
                            {
                                id: '1',
                                title: 'Examples/CompositeExamples',
                                description: 'Learn about React fundamentals',
                            },
                            {
                                id: '2',
                                title: 'Examples/CompositeExamples',
                                description: 'TypeScript code examples',
                            },
                            {
                                id: '3',
                                title: 'Examples/CompositeExamples',
                                description: 'Understanding React hooks',
                            },
                        ], onSelect: handleSuggestion }) }))] }));
    },
};
export const DashboardView = {
    render: () => {
        return (_jsxs("div", { className: "h-screen p-6 space-y-6 overflow-auto", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Usage Dashboard" }), _jsx(UsageDashboard, { usage: {
                                totalMessages: 1234,
                                totalTokens: 45678,
                                totalCost: 12.34,
                                period: 'last-30-days',
                            }, trends: {
                                messages: { current: 1234, previous: 1000, change: 23.4 },
                                tokens: { current: 45678, previous: 40000, change: 14.2 },
                                cost: { current: 12.34, previous: 10.00, change: 23.4 },
                            } })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Recent Activity" }), _jsx("div", { className: "border rounded-lg p-4", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Activity feed would go here..." }) })] })] }));
    },
};
export const ResponsiveLayout = {
    render: () => {
        const [messages, setMessages] = useState([]);
        return (_jsxs("div", { className: "h-screen flex flex-col md:flex-row", children: [_jsxs("div", { className: "hidden md:block w-64 border-r p-4", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Sidebar" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsx("li", { children: "Conversations" }), _jsx("li", { children: "Settings" }), _jsx("li", { children: "Help" })] })] }), _jsx("div", { className: "flex-1 flex flex-col", children: _jsx(ChatWindow, { messages: messages, onSendMessage: (content) => {
                            const msg = {
                                id: Date.now().toString(),
                                role: 'user',
                                content,
                                timestamp: Date.now(),
                                createdAt: Date.now(),
                                updatedAt: Date.now(),
                            };
                            setMessages([...messages, msg]);
                        } }) })] }));
    },
};
//# sourceMappingURL=CompositeExamples.stories.js.map