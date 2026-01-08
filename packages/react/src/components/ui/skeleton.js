import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Skeleton Loaders
 *
 * Loading placeholder components with shimmer animation effect.
 * Used to show content structure while data is loading.
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn, useReducedMotion } from '@clarity-chat/primitives';
import { createPulseAnimation, createShimmerAnimation, } from '../../animations/utils';
/**
 * Base skeleton component with loading animation
 */
export const Skeleton = ({ variant = 'shimmer', width, height, rounded = 'md', className, style, ...props }) => {
    // Accessibility: Respect user's reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };
    // Determine effective variant based on motion preferences
    const effectiveVariant = prefersReducedMotion ? 'none' : variant;
    // Shimmer gradient background (only when not reduced motion)
    const shimmerStyle = effectiveVariant === 'shimmer'
        ? {
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            backgroundSize: '200% 100%',
        }
        : {};
    const variants = effectiveVariant === 'pulse'
        ? createPulseAnimation()
        : effectiveVariant === 'shimmer'
            ? createShimmerAnimation()
            : undefined;
    const baseStyle = {
        width: width ?? '100%',
        height: height ?? '1rem',
        ...shimmerStyle,
        ...style,
    };
    if (effectiveVariant === 'none') {
        return (_jsx(motion.div, { className: cn('bg-muted/60 backdrop-blur-sm', roundedClasses[rounded], className), style: baseStyle, ...props }));
    }
    // Extract ARIA role separately to ensure it's passed correctly to motion.div.
    // Framer Motion's HTMLMotionProps can have type conflicts with standard HTML attributes
    // when spread together. Explicit extraction ensures proper typing and avoids
    // rendering role="" when undefined.
    const { role, ...restProps } = props;
    return (_jsx(motion.div, { className: cn('bg-muted/60 backdrop-blur-sm', roundedClasses[rounded], className), style: baseStyle, variants: variants, initial: "initial", animate: "animate", ...(role !== undefined && { role }), ...restProps }));
};
export const SkeletonText = ({ lines = 3, lineHeight = 16, gap = 8, lastLineWidth = 70, variant = 'shimmer', className, }) => {
    return (_jsx("div", { className: cn('space-y-2.5', className), style: { gap: `${gap}px` }, children: Array.from({ length: lines }).map((_, index) => (_jsx(Skeleton, { variant: variant, height: lineHeight, width: index === lines - 1 ? `${lastLineWidth}%` : '100%', rounded: "sm" }, index))) }));
};
export const SkeletonAvatar = ({ size = 40, variant = 'shimmer', className, }) => {
    return (_jsx(Skeleton, { variant: variant, width: size, height: size, rounded: "full", className: className }));
};
export const SkeletonMessage = ({ role = 'assistant', showAvatar = true, lines = 3, variant = 'shimmer', className, }) => {
    const isUser = role === 'user';
    return (_jsxs("div", { className: cn('flex gap-3.5 p-4', isUser && 'flex-row-reverse', className), children: [showAvatar && _jsx(SkeletonAvatar, { size: 32, variant: variant }), _jsx("div", { className: cn('flex-1', isUser && 'flex justify-end'), children: _jsx("div", { className: cn('max-w-[80%]', isUser && 'items-end'), children: _jsx(SkeletonText, { lines: lines, variant: variant, lastLineWidth: 60 }) }) })] }));
};
export const SkeletonCard = ({ showImage = true, imageHeight = 200, showHeader = true, bodyLines = 3, showFooter = true, variant = 'shimmer', className, }) => {
    return (_jsxs("div", { className: cn('rounded-lg border border-border/40 bg-card overflow-hidden shadow-sm', className), children: [showImage && (_jsx(Skeleton, { variant: variant, height: imageHeight, rounded: "none" })), _jsxs("div", { className: "p-6 space-y-4", children: [showHeader && (_jsxs("div", { className: "space-y-2.5", children: [_jsx(Skeleton, { variant: variant, width: "60%", height: 24, rounded: "sm" }), _jsx(Skeleton, { variant: variant, width: "40%", height: 16, rounded: "sm" })] })), _jsx(SkeletonText, { lines: bodyLines, variant: variant }), showFooter && (_jsxs("div", { className: "flex gap-2.5 pt-2", children: [_jsx(Skeleton, { variant: variant, width: 80, height: 36, rounded: "md" }), _jsx(Skeleton, { variant: variant, width: 80, height: 36, rounded: "md" })] }))] })] }));
};
export const SkeletonList = ({ count = 3, showAvatar = true, lines = 2, variant = 'shimmer', className, }) => {
    return (_jsx("div", { className: cn('space-y-4', className), children: Array.from({ length: count }).map((_, index) => (_jsxs("div", { className: "flex gap-3.5 items-start", children: [showAvatar && _jsx(SkeletonAvatar, { size: 40, variant: variant }), _jsx("div", { className: "flex-1", children: _jsx(SkeletonText, { lines: lines, variant: variant, lastLineWidth: 80 }) })] }, index))) }));
};
export const SkeletonButton = ({ width = 100, height = 40, variant = 'shimmer', className, }) => {
    return (_jsx(Skeleton, { variant: variant, width: width, height: height, rounded: "md", className: className }));
};
export const SkeletonInput = ({ width = '100%', height = 40, showLabel = true, variant = 'shimmer', className, }) => {
    return (_jsxs("div", { className: cn('space-y-2.5', className), children: [showLabel && (_jsx(Skeleton, { variant: variant, width: "30%", height: 16, rounded: "sm" })), _jsx(Skeleton, { variant: variant, width: width, height: height, rounded: "md" })] }));
};
/**
 * Skeleton for chat window
 */
export const SkeletonChatWindow = ({ variant = 'shimmer' }) => {
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center gap-3 p-4 border-b", children: [_jsx(SkeletonAvatar, { size: 40, variant: variant }), _jsxs("div", { className: "flex-1", children: [_jsx(Skeleton, { variant: variant, width: "40%", height: 20, rounded: "sm" }), _jsx(Skeleton, { variant: variant, width: "60%", height: 14, rounded: "sm", className: "mt-2" })] })] }), _jsxs("div", { className: "flex-1 overflow-hidden p-4 space-y-4", children: [_jsx(SkeletonMessage, { role: "user", lines: 2, variant: variant }), _jsx(SkeletonMessage, { role: "assistant", lines: 4, variant: variant }), _jsx(SkeletonMessage, { role: "user", lines: 1, variant: variant }), _jsx(SkeletonMessage, { role: "assistant", lines: 3, variant: variant })] }), _jsx("div", { className: "p-4 border-t", children: _jsxs("div", { className: "flex gap-2.5", children: [_jsx(Skeleton, { variant: variant, height: 40, className: "flex-1", rounded: "md" }), _jsx(Skeleton, { variant: variant, width: 40, height: 40, rounded: "md" })] }) })] }));
};
// Add displayNames for better debugging and React DevTools
Skeleton.displayName = 'Skeleton';
SkeletonText.displayName = 'SkeletonText';
SkeletonAvatar.displayName = 'SkeletonAvatar';
SkeletonMessage.displayName = 'SkeletonMessage';
SkeletonCard.displayName = 'SkeletonCard';
SkeletonList.displayName = 'SkeletonList';
SkeletonButton.displayName = 'SkeletonButton';
SkeletonInput.displayName = 'SkeletonInput';
SkeletonChatWindow.displayName = 'SkeletonChatWindow';
//# sourceMappingURL=skeleton.js.map