/**
 * Progress Indicators
 *
 * Linear and circular progress indicators with determinate and indeterminate states.
 * Used for loading states, file uploads, and streaming progress.
 */
import * as React from 'react';
/**
 * Linear Progress Bar
 */
export interface ProgressProps {
    /** Progress value (0-100) - omit for indeterminate */
    value?: number;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Color variant */
    variant?: 'primary' | 'success' | 'warning' | 'destructive';
    /** Show percentage label */
    showLabel?: boolean;
    /** Custom label */
    label?: string;
    /** Additional className */
    className?: string;
}
export declare const Progress: React.FC<ProgressProps>;
/**
 * Circular Progress Indicator
 */
export interface CircularProgressProps {
    /** Progress value (0-100) - omit for indeterminate */
    value?: number;
    /** Size in pixels */
    size?: number;
    /** Stroke width in pixels */
    strokeWidth?: number;
    /** Color variant */
    variant?: 'primary' | 'success' | 'warning' | 'destructive';
    /** Show percentage label in center */
    showLabel?: boolean;
    /** Additional className */
    className?: string;
}
export declare const CircularProgress: React.FC<CircularProgressProps>;
/**
 * Streaming Progress - Animated dots indicator
 */
export interface StreamingProgressProps {
    /** Custom label */
    label?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional className */
    className?: string;
}
export declare const StreamingProgress: React.FC<StreamingProgressProps>;
/**
 * Upload Progress - Shows file upload with size
 */
export interface UploadProgressProps {
    /** File name */
    fileName: string;
    /** Progress value (0-100) */
    value: number;
    /** File size in bytes */
    fileSize?: number;
    /** Uploaded size in bytes */
    uploadedSize?: number;
    /** Cancel callback */
    onCancel?: () => void;
    /** Additional className */
    className?: string;
}
export declare const UploadProgress: React.FC<UploadProgressProps>;
/**
 * Skeleton Progress - Shows loading skeleton with animated progress
 */
export declare const SkeletonProgress: React.FC<{
    className?: string;
}>;
//# sourceMappingURL=progress.d.ts.map