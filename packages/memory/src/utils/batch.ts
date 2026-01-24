/**
 * Batch Processing Utilities
 *
 * Efficient batching for bulk operations
 */

/**
 * Process items in batches
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (batch: T[]) => Promise<R[]>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await processor(batch)
    results.push(...batchResults)
  }

  return results
}

/**
 * Process items in parallel batches
 */
export async function parallelBatchProcess<T, R>(
  items: T[],
  processor: (batch: T[]) => Promise<R[]>,
  batchSize: number = 10,
  concurrency: number = 3
): Promise<R[]> {
  const batches: T[][] = []

  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }

  const results: R[] = []

  // Process batches with concurrency limit
  for (let i = 0; i < batches.length; i += concurrency) {
    const batchGroup = batches.slice(i, i + concurrency)
    const batchResults = await Promise.all(
      batchGroup.map((batch) => processor(batch))
    )
    results.push(...batchResults.flat())
  }

  return results
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }

  return chunks
}
