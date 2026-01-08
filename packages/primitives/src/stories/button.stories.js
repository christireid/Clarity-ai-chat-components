import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '../components/button';
/**
 * Button component with loading states, ripple effects, and full accessibility.
 *
 * ## Features
 * - Multiple visual variants (default, destructive, outline, secondary, ghost, link)
 * - Loading, success, and error states with animations
 * - Material Design ripple effect
 * - Full keyboard navigation (Enter, Space)
 * - Screen reader announcements for state changes
 * - Respects `prefers-reduced-motion` for accessibility
 *
 * ## Accessibility
 * - Follows WAI-ARIA Button pattern
 * - Uses `aria-busy` for loading state
 * - Announces state changes to screen readers
 * - Supports keyboard activation
 */
const meta = {
    title: 'Primitives/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
An enhanced button component built on shadcn/ui and Radix UI primitives with loading states,
ripple effects, and full accessibility support.
        `,
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'destructive',
                'outline',
                'secondary',
                'ghost',
                'link',
                'success',
                'error',
                'surface',
            ],
            description: 'Visual style variant',
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
            description: 'Size variant',
        },
        loading: {
            control: 'boolean',
            description: 'Show loading spinner',
        },
        ripple: {
            control: 'boolean',
            description: 'Enable ripple effect on click',
        },
        disabled: {
            control: 'boolean',
            description: 'Disable the button',
        },
    },
};
export default meta;
/**
 * Default button state
 */
export const Default = {
    args: {
        children: 'Button',
    },
};
/**
 * All button variants displayed together
 */
export const AllVariants = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-4 items-center", children: [_jsx(Button, { variant: "default", children: "Default" }), _jsx(Button, { variant: "secondary", children: "Secondary" }), _jsx(Button, { variant: "destructive", children: "Destructive" }), _jsx(Button, { variant: "outline", children: "Outline" }), _jsx(Button, { variant: "ghost", children: "Ghost" }), _jsx(Button, { variant: "link", children: "Link" }), _jsx(Button, { variant: "success", children: "Success" }), _jsx(Button, { variant: "surface", children: "Surface" })] })),
};
/**
 * All button sizes displayed together
 */
export const AllSizes = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-4 items-center", children: [_jsx(Button, { size: "sm", children: "Small" }), _jsx(Button, { size: "default", children: "Default" }), _jsx(Button, { size: "lg", children: "Large" }), _jsx(Button, { size: "icon", children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M5 12h14" }), _jsx("path", { d: "m12 5 7 7-7 7" })] }) })] })),
};
/**
 * Button with loading state
 */
export const Loading = {
    args: {
        loading: true,
        children: 'Loading...',
    },
};
/**
 * Interactive state management example
 */
export const StatefulButton = {
    render: function Render() {
        const [state, setState] = useState('idle');
        const handleClick = async () => {
            setState('loading');
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // Randomly succeed or fail
            setState(Math.random() > 0.3 ? 'success' : 'error');
        };
        return (_jsxs("div", { className: "flex flex-col gap-4 items-center", children: [_jsxs(Button, { state: state, onClick: handleClick, children: [state === 'idle' && 'Submit', state === 'loading' && 'Submitting...', state === 'success' && 'Done!', state === 'error' && 'Failed'] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Current state: ", _jsx("code", { children: state })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setState('idle'), children: "Reset" })] }));
    },
};
/**
 * Button with ripple effect disabled
 */
export const NoRipple = {
    args: {
        ripple: false,
        children: 'No Ripple Effect',
    },
};
/**
 * Disabled button state
 */
export const Disabled = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-4 items-center", children: [_jsx(Button, { disabled: true, children: "Disabled Default" }), _jsx(Button, { disabled: true, variant: "secondary", children: "Disabled Secondary" }), _jsx(Button, { disabled: true, variant: "outline", children: "Disabled Outline" })] })),
};
/**
 * Button with custom content (icons)
 */
export const WithIcon = {
    render: () => (_jsxs("div", { className: "flex flex-wrap gap-4 items-center", children: [_jsxs(Button, { children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "mr-2", children: [_jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), _jsx("polyline", { points: "7 10 12 15 17 10" }), _jsx("line", { x1: "12", x2: "12", y1: "15", y2: "3" })] }), "Download"] }), _jsxs(Button, { variant: "outline", children: ["Settings", _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "ml-2", children: _jsx("path", { d: "m9 18 6-6-6-6" }) })] })] })),
};
/**
 * Accessibility demo - button states announce to screen readers
 */
export const AccessibilityDemo = {
    render: function Render() {
        const [state, setState] = useState('idle');
        return (_jsxs("div", { className: "flex flex-col gap-4 items-center max-w-md", children: [_jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Enable a screen reader to hear state change announcements. Or check the live region in the DOM inspector." }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setState('loading'), children: "Start Loading" }), _jsx(Button, { variant: "outline", onClick: () => setState('success'), children: "Success" }), _jsx(Button, { variant: "destructive", onClick: () => setState('error'), children: "Error" }), _jsx(Button, { variant: "ghost", onClick: () => setState('idle'), children: "Reset" })] }), _jsxs(Button, { state: state, className: "min-w-[200px]", children: [state === 'idle' && 'Click a button above', state === 'loading' && 'Processing...', state === 'success' && 'Success!', state === 'error' && 'Error occurred'] })] }));
    },
};
//# sourceMappingURL=button.stories.js.map