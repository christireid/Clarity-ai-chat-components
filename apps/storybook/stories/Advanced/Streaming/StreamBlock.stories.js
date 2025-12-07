import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StreamBlock } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
import { useState } from 'react';
/**
 * **StreamBlock Component**
 *
 * A flexible component for rendering streaming content from various sources.
 *
 * **Key Features:**
 * - Supports multiple stream sources (StreamableValue, async iterable, promise, ReadableStream)
 * - Append or replace accumulation modes
 * - Custom render functions
 * - Error handling with fallbacks
 * - Live streaming indicator
 * - Accessible with ARIA attributes
 *
 * **Use Cases:**
 * - AI chat streaming responses
 * - Real-time data feeds
 * - Progressive content loading
 * - Streaming API responses
 */
const meta = {
    title: 'Advanced/Streaming/StreamBlock',
    component: StreamBlock,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`StreamBlock\` component provides a flexible way to render streaming content
from various sources with automatic accumulation and rendering.

## Features

- ✅ Multiple source types (StreamableValue, async iterable, promise, ReadableStream)
- ✅ Append or replace accumulation modes
- ✅ Custom render functions
- ✅ Error handling with fallbacks
- ✅ Live streaming indicator
- ✅ Accessible with ARIA attributes
- ✅ Configurable spacing

## Basic Usage

\`\`\`tsx
<StreamBlock
  source={streamSource}
  mode="append"
  showIndicator={true}
  fallback={<div>Waiting for stream...</div>}
/>
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        mode: {
            control: 'select',
            options: ['append', 'replace'],
            description: 'How incoming fragments should be accumulated',
        },
        spacing: {
            control: 'select',
            options: ['none', 'compact', 'relaxed'],
            description: 'Spacing between streamed entries',
        },
        showIndicator: {
            control: 'boolean',
            description: 'Show live streaming indicator',
        },
    },
};
export default meta;
// Helper to create a mock async iterable
async function* createMockAsyncIterable(text, delay = 50) {
    const chunks = text.split(' ');
    for (const chunk of chunks) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        yield chunk;
    }
}
// Helper to create a mock ReadableStream
function createMockStream(text, delay = 50) {
    const chunks = text.split(' ');
    return new ReadableStream({
        async start(controller) {
            for (const chunk of chunks) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                controller.enqueue(chunk);
            }
            controller.close();
        },
    });
}
function BasicStreamBlockDemo() {
    const [source, setSource] = useState(null);
    const handleStart = () => {
        const stream = createMockStream('This is a streaming response that appears word by word. ' +
            'Each word is streamed individually to demonstrate progressive rendering.');
        setSource(stream);
    };
    const handleReset = () => {
        setSource(null);
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsx(StreamBlock, { source: source, mode: "append", showIndicator: true, spacing: "compact", fallback: _jsx("div", { className: "text-muted-foreground", children: "Click \"Start Stream\" to begin..." }), renderItem: (item, index) => (_jsx("span", { className: "inline-block mr-2", children: item }, index)) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleStart, disabled: source !== null, children: "Start Stream" }), _jsx(Button, { variant: "outline", onClick: handleReset, children: "Reset" })] })] }));
}
export const BasicUsage = {
    render: () => _jsx(BasicStreamBlockDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Basic StreamBlock with word-by-word streaming from a ReadableStream.',
            },
        },
    },
};
function StreamBlockWithAsyncIterable() {
    const [source, setSource] = useState(null);
    const handleStart = () => {
        const iterable = createMockAsyncIterable('This demonstrates streaming from an async iterable. ' +
            'Async iterables are great for custom streaming logic and generators.');
        setSource(iterable);
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsx(StreamBlock, { source: source, mode: "append", showIndicator: true, spacing: "relaxed", fallback: _jsx("div", { className: "text-muted-foreground", children: "Click \"Start Stream\" to begin..." }), renderItem: (item, index) => (_jsx("div", { className: "p-2 bg-muted rounded mb-2", children: item }, index)) }), _jsx(Button, { onClick: handleStart, disabled: source !== null, children: "Start Stream" })] }));
}
export const WithAsyncIterable = {
    render: () => _jsx(StreamBlockWithAsyncIterable, {}),
    parameters: {
        docs: {
            description: {
                story: 'StreamBlock using an async iterable as the source.',
            },
        },
    },
};
function StreamBlockWithReplaceMode() {
    const [source, setSource] = useState(null);
    const handleStart = () => {
        const stream = createMockStream('Replace mode replaces the entire content with each new chunk. ' +
            'This is useful when you want to show only the latest state.');
        setSource(stream);
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsxs("div", { className: "p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm mb-4", children: [_jsx("strong", { children: "Replace Mode:" }), " Each chunk replaces the previous content instead of appending."] }), _jsx(StreamBlock, { source: source, mode: "replace", showIndicator: true, fallback: _jsx("div", { className: "text-muted-foreground", children: "Click \"Start Stream\" to begin..." }), renderItem: (item) => (_jsxs("div", { className: "p-4 bg-muted rounded-lg text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: item }), _jsx("div", { className: "text-xs text-muted-foreground mt-2", children: "Current chunk" })] })) }), _jsx(Button, { onClick: handleStart, disabled: source !== null, children: "Start Stream (Replace Mode)" })] }));
}
export const ReplaceMode = {
    render: () => _jsx(StreamBlockWithReplaceMode, {}),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates replace mode where each chunk replaces the previous content.',
            },
        },
    },
};
function StreamBlockWithErrorHandling() {
    const [source, setSource] = useState(null);
    const [hasError, setHasError] = useState(false);
    const handleStart = () => {
        setHasError(false);
        // Create a stream that will error
        const stream = new ReadableStream({
            async start(controller) {
                await new Promise((resolve) => setTimeout(resolve, 500));
                controller.enqueue('First chunk');
                await new Promise((resolve) => setTimeout(resolve, 500));
                controller.error(new Error('Stream error occurred!'));
            },
        });
        setSource(stream);
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsx(StreamBlock, { source: source, mode: "append", showIndicator: true, fallback: _jsx("div", { className: "text-muted-foreground", children: "Click \"Start Stream\" to begin..." }), errorFallback: (error) => (_jsxs("div", { className: "p-4 bg-destructive/10 text-destructive rounded-lg", children: [_jsx("div", { className: "font-semibold mb-2", children: "Stream Error" }), _jsx("div", { className: "text-sm", children: error.message }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                                setSource(null);
                                setHasError(false);
                            }, className: "mt-3", children: "Reset" })] })), renderItem: (item, index) => (_jsx("span", { className: "inline-block mr-2", children: item }, index)) }), _jsx(Button, { onClick: handleStart, disabled: source !== null && !hasError, children: "Start Stream (Will Error)" })] }));
}
export const ErrorHandling = {
    render: () => _jsx(StreamBlockWithErrorHandling, {}),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates error handling with custom error fallback.',
            },
        },
    },
};
function StreamBlockSpacing() {
    const [source, setSource] = useState(null);
    const [spacing, setSpacing] = useState('compact');
    const handleStart = () => {
        const stream = createMockStream('Item One Item Two Item Three Item Four Item Five');
        setSource(stream);
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: spacing === 'none' ? 'default' : 'outline', onClick: () => setSpacing('none'), children: "None" }), _jsx(Button, { size: "sm", variant: spacing === 'compact' ? 'default' : 'outline', onClick: () => setSpacing('compact'), children: "Compact" }), _jsx(Button, { size: "sm", variant: spacing === 'relaxed' ? 'default' : 'outline', onClick: () => setSpacing('relaxed'), children: "Relaxed" })] }), _jsx(StreamBlock, { source: source, mode: "append", spacing: spacing, showIndicator: true, fallback: _jsx("div", { className: "text-muted-foreground", children: "Click \"Start Stream\" to begin..." }), renderItem: (item, index) => (_jsx("div", { className: "p-3 bg-muted rounded border", children: item }, index)) }), _jsx(Button, { onClick: handleStart, disabled: source !== null, children: "Start Stream" })] }));
}
export const SpacingOptions = {
    render: () => _jsx(StreamBlockSpacing, {}),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates different spacing options: none, compact, and relaxed.',
            },
        },
    },
};
function StreamBlockCustomElement() {
    const [source, setSource] = useState(null);
    const handleStart = () => {
        const stream = createMockStream('Paragraph One Paragraph Two Paragraph Three');
        setSource(stream);
    };
    return (_jsxs("div", { className: "space-y-4 w-full max-w-2xl", children: [_jsx(StreamBlock, { source: source, mode: "append", as: "article", className: "prose dark:prose-invert", showIndicator: true, spacing: "relaxed", fallback: _jsx("div", { className: "text-muted-foreground", children: "Click \"Start Stream\" to begin..." }), renderItem: (item, index) => (_jsx("p", { className: "mb-4", children: item }, index)) }), _jsx(Button, { onClick: handleStart, disabled: source !== null, children: "Start Stream" }), _jsxs("div", { className: "p-3 bg-muted rounded-lg text-xs", children: [_jsx("strong", { children: "Custom Element:" }), " Using ", _jsx("code", { children: "as=\"article\"" }), " to render as a semantic HTML article element."] })] }));
}
export const CustomElement = {
    render: () => _jsx(StreamBlockCustomElement, {}),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates custom HTML element rendering with the `as` prop.',
            },
        },
    },
};
//# sourceMappingURL=StreamBlock.stories.js.map