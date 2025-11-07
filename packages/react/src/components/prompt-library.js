import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Badge, ScrollArea, Textarea, cn, } from '@clarity-chat/primitives';
export const PromptLibrary = React.memo(function PromptLibrary({ prompts, categories = [], onUsePrompt, onSave, onEdit, onDelete, onToggleFavorite, className, }) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [showCreate, setShowCreate] = React.useState(false);
    const [editingPrompt, setEditingPrompt] = React.useState(null);
    const [sortBy, setSortBy] = React.useState('recent');
    // Create form state
    const [newPrompt, setNewPrompt] = React.useState({
        name: '',
        content: '',
        description: '',
        category: '',
        tags: [],
    });
    // Edit form state
    const [editForm, setEditForm] = React.useState({
        name: '',
        content: '',
        description: '',
        category: '',
        tags: [],
    });
    const filteredPrompts = React.useMemo(() => {
        let filtered = prompts;
        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((p) => p.name.toLowerCase().includes(query) ||
                p.content.toLowerCase().includes(query) ||
                p.tags.some((t) => t.toLowerCase().includes(query)));
        }
        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }
        // Sort
        filtered = [...filtered].sort((a, b) => {
            if (sortBy === 'name')
                return a.name.localeCompare(b.name);
            if (sortBy === 'usage')
                return b.usageCount - a.usageCount;
            if (sortBy === 'recent') {
                if (!a.lastUsed && !b.lastUsed)
                    return 0;
                if (!a.lastUsed)
                    return 1;
                if (!b.lastUsed)
                    return -1;
                return b.lastUsed.getTime() - a.lastUsed.getTime();
            }
            return 0;
        });
        return filtered;
    }, [prompts, searchQuery, selectedCategory, sortBy]);
    const categoryStats = React.useMemo(() => {
        const stats = {};
        prompts.forEach((p) => {
            const cat = p.category || 'uncategorized';
            stats[cat] = (stats[cat] || 0) + 1;
        });
        return stats;
    }, [prompts]);
    const handleSavePrompt = () => {
        if (!newPrompt.name || !newPrompt.content)
            return;
        onSave?.({
            userId: '', // Will be set by parent
            name: newPrompt.name,
            content: newPrompt.content,
            description: newPrompt.description,
            category: newPrompt.category,
            tags: newPrompt.tags,
            variables: [],
            usageCount: 0,
            isFavorite: false,
        });
        setNewPrompt({
            name: '',
            content: '',
            description: '',
            category: '',
            tags: [],
        });
        setShowCreate(false);
    };
    const handleEditPrompt = (prompt) => {
        setEditingPrompt(prompt);
        setEditForm({
            name: prompt.name,
            content: prompt.content,
            description: prompt.description || '',
            category: prompt.category || '',
            tags: prompt.tags || [],
        });
        setShowCreate(false); // Close create form if open
    };
    const handleSaveEdit = () => {
        if (!editingPrompt || !editForm.name || !editForm.content)
            return;
        onEdit?.(editingPrompt.id, {
            name: editForm.name,
            content: editForm.content,
            description: editForm.description,
            category: editForm.category,
            tags: editForm.tags,
        });
        setEditingPrompt(null);
        setEditForm({
            name: '',
            content: '',
            description: '',
            category: '',
            tags: [],
        });
    };
    const handleCancelEdit = () => {
        setEditingPrompt(null);
        setEditForm({
            name: '',
            content: '',
            description: '',
            category: '',
            tags: [],
        });
    };
    const favorites = prompts.filter((p) => p.isFavorite);
    return (_jsxs(Card, { className: cn('h-full flex flex-col', className), children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: ["Prompt Library", _jsx(Badge, { variant: "secondary", children: prompts.length })] }), _jsxs(CardDescription, { children: [favorites.length, " favorites \u2022", ' ', prompts.reduce((sum, p) => sum + p.usageCount, 0), " total uses"] })] }), onSave && (_jsx(Button, { onClick: () => setShowCreate(!showCreate), size: "sm", children: showCreate ? '✕ Cancel' : '+ New Prompt' }))] }), _jsxs("div", { className: "space-y-2 mt-4", children: [_jsx(Input, { placeholder: "Search prompts...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), icon: _jsx("span", { children: "\uD83D\uDD0D" }), iconPosition: "left" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "text-sm border rounded px-2 py-1 bg-background", children: [_jsx("option", { value: "recent", children: "Recently Used" }), _jsx("option", { value: "name", children: "Name" }), _jsx("option", { value: "usage", children: "Most Used" })] }), _jsxs("div", { className: "flex flex-wrap gap-1 flex-1", children: [_jsxs(Button, { variant: selectedCategory === 'all' ? 'default' : 'outline', size: "sm", onClick: () => setSelectedCategory('all'), children: ["All (", prompts.length, ")"] }), categories.map((cat) => (_jsxs(Button, { variant: selectedCategory === cat.name ? 'default' : 'outline', size: "sm", onClick: () => setSelectedCategory(cat.name), children: [cat.icon, " ", cat.name, " (", categoryStats[cat.name] || 0, ")"] }, cat.id)))] })] })] })] }), _jsxs(CardContent, { className: "flex-1 overflow-hidden", children: [_jsx(AnimatePresence, { children: showCreate && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "mb-4 p-4 border rounded-lg space-y-3", children: [_jsx("h3", { className: "font-semibold text-sm", children: "Create New Prompt" }), _jsx(Input, { placeholder: "Prompt name", value: newPrompt.name, onChange: (e) => setNewPrompt({ ...newPrompt, name: e.target.value }) }), _jsx(Textarea, { placeholder: "Prompt content... Use {{variable}} for variables", value: newPrompt.content, onChange: (e) => setNewPrompt({ ...newPrompt, content: e.target.value }), rows: 4 }), _jsx(Input, { placeholder: "Description (optional)", value: newPrompt.description, onChange: (e) => setNewPrompt({ ...newPrompt, description: e.target.value }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleSavePrompt, disabled: !newPrompt.name || !newPrompt.content, children: "Save Prompt" }), _jsx(Button, { variant: "outline", onClick: () => setShowCreate(false), children: "Cancel" })] })] })) }), _jsx(AnimatePresence, { children: editingPrompt && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "mb-4 p-4 border-2 border-primary rounded-lg space-y-3 bg-primary/5", children: [_jsxs("h3", { className: "font-semibold text-sm flex items-center gap-2", children: ["\u270F\uFE0F Edit Prompt: ", editingPrompt.name] }), _jsx(Input, { placeholder: "Prompt name", value: editForm.name, onChange: (e) => setEditForm({ ...editForm, name: e.target.value }) }), _jsx(Textarea, { placeholder: "Prompt content... Use {{variable}} for variables", value: editForm.content, onChange: (e) => setEditForm({ ...editForm, content: e.target.value }), rows: 4 }), _jsx(Input, { placeholder: "Description (optional)", value: editForm.description, onChange: (e) => setEditForm({ ...editForm, description: e.target.value }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleSaveEdit, disabled: !editForm.name || !editForm.content, children: "Save Changes" }), _jsx(Button, { variant: "outline", onClick: handleCancelEdit, children: "Cancel" })] })] })) }), _jsx(ScrollArea, { className: "h-full", children: filteredPrompts.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCA1" }), _jsx("p", { className: "text-sm font-medium", children: "No prompts found" }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: searchQuery
                                        ? 'Try a different search'
                                        : 'Create your first prompt to get started' }), !searchQuery && onSave && (_jsx(Button, { onClick: () => setShowCreate(true), className: "mt-4", size: "sm", children: "Create First Prompt" }))] })) : (_jsx("div", { className: "space-y-2 pb-4", children: _jsx(AnimatePresence, { children: filteredPrompts.map((prompt) => (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, children: _jsx(Card, { className: "group hover:shadow-md transition-shadow", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-semibold text-sm", children: prompt.name }), prompt.isFavorite && (_jsx("span", { className: "text-sm", children: "\u2B50" }))] }), prompt.description && (_jsx("p", { className: "text-xs text-muted-foreground mt-1", children: prompt.description }))] }), _jsxs(Badge, { variant: "outline", className: "flex-shrink-0 text-xs", children: [prompt.usageCount, " uses"] })] }), _jsx("p", { className: "text-sm bg-muted/50 p-2 rounded text-muted-foreground line-clamp-2", children: prompt.content }), prompt.tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1", children: prompt.tags.map((tag) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: tag }, tag))) })), _jsxs("div", { className: "flex items-center gap-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx(Button, { size: "sm", onClick: () => onUsePrompt(prompt), children: "Use Prompt" }), onToggleFavorite && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onToggleFavorite(prompt.id), children: prompt.isFavorite
                                                                    ? '⭐ Unfavorite'
                                                                    : '☆ Favorite' })), onEdit && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEditPrompt(prompt), children: "\u270F\uFE0F Edit" })), onDelete && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                                    if (confirm(`Delete prompt "${prompt.name}"?`)) {
                                                                        onDelete(prompt.id);
                                                                    }
                                                                }, className: "ml-auto text-destructive", children: "\uD83D\uDDD1\uFE0F Delete" }))] })] }) }) }) }, prompt.id))) }) })) })] })] }));
});
PromptLibrary.displayName = 'PromptLibrary';
//# sourceMappingURL=prompt-library.js.map