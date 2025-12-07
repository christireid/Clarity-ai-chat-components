/**
 * Batch operation utilities
 * Process multiple items in parallel or sequentially
 */
import { getLogger } from './logger.js';
import { info, error } from './output.js';
const logger = getLogger('batch');
/**
 * Process items in batch
 */
export async function processBatch(options) {
    const { items, processor, parallel = false, concurrency = 5, onProgress, onError, } = options;
    const successful = [];
    const failed = [];
    if (parallel) {
        // Process in parallel with concurrency limit
        const chunks = [];
        for (let i = 0; i < items.length; i += concurrency) {
            chunks.push(items.slice(i, i + concurrency));
        }
        for (const chunk of chunks) {
            const results = await Promise.allSettled(chunk.map((item, index) => processor(item, index)));
            results.forEach((result, index) => {
                const item = chunk[index];
                if (result.status === 'fulfilled') {
                    successful.push(item);
                }
                else {
                    const err = result.reason instanceof Error
                        ? result.reason
                        : new Error(String(result.reason));
                    failed.push({ item, error: err });
                    if (onError) {
                        onError(item, err);
                    }
                    else {
                        logger.error(`Failed to process item: ${item}`, err);
                    }
                }
                if (onProgress) {
                    onProgress(successful.length + failed.length, items.length);
                }
            });
        }
    }
    else {
        // Process sequentially
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            try {
                await processor(item, i);
                successful.push(item);
            }
            catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                failed.push({ item, error });
                if (onError) {
                    onError(item, error);
                }
                else {
                    logger.error(`Failed to process item: ${item}`, error);
                }
            }
            if (onProgress) {
                onProgress(successful.length + failed.length, items.length);
            }
        }
    }
    return {
        successful,
        failed,
        total: items.length,
    };
}
/**
 * Batch add components
 */
export async function batchAddComponents(components, options = {}) {
    const { addCommand } = await import('../commands/add.js');
    info(`Adding ${components.length} components...`);
    return processBatch({
        items: components,
        processor: async (component) => {
            await addCommand(component, options);
        },
        parallel: false, // Sequential to avoid conflicts
        onProgress: (completed, total) => {
            info(`Progress: ${completed}/${total} components added`);
        },
        onError: (component, err) => {
            error(`Failed to add component: ${component}`);
        },
    });
}
//# sourceMappingURL=batch.js.map