'use client';
import * as React from 'react';
/**
 * IndexedDB hook for large data persistence
 *
 * Use this hook for storing large conversations (>5MB) or when you need
 * structured queries. Falls back to localStorage for smaller data or
 * when IndexedDB is unavailable.
 *
 * Features:
 * - Automatic database initialization
 * - Type-safe operations
 * - Error handling
 * - Loading states
 * - Fallback to localStorage
 *
 * @example
 * ```tsx
 * const { data, save, load, isLoading } = useIndexedDB<Message[]>({
 *   dbName: 'clarity-chat',
 *   version: 1,
 *   stores: [{
 *     name: 'conversations',
 *     keyPath: 'id',
 *     indexes: [{ name: 'createdAt', keyPath: 'createdAt' }]
 *   }]
 * }, 'conversations', 'conversation-123')
 * ```
 */
export function useIndexedDB(config, storeName, key) {
    const [data, setData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [isAvailable, setIsAvailable] = React.useState(false);
    const dbRef = React.useRef(null);
    // Check IndexedDB availability
    React.useEffect(() => {
        setIsAvailable(typeof window !== 'undefined' &&
            'indexedDB' in window &&
            window.indexedDB !== null);
    }, []);
    // Initialize database
    React.useEffect(() => {
        if (!isAvailable || !key)
            return;
        const initDB = async () => {
            try {
                const db = await openDatabase(config);
                dbRef.current = db;
            }
            catch (err) {
                setError(err);
                console.error('Failed to initialize IndexedDB:', err);
            }
        };
        initDB();
        return () => {
            if (dbRef.current) {
                dbRef.current.close();
                dbRef.current = null;
            }
        };
    }, [isAvailable, config, key]);
    // Load data on mount
    React.useEffect(() => {
        if (!isAvailable || !key || !dbRef.current)
            return;
        load();
    }, [isAvailable, key]);
    const openDatabase = (config) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(config.dbName, config.version);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Create stores
                config.stores.forEach((storeConfig) => {
                    if (!db.objectStoreNames.contains(storeConfig.name)) {
                        const store = db.createObjectStore(storeConfig.name, {
                            keyPath: storeConfig.keyPath,
                            autoIncrement: storeConfig.autoIncrement,
                        });
                        // Create indexes
                        storeConfig.indexes?.forEach((indexConfig) => {
                            store.createIndex(indexConfig.name, indexConfig.keyPath, {
                                unique: indexConfig.unique || false,
                            });
                        });
                    }
                });
            };
        });
    };
    const save = React.useCallback(async (value) => {
        if (!isAvailable || !key || !dbRef.current) {
            // Fallback to localStorage
            if (!key)
                throw new Error('Key is required for storage');
            try {
                localStorage.setItem(key, JSON.stringify(value));
                setData(value);
                return;
            }
            catch (err) {
                throw new Error('Storage quota exceeded. Consider using IndexedDB.');
            }
        }
        setIsLoading(true);
        setError(null);
        try {
            const transaction = dbRef.current.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            await new Promise((resolve, reject) => {
                const request = store.put({ id: key, data: value, updatedAt: new Date() });
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
            setData(value);
        }
        catch (err) {
            const error = err;
            setError(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, [isAvailable, key, storeName]);
    const load = React.useCallback(async () => {
        if (!isAvailable || !key) {
            // Fallback to localStorage
            if (!key)
                return null;
            try {
                const item = localStorage.getItem(key);
                if (!item)
                    return null;
                const parsed = JSON.parse(item);
                setData(parsed);
                return parsed;
            }
            catch (err) {
                setError(err);
                return null;
            }
        }
        if (!dbRef.current)
            return null;
        setIsLoading(true);
        setError(null);
        try {
            const transaction = dbRef.current.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const result = await new Promise((resolve, reject) => {
                const request = store.get(key);
                request.onsuccess = () => {
                    const record = request.result;
                    resolve(record ? record.data : null);
                };
                request.onerror = () => reject(request.error);
            });
            setData(result);
            return result;
        }
        catch (err) {
            const error = err;
            setError(error);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, [isAvailable, key, storeName]);
    const remove = React.useCallback(async () => {
        if (!isAvailable || !key) {
            // Fallback to localStorage
            if (!key)
                return;
            localStorage.removeItem(key);
            setData(null);
            return;
        }
        if (!dbRef.current)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const transaction = dbRef.current.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            await new Promise((resolve, reject) => {
                const request = store.delete(key);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
            setData(null);
        }
        catch (err) {
            const error = err;
            setError(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, [isAvailable, key, storeName]);
    const clear = React.useCallback(async () => {
        if (!isAvailable) {
            // Fallback to localStorage
            if (key) {
                localStorage.removeItem(key);
            }
            else {
                localStorage.clear();
            }
            setData(null);
            return;
        }
        if (!dbRef.current)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const transaction = dbRef.current.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            await new Promise((resolve, reject) => {
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
            setData(null);
        }
        catch (err) {
            const error = err;
            setError(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, [isAvailable, storeName, key]);
    return {
        data,
        isLoading,
        error,
        save,
        load,
        remove,
        clear,
        isAvailable,
    };
}
export function useConversationStorage(options = {}) {
    const { maxMessages = 1000, chunkSize = 100, autoCleanup = false, maxAgeDays = 30, } = options;
    const dbConfig = React.useMemo(() => ({
        dbName: 'clarity-chat-conversations',
        version: 1,
        stores: [
            {
                name: 'conversations',
                keyPath: 'id',
                indexes: [
                    { name: 'createdAt', keyPath: 'createdAt' },
                    { name: 'updatedAt', keyPath: 'updatedAt' },
                    { name: 'messageCount', keyPath: 'messageCount' },
                ],
            },
            {
                name: 'messages',
                keyPath: 'id',
                indexes: [
                    { name: 'conversationId', keyPath: 'conversationId' },
                    { name: 'createdAt', keyPath: 'createdAt' },
                ],
            },
        ],
    }), []);
    const [isAvailable, setIsAvailable] = React.useState(false);
    const dbRef = React.useRef(null);
    React.useEffect(() => {
        setIsAvailable(typeof window !== 'undefined' &&
            'indexedDB' in window &&
            window.indexedDB !== null);
    }, []);
    React.useEffect(() => {
        if (!isAvailable)
            return;
        const initDB = async () => {
            try {
                const request = indexedDB.open(dbConfig.dbName, dbConfig.version);
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    // Create conversations store
                    if (!db.objectStoreNames.contains('conversations')) {
                        const store = db.createObjectStore('conversations', { keyPath: 'id' });
                        store.createIndex('createdAt', 'createdAt');
                        store.createIndex('updatedAt', 'updatedAt');
                        store.createIndex('messageCount', 'messageCount');
                    }
                    // Create messages store
                    if (!db.objectStoreNames.contains('messages')) {
                        const store = db.createObjectStore('messages', { keyPath: 'id' });
                        store.createIndex('conversationId', 'conversationId');
                        store.createIndex('createdAt', 'createdAt');
                    }
                };
                request.onsuccess = () => {
                    dbRef.current = request.result;
                };
            }
            catch (err) {
                console.error('Failed to initialize conversation storage:', err);
            }
        };
        initDB();
        // Auto-cleanup if enabled
        if (autoCleanup && dbRef.current) {
            cleanupOldConversations(maxAgeDays);
        }
        return () => {
            if (dbRef.current) {
                dbRef.current.close();
            }
        };
    }, [isAvailable, autoCleanup, maxAgeDays]);
    const saveConversation = React.useCallback(async (conversationId, messages) => {
        if (!dbRef.current) {
            // Fallback to localStorage
            try {
                localStorage.setItem(`conversation-${conversationId}`, JSON.stringify(messages));
            }
            catch (err) {
                throw new Error('Storage quota exceeded. Consider using IndexedDB.');
            }
            return;
        }
        const transaction = dbRef.current.transaction(['conversations', 'messages'], 'readwrite');
        const convStore = transaction.objectStore('conversations');
        const msgStore = transaction.objectStore('messages');
        // Save conversation metadata
        await new Promise((resolve, reject) => {
            const request = convStore.put({
                id: conversationId,
                messageCount: messages.length,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
        // Save messages (chunked if needed)
        if (messages.length > maxMessages) {
            // Chunk messages for efficient storage
            for (let i = 0; i < messages.length; i += chunkSize) {
                const chunk = messages.slice(i, i + chunkSize);
                await Promise.all(chunk.map((msg) => new Promise((resolve, reject) => {
                    const request = msgStore.put({
                        ...msg,
                        conversationId,
                        chunkIndex: Math.floor(i / chunkSize),
                    });
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                })));
            }
        }
        else {
            // Save all messages directly
            await Promise.all(messages.map((msg) => new Promise((resolve, reject) => {
                const request = msgStore.put({
                    ...msg,
                    conversationId,
                });
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            })));
        }
    }, [maxMessages, chunkSize]);
    const loadConversation = React.useCallback(async (conversationId) => {
        if (!dbRef.current) {
            // Fallback to localStorage
            const item = localStorage.getItem(`conversation-${conversationId}`);
            return item ? JSON.parse(item) : null;
        }
        const transaction = dbRef.current.transaction(['messages'], 'readonly');
        const store = transaction.objectStore('messages');
        const index = store.index('conversationId');
        return new Promise((resolve, reject) => {
            const request = index.getAll(conversationId);
            request.onsuccess = () => {
                const messages = request.result;
                // Sort by createdAt and remove chunk metadata
                const sorted = messages
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .map(({ chunkIndex, conversationId: _, ...msg }) => msg);
                resolve(sorted);
            };
            request.onerror = () => reject(request.error);
        });
    }, []);
    const deleteConversation = React.useCallback(async (conversationId) => {
        if (!dbRef.current) {
            localStorage.removeItem(`conversation-${conversationId}`);
            return;
        }
        const transaction = dbRef.current.transaction(['conversations', 'messages'], 'readwrite');
        const convStore = transaction.objectStore('conversations');
        const msgStore = transaction.objectStore('messages');
        const index = msgStore.index('conversationId');
        // Delete conversation metadata
        await new Promise((resolve, reject) => {
            const request = convStore.delete(conversationId);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
        // Delete all messages
        const messages = await new Promise((resolve, reject) => {
            const request = index.getAll(conversationId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        await Promise.all(messages.map((msg) => new Promise((resolve, reject) => {
            const request = msgStore.delete(msg.id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        })));
    }, []);
    const listConversations = React.useCallback(async () => {
        if (!dbRef.current) {
            // Fallback: get from localStorage
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('conversation-')) {
                    keys.push(key.replace('conversation-', ''));
                }
            }
            return keys;
        }
        const transaction = dbRef.current.transaction(['conversations'], 'readonly');
        const store = transaction.objectStore('conversations');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const conversations = request.result;
                resolve(conversations.map((c) => c.id));
            };
            request.onerror = () => reject(request.error);
        });
    }, []);
    const getConversationMetadata = React.useCallback(async (conversationId) => {
        if (!dbRef.current)
            return null;
        const transaction = dbRef.current.transaction(['conversations'], 'readonly');
        const store = transaction.objectStore('conversations');
        return new Promise((resolve, reject) => {
            const request = store.get(conversationId);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }, []);
    const clearAll = React.useCallback(async () => {
        if (!dbRef.current) {
            localStorage.clear();
            return;
        }
        const transaction = dbRef.current.transaction(['conversations', 'messages'], 'readwrite');
        const convStore = transaction.objectStore('conversations');
        const msgStore = transaction.objectStore('messages');
        await Promise.all([
            new Promise((resolve, reject) => {
                const request = convStore.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            }),
            new Promise((resolve, reject) => {
                const request = msgStore.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            }),
        ]);
    }, []);
    const cleanupOldConversations = React.useCallback(async (maxAgeDays) => {
        if (!dbRef.current)
            return;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);
        const transaction = dbRef.current.transaction(['conversations'], 'readonly');
        const store = transaction.objectStore('conversations');
        const index = store.index('updatedAt');
        const range = IDBKeyRange.upperBound(cutoffDate.getTime());
        const conversations = await new Promise((resolve, reject) => {
            const request = index.getAll(range);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        // Delete old conversations
        await Promise.all(conversations.map((conv) => deleteConversation(conv.id)));
    }, []);
    return {
        saveConversation,
        loadConversation,
        deleteConversation,
        listConversations,
        getConversationMetadata,
        clearAll,
        isAvailable,
    };
}
//# sourceMappingURL=use-indexed-db.js.map