import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose, Button, Input, } from '@clarity-chat/primitives';
const meta = {
    title: 'Primitives/Dialog (Modal)',
    component: Dialog,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'A modal dialog component with backdrop blur, smooth animations, focus trap, and keyboard navigation. Supports multiple sizes and animation variants.',
            },
        },
    },
};
export default meta;
// ============================================================================
// Basic Examples
// ============================================================================
export const Default = {
    render: () => {
        const [open, setOpen] = React.useState(false);
        return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(Button, { onClick: () => setOpen(true), children: "Open Dialog" }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Dialog Title" }), _jsx(DialogDescription, { children: "This is a basic dialog with a title and description." })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "This is the dialog content. You can put any content here." }) }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }), _jsx(Button, { onClick: () => setOpen(false), children: "Confirm" })] })] })] }));
    },
};
export const WithTrigger = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open with Trigger" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Using DialogTrigger" }), _jsx(DialogDescription, { children: "The trigger component handles opening the dialog automatically." })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Click outside or press Escape to close." }) })] })] })),
};
// ============================================================================
// Sizes
// ============================================================================
export const SmallSize = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Small Dialog" }) }), _jsxs(DialogContent, { size: "sm", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Small Dialog" }), _jsx(DialogDescription, { children: "max-w-sm (384px)" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Compact dialog for simple confirmations." }) })] })] })),
};
export const MediumSize = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Medium Dialog (Default)" }) }), _jsxs(DialogContent, { size: "md", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Medium Dialog" }), _jsx(DialogDescription, { children: "max-w-md (448px)" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Default size for most dialogs." }) })] })] })),
};
export const LargeSize = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Large Dialog" }) }), _jsxs(DialogContent, { size: "lg", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Large Dialog" }), _jsx(DialogDescription, { children: "max-w-lg (512px)" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Larger dialog for more content." }) })] })] })),
};
export const ExtraLargeSize = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Extra Large Dialog" }) }), _jsxs(DialogContent, { size: "xl", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Extra Large Dialog" }), _jsx(DialogDescription, { children: "max-w-xl (576px)" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Extra large dialog for complex content." }) })] })] })),
};
export const FullWidth = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Full Width Dialog" }) }), _jsxs(DialogContent, { size: "full", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Full Width Dialog" }), _jsx(DialogDescription, { children: "Takes full available width with margin" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Useful for complex layouts or mobile views." }) })] })] })),
};
// ============================================================================
// Animations
// ============================================================================
export const ScaleAnimation = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Scale Animation (Default)" }) }), _jsxs(DialogContent, { animation: "scale", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Scale Animation" }), _jsx(DialogDescription, { children: "Scales from 0.95 to 1.0 with fade" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "The default smooth scale-in effect." }) })] })] })),
};
export const SlideUpAnimation = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Slide Up Animation" }) }), _jsxs(DialogContent, { animation: "slide-up", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Slide Up Animation" }), _jsx(DialogDescription, { children: "Slides up from below with fade" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Slides upward into view." }) })] })] })),
};
export const SlideDownAnimation = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Slide Down Animation" }) }), _jsxs(DialogContent, { animation: "slide-down", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Slide Down Animation" }), _jsx(DialogDescription, { children: "Slides down from above with fade" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Slides downward into view." }) })] })] })),
};
export const FadeAnimation = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Fade Animation" }) }), _jsxs(DialogContent, { animation: "fade", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Fade Animation" }), _jsx(DialogDescription, { children: "Simple fade in/out" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Pure fade without movement." }) })] })] })),
};
export const ZoomAnimation = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Zoom Animation" }) }), _jsxs(DialogContent, { animation: "zoom", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Zoom Animation" }), _jsx(DialogDescription, { children: "Zooms from 0.8 to 1.0 with fade" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "More dramatic zoom effect." }) })] })] })),
};
// ============================================================================
// Configurations
// ============================================================================
export const NoBackdropBlur = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "No Backdrop Blur" }) }), _jsxs(DialogContent, { blurBackdrop: false, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Without Backdrop Blur" }), _jsx(DialogDescription, { children: "Backdrop is solid without blur effect" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Useful for performance or specific designs." }) })] })] })),
};
export const NoCloseButton = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "No Close Button" }) }), _jsxs(DialogContent, { showCloseButton: false, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "No Close Button" }), _jsx(DialogDescription, { children: "Must use action buttons to close" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Forces users to make a decision." }) }), _jsx(DialogFooter, { children: _jsx(Button, { children: "Confirm" }) })] })] })),
};
export const NoClickOutsideClose = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "No Click Outside Close" }) }), _jsxs(DialogContent, { closeOnClickOutside: false, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Click Outside Disabled" }), _jsx(DialogDescription, { children: "Cannot close by clicking backdrop" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Use X button, Escape key, or action buttons." }) })] })] })),
};
export const NoEscapeClose = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "No Escape Close" }) }), _jsxs(DialogContent, { closeOnEscape: false, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Escape Key Disabled" }), _jsx(DialogDescription, { children: "Cannot close with Escape key" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "Use X button, click outside, or action buttons." }) })] })] })),
};
// ============================================================================
// Real-World Examples
// ============================================================================
export const ConfirmationDialog = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "destructive", children: "Delete Account" }) }), _jsxs(DialogContent, { size: "sm", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Are you absolutely sure?" }), _jsx(DialogDescription, { children: "This action cannot be undone. This will permanently delete your account and remove your data from our servers." })] }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Cancel" }) }), _jsx(Button, { variant: "destructive", children: "Delete Account" })] })] })] })),
};
export const FormDialog = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Edit Profile" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Edit Profile" }), _jsx(DialogDescription, { children: "Make changes to your profile here. Click save when you're done." })] }), _jsxs(DialogBody, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Name" }), _jsx(Input, { placeholder: "Enter your name", defaultValue: "John Doe" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Email" }), _jsx(Input, { type: "email", placeholder: "Enter your email", defaultValue: "john@example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Bio" }), _jsx("textarea", { className: "w-full min-h-[80px] p-2 text-sm border rounded-md resize-none", placeholder: "Tell us about yourself", defaultValue: "I love using Clarity Chat!" })] })] }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Cancel" }) }), _jsx(Button, { children: "Save Changes" })] })] })] })),
};
export const NestedDialog = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open First Dialog" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "First Dialog" }), _jsx(DialogDescription, { children: "This dialog can open another dialog" })] }), _jsx(DialogBody, { children: _jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open Second Dialog" }) }), _jsxs(DialogContent, { size: "sm", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Second Dialog" }), _jsx(DialogDescription, { children: "Nested dialogs work too!" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "This is a nested dialog." }) })] })] }) })] })] })),
};
export const ControlledDialog = {
    render: () => {
        const [open, setOpen] = React.useState(false);
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => setOpen(true), children: "Open" }), _jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Close Programmatically" })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Dialog is ", open ? 'open' : 'closed'] }), _jsx(Dialog, { open: open, onOpenChange: setOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Controlled Dialog" }), _jsx(DialogDescription, { children: "State is managed externally" })] }), _jsx(DialogBody, { children: _jsx("p", { className: "text-sm", children: "You can control this dialog from outside using state." }) }), _jsx(DialogFooter, { children: _jsx(Button, { onClick: () => setOpen(false), children: "Close" }) })] }) })] }));
    },
};
// ============================================================================
// Accessibility & Keyboard Navigation
// ============================================================================
export const KeyboardNavigation = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Test Keyboard Navigation" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Keyboard Navigation" }), _jsx(DialogDescription, { children: "Try navigating with Tab, Shift+Tab, and Escape" })] }), _jsxs(DialogBody, { className: "space-y-3", children: [_jsx(Button, { children: "Button 1" }), _jsx(Button, { children: "Button 2" }), _jsx(Input, { placeholder: "Input field" }), _jsx(Button, { children: "Button 3" }), _jsxs("p", { className: "text-sm text-muted-foreground mt-4", children: ["\u2022 Tab: Move to next focusable element", _jsx("br", {}), "\u2022 Shift+Tab: Move to previous element", _jsx("br", {}), "\u2022 Escape: Close dialog", _jsx("br", {}), "\u2022 Focus is trapped within dialog"] })] })] })] })),
};
export const FocusManagement = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsx(Input, { placeholder: "Focus returns here after close" }), _jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { children: "Open Dialog" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Focus Management" }), _jsx(DialogDescription, { children: "Focus automatically moves to first element" })] }), _jsxs(DialogBody, { children: [_jsx("p", { className: "text-sm mb-3", children: "When you close this dialog, focus returns to the trigger button." }), _jsx(Button, { children: "First Focusable Element" })] })] })] }), _jsx(Input, { placeholder: "Another input field" })] })),
};
//# sourceMappingURL=Dialog.stories.js.map