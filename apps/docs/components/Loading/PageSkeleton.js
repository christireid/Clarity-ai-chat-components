'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Skeleton, SkeletonText, SkeletonCard } from '@clarity-chat/react';
/**
 * Page-level skeleton loader for documentation pages
 * Shows loading state while content is being fetched
 */
export function PageSkeleton() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsxs("div", { className: "flex gap-2 mb-3", children: [_jsx(Skeleton, { width: 80, height: 24, rounded: "md" }), _jsx(Skeleton, { width: 60, height: 24, rounded: "md" })] }), _jsx(Skeleton, { width: "60%", height: 48, rounded: "lg", className: "mb-4" }), _jsx(SkeletonText, { lines: 2, className: "max-w-3xl" })] }), _jsxs("section", { className: "docs-section", children: [_jsx(Skeleton, { width: 200, height: 32, rounded: "md", className: "mb-4" }), _jsx(SkeletonText, { lines: 4, className: "mb-6" }), _jsx("div", { className: "rounded-xl border overflow-hidden", children: _jsx(Skeleton, { width: "100%", height: 300, rounded: "none" }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx(Skeleton, { width: 180, height: 32, rounded: "md", className: "mb-4" }), _jsx(SkeletonText, { lines: 3, className: "mb-6" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(SkeletonCard, { showImage: false, bodyLines: 2, showFooter: false }), _jsx(SkeletonCard, { showImage: false, bodyLines: 2, showFooter: false })] })] })] }));
}
/**
 * Component documentation skeleton
 * Specialized for component reference pages
 */
export function ComponentPageSkeleton() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsxs("div", { className: "flex gap-2 mb-3", children: [_jsx(Skeleton, { width: 90, height: 22, rounded: "full" }), _jsx(Skeleton, { width: 70, height: 22, rounded: "full" })] }), _jsx(Skeleton, { width: "50%", height: 48, rounded: "lg", className: "mb-4" }), _jsx(SkeletonText, { lines: 2, className: "max-w-3xl" })] }), _jsxs("section", { className: "docs-section", children: [_jsx(Skeleton, { width: 240, height: 32, rounded: "md", className: "mb-4" }), _jsx(SkeletonText, { lines: 2, className: "mb-6" }), _jsx("div", { className: "rounded-xl border overflow-hidden", children: _jsx(Skeleton, { width: "100%", height: 500, rounded: "none" }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx(Skeleton, { width: 120, height: 32, rounded: "md", className: "mb-4" }), _jsx("div", { className: "space-y-2", children: [1, 2, 3, 4, 5].map((i) => (_jsxs("div", { className: "flex items-center gap-4 p-4 border rounded-lg", children: [_jsx(Skeleton, { width: 120, height: 20 }), _jsx(Skeleton, { width: 200, height: 20, className: "flex-1" }), _jsx(Skeleton, { width: 80, height: 20 })] }, i))) })] })] }));
}
/**
 * Search results skeleton
 * Shows loading state for search/command palette
 */
export function SearchResultsSkeleton() {
    return (_jsx("div", { className: "space-y-1 p-2", children: [1, 2, 3, 4, 5].map((i) => (_jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 rounded-lg", children: [_jsx(Skeleton, { width: 20, height: 20, rounded: "sm" }), _jsxs("div", { className: "flex-1", children: [_jsx(Skeleton, { width: "70%", height: 16, className: "mb-2" }), _jsx(Skeleton, { width: "90%", height: 14 })] }), _jsx(Skeleton, { width: 40, height: 20, rounded: "md" })] }, i))) }));
}
//# sourceMappingURL=PageSkeleton.js.map