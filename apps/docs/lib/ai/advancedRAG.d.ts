/**
 * Advanced RAG Features
 *
 * Multi-turn conversation awareness, follow-up detection,
 * and contextual search refinement for better responses.
 */
import type { SearchResult } from './vectorStore';
export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
    sources?: SearchResult[];
}
export interface ConversationContext {
    /** Recent messages for context */
    recentMessages: ConversationMessage[];
    /** Previously discussed topics */
    discussedTopics: string[];
    /** Previously cited sources */
    citedSources: SearchResult[];
    /** Current conversation focus */
    currentTopic?: string;
}
/**
 * Detect if a query is a follow-up question
 */
export declare function isFollowUpQuestion(query: string, conversationHistory: ConversationMessage[]): boolean;
/**
 * Extract key topics from conversation history
 */
export declare function extractTopics(messages: ConversationMessage[]): string[];
/**
 * Build conversation context from message history
 */
export declare function buildConversationContext(messages: ConversationMessage[], maxMessages?: number): ConversationContext;
/**
 * Enhance query with conversation context for better retrieval
 */
export declare function enhanceQueryWithContext(query: string, context: ConversationContext): string;
/**
 * Re-rank results based on conversation context
 */
export declare function rerankWithConversationContext(query: string, results: SearchResult[], context: ConversationContext): SearchResult[];
/**
 * Retrieve documents with conversation context awareness
 */
export declare function retrieveWithContext(query: string, conversationHistory: ConversationMessage[], options?: {
    topK?: number;
    minScore?: number;
    maxMessages?: number;
}): Promise<{
    results: SearchResult[];
    enhancedQuery: string;
    isFollowUp: boolean;
    context: ConversationContext;
}>;
/**
 * Generate contextual system prompt that includes conversation awareness
 */
export declare function generateContextualSystemPrompt(basePrompt: string, context: ConversationContext, isFollowUp: boolean): string;
/**
 * Format conversation history for context window
 */
export declare function formatConversationHistory(messages: ConversationMessage[], maxLength?: number): string;
/**
 * Detect topic shifts in conversation
 */
export declare function detectTopicShift(currentQuery: string, conversationHistory: ConversationMessage[]): {
    hasShifted: boolean;
    previousTopic?: string;
    newTopic?: string;
};
//# sourceMappingURL=advancedRAG.d.ts.map