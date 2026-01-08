/**
 * Quality Gate Implementation
 *
 * Implements the 85% quality minimum requirement with fallback strategies
 * Ensures high-quality token optimization with comprehensive quality metrics
 */
/**
 * Quality Gate - Ensures 85% minimum quality with fallback strategies
 */
export class QualityGate {
    config;
    qualityHistory = [];
    adaptiveThresholds = new Map();
    constructor(config) {
        this.config = config;
        this.initializeAdaptiveThresholds();
    }
    /**
     * Validate content quality with comprehensive metrics
     */
    async validateQuality(originalContent, processedContent, context) {
        const startTime = Date.now();
        try {
            // Calculate comprehensive quality metrics
            const metrics = await this.calculateQualityMetrics(originalContent, processedContent, context);
            // Check if quality meets minimum threshold
            const passed = metrics.overallScore >= this.config.minimumQualityScore;
            const failedChecks = this.identifyFailedChecks(metrics);
            const recommendations = this.generateRecommendations(metrics, failedChecks);
            // Store quality history for adaptive learning
            this.updateQualityHistory({
                timestamp: new Date(),
                originalContent,
                processedContent,
                metrics,
                passed,
                fallbackUsed: false,
                strategy: 'primary',
            });
            // Trigger fallback if quality is insufficient
            let fallbackTriggered = false;
            let fallbackStrategy;
            if (!passed && this.config.fallbackStrategy) {
                const fallbackResult = await this.executeFallback(originalContent, processedContent, metrics, context);
                if (fallbackResult.success) {
                    fallbackTriggered = true;
                    fallbackStrategy = fallbackResult.strategy;
                    // Update history with fallback usage
                    this.updateQualityHistory({
                        timestamp: new Date(),
                        originalContent,
                        processedContent: fallbackResult.content,
                        metrics: fallbackResult.metrics,
                        passed: fallbackResult.metrics.overallScore >=
                            this.config.minimumQualityScore,
                        fallbackUsed: true,
                        strategy: fallbackStrategy,
                    });
                }
            }
            return {
                passed: passed || fallbackTriggered,
                score: metrics.overallScore,
                metrics,
                failedChecks,
                recommendations,
                processingTime: Date.now() - startTime,
                fallbackTriggered,
                fallbackStrategy,
            };
        }
        catch {
            return {
                passed: false,
                score: 0,
                metrics: this.getDefaultMetrics(),
                failedChecks: ['quality_calculation_error'],
                recommendations: [
                    'Use fallback strategy',
                    'Review quality calculation',
                ],
                processingTime: Date.now() - startTime,
                fallbackTriggered: true,
                fallbackStrategy: this.config.fallbackStrategy,
            };
        }
    }
    /**
     * Calculate comprehensive quality metrics
     */
    async calculateQualityMetrics(originalContent, processedContent, context) {
        const metrics = {};
        // Semantic similarity calculation
        if (this.config.enableSemanticSimilarity) {
            metrics.semanticSimilarity = await this.calculateSemanticSimilarity(originalContent, processedContent);
        }
        else {
            metrics.semanticSimilarity = 1.0;
        }
        // Information retention calculation
        if (this.config.enableInformationRetention) {
            metrics.informationRetention = await this.calculateInformationRetention(originalContent, processedContent);
        }
        else {
            metrics.informationRetention = 1.0;
        }
        // Readability score calculation
        if (this.config.enableReadabilityCheck) {
            metrics.readabilityScore =
                await this.calculateReadabilityScore(processedContent);
        }
        else {
            metrics.readabilityScore = 1.0;
        }
        // Coherence score calculation
        if (this.config.enableCoherenceCheck) {
            metrics.coherenceScore =
                await this.calculateCoherenceScore(processedContent);
        }
        else {
            metrics.coherenceScore = 1.0;
        }
        // Relevance score calculation
        if (this.config.enableRelevanceCheck && context) {
            metrics.relevanceScore = await this.calculateRelevanceScore(processedContent, context);
        }
        else {
            metrics.relevanceScore = 1.0;
        }
        // Calculate weighted overall score
        const weights = this.config.qualityWeights;
        metrics.overallScore =
            metrics.semanticSimilarity * weights.semanticSimilarity +
                metrics.informationRetention * weights.informationRetention +
                metrics.readabilityScore * weights.readability +
                metrics.coherenceScore * weights.coherence +
                metrics.relevanceScore * weights.relevance;
        return metrics;
    }
    /**
     * Execute fallback strategy when quality is insufficient
     */
    async executeFallback(originalContent, _processedContent, metrics, context) {
        switch (this.config.fallbackStrategy) {
            case 'minimal_compression':
                return this.executeMinimalCompressionFallback(originalContent, context);
            case 'no_compression':
                return {
                    success: true,
                    content: originalContent,
                    metrics: this.getPerfectMetrics(),
                    strategy: 'no_compression',
                };
            case 'alternative_model':
                return this.executeAlternativeModelFallback(originalContent, _processedContent, context);
            default:
                return {
                    success: false,
                    content: _processedContent,
                    metrics,
                    strategy: 'none',
                };
        }
    }
    /**
     * Execute minimal compression fallback
     */
    async executeMinimalCompressionFallback(originalContent, context) {
        // Apply minimal compression (e.g., remove only redundant whitespace)
        const minimallyCompressed = originalContent
            .replace(/\s+/g, ' ')
            .replace(/^\s+|\s+$/g, '')
            .replace(/\n\s*\n/g, '\n');
        const metrics = await this.calculateQualityMetrics(originalContent, minimallyCompressed, context);
        return {
            success: metrics.overallScore >= this.config.minimumQualityScore,
            content: minimallyCompressed,
            metrics,
            strategy: 'minimal_compression',
        };
    }
    /**
     * Execute alternative model fallback
     */
    async executeAlternativeModelFallback(originalContent, _processedContent, context) {
        // In a real implementation, this would use a different model
        // For now, we'll use a simple approach that preserves the original
        const alternativeContent = originalContent;
        const metrics = await this.calculateQualityMetrics(originalContent, alternativeContent, context);
        return {
            success: metrics.overallScore >= this.config.minimumQualityScore,
            content: alternativeContent,
            metrics,
            strategy: 'alternative_model',
        };
    }
    /**
     * Calculate semantic similarity between original and processed content
     */
    async calculateSemanticSimilarity(originalContent, processedContent) {
        // Simplified semantic similarity calculation
        // In production, this would use advanced NLP techniques
        const originalWords = new Set(originalContent.toLowerCase().split(/\s+/));
        const processedWords = new Set(processedContent.toLowerCase().split(/\s+/));
        const intersection = new Set([...originalWords].filter((x) => processedWords.has(x)));
        const union = new Set([...originalWords, ...processedWords]);
        // Jaccard similarity
        const similarity = intersection.size / union.size;
        // Adjust for length difference
        const lengthRatio = Math.min(processedContent.length, originalContent.length) /
            Math.max(processedContent.length, originalContent.length);
        return Math.min(similarity * lengthRatio, 1.0);
    }
    /**
     * Calculate information retention
     */
    async calculateInformationRetention(originalContent, processedContent) {
        // Simplified information retention calculation
        const originalKeyTerms = this.extractKeyTerms(originalContent);
        const processedKeyTerms = this.extractKeyTerms(processedContent);
        const retainedTerms = originalKeyTerms.filter((term) => processedKeyTerms.includes(term));
        return retainedTerms.length / originalKeyTerms.length;
    }
    /**
     * Calculate readability score
     */
    async calculateReadabilityScore(content) {
        // Simplified Flesch Reading Ease calculation
        const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
        const words = content.split(/\s+/).filter((w) => w.length > 0);
        const syllables = words.reduce((count, word) => count + this.estimateSyllables(word), 0);
        if (sentences.length === 0 || words.length === 0)
            return 1.0;
        const avgSentenceLength = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;
        // Flesch Reading Ease score (0-100, higher is easier)
        const fleschScore = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
        // Normalize to 0-1 range
        return Math.max(0, Math.min(1, fleschScore / 100));
    }
    /**
     * Calculate coherence score
     */
    async calculateCoherenceScore(content) {
        // Simplified coherence calculation based on sentence transitions
        const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
        if (sentences.length <= 1)
            return 1.0;
        let coherenceScore = 0;
        const transitionWords = [
            'however',
            'therefore',
            'furthermore',
            'moreover',
            'nevertheless',
            'consequently',
        ];
        for (let i = 1; i < sentences.length; i++) {
            const currentSentence = sentences[i].toLowerCase();
            // Check for logical connections
            if (transitionWords.some((word) => currentSentence.includes(word))) {
                coherenceScore += 0.2;
            }
            // Check for pronoun references
            const pronouns = ['this', 'that', 'these', 'those', 'it'];
            if (pronouns.some((pronoun) => currentSentence.startsWith(pronoun))) {
                coherenceScore += 0.1;
            }
        }
        return Math.min(coherenceScore / sentences.length, 1.0);
    }
    /**
     * Calculate relevance score
     */
    async calculateRelevanceScore(content, context) {
        if (!context.domain && !context.userIntent)
            return 1.0;
        let relevanceScore = 0;
        const contentWords = new Set(content.toLowerCase().split(/\s+/));
        if (context.domain) {
            const domainWords = new Set(context.domain.toLowerCase().split(/\s+/));
            const domainOverlap = [...domainWords].filter((word) => contentWords.has(word)).length;
            relevanceScore += (domainOverlap / domainWords.size) * 0.5;
        }
        if (context.userIntent) {
            const intentWords = new Set(context.userIntent.toLowerCase().split(/\s+/));
            const intentOverlap = [...intentWords].filter((word) => contentWords.has(word)).length;
            relevanceScore += (intentOverlap / intentWords.size) * 0.5;
        }
        return Math.min(relevanceScore, 1.0);
    }
    /**
     * Extract key terms from content
     */
    extractKeyTerms(content) {
        const words = content.toLowerCase().split(/\s+/);
        const termFrequency = new Map();
        words.forEach((word) => {
            if (word.length > 3 && !this.isStopWord(word)) {
                termFrequency.set(word, (termFrequency.get(word) || 0) + 1);
            }
        });
        // Return top 20% most frequent terms
        const termEntries = Array.from(termFrequency.entries());
        const sortedTermEntries = termEntries.sort((a, b) => b[1] - a[1]);
        const topTerms = sortedTermEntries
            .slice(0, Math.ceil(termEntries.length * 0.2))
            .map(([term]) => term);
        return topTerms;
    }
    /**
     * Estimate syllables in a word
     */
    estimateSyllables(word) {
        word = word.toLowerCase();
        let count = 0;
        let previousWasVowel = false;
        for (let i = 0; i < word.length; i++) {
            const isVowel = 'aeiou'.includes(word[i]);
            if (isVowel && !previousWasVowel) {
                count++;
            }
            previousWasVowel = isVowel;
        }
        // Handle silent e
        if (word.endsWith('e') && count > 1) {
            count--;
        }
        return Math.max(count, 1);
    }
    /**
     * Check if word is a stop word
     */
    isStopWord(word) {
        const stopWords = new Set([
            'the',
            'a',
            'an',
            'and',
            'or',
            'but',
            'in',
            'on',
            'at',
            'to',
            'for',
            'of',
            'with',
            'by',
        ]);
        return stopWords.has(word);
    }
    /**
     * Identify failed quality checks
     */
    identifyFailedChecks(metrics) {
        const failedChecks = [];
        if (metrics.overallScore < this.config.minimumQualityScore) {
            failedChecks.push('overall_quality');
        }
        if (metrics.semanticSimilarity < 0.8) {
            failedChecks.push('semantic_similarity');
        }
        if (metrics.informationRetention < 0.7) {
            failedChecks.push('information_retention');
        }
        if (metrics.readabilityScore < 0.6) {
            failedChecks.push('readability');
        }
        if (metrics.coherenceScore < 0.7) {
            failedChecks.push('coherence');
        }
        if (metrics.relevanceScore < 0.8) {
            failedChecks.push('relevance');
        }
        return failedChecks;
    }
    /**
     * Generate quality recommendations
     */
    generateRecommendations(metrics, failedChecks) {
        const recommendations = [];
        if (failedChecks.includes('semantic_similarity')) {
            recommendations.push('Increase semantic similarity threshold');
            recommendations.push('Use more conservative compression');
        }
        if (failedChecks.includes('information_retention')) {
            recommendations.push('Preserve more key information');
            recommendations.push('Use information-aware compression');
        }
        if (failedChecks.includes('readability')) {
            recommendations.push('Improve readability of compressed content');
            recommendations.push('Use readability-preserving techniques');
        }
        if (failedChecks.includes('coherence')) {
            recommendations.push('Maintain better logical flow');
            recommendations.push('Preserve transition words');
        }
        if (failedChecks.includes('relevance')) {
            recommendations.push('Maintain better context relevance');
            recommendations.push('Use context-aware compression');
        }
        if (metrics.overallScore < this.config.minimumQualityScore) {
            recommendations.push('Consider using fallback strategy');
            recommendations.push('Adjust compression parameters');
        }
        return recommendations;
    }
    /**
     * Update quality history for adaptive learning
     */
    updateQualityHistory(entry) {
        this.qualityHistory.push(entry);
        // Maintain history size limit
        if (this.qualityHistory.length > this.config.qualityHistorySize) {
            this.qualityHistory = this.qualityHistory.slice(-this.config.qualityHistorySize);
        }
        // Update adaptive thresholds if enabled
        if (this.config.enableAdaptiveThresholds) {
            this.updateAdaptiveThresholds(entry);
        }
    }
    /**
     * Update adaptive thresholds based on quality history
     */
    updateAdaptiveThresholds(_entry) {
        // Analyze recent quality trends
        const recentEntries = this.qualityHistory.slice(-100);
        const passRate = recentEntries.length > 0
            ? recentEntries.filter((e) => e.passed).length / recentEntries.length
            : 0;
        // Adjust thresholds based on pass rate
        if (passRate > 0.9) {
            // High pass rate, can be more strict
            this.adaptiveThresholds.set('semantic_similarity', 0.85);
            this.adaptiveThresholds.set('information_retention', 0.75);
        }
        else if (passRate < 0.7) {
            // Low pass rate, be more lenient
            this.adaptiveThresholds.set('semantic_similarity', 0.75);
            this.adaptiveThresholds.set('information_retention', 0.65);
        }
    }
    /**
     * Initialize adaptive thresholds
     */
    initializeAdaptiveThresholds() {
        this.adaptiveThresholds.set('semantic_similarity', 0.8);
        this.adaptiveThresholds.set('information_retention', 0.7);
        this.adaptiveThresholds.set('readability', 0.6);
        this.adaptiveThresholds.set('coherence', 0.7);
        this.adaptiveThresholds.set('relevance', 0.8);
    }
    /**
     * Get default metrics for error cases
     */
    getDefaultMetrics() {
        return {
            semanticSimilarity: 0.8,
            informationRetention: 0.7,
            readabilityScore: 0.7,
            coherenceScore: 0.7,
            relevanceScore: 0.8,
            overallScore: 0.74,
        };
    }
    /**
     * Get perfect metrics for no-compression fallback
     */
    getPerfectMetrics() {
        return {
            semanticSimilarity: 1.0,
            informationRetention: 1.0,
            readabilityScore: 1.0,
            coherenceScore: 1.0,
            relevanceScore: 1.0,
            overallScore: 1.0,
        };
    }
}
//# sourceMappingURL=quality-gate.js.map