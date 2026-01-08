'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Button, cn, Tooltip, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@clarity-chat/primitives';
import { TrashIcon } from '../ui/icons';
import { DURATION_SECONDS as durations } from '../../animations/constants';
// Animation variants for buttons
const buttonVariants = {
    initial: { opacity: 0, scale: 0.8, y: 4 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 4 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
};
/**
 * DeleteButton - Reusable delete button with optional confirmation dialog
 *
 * Features:
 * - Optional confirmation dialog to prevent accidental deletes
 * - Animated trash icon during deletion
 * - Tooltip for accessibility
 */
export const DeleteButton = ({ onDelete, isDeleting, delay = 0.1, showConfirmation = true, messageType = 'user', showToast, }) => {
    const [showDialog, setShowDialog] = React.useState(false);
    const handleClick = () => {
        if (showConfirmation) {
            setShowDialog(true);
        }
        else {
            onDelete();
        }
    };
    const handleConfirm = () => {
        setShowDialog(false);
        // Note: Toast is handled by parent component to ensure it only shows
        // after the delete actually succeeds (not blocked by loading guard)
        onDelete();
    };
    return (_jsxs(_Fragment, { children: [_jsx(Tooltip, { content: "Delete message", side: "top", delay: 300, children: _jsx(motion.div, { variants: buttonVariants, initial: "initial", animate: "animate", exit: "exit", whileHover: isDeleting ? undefined : 'hover', whileTap: isDeleting ? undefined : 'tap', transition: { delay, duration: durations.fast }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: handleClick, disabled: isDeleting, className: cn('h-8 w-8 rounded-lg text-muted-foreground/70', 'hover:text-destructive hover:bg-destructive/10 transition-all', isDeleting && 'opacity-50 cursor-not-allowed'), "aria-label": "Delete message", children: _jsx(motion.div, { animate: isDeleting
                                ? {
                                    rotate: [0, 10, -10, 10, 0],
                                    scale: [1, 0.9, 0.9, 0.9, 0.8],
                                }
                                : {}, transition: { duration: durations.moderate }, children: _jsx(TrashIcon, { size: 15 }) }) }) }) }), _jsx(Dialog, { open: showDialog, onOpenChange: setShowDialog, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Delete message?" }), _jsx(DialogDescription, { children: messageType === 'assistant'
                                        ? 'This will remove the AI response. You can regenerate it if needed.'
                                        : 'This will remove your message and any responses to it. This action cannot be undone.' })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowDialog(false), children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: handleConfirm, children: "Delete" })] })] }) })] }));
};
DeleteButton.displayName = 'DeleteButton';
//# sourceMappingURL=delete-button.js.map