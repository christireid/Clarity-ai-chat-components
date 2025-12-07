/**
 * Local Embedding Generator
 *
 * Generates embeddings locally without API calls using:
 * 1. TensorFlow.js with Universal Sentence Encoder (when available)
 * 2. Fallback: Simple word-based embedding using pre-computed word vectors
 *
 * Enables zero-cost embedding generation for semantic caching.
 *
 * @module embeddings/local-embedder
 */
// Default configuration
const DEFAULT_CONFIG = {
    modelUrl: '',
    dimensions: 128, // Use smaller dimension for fallback
    batchSize: 32,
    cacheEmbeddings: true,
    maxCacheSize: 10000,
    warmupOnLoad: false,
    useFallback: true,
};
/**
 * Normalize text for cache keys
 * Uses the full normalized text to avoid hash collisions
 */
function normalizeTextForCache(text) {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
}
/**
 * Tokenize text into words
 */
function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 0);
}
/**
 * Generate a simple embedding using character-level features
 * This is a fallback when TensorFlow.js is not available
 */
function generateFallbackEmbedding(text, dimensions) {
    const embedding = new Array(dimensions).fill(0);
    const words = tokenize(text);
    if (words.length === 0) {
        return embedding;
    }
    // Character n-gram features
    const normalizedText = text.toLowerCase();
    for (let i = 0; i < normalizedText.length - 2; i++) {
        const trigram = normalizedText.substring(i, i + 3);
        let trigramHash = 0;
        for (let j = 0; j < trigram.length; j++) {
            trigramHash = ((trigramHash << 5) - trigramHash) + trigram.charCodeAt(j);
        }
        const idx = Math.abs(trigramHash) % dimensions;
        embedding[idx] += 1;
    }
    // Word-level features
    for (const word of words) {
        let wordHash = 0;
        for (let i = 0; i < word.length; i++) {
            wordHash = ((wordHash << 5) - wordHash) + word.charCodeAt(i);
        }
        // Distribute word features across multiple dimensions
        for (let i = 0; i < Math.min(5, word.length); i++) {
            const idx = Math.abs(wordHash + i * 7919) % dimensions;
            embedding[idx] += 1 / Math.sqrt(words.length);
        }
    }
    // Normalize the embedding to unit length
    let norm = 0;
    for (let i = 0; i < dimensions; i++) {
        norm += embedding[i] * embedding[i];
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
        for (let i = 0; i < dimensions; i++) {
            embedding[i] = embedding[i] / norm;
        }
    }
    return embedding;
}
/**
 * Local Embedding Generator
 *
 * @example
 * ```typescript
 * const embedder = new LocalEmbedder()
 *
 * // Generate single embedding
 * const result = await embedder.embed('What is React?')
 * console.log(result.embedding) // [0.1, 0.2, ...]
 *
 * // Batch embed for efficiency
 * const results = await embedder.embedBatch([
 *   'What is React?',
 *   'Explain React to me',
 *   'How does React work?'
 * ])
 *
 * // Use with semantic cache
 * const cache = new PersistentSemanticCache({
 *   embedFunction: (text) => embedder.embed(text).then(r => r.embedding)
 * })
 * ```
 */
export class LocalEmbedder {
    config;
    cache = new Map();
    modelLoaded = false;
    stats = {
        totalGenerated: 0,
        cacheHits: 0,
        totalGenerationTimeMs: 0,
    };
    constructor(config = {}) {
        // Validate config
        if (config.dimensions !== undefined && config.dimensions <= 0) {
            throw new Error('dimensions must be positive');
        }
        if (config.batchSize !== undefined && config.batchSize <= 0) {
            throw new Error('batchSize must be positive');
        }
        if (config.maxCacheSize !== undefined && config.maxCacheSize <= 0) {
            throw new Error('maxCacheSize must be positive');
        }
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
        if (this.config.warmupOnLoad) {
            this.initialize().catch(() => {
                // Warmup failed, will use fallback
            });
        }
    }
    /**
     * Initialize the embedder (load TensorFlow model if available)
     *
     * Note: TensorFlow.js integration is prepared but not fully implemented.
     * The fallback embedding is always used for now. To enable TensorFlow:
     * 1. Install @tensorflow/tfjs and @tensorflow-models/universal-sentence-encoder
     * 2. Uncomment the model loading code below
     * 3. Implement generateTensorFlowEmbedding()
     */
    async initialize() {
        // Try to dynamically import TensorFlow.js
        try {
            // Check if we're in a browser environment
            if (typeof window === 'undefined') {
                // SSR/Node environment - use fallback
                return;
            }
            // Attempt to load TensorFlow.js dynamically
            // Using variable to avoid static analysis by bundlers (package is optional)
            const tfPackage = '@tensorflow/tfjs';
            const usePackage = '@tensorflow-models/universal-sentence-encoder';
            // Dynamic import with runtime-determined module name
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            const dynamicImport = new Function('moduleName', 'return import(moduleName)');
            const tf = await dynamicImport(tfPackage).catch(() => null);
            if (!tf) {
                // TensorFlow not available, use fallback
                return;
            }
            // Try to load Universal Sentence Encoder
            const use = await dynamicImport(usePackage).catch(() => null);
            if (use) {
                // TensorFlow is available but model loading is not yet implemented
                // To enable: uncomment below and implement generateTensorFlowEmbedding()
                // const model = this.config.modelUrl
                //   ? await use.load({ modelUrl: this.config.modelUrl })
                //   : await use.load()
                // this.model = model
                // this.modelLoaded = true
            }
        }
        catch {
            // TensorFlow loading failed, use fallback
            this.modelLoaded = false;
        }
    }
    /**
     * Check if the embedder is ready
     */
    isReady() {
        // Always ready because we have fallback
        return true;
    }
    /**
     * Check if TensorFlow model is loaded
     */
    isModelLoaded() {
        return this.modelLoaded;
    }
    /**
     * Generate embedding for a single text
     */
    async embed(text) {
        const startTime = performance.now();
        const cacheKey = normalizeTextForCache(text);
        // Check cache first
        if (this.config.cacheEmbeddings && this.cache.has(cacheKey)) {
            this.stats.cacheHits++;
            return {
                embedding: this.cache.get(cacheKey),
                text,
                dimensions: this.config.dimensions,
                generationTimeMs: performance.now() - startTime,
                cached: true,
                method: this.modelLoaded ? 'tensorflow' : 'fallback',
            };
        }
        // Generate embedding
        let embedding;
        let method = 'fallback';
        if (this.modelLoaded) {
            // Use TensorFlow model
            try {
                embedding = await this.generateTensorFlowEmbedding(text);
                method = 'tensorflow';
            }
            catch {
                // Fall back to simple embedding
                embedding = generateFallbackEmbedding(text, this.config.dimensions);
            }
        }
        else {
            // Use fallback embedding
            embedding = generateFallbackEmbedding(text, this.config.dimensions);
        }
        const generationTimeMs = performance.now() - startTime;
        this.stats.totalGenerated++;
        this.stats.totalGenerationTimeMs += generationTimeMs;
        // Cache the embedding (with size limit enforcement)
        if (this.config.cacheEmbeddings) {
            // Evict oldest entries if cache is full
            if (this.cache.size >= this.config.maxCacheSize) {
                // Remove first (oldest) entry
                const firstKey = this.cache.keys().next().value;
                if (firstKey !== undefined) {
                    this.cache.delete(firstKey);
                }
            }
            this.cache.set(cacheKey, embedding);
        }
        return {
            embedding,
            text,
            dimensions: embedding.length,
            generationTimeMs,
            cached: false,
            method,
        };
    }
    /**
     * Generate embeddings for multiple texts (batch processing)
     */
    async embedBatch(texts) {
        // Process in batches for memory efficiency
        const results = [];
        const batchSize = this.config.batchSize;
        for (let i = 0; i < texts.length; i += batchSize) {
            const batch = texts.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch.map((text) => this.embed(text)));
            results.push(...batchResults);
        }
        return results;
    }
    /**
     * Get embedder statistics
     */
    getStats() {
        return {
            totalGenerated: this.stats.totalGenerated,
            cacheHits: this.stats.cacheHits,
            cacheSize: this.cache.size,
            avgGenerationTimeMs: this.stats.totalGenerated > 0
                ? this.stats.totalGenerationTimeMs / this.stats.totalGenerated
                : 0,
            modelLoaded: this.modelLoaded,
            method: this.modelLoaded ? 'tensorflow' : this.config.useFallback ? 'fallback' : 'none',
        };
    }
    /**
     * Clear the embedding cache
     */
    clearCache() {
        this.cache.clear();
        this.stats.cacheHits = 0;
    }
    /**
     * Dispose resources (unload TensorFlow model if loaded)
     */
    dispose() {
        this.cache.clear();
        this.modelLoaded = false;
        this.stats = {
            totalGenerated: 0,
            cacheHits: 0,
            totalGenerationTimeMs: 0,
        };
    }
    /**
     * Generate embedding using TensorFlow.js model
     * @internal
     */
    async generateTensorFlowEmbedding(text) {
        // This would use the actual TensorFlow model
        // For now, we use the fallback since TensorFlow loading is complex
        throw new Error('TensorFlow embedding not implemented - use fallback');
    }
}
/**
 * Create a local embedder with the given configuration
 */
export function createLocalEmbedder(config) {
    return new LocalEmbedder(config);
}
/**
 * Create an embed function compatible with SemanticCacheConfig
 */
export function createEmbedFunction(embedder) {
    return async (text) => {
        const result = await embedder.embed(text);
        return result.embedding;
    };
}
/**
 * Calculate cosine similarity between two embeddings
 */
export function calculateSimilarity(a, b) {
    if (a.length !== b.length || a.length === 0)
        return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        const aVal = a[i] ?? 0;
        const bVal = b[i] ?? 0;
        dotProduct += aVal * bVal;
        normA += aVal * aVal;
        normB += bVal * bVal;
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
//# sourceMappingURL=local-embedder.js.map