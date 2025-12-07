/**
 * Embeddings Generation
 *
 * Handles generating vector embeddings for documentation content using OpenAI's API.
 * Embeddings enable semantic search across documentation.
 */
import OpenAI from 'openai';
// OpenAI client (singleton)
let openaiClient = null;
function getOpenAIClient() {
    if (!openaiClient) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY environment variable is not set. ' +
                'Please add it to your .env.local file.');
        }
        openaiClient = new OpenAI({ apiKey });
    }
    return openaiClient;
}
/**
 * Generate embedding for a single text string
 */
export async function generateEmbedding(text, options = {}) {
    const { model = 'text-embedding-3-small', dimensions } = options;
    const client = getOpenAIClient();
    try {
        const response = await client.embeddings.create({
            model,
            input: text,
            ...(dimensions && { dimensions }),
        });
        return response.data[0].embedding;
    }
    catch (error) {
        console.error('Error generating embedding:', error);
        throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Generate embeddings for multiple texts in batch
 * More efficient than calling generateEmbedding multiple times
 */
export async function generateEmbeddingsBatch(texts, options = {}) {
    const { model = 'text-embedding-3-small', dimensions } = options;
    if (texts.length === 0)
        return [];
    if (texts.length > 2048) {
        throw new Error('Batch size too large. Maximum 2048 texts per batch.');
    }
    const client = getOpenAIClient();
    try {
        const response = await client.embeddings.create({
            model,
            input: texts,
            ...(dimensions && { dimensions }),
        });
        // Sort by index to maintain order
        const embeddings = response.data
            .sort((a, b) => a.index - b.index)
            .map((item) => item.embedding);
        return embeddings;
    }
    catch (error) {
        console.error('Error generating embeddings batch:', error);
        throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
export function chunkText(text, options = {}) {
    const { maxChunkSize = 1000, // ~250 tokens
    overlap = 200, // ~50 tokens
    splitOnSentences = true, } = options;
    if (text.length <= maxChunkSize) {
        return [text];
    }
    const chunks = [];
    if (splitOnSentences) {
        // Split on sentence boundaries (periods, question marks, exclamation marks)
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        let currentChunk = '';
        for (const sentence of sentences) {
            if ((currentChunk + sentence).length <= maxChunkSize) {
                currentChunk += sentence;
            }
            else {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                }
                currentChunk = sentence;
            }
        }
        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }
    }
    else {
        // Simple character-based chunking with overlap
        let start = 0;
        while (start < text.length) {
            const end = Math.min(start + maxChunkSize, text.length);
            const chunk = text.slice(start, end);
            chunks.push(chunk.trim());
            start = end - overlap;
        }
    }
    return chunks.filter((chunk) => chunk.length > 0);
}
/**
 * Calculate cosine similarity between two embeddings
 * Returns a value between -1 and 1, where 1 means identical
 */
export function cosineSimilarity(a, b) {
    if (a.length !== b.length) {
        throw new Error('Embeddings must have the same dimensions');
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
/**
 * Estimate token count for a text string
 * This is a rough approximation: ~4 characters per token for English
 */
export function estimateTokenCount(text) {
    return Math.ceil(text.length / 4);
}
/**
 * Estimate cost for embedding generation
 * Prices as of 2024 (subject to change)
 */
export function estimateEmbeddingCost(tokenCount, model = 'text-embedding-3-small') {
    // Prices per 1M tokens
    const prices = {
        'text-embedding-3-small': 0.02,
        'text-embedding-3-large': 0.13,
        'text-embedding-ada-002': 0.10,
    };
    return (tokenCount / 1_000_000) * prices[model];
}
//# sourceMappingURL=embeddings.js.map