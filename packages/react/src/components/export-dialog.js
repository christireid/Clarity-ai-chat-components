'use client';
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, Button, Badge, Input, cn, } from '@clarity-chat/primitives';
export function ExportDialog({ open, onOpenChange, onExport, resourceType, resourceName, className, }) {
    const [format, setFormat] = React.useState('pdf');
    const [options, setOptions] = React.useState({
        includeMetadata: true,
        includeImages: true,
        includeAttachments: false,
    });
    const [exporting, setExporting] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const formats = [
        {
            value: 'pdf',
            label: 'PDF',
            icon: '📕',
            description: 'Portable document format',
        },
        {
            value: 'docx',
            label: 'Word',
            icon: '📄',
            description: 'Microsoft Word document',
        },
        {
            value: 'markdown',
            label: 'Markdown',
            icon: '📝',
            description: 'Plain text with formatting',
        },
        {
            value: 'json',
            label: 'JSON',
            icon: '📊',
            description: 'Raw data format',
        },
        {
            value: 'html',
            label: 'HTML',
            icon: '🌐',
            description: 'Web page format',
        },
    ];
    const handleExport = async () => {
        setExporting(true);
        setProgress(0);
        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 10, 90));
            }, 200);
            await onExport({
                format,
                ...options,
            });
            clearInterval(progressInterval);
            setProgress(100);
            // Close after brief delay to show completion
            setTimeout(() => {
                onOpenChange(false);
                setProgress(0);
            }, 500);
        }
        catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
        finally {
            setExporting(false);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { size: "xl", animation: "scale", className: className, children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { children: ["Export ", resourceType] }), _jsxs(DialogDescription, { children: ["Export \"", resourceName, "\" in your preferred format"] })] }), _jsxs(DialogBody, { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Select Format" }), _jsx("div", { className: "grid grid-cols-5 gap-2", children: formats.map((fmt, index) => (_jsxs(motion.button, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: index * 0.05 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setFormat(fmt.value), className: cn('flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-150 ease-out', format === fmt.value
                                            ? 'border-primary bg-primary/5 shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]'
                                            : 'border-border/50 hover:border-primary/50'), children: [_jsx(motion.span, { className: "text-3xl", animate: format === fmt.value ? { scale: [1, 1.2, 1] } : {}, transition: { duration: 0.3 }, children: fmt.icon }), _jsx("span", { className: "text-xs font-medium", children: fmt.label })] }, fmt.value))) }), _jsx(motion.p, { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, className: "text-xs text-muted-foreground mt-2", children: formats.find((f) => f.value === format)?.description }, format)] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Export Options" }), _jsx("div", { className: "space-y-2", children: [
                                        {
                                            key: 'includeMetadata',
                                            label: 'Include Metadata',
                                            description: 'Timestamps, authors, etc.',
                                        },
                                        {
                                            key: 'includeImages',
                                            label: 'Include Images',
                                            description: 'Embed images in export',
                                        },
                                        {
                                            key: 'includeAttachments',
                                            label: 'Include Attachments',
                                            description: 'Separate attachment files',
                                        },
                                    ].map(({ key, label, description }, index) => (_jsxs(motion.label, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.2, delay: 0.3 + index * 0.05 }, className: "flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors", children: [_jsx("input", { type: "checkbox", checked: options[key], onChange: (e) => setOptions({ ...options, [key]: e.target.checked }), className: "w-4 h-4 mt-1 accent-primary cursor-pointer" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: label }), _jsx("p", { className: "text-xs text-muted-foreground", children: description })] })] }, key))) })] }), resourceType === 'chat' && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.5 }, children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Date Range (Optional)" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "From" }), _jsx(Input, { type: "date" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "To" }), _jsx(Input, { type: "date" })] })] })] })), _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.2, delay: 0.6 }, className: "p-4 bg-muted/50 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(motion.span, { initial: { scale: 0.8, rotate: -15 }, animate: { scale: 1, rotate: 0 }, transition: { type: 'spring', stiffness: 200, damping: 15 }, className: "text-4xl", children: formats.find((f) => f.value === format)?.icon }, format), _jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "text-sm font-medium", children: [resourceName, ".", format] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Estimated size: ~", Math.ceil(Math.random() * 500 + 100), " KB"] })] }), _jsx(Badge, { variant: "outline", children: "Ready" })] }) }), exporting && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "space-y-2 overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { children: "Exporting..." }), _jsxs(motion.span, { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 }, children: [progress, "%"] }, progress)] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${progress}%` }, transition: { duration: 0.3, ease: 'easeOut' }, className: "h-full bg-primary rounded-full" }) })] })), _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.7 }, className: "p-3 bg-[hsl(var(--info))]/10 border border-[hsl(var(--info))]/20 rounded-lg shadow-[0_1px_3px_rgba(15,23,42,0.1)]", children: _jsxs("p", { className: "text-xs text-muted-foreground", children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "Tip:" }), " PDF and DOCX formats preserve formatting best. Markdown is great for editing later."] }) })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: exporting, children: "Cancel" }), _jsx(Button, { onClick: handleExport, disabled: exporting, state: exporting ? 'loading' : 'idle', className: "flex-1", children: exporting ? 'Exporting...' : `Export as ${format.toUpperCase()}` })] })] }) }));
}
ExportDialog.displayName = 'ExportDialog';
//# sourceMappingURL=export-dialog.js.map