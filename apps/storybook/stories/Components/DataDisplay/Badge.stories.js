import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from '@clarity-chat/primitives';
import { expect, within } from 'storybook/test';
/**
 * Badge component for displaying small count indicators, status labels, and tags.
 *
 * **Key Features:**
 * - Multiple variants (default, secondary, destructive, outline)
 * - Compact and readable
 * - Can be used with icons
 *
 * **Use Cases:**
 * - Status indicators
 * - Notification counts
 * - Tags and labels
 * - Category markers
 */
const meta = {
    title: 'Components/DataDisplay/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Small count and label indicators for status, categories, and notifications.',
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline'],
            description: 'Visual style variant',
        },
    },
};
export default meta;
export const Default = {
    args: {
        children: 'Badge',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test badge renders with correct text
        await expect(canvas.getByText('Badge')).toBeInTheDocument();
    },
};
export const Variants = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Badge, { children: "Default" }), _jsx(Badge, { variant: "secondary", children: "Secondary" }), _jsx(Badge, { variant: "destructive", children: "Destructive" }), _jsx(Badge, { variant: "outline", children: "Outline" })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test all badge variants are rendered
        await expect(canvas.getByText('Default')).toBeInTheDocument();
        await expect(canvas.getByText('Secondary')).toBeInTheDocument();
        await expect(canvas.getByText('Destructive')).toBeInTheDocument();
        await expect(canvas.getByText('Outline')).toBeInTheDocument();
    },
};
export const StatusIndicators = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", children: "Online:" }), _jsx(Badge, { className: "bg-green-500", children: "Active" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", children: "Processing:" }), _jsx(Badge, { className: "bg-yellow-500", children: "Pending" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", children: "Error:" }), _jsx(Badge, { variant: "destructive", children: "Failed" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", children: "Completed:" }), _jsx(Badge, { className: "bg-blue-500", children: "Success" })] })] })),
};
export const WithCounts = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", children: "Unread Messages" }), _jsx(Badge, { className: "bg-red-500", children: "12" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", children: "Active Chats" }), _jsx(Badge, { className: "bg-green-500", children: "3" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", children: "Notifications" }), _jsx(Badge, { className: "bg-blue-500", children: "99+" })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test count badges display correct numbers
        await expect(canvas.getByText('12')).toBeInTheDocument();
        await expect(canvas.getByText('3')).toBeInTheDocument();
        await expect(canvas.getByText('99+')).toBeInTheDocument();
    },
};
export const Tags = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Badge, { variant: "outline", children: "React" }), _jsx(Badge, { variant: "outline", children: "TypeScript" }), _jsx(Badge, { variant: "outline", children: "AI" }), _jsx(Badge, { variant: "outline", children: "Chat" }), _jsx(Badge, { variant: "outline", children: "Components" })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test tag badges are rendered
        await expect(canvas.getByText('React')).toBeInTheDocument();
        await expect(canvas.getByText('TypeScript')).toBeInTheDocument();
        await expect(canvas.getByText('AI')).toBeInTheDocument();
        await expect(canvas.getByText('Chat')).toBeInTheDocument();
        await expect(canvas.getByText('Components')).toBeInTheDocument();
    },
};
export const WithIcons = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsxs(Badge, { className: "bg-green-500 flex items-center gap-1", children: [_jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Verified"] }), _jsxs(Badge, { className: "bg-blue-500 flex items-center gap-1", children: [_jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }), "Premium"] }), _jsxs(Badge, { className: "bg-yellow-500 flex items-center gap-1", children: [_jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), "Warning"] })] })),
};
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { className: "text-xs px-1.5 py-0.5", children: "Small" }), _jsx(Badge, { children: "Default" }), _jsx(Badge, { className: "text-base px-3 py-1", children: "Large" })] })),
};
export const InContext = {
    render: () => (_jsxs("div", { className: "space-y-4 max-w-sm", children: [_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-semibold", children: "Chat Session #1234" }), _jsx(Badge, { className: "bg-green-500", children: "Active" })] }), _jsx("p", { className: "text-sm text-gray-600", children: "Last message 2 minutes ago" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsxs("h3", { className: "font-semibold flex items-center gap-2", children: ["Notifications", _jsx(Badge, { variant: "destructive", children: "5 New" })] }) }), _jsx("p", { className: "text-sm text-gray-600", children: "You have unread messages" })] }), _jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-semibold", children: "AI Model" }), _jsxs("div", { className: "flex gap-1", children: [_jsx(Badge, { variant: "outline", children: "GPT-4" }), _jsx(Badge, { className: "bg-blue-500", children: "Latest" })] })] }), _jsx("p", { className: "text-sm text-gray-600", children: "Using the latest model" })] })] })),
};
//# sourceMappingURL=Badge.stories.js.map