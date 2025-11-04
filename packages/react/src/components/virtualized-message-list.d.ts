/**
 * Virtualized Message List
 *
 * High-performance message list using virtual scrolling for large datasets.
 * Only renders visible messages to maintain performance with 1000+ messages.
 *
 * Note: This is an optimized version that manually implements virtualization
 * without external dependencies. For production use with react-window, see docs.
 */
import * as React from 'react';
import type { Message as MessageType } from '@clarity-chat/types';
export interface VirtualizedMessageListProps {
    messages: MessageType[];
    onMessageCopy?: (messageId: string, content: string) => void;
    onMessageFeedback?: (messageId: string, type: 'up' | 'down') => void;
    onMessageRetry?: (messageId: string) => void;
    /** Show loading skeleton while messages are being fetched */
    isLoading?: boolean;
    /** Number of skeleton messages to show while loading */
    loadingCount?: number;
    /** Empty state content */
    emptyState?: React.ReactNode;
    /** Enable virtualization (only render visible items) */
    enableVirtualization?: boolean;
    /** Estimated height of each message in pixels */
    estimatedMessageHeight?: number;
    /** Number of overscan items (render extra items above/below viewport) */
    overscan?: number;
    className?: string;
}
/**
 * Virtualized message list component
 */
export declare const VirtualizedMessageList: React.FC<VirtualizedMessageListProps>;
/**
 * Performance tip component for virtualization threshold
 */
export declare const VirtualizationTip: React.FC<{
    messageCount: number;
}>;
//# sourceMappingURL=virtualized-message-list.d.ts.map