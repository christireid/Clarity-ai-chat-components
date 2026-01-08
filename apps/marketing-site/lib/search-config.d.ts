export declare const SYNONYM_MAP: Record<string, string[]>;
export interface KnowledgeBaseChunk {
    title: string;
    content: string;
    sourcePath?: string;
}
export interface KnowledgeBase {
    chunks: KnowledgeBaseChunk[];
    documents?: KnowledgeBaseChunk[];
    lastUpdated?: string;
}
//# sourceMappingURL=search-config.d.ts.map