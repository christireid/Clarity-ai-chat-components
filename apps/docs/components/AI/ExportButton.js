'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Download, Copy, FileText, FileCode, File, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { exportAsMarkdown, exportAsJSON, exportAsText, downloadConversation, copyToClipboard, getExportStats, } from '@/lib/ai/conversationExport';
export function ExportButton({ messages, metadata, className, variant = 'full', }) {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const stats = getExportStats(messages);
    const handleExport = async (format) => {
        setDownloading(true);
        try {
            let content;
            switch (format) {
                case 'markdown':
                    content = exportAsMarkdown(messages, metadata);
                    break;
                case 'json':
                    content = exportAsJSON(messages, metadata);
                    break;
                case 'text':
                    content = exportAsText(messages, metadata);
                    break;
            }
            downloadConversation(content, format);
            // Show success briefly
            setTimeout(() => setDownloading(false), 500);
            setTimeout(() => setShowMenu(false), 1000);
        }
        catch (error) {
            console.error('Export failed:', error);
            setDownloading(false);
        }
    };
    const handleCopy = async () => {
        const content = exportAsMarkdown(messages, metadata);
        const success = await copyToClipboard(content);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            setTimeout(() => setShowMenu(false), 1500);
        }
    };
    // Don't show if no messages
    if (messages.length === 0) {
        return null;
    }
    if (variant === 'compact') {
        return (_jsxs("div", { className: cn('relative', className), children: [_jsx("button", { onClick: () => setShowMenu(!showMenu), disabled: downloading, className: cn('p-2 rounded-md transition-all duration-200', 'hover:bg-accent hover:text-accent-foreground', 'disabled:opacity-50 disabled:cursor-not-allowed', 'text-muted-foreground'), "aria-label": "Export conversation", children: _jsx(Download, { className: "w-4 h-4" }) }), _jsx(AnimatePresence, { children: showMenu && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.95, y: -10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -10 }, className: cn('absolute right-0 top-full mt-2 z-50', 'bg-popover border border-border rounded-md shadow-lg', 'min-w-[200px] p-2'), children: _jsx(ExportMenu, { onExport: handleExport, onCopy: handleCopy, copied: copied, downloading: downloading, stats: stats }) })) })] }));
    }
    // Full variant
    return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Export Conversation" }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [stats.totalMessages, " messages"] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("button", { onClick: () => handleExport('markdown'), disabled: downloading, className: cn('flex items-center gap-2 px-3 py-2 rounded-md', 'bg-secondary text-secondary-foreground', 'hover:bg-secondary/80', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors text-sm'), children: [_jsx(FileText, { className: "w-4 h-4" }), "Markdown"] }), _jsxs("button", { onClick: () => handleExport('json'), disabled: downloading, className: cn('flex items-center gap-2 px-3 py-2 rounded-md', 'bg-secondary text-secondary-foreground', 'hover:bg-secondary/80', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors text-sm'), children: [_jsx(FileCode, { className: "w-4 h-4" }), "JSON"] }), _jsxs("button", { onClick: () => handleExport('text'), disabled: downloading, className: cn('flex items-center gap-2 px-3 py-2 rounded-md', 'bg-secondary text-secondary-foreground', 'hover:bg-secondary/80', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors text-sm'), children: [_jsx(File, { className: "w-4 h-4" }), "Text"] }), _jsx("button", { onClick: handleCopy, disabled: downloading, className: cn('flex items-center gap-2 px-3 py-2 rounded-md', 'bg-secondary text-secondary-foreground', 'hover:bg-secondary/80', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors text-sm'), children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-4 h-4" }), "Copied!"] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "w-4 h-4" }), "Copy"] })) })] }), _jsxs("div", { className: "text-xs text-muted-foreground space-y-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "User messages:" }), _jsx("span", { children: stats.userMessages })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Assistant messages:" }), _jsx("span", { children: stats.assistantMessages })] }), stats.sourcesCount > 0 && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Sources cited:" }), _jsx("span", { children: stats.sourcesCount })] })), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Estimated tokens:" }), _jsx("span", { children: stats.estimatedTokens.toLocaleString() })] })] })] }));
}
function ExportMenu({ onExport, onCopy, copied, downloading, stats, }) {
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "px-2 py-1 text-xs font-medium text-muted-foreground", children: "Export as..." }), _jsxs("button", { onClick: () => onExport('markdown'), disabled: downloading, className: cn('w-full flex items-center gap-2 px-2 py-1.5 rounded', 'hover:bg-accent hover:text-accent-foreground', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors text-sm'), children: [_jsx(FileText, { className: "w-4 h-4" }), "Markdown (.md)"] }), _jsxs("button", { onClick: () => onExport('json'), disabled: downloading, className: cn('w-full flex items-center gap-2 px-2 py-1.5 rounded', 'hover:bg-accent hover:text-accent-foreground', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors text-sm'), children: [_jsx(FileCode, { className: "w-4 h-4" }), "JSON (.json)"] }), _jsxs("button", { onClick: () => onExport('text'), disabled: downloading, className: cn('w-full flex items-center gap-2 px-2 py-1.5 rounded', 'hover:bg-accent hover:text-accent-foreground', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors text-sm'), children: [_jsx(File, { className: "w-4 h-4" }), "Plain Text (.txt)"] }), _jsx("div", { className: "h-px bg-border my-1" }), _jsx("button", { onClick: onCopy, disabled: downloading, className: cn('w-full flex items-center gap-2 px-2 py-1.5 rounded', 'hover:bg-accent hover:text-accent-foreground', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors text-sm'), children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-4 h-4" }), "Copied to clipboard!"] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "w-4 h-4" }), "Copy to clipboard"] })) }), _jsxs("div", { className: "px-2 py-1 text-xs text-muted-foreground border-t border-border mt-1", children: [stats.totalMessages, " messages \u2022 ~", stats.estimatedTokens.toLocaleString(), " tokens"] })] }));
}
//# sourceMappingURL=ExportButton.js.map