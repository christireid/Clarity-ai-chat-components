import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AdvancedChatInput } from '@clarity-chat/react';
import { useState } from 'react';
const meta = {
    title: 'Components/AdvancedChatInput',
    component: AdvancedChatInput,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};
export default meta;
// Mock prompts
const mockPrompts = [
    {
        id: '1',
        userId: 'user1',
        name: 'code-review',
        content: 'Please review this code and provide feedback on: 1) Code quality, 2) Best practices, 3) Potential bugs',
        description: 'Request a thorough code review',
        category: 'Development',
        tags: ['code', 'review'],
        variables: [],
        usageCount: 45,
        isFavorite: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        userId: 'user1',
        name: 'explain',
        content: 'Explain {{topic}} in simple terms that a beginner can understand',
        description: 'Simplify complex topics',
        category: 'Education',
        tags: ['explain', 'beginner'],
        variables: [{ name: 'topic', required: true }],
        usageCount: 32,
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        userId: 'user1',
        name: 'debug',
        content: 'Help me debug this issue: {{description}}. Provide step-by-step troubleshooting',
        description: 'Debug assistance',
        category: 'Development',
        tags: ['debug', 'help'],
        variables: [{ name: 'description', required: true }],
        usageCount: 28,
        isFavorite: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
const InteractiveStory = () => {
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState([]);
    const handleSubmit = (content, attachments) => {
        setMessages((prev) => [...prev, content]);
        console.log('Message submitted:', content, attachments);
    };
    const handleSuggestionRequest = async (query, trigger) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (trigger === '@') {
            return mockPrompts
                .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
                .map((p) => ({
                id: p.id,
                type: 'prompt',
                label: p.name,
                description: p.description,
                value: p.content,
                icon: '💡',
            }));
        }
        // Commands
        const commands = [
            { id: '1', type: 'command', label: 'help', description: 'Show available commands', value: '/help', icon: '❓' },
            { id: '2', type: 'command', label: 'clear', description: 'Clear conversation', value: '/clear', icon: '🧹' },
            { id: '3', type: 'command', label: 'export', description: 'Export chat history', value: '/export', icon: '📥' },
            { id: '4', type: 'command', label: 'model', description: 'Switch AI model', value: '/model', icon: '🤖' },
            { id: '5', type: 'command', label: 'summarize', description: 'Summarize conversation', value: '/summarize', icon: '📝' },
        ];
        return commands.filter((c) => c.label.includes(query.toLowerCase()));
    };
    const handleFileUpload = async (files) => {
        console.log('Files uploaded:', files);
        return files.map((file) => ({
            id: `${Date.now()}-${file.name}`,
            type: file.type.startsWith('image/') ? 'image' : 'document',
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
            mimeType: file.type,
        }));
    };
    return (_jsxs("div", { className: "space-y-4 max-w-4xl", children: [_jsxs("div", { className: "p-4 bg-muted rounded-lg", children: [_jsx("p", { className: "text-sm font-medium mb-2", children: "Try these features:" }), _jsxs("ul", { className: "text-sm space-y-1 text-muted-foreground", children: [_jsxs("li", { children: ["\u2022 Type ", _jsx("kbd", { className: "px-1 py-0.5 text-xs border rounded", children: "@" }), " to see prompt suggestions"] }), _jsxs("li", { children: ["\u2022 Type ", _jsx("kbd", { className: "px-1 py-0.5 text-xs border rounded", children: "/" }), " to see available commands"] }), _jsxs("li", { children: ["\u2022 Use ", _jsx("kbd", { className: "px-1 py-0.5 text-xs border rounded", children: "Tab" }), " or ", _jsx("kbd", { className: "px-1 py-0.5 text-xs border rounded", children: "Enter" }), " to autocomplete"] }), _jsx("li", { children: "\u2022 Click the \uD83D\uDCCE button or drag & drop files" }), _jsxs("li", { children: ["\u2022 Press ", _jsx("kbd", { className: "px-1 py-0.5 text-xs border rounded", children: "Enter" }), " to send, ", _jsx("kbd", { className: "px-1 py-0.5 text-xs border rounded", children: "Shift+Enter" }), " for new line"] })] })] }), messages.length > 0 && (_jsxs("div", { className: "p-4 bg-muted/50 rounded-lg space-y-2", children: [_jsx("p", { className: "font-semibold text-sm", children: "Sent Messages:" }), messages.map((msg, i) => (_jsx("div", { className: "p-2 bg-background rounded text-sm", children: msg }, i)))] })), _jsx(AdvancedChatInput, { value: value, onChange: setValue, onSubmit: handleSubmit, onSuggestionRequest: handleSuggestionRequest, onFileUpload: handleFileUpload, savedPrompts: mockPrompts, maxFiles: 5 })] }));
};
export const Interactive = {
    render: () => _jsx(InteractiveStory, {}),
};
export const WithCharacterLimit = {
    render: () => {
        const [value, setValue] = useState('');
        return (_jsx(AdvancedChatInput, { value: value, onChange: setValue, onSubmit: console.log, maxLength: 280 }));
    },
};
export const Disabled = {
    render: () => {
        const [value, setValue] = useState('This input is disabled...');
        return (_jsx(AdvancedChatInput, { value: value, onChange: setValue, onSubmit: console.log, disabled: true }));
    },
};
//# sourceMappingURL=AdvancedChatInput.stories.js.map