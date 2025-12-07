import type { Suggestion } from '@/lib/ai/suggestions';
export interface SuggestionsPanelProps {
    suggestions: Suggestion[];
    onSelectSuggestion?: (suggestion: Suggestion) => void;
    className?: string;
    variant?: 'default' | 'compact' | 'inline';
    title?: string;
    showIcons?: boolean;
}
export declare function SuggestionsPanel({ suggestions, onSelectSuggestion, className, variant, title, showIcons, }: SuggestionsPanelProps): import("react/jsx-runtime").JSX.Element | null;
/**
 * Suggestion chips for quick access
 */
export declare function SuggestionChips({ suggestions, onSelectSuggestion, className, maxVisible, }: {
    suggestions: Suggestion[];
    onSelectSuggestion?: (suggestion: Suggestion) => void;
    className?: string;
    maxVisible?: number;
}): import("react/jsx-runtime").JSX.Element | null;
/**
 * Floating suggestions bubble
 */
export declare function FloatingSuggestions({ suggestions, onSelectSuggestion, onDismiss, className, }: {
    suggestions: Suggestion[];
    onSelectSuggestion?: (suggestion: Suggestion) => void;
    onDismiss?: () => void;
    className?: string;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=SuggestionsPanel.d.ts.map