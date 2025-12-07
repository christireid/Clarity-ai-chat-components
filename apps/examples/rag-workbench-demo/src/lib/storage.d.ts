/**
 * In-memory document storage
 * Production should use a database (PostgreSQL, MongoDB, etc.)
 */
import type { Document } from '../types/document';
export declare function getDocuments(): Document[];
export declare function addDocument(document: Document): void;
export declare function removeDocument(documentId: string): boolean;
export declare function getDocumentById(documentId: string): Document | undefined;
//# sourceMappingURL=storage.d.ts.map