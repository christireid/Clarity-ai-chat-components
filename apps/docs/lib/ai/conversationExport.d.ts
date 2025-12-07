/**
 * Conversation Export
 *
 * Utilities for exporting chat conversations to various formats.
 * Supports markdown and JSON export with proper formatting.
 */
export interface ExportMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string;
    sources?: Array<{
        url: string;
        title: string;
        score?: number;
    }>;
}
export interface ExportMetadata {
    sessionId?: string;
    userId?: string;
    exportedAt: string;
    messageCount: number;
    model?: string;
    title?: string;
}
export interface ConversationExport {
    metadata: ExportMetadata;
    messages: ExportMessage[];
}
/**
 * Export conversation as markdown
 */
export declare function exportAsMarkdown(messages: ExportMessage[], metadata?: Partial<ExportMetadata>): string;
/**
 * Export conversation as JSON
 */
export declare function exportAsJSON(messages: ExportMessage[], metadata?: Partial<ExportMetadata>): string;
/**
 * Export conversation as plain text
 */
export declare function exportAsText(messages: ExportMessage[], metadata?: Partial<ExportMetadata>): string;
/**
 * Download conversation as a file
 */
export declare function downloadConversation(content: string, format: 'markdown' | 'json' | 'text', filename?: string): void;
/**
 * Copy conversation to clipboard
 */
export declare function copyToClipboard(content: string): Promise<boolean>;
/**
 * Get export statistics
 */
export declare function getExportStats(messages: ExportMessage[]): {
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    totalCharacters: number;
    estimatedTokens: number;
    sourcesCount: number;
    hasTimestamps: boolean;
};
//# sourceMappingURL=conversationExport.d.ts.map