import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useClipboard } from '@clarity-chat/react';
import { Button } from '@clarity-chat/primitives';
import { useState } from 'react';
/**
 * **useClipboard Hook**
 *
 * Hook for copying text to clipboard with success tracking
 * and automatic reset.
 *
 * **Key Features:**
 * - Copy text to clipboard
 * - Success state tracking
 * - Automatic reset after timeout
 * - Success/error callbacks
 * - Browser compatibility (modern API + fallback)
 *
 * **Use Cases:**
 * - Copy buttons
 * - Share functionality
 * - Code snippet copying
 * - Link copying
 */
const meta = {
    title: 'Hooks/Utilities/UseClipboard',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
The \`useClipboard\` hook provides a simple way to copy text to clipboard
with success tracking and automatic reset.

## Features

- ✅ Copy text to clipboard
- ✅ Success state tracking
- ✅ Automatic reset after timeout
- ✅ Success/error callbacks
- ✅ Browser compatibility (modern API + fallback)
- ✅ Accessible clipboard operations

## Basic Usage

\`\`\`tsx
const { copy, copied, reset } = useClipboard({ timeout: 3000 })

return (
  <button onClick={() => copy('Hello world')}>
    {copied ? 'Copied!' : 'Copy'}
  </button>
)
\`\`\`
        `,
            },
        },
    },
    tags: ['autodocs'],
};
export default meta;
function BasicClipboardDemo() {
    const { copy, copied, reset } = useClipboard({
        timeout: 2000,
        onSuccess: () => {
            console.log('Copied successfully!');
        },
        onError: (error) => {
            console.error('Copy failed:', error);
        },
    });
    const [text, setText] = useState('Hello, World!');
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Text to Copy:" }), _jsx("input", { type: "text", value: text, onChange: (e) => setText(e.target.value), className: "w-full p-2 border rounded-lg" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => copy(text), children: copied ? '✓ Copied!' : 'Copy to Clipboard' }), copied && (_jsx(Button, { onClick: reset, variant: "outline", children: "Reset" }))] }), copied && (_jsx("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200", children: "Text copied to clipboard! It will reset automatically after 2 seconds." }))] }));
}
export const BasicUsage = {
    render: () => _jsx(BasicClipboardDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Basic clipboard functionality with success state tracking.',
            },
        },
    },
};
function CustomTimeoutDemo() {
    const [timeout, setTimeoutValue] = useState(3000);
    const { copy, copied, reset } = useClipboard({
        timeout,
        onSuccess: () => {
            console.log('Copied with timeout:', timeout);
        },
    });
    const [text, setText] = useState('Custom timeout example');
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Timeout (ms):" }), _jsx("input", { type: "number", value: timeout, onChange: (e) => setTimeoutValue(Number(e.target.value)), className: "w-full p-2 border rounded-lg", min: "500", max: "10000", step: "500" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Text to Copy:" }), _jsx("input", { type: "text", value: text, onChange: (e) => setText(e.target.value), className: "w-full p-2 border rounded-lg" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => copy(text), children: copied ? '✓ Copied!' : 'Copy' }), copied && (_jsx(Button, { onClick: reset, variant: "outline", children: "Reset Now" }))] }), copied && (_jsxs("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200", children: ["Copied! Will reset after ", timeout, "ms"] }))] }));
}
export const CustomTimeout = {
    render: () => _jsx(CustomTimeoutDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Customizing the timeout before the copied state resets.',
            },
        },
    },
};
function CodeSnippetDemo() {
    const { copy, copied } = useClipboard();
    const codeSnippets = [
        {
            name: 'React Component',
            code: `function MyComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}`,
        },
        {
            name: 'API Call',
            code: `const response = await fetch('/api/data')
const data = await response.json()`,
        },
        {
            name: 'TypeScript Type',
            code: `type User = {
  id: string
  name: string
  email: string
}`,
        },
    ];
    return (_jsxs("div", { className: "space-y-4 max-w-2xl", children: [_jsx("h3", { className: "font-medium", children: "Code Snippets" }), codeSnippets.map((snippet, index) => (_jsxs("div", { className: "border rounded-lg p-4 bg-gray-50 dark:bg-gray-900", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium", children: snippet.name }), _jsx(Button, { size: "sm", onClick: () => copy(snippet.code), variant: copied ? 'default' : 'outline', children: copied ? '✓ Copied' : 'Copy' })] }), _jsx("pre", { className: "text-xs bg-white dark:bg-gray-800 p-2 rounded overflow-x-auto", children: _jsx("code", { children: snippet.code }) })] }, index)))] }));
}
export const CodeSnippets = {
    render: () => _jsx(CodeSnippetDemo, {}),
    parameters: {
        docs: {
            description: {
                story: 'Using clipboard hook for copying code snippets.',
            },
        },
    },
};
//# sourceMappingURL=UseClipboard.stories.js.map