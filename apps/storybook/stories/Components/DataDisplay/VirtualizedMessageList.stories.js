import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { VirtualizedMessageList } from '@clarity-chat/react';
const generateMessages = (count) => Array.from({ length: count }, (_, index) => {
    const isAssistant = index % 2 === 1;
    return {
        id: `msg-${index}`,
        chatId: 'virtualized-demo',
        role: isAssistant ? 'assistant' : 'user',
        content: isAssistant
            ? `Assistant response #${index}: summarising context and providing recommendations. Bullet ${index % 5}.`
            : `User message #${index}: follow-up question about Phoenix launch timeline and stakeholder alignment.`,
        createdAt: new Date(Date.now() - (count - index) * 1000 * 45),
        status: 'sent',
    };
});
const baseMessages = generateMessages(120);
const meta = {
    title: 'Components/DataDisplay/VirtualizedMessageList',
    component: VirtualizedMessageList,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'High-performance list for long-running conversations. Inspired by Slack, Linear, and Discord storybooks where virtualization keeps UX smooth even with thousands of messages.',
            },
        },
    },
    argTypes: {
        enableVirtualization: { control: 'boolean' },
        estimatedMessageHeight: { control: { type: 'number', min: 80, step: 10 } },
        overscan: { control: { type: 'number', min: 1, max: 10 } },
        loadingCount: { control: { type: 'number', min: 1, max: 10 } },
    },
    args: {
        enableVirtualization: true,
        estimatedMessageHeight: 140,
        overscan: 3,
        loadingCount: 4,
        className: 'h-[480px]',
    },
    decorators: [
        (Story) => (_jsx("div", { className: "mx-auto w-full max-w-3xl rounded-lg border border-border/50 bg-card p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: _jsx(Story, {}) })),
    ],
    tags: ['autodocs'],
};
export default meta;
export const LargeConversation = {
    args: {
        messages: baseMessages,
        emptyState: _jsx("div", { className: "text-sm text-muted-foreground", children: "Start a conversation to see history." }),
        onMessageCopy: (id, content) => console.info('[Storybook] Copy message', id, content.slice(0, 40)),
        onMessageFeedback: (id, type) => console.info('[Storybook] Feedback', id, type),
    },
};
export const LoadingSkeleton = {
    args: {
        messages: [],
        isLoading: true,
        loadingCount: 5,
    },
};
export const NonVirtualized = {
    args: {
        messages: baseMessages.slice(0, 40),
        enableVirtualization: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'Disable virtualization for shorter conversations (< 50 messages). Virtualization adds overhead that may not be needed for small lists.',
            },
        },
    },
};
export const EmptyState = {
    args: {
        messages: [],
        isLoading: false,
        emptyState: (_jsxs("div", { className: "flex flex-col items-center justify-center h-full py-12 text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCAC" }), _jsx("h3", { className: "text-lg font-semibold mb-2", children: "No messages yet" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Start a conversation to see messages here" })] })),
    },
    parameters: {
        docs: {
            description: {
                story: 'Empty state when no messages are present. Customize the emptyState prop to match your app\'s design.',
            },
        },
    },
};
export const WithError = {
    args: {
        messages: baseMessages.slice(0, 10),
        error: 'Failed to load messages. Please try again.',
        onRetry: () => console.info('[Storybook] Retry clicked'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Error state with retry functionality. The error prop displays a user-friendly error message.',
            },
        },
    },
};
export const StreamingMessage = {
    args: {
        messages: [
            ...baseMessages.slice(0, 5),
            {
                id: 'streaming-msg',
                chatId: 'virtualized-demo',
                role: 'assistant',
                content: 'This is a streaming message that is currently being generated...',
                createdAt: Date.now(),
                status: 'streaming',
            },
        ],
    },
    parameters: {
        docs: {
            description: {
                story: 'Handles streaming messages gracefully. Messages with status "streaming" show a loading indicator.',
            },
        },
    },
};
//# sourceMappingURL=VirtualizedMessageList.stories.js.map