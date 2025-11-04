import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CopyButton } from '@clarity-chat/react';
/**
 * Enhanced CopyButton component with success state animation and ripple effect.
 *
 * **Key Features:**
 * - One-click copy to clipboard
 * - Visual success feedback with checkmark
 * - Success state with green color and glow animation
 * - Material Design ripple effect
 * - Accessible with ARIA labels
 * - Customizable text and icons
 * - Icon-only mode for compact layouts
 *
 * **Design Philosophy:**
 * - Delightful by Default: Success animation provides clear feedback
 * - Minimal but Modern: Clean design with purposeful animations
 * - Intuitive: Icon changes from copy to checkmark
 */
const meta = {
    title: 'Components/CopyButton',
    component: CopyButton,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A button that copies text to clipboard with visual feedback. Perfect for code snippets, sharing links, and any content users might want to copy.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        text: {
            control: 'text',
            description: 'Text to copy to clipboard',
        },
        iconOnly: {
            control: 'boolean',
            description: 'Show only icon without text labels',
        },
        copyText: {
            control: 'text',
            description: 'Custom text for copy state',
        },
        copiedText: {
            control: 'text',
            description: 'Custom text for copied state',
        },
        size: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
            description: 'Button size',
        },
        variant: {
            control: 'select',
            options: ['default', 'outline', 'ghost', 'secondary'],
            description: 'Button visual style',
        },
    },
};
export default meta;
// ============================================================================
// Basic Examples
// ============================================================================
export const Default = {
    args: {
        text: 'Hello, World!',
    },
};
export const IconOnly = {
    args: {
        text: 'This is the text that will be copied',
        iconOnly: true,
    },
};
export const CustomText = {
    args: {
        text: 'npx create-clarity-chat-app',
        copyText: 'Copy Command',
        copiedText: 'Command Copied!',
    },
};
// ============================================================================
// Sizes
// ============================================================================
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(CopyButton, { text: "Small", size: "sm" }), _jsx(CopyButton, { text: "Default", size: "default" }), _jsx(CopyButton, { text: "Large", size: "lg" })] })),
};
export const IconSizes = {
    render: () => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(CopyButton, { text: "Small icon", size: "sm", iconOnly: true }), _jsx(CopyButton, { text: "Default icon", size: "default", iconOnly: true }), _jsx(CopyButton, { text: "Large icon", size: "lg", iconOnly: true })] })),
};
// ============================================================================
// Variants
// ============================================================================
export const Variants = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx(CopyButton, { text: "Default variant", variant: "default" }), _jsx(CopyButton, { text: "Outline variant", variant: "outline" }), _jsx(CopyButton, { text: "Ghost variant", variant: "ghost" }), _jsx(CopyButton, { text: "Secondary variant", variant: "secondary" })] })),
};
// ============================================================================
// Real-World Use Cases
// ============================================================================
export const CodeSnippet = {
    render: () => (_jsxs("div", { className: "relative", children: [_jsx("pre", { className: "bg-gray-900 text-gray-100 p-4 rounded-lg pr-14", children: _jsx("code", { children: `npm install @clarity-chat/react
import { ChatWindow } from '@clarity-chat/react'

export default function App() {
  return <ChatWindow />
}` }) }), _jsx("div", { className: "absolute top-2 right-2", children: _jsx(CopyButton, { text: `npm install @clarity-chat/react
import { ChatWindow } from '@clarity-chat/react'

export default function App() {
  return <ChatWindow />
}`, iconOnly: true, variant: "ghost" }) })] })),
};
export const ShareLink = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-3 p-4 border rounded-lg max-w-md", children: [_jsx("h3", { className: "font-semibold", children: "Share this page" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", value: "https://clarity-chat.com/docs/getting-started", readOnly: true, className: "flex-1 px-3 py-2 border rounded text-sm bg-gray-50" }), _jsx(CopyButton, { text: "https://clarity-chat.com/docs/getting-started", iconOnly: true })] })] })),
};
export const APIKey = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-3 p-4 border rounded-lg max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold", children: "API Key" }), _jsx("span", { className: "text-xs text-green-600 font-medium", children: "Active" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("code", { className: "flex-1 px-3 py-2 bg-gray-100 rounded text-sm font-mono overflow-hidden text-ellipsis", children: "sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz" }), _jsx(CopyButton, { text: "sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz", iconOnly: true })] }), _jsx("p", { className: "text-xs text-gray-600", children: "Keep this key secret. Anyone with this key can make API requests on your behalf." })] })),
};
export const MessageContent = {
    render: () => (_jsx("div", { className: "flex flex-col gap-2 p-4 border rounded-lg max-w-lg bg-white", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" }), _jsx("span", { className: "font-medium", children: "AI Assistant" })] }), _jsx("p", { className: "text-gray-700", children: "Here's a solution to your problem: You can use the useState hook to manage local component state. Import it from React like this: import  useState  from 'react'" })] }), _jsx(CopyButton, { text: "Here's a solution to your problem: You can use the useState hook to manage local component state. Import it from React like this: import { useState } from 'react'", iconOnly: true, variant: "ghost", size: "sm" })] }) })),
};
export const CommandLine = {
    render: () => (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-900 text-gray-100 rounded font-mono text-sm", children: [_jsx("span", { children: "$ npm install @clarity-chat/react" }), _jsx(CopyButton, { text: "npm install @clarity-chat/react", iconOnly: true, variant: "ghost" })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-900 text-gray-100 rounded font-mono text-sm", children: [_jsx("span", { children: "$ pnpm add @clarity-chat/react" }), _jsx(CopyButton, { text: "pnpm add @clarity-chat/react", iconOnly: true, variant: "ghost" })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-900 text-gray-100 rounded font-mono text-sm", children: [_jsx("span", { children: "$ yarn add @clarity-chat/react" }), _jsx(CopyButton, { text: "yarn add @clarity-chat/react", iconOnly: true, variant: "ghost" })] })] })),
};
export const MultipleItems = {
    render: () => (_jsxs("div", { className: "grid grid-cols-2 gap-3 max-w-2xl", children: [_jsxs("div", { className: "flex items-center gap-2 p-3 border rounded", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium", children: "User ID" }), _jsx("div", { className: "text-xs text-gray-600 font-mono", children: "user_abc123" })] }), _jsx(CopyButton, { text: "user_abc123", iconOnly: true })] }), _jsxs("div", { className: "flex items-center gap-2 p-3 border rounded", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium", children: "Session ID" }), _jsx("div", { className: "text-xs text-gray-600 font-mono", children: "sess_def456" })] }), _jsx(CopyButton, { text: "sess_def456", iconOnly: true })] }), _jsxs("div", { className: "flex items-center gap-2 p-3 border rounded", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium", children: "Auth Token" }), _jsx("div", { className: "text-xs text-gray-600 font-mono", children: "tok_ghi789..." })] }), _jsx(CopyButton, { text: "tok_ghi789jkl012mno345", iconOnly: true })] }), _jsxs("div", { className: "flex items-center gap-2 p-3 border rounded", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium", children: "Webhook URL" }), _jsx("div", { className: "text-xs text-gray-600 font-mono", children: "https://..." })] }), _jsx(CopyButton, { text: "https://api.example.com/webhooks/abc123", iconOnly: true })] })] })),
};
// ============================================================================
// Callback Example
// ============================================================================
export const WithCallback = {
    render: () => {
        const handleCopy = () => {
            console.log('Text copied to clipboard!');
            // Could also show a toast notification, track analytics, etc.
        };
        return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(CopyButton, { text: "This triggers a callback when copied", onCopy: handleCopy }), _jsx("p", { className: "text-sm text-gray-600", children: "Open the browser console to see the callback in action" })] }));
    },
};
// ============================================================================
// Accessibility
// ============================================================================
export const Accessibility = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4 max-w-md", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx(CopyButton, { text: "Accessible button with proper ARIA labels" }) }), _jsx("div", { className: "flex items-center gap-2", children: _jsx(CopyButton, { text: "Icon only also has ARIA labels", iconOnly: true }) }), _jsxs("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded text-sm", children: [_jsx("strong", { children: "Accessibility Features:" }), _jsxs("ul", { className: "mt-2 space-y-1 list-disc list-inside", children: [_jsx("li", { children: "Proper ARIA labels for screen readers" }), _jsx("li", { children: "Keyboard accessible (Tab to focus, Enter/Space to activate)" }), _jsx("li", { children: "Clear visual feedback on focus" }), _jsx("li", { children: "Success state announced to screen readers" }), _jsx("li", { children: "Color-independent feedback (icon changes)" })] })] })] })),
};
// ============================================================================
// Playground
// ============================================================================
export const Playground = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4 p-6 border rounded-lg", children: [_jsx("h3", { className: "font-semibold", children: "Try it yourself!" }), _jsx("textarea", { className: "w-full h-32 px-3 py-2 border rounded", placeholder: "Enter text to copy...", id: "playground-text", defaultValue: "Edit this text and click the copy button below" }), _jsx(CopyButton, { text: (typeof document !== 'undefined' && document.getElementById('playground-text')?.value) || 'Default text' })] })),
};
//# sourceMappingURL=CopyButton.stories.js.map