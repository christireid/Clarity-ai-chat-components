import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription, Button, cn, } from '@clarity-chat/primitives';
import { ImageIcon, MicIcon, FileIcon, LinkIcon, PlayIcon } from './icons';
const typeIcon = {
    image: _jsx(ImageIcon, { size: 18, className: "text-sky-500" }),
    audio: _jsx(MicIcon, { size: 18, className: "text-emerald-500" }),
    video: _jsx(PlayIcon, { size: 18, className: "text-purple-500" }),
    file: _jsx(FileIcon, { size: 18, className: "text-amber-500" }),
    link: _jsx(LinkIcon, { size: 18, className: "text-primary" }),
};
const statusBadge = {
    processing: 'warning',
    ready: 'success',
    failed: 'destructive',
};
const statusLabel = {
    processing: 'Processing',
    ready: 'Ready',
    failed: 'Failed',
};
const defaultTitle = 'Multimodal context';
const defaultSubtitle = 'Surface the supporting images, audio, and documents that shaped this response.';
export const MultiModalPreview = ({ attachments, onOpen, onRetry, onRemove, className, title = defaultTitle, subtitle = defaultSubtitle, }) => {
    const renderStatus = (attachment) => {
        if (!attachment.status)
            return null;
        return (_jsx(Badge, { variant: statusBadge[attachment.status], className: "text-[11px]", children: statusLabel[attachment.status] }));
    };
    const renderThumbnail = (attachment) => {
        if (attachment.thumbnailUrl) {
            return (_jsx("img", { src: attachment.thumbnailUrl, alt: attachment.title, className: "h-16 w-16 rounded-lg object-cover" }));
        }
        return (_jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-muted-foreground", children: typeIcon[attachment.type] }));
    };
    const formatDuration = (durationMs) => {
        if (!durationMs)
            return undefined;
        const seconds = Math.round(durationMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainder = seconds % 60;
        return `${minutes}:${remainder.toString().padStart(2, '0')}`;
    };
    return (_jsxs(Card, { className: cn('border-border/50 bg-background shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]', className), children: [_jsx(CardHeader, { className: "space-y-3", children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: title }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: subtitle })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [attachments.length === 0 && (_jsx("div", { className: "rounded-lg border border-dashed border-border/50 bg-muted p-6 text-center text-sm text-muted-foreground", children: "No attachments were provided for this exchange." })), _jsx("ul", { className: "space-y-4", children: attachments.map((attachment) => (_jsxs("li", { className: "flex flex-col gap-3 rounded-lg border border-border/50 bg-muted p-4 shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]", children: [_jsxs("div", { className: "flex flex-wrap items-start gap-4", children: [renderThumbnail(attachment), _jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [typeIcon[attachment.type], attachment.title] }), renderStatus(attachment), attachment.sizeLabel && (_jsx(Badge, { variant: "outline", className: "text-[11px]", children: attachment.sizeLabel })), attachment.durationMs && (_jsx(Badge, { variant: "subtle", className: "text-[11px]", children: formatDuration(attachment.durationMs) }))] }), attachment.description && (_jsx("p", { className: "text-sm text-muted-foreground/85", children: attachment.description })), attachment.metadata && attachment.metadata.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-3 text-xs text-muted-foreground/70", children: attachment.metadata.map(({ label, value }) => (_jsxs("div", { className: "flex items-center gap-1", children: [_jsxs("span", { className: "font-medium text-muted-foreground/90", children: [label, ":"] }), _jsx("span", { children: value })] }, `${attachment.id}-${label}`))) }))] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [onOpen && (_jsx(Button, { variant: "surface", size: "sm", onClick: () => onOpen(attachment), children: "Open" })), attachment.status === 'failed' && onRetry && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onRetry(attachment), className: "text-warning-foreground hover:text-warning-foreground", children: "Retry processing" })), onRemove && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onRemove(attachment), className: "text-destructive hover:text-destructive", children: "Remove" }))] })] }, attachment.id))) })] })] }));
};
MultiModalPreview.displayName = 'MultiModalPreview';
//# sourceMappingURL=multi-modal-preview.js.map