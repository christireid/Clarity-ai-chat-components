'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Badge, Button, cn, } from '@clarity-chat/primitives';
/**
 * Generate user color
 */
function generateUserColor(userId) {
    const colors = [
        '#3b82f6', // blue
        '#ef4444', // red
        '#10b981', // green
        '#f59e0b', // yellow
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#06b6d4', // cyan
        '#f97316', // orange
    ];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
/**
 * Apply operation to content
 */
function applyOperation(content, operation) {
    switch (operation.type) {
        case 'insert':
            return content.slice(0, operation.position) + operation.content + content.slice(operation.position);
        case 'delete':
            return content.slice(0, operation.position) + content.slice(operation.position + operation.content.length);
        case 'replace':
            const end = operation.position + (operation.previousContent?.length || 0);
            return content.slice(0, operation.position) + operation.content + content.slice(end);
        default:
            return content;
    }
}
/**
 * Operational Transform for conflict resolution
 */
function transformOperation(op1, op2) {
    // Simple operational transform
    // In production, use a library like ot.js or Automerge
    if (op1.position < op2.position) {
        return op2;
    }
    if (op1.type === 'insert') {
        return {
            ...op2,
            position: op2.position + op1.content.length,
        };
    }
    if (op1.type === 'delete') {
        return {
            ...op2,
            position: Math.max(0, op2.position - op1.content.length),
        };
    }
    return op2;
}
/**
 * CollaborativeEditor Component
 *
 * Real-time collaborative editing with:
 * - Cursor tracking
 * - Presence indicators
 * - Message locking
 * - Conflict resolution
 * - Change history
 */
export function CollaborativeEditor({ message, currentUser, activeUsers, lockTimeout = 30000, // 30 seconds
conflictStrategy = 'operational-transform', showCursors = true, showPresence = true, onChange, onRequestLock, onReleaseLock, onCursorMove, className, }) {
    const [content, setContent] = React.useState(message.content);
    const [isEditing, setIsEditing] = React.useState(false);
    const [hasLock, setHasLock] = React.useState(false);
    const [cursorPosition, setCursorPosition] = React.useState(0);
    const [operations, setOperations] = React.useState([]);
    const textareaRef = React.useRef(null);
    const lockTimerRef = React.useRef(undefined);
    // Get active editors for this message
    const activeEditors = React.useMemo(() => {
        return activeUsers.filter(u => u.currentMessageId === message.id &&
            u.id !== currentUser.id &&
            u.status === 'online');
    }, [activeUsers, message.id, currentUser.id]);
    // Request edit lock
    const requestLock = async () => {
        if (onRequestLock) {
            const granted = await onRequestLock(message.id);
            setHasLock(granted);
            if (granted) {
                // Set auto-release timer
                lockTimerRef.current = setTimeout(() => {
                    releaseLock();
                }, lockTimeout);
            }
            return granted;
        }
        setHasLock(true);
        return true;
    };
    // Release lock
    const releaseLock = () => {
        setHasLock(false);
        setIsEditing(false);
        onReleaseLock?.(message.id);
        if (lockTimerRef.current) {
            clearTimeout(lockTimerRef.current);
        }
    };
    // Handle content change
    const handleChange = (e) => {
        const newContent = e.target.value;
        const position = e.target.selectionStart || 0;
        // Create operation
        const operation = {
            id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: currentUser.id,
            messageId: message.id,
            type: newContent.length > content.length ? 'insert' : 'delete',
            position,
            content: newContent.length > content.length
                ? newContent.slice(position - (newContent.length - content.length), position)
                : content.slice(position, position + (content.length - newContent.length)),
            timestamp: Date.now(),
            previousContent: content,
        };
        setContent(newContent);
        setOperations(prev => [...prev, operation]);
        onChange?.(newContent, operation);
    };
    // Handle cursor movement
    const handleCursorMove = (e) => {
        const target = e.target;
        const position = target.selectionStart || 0;
        setCursorPosition(position);
        onCursorMove?.({
            userId: currentUser.id,
            messageId: message.id,
            position,
            selection: target.selectionStart !== target.selectionEnd ? {
                start: target.selectionStart || 0,
                end: target.selectionEnd || 0,
            } : undefined,
        });
    };
    // Start editing
    const startEditing = async () => {
        const granted = await requestLock();
        if (granted) {
            setIsEditing(true);
            setTimeout(() => textareaRef.current?.focus(), 0);
        }
    };
    // Stop editing
    const stopEditing = () => {
        releaseLock();
    };
    // Save changes
    const saveChanges = () => {
        // In production, save to backend
        stopEditing();
    };
    // Discard changes
    const discardChanges = () => {
        setContent(message.content);
        setOperations([]);
        stopEditing();
    };
    // Undo last operation
    const undo = () => {
        if (operations.length === 0)
            return;
        const lastOp = operations[operations.length - 1];
        if (lastOp.previousContent) {
            setContent(lastOp.previousContent);
            setOperations(prev => prev.slice(0, -1));
        }
    };
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (lockTimerRef.current) {
                clearTimeout(lockTimerRef.current);
            }
        };
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'away':
                return 'bg-yellow-500';
            case 'busy':
                return 'bg-red-500';
            case 'offline':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
        }
    };
    return (_jsx("div", { className: cn('space-y-2', className), children: _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [showPresence && activeEditors.length > 0 && (_jsxs("div", { className: "mb-3 flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Also editing:" }), activeEditors.map(user => (_jsxs("div", { className: "flex items-center gap-1.5", title: user.name, children: [_jsx("div", { className: "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium", style: { backgroundColor: user.color }, children: user.name[0].toUpperCase() }), _jsx("div", { className: cn('w-2 h-2 rounded-full', getStatusColor(user.status)) })] }, user.id)))] })), _jsx("div", { className: "relative", children: !isEditing ? (
                        /* Display mode */
                        _jsxs("div", { className: "p-3 border rounded-lg cursor-text hover:bg-accent/50 transition-colors", onClick: startEditing, children: [_jsx("div", { className: "text-sm whitespace-pre-wrap", children: content || 'Click to edit...' }), activeEditors.length > 0 && (_jsxs(Badge, { variant: "secondary", className: "mt-2", children: [activeEditors.length, " editing"] }))] })) : (
                        /* Edit mode */
                        _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "relative", children: [_jsx("textarea", { ref: textareaRef, value: content, onChange: handleChange, onSelect: handleCursorMove, onMouseUp: handleCursorMove, onKeyUp: handleCursorMove, className: "w-full min-h-[120px] p-3 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary", style: {
                                                borderColor: currentUser.color,
                                            } }), showCursors && activeEditors.map(user => {
                                            if (!user.cursorPosition)
                                                return null;
                                            return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute pointer-events-none", style: {
                                                    borderLeft: `2px solid ${user.color}`,
                                                    height: '1.2em',
                                                    top: '0.5em',
                                                    left: `${user.cursorPosition}ch`,
                                                }, children: _jsx("div", { className: "absolute -top-5 left-0 px-1.5 py-0.5 rounded text-xs text-white whitespace-nowrap", style: { backgroundColor: user.color }, children: user.name }) }, user.id));
                                        })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { size: "sm", onClick: saveChanges, children: "Save" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: discardChanges, children: "Cancel" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: undo, disabled: operations.length === 0, children: "Undo" })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [_jsxs("span", { children: [content.length, " characters"] }), operations.length > 0 && (_jsxs(Badge, { variant: "outline", children: [operations.length, " changes"] }))] })] }), hasLock && (_jsx("div", { className: "text-xs text-muted-foreground", children: "\uD83D\uDD12 You have the edit lock" }))] })) })] }) }) }));
}
/**
 * Hook for managing collaborative sessions
 */
export function useCollaborativeSession(conversationId, currentUser) {
    const [session, setSession] = React.useState({
        id: `session-${Date.now()}`,
        conversationId,
        users: new Map([[currentUser.id, currentUser]]),
        locks: new Map(),
        operations: [],
        cursors: new Map(),
    });
    // Add user to session
    const addUser = React.useCallback((user) => {
        setSession(prev => ({
            ...prev,
            users: new Map(prev.users).set(user.id, user),
        }));
    }, []);
    // Remove user from session
    const removeUser = React.useCallback((userId) => {
        setSession(prev => {
            const newUsers = new Map(prev.users);
            newUsers.delete(userId);
            // Release any locks held by this user
            const newLocks = new Map(prev.locks);
            for (const [messageId, lock] of newLocks.entries()) {
                if (lock.userId === userId) {
                    newLocks.delete(messageId);
                }
            }
            return {
                ...prev,
                users: newUsers,
                locks: newLocks,
            };
        });
    }, []);
    // Update user status
    const updateUserStatus = React.useCallback((userId, status) => {
        setSession(prev => {
            const newUsers = new Map(prev.users);
            const user = newUsers.get(userId);
            if (user) {
                newUsers.set(userId, { ...user, status, lastSeen: Date.now() });
            }
            return { ...prev, users: newUsers };
        });
    }, []);
    // Request message lock
    const requestLock = React.useCallback((messageId, userId) => {
        const existing = session.locks.get(messageId);
        // Check if lock exists and is not expired
        if (existing && existing.expiresAt > Date.now()) {
            return false;
        }
        const lock = {
            messageId,
            userId,
            acquiredAt: Date.now(),
            expiresAt: Date.now() + 30000, // 30 seconds
        };
        setSession(prev => ({
            ...prev,
            locks: new Map(prev.locks).set(messageId, lock),
        }));
        return true;
    }, [session.locks]);
    // Release message lock
    const releaseLock = React.useCallback((messageId) => {
        setSession(prev => {
            const newLocks = new Map(prev.locks);
            newLocks.delete(messageId);
            return { ...prev, locks: newLocks };
        });
    }, []);
    // Add operation
    const addOperation = React.useCallback((operation) => {
        setSession(prev => ({
            ...prev,
            operations: [...prev.operations, operation],
        }));
    }, []);
    // Update cursor position
    const updateCursor = React.useCallback((cursor) => {
        setSession(prev => ({
            ...prev,
            cursors: new Map(prev.cursors).set(cursor.userId, cursor),
        }));
        // Update user's current message
        setSession(prev => {
            const newUsers = new Map(prev.users);
            const user = newUsers.get(cursor.userId);
            if (user) {
                newUsers.set(cursor.userId, {
                    ...user,
                    currentMessageId: cursor.messageId,
                    cursorPosition: cursor.position,
                });
            }
            return { ...prev, users: newUsers };
        });
    }, []);
    // Get active users
    const getActiveUsers = React.useCallback(() => {
        return Array.from(session.users.values()).filter(u => u.status === 'online');
    }, [session.users]);
    // Get message lock
    const getMessageLock = React.useCallback((messageId) => {
        return session.locks.get(messageId);
    }, [session.locks]);
    // Cleanup expired locks
    React.useEffect(() => {
        const interval = setInterval(() => {
            setSession(prev => {
                const newLocks = new Map(prev.locks);
                const now = Date.now();
                for (const [messageId, lock] of newLocks.entries()) {
                    if (lock.expiresAt < now) {
                        newLocks.delete(messageId);
                    }
                }
                return { ...prev, locks: newLocks };
            });
        }, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, []);
    return {
        session,
        addUser,
        removeUser,
        updateUserStatus,
        requestLock,
        releaseLock,
        addOperation,
        updateCursor,
        getActiveUsers,
        getMessageLock,
    };
}
/**
 * PresenceIndicator Component
 *
 * Display active users in the collaborative session
 */
export function PresenceIndicator({ users, maxDisplay = 5, showStatus = true, className, }) {
    const activeUsers = users.filter(u => u.status === 'online');
    const displayUsers = activeUsers.slice(0, maxDisplay);
    const remaining = Math.max(0, activeUsers.length - maxDisplay);
    const getStatusColor = (status) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'away':
                return 'bg-yellow-500';
            case 'busy':
                return 'bg-red-500';
            case 'offline':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
        }
    };
    return (_jsxs("div", { className: cn('flex items-center gap-1', className), children: [_jsx(AnimatePresence, { mode: "popLayout", children: displayUsers.map((user, index) => (_jsxs(motion.div, { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 }, transition: { delay: index * 0.05 }, className: "relative", title: `${user.name} (${user.status})`, style: { zIndex: displayUsers.length - index }, children: [_jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-background", style: { backgroundColor: user.color }, children: user.name[0].toUpperCase() }), showStatus && (_jsx("div", { className: cn('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background', getStatusColor(user.status)) }))] }, user.id))) }), remaining > 0 && (_jsxs("div", { className: "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-muted border-2 border-background", children: ["+", remaining] }))] }));
}
/**
 * CollaborativeMessageList Component
 *
 * Message list with collaborative editing capabilities
 */
export function CollaborativeMessageList({ messages, currentUser, activeUsers, session, onMessageEdit, onRequestLock, onReleaseLock, className, }) {
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-muted-foreground", children: [activeUsers.length, " active ", activeUsers.length === 1 ? 'user' : 'users'] }), _jsx(PresenceIndicator, { users: activeUsers })] }), _jsx("div", { className: "space-y-3", children: messages.map(message => (_jsx(CollaborativeEditor, { message: message, currentUser: currentUser, activeUsers: activeUsers, onChange: (content, operation) => {
                        onMessageEdit?.(message.id, content);
                    }, onRequestLock: onRequestLock, onReleaseLock: onReleaseLock }, message.id))) })] }));
}
//# sourceMappingURL=collaborative-editing.js.map