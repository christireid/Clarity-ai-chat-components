'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, cn, Textarea } from '@clarity-chat/primitives';
import { CheckIcon, CloseIcon } from '../ui/icons';
import { DURATION_SECONDS as durations } from '../../animations/constants';
/** Maximum recommended content length before warning */
const MAX_CONTENT_LENGTH = 10000;
/**
 * EditableMessageContent - Inline editor for user messages
 *
 * Provides a smooth transition between view and edit modes with:
 * - Auto-focusing textarea
 * - Keyboard shortcuts (Escape to cancel, Cmd/Ctrl+Enter to save)
 * - Save/Cancel buttons
 * - Animated transitions
 */
export const EditableMessageContent = React.memo(({ content, isEditing, onSave, onCancel, className, maxLength = MAX_CONTENT_LENGTH, }) => {
    const [editValue, setEditValue] = React.useState(content);
    const textareaRef = React.useRef(null);
    // Detect if user is on Mac for keyboard hint
    // Note: navigator.platform is deprecated but navigator.userAgentData is not
    // widely supported yet. Use userAgent as fallback.
    const isMac = React.useMemo(() => {
        if (typeof navigator === 'undefined')
            return false;
        // Try modern API first (Chrome 90+)
        const platform = navigator.userAgentData?.platform;
        if (platform) {
            return /mac/i.test(platform);
        }
        // Fallback to userAgent (more reliable than deprecated platform)
        return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }, []);
    // Reset edit value when entering edit mode
    React.useEffect(() => {
        if (isEditing) {
            setEditValue(content);
            // Focus textarea after animation starts
            setTimeout(() => {
                textareaRef.current?.focus();
                // Move cursor to end
                textareaRef.current?.setSelectionRange(content.length, content.length);
            }, 50);
        }
    }, [isEditing, content]);
    // Handle keyboard shortcuts
    const handleKeyDown = React.useCallback((e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        }
        else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            const trimmed = editValue.trim();
            // Only save if content is non-empty AND has changes
            if (trimmed && trimmed !== content) {
                onSave(trimmed);
            }
        }
    }, [editValue, content, onSave, onCancel]);
    const handleSave = React.useCallback(() => {
        const trimmed = editValue.trim();
        // Only save if content is non-empty AND has changes (defense in depth)
        if (trimmed && trimmed !== content) {
            onSave(trimmed);
        }
    }, [editValue, content, onSave]);
    const hasChanges = editValue.trim() !== content;
    const isEmpty = !editValue.trim();
    const isOverLimit = editValue.length > maxLength;
    return (_jsx(AnimatePresence, { mode: "wait", children: isEditing ? (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 }, transition: { duration: durations.fast }, className: cn('space-y-3', className), children: [_jsx(Textarea, { ref: textareaRef, value: editValue, onChange: (e) => setEditValue(e.target.value), onKeyDown: handleKeyDown, className: cn('min-h-[100px] max-h-64 overflow-y-auto resize-none', 'bg-background border-2', isOverLimit
                        ? 'border-amber-500/70 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                        : 'border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20', 'rounded-xl p-3', 'text-foreground', 'transition-all duration-200'), placeholder: "Edit your message...", "aria-label": "Edit message", "aria-describedby": isOverLimit ? 'edit-length-warning' : undefined }), _jsxs("div", { className: "flex items-center justify-between -mt-1", children: [isOverLimit ? (_jsx("span", { id: "edit-length-warning", className: "text-xs text-amber-600 dark:text-amber-400", role: "alert", children: "Message is very long and may affect performance" })) : (_jsx("span", {})), _jsxs("span", { className: cn('text-xs text-right', isOverLimit
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-muted-foreground'), "aria-hidden": "true", children: [editValue.length.toLocaleString(), " characters"] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1, duration: durations.fast }, className: "flex items-center justify-end gap-2", children: [_jsxs("span", { className: "text-xs text-muted-foreground mr-2 hidden sm:inline", children: [_jsx("kbd", { className: "px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono", children: "Esc" }), ' ', "cancel \u00B7", ' ', _jsxs("kbd", { className: "px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono", children: [isMac ? '⌘' : 'Ctrl', "+\u21B5"] }), ' ', "save"] }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: onCancel, className: "gap-1.5 text-muted-foreground hover:text-foreground", children: [_jsx(CloseIcon, { size: 14 }), "Cancel"] }), _jsxs(Button, { variant: "default", size: "sm", onClick: handleSave, disabled: isEmpty || !hasChanges, className: "gap-1.5", children: [_jsx(CheckIcon, { size: 14 }), "Save"] })] })] }, "editing")) : null }));
});
EditableMessageContent.displayName = 'EditableMessageContent';
//# sourceMappingURL=editable-message-content.js.map