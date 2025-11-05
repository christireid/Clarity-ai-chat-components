import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, ScrollArea, cn, } from '@clarity-chat/primitives';
import { ContextCard } from './context-card';
import { FileUpload } from './file-upload';
export const ContextManager = React.memo(function ContextManager({ contexts, onAdd, onRemove, onToggle, onPreview, maxContexts = 20, allowedTypes = ['document', 'image', 'video', 'link', 'text'], className, }) {
    const [showUpload, setShowUpload] = React.useState(false);
    const [filter, setFilter] = React.useState('all');
    const filteredContexts = React.useMemo(() => {
        if (filter === 'all')
            return contexts;
        return contexts.filter((c) => c.type === filter);
    }, [contexts, filter]);
    const activeCount = contexts.filter((c) => c.isActive).length;
    const typeStats = React.useMemo(() => {
        const stats = {
            document: 0,
            image: 0,
            video: 0,
            audio: 0,
            link: 0,
            text: 0,
        };
        contexts.forEach((c) => {
            stats[c.type] = (stats[c.type] || 0) + 1;
        });
        return stats;
    }, [contexts]);
    const handleUpload = async (files) => {
        // Convert files to Context objects
        const newContexts = files.map((file) => ({
            id: `${Date.now()}-${file.name}`,
            projectId: '', // Will be set by parent
            type: file.type.startsWith('image/')
                ? 'image'
                : file.type.startsWith('video/')
                    ? 'video'
                    : file.type.startsWith('audio/')
                        ? 'audio'
                        : 'document',
            name: file.name,
            content: '', // Will be extracted
            url: URL.createObjectURL(file),
            metadata: {
                fileSize: file.size,
                mimeType: file.type,
            },
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        onAdd(newContexts);
        setShowUpload(false);
        return []; // Return empty array as upload handles context creation
    };
    const toggleAllActive = () => {
        const hasActive = contexts.some((c) => c.isActive);
        contexts.forEach((c) => {
            if (hasActive) {
                if (c.isActive)
                    onToggle(c.id);
            }
            else {
                if (!c.isActive)
                    onToggle(c.id);
            }
        });
    };
    return (_jsxs(Card, { className: cn('h-full flex flex-col', className), children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: ["Context Manager", _jsxs(Badge, { variant: "secondary", children: [contexts.length, "/", maxContexts] })] }), _jsxs(CardDescription, { children: [activeCount, " active \u2022 ", contexts.length, " total"] })] }), _jsx(Button, { onClick: () => setShowUpload(!showUpload), disabled: contexts.length >= maxContexts, size: "sm", children: showUpload ? '✕ Cancel' : '+ Add Context' })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mt-4", children: [_jsxs(Button, { variant: filter === 'all' ? 'default' : 'outline', size: "sm", onClick: () => setFilter('all'), children: ["All (", contexts.length, ")"] }), allowedTypes.map((type) => (_jsxs(Button, { variant: filter === type ? 'default' : 'outline', size: "sm", onClick: () => setFilter(type), disabled: typeStats[type] === 0, children: [type.charAt(0).toUpperCase() + type.slice(1), " (", typeStats[type], ")"] }, type)))] }), contexts.length > 0 && (_jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: toggleAllActive, children: activeCount > 0 ? 'Deactivate All' : 'Activate All' }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => contexts.forEach((c) => onRemove(c.id)), className: "text-destructive", children: "Clear All" })] }))] }), _jsxs(CardContent, { className: "flex-1 overflow-hidden", children: [_jsx(AnimatePresence, { children: showUpload && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "mb-4", children: _jsx(FileUpload, { onUpload: handleUpload, maxFiles: maxContexts - contexts.length, acceptedFileTypes: allowedTypes.map((type) => {
                                    switch (type) {
                                        case 'image':
                                            return 'image/*';
                                        case 'video':
                                            return 'video/*';
                                        case 'audio':
                                            return 'audio/*';
                                        case 'document':
                                            return 'application/pdf,.doc,.docx,.txt';
                                        default:
                                            return '*';
                                    }
                                }) }) })) }), _jsx(ScrollArea, { className: "h-full", children: filteredContexts.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCE6" }), _jsx("p", { className: "text-sm font-medium", children: "No context added yet" }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Add documents, images, or links to provide context for your conversations" }), _jsx(Button, { onClick: () => setShowUpload(true), className: "mt-4", size: "sm", children: "Add First Context" })] })) : (_jsx("div", { className: "space-y-3 pb-4", children: _jsx(AnimatePresence, { children: filteredContexts.map((context) => (_jsx(ContextCard, { context: context, onRemove: onRemove, onToggle: onToggle, onPreview: onPreview }, context.id))) }) })) })] })] }));
});
ContextManager.displayName = 'ContextManager';
//# sourceMappingURL=context-manager.js.map