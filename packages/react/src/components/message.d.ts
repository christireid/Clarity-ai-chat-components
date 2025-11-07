import * as React from 'react';
import type { Message as MessageType } from '@clarity-chat/types';
export interface MessageProps {
    message: MessageType;
    onCopy?: (content: string) => void;
    onFeedback?: (type: 'up' | 'down') => void;
    onRetry?: () => void;
    onEdit?: (content: string) => void;
    showAvatar?: boolean;
    showTimestamp?: boolean;
    className?: string;
}
export declare const Message: React.MemoExoticComponent<React.ForwardRefExoticComponent<MessageProps & React.RefAttributes<HTMLDivElement>>>;
//# sourceMappingURL=message.d.ts.map