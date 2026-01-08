'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Loading Skeleton Components
 *
 * A collection of skeleton loading components for chat applications.
 * Provides visual feedback during content loading.
 */
import {} from 'react';
export function Skeleton({ className = '', width, height, rounded = 'md', animate = true, }) {
    const roundedClass = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    }[rounded];
    const style = {};
    if (width)
        style.width = typeof width === 'number' ? `${width}px` : width;
    if (height)
        style.height = typeof height === 'number' ? `${height}px` : height;
    return (_jsx("div", { className: `bg-muted ${roundedClass} ${animate ? 'animate-pulse' : ''} ${className}`, style: style, "aria-hidden": "true" }));
}
export function TextSkeleton({ lines = 3, className = '', lastLineWidth = '60%', }) {
    return (_jsx("div", { className: `space-y-2 ${className}`, "aria-hidden": "true", children: Array.from({ length: lines }).map((_, i) => (_jsx(Skeleton, { height: 16, width: i === lines - 1 ? lastLineWidth : '100%' }, i))) }));
}
export function MessageSkeleton({ isUser = false, className = '', }) {
    return (_jsx("div", { className: `flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`, "aria-hidden": "true", children: _jsx("div", { className: `max-w-[80%] p-4 ${isUser ? 'rounded-2xl rounded-br-md bg-primary/20' : 'rounded-2xl rounded-bl-md bg-muted'}`, children: _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { height: 14, width: isUser ? 120 : 200 }), _jsx(Skeleton, { height: 14, width: isUser ? 80 : 160 }), !isUser && _jsx(Skeleton, { height: 14, width: 100 })] }) }) }));
}
export function ChatSkeleton({ messageCount = 4, className = '', }) {
    return (_jsxs("div", { className: `space-y-4 ${className}`, role: "status", "aria-label": "Loading chat", children: [Array.from({ length: messageCount }).map((_, i) => (_jsx(MessageSkeleton, { isUser: i % 2 === 0 }, i))), _jsx("span", { className: "sr-only", children: "Loading messages..." })] }));
}
export function AvatarSkeleton({ size = 'md', className = '', }) {
    const sizeMap = {
        sm: 32,
        md: 40,
        lg: 48,
    };
    return (_jsx(Skeleton, { width: sizeMap[size], height: sizeMap[size], rounded: "full", className: className }));
}
export function InputSkeleton({ className = '', showButton = true, }) {
    return (_jsxs("div", { className: `flex gap-2 ${className}`, "aria-hidden": "true", children: [_jsx(Skeleton, { height: 48, className: "flex-1", rounded: "lg" }), showButton && _jsx(Skeleton, { width: 80, height: 48, rounded: "lg" })] }));
}
export function CardSkeleton({ className = '', showHeader = true, showFooter = false, }) {
    return (_jsxs("div", { className: `border rounded-lg p-4 ${className}`, "aria-hidden": "true", children: [showHeader && (_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(AvatarSkeleton, { size: "sm" }), _jsxs("div", { className: "space-y-1", children: [_jsx(Skeleton, { height: 14, width: 120 }), _jsx(Skeleton, { height: 12, width: 80 })] })] })), _jsx(TextSkeleton, { lines: 2 }), showFooter && (_jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [_jsx(Skeleton, { width: 60, height: 32, rounded: "md" }), _jsx(Skeleton, { width: 60, height: 32, rounded: "md" })] }))] }));
}
export function FullChatSkeleton({ className = '' }) {
    return (_jsxs("div", { className: `flex flex-col h-screen max-w-3xl mx-auto ${className}`, role: "status", "aria-label": "Loading chat interface", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Skeleton, { height: 24, width: 150 }), _jsx(Skeleton, { height: 14, width: 100 })] }), _jsx(Skeleton, { width: 80, height: 32, rounded: "md" })] }), _jsx("div", { className: "flex-1 overflow-hidden p-4", children: _jsx(ChatSkeleton, { messageCount: 4 }) }), _jsx("div", { className: "p-4 border-t", children: _jsx(InputSkeleton, {}) }), _jsx("span", { className: "sr-only", children: "Loading chat interface..." })] }));
}
export function SkeletonContainer({ loading, skeleton, children, className = '', fadeIn = true, }) {
    if (loading) {
        return _jsx(_Fragment, { children: skeleton });
    }
    if (fadeIn) {
        return _jsx("div", { className: `animate-fade-in ${className}`, children: children });
    }
    return _jsx(_Fragment, { children: children });
}
// ============================================================================
// Exports
// ============================================================================
export default Skeleton;
//# sourceMappingURL=Skeleton.js.map