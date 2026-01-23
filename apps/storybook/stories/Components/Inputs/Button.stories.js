import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@clarity-chat/primitives';
import { useState } from 'react';
import { expect, userEvent, within } from '@storybook/test';
/**
 * Enhanced Button component with ripple effect, loading states, and success/error feedback.
 *
 * **Key Features:**
 * - Material Design ripple effect on click
 * - Loading state with spinner animation
 * - Success state with checkmark and green glow
 * - Error state with shake animation and red color
 * - All standard button variants (default, destructive, outline, secondary, ghost, link)
 * - Accessible with proper ARIA attributes and keyboard navigation
 * - Automatic state reset after duration
 *
 * **Design Philosophy:**
 * - Delightful by Default: Tactile feedback makes interactions feel responsive
 * - Minimal but Modern: Clean design with thoughtful animations
 * - Intuitive: Visual feedback confirms actions
 */
const meta = {
    title: 'Components/Inputs/Button',
    component: Button,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A versatile button component with enhanced UX through microanimations and state management.',
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
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'success', 'error'],
            description: 'Button visual style',
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
            description: 'Button size',
        },
        loading: {
            control: 'boolean',
            description: 'Show loading spinner',
        },
        disabled: {
            control: 'boolean',
            description: 'Disable button interaction',
        },
        ripple: {
            control: 'boolean',
            description: 'Enable Material Design ripple effect',
        },
    },
};
export default meta;
// ============================================================================
// Basic Variants
// ============================================================================
export const Default = {
    args: {
        children: 'Default Button',
        variant: 'default',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button', { name: /default button/i });
        // Test button is clickable
        await expect(button).toBeInTheDocument();
        await expect(button).not.toBeDisabled();
        // Test click interaction
        await userEvent.click(button);
    },
};
export const Destructive = {
    args: {
        children: 'Delete',
        variant: 'destructive',
    },
};
export const Outline = {
    args: {
        children: 'Outline Button',
        variant: 'outline',
    },
};
export const Secondary = {
    args: {
        children: 'Secondary',
        variant: 'secondary',
    },
};
export const Ghost = {
    args: {
        children: 'Ghost Button',
        variant: 'ghost',
    },
};
export const Link = {
    args: {
        children: 'Link Button',
        variant: 'link',
    },
};
// ============================================================================
// Sizes
// ============================================================================
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { size: "sm", children: "Small" }), _jsx(Button, { size: "default", children: "Default" }), _jsx(Button, { size: "lg", children: "Large" })] })),
};
export const IconButton = {
    render: () => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { size: "icon", variant: "default", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) }), _jsx(Button, { size: "icon", variant: "outline", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }), _jsx(Button, { size: "icon", variant: "ghost", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) }) })] })),
};
// ============================================================================
// States
// ============================================================================
export const Loading = {
    args: {
        children: 'Loading...',
        loading: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button', { name: /loading/i });
        // Test loading state prevents interaction
        await expect(button).toBeInTheDocument();
        // Button should be disabled when loading
        await expect(button).toBeDisabled();
    },
};
export const Disabled = {
    args: {
        children: 'Disabled Button',
        disabled: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button', { name: /disabled button/i });
        // Test button is disabled and cannot be clicked
        await expect(button).toBeDisabled();
        await expect(button).toHaveAttribute('disabled');
    },
};
export const SuccessState = {
    args: {
        children: 'Success!',
        state: 'success',
    },
};
export const ErrorState = {
    args: {
        children: 'Error!',
        state: 'error',
    },
};
// ============================================================================
// Interactive Examples
// ============================================================================
export const InteractiveStates = {
    render: () => {
        const [buttonState, setButtonState] = useState('idle');
        const handleClick = () => {
            setButtonState('loading');
            // Simulate async operation
            setTimeout(() => {
                setButtonState('success');
                // Auto-reset after showing success
                setTimeout(() => {
                    setButtonState('idle');
                }, 2000);
            }, 2000);
        };
        return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs(Button, { state: buttonState, onClick: handleClick, disabled: buttonState !== 'idle', children: [buttonState === 'idle' && 'Click me', buttonState === 'loading' && 'Processing...', buttonState === 'success' && 'Done!', buttonState === 'error' && 'Failed'] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["State: ", _jsx("strong", { children: buttonState })] })] }));
    },
};
export const SimulateError = {
    render: () => {
        const [buttonState, setButtonState] = useState('idle');
        const handleClick = () => {
            setButtonState('loading');
            // Simulate async operation that fails
            setTimeout(() => {
                setButtonState('error');
                // Auto-reset after showing error
                setTimeout(() => {
                    setButtonState('idle');
                }, 2000);
            }, 2000);
        };
        return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs(Button, { state: buttonState, onClick: handleClick, disabled: buttonState !== 'idle', children: [buttonState === 'idle' && 'Submit', buttonState === 'loading' && 'Submitting...', buttonState === 'success' && 'Submitted!', buttonState === 'error' && 'Failed!'] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["State: ", _jsx("strong", { children: buttonState })] })] }));
    },
};
export const ManualStateControl = {
    render: () => {
        const [state, setState] = useState('idle');
        return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs(Button, { state: state, children: [state === 'idle' && 'Button', state === 'loading' && 'Loading...', state === 'success' && 'Success!', state === 'error' && 'Error!'] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => setState('idle'), children: "Idle" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => setState('loading'), children: "Loading" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => setState('success'), children: "Success" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => setState('error'), children: "Error" })] })] }));
    },
};
// ============================================================================
// Ripple Effect
// ============================================================================
export const RippleEffect = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex gap-4", children: [_jsx(Button, { ripple: true, children: "With Ripple (default)" }), _jsx(Button, { ripple: false, children: "Without Ripple" })] }), _jsx("p", { className: "text-sm text-gray-600 max-w-md", children: "Click the buttons to see the Material Design ripple effect. The ripple provides tactile feedback and makes interactions feel responsive." })] })),
};
export const RippleColors = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx(Button, { variant: "default", rippleColor: "rgba(255, 255, 255, 0.5)", children: "White Ripple" }), _jsx(Button, { variant: "outline", rippleColor: "rgba(59, 130, 246, 0.3)", children: "Blue Ripple" }), _jsx(Button, { variant: "destructive", rippleColor: "rgba(255, 255, 255, 0.4)", children: "Default Ripple" }), _jsx(Button, { variant: "ghost", rippleColor: "rgba(0, 0, 0, 0.2)", children: "Dark Ripple" })] })),
};
// ============================================================================
// Real-World Use Cases
// ============================================================================
export const FormSubmit = {
    render: () => {
        const [state, setState] = useState('idle');
        const handleSubmit = async () => {
            setState('loading');
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Random success/error
            const success = Math.random() > 0.3;
            setState(success ? 'success' : 'error');
            // Reset after 2 seconds
            setTimeout(() => setState('idle'), 2000);
        };
        return (_jsxs("div", { className: "flex flex-col gap-4 p-6 border rounded-lg", children: [_jsx("h3", { className: "font-semibold", children: "Contact Form" }), _jsx("input", { type: "text", placeholder: "Name", className: "px-3 py-2 border rounded", disabled: state !== 'idle' }), _jsx("input", { type: "email", placeholder: "Email", className: "px-3 py-2 border rounded", disabled: state !== 'idle' }), _jsx("textarea", { placeholder: "Message", className: "px-3 py-2 border rounded", rows: 3, disabled: state !== 'idle' }), _jsxs(Button, { state: state, onClick: handleSubmit, disabled: state !== 'idle', children: [state === 'idle' && 'Submit', state === 'loading' && 'Sending...', state === 'success' && 'Sent!', state === 'error' && 'Failed to send'] })] }));
    },
};
export const SaveAction = {
    render: () => {
        const [isSaving, setIsSaving] = useState(false);
        const [saved, setSaved] = useState(false);
        const handleSave = async () => {
            setIsSaving(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        };
        return (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { state: isSaving ? 'loading' : saved ? 'success' : 'idle', onClick: handleSave, disabled: isSaving || saved, children: isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes' }), saved && (_jsx("span", { className: "text-sm text-green-600 animate-[fadeIn_0.3s_ease-out]", children: "Your changes have been saved" }))] }));
    },
};
export const DeleteConfirmation = {
    render: () => {
        const [showConfirm, setShowConfirm] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);
        const [deleted, setDeleted] = useState(false);
        const handleDelete = async () => {
            setIsDeleting(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsDeleting(false);
            setDeleted(true);
            setTimeout(() => {
                setDeleted(false);
                setShowConfirm(false);
            }, 2000);
        };
        if (deleted) {
            return (_jsxs("div", { className: "flex items-center gap-2 text-green-600 animate-[fadeIn_0.3s_ease-out]", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Item deleted successfully"] }));
        }
        if (!showConfirm) {
            return (_jsx(Button, { variant: "destructive", onClick: () => setShowConfirm(true), children: "Delete Item" }));
        }
        return (_jsxs("div", { className: "flex flex-col gap-3 p-4 border border-red-200 rounded-lg bg-red-50", children: [_jsx("p", { className: "text-sm font-medium text-red-900", children: "Are you sure you want to delete this item?" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "destructive", size: "sm", state: isDeleting ? 'loading' : 'idle', onClick: handleDelete, disabled: isDeleting, children: isDeleting ? 'Deleting...' : 'Yes, delete' }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setShowConfirm(false), disabled: isDeleting, children: "Cancel" })] })] }));
    },
};
// ============================================================================
// Button Groups
// ============================================================================
export const ButtonGroup = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { children: "Left" }), _jsx(Button, { children: "Middle" }), _jsx(Button, { children: "Right" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", children: "Previous" }), _jsx(Button, { variant: "outline", children: "1" }), _jsx(Button, { children: "2" }), _jsx(Button, { variant: "outline", children: "3" }), _jsx(Button, { variant: "outline", children: "Next" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "icon", variant: "outline", children: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), _jsx(Button, { size: "icon", variant: "outline", children: _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })] })] })),
};
// ============================================================================
// With Icons
// ============================================================================
export const WithIcons = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs(Button, { children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), "Add Item"] }), _jsxs(Button, { variant: "destructive", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), "Delete"] }), _jsxs(Button, { variant: "outline", children: ["Download", _jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) })] })] })),
};
// ============================================================================
// Accessibility
// ============================================================================
export const Accessibility = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(Button, { "aria-label": "Save document", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }), _jsx(Button, { disabled: true, "aria-label": "This action is currently unavailable", children: "Disabled with aria-label" }), _jsx(Button, { loading: true, "aria-label": "Loading content, please wait", children: "Loading with aria-label" }), _jsx("p", { className: "text-sm text-gray-600 max-w-md", children: "All buttons have proper focus states (try pressing Tab), ARIA labels for screen readers, and keyboard navigation support (Enter/Space to activate)." })] })),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Test aria-label is present
        const saveButton = canvas.getByRole('button', { name: /save document/i });
        await expect(saveButton).toBeInTheDocument();
        // Test disabled button has aria-label
        const disabledButton = canvas.getByRole('button', { name: /currently unavailable/i });
        await expect(disabledButton).toBeDisabled();
        // Test keyboard navigation
        await userEvent.tab();
        await expect(saveButton).toHaveFocus();
        // Test keyboard activation
        await userEvent.keyboard('{Enter}');
    },
};
//# sourceMappingURL=Button.stories.js.map