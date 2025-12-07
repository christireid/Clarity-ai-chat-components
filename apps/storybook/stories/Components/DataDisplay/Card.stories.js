import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@clarity-chat/primitives';
import { Button } from '@clarity-chat/primitives';
import { expect, userEvent, within } from 'storybook/test';
/**
 * Card component provides a flexible container for content sections.
 *
 * **Key Features:**
 * - Composable structure with Header, Content, and Footer
 * - Consistent styling and spacing
 * - Flexible and customizable
 *
 * **Use Cases:**
 * - Feature highlights
 * - Content grouping
 * - Dashboard widgets
 * - Settings panels
 */
const meta = {
    title: 'Components/DataDisplay/Card',
    component: Card,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Flexible container component for grouping related content.',
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
    decorators: [
        (Story) => (_jsx("div", { style: { width: '400px' }, children: _jsx(Story, {}) })),
    ],
};
export default meta;
export const Default = {
    render: () => (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Card Title" }), _jsx(CardDescription, { children: "Card description goes here" })] }), _jsx(CardContent, { children: _jsx("p", { children: "Card content with some example text to demonstrate the layout." }) })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test card structure renders correctly
        await expect(canvas.getByText('Card Title')).toBeInTheDocument();
        await expect(canvas.getByText('Card description goes here')).toBeInTheDocument();
        await expect(canvas.getByText(/Card content with some example text/)).toBeInTheDocument();
    },
};
export const WithFooter = {
    render: () => (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Create Project" }), _jsx(CardDescription, { children: "Deploy your new project in one-click." })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Project Name" }), _jsx("input", { type: "text", placeholder: "My Awesome Project", className: "w-full px-3 py-2 border rounded-md" })] }) }), _jsxs(CardFooter, { className: "flex justify-between", children: [_jsx(Button, { variant: "outline", children: "Cancel" }), _jsx(Button, { children: "Deploy" })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test card with footer and buttons
        await expect(canvas.getByText('Create Project')).toBeInTheDocument();
        await expect(canvas.getByRole('textbox')).toBeInTheDocument();
        const cancelButton = canvas.getByRole('button', { name: /cancel/i });
        const deployButton = canvas.getByRole('button', { name: /deploy/i });
        await expect(cancelButton).toBeInTheDocument();
        await expect(deployButton).toBeInTheDocument();
        // Test button click
        await userEvent.click(deployButton);
    },
};
export const FeatureCard = {
    render: () => (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx("svg", { className: "w-6 h-6 text-blue-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }) }), _jsx(CardTitle, { children: "Lightning Fast" }), _jsx(CardDescription, { children: "Optimized for speed and performance" })] }), _jsx(CardContent, { children: _jsx("p", { className: "text-sm text-gray-600", children: "Built with modern technologies and best practices to ensure your application runs smoothly at scale." }) })] })),
};
export const StatsCard = {
    render: () => (_jsxs("div", { className: "grid gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Messages" }), _jsx("svg", { className: "w-4 h-4 text-gray-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "2,345" }), _jsx("p", { className: "text-xs text-gray-500", children: "+12% from last month" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Active Users" }), _jsx("svg", { className: "w-4 h-4 text-gray-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }) })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "573" }), _jsx("p", { className: "text-xs text-gray-500", children: "+8% from last month" })] })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test stats cards render with correct data
        await expect(canvas.getByText('Total Messages')).toBeInTheDocument();
        await expect(canvas.getByText('2,345')).toBeInTheDocument();
        await expect(canvas.getByText('+12% from last month')).toBeInTheDocument();
        await expect(canvas.getByText('Active Users')).toBeInTheDocument();
        await expect(canvas.getByText('573')).toBeInTheDocument();
        await expect(canvas.getByText('+8% from last month')).toBeInTheDocument();
    },
};
export const ChatPreviewCard = {
    render: () => (_jsxs(Card, { className: "cursor-pointer hover:shadow-lg transition-shadow", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold", children: "AI" }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-base", children: "Customer Support Bot" }), _jsx(CardDescription, { className: "text-xs", children: "Last active 2 minutes ago" })] })] }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-sm text-gray-600", children: "How can I help you track your order today?" }) }), _jsx(CardFooter, { className: "text-xs text-gray-500", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { children: "156 messages" }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "3 participants" })] }) })] })),
};
export const InteractiveCard = {
    render: () => (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "AI Model Configuration" }), _jsx(CardDescription, { children: "Customize your AI assistant's behavior" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Temperature" }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.1", defaultValue: "0.7", className: "w-full" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsx("span", { children: "Precise" }), _jsx("span", { children: "Creative" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Max Tokens" }), _jsx("input", { type: "number", defaultValue: "2048", className: "w-full px-3 py-2 border rounded-md" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm font-medium", children: "Streaming" }), _jsx("input", { type: "checkbox", defaultChecked: true, className: "h-4 w-4" })] })] }), _jsx(CardFooter, { children: _jsx(Button, { className: "w-full", children: "Save Configuration" }) })] })),
};
export const LoadingCard = {
    render: () => (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx("div", { className: "h-5 w-3/4 bg-gray-200 rounded animate-pulse" }), _jsx("div", { className: "h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2" })] }), _jsxs(CardContent, { className: "space-y-2", children: [_jsx("div", { className: "h-4 w-full bg-gray-200 rounded animate-pulse" }), _jsx("div", { className: "h-4 w-full bg-gray-200 rounded animate-pulse" }), _jsx("div", { className: "h-4 w-2/3 bg-gray-200 rounded animate-pulse" })] })] })),
};
//# sourceMappingURL=Card.stories.js.map