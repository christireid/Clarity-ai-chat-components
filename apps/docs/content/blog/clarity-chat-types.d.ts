/**
 * Clarity Chat Blog - TypeScript Types Package
 *
 * A collection of TypeScript types and interfaces used throughout
 * the blog posts. Copy these into your project as a starting point.
 *
 * @license MIT
 * @see https://claritychat.dev/docs
 */
/**
 * Message status for tracking send/receive lifecycle
 */
export type MessageStatus = 'pending' | 'sending' | 'sent' | 'streaming' | 'failed';
/**
 * Core message interface for chat applications
 * Used in: Posts 9, 11, 12
 */
export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    status: MessageStatus;
    timestamp: Date;
    error?: string;
    metadata?: MessageMetadata;
}
/**
 * Optional metadata attached to messages
 */
export interface MessageMetadata {
    tokens?: number;
    model?: string;
    latency?: number;
    cached?: boolean;
    cost?: number;
}
/**
 * Configuration for streaming responses
 * Used in: Posts 7, 9
 */
export interface StreamConfig {
    onToken?: (token: string) => void;
    onComplete?: (fullResponse: string) => void;
    onError?: (error: Error) => void;
    signal?: AbortSignal;
}
/**
 * SSE event structure
 * Used in: Post 7
 */
export interface SSEEvent {
    event?: string;
    data: string;
    id?: string;
    retry?: number;
}
/**
 * Stage configuration for realistic typing indicators
 * Used in: Post 1
 */
export interface TypingStage {
    duration: number;
    label: string;
}
/**
 * Configuration for realistic typing simulation
 * Used in: Post 1
 */
export interface RealisticTypingConfig {
    minDelay: number;
    maxDelay: number;
    stages: TypingStage[];
}
/**
 * Progress indicator state
 * Used in: Post 2
 */
export interface ProgressState {
    stage: 'idle' | 'thinking' | 'generating' | 'complete';
    progress?: number;
    label?: string;
}
/**
 * Result of token counting operation
 * Used in: Posts 8, 10
 */
export interface TokenResult {
    count: number;
    model: string;
    truncated: boolean;
    originalLength?: number;
}
/**
 * Token counter component props
 * Used in: Post 8
 */
export interface TokenCounterProps {
    current: number;
    max: number;
    warningThreshold?: number;
    onPrune?: () => void;
}
/**
 * Model configuration for cost optimization
 * Used in: Posts 13, 15
 */
export interface ModelConfig {
    model: string;
    maxTokens: number;
    costPer1kInput: number;
    costPer1kOutput: number;
}
/**
 * Cost tracking for API calls
 * Used in: Posts 13, 16
 */
export interface CostTracker {
    inputTokens: number;
    outputTokens: number;
    model: string;
    estimatedCost: number;
    cached?: boolean;
}
/**
 * Configuration for retry logic
 * Used in: Post 11
 */
export interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    retryableStatuses: number[];
}
/**
 * Result of a retryable operation
 * Used in: Post 11
 */
export interface RetryResult<T> {
    success: boolean;
    data?: T;
    error?: Error;
    attempts: number;
    totalTime: number;
}
/**
 * Classified error for handling
 * Used in: Posts 5, 11
 */
export interface ClassifiedError {
    type: 'network' | 'rate_limit' | 'auth' | 'server' | 'client' | 'unknown';
    message: string;
    retryable: boolean;
    retryAfter?: number;
    originalError?: Error;
}
/**
 * Document chunk for RAG systems
 * Used in: Post 17
 */
export interface Chunk {
    id: string;
    content: string;
    embedding?: number[];
    metadata: ChunkMetadata;
}
/**
 * Metadata for document chunks
 * Used in: Post 17
 */
export interface ChunkMetadata {
    documentId: string;
    documentTitle?: string;
    section?: string;
    pageNumber?: number;
    charStart: number;
    charEnd: number;
}
/**
 * Hierarchical chunk with parent-child relationships
 * Used in: Post 17
 */
export interface HierarchicalChunk {
    id: string;
    content: string;
    level: 'document' | 'section' | 'paragraph';
    parentId?: string;
    summary?: string;
    embedding: number[];
}
/**
 * Result from retrieval operation
 * Used in: Post 17
 */
export interface RetrievalResult {
    chunk: Chunk;
    score: number;
    source?: string;
}
/**
 * Configuration for hybrid retrieval
 * Used in: Post 17
 */
export interface RetrievalConfig {
    vectorWeight: number;
    keywordWeight: number;
    initialK: number;
    finalK: number;
    minScore: number;
}
/**
 * Trace information for RAG debugging
 * Used in: Post 17
 */
export interface RAGTrace {
    query: string;
    queryEmbedding: number[];
    retrievedChunks: {
        id: string;
        content: string;
        score: number;
        source: string;
    }[];
    contextSentToLLM: string;
    llmResponse: string;
    totalLatency: number;
    retrievalLatency: number;
    generationLatency: number;
    timestamp: Date;
}
/**
 * Tool definition for function calling
 * Used in: Post 18
 */
export interface ToolDefinition {
    name: string;
    description: string;
    parameters: {
        type: 'object';
        properties: Record<string, {
            type: string;
            description: string;
            enum?: string[];
        }>;
        required: string[];
    };
}
/**
 * Tool call from the model
 * Used in: Post 18
 */
export interface ToolCall {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
    };
}
/**
 * Pending action awaiting confirmation
 * Used in: Post 18
 */
export interface PendingAction {
    id: string;
    toolName: string;
    args: Record<string, unknown>;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
    requiresConfirmation: boolean;
}
/**
 * Result of tool execution
 * Used in: Post 18
 */
export interface ToolResult {
    toolCallId: string;
    success: boolean;
    result?: unknown;
    error?: string;
}
/**
 * Memory entry for persistent context
 * Used in: Post 20
 */
export interface MemoryEntry {
    id: string;
    userId: string;
    type: 'fact' | 'preference' | 'context' | 'summary';
    content: string;
    embedding?: number[];
    confidence: number;
    createdAt: Date;
    lastAccessed: Date;
    accessCount: number;
}
/**
 * User pattern tracking
 * Used in: Post 20
 */
export interface UserPattern {
    userId: string;
    pattern: string;
    count: number;
    lastSeen: Date;
}
/**
 * Conversation summary for memory
 * Used in: Post 20
 */
export interface ConversationSummary {
    id: string;
    conversationId: string;
    summary: string;
    keyTopics: string[];
    participants: string[];
    messageCount: number;
    createdAt: Date;
}
/**
 * Security event for logging
 * Used in: Post 19
 */
export interface SecurityEvent {
    id: string;
    timestamp: Date;
    type: 'injection_attempt' | 'rate_limit' | 'permission_denied' | 'suspicious_output';
    severity: 'low' | 'medium' | 'high' | 'critical';
    userId?: string;
    input?: string;
    details: Record<string, unknown>;
}
/**
 * Input validation result
 * Used in: Post 19
 */
export interface ValidationResult {
    valid: boolean;
    sanitized: string;
    flags: string[];
    riskScore: number;
}
/**
 * Permission check result
 * Used in: Post 19
 */
export interface PermissionResult {
    allowed: boolean;
    reason?: string;
    requiredPermissions?: string[];
}
/**
 * Chat session analytics
 * Used in: Post 24
 */
export interface SessionAnalytics {
    sessionId: string;
    userId?: string;
    startTime: Date;
    endTime?: Date;
    messageCount: number;
    avgResponseTime: number;
    errorCount: number;
    satisfactionScore?: number;
}
/**
 * Message-level analytics
 * Used in: Post 24
 */
export interface MessageAnalytics {
    messageId: string;
    sessionId: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    tokenCount: number;
    latency?: number;
    model?: string;
    cost?: number;
    regenerated: boolean;
}
/**
 * Aggregate metrics for dashboard
 * Used in: Post 24
 */
export interface AggregateMetrics {
    period: 'hour' | 'day' | 'week' | 'month';
    totalSessions: number;
    totalMessages: number;
    avgSessionLength: number;
    avgResponseTime: number;
    errorRate: number;
    totalCost: number;
    topQueries: {
        query: string;
        count: number;
    }[];
}
/**
 * Chat input component props
 * Used in: Post 9
 */
export interface ChatInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
    placeholder?: string;
    maxLength?: number;
}
/**
 * Message bubble component props
 * Used in: Post 9
 */
export interface MessageBubbleProps {
    message: Message;
    isFocused?: boolean;
    onRetry?: () => void;
    onCopy?: () => void;
}
/**
 * Message list component props
 * Used in: Post 9
 */
export interface MessageListProps {
    messages: Message[];
    onRetry?: (id: string) => void;
    virtualized?: boolean;
}
/**
 * Thinking indicator component props
 * Used in: Post 1
 */
export interface ThinkingIndicatorProps {
    stage: string;
    progress?: number;
    animated?: boolean;
}
/**
 * Error display component props
 * Used in: Post 5
 */
export interface ErrorDisplayProps {
    error: ClassifiedError;
    onRetry?: () => void;
    onDismiss?: () => void;
}
/**
 * Generic async operation result
 */
export type AsyncResult<T, E = Error> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
/**
 * Pagination parameters
 */
export interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
/**
 * Return type for useMessages hook
 * Used in: Post 9
 */
export interface UseMessagesReturn {
    messages: Message[];
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => string;
    updateMessage: (id: string, updates: Partial<Message>) => void;
    removeMessage: (id: string) => void;
    clearMessages: () => void;
}
/**
 * Return type for useStreamingChat hook
 * Used in: Post 9
 */
export interface UseStreamingChatReturn {
    messages: Message[];
    status: 'idle' | 'streaming' | 'error';
    sendMessage: (content: string) => Promise<void>;
    cancel: () => void;
    retry: (messageId: string) => void;
}
/**
 * Return type for useRealisticTyping hook
 * Used in: Post 1
 */
export interface UseRealisticTypingReturn {
    isTyping: boolean;
    currentStage: TypingStage | null;
    stageIndex: number;
    startTyping: (messageLength: number) => Promise<void>;
    stopTyping: () => void;
}
/**
 * Return type for useTokenCount hook
 * Used in: Post 10
 */
export interface UseTokenCountReturn {
    tokenCount: number;
    isOverLimit: boolean;
    percentage: number;
    estimate: (text: string) => number;
}
//# sourceMappingURL=clarity-chat-types.d.ts.map