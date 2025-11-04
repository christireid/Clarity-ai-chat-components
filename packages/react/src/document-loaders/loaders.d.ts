/**
 * Document Loaders
 *
 * Flexible loaders for different file types.
 * Minimal dependencies - bring your own parsing library if needed.
 */
import type { Document, DocumentLoader } from './types';
/**
 * Text File Loader
 *
 * Simple loader for plain text files.
 */
export declare class TextLoader implements DocumentLoader {
    name: string;
    supportedTypes: string[];
    load(source: string | File | Blob): Promise<Document[]>;
    supports(type: string): boolean;
}
/**
 * JSON Loader
 *
 * Load JSON files and convert to text.
 */
export declare class JSONLoader implements DocumentLoader {
    name: string;
    supportedTypes: string[];
    load(source: string | File | Blob, options?: {
        /** JSON path to extract (e.g., "data.items") */
        jsonPath?: string;
        /** Whether to stringify the JSON */
        stringify?: boolean;
    }): Promise<Document[]>;
    supports(type: string): boolean;
}
/**
 * CSV Loader
 *
 * Load CSV files and convert to text.
 */
export declare class CSVLoader implements DocumentLoader {
    name: string;
    supportedTypes: string[];
    load(source: string | File | Blob, options?: {
        /** Column separator */
        separator?: string;
        /** Whether first row is header */
        hasHeader?: boolean;
    }): Promise<Document[]>;
    supports(type: string): boolean;
}
/**
 * HTML Loader
 *
 * Load HTML and extract text content.
 * Note: In browser, uses native DOM parsing. In Node, would need a library.
 */
export declare class HTMLLoader implements DocumentLoader {
    name: string;
    supportedTypes: string[];
    load(source: string | File | Blob, options?: {
        /** Selectors to exclude */
        exclude?: string[];
    }): Promise<Document[]>;
    supports(type: string): boolean;
}
/**
 * Markdown Loader
 */
export declare class MarkdownLoader implements DocumentLoader {
    name: string;
    supportedTypes: string[];
    load(source: string | File | Blob): Promise<Document[]>;
    supports(type: string): boolean;
}
/**
 * Loader Registry
 *
 * Manage multiple loaders and route to the correct one.
 */
export declare class LoaderRegistry {
    private loaders;
    /**
     * Add a custom loader
     */
    register(loader: DocumentLoader): void;
    /**
     * Get loader for file type
     */
    getLoader(type: string): DocumentLoader | undefined;
    /**
     * Load a document with automatic loader selection
     */
    load(source: string | File | Blob, options?: any): Promise<Document[]>;
    private getTypeFromName;
}
//# sourceMappingURL=loaders.d.ts.map