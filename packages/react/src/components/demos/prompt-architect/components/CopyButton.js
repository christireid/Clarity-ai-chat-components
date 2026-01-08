'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { logger } from '@clarity-chat/utils/logger';
/**
 * CopyButton Component (PromptArchitect)
 *
 * A thin wrapper around the main CopyButton component with
 * PromptArchitect-specific styling defaults.
 *
 * @see {@link ../../../../components/message/copy-button.tsx} for the full implementation
 */
import * as React from 'react';
import { cn } from '../../../../utils/cn';
import { CopyButton as BaseCopyButton } from '../../../message/copy-button';
/**
 * Copy to clipboard button with visual feedback
 *
 * This is a convenience wrapper around the main CopyButton component,
 * pre-configured for PromptArchitect usage.
 */
export function CopyButton({ text, label = 'Copy to clipboard', size = 'sm', className, onCopy, }) {
    return (_jsx(BaseCopyButton, { text: text, onCopy: onCopy, iconOnly: true, "aria-label": label, className: cn('rounded-md', 'text-muted-foreground hover:text-foreground', 'hover:bg-muted', size === 'sm' && 'h-7 w-7 p-1.5', size === 'md' && 'h-8 w-8 p-2', className) }));
}
export default CopyButton;
//# sourceMappingURL=CopyButton.js.map