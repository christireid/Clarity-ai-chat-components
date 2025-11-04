import * as React from 'react';
export interface SessionSummaryHighlights {
    title: string;
    highlights: string[];
    nextActions?: string[];
}
export interface SessionMetric {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'steady';
}
export interface SessionSummaryCardProps {
    summary: SessionSummaryHighlights;
    metrics: SessionMetric[];
    onAction?: (action: string) => void;
    onExport?: () => void;
    className?: string;
    title?: string;
    subtitle?: string;
}
export declare const SessionSummaryCard: React.NamedExoticComponent<SessionSummaryCardProps>;
//# sourceMappingURL=session-summary-card.d.ts.map