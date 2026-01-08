/**
 * Chat History with Undo/Redo
 *
 * Provides undo/redo functionality for chat messages with efficient
 * state management and keyboard shortcuts.
 *
 * @example
 * ```tsx
 * const {
 *   messages,
 *   addMessage,
 *   undo,
 *   redo,
 *   canUndo,
 *   canRedo,
 * } = useChatHistory({ maxHistory: 50 })
 *
 * // Add a message
 * addMessage({ role: 'user', content: 'Hello' })
 *
 * // Undo the last action
 * if (canUndo) undo()
 *
 * // Redo
 * if (canRedo) redo()
 * ```
 */
import * as React from 'react';
// SSR-safe platform detection
function getIsMac() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgentData = navigator.userAgentData;
    if (userAgentData?.platform) {
        return /macOS|iOS/i.test(userAgentData.platform);
    }
    return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
// ============================================
// Utilities
// ============================================
function generateId() {
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
function cloneMessages(messages) {
    return messages.map((m) => ({ ...m }));
}
// ============================================
// Hook
// ============================================
export function useChatHistory(options = {}) {
    const { maxHistory = 50, initialMessages = [], enableKeyboardShortcuts = true, onChange, onUndo, onRedo, } = options;
    // History stack (past states)
    const [history, setHistory] = React.useState([]);
    // Future stack (for redo)
    const [future, setFuture] = React.useState([]);
    // Current messages
    const [messages, setMessagesInternal] = React.useState(initialMessages.map((m) => ({
        ...m,
        id: m.id || generateId(),
        timestamp: m.timestamp || Date.now(),
    })));
    // Save current state to history
    const saveToHistory = React.useCallback(() => {
        setHistory((prev) => {
            const newHistory = [
                ...prev,
                { messages: cloneMessages(messages), timestamp: Date.now() },
            ];
            // Limit history size
            if (newHistory.length > maxHistory) {
                return newHistory.slice(-maxHistory);
            }
            return newHistory;
        });
        // Clear future on new action
        setFuture([]);
    }, [messages, maxHistory]);
    // Set messages and optionally save history
    const setMessages = React.useCallback((newMessages) => {
        saveToHistory();
        setMessagesInternal(newMessages);
        onChange?.(newMessages);
    }, [saveToHistory, onChange]);
    // Add a single message
    const addMessage = React.useCallback((message) => {
        saveToHistory();
        const newMessage = {
            ...message,
            id: message.id || generateId(),
            timestamp: Date.now(),
        };
        setMessagesInternal((prev) => {
            const updated = [...prev, newMessage];
            onChange?.(updated);
            return updated;
        });
    }, [saveToHistory, onChange]);
    // Add multiple messages
    const addMessages = React.useCallback((newMessages) => {
        if (newMessages.length === 0)
            return;
        saveToHistory();
        const messagesWithIds = newMessages.map((m) => ({
            ...m,
            id: m.id || generateId(),
            timestamp: Date.now(),
        }));
        setMessagesInternal((prev) => {
            const updated = [...prev, ...messagesWithIds];
            onChange?.(updated);
            return updated;
        });
    }, [saveToHistory, onChange]);
    // Update an existing message
    const updateMessage = React.useCallback((id, updates) => {
        saveToHistory();
        setMessagesInternal((prev) => {
            const updated = prev.map((m) => m.id === id ? { ...m, ...updates } : m);
            onChange?.(updated);
            return updated;
        });
    }, [saveToHistory, onChange]);
    // Remove a message
    const removeMessage = React.useCallback((id) => {
        saveToHistory();
        setMessagesInternal((prev) => {
            const updated = prev.filter((m) => m.id !== id);
            onChange?.(updated);
            return updated;
        });
    }, [saveToHistory, onChange]);
    // Remove last N messages
    const removeLastMessages = React.useCallback((count) => {
        if (count <= 0)
            return;
        saveToHistory();
        setMessagesInternal((prev) => {
            const updated = prev.slice(0, -count);
            onChange?.(updated);
            return updated;
        });
    }, [saveToHistory, onChange]);
    // Clear all messages
    const clearMessages = React.useCallback(() => {
        if (messages.length === 0)
            return;
        saveToHistory();
        setMessagesInternal([]);
        onChange?.([]);
    }, [messages.length, saveToHistory, onChange]);
    // Undo
    const undo = React.useCallback(() => {
        if (history.length === 0)
            return;
        const previousState = history[history.length - 1];
        const currentState = {
            messages: cloneMessages(messages),
            timestamp: Date.now(),
        };
        setHistory((prev) => prev.slice(0, -1));
        setFuture((prev) => [...prev, currentState]);
        setMessagesInternal(previousState.messages);
        onChange?.(previousState.messages);
        onUndo?.(messages, previousState.messages);
    }, [history, messages, onChange, onUndo]);
    // Redo
    const redo = React.useCallback(() => {
        if (future.length === 0)
            return;
        const nextState = future[future.length - 1];
        const currentState = {
            messages: cloneMessages(messages),
            timestamp: Date.now(),
        };
        setFuture((prev) => prev.slice(0, -1));
        setHistory((prev) => [...prev, currentState]);
        setMessagesInternal(nextState.messages);
        onChange?.(nextState.messages);
        onRedo?.(messages, nextState.messages);
    }, [future, messages, onChange, onRedo]);
    // Get message by ID
    const getMessage = React.useCallback((id) => messages.find((m) => m.id === id), [messages]);
    // Get last message
    const getLastMessage = React.useCallback(() => messages[messages.length - 1], [messages]);
    // Get last user message
    const getLastUserMessage = React.useCallback(() => [...messages].reverse().find((m) => m.role === 'user'), [messages]);
    // Reset history
    const resetHistory = React.useCallback(() => {
        setHistory([]);
        setFuture([]);
    }, []);
    // Keyboard shortcuts
    React.useEffect(() => {
        if (!enableKeyboardShortcuts)
            return;
        const handleKeyDown = (e) => {
            const modifier = getIsMac() ? e.metaKey : e.ctrlKey;
            if (modifier && e.key === 'z') {
                if (e.shiftKey) {
                    // Redo: Cmd/Ctrl+Shift+Z
                    e.preventDefault();
                    redo();
                }
                else {
                    // Undo: Cmd/Ctrl+Z
                    e.preventDefault();
                    undo();
                }
            }
            // Alternative redo: Cmd/Ctrl+Y
            if (modifier && e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enableKeyboardShortcuts, undo, redo]);
    return {
        messages,
        addMessage,
        addMessages,
        updateMessage,
        removeMessage,
        removeLastMessages,
        clearMessages,
        setMessages,
        undo,
        redo,
        canUndo: history.length > 0,
        canRedo: future.length > 0,
        undoSteps: history.length,
        redoSteps: future.length,
        getMessage,
        getLastMessage,
        getLastUserMessage,
        resetHistory,
    };
}
export default useChatHistory;
//# sourceMappingURL=use-chat-history.js.map