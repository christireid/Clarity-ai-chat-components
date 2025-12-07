'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Badge, Button, cn, } from '@clarity-chat/primitives';
import { FileIcon, DownloadIcon, RefreshIcon, CheckIcon, CloseIcon } from './icons';
import { useIsMounted } from '../hooks/use-is-mounted';
/**
 * Platform configuration
 */
const PLATFORM_CONFIG = {
    'google-docs': { name: 'Google Docs', icon: '📄', color: '#4285F4' },
    'google-sheets': { name: 'Google Sheets', icon: '📊', color: '#0F9D58' },
    'google-slides': { name: 'Google Slides', icon: '📽️', color: '#F4B400' },
    'notion': { name: 'Notion', icon: '📝', color: '#000000' },
    'confluence': { name: 'Confluence', icon: '📘', color: '#0052CC' },
    'dropbox': { name: 'Dropbox', icon: '📦', color: '#0061FF' },
    'onedrive': { name: 'OneDrive', icon: '☁️', color: '#0078D4' },
    'sharepoint': { name: 'SharePoint', icon: '🔗', color: '#038387' },
    'local': { name: 'Local File', icon: '💾', color: '#6B7280' },
};
/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
/**
 * Format date
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}
/**
 * DocumentIntegration Component
 *
 * Integrate with external document platforms for:
 * - Document browsing and selection
 * - Content extraction for RAG
 * - Document export
 * - Cross-platform sync
 */
export const DocumentIntegration = React.forwardRef(function DocumentIntegration({ platforms = ['google-docs', 'notion', 'local'], initialDocuments = [], onDocumentSelect, onContentExtract, onExport, fetchDocument, listDocuments, showPlatformSelector = true, multiSelect = false, maxDocuments = 50, className, ...props }, ref) {
    const isMounted = useIsMounted();
    const [state, setState] = React.useState({
        documents: initialDocuments,
        selectedDocument: null,
        loading: false,
        error: null,
        syncing: false,
    });
    // Handle empty platforms array safely and filter out invalid platforms
    const validPlatforms = platforms.filter(p => PLATFORM_CONFIG[p] !== undefined);
    const safePlatforms = validPlatforms.length > 0 ? validPlatforms : ['local'];
    const [selectedPlatform, setSelectedPlatform] = React.useState(safePlatforms[0]);
    const [selectedIds, setSelectedIds] = React.useState(new Set());
    // Clear error helper
    const clearError = React.useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);
    // Load documents from platform
    const loadDocuments = React.useCallback(async (platform) => {
        if (!listDocuments)
            return;
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const docs = await listDocuments(platform);
            if (isMounted.current) {
                setState(prev => ({
                    ...prev,
                    documents: docs.slice(0, maxDocuments),
                    loading: false,
                }));
            }
        }
        catch (error) {
            if (isMounted.current) {
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Failed to load documents',
                    loading: false,
                }));
            }
        }
    }, [listDocuments, maxDocuments, isMounted]);
    // Select document and fetch content
    const selectDocument = React.useCallback(async (doc) => {
        if (!fetchDocument) {
            // If no fetch function, just notify selection
            onDocumentSelect?.({
                id: doc.id,
                text: '',
                metadata: doc,
            });
            return;
        }
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const content = await fetchDocument(doc.id, doc.platform);
            if (isMounted.current) {
                setState(prev => ({
                    ...prev,
                    selectedDocument: content,
                    loading: false,
                }));
                onDocumentSelect?.(content);
                onContentExtract?.(content);
            }
        }
        catch (error) {
            if (isMounted.current) {
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Failed to fetch document',
                    loading: false,
                }));
            }
        }
    }, [fetchDocument, onDocumentSelect, onContentExtract, isMounted]);
    // Toggle document selection (for multi-select)
    const toggleSelection = React.useCallback((docId) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(docId)) {
                newSet.delete(docId);
            }
            else {
                newSet.add(docId);
            }
            return newSet;
        });
    }, []);
    // Export document
    const exportDocument = React.useCallback(async (docId, options) => {
        if (!onExport)
            return;
        setState(prev => ({ ...prev, syncing: true }));
        let objectUrl = null;
        try {
            const blob = await onExport(docId, options);
            if (!isMounted.current)
                return;
            // Trigger download with proper cleanup
            objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = `document.${options.format}`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            // Delay removal to ensure download starts
            setTimeout(() => {
                if (a.parentNode) {
                    document.body.removeChild(a);
                }
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                }
            }, 100);
        }
        catch (error) {
            // Clean up URL if created
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
            if (isMounted.current) {
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Export failed',
                }));
            }
        }
        finally {
            if (isMounted.current) {
                setState(prev => ({ ...prev, syncing: false }));
            }
        }
    }, [onExport, isMounted]);
    // Load documents when platform changes
    React.useEffect(() => {
        if (listDocuments) {
            loadDocuments(selectedPlatform);
        }
    }, [selectedPlatform, loadDocuments, listDocuments]);
    return (_jsxs("div", { ref: ref, className: cn('space-y-4', className), role: "region", "aria-label": "Document integration", ...props, children: [showPlatformSelector && safePlatforms.length > 1 && (_jsx("div", { className: "flex flex-wrap gap-2", role: "tablist", "aria-label": "Document platforms", children: safePlatforms.map(platform => {
                    const config = PLATFORM_CONFIG[platform];
                    return (_jsxs(Button, { variant: selectedPlatform === platform ? 'default' : 'outline', size: "sm", onClick: () => setSelectedPlatform(platform), className: "gap-2", role: "tab", "aria-selected": selectedPlatform === platform, "aria-label": `Select ${config.name}`, children: [_jsx("span", { "aria-hidden": "true", children: config.icon }), _jsx("span", { children: config.name })] }, platform));
                }) })), state.error && (_jsxs("div", { className: "p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center justify-between", role: "alert", children: [_jsx("span", { children: state.error }), _jsx(Button, { variant: "ghost", size: "sm", onClick: clearError, "aria-label": "Dismiss error", className: "ml-2 h-6 w-6 p-0", children: _jsx(CloseIcon, { className: "w-4 h-4" }) })] })), state.loading && (_jsx("div", { className: "flex items-center justify-center p-8", children: _jsx(RefreshIcon, { className: "w-6 h-6 animate-spin text-muted-foreground" }) })), !state.loading && state.documents.length > 0 && (_jsx(Card, { children: _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "divide-y", children: _jsx(AnimatePresence, { children: state.documents.map((doc, index) => {
                                const isSelected = selectedIds.has(doc.id);
                                const config = PLATFORM_CONFIG[doc.platform] || PLATFORM_CONFIG['local'];
                                return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { delay: index * 0.02 }, className: cn('flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer transition-colors', isSelected && 'bg-primary/10'), onClick: () => {
                                        if (multiSelect) {
                                            toggleSelection(doc.id);
                                        }
                                        else {
                                            selectDocument(doc);
                                        }
                                    }, children: [multiSelect && (_jsx("div", { className: cn('w-5 h-5 rounded border-2 flex items-center justify-center', isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'), children: isSelected && _jsx(CheckIcon, { className: "w-3 h-3 text-primary-foreground" }) })), _jsx("div", { className: "w-10 h-10 rounded flex items-center justify-center text-lg", style: { backgroundColor: `${config.color}20` }, children: doc.thumbnail ? (_jsx("img", { src: doc.thumbnail, alt: "", className: "w-full h-full object-cover rounded" })) : (_jsx(FileIcon, { className: "w-5 h-5", style: { color: config.color } })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: doc.title }), _jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [_jsx("span", { children: formatFileSize(doc.size) }), _jsx("span", { children: "-" }), _jsx("span", { children: formatDate(doc.modifiedAt) }), doc.shared && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: "Shared" }))] })] }), _jsx("div", { className: "flex items-center gap-1", children: onExport && (_jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                    e.stopPropagation();
                                                    exportDocument(doc.id, { format: 'pdf' });
                                                }, disabled: state.syncing, "aria-label": "Export document", children: _jsx(DownloadIcon, { className: "w-4 h-4" }) })) })] }, doc.id));
                            }) }) }) }) })), !state.loading && state.documents.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-center", children: [_jsx(FileIcon, { className: "w-12 h-12 text-muted-foreground mb-3" }), _jsx("div", { className: "text-muted-foreground", children: "No documents found" }), listDocuments && (_jsx(Button, { variant: "outline", size: "sm", onClick: () => loadDocuments(selectedPlatform), className: "mt-3", children: "Refresh" }))] })), state.selectedDocument && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("div", { className: "font-medium", children: state.selectedDocument.metadata.title }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setState(prev => ({ ...prev, selectedDocument: null })), children: "Close" })] }), _jsxs("div", { className: "text-sm text-muted-foreground max-h-48 overflow-y-auto whitespace-pre-wrap", children: [state.selectedDocument.text.slice(0, 500), state.selectedDocument.text.length > 500 && '...'] }), state.selectedDocument.chunks && (_jsxs("div", { className: "mt-3 text-xs text-muted-foreground", children: [state.selectedDocument.chunks.length, " chunks extracted for RAG"] }))] }) })), multiSelect && selectedIds.size > 0 && (_jsxs("div", { className: "flex items-center justify-between p-3 bg-muted rounded-lg", children: [_jsxs("span", { className: "text-sm", children: [selectedIds.size, " document", selectedIds.size > 1 ? 's' : '', " selected"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setSelectedIds(new Set()), children: "Clear" }), _jsx(Button, { size: "sm", onClick: () => {
                                    const selectedDocs = state.documents.filter(d => selectedIds.has(d.id));
                                    selectedDocs.forEach(doc => selectDocument(doc));
                                }, children: "Import Selected" })] })] }))] }));
});
// Display name for debugging
DocumentIntegration.displayName = 'DocumentIntegration';
/**
 * Hook for document integration
 */
export function useDocumentIntegration(options) {
    const [documents, setDocuments] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    // List documents
    const listDocuments = React.useCallback(async (platform) => {
        const targetPlatform = platform || options.platform || 'local';
        setLoading(true);
        setError(null);
        try {
            if (options.apiEndpoint) {
                const response = await fetch(`${options.apiEndpoint}/documents?platform=${targetPlatform}`, {
                    headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                setDocuments(data.documents || []);
                return data.documents || [];
            }
            // Local implementation placeholder
            return [];
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to list documents';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [options.platform, options.apiEndpoint, options.apiKey]);
    // Fetch document content
    const fetchDocument = React.useCallback(async (id, platform) => {
        const targetPlatform = platform || options.platform || 'local';
        setLoading(true);
        setError(null);
        try {
            if (options.apiEndpoint) {
                const response = await fetch(`${options.apiEndpoint}/documents/${id}?platform=${targetPlatform}`, {
                    headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return await response.json();
            }
            throw new Error('No API endpoint configured');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch document';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [options.platform, options.apiEndpoint, options.apiKey]);
    // Extract content for RAG
    const extractContent = React.useCallback(async (document, chunkSize = 1000, overlap = 200) => {
        const text = document.text;
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize - overlap) {
            const content = text.slice(i, i + chunkSize);
            chunks.push({
                id: `${document.id}-chunk-${chunks.length}`,
                content,
                startIndex: i,
                endIndex: Math.min(i + chunkSize, text.length),
            });
        }
        return chunks;
    }, []);
    // Export document
    const exportDocument = React.useCallback(async (id, exportOptions) => {
        if (!options.apiEndpoint) {
            throw new Error('No API endpoint configured');
        }
        const response = await fetch(`${options.apiEndpoint}/documents/${id}/export`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
            },
            body: JSON.stringify(exportOptions),
        });
        if (!response.ok) {
            throw new Error(`Export failed: HTTP ${response.status}`);
        }
        return await response.blob();
    }, [options.apiEndpoint, options.apiKey]);
    return {
        documents,
        loading,
        error,
        listDocuments,
        fetchDocument,
        extractContent,
        exportDocument,
    };
}
//# sourceMappingURL=document-integration.js.map