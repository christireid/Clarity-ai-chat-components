import * as React from 'react';
import type { Message as MessageType } from '@clarity-chat/types';
export interface MessageListProps {
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
    className?: string;
}
export declare const MessageList: React.NamedExoticComponent<MessageListProps>;
//# sourceMappingURL=message-list.d.ts.map