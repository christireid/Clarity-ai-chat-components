import * as React from 'react';
export type TimelineEventType = 'user' | 'assistant' | 'tool' | 'system' | 'note';
export interface ConversationTimelineEvent {
    id: string;
    type: TimelineEventType;
    title: string;
    timestamp: Date;
    summary?: string;
    metadata?: Array<{
        label: string;
        value: string;
    }>;
    durationMs?: number;
    status?: 'pending' | 'complete' | 'error';
    icon?: React.ReactNode;
}
export interface ConversationTimelineProps {
    events: ConversationTimelineEvent[];
    onJumpToEvent?: (event: ConversationTimelineEvent) => void;
    showStatusIndicators?: boolean;
    className?: string;
    title?: string;
    subtitle?: string;
}
export declare const ConversationTimeline: React.FC<ConversationTimelineProps>;
//# sourceMappingURL=conversation-timeline.d.ts.map