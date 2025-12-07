import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStreaming } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
import { useState } from 'react';
/**
 * **useStreaming Hook**
 *
 * Generic streaming hook for handling ReadableStream data with automatic
 * text decoding and state management.
 *
 * **Key Features:**
 * - Automatic text decoding from Uint8Array
 * - Chunk-by-chunk processing with callbacks
 * - AbortController support for cancellation
 * - Complete content accumulation
 * - Error handling
 *
 * **Use Cases:**
 * - Streaming API responses (OpenAI, Anthropic, etc.)
 * - Large file processing
 * - Real-time data feeds
 * - Progressive content rendering
 */
const meta = {
    title: 'Hooks/Streaming/UseStreaming',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useStreaming\` hook provides a generic way to handle streaming data
from ReadableStream sources with automatic text decoding and state management.

## Features

- ✅ Automatic text decoding from Uint8Array
- ✅ Chunk-by-chunk processing with callbacks
- ✅ AbortController support for cancellation
- ✅ Complete content accumulation
- ✅ Error handling
- ✅ Streaming state management

## Basic Usage

\`\`\`tsx
const { content, isStreaming, startStreaming, stopStreaming, reset } = useStreaming({
  onChunk: (chunk) => console.log('Received:', chunk),
  onComplete: (full) => console.log('Done!', full),
  onError: (error) => console.error('Error:', error)
})

// Start streaming
await startStreaming(response.body, { signal: controller.signal })
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
// Helper to create a mock stream
function createMockStream(text, delay = 50) {
    const encoder = new TextEncoder();
    const chunks = text.split('');
    return new ReadableStream({
        async start(controller) {
            for (const char of chunks) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                controller.enqueue(encoder.encode(char));
            }
            controller.close();
        },
    });
}
function BasicStreamingDemo() {
    const { content, isStreaming, startStreaming, stopStreaming, reset } = useStreaming({
        onChunk: (chunk) => {
            console.log('Chunk received:', chunk);
        },
        onComplete: (full) => {
            console.log('Streaming complete:', full);
        },
        onError: (error) => {
            console.error('Streaming error:', error);
        },
    });
    const handleStart = async () => {
        const stream = createMockStream('This is a streaming response that appears character by character. ' +
            'Each character is streamed individually to demonstrate the progressive ' +
            'rendering capability of the useStreaming hook.');
        await startStreaming(stream);
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsxs("div", { className: "border rounded-lg p-4 min-h-[200px]", children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "Streamed Content:" }), _jsxs("div", { className: "text-sm whitespace-pre-wrap min-h-[150px]", children: [content || (_jsx("span", { className: "text-muted-foreground", children: "No content yet. Click \"Start Streaming\" to begin." })), isStreaming && (_jsx("span", { className: "inline-block w-2 h-4 bg-primary ml-1 animate-pulse" }))] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleStart, disabled: isStreaming, children: "Start Streaming" }), _jsx(Button, { variant: "outline", onClick: stopStreaming, disabled: !isStreaming, children: "Stop Streaming" }), _jsx(Button, { variant: "outline", onClick: reset, disabled: isStreaming, children: "Reset" })] }), _jsxs("div", { className: "p-3 bg-muted rounded-lg text-xs space-y-1", children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), " ", isStreaming ? 'Streaming...' : 'Idle'] }), _jsxs("div", { children: [_jsx("strong", { children: "Content Length:" }), " ", content.length, " characters"] })] })] }));
}
export const BasicUsage = {
    render: () => _jsx(BasicStreamingDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Basic streaming example with character-by-character rendering.',
            },
        },
    },
};
function StreamingWithCallbacks() {
    const [chunks, setChunks] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(null);
    const { content, isStreaming, startStreaming, reset } = useStreaming({
        onChunk: (chunk) => {
            setChunks((prev) => [...prev, chunk]);
            console.log('Chunk received:', chunk);
        },
        onComplete: (full) => {
            setCompleted(true);
            console.log('Streaming complete! Full content:', full);
        },
        onError: (err) => {
            setError(err);
            console.error('Streaming error:', err);
        },
    });
    const handleStart = async () => {
        setChunks([]);
        setCompleted(false);
        setError(null);
        const stream = createMockStream('Hello, World! This is a test stream.', 100);
        await startStreaming(stream);
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsxs("div", { className: "border rounded-lg p-4 space-y-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "Accumulated Content:" }), _jsx("div", { className: "text-sm p-3 bg-muted rounded min-h-[100px]", children: content || _jsx("span", { className: "text-muted-foreground", children: "No content" }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium mb-2", children: ["Chunks Received (", chunks.length, "):"] }), _jsx("div", { className: "text-xs space-y-1 max-h-[150px] overflow-y-auto", children: chunks.length === 0 ? (_jsx("span", { className: "text-muted-foreground", children: "No chunks yet" })) : (chunks.map((chunk, i) => (_jsxs("div", { className: "p-2 bg-background rounded border", children: ["Chunk ", i + 1, ": \"", chunk, "\""] }, i)))) })] }), completed && (_jsx("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg text-sm", children: "\u2713 Streaming completed successfully!" })), error && (_jsxs("div", { className: "p-3 bg-destructive/10 text-destructive rounded-lg text-sm", children: ["\u2717 Error: ", error.message] }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleStart, disabled: isStreaming, children: "Start Streaming" }), _jsx(Button, { variant: "outline", onClick: reset, disabled: isStreaming, children: "Reset" })] }), _jsxs("div", { className: "p-3 bg-muted rounded-lg text-xs space-y-1", children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), " ", isStreaming ? 'Streaming...' : 'Idle'] }), _jsxs("div", { children: [_jsx("strong", { children: "Completed:" }), " ", completed ? 'Yes' : 'No'] }), _jsxs("div", { children: [_jsx("strong", { children: "Chunks:" }), " ", chunks.length] })] })] }));
}
export const WithCallbacks = {
    render: () => _jsx(StreamingWithCallbacks, {}),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates onChunk, onComplete, and onError callbacks.',
            },
        },
    },
};
function StreamingWithCancellation() {
    const { content, isStreaming, startStreaming, stopStreaming, reset } = useStreaming();
    const handleStart = async () => {
        // Create a long stream that can be cancelled
        const stream = createMockStream('This is a very long stream that will take a while to complete. ' +
            'You can cancel it at any time by clicking the Stop button. ' +
            'The stream will be interrupted and the content will stop accumulating. '.repeat(5), 30);
        const controller = new AbortController();
        try {
            await startStreaming(stream, { signal: controller.signal });
        }
        catch (error) {
            if (error.message !== 'Request cancelled') {
                console.error('Streaming error:', error);
            }
        }
    };
    const handleStop = () => {
        stopStreaming();
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsxs("div", { className: "border rounded-lg p-4 min-h-[200px]", children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "Streamed Content:" }), _jsxs("div", { className: "text-sm whitespace-pre-wrap min-h-[150px]", children: [content || (_jsx("span", { className: "text-muted-foreground", children: "No content yet." })), isStreaming && (_jsx("span", { className: "inline-block w-2 h-4 bg-primary ml-1 animate-pulse" }))] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleStart, disabled: isStreaming, children: "Start Long Stream" }), _jsx(Button, { variant: "destructive", onClick: handleStop, disabled: !isStreaming, children: "Stop Streaming" }), _jsx(Button, { variant: "outline", onClick: reset, disabled: isStreaming, children: "Reset" })] }), _jsxs("div", { className: "p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs", children: [_jsx("strong", { children: "Cancellation:" }), " Start a long stream and click \"Stop Streaming\" to cancel it mid-flight. The content will stop accumulating immediately."] }), _jsxs("div", { className: "p-3 bg-muted rounded-lg text-xs space-y-1", children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), " ", isStreaming ? 'Streaming...' : 'Idle'] }), _jsxs("div", { children: [_jsx("strong", { children: "Content Length:" }), " ", content.length, " characters"] })] })] }));
}
export const Cancellation = {
    render: () => _jsx(StreamingWithCancellation, {}),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates cancelling an in-progress stream.',
            },
        },
    },
};
function StreamingFromAPI() {
    const { content, isStreaming, startStreaming, reset } = useStreaming({
        onComplete: (full) => {
            console.log('API streaming complete:', full);
        },
    });
    const handleStart = async () => {
        // Simulate an API response stream
        const response = await fetch('/api/stream').catch(() => {
            // Fallback to mock stream if API doesn't exist
            return {
                body: createMockStream('This simulates streaming from an API endpoint. ' +
                    'In a real application, this would be the response body from fetch(). ' +
                    'The useStreaming hook automatically decodes the stream and accumulates the content.'),
            };
        });
        if (response?.body) {
            await startStreaming(response.body);
        }
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsxs("div", { className: "border rounded-lg p-4 min-h-[200px]", children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "API Stream Content:" }), _jsxs("div", { className: "text-sm whitespace-pre-wrap min-h-[150px]", children: [content || (_jsx("span", { className: "text-muted-foreground", children: "Click \"Stream from API\" to simulate fetching from an API endpoint." })), isStreaming && (_jsx("span", { className: "inline-block w-2 h-4 bg-primary ml-1 animate-pulse" }))] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleStart, disabled: isStreaming, children: "Stream from API" }), _jsx(Button, { variant: "outline", onClick: reset, disabled: isStreaming, children: "Reset" })] }), _jsxs("div", { className: "p-3 bg-muted rounded-lg text-xs space-y-1", children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), " ", isStreaming ? 'Streaming...' : 'Idle'] }), _jsxs("div", { children: [_jsx("strong", { children: "Content Length:" }), " ", content.length, " characters"] })] }), _jsxs("div", { className: "p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs", children: [_jsx("strong", { children: "Note:" }), " This demo uses a mock stream since the API endpoint doesn't exist. In production, replace with your actual API endpoint that returns a ReadableStream."] })] }));
}
export const FromAPI = {
    render: () => _jsx(StreamingFromAPI, {}),
    parameters: {
        docs: {
            description: {
                story: 'Example of streaming from a real API endpoint using fetch().',
            },
        },
    },
};
//# sourceMappingURL=UseStreaming.stories.js.map