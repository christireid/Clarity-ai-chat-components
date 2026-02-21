/**
 * Content extraction utilities for page.tsx files
 * Extracts text content, code blocks, and metadata from React components
 */
import type { ExtractedPageContent, CodeBlock, PageMetadata } from '../types';
/**
 * Extract metadata from a page.tsx file
 */
export declare function extractMetadata(content: string): PageMetadata;
/**
 * Extract code blocks from JSX content
 * Handles escaped backticks within template literals
 */
export declare function extractCodeBlocks(content: string): CodeBlock[];
/**
 * Extract text content from JSX, removing React-specific syntax
 */
export declare function extractTextContent(content: string): string;
/**
 * Extract complete page content from a page.tsx file
 */
export declare function extractPageContent(filePath: string): Promise<ExtractedPageContent>;
/**
 * Convert extracted content to markdown format
 */
export declare function contentToMarkdown(extracted: ExtractedPageContent): string;
/**
 * Count tokens using GPT tokenizer for accurate token counting
 * Uses cl100k_base encoding (used by GPT-4, GPT-3.5-turbo)
 */
export declare function estimateTokens(text: string): number;
//# sourceMappingURL=content-extractor.d.ts.map