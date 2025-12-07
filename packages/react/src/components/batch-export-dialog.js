'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, Button, Badge, cn, } from '@clarity-chat/primitives';
import { Progress } from './progress';
/**
 * Batch Export Dialog Component
 *
 * Allows exporting multiple conversations/resources at once with:
 * - Multi-select resource selection
 * - Format selection
 * - Batch progress tracking
 * - Error handling per resource
 * - Cloud storage integration options
 *
 * @example
 * ```tsx
 * <BatchExportDialog
 *   open={showBatchExport}
 *   onOpenChange={setShowBatchExport}
 *   resources={conversations}
 *   onExport={handleBatchExport}
 *   progress={exportProgress}
 * />
 * ```
 */
export function BatchExportDialog({ open, onOpenChange, resources, onExport, progress = [], className, }) {
    const [selectedIds, setSelectedIds] = React.useState(new Set());
    const [format, setFormat] = React.useState('markdown');
    const [options, setOptions] = React.useState({
        includeMetadata: true,
        includeImages: true,
        includeAttachments: false,
    });
    const [isExporting, setIsExporting] = React.useState(false);
    const [showCloudOptions, setShowCloudOptions] = React.useState(false);
    // Select/deselect all
    const allSelected = selectedIds.size === resources.length && resources.length > 0;
    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        }
        else {
            setSelectedIds(new Set(resources.map((r) => r.id)));
        }
    };
    const handleToggleResource = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        }
        else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };
    const handleExport = async () => {
        if (selectedIds.size === 0)
            return;
        setIsExporting(true);
        try {
            await onExport({
                resourceIds: Array.from(selectedIds),
                format,
                ...options,
            });
        }
        catch (error) {
            console.error('Batch export failed:', error);
        }
        finally {
            setIsExporting(false);
        }
    };
    const formats = [
        { value: 'pdf', label: 'PDF', icon: '📕' },
        { value: 'markdown', label: 'Markdown', icon: '📝' },
        { value: 'json', label: 'JSON', icon: '📊' },
        { value: 'html', label: 'HTML', icon: '🌐' },
    ];
    // Calculate overall progress
    const overallProgress = React.useMemo(() => {
        if (progress.length === 0)
            return 0;
        const total = progress.length;
        const completed = progress.filter((p) => p.status === 'completed').length;
        const exporting = progress.filter((p) => p.status === 'exporting');
        const exportingProgress = exporting.reduce((sum, p) => sum + p.progress, 0) / exporting.length || 0;
        return ((completed + exporting.length * (exportingProgress / 100)) / total) * 100;
    }, [progress]);
    const completedCount = progress.filter((p) => p.status === 'completed').length;
    const errorCount = progress.filter((p) => p.status === 'error').length;
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { size: "xl", className: className, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Batch Export" }), _jsxs(DialogDescription, { children: ["Export multiple ", resources[0]?.type || 'resources', " at once"] })] }), _jsxs(DialogBody, { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("h3", { className: "text-sm font-semibold", children: ["Select Resources (", selectedIds.size, " selected)"] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleSelectAll, disabled: isExporting, children: allSelected ? 'Deselect All' : 'Select All' })] }), _jsx("div", { className: "max-h-64 overflow-y-auto border rounded-lg divide-y", children: _jsx(AnimatePresence, { children: resources.map((resource, index) => {
                                            const isSelected = selectedIds.has(resource.id);
                                            const resourceProgress = progress.find((p) => p.resourceId === resource.id);
                                            const isExporting = resourceProgress?.status === 'exporting';
                                            const isCompleted = resourceProgress?.status === 'completed';
                                            const hasError = resourceProgress?.status === 'error';
                                            return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { delay: index * 0.02 }, className: cn('flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors', isSelected && 'bg-primary/5'), children: [_jsx("input", { type: "checkbox", checked: isSelected, onChange: () => handleToggleResource(resource.id), disabled: isExporting, className: "h-4 w-4 rounded border" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-sm font-medium truncate", children: resource.name }), resource.messageCount && (_jsxs(Badge, { variant: "secondary", className: "text-xs", children: [resource.messageCount, " messages"] })), resource.size && (_jsx(Badge, { variant: "outline", className: "text-xs", children: formatBytes(resource.size) }))] }), resource.lastModified && (_jsxs("p", { className: "text-xs text-muted-foreground", children: ["Modified ", formatRelativeTime(resource.lastModified)] }))] }), isExporting && (_jsx("div", { className: "w-24", children: _jsx(Progress, { value: resourceProgress?.progress || 0 }) })), isCompleted && (_jsx(Badge, { variant: "success", className: "text-xs", children: "\u2713 Done" })), hasError && (_jsx(Badge, { variant: "destructive", className: "text-xs", children: "\u2717 Error" }))] }, resource.id));
                                        }) }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Export Format" }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: formats.map((fmt) => (_jsxs(Button, { variant: format === fmt.value ? 'default' : 'outline', onClick: () => setFormat(fmt.value), disabled: isExporting, className: "flex flex-col gap-1 h-auto py-3", children: [_jsx("span", { className: "text-2xl", children: fmt.icon }), _jsx("span", { className: "text-xs", children: fmt.label })] }, fmt.value))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Options" }), _jsx("div", { className: "space-y-2", children: [
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
                                    ].map(({ key, label, description }) => (_jsxs("label", { className: "flex items-start gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted/50", children: [_jsx("input", { type: "checkbox", checked: options[key], onChange: (e) => setOptions({ ...options, [key]: e.target.checked }), disabled: isExporting, className: "mt-1" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: label }), _jsx("p", { className: "text-xs text-muted-foreground", children: description })] })] }, key))) })] }), _jsxs("div", { children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setShowCloudOptions(!showCloudOptions), className: "text-xs", children: [showCloudOptions ? '▼' : '▶', " Cloud Storage Options"] }), showCloudOptions && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "mt-2 p-3 bg-muted/50 rounded-lg space-y-2", children: _jsx("p", { className: "text-xs text-muted-foreground", children: "Cloud storage integration coming soon. For now, exports will be downloaded to your device." }) }))] }), isExporting && progress.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { children: ["Exporting ", completedCount, " of ", selectedIds.size, "...", errorCount > 0 && (_jsxs(Badge, { variant: "destructive", className: "ml-2", children: [errorCount, " error", errorCount !== 1 ? 's' : ''] }))] }), _jsxs("span", { children: [Math.round(overallProgress), "%"] })] }), _jsx(Progress, { value: overallProgress })] }))] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: isExporting, children: "Cancel" }), _jsx(Button, { onClick: handleExport, disabled: selectedIds.size === 0 || isExporting, state: isExporting ? 'loading' : 'idle', children: isExporting
                                ? `Exporting ${completedCount}/${selectedIds.size}...`
                                : `Export ${selectedIds.size} Resource${selectedIds.size !== 1 ? 's' : ''}` })] })] }) }));
}
// Helper functions
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1)
        return 'just now';
    if (diffMins < 60)
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24)
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7)
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}
BatchExportDialog.displayName = 'BatchExportDialog';
//# sourceMappingURL=batch-export-dialog.js.map