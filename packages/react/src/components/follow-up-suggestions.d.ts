import * as React from 'react';
export interface FollowUpSuggestion {
    id: string;
    title: string;
    description?: string;
    keywords?: string[];
    icon?: React.ReactNode;
    confidence?: number;
}
export interface FollowUpSuggestionsProps {
    /** Suggestions to display */
    suggestions: FollowUpSuggestion[];
    /** Callback when a suggestion is selected */
    onSelect: (suggestion: FollowUpSuggestion) => void;
    /** Optional heading */
    title?: string;
    /** Optional description text under the heading */
    subtitle?: string;
    /** Layout style */
    layout?: 'grid' | 'list';
    /** Show loading state */
    isLoading?: boolean;
    /** Number of placeholder cards to render while loading */
    loadingCount?: number;
    /** Empty state render when no suggestions */
    emptyState?: React.ReactNode;
    className?: string;
}
export declare const FollowUpSuggestions: React.NamedExoticComponent<FollowUpSuggestionsProps>;
//# sourceMappingURL=follow-up-suggestions.d.ts.map