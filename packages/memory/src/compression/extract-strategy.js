/**
 * Extract Compression Strategy
 *
 * Extracts key information using simple heuristics
 */
import { countTokens } from '../utils/token-counter';
export class ExtractStrategy {
    canCompress(memory) {
        return memory.content.length > 200;
    }
    async compress(memory, targetRatio) {
        const original = memory.content;
        // Extract key sentences (simple heuristic: sentences with important words)
        const sentences = this.splitSentences(original);
        const importantWords = this.extractImportantWords(original);
        // Score sentences by importance
        const scoredSentences = sentences.map(sentence => ({
            sentence,
            score: this.scoreSentence(sentence, importantWords),
        }));
        // Sort by score and take top sentences
        scoredSentences.sort((a, b) => b.score - a.score);
        const targetSentences = Math.max(1, Math.floor(sentences.length * targetRatio));
        const extracted = scoredSentences
            .slice(0, targetSentences)
            .map(s => s.sentence)
            .join(' ')
            .trim();
        const originalTokens = this.countTokens(original);
        const compressedTokens = this.countTokens(extracted);
        const compressionRatio = compressedTokens / originalTokens;
        return {
            compressed: extracted,
            original,
            compressionRatio,
            tokensSaved: originalTokens - compressedTokens,
            method: 'extract',
        };
    }
    splitSentences(text) {
        return text
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }
    extractImportantWords(text) {
        // Simple keyword extraction (in production, use NLP)
        const words = text.toLowerCase().split(/\s+/);
        const wordFreq = new Map();
        for (const word of words) {
            const cleaned = word.replace(/[^\w]/g, '');
            if (cleaned.length > 3) {
                wordFreq.set(cleaned, (wordFreq.get(cleaned) || 0) + 1);
            }
        }
        // Get top words
        const sorted = Array.from(wordFreq.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
        return new Set(sorted);
    }
    scoreSentence(sentence, importantWords) {
        const words = sentence.toLowerCase().split(/\s+/);
        let score = 0;
        for (const word of words) {
            const cleaned = word.replace(/[^\w]/g, '');
            if (importantWords.has(cleaned)) {
                score += 1;
            }
        }
        // Boost for question words and action verbs
        if (/^(what|who|when|where|why|how|can|should|will|must)/i.test(sentence)) {
            score += 2;
        }
        return score;
    }
    countTokens(text) {
        return countTokens(text);
    }
}
//# sourceMappingURL=extract-strategy.js.map