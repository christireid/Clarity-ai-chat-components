import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Textarea } from '@clarity-chat/primitives';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
/**
 * Textarea component for multi-line text input.
 *
 * **Key Features:**
 * - Auto-resizing capability
 * - Character count
 * - Disabled and readonly states
 * - Validation support
 *
 * **Use Cases:**
 * - Message composition
 * - Comments and feedback
 * - Long-form content
 * - Notes and descriptions
 */
const meta = {
    title: 'Components/Inputs/Textarea',
    component: Textarea,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Multi-line text input component for longer content.',
            },
        },
        status: {
            type: 'stable',
        },
        badges: ['stable', 'tested', 'accessible'],
    },
    tags: ['autodocs', 'stable'],
    decorators: [
        (Story) => (_jsx("div", { style: { width: '500px' }, children: _jsx(Story, {}) })),
    ],
};
export default meta;
export const Default = {
    args: {
        placeholder: 'Type your message...',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test textarea renders
        const textarea = canvas.getByPlaceholderText('Type your message...');
        await expect(textarea).toBeInTheDocument();
        await expect(textarea).not.toBeDisabled();
        // Test typing into textarea
        await userEvent.type(textarea, 'This is a test message\nwith multiple lines');
        await expect(textarea).toHaveValue('This is a test message\nwith multiple lines');
    },
};
export const WithLabel = {
    render: () => (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Message" }), _jsx(Textarea, { placeholder: "Type your message here..." })] })),
};
export const WithRows = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Small (3 rows)" }), _jsx(Textarea, { rows: 3, placeholder: "Smaller textarea..." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Default (4 rows)" }), _jsx(Textarea, { rows: 4, placeholder: "Default textarea..." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Large (8 rows)" }), _jsx(Textarea, { rows: 8, placeholder: "Larger textarea..." })] })] })),
};
export const WithCharacterCount = {
    render: () => {
        const [text, setText] = useState('');
        const maxLength = 200;
        return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Description" }), _jsx(Textarea, { value: text, onChange: (e) => setText(e.target.value), placeholder: "Describe your issue...", maxLength: maxLength }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-gray-500", children: [text.length, "/", maxLength, " characters"] }), text.length > maxLength * 0.9 && (_jsxs("span", { className: "text-orange-500", children: [maxLength - text.length, " remaining"] }))] })] }));
    },
};
export const States = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Default" }), _jsx(Textarea, { placeholder: "Default state" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Disabled" }), _jsx(Textarea, { placeholder: "Disabled state", disabled: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Readonly" }), _jsx(Textarea, { value: "This is read-only content that cannot be edited.", readOnly: true })] })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test default state
        const defaultTextarea = canvas.getByPlaceholderText('Default state');
        await expect(defaultTextarea).toBeInTheDocument();
        await expect(defaultTextarea).not.toBeDisabled();
        // Test disabled state
        const disabledTextarea = canvas.getByPlaceholderText('Disabled state');
        await expect(disabledTextarea).toBeDisabled();
        // Test readonly state
        const readonlyTextarea = canvas.getByDisplayValue('This is read-only content that cannot be edited.');
        await expect(readonlyTextarea).toHaveAttribute('readonly');
    },
};
export const WithValidation = {
    render: () => {
        const [feedback, setFeedback] = useState('');
        const [error, setError] = useState('');
        const minLength = 10;
        const validate = (value) => {
            if (!value) {
                setError('Feedback is required');
            }
            else if (value.length < minLength) {
                setError(`Please enter at least ${minLength} characters`);
            }
            else {
                setError('');
            }
        };
        return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Feedback" }), _jsx(Textarea, { value: feedback, onChange: (e) => {
                        setFeedback(e.target.value);
                        validate(e.target.value);
                    }, onBlur: () => validate(feedback), placeholder: "Tell us what you think...", className: error ? 'border-red-500' : '' }), error && (_jsx("p", { className: "text-sm text-red-500", children: error })), feedback && !error && (_jsx("p", { className: "text-sm text-green-500", children: "\u2713 Thank you for your feedback!" }))] }));
    },
};
export const CommentBox = {
    render: () => {
        const [comment, setComment] = useState('');
        return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Add a comment" }), _jsx(Textarea, { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Share your thoughts...", rows: 4 })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-gray-500", children: [comment.length, " characters"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setComment(''), className: "px-4 py-2 text-sm border rounded-md hover:bg-gray-50", children: "Cancel" }), _jsx("button", { disabled: !comment.trim(), className: "px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed", children: "Post Comment" })] })] })] }));
    },
};
export const MessageComposer = {
    render: () => {
        const [message, setMessage] = useState('');
        const handleSend = () => {
            if (message.trim()) {
                alert(`Message sent: ${message}`);
                setMessage('');
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSend();
            }
        };
        return (_jsxs("div", { className: "border rounded-lg overflow-hidden", children: [_jsxs("div", { className: "bg-gray-50 px-3 py-2 border-b flex items-center gap-2", children: [_jsx("button", { className: "p-1 hover:bg-gray-200 rounded", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" }) }) }), _jsx("button", { className: "p-1 hover:bg-gray-200 rounded", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }), _jsx("button", { className: "p-1 hover:bg-gray-200 rounded", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" }) }) })] }), _jsx(Textarea, { value: message, onChange: (e) => setMessage(e.target.value), onKeyDown: handleKeyDown, placeholder: "Type a message... (Cmd/Ctrl+Enter to send)", className: "border-0 focus:ring-0 resize-none", rows: 5 }), _jsxs("div", { className: "bg-gray-50 px-3 py-2 border-t flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-gray-500", children: "Cmd/Ctrl + Enter to send" }), _jsxs("button", { onClick: handleSend, disabled: !message.trim(), className: "px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: [_jsx("span", { children: "Send" }), _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }) })] })] })] }));
    },
};
export const AutoGrowing = {
    render: () => {
        const [text, setText] = useState('');
        return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Auto-growing Textarea" }), _jsx(Textarea, { value: text, onChange: (e) => setText(e.target.value), placeholder: "This textarea would auto-grow with content...", className: "resize-none", style: {
                        minHeight: '80px',
                        height: 'auto',
                    } }), _jsx("p", { className: "text-xs text-gray-500", children: "Tip: In production, use a library like react-textarea-autosize for true auto-growing behavior" })] }));
    },
};
//# sourceMappingURL=Textarea.stories.js.map