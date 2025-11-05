/**
 * Empty State Components
 *
 * Comprehensive empty state components for various scenarios:
 * - No data
 * - No search results
 * - No conversations
 * - Error states
 * - Success states
 */
import * as React from 'react';
export interface EmptyStateProps {
    /** Icon to display */
    icon?: React.ReactNode;
    /** Title */
    title: string;
    /** Description */
    description?: string;
    /** Primary action */
    action?: {
        label: string;
        onClick: () => void;
        variant?: 'default' | 'primary' | 'success' | 'destructive';
    };
    /** Secondary action */
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    /** Additional className */
    className?: string;
}
/**
 * Base Empty State Component
 */
export declare const EmptyState: React.NamedExoticComponent<EmptyStateProps>;
/**
 * Empty Chat State
 */
export declare const EmptyChatState: React.NamedExoticComponent<{
    onStartChat?: () => void;
    className?: string;
}>;
/**
 * No Search Results State
 */
export declare const NoSearchResultsState: React.NamedExoticComponent<{
    searchQuery?: string;
    onClearSearch?: () => void;
    className?: string;
}>;
/**
 * No Conversations State
 */
export declare const NoConversationsState: React.NamedExoticComponent<{
    onCreateConversation?: () => void;
    className?: string;
}>;
/**
 * No Files State
 */
export declare const NoFilesState: React.NamedExoticComponent<{
    onUpload?: () => void;
    className?: string;
}>;
/**
 * Error State
 */
export declare const ErrorState: React.NamedExoticComponent<{
    title?: string;
    description?: string;
    onRetry?: () => void;
    onGoBack?: () => void;
    className?: string;
}>;
/**
 * Success State
 */
export declare const SuccessState: React.NamedExoticComponent<{
    title: string;
    description?: string;
    onContinue?: () => void;
    className?: string;
}>;
/**
 * Info State
 */
export declare const InfoState: React.NamedExoticComponent<{
    title: string;
    description?: string;
    onAction?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}>;
/**
 * Loading State (with animated icon)
 */
export declare const LoadingState: React.NamedExoticComponent<{
    title?: string;
    description?: string;
    className?: string;
}>;
/**
 * Offline State
 */
export declare const OfflineState: React.NamedExoticComponent<{
    onRetry?: () => void;
    className?: string;
}>;
//# sourceMappingURL=empty-state.d.ts.map