import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Button, Badge, cn, formatRelativeTime, } from '@clarity-chat/primitives';
import { CopyButton } from './copy-button';
import { ThumbsUpIcon, ThumbsDownIcon, RefreshIcon } from './icons';
import { ANIMATION_DURATION, ANIMATION_EASING, INTERACTION_VARIANTS, } from '../animations/constants';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
export const Message = React.memo(React.forwardRef(function Message({ message, onFeedback, onRetry, showAvatar = true, showTimestamp = true, className, }, ref) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [feedbackGiven, setFeedbackGiven] = React.useState(message.feedback?.type || null);
    const isUser = message.role === 'user';
    const isAssistant = message.role === 'assistant';
    const isStreaming = message.status === 'streaming';
    const [showConfetti, setShowConfetti] = React.useState(false);
    const handleFeedback = (type) => {
        setFeedbackGiven(type);
        onFeedback?.(type);
        // Hooked principle: Variable reward
        if (type === 'up') {
            // Trigger confetti animation
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1000);
        }
    };
    return (_jsxs(motion.div, { ref: ref, initial: {
            opacity: 0,
            x: isUser ? 20 : -20, // Slide from appropriate side
            y: 10,
        }, animate: { opacity: 1, x: 0, y: 0 }, exit: { opacity: 0, scale: 0.95 }, transition: {
            duration: ANIMATION_DURATION.normal / 1000,
            ease: ANIMATION_EASING.out,
        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), className: cn('group flex gap-3 p-4 rounded-xl transition-all duration-200', isUser && 'flex-row-reverse', isHovered && 'bg-muted/50 shadow-sm', className), children: [showAvatar && (_jsx(motion.div, { initial: { scale: 0.8 }, animate: { scale: 1 }, transition: {
                    type: 'spring',
                    stiffness: 500,
                    damping: 25,
                    delay: 0.1,
                }, children: _jsx(Avatar, { src: isUser ? undefined : '/ai-avatar.png', alt: isUser ? 'User' : 'AI Assistant', fallback: isUser ? 'U' : 'AI', className: "flex-shrink-0" }) })), _jsxs("div", { className: cn('flex-1 space-y-2', isUser && 'flex flex-col items-end'), children: [_jsxs("div", { className: cn('flex items-center gap-2', isUser && 'flex-row-reverse'), children: [_jsx("span", { className: "font-semibold text-sm", children: isUser ? 'You' : 'AI Assistant' }), showTimestamp && (_jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: isHovered ? 1 : 0.6 }, transition: { duration: 0.2 }, className: "text-xs text-muted-foreground", children: formatRelativeTime(message.createdAt) })), message.status === 'sending' && (_jsx(Badge, { variant: "secondary", dot: true, children: "Sending" })), message.status === 'error' && (_jsx(Badge, { variant: "destructive", children: "Error" }))] }), _jsxs("div", { className: cn('prose prose-sm dark:prose-invert max-w-none', isUser &&
                            'bg-primary text-primary-foreground px-4 py-3 rounded-xl inline-block shadow-sm'), children: [isUser ? (_jsx("p", { className: "m-0 whitespace-pre-wrap", children: message.content })) : (_jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    rehypeHighlight,
                                ], components: {
                                    code(props) {
                                        const { inline, className, children, ...rest } = props;
                                        return inline ? (_jsx("code", { className: "bg-muted px-1 py-0.5 rounded text-sm", ...rest, children: children })) : (_jsxs("div", { className: "relative group/code", children: [_jsx("pre", { className: cn('relative', className), children: _jsx("code", { ...rest, children: children }) }), _jsx(CopyButton, { text: String(children).replace(/\n$/, ''), className: "absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity" })] }));
                                    },
                                }, children: message.content })), isStreaming && (_jsx(motion.span, { animate: {
                                    opacity: [1, 0.3, 1],
                                    scale: [1, 0.95, 1],
                                }, transition: {
                                    repeat: Infinity,
                                    duration: 1,
                                    ease: 'easeInOut',
                                }, className: "inline-block w-2 h-4 bg-current ml-1 rounded-sm" }))] }), message.attachments && message.attachments.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2", children: message.attachments.map((attachment) => (_jsx(Badge, { variant: "outline", children: attachment.name }, attachment.id))) })), _jsx(AnimatePresence, { children: isAssistant && (isHovered || feedbackGiven) && (_jsxs(motion.div, { initial: { opacity: 0, y: 10, height: 0 }, animate: { opacity: 1, y: 0, height: 'auto' }, exit: { opacity: 0, y: 10, height: 0 }, transition: {
                                duration: ANIMATION_DURATION.fast / 1000,
                                ease: ANIMATION_EASING.out,
                            }, className: "flex items-center gap-2 overflow-hidden", children: [_jsx(CopyButton, { text: message.content, size: "sm" }), _jsxs("div", { className: "relative", children: [_jsx(motion.div, { whileHover: {
                                                scale: 1.1,
                                                rotate: feedbackGiven === 'up' ? 0 : -15,
                                            }, whileTap: { scale: 0.9 }, animate: feedbackGiven === 'up'
                                                ? {
                                                    scale: [1, 1.2, 1],
                                                    rotate: [0, -15, 15, -15, 0],
                                                }
                                                : {}, transition: { duration: 0.5 }, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleFeedback('up'), className: cn('transition-colors', feedbackGiven === 'up' && 'text-success bg-success/10'), "aria-label": "Good response", children: _jsx(ThumbsUpIcon, { size: 16 }) }) }), _jsx(AnimatePresence, { children: showConfetti && (_jsx(_Fragment, { children: [...Array(8)].map((_, i) => (_jsx(motion.div, { initial: {
                                                        opacity: 1,
                                                        scale: 0,
                                                        x: 0,
                                                        y: 0,
                                                    }, animate: {
                                                        opacity: 0,
                                                        scale: 1,
                                                        x: Math.cos((i * Math.PI * 2) / 8) * 30,
                                                        y: Math.sin((i * Math.PI * 2) / 8) * 30,
                                                    }, exit: { opacity: 0 }, transition: { duration: 0.6, ease: 'easeOut' }, className: "absolute top-1/2 left-1/2 w-2 h-2 bg-success rounded-full pointer-events-none", style: {
                                                        backgroundColor: [
                                                            '#10b981',
                                                            '#f59e0b',
                                                            '#3b82f6',
                                                            '#ef4444',
                                                        ][i % 4],
                                                    } }, i))) })) })] }), _jsx(motion.div, { whileHover: {
                                        scale: 1.1,
                                        rotate: feedbackGiven === 'down' ? 0 : 15,
                                    }, whileTap: { scale: 0.9 }, animate: feedbackGiven === 'down'
                                        ? {
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 15, -15, 15, 0],
                                        }
                                        : {}, transition: { duration: 0.5 }, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleFeedback('down'), className: cn('transition-colors', feedbackGiven === 'down' &&
                                            'text-destructive bg-destructive/10'), "aria-label": "Poor response", children: _jsx(ThumbsDownIcon, { size: 16 }) }) }), message.status === 'error' && onRetry && (_jsx(motion.div, { whileHover: INTERACTION_VARIANTS.button.hover, whileTap: INTERACTION_VARIANTS.button.tap, transition: INTERACTION_VARIANTS.button.transition, children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: onRetry, className: "gap-1.5", children: [_jsx(RefreshIcon, { size: 16 }), "Retry"] }) }))] })) }), message.metadata && (_jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [message.metadata.tokens && (_jsxs("span", { children: [message.metadata.tokens, " tokens"] })), message.metadata.processingTime && (_jsxs("span", { children: ["? ", message.metadata.processingTime, "ms"] })), message.metadata.model && (_jsxs("span", { children: ["? ", message.metadata.model] }))] }))] })] }));
}));
Message.displayName = 'Message';
//# sourceMappingURL=message.js.map