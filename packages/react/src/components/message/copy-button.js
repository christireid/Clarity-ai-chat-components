'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, cn, Tooltip } from '@clarity-chat/primitives';
import { useClipboard } from '../../hooks/ui/use-clipboard';
import { CopyIcon, CheckIcon } from '../ui/icons';
import { useToast } from '../ui/toast';
import { useReducedMotion } from '@clarity-chat/primitives';
import { getSpring } from '../../animations/spring-presets';
import { DURATION_SECONDS as durations } from '../../animations/constants';
/**
 * CopyButton - Button with copy-to-clipboard functionality
 *
 * A polished copy button with celebratory feedback animations. Uses spring
 * physics for natural motion and respects user's reduced motion preferences.
 *
 * @param props - CopyButton configuration
 * @param props.text - The text to copy to clipboard (required)
 * @param props.onCopy - Callback fired after successful copy
 * @param props.onCopyError - Callback fired when copy fails
 * @param props.iconOnly - Show only the icon, no text label (default: false)
 * @param props.copyText - Label shown in idle state (default: "Copy")
 * @param props.copiedText - Label shown after copying (default: "Copied!")
 * @param props.showToast - Show toast notification on copy (default: false)
 * @param props.toastMessage - Custom toast message (default: "Copied to clipboard!")
 * @param props.errorToastMessage - Custom error toast message (default: "Failed to copy")
 *
 * @example Basic usage
 * ```tsx
 * <CopyButton text={codeSnippet} />
 * ```
 *
 * @example Icon-only in a toolbar
 * ```tsx
 * <CopyButton text={content} iconOnly className="h-8 w-8" />
 * ```
 *
 * @example With toast notification
 * ```tsx
 * <CopyButton
 *   text={shareableLink}
 *   showToast
 *   toastMessage="Link copied!"
 *   onCopy={() => analytics.track('link_copied')}
 * />
 * ```
 *
 * @enhanced Framer Motion 12: Spring physics for celebration animation
 * - Bouncy spring for check icon (celebratory feel)
 * - Smooth spring for copy icon (professional entrance)
 * - Respects prefers-reduced-motion
 */
export function CopyButton({ text, onCopy, onCopyError, iconOnly = false, copyText = 'Copy', copiedText = 'Copied!', showToast = false, toastMessage = 'Copied to clipboard!', errorToastMessage = 'Failed to copy', showTooltip = false, tooltipText = 'Copy to clipboard', children, ...props }) {
    const toast = useToast();
    const prefersReducedMotion = useReducedMotion();
    const { copy, copied } = useClipboard({
        timeout: 2000,
        onSuccess: () => {
            onCopy?.();
            if (showToast && toast) {
                toast.success(toastMessage);
            }
        },
        onError: (error) => {
            onCopyError?.(error);
            if (showToast && toast) {
                toast.error(errorToastMessage);
            }
        },
    });
    // Memoize copy handler to prevent recreation on every render
    const handleCopy = React.useCallback(async () => {
        await copy(text);
    }, [copy, text]);
    // Track copy status for screen reader announcement
    const [statusMessage, setStatusMessage] = React.useState(null);
    // Clear status after announcement
    React.useEffect(() => {
        if (statusMessage) {
            const timer = setTimeout(() => setStatusMessage(null), 2000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [statusMessage]);
    // Enhanced copy handler with status announcement
    const handleCopyWithAnnouncement = React.useCallback(async () => {
        try {
            await handleCopy();
            setStatusMessage(toastMessage);
        }
        catch {
            setStatusMessage(errorToastMessage);
        }
    }, [handleCopy, toastMessage, errorToastMessage]);
    const button = (_jsxs(Button, { variant: "ghost", size: "sm", 
        // Don't use state prop - causes double checkmark (Button shows its own + our CheckIcon)
        onClick: handleCopyWithAnnouncement, "aria-label": copied ? copiedText : copyText, className: cn('transition-all duration-200', copied && 'text-success bg-success/10', props.className), ...props, children: [_jsx(AnimatePresence, { mode: "wait", initial: false, children: copied ? (_jsxs(motion.div, { initial: { scale: 0.5, opacity: 0, rotate: -45 }, animate: { scale: 1, opacity: 1, rotate: 0 }, exit: { scale: 0.5, opacity: 0 }, transition: getSpring('bouncy', prefersReducedMotion), className: "flex items-center gap-1.5", children: [_jsx(motion.div, { animate: { scale: [1, 1.2, 1] }, transition: {
                                duration: durations.moderate,
                                ease: 'easeOut',
                            }, children: _jsx(CheckIcon, { size: 14 }) }), !iconOnly && (_jsx(motion.span, { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 }, transition: getSpring('quick', prefersReducedMotion, {
                                delay: 0.05,
                            }), children: children || copiedText }))] }, "check")) : (_jsxs(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.8, opacity: 0 }, transition: getSpring('smooth', prefersReducedMotion), className: "flex items-center gap-1.5", children: [_jsx(CopyIcon, { size: 14 }), !iconOnly && (children || copyText)] }, "copy")) }), _jsx("span", { role: "status", "aria-live": "polite", "aria-atomic": "true", className: "sr-only", children: statusMessage })] }));
    if (showTooltip) {
        return (_jsx(Tooltip, { content: copied ? 'Copied!' : tooltipText, side: "top", delay: 300, children: button }));
    }
    return button;
}
CopyButton.displayName = 'CopyButton';
//# sourceMappingURL=copy-button.js.map