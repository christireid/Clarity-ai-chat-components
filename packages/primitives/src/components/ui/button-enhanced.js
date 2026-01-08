import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Enhanced Button - shadcn/ui Button with loading state and additional variants
 *
 * This wraps the shadcn Button component and adds:
 * - Loading state functionality with spinner
 * - Additional variants: surface, success, error
 * - State prop for controlled loading/success/error states
 */
import * as React from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
// Extended button variants including surface, success, error
const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
            // Additional variants
            surface: 'bg-muted text-muted-foreground border border-border/60 hover:bg-muted/80',
            success: 'bg-success text-success-foreground hover:bg-success/90',
            error: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        },
        size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
export const Button = React.forwardRef(({ children, loading, state, ripple: _ripple, disabled, className, variant, size, asChild = false, ...props }, ref) => {
    // Determine effective state
    const isLoading = state === 'loading' || loading;
    const isSuccess = state === 'success';
    const isError = state === 'error';
    const Comp = asChild ? Slot : 'button';
    // Render state icon
    const stateIcon = isLoading ? (_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" })) : isSuccess ? (_jsx(Check, { className: "mr-2 h-4 w-4" })) : isError ? (_jsx(X, { className: "mr-2 h-4 w-4" })) : null;
    return (_jsxs(Comp, { ref: ref, disabled: disabled || isLoading, className: cn(buttonVariants({ variant, size, className })), ...props, children: [stateIcon, children] }));
});
Button.displayName = 'Button';
export { buttonVariants };
//# sourceMappingURL=button-enhanced.js.map