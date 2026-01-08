import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Input } from '../components/input';
/**
 * Input component with labels, icons, validation, and full accessibility.
 *
 * ## Features
 * - Built-in label with proper accessibility associations
 * - Left and right icon slots
 * - Clear button for easy value reset
 * - Character count with maxLength support
 * - Error and helper text with proper ARIA
 * - Multiple size and variant options
 *
 * ## Accessibility
 * - Label properly associated via htmlFor/id
 * - Error messages linked via aria-describedby
 * - aria-invalid set when error present
 * - Character count announced to screen readers
 * - Clear button has accessible label
 */
const meta = {
    title: 'Primitives/Input',
    component: Input,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
An enhanced input component built on shadcn/ui patterns with labels, icons,
clear button, character count, and comprehensive accessibility support.
        `,
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'error', 'success'],
            description: 'Visual variant for validation states',
        },
        inputSize: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
            description: 'Size variant',
        },
        disabled: {
            control: 'boolean',
            description: 'Disable the input',
        },
        clearable: {
            control: 'boolean',
            description: 'Show clear button when input has value',
        },
        showCharacterCount: {
            control: 'boolean',
            description: 'Show character count',
        },
    },
};
export default meta;
/**
 * Default input state
 */
export const Default = {
    args: {
        placeholder: 'Enter text...',
    },
    decorators: [
        (Story) => (_jsx("div", { className: "w-[300px]", children: _jsx(Story, {}) })),
    ],
};
/**
 * Input with label
 */
export const WithLabel = {
    args: {
        label: 'Email Address',
        placeholder: 'john@example.com',
        type: 'email',
    },
    decorators: [
        (Story) => (_jsx("div", { className: "w-[300px]", children: _jsx(Story, {}) })),
    ],
};
/**
 * Required input with label
 */
export const Required = {
    args: {
        label: 'Username',
        placeholder: 'Enter username',
        required: true,
    },
    decorators: [
        (Story) => (_jsx("div", { className: "w-[300px]", children: _jsx(Story, {}) })),
    ],
};
/**
 * All input variants
 */
export const AllVariants = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4 w-[300px]", children: [_jsx(Input, { label: "Default", placeholder: "Default variant", variant: "default" }), _jsx(Input, { label: "Error", placeholder: "Error variant", variant: "error", error: "This field has an error" }), _jsx(Input, { label: "Success", placeholder: "Success variant", variant: "success", helperText: "Looking good!" })] })),
};
/**
 * All input sizes
 */
export const AllSizes = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4 w-[300px]", children: [_jsx(Input, { label: "Small", placeholder: "Small size", inputSize: "sm" }), _jsx(Input, { label: "Default", placeholder: "Default size", inputSize: "default" }), _jsx(Input, { label: "Large", placeholder: "Large size", inputSize: "lg" })] })),
};
/**
 * Input with left icon
 */
export const WithLeftIcon = {
    args: {
        label: 'Search',
        placeholder: 'Search...',
        icon: (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.3-4.3" })] })),
        iconPosition: 'left',
    },
    decorators: [
        (Story) => (_jsx("div", { className: "w-[300px]", children: _jsx(Story, {}) })),
    ],
};
/**
 * Input with right icon
 */
export const WithRightIcon = {
    args: {
        label: 'Email',
        placeholder: 'Enter email',
        type: 'email',
        icon: (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }), _jsx("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })] })),
        iconPosition: 'right',
    },
    decorators: [
        (Story) => (_jsx("div", { className: "w-[300px]", children: _jsx(Story, {}) })),
    ],
};
/**
 * Clearable input
 */
export const Clearable = {
    render: function Render() {
        const [value, setValue] = useState('Hello World');
        return (_jsxs("div", { className: "w-[300px]", children: [_jsx(Input, { label: "Clearable Input", value: value, onChange: (e) => setValue(e.target.value), clearable: true, onClear: () => setValue('') }), _jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: ["Current value: \"", value, "\""] })] }));
    },
};
/**
 * Input with character count
 */
export const WithCharacterCount = {
    render: function Render() {
        const [value, setValue] = useState('');
        return (_jsx("div", { className: "w-[300px]", children: _jsx(Input, { label: "Bio", placeholder: "Tell us about yourself...", value: value, onChange: (e) => setValue(e.target.value), maxLength: 100, showCharacterCount: true }) }));
    },
};
/**
 * Input with helper text
 */
export const WithHelperText = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter password',
        helperText: 'Must be at least 8 characters long',
    },
    decorators: [
        (Story) => (_jsx("div", { className: "w-[300px]", children: _jsx(Story, {}) })),
    ],
};
/**
 * Input with error message
 */
export const WithError = {
    args: {
        label: 'Email',
        type: 'email',
        value: 'invalid-email',
        error: 'Please enter a valid email address',
    },
    decorators: [
        (Story) => (_jsx("div", { className: "w-[300px]", children: _jsx(Story, {}) })),
    ],
};
/**
 * Disabled input
 */
export const Disabled = {
    args: {
        label: 'Disabled Input',
        value: 'Cannot edit this',
        disabled: true,
    },
    decorators: [
        (Story) => (_jsx("div", { className: "w-[300px]", children: _jsx(Story, {}) })),
    ],
};
/**
 * All features combined
 */
export const AllFeatures = {
    render: function Render() {
        const [value, setValue] = useState('');
        return (_jsx("div", { className: "w-[300px]", children: _jsx(Input, { label: "Message", placeholder: "Type your message...", value: value, onChange: (e) => setValue(e.target.value), icon: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }), iconPosition: "left", clearable: true, onClear: () => setValue(''), maxLength: 200, showCharacterCount: true, helperText: "Enter your message (max 200 characters)", required: true }) }));
    },
};
/**
 * Form validation example
 */
export const FormValidation = {
    render: function Render() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [submitted, setSubmitted] = useState(false);
        const emailError = submitted && !email.includes('@') ? 'Please enter a valid email' : '';
        const passwordError = submitted && password.length < 8
            ? 'Password must be at least 8 characters'
            : '';
        const handleSubmit = (e) => {
            e.preventDefault();
            setSubmitted(true);
            if (!emailError && !passwordError && email && password) {
                alert('Form submitted successfully!');
            }
        };
        return (_jsxs("form", { onSubmit: handleSubmit, className: "w-[300px] space-y-4", children: [_jsx(Input, { label: "Email", type: "email", placeholder: "john@example.com", value: email, onChange: (e) => {
                        setEmail(e.target.value);
                        setSubmitted(false);
                    }, error: emailError, required: true }), _jsx(Input, { label: "Password", type: "password", placeholder: "Enter password", value: password, onChange: (e) => {
                        setPassword(e.target.value);
                        setSubmitted(false);
                    }, error: passwordError, helperText: !passwordError ? 'Must be at least 8 characters' : '', required: true }), _jsx("button", { type: "submit", className: "w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors", children: "Submit" })] }));
    },
};
/**
 * Different input types
 */
export const InputTypes = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4 w-[300px]", children: [_jsx(Input, { label: "Text", type: "text", placeholder: "Plain text" }), _jsx(Input, { label: "Email", type: "email", placeholder: "email@example.com" }), _jsx(Input, { label: "Password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), _jsx(Input, { label: "Number", type: "number", placeholder: "42" }), _jsx(Input, { label: "Tel", type: "tel", placeholder: "555-1234" }), _jsx(Input, { label: "URL", type: "url", placeholder: "https://example.com" })] })),
};
/**
 * Hidden label (visually hidden but accessible)
 */
export const HiddenLabel = {
    args: {
        label: 'Search (visually hidden)',
        placeholder: 'Search...',
        hideLabel: true,
        icon: (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.3-4.3" })] })),
        iconPosition: 'left',
    },
    decorators: [
        (Story) => (_jsxs("div", { className: "w-[300px]", children: [_jsx("p", { className: "text-sm text-muted-foreground mb-2", children: "The label is visually hidden but still accessible to screen readers." }), _jsx(Story, {})] })),
    ],
};
/**
 * Accessibility demo
 */
export const AccessibilityDemo = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4 items-center max-w-md", children: [_jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Use a screen reader to test the accessibility features. Labels are properly associated, errors are announced, and character counts use live regions." }), _jsxs("div", { className: "w-[300px] space-y-4", children: [_jsx(Input, { label: "Accessible Email", type: "email", placeholder: "Enter your email", error: "This email is already registered", "aria-describedby": "email-help" }), _jsx("p", { id: "email-help", className: "text-xs text-muted-foreground", children: "We'll never share your email with anyone." }), _jsx(Input, { label: "Character Limited", placeholder: "Type something...", maxLength: 50, showCharacterCount: true, helperText: "Characters remaining are announced to screen readers" })] })] })),
};
//# sourceMappingURL=input.stories.js.map