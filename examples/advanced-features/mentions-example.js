/**
 * Mention System Examples
 *
 * Demonstrates various patterns for implementing @mention functionality
 * with autocomplete, fuzzy search, and notification tracking.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { MentionInput, MentionList, useMentions, } from '@clarity-chat/react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@clarity-chat/primitives';
// =============================================================================
// Example 1: Basic Mention Input with Autocomplete
// =============================================================================
/**
 * Basic mention input - type @ to trigger autocomplete
 */
export function BasicMentionExample() {
    const [value, setValue] = React.useState('');
    const [mentions, setMentions] = React.useState([]);
    const users = [
        { id: '1', name: 'Alice Johnson', username: 'alice', role: 'Developer', isOnline: true },
        { id: '2', name: 'Bob Smith', username: 'bob', role: 'Designer', isOnline: true },
        { id: '3', name: 'Charlie Brown', username: 'charlie', role: 'Manager', isOnline: false },
        { id: '4', name: 'Diana Prince', username: 'diana', role: 'Product', isOnline: true },
    ];
    const handleSubmit = () => {
        console.log('Message:', value);
        console.log('Mentions:', mentions);
        // Send to backend
        // await fetch('/api/chat', { ... })
        // Clear input
        setValue('');
        setMentions([]);
    };
    return (_jsxs("div", { className: "space-y-4 p-4 max-w-2xl", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Basic Mention Input" }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx(MentionInput, { users: users, value: value, onChange: (newValue, extractedMentions) => {
                                setValue(newValue);
                                setMentions(extractedMentions);
                            }, onSubmit: handleSubmit, placeholder: "Type @ to mention someone...", mentionTrigger: "@", enableFuzzySearch: true }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: mentions.length > 0 && (_jsxs("span", { children: ["Mentioning: ", mentions.length, " ", mentions.length === 1 ? 'person' : 'people'] })) }), _jsx(Button, { onClick: handleSubmit, children: "Send" })] })] }) }), mentions.length > 0 && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Extracted Mentions" }) }), _jsx(CardContent, { children: _jsx("pre", { className: "text-sm", children: JSON.stringify(mentions, null, 2) }) })] }))] }));
}
// =============================================================================
// Example 2: Mention Inbox with useMentions Hook
// =============================================================================
/**
 * Complete mention system with inbox and state management
 */
export function MentionInboxExample() {
    const { mentions, unreadCount, addMention, markAsRead, markAllAsRead, } = useMentions({
        onMentionAdded: (mention) => {
            console.log('New mention added:', mention);
            // Show notification
            // notify(`You were mentioned!`)
        },
        onMentionRead: (mention) => {
            console.log('Mention marked as read:', mention);
        },
    });
    const [messages] = React.useState([
        {
            id: 'msg-1',
            role: 'user',
            content: 'Hey @alice, can you review this PR?',
            timestamp: Date.now() - 60000,
        },
        {
            id: 'msg-2',
            role: 'user',
            content: '@alice @bob Let\'s discuss the new design',
            timestamp: Date.now() - 50000,
        },
        {
            id: 'msg-3',
            role: 'user',
            content: 'Great work @alice!',
            timestamp: Date.now() - 40000,
        },
    ]);
    const users = [
        { id: 'alice', name: 'Alice Johnson', username: 'alice', isOnline: true },
        { id: 'bob', name: 'Bob Smith', username: 'bob', isOnline: true },
        { id: 'charlie', name: 'Charlie Brown', username: 'charlie', isOnline: false },
    ];
    // Simulate mentions (in real app, these come from backend)
    React.useEffect(() => {
        const simulatedMentions = [
            {
                id: 'mention-1',
                userId: 'alice',
                messageId: 'msg-1',
                position: 4,
                length: 6,
                isRead: false,
                timestamp: Date.now() - 60000,
            },
            {
                id: 'mention-2',
                userId: 'alice',
                messageId: 'msg-2',
                position: 0,
                length: 6,
                isRead: false,
                timestamp: Date.now() - 50000,
            },
            {
                id: 'mention-3',
                userId: 'alice',
                messageId: 'msg-3',
                position: 11,
                length: 6,
                isRead: false,
                timestamp: Date.now() - 40000,
            },
        ];
        simulatedMentions.forEach(addMention);
    }, [addMention]);
    const handleMentionClick = (mention) => {
        // Jump to message
        const element = document.getElementById(`message-${mention.messageId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Mark as read
        markAsRead(mention.id);
    };
    return (_jsxs("div", { className: "grid grid-cols-3 gap-4 p-4 h-screen", children: [_jsxs("div", { className: "col-span-2 space-y-4 overflow-auto", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Messages" }), messages.map(message => (_jsx("div", { id: `message-${message.id}`, children: _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx("p", { children: message.content }), _jsx("p", { className: "text-sm text-muted-foreground mt-2", children: new Date(message.timestamp).toLocaleTimeString() })] }) }) }, message.id)))] }), _jsx("div", { className: "overflow-auto", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { children: ["Mentions", unreadCount > 0 && (_jsx(Badge, { variant: "destructive", className: "ml-2", children: unreadCount }))] }), unreadCount > 0 && (_jsx(Button, { variant: "ghost", size: "sm", onClick: markAllAsRead, children: "Mark all read" }))] }) }), _jsx(CardContent, { children: _jsx(MentionList, { mentions: mentions, messages: messages, users: users, currentUserId: "alice", showOnlyUnread: true, onMentionClick: handleMentionClick, onMarkAsRead: markAsRead }) })] }) })] }));
}
// =============================================================================
// Example 3: Fuzzy Search Demonstration
// =============================================================================
/**
 * Shows fuzzy search in action - try typing partial names
 */
export function FuzzySearchExample() {
    const [value, setValue] = React.useState('');
    const users = [
        { id: '1', name: 'Alice Johnson', username: 'alice', isOnline: true },
        { id: '2', name: 'Bob Smith', username: 'bob', isOnline: true },
        { id: '3', name: 'Charlie Brown', username: 'charlie', isOnline: false },
        { id: '4', name: 'Diana Prince', username: 'diana', isOnline: true },
        { id: '5', name: 'Eve Anderson', username: 'eve', isOnline: true },
        { id: '6', name: 'Frank Miller', username: 'frank', isOnline: false },
    ];
    return (_jsxs("div", { className: "space-y-4 p-4 max-w-2xl", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Fuzzy Search Demo" }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Try These Searches" }) }), _jsx(CardContent, { children: _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsxs("li", { children: [_jsx("code", { children: "@aj" }), " \u2192 Alice Johnson"] }), _jsxs("li", { children: [_jsx("code", { children: "@bs" }), " \u2192 Bob Smith"] }), _jsxs("li", { children: [_jsx("code", { children: "@dp" }), " \u2192 Diana Prince"] }), _jsxs("li", { children: [_jsx("code", { children: "@alice" }), " \u2192 Alice Johnson"] }), _jsxs("li", { children: [_jsx("code", { children: "@john" }), " \u2192 Alice Johnson (matches \"Johnson\")"] }), _jsxs("li", { children: [_jsx("code", { children: "@char" }), " \u2192 Charlie Brown"] })] }) })] }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx(MentionInput, { users: users, value: value, onChange: (newValue) => setValue(newValue), placeholder: "Type @ and start typing a name...", mentionTrigger: "@", enableFuzzySearch: true, maxSuggestions: 5 }) }) })] }));
}
// =============================================================================
// Example 4: Complete Chat with Mentions
// =============================================================================
/**
 * Production-ready chat with mention system
 */
export function CompleteMentionChatExample() {
    const [messages, setMessages] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');
    const { mentions, unreadCount, addMention, markAsRead, extractMentions, } = useMentions();
    const users = [
        { id: '1', name: 'Alice Johnson', username: 'alice', role: 'Developer', isOnline: true },
        { id: '2', name: 'Bob Smith', username: 'bob', role: 'Designer', isOnline: true },
        { id: '3', name: 'Charlie Brown', username: 'charlie', role: 'Manager', isOnline: false },
    ];
    const currentUserId = '1'; // Alice
    const handleSendMessage = async () => {
        if (!inputValue.trim())
            return;
        // Extract mentions from input
        const extractedMentions = extractMentions(inputValue, users);
        const messageId = `msg-${Date.now()}`;
        const newMessage = {
            id: messageId,
            role: 'user',
            content: inputValue,
            timestamp: Date.now(),
            mentions: extractedMentions,
        };
        // Add message to UI
        setMessages(prev => [...prev, newMessage]);
        // Track mentions (in real app, backend would do this)
        extractedMentions.forEach(mention => {
            // Only add to inbox if mentioning someone else
            if (mention.userId !== currentUserId) {
                addMention({
                    id: `mention-${Date.now()}-${mention.userId}`,
                    userId: mention.userId,
                    messageId,
                    position: mention.position,
                    length: mention.length,
                    isRead: false,
                    timestamp: Date.now(),
                });
            }
        });
        // Send to backend
        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: newMessage,
                    mentions: extractedMentions,
                }),
            });
        }
        catch (error) {
            console.error('Failed to send message:', error);
        }
        // Clear input
        setInputValue('');
    };
    const handleMentionClick = (mention) => {
        // Jump to message
        const element = document.getElementById(`message-${mention.messageId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Mark as read
        markAsRead(mention.id);
    };
    return (_jsxs("div", { className: "grid grid-cols-4 gap-4 h-screen p-4", children: [_jsx("div", { className: "overflow-auto", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Mentions", unreadCount > 0 && (_jsx(Badge, { variant: "destructive", className: "ml-2", children: unreadCount }))] }) }), _jsxs(CardContent, { children: [_jsx(MentionList, { mentions: mentions, messages: messages, users: users, currentUserId: currentUserId, showOnlyUnread: true, onMentionClick: handleMentionClick, onMarkAsRead: markAsRead }), mentions.length === 0 && (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No mentions yet" }))] })] }) }), _jsxs("div", { className: "col-span-3 flex flex-col", children: [_jsx("div", { className: "flex-1 overflow-auto space-y-4 mb-4", children: messages.map(message => (_jsx("div", { id: `message-${message.id}`, children: _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx("p", { children: message.content }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: new Date(message.timestamp).toLocaleTimeString() }), message.mentions && message.mentions.length > 0 && (_jsxs(Badge, { variant: "secondary", className: "text-xs", children: [message.mentions.length, " ", message.mentions.length === 1 ? 'mention' : 'mentions'] }))] })] }) }) }, message.id))) }), _jsxs("div", { className: "border-t pt-4", children: [_jsx(MentionInput, { users: users, value: inputValue, onChange: (newValue) => setInputValue(newValue), onSubmit: handleSendMessage, placeholder: "Type @ to mention someone...", mentionTrigger: "@", enableFuzzySearch: true }), _jsx(Button, { onClick: handleSendMessage, className: "mt-2 w-full", children: "Send Message" })] })] })] }));
}
// =============================================================================
// Example 5: Advanced Configuration and Custom Rendering
// =============================================================================
/**
 * Advanced mention configuration with custom rendering
 */
export function AdvancedMentionExample() {
    const [value, setValue] = React.useState('');
    const users = [
        {
            id: '1',
            name: 'Alice Johnson',
            username: 'alice',
            role: 'Senior Developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
            isOnline: true,
        },
        {
            id: '2',
            name: 'Bob Smith',
            username: 'bob',
            role: 'Lead Designer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
            isOnline: true,
        },
        {
            id: '3',
            name: 'Charlie Brown',
            username: 'charlie',
            role: 'Product Manager',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
            isOnline: false,
        },
    ];
    return (_jsxs("div", { className: "space-y-4 p-4 max-w-2xl", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Advanced Mention Configuration" }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx(MentionInput, { users: users, value: value, onChange: (newValue) => setValue(newValue), placeholder: "Type @ to mention...", mentionTrigger: "@", enableFuzzySearch: true, maxSuggestions: 8, mentionClassName: "bg-primary/20 text-primary font-medium rounded px-1", dropdownClassName: "shadow-xl border-2 border-primary/20", renderUser: (user, isHighlighted) => (_jsxs("div", { className: `flex items-center gap-3 p-2 rounded ${isHighlighted ? 'bg-accent' : ''}`, children: [user.avatar && (_jsx("img", { src: user.avatar, alt: user.name, className: "w-8 h-8 rounded-full" })), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: user.name }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["@", user.username] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [user.role && (_jsx(Badge, { variant: "outline", className: "text-xs", children: user.role })), user.isOnline && (_jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }))] })] })) }) }) })] }));
}
// =============================================================================
// Example 6: Backend Integration
// =============================================================================
/**
 * Production mention system with backend integration
 */
export function ProductionMentionExample() {
    const [inputValue, setInputValue] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
    const { mentions, unreadCount, addMention, markAsRead, extractMentions, } = useMentions();
    // Load users from backend
    React.useEffect(() => {
        const loadUsers = async () => {
            setIsLoadingUsers(true);
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                setUsers(data.users);
            }
            catch (error) {
                console.error('Failed to load users:', error);
            }
            finally {
                setIsLoadingUsers(false);
            }
        };
        loadUsers();
    }, []);
    // Load mentions from backend
    React.useEffect(() => {
        const loadMentions = async () => {
            try {
                const response = await fetch('/api/mentions');
                const data = await response.json();
                data.mentions.forEach(addMention);
            }
            catch (error) {
                console.error('Failed to load mentions:', error);
            }
        };
        loadMentions();
    }, [addMention]);
    const handleSendMessage = async () => {
        if (!inputValue.trim())
            return;
        const extractedMentions = extractMentions(inputValue, users);
        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: inputValue,
                    mentions: extractedMentions.map(m => m.userId),
                }),
            });
            setInputValue('');
        }
        catch (error) {
            console.error('Failed to send message:', error);
        }
    };
    const handleMarkAsRead = async (mentionId) => {
        try {
            await fetch(`/api/mentions/${mentionId}/read`, {
                method: 'POST',
            });
            markAsRead(mentionId);
        }
        catch (error) {
            console.error('Failed to mark mention as read:', error);
        }
    };
    if (isLoadingUsers) {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsxs("div", { className: "space-y-4 p-4 max-w-2xl", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Production Mention System" }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Mentions", unreadCount > 0 && (_jsxs(Badge, { variant: "destructive", className: "ml-2", children: [unreadCount, " unread"] }))] }) }), _jsx(CardContent, {})] }), _jsx(Card, { children: _jsxs(CardContent, { className: "pt-6", children: [_jsx(MentionInput, { users: users, value: inputValue, onChange: (newValue) => setInputValue(newValue), onSubmit: handleSendMessage, placeholder: "Type @ to mention someone...", mentionTrigger: "@", enableFuzzySearch: true }), _jsx(Button, { onClick: handleSendMessage, className: "mt-2 w-full", children: "Send" })] }) })] }));
}
//# sourceMappingURL=mentions-example.js.map