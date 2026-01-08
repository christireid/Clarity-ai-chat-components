/**
 * Loading Skeleton Components
 *
 * A collection of skeleton loading components for chat applications.
 * Provides visual feedback during content loading.
 */
import { type ReactNode } from 'react';
export interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    animate?: boolean;
}
export declare function Skeleton({ className, width, height, rounded, animate, }: SkeletonProps): import("react").JSX.Element;
export interface TextSkeletonProps {
    lines?: number;
    className?: string;
    lastLineWidth?: string;
}
export declare function TextSkeleton({ lines, className, lastLineWidth, }: TextSkeletonProps): import("react").JSX.Element;
export interface MessageSkeletonProps {
    isUser?: boolean;
    className?: string;
}
export declare function MessageSkeleton({ isUser, className, }: MessageSkeletonProps): import("react").JSX.Element;
export interface ChatSkeletonProps {
    messageCount?: number;
    className?: string;
}
export declare function ChatSkeleton({ messageCount, className, }: ChatSkeletonProps): import("react").JSX.Element;
export interface AvatarSkeletonProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}
export declare function AvatarSkeleton({ size, className, }: AvatarSkeletonProps): import("react").JSX.Element;
export interface InputSkeletonProps {
    className?: string;
    showButton?: boolean;
}
export declare function InputSkeleton({ className, showButton, }: InputSkeletonProps): import("react").JSX.Element;
export interface CardSkeletonProps {
    className?: string;
    showHeader?: boolean;
    showFooter?: boolean;
}
export declare function CardSkeleton({ className, showHeader, showFooter, }: CardSkeletonProps): import("react").JSX.Element;
export interface FullChatSkeletonProps {
    className?: string;
}
export declare function FullChatSkeleton({ className }: FullChatSkeletonProps): import("react").JSX.Element;
export interface SkeletonContainerProps {
    loading: boolean;
    skeleton: ReactNode;
    children: ReactNode;
    className?: string;
    fadeIn?: boolean;
}
export declare function SkeletonContainer({ loading, skeleton, children, className, fadeIn, }: SkeletonContainerProps): import("react").JSX.Element;
export default Skeleton;
//# sourceMappingURL=Skeleton.d.ts.map