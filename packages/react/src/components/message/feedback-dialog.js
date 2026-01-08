'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Textarea, } from '@clarity-chat/primitives';
/**
 * FeedbackDialog - Dialog for collecting feedback comment on thumbs down
 *
 * Features:
 * - Optional comment collection
 * - Resets state on close (backdrop click, escape key)
 * - Treats close-without-action as skip
 */
export const FeedbackDialog = ({ open, onOpenChange, onSubmit, onSkip, }) => {
    const [comment, setComment] = React.useState('');
    // Reset comment when dialog closes (handles backdrop click, escape key, etc.)
    React.useEffect(() => {
        if (!open) {
            setComment('');
        }
    }, [open]);
    const handleSubmit = () => {
        onSubmit(comment);
        setComment('');
        onOpenChange(false);
    };
    const handleSkip = () => {
        onSkip();
        setComment('');
        onOpenChange(false);
    };
    // Handle dialog close without submitting (backdrop click, escape)
    const handleOpenChange = (newOpen) => {
        if (!newOpen && open) {
            // Dialog is being closed without explicit submit/skip - treat as skip
            onSkip();
        }
        onOpenChange(newOpen);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: handleOpenChange, children: _jsxs(DialogContent, { size: "sm", animation: "scale", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "What went wrong?" }), _jsx(DialogDescription, { children: "Help us improve by sharing what could be better. This is optional." })] }), _jsx("div", { className: "px-6 py-4", children: _jsx(Textarea, { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "The response was inaccurate, unhelpful, or...", className: "min-h-[100px] resize-none", autoFocus: true }) }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "ghost", onClick: handleSkip, children: "Skip" }), _jsx(Button, { variant: "default", onClick: handleSubmit, children: "Submit feedback" })] })] }) }));
};
FeedbackDialog.displayName = 'FeedbackDialog';
//# sourceMappingURL=feedback-dialog.js.map