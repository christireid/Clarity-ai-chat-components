/**
 * Conversation-Aware RAG
 *
 * High-level interface for RAG with conversation context awareness.
 * Integrates multi-turn context, follow-up detection, and contextual reranking.
 */
import { type ConversationMessage, type ConversationContext } from './advancedRAG';
import { type Citation } from './rag';
import type { SearchResult } from './vectorStore';
export interface ConversationAwareRAGOptions {
    /** Conversation history for context */
    conversationHistory?: ConversationMessage[];
    /** Number of documents to retrieve */
    topK?: number;
    /** Minimum similarity score */
    minScore?: number;
    /** Maximum context length in characters */
    maxContextLength?: number;
    /** Maximum conversation messages to consider */
    maxConversationMessages?: number;
    /** Base system prompt */
    baseSystemPrompt?: string;
    /** Current page path */
    currentPath?: string;
}
export interface ConversationAwareRAGResult {
    /** Retrieved and ranked sources */
    sources: SearchResult[];
    /** Formatted context for LLM */
    context: string;
    /** Complete system prompt with context */
    systemPrompt: string;
    /** Enhanced user message */
    enhancedMessage: string;
    /** Citations for UI display */
    citations: Citation[];
    /** Whether this was detected as a follow-up */
    isFollowUp: boolean;
    /** Conversation context used */
    conversationContext: ConversationContext;
    /** Whether a topic shift was detected */
    topicShift?: {
        hasShifted: boolean;
        previousTopic?: string;
        newTopic?: string;
    };
    /** Metadata about the retrieval */
    metadata: {
        originalQuery: string;
        enhancedQuery: string;
        sourcesFound: number;
        conversationMessagesUsed: number;
    };
}
/**
 * Perform conversation-aware RAG retrieval
 */
export declare function conversationAwareRAG(userQuery: string, options?: ConversationAwareRAGOptions): Promise<ConversationAwareRAGResult>;
/**
 * Convert chat messages to ConversationMessage format
 */
export declare function convertToChatHistory(messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string;
}>): ConversationMessage[];
/**
 * Simplified helper for common use case
 */
export declare function enhanceWithConversation(userQuery: string, chatHistory: Array<{
    role: string;
    content: string;
}>, systemPrompt: string): Promise<{
    enhancedMessage: string;
    systemPrompt: string;
    citations: Citation[];
    isFollowUp: boolean;
}>;
/**
 * Get conversation insights for analytics/debugging
 */
export declare function getConversationInsights(conversationHistory: ConversationMessage[]): {
    messageCount: number;
    userMessages: number;
    assistantMessages: number;
    topics: string[];
    averageMessageLength: number;
    hasFollowUps: boolean;
};
//# sourceMappingURL=conversationAwareRAG.d.ts.map