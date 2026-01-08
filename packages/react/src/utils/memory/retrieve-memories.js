/**
 * retrieveMemories - Low-level utility for retrieving memories
 *
 * Primitive function for retrieving relevant memories from memory store.
 * Used internally by memory system and available for custom implementations.
 */
/**
 * retrieveMemories - Retrieve relevant memories
 *
 * Low-level utility for querying memory store. Used by memory system
 * and available for custom memory retrieval strategies.
 */
export async function retrieveMemories(query, memoryService, options = {}) {
    const { limit = 10, threshold = 0.7, types } = options;
    if (!memoryService) {
        return [];
    }
    try {
        const memoryQuery = {
            query,
            limit,
            minConfidence: threshold,
            types,
        };
        const results = await memoryService.query(memoryQuery);
        return results.map((r) => r.memory);
    }
    catch (error) {
        logger.logger.error('Failed to retrieve memories:', error);
        return [];
    }
}
//# sourceMappingURL=retrieve-memories.js.map