/**
 * Message with operations metadata
 */
export interface MessageWithOperations {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    /** Parent message ID for branching */
    parentId?: string;
    /** Branch ID for conversation forking */
    branchId?: string;
    /** Whether message is currently being edited */
    isEditing?: boolean;
    /** Original content before edit */
    originalContent?: string;
    /** Version number for edits */
    version?: number;
}
/**
 * Message operation history entry
 */
export interface MessageOperation {
    type: 'add' | 'edit' | 'delete' | 'regenerate' | 'branch';
    messageId: string;
    timestamp: number;
    previousState?: MessageWithOperations;
}
/**
 * Message operations options
 */
export interface UseMessageOperationsOptions {
    /** Initial messages */
    initialMessages?: MessageWithOperations[];
    /** Maximum undo history size (default: 50) */
    maxHistorySize?: number;
    /** Callback when message is edited */
    onEdit?: (messageId: string, newContent: string) => void;
    /** Callback when message is regenerated */
    onRegenerate?: (messageId: string) => void;
    /** Callback when conversation is branched */
    onBranch?: (branchId: string, parentMessageId: string) => void;
    /** Callback when message is deleted */
    onDelete?: (messageId: string) => void;
}
/**
 * Message operations return type
 */
export interface UseMessageOperationsReturn {
    /** All messages */
    messages: MessageWithOperations[];
    /** Add new message */
    addMessage: (message: Omit<MessageWithOperations, 'id' | 'timestamp'>) => string;
    /** Edit message content */
    editMessage: (messageId: string, newContent: string) => void;
    /** Start editing mode for message */
    startEditing: (messageId: string) => void;
    /** Cancel editing mode */
    cancelEditing: (messageId: string) => void;
    /** Regenerate assistant message */
    regenerateMessage: (messageId: string) => void;
    /** Delete message */
    deleteMessage: (messageId: string) => void;
    /** Branch conversation from message */
    branchConversation: (messageId: string) => string;
    /** Get messages up to specific point */
    getMessagesUpTo: (messageId: string) => MessageWithOperations[];
    /** Get all branches */
    getBranches: () => Map<string, MessageWithOperations[]>;
    /** Switch to different branch */
    switchToBranch: (branchId: string) => void;
    /** Undo last operation */
    undo: () => void;
    /** Redo last undone operation */
    redo: () => void;
    /** Whether can undo */
    canUndo: boolean;
    /** Whether can redo */
    canRedo: boolean;
    /** Current branch ID */
    currentBranchId: string;
    /** Clear all messages */
    clear: () => void;
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
export declare function useMessageOperations(options?: UseMessageOperationsOptions): UseMessageOperationsReturn;
//# sourceMappingURL=use-message-operations.d.ts.map