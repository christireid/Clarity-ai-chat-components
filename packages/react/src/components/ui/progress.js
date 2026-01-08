import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Progress Indicators
 *
 * Linear and circular progress indicators with determinate and indeterminate states.
 * Used for loading states, file uploads, and streaming progress.
 *
 * @enhanced Framer Motion 12: Spring-based progress animations for smoother fills
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { ANIMATION_DURATION, EASING_FRAMER, DURATION_SECONDS as durations, } from '../../animations';
import { useReducedMotion } from '@clarity-chat/primitives';
import { getSpring } from '../../animations/spring-presets';
import { Skeleton } from './skeleton';
export const Progress = ({ value, size = 'md', variant = 'primary', showLabel = false, label, className, }) => {
    const prefersReducedMotion = useReducedMotion();
    const isIndeterminate = value === undefined;
    const percentage = Math.min(Math.max(value ?? 0, 0), 100);
    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };
    const colorClasses = {
        primary: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        destructive: 'bg-destructive',
    };
    return (_jsxs("div", { className: cn('space-y-1.5', className), children: [(showLabel || label) && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground/90", children: label || 'Loading...' }), !isIndeterminate && showLabel && (_jsxs("span", { className: "text-muted-foreground/90 font-semibold", children: [percentage, "%"] }))] })), _jsx("div", { className: cn('relative w-full overflow-hidden rounded-full bg-muted/60', sizeClasses[size]), children: isIndeterminate ? (
                // Indeterminate animation
                _jsx(motion.div, { className: cn('absolute inset-y-0 rounded-full', colorClasses[variant]), style: { width: '40%' }, animate: {
                        x: prefersReducedMotion ? '0%' : ['-100%', '250%'],
                    }, transition: {
                        duration: durations.slower,
                        repeat: prefersReducedMotion ? 0 : Infinity,
                        ease: 'linear',
                    } })) : (
                // Determinate progress
                _jsx(motion.div, { className: cn('h-full rounded-full', colorClasses[variant]), initial: { width: 0 }, animate: { width: `${percentage}%` }, transition: getSpring('gentle', prefersReducedMotion) })) })] }));
};
export const CircularProgress = ({ value, size = 48, strokeWidth = 4, variant = 'primary', showLabel = false, className, }) => {
    const prefersReducedMotion = useReducedMotion();
    const isIndeterminate = value === undefined;
    const percentage = Math.min(Math.max(value ?? 0, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    const colorClasses = {
        primary: 'stroke-primary',
        success: 'stroke-success',
        warning: 'stroke-warning',
        destructive: 'stroke-destructive',
    };
    return (_jsxs("div", { className: cn('relative inline-flex', className), children: [_jsxs("svg", { width: size, height: size, className: "transform -rotate-90", children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: "currentColor", strokeWidth: strokeWidth, className: "text-muted opacity-20" }), isIndeterminate ? (
                    // Indeterminate spinner
                    _jsx(motion.circle, { cx: size / 2, cy: size / 2, r: radius, fill: "none", strokeWidth: strokeWidth, strokeLinecap: "round", strokeDasharray: circumference, strokeDashoffset: circumference * 0.75, className: colorClasses[variant], animate: { rotate: prefersReducedMotion ? 0 : 360 }, transition: {
                            duration: durations.slower,
                            repeat: prefersReducedMotion ? 0 : Infinity,
                            ease: 'linear',
                        }, style: { transformOrigin: 'center' } })) : (
                    // Determinate progress
                    _jsx(motion.circle, { cx: size / 2, cy: size / 2, r: radius, fill: "none", strokeWidth: strokeWidth, strokeLinecap: "round", strokeDasharray: circumference, strokeDashoffset: circumference, className: colorClasses[variant], animate: { strokeDashoffset: offset }, transition: prefersReducedMotion
                            ? { duration: durations.fast, ease: 'linear' }
                            : {
                                duration: ANIMATION_DURATION.slow / 1000,
                                ease: EASING_FRAMER.out,
                            } }))] }), !isIndeterminate && showLabel && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("span", { className: "text-xs font-semibold", children: [Math.round(percentage), "%"] }) }))] }));
};
export const StreamingProgress = ({ label = 'Streaming', size = 'md', className, }) => {
    const prefersReducedMotion = useReducedMotion();
    const sizeClasses = {
        sm: 'gap-1',
        md: 'gap-1.5',
        lg: 'gap-2',
    };
    const dotSizeClasses = {
        sm: 'w-1 h-1',
        md: 'w-1.5 h-1.5',
        lg: 'w-2 h-2',
    };
    return (_jsxs("div", { className: cn('flex items-center gap-2.5', className), children: [label && (_jsx("span", { className: "text-sm text-muted-foreground/90", children: label })), _jsx("div", { className: cn('flex', sizeClasses[size]), children: [0, 1, 2].map((i) => (_jsx(motion.div, { className: cn('rounded-full bg-current', dotSizeClasses[size]), animate: prefersReducedMotion
                        ? {}
                        : {
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1, 0.8],
                        }, transition: {
                        duration: durations.slower,
                        repeat: prefersReducedMotion ? 0 : Infinity,
                        delay: i * 0.2,
                        ease: EASING_FRAMER.inOut,
                    } }, i))) })] }));
};
export const UploadProgress = ({ fileName, value, fileSize, uploadedSize, onCancel, className, }) => {
    const formatBytes = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };
    const percentage = Math.min(Math.max(value, 0), 100);
    const isComplete = percentage === 100;
    return (_jsxs("div", { className: cn('space-y-2.5', className), children: [_jsxs("div", { className: "flex items-center justify-between gap-3.5", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-semibold truncate", children: fileName }), fileSize !== undefined && uploadedSize !== undefined && (_jsxs("div", { className: "text-xs text-muted-foreground/90", children: [formatBytes(uploadedSize), " / ", formatBytes(fileSize)] }))] }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsxs("span", { className: "text-sm text-muted-foreground/90 font-semibold", children: [percentage, "%"] }), !isComplete && onCancel && (_jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: onCancel, className: "text-muted-foreground hover:text-foreground transition-colors", "aria-label": "Cancel upload", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }) }))] })] }), _jsx(Progress, { value: percentage, variant: isComplete ? 'success' : 'primary' })] }));
};
/**
 * Skeleton Progress - Shows loading skeleton with animated progress
 */
export const SkeletonProgress = ({ className, }) => {
    return (_jsxs("div", { className: cn('space-y-2.5', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Skeleton, { width: 128, height: 16, rounded: "md" }), _jsx(Skeleton, { width: 48, height: 16, rounded: "md" })] }), _jsx(Progress, {})] }));
};
//# sourceMappingURL=progress.js.map