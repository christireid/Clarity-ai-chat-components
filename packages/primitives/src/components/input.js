import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
const inputVariants = cva('flex w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-sm hover:border-input/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200', {
    variants: {
        variant: {
            default: '',
            error: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 focus-visible:shadow-[var(--shadow-error)]',
            success: 'border-[hsl(var(--success))] focus-visible:border-[hsl(var(--success))] focus-visible:ring-[hsl(var(--success))]/20 focus-visible:shadow-[var(--shadow-success)]',
        },
        inputSize: {
            default: 'h-10',
            sm: 'h-8 text-xs px-2',
            lg: 'h-12 text-base px-4',
        },
    },
    defaultVariants: {
        variant: 'default',
        inputSize: 'default',
    },
});
const Input = React.forwardRef(({ className, variant, inputSize, type, error, icon, iconPosition = 'left', ...props }, ref) => {
    const hasError = error || variant === 'error';
    if (icon) {
        return (_jsxs("div", { className: "relative", children: [iconPosition === 'left' && (_jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: icon })), _jsx("input", { type: type, className: cn(inputVariants({ variant: hasError ? 'error' : variant, inputSize }), iconPosition === 'left' && 'pl-10', iconPosition === 'right' && 'pr-10', className), ref: ref, ...props }), iconPosition === 'right' && (_jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: icon })), error && (_jsxs("p", { className: "mt-1.5 text-xs text-destructive flex items-center gap-1", children: [_jsx("svg", { className: "h-3 w-3 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), error] }))] }));
    }
    return (_jsxs("div", { children: [_jsx("input", { type: type, className: cn(inputVariants({ variant: hasError ? 'error' : variant, inputSize }), className), ref: ref, ...props }), error && (_jsxs("p", { className: "mt-1.5 text-xs text-destructive flex items-center gap-1", children: [_jsx("svg", { className: "h-3 w-3 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), error] }))] }));
});
Input.displayName = 'Input';
export { Input, inputVariants };
//# sourceMappingURL=input.js.map