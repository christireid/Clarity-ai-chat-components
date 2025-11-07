import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Optimized Message Component
 *
 * Performance-optimized version of the Message component with:
 * - React.memo to prevent unnecessary re-renders
 * - useMemo for expensive markdown parsing
 * - useCallback for event handlers
 * - Lazy loading for syntax highlighting
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Button, Badge, cn, formatRelativeTime } from '@clarity-chat/primitives';
import { CopyButton } from './copy-button';
import { ThumbsUpIcon, ThumbsDownIcon, RefreshIcon } from './icons';
import { ANIMATION_DURATION, ANIMATION_EASING, INTERACTION_VARIANTS } from '../animations/constants';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
/**
 * Memoized markdown components to avoid recreation
 */
const markdownComponents = {
    code(props) {
        const { node, inline, className, children, ...rest } = props;
        return inline ? (_jsx("code", { className: "bg-muted px-1 py-0.5 rounded text-sm", ...rest, children: children })) : (_jsxs("div", { className: "relative group/code", children: [_jsx("pre", { className: cn('relative', className), children: _jsx("code", { ...rest, children: children }) }), _jsx(CopyButton, { text: String(children).replace(/\n$/, ''), className: "absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity" })] }));
    },
};
/**
 * Optimized Message component with React.memo
 */
export const MessageOptimized = React.memo(React.forwardRef(({ message, onFeedback, onRetry, showAvatar = true, showTimestamp = true, className, }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [feedbackGiven, setFeedbackGiven] = React.useState(message.feedback?.type || null);
    const isUser = message.role === 'user';
    const isAssistant = message.role === 'assistant';
    const isStreaming = message.status === 'streaming';
    // Memoize expensive markdown parsing
    const markdownContent = React.useMemo(() => {
        if (isUser)
            return null;
        return (_jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight], components: markdownComponents, children: message.content }));
    }, [message.content, isUser]);
    // Memoize event handlers with useCallback
    const handleFeedback = React.useCallback((type) => {
        setFeedbackGiven(type);
        onFeedback?.(type);
        if (type === 'up') {
            console.log('🎉 Positive feedback received!');
        }
    }, [onFeedback]);
    const handleMouseEnter = React.useCallback(() => {
        setIsHovered(true);
    }, []);
    const handleMouseLeave = React.useCallback(() => {
        setIsHovered(false);
    }, []);
    const handleRetry = React.useCallback(() => {
        onRetry?.();
    }, [onRetry]);
    return (_jsxs(motion.div, { ref: ref, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, scale: 0.95 }, transition: {
            duration: ANIMATION_DURATION.normal / 1000,
            ease: ANIMATION_EASING.out,
        }, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, className: cn('group flex gap-3 p-4 rounded-lg transition-colors', isUser && 'flex-row-reverse', isHovered && 'bg-muted/50', className), children: [showAvatar && (_jsx(Avatar, { src: isUser ? undefined : '/ai-avatar.png', alt: isUser ? 'User' : 'AI Assistant', fallback: isUser ? 'U' : 'AI', className: "flex-shrink-0" })), _jsxs("div", { className: cn('flex-1 space-y-2', isUser && 'flex flex-col items-end'), children: [_jsxs("div", { className: cn('flex items-center gap-2', isUser && 'flex-row-reverse'), children: [_jsx("span", { className: "font-semibold text-sm", children: isUser ? 'You' : 'AI Assistant' }), showTimestamp && (_jsx("span", { className: "text-xs text-muted-foreground", children: formatRelativeTime(message.createdAt) })), message.status === 'sending' && (_jsx(Badge, { variant: "secondary", dot: true, children: "Sending" })), message.status === 'error' && _jsx(Badge, { variant: "destructive", children: "Error" })] }), _jsxs("div", { className: cn('prose prose-sm dark:prose-invert max-w-none', isUser &&
                            'bg-primary text-primary-foreground px-4 py-2 rounded-lg inline-block'), children: [isUser ? (_jsx("p", { className: "m-0 whitespace-pre-wrap", children: message.content })) : (markdownContent), isStreaming && (_jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { repeat: Infinity, duration: 0.8 }, className: "inline-block w-2 h-4 bg-current ml-1" }))] }), message.attachments && message.attachments.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2", children: message.attachments.map((attachment) => (_jsx(Badge, { variant: "outline", children: attachment.name }, attachment.id))) })), _jsx(AnimatePresence, { children: isAssistant && (isHovered || feedbackGiven) && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: {
                                duration: ANIMATION_DURATION.fast / 1000,
                                ease: ANIMATION_EASING.out,
                            }, className: "flex items-center gap-2", children: [_jsx(CopyButton, { text: message.content, size: "sm" }), _jsx(motion.div, { whileHover: INTERACTION_VARIANTS.iconButton.hover, whileTap: INTERACTION_VARIANTS.iconButton.tap, transition: INTERACTION_VARIANTS.iconButton.transition, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleFeedback('up'), className: cn('transition-colors', feedbackGiven === 'up' && 'text-success bg-success/10'), "aria-label": "Good response", children: _jsx(ThumbsUpIcon, { size: 16 }) }) }), _jsx(motion.div, { whileHover: INTERACTION_VARIANTS.iconButton.hover, whileTap: INTERACTION_VARIANTS.iconButton.tap, transition: INTERACTION_VARIANTS.iconButton.transition, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleFeedback('down'), className: cn('transition-colors', feedbackGiven === 'down' && 'text-destructive bg-destructive/10'), "aria-label": "Poor response", children: _jsx(ThumbsDownIcon, { size: 16 }) }) }), message.status === 'error' && onRetry && (_jsx(motion.div, { whileHover: INTERACTION_VARIANTS.button.hover, whileTap: INTERACTION_VARIANTS.button.tap, transition: INTERACTION_VARIANTS.button.transition, children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: handleRetry, className: "gap-1.5", children: [_jsx(RefreshIcon, { size: 16 }), "Retry"] }) }))] })) }), message.metadata && (_jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [message.metadata.tokens && _jsxs("span", { children: [message.metadata.tokens, " tokens"] }), message.metadata.processingTime && (_jsxs("span", { children: ["\u2022 ", message.metadata.processingTime, "ms"] })), message.metadata.model && _jsxs("span", { children: ["\u2022 ", message.metadata.model] })] }))] })] }));
}), 
// Custom comparison function for React.memo
(prevProps, nextProps) => {
    // Only re-render if these props change
    return (prevProps.message.id === nextProps.message.id &&
        prevProps.message.content === nextProps.message.content &&
        prevProps.message.status === nextProps.message.status &&
        prevProps.message.feedback?.type === nextProps.message.feedback?.type &&
        prevProps.showAvatar === nextProps.showAvatar &&
        prevProps.showTimestamp === nextProps.showTimestamp);
});
MessageOptimized.displayName = 'MessageOptimized';
//# sourceMappingURL=message-optimized.js.map