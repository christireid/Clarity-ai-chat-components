import * as React from 'react';
export interface WorkflowSuggestion {
    id: string;
    name: string;
    description: string;
    steps: string[];
    estimatedTime?: string;
    audience?: string;
    tags?: string[];
}
export interface WorkflowSuggestionListProps {
    workflows: WorkflowSuggestion[];
    onSelect?: (workflow: WorkflowSuggestion) => void;
    onPreview?: (workflow: WorkflowSuggestion) => void;
    className?: string;
    title?: string;
    subtitle?: string;
}
export declare const WorkflowSuggestionList: React.NamedExoticComponent<WorkflowSuggestionListProps>;
//# sourceMappingURL=workflow-suggestion-list.d.ts.map