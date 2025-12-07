'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, cn } from '@clarity-chat/primitives';
import { useClipboard } from '../hooks/use-clipboard';
import { CopyIcon, CheckIcon } from './icons';
import { useToast } from './toast';
export function CopyButton({ text, onCopy, iconOnly = false, copyText = 'Copy', copiedText = 'Copied!', showToast = false, toastMessage = 'Copied to clipboard!', children, ...props }) {
    const toast = useToast();
    const { copy, copied } = useClipboard({
        timeout: 2000,
        onSuccess: () => {
            onCopy?.();
            if (showToast && toast) {
                toast.success(toastMessage);
            }
        },
    });
    // Memoize copy handler to prevent recreation on every render
    const handleCopy = React.useCallback(async () => {
        await copy(text);
    }, [copy, text]);
    return (_jsx(Button, { variant: "ghost", size: "sm", 
        // Don't use state prop - causes double checkmark (Button shows its own + our CheckIcon)
        onClick: handleCopy, "aria-label": copied ? copiedText : copyText, className: cn('transition-all duration-200', copied && 'text-success bg-success/10', props.className), ...props, children: _jsx(AnimatePresence, { mode: "wait", initial: false, children: copied ? (_jsxs(motion.div, { initial: { scale: 0.5, opacity: 0, rotate: -45 }, animate: { scale: 1, opacity: 1, rotate: 0 }, exit: { scale: 0.5, opacity: 0 }, transition: { duration: 0.15, ease: 'easeOut' }, className: "flex items-center gap-1.5", children: [_jsx(CheckIcon, { size: 14 }), !iconOnly && (_jsx(motion.span, { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.05 }, children: children || copiedText }))] }, "check")) : (_jsxs(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.8, opacity: 0 }, transition: { duration: 0.15 }, className: "flex items-center gap-1.5", children: [_jsx(CopyIcon, { size: 14 }), !iconOnly && (children || copyText)] }, "copy")) }) }));
}
CopyButton.displayName = 'CopyButton';
//# sourceMappingURL=copy-button.js.map