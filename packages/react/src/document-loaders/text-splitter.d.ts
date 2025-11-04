/**
 * Text Splitter
 *
 * Flexible text chunking with overlap and sentence preservation.
 * Works with any text, no external dependencies.
 */
import type { Document, DocumentChunk, ChunkingOptions, TextSplitter as ITextSplitter } from './types';
export declare class RecursiveTextSplitter implements ITextSplitter {
    private defaultOptions;
    split(text: string, options?: Partial<ChunkingOptions>): DocumentChunk[];
    splitDocuments(documents: Document[], options?: Partial<ChunkingOptions>): DocumentChunk[];
    private mergeChunks;
    private addOverlap;
    private getLastNChars;
    private getLength;
}
/**
 * Character-based text splitter (simple)
 */
export declare class CharacterTextSplitter implements ITextSplitter {
    split(text: string, options?: Partial<ChunkingOptions>): DocumentChunk[];
    splitDocuments(documents: Document[], options?: Partial<ChunkingOptions>): DocumentChunk[];
}
/**
 * Token-based text splitter
 */
export declare class TokenTextSplitter implements ITextSplitter {
    private tokenizer;
    constructor(tokenizer: (text: string) => string[]);
    split(text: string, options?: Partial<ChunkingOptions>): DocumentChunk[];
    splitDocuments(documents: Document[], options?: Partial<ChunkingOptions>): DocumentChunk[];
}
//# sourceMappingURL=text-splitter.d.ts.map