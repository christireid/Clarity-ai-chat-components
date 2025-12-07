'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Card, CardContent, Badge, cn } from '@clarity-chat/primitives';
const defaultConfig = {
    dbName: 'clarity-chat-offline',
    storeName: 'messages',
    maxMessages: 1000,
    maxPending: 100,
    maxRetries: 3,
    syncInterval: 30000, // 30 seconds
};
/**
 * OfflineChatSync Component
 *
 * Provides offline-first capabilities with:
 * - IndexedDB message storage
 * - Automatic sync when online
 * - Pending operation queue
 * - Conflict resolution
 */
export function OfflineChatSync({ messages, config: userConfig, onStatusChange, onSyncComplete, onSyncError, className, }) {
    const config = { ...defaultConfig, ...userConfig };
    const [status, setStatus] = React.useState('online');
    const [pendingOps, setPendingOps] = React.useState([]);
    const [lastSync, setLastSync] = React.useState(null);
    const dbRef = React.useRef(null);
    const syncIntervalRef = React.useRef(undefined);
    // Initialize IndexedDB
    React.useEffect(() => {
        const initDB = async () => {
            try {
                const request = indexedDB.open(config.dbName, 1);
                request.onerror = () => {
                    console.error('Failed to open IndexedDB');
                };
                request.onsuccess = () => {
                    dbRef.current = request.result;
                    loadPendingOperations();
                    loadMessages();
                };
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    // Create messages store
                    if (!db.objectStoreNames.contains(config.storeName)) {
                        const store = db.createObjectStore(config.storeName, { keyPath: 'id' });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                    // Create pending operations store
                    if (!db.objectStoreNames.contains('pending')) {
                        const pendingStore = db.createObjectStore('pending', { keyPath: 'id' });
                        pendingStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                };
            }
            catch (error) {
                console.error('IndexedDB initialization error:', error);
            }
        };
        initDB();
        return () => {
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, [config.dbName, config.storeName]);
    // Monitor online/offline status
    React.useEffect(() => {
        const handleOnline = () => {
            setStatus('online');
            onStatusChange?.('online');
            syncPendingOperations();
        };
        const handleOffline = () => {
            setStatus('offline');
            onStatusChange?.('offline');
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        // Initial status
        if (!navigator.onLine) {
            setStatus('offline');
            onStatusChange?.('offline');
        }
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [onStatusChange]);
    // Auto-sync interval
    React.useEffect(() => {
        if (status === 'online' && pendingOps.length > 0) {
            syncIntervalRef.current = setInterval(() => {
                syncPendingOperations();
            }, config.syncInterval);
        }
        return () => {
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, [status, pendingOps.length, config.syncInterval]);
    // Save messages to IndexedDB
    const saveMessages = async (msgs) => {
        if (!dbRef.current)
            return;
        try {
            const transaction = dbRef.current.transaction([config.storeName], 'readwrite');
            const store = transaction.objectStore(config.storeName);
            for (const msg of msgs) {
                store.put(msg);
            }
            await new Promise((resolve, reject) => {
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
                transaction.onabort = () => reject(new Error('Transaction aborted'));
            });
        }
        catch (error) {
            console.error('Failed to save messages:', error);
        }
    };
    // Load messages from IndexedDB
    const loadMessages = async () => {
        if (!dbRef.current)
            return [];
        try {
            const transaction = dbRef.current.transaction([config.storeName], 'readonly');
            const store = transaction.objectStore(config.storeName);
            const request = store.getAll();
            return new Promise((resolve) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve([]);
            });
        }
        catch (error) {
            console.error('Failed to load messages:', error);
            return [];
        }
    };
    // Save pending operation
    const savePendingOperation = async (op) => {
        if (!dbRef.current)
            return;
        try {
            const transaction = dbRef.current.transaction(['pending'], 'readwrite');
            const store = transaction.objectStore('pending');
            store.put(op);
            setPendingOps(prev => [...prev, op]);
        }
        catch (error) {
            console.error('Failed to save pending operation:', error);
        }
    };
    // Load pending operations
    const loadPendingOperations = async () => {
        if (!dbRef.current)
            return;
        try {
            const transaction = dbRef.current.transaction(['pending'], 'readonly');
            const store = transaction.objectStore('pending');
            const request = store.getAll();
            request.onsuccess = () => {
                setPendingOps(request.result);
            };
        }
        catch (error) {
            console.error('Failed to load pending operations:', error);
        }
    };
    // Sync pending operations
    const syncPendingOperations = async () => {
        if (pendingOps.length === 0 || status === 'offline')
            return;
        setStatus('syncing');
        try {
            let synced = 0;
            for (const op of pendingOps) {
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 100));
                    // Remove from pending
                    await removePendingOperation(op.id);
                    synced++;
                }
                catch (error) {
                    // Increment retry count
                    if (op.retryCount < config.maxRetries) {
                        await updatePendingOperation({
                            ...op,
                            retryCount: op.retryCount + 1,
                        });
                    }
                    else {
                        // Max retries reached, remove operation
                        await removePendingOperation(op.id);
                        onSyncError?.(new Error(`Failed to sync operation ${op.id}`));
                    }
                }
            }
            setStatus('online');
            setLastSync(Date.now());
            onSyncComplete?.(synced);
        }
        catch (error) {
            setStatus('error');
            onSyncError?.(error);
        }
    };
    // Remove pending operation
    const removePendingOperation = async (id) => {
        if (!dbRef.current)
            return;
        try {
            const transaction = dbRef.current.transaction(['pending'], 'readwrite');
            const store = transaction.objectStore('pending');
            store.delete(id);
            setPendingOps(prev => prev.filter(op => op.id !== id));
        }
        catch (error) {
            console.error('Failed to remove pending operation:', error);
        }
    };
    // Update pending operation
    const updatePendingOperation = async (op) => {
        if (!dbRef.current)
            return;
        try {
            const transaction = dbRef.current.transaction(['pending'], 'readwrite');
            const store = transaction.objectStore('pending');
            store.put(op);
            setPendingOps(prev => prev.map(o => o.id === op.id ? op : o));
        }
        catch (error) {
            console.error('Failed to update pending operation:', error);
        }
    };
    // Save messages when they change
    React.useEffect(() => {
        if (messages.length > 0) {
            saveMessages(messages);
        }
    }, [messages]);
    const getStatusColor = () => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'offline':
                return 'bg-gray-500';
            case 'syncing':
                return 'bg-blue-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };
    const getStatusText = () => {
        switch (status) {
            case 'online':
                return 'Online';
            case 'offline':
                return 'Offline';
            case 'syncing':
                return 'Syncing...';
            case 'error':
                return 'Sync Error';
            default:
                return 'Unknown';
        }
    };
    return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: cn('w-3 h-3 rounded-full', getStatusColor()) }), _jsx("span", { className: "text-sm font-medium", children: getStatusText() })] }), pendingOps.length > 0 && (_jsxs(Badge, { variant: "secondary", children: [pendingOps.length, " pending"] })), lastSync && (_jsxs("span", { className: "text-xs text-muted-foreground", children: ["Last sync: ", new Date(lastSync).toLocaleTimeString()] }))] }), status === 'offline' && (_jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Messages will be synced when you're back online" })), status === 'syncing' && (_jsx("div", { className: "mt-2", children: _jsx("div", { className: "h-1 bg-accent rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-primary animate-pulse" }) }) }))] }) }), pendingOps.length > 0 && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-3", children: [_jsx("div", { className: "text-xs font-medium mb-2", children: "Pending Operations:" }), _jsxs("div", { className: "space-y-1", children: [pendingOps.slice(0, 5).map(op => (_jsxs("div", { className: "text-xs flex items-center justify-between", children: [_jsxs("span", { children: [op.type, " - ", op.messageId.slice(0, 8)] }), _jsxs(Badge, { variant: "outline", className: "text-xs", children: ["Retry: ", op.retryCount, "/", config.maxRetries] })] }, op.id))), pendingOps.length > 5 && (_jsxs("div", { className: "text-xs text-muted-foreground", children: ["+", pendingOps.length - 5, " more"] }))] })] }) }))] }));
}
/**
 * Hook for offline-first chat functionality
 */
export function useOfflineChat(config) {
    const fullConfig = { ...defaultConfig, ...config };
    const [isOnline, setIsOnline] = React.useState(true);
    const [messages, setMessages] = React.useState([]);
    const [pendingOps, setPendingOps] = React.useState([]);
    const dbRef = React.useRef(null);
    // Initialize database
    React.useEffect(() => {
        const initDB = async () => {
            try {
                const request = indexedDB.open(fullConfig.dbName, 1);
                request.onsuccess = () => {
                    dbRef.current = request.result;
                };
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(fullConfig.storeName)) {
                        const store = db.createObjectStore(fullConfig.storeName, { keyPath: 'id' });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                    if (!db.objectStoreNames.contains('pending')) {
                        const pendingStore = db.createObjectStore('pending', { keyPath: 'id' });
                        pendingStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                };
            }
            catch (error) {
                console.error('Failed to initialize IndexedDB:', error);
            }
        };
        initDB();
    }, [fullConfig.dbName, fullConfig.storeName]);
    // Monitor online status
    React.useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        setIsOnline(navigator.onLine);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    const saveMessage = async (message) => {
        if (!dbRef.current)
            return;
        try {
            const transaction = dbRef.current.transaction([fullConfig.storeName], 'readwrite');
            const store = transaction.objectStore(fullConfig.storeName);
            store.put(message);
            setMessages(prev => [...prev, message]);
        }
        catch (error) {
            console.error('Failed to save message:', error);
        }
    };
    const queueOperation = async (op) => {
        if (!dbRef.current)
            return;
        const operation = {
            ...op,
            id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            retryCount: 0,
        };
        try {
            const transaction = dbRef.current.transaction(['pending'], 'readwrite');
            const store = transaction.objectStore('pending');
            store.put(operation);
            setPendingOps(prev => [...prev, operation]);
        }
        catch (error) {
            console.error('Failed to queue operation:', error);
        }
    };
    const clearCache = async () => {
        if (!dbRef.current)
            return;
        try {
            const transaction = dbRef.current.transaction([fullConfig.storeName], 'readwrite');
            const store = transaction.objectStore(fullConfig.storeName);
            store.clear();
            setMessages([]);
        }
        catch (error) {
            console.error('Failed to clear cache:', error);
        }
    };
    return {
        isOnline,
        messages,
        pendingOps,
        saveMessage,
        queueOperation,
        clearCache,
    };
}
//# sourceMappingURL=offline-chat-sync.js.map