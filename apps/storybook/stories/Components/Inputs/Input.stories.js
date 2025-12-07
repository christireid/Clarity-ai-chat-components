import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from '@clarity-chat/primitives';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
/**
 * Input component for text entry with various states and types.
 *
 * **Key Features:**
 * - Multiple input types (text, email, password, number, etc.)
 * - Disabled and readonly states
 * - Error and success states
 * - Icon support
 * - Accessible labels
 *
 * **Best Practices:**
 * - Always provide labels (visible or aria-label)
 * - Show clear error messages
 * - Use appropriate input types
 * - Provide placeholder text as hints
 */
const meta = {
    title: 'Components/Inputs/Input',
    component: Input,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Text input component with support for various types and states.',
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
    args: {
        placeholder: 'Enter text...',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test input renders and accepts text
        const input = canvas.getByPlaceholderText('Enter text...');
        await expect(input).toBeInTheDocument();
        await expect(input).not.toBeDisabled();
        // Test typing into input
        await userEvent.type(input, 'Hello World');
        await expect(input).toHaveValue('Hello World');
    },
};
export const WithLabel = {
    render: () => (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Email" }), _jsx(Input, { type: "email", placeholder: "you@example.com" })] })),
};
export const Types = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Text" }), _jsx(Input, { type: "text", placeholder: "Enter text" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Email" }), _jsx(Input, { type: "email", placeholder: "you@example.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Password" }), _jsx(Input, { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Number" }), _jsx(Input, { type: "number", placeholder: "123" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Search" }), _jsx(Input, { type: "search", placeholder: "Search..." })] })] })),
};
export const States = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Default" }), _jsx(Input, { placeholder: "Default state" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Disabled" }), _jsx(Input, { placeholder: "Disabled", disabled: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Readonly" }), _jsx(Input, { value: "Read-only value", readOnly: true })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test default input is not disabled
        const defaultInput = canvas.getByPlaceholderText('Default state');
        await expect(defaultInput).not.toBeDisabled();
        // Test disabled input
        const disabledInput = canvas.getByPlaceholderText('Disabled');
        await expect(disabledInput).toBeDisabled();
        // Test readonly input
        const readonlyInput = canvas.getByDisplayValue('Read-only value');
        await expect(readonlyInput).toHaveAttribute('readonly');
    },
};
export const WithValidation = {
    render: () => {
        const [email, setEmail] = useState('');
        const [error, setError] = useState('');
        const validateEmail = (value) => {
            if (!value) {
                setError('Email is required');
            }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                setError('Please enter a valid email');
            }
            else {
                setError('');
            }
        };
        return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Email" }), _jsx(Input, { type: "email", placeholder: "you@example.com", value: email, onChange: (e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                    }, onBlur: () => validateEmail(email), className: error ? 'border-red-500' : '' }), error && (_jsx("p", { className: "text-sm text-red-500", children: error })), email && !error && (_jsx("p", { className: "text-sm text-green-500", children: "\u2713 Valid email" }))] }));
    },
};
export const WithIcons = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Search" }), _jsxs("div", { className: "relative", children: [_jsx("svg", { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx(Input, { className: "pl-10", placeholder: "Search messages..." })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx("svg", { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }), _jsx(Input, { className: "pl-10", type: "email", placeholder: "you@example.com" })] })] })] })),
};
export const Sizes = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsx(Input, { className: "h-8 text-sm", placeholder: "Small" }), _jsx(Input, { placeholder: "Default" }), _jsx(Input, { className: "h-12 text-lg", placeholder: "Large" })] })),
};
export const FormExample = {
    render: () => {
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            password: '',
        });
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Full Name" }), _jsx(Input, { value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "John Doe" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Email Address" }), _jsx(Input, { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "john@example.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Password" }), _jsx(Input, { type: "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), _jsx("p", { className: "text-xs text-gray-500", children: "Must be at least 8 characters" })] }), _jsx("button", { className: "w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "Create Account" })] }));
    },
};
export const SearchInput = {
    render: () => {
        const [query, setQuery] = useState('');
        return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "relative", children: [_jsx("svg", { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx(Input, { className: "pl-10 pr-10", placeholder: "Search conversations...", value: query, onChange: (e) => setQuery(e.target.value) }), query && (_jsx("button", { onClick: () => setQuery(''), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600", "aria-label": "Clear search", children: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }), query && (_jsxs("p", { className: "text-sm text-gray-500", children: ["Searching for \"", query, "\"..."] }))] }));
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test search input functionality
        const searchInput = canvas.getByPlaceholderText('Search conversations...');
        await expect(searchInput).toBeInTheDocument();
        // Type search query
        await userEvent.type(searchInput, 'React');
        await expect(searchInput).toHaveValue('React');
        // Check search indicator appears
        await expect(canvas.getByText('Searching for "React"...')).toBeInTheDocument();
        // Test clear button
        const clearButton = canvas.getByRole('button', { name: /clear search/i });
        await expect(clearButton).toBeInTheDocument();
        await userEvent.click(clearButton);
        // Verify input is cleared
        await expect(searchInput).toHaveValue('');
    },
};
//# sourceMappingURL=Input.stories.js.map