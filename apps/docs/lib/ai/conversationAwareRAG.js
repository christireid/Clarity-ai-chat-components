/**
 * Conversation-Aware RAG
 *
 * High-level interface for RAG with conversation context awareness.
 * Integrates multi-turn context, follow-up detection, and contextual reranking.
 */
import { retrieveWithContext, buildConversationContext, generateContextualSystemPrompt, detectTopicShift, formatConversationHistory, } from './advancedRAG';
import { buildContext, formatCitations } from './rag';
/**
 * Perform conversation-aware RAG retrieval
 */
export async function conversationAwareRAG(userQuery, options = {}) {
    const { conversationHistory = [], topK = 5, minScore = 0.7, maxContextLength = 4000, maxConversationMessages = 5, baseSystemPrompt = '', currentPath = '/', } = options;
    // Detect topic shift
    const topicShift = detectTopicShift(userQuery, conversationHistory);
    if (topicShift.hasShifted) {
        console.log(`📊 Topic shift detected: ${topicShift.previousTopic} → ${topicShift.newTopic}`);
    }
    // Retrieve with conversation context
    const { results: sources, enhancedQuery, isFollowUp, context: conversationContext, } = await retrieveWithContext(userQuery, conversationHistory, {
        topK,
        minScore,
        maxMessages: maxConversationMessages,
    });
    console.log(`🔍 Retrieved ${sources.length} sources (follow-up: ${isFollowUp})`);
    // Build documentation context
    const docContext = buildContext(sources, maxContextLength);
    // Build conversation history context
    const conversationHistoryText = formatConversationHistory(conversationContext.recentMessages, Math.floor(maxContextLength * 0.2) // Use 20% of context for conversation
    );
    // Combine contexts
    let combinedContext = '';
    if (conversationHistoryText) {
        combinedContext += conversationHistoryText + '\n\n';
    }
    combinedContext += docContext;
    // Generate contextual system prompt
    const systemPrompt = generateContextualSystemPrompt(baseSystemPrompt, conversationContext, isFollowUp);
    // Format citations
    const citations = formatCitations(sources);
    // Build enhanced message
    let enhancedMessage = `User Question: ${userQuery}\n\n`;
    if (isFollowUp && conversationContext.currentTopic) {
        enhancedMessage += `**Context:** This is a follow-up question about ${conversationContext.currentTopic}.\n\n`;
    }
    if (sources.length > 0) {
        enhancedMessage += `I found ${sources.length} relevant documentation sections:\n\n`;
        enhancedMessage += combinedContext;
        enhancedMessage += '\n\nPlease provide a helpful answer based on the documentation above. ';
        if (isFollowUp) {
            enhancedMessage += 'Reference our previous discussion where appropriate. ';
        }
        enhancedMessage += 'Include code examples and links to relevant pages.\n';
    }
    else {
        enhancedMessage += 'No specific documentation found. ';
        enhancedMessage += 'Please provide a general answer or suggest where to find this information.\n';
    }
    return {
        sources,
        context: combinedContext,
        systemPrompt,
        enhancedMessage,
        citations,
        isFollowUp,
        conversationContext,
        topicShift,
        metadata: {
            originalQuery: userQuery,
            enhancedQuery,
            sourcesFound: sources.length,
            conversationMessagesUsed: conversationContext.recentMessages.length,
        },
    };
}
/**
 * Convert chat messages to ConversationMessage format
 */
export function convertToChatHistory(messages) {
    return messages
        .filter(m => m.role !== 'system') // Exclude system messages
        .map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
    }));
}
/**
 * Simplified helper for common use case
 */
export async function enhanceWithConversation(userQuery, chatHistory, systemPrompt) {
    const conversationHistory = convertToChatHistory(chatHistory);
    const result = await conversationAwareRAG(userQuery, {
        conversationHistory,
        baseSystemPrompt: systemPrompt,
    });
    return {
        enhancedMessage: result.enhancedMessage,
        systemPrompt: result.systemPrompt,
        citations: result.citations,
        isFollowUp: result.isFollowUp,
    };
}
/**
 * Get conversation insights for analytics/debugging
 */
export function getConversationInsights(conversationHistory) {
    const context = buildConversationContext(conversationHistory, 100);
    const userMessages = conversationHistory.filter(m => m.role === 'user').length;
    const assistantMessages = conversationHistory.filter(m => m.role === 'assistant').length;
    const totalLength = conversationHistory.reduce((sum, m) => sum + m.content.length, 0);
    const averageMessageLength = conversationHistory.length > 0
        ? Math.round(totalLength / conversationHistory.length)
        : 0;
    return {
        messageCount: conversationHistory.length,
        userMessages,
        assistantMessages,
        topics: context.discussedTopics,
        averageMessageLength,
        hasFollowUps: conversationHistory.some((_, i, arr) => i > 0 // At least one previous message
        ),
    };
}
//# sourceMappingURL=conversationAwareRAG.js.map