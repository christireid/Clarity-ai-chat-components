import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, cn, formatFileSize } from '@clarity-chat/primitives';
export const FileUpload = React.memo(function FileUpload({ onUpload, maxFiles = 10, maxFileSize = 10 * 1024 * 1024, // 10MB default
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
    const validateFile = (file) => {
        if (file.size > maxFileSize) {
            return `File ${file.name} exceeds maximum size of ${formatFileSize(maxFileSize)}`;
        }
        return null;
    };
    const handleFiles = async (newFiles) => {
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
    };
    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        handleFiles(selectedFiles);
        if (fileInputRef.current)
            fileInputRef.current.value = '';
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };
    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };
    const handleUpload = async () => {
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
    };
    const getFileIcon = (file) => {
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
    };
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsxs("div", { onDragEnter: handleDragEnter, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, className: cn('relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer shadow-sm', isDragging
                    ? 'border-primary bg-primary/10 shadow-md scale-[1.02]'
                    : 'border-border hover:border-primary/50 hover:shadow-md'), onClick: () => fileInputRef.current?.click(), children: [_jsx("input", { ref: fileInputRef, type: "file", multiple: true, accept: acceptedFileTypes.join(','), onChange: handleFileInput, className: "hidden" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-4xl", children: "\uD83D\uDCC1" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: isDragging
                                            ? 'Drop files here'
                                            : 'Click to upload or drag and drop' }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: ["Max ", maxFiles, " files, up to ", formatFileSize(maxFileSize), " each"] })] }), _jsxs("div", { className: "flex flex-wrap gap-1 justify-center", children: [acceptedFileTypes.slice(0, 4).map((type) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: type.replace('*', 'all') }, type))), acceptedFileTypes.length > 4 && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["+", acceptedFileTypes.length - 4, " more"] }))] })] })] }), _jsx(AnimatePresence, { children: error && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "bg-destructive/10 border-2 border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm shadow-sm", children: error })) }), _jsx(AnimatePresence, { children: files.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-sm font-medium", children: ["Files to upload (", files.length, "/", maxFiles, ")"] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setFiles([]), disabled: uploading, children: "Clear all" })] }), _jsx("div", { className: "space-y-2", children: files.map((file, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, className: "flex items-center gap-3 p-3 bg-muted rounded-xl shadow-sm hover:shadow-md transition-shadow", children: [_jsx("span", { className: "text-2xl", children: getFileIcon(file) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium truncate", children: file.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [formatFileSize(file.size), " \u2022", ' ', file.type || 'Unknown type'] })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => removeFile(index), disabled: uploading, className: "flex-shrink-0", children: "\u2715" })] }, `${file.name}-${index}`))) }), _jsx(Button, { onClick: handleUpload, disabled: uploading, loading: uploading, className: "w-full", children: uploading
                                ? 'Uploading...'
                                : `Upload ${files.length} file${files.length > 1 ? 's' : ''}` })] })) })] }));
});
FileUpload.displayName = 'FileUpload';
//# sourceMappingURL=file-upload.js.map