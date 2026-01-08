/**
 * Advanced Search Utilities for MCP Server
 *
 * Provides fuzzy matching, intelligent search suggestions,
 * and semantic search capabilities.
 *
 * @module utils/search
 */
export interface SearchOptions {
    /** Minimum similarity score (0-1) */
    threshold?: number;
    /** Maximum results to return */
    limit?: number;
    /** Fields to search in (for objects) */
    fields?: string[];
    /** Boost scores for specific fields */
    fieldBoosts?: Record<string, number>;
    /** Enable fuzzy matching */
    fuzzy?: boolean;
    /** Enable prefix matching */
    prefix?: boolean;
    /** Enable substring matching */
    substring?: boolean;
    /** Case sensitive matching */
    caseSensitive?: boolean;
}
export interface SearchResult<T> {
    item: T;
    score: number;
    matches: SearchMatch[];
}
export interface SearchMatch {
    field: string;
    value: string;
    indices: [number, number][];
    score: number;
}
/**
 * Calculate similarity score (0-1) between two strings
 */
export declare function stringSimilarity(a: string, b: string): number;
/**
 * Advanced search engine with fuzzy matching
 */
export declare class SearchEngine<T> {
    private items;
    private defaultOptions;
    constructor(items?: T[], defaultOptions?: Partial<SearchOptions>);
    /**
     * Add items to the search index
     */
    add(items: T | T[]): void;
    /**
     * Remove items from the search index
     */
    remove(predicate: (item: T) => boolean): number;
    /**
     * Clear all items
     */
    clear(): void;
    /**
     * Search for items matching a query
     */
    search(query: string, options?: Partial<SearchOptions>): SearchResult<T>[];
    /**
     * Get searchable values from an item
     */
    private getSearchableValues;
    /**
     * Match a value against a query using multiple strategies
     */
    private matchValue;
    /**
     * Get search suggestions based on partial query
     */
    getSuggestions(query: string, options?: Partial<SearchOptions>): string[];
    /**
     * Get item count
     */
    get count(): number;
}
/**
 * Highlight matches in a string
 */
export declare function highlightMatches(text: string, indices: [number, number][], startTag?: string, endTag?: string): string;
/**
 * Tokenize a query into words
 */
export declare function tokenizeQuery(query: string): string[];
/**
 * Score a multi-word query match
 */
export declare function scoreMultiWordMatch(text: string, query: string, options?: Partial<SearchOptions>): number;
/**
 * Create a search-friendly string from an object
 */
export declare function createSearchableString(obj: Record<string, unknown>): string;
/**
 * Component search options
 */
export declare const componentSearchOptions: SearchOptions;
/**
 * Hook search options
 */
export declare const hookSearchOptions: SearchOptions;
//# sourceMappingURL=search.d.ts.map