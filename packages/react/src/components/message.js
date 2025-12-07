'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Avatar, Badge, cn, formatRelativeTime, } from '@clarity-chat/primitives';
import { ANIMATION_DURATION, ANIMATION_EASING, } from '../animations/constants';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { MarkdownCodeBlock, MessageActions, MessageMetadata, } from './message/index';
import { ErrorMessage } from './error-message';
import { CopyButton } from './copy-button';
/**
 * Message - Individual message component for chat interfaces
 *
 * A low-level building block for rendering individual chat messages. Provides
 * message display, markdown rendering, actions (copy, feedback, retry, edit, delete),
 * and animations.
 *
 * **Features:**
 * - Markdown rendering with syntax highlighting
 * - Message actions (copy, feedback, retry, edit, regenerate, delete)
 * - Avatar display
 * - Timestamp display
 * - Streaming indicator
 * - Feedback animations (confetti on positive feedback)
 * - Hover states
 *
 * **When to use:**
 * - Building custom message lists
 * - Need fine-grained control over message rendering
 * - Want to customize message appearance
 *
 * **When NOT to use:**
 * - For simplest setup, use `ClarityChat` component (includes messages)
 * - For standard message lists, use `MessageList` component
 *
 * @param props - Message configuration
 * @param props.message - Message data to display
 * @param props.onCopy - Optional callback when message is copied
 * @param props.onFeedback - Optional callback for feedback (up/down)
 * @param props.onRetry - Optional callback to retry a message
 * @param props.onEdit - Optional callback to edit a message
 * @param props.onRegenerate - Optional callback to regenerate a message
 * @param props.onDelete - Optional callback to delete a message
 * @param props.showAvatar - Show avatar (default: true)
 * @param props.showTimestamp - Show timestamp (default: true)
 * @param props.className - Optional CSS class name
 * @param props.ref - Optional ref for the message container
 *
 * @example Basic usage
 * ```tsx
 * <Message
 *   message={message}
 *   onCopy={(content) => navigator.clipboard.writeText(content)}
 *   onFeedback={(type) => trackFeedback(message.id, type)}
 * />
 * ```
 *
 * @example With all actions
 * ```tsx
 * <Message
 *   message={message}
 *   onCopy={handleCopy}
 *   onFeedback={handleFeedback}
 *   onRetry={handleRetry}
 *   onEdit={handleEdit}
 *   onRegenerate={handleRegenerate}
 *   onDelete={handleDelete}
 * />
 * ```
 *
 * @example Without avatar or timestamp
 * ```tsx
 * <Message
 *   message={message}
 *   showAvatar={false}
 *   showTimestamp={false}
 * />
 * ```
 */
export function Message({ message, onFeedback, onRetry, onEdit, onRegenerate, onDelete, showAvatar = true, showTimestamp = true, className, isGroupStart = true, isGroupEnd = true, isGrouped = false, errorDetails, ref, }) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [feedbackGiven, setFeedbackGiven] = React.useState(message.feedback?.type || null);
    const isUser = message.role === 'user';
    const isAssistant = message.role === 'assistant';
    const isStreaming = message.status === 'streaming';
    const [showConfetti, setShowConfetti] = React.useState(false);
    // React 19: Compiler optimizes this - no useCallback needed
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
    // React 19: Compiler optimizes static objects - no useMemo needed
    const markdownComponents = {
        code: MarkdownCodeBlock,
        // Custom pre handler - wrap code blocks with styling and copy button
        pre: ({ children, node, ...props }) => {
            // Extract code string from the code element for copy button
            let codeString = '';
            React.Children.forEach(children, (child) => {
                if (React.isValidElement(child) && child.props) {
                    // Get from data attribute or extract text content
                    codeString = child.props['data-code-string'] || '';
                    if (!codeString && child.props.children) {
                        // Fallback: extract text from children
                        const extractText = (node) => {
                            if (typeof node === 'string')
                                return node;
                            if (Array.isArray(node))
                                return node.map(extractText).join('');
                            if (React.isValidElement(node) && node.props?.children) {
                                return extractText(node.props.children);
                            }
                            return '';
                        };
                        codeString = extractText(child.props.children);
                    }
                }
            });
            return (_jsxs("div", { className: "relative group/code my-4", children: [_jsx("pre", { className: "relative overflow-x-auto bg-muted/50 border border-border rounded-lg p-4", ...props, children: children }), codeString && (_jsx(CopyButton, { text: codeString, className: "absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity" }))] }));
        },
        // Always use div for paragraphs to prevent hydration mismatches
        // The <p> element cannot contain block elements, and detecting them
        // reliably across server/client is problematic. Using div is safe.
        p: ({ children, ...props }) => (_jsx("div", { className: "mb-4 leading-relaxed", ...props, children: children })),
        // Table styling
        table: ({ children, ...props }) => (_jsx("div", { className: "overflow-x-auto my-4 w-full", children: _jsx("table", { className: "min-w-full table-auto border-collapse divide-y divide-border", ...props, children: children }) })),
        thead: ({ children, ...props }) => (_jsx("thead", { className: "bg-muted", ...props, children: children })),
        tbody: ({ children, ...props }) => (_jsx("tbody", { className: "bg-background divide-y divide-border", ...props, children: children })),
        th: ({ children, ...props }) => (_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border border-border", ...props, children: children })),
        td: ({ children, ...props }) => (_jsx("td", { className: "px-6 py-4 text-sm border border-border", ...props, children: children })),
        tr: ({ children, ...props }) => (_jsx("tr", { className: "hover:bg-muted/50 transition-colors", ...props, children: children })),
    };
    // Static plugin arrays - compiler optimizes
    const remarkPlugins = [remarkGfm];
    const rehypePlugins = [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypeHighlight,
    ];
    return (_jsxs(motion.div, { ref: ref, initial: {
            opacity: 0,
            x: isUser ? 20 : -20, // Slide from appropriate side
            y: 10,
        }, animate: { opacity: 1, x: 0, y: 0 }, exit: { opacity: 0, scale: 0.95 }, transition: {
            duration: ANIMATION_DURATION.normal / 1000,
            ease: ANIMATION_EASING.out,
        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), className: cn('group flex gap-3 rounded-xl transition-all duration-200 ease-out', 
        // Reduced padding for grouped messages
        isGrouped && !isGroupStart && !isGroupEnd ? 'px-4 py-1.5' : 'p-4', isUser && 'flex-row-reverse', isHovered && 'bg-muted/40', className), children: [showAvatar && isGroupStart ? (_jsx(motion.div, { initial: { scale: 0.8 }, animate: { scale: 1 }, transition: {
                    type: 'spring',
                    stiffness: 500,
                    damping: 25,
                    delay: 0.1,
                }, children: _jsx(Avatar, { alt: isUser ? 'User' : 'AI Assistant', fallback: isUser ? 'U' : 'AI', className: "flex-shrink-0" }) })) : showAvatar && isGrouped ? (
            // Spacer to maintain alignment in grouped messages
            _jsx("div", { className: "w-10 flex-shrink-0", "aria-hidden": "true" })) : null, _jsxs("div", { className: cn('flex-1 space-y-2.5', isUser && 'flex flex-col items-end'), children: [isGroupStart && (_jsxs("div", { className: cn('flex items-center', isUser ? 'gap-2 flex-row-reverse' : 'gap-2'), children: [_jsx("span", { className: "font-semibold text-sm whitespace-nowrap", children: isUser ? 'You' : 'AI Assistant' }), showTimestamp && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-muted-foreground/50", children: "\u00B7" }), _jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: isHovered ? 1 : 0.7 }, transition: { duration: 0.2 }, className: "text-xs text-muted-foreground/90 whitespace-nowrap", children: formatRelativeTime(message.createdAt) })] })), message.status === 'sending' && (_jsx(Badge, { variant: "secondary", dot: true, children: "Sending" })), message.status === 'error' && (_jsx(Badge, { variant: "destructive", children: "Error" }))] })), _jsxs("div", { className: cn(!isUser && 'prose prose-sm dark:prose-invert max-w-none', isUser &&
                            'bg-primary text-primary-foreground px-4 py-3 rounded-xl inline-block shadow-sm ring-1 ring-primary/30'), children: [isUser ? (_jsx("p", { className: "m-0 whitespace-pre-wrap text-primary-foreground", children: message.content })) : (_jsx(ReactMarkdown, { remarkPlugins: remarkPlugins, rehypePlugins: rehypePlugins, components: markdownComponents, children: message.content })), isStreaming && (_jsx(motion.span, { animate: {
                                    opacity: [1, 0.3, 1],
                                    scale: [1, 0.95, 1],
                                }, transition: {
                                    repeat: Infinity,
                                    duration: 1,
                                    ease: 'easeInOut',
                                }, className: "inline-block w-2 h-4 bg-current ml-1 rounded-sm" }))] }), message.status === 'error' && errorDetails && (_jsx(ErrorMessage, { error: errorDetails, onRetry: onRetry, compact: isGrouped, maxRetryAttempts: 3 })), message.attachments && message.attachments.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2", children: message.attachments.map((attachment) => (_jsx(Badge, { variant: "outline", children: attachment.name }, attachment.id))) })), (isUser || isAssistant) && (_jsx(MessageActions, { messageContent: message.content, messageId: message.id, role: message.role, feedbackGiven: feedbackGiven, showConfetti: showConfetti, hasError: message.status === 'error', onFeedback: handleFeedback, onRetry: onRetry, onEdit: onEdit, onRegenerate: onRegenerate, onDelete: onDelete, show: isHovered || !!feedbackGiven })), _jsx(MessageMetadata, { metadata: message.metadata })] })] }));
}
Message.displayName = 'Message';
//# sourceMappingURL=message.js.map