'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, cn } from '@clarity-chat/primitives';
import { formatFileSize } from '../../internal/helpers';
import { EASING_FRAMER, DURATION_SECONDS as durations, } from '../../animations/constants';
/**
 * FileUpload component - Enhanced with React 19 features
 *
 * React 19 Enhancements:
 * - Removed React.memo() - compiler handles optimization
 * - Simplified event handlers - compiler optimizes
 */
export function FileUpload({ onUpload, maxFiles = 10, maxFileSize = 10 * 1024 * 1024, // 10MB default
acceptedFileTypes = [
    'image/*',
    'application/pdf',
    '.txt',
    '.doc',
    '.docx',
    'video/*',
], className, }) {
    const [isDragging, setIsDragging] = React.useState(false);
    const [files, setFiles] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const fileInputRef = React.useRef(null);
    // Memoize validation function to prevent recreation
    const validateFile = React.useCallback((file) => {
        if (file.size > maxFileSize) {
            return `File ${file.name} exceeds maximum size of ${formatFileSize(maxFileSize)}`;
        }
        return null;
    }, [maxFileSize]);
    // Memoize file handling to prevent recreation
    const handleFiles = React.useCallback(async (newFiles) => {
        setError(null);
        // Validate total count
        if (files.length + newFiles.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return;
        }
        // Validate each file
        for (const file of newFiles) {
            const error = validateFile(file);
            if (error) {
                setError(error);
                return;
            }
        }
        setFiles((prev) => [...prev, ...newFiles]);
    }, [files.length, maxFiles, validateFile]);
    // Memoize input handler
    const handleFileInput = React.useCallback((e) => {
        const selectedFiles = Array.from(e.target.files || []);
        handleFiles(selectedFiles);
        if (fileInputRef.current)
            fileInputRef.current.value = '';
    }, [handleFiles]);
    // Memoize drag handlers
    const handleDragEnter = React.useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);
    const handleDragLeave = React.useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);
    const handleDragOver = React.useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    const handleDrop = React.useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    }, [handleFiles]);
    // Memoize remove handler
    const removeFile = React.useCallback((index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }, []);
    // Memoize upload handler
    const handleUpload = React.useCallback(async () => {
        if (files.length === 0)
            return;
        setUploading(true);
        setError(null);
        try {
            await onUpload(files);
            setFiles([]);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        }
        finally {
            setUploading(false);
        }
    }, [files, onUpload]);
    // Memoize icon getter
    const getFileIcon = React.useCallback((file) => {
        if (file.type.startsWith('image/'))
            return '🖼️';
        if (file.type.startsWith('video/'))
            return '🎥';
        if (file.type.startsWith('audio/'))
            return '🎵';
        if (file.type.includes('pdf'))
            return '📄';
        if (file.type.includes('word') ||
            file.name.endsWith('.doc') ||
            file.name.endsWith('.docx'))
            return '📝';
        if (file.type.includes('sheet') || file.name.endsWith('.xlsx'))
            return '📊';
        return '📎';
    }, []);
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsxs("div", { onDragEnter: handleDragEnter, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, className: cn('relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ease-out cursor-pointer', isDragging
                    ? [
                        'border-primary bg-gradient-to-br from-primary/10 to-primary/5',
                        'shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.25)]',
                        'scale-[1.01]',
                    ]
                    : [
                        'border-border/40',
                        'bg-gradient-to-br from-card/50 to-muted/30',
                        'hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent',
                        'hover:shadow-md',
                    ]), onClick: () => fileInputRef.current?.click(), children: [_jsx("input", { ref: fileInputRef, type: "file", multiple: true, accept: acceptedFileTypes.join(','), onChange: handleFileInput, className: "hidden" }), _jsxs(motion.div, { className: "space-y-3.5", animate: {
                            scale: isDragging ? 1.05 : 1,
                        }, transition: {
                            // Framer Motion 12: Spring scale on drag
                            type: 'spring',
                            damping: 18,
                            stiffness: 280,
                        }, children: [_jsx(motion.div, { className: "text-5xl", animate: {
                                    y: isDragging ? -4 : 0,
                                }, transition: {
                                    // Framer Motion 12: Spring bounce on drag
                                    type: 'spring',
                                    damping: 15,
                                    stiffness: 250,
                                }, children: "\uD83D\uDCC1" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: isDragging
                                            ? 'Drop files here'
                                            : 'Click to upload or drag and drop' }), _jsxs("p", { className: "text-xs text-muted-foreground/90 mt-1", children: ["Max ", maxFiles, " files, up to ", formatFileSize(maxFileSize), " each"] })] }), _jsxs("div", { className: "flex flex-wrap gap-1.5 justify-center", children: [acceptedFileTypes.slice(0, 4).map((type, i) => (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: i * 0.05, duration: durations.normal }, children: _jsx(Badge, { variant: "outline", className: "text-xs", children: type.replace('*', 'all') }) }, type))), acceptedFileTypes.length > 4 && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["+", acceptedFileTypes.length - 4, " more"] }))] })] })] }), _jsx(AnimatePresence, { children: error && (_jsx(motion.div, { initial: { opacity: 0, y: -10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10, scale: 0.95 }, transition: {
                        duration: durations.normal,
                        ease: EASING_FRAMER.sharp,
                    }, className: "bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm shadow-sm", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("svg", { className: "h-4 w-4 shrink-0 mt-0.5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }), error] }) })) }), _jsx(AnimatePresence, { children: files.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "space-y-2.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-sm font-medium", children: ["Files to upload (", files.length, "/", maxFiles, ")"] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setFiles([]), disabled: uploading, children: "Clear all" })] }), _jsx("div", { className: "space-y-2.5", children: files.map((file, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: 20, scale: 0.95 }, transition: {
                                    delay: index * 0.05,
                                    duration: durations.normal,
                                    ease: EASING_FRAMER.sharp,
                                }, className: "flex items-center gap-3 p-3 bg-card border border-border/40 rounded-xl shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-200 ease-out", children: [_jsx(motion.span, { className: "text-2xl", initial: { scale: 0 }, animate: { scale: 1 }, transition: {
                                            delay: index * 0.05 + 0.1,
                                            type: 'spring',
                                            stiffness: 500,
                                            damping: 30,
                                        }, children: getFileIcon(file) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: file.name }), _jsxs("p", { className: "text-xs text-muted-foreground/90", children: [formatFileSize(file.size), " \u2022", ' ', file.type || 'Unknown type'] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => removeFile(index), disabled: uploading, className: "flex-shrink-0 h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive", "aria-label": "Remove file", children: _jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }, `${file.name}-${index}`))) }), _jsx(Button, { onClick: handleUpload, disabled: uploading, loading: uploading, className: "w-full", children: uploading
                                ? 'Uploading...'
                                : `Upload ${files.length} file${files.length > 1 ? 's' : ''}` })] })) })] }));
}
FileUpload.displayName = 'FileUpload';
//# sourceMappingURL=file-upload.js.map