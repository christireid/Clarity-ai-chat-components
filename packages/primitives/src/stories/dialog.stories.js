import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose, } from '../components/dialog';
import { Button } from '../components/button';
import { Input } from '../components/input';
/**
 * Dialog component with focus trap, animations, and full accessibility.
 *
 * ## Features
 * - Multiple animation presets (scale, slide-up, slide-down, fade, zoom)
 * - Focus trap with proper focus restoration
 * - Keyboard navigation (Escape to close)
 * - Screen reader announcements
 * - Respects `prefers-reduced-motion` for accessibility
 * - Compound component pattern for flexibility
 * - Controlled and uncontrolled modes
 *
 * ## Accessibility
 * - Follows WAI-ARIA Dialog pattern
 * - Uses `aria-modal` for modal dialogs
 * - `aria-labelledby` linked to title
 * - `aria-describedby` linked to description
 * - Focus trapped within dialog when open
 * - Focus restored to trigger on close
 */
const meta = {
    title: 'Primitives/Dialog',
    component: Dialog,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
An accessible dialog/modal component built with compound components pattern,
featuring focus trap, keyboard navigation, and multiple animation styles.
        `,
            },
        },
    },
};
export default meta;
/**
 * Default dialog with standard layout
 */
export const Default = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open Dialog" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Welcome" }), _jsx(DialogDescription, { children: "This is a basic dialog with standard styling and animations." })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Dialogs are great for focused interactions that require user attention. They trap focus and can be dismissed with the Escape key." }) }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Cancel" }) }), _jsx(DialogClose, { asChild: true, children: _jsx(Button, { children: "Confirm" }) })] })] })] })),
};
/**
 * All dialog sizes displayed
 */
export const AllSizes = {
    render: () => (_jsx("div", { className: "flex flex-wrap gap-4", children: ['sm', 'md', 'lg', 'xl', 'full'].map((size) => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: size.toUpperCase() }) }), _jsxs(DialogContent, { size: size, children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { children: ["Size: ", size.toUpperCase()] }), _jsxs(DialogDescription, { children: ["This dialog uses the \"", size, "\" size preset."] })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Different sizes are useful for different content needs." }) }), _jsx(DialogFooter, { children: _jsx(DialogClose, { asChild: true, children: _jsx(Button, { children: "Close" }) }) })] })] }, size))) })),
};
/**
 * All animation types
 */
export const AllAnimations = {
    render: () => (_jsx("div", { className: "flex flex-wrap gap-4", children: ['scale', 'slide-up', 'slide-down', 'fade', 'zoom', 'none'].map((animation) => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: animation }) }), _jsxs(DialogContent, { animation: animation, children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { children: ["Animation: ", animation] }), _jsxs(DialogDescription, { children: ["This dialog uses the \"", animation, "\" animation preset."] })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Each animation provides a different feel for the dialog entrance and exit." }) }), _jsx(DialogFooter, { children: _jsx(DialogClose, { asChild: true, children: _jsx(Button, { children: "Close" }) }) })] })] }, animation))) })),
};
/**
 * Controlled dialog state
 */
export const Controlled = {
    render: function Render() {
        const [open, setOpen] = useState(false);
        return (_jsxs("div", { className: "flex flex-col gap-4 items-center", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Dialog state: ", _jsx("code", { children: open ? 'open' : 'closed' })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setOpen(true), children: "Open via state" }), _jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Close via state" })] }), _jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "secondary", children: "Open via Trigger" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Controlled Dialog" }), _jsx(DialogDescription, { children: "This dialog's open state is controlled externally." })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "You can control the dialog programmatically using the open prop and onOpenChange callback." }) }), _jsx(DialogFooter, { children: _jsx(DialogClose, { asChild: true, children: _jsx(Button, { children: "Close" }) }) })] })] })] }));
    },
};
/**
 * Dialog with form content
 */
export const WithForm = {
    render: function Render() {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const handleSubmit = (e) => {
            e.preventDefault();
            alert(`Submitted: ${name} (${email})`);
        };
        return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open Form" }) }), _jsx(DialogContent, { size: "md", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Create Account" }), _jsx(DialogDescription, { children: "Fill out the form below to create your account." })] }), _jsxs(DialogBody, { className: "space-y-4", children: [_jsx(Input, { label: "Name", placeholder: "John Doe", value: name, onChange: (e) => setName(e.target.value), required: true }), _jsx(Input, { label: "Email", type: "email", placeholder: "john@example.com", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { type: "button", variant: "outline", children: "Cancel" }) }), _jsx(Button, { type: "submit", children: "Create Account" })] })] }) })] }));
    },
};
/**
 * Destructive action confirmation dialog
 */
export const DestructiveConfirmation = {
    render: function Render() {
        const [isDeleting, setIsDeleting] = useState(false);
        const handleDelete = async () => {
            setIsDeleting(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsDeleting(false);
            alert('Item deleted!');
        };
        return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "destructive", children: "Delete Item" }) }), _jsxs(DialogContent, { size: "sm", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Delete Item?" }), _jsx(DialogDescription, { children: "This action cannot be undone. This will permanently delete the item from our servers." })] }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { variant: "outline", disabled: isDeleting, children: "Cancel" }) }), _jsx(Button, { variant: "destructive", onClick: handleDelete, loading: isDeleting, children: isDeleting ? 'Deleting...' : 'Delete' })] })] })] }));
    },
};
/**
 * Dialog without close button
 */
export const NoCloseButton = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open Dialog" }) }), _jsxs(DialogContent, { showCloseButton: false, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "No Close Button" }), _jsx(DialogDescription, { children: "This dialog has no close button. Use Escape key or the footer button to close." })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Sometimes you want to force users to make a choice rather than dismissing the dialog." }) }), _jsx(DialogFooter, { children: _jsx(DialogClose, { asChild: true, children: _jsx(Button, { children: "I Understand" }) }) })] })] })),
};
/**
 * Dialog that doesn't close on outside click
 */
export const NoCloseOnOutsideClick = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open Dialog" }) }), _jsxs(DialogContent, { closeOnClickOutside: false, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Persistent Dialog" }), _jsx(DialogDescription, { children: "Clicking outside this dialog won't close it." })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Use the close button or Escape key to dismiss this dialog." }) }), _jsx(DialogFooter, { children: _jsx(DialogClose, { asChild: true, children: _jsx(Button, { children: "Close" }) }) })] })] })),
};
/**
 * Dialog without backdrop blur
 */
export const NoBackdropBlur = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open Dialog" }) }), _jsxs(DialogContent, { blurBackdrop: false, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "No Backdrop Blur" }), _jsx(DialogDescription, { children: "This dialog has backdrop blur disabled." })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Disabling backdrop blur can improve performance on lower-end devices." }) }), _jsx(DialogFooter, { children: _jsx(DialogClose, { asChild: true, children: _jsx(Button, { children: "Close" }) }) })] })] })),
};
/**
 * Accessibility demo - focus trap
 */
export const AccessibilityDemo = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4 items-center max-w-md", children: [_jsx("p", { className: "text-sm text-muted-foreground text-center", children: "When the dialog opens, focus is trapped inside. Try pressing Tab to cycle through elements. Press Escape to close." }), _jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open Dialog" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Accessibility Features" }), _jsx(DialogDescription, { children: "This dialog demonstrates proper accessibility patterns." })] }), _jsxs(DialogBody, { className: "space-y-4", children: [_jsx(Input, { label: "First Name", placeholder: "Tab to next field" }), _jsx(Input, { label: "Last Name", placeholder: "Tab to next field" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Notice how focus cycles through the focusable elements and doesn't leave the dialog." })] }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Cancel" }) }), _jsx(Button, { children: "Submit" })] })] })] })] })),
};
/**
 * Scrollable dialog content
 */
export const ScrollableContent = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open Long Dialog" }) }), _jsxs(DialogContent, { size: "md", className: "max-h-[80vh] overflow-hidden flex flex-col", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Terms of Service" }), _jsx(DialogDescription, { children: "Please read and accept our terms of service." })] }), _jsx(DialogBody, { className: "overflow-y-auto flex-1", children: Array.from({ length: 20 }).map((_, i) => (_jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." }, i))) }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Decline" }) }), _jsx(DialogClose, { asChild: true, children: _jsx(Button, { children: "Accept" }) })] })] })] })),
};
//# sourceMappingURL=dialog.stories.js.map