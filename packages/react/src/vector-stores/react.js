import * as React from 'react';
import { createVectorStore } from './factory';
function normalizeQuery(input, options) {
    if (Array.isArray(input)) {
        return {
            vector: input,
            ...options,
        };
    }
    if (typeof input === 'string') {
        return {
            text: input,
            ...options,
        };
    }
    return input;
}
/**
 * React hook for working with vector stores in UI components.
 */
export function useVectorStore({ provider, config, autoInitialize = true, }) {
    const configKey = React.useMemo(() => JSON.stringify({ provider, config }), [provider, config]);
    const storeRef = React.useRef(null);
    const [status, setStatus] = React.useState('idle');
    const [error, setError] = React.useState(null);
    const createStoreInstance = React.useCallback(() => {
        try {
            const instance = createVectorStore({
                provider,
                ...config,
            });
            storeRef.current = instance;
            setStatus('idle');
            setError(null);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setStatus('error');
            setError(error);
            storeRef.current = null;
        }
    }, [configKey]);
    React.useEffect(() => {
        createStoreInstance();
    }, [createStoreInstance]);
    const ensureStore = React.useCallback(() => {
        if (!storeRef.current) {
            createStoreInstance();
        }
        if (!storeRef.current) {
            throw new Error('Vector store not initialized');
        }
        return storeRef.current;
    }, [createStoreInstance]);
    const initialize = React.useCallback(async () => {
        const store = ensureStore();
        if (!store.initialize) {
            setStatus('ready');
            return;
        }
        try {
            setStatus('initializing');
            await store.initialize();
            setStatus('ready');
            setError(null);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setStatus('error');
            setError(error);
        }
    }, [ensureStore]);
    React.useEffect(() => {
        if (autoInitialize) {
            // Fire-and-forget: initialization errors are handled via state
            initialize().catch(() => {
                // Error state is already set by initialize()
            });
        }
    }, [autoInitialize, initialize, configKey]);
    const search = React.useCallback(async (input, options) => {
        const store = ensureStore();
        const query = normalizeQuery(input, options);
        return store.query(query);
    }, [ensureStore]);
    const addDocuments = React.useCallback(async (documents, options) => {
        const store = ensureStore();
        await store.upsert(documents.map((doc) => ({
            id: doc.id,
            values: doc.embedding,
            metadata: {
                content: doc.content,
                ...doc.metadata,
            },
        })), options);
    }, [ensureStore]);
    const upsert = React.useCallback(async (vectors, options) => {
        const store = ensureStore();
        return store.upsert(vectors, options);
    }, [ensureStore]);
    const remove = React.useCallback(async (ids, namespace) => {
        const store = ensureStore();
        return store.delete(ids, namespace);
    }, [ensureStore]);
    const getStats = React.useCallback(async () => {
        const store = ensureStore();
        return store.getStats();
    }, [ensureStore]);
    const reset = React.useCallback(() => {
        storeRef.current = null;
        setStatus('idle');
        setError(null);
        createStoreInstance();
    }, [createStoreInstance]);
    return {
        store: storeRef.current,
        status,
        error,
        initialize,
        search,
        addDocuments,
        upsert,
        delete: remove,
        getStats,
        reset,
    };
}
//# sourceMappingURL=react.js.map