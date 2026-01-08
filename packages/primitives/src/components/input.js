'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { durations } from '../lib/animation-presets';
import { getErrorAriaAttributes } from '../lib/aria';
import { useComposedRefs } from '../hooks/use-composed-refs';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { ErrorMessage } from './error-message';
import { Input as ShadcnInput } from './ui/input';
import { Label } from './ui/label';
import { CloseIcon, CharacterCount } from './icons';
/**
 * Input variant styles using Class Variance Authority
 */
const inputVariants = cva([
    'flex w-full rounded-lg border border-input bg-background',
    'px-3 py-2 text-sm shadow-xs ring-offset-background',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'focus-visible:ring-offset-1 focus-visible:border-primary focus-visible:shadow-xs',
    'hover:border-accent-foreground/20',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
    'transition-all duration-200',
], {
    variants: {
        variant: {
            default: '',
            error: [
                'border-destructive',
                'focus-visible:ring-destructive/20 focus-visible:border-destructive',
            ],
            success: [
                'border-success',
                'focus-visible:ring-success/20 focus-visible:border-success',
            ],
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
/**
 * Clear button component for input with animation
 */
const ClearButton = React.memo(function ClearButton({ onClick, size, prefersReducedMotion, }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
    };
    return (_jsx(motion.button, { type: "button", onClick: onClick, className: cn('absolute right-3 top-1/2 -translate-y-1/2', 'text-muted-foreground hover:text-foreground', 'focus:outline-none focus:ring-2 focus:ring-ring/40 rounded', 'transition-colors duration-150'), "aria-label": "Clear input", initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }, transition: { duration: durations.fast, ease: 'easeOut' }, children: _jsx(CloseIcon, { className: sizeClasses[size || 'default'] }) }));
});
/**
 * Enhanced Input component with label, icons, clear button, and character count
 *
 * @description
 * A fully-featured input component built on shadcn/ui patterns with additional
 * functionality commonly needed in production applications:
 * - Built-in label with proper accessibility associations
 * - Left/right icon slots
 * - Clear button for easy value reset
 * - Character count with maxLength support
 * - Error and helper text with proper ARIA
 * - Multiple size variants
 *
 * @example
 * ```tsx
 * // Basic input with label
 * <Input label="Email" type="email" />
 *
 * // With icon and error
 * <Input
 *   label="Search"
 *   icon={<SearchIcon />}
 *   error="No results found"
 * />
 *
 * // With clear button and character count
 * <Input
 *   label="Message"
 *   clearable
 *   maxLength={100}
 *   showCharacterCount
 * />
 *
 * // Controlled with clear
 * const [value, setValue] = useState('')
 * <Input
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 *   clearable
 *   onClear={() => setValue('')}
 * />
 * ```
 *
 * @accessibility
 * - Label properly associated via htmlFor/id
 * - Error messages linked via aria-describedby
 * - aria-invalid set when error present
 * - Character count announced to screen readers
 * - Clear button has accessible label
 */
const Input = React.forwardRef(({ className, variant, inputSize, type, label, error, helperText, icon, iconPosition = 'left', id, clearable = false, onClear, maxLength, showCharacterCount, hideLabel = false, required = false, wrapperClassName, value, defaultValue, onChange, disabled, ...props }, forwardedRef) => {
    // Internal ref for clear functionality
    const internalRef = React.useRef(null);
    const composedRef = useComposedRefs(forwardedRef, internalRef);
    // Check for reduced motion preference (for clear button animation)
    const prefersReducedMotion = useReducedMotion();
    // Track value for character count and clear button visibility
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const currentValue = value !== undefined ? value : internalValue;
    const currentLength = String(currentValue).length;
    // Determine if we have an error state
    const hasError = Boolean(error) || variant === 'error';
    const effectiveVariant = hasError ? 'error' : variant;
    // Generate stable IDs
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;
    const labelId = label ? `${inputId}-label` : undefined;
    // Combine describedby IDs
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;
    // Handle input change
    const handleChange = (e) => {
        if (value === undefined) {
            setInternalValue(e.target.value);
        }
        onChange?.(e);
    };
    // Handle clear button click
    const handleClear = () => {
        if (value === undefined) {
            setInternalValue('');
        }
        onClear?.();
        // Trigger onChange with empty value
        if (internalRef.current) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            nativeInputValueSetter?.call(internalRef.current, '');
            const event = new Event('input', { bubbles: true });
            internalRef.current.dispatchEvent(event);
            internalRef.current.focus();
        }
    };
    // Determine if clear button should show
    const showClearButton = clearable && currentLength > 0 && !disabled;
    // Determine if character count should show
    const showCount = showCharacterCount ||
        (maxLength !== undefined && showCharacterCount !== false);
    // Calculate padding for icons and clear button
    const hasLeftIcon = icon && iconPosition === 'left';
    const hasRightIcon = icon && iconPosition === 'right';
    const paddingLeft = hasLeftIcon ? 'pl-10' : '';
    const paddingRight = cn(hasRightIcon && !showClearButton && 'pr-10', showClearButton && !hasRightIcon && 'pr-10', showClearButton && hasRightIcon && 'pr-16');
    return (_jsxs("div", { className: cn('w-full', wrapperClassName), "data-slot": "input-wrapper", children: [label && (_jsxs(Label, { id: labelId, htmlFor: inputId, className: cn('mb-1.5 block text-sm font-medium', hideLabel && 'sr-only', disabled && 'opacity-50'), children: [label, required && (_jsx("span", { className: "text-destructive ml-0.5", "aria-hidden": "true", children: "*" }))] })), _jsxs("div", { className: "relative", children: [hasLeftIcon && (_jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none", "aria-hidden": "true", children: icon })), _jsx(ShadcnInput, { type: type, id: inputId, ref: composedRef, value: value, defaultValue: defaultValue, onChange: handleChange, disabled: disabled, required: required, maxLength: maxLength, className: cn(inputVariants({ variant: effectiveVariant, inputSize }), paddingLeft, paddingRight, className), ...getErrorAriaAttributes(hasError, errorId), "aria-describedby": describedBy, "aria-labelledby": labelId, "data-slot": "input", "data-variant": effectiveVariant, "data-size": inputSize || 'default', ...props }), hasRightIcon && !showClearButton && (_jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none", "aria-hidden": "true", children: icon })), hasRightIcon && showClearButton && (_jsx("div", { className: "absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none", "aria-hidden": "true", children: icon })), _jsx(AnimatePresence, { children: showClearButton && (_jsx(ClearButton, { onClick: handleClear, size: inputSize, prefersReducedMotion: prefersReducedMotion })) })] }), (error || helperText || showCount) && (_jsxs("div", { className: "mt-1.5 flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1", children: [error && _jsx(ErrorMessage, { error: error, id: errorId }), helperText && !error && (_jsx("p", { id: helperId, className: "text-xs text-muted-foreground", "data-slot": "input-helper", children: helperText }))] }), showCount && (_jsx(CharacterCount, { current: currentLength, max: maxLength }))] }))] }));
});
Input.displayName = 'Input';
export { Input, inputVariants };
//# sourceMappingURL=input.js.map