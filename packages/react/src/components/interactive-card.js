import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Interactive Card Component
 *
 * Enhanced card component with hover states, focus rings, and visual transitions.
 * Demonstrates best practices for interactive elements.
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { INTERACTION_VARIANTS } from '../animations';
/**
 * Card with enhanced interactivity
 */
export const InteractiveCard = React.memo(React.forwardRef(function InteractiveCard({ interactive = false, selected = false, disabled = false, hoverIntensity = 'medium', showFocusRing = true, showRipple = false, onCardClick, className, children, ...props }, ref) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [ripples, setRipples] = React.useState([]);
    const handleClick = (e) => {
        if (disabled)
            return;
        if (showRipple) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const id = Date.now();
            setRipples((prev) => [...prev, { x, y, id }]);
            setTimeout(() => {
                setRipples((prev) => prev.filter((r) => r.id !== id));
            }, 600);
        }
        onCardClick?.();
    };
    const hoverVariants = {
        none: {},
        subtle: {
            y: -2,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
        },
        medium: {
            y: -4,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
        },
        strong: {
            y: -8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
        },
    };
    const Component = interactive || onCardClick ? motion.div : motion.div;
    return (_jsxs(Component, { ref: ref, className: cn('relative overflow-hidden rounded-xl border-2 bg-card transition-all duration-200 shadow-sm', interactive && 'cursor-pointer hover:shadow-md', disabled && 'opacity-50 cursor-not-allowed', selected && 'ring-2 ring-primary ring-offset-2 shadow-md', showFocusRing &&
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className), tabIndex: interactive && !disabled ? 0 : undefined, role: interactive ? 'button' : undefined, "aria-disabled": disabled, "aria-pressed": selected, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), onClick: handleClick, onKeyDown: (e) => {
            if (interactive &&
                !disabled &&
                (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onCardClick?.();
            }
        }, animate: isHovered && !disabled && interactive
            ? {
                ...hoverVariants[hoverIntensity],
                scale: hoverIntensity !== 'none' ? 1.02 : 1,
            }
            : { scale: 1 }, whileTap: !disabled && interactive
            ? { scale: 0.98, transition: { duration: 0.1 } }
            : {}, ...props, children: [showRipple && (_jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: ripples.map((ripple) => (_jsx(motion.div, { initial: { scale: 0, opacity: 0.5 }, animate: { scale: 4, opacity: 0 }, transition: { duration: 0.6 }, className: "absolute w-20 h-20 -ml-10 -mt-10 rounded-full bg-primary/20", style: { left: ripple.x, top: ripple.y } }, ripple.id))) })), children, selected && (_jsx(motion.div, { initial: { scaleX: 0 }, animate: { scaleX: 1 }, className: "absolute top-0 left-0 right-0 h-1 bg-primary origin-left" }))] }));
}));
InteractiveCard.displayName = 'InteractiveCard';
export const InteractiveButton = React.forwardRef(({ variant = 'default', size = 'md', loading = false, icon, iconRight, disabled, className, children, ...props }, ref) => {
    const variantClasses = {
        default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        success: 'bg-success text-success-foreground hover:bg-success/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
    };
    const sizeClasses = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
    };
    return (_jsxs(motion.button, { ref: ref, whileHover: !disabled && !loading ? INTERACTION_VARIANTS.button.hover : {}, whileTap: !disabled && !loading ? INTERACTION_VARIANTS.button.tap : {}, transition: INTERACTION_VARIANTS.button.transition, disabled: disabled || loading, className: cn('inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 shadow-sm', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', 'disabled:opacity-50 disabled:pointer-events-none', 'hover:shadow-md hover:-translate-y-0.5', variantClasses[variant], sizeClasses[size], className), ...props, children: [loading && (_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: 'linear' }, className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full" })), !loading && icon, children, !loading && iconRight] }));
});
InteractiveButton.displayName = 'InteractiveButton';
export const InteractiveListItem = ({ selected = false, disabled = false, icon, title, description, badge, onClick, className, }) => {
    return (_jsxs(motion.div, { whileHover: !disabled ? { x: 4, backgroundColor: 'hsl(var(--accent) / 0.5)' } : {}, whileTap: !disabled ? { scale: 0.98 } : {}, onClick: !disabled ? onClick : undefined, className: cn('flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', 'hover:bg-accent/50 hover:shadow-sm', selected && 'bg-accent shadow-sm', disabled && 'opacity-50 cursor-not-allowed', className), tabIndex: !disabled ? 0 : undefined, role: "button", "aria-selected": selected, "aria-disabled": disabled, children: [icon && (_jsx("div", { className: "flex-shrink-0 text-muted-foreground", children: icon })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium truncate", children: title }), badge] }), description && (_jsx("p", { className: "text-sm text-muted-foreground truncate", children: description }))] }), selected && (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, className: "flex-shrink-0 w-2 h-2 rounded-full bg-primary" }))] }));
};
InteractiveListItem.displayName = 'InteractiveListItem';
//# sourceMappingURL=interactive-card.js.map