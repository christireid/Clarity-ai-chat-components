import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStreamableUI } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
import { useState } from 'react';
/**
 * **useStreamableUI Hook**
 *
 * Hook for handling streamable UI values from various sources
 * including StreamableValue, AsyncIterable, Promise, and ReadableStream.
 *
 * **Key Features:**
 * - Support for multiple source types (StreamableValue, AsyncIterable, Promise, ReadableStream)
 * - Append or replace mode for value accumulation
 * - Custom transformation functions
 * - Completion detection
 * - Error handling
 * - Status tracking (idle, streaming, complete, error)
 *
 * **Use Cases:**
 * - Vercel AI SDK StreamableValue integration
 * - Progressive UI updates
 * - Real-time data streaming
 * - Async data handling
 */
const meta = {
    title: 'Hooks/Streaming/UseStreamableUI',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useStreamableUI\` hook provides a unified way to handle streamable
UI values from various sources including StreamableValue, AsyncIterable,
Promise, and ReadableStream.

## Features

- ✅ Support for multiple source types
- ✅ Append or replace mode for value accumulation
- ✅ Custom transformation functions
- ✅ Completion detection
- ✅ Error handling
- ✅ Status tracking (idle, streaming, complete, error)
- ✅ Reset functionality

## Basic Usage

\`\`\`tsx
const { values, latest, status, isStreaming, reset } = useStreamableUI(
  streamableSource,
  {
    mode: 'append',
    onUpdate: (value) => console.log('Updated:', value),
    onComplete: (finalValue) => console.log('Complete:', finalValue),
  }
)
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
function AsyncIterableDemo() {
    const [source, setSource] = useState(null);
    const { values, latest, status, isStreaming, reset } = useStreamableUI(source, {
        mode: 'append',
        onUpdate: (value) => {
            console.log('Value updated:', value);
        },
        onComplete: (finalValue) => {
            console.log('Streaming complete:', finalValue);
        },
    });
    const startStreaming = () => {
        const words = ['Hello', 'World', 'from', 'AsyncIterable', 'Stream'];
        let index = 0;
        const asyncIterable = {
            [Symbol.asyncIterator]: async function* () {
                for (const word of words) {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    yield word;
                }
            },
        };
        setSource(asyncIterable);
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium", children: "AsyncIterable Source" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: startStreaming, disabled: isStreaming, children: "Start Streaming" }), _jsx(Button, { onClick: () => { reset(); setSource(null); }, variant: "outline", children: "Reset" })] })] }), _jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), ' ', _jsx("span", { className: `px-2 py-1 rounded ${status === 'idle' ? 'bg-gray-200 dark:bg-gray-800' :
                                        status === 'streaming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
                                            status === 'complete' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
                                                'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`, children: status })] }), _jsxs("div", { children: [_jsx("strong", { children: "Is Streaming:" }), " ", isStreaming ? 'Yes' : 'No'] }), _jsxs("div", { children: [_jsx("strong", { children: "Values Count:" }), " ", values.length] }), _jsxs("div", { children: [_jsx("strong", { children: "Latest Value:" }), " ", latest || 'None'] })] }) }), values.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium text-sm", children: "All Values:" }), _jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsx("div", { className: "space-y-1", children: values.map((value, index) => (_jsxs("div", { className: "text-sm", children: [index + 1, ". ", value] }, index))) }) })] }))] }));
}
export const AsyncIterableSource = {
    render: () => _jsx(AsyncIterableDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using useStreamableUI with an AsyncIterable source for progressive value updates.',
            },
        },
    },
};
function ReadableStreamDemo() {
    const [source, setSource] = useState(null);
    const { values, latest, status, isStreaming, reset } = useStreamableUI(source, {
        mode: 'append',
        transform: (value) => {
            // Transform Uint8Array to string if needed
            if (value instanceof Uint8Array) {
                return new TextDecoder().decode(value);
            }
            return String(value);
        },
    });
    const startStreaming = () => {
        const stream = new ReadableStream({
            async start(controller) {
                const chunks = ['Chunk', '1', 'Chunk', '2', 'Chunk', '3'];
                for (const chunk of chunks) {
                    await new Promise((resolve) => setTimeout(resolve, 400));
                    controller.enqueue(chunk);
                }
                controller.close();
            },
        });
        setSource(stream);
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium", children: "ReadableStream Source" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: startStreaming, disabled: isStreaming, children: "Start Streaming" }), _jsx(Button, { onClick: () => { reset(); setSource(null); }, variant: "outline", children: "Reset" })] })] }), _jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), ' ', _jsx("span", { className: `px-2 py-1 rounded ${status === 'idle' ? 'bg-gray-200 dark:bg-gray-800' :
                                        status === 'streaming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
                                            status === 'complete' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
                                                'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`, children: status })] }), _jsxs("div", { children: [_jsx("strong", { children: "Latest Value:" }), " ", latest || 'None'] }), _jsxs("div", { children: [_jsx("strong", { children: "All Values:" }), " ", values.join(' ')] })] }) })] }));
}
export const ReadableStreamSource = {
    render: () => _jsx(ReadableStreamDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using useStreamableUI with a ReadableStream source with automatic text decoding.',
            },
        },
    },
};
function ReplaceModeDemo() {
    const [source, setSource] = useState(null);
    const { values, latest, status, isStreaming, reset } = useStreamableUI(source, {
        mode: 'replace', // Replace instead of append
        onUpdate: (value) => {
            console.log('Value replaced:', value);
        },
    });
    const startStreaming = () => {
        const numbers = [1, 2, 3, 4, 5];
        let index = 0;
        const asyncIterable = {
            [Symbol.asyncIterator]: async function* () {
                for (const num of numbers) {
                    await new Promise((resolve) => setTimeout(resolve, 600));
                    yield num;
                }
            },
        };
        setSource(asyncIterable);
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium", children: "Replace Mode" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "In replace mode, each new value replaces the previous one instead of accumulating." }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: startStreaming, disabled: isStreaming, children: "Start Streaming" }), _jsx(Button, { onClick: () => { reset(); setSource(null); }, variant: "outline", children: "Reset" })] })] }), _jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), ' ', _jsx("span", { className: `px-2 py-1 rounded ${status === 'streaming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
                                        status === 'complete' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
                                            'bg-gray-200 dark:bg-gray-800'}`, children: status })] }), _jsxs("div", { children: [_jsx("strong", { children: "Latest Value:" }), " ", latest !== null ? latest : 'None'] }), _jsxs("div", { children: [_jsx("strong", { children: "Values Array:" }), " ", values.length > 0 ? `[${values.join(', ')}]` : '[]', _jsx("span", { className: "text-gray-500 ml-2", children: "(In replace mode, this will only contain the latest value)" })] })] }) })] }));
}
export const ReplaceMode = {
    render: () => _jsx(ReplaceModeDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using replace mode where each new value replaces the previous one instead of accumulating.',
            },
        },
    },
};
function TransformDemo() {
    const [source, setSource] = useState(null);
    const { values, latest, status, isStreaming, reset } = useStreamableUI(source, {
        mode: 'append',
        transform: (value) => {
            // Transform numbers to formatted strings
            if (typeof value === 'number') {
                return `Value: ${value} (${value * 2} doubled)`;
            }
            return String(value);
        },
        onUpdate: (value) => {
            console.log('Transformed value:', value);
        },
    });
    const startStreaming = () => {
        const numbers = [10, 20, 30, 40, 50];
        const asyncIterable = {
            [Symbol.asyncIterator]: async function* () {
                for (const num of numbers) {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    yield num;
                }
            },
        };
        setSource(asyncIterable);
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium", children: "Custom Transform" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Transform incoming values using a custom function." }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: startStreaming, disabled: isStreaming, children: "Start Streaming" }), _jsx(Button, { onClick: () => { reset(); setSource(null); }, variant: "outline", children: "Reset" })] })] }), _jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), ' ', _jsx("span", { className: `px-2 py-1 rounded ${status === 'streaming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
                                        status === 'complete' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
                                            'bg-gray-200 dark:bg-gray-800'}`, children: status })] }), _jsxs("div", { children: [_jsx("strong", { children: "Latest Transformed Value:" }), " ", latest || 'None'] }), _jsxs("div", { children: [_jsx("strong", { children: "All Transformed Values:" }), _jsx("div", { className: "mt-2 space-y-1", children: values.map((value, index) => (_jsx("div", { className: "text-xs bg-white dark:bg-gray-800 p-2 rounded", children: value }, index))) })] })] }) })] }));
}
export const CustomTransform = {
    render: () => _jsx(TransformDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using a custom transform function to modify incoming values before they are stored.',
            },
        },
    },
};
function ErrorHandlingDemo() {
    const [source, setSource] = useState(null);
    const { values, latest, status, error, isStreaming, reset } = useStreamableUI(source, {
        mode: 'append',
        onError: (err) => {
            console.error('Stream error:', err);
        },
    });
    const startStreamingWithError = () => {
        const asyncIterable = {
            [Symbol.asyncIterator]: async function* () {
                yield 'First value';
                await new Promise((resolve) => setTimeout(resolve, 500));
                throw new Error('Simulated streaming error');
            },
        };
        setSource(asyncIterable);
    };
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium", children: "Error Handling" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Demonstrates error handling when streaming fails." }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: startStreamingWithError, disabled: isStreaming, children: "Start Streaming (Will Error)" }), _jsx(Button, { onClick: () => { reset(); setSource(null); }, variant: "outline", children: "Reset" })] })] }), _jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), ' ', _jsx("span", { className: `px-2 py-1 rounded ${status === 'error' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
                                        status === 'streaming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
                                            'bg-gray-200 dark:bg-gray-800'}`, children: status })] }), error && (_jsxs("div", { className: "p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-200", children: [_jsx("strong", { children: "Error:" }), " ", error.message] })), _jsxs("div", { children: [_jsx("strong", { children: "Values Received:" }), " ", values.length > 0 ? values.join(', ') : 'None'] })] }) })] }));
}
export const ErrorHandling = {
    render: () => _jsx(ErrorHandlingDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Error handling when streaming encounters an error.',
            },
        },
    },
};
//# sourceMappingURL=UseStreamableUI.stories.js.map