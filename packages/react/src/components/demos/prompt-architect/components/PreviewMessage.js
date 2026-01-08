'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * PreviewMessage Component
 *
 * Displays a single message in the preview pane with role-based styling.
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../../utils/cn';
import { ANIMATION_PRESETS, DURATION_SECONDS, EASING_FRAMER, } from '../../../../animations/constants';
/**
 * Role icons and labels
 */
const ROLE_CONFIG = {
    system: {
        icon: '⚙️',
        label: 'SYSTEM',
        bgClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50',
        textClass: 'text-amber-800 dark:text-amber-200',
    },
    user: {
        icon: '👤',
        label: 'USER',
        bgClass: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50',
        textClass: 'text-blue-800 dark:text-blue-200',
    },
    assistant: {
        icon: '🤖',
        label: 'ASSISTANT',
        bgClass: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50',
        textClass: 'text-green-800 dark:text-green-200',
    },
};
/**
 * Streaming cursor component
 */
function StreamingCursor() {
    return (_jsx(motion.span, { className: "inline-block w-2 h-4 bg-primary ml-0.5", animate: { opacity: [1, 0, 1] }, transition: {
            duration: DURATION_SECONDS.slower,
            repeat: Infinity,
            ease: 'linear',
        } }));
}
/**
 * Single message in the preview
 */
export const PreviewMessage = React.memo(function PreviewMessage({ message, isStreaming = false, streamingContent, }) {
    const config = ROLE_CONFIG[message.role];
    const displayContent = isStreaming ? streamingContent : message.content;
    return (_jsxs(motion.div, { initial: ANIMATION_PRESETS.slideUp.initial, animate: ANIMATION_PRESETS.slideUp.animate, transition: {
            duration: DURATION_SECONDS.normal,
            ease: EASING_FRAMER.out,
        }, className: cn('rounded-lg border p-4', config.bgClass), children: [_jsxs("div", { className: cn('flex items-center gap-2 mb-2', config.textClass), children: [_jsx("span", { children: config.icon }), _jsx("span", { className: "text-xs font-semibold tracking-wider", children: config.label })] }), _jsxs("div", { className: "text-sm text-foreground whitespace-pre-wrap break-words", children: [displayContent, isStreaming && _jsx(StreamingCursor, {})] })] }));
});
export default PreviewMessage;
//# sourceMappingURL=PreviewMessage.js.map