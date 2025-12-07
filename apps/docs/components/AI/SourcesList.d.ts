import { type Source } from './SourceCard';
export interface SourcesListProps {
    sources: Source[];
    className?: string;
    variant?: 'default' | 'compact';
    collapsible?: boolean;
    defaultExpanded?: boolean;
    maxVisible?: number;
}
export declare function SourcesList({ sources, className, variant, collapsible, defaultExpanded, maxVisible, }: SourcesListProps): import("react/jsx-runtime").JSX.Element | null;
/**
 * Inline sources display (for embedding in text)
 */
export declare function InlineSources({ sources, className, }: {
    sources: Source[];
    className?: string;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=SourcesList.d.ts.map