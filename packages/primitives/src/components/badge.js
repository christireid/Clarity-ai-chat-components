import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {
    variants: {
        variant: {
            default: 'border-transparent bg-primary/90 text-primary-foreground hover:bg-primary shadow-sm hover:shadow-md',
            secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm hover:shadow',
            destructive: 'border-transparent bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-sm hover:shadow-[var(--shadow-error)]',
            outline: 'border-2 border-border text-foreground hover:bg-accent hover:border-accent-foreground/20 hover:shadow-sm',
            success: 'border-transparent bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]/90 shadow-sm hover:shadow-[var(--shadow-success)]',
            warning: 'border-transparent bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]/90 shadow-sm hover:shadow-[var(--shadow-warning)]',
            info: 'border-transparent bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] hover:bg-[hsl(var(--info))]/90 shadow-sm hover:shadow-blue-500/20',
            subtle: 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80',
            ghost: 'border-transparent hover:bg-accent hover:text-accent-foreground',
        },
        size: {
            sm: 'px-2 py-0.5 text-[10px]',
            default: 'px-2.5 py-0.5 text-xs',
            lg: 'px-3 py-1 text-sm',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
const Badge = React.forwardRef(({ className, variant, size, dot = false, pulse = false, glow = false, children, ...props }, ref) => {
    return (_jsxs("div", { ref: ref, className: cn(badgeVariants({ variant, size }), pulse && 'animate-[badge-pulse_2s_ease-in-out_infinite]', glow && 'animate-[glow_2s_ease-in-out_infinite]', className), ...props, children: [dot && (_jsxs("span", { className: "relative mr-1.5 flex h-2 w-2", children: [_jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" }), _jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-current" })] })), children] }));
});
Badge.displayName = 'Badge';
export { Badge, badgeVariants };
//# sourceMappingURL=badge.js.map