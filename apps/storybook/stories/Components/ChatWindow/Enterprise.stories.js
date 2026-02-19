import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChatWindow, useClarityChat, MemoryProvider, ThemeProvider } from '@clarity-chat/react';
import { useState } from 'react';
const meta = {
    title: 'Components/ChatWindow/Enterprise',
    component: ChatWindow,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
Enterprise patterns for production applications. These examples demonstrate
advanced features, performance optimizations, and robust configurations.

## Enterprise Features

- Multi-user conversations
- Advanced error handling
- Performance optimizations
- Custom message rendering
- Analytics integration
- Security considerations
        `,
            },
        },
    },
    decorators: [
        (Story) => (_jsx("div", { style: { width: '800px', height: '700px', border: '1px solid #e5e7eb', borderRadius: '8px' }, children: _jsx(Story, {}) })),
    ],
};
export default meta;
const createMessage = (role, content, overrides) => ({
    id: `msg-${Date.now()}-${Math.random()}`,
    role,
    content,
    createdAt: Date.now(),
    status: 'sent',
    ...overrides,
});
export const WithAdvancedMemory = {
    render: () => {
        const ChatApp = () => {
            const { messages, append, isLoading } = useClarityChat({
                api: '/api/chat',
                memory: {
                    enabled: true,
                    strategy: 'semantic-chunks', // Advanced memory strategy
                    maxTokens: 8000, // Higher limit for enterprise
                    autoCapture: true,
                    includeMetadata: true, // Include message metadata
                },
            });
            return (_jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: async (content) => {
                    await append({ role: 'user', content });
                }, showTokenCounter: true }));
        };
        return (_jsx(MemoryProvider, { config: { maxTokens: 10000, strategy: 'semantic-chunks' }, children: _jsx(ChatApp, {}) }));
    },
    parameters: {
        docs: {
            description: {
                story: `
Enterprise chat with advanced memory configuration. Uses semantic chunking
for better context management in long conversations.

**Features:**
- Semantic chunking strategy
- Higher token limits
- Metadata inclusion
- Auto-capture enabled

**Use Case:** Long-running conversations with complex context requirements.
        `,
            },
        },
    },
};
export const WithErrorRecovery = {
    render: () => {
        const [error, setError] = useState(null);
        const [retryCount, setRetryCount] = useState(0);
        const ChatApp = () => {
            const { messages, append, isLoading } = useClarityChat({
                api: '/api/chat',
                onError: (err) => {
                    setError(err);
                    console.error('Chat error:', err);
                },
                retry: {
                    maxAttempts: 3,
                    delay: 1000,
                },
            });
            const handleSend = async (content) => {
                try {
                    setError(null);
                    await append({ role: 'user', content });
                }
                catch (err) {
                    setError(err);
                    setRetryCount(prev => prev + 1);
                }
            };
            return (_jsxs("div", { children: [error && (_jsxs("div", { style: {
                            padding: '12px',
                            background: '#fee2e2',
                            border: '1px solid #fca5a5',
                            borderRadius: '4px',
                            marginBottom: '16px'
                        }, children: [_jsx("strong", { children: "Error:" }), " ", error.message, retryCount > 0 && _jsxs("div", { children: ["Retry attempts: ", retryCount] })] })), _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSend })] }));
        };
        return _jsx(ChatApp, {});
    },
    parameters: {
        docs: {
            description: {
                story: `
Enterprise error handling with retry logic and user feedback.

**Features:**
- Automatic retry with exponential backoff
- Error state display
- Retry count tracking
- User-friendly error messages

**Use Case:** Production applications requiring robust error handling.
        `,
            },
        },
    },
};
export const WithAnalytics = {
    render: () => {
        const ChatApp = () => {
            const { messages, append, isLoading } = useClarityChat({
                api: '/api/chat',
                onMessageSent: (message) => {
                    // Track message sent
                    console.log('Analytics: Message sent', {
                        id: message.id,
                        length: message.content.length,
                        timestamp: message.createdAt,
                    });
                },
                onMessageReceived: (message) => {
                    // Track message received
                    console.log('Analytics: Message received', {
                        id: message.id,
                        length: message.content.length,
                        timestamp: message.createdAt,
                    });
                },
            });
            return (_jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: async (content) => {
                    await append({ role: 'user', content });
                }, onFeedback: (messageId, type) => {
                    // Track feedback
                    console.log('Analytics: Feedback', { messageId, type });
                }, onCopy: (messageId, content) => {
                    // Track copy
                    console.log('Analytics: Message copied', { messageId });
                } }));
        };
        return _jsx(ChatApp, {});
    },
    parameters: {
        docs: {
            description: {
                story: `
Enterprise chat with analytics integration. Tracks user interactions
for business intelligence and product improvement.

**Tracked Events:**
- Message sent
- Message received
- User feedback
- Message copy
- Token usage

**Use Case:** Production applications requiring user analytics.
        `,
            },
        },
    },
};
export const MultiUserConversation = {
    render: () => {
        const ChatApp = () => {
            const [currentUser, setCurrentUser] = useState('user1');
            const { messages, append, isLoading } = useClarityChat({
                api: '/api/chat',
                userId: currentUser, // Track user ID
            });
            return (_jsxs("div", { children: [_jsx("div", { style: { padding: '12px', background: '#f5f5f5', marginBottom: '16px', borderRadius: '4px' }, children: _jsxs("label", { children: ["Current User:", ' ', _jsxs("select", { value: currentUser, onChange: (e) => setCurrentUser(e.target.value), children: [_jsx("option", { value: "user1", children: "User 1" }), _jsx("option", { value: "user2", children: "User 2" }), _jsx("option", { value: "user3", children: "User 3" })] })] }) }), _jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: async (content) => {
                            await append({
                                role: 'user',
                                content,
                                metadata: { userId: currentUser }, // Include user metadata
                            });
                        } })] }));
        };
        return _jsx(ChatApp, {});
    },
    parameters: {
        docs: {
            description: {
                story: `
Multi-user conversation support. Tracks different users and maintains
separate conversation contexts.

**Features:**
- User ID tracking
- User-specific metadata
- Context isolation
- User switching

**Use Case:** Applications with multiple users or user impersonation.
        `,
            },
        },
    },
};
export const WithCustomTheme = {
    render: () => {
        const customTheme = {
            colors: {
                primary: '#3b82f6',
                background: '#ffffff',
                foreground: '#000000',
                muted: '#f3f4f6',
                accent: '#8b5cf6',
            },
            borderRadius: {
                sm: '4px',
                md: '8px',
                lg: '12px',
            },
        };
        const ChatApp = () => {
            const { messages, append, isLoading } = useClarityChat({
                api: '/api/chat',
            });
            return (_jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: async (content) => {
                    await append({ role: 'user', content });
                } }));
        };
        return (_jsx(ThemeProvider, { theme: customTheme, children: _jsx(ChatApp, {}) }));
    },
    parameters: {
        docs: {
            description: {
                story: `
Enterprise chat with custom branding. Matches your company's design system.

**Features:**
- Custom color palette
- Brand-consistent styling
- Configurable border radius
- Theme provider integration

**Use Case:** White-label applications or branded deployments.
        `,
            },
        },
    },
};
//# sourceMappingURL=Enterprise.stories.js.map