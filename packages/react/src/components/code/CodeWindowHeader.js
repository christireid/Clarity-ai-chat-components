import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Button, cn } from '@clarity-chat/primitives';
import { CopyButton } from '../message/copy-button';
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon, WrapTextIcon, } from '../ui/icons';
export function CodeWindowHeader({ language, filename, codeString, isFolded = false, enableFolding = false, onToggleFold, wrapText = false, onToggleWrap, showCopyButton = true, className, theme = 'dark', }) {
    const handleDownload = () => {
        try {
            if (typeof window === 'undefined' || !codeString)
                return;
            const blob = new Blob([codeString], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // Basic extension detection
            const ext = language && language !== 'text' ? language : 'txt';
            a.download = filename || `snippet.${ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        catch (err) {
            console.error('Failed to download code:', err);
        }
    };
    return (_jsxs("div", { className: cn('flex items-center justify-between px-4 py-2.5 border-b select-none', theme === 'dark'
            ? 'bg-[#252526] border-[#333]'
            : 'bg-gray-50 border-gray-200', className), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity", "aria-hidden": "true", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" }), _jsx("div", { className: "w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" }), _jsx("div", { className: "w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" })] }), (filename || language) && (_jsxs("div", { className: "flex items-center gap-2 ml-2", children: [filename && (_jsx("span", { className: "text-xs font-medium text-muted-foreground", children: filename })), language && language !== 'text' && (_jsx("span", { className: cn('text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider opacity-70', theme === 'dark'
                                    ? 'bg-white/10 text-white'
                                    : 'bg-black/5 text-black'), children: language }))] }))] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [enableFolding && onToggleFold && (_jsxs(Button, { variant: "ghost", size: "icon", onClick: onToggleFold, className: "h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-white/10", title: isFolded ? 'Expand code' : 'Collapse code', children: [isFolded ? (_jsx(ChevronDownIcon, { className: "h-4 w-4" })) : (_jsx(ChevronUpIcon, { className: "h-4 w-4" })), _jsx("span", { className: "sr-only", children: isFolded ? 'Expand code' : 'Collapse code' })] })), onToggleWrap && (_jsxs(Button, { variant: "ghost", size: "icon", onClick: onToggleWrap, className: cn('h-7 w-7 transition-colors', wrapText
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/10'), title: "Toggle word wrap", children: [_jsx(WrapTextIcon, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Toggle word wrap" })] })), _jsxs(Button, { variant: "ghost", size: "icon", onClick: handleDownload, className: "h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-white/10", title: "Download code", children: [_jsx(DownloadIcon, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Download code" })] }), showCopyButton && (_jsx(CopyButton, { text: codeString, iconOnly: true, className: "h-7 w-7" }))] })] }));
}
//# sourceMappingURL=CodeWindowHeader.js.map