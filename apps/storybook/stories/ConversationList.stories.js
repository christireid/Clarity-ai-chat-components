import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { ConversationList, } from '../../../packages/react/src/components/conversation-list';
const meta = {
    title: 'Components/ConversationList',
    component: ConversationList,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Animated conversation list with hover lift, staggered entry, search, filters, and delete animations. Features smooth height transitions and interactive elements.',
            },
        },
        layout: 'padded',
    },
};
export default meta;
// ============================================================================
// Mock Data
// ============================================================================
const createMockConversations = (count) => {
    const now = Date.now();
    const titles = [
        'Project Planning Discussion',
        'Code Review Notes',
        'Feature Requirements',
        'Bug Fixes and Updates',
        'Design System Feedback',
        'API Documentation',
        'Sprint Retrospective',
        'Team Standup Notes',
        'Customer Support Tickets',
        'Marketing Campaign Ideas',
    ];
    const previews = [
        'Let\'s discuss the timeline for the upcoming release...',
        'Found a few issues in the latest PR that need addressing...',
        'The new feature should include authentication and...',
        'Fixed the rendering bug in the chat component...',
        'The color palette looks great, but we should consider...',
        'Updated the REST API endpoints documentation...',
        'What went well this sprint and what can we improve?',
        'Quick sync on today\'s priorities and blockers...',
        'Customer reported an issue with file uploads...',
        'Brainstorming ideas for the Q4 campaign launch...',
    ];
    return Array.from({ length: count }, (_, i) => ({
        id: `conv-${i}`,
        title: titles[i % titles.length],
        preview: previews[i % previews.length],
        timestamp: now - i * 3600000, // 1 hour apart
        messageCount: Math.floor(Math.random() * 50) + 1,
        unreadCount: i < 3 ? Math.floor(Math.random() * 5) : 0,
        tags: i % 3 === 0 ? ['work', 'important'] : i % 3 === 1 ? ['personal'] : [],
        isPinned: i < 2,
        isFavorite: i === 1 || i === 4,
    }));
};
// ============================================================================
// Basic Examples
// ============================================================================
export const Default = {
    render: () => {
        const [activeId, setActiveId] = React.useState('conv-0');
        const conversations = createMockConversations(10);
        return (_jsx("div", { className: "h-[600px] w-[400px] border rounded-lg", children: _jsx(ConversationList, { conversations: conversations, activeId: activeId, onSelect: setActiveId, onCreate: () => alert('Create new conversation') }) }));
    },
};
export const WithSearch = {
    render: () => {
        const [activeId, setActiveId] = React.useState('conv-0');
        const conversations = createMockConversations(20);
        return (_jsx("div", { className: "h-[600px] w-[400px] border rounded-lg", children: _jsx(ConversationList, { conversations: conversations, activeId: activeId, onSelect: setActiveId, showSearch: true }) }));
    },
};
export const WithFiltersAndSort = {
    render: () => {
        const [activeId, setActiveId] = React.useState('conv-0');
        const conversations = createMockConversations(15);
        return (_jsx("div", { className: "h-[600px] w-[400px] border rounded-lg", children: _jsx(ConversationList, { conversations: conversations, activeId: activeId, onSelect: setActiveId, showSearch: true, showFilters: true, showSort: true }) }));
    },
};
// ============================================================================
// Interactive Features
// ============================================================================
export const WithPinAndFavorite = {
    render: () => {
        const [conversations, setConversations] = React.useState(createMockConversations(10));
        const [activeId, setActiveId] = React.useState('conv-0');
        const handleTogglePin = (id) => {
            setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)));
        };
        const handleToggleFavorite = (id) => {
            setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)));
        };
        return (_jsx("div", { className: "h-[600px] w-[400px] border rounded-lg", children: _jsx(ConversationList, { conversations: conversations, activeId: activeId, onSelect: setActiveId, onTogglePin: handleTogglePin, onToggleFavorite: handleToggleFavorite }) }));
    },
};
export const WithDelete = {
    render: () => {
        const [conversations, setConversations] = React.useState(createMockConversations(10));
        const [activeId, setActiveId] = React.useState('conv-0');
        const handleDelete = (id) => {
            if (confirm('Delete this conversation?')) {
                setConversations((prev) => prev.filter((c) => c.id !== id));
                if (activeId === id) {
                    const remaining = conversations.filter((c) => c.id !== id);
                    setActiveId(remaining[0]?.id || '');
                }
            }
        };
        return (_jsx("div", { className: "h-[600px] w-[400px] border rounded-lg", children: _jsx(ConversationList, { conversations: conversations, activeId: activeId, onSelect: setActiveId, onDelete: handleDelete }) }));
    },
};
export const MultiSelect = {
    render: () => {
        const conversations = createMockConversations(10);
        const [selectedIds, setSelectedIds] = React.useState([]);
        const handleBulkDelete = () => {
            if (selectedIds.length > 0) {
                alert(`Delete ${selectedIds.length} conversations`);
                setSelectedIds([]);
            }
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "h-[600px] w-[400px] border rounded-lg", children: _jsx(ConversationList, { conversations: conversations, multiSelect: true, selectedIds: selectedIds, onSelectionChange: setSelectedIds, onSelect: () => { } }) }), selectedIds.length > 0 && (_jsxs("button", { onClick: handleBulkDelete, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700", children: ["Delete ", selectedIds.length, " selected"] }))] }));
    },
};
// ============================================================================
// Animation Showcase
// ============================================================================
export const StaggeredEntry = {
    render: () => {
        const [conversations, setConversations] = React.useState([]);
        const [activeId, setActiveId] = React.useState('');
        const loadConversations = () => {
            setConversations(createMockConversations(10));
        };
        const clearConversations = () => {
            setConversations([]);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: loadConversations, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Load Conversations (Watch Stagger)" }), _jsx("button", { onClick: clearConversations, className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700", children: "Clear" })] }), _jsx("div", { className: "h-[600px] w-[400px] border rounded-lg", children: _jsx(ConversationList, { conversations: conversations, activeId: activeId, onSelect: setActiveId }) })] }));
    },
};
export const DeleteAnimation = {
    render: () => {
        const [conversations, setConversations] = React.useState(createMockConversations(5));
        const [activeId, setActiveId] = React.useState('conv-0');
        const handleDelete = (id) => {
            setConversations((prev) => prev.filter((c) => c.id !== id));
            if (activeId === id) {
                const remaining = conversations.filter((c) => c.id !== id);
                setActiveId(remaining[0]?.id || '');
            }
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Click delete buttons to see slide-out animation (50ms stagger between remaining items)" }), _jsx("div", { className: "h-[600px] w-[400px] border rounded-lg", children: _jsx(ConversationList, { conversations: conversations, activeId: activeId, onSelect: setActiveId, onDelete: handleDelete }) })] }));
    },
};
// ============================================================================
// States
// ============================================================================
export const EmptyState = {
    render: () => {
        return (_jsx("div", { className: "h-[600px] w-[400px] border rounded-lg", children: _jsx(ConversationList, { conversations: [], onSelect: () => { }, onCreate: () => alert('Create new conversation') }) }));
    },
};
export const EmptySearchResults = {
    render: () => {
        const conversations = createMockConversations(10);
        return (_jsxs("div", { className: "h-[600px] w-[400px] border rounded-lg", children: [_jsx(ConversationList, { conversations: conversations, onSelect: () => { }, showSearch: true }), _jsx("p", { className: "p-4 text-sm text-muted-foreground", children: "Try searching for \"xyz\" to see empty state" })] }));
    },
};
// ============================================================================
// Real-World Example
// ============================================================================
export const FullFeatured = {
    render: () => {
        const [conversations, setConversations] = React.useState(createMockConversations(20));
        const [activeId, setActiveId] = React.useState('conv-0');
        const [selectedIds, setSelectedIds] = React.useState([]);
        const [multiSelect, setMultiSelect] = React.useState(false);
        const handleTogglePin = (id) => {
            setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)));
        };
        const handleToggleFavorite = (id) => {
            setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)));
        };
        const handleDelete = (id) => {
            if (confirm('Delete this conversation?')) {
                setConversations((prev) => prev.filter((c) => c.id !== id));
                if (activeId === id) {
                    const remaining = conversations.filter((c) => c.id !== id);
                    setActiveId(remaining[0]?.id || '');
                }
            }
        };
        const handleBulkDelete = () => {
            if (selectedIds.length > 0 && confirm(`Delete ${selectedIds.length} conversations?`)) {
                setConversations((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
                setSelectedIds([]);
            }
        };
        const handleCreate = () => {
            const newId = `conv-${Date.now()}`;
            setConversations((prev) => [
                {
                    id: newId,
                    title: 'New Conversation',
                    preview: 'Start chatting...',
                    timestamp: Date.now(),
                    messageCount: 0,
                    isPinned: false,
                    isFavorite: false,
                },
                ...prev,
            ]);
            setActiveId(newId);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setMultiSelect(!multiSelect), className: `px-4 py-2 rounded-lg transition-colors ${multiSelect
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: multiSelect ? 'Exit Multi-Select' : 'Multi-Select Mode' }), multiSelect && selectedIds.length > 0 && (_jsxs("button", { onClick: handleBulkDelete, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700", children: ["Delete ", selectedIds.length, " selected"] }))] }), _jsx("div", { className: "h-[600px] w-[400px] border rounded-lg", children: _jsx(ConversationList, { conversations: conversations, activeId: !multiSelect ? activeId : undefined, onSelect: setActiveId, onTogglePin: handleTogglePin, onToggleFavorite: handleToggleFavorite, onDelete: handleDelete, onCreate: handleCreate, showSearch: true, showFilters: true, showSort: true, multiSelect: multiSelect, selectedIds: selectedIds, onSelectionChange: setSelectedIds }) })] }));
    },
};
//# sourceMappingURL=ConversationList.stories.js.map