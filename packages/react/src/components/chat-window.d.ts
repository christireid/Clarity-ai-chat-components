import * as React from 'react';
import type { Message, AIStatus } from '@clarity-chat/types';
export interface ChatWindowProps {
    messages: Message[];
    isLoading?: boolean;
    /** AI processing status for thinking indicator */
    aiStatus?: AIStatus;
    onSendMessage: (content: string) => void;
    /** Callback when message is copied */
    onMessageCopy?: (messageId: string, content: string) => void;
    /** Callback when feedback is given */
    onMessageFeedback?: (messageId: string, type: 'up' | 'down') => void;
    /** Callback when retry is requested */
    onMessageRetry?: (messageId: string) => void;
    /** Custom empty state */
    emptyState?: React.ReactNode;
    /** Show header with session info */
    showHeader?: boolean;
    /** Session title */
    sessionTitle?: string;
    /** Session subtitle or description */
    sessionSubtitle?: string;
    /** Header actions */
    headerActions?: React.ReactNode;
    /** Show message count badge */
    showMessageCount?: boolean;
    /** Enable export functionality */
    onExport?: () => void;
    /** Enable clear chat functionality */
    onClear?: () => void;
    className?: string;
}
export declare const ChatWindow: React.NamedExoticComponent<ChatWindowProps>;
//# sourceMappingURL=chat-window.d.ts.map