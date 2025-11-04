import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { ChatWindow } from '@clarity-chat/react';
import { JoinForm } from '~/components/JoinForm';
import { UserList } from '~/components/UserList';
import { connectSocket, disconnectSocket, getSocket } from '~/lib/socket.client';
export default function Index() {
    const [joined, setJoined] = useState(false);
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    useEffect(() => {
        if (joined) {
            socketRef.current = connectSocket();
            const socket = socketRef.current;
            socket.on('user_joined', ({ user, users: roomUsers }) => {
                setUsers(roomUsers);
                if (user.id !== socket.id) {
                    const systemMessage = {
                        id: `system-${Date.now()}`,
                        role: 'system',
                        content: `${user.username} joined the room`,
                        timestamp: Date.now(),
                    };
                    setMessages((prev) => [...prev, systemMessage]);
                }
            });
            socket.on('user_left', ({ user, users: roomUsers }) => {
                setUsers(roomUsers);
                const systemMessage = {
                    id: `system-${Date.now()}`,
                    role: 'system',
                    content: `${user.username} left the room`,
                    timestamp: Date.now(),
                };
                setMessages((prev) => [...prev, systemMessage]);
            });
            socket.on('new_message', (message) => {
                const formattedMessage = {
                    ...message,
                    // Add username to content if it's from another user
                    content: message.username !== username
                        ? `**${message.username}**: ${message.content}`
                        : message.content,
                };
                setMessages((prev) => [...prev, formattedMessage]);
            });
            socket.on('user_typing', ({ username: typingUsername }) => {
                setTypingUser(typingUsername);
            });
            socket.on('user_stopped_typing', () => {
                setTypingUser(null);
            });
            return () => {
                disconnectSocket();
            };
        }
    }, [joined, username]);
    const handleJoin = ({ username: newUsername, room: newRoom }) => {
        setUsername(newUsername);
        setRoom(newRoom);
        setJoined(true);
        // Join room after state is set
        setTimeout(() => {
            const socket = getSocket();
            socket.emit('join', { username: newUsername, room: newRoom });
            const welcomeMessage = {
                id: 'welcome',
                role: 'system',
                content: `Welcome to the ${newRoom} room! You can chat with other users here.`,
                timestamp: Date.now(),
            };
            setMessages([welcomeMessage]);
        }, 100);
    };
    const handleSendMessage = (content) => {
        const socket = socketRef.current;
        if (socket) {
            socket.emit('send_message', { room, message: content });
            // Stop typing indicator
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            socket.emit('typing_stop', { room });
        }
    };
    const handleInputChange = () => {
        const socket = socketRef.current;
        if (socket) {
            socket.emit('typing_start', { room });
            // Clear existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            // Set new timeout to stop typing indicator
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('typing_stop', { room });
            }, 1000);
        }
    };
    if (!joined) {
        return (_jsx("main", { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '2rem',
            }, children: _jsx(JoinForm, { onJoin: handleJoin }) }));
    }
    return (_jsxs("main", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
        }, children: [_jsxs("div", { style: {
                    width: '100%',
                    maxWidth: '1200px',
                    marginBottom: '1rem',
                }, children: [_jsxs("h1", { style: {
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            marginBottom: '0.5rem',
                        }, children: ["Multi-User Chat - ", room] }), _jsxs("p", { style: {
                            color: 'var(--foreground)',
                            opacity: 0.7,
                            fontSize: '0.875rem',
                        }, children: ["Chatting as ", username, typingUser && ` • ${typingUser} is typing...`] })] }), _jsxs("div", { style: {
                    width: '100%',
                    maxWidth: '1200px',
                    height: '600px',
                    border: '1px solid rgba(128, 128, 128, 0.2)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                }, children: [_jsx("div", { style: { flex: 1 }, children: _jsx(ChatWindow, { messages: messages, onSendMessage: handleSendMessage, onInputChange: handleInputChange }) }), _jsx(UserList, { users: users, currentUserId: socketRef.current?.id || '' })] })] }));
}
//# sourceMappingURL=_index.js.map