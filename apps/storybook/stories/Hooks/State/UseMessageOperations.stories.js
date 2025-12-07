import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMessageOperations } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
import { useState } from 'react';
/**
 * **useMessageOperations Hook**
 *
 * Comprehensive hook for managing message CRUD operations with undo/redo,
 * editing, regeneration, and conversation branching.
 *
 * **Key Features:**
 * - Add, edit, delete messages
 * - Undo/redo functionality
 * - Message editing with versioning
 * - Message regeneration
 * - Conversation branching
 * - Operation history tracking
 *
 * **Use Cases:**
 * - Chat applications with editing
 * - Conversation management
 * - Message history
 * - Branching conversations
 */
const meta = {
    title: 'Hooks/State/UseMessageOperations',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useMessageOperations\` hook provides comprehensive message management
with CRUD operations, undo/redo, editing, regeneration, and branching.

## Features

- ✅ Add, edit, delete messages
- ✅ Undo/redo functionality
- ✅ Message editing with versioning
- ✅ Message regeneration
- ✅ Conversation branching
- ✅ Operation history tracking

## Basic Usage

\`\`\`tsx
const {
  messages,
  addMessage,
  editMessage,
  deleteMessage,
  regenerateMessage,
  undo,
  redo,
  canUndo,
  canRedo
} = useMessageOperations({
  initialMessages: [],
  onEdit: (id, content) => console.log('Edited:', id, content),
  onRegenerate: (id) => console.log('Regenerating:', id)
})
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
function BasicOperationsDemo() {
    const { messages, addMessage, editMessage, deleteMessage, undo, redo, canUndo, canRedo, } = useMessageOperations({
        initialMessages: [],
    });
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const handleAdd = () => {
        if (!input.trim())
            return;
        addMessage({
            role: 'user',
            content: input,
        });
        setInput('');
    };
    const handleStartEdit = (id, content) => {
        setEditingId(id);
        setEditContent(content);
    };
    const handleSaveEdit = () => {
        if (editingId) {
            editMessage(editingId, editContent);
            setEditingId(null);
            setEditContent('');
        }
    };
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsx("div", { className: "border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto", children: messages.length === 0 ? (_jsx("div", { className: "text-center text-muted-foreground py-8", children: "No messages yet. Add a message to get started!" })) : (messages.map((msg) => (_jsx("div", { className: `p-3 rounded-lg border ${msg.role === 'user' ? 'bg-primary/10' : 'bg-muted'}`, children: editingId === msg.id ? (_jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: editContent, onChange: (e) => setEditContent(e.target.value), className: "w-full px-2 py-1 border rounded text-sm", rows: 3 }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", onClick: handleSaveEdit, children: "Save" }), _jsx(Button, { size: "sm", variant: "outline", onClick: handleCancelEdit, children: "Cancel" })] })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-xs font-medium mb-1", children: msg.role }), _jsx("div", { className: "text-sm", children: msg.content }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => handleStartEdit(msg.id, msg.content), children: "Edit" }), _jsx(Button, { size: "sm", variant: "destructive", onClick: () => deleteMessage(msg.id), children: "Delete" })] })] })) }, msg.id)))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAdd();
                            }
                        }, placeholder: "Type a message...", className: "flex-1 px-3 py-2 border rounded-lg" }), _jsx(Button, { onClick: handleAdd, disabled: !input.trim(), children: "Add" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: undo, disabled: !canUndo, children: "Undo" }), _jsx(Button, { variant: "outline", onClick: redo, disabled: !canRedo, children: "Redo" })] }), _jsxs("div", { className: "p-3 bg-muted rounded-lg text-xs space-y-1", children: [_jsxs("div", { children: [_jsx("strong", { children: "Messages:" }), " ", messages.length] }), _jsxs("div", { children: [_jsx("strong", { children: "Can Undo:" }), " ", canUndo ? 'Yes' : 'No'] }), _jsxs("div", { children: [_jsx("strong", { children: "Can Redo:" }), " ", canRedo ? 'Yes' : 'No'] })] })] }));
}
export const BasicOperations = {
    render: () => _jsx(BasicOperationsDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Basic message operations: add, edit, delete with undo/redo support.',
            },
        },
    },
};
function MessageEditingDemo() {
    const { messages, addMessage, editMessage, startEditing, cancelEditing } = useMessageOperations({
        initialMessages: [
            {
                id: '1',
                role: 'user',
                content: 'Hello, this is a message that can be edited.',
                timestamp: Date.now(),
            },
            {
                id: '2',
                role: 'assistant',
                content: 'This is a response that can also be edited.',
                timestamp: Date.now(),
            },
        ],
    });
    const [input, setInput] = useState('');
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsx("div", { className: "border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto", children: messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg border ${msg.role === 'user' ? 'bg-primary/10' : 'bg-muted'} ${msg.isEditing ? 'ring-2 ring-primary' : ''}`, children: [_jsxs("div", { className: "text-xs font-medium mb-1", children: [msg.role, " ", msg.version && `(v${msg.version})`] }), msg.isEditing ? (_jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { defaultValue: msg.content, className: "w-full px-2 py-1 border rounded text-sm", rows: 3, id: `edit-${msg.id}` }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", onClick: () => {
                                                const textarea = document.getElementById(`edit-${msg.id}`);
                                                if (textarea) {
                                                    editMessage(msg.id, textarea.value);
                                                }
                                            }, children: "Save" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => cancelEditing(msg.id), children: "Cancel" })] })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-sm", children: msg.content }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => startEditing(msg.id), className: "mt-2", children: "Edit" })] }))] }, msg.id))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                addMessage({ role: 'user', content: input });
                                setInput('');
                            }
                        }, placeholder: "Add a new message...", className: "flex-1 px-3 py-2 border rounded-lg" }), _jsx(Button, { onClick: () => addMessage({ role: 'user', content: input }), children: "Add" })] }), _jsxs("div", { className: "p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs", children: [_jsx("strong", { children: "Editing Mode:" }), " Click \"Edit\" on any message to enter editing mode. Messages track version numbers when edited."] })] }));
}
export const MessageEditing = {
    render: () => _jsx(MessageEditingDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates message editing with version tracking.',
            },
        },
    },
};
function RegenerationDemo() {
    const { messages, addMessage, regenerateMessage } = useMessageOperations({
        initialMessages: [
            {
                id: '1',
                role: 'user',
                content: 'Tell me a joke',
                timestamp: Date.now() - 60000,
            },
            {
                id: '2',
                role: 'assistant',
                content: 'Why did the chicken cross the road? To get to the other side!',
                timestamp: Date.now() - 30000,
            },
        ],
        onRegenerate: (id) => {
            console.log('Regenerating message:', id);
            // In a real app, this would trigger an API call
        },
    });
    const [input, setInput] = useState('');
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsx("div", { className: "border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto", children: messages.map((msg) => (_jsxs("div", { className: `p-3 rounded-lg border ${msg.role === 'user' ? 'bg-primary/10' : 'bg-muted'}`, children: [_jsx("div", { className: "text-xs font-medium mb-1", children: msg.role }), _jsx("div", { className: "text-sm", children: msg.content }), msg.role === 'assistant' && (_jsx(Button, { size: "sm", variant: "outline", onClick: () => regenerateMessage(msg.id), className: "mt-2", children: "Regenerate" }))] }, msg.id))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                addMessage({ role: 'user', content: input });
                                setInput('');
                            }
                        }, placeholder: "Ask for something to regenerate...", className: "flex-1 px-3 py-2 border rounded-lg" }), _jsx(Button, { onClick: () => addMessage({ role: 'user', content: input }), children: "Send" })] }), _jsxs("div", { className: "p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs", children: [_jsx("strong", { children: "Regeneration:" }), " Click \"Regenerate\" on assistant messages to request a new response. In a real app, this would trigger an API call."] })] }));
}
export const Regeneration = {
    render: () => _jsx(RegenerationDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates message regeneration functionality.',
            },
        },
    },
};
//# sourceMappingURL=UseMessageOperations.stories.js.map