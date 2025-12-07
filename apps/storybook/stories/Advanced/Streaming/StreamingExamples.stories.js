import { jsx as _jsx } from "react/jsx-runtime";
import { CombinedStreamingExample, SSEStreamingChatExample, WebSocketChatExample, } from '@clarity-chat/react/examples/streaming-chat-example';
const meta = {
    title: 'Advanced/Streaming/StreamingExamples',
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Interactive demo comparing SSE and WebSocket streaming integrations. The UI follows best practices from Vercel AI SDK and LangChain Studio storybooks—swap transports, inspect states, and wire into your own API routes.',
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
export const Playground = {
    render: () => (_jsx("div", { className: "h-screen bg-muted/40", children: _jsx(CombinedStreamingExample, {}) })),
};
export const SSETransport = {
    render: () => (_jsx("div", { className: "h-screen overflow-y-auto bg-muted/30 p-6", children: _jsx(SSEStreamingChatExample, {}) })),
    parameters: {
        docs: {
            description: {
                story: 'Server-Sent Events demo. Hook up `/api/chat/stream` in your app or stub `useStreamingSSE` to replay responses in Storybook.',
            },
        },
    },
};
export const WebSocketTransport = {
    render: () => (_jsx("div", { className: "h-screen overflow-y-auto bg-muted/30 p-6", children: _jsx(WebSocketChatExample, {}) })),
    parameters: {
        docs: {
            description: {
                story: 'WebSocket demo that highlights lifecycle states (connecting, streaming, reconnecting). Point it at your ws:// endpoint for live testing.',
            },
        },
    },
};
//# sourceMappingURL=StreamingExamples.stories.js.map