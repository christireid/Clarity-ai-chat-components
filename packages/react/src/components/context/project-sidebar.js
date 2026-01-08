'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, ScrollArea, cn } from '@clarity-chat/primitives';
import { formatRelativeTime } from '../../internal/helpers';
export function ProjectSidebar({ projects, selectedProjectId, selectedChatId, onProjectSelect, onProjectCreate, onProjectEdit, onProjectDelete, onChatSelect, onChatCreate, onChatEdit, onChatDelete, className, }) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [expandedProjects, setExpandedProjects] = React.useState(new Set(selectedProjectId ? [selectedProjectId] : []));
    const filteredProjects = React.useMemo(() => {
        if (!searchQuery)
            return projects;
        const query = searchQuery.toLowerCase();
        return projects.filter((p) => p.name.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query) ||
            p.chats.some((c) => c.name.toLowerCase().includes(query)));
    }, [projects, searchQuery]);
    const toggleProject = (projectId) => {
        setExpandedProjects((prev) => {
            const next = new Set(prev);
            if (next.has(projectId)) {
                next.delete(projectId);
            }
            else {
                next.add(projectId);
            }
            return next;
        });
    };
    const handleProjectClick = (project) => {
        onProjectSelect(project.id);
        // Auto-expand when selected
        setExpandedProjects((prev) => new Set(prev).add(project.id));
        // Auto-select first chat if none selected
        const firstChat = project.chats[0];
        if (!selectedChatId && firstChat) {
            onChatSelect(firstChat.id);
        }
    };
    return (_jsxs("div", { className: cn('flex flex-col h-full bg-muted/30 border-r', className), children: [_jsxs("div", { className: "p-4 border-b space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "font-semibold text-lg", children: "Projects" }), _jsx(Button, { onClick: onProjectCreate, size: "icon", variant: "ghost", title: "New Project", children: "\u2795" })] }), _jsx(Input, { placeholder: "Search projects & chats...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), icon: _jsx("span", { children: "\uD83D\uDD0D" }), iconPosition: "left" })] }), _jsx(ScrollArea, { className: "flex-1", children: _jsx("div", { className: "p-2 space-y-1", children: _jsx(AnimatePresence, { children: filteredProjects.length === 0 ? (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "flex flex-col items-center justify-center py-12 text-center px-4", children: [_jsx("div", { className: "text-4xl mb-2", children: "\uD83D\uDCC1" }), _jsx("p", { className: "text-sm font-medium", children: "No projects yet" }), _jsx("p", { className: "text-xs text-muted-foreground mt-1 mb-3", children: "Create a project to organize your chats" }), _jsx(Button, { onClick: onProjectCreate, size: "sm", children: "Create First Project" })] })) : (filteredProjects.map((project) => {
                            const isExpanded = expandedProjects.has(project.id);
                            const isSelected = project.id === selectedProjectId;
                            return (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, children: _jsxs("div", { className: cn('group rounded-lg transition-colors cursor-pointer', isSelected ? 'bg-accent' : 'hover:bg-accent/50'), children: [_jsxs("div", { className: "flex items-center gap-2 p-2", onClick: () => handleProjectClick(project), children: [_jsx("button", { onClick: (e) => {
                                                        e.stopPropagation();
                                                        toggleProject(project.id);
                                                    }, className: "flex-shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-transform", style: {
                                                        transform: isExpanded
                                                            ? 'rotate(90deg)'
                                                            : 'rotate(0deg)',
                                                    }, children: "\u25B6" }), _jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-lg", style: {
                                                        backgroundColor: project.color || '#6366f1',
                                                    }, children: project.icon || '📁' }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-medium text-sm truncate", children: project.name }), project.isPinned && (_jsx("span", { className: "text-xs", children: "\uD83D\uDCCC" }))] }), _jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [project.chats.length, " chat", project.chats.length !== 1 ? 's' : '', " \u2022", ' ', project.context.length, " context"] })] }), _jsxs("div", { className: "flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1", children: [onProjectEdit && (_jsx(Button, { variant: "ghost", size: "icon", onClick: (e) => {
                                                                e.stopPropagation();
                                                                onProjectEdit(project.id);
                                                            }, className: "h-6 w-6", children: "\u270F\uFE0F" })), onProjectDelete && (_jsx(Button, { variant: "ghost", size: "icon", onClick: (e) => {
                                                                e.stopPropagation();
                                                                if (confirm(`Delete project "${project.name}"?`)) {
                                                                    onProjectDelete(project.id);
                                                                }
                                                            }, className: "h-6 w-6 text-destructive", children: "\uD83D\uDDD1\uFE0F" }))] })] }), _jsx(AnimatePresence, { children: isExpanded && (_jsxs(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "ml-7 mr-2 mb-1 space-y-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: onChatCreate, className: "w-full justify-start text-xs", children: "\u2795 New Chat" }), project.chats.length === 0 ? (_jsx("p", { className: "text-xs text-muted-foreground py-2 px-3", children: "No chats yet" })) : (project.chats.map((chat) => {
                                                        const isChatSelected = chat.id === selectedChatId;
                                                        return (_jsxs("div", { className: cn('group/chat flex items-center gap-2 p-2 rounded text-sm transition-colors cursor-pointer', isChatSelected
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'hover:bg-accent'), onClick: (e) => {
                                                                e.stopPropagation();
                                                                onChatSelect(chat.id);
                                                            }, children: [_jsx("span", { className: "flex-shrink-0", children: "\uD83D\uDCAC" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("p", { className: "font-medium text-xs truncate", children: chat.name }), chat.isPinned && (_jsx("span", { className: "text-xs", children: "\uD83D\uDCCC" })), chat.isFavorite && (_jsx("span", { className: "text-xs", children: "\u2B50" }))] }), chat.lastMessageAt && (_jsx("p", { className: "text-xs opacity-70", children: formatRelativeTime(chat.lastMessageAt) }))] }), _jsxs("div", { className: "flex-shrink-0 opacity-0 group-hover/chat:opacity-100 transition-opacity flex gap-1", children: [onChatEdit && (_jsx(Button, { variant: "ghost", size: "icon", onClick: (e) => {
                                                                                e.stopPropagation();
                                                                                onChatEdit(chat.id);
                                                                            }, className: "h-5 w-5", children: "\u270F\uFE0F" })), onChatDelete && (_jsx(Button, { variant: "ghost", size: "icon", onClick: (e) => {
                                                                                e.stopPropagation();
                                                                                if (confirm(`Delete chat "${chat.name}"?`)) {
                                                                                    onChatDelete(chat.id);
                                                                                }
                                                                            }, className: "h-5 w-5 text-destructive", children: "\uD83D\uDDD1\uFE0F" }))] })] }, chat.id));
                                                    }))] })) })] }) }, project.id));
                        })) }) }) }), projects.length > 0 && (_jsx("div", { className: "p-4 border-t", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("span", { children: [projects.length, " projects"] }), _jsxs("span", { children: [projects.reduce((sum, p) => sum + p.chats.length, 0), " total chats"] })] }) }))] }));
}
ProjectSidebar.displayName = 'ProjectSidebar';
//# sourceMappingURL=project-sidebar.js.map