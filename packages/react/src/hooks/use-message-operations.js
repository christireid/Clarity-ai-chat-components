import * as React from 'react';
/**
 * Generate unique ID
 */
function generateId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Production-ready Message Operations hook for advanced chat features.
 *
 * **Features:**
 * - Message editing with version history
 * - Message regeneration (resend to AI)
 * - Conversation branching/forking
 * - Undo/redo operations
 * - Message deletion
 * - Branch switching
 * - Context preservation
 *
 * **Use Cases:**
 * - Allow users to edit their messages
 * - Regenerate AI responses with same context
 * - Create alternative conversation paths
 * - Undo mistakes
 * - Delete unwanted messages
 *
 * @example
 * ```tsx
 * // Basic message operations
 * const {
 *   messages,
 *   addMessage,
 *   editMessage,
 *   deleteMessage,
 *   undo,
 *   canUndo,
 * } = useMessageOperations({
 *   onEdit: (id, content) => {
 *     console.log('Message edited:', id, content)
 *   },
 * })
 *
 * // Add messages
 * const msgId = addMessage({
 *   role: 'user',
 *   content: 'Hello!',
 * })
 *
 * // Edit message
 * editMessage(msgId, 'Hi there!')
 *
 * // Undo if needed
 * if (canUndo) {
 *   undo()
 * }
 *
 * // Regenerate AI response
 * const {
 *   regenerateMessage,
 *   onRegenerate,
 * } = useMessageOperations({
 *   onRegenerate: async (messageId) => {
 *     const context = getMessagesUpTo(messageId)
 *     const response = await sendToAI(context)
 *     // Replace old message with new response
 *   },
 * })
 *
 * // Branch conversation
 * const {
 *   branchConversation,
 *   getBranches,
 *   switchToBranch,
 * } = useMessageOperations({
 *   onBranch: (branchId, parentId) => {
 *     console.log('Created branch:', branchId)
 *   },
 * })
 *
 * // Create branch from message
 * const branchId = branchConversation(messageId)
 *
 * // List all branches
 * const branches = getBranches()
 *
 * // Switch between branches
 * switchToBranch(branchId)
 * ```
 */
export function useMessageOperations(options = {}) {
    const { initialMessages = [], maxHistorySize = 50, onEdit, onRegenerate, onBranch, onDelete, } = options;
    const [messages, setMessages] = React.useState(initialMessages.map((msg) => ({
        ...msg,
        id: msg.id || generateId(),
        timestamp: msg.timestamp || Date.now(),
        branchId: msg.branchId || 'main',
    })));
    const [currentBranchId, setCurrentBranchId] = React.useState('main');
    const [history, setHistory] = React.useState([]);
    const [redoStack, setRedoStack] = React.useState([]);
    const canUndo = history.length > 0;
    const canRedo = redoStack.length > 0;
    /**
     * Add operation to history
     */
    const addToHistory = React.useCallback((operation) => {
        setHistory((prev) => {
            const newHistory = [...prev, operation];
            // Limit history size
            if (newHistory.length > maxHistorySize) {
                return newHistory.slice(-maxHistorySize);
            }
            return newHistory;
        });
        // Clear redo stack when new operation is performed
        setRedoStack([]);
    }, [maxHistorySize]);
    /**
     * Add new message
     */
    const addMessage = React.useCallback((message) => {
        const id = generateId();
        const newMessage = {
            ...message,
            id,
            timestamp: Date.now(),
            branchId: message.branchId || currentBranchId,
        };
        setMessages((prev) => [...prev, newMessage]);
        addToHistory({
            type: 'add',
            messageId: id,
            timestamp: Date.now(),
            previousState: newMessage, // Store the message for redo
        });
        return id;
    }, [currentBranchId, addToHistory]);
    /**
     * Edit message content
     */
    const editMessage = React.useCallback((messageId, newContent) => {
        setMessages((prev) => {
            const index = prev.findIndex((m) => m.id === messageId);
            if (index === -1)
                return prev;
            const oldMessage = prev[index];
            const updatedMessage = {
                ...oldMessage,
                content: newContent,
                originalContent: oldMessage.originalContent || oldMessage.content,
                version: (oldMessage.version || 0) + 1,
                isEditing: false,
            };
            const newMessages = [...prev];
            newMessages[index] = updatedMessage;
            addToHistory({
                type: 'edit',
                messageId,
                timestamp: Date.now(),
                previousState: oldMessage,
            });
            onEdit?.(messageId, newContent);
            return newMessages;
        });
    }, [onEdit, addToHistory]);
    /**
     * Start editing mode
     */
    const startEditing = React.useCallback((messageId) => {
        setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, isEditing: true } : m));
    }, []);
    /**
     * Cancel editing mode
     */
    const cancelEditing = React.useCallback((messageId) => {
        setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, isEditing: false } : m));
    }, []);
    /**
     * Regenerate message (for assistant messages)
     */
    const regenerateMessage = React.useCallback((messageId) => {
        const message = messages.find((m) => m.id === messageId);
        if (!message)
            return;
        addToHistory({
            type: 'regenerate',
            messageId,
            timestamp: Date.now(),
            previousState: message,
        });
        onRegenerate?.(messageId);
    }, [messages, onRegenerate, addToHistory]);
    /**
     * Delete message
     */
    const deleteMessage = React.useCallback((messageId) => {
        setMessages((prev) => {
            const message = prev.find((m) => m.id === messageId);
            if (message) {
                addToHistory({
                    type: 'delete',
                    messageId,
                    timestamp: Date.now(),
                    previousState: message,
                });
            }
            onDelete?.(messageId);
            return prev.filter((m) => m.id !== messageId);
        });
    }, [onDelete, addToHistory]);
    /**
     * Branch conversation from message
     */
    const branchConversation = React.useCallback((messageId) => {
        const branchId = `branch_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        setMessages((prev) => {
            // Get all messages up to and including the branch point
            const index = prev.findIndex((m) => m.id === messageId);
            if (index === -1)
                return prev;
            // Create copies of messages for new branch
            const branchedMessages = prev.slice(0, index + 1).map((msg) => ({
                ...msg,
                branchId,
                parentId: msg.id === messageId ? msg.parentId : msg.id,
            }));
            return [...prev, ...branchedMessages];
        });
        setCurrentBranchId(branchId);
        onBranch?.(branchId, messageId);
        return branchId;
    }, [onBranch]);
    /**
     * Get messages up to specific point
     */
    const getMessagesUpTo = React.useCallback((messageId) => {
        const index = messages.findIndex((m) => m.id === messageId);
        if (index === -1)
            return [];
        return messages
            .slice(0, index + 1)
            .filter((m) => m.branchId === currentBranchId);
    }, [messages, currentBranchId]);
    /**
     * Get all branches
     */
    const getBranches = React.useCallback(() => {
        const branches = new Map();
        messages.forEach((msg) => {
            const branchId = msg.branchId || 'main';
            if (!branches.has(branchId)) {
                branches.set(branchId, []);
            }
            branches.get(branchId).push(msg);
        });
        return branches;
    }, [messages]);
    /**
     * Switch to different branch
     */
    const switchToBranch = React.useCallback((branchId) => {
        setCurrentBranchId(branchId);
    }, []);
    /**
     * Undo last operation
     */
    const undo = React.useCallback(() => {
        if (history.length === 0)
            return;
        const lastOperation = history[history.length - 1];
        setHistory((prev) => prev.slice(0, -1));
        setRedoStack((prev) => [...prev, lastOperation]);
        // Reverse the operation
        switch (lastOperation.type) {
            case 'add':
                setMessages((prev) => prev.filter((m) => m.id !== lastOperation.messageId));
                break;
            case 'edit':
            case 'regenerate':
                if (lastOperation.previousState) {
                    setMessages((prev) => prev.map((m) => m.id === lastOperation.messageId ? lastOperation.previousState : m));
                }
                break;
            case 'delete':
                if (lastOperation.previousState) {
                    setMessages((prev) => [...prev, lastOperation.previousState]);
                }
                break;
        }
    }, [history]);
    /**
     * Redo last undone operation
     */
    const redo = React.useCallback(() => {
        if (redoStack.length === 0)
            return;
        const operation = redoStack[redoStack.length - 1];
        setRedoStack((prev) => prev.slice(0, -1));
        setHistory((prev) => [...prev, operation]);
        // Re-apply the operation
        switch (operation.type) {
            case 'add':
                if (operation.previousState) {
                    setMessages((prev) => [...prev, operation.previousState]);
                }
                break;
            case 'delete':
                setMessages((prev) => prev.filter((m) => m.id !== operation.messageId));
                break;
        }
    }, [redoStack]);
    /**
     * Clear all messages
     */
    const clear = React.useCallback(() => {
        setMessages([]);
        setHistory([]);
        setRedoStack([]);
        setCurrentBranchId('main');
    }, []);
    return {
        messages: messages.filter((m) => m.branchId === currentBranchId),
        addMessage,
        editMessage,
        startEditing,
        cancelEditing,
        regenerateMessage,
        deleteMessage,
        branchConversation,
        getMessagesUpTo,
        getBranches,
        switchToBranch,
        undo,
        redo,
        canUndo,
        canRedo,
        currentBranchId,
        clear,
    };
}
//# sourceMappingURL=use-message-operations.js.map