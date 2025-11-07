import * as React from 'react';
export type AgentRunStatus = 'pending' | 'running' | 'succeeded' | 'failed';
export interface AgentRunStep {
    id: string;
    title: string;
    detail?: string;
    status: AgentRunStatus;
    tool?: string;
    startedAt: Date;
    completedAt?: Date;
    outputPreview?: string;
}
export interface AgentRunFeedProps {
    steps: AgentRunStep[];
    onRetry?: (step: AgentRunStep) => void;
    onOpenLogs?: (step: AgentRunStep) => void;
    className?: string;
    title?: string;
    subtitle?: string;
}
export declare const AgentRunFeed: React.FC<AgentRunFeedProps>;
//# sourceMappingURL=agent-run-feed.d.ts.map