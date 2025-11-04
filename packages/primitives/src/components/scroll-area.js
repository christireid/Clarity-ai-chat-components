import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../lib/utils';
// Simple scroll area component with enhanced scrollbar styling
export const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn('relative overflow-auto', 
        // Custom scrollbar styling
        'scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent', 'hover:scrollbar-thumb-muted-foreground/30', 'transition-colors', className), ...props, children: children }));
});
ScrollArea.displayName = 'ScrollArea';
//# sourceMappingURL=scroll-area.js.map