/**
 * Batch Processing Utilities
 *
 * Efficient batching for bulk operations
 */
/**
 * Process items in batches
 */
export async function batchProcess(items, processor, batchSize = 10) {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await processor(batch);
        results.push(...batchResults);
    }
    return results;
}
/**
 * Process items in parallel batches
 */
export async function parallelBatchProcess(items, processor, batchSize = 10, concurrency = 3) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
    }
    const results = [];
    // Process batches with concurrency limit
    for (let i = 0; i < batches.length; i += concurrency) {
        const batchGroup = batches.slice(i, i + concurrency);
        const batchResults = await Promise.all(batchGroup.map(batch => processor(batch)));
        results.push(...batchResults.flat());
    }
    return results;
}
/**
 * Chunk array into smaller arrays
 */
export function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
//# sourceMappingURL=batch.js.map