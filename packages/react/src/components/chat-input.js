import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea, Button, cn, } from '@clarity-chat/primitives';
import { SendIcon } from './icons';
import { FeedbackAnimations } from '../animations/microanimations';
export const ChatInput = React.memo(function ChatInput({ value, onChange, onSubmit, placeholder = 'Type a message...', disabled = false, maxLength, showCharCounter = true, warningThreshold = 0.8, animateHeight = true, glowOnFocus = true, className, }) {
    const [isFocused, setIsFocused] = React.useState(false);
    const [buttonState, setButtonState] = React.useState('idle');
    const textareaRef = React.useRef(null);
    const charCount = value.length;
    const isOverLimit = maxLength ? charCount > maxLength : false;
    const isNearLimit = maxLength
        ? charCount >= maxLength * warningThreshold
        : false;
    const hasContent = value.trim().length > 0;
    // Calculate character counter color
    const getCounterColor = () => {
        if (isOverLimit)
            return 'text-destructive font-semibold';
        if (isNearLimit)
            return 'text-[hsl(var(--warning))] font-medium';
        if (charCount > 0)
            return 'text-primary';
        return 'text-muted-foreground';
    };
    // Calculate progress bar color
    const getProgressColor = () => {
        if (isOverLimit)
            return 'bg-destructive';
        if (isNearLimit)
            return 'bg-[hsl(var(--warning))]';
        return 'bg-primary';
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !isOverLimit) {
                handleSubmit();
            }
            else if (isOverLimit) {
                // Shake animation for error feedback
                textareaRef.current?.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-8px)' },
                    { transform: 'translateX(8px)' },
                    { transform: 'translateX(-8px)' },
                    { transform: 'translateX(8px)' },
                    { transform: 'translateX(0)' },
                ], { duration: 400, easing: 'ease-in-out' });
            }
        }
    };
    const handleSubmit = async () => {
        if (!value.trim() || isOverLimit || disabled || buttonState === 'loading')
            return;
        setButtonState('loading');
        try {
            await onSubmit(value);
            setButtonState('success');
            // Auto-reset after showing success
            setTimeout(() => setButtonState('idle'), 1000);
        }
        catch (error) {
            setButtonState('error');
            console.error('[ChatInput] Submit error:', error);
            // Auto-reset after showing error
            setTimeout(() => setButtonState('idle'), 2000);
        }
    };
    // Focus ring glow animation variants
    const containerVariants = {
        idle: {
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
        },
        focused: glowOnFocus
            ? {
                boxShadow: [
                    '0 0 0 0 hsl(var(--primary) / 0)',
                    '0 0 0 4px hsl(var(--primary) / 0.15)',
                    '0 0 0 4px hsl(var(--primary) / 0.15)',
                ],
                transition: { duration: 0.3, ease: 'easeOut' },
            }
            : {},
    };
    return (_jsxs(motion.div, { className: cn('relative flex flex-col gap-2 p-4 border-t-2 bg-background/95 backdrop-blur-sm', className), initial: "idle", animate: isFocused ? 'focused' : 'idle', variants: containerVariants, children: [_jsxs("div", { className: "flex gap-2 items-end", children: [_jsxs(motion.div, { className: "flex-1 relative", layout: animateHeight, transition: { duration: 0.2, ease: 'easeOut' }, children: [_jsx(Textarea, { ref: textareaRef, value: value, onChange: (e) => onChange(e.target.value), onKeyDown: handleKeyDown, onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false), placeholder: placeholder, disabled: disabled, maxLength: maxLength, autoResize: true, maxRows: 6, variant: isOverLimit ? 'error' : 'default', className: cn('transition-all duration-200 shadow-sm', isFocused && glowOnFocus && 'ring-2 ring-primary/30 shadow-md', isOverLimit && 'animate-[shake_0.4s_ease-in-out]') }), maxLength && showCharCounter && (_jsx(AnimatePresence, { children: charCount > 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 5 }, className: "absolute bottom-2 right-2 flex flex-col items-end gap-1", children: [_jsx("div", { className: "w-16 h-1 bg-muted rounded-full overflow-hidden", children: _jsx(motion.div, { className: cn('h-full', getProgressColor()), initial: { width: 0 }, animate: {
                                                    width: `${Math.min((charCount / maxLength) * 100, 100)}%`,
                                                }, transition: { duration: 0.2 } }) }), _jsxs(motion.div, { className: cn('text-xs tabular-nums', getCounterColor()), animate: isOverLimit ? FeedbackAnimations.pulse : {}, children: [charCount, "/", maxLength] })] })) }))] }), _jsx(Button, { onClick: handleSubmit, disabled: disabled || !hasContent || isOverLimit, state: buttonState, size: "icon", className: cn('transition-all duration-200 shrink-0 shadow-sm', hasContent && !isOverLimit
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5'
                            : 'bg-muted text-muted-foreground'), "aria-label": buttonState === 'loading'
                            ? 'Sending message...'
                            : buttonState === 'success'
                                ? 'Message sent!'
                                : buttonState === 'error'
                                    ? 'Failed to send'
                                    : 'Send message', children: _jsx(AnimatePresence, { mode: "wait", children: buttonState === 'idle' && (_jsx(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.8, opacity: 0 }, transition: { duration: 0.15 }, children: _jsx(SendIcon, { size: 18 }) }, "send")) }) })] }), _jsx(AnimatePresence, { children: isOverLimit && (_jsxs(motion.p, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "text-xs text-destructive px-1", children: ["Message exceeds maximum length by ", charCount - (maxLength || 0), ' ', "characters"] })) }), _jsx(AnimatePresence, { children: isFocused && !hasContent && (_jsxs(motion.p, { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -5 }, className: "text-xs text-muted-foreground px-1", children: ["Press", ' ', _jsx("kbd", { className: "px-1.5 py-0.5 text-xs border rounded bg-muted", children: "Enter" }), ' ', "to send ?", ' ', _jsx("kbd", { className: "px-1.5 py-0.5 text-xs border rounded bg-muted", children: "Shift + Enter" }), ' ', "for new line"] })) })] }));
});
ChatInput.displayName = 'ChatInput';
//# sourceMappingURL=chat-input.js.map