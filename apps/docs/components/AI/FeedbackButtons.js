'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
export function FeedbackButtons({ messageId, onFeedback, className }) {
    const [feedback, setFeedback] = useState(null);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleFeedback = async (type) => {
        if (feedback === type) {
            // Un-select if clicking the same button
            setFeedback(null);
            setShowComment(false);
            setComment('');
            return;
        }
        setFeedback(type);
        // For negative feedback, show comment box
        if (type === 'negative') {
            setShowComment(true);
        }
        else {
            // For positive feedback, submit immediately
            if (onFeedback) {
                setIsSubmitting(true);
                await onFeedback(messageId, type);
                setIsSubmitting(false);
            }
        }
    };
    const handleSubmitComment = async () => {
        if (onFeedback && feedback) {
            setIsSubmitting(true);
            await onFeedback(messageId, feedback, comment);
            setIsSubmitting(false);
            setShowComment(false);
        }
    };
    return (_jsxs("div", { className: cn('flex flex-col gap-2', className), children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-xs text-muted-foreground mr-2", children: "Was this helpful?" }), _jsx("button", { onClick: () => handleFeedback('positive'), disabled: isSubmitting, className: cn('p-1.5 rounded-md transition-all duration-200', 'hover:bg-accent hover:text-accent-foreground', 'disabled:opacity-50 disabled:cursor-not-allowed', feedback === 'positive'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            : 'text-muted-foreground'), "aria-label": "Helpful", children: _jsx(ThumbsUp, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleFeedback('negative'), disabled: isSubmitting, className: cn('p-1.5 rounded-md transition-all duration-200', 'hover:bg-accent hover:text-accent-foreground', 'disabled:opacity-50 disabled:cursor-not-allowed', feedback === 'negative'
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'text-muted-foreground'), "aria-label": "Not helpful", children: _jsx(ThumbsDown, { className: "w-4 h-4" }) }), _jsx(AnimatePresence, { children: feedback && !showComment && (_jsx(motion.span, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -10 }, className: "text-xs text-muted-foreground ml-2", children: "Thanks for your feedback!" })) })] }), _jsx(AnimatePresence, { children: showComment && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "space-y-2", children: [_jsx("textarea", { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "What could be improved? (optional)", className: cn('w-full px-3 py-2 text-sm rounded-md', 'border border-input bg-background', 'placeholder:text-muted-foreground', 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', 'resize-none'), rows: 3 }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleSubmitComment, disabled: isSubmitting, className: cn('px-3 py-1.5 text-xs font-medium rounded-md', 'bg-primary text-primary-foreground', 'hover:bg-primary/90', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors'), children: isSubmitting ? 'Submitting...' : 'Submit' }), _jsx("button", { onClick: () => {
                                        setShowComment(false);
                                        setComment('');
                                        setFeedback(null);
                                    }, disabled: isSubmitting, className: cn('px-3 py-1.5 text-xs font-medium rounded-md', 'bg-secondary text-secondary-foreground', 'hover:bg-secondary/80', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors'), children: "Cancel" })] })] })) })] }));
}
//# sourceMappingURL=FeedbackButtons.js.map