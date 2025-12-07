import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Advanced Chat Features Example
 *
 * Demonstrates all modern AI chat features:
 * - Message operations (edit, regenerate, delete)
 * - Undo/Redo
 * - Export functionality
 * - Conversation branching
 * - Token tracking
 * - Streaming support
 */
import { useState, useCallback } from 'react';
import { ChatWindow, useMessageOperations, useTokenTracker, useAutoScroll, TokenCounter, ExportDialog, ErrorBoundary, } from '@clarity-chat/react';
import '@clarity-chat/react/dist/styles/index.css';
function AdvancedChatApp() {
    // Message operations with full history
    const { messages: operationMessages, addMessage, editMessage, regenerateMessage, deleteMessage, branchConversation, switchToBranch, getBranches, currentBranchId, undo, redo, canUndo, canRedo, } = useMessageOperations({
        initialMessages: [
            {
                id: '1',
                chatId: 'advanced-chat',
                role: 'assistant',
                content: 'Welcome! I\'m an advanced AI assistant with full message operations support.\n\nTry:\n- Editing your messages\n- Regenerating my responses\n- Deleting messages\n- Using undo/redo\n- Branching conversations',
                timestamp: Date.now() - 5000,
            },
        ],
        onEdit: (messageId, newContent) => {
            console.log('Message edited:', messageId, newContent);
        },
        onRegenerate: (messageId) => {
            console.log('Regenerating:', messageId);
        },
        onDelete: (messageId) => {
            console.log('Message deleted:', messageId);
        },
        onBranch: (branchId, parentMessageId) => {
            console.log('Branched from:', parentMessageId, 'to:', branchId);
        },
    });
    // Convert to Message format
    const messages = operationMessages.map(msg => ({
        id: msg.id,
        chatId: 'advanced-chat',
        role: msg.role,
        content: msg.content,
        createdAt: new Date(msg.timestamp),
        updatedAt: new Date(msg.timestamp),
        status: 'sent',
    }));
    // Token tracking
    const { totalTokens, addInputTokens, addOutputTokens, estimatedCost, reset, } = useTokenTracker({
        modelName: 'gpt-4-turbo',
    });
    // Auto-scroll
    const { scrollRef } = useAutoScroll({
        dependencies: [messages],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const branches = getBranches();
    // Handle edit
    const handleEdit = useCallback((messageId) => {
        const message = messages.find(m => m.id === messageId);
        if (!message)
            return;
        const newContent = prompt('Edit message:', message.content) || message.content;
        if (newContent !== message.content) {
            editMessage(messageId, newContent);
            // Optionally re-send from this point
        }
    }, [messages, editMessage]);
    // Handle regenerate
    const handleRegenerate = useCallback(async (messageId) => {
        const message = messages.find(m => m.id === messageId);
        if (!message || message.role !== 'assistant')
            return;
        setIsLoading(true);
        try {
            const index = messages.findIndex(m => m.id === messageId);
            const userMessage = messages[index - 1];
            if (userMessage && userMessage.role === 'user') {
                deleteMessage(messageId);
                await new Promise(resolve => setTimeout(resolve, 300));
                const responseContent = `[Regenerated] You said: "${userMessage.content}". This is a regenerated response with different wording.`;
                addMessage({
                    chatId: 'advanced-chat',
                    role: 'assistant',
                    content: responseContent,
                });
                const tokens = Math.ceil(responseContent.length / 4);
                addOutputTokens(tokens);
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }
        finally {
            setIsLoading(false);
        }
    }, [messages, deleteMessage, addMessage, addOutputTokens]);
    // Handle delete
    const handleDelete = useCallback((messageId) => {
        if (confirm('Delete this message?')) {
            deleteMessage(messageId);
        }
    }, [deleteMessage]);
    // Handle send
    const handleSend = useCallback(async (content) => {
        addMessage({
            chatId: 'advanced-chat',
            role: 'user',
            content,
        });
        const userTokens = Math.ceil(content.length / 4);
        addInputTokens(userTokens);
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const responseContent = `You said: "${content}". This is a demo response showcasing advanced features.`;
            addMessage({
                chatId: 'advanced-chat',
                role: 'assistant',
                content: responseContent,
            });
            const aiTokens = Math.ceil(responseContent.length / 4);
            addOutputTokens(aiTokens);
        }
        finally {
            setIsLoading(false);
        }
    }, [addMessage, addInputTokens, addOutputTokens]);
    // Handle export
    const handleExport = useCallback(async (options) => {
        const format = options.format || 'markdown';
        let content = '';
        if (format === 'markdown') {
            content = messages.map(m => `## ${m.role === 'user' ? 'User' : 'Assistant'}\n\n${m.content}`).join('\n\n---\n\n');
        }
        else if (format === 'json') {
            content = JSON.stringify(messages, null, 2);
        }
        else {
            content = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
        }
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-${Date.now()}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        setShowExport(false);
    }, [messages]);
    return (_jsxs("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'white',
        }, children: [_jsxs("div", { style: {
                    padding: '1rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }, children: [_jsxs("div", { children: [_jsx("h1", { style: { margin: 0, fontSize: '1.5rem', fontWeight: 600 }, children: "Advanced Chat Features Demo" }), _jsx("p", { style: { margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' }, children: "Edit, regenerate, delete, branch, undo/redo, and export conversations" })] }), _jsxs("div", { style: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }, children: [branches.size > 1 && (_jsx("select", { value: currentBranchId, onChange: (e) => switchToBranch(e.target.value), style: {
                                    padding: '0.5rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                }, children: Array.from(branches.keys()).map(branchId => (_jsxs("option", { value: branchId, children: ["Branch ", branchId.slice(0, 8)] }, branchId))) })), _jsxs("div", { style: { display: 'flex', gap: '0.5rem' }, children: [_jsx("button", { onClick: undo, disabled: !canUndo, style: {
                                            padding: '0.5rem 1rem',
                                            background: canUndo ? '#f3f4f6' : '#e5e7eb',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.375rem',
                                            cursor: canUndo ? 'pointer' : 'not-allowed',
                                            fontSize: '0.875rem',
                                            opacity: canUndo ? 1 : 0.5,
                                        }, title: "Undo (Ctrl+Z)", children: "\u21B6 Undo" }), _jsx("button", { onClick: redo, disabled: !canRedo, style: {
                                            padding: '0.5rem 1rem',
                                            background: canRedo ? '#f3f4f6' : '#e5e7eb',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.375rem',
                                            cursor: canRedo ? 'pointer' : 'not-allowed',
                                            fontSize: '0.875rem',
                                            opacity: canRedo ? 1 : 0.5,
                                        }, title: "Redo (Ctrl+Y)", children: "\u21B7 Redo" })] }), _jsx("button", { onClick: () => setShowExport(true), style: {
                                    padding: '0.5rem 1rem',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                }, children: "\uD83D\uDCE5 Export" }), _jsx(TokenCounter, { tokens: totalTokens, cost: estimatedCost })] })] }), _jsx("div", { ref: scrollRef, style: { flex: 1, overflow: 'auto' }, children: _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSend, onEditMessage: handleEdit, onRegenerateMessage: handleRegenerate, onDeleteMessage: handleDelete }) }), showExport && (_jsx(ExportDialog, { open: showExport, onOpenChange: setShowExport, onExport: handleExport, resourceType: "chat", resourceName: "Advanced Chat Conversation" }))] }));
}
export default function App() {
    return (_jsx(ErrorBoundary, { fallback: (error) => (_jsxs("div", { style: {
                padding: '2rem',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto',
            }, children: [_jsx("h1", { style: { color: '#dc2626', fontSize: '1.5rem', marginBottom: '1rem' }, children: "Something went wrong" }), _jsx("p", { style: { color: '#6b7280', marginBottom: '1.5rem' }, children: error.message }), _jsx("button", { onClick: () => window.location.reload(), style: {
                        padding: '0.75rem 1.5rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 500,
                    }, children: "Reload Page" })] })), children: _jsx(AdvancedChatApp, {}) }));
}
//# sourceMappingURL=App.js.map