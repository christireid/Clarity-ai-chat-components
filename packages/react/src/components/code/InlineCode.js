'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../../utils/cn';
/**
 * InlineCode Component
 *
 * Styled inline code span for displaying code within text.
 * Designed to blend seamlessly with surrounding text while
 * clearly indicating code content.
 *
 * Features:
 * - Three style variants
 * - Monospace font
 * - Proper vertical alignment
 * - Accessible
 *
 * @example
 * ```tsx
 * <p>
 *   Use the <InlineCode>useState</InlineCode> hook for state management.
 * </p>
 * ```
 */
export function InlineCode({ children, className, variant = 'default', ref, ...props }) {
    const variantStyles = {
        default: cn('bg-muted/80 text-foreground', 'border border-border/50'),
        subtle: cn('bg-muted/50 text-foreground/90'),
        highlighted: cn('bg-primary/10 text-primary', 'border border-primary/20'),
    };
    return (_jsx("code", { ref: ref, className: cn(
        // Base styles
        'inline-block px-1.5 py-0.5 rounded-md', 
        // Typography
        'font-mono text-[0.875em] leading-none', 
        // Alignment
        'align-middle', 
        // Variant styles
        variantStyles[variant], className), ...props, children: children }));
}
InlineCode.displayName = 'InlineCode';
export default InlineCode;
//# sourceMappingURL=InlineCode.js.map