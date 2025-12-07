import { jsx as _jsx } from "react/jsx-runtime";
import { ChatWindow } from '@clarity-chat/react';
import { useState } from 'react';
/**
 * **ChatWindow Component**
 *
 * Complete chat window component that orchestrates MessageList and ChatInput
 * to provide a full-featured chat interface.
 *
 * **Key Features:**
 * - Message display and management
 * - Input handling with send functionality
 * - Loading states
 * - Empty state handling
 * - Auto-scroll to latest message
 * - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
 *
 * **Use Cases:**
 * - AI chat interfaces
 * - Customer support
 * - Messaging applications
 * - Conversational UIs
 */
const meta = {
    title: 'Components/Layout/ChatWindow',
    component: ChatWindow,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
Complete chat window component that orchestrates MessageList and ChatInput
to provide a full-featured chat interface.

## Features

- ✅ Message display and management
- ✅ Input handling with send functionality
- ✅ Loading states
- ✅ Empty state handling
- ✅ Auto-scroll to latest message
- ✅ Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- ✅ Accessible with proper ARIA attributes

## Basic Usage

\`\`\`tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={(content) => {
    // Handle message sending
  }}
/>
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        messages: {
            description: 'Array of messages to display',
            control: { type: 'object' },
        },
        isLoading: {
            description: 'Whether a message is currently being processed',
            control: { type: 'boolean' },
        },
        onSendMessage: {
            description: 'Callback function called when a message is sent',
            action: 'message-sent',
        },
    },
    decorators: [
        (Story) => (_jsx("div", { style: { width: '600px', height: '500px' }, children: _jsx(Story, {}) })),
    ],
};
export default meta;
const mockMessages = [
    {
        id: '1',
        role: 'user',
        content: 'Hello! Can you help me with React?',
        timestamp: Date.now() - 60000,
    },
    {
        id: '2',
        role: 'assistant',
        content: 'Of course! I\'d be happy to help you with React. What specific topic would you like to discuss?',
        timestamp: Date.now() - 30000,
    },
    {
        id: '3',
        role: 'user',
        content: 'How do I use hooks?',
        timestamp: Date.now() - 10000,
    },
];
export const Default = {
    args: {
        messages: mockMessages,
        isLoading: false,
        onSendMessage: (content) => {
            console.log('Message sent:', content);
        },
    },
};
export const Loading = {
    args: {
        messages: mockMessages,
        isLoading: true,
        onSendMessage: (content) => {
            console.log('Message sent:', content);
        },
    },
};
export const EmptyChat = {
    args: {
        messages: [],
        isLoading: false,
        onSendMessage: (content) => {
            console.log('Message sent:', content);
        },
    },
};
export const LongConversation = {
    args: {
        messages: [
            ...mockMessages,
            {
                id: '4',
                role: 'assistant',
                content: `Hooks are functions that let you "hook into" React state and lifecycle features from function components. Here are the main hooks:

1. **useState** - Manages component state
2. **useEffect** - Handles side effects
3. **useContext** - Accesses context values
4. **useReducer** - Complex state management
5. **useMemo** - Memoizes expensive calculations
6. **useCallback** - Memoizes callback functions`,
                timestamp: Date.now() - 5000,
            },
            {
                id: '5',
                role: 'user',
                content: 'Can you show me an example of useState?',
                timestamp: Date.now() - 2000,
            },
        ],
        isLoading: false,
        onSendMessage: (content) => {
            console.log('Message sent:', content);
        },
    },
};
const InteractiveTemplate = () => {
    const [messages, setMessages] = useState(mockMessages);
    const [isLoading, setIsLoading] = useState(false);
    const handleSendMessage = (content) => {
        const newMessage = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: Date.now(),
        };
        setMessages([...messages, newMessage]);
        setIsLoading(true);
        // Simulate AI response
        setTimeout(() => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `You said: "${content}". This is a demo response from the AI assistant.`,
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsLoading(false);
        }, 2000);
    };
    return (_jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: handleSendMessage }));
};
export const Interactive = {
    render: () => _jsx(InteractiveTemplate, {}),
    parameters: {
        docs: {
            description: {
                story: 'Interactive example showing real message sending and receiving. Try sending a message!',
            },
        },
    },
};
export const WithError = {
    args: {
        messages: mockMessages,
        isLoading: false,
        error: 'Failed to send message. Please try again.',
        onSendMessage: (content) => {
            console.log('Message sent:', content);
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'ChatWindow with error state displayed. Errors are shown prominently to users.',
            },
        },
    },
};
export const Streaming = {
    args: {
        messages: [
            ...mockMessages,
            {
                id: 'streaming',
                role: 'assistant',
                content: 'This is a streaming message that appears word by word...',
                timestamp: Date.now(),
                isStreaming: true,
            },
        ],
        isLoading: true,
        onSendMessage: (content) => {
            console.log('Message sent:', content);
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'ChatWindow showing a streaming message. Messages appear in real-time as the AI generates them.',
            },
        },
    },
};
//# sourceMappingURL=ChatWindow.stories.js.map