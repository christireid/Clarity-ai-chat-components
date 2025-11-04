/**
 * Content Filtering Utilities
 *
 * Simple keyword-based content filtering. For production, integrate with
 * services like OpenAI Moderation API, Azure Content Safety, or Perspective API.
 */
export class ContentFilter {
    constructor(options) {
        this.keywords = {
            profanity: [],
            hate_speech: [],
            violence: [],
            sexual: [],
            spam: [],
        };
        if (options?.keywords) {
            this.keywords = { ...this.keywords, ...options.keywords };
        }
        this.threshold = options?.threshold || 0.7;
    }
    /**
     * Check content against filters
     */
    check(content) {
        const lowerContent = content.toLowerCase();
        const categories = [];
        const scores = {};
        for (const [category, words] of Object.entries(this.keywords)) {
            let matches = 0;
            for (const word of words) {
                if (lowerContent.includes(word.toLowerCase())) {
                    matches++;
                }
            }
            const score = words.length > 0 ? matches / words.length : 0;
            scores[category] = score;
            if (score >= this.threshold) {
                categories.push(category);
            }
        }
        return {
            flagged: categories.length > 0,
            categories,
            scores,
        };
    }
    /**
     * Add keywords to a category
     */
    addKeywords(category, keywords) {
        if (!this.keywords[category]) {
            this.keywords[category] = [];
        }
        this.keywords[category].push(...keywords);
    }
    /**
     * Remove keywords from a category
     */
    removeKeywords(category, keywords) {
        if (this.keywords[category]) {
            this.keywords[category] = this.keywords[category].filter((k) => !keywords.includes(k));
        }
    }
}
/**
 * Content Filter Guardrail
 */
export class ContentFilterGuardrail {
    constructor(options) {
        this.name = 'content-filter';
        this.filter = new ContentFilter(options);
    }
    check(content) {
        const result = this.filter.check(content);
        return {
            name: this.name,
            passed: !result.flagged,
            confidence: result.flagged
                ? Math.max(...Object.values(result.scores))
                : 1.0,
            details: result.flagged
                ? `Flagged for: ${result.categories.join(', ')}`
                : 'Content passed all filters',
            action: result.flagged ? 'block' : 'allow',
        };
    }
    /**
     * Get the underlying filter for customization
     */
    getFilter() {
        return this.filter;
    }
}
//# sourceMappingURL=content-filter.js.map