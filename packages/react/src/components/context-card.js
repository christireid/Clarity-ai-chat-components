import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Badge, Button, cn, formatFileSize, truncate, } from '@clarity-chat/primitives';
export const ContextCard = React.memo(function ContextCard({ context, onRemove, onToggle, onPreview, showActions = true, className, }) {
    const getIcon = () => {
        switch (context.type) {
            case 'document':
                return '📄';
            case 'image':
                return '🖼️';
            case 'video':
                return '🎥';
            case 'audio':
                return '🎵';
            case 'link':
                return '🔗';
            case 'text':
                return '📝';
            default:
                return '📎';
        }
    };
    const getTypeColor = () => {
        switch (context.type) {
            case 'document':
                return 'bg-primary/10 text-primary ring-1 ring-primary/20';
            case 'image':
                return 'bg-secondary/10 text-secondary-foreground ring-1 ring-secondary/20';
            case 'video':
                return 'bg-destructive/10 text-destructive ring-1 ring-destructive/20';
            case 'audio':
                return 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] ring-1 ring-[hsl(var(--success))]/20';
            case 'link':
                return 'bg-[hsl(var(--info))]/10 text-[hsl(var(--info))] ring-1 ring-[hsl(var(--info))]/20';
            case 'text':
                return 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] ring-1 ring-[hsl(var(--warning))]/20';
            default:
                return 'bg-muted text-muted-foreground ring-1 ring-border';
        }
    };
    return (_jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.2 }, children: _jsx(Card, { className: cn('group relative transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer', !context.isActive && 'opacity-60', className), onClick: () => onPreview?.(context), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: cn('flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm', getTypeColor()), children: context.metadata.thumbnail ? (_jsx("img", { src: context.metadata.thumbnail, alt: context.name, className: "w-full h-full object-cover rounded-lg" })) : (getIcon()) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "font-medium text-sm truncate", children: context.name }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: context.metadata.extractedText
                                                            ? truncate(context.metadata.extractedText, 80)
                                                            : context.type })] }), _jsx(Badge, { variant: context.isActive ? 'success' : 'secondary', size: "sm", className: "flex-shrink-0", dot: context.isActive, pulse: context.isActive, children: context.isActive ? 'Active' : 'Inactive' })] }), _jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs text-muted-foreground", children: [_jsx(Badge, { variant: "outline", size: "sm", className: "capitalize", children: context.type }), context.metadata.fileSize && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("svg", { className: "h-3 w-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }), formatFileSize(context.metadata.fileSize)] })), context.metadata.pageCount && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("svg", { className: "h-3 w-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), context.metadata.pageCount, " pages"] })), context.metadata.duration && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("svg", { className: "h-3 w-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), Math.round(context.metadata.duration / 60), " min"] }))] })] })] }), showActions && (_jsxs("div", { className: "flex items-center gap-2 mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: [onToggle && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                    e.stopPropagation();
                                    onToggle(context.id);
                                }, className: "gap-1.5", children: [_jsx("svg", { className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: context.isActive ? (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" })) : (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" })) }), context.isActive ? 'Deactivate' : 'Activate'] })), onPreview && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                    e.stopPropagation();
                                    onPreview(context);
                                }, className: "gap-1.5", children: [_jsxs("svg", { className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] }), "Preview"] })), onRemove && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                    e.stopPropagation();
                                    onRemove(context.id);
                                }, className: "ml-auto text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5", children: [_jsx("svg", { className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), "Remove"] }))] }))] }) }) }));
});
ContextCard.displayName = 'ContextCard';
//# sourceMappingURL=context-card.js.map