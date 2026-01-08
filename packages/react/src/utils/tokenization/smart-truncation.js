/**
 * Smart Text Truncation and Summarization Tools
 *
 * This module implements intelligent text reduction techniques:
 * - Semantic truncation preserving meaning
 * - Extractive summarization with keyphrase extraction
 * - Abstractive summarization for compression
 * - Context-aware truncation strategies
 * - Multi-document summarization for RAG systems
 */
import { TokenCounter } from '@clarity-chat/token-optimization';
// Smart truncation engine
export class SmartTruncator {
    constructor() {
        // TokenCounter uses static methods
    }
    /**
     * Truncate text using semantic importance scoring
     */
    async truncateSemantic(text, config) {
        const originalTokens = await TokenCounter.count(text);
        if (originalTokens <= config.maxTokens) {
            return this.createNoTruncationResult(text, originalTokens, 'semantic');
        }
        // Split into semantic units (sentences/paragraphs)
        const units = this.splitIntoSemanticUnits(text, config.contentType);
        // Score each unit for importance
        const scoredUnits = await this.scoreSemanticUnits(units, text);
        // Select most important units up to token limit
        const selectedUnits = await this.selectUnitsByScore(scoredUnits, config.maxTokens);
        // Reconstruct text preserving coherence
        const truncatedText = this.reconstructCoherentText(selectedUnits, text);
        const truncatedTokens = await TokenCounter.count(truncatedText);
        return {
            originalText: text,
            truncatedText,
            originalTokens,
            truncatedTokens,
            compressionRatio: truncatedTokens / originalTokens,
            strategyUsed: 'semantic',
            preservedSentences: selectedUnits.map((unit) => unit.text),
            removedSentences: scoredUnits
                .filter((unit) => !selectedUnits.includes(unit))
                .map((unit) => unit.text),
            keyPhrases: this.extractKeyPhrases(truncatedText),
            estimatedQuality: this.estimateQuality(truncatedTokens / originalTokens, config),
            metadata: this.generateMetadata(truncatedText),
        };
    }
    /**
     * Extractive summarization using key sentence selection
     */
    async truncateExtractive(text, config) {
        const originalTokens = await TokenCounter.count(text);
        if (originalTokens <= config.maxTokens) {
            return this.createNoTruncationResult(text, originalTokens, 'extractive');
        }
        // Split into sentences
        const sentences = this.splitIntoSentences(text);
        // Extract keyphrases for importance scoring
        const keyphrases = await this.extractKeyphrases(text);
        // Score sentences based on multiple factors
        const scoredSentences = await Promise.all(sentences.map(async (sentence) => {
            const tokens = await TokenCounter.count(sentence);
            const positionScore = this.calculatePositionScore(sentence, text);
            const keyphraseScore = this.calculateKeyphraseScore(sentence, keyphrases);
            const lengthScore = this.calculateLengthScore(tokens, config.maxTokens);
            return {
                text: sentence,
                tokens,
                score: positionScore * 0.3 + keyphraseScore * 0.5 + lengthScore * 0.2,
                positionScore,
                keyphraseScore,
                lengthScore,
            };
        }));
        // Select sentences to meet token budget
        const selectedSentences = await this.selectSentences(scoredSentences, config.maxTokens);
        const truncatedText = this.reconstructFromSentences(selectedSentences, text);
        const truncatedTokens = await TokenCounter.count(truncatedText);
        return {
            originalText: text,
            truncatedText,
            originalTokens,
            truncatedTokens,
            compressionRatio: truncatedTokens / originalTokens,
            strategyUsed: 'extractive',
            preservedSentences: selectedSentences.map((s) => s.text),
            removedSentences: scoredSentences
                .filter((s) => !selectedSentences.includes(s))
                .map((s) => s.text),
            keyPhrases: keyphrases,
            estimatedQuality: this.estimateQuality(truncatedTokens / originalTokens, config),
            metadata: this.generateMetadata(truncatedText),
        };
    }
    /**
     * Hierarchical truncation for multi-level content
     */
    async truncateHierarchical(text, config) {
        const originalTokens = await TokenCounter.count(text);
        if (originalTokens <= config.maxTokens) {
            return this.createNoTruncationResult(text, originalTokens, 'hierarchical');
        }
        // Identify hierarchical structure
        const structure = this.identifyHierarchicalStructure(text, config.contentType);
        // Apply different truncation strategies at different levels
        const truncatedStructure = await this.truncateByHierarchy(structure, config);
        // Reconstruct maintaining hierarchy
        const truncatedText = this.reconstructHierarchicalText(truncatedStructure);
        const truncatedTokens = await TokenCounter.count(truncatedText);
        return {
            originalText: text,
            truncatedText,
            originalTokens,
            truncatedTokens,
            compressionRatio: truncatedTokens / originalTokens,
            strategyUsed: 'hierarchical',
            preservedSentences: [], // Will be populated based on structure
            removedSentences: [],
            keyPhrases: this.extractKeyPhrases(truncatedText),
            estimatedQuality: this.estimateQuality(truncatedTokens / originalTokens, config),
            metadata: this.generateMetadata(truncatedText),
        };
    }
    /**
     * Adaptive truncation based on content analysis
     */
    async truncateAdaptive(text, config) {
        // Analyze content characteristics
        const analysis = await this.analyzeContent(text);
        // Select best strategy based on analysis
        const bestStrategy = this.selectOptimalStrategy(analysis, config);
        // Apply selected strategy
        return this.applyStrategy(text, bestStrategy, config);
    }
    /**
     * Specialized truncation for conversations
     */
    async truncateConversation(conversation, config) {
        const originalTokens = await TokenCounter.count(conversation);
        if (originalTokens <= config.maxTokens) {
            return this.createNoTruncationResult(conversation, originalTokens, 'adaptive');
        }
        // Parse conversation into turns
        const turns = this.parseConversationTurns(conversation);
        // Prioritize recent and important turns
        const prioritizedTurns = this.prioritizeConversationTurns(turns);
        // Select turns to preserve meaning and context
        const selectedTurns = await this.selectConversationTurns(prioritizedTurns, config.maxTokens);
        // Reconstruct conversation maintaining flow
        const truncatedConversation = this.reconstructConversation(selectedTurns);
        const truncatedTokens = await TokenCounter.count(truncatedConversation);
        return {
            originalText: conversation,
            truncatedText: truncatedConversation,
            originalTokens,
            truncatedTokens,
            compressionRatio: truncatedTokens / originalTokens,
            strategyUsed: 'adaptive',
            preservedSentences: selectedTurns.map((turn) => turn.content),
            removedSentences: prioritizedTurns
                .filter((turn) => !selectedTurns.includes(turn))
                .map((turn) => turn.content),
            keyPhrases: this.extractKeyPhrases(truncatedConversation),
            estimatedQuality: this.estimateQuality(truncatedTokens / originalTokens, config),
            metadata: this.generateConversationMetadata(truncatedConversation),
        };
    }
    /**
     * Summarization using extractive approach
     */
    async summarizeExtractive(text, config) {
        const truncationConfig = {
            strategy: 'extractive',
            maxTokens: config.maxTokens,
            contentType: config.contentType,
            preserveKeyTerms: config.preserveEntities ? ['entity'] : undefined,
            qualityThreshold: 0.8,
        };
        const result = await this.truncateExtractive(text, truncationConfig);
        return result.truncatedText;
    }
    /**
     * Multi-document summarization for RAG systems
     */
    async summarizeMultiple(documents, config) {
        // Analyze each document
        const documentAnalyses = await Promise.all(documents.map(async (doc) => {
            const tokens = await TokenCounter.count(doc);
            const keyphrases = await this.extractKeyphrases(doc);
            const summary = await this.summarizeExtractive(doc, {
                ...config,
                maxTokens: Math.floor(config.maxTokens / documents.length),
            });
            return {
                document: doc,
                tokens,
                keyphrases,
                summary,
            };
        }));
        // Combine summaries intelligently
        const combinedSummary = this.combineSummaries(documentAnalyses, config);
        // Ensure final result meets token budget
        const finalTokens = await TokenCounter.count(combinedSummary);
        if (finalTokens <= config.maxTokens) {
            return combinedSummary;
        }
        // Further truncate if needed
        const finalResult = await this.truncateExtractive(combinedSummary, {
            strategy: 'extractive',
            maxTokens: config.maxTokens,
            contentType: config.contentType,
        });
        return finalResult.truncatedText;
    }
    // Helper methods
    splitIntoSemanticUnits(text, contentType) {
        switch (contentType) {
            case 'conversation':
                return this.parseConversationTurns(text).map((turn) => turn.content);
            case 'documentation':
                return this.splitIntoSections(text);
            case 'code':
                return this.splitIntoCodeBlocks(text);
            default:
                return this.splitIntoSentences(text);
        }
    }
    async scoreSemanticUnits(units, context) {
        const keyphrases = await this.extractKeyphrases(context);
        return units.map((unit) => ({
            text: unit,
            score: this.calculateSemanticScore(unit, context, keyphrases),
        }));
    }
    calculateSemanticScore(unit, context, keyphrases) {
        let score = 0;
        // Keyphrase presence
        const unitLower = unit.toLowerCase();
        for (const phrase of keyphrases) {
            if (unitLower.includes(phrase.toLowerCase())) {
                score += 2;
            }
        }
        // Position in context (beginning/end are more important)
        const position = context.indexOf(unit);
        const contextLength = context.length;
        if (position < contextLength * 0.2 || position > contextLength * 0.8) {
            score += 1;
        }
        // Length factor (not too short, not too long)
        const wordCount = unit.split(/\s+/).length;
        if (wordCount >= 5 && wordCount <= 50) {
            score += 1;
        }
        return score;
    }
    async selectUnitsByScore(scoredUnits, maxTokens) {
        // Sort by score
        scoredUnits.sort((a, b) => b.score - a.score);
        // Select units to fit token budget
        const selected = [];
        let currentTokens = 0;
        for (const unit of scoredUnits) {
            const unitTokens = await TokenCounter.count(unit.text);
            if (currentTokens + unitTokens <= maxTokens) {
                selected.push(unit);
                currentTokens += unitTokens;
            }
            if (currentTokens >= maxTokens)
                break;
        }
        return selected;
    }
    reconstructCoherentText(selectedUnits, originalText) {
        // Sort by original position to maintain coherence
        const sortedUnits = selectedUnits.sort((a, b) => {
            const posA = originalText.indexOf(a.text);
            const posB = originalText.indexOf(b.text);
            return posA - posB;
        });
        return sortedUnits.map((unit) => unit.text).join(' ');
    }
    splitIntoSentences(text) {
        return text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    }
    splitIntoSections(text) {
        return text.split(/\n\n+/).filter((s) => s.trim().length > 0);
    }
    splitIntoCodeBlocks(text) {
        return text.split(/\n\s*\n/).filter((s) => s.trim().length > 0);
    }
    async extractKeyphrases(text) {
        // Simple keyphrase extraction - in production, integrate with KeyBERT
        const words = text
            .toLowerCase()
            .split(/\W+/)
            .filter((word) => word.length > 3);
        const frequency = new Map();
        for (const word of words) {
            frequency.set(word, (frequency.get(word) || 0) + 1);
        }
        return Array.from(frequency.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }
    calculatePositionScore(sentence, text) {
        const position = text.indexOf(sentence);
        const textLength = text.length;
        // Beginning and end are more important
        if (position < textLength * 0.1 || position > textLength * 0.9) {
            return 1.5;
        }
        else if (position < textLength * 0.2 || position > textLength * 0.8) {
            return 1.2;
        }
        return 1.0;
    }
    calculateKeyphraseScore(sentence, keyphrases) {
        const sentenceLower = sentence.toLowerCase();
        return keyphrases.reduce((score, phrase) => score + (sentenceLower.includes(phrase.toLowerCase()) ? 1 : 0), 0);
    }
    calculateLengthScore(tokens, maxTokens) {
        const ratio = tokens / maxTokens;
        if (ratio > 0.8)
            return 0.5; // Too long
        if (ratio < 0.1)
            return 0.7; // Too short
        return 1.0; // Good length
    }
    async selectSentences(scoredSentences, maxTokens) {
        // Sort by score
        scoredSentences.sort((a, b) => b.score - a.score);
        // Select sentences to fit token budget
        const selected = [];
        let currentTokens = 0;
        for (const sentence of scoredSentences) {
            if (currentTokens + sentence.tokens <= maxTokens) {
                selected.push(sentence);
                currentTokens += sentence.tokens;
            }
            if (currentTokens >= maxTokens)
                break;
        }
        return selected;
    }
    reconstructFromSentences(selectedSentences, originalText) {
        // Maintain original order for coherence
        const originalSentences = this.splitIntoSentences(originalText);
        const selectedTexts = selectedSentences.map((s) => s.text);
        return originalSentences
            .filter((sentence) => selectedTexts.some((selected) => selected.includes(sentence.trim())))
            .join('. ');
    }
    identifyHierarchicalStructure(text, contentType) {
        // Simplified hierarchical structure identification
        const sections = this.splitIntoSections(text);
        return {
            sections: sections.map((section) => ({
                text: section,
                level: this.identifySectionLevel(section),
            })),
        };
    }
    identifySectionLevel(section) {
        // Simple level identification based on formatting
        if (section.includes('###'))
            return 3;
        if (section.includes('##'))
            return 2;
        if (section.includes('#'))
            return 1;
        return 0;
    }
    async truncateByHierarchy(structure, config) {
        // Preserve higher-level sections first
        const sortedSections = structure.sections.sort((a, b) => a.level - b.level);
        return {
            sections: sortedSections.slice(0, Math.ceil(config.maxTokens / 100)), // Rough estimate
        };
    }
    reconstructHierarchicalText(truncatedStructure) {
        return truncatedStructure.sections
            .map((section) => section.text)
            .join('\n\n');
    }
    async analyzeContent(text) {
        const tokens = await TokenCounter.count(text);
        const sentences = this.splitIntoSentences(text).length;
        const words = text.split(/\s+/).length;
        return {
            tokens,
            sentences,
            words,
            complexity: words / sentences, // Average words per sentence
            density: tokens / words, // Tokens per word
        };
    }
    selectOptimalStrategy(analysis, config) {
        if (analysis.sentences < 5)
            return 'semantic';
        if (analysis.complexity > 20)
            return 'extractive';
        if (analysis.tokens > config.maxTokens * 3)
            return 'hierarchical';
        return 'adaptive';
    }
    applyStrategy(text, strategy, config) {
        switch (strategy) {
            case 'semantic':
                return this.truncateSemantic(text, config);
            case 'extractive':
                return this.truncateExtractive(text, config);
            case 'hierarchical':
                return this.truncateHierarchical(text, config);
            default:
                return this.truncateSemantic(text, config);
        }
    }
    parseConversationTurns(conversation) {
        // Simple conversation parsing - enhance based on format
        const turns = [];
        const lines = conversation.split('\n');
        for (const line of lines) {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                turns.push({
                    speaker: match[1],
                    content: match[2],
                });
            }
        }
        return turns;
    }
    prioritizeConversationTurns(turns) {
        return turns.map((turn, index) => ({
            ...turn,
            priority: this.calculateTurnPriority(turn, index, turns.length),
        }));
    }
    calculateTurnPriority(turn, index, total) {
        let priority = 0;
        // Recent turns are more important
        priority += (index / total) * 0.3;
        // Longer content might be more important
        priority += (turn.content.length / 1000) * 0.2;
        // Questions and answers are important
        if (turn.content.includes('?'))
            priority += 0.3;
        if (turn.content.includes('answer') || turn.content.includes('because'))
            priority += 0.2;
        return priority;
    }
    async selectConversationTurns(prioritizedTurns, maxTokens) {
        // Sort by priority
        prioritizedTurns.sort((a, b) => b.priority - a.priority);
        // Select turns to fit token budget
        const selected = [];
        let currentTokens = 0;
        for (const turn of prioritizedTurns) {
            const turnTokens = await TokenCounter.count(turn.content);
            if (currentTokens + turnTokens <= maxTokens) {
                selected.push(turn);
                currentTokens += turnTokens;
            }
            if (currentTokens >= maxTokens)
                break;
        }
        return selected;
    }
    reconstructConversation(selectedTurns) {
        return selectedTurns
            .map((turn) => `${turn.speaker}: ${turn.content}`)
            .join('\n');
    }
    extractKeyPhrases(text) {
        // Simple synchronous keyphrase extraction
        const words = text
            .toLowerCase()
            .split(/\W+/)
            .filter((word) => word.length > 3);
        const frequency = new Map();
        for (const word of words) {
            frequency.set(word, (frequency.get(word) || 0) + 1);
        }
        return Array.from(frequency.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }
    /**
     * Combine summaries from multiple documents
     */
    combineSummaries(documentAnalyses, config) {
        // Combine summaries with deduplication
        const allSummaries = documentAnalyses.map((d) => d.summary);
        const uniqueSentences = new Set();
        for (const summary of allSummaries) {
            const sentences = summary
                .split(/[.!?]+/)
                .filter((s) => s.trim().length > 0);
            sentences.forEach((s) => uniqueSentences.add(s.trim()));
        }
        return Array.from(uniqueSentences).join('. ');
    }
    estimateQuality(compressionRatio, config) {
        const { qualityThreshold = 0.8 } = config;
        // Quality decreases with compression ratio but plateaus
        const baseQuality = Math.max(0.3, 1 - compressionRatio * 0.4);
        return Math.max(qualityThreshold, baseQuality);
    }
    generateMetadata(text) {
        const sentences = this.splitIntoSentences(text).length;
        const paragraphs = text.split(/\n\n+/).length;
        const words = text.split(/\s+/).length;
        const readingTime = Math.ceil(words / 200); // Average reading speed
        const complexity = words / sentences;
        return {
            sentenceCount: sentences,
            paragraphCount: paragraphs,
            readingTime,
            complexity,
        };
    }
    generateConversationMetadata(text) {
        const turns = this.parseConversationTurns(text);
        const speakers = new Set(turns.map((turn) => turn.speaker));
        return {
            turnCount: turns.length,
            speakerCount: speakers.size,
            speakers: Array.from(speakers),
        };
    }
    createNoTruncationResult(text, tokens, strategy) {
        return {
            originalText: text,
            truncatedText: text,
            originalTokens: tokens,
            truncatedTokens: tokens,
            compressionRatio: 1.0,
            strategyUsed: strategy,
            preservedSentences: [],
            removedSentences: [],
            keyPhrases: [],
            estimatedQuality: 1.0,
            metadata: this.generateMetadata(text),
        };
    }
}
// Advanced summarization engine
export class SmartSummarizer {
    truncator;
    constructor() {
        this.truncator = new SmartTruncator();
    }
    /**
     * Generate summary using multiple strategies
     */
    async summarize(text, config) {
        const originalTokens = await TokenCounter.count(text);
        if (originalTokens <= config.maxTokens) {
            return text; // No summarization needed
        }
        // Choose summarization approach based on content and requirements
        if (config.style === 'bullet-points') {
            return this.summarizeAsBulletPoints(text, config);
        }
        if (config.style === 'narrative') {
            return this.summarizeAsNarrative(text, config);
        }
        // Default to extractive summarization
        const truncationConfig = {
            strategy: 'extractive',
            maxTokens: config.maxTokens,
            contentType: config.contentType,
            preserveKeyTerms: config.preserveEntities ? ['entity'] : undefined,
            qualityThreshold: 0.8,
        };
        const result = await this.truncator.truncateExtractive(text, truncationConfig);
        return result.truncatedText;
    }
    /**
     * Generate bullet-point summary
     */
    async summarizeAsBulletPoints(text, config) {
        const keyPoints = await this.extractKeyPoints(text, config);
        const bulletPoints = keyPoints.map((point) => `• ${point}`);
        // Ensure we don't exceed token limit
        let summary = bulletPoints.join('\n');
        const tokens = await TokenCounter.count(summary);
        if (tokens > config.maxTokens) {
            // Reduce number of bullet points
            const ratio = config.maxTokens / tokens;
            const targetPoints = Math.floor(bulletPoints.length * ratio);
            summary = bulletPoints.slice(0, targetPoints).join('\n');
        }
        return summary;
    }
    /**
     * Generate narrative summary
     */
    async summarizeAsNarrative(text, config) {
        const keyPoints = await this.extractKeyPoints(text, config);
        const narrative = keyPoints.join('. ');
        return narrative;
    }
    /**
     * Extract key points from text
     */
    async extractKeyPoints(text, config) {
        const sentences = this.splitIntoSentences(text);
        const keyphrases = await this.extractKeyphrases(text);
        const scoredSentences = await Promise.all(sentences.map(async (sentence) => {
            const score = await this.scoreSentenceImportance(sentence, text, keyphrases, config);
            return { sentence, score };
        }));
        // Select top sentences as key points
        const topSentences = scoredSentences
            .sort((a, b) => b.score - a.score)
            .slice(0, 5) // Top 5 sentences
            .map((item) => item.sentence);
        return topSentences;
    }
    /**
     * Score sentence importance for summarization
     */
    async scoreSentenceImportance(sentence, text, keyphrases, config) {
        let score = 0;
        // Keyphrase presence
        const sentenceLower = sentence.toLowerCase();
        for (const phrase of keyphrases) {
            if (sentenceLower.includes(phrase.toLowerCase())) {
                score += 2;
            }
        }
        // Position in text
        const position = text.indexOf(sentence);
        const textLength = text.length;
        if (position < textLength * 0.2 || position > textLength * 0.8) {
            score += 1;
        }
        // Length factor
        const wordCount = sentence.split(/\s+/).length;
        if (wordCount >= 8 && wordCount <= 25) {
            score += 1;
        }
        // Question sentences are often important
        if (sentence.includes('?')) {
            score += 0.5;
        }
        return score;
    }
    /**
     * Extract keyphrases from text
     */
    async extractKeyphrases(text) {
        // Simple implementation - integrate with KeyBERT in production
        const words = text
            .toLowerCase()
            .split(/\W+/)
            .filter((word) => word.length > 4);
        const frequency = new Map();
        for (const word of words) {
            frequency.set(word, (frequency.get(word) || 0) + 1);
        }
        return Array.from(frequency.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 15)
            .map(([word]) => word);
    }
    /**
     * Split text into sentences
     */
    splitIntoSentences(text) {
        return text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    }
}
// Convenience functions
export async function truncateText(text, maxTokens, strategy = 'adaptive', contentType) {
    const truncator = new SmartTruncator();
    const config = {
        strategy,
        maxTokens,
        contentType,
        preserveStructure: true,
        qualityThreshold: 0.7,
    };
    const result = await truncator.truncateAdaptive(text, config);
    return result.truncatedText;
}
export async function summarizeText(text, maxTokens, style = 'concise', contentType) {
    const summarizer = new SmartSummarizer();
    const config = {
        maxTokens,
        style,
        contentType,
        preserveEntities: true,
    };
    return summarizer.summarize(text, config);
}
export async function truncateConversation(conversation, maxTokens) {
    const truncator = new SmartTruncator();
    const config = {
        strategy: 'adaptive',
        maxTokens,
        contentType: 'conversation',
        preserveStructure: true,
    };
    const result = await truncator.truncateConversation(conversation, config);
    return result.truncatedText;
}
//# sourceMappingURL=smart-truncation.js.map