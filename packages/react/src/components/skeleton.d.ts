/**
 * Skeleton Loaders
 *
 * Loading placeholder components with shimmer animation effect.
 * Used to show content structure while data is loading.
 */
import * as React from 'react';
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Animation type */
    variant?: 'pulse' | 'shimmer' | 'none';
    /** Width of skeleton (CSS value) */
    width?: string | number;
    /** Height of skeleton (CSS value) */
    height?: string | number;
    /** Border radius */
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}
/**
 * Base skeleton component with loading animation
 */
export declare const Skeleton: React.FC<SkeletonProps>;
/**
 * Skeleton for text content
 */
export interface SkeletonTextProps {
    /** Number of lines */
    lines?: number;
    /** Line height in pixels */
    lineHeight?: number;
    /** Gap between lines in pixels */
    gap?: number;
    /** Last line width percentage */
    lastLineWidth?: number;
    /** Animation variant */
    variant?: 'pulse' | 'shimmer' | 'none';
    className?: string;
}
export declare const SkeletonText: React.FC<SkeletonTextProps>;
/**
 * Skeleton for avatar/profile picture
 */
export interface SkeletonAvatarProps {
    /** Size in pixels */
    size?: number;
    /** Animation variant */
    variant?: 'pulse' | 'shimmer' | 'none';
    className?: string;
}
export declare const SkeletonAvatar: React.FC<SkeletonAvatarProps>;
/**
 * Skeleton for message bubble
 */
export interface SkeletonMessageProps {
    /** Message role - affects alignment and styling */
    role?: 'user' | 'assistant';
    /** Show avatar */
    showAvatar?: boolean;
    /** Number of text lines */
    lines?: number;
    /** Animation variant */
    variant?: 'pulse' | 'shimmer' | 'none';
    className?: string;
}
export declare const SkeletonMessage: React.FC<SkeletonMessageProps>;
/**
 * Skeleton for card component
 */
export interface SkeletonCardProps {
    /** Show image placeholder */
    showImage?: boolean;
    /** Image height in pixels */
    imageHeight?: number;
    /** Show header (title) */
    showHeader?: boolean;
    /** Number of body text lines */
    bodyLines?: number;
    /** Show footer actions */
    showFooter?: boolean;
    /** Animation variant */
    variant?: 'pulse' | 'shimmer' | 'none';
    className?: string;
}
export declare const SkeletonCard: React.FC<SkeletonCardProps>;
/**
 * Skeleton for list items
 */
export interface SkeletonListProps {
    /** Number of items */
    count?: number;
    /** Show avatar in each item */
    showAvatar?: boolean;
    /** Number of text lines per item */
    lines?: number;
    /** Animation variant */
    variant?: 'pulse' | 'shimmer' | 'none';
    className?: string;
}
export declare const SkeletonList: React.FC<SkeletonListProps>;
/**
 * Skeleton for button
 */
export interface SkeletonButtonProps {
    /** Button width */
    width?: number | string;
    /** Button height */
    height?: number;
    /** Animation variant */
    variant?: 'pulse' | 'shimmer' | 'none';
    className?: string;
}
export declare const SkeletonButton: React.FC<SkeletonButtonProps>;
/**
 * Skeleton for input field
 */
export interface SkeletonInputProps {
    /** Input width */
    width?: number | string;
    /** Input height */
    height?: number;
    /** Show label */
    showLabel?: boolean;
    /** Animation variant */
    variant?: 'pulse' | 'shimmer' | 'none';
    className?: string;
}
export declare const SkeletonInput: React.FC<SkeletonInputProps>;
/**
 * Skeleton for chat window
 */
export declare const SkeletonChatWindow: React.FC<{
    variant?: 'pulse' | 'shimmer' | 'none';
}>;
//# sourceMappingURL=skeleton.d.ts.map