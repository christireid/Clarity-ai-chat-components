import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Secure Message Actions Component
 *
 * Enhanced message actions with security indicators and features:
 * - Security validation status badge
 * - PII detection indicator
 * - Report/flag unsafe content
 * - Security details tooltip
 * - All original actions (copy, feedback, edit, etc.)
 *
 * @example
 * ```tsx
 * <MessageActionsSecure
 *   messageContent={content}
 *   messageId={id}
 *   role="assistant"
 *   securityInfo={{
 *     validated: true,
 *     piiDetected: false,
 *     threats: [],
 *     sanitized: false
 *   }}
 *   onReport={(reason) => console.log('Reported:', reason)}
 * />
 * ```
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, cn } from '@clarity-chat/primitives';
import { CopyButton } from '../copy-button';
import { ThumbsUpIcon, ThumbsDownIcon, RefreshIcon, EditIcon, TrashIcon, ShieldIcon, AlertTriangleIcon, FlagIcon, InfoIcon, } from '../icons';
import { ANIMATION_DURATION, ANIMATION_EASING, } from '../../animations/constants';
import { ConfettiAnimation } from './confetti-animation';
import { useToast } from '../toast';
/**
 * Secure Message Actions Component
 *
 * Enhanced with security features and indicators
 */
export const MessageActionsSecure = React.memo(({ messageContent, messageId, role, feedbackGiven, showConfetti, hasError, onFeedback, onRetry, onEdit, onRegenerate, onDelete, show, securityInfo, onReport, showSecurityIndicators = true, }) => {
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [showSecurityDetails, setShowSecurityDetails] = React.useState(false);
    const [showReportMenu, setShowReportMenu] = React.useState(false);
    const toast = useToast();
    if (!show)
        return null;
    const isUserMessage = role === 'user';
    const isAssistantMessage = role === 'assistant';
    const handleDelete = React.useCallback(() => {
        setIsDeleting(true);
        toast?.info('Message deleted');
        setTimeout(() => {
            onDelete?.(messageId);
        }, 300);
    }, [messageId, onDelete, toast]);
    const handleReport = React.useCallback((reason) => {
        onReport?.(reason);
        toast?.success(`Message reported: ${reason}`);
        setShowReportMenu(false);
    }, [onReport, toast]);
    const hasSecurityWarnings = securityInfo && (!securityInfo.validated ||
        (securityInfo.threats && securityInfo.threats.length > 0));
    const hasPiiDetected = securityInfo?.piiDetected;
    return (_jsx(AnimatePresence, { children: _jsxs(motion.div, { initial: { opacity: 0, y: 10, height: 0 }, animate: { opacity: 1, y: 0, height: 'auto' }, exit: { opacity: 0, y: 10, height: 0 }, transition: {
                duration: ANIMATION_DURATION.fast / 1000,
                ease: ANIMATION_EASING.out,
            }, className: "flex items-center gap-1 overflow-hidden", children: [showSecurityIndicators && securityInfo && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0, duration: 0.2 }, className: "relative", onMouseEnter: () => setShowSecurityDetails(true), onMouseLeave: () => setShowSecurityDetails(false), children: [_jsx(Button, { variant: "ghost", size: "icon", className: cn('h-7 w-7 rounded-md', hasSecurityWarnings && 'text-orange-500 hover:text-orange-600', !hasSecurityWarnings && 'text-green-500 hover:text-green-600'), "aria-label": "Security status", children: hasSecurityWarnings ? (_jsx(AlertTriangleIcon, { size: 14 })) : (_jsx(ShieldIcon, { size: 14 })) }), showSecurityDetails && (_jsx(motion.div, { initial: { opacity: 0, y: 5, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 5, scale: 0.95 }, className: "absolute bottom-full left-0 mb-2 z-50", children: _jsxs("div", { className: "bg-popover text-popover-foreground border rounded-lg shadow-lg p-3 text-xs w-64", children: [_jsx("div", { className: "font-semibold mb-2 flex items-center gap-2", children: hasSecurityWarnings ? (_jsxs(_Fragment, { children: [_jsx(AlertTriangleIcon, { size: 12, className: "text-orange-500" }), "Security Warnings"] })) : (_jsxs(_Fragment, { children: [_jsx(ShieldIcon, { size: 12, className: "text-green-500" }), "Secure Message"] })) }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Validated:" }), _jsx("span", { className: securityInfo.validated ? 'text-green-600' : 'text-red-600', children: securityInfo.validated ? 'Yes' : 'No' })] }), hasPiiDetected && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "PII Detected:" }), _jsxs("span", { className: "text-orange-600", children: [securityInfo.piiCount || 1, " item(s)"] })] })), securityInfo.threats && securityInfo.threats.length > 0 && (_jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground", children: "Threats:" }), _jsx("ul", { className: "list-disc list-inside mt-1", children: securityInfo.threats.slice(0, 3).map((threat, i) => (_jsx("li", { className: "text-orange-600 text-xs", children: threat }, i))) })] })), securityInfo.sanitized && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Sanitized:" }), _jsx("span", { className: "text-blue-600", children: "Yes" })] })), securityInfo.confidence !== undefined && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Confidence:" }), _jsxs("span", { children: [(securityInfo.confidence * 100).toFixed(0), "%"] })] })), securityInfo.method && (_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-muted-foreground", children: "Method:" }), _jsx("span", { className: "capitalize", children: securityInfo.method })] }))] })] }) }))] })), showSecurityIndicators && hasPiiDetected && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.05, duration: 0.2 }, title: `${securityInfo.piiCount || 1} PII item(s) redacted`, children: _jsxs("div", { className: "h-7 px-2 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400", children: [_jsx(InfoIcon, { size: 12 }), _jsx("span", { className: "text-xs font-medium", children: "PII" })] }) })), _jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.1, duration: 0.2 }, children: _jsx(CopyButton, { text: messageContent, size: "icon", iconOnly: true, className: "h-7 w-7 rounded-md" }) }), _jsxs(motion.div, { className: "relative", initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.15, duration: 0.2 }, children: [_jsx(motion.div, { whileHover: {
                                scale: 1.15,
                                rotate: feedbackGiven === 'up' ? 0 : -12,
                            }, whileTap: { scale: 0.85 }, animate: feedbackGiven === 'up'
                                ? {
                                    scale: [1, 1.2, 1],
                                    rotate: [0, -15, 15, -15, 0],
                                }
                                : {}, transition: { duration: 0.5 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onFeedback('up'), className: cn('h-7 w-7 rounded-md transition-all', feedbackGiven === 'up' && 'text-success bg-success/10'), "aria-label": "Good response", children: _jsx(ThumbsUpIcon, { size: 14 }) }) }), _jsx(ConfettiAnimation, { show: showConfetti })] }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.2, duration: 0.2 }, whileHover: {
                        scale: 1.15,
                        rotate: feedbackGiven === 'down' ? 0 : 12,
                    }, whileTap: { scale: 0.85 }, children: _jsx(motion.div, { animate: feedbackGiven === 'down'
                            ? {
                                scale: [1, 1.1, 1],
                                rotate: [0, 15, -15, 15, 0],
                            }
                            : {}, transition: { duration: 0.5 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onFeedback('down'), className: cn('h-7 w-7 rounded-md transition-all', feedbackGiven === 'down' &&
                                'text-destructive bg-destructive/10'), "aria-label": "Poor response", children: _jsx(ThumbsDownIcon, { size: 14 }) }) }) }), onReport && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.25, duration: 0.2 }, className: "relative", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => setShowReportMenu(!showReportMenu), className: "h-7 w-7 rounded-md text-muted-foreground hover:text-orange-600", "aria-label": "Report message", children: _jsx(FlagIcon, { size: 14 }) }), showReportMenu && (_jsx(motion.div, { initial: { opacity: 0, y: 5, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 5, scale: 0.95 }, className: "absolute bottom-full left-0 mb-2 z-50", children: _jsxs("div", { className: "bg-popover text-popover-foreground border rounded-lg shadow-lg p-2 text-xs w-48", children: [_jsx("div", { className: "font-semibold mb-2 px-2", children: "Report Message" }), _jsx("button", { onClick: () => handleReport('harmful'), className: "w-full text-left px-2 py-1.5 hover:bg-accent rounded", children: "Harmful content" }), _jsx("button", { onClick: () => handleReport('inappropriate'), className: "w-full text-left px-2 py-1.5 hover:bg-accent rounded", children: "Inappropriate" }), _jsx("button", { onClick: () => handleReport('spam'), className: "w-full text-left px-2 py-1.5 hover:bg-accent rounded", children: "Spam" }), _jsx("button", { onClick: () => handleReport('incorrect'), className: "w-full text-left px-2 py-1.5 hover:bg-accent rounded", children: "Incorrect information" }), _jsx("button", { onClick: () => handleReport('other'), className: "w-full text-left px-2 py-1.5 hover:bg-accent rounded", children: "Other" })] }) }))] })), hasError && onRetry && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.3, duration: 0.2 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: onRetry, className: "h-7 w-7 rounded-md", "aria-label": "Retry", children: _jsx(RefreshIcon, { size: 14 }) }) })), isUserMessage && onEdit && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.35, duration: 0.2 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onEdit(messageId), className: "h-7 w-7 rounded-md", "aria-label": "Edit message", children: _jsx(EditIcon, { size: 14 }) }) })), isAssistantMessage && onRegenerate && !hasError && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.4, duration: 0.2 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onRegenerate(messageId), className: "h-7 w-7 rounded-md", "aria-label": "Regenerate response", children: _jsx(RefreshIcon, { size: 14 }) }) })), onDelete && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.5 }, transition: { delay: 0.45, duration: 0.2 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: handleDelete, disabled: isDeleting, className: cn('h-7 w-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors', isDeleting && 'opacity-50 cursor-not-allowed'), "aria-label": "Delete message", children: _jsx(motion.div, { animate: isDeleting ? {
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 0.9, 0.9, 0.9, 0.8],
                            } : {}, transition: { duration: 0.3 }, children: _jsx(TrashIcon, { size: 14 }) }) }) }))] }) }));
});
MessageActionsSecure.displayName = 'MessageActionsSecure';
//# sourceMappingURL=message-actions-secure.js.map