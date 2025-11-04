/**
 * Citation Card Component
 *
 * Displays RAG sources/citations with expandable preview
 */
import * as React from 'react';
import type { Citation } from '../adapters/types';
export interface CitationCardProps {
    /** Citation data */
    citation: Citation;
    /** Show expanded view by default */
    defaultExpanded?: boolean;
    /** Maximum characters for preview (before truncation) */
    previewLength?: number;
    /** Show confidence score badge */
    showConfidence?: boolean;
    /** Callback when citation is clicked */
    onClick?: (citation: Citation) => void;
    /** Callback when source link is clicked */
    onSourceClick?: (url: string) => void;
    /** Additional CSS class */
    className?: string;
}
export declare const CitationCard: React.NamedExoticComponent<CitationCardProps>;
//# sourceMappingURL=citation-card.d.ts.map