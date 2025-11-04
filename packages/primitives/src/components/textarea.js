import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
const textareaVariants = cva('flex min-h-[80px] w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-sm hover:border-input/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted transition-all duration-200 resize-none', {
    variants: {
        variant: {
            default: '',
            error: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 focus-visible:shadow-[var(--shadow-error)]',
            success: 'border-[hsl(var(--success))] focus-visible:border-[hsl(var(--success))] focus-visible:ring-[hsl(var(--success))]/20 focus-visible:shadow-[var(--shadow-success)]',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});
const Textarea = React.forwardRef(({ className, variant, error, autoResize = false, maxRows, onChange, ...props }, ref) => {
    const textareaRef = React.useRef(null);
    const hasError = error || variant === 'error';
    const adjustHeight = React.useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea || !autoResize)
            return;
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        if (maxRows) {
            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
            const maxHeight = lineHeight * maxRows;
            textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
        else {
            textarea.style.height = `${scrollHeight}px`;
        }
    }, [autoResize, maxRows]);
    React.useEffect(() => {
        adjustHeight();
    }, [adjustHeight]);
    const handleChange = (e) => {
        adjustHeight();
        onChange?.(e);
    };
    return (_jsxs("div", { children: [_jsx("textarea", { className: cn(textareaVariants({ variant: hasError ? 'error' : variant }), className), ref: (node) => {
                    textareaRef.current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    }
                    else if (ref) {
                        ref.current = node;
                    }
                }, onChange: handleChange, ...props }), error && (_jsxs("p", { className: "mt-1.5 text-xs text-destructive flex items-center gap-1", children: [_jsx("svg", { className: "h-3 w-3 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), error] }))] }));
});
Textarea.displayName = 'Textarea';
export { Textarea, textareaVariants };
//# sourceMappingURL=textarea.js.map