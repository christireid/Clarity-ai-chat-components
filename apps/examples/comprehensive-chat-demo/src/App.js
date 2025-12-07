import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Comprehensive Chat Demo
 *
 * Demonstrates all modern AI chat features working together:
 * - Message operations (edit, regenerate, delete)
 * - Undo/Redo
 * - Export functionality
 * - Conversation branching
 * - Advanced search
 * - Command palette
 * - Citation display
 * - Conversation list
 * - Token tracking
 */
import { useState, useCallback, useEffect } from 'react';
import { ChatWindow, useMessageOperations, useTokenTracker, useAutoScroll, AdvancedMessageSearch, CommandPalette, CitationCard, ConversationList, TokenCounter, ExportDialog, ErrorBoundary, useCommandPaletteCommands, } from '@clarity-chat/react';
import '@clarity-chat/react/dist/styles/index.css';
function ComprehensiveChatApp() {
    // Folder management
    const [folders, setFolders] = useState([
        {
            id: 'folder-1',
            name: 'Work',
            createdAt: Date.now() - 172800000,
            conversationCount: 0,
        },
        {
            id: 'folder-2',
            name: 'Personal',
            createdAt: Date.now() - 86400000,
            conversationCount: 0,
        },
    ]);
    const [activeFolderId, setActiveFolderId] = useState(undefined);
    // Conversation management
    const [conversations, setConversations] = useState([
        {
            id: '1',
            title: 'Getting Started',
            preview: 'Hello! How can I help you?',
            timestamp: Date.now() - 86400000,
            messageCount: 2,
            isPinned: true,
            folderId: 'folder-1',
        },
        {
            id: '2',
            title: 'Quick Question',
            preview: 'What is React?',
            timestamp: Date.now() - 3600000,
            messageCount: 4,
            folderId: 'folder-2',
        },
    ]);
    const [activeConversationId, setActiveConversationId] = useState('1');
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [filteredMessages, setFilteredMessages] = useState([]);
    // Message operations
    const { messages: operationMessages, addMessage, editMessage, regenerateMessage, deleteMessage, branchConversation, switchToBranch, getBranches, currentBranchId, undo, redo, canUndo, canRedo, } = useMessageOperations({
        initialMessages: [
            {
                id: '1',
                chatId: activeConversationId,
                role: 'assistant',
                content: 'Hello! I\'m your comprehensive AI assistant. Try:\n- Editing messages\n- Using Ctrl+K for commands\n- Searching messages\n- Exporting conversations',
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
        chatId: activeConversationId,
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
    const [showSidebar, setShowSidebar] = useState(true);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const branches = getBranches();
    // Get selected message details
    const selectedMessage = selectedMessageId
        ? messages.find(m => m.id === selectedMessageId)
        : null;
    // Generate message operation commands
    const messageOperationCommands = useCommandPaletteCommands({
        selectedMessageId,
        isUserMessage: selectedMessage?.role === 'user',
        isAssistantMessage: selectedMessage?.role === 'assistant',
        onEdit: handleEdit,
        onRegenerate: handleRegenerate,
        onDelete: handleDelete,
        undo,
        redo,
        canUndo,
        canRedo,
    });
    // Command palette commands
    const commands = [
        {
            id: 'new-chat',
            label: 'New Chat',
            description: 'Start a new conversation',
            shortcut: ['Ctrl', 'N'],
            category: 'Conversation',
            onSelect: () => {
                const newId = Date.now().toString();
                setConversations(prev => [
                    {
                        id: newId,
                        title: 'New Chat',
                        preview: '',
                        timestamp: Date.now(),
                        messageCount: 0,
                    },
                    ...prev,
                ]);
                setActiveConversationId(newId);
                setShowCommandPalette(false);
            },
        },
        {
            id: 'export',
            label: 'Export Conversation',
            description: 'Export current conversation',
            shortcut: ['Ctrl', 'E'],
            category: 'Conversation',
            onSelect: () => {
                setShowExport(true);
                setShowCommandPalette(false);
            },
        },
        {
            id: 'search',
            label: 'Search Messages',
            description: 'Search through messages',
            shortcut: ['Ctrl', 'K'],
            category: 'Navigation',
            onSelect: () => {
                // Focus search input
                setShowCommandPalette(false);
            },
        },
        {
            id: 'undo',
            label: 'Undo',
            description: 'Undo last operation',
            shortcut: ['Ctrl', 'Z'],
            category: 'Edit',
            onSelect: () => {
                undo();
                setShowCommandPalette(false);
            },
        },
        {
            id: 'redo',
            label: 'Redo',
            description: 'Redo last undone operation',
            shortcut: ['Ctrl', 'Y'],
            category: 'Edit',
            onSelect: () => {
                redo();
                setShowCommandPalette(false);
            },
        },
        {
            id: 'toggle-sidebar',
            label: 'Toggle Sidebar',
            description: 'Show/hide conversation list',
            shortcut: ['Ctrl', 'B'],
            category: 'View',
            onSelect: () => {
                setShowSidebar(prev => !prev);
                setShowCommandPalette(false);
            },
        },
        // Add message operation commands
        ...messageOperationCommands,
    ];
    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Command palette (Ctrl+K or Cmd+K)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowCommandPalette(true);
            }
            // Undo (Ctrl+Z)
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                if (canUndo)
                    undo();
            }
            // Redo (Ctrl+Y or Ctrl+Shift+Z)
            if (((e.ctrlKey || e.metaKey) && e.key === 'y') ||
                ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey)) {
                e.preventDefault();
                if (canRedo)
                    redo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, undo, redo]);
    // Handle edit
    const handleEdit = useCallback((messageId) => {
        const message = messages.find(m => m.id === messageId);
        if (!message)
            return;
        const newContent = prompt('Edit message:', message.content) || message.content;
        if (newContent !== message.content) {
            editMessage(messageId, newContent);
        }
        setSelectedMessageId(null);
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
                const responseContent = `[Regenerated] You said: "${userMessage.content}". This is a regenerated response.`;
                addMessage({
                    chatId: activeConversationId,
                    role: 'assistant',
                    content: responseContent,
                });
                const tokens = Math.ceil(responseContent.length / 4);
                addOutputTokens(tokens);
            }
        }
        finally {
            setIsLoading(false);
        }
    }, [messages, deleteMessage, addMessage, activeConversationId, addOutputTokens]);
    // Handle delete
    const handleDelete = useCallback((messageId) => {
        if (confirm('Delete this message?')) {
            deleteMessage(messageId);
            if (selectedMessageId === messageId) {
                setSelectedMessageId(null);
            }
        }
    }, [deleteMessage, selectedMessageId]);
    // Handle send
    const handleSend = useCallback(async (content) => {
        addMessage({
            chatId: activeConversationId,
            role: 'user',
            content,
        });
        const userTokens = Math.ceil(content.length / 4);
        addInputTokens(userTokens);
        // Update conversation preview
        setConversations(prev => prev.map(c => c.id === activeConversationId
            ? { ...c, preview: content.slice(0, 50), messageCount: c.messageCount + 1 }
            : c));
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const responseContent = `You said: "${content}". This is a comprehensive demo response.`;
            addMessage({
                chatId: activeConversationId,
                role: 'assistant',
                content: responseContent,
            });
            const aiTokens = Math.ceil(responseContent.length / 4);
            addOutputTokens(aiTokens);
        }
        finally {
            setIsLoading(false);
        }
    }, [addMessage, activeConversationId, addInputTokens, addOutputTokens]);
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
    // Sample citations (for demo)
    const sampleCitations = [
        {
            id: '1',
            url: 'https://example.com/doc1',
            title: 'Documentation Example',
            chunkText: 'This is a sample citation from a document. It provides context for the AI response.',
            metadata: { source: 'docs', page: 1 },
            confidence: 0.95,
        },
    ];
    return (_jsxs("div", { style: {
            display: 'flex',
            height: '100vh',
            background: 'white',
        }, children: [showSidebar && (_jsxs("div", { style: {
                    width: '300px',
                    borderRight: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                }, children: [_jsx("div", { style: { padding: '1rem', borderBottom: '1px solid #e5e7eb' }, children: _jsx("h2", { style: { margin: 0, fontSize: '1.25rem', fontWeight: 600 }, children: "Conversations" }) }), _jsx(ConversationList, { conversations: conversations, folders: folders, activeId: activeConversationId, activeFolderId: activeFolderId, onSelect: setActiveConversationId, onFolderSelect: setActiveFolderId, onDelete: (id) => {
                            setConversations(prev => prev.filter(c => c.id !== id));
                            if (id === activeConversationId && conversations.length > 1) {
                                setActiveConversationId(conversations.find(c => c.id !== id)?.id || conversations[0].id);
                            }
                        }, onDeleteFolder: (folderId) => {
                            setFolders(prev => prev.filter(f => f.id !== folderId));
                            setConversations(prev => prev.map(c => c.folderId === folderId ? { ...c, folderId: undefined } : c));
                            if (activeFolderId === folderId) {
                                setActiveFolderId(undefined);
                            }
                        }, onMoveToFolder: (conversationId, folderId) => {
                            setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, folderId: folderId || undefined } : c));
                        }, onCreateFolder: (name) => {
                            const newFolder = {
                                id: `folder-${Date.now()}`,
                                name,
                                createdAt: Date.now(),
                                conversationCount: 0,
                            };
                            setFolders(prev => [...prev, newFolder]);
                        }, onTogglePin: (id) => {
                            setConversations(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
                        }, showSearch: true, showFilters: true, showSort: true, showFolders: true })] })), _jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: {
                            padding: '1rem',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem',
                        }, children: [_jsxs("div", { children: [_jsx("h1", { style: { margin: 0, fontSize: '1.5rem', fontWeight: 600 }, children: "Comprehensive Chat Demo" }), _jsx("p", { style: { margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' }, children: "All features working together" })] }), _jsxs("div", { style: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }, children: [branches.size > 1 && (_jsx("select", { value: currentBranchId, onChange: (e) => switchToBranch(e.target.value), style: {
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
                                        }, children: "\uD83D\uDCE5 Export" }), _jsx(TokenCounter, { tokens: totalTokens, cost: estimatedCost }), _jsx("button", { onClick: () => setShowSidebar(!showSidebar), style: {
                                            padding: '0.5rem',
                                            background: '#f3f4f6',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer',
                                        }, title: "Toggle Sidebar (Ctrl+B)", children: showSidebar ? '◀' : '▶' })] })] }), _jsx("div", { style: { padding: '1rem', borderBottom: '1px solid #e5e7eb' }, children: _jsx(AdvancedMessageSearch, { messages: messages, onResultsChange: setFilteredMessages, enableAdvancedFilters: true, placeholder: "Search messages..." }) }), _jsxs("div", { ref: scrollRef, style: { flex: 1, overflow: 'auto' }, children: [_jsx(ChatWindow, { messages: filteredMessages.length > 0 ? filteredMessages : messages, isLoading: isLoading, onSendMessage: handleSend, onEditMessage: handleEdit, onRegenerateMessage: handleRegenerate, onDeleteMessage: handleDelete }), messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (_jsxs("div", { style: { padding: '1rem', borderTop: '1px solid #e5e7eb' }, children: [_jsx("h3", { style: { fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }, children: "Sources:" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: sampleCitations.map(citation => (_jsx(CitationCard, { citation: citation, showConfidence: true, onSourceClick: (url) => window.open(url, '_blank') }, citation.id))) })] }))] })] }), _jsx(CommandPalette, { items: commands, open: showCommandPalette, onClose: () => setShowCommandPalette(false) }), showExport && (_jsx(ExportDialog, { open: showExport, onOpenChange: setShowExport, onExport: handleExport, resourceType: "chat", resourceName: "Comprehensive Chat Conversation" }))] }));
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
                    }, children: "Reload Page" })] })), children: _jsx(ComprehensiveChatApp, {}) }));
}
//# sourceMappingURL=App.js.map