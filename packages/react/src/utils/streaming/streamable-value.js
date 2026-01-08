/**
 * StreamableValue utilities - Vercel AI SDK compatible
 *
 * Provides utilities for streaming complex data structures and UI components
 * that can be progressively rendered on the client.
 */
/**
 * Create a streamable value that can be updated incrementally
 */
export function createStreamableValue(initialValue) {
    let currentValue = initialValue;
    const listeners = new Set();
    let isDone = false;
    return {
        get value() {
            return currentValue;
        },
        update(newValue) {
            if (isDone) {
                console.warn('StreamableValue: Cannot update after done() is called');
                return;
            }
            currentValue = newValue;
            listeners.forEach((listener) => listener(newValue));
        },
        done() {
            isDone = true;
            listeners.clear();
        },
    };
}
/**
 * Read a streamable value from a stream
 */
export async function readStreamableValue(stream, onUpdate) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalValue;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                if (!line.trim())
                    continue;
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]')
                        break;
                    try {
                        const parsed = JSON.parse(data);
                        // Handle streamable value format
                        if (parsed.type === 'streamable-value') {
                            finalValue = parsed.value;
                            onUpdate?.(parsed.value);
                        }
                        else if (parsed.value !== undefined) {
                            finalValue = parsed.value;
                            onUpdate?.(parsed.value);
                        }
                    }
                    catch {
                        // Non-JSON, ignore
                    }
                }
            }
        }
    }
    finally {
        reader.releaseLock();
    }
    return finalValue;
}
/**
 * Read streamable UI components
 */
export async function readStreamableUI(stream, onUpdate) {
    // This would integrate with React Server Components in a Next.js context
    // For now, we'll return a promise that resolves with the final UI
    return readStreamableValue(stream, onUpdate);
}
/**
 * Transform a stream into streamable values
 */
export function createStreamableValueTransformer(onValue) {
    const encoder = new TextEncoder();
    return new TransformStream({
        transform(chunk, controller) {
            const decoder = new TextDecoder();
            const text = decoder.decode(chunk, { stream: true });
            // Parse and emit streamable values
            const lines = text.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]')
                        continue;
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.type === 'streamable-value' || parsed.value !== undefined) {
                            onValue(parsed.value);
                        }
                    }
                    catch {
                        // Not JSON, pass through
                    }
                }
            }
            // Pass through the original chunk
            controller.enqueue(chunk);
        },
    });
}
//# sourceMappingURL=streamable-value.js.map