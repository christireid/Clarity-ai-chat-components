export interface Source {
    url: string;
    title: string;
    score?: number;
    snippet?: string;
    type?: 'documentation' | 'guide' | 'api' | 'example' | 'other';
}
export interface SourceCardProps {
    source: Source;
    index?: number;
    expanded?: boolean;
    onToggle?: () => void;
    className?: string;
    variant?: 'default' | 'compact';
}
export declare function SourceCard({ source, index, expanded, onToggle, className, variant, }: SourceCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SourceCard.d.ts.map