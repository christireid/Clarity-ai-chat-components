/**
 * Smart Suggestions
 *
 * Generate contextual follow-up question suggestions based on
 * conversation context, sources, and common patterns.
 */
import type { SearchResult } from './vectorStore';
import { type ConversationMessage } from './advancedRAG';
export interface Suggestion {
    id: string;
    question: string;
    category: 'exploration' | 'clarification' | 'practical' | 'related';
    relevance: number;
    icon?: string;
}
export interface SuggestionContext {
    /** Recent messages for context */
    recentMessages: ConversationMessage[];
    /** Sources cited in last response */
    lastSources?: SearchResult[];
    /** Current topic */
    currentTopic?: string;
    /** User's last query */
    lastQuery?: string;
}
/**
 * Generate follow-up suggestions based on context
 */
export declare function generateSuggestions(context: SuggestionContext): Suggestion[];
/**
 * Get category-based suggestions
 */
export declare function getSuggestionsByCategory(category: Suggestion['category']): Suggestion[];
/**
 * Get default suggestions for new conversations
 */
export declare function getDefaultSuggestions(): Suggestion[];
//# sourceMappingURL=suggestions.d.ts.map