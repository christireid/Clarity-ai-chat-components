/**
 * Reference-Based Data Handling
 *
 * Use references instead of sending full data to reduce payload size.
 * Can save 50%+ on large documents or attachments.
 */
/**
 * Calculate data size in bytes
 */
function calculateSize(data) {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    return new Blob([str]).size;
}
/**
 * Reference handler for managing data references
 *
 * @example
 * ```tsx
 * const handler = new ReferenceHandler()
 *
 * // Store large document
 * const docRef = handler.create('document', largeDocument)
 *
 * // Send only reference to API
 * await api.query({
 *   message: 'Summarize this',
 *   documentRef: docRef.id // Only ~20 bytes instead of full doc
 * })
 *
 * // Retrieve data when needed
 * const doc = handler.resolve(docRef.id)
 * ```
 */
export class ReferenceHandler {
    options;
    references = new Map();
    stats = {
        totalReferences: 0,
        totalDataSize: 0,
        payloadSaved: 0,
        averageCompressionRatio: 0,
        hitRate: 0,
    };
    hits = 0;
    misses = 0;
    constructor(options = {}) {
        this.options = options;
        this.options.maxSize = options.maxSize ?? 100;
        this.options.defaultTTL = options.defaultTTL ?? 0; // 0 = no expiry
    }
    /**
     * Create reference for data
     */
    create(type, data, options) {
        const id = this.generateId();
        const size = calculateSize(data);
        const timestamp = Date.now();
        const referencedData = {
            refId: id,
            data,
            size,
            timestamp,
            accessCount: 0,
            lastAccessed: timestamp,
            ttl: options?.ttl ?? this.options.defaultTTL,
        };
        this.references.set(id, referencedData);
        // Update stats
        this.stats.totalReferences++;
        this.stats.totalDataSize += size;
        // Reference ID is much smaller than actual data
        const referenceSize = id.length + 20; // ID + overhead
        this.stats.payloadSaved += size - referenceSize;
        this.updateCompressionRatio();
        // Enforce max size
        if (this.references.size > this.options.maxSize) {
            this.evictLRU();
        }
        const reference = {
            id,
            type,
            metadata: options?.metadata,
            timestamp,
            size,
        };
        return reference;
    }
    /**
     * Resolve reference to get data
     */
    resolve(refId) {
        const ref = this.references.get(refId);
        if (!ref) {
            this.misses++;
            this.updateHitRate();
            return null;
        }
        // Check expiry
        if (ref.ttl && ref.ttl > 0 && Date.now() - ref.timestamp > ref.ttl) {
            this.references.delete(refId);
            this.misses++;
            this.updateHitRate();
            return null;
        }
        // Update access info
        ref.accessCount++;
        ref.lastAccessed = Date.now();
        this.hits++;
        this.updateHitRate();
        return ref.data;
    }
    /**
     * Check if reference exists
     */
    exists(refId) {
        return this.references.has(refId);
    }
    /**
     * Delete reference
     */
    delete(refId) {
        return this.references.delete(refId);
    }
    /**
     * Clear all references
     */
    clear() {
        this.references.clear();
        this.resetStats();
    }
    /**
     * Clear expired references
     */
    clearExpired() {
        const now = Date.now();
        for (const [id, ref] of this.references.entries()) {
            if (ref.ttl && ref.ttl > 0 && now - ref.timestamp > ref.ttl) {
                this.references.delete(id);
            }
        }
    }
    /**
     * Get all references
     */
    getAll() {
        return Array.from(this.references.values()).map((ref) => ({
            id: ref.refId,
            type: 'custom',
            timestamp: ref.timestamp,
            size: ref.size,
        }));
    }
    /**
     * Get statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Evict least recently used reference
     */
    evictLRU() {
        let oldestRef = null;
        let oldestTime = Infinity;
        for (const [id, ref] of this.references.entries()) {
            const score = ref.lastAccessed - (ref.accessCount * 10000);
            if (score < oldestTime) {
                oldestTime = score;
                oldestRef = id;
            }
        }
        if (oldestRef) {
            const ref = this.references.get(oldestRef);
            this.references.delete(oldestRef);
            if (ref) {
                this.options.onEvict?.(ref);
            }
        }
    }
    /**
     * Update compression ratio
     */
    updateCompressionRatio() {
        if (this.stats.totalReferences === 0) {
            this.stats.averageCompressionRatio = 0;
            return;
        }
        const avgDataSize = this.stats.totalDataSize / this.stats.totalReferences;
        const avgReferenceSize = 40; // Approximate reference size
        this.stats.averageCompressionRatio = avgDataSize / avgReferenceSize;
    }
    /**
     * Update hit rate
     */
    updateHitRate() {
        const total = this.hits + this.misses;
        this.stats.hitRate = total > 0 ? (this.hits / total) * 100 : 0;
    }
    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = {
            totalReferences: 0,
            totalDataSize: 0,
            payloadSaved: 0,
            averageCompressionRatio: 0,
            hitRate: 0,
        };
        this.hits = 0;
        this.misses = 0;
    }
    /**
     * Generate unique ID
     */
    generateId() {
        return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
/**
 * Create a reference context for conversation history
 * Replaces full history with references to previous messages
 */
export function createConversationReference(messages, handler) {
    // Store full conversation
    const fullConversation = JSON.stringify(messages);
    const ref = handler.create('conversation', messages, {
        metadata: { messageCount: messages.length },
    });
    // Create compressed version with only recent messages + reference
    const recentCount = Math.min(3, messages.length);
    const recentMessages = messages.slice(-recentCount);
    const compressedMessages = [
        {
            role: 'system',
            content: `[Previous conversation: ${ref.id}]`,
            ref: ref.id,
        },
        ...recentMessages,
    ];
    const compressedSize = calculateSize(compressedMessages);
    const originalSize = calculateSize(messages);
    const savedBytes = originalSize - compressedSize;
    return {
        reference: ref,
        compressedMessages,
        savedBytes,
    };
}
//# sourceMappingURL=reference-handler.js.map