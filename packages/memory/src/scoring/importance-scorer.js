/**
 * Importance Scorer
 *
 * Calculates memory importance scores based on multiple factors
 */
export class ImportanceScorer {
    /**
     * Score a memory
     */
    score(memory, query) {
        const base = memory.importance ?? 0.5;
        const recency = this.calculateRecency(memory);
        const frequency = this.calculateFrequency(memory);
        const userBoost = memory.scope === 'user' ? 0.1 : 0;
        const semanticRelevance = query ? 0.5 : 0.5; // TODO: Calculate semantic relevance
        const weights = {
            recencyWeight: 0.3,
            frequencyWeight: 0.2,
            relevanceWeight: 0.3,
        };
        const final = base * 0.2 +
            recency * weights.recencyWeight +
            frequency * weights.frequencyWeight +
            semanticRelevance * weights.relevanceWeight +
            userBoost;
        return {
            base,
            recency,
            frequency,
            userBoost,
            semanticRelevance,
            final: Math.min(1, Math.max(0, final)),
            breakdown: weights,
        };
    }
    calculateRecency(memory) {
        const ageMs = Date.now() - (memory.timestamp ?? memory.createdAt).getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        // Exponential decay: newer memories score higher
        return Math.exp(-ageDays / 7); // Half-life of 7 days
    }
    calculateFrequency(memory) {
        // More accesses = higher importance
        const accesses = memory.accessCount;
        return Math.min(1, accesses / 10); // Normalize to 0-1 with 10 accesses = max
    }
}
//# sourceMappingURL=importance-scorer.js.map