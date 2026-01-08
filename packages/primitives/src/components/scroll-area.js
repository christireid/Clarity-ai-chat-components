'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../lib/cn';
import { ScrollArea as ShadcnScrollArea, ScrollBar as ShadcnScrollBar, } from './ui/scroll-area';
/**
 * ScrollArea component that wraps shadcn/ui's ScrollArea
 * Provides enhanced scrollbar styling and maintains backward compatibility
 */
export const ScrollArea = React.forwardRef(({ className, children, showHorizontalScrollbar = false, useCustomScrollbar = false, ...props }, ref) => {
    // If useCustomScrollbar is true, fall back to simple div-based implementation
    // for backward compatibility with existing code that relies on CSS scrollbar styling
    if (useCustomScrollbar) {
        return (_jsx("div", { ref: ref, className: cn(
            // Base overflow handling
            'overflow-y-auto overflow-x-hidden', 
            // Prevent scroll chaining to parent elements
            'overscroll-contain', 
            // Custom scrollbar styling with refined opacity
            'scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent', 'hover:scrollbar-thumb-muted-foreground/40', 'transition-colors duration-200 ease-out', className), ...props, children: children }));
    }
    // Use shadcn/ui's ScrollArea with Radix UI primitives
    return (_jsxs(ShadcnScrollArea, { ref: ref, className: cn(
        // Preserve original styling where possible
        'overscroll-contain', className), ...props, children: [children, showHorizontalScrollbar && (_jsx(ShadcnScrollBar, { orientation: "horizontal" }))] }));
});
ScrollArea.displayName = 'ScrollArea';
// Re-export ScrollBar for advanced usage
export { ShadcnScrollBar as ScrollBar };
//# sourceMappingURL=scroll-area.js.map