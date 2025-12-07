/**
 * Message Threading Examples
 *
 * Demonstrates various patterns for implementing Slack-style message threading
 * in chat applications using the MessageThreadView and ThreadList components.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { MessageThreadView, ThreadList, Message, } from '@clarity-chat/react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@clarity-chat/primitives';
// =============================================================================
// Example 1: Basic Inline Threading
// =============================================================================
/**
 * Basic inline threading - threads appear directly below parent messages
 */
export function BasicThreadingExample() {
    const [messages, setMessages] = React.useState([
        {
            id: '1',
            role: 'user',
            content: 'What are the best practices for React hooks?',
            timestamp: Date.now() - 60000,
        },
        {
            id: '2',
            role: 'assistant',
            content: 'Here are the key React hooks best practices...',
            timestamp: Date.now() - 50000,
        },
    ]);
    const [threads, setThreads] = React.useState([]);
    const handleCreateThread = (parentMessageId) => {
        const newThread = {
            id: `thread-${Date.now()}`,
            parentMessageId,
            messages: [],
            participants: [],
            unreadCount: 0,
            lastActivity: Date.now(),
            isArchived: false,
            metadata: {
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
        };
        setThreads(prev => [...prev, newThread]);
    };
    const handleThreadReply = (threadId, content) => {
        setThreads(prev => prev.map(thread => {
            if (thread.id === threadId) {
                const newMessage = {
                    id: `msg-${Date.now()}`,
                    role: 'user',
                    content,
                    timestamp: Date.now(),
                };
                return {
                    ...thread,
                    messages: [...thread.messages, newMessage],
                    lastActivity: Date.now(),
                    metadata: {
                        ...thread.metadata,
                        updatedAt: Date.now(),
                    },
                };
            }
            return thread;
        }));
    };
    return (_jsxs("div", { className: "space-y-4 p-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Basic Inline Threading" }), _jsx("div", { className: "space-y-4", children: messages.map(message => {
                    const thread = threads.find(t => t.parentMessageId === message.id);
                    return (_jsxs("div", { children: [_jsx(Message, { message: message }), _jsx(MessageThreadView, { parentMessage: message, thread: thread, config: {
                                    maxDepth: 3,
                                    showPreview: true,
                                    previewLength: 100,
                                    collapseThreshold: 10,
                                    notificationsEnabled: true,
                                }, onSendMessage: (content) => {
                                    if (thread) {
                                        handleThreadReply(thread.id, content);
                                    }
                                }, onCreateThread: () => handleCreateThread(message.id), layout: "inline" })] }, message.id));
                }) })] }));
}
// =============================================================================
// Example 2: Sidebar Threading (Like Slack)
// =============================================================================
/**
 * Sidebar threading - threads open in a separate panel
 * More suitable for desktop applications
 */
export function SidebarThreadingExample() {
    const [messages, setMessages] = React.useState([
        {
            id: '1',
            role: 'user',
            content: 'How do I optimize React performance?',
            timestamp: Date.now() - 60000,
        },
        {
            id: '2',
            role: 'assistant',
            content: 'Here are key performance optimization techniques...',
            timestamp: Date.now() - 50000,
        },
    ]);
    const [threads, setThreads] = React.useState([]);
    const [selectedThread, setSelectedThread] = React.useState(null);
    const handleCreateThread = (parentMessageId) => {
        const newThread = {
            id: `thread-${Date.now()}`,
            parentMessageId,
            messages: [],
            participants: [],
            unreadCount: 0,
            lastActivity: Date.now(),
            isArchived: false,
        };
        setThreads(prev => [...prev, newThread]);
        setSelectedThread(newThread);
    };
    const handleThreadReply = (content) => {
        if (!selectedThread)
            return;
        setThreads(prev => prev.map(thread => {
            if (thread.id === selectedThread.id) {
                const newMessage = {
                    id: `msg-${Date.now()}`,
                    role: 'user',
                    content,
                    timestamp: Date.now(),
                };
                const updatedThread = {
                    ...thread,
                    messages: [...thread.messages, newMessage],
                    lastActivity: Date.now(),
                };
                setSelectedThread(updatedThread);
                return updatedThread;
            }
            return thread;
        }));
    };
    return (_jsxs("div", { className: "grid grid-cols-3 gap-4 h-screen p-4", children: [_jsxs("div", { className: "col-span-2 space-y-4 overflow-auto", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Sidebar Threading" }), messages.map(message => {
                        const thread = threads.find(t => t.parentMessageId === message.id);
                        return (_jsxs("div", { children: [_jsx(Message, { message: message }), thread && (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setSelectedThread(thread), className: "mt-2", children: [thread.messages.length, " ", thread.messages.length === 1 ? 'reply' : 'replies', thread.unreadCount > 0 && (_jsxs("span", { className: "ml-2 text-destructive", children: ["(", thread.unreadCount, " new)"] }))] })), !thread && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleCreateThread(message.id), className: "mt-2", children: "Start thread" }))] }, message.id));
                    })] }), _jsx("div", { className: "border-l pl-4 overflow-auto", children: selectedThread ? (_jsx(MessageThreadView, { parentMessage: messages.find(m => m.id === selectedThread.parentMessageId), thread: selectedThread, config: {
                        maxDepth: 5,
                        showPreview: false,
                        previewLength: 0,
                        collapseThreshold: 20,
                        notificationsEnabled: true,
                    }, onSendMessage: handleThreadReply, onCreateThread: () => { }, layout: "sidebar", onClose: () => setSelectedThread(null) })) : (_jsx("div", { className: "text-center text-muted-foreground mt-8", children: "Select a thread to view" })) })] }));
}
// =============================================================================
// Example 3: Thread Browser with ThreadList
// =============================================================================
/**
 * Thread list component for browsing and searching threads
 */
export function ThreadBrowserExample() {
    const [messages, setMessages] = React.useState([
        {
            id: '1',
            role: 'user',
            content: 'How do I implement authentication?',
            timestamp: Date.now() - 120000,
        },
        {
            id: '2',
            role: 'user',
            content: 'What is the best state management solution?',
            timestamp: Date.now() - 100000,
        },
        {
            id: '3',
            role: 'user',
            content: 'How do I deploy to production?',
            timestamp: Date.now() - 80000,
        },
    ]);
    const [threads, setThreads] = React.useState([
        {
            id: 'thread-1',
            parentMessageId: '1',
            messages: [
                {
                    id: 'msg-1',
                    role: 'assistant',
                    content: 'For authentication, I recommend...',
                    timestamp: Date.now() - 115000,
                },
                {
                    id: 'msg-2',
                    role: 'user',
                    content: 'Thanks! What about OAuth?',
                    timestamp: Date.now() - 110000,
                },
            ],
            participants: [
                { id: 'user-1', name: 'Alice', joinedAt: Date.now() - 115000 },
                { id: 'user-2', name: 'Bob', joinedAt: Date.now() - 110000 },
            ],
            unreadCount: 1,
            lastActivity: Date.now() - 110000,
            isArchived: false,
        },
        {
            id: 'thread-2',
            parentMessageId: '2',
            messages: [
                {
                    id: 'msg-3',
                    role: 'assistant',
                    content: 'Popular state management options include...',
                    timestamp: Date.now() - 95000,
                },
            ],
            participants: [
                { id: 'user-1', name: 'Alice', joinedAt: Date.now() - 95000 },
            ],
            unreadCount: 0,
            lastActivity: Date.now() - 95000,
            isArchived: false,
        },
    ]);
    const handleSelectThread = (thread) => {
        console.log('Selected thread:', thread);
        // Mark thread as read
        setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unreadCount: 0 } : t));
    };
    const handleArchiveThread = (threadId) => {
        setThreads(prev => prev.map(t => t.id === threadId ? { ...t, isArchived: true } : t));
    };
    return (_jsxs("div", { className: "grid grid-cols-3 gap-4 h-screen p-4", children: [_jsxs("div", { className: "col-span-2 space-y-4 overflow-auto", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Thread Browser" }), messages.map(message => (_jsx("div", { children: _jsx(Message, { message: message }) }, message.id)))] }), _jsx("div", { className: "overflow-auto", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Threads" }) }), _jsx(CardContent, { children: _jsx(ThreadList, { threads: threads, parentMessages: messages, onSelectThread: handleSelectThread, onArchiveThread: handleArchiveThread }) })] }) })] }));
}
// =============================================================================
// Example 4: Complete Threading Setup with Backend Integration
// =============================================================================
/**
 * Production-ready threading with backend integration
 */
export function ProductionThreadingExample() {
    const [messages, setMessages] = React.useState([]);
    const [threads, setThreads] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    // Load threads from backend
    React.useEffect(() => {
        const loadThreads = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/threads');
                const data = await response.json();
                setThreads(data.threads);
                setMessages(data.messages);
            }
            catch (error) {
                console.error('Failed to load threads:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadThreads();
    }, []);
    const handleCreateThread = async (parentMessageId) => {
        try {
            const response = await fetch('/api/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parentMessageId }),
            });
            const newThread = await response.json();
            setThreads(prev => [...prev, newThread]);
        }
        catch (error) {
            console.error('Failed to create thread:', error);
        }
    };
    const handleThreadReply = async (threadId, content) => {
        try {
            const response = await fetch(`/api/threads/${threadId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            const newMessage = await response.json();
            setThreads(prev => prev.map(thread => {
                if (thread.id === threadId) {
                    return {
                        ...thread,
                        messages: [...thread.messages, newMessage],
                        lastActivity: Date.now(),
                    };
                }
                return thread;
            }));
        }
        catch (error) {
            console.error('Failed to send thread reply:', error);
        }
    };
    const handleMarkThreadRead = async (threadId) => {
        try {
            await fetch(`/api/threads/${threadId}/read`, {
                method: 'POST',
            });
            setThreads(prev => prev.map(thread => thread.id === threadId ? { ...thread, unreadCount: 0 } : thread));
        }
        catch (error) {
            console.error('Failed to mark thread as read:', error);
        }
    };
    if (isLoading) {
        return _jsx("div", { children: "Loading threads..." });
    }
    return (_jsxs("div", { className: "space-y-4 p-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Production Threading" }), _jsx("div", { className: "space-y-4", children: messages.map(message => {
                    const thread = threads.find(t => t.parentMessageId === message.id);
                    return (_jsxs("div", { children: [_jsx(Message, { message: message }), _jsx(MessageThreadView, { parentMessage: message, thread: thread, config: {
                                    maxDepth: 3,
                                    showPreview: true,
                                    previewLength: 150,
                                    collapseThreshold: 15,
                                    notificationsEnabled: true,
                                }, onSendMessage: (content) => {
                                    if (thread) {
                                        handleThreadReply(thread.id, content);
                                    }
                                }, onCreateThread: () => handleCreateThread(message.id), onThreadExpand: () => {
                                    if (thread && thread.unreadCount > 0) {
                                        handleMarkThreadRead(thread.id);
                                    }
                                }, layout: "inline" })] }, message.id));
                }) })] }));
}
// =============================================================================
// Example 5: Advanced Configuration
// =============================================================================
/**
 * Advanced threading configuration with custom behavior
 */
export function AdvancedThreadingExample() {
    const [messages, setMessages] = React.useState([]);
    const [threads, setThreads] = React.useState([]);
    const advancedConfig = {
        maxDepth: 5, // Allow deeper nesting
        showPreview: true,
        previewLength: 200, // Longer previews
        collapseThreshold: 5, // Collapse sooner
        notificationsEnabled: true,
    };
    return (_jsxs("div", { className: "space-y-4 p-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Advanced Threading Configuration" }), _jsx("div", { className: "space-y-4", children: messages.map(message => {
                    const thread = threads.find(t => t.parentMessageId === message.id);
                    return (_jsxs("div", { children: [_jsx(Message, { message: message }), _jsx(MessageThreadView, { parentMessage: message, thread: thread, config: advancedConfig, onSendMessage: (content) => {
                                    // Custom send logic
                                    console.log('Sending to thread:', thread?.id, content);
                                }, onCreateThread: () => {
                                    // Custom thread creation
                                    console.log('Creating thread for:', message.id);
                                }, onThreadExpand: () => {
                                    console.log('Thread expanded:', thread?.id);
                                }, onThreadCollapse: () => {
                                    console.log('Thread collapsed:', thread?.id);
                                }, layout: "inline", className: "custom-thread-styling" })] }, message.id));
                }) })] }));
}
//# sourceMappingURL=threading-example.js.map