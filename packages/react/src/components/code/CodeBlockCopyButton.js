'use client';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * CodeBlockCopyButton Component
 *
 * A specialized copy button for code blocks. This is a thin wrapper around
 * the main CopyButton component with code-block-specific defaults.
 *
 * For the full-featured copy button, use CopyButton from '../message/copy-button'.
 *
 * @example
 * ```tsx
 * <CodeBlockCopyButton
 *   content={codeString}
 *   onCopy={() => console.log('Copied!')}
 * />
 * ```
 */
import * as React from 'react';
import { cn } from '@clarity-chat/primitives';
import { CopyButton } from '../message/copy-button';
/**
 * CodeBlockCopyButton - Specialized copy button for code blocks
 *
 * This is a convenience wrapper around the main CopyButton component,
 * pre-configured for code block usage with icon-only mode and
 * appropriate styling.
 *
 * Features:
 * - Smooth icon transition (copy → checkmark)
 * - Spring-based animations
 * - Respects prefers-reduced-motion
 * - Screen reader friendly
 *
 * @see CopyButton for the full-featured copy button
 */
export const CodeBlockCopyButton = React.memo(function CodeBlockCopyButton({ content, onCopy, onError, className, 'aria-label': ariaLabel = 'Copy code to clipboard', disabled = false, }) {
    return (_jsx(CopyButton, { text: content, onCopy: onCopy, onCopyError: onError, iconOnly: true, disabled: disabled, "aria-label": ariaLabel, className: cn('p-2 rounded-md', 'hover:bg-muted/80', 'text-muted-foreground hover:text-foreground', className) }));
});
CodeBlockCopyButton.displayName = 'CodeBlockCopyButton';
export default CodeBlockCopyButton;
//# sourceMappingURL=CodeBlockCopyButton.js.map