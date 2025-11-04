/**
 * Content Filtering Utilities
 *
 * Simple keyword-based content filtering. For production, integrate with
 * services like OpenAI Moderation API, Azure Content Safety, or Perspective API.
 */
import type { SafetyCheck, SafetyGuardrail } from './types';
export interface ContentFilterOptions {
    /** Categories to check */
    categories?: string[];
    /** Custom keyword lists */
    keywords?: Record<string, string[]>;
    /** Threshold for blocking (0-1) */
    threshold?: number;
}
export declare class ContentFilter {
    private keywords;
    private threshold;
    constructor(options?: ContentFilterOptions);
    /**
     * Check content against filters
     */
    check(content: string): {
        flagged: boolean;
        categories: string[];
        scores: Record<string, number>;
    };
    /**
     * Add keywords to a category
     */
    addKeywords(category: string, keywords: string[]): void;
    /**
     * Remove keywords from a category
     */
    removeKeywords(category: string, keywords: string[]): void;
}
/**
 * Content Filter Guardrail
 */
export declare class ContentFilterGuardrail implements SafetyGuardrail {
    name: string;
    private filter;
    constructor(options?: ContentFilterOptions);
    check(content: string): SafetyCheck;
    /**
     * Get the underlying filter for customization
     */
    getFilter(): ContentFilter;
}
//# sourceMappingURL=content-filter.d.ts.map