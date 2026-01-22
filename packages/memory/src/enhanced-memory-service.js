/**
 * Enhanced Memory Service with Advanced Token Optimization
 *
 * Production-ready memory management with enterprise-grade token optimization,
 * security, and performance enhancements
 */
// Enhanced imports with new token optimization
import { TokenCounter as _TokenCounter, ContextOptimizer } from './token-optimizer';
import { AccurateTokenCounter, TokenSecurityManager, ToonOptimizer, Optimizer, AdvancedSemanticCache } from '@clarity-chat/token-optimization';
import { DecayManager, } from './utils/decay-manager';
/**
 * Enhanced Memory Service with Advanced Token Optimization
 */
export class EnhancedMemoryService {
    config;
    vectorStore;
    embeddings;
    cache;
    buffer;
    optimizer;
    eventListeners;
    cleanupInterval;
    summarizationInterval;
    decayManager;
    decayInterval;
    // Advanced token optimization components
    tokenCounter;
    securityManager;
    toonOptimizer;
    llmlinguaOptimizer;
    semanticCache;
    contextCompressor;
    predictiveOptimizer;
    advancedSecurity;
    constructor(config, vectorStore, embeddings) {
        this.config = config;
        this.vectorStore = vectorStore;
        this.embeddings = embeddings;
        this.cache = new Map();
        this.buffer = this.createBuffer();
        this.optimizer = new ContextOptimizer(config.tokenOptimization);
        this.eventListeners = new Map();
        // Initialize advanced token optimization
        this.initializeTokenOptimization();
        this.initialize();
    }
    /**
     * Initialize advanced token optimization components
     */
    initializeTokenOptimization() {
        // Accurate token counting
        this.tokenCounter = new AccurateTokenCounter({
            model: this.config.tokenOptimization.model || 'gpt-4',
            cacheSize: 100000,
            enableCaching: true,
            enableMonitoring: true
        });
        // Security manager
        this.securityManager = new TokenSecurityManager({
            enableSanitization: true,
            enableCompressionObfuscation: true,
            enableAuditLogging: true,
            enablePIIRedaction: true,
            noiseLevel: 0.1,
            complianceLevel: 'enterprise'
        });
        // TOON optimizer
        this.toonOptimizer = new ToonOptimizer({
            enableArrayTables: true,
            maxArraySizeForTable: 1000,
            preserveKeys: false,
            compactNumbers: true,
            quoteStrings: false
        });
        // LLMLingua compressor (optional)
        if (this.config.tokenOptimization.enableAdvancedCompression) {
            this.llmlinguaOptimizer = new LLMLinguaOptimizer({
                modelName: 'microsoft/llmlingua-2-xlm-roberta-large-meetingbank',
                compressionRate: 0.6,
                useLLMLingua2: true,
                enableStructureAware: true
            });
        }
        // Semantic cache
        if (this.config.tokenOptimization.enableSemanticCache) {
            this.semanticCache = new SemanticCache({
                maxSize: 1000000,
                similarityThreshold: 0.85,
                embeddingModel: 'text-embedding-ada-002',
                cleanupInterval: 300000
            });
        }
        // Context-aware compressor
        this.contextCompressor = new ContextAwareCompressor();
        // Predictive optimizer
        this.predictiveOptimizer = new PredictiveTokenOptimizer();
        // Advanced security
        this.advancedSecurity = new AdvancedSecurityManager({
            enableThreatDetection: true,
            enableBehaviorAnalysis: true,
            enableZeroTrust: true,
            complianceLevel: 'enterprise'
        });
    }
    /**
     * Advanced token optimization for memory content
     */
    async optimizeMemoryContent(content, options) {
        const maxTokens = options?.maxTokens || 1000;
        const context = options?.context;
        const _securityLevel = options?.securityLevel || 'enterprise';
        // Apply security measures
        const secured = this.securityManager.sanitizeInput(content);
        if (secured.riskLevel === 'high') {
            throw new Error('Security threat detected in memory content');
        }
        // Try semantic cache first
        let optimizedContent;
        let method = 'cache';
        let savedTokens = 0;
        if (this.semanticCache) {
            const cached = await this.semanticCache.getSimilarResponse(content, 0.9);
            if (cached) {
                optimizedContent = cached;
                savedTokens = this.tokenCounter.count(content) - this.tokenCounter.count(cached);
            }
        }
        // If not cached, apply optimization
        if (!optimizedContent) {
            // Try different optimization strategies
            const strategies = [
                { method: 'toon', optimize: this.optimizeWithToon.bind(this) },
                { method: 'llmlingua', optimize: this.optimizeWithLLMLingua.bind(this) },
                { method: 'context', optimize: this.optimizeWithContext.bind(this) }
            ];
            let bestResult = null;
            let bestSavings = 0;
            for (const strategy of strategies) {
                try {
                    const result = await strategy.optimize(content, context);
                    const savings = result.originalTokens - result.optimizedTokens;
                    if (savings > bestSavings) {
                        bestSavings = savings;
                        bestResult = { ...result, method: strategy.method };
                    }
                }
                catch (error) {
                    console.warn(`${strategy.method} optimization failed:`, error);
                }
            }
            if (bestResult) {
                optimizedContent = bestResult.optimized;
                method = bestResult.method;
                savedTokens = bestSavings;
            }
            else {
                // Fallback to simple truncation
                optimizedContent = this.tokenCounter.truncate(content, maxTokens);
                method = 'truncation';
                savedTokens = this.tokenCounter.count(content) - this.tokenCounter.count(optimizedContent);
            }
            // Cache the result
            if (this.semanticCache) {
                await this.semanticCache.cacheResponse(content, optimizedContent, {
                    method,
                    savings: savedTokens
                });
            }
        }
        const originalTokens = this.tokenCounter.count(content);
        const optimizedTokens = this.tokenCounter.count(optimizedContent);
        // Protect compression metrics
        const protectedMetrics = this.securityManager.protectCompressionRatio(originalTokens, optimizedTokens);
        return {
            optimized: optimizedContent,
            originalTokens,
            optimizedTokens: protectedMetrics.compressedTokens,
            savings: originalTokens - protectedMetrics.compressedTokens,
            method,
            security: {
                sanitized: true,
                threats: secured.threats,
                riskLevel: secured.riskLevel
            }
        };
    }
    /**
     * Optimize with TOON format
     */
    async optimizeWithToon(content, _context) {
        // Parse content as JSON if possible, otherwise create structured format
        let data;
        try {
            data = JSON.parse(content);
        }
        catch {
            // Create structured format from text
            data = {
                content: content,
                metadata: {
                    timestamp: new Date().toISOString(),
                    length: content.length
                }
            };
        }
        // Convert to TOON format
        const toonContent = this.toonOptimizer.convertToToon(data);
        const originalTokens = this.tokenCounter.count(content);
        const optimizedTokens = this.tokenCounter.count(toonContent);
        return {
            optimized: toonContent,
            originalTokens,
            optimizedTokens,
            compressionRatio: originalTokens / optimizedTokens
        };
    }
    /**
     * Optimize with LLMLingua compression
     */
    async optimizeWithLLMLingua(content, _context) {
        if (!this.llmlinguaOptimizer) {
            throw new Error('LLMLingua optimizer not available');
        }
        const result = await this.llmlinguaOptimizer.compressPrompt(content, undefined, 'Memory optimization');
        return {
            optimized: result.compressed,
            originalTokens: result.originalTokens,
            optimizedTokens: result.compressedTokens,
            compressionRatio: result.compressionRatio
        };
    }
    /**
     * Optimize with context-aware compression
     */
    async optimizeWithContext(content, context) {
        const result = await this.contextCompressor.compressWithContext(content, {
            conversationHistory: [],
            userProfile: context,
            currentTask: 'memory_optimization'
        }, Math.floor(this.tokenCounter.count(content) * 0.7) // Target 70% of original
        );
        return {
            optimized: result.compressed,
            originalTokens: result.originalTokens,
            optimizedTokens: result.compressedTokens,
            compressionRatio: result.compressionRatio
        };
    }
    /**
     * Enhanced context generation with token optimization
     */
    async generateOptimizedContext(options) {
        const maxTokens = options?.maxTokens || 4096;
        const securityLevel = options?.securityLevel || 'enterprise';
        // Get base context
        const baseContext = await this.context(options);
        // Optimize each component
        const optimizedComponents = await Promise.all([
            this.optimizeMemoryContent(baseContext.formatted, {
                maxTokens: Math.floor(maxTokens * 0.7),
                securityLevel
            })
        ]);
        const optimized = optimizedComponents[0];
        return {
            ...baseContext,
            formatted: optimized.optimized,
            totalTokens: optimized.optimizedTokens,
            optimization: {
                method: optimized.method,
                savings: optimized.savings,
                security: optimized.security
            }
        };
    }
    /**
     * Get token optimization statistics
     */
    getTokenOptimizationStats() {
        return {
            tokenCounter: this.tokenCounter.getMonitoringStats(),
            cache: this.semanticCache?.getCacheStats(),
            security: this.securityManager.generateComplianceReport()
        };
    }
    /**
     * Clean up resources
     */
    async destroy() {
        this.tokenCounter.destroy();
        this.semanticCache?.destroy();
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        if (this.summarizationInterval) {
            clearInterval(this.summarizationInterval);
        }
        if (this.decayInterval) {
            clearInterval(this.decayInterval);
        }
    }
}
//# sourceMappingURL=enhanced-memory-service.js.map