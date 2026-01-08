'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { logger } from '@clarity-chat/utils/logger';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea, Button, cn } from '@clarity-chat/primitives';
import { SendIcon } from '../ui/icons';
import { useRequestDeduplication, isDebouncedError, } from '../../hooks/resilience/use-request-deduplication';
import { DURATION_SECONDS } from '../../animations/constants';
/**
 * ChatInput - Mid-Level Composable Component
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat UI
 *
 * A composable input component for chat interfaces with character counting,
 * validation, and smooth animations.
 *
 * For drop-in usage, use top-level `ClarityChat` component instead.
 * For custom input rendering, use low-level primitives.
 *
 * @example
 * ```tsx
 * const [input, setInput] = useState('')
 *
 * <ChatInput
 *   value={input}
 *   onChange={setInput}
 *   onSubmit={async (value) => {
 *     await sendMessage(value)
 *     setInput('')
 *   }}
 *   maxLength={1000}
 * />
 * ```
 *
 * A mid-level building block for chat input functionality. Provides a textarea
 * with character counting, validation, animations, and submit handling.
 *
 * **Features:**
 * - Character counter with warning thresholds
 * - Auto-resizing textarea
 * - Smooth animations (height, focus glow)
 * - Keyboard shortcuts (Enter to submit, Shift+Enter for newline)
 * - Disabled state handling
 * - Max length validation
 *
 * **When to use:**
 * - Building custom chat interfaces
 * - Need input with character counting
 * - Want smooth animations
 *
 * **When NOT to use:**
 * - For simplest setup, use `ClarityChat` component (includes input)
 * - For basic text input without chat features, use standard HTML input
 *
 * @param props - ChatInput configuration
 * @param props.value - Current input value (controlled)
 * @param props.onChange - Callback when value changes
 * @param props.onSubmit - Callback when form is submitted (Enter key or button click)
 * @param props.placeholder - Placeholder text (default: 'Type a message...')
 * @param props.disabled - Disable input (default: false)
 * @param props.maxLength - Maximum character length
 * @param props.showCharCounter - Show character counter (default: true if maxLength is set)
 * @param props.warningThreshold - Warning threshold percentage (default: 0.8 = 80%)
 * @param props.animateHeight - Enable smooth expand/contract animation (default: true)
 * @param props.glowOnFocus - Enable focus ring glow animation (default: true)
 * @param props.className - Optional CSS class name
 *
 * @example Basic usage
 * ```tsx
 * function MyChatInput() {
 *   const [value, setValue] = useState('')
 *
 *   return (
 *     <ChatInput
 *       value={value}
 *       onChange={setValue}
 *       onSubmit={(text) => {
 *         sendMessage(text)
 *         setValue('')
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @example With character limit
 * ```tsx
 * <ChatInput
 *   value={value}
 *   onChange={setValue}
 *   onSubmit={handleSubmit}
 *   maxLength={500}
 *   showCharCounter
 *   warningThreshold={0.9} // Warn at 90%
 * />
 * ```
 *
 * @example Disabled state
 * ```tsx
 * <ChatInput
 *   value={value}
 *   onChange={setValue}
 *   onSubmit={handleSubmit}
 *   disabled={isLoading}
 * />
 * ```
 */
export function ChatInput({ value, onChange, onSubmit, placeholder = 'Type a message...', disabled = false, maxLength, showCharCounter = true, warningThreshold = 0.8, animateHeight = true, glowOnFocus = true, className, id, 'aria-label': ariaLabel, }) {
    // Development-only runtime validation (removed from production for performance)
    if (process.env.NODE_ENV === 'development') {
        if (typeof value !== 'string') {
            console.error('ChatInput: "value" prop must be a string.\n\n' +
                'Example:\n' +
                '  <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} />\n\n' +
                'For more help, see: https://clarity-chat.dev/docs/components');
        }
        if (typeof onChange !== 'function') {
            console.error('ChatInput: "onChange" prop must be a function.\n\n' +
                'Example:\n' +
                '  <ChatInput value={input} onChange={(val) => setInput(val)} onSubmit={handleSubmit} />\n\n' +
                'For more help, see: https://clarity-chat.dev/docs/components');
        }
        if (typeof onSubmit !== 'function') {
            console.error('ChatInput: "onSubmit" prop is required and must be a function.\n\n' +
                'Example:\n' +
                '  <ChatInput value={input} onChange={setInput} onSubmit={async (val) => await sendMessage(val)} />\n\n' +
                'For more help, see: https://clarity-chat.dev/docs/components');
        }
    }
    const [isFocused, setIsFocused] = React.useState(false);
    const [buttonState, setButtonState] = React.useState('idle');
    const textareaRef = React.useRef(null);
    // Request deduplication to prevent double-submit on rapid clicks
    const { execute: dedupeExecute, isPending } = useRequestDeduplication({
        debounceMs: 300,
    });
    // Validate maxLength prop
    const validMaxLength = maxLength && maxLength > 0 ? maxLength : undefined;
    // React 19: Compiler automatically optimizes these - no useMemo needed for simple calculations
    const charCount = value.length;
    const isOverLimit = validMaxLength ? charCount > validMaxLength : false;
    const isNearLimit = validMaxLength
        ? charCount >= validMaxLength * warningThreshold
        : false;
    const hasContent = value.trim().length > 0;
    // Derived styling - compiler optimizes
    const counterColor = isOverLimit
        ? 'text-destructive font-semibold'
        : isNearLimit
            ? 'text-[hsl(var(--warning))] font-medium'
            : charCount > 0
                ? 'text-primary'
                : 'text-muted-foreground';
    const progressColor = isOverLimit
        ? 'bg-destructive'
        : isNearLimit
            ? 'bg-[hsl(var(--warning))]'
            : 'bg-primary';
    // Shake animation - keep this as it references DOM directly
    const triggerShakeAnimation = () => {
        textareaRef.current?.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-8px)' },
            { transform: 'translateX(8px)' },
            { transform: 'translateX(-8px)' },
            { transform: 'translateX(8px)' },
            { transform: 'translateX(0)' },
        ], { duration: DURATION_SECONDS.slower * 1000, easing: 'ease-in-out' });
    };
    // Check if submit is blocked by deduplication
    const isSubmitPending = isPending('chat-submit');
    // React 19: Async action with built-in state management + deduplication
    const handleSubmit = async () => {
        const trimmedValue = value.trim();
        if (!trimmedValue ||
            isOverLimit ||
            disabled ||
            buttonState === 'loading' ||
            isSubmitPending) {
            return;
        }
        setButtonState('loading');
        try {
            // Wrap submission with deduplication to prevent double-submit
            await dedupeExecute('chat-submit', async () => {
                await onSubmit(trimmedValue);
            });
            setButtonState('success');
            // Auto-reset after showing success
            setTimeout(() => setButtonState('idle'), 1000);
        }
        catch (error) {
            // Ignore debounced/deduplicated requests
            if (isDebouncedError(error)) {
                setButtonState('idle');
                return;
            }
            setButtonState('error');
            console.error('[ChatInput] Submit error:', error);
            // Auto-reset after showing error
            setTimeout(() => setButtonState('idle'), 2000);
        }
    };
    // React 19: Compiler optimizes event handlers - no useCallback needed
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !isOverLimit && !disabled) {
                handleSubmit();
            }
            else if (isOverLimit) {
                triggerShakeAnimation();
            }
        }
    };
    // Simple handlers - compiler optimizes
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleChange = (e) => onChange(e.target.value);
    // Focus ring glow animation variants
    // Leveraging Framer Motion v12's improved type inference - no explicit type needed
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
                transition: { duration: DURATION_SECONDS.slow, ease: 'easeOut' },
            }
            : {
                boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
            },
    };
    return (_jsxs(motion.div, { id: id, className: cn('relative flex flex-col gap-3 px-5 py-4', 'border-t border-border/60', 'bg-gradient-to-t from-background via-background to-background/95', 'backdrop-blur-lg', 'shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.05)]', className), initial: "idle", animate: isFocused ? 'focused' : 'idle', variants: containerVariants, tabIndex: -1, children: [_jsxs("div", { className: "flex gap-3 items-end", children: [_jsxs(motion.div, { className: "flex-1 relative", layout: animateHeight, transition: { duration: DURATION_SECONDS.normal, ease: 'easeOut' }, children: [_jsx(Textarea, { ref: textareaRef, value: value, onChange: handleChange, onKeyDown: handleKeyDown, onFocus: handleFocus, onBlur: handleBlur, placeholder: placeholder, disabled: disabled, maxLength: validMaxLength, "aria-label": ariaLabel ?? 'Message', "aria-disabled": disabled, "aria-invalid": isOverLimit, "aria-errormessage": isOverLimit ? 'char-limit-error' : undefined, autoResize: true, maxRows: 6, variant: isOverLimit ? 'error' : 'default', className: cn('transition-all duration-200 shadow-sm border-border/40', isFocused &&
                                    glowOnFocus &&
                                    'ring-2 ring-ring/30 shadow-md border-ring/50', isOverLimit && 'animate-[shake_0.4s_ease-in-out]') }), validMaxLength && showCharCounter && (_jsx(AnimatePresence, { children: charCount > 0 && (_jsxs(motion.div, { id: "char-counter", role: "status", "aria-live": "polite", "aria-atomic": "true", initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 5 }, className: "absolute bottom-3 right-3 flex flex-col items-end gap-1.5", children: [_jsx("div", { className: "w-20 h-1.5 bg-muted/60 rounded-full overflow-hidden shadow-inner", children: _jsx(motion.div, { className: cn('h-full', progressColor), initial: { width: 0 }, animate: {
                                                    width: `${validMaxLength ? Math.min((charCount / validMaxLength) * 100, 100) : 0}%`,
                                                }, transition: { duration: DURATION_SECONDS.normal } }) }), _jsxs(motion.div, { className: cn('text-xs tabular-nums', counterColor), animate: isOverLimit
                                                ? {
                                                    scale: [1, 1.05, 1],
                                                    transition: {
                                                        duration: DURATION_SECONDS.slower,
                                                        repeat: Infinity,
                                                        ease: 'easeInOut',
                                                    },
                                                }
                                                : undefined, children: [charCount, "/", validMaxLength ?? 0] })] })) }))] }), _jsx(Button, { onClick: handleSubmit, disabled: disabled || !hasContent || isOverLimit || isSubmitPending, state: buttonState, size: "icon", className: cn('transition-all duration-200 ease-out shrink-0 h-11 w-11 rounded-xl', hasContent && !isOverLimit
                            ? [
                                'bg-gradient-to-br from-primary via-primary to-primary/85',
                                'text-primary-foreground',
                                'shadow-[0_4px_14px_-3px_hsl(var(--primary)/0.4)]',
                                'hover:shadow-[0_6px_20px_-3px_hsl(var(--primary)/0.5)]',
                                'hover:scale-[1.03] hover:-translate-y-0.5',
                                'active:scale-[0.97] active:translate-y-0',
                                'active:shadow-[0_2px_8px_-2px_hsl(var(--primary)/0.4)]',
                            ]
                            : 'bg-muted/50 text-muted-foreground border border-border/30 shadow-sm'), "aria-label": buttonState === 'loading'
                            ? 'Sending message...'
                            : buttonState === 'success'
                                ? 'Message sent!'
                                : buttonState === 'error'
                                    ? 'Failed to send'
                                    : 'Send message', "aria-describedby": validMaxLength && showCharCounter ? 'char-counter' : undefined, children: _jsx(AnimatePresence, { mode: "wait", children: buttonState === 'idle' && (_jsx(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.8, opacity: 0 }, transition: { duration: DURATION_SECONDS.fast }, children: _jsx(SendIcon, { size: 19 }) }, "send")) }) })] }), _jsx(AnimatePresence, { children: isOverLimit && validMaxLength && (_jsxs(motion.p, { id: "char-limit-error", role: "alert", "aria-live": "assertive", initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "text-xs text-destructive px-1 font-medium", children: ["Message exceeds maximum length by ", charCount - validMaxLength, ' ', "characters"] })) }), _jsx(AnimatePresence, { children: isFocused && !hasContent && (_jsxs(motion.p, { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -5 }, className: "text-xs text-muted-foreground/80 px-1 mt-1", children: ["Press", ' ', _jsx("kbd", { className: "px-2 py-0.5 text-[10px] font-semibold border border-border/60 rounded-md bg-muted/50 shadow-sm", children: "Enter" }), ' ', "to send \u2022", ' ', _jsx("kbd", { className: "px-2 py-0.5 text-[10px] font-semibold border border-border/60 rounded-md bg-muted/50 shadow-sm", children: "Shift + Enter" }), ' ', "for new line"] })) })] }));
}
ChatInput.displayName = 'ChatInput';
//# sourceMappingURL=chat-input.js.map