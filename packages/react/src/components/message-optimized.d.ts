/**
 * Optimized Message Component
 *
 * Performance-optimized version of the Message component with:
 * - React.memo to prevent unnecessary re-renders
 * - useMemo for expensive markdown parsing
 * - useCallback for event handlers
 * - Lazy loading for syntax highlighting
 */
import * as React from 'react';
import type { Message as MessageType } from '@clarity-chat/types';
export interface MessageOptimizedProps {
    message: MessageType;
    onCopy?: (content: string) => void;
    onFeedback?: (type: 'up' | 'down') => void;
    onRetry?: () => void;
    onEdit?: (content: string) => void;
    showAvatar?: boolean;
    showTimestamp?: boolean;
    className?: string;
}
/**
 * Optimized Message component with React.memo
 */
export declare const MessageOptimized: React.MemoExoticComponent<React.ForwardRefExoticComponent<MessageOptimizedProps & React.RefAttributes<HTMLDivElement>>>;
//# sourceMappingURL=message-optimized.d.ts.map