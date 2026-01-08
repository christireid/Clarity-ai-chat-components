'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { announce, getLoadingAriaAttributes } from '../lib/aria';
import { useRippleEffect } from '../hooks/use-ripple-effect';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { useComposedRefs } from '../hooks/use-composed-refs';
import { LoadingIcon, SuccessIcon, ErrorIcon } from './icons';
import { Button as ShadcnButton } from './ui/button';
/**
 * Button variant styles using Class Variance Authority
 *
 * @description
 * Defines all button variants, sizes, and their corresponding Tailwind classes.
 * Uses CVA for type-safe variant management following shadcn/ui patterns.
 */
const buttonVariants = cva(
// Base styles applied to all buttons
[
    'relative inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-md text-sm font-medium tracking-[0.13px]',
    'ring-offset-background transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1',
    'disabled:pointer-events-none disabled:opacity-50',
    'overflow-hidden',
], {
    variants: {
        variant: {
            default: [
                'bg-primary text-primary-foreground shadow-xs',
                'hover:bg-primary/90 hover:shadow-sm hover:-translate-y-[1px]',
                'active:translate-y-0 active:shadow-xs',
            ],
            destructive: [
                'bg-destructive text-destructive-foreground shadow-xs',
                'hover:bg-destructive/90 hover:shadow-sm hover:-translate-y-[1px]',
                'active:translate-y-0 active:shadow-xs',
            ],
            outline: [
                'border ring-1 ring-border bg-background',
                'hover:bg-accent hover:text-accent-foreground hover:border-primary/40 hover:shadow-xs',
                'transition-colors duration-200',
            ],
            secondary: [
                'bg-secondary text-secondary-foreground shadow-xs',
                'hover:bg-secondary/80 hover:shadow-sm hover:-translate-y-[1px]',
                'active:translate-y-0 active:shadow-xs',
            ],
            ghost: [
                'hover:bg-accent hover:text-accent-foreground',
                'transition-colors duration-200',
            ],
            link: [
                'text-primary underline-offset-4 hover:underline',
                'transition-colors duration-200',
            ],
            success: [
                'bg-success text-success-foreground shadow-xs',
                'hover:bg-success/90 hover:shadow-sm hover:-translate-y-[1px]',
                'active:translate-y-0 active:shadow-xs',
            ],
            error: [
                'bg-destructive text-destructive-foreground shadow-xs',
                'hover:bg-destructive/90 hover:shadow-sm hover:-translate-y-[1px]',
                'active:translate-y-0 active:shadow-xs',
            ],
            surface: [
                'bg-surface text-surface-foreground border border-border/60 shadow-xs',
                'hover:bg-surface/80 hover:shadow-sm hover:-translate-y-[1px]',
                'active:translate-y-0 active:shadow-xs',
            ],
        },
        size: {
            default: 'h-10 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md px-3 text-xs has-[>svg]:px-2.5',
            lg: 'h-12 rounded-md px-8 text-base has-[>svg]:px-6',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
/**
 * Ripple color palette based on variant for visual feedback
 */
const RIPPLE_COLORS = {
    default: 'rgba(255, 255, 255, 0.35)',
    surface: 'rgba(22, 119, 255, 0.25)',
    secondary: 'rgba(22, 119, 255, 0.18)',
    dashed: 'rgba(22, 119, 255, 0.18)',
    outline: 'rgba(22, 119, 255, 0.18)',
    ghost: 'rgba(22, 119, 255, 0.14)',
    link: 'rgba(22, 119, 255, 0.12)',
    destructive: 'rgba(255, 77, 79, 0.35)',
    success: 'rgba(34, 197, 94, 0.32)',
    error: 'rgba(255, 77, 79, 0.35)',
};
/**
 * Button component with loading states, ripple effects, and full accessibility
 *
 * @description
 * An enhanced button component built on shadcn/ui and Radix UI primitives.
 * Features include:
 * - Multiple visual variants (default, destructive, outline, secondary, ghost, link)
 * - Loading, success, and error states with animations
 * - Material Design ripple effect
 * - Full keyboard navigation (Enter, Space)
 * - Screen reader announcements for state changes
 * - Respects `prefers-reduced-motion` for accessibility
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="default">Click me</Button>
 *
 * // With loading state
 * <Button loading>Submitting...</Button>
 *
 * // Controlled state
 * const [state, setState] = useState<ButtonState>('idle')
 * <Button state={state} onClick={() => setState('loading')}>
 *   Submit
 * </Button>
 *
 * // Without ripple effect
 * <Button ripple={false}>No Ripple</Button>
 * ```
 *
 * @see {@link https://ui.shadcn.com/docs/components/button} shadcn/ui Button
 * @see {@link https://www.radix-ui.com/primitives/docs/components/button} Radix Button
 *
 * @accessibility
 * - Follows WAI-ARIA Button pattern
 * - Supports keyboard activation (Enter, Space)
 * - Announces loading/success/error states to screen readers
 * - Respects `prefers-reduced-motion` media query
 * - Uses `aria-busy` and `aria-disabled` for state communication
 */
const Button = React.forwardRef(({ className, variant, size, asChild = false, loading = false, state: controlledState, ripple = true, rippleColor, successMessage, errorMessage, stateDuration = 2000, loadingLabel = 'Loading', announceStateChange = true, disabled, children, onClick, ...props }, forwardedRef) => {
    // Internal state for uncontrolled mode
    const [internalState, setInternalState] = React.useState('idle');
    const stateTimeoutRef = React.useRef(undefined);
    const internalRef = React.useRef(null);
    // Compose refs for both internal and forwarded usage
    const composedRef = useComposedRefs(forwardedRef, internalRef);
    // Check for reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    // Determine current state: controlled state takes precedence, then loading, then internal
    const currentState = controlledState !== undefined
        ? controlledState
        : loading
            ? 'loading'
            : internalState;
    // Determine if ripple should show
    const shouldShowRipple = ripple &&
        variant !== 'link' &&
        !disabled &&
        currentState === 'idle' &&
        !prefersReducedMotion;
    // Use ripple effect hook
    const { ripples, addRipple } = useRippleEffect({
        enabled: shouldShowRipple,
    });
    // Get ripple color based on variant
    const rippleColorValue = rippleColor ||
        RIPPLE_COLORS[variant ?? 'default'] ||
        'rgba(22, 119, 255, 0.22)';
    // Announce state changes to screen readers
    const previousStateRef = React.useRef(currentState);
    React.useEffect(() => {
        if (!announceStateChange)
            return;
        if (previousStateRef.current === currentState)
            return;
        previousStateRef.current = currentState;
        switch (currentState) {
            case 'loading':
                announce(loadingLabel, { assertive: false });
                break;
            case 'success':
                announce('Success', { assertive: false });
                break;
            case 'error':
                announce('Error', { assertive: true });
                break;
        }
    }, [currentState, announceStateChange, loadingLabel]);
    // Auto-reset state after duration (uncontrolled mode only)
    React.useEffect(() => {
        if ((currentState === 'success' || currentState === 'error') &&
            controlledState === undefined) {
            const duration = Math.max(0, stateDuration || 2000);
            stateTimeoutRef.current = setTimeout(() => {
                setInternalState('idle');
            }, duration);
        }
        else {
            if (stateTimeoutRef.current) {
                clearTimeout(stateTimeoutRef.current);
                stateTimeoutRef.current = undefined;
            }
        }
        return () => {
            if (stateTimeoutRef.current) {
                clearTimeout(stateTimeoutRef.current);
                stateTimeoutRef.current = undefined;
            }
        };
    }, [currentState, controlledState, stateDuration]);
    // Handle click with ripple effect
    const handleClick = (e) => {
        if (shouldShowRipple) {
            addRipple(e);
        }
        onClick?.(e);
    };
    // Render state-specific content
    let stateContent = null;
    switch (currentState) {
        case 'loading':
            stateContent = _jsx(LoadingIcon, {});
            break;
        case 'success':
            stateContent = successMessage || _jsx(SuccessIcon, {});
            break;
        case 'error':
            stateContent = errorMessage || _jsx(ErrorIcon, {});
            break;
    }
    // Determine if button should be disabled
    const isDisabled = disabled || currentState === 'loading';
    // Map custom variants to shadcn variants where possible
    const shadcnVariant = variant === 'default' ||
        variant === 'secondary' ||
        variant === 'destructive' ||
        variant === 'outline' ||
        variant === 'ghost' ||
        variant === 'link'
        ? variant
        : undefined;
    // Apply state-specific variant
    const effectiveVariant = currentState === 'success'
        ? 'success'
        : currentState === 'error'
            ? 'error'
            : variant;
    // Build animation classes based on motion preference
    const animationClasses = prefersReducedMotion
        ? ''
        : cn(currentState === 'success' &&
            'after:absolute after:inset-0 after:rounded-inherit after:border-2 after:border-success/40 after:animate-[pulse_0.8s_ease-out_2] after:content-[""]', currentState === 'error' && 'animate-[error-shake_0.4s_ease-in-out]');
    return (_jsxs(ShadcnButton, { className: cn(buttonVariants({ variant: effectiveVariant, size }), animationClasses, className), variant: shadcnVariant, size: shadcnVariant ? size : undefined, asChild: asChild, ref: composedRef, disabled: isDisabled, onClick: handleClick, ...getLoadingAriaAttributes(currentState === 'loading'), "aria-disabled": isDisabled || undefined, "data-slot": "button", "data-variant": effectiveVariant, "data-state": currentState, "data-size": size || 'default', "data-reduced-motion": prefersReducedMotion || undefined, ...props, children: [shouldShowRipple &&
                ripples.map((r) => (_jsx("span", { className: "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-[ripple_0.6s_ease-out]", style: {
                        left: r.x,
                        top: r.y,
                        width: r.size,
                        height: r.size,
                        backgroundColor: rippleColorValue,
                    }, "aria-hidden": "true" }, r.id))), stateContent, children] }));
});
Button.displayName = 'Button';
export { Button, buttonVariants };
//# sourceMappingURL=button.js.map