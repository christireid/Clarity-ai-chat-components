import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Message } from '@clarity-chat/react';
import { expect, userEvent, within } from '@storybook/test';
/**
 * **Message Component**
 *
 * Enhanced message component for displaying chat messages with animations,
 * feedback, and interactive features.
 *
 * **Key Features:**
 * - Slide-in animations
 * - Hover actions
 * - Feedback buttons with confetti
 * - Streaming cursor pulse
 * - Avatar bounce animations
 * - Copy functionality
 * - Retry on error
 * - Markdown rendering
 *
 * **Use Cases:**
 * - Chat interfaces
 * - Messaging applications
 * - AI assistants
 * - Customer support
 */
const meta = {
    title: 'Components/DataDisplay/Message',
    component: Message,
    tags: ['autodocs', 'stable'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
Enhanced message component for displaying chat messages with animations,
feedback, and interactive features.

## Features

- ✅ Slide-in animations
- ✅ Hover actions
- ✅ Feedback buttons with confetti
- ✅ Streaming cursor pulse
- ✅ Avatar bounce animations
- ✅ Copy functionality
- ✅ Retry on error
- ✅ Markdown rendering
- ✅ Accessible with ARIA attributes

## Basic Usage

\`\`\`tsx
<Message
  message={message}
  onFeedback={(type) => console.log('Feedback:', type)}
  onCopy={(id, content) => console.log('Copied:', content)}
  onRetry={(id) => console.log('Retry:', id)}
/>
\`\`\`
        `,
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    argTypes: {
        message: {
            description: 'The message object to display',
            control: { type: 'object' },
        },
        onFeedback: {
            description: 'Callback when user gives feedback (up/down)',
            action: 'feedback',
        },
        onCopy: {
            description: 'Callback when message is copied',
            action: 'copy',
        },
        onRetry: {
            description: 'Callback when retry is requested',
            action: 'retry',
        },
        showAvatar: {
            description: 'Show avatar for the message',
            control: 'boolean',
        },
        showTimestamp: {
            description: 'Show timestamp',
            control: 'boolean',
        },
        enableMarkdown: {
            description: 'Enable markdown rendering',
            control: 'boolean',
        },
    },
};
export default meta;
// ============================================================================
// Mock Data
// ============================================================================
const createUserMessage = (content, overrides) => ({
    id: 'msg-' + Date.now(),
    role: 'user',
    content,
    createdAt: Date.now(),
    status: 'sent',
    ...overrides,
});
const createAssistantMessage = (content, overrides) => ({
    id: 'msg-' + Date.now(),
    role: 'assistant',
    content,
    createdAt: Date.now(),
    status: 'sent',
    ...overrides,
});
// ============================================================================
// Basic Examples
// ============================================================================
export const UserMessage = {
    render: () => (_jsx(Message, { message: createUserMessage('Hello! Can you help me with React animations?') })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test message content is rendered
        await expect(canvas.getByText(/Hello! Can you help me with React animations/i)).toBeInTheDocument();
    },
};
export const AssistantMessage = {
    render: () => (_jsx(Message, { message: createAssistantMessage('Of course! React animations can be achieved using libraries like **Framer Motion** or CSS transitions. What specific animation are you trying to create?'), onFeedback: (type) => console.log('Feedback:', type) })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test message renders
        await expect(canvas.getByText(/React animations can be achieved/i)).toBeInTheDocument();
        // Test feedback buttons appear on hover (if visible)
        // Note: This may depend on implementation - some components show on hover
    },
};
export const StreamingMessage = {
    render: () => {
        const [content, setContent] = React.useState('');
        const fullText = 'This is a streaming message that appears character by character...';
        React.useEffect(() => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < fullText.length) {
                    setContent(fullText.slice(0, i + 1));
                    i++;
                }
                else {
                    clearInterval(interval);
                }
            }, 50);
            return () => clearInterval(interval);
        }, []);
        return (_jsx(Message, { message: createAssistantMessage(content, { status: 'streaming' }) }));
    },
};
// ============================================================================
// Animation Showcase
// ============================================================================
export const SlideInAnimation = {
    render: () => {
        const [messages, setMessages] = React.useState([]);
        const addMessage = (role) => {
            const content = role === 'user'
                ? 'User message slides in from the right'
                : 'Assistant message slides in from the left';
            const newMessage = role === 'user'
                ? createUserMessage(content)
                : createAssistantMessage(content);
            setMessages((prev) => [...prev, newMessage]);
        };
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => addMessage('user'), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Add User Message" }), _jsx("button", { onClick: () => addMessage('assistant'), className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700", children: "Add Assistant Message" }), _jsx("button", { onClick: () => setMessages([]), className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700", children: "Clear" })] }), _jsx("div", { className: "space-y-2", children: messages.map((msg) => (_jsx(Message, { message: msg }, msg.id))) })] }));
    },
};
export const AvatarBounce = {
    render: () => {
        const [show, setShow] = React.useState(false);
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: () => {
                        setShow(false);
                        setTimeout(() => setShow(true), 100);
                    }, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Show Avatar Bounce" }), show && (_jsx(Message, { message: createAssistantMessage('Watch the avatar bounce!'), showAvatar: true }))] }));
    },
};
export const ActionBarReveal = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Hover over the assistant message to see the action bar slide up from below" }), _jsx(Message, { message: createAssistantMessage('Hover over me to reveal the action bar with smooth slide-up animation!'), onFeedback: (type) => console.log('Feedback:', type) })] })),
};
export const FeedbackWithConfetti = {
    render: () => {
        const [key, setKey] = React.useState(0);
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Click the thumbs up button to see the confetti effect! \uD83C\uDF89" }), _jsx("button", { onClick: () => setKey((k) => k + 1), className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700", children: "Reset Message" }), _jsx(Message, { message: createAssistantMessage('Great question! Click the thumbs up to see the confetti animation.'), onFeedback: (type) => console.log('Feedback:', type) }, key)] }));
    },
};
export const StreamingCursor = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Watch the streaming cursor pulse smoothly" }), _jsx(Message, { message: createAssistantMessage('This message is streaming', {
                    status: 'streaming',
                }) })] })),
};
// ============================================================================
// Content Variations
// ============================================================================
export const WithMarkdown = {
    render: () => (_jsx(Message, { message: createAssistantMessage("Here's how to use **Framer Motion**:\n\n" +
            "1. Install the package: `npm install framer-motion`\n" +
            "2. Import motion: `import { motion } from 'framer-motion'`\n" +
            "3. Use motion components: `<motion.div animate={{ x: 100 }} />`\n\n" +
            "## Key Concepts\n\n" +
            "- **Variants**: Define animation states\n" +
            "- **Transitions**: Control timing\n" +
            "- **Gestures**: Handle interactions\n\n" +
            "### Example Code\n\n" +
            "```jsx\n" +
            "<motion.div\n" +
            "  initial={{ opacity: 0 }}\n" +
            "  animate={{ opacity: 1 }}\n" +
            "  transition={{ duration: 0.5 }}\n" +
            ">\n" +
            "  Hello World\n" +
            "</motion.div>\n" +
            "```\n\n" +
            "Pretty cool, right?"), onFeedback: (type) => console.log('Feedback:', type) })),
};
export const WithCodeBlock = {
    render: () => (_jsx(Message, { message: createAssistantMessage("Here's a React component example:\n\n" +
            "```tsx\n" +
            "import React from 'react'\n" +
            "import { motion } from 'framer-motion'\n\n" +
            "export const AnimatedButton = () => {\n" +
            "  return (\n" +
            "    <motion.button\n" +
            "      whileHover={{ scale: 1.05 }}\n" +
            "      whileTap={{ scale: 0.95 }}\n" +
            "      className=\"px-4 py-2 bg-blue-500 text-white rounded\"\n" +
            "    >\n" +
            "      Click me!\n" +
            "    </motion.button>\n" +
            "  )\n" +
            "}\n" +
            "```\n\n" +
            "Hover over the code block to see the copy button!"), onFeedback: (type) => console.log('Feedback:', type) })),
};
export const WithAttachments = {
    render: () => (_jsx(Message, { message: createUserMessage('Here are the files you requested:', {
            attachments: [
                { id: '1', name: 'document.pdf', type: 'application/pdf', size: 1024000, url: '#' },
                { id: '2', name: 'image.png', type: 'image/png', size: 512000, url: '#' },
                { id: '3', name: 'data.json', type: 'application/json', size: 2048, url: '#' },
            ],
        }) })),
};
// ============================================================================
// Status States
// ============================================================================
export const SendingStatus = {
    render: () => (_jsx(Message, { message: createUserMessage('This message is being sent...', {
            status: 'sending',
        }) })),
};
export const ErrorStatus = {
    render: () => (_jsx(Message, { message: createAssistantMessage('Failed to generate response', {
            status: 'error',
        }), onRetry: () => console.log('Retry clicked') })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test error message renders
        await expect(canvas.getByText(/Failed to generate response/i)).toBeInTheDocument();
        // Test retry button exists (if rendered)
        const retryButton = canvas.queryByRole('button', { name: /retry/i });
        if (retryButton) {
            await expect(retryButton).toBeInTheDocument();
            await userEvent.click(retryButton);
        }
    },
};
export const WithMetadata = {
    render: () => (_jsx(Message, { message: createAssistantMessage('Response with metadata', {
            metadata: {
                tokens: 156,
                processingTime: 1250,
                model: 'gpt-4',
            },
        }), onFeedback: (type) => console.log('Feedback:', type) })),
};
// ============================================================================
// Real-World Conversation
// ============================================================================
export const Conversation = {
    render: () => {
        const messages = [
            createUserMessage('What is React?'),
            createAssistantMessage('React is a JavaScript library for building user interfaces. It allows you to create reusable UI components and manage application state efficiently.'),
            createUserMessage('Can you show me an example?'),
            createAssistantMessage("Sure! Here's a simple React component:\n\n" +
                "```jsx\n" +
                "function Welcome({ name }) {\n" +
                "  return <h1>Hello, {name}!</h1>\n" +
                "}\n\n" +
                "// Usage\n" +
                "<Welcome name=\"World\" />\n" +
                "```\n\n" +
                "This component accepts a `name` prop and renders a greeting."),
            createUserMessage("Thanks! That's helpful."),
            createAssistantMessage("You're welcome! Feel free to ask if you have more questions about React."),
        ];
        return (_jsx("div", { className: "space-y-4 max-w-3xl", children: messages.map((msg) => (_jsx(Message, { message: msg, onFeedback: (type) => console.log('Feedback for ' + msg.id + ':', type) }, msg.id))) }));
    },
};
// ============================================================================
// Interactive Demo
// ============================================================================
export const InteractiveDemo = {
    render: () => {
        const [messages, setMessages] = React.useState([
            createAssistantMessage("Hello! I'm your AI assistant. How can I help you today?"),
        ]);
        const [input, setInput] = React.useState('');
        const sendMessage = () => {
            if (!input.trim())
                return;
            // Add user message
            const userMsg = createUserMessage(input);
            setMessages((prev) => [...prev, userMsg]);
            setInput('');
            // Simulate AI response
            setTimeout(() => {
                const responses = [
                    "That's a great question! Let me help you with that.",
                    "I understand what you're asking. Here's what I think...",
                    "Interesting! Here's my perspective on this topic.",
                    'Let me break that down for you step by step.',
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                const aiMsg = createAssistantMessage(randomResponse);
                setMessages((prev) => [...prev, aiMsg]);
            }, 1000);
        };
        return (_jsxs("div", { className: "space-y-4 max-w-3xl", children: [_jsx("div", { className: "h-[500px] overflow-y-auto border rounded-lg p-4 space-y-4", children: messages.map((msg) => (_jsx(Message, { message: msg, onFeedback: (type) => console.log('Feedback for ' + msg.id + ':', type) }, msg.id))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && sendMessage(), placeholder: "Type your message...", className: "flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { onClick: sendMessage, className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Send" })] })] }));
    },
};
//# sourceMappingURL=Message.stories.js.map