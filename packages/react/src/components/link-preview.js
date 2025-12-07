'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, cn } from '@clarity-chat/primitives';
export function LinkPreview({ metadata, onClick, onRemove, loading = false, className, }) {
    const [imageError, setImageError] = React.useState(false);
    const getDomain = (url) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        }
        catch {
            return url;
        }
    };
    if (loading) {
        return (_jsx(Card, { className: cn('p-4 animate-pulse shadow-sm', className), children: _jsxs("div", { className: "flex gap-3.5", children: [_jsx("div", { className: "w-24 h-24 bg-muted/60 rounded" }), _jsxs("div", { className: "flex-1 space-y-2.5", children: [_jsx("div", { className: "h-4 bg-muted/60 rounded w-3/4" }), _jsx("div", { className: "h-3 bg-muted/60 rounded w-full" }), _jsx("div", { className: "h-3 bg-muted/60 rounded w-2/3" })] })] }) }));
    }
    return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: className, children: _jsxs(Card, { className: cn('group relative overflow-hidden transition-all shadow-sm', onClick && 'cursor-pointer hover:shadow-lg'), onClick: onClick, children: [onRemove && (_jsx("button", { onClick: (e) => {
                        e.stopPropagation();
                        onRemove();
                    }, className: "absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground", children: "\u2715" })), _jsxs("div", { className: "flex gap-3.5 p-4", children: [metadata.image && !imageError ? (_jsx("div", { className: "flex-shrink-0 w-24 h-24 rounded overflow-hidden bg-muted", children: _jsx("img", { src: metadata.image, alt: metadata.title || 'Link preview', className: "w-full h-full object-cover", onError: () => setImageError(true) }) })) : (_jsx("div", { className: "flex-shrink-0 w-24 h-24 rounded bg-muted flex items-center justify-center text-4xl", children: "\uD83D\uDD17" })), _jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [metadata.favicon && (_jsx("img", { src: metadata.favicon, alt: "", className: "w-4 h-4", onError: (e) => (e.currentTarget.style.display = 'none') })), _jsx("p", { className: "text-xs text-muted-foreground/90 truncate", children: metadata.siteName || getDomain(metadata.url) })] }), metadata.title && (_jsx("h4", { className: "font-bold text-sm line-clamp-2 leading-tight", children: metadata.title })), metadata.description && (_jsx("p", { className: "text-xs text-muted-foreground/90 line-clamp-2", children: metadata.description })), _jsx("div", { className: "flex items-center gap-2 pt-1.5", children: _jsxs(Badge, { variant: "outline", className: "text-xs", children: ["\uD83D\uDD17 ", getDomain(metadata.url)] }) })] })] }), onClick && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" }))] }) }));
}
LinkPreview.displayName = 'LinkPreview';
// Hook for fetching link metadata
export function useLinkPreview() {
    const [loading, setLoading] = React.useState(false);
    const [metadata, setMetadata] = React.useState(null);
    const [error, setError] = React.useState(null);
    const fetchMetadata = React.useCallback(async (url) => {
        setLoading(true);
        setError(null);
        try {
            // In a real implementation, this would call your backend API
            // which would fetch the URL and extract metadata
            // For now, return mock data
            await new Promise((resolve) => setTimeout(resolve, 500));
            const mockMetadata = {
                url,
                title: 'Example Website Title',
                description: 'This is a description of the linked content that provides context.',
                image: 'https://via.placeholder.com/400x300',
                siteName: 'Example Site',
                favicon: 'https://via.placeholder.com/16x16',
            };
            setMetadata(mockMetadata);
            return mockMetadata;
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to fetch link metadata';
            setError(errorMsg);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const reset = React.useCallback(() => {
        setMetadata(null);
        setError(null);
        setLoading(false);
    }, []);
    return {
        loading,
        metadata,
        error,
        fetchMetadata,
        reset,
    };
}
export function InlineLink({ url, onPreview, children, className, }) {
    const [showPreview, setShowPreview] = React.useState(false);
    const { metadata, loading, fetchMetadata } = useLinkPreview();
    const handleMouseEnter = () => {
        if (!metadata && !loading) {
            fetchMetadata(url);
        }
        setShowPreview(true);
    };
    const handleMouseLeave = () => {
        setShowPreview(false);
    };
    return (_jsxs("span", { className: "relative inline-block", children: [_jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: cn('text-primary hover:underline cursor-pointer', className), onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onClick: (e) => {
                    if (onPreview) {
                        e.preventDefault();
                        onPreview(url);
                    }
                }, children: children || url }), showPreview && metadata && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "absolute bottom-full left-0 mb-2 w-80 z-50", onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: _jsx(LinkPreview, { metadata: metadata, onClick: () => window.open(url, '_blank') }) }))] }));
}
InlineLink.displayName = 'InlineLink';
//# sourceMappingURL=link-preview.js.map