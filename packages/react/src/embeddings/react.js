/**
 * React hooks for embeddings
 */
import * as React from 'react';
import { createEmbeddingProvider } from './index';
/**
 * useEmbeddings - React hook for embeddings
 */
export function useEmbeddings(options) {
    const { provider, apiKey, model } = options;
    const embeddingProvider = React.useMemo(() => {
        if (!apiKey)
            return null;
        return createEmbeddingProvider({
            provider,
            apiKey,
            model,
        });
    }, [provider, apiKey, model]);
    const generate = React.useCallback(async (text) => {
        if (!embeddingProvider) {
            throw new Error('Embedding provider not initialized');
        }
        const response = await embeddingProvider.embed({ input: text });
        return Array.isArray(text) ? response.embeddings : response.embeddings[0] ?? [];
    }, [embeddingProvider]);
    return {
        generate,
        provider: embeddingProvider,
    };
}
//# sourceMappingURL=react.js.map