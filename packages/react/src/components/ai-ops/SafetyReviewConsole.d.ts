import * as React from 'react';
export interface SafetyHighlight {
    id: string;
    start: number;
    end: number;
    category: string;
    severity?: 'low' | 'medium' | 'high';
    suggestion?: string;
}
export interface SafetyReviewConsoleProps {
    content: string;
    highlights: SafetyHighlight[];
    onRedact?: (highlight: SafetyHighlight) => void;
    onApprove?: () => void;
    onReject?: () => void;
    className?: string;
}
export declare const SafetyReviewConsole: React.FC<SafetyReviewConsoleProps>;
//# sourceMappingURL=SafetyReviewConsole.d.ts.map