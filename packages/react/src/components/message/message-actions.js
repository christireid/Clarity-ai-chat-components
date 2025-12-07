import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, cn } from '@clarity-chat/primitives';
import { CopyButton } from '../copy-button';
import { ThumbsUpIcon, ThumbsDownIcon, RefreshIcon, EditIcon, TrashIcon } from '../icons';
import { ANIMATION_DURATION, ANIMATION_EASING, } from '../../animations/constants';
import { ConfettiAnimation } from './confetti-animation';
import { useToast } from '../toast';
/**
 * Message actions component (copy, feedback, retry)
 * Extracted from Message component for better organization
 *
 * Enhanced with:
 * - Staggered entrance animations
 * - Icon-only buttons (cleaner, more minimal)
 * - Delete feedback with animation
 * - Improved hover/tap interactions
 */
export const MessageActions = React.memo(({ messageContent, messageId, role, feedbackGiven, showConfetti, hasError, onFeedback, onRetry, onEdit, onRegenerate, onDelete, show, }) => {
    const [isDeleting, setIsDeleting] = React.useState(false);
    const toast = useToast();
    const isUserMessage = role === 'user';
    const isAssistantMessage = role === 'assistant';
    const handleDelete = React.useCallback(() => {
        setIsDeleting(true);
        // Show feedback toast
        toast?.info('Message deleted');
        // Delay actual delete to allow animation
        setTimeout(() => {
            onDelete?.(messageId);
        }, 300);
    }, [messageId, onDelete, toast]);
    if (!show)
        return null;
    return (_jsx(AnimatePresence, { children: _jsxs(motion.div, { initial: { opacity: 0, y: 10, height: 0 }, animate: { opacity: 1, y: 0, height: 'auto' }, exit: { opacity: 0, y: 10, height: 0 }, transition: {
                duration: ANIMATION_DURATION.fast / 1000,
                ease: ANIMATION_EASING.out,
            }, className: "flex items-center gap-1.5 overflow-hidden mt-3", children: [_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.05, duration: 0.2 }, children: _jsx(CopyButton, { text: messageContent, size: "icon", iconOnly: true, className: "h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-accent/50 transition-colors" }) }), _jsxs(motion.div, { className: "relative", initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.1, duration: 0.2 }, children: [_jsx(motion.div, { whileHover: {
                                scale: 1.15,
                                rotate: feedbackGiven === 'up' ? 0 : -12,
                            }, whileTap: { scale: 0.85 }, animate: feedbackGiven === 'up'
                                ? {
                                    scale: [1, 1.2, 1],
                                    rotate: [0, -15, 15, -15, 0],
                                }
                                : {}, transition: { duration: 0.5 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onFeedback('up'), className: cn('h-7 w-7 rounded-lg transition-all text-gray-400 hover:text-gray-600', 'hover:bg-accent/50', feedbackGiven === 'up' && 'text-success bg-success/10 hover:bg-success/15'), "aria-label": "Good response", children: _jsx(ThumbsUpIcon, { size: 14 }) }) }), _jsx(ConfettiAnimation, { show: showConfetti })] }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.15, duration: 0.2 }, whileHover: {
                        scale: 1.15,
                        rotate: feedbackGiven === 'down' ? 0 : 12,
                    }, whileTap: { scale: 0.85 }, children: _jsx(motion.div, { animate: feedbackGiven === 'down'
                            ? {
                                scale: [1, 1.1, 1],
                                rotate: [0, 15, -15, 15, 0],
                            }
                            : {}, transition: { duration: 0.5 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onFeedback('down'), className: cn('h-7 w-7 rounded-lg transition-all text-gray-400 hover:text-gray-600', 'hover:bg-accent/50', feedbackGiven === 'down' &&
                                'text-destructive bg-destructive/10 hover:bg-destructive/15'), "aria-label": "Poor response", children: _jsx(ThumbsDownIcon, { size: 14 }) }) }) }), hasError && onRetry && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.2, duration: 0.2 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: onRetry, className: "h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-accent/50 transition-colors", "aria-label": "Retry", children: _jsx(RefreshIcon, { size: 14 }) }) })), isUserMessage && onEdit && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.2, duration: 0.2 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onEdit(messageId), className: "h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-accent/50 transition-colors", "aria-label": "Edit message", children: _jsx(EditIcon, { size: 14 }) }) })), isAssistantMessage && onRegenerate && !hasError && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.25, duration: 0.2 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onRegenerate(messageId), className: "h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-accent/50 transition-colors", "aria-label": "Regenerate response", children: _jsx(RefreshIcon, { size: 14 }) }) })), onDelete && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.5 }, transition: { delay: 0.3, duration: 0.2 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: handleDelete, disabled: isDeleting, className: cn('h-7 w-7 rounded-lg text-gray-400 hover:text-destructive hover:bg-destructive/10 transition-colors', isDeleting && 'opacity-50 cursor-not-allowed'), "aria-label": "Delete message", children: _jsx(motion.div, { animate: isDeleting ? {
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 0.9, 0.9, 0.9, 0.8],
                            } : {}, transition: { duration: 0.3 }, children: _jsx(TrashIcon, { size: 14 }) }) }) }))] }) }));
});
MessageActions.displayName = 'MessageActions';
//# sourceMappingURL=message-actions.js.map