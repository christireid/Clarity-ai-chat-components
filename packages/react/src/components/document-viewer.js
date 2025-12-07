import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@clarity-chat/primitives';
function highlightContent(content, query) {
    if (!query || query.trim().length < 2) {
        return _jsx(_Fragment, { children: content });
    }
    try {
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        const parts = content.split(regex);
        const matches = content.match(regex);
        if (!matches) {
            return _jsx(_Fragment, { children: content });
        }
        const highlighted = [];
        parts.forEach((part, index) => {
            highlighted.push(_jsx("span", { children: part }, `part-${index}`));
            if (matches[index]) {
                highlighted.push(_jsx("mark", { className: "rounded bg-yellow-200 px-1 py-0.5 text-gray-900 dark:bg-yellow-300/60 dark:text-gray-900", children: matches[index] }, `match-${index}`));
            }
        });
        return highlighted;
    }
    catch {
        return _jsx(_Fragment, { children: content });
    }
}
export function DocumentViewer({ document, highlightQuery, className, emptyState, }) {
    if (!document) {
        return (_jsx("div", { className: cn('flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20 p-6 text-sm text-muted-foreground', className), children: emptyState ?? 'No document selected.' }));
    }
    const { name, type, content, summary, metadata, sourceUrl, tags } = document;
    return (_jsxs("div", { className: cn('flex h-full flex-col space-y-4 text-sm text-foreground', className), children: [_jsxs("header", { className: "flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border/50 bg-card/70 p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] backdrop-blur-sm", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-foreground", children: name ?? 'Document' }), type ? (_jsx("p", { className: "text-xs text-muted-foreground mt-1", children: type })) : null, sourceUrl ? (_jsx("a", { href: sourceUrl, target: "_blank", rel: "noreferrer", className: "mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline", children: "View Source \u2197" })) : null] }), tags?.length ? (_jsx("div", { className: "flex flex-wrap gap-1.5", children: tags.map((tag) => (_jsx("span", { className: "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary", children: tag }, tag))) })) : null] }), summary ? (_jsxs("section", { className: "rounded-lg border border-border/50 bg-background/60 p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: [_jsx("h4", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Summary" }), _jsx("p", { className: "mt-2 text-sm leading-relaxed text-foreground/90", children: summary })] })) : null, _jsxs("section", { className: "flex-1 overflow-y-auto rounded-lg border border-border/50 bg-background/70 p-4 shadow-inner", children: [_jsx("h4", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Content" }), _jsx("div", { className: "mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90", children: content ? (highlightContent(content, highlightQuery)) : (_jsxs("div", { className: "flex h-40 flex-col items-center justify-center text-muted-foreground", children: [_jsx("span", { className: "text-4xl mb-2", children: "\uD83D\uDCC4" }), _jsx("p", { className: "text-sm", children: "Document content not available." }), _jsx("p", { className: "mt-1 text-xs", children: "Provide `document.content` to render the body." })] })) })] }), metadata && Object.keys(metadata).length ? (_jsxs("section", { className: "rounded-lg border border-border/50 bg-background/60 p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: [_jsx("h4", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Metadata" }), _jsx("dl", { className: "mt-3 grid grid-cols-1 gap-2 text-xs text-muted-foreground md:grid-cols-2", children: Object.entries(metadata).map(([key, value]) => (_jsxs("div", { className: "rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground", children: [_jsx("dt", { className: "font-medium text-foreground/80", children: key
                                        .replace(/([A-Z])/g, ' $1')
                                        .replace(/^./, (str) => str.toUpperCase()) }), _jsx("dd", { className: "mt-0.5 break-words text-muted-foreground/90", children: typeof value === 'string'
                                        ? value
                                        : JSON.stringify(value, null, 2) })] }, key))) })] })) : null] }));
}
//# sourceMappingURL=document-viewer.js.map